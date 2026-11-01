import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {startBridge} from '../bridge/server.mjs';
import {bridgeClient} from '../bridge/client.mjs';

async function setup(){
 const bridge=await startBridge();
 const request=async(route,body,token=bridge.token)=>{
  const response=await fetch(bridge.url+route,{method:body===undefined?'GET':'POST',headers:{authorization:'Bearer '+token,'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});
  return {status:response.status,value:await response.json()};
 };
 const session=(await request('/v1/sessions',{})).value;
 // 전송 단위 검증의 가짜 확장 poll이다. 제품 실행 증거로 집계하지 않는다.
 const next=fetch(bridge.url+'/v1/extension/next',{headers:{authorization:'Bearer '+bridge.extensionToken}}).then(r=>r.json());
 for(let i=0;i<100;i++){
  if((await request('/v1/status')).value.connected)return {bridge,request,session,next,route:'/v1/sessions/'+session.id+'/'};
  await new Promise(r=>setTimeout(r,5));
 }
 await bridge.close();throw Error('Test poll did not connect');
}

test('REQ-C-RUNTIME-005: identical retries share one record and changed effective payload conflicts',async()=>{
 const {bridge,request,session,next,route}=await setup();
 try{
  const payload={requestId:'same',code:'console.log(1)'};
  assert.equal((await request(route+'js',payload)).status,202);await next;
  assert.equal((await request(route+'js',{...payload,timeoutMs:30000})).status,202);
  for(const [operation,body] of [['js',{...payload,code:'console.log(2)'}],['js',{...payload,timeoutMs:1000}],['reset',{requestId:'same'}]]){
   const result=await request(route+operation,body);assert.equal(result.status,409);assert.equal(result.value.code,'REQUEST_ID_CONFLICT');
  }
  assert.equal(bridge.requests.size,1);assert.equal(bridge.sessions.get(session.id).generation,1);
  const publicResult=(await request('/v1/requests/same')).value;assert(!Object.hasOwn(publicResult,'payloadDigest'));
  const other=(await request('/v1/sessions',{})).value;
  assert.equal((await request('/v1/sessions/'+other.id+'/js',payload)).status,409);
 }finally{await bridge.close()}
});

test('REQ-C-RUNTIME-005: reset retains tombstones and offline retries never require a new execution',async()=>{
 const {bridge,request,session,next,route}=await setup();const clock=Date.now;
 try{
  const payload={requestId:'old',code:'console.log(1)',timeoutMs:5000};await request(route+'js',payload);await next;
  await request(route+'reset',{requestId:'reset-once'});assert.equal(bridge.sessions.get(session.id).generation,2);
  Date.now=()=>clock()+30000;
  const retry=await request(route+'js',payload);assert.equal(retry.status,202);assert.equal(retry.value.status,'cancelled');
  assert.equal((await request(route+'js',{...payload,code:'console.log(2)'})).status,409);
  assert.equal((await request(route+'js',{code:'console.log(3)'})).status,503);
  assert.equal((await request(route+'reset',{requestId:'reset-once'})).status,202);
  assert.equal(bridge.sessions.get(session.id).generation,2);assert.equal(bridge.requests.size,2);
 }finally{Date.now=clock;await bridge.close()}
});

test('REQ-JS-002: invalid timeout, identifiers, code and body fail before queue or generation changes',async()=>{
 const {bridge,request,session,route}=await setup();
 try{
  for(const timeoutMs of ['100',true,null,0,-1,49,120001,100.5]){
   const result=await request(route+'js',{code:'console.log(1)',timeoutMs});assert.equal(result.status,400,JSON.stringify({timeoutMs,result}));
  }
  for(const requestId of ['',null,1,{},[]])assert.equal((await request(route+'js',{code:'console.log(1)',requestId})).status,400);
  for(const code of [null,1,{},'x'.repeat(65537)])assert.equal((await request(route+'js',{code})).status,400);
  for(const body of [null,[],true])assert.equal((await request(route+'reset',body)).status,400);
  assert.equal(bridge.requests.size,0);assert.equal(bridge.sessions.get(session.id).generation,1);
  for(const timeoutMs of [50,30000,120000])assert.equal((await request(route+'js',{code:'// boundary',timeoutMs})).status,202);
 }finally{await bridge.close()}
});

test('REQ-C-RUNTIME-005: Unicode and URL-reserved request IDs round trip without reading a prefix request',async()=>{
 const {bridge,request,session,next,route}=await setup();const client=bridgeClient(bridge.url,bridge.token);
 try{
  const ids=['job','job#part','job/a','한글','job?part','job%part','job%2Fa','.','..','a+b','a b','x\0y','é','e\u0301','한'.repeat(2000),'a'.repeat(20000),'\ud800','\udfff'];
  for(const [index,id] of ids.entries()){
   const polling=index===0?next:fetch(bridge.url+'/v1/extension/next',{headers:{authorization:'Bearer '+bridge.extensionToken}}).then(r=>r.json());
   assert.equal((await request(route+'js',{requestId:id,code:'console.log(1)'})).status,202);
   const command=await polling;assert.equal(command.requestId,id);
   const result={content:[{type:'text',text:id}]};
   assert.equal((await request('/v1/extension/result',{requestId:id,sessionId:session.id,generation:command.generation,result},bridge.extensionToken)).status,200);
   const returned=await client.wait(id);assert.equal(returned.requestId,id);assert.equal(returned.result.content[0].text,id);
   const bodyLookup=await request('/v1/requests',{requestId:id});assert.equal(bodyLookup.value.requestId,id);
   if(id.length<1000&&id.isWellFormed()){
    const query=await request('/v1/requests?'+new URLSearchParams({requestId:id}));assert.equal(query.value.requestId,id);
    if(!['.','..'].includes(id))assert.equal((await request('/v1/requests/'+encodeURIComponent(id))).value.requestId,id);
   }
  }
 }finally{await bridge.close()}
});

test('REQ-GUIDE-001/002: guide identifies the exact API and unsupported names without session effects or secrets',async()=>{
 const {bridge,request,session}=await setup();
 try{
  const before=[bridge.sessions.size,bridge.requests.size,bridge.sessions.get(session.id).generation];
  const guide=(await request('/v1/guide')).value;
  assert.deepEqual(guide.external,['guide','reset','js']);assert.equal(guide.api.internal.length,64);
  assert.equal(guide.execution,'extension-worker/QuickJS-WASM');assert.match(guide.version,/^\d+\.\d+\.\d+/);
  assert.match(guide.verificationScope,/기본|basic/);assert.equal((await request('/v1/guide?api=scope.snapshot')).value.api.name,'scope.snapshot');
  for(const name of ['does.not.exist','']){
   const result=await request('/v1/guide?api='+name);assert.equal(result.status,404);assert.equal(result.value.code,'UNKNOWN_API');
  }
  for(const token of ['wrong','']){
   const result=await request('/v1/guide',undefined,token);assert.equal(result.status,401);
   const body=JSON.stringify(result.value);assert(!body.includes(bridge.token));assert(!body.includes(bridge.extensionToken));assert(!body.includes('instructions'));
  }
  assert.equal((await fetch(bridge.url+'/v1/guide')).status,401);
  assert.deepEqual([bridge.sessions.size,bridge.requests.size,bridge.sessions.get(session.id).generation],before);
 }finally{await bridge.close()}
});

test('REQ-JS-002: UTF-8 code survives HTTP chunk boundaries and the 64 KiB bound is measured in bytes',async()=>{
 const {bridge,request,next,route}=await setup();
 try{
  const code='console.log("한🙂")',body=Buffer.from(JSON.stringify({code,requestId:'utf8'}));
  const split=body.indexOf(Buffer.from('한'))+1;
  const response=await new Promise((resolve,reject)=>{
   const req=http.request(bridge.url+route+'js',{method:'POST',headers:{authorization:'Bearer '+bridge.token,'Content-Type':'application/json'}},res=>{
    let text='';res.on('data',c=>text+=c);res.on('end',()=>resolve({status:res.statusCode,value:JSON.parse(text)}));
   });req.on('error',reject);req.write(body.subarray(0,split));setTimeout(()=>req.end(body.subarray(split)),20);
  });
  assert.equal(response.status,202);assert.equal((await next).code,code);
  assert.equal((await request(route+'js',{code:'한'.repeat(21846)})).status,400);
  assert.equal((await request(route+'js',{code:'//'+ '한'.repeat(21844)+'xx'})).status,202);
 }finally{await bridge.close()}
});
