import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import {productRuntime,resultText as text} from './helpers/product-runtime.mjs';
let h,a,b,tabId,runId;
const completed=r=>assert.equal(r.status,'completed',JSON.stringify(r));
before(async()=>{h=await productRuntime('b01a');a=await h.client.session();b=await h.client.session()});
after(async()=>{await h?.close()});

test('B01A guide and unknown/auth failures preserve tabs, focus, sessions and owners',async()=>{
 let r=await h.client.js(a.id,`var b01Page=await browser.open(${JSON.stringify(h.fixture.url+'/audit')});await b01Page.locator('#duplicates [data-unit="right"] button').waitFor();console.log(b01Page.id);`);completed(r);tabId=Number(text(r));
 const own=h.context.pages().find(p=>p.url().endsWith('/audit'));assert(own);
 runId=await own.locator('body').getAttribute('data-run');assert(runId);
 const state=async()=>({sessions:h.bridge.sessions.size,requests:h.bridge.requests.size,tabs:await Promise.all(h.context.pages().map(async p=>({url:p.url(),focused:await p.evaluate(()=>document.hasFocus())}))),generation:h.bridge.sessions.get(a.id).generation});
 const before=await state();
 const guide=(await h.request('/v1/guide')).value;
 assert.deepEqual(guide.external,['guide','reset','js']);assert.equal(guide.api.internal.length,64);assert.match(guide.version,/^\d+\.\d+\.\d+/);assert.equal(guide.execution,'extension-worker/QuickJS-WASM');assert.match(guide.verificationScope,/기본/);
 assert.equal((await h.request('/v1/guide?api=scope.snapshot')).value.api.name,'scope.snapshot');
 assert.equal((await h.request('/v1/guide?api=js')).value.api.name,'js');
 const unknown=await h.request('/v1/guide?api=does.not.exist');assert.equal(unknown.status,404);assert.equal(unknown.value.code,'UNKNOWN_API');
 for(const token of ['','wrong']){
  const denied=await h.request('/v1/guide',undefined,token);assert.equal(denied.status,401);assert.deepEqual(denied.value,{error:'Unauthorized'});
 }
 assert.equal((await fetch(h.bridge.url+'/v1/guide')).status,401);
 assert.deepEqual(await state(),before);
 r=await h.client.js(b.id,`await browser.attach(${tabId})`);assert.equal(r.status,'failed');assert.match(r.result.error.message,/TAB_OWNED_BY_ANOTHER_SESSION/);
 r=await h.client.js(a.id,'console.log((await b01Page.locator("#duplicates button").count())>0)');completed(r);assert.equal(text(r),'true');
 h.evidence.push({conditions:['REQ-C-RUNTIME-001-C01','REQ-GUIDE-001-C01','REQ-GUIDE-001-C02','REQ-GUIDE-002-C01','REQ-GUIDE-002-C02'],status:'pass',tabId,guideVersion:guide.version,unknown:unknown.value,readonlyState:before});
});

test('B01A concurrent retry clicks exactly once and conflicting payload/operation have no effect',async()=>{
 const route='/v1/sessions/'+a.id+'/',payload={requestId:'actual-click-once',code:'await b01Page.locator(\'#duplicates [data-unit="right"] button\').click();console.log("clicked")',timeoutMs:10000};
 const replies=await Promise.all([h.request(route+'js',payload),h.request(route+'js',payload)]);
 for(const r of replies){assert.equal(r.status,202);assert.equal(r.value.requestId,payload.requestId)}
 const first=await h.client.wait(payload.requestId);completed(first);assert.equal(text(first),'clicked');assert.equal(first.result.execution,'extension-worker/QuickJS-WASM');
 const generation=h.bridge.sessions.get(a.id).generation,requests=h.bridge.requests.size;
 for(const [operation,body] of [['js',{...payload,code:payload.code+';console.log(2)'}],['js',{...payload,timeoutMs:11000}],['reset',{requestId:payload.requestId}]]){
  const conflict=await h.request(route+operation,body);assert.equal(conflict.status,409);assert.equal(conflict.value.code,'REQUEST_ID_CONFLICT');
 }
 assert.equal(h.bridge.sessions.get(a.id).generation,generation);assert.equal(h.bridge.requests.size,requests);
 const own=h.context.pages().find(p=>p.url().endsWith('/audit'));
 await own.getByText('PASS · duplicates',{exact:true}).waitFor();
 const server=await fetch(h.fixture.url+'/api/runs/'+runId).then(r=>r.json());
 const clicks=server.events.filter(e=>e.type==='audit-step'&&e.data.key==='duplicates');assert.equal(clicks.length,1);assert.equal(clicks[0].accepted,true);
 const retry=await h.request(route+'js',payload);assert.equal(retry.status,202);assert.deepEqual(await h.client.wait(payload.requestId),first);
 h.evidence.push({conditions:['REQ-C-RUNTIME-005-C01','REQ-JS-002-C02'],status:'pass',serverClicks:clicks,execution:first.result.execution});
});

