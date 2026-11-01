// Fake extension wire admission only: not product execution evidence.
import test from 'node:test';
import assert from 'node:assert/strict';
import {startBridge} from '../bridge/server.mjs';
const MiB=1024*1024;
async function harness(fn){const b=await startBridge();try{
 const request=async(route,body,extension=false)=>{const r=await fetch(b.url+route,{method:body===undefined?'GET':'POST',headers:{authorization:'Bearer '+(extension?b.extensionToken:b.token),'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});return {status:r.status,body:await r.json()}};
 await fn(b,request);
}finally{await b.close()}}

test('B01C extension result JSON exact16MiB is independent of correlation envelope; excess terminates explicitly',async()=>harness(async(b,request)=>{
 const session=(await request('/v1/sessions',{})).body;
 for(const extra of [0,1]){
  const requestId='long-result-id-'+extra+'한'.repeat(2000);
  const next=request('/v1/extension/next',undefined,true);
  assert.equal((await request('/v1/sessions/'+session.id+'/js',{requestId,code:'42'})).status,202);
  const command=(await next).body;assert.equal(command.requestId,requestId);
  const result={padding:'x'.repeat(16*MiB-Buffer.byteLength(JSON.stringify({padding:''}))+extra)};assert.equal(Buffer.byteLength(JSON.stringify(result)),16*MiB+extra);
  const reply=await request('/v1/extension/result',{requestId,sessionId:session.id,generation:command.generation,result},true);
  assert.equal(reply.status,extra?413:200);
  const completed=(await request('/v1/requests',{requestId})).body;
  assert.equal(completed.status,extra?'failed':'completed');if(extra)assert.equal(completed.result.error.code,'RESULT_LIMIT');else assert.equal(completed.result.padding,result.padding);
 }
}));

test('B01C guide declares execution and output limits with explicit units',async()=>harness(async(b,request)=>{
 const guide=(await request('/v1/guide')).body;
 assert.deepEqual(guide.limits,{timeoutMs:{default:30000,min:50,max:120000},codeBytes:65536,memoryBytes:64*MiB,stackBytes:512*1024,textBytes:65536,imageBytes:4*MiB,imageTotalBytes:8*MiB,imageCount:4,blocks:256,resultBytes:16*MiB});
}));