test('B01A a second conversation cannot attach or upload another conversation asset',async()=>{
 const response=await fetch(h.bridge.url+'/v1/assets?sessionId='+a.id+'&name=owner.txt',{method:'POST',headers:{authorization:'Bearer '+h.bridge.token},body:'owner-proof'}),asset=await response.json();assert.equal(response.status,201);
 let r=await h.client.js(b.id,'console.log(typeof b01Page)');completed(r);assert.equal(text(r),'undefined');
 r=await h.client.js(b.id,`var otherPage=await browser.open(${JSON.stringify(h.fixture.url+'/?scenario=files')});await otherPage.getByLabel('검증 파일',{exact:true}).waitFor();console.log(await otherPage.getByLabel('검증 파일',{exact:true}).getAttribute('id'));`);completed(r);
 const other=h.context.pages().find(p=>p.url().includes('scenario=files'));assert(other);const names=()=>other.locator('input[type="file"]').evaluate(el=>Array.from(el.files,f=>f.name));assert.deepEqual(await names(),[]);
 r=await h.client.js(b.id,`await otherPage.getByLabel('검증 파일',{exact:true}).setFiles({fileId:${JSON.stringify(asset.id)}})`);assert.equal(r.status,'failed');assert.match(r.result.error.message,/403|session/i);assert.deepEqual(await names(),[]);
 const denied=await fetch(h.bridge.url+'/v1/assets/'+asset.id+'?sessionId='+b.id,{headers:{authorization:'Bearer '+h.bridge.token}});assert.equal(denied.status,403);
 const retained=await fetch(h.bridge.url+'/v1/assets/'+asset.id+'?sessionId='+a.id,{headers:{authorization:'Bearer '+h.bridge.token}}).then(r=>r.text());assert.equal(retained,'owner-proof');
 r=await h.client.js(a.id,'console.log(await b01Page.locator("#duplicates").count())');completed(r);assert.equal(text(r),'1');
 h.evidence.push({conditions:['REQ-C-RUNTIME-006-C01'],status:'pass',otherBinding:'undefined',deniedAssetHTTP:403,otherInputFiles:[],ownerAssetPreserved:true,ownerTabPreserved:true});
});

test('B01A code limits, syntax errors and CPU deadline are distinct and the new generation recovers',async()=>{
 const route='/v1/sessions/'+a.id+'/js';const before=h.bridge.requests.size;
 for(const code of [null,{},'x'.repeat(65537)])assert.equal((await h.request(route,{code})).status,400);
 assert.equal(h.bridge.requests.size,before);
 let r=await h.client.js(a.id,'//'+'한'.repeat(21844)+'xx');completed(r);
 r=await h.client.js(a.id,'let = ;');assert.equal(r.status,'failed');assert.equal(r.result.error.code,'JS_ERROR');
 for(const timeoutMs of [50,30000,120000]){r=await h.client.js(a.id,'console.log("boundary")',{timeoutMs});completed(r);assert.equal(text(r),'boundary')}
 const generation=h.bridge.sessions.get(a.id).generation;
 r=await h.client.js(a.id,'while(true){}',{timeoutMs:150});assert.equal(r.status,'failed');assert.equal(r.result.error.code,'TIMEOUT');assert.equal(r.result.runtimeReset,true);
 const next=await h.client.js(a.id,'console.log(typeof b01Page)');completed(next);assert.equal(text(next),'undefined');assert.equal(next.generation,generation+1);
 h.evidence.push({conditions:['REQ-JS-002-C01'],status:'pass',codeBytes:65536,syntaxCode:'JS_ERROR',cpuCode:'TIMEOUT',newGeneration:next.generation,oldBinding:'undefined'});
});
