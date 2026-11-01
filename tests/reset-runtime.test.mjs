import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import {productRuntime,resultText as text} from './helpers/product-runtime.mjs';
let h,a,b;
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const done=r=>{assert.equal(r.status,'completed',JSON.stringify(r));return r};
const js=(s,code,options={})=>h.client.js(s.id,code,options);
const submit=(s,code,options={})=>h.client.request('/v1/sessions/'+s.id+'/js',{code,...options});
async function setup(s,suffix=''){
 const url=h.fixture.url+'/reset?'+suffix;
 const r=done(await js(s,`var page=await browser.open(${JSON.stringify(url)});await page.locator('#marker').waitFor();console.log(page.id);`));
 const id=Number(text(r)),observed=h.context.pages().find(p=>p.url()===url);assert(observed);return {id,observed};
}
async function asset(s){return fetch(h.bridge.url+'/v1/assets?sessionId='+s.id+'&name=reset-asset.txt',{method:'POST',headers:{authorization:'Bearer '+h.bridge.token},body:'asset-persist'}).then(r=>r.json())}
async function assetText(s,id){return fetch(h.bridge.url+'/v1/assets/'+id+'?sessionId='+s.id,{headers:{authorization:'Bearer '+h.bridge.token}}).then(r=>r.text())}
before(async()=>{h=await productRuntime('b01d',{extraSources:['tests/browser-lifecycle.test.mjs','tests/reset-fixture.test.mjs','tests/session-lifecycle.test.mjs','docs/architecture.md','docs/testing.md','extension/session-lifecycle.mjs','extension/background.js','tests/reset-runtime.test.mjs','test-site/reset.html']});a=await h.client.session();b=await h.client.session()});
after(async()=>await h?.close());

test('B01D reset clears one VM and output while preserving page value tab ref assets and completed files',async()=>{
 const {id,observed}=await setup(a,'preserve'),other=await setup(b,'other');
 const uploaded=await asset(a);
 done(await js(b,'var old=77;console.log("other")'));
 let r=done(await js(a,`var old=7;await page.activate();await page.locator('#marker').fill('A');var rootFrame=(await page.frames()).find(f=>!f.parent);var snap=await page.frame(rootFrame.id).snapshot({query:'보존할 값'});console.log(snap.refs.find(r=>r.role==='textbox'&&r.frameId===rootFrame.id).ref);var downloadPending=page.waitForEvent('download');await page.getByRole('link',{name:'보존 파일 다운로드'}).click();var download=await downloadPending;var saved=await download.save({target:'server'});console.log(saved);`));
 const [ref,file]=text(r).split('\n');assert(ref);const saved=JSON.parse(file);
 assert.equal(await observed.locator('#marker').inputValue(),'A');
 const pending=await submit(a,'console.log("old-output");await new Promise(()=>{})');await delay(100);
 const reset=done(await h.client.reset(a.id));assert.equal((await h.client.wait(pending.requestId)).status,'cancelled');
 r=done(await js(a,`console.log(typeof old);var page=await browser.attach(${id});console.log(await page.locator(${JSON.stringify(ref)}).inputValue());console.log('new-output');`));
 assert.equal(text(r),'undefined\nA\nnew-output');assert.equal(await observed.locator('#marker').inputValue(),'A');
 assert.equal(text(done(await js(b,'console.log(old,page.id)'))),'77 '+other.id);
 assert.equal(await assetText(a,uploaded.id),'asset-persist');assert.equal(await assetText(a,saved.fileId),'reset-file-proof');
 h.evidence.push({conditions:['REQ-RESET-001-C01','REQ-RESET-001-C02'],status:reset.result.runtimeReset===true&&reset.result.rollback===false?'pass':'fail',reset:reset.result,generation:r.generation,preservedTab:id,ref,assetBytes:13,fileBytes:16});
 assert.equal(reset.result.runtimeReset,true);assert.equal(reset.result.rollback,false);
});

test('B01D reset releases held input in a real cross-site child target',async()=>{
 const {id,observed}=await setup(a,'child-input');
 let held=false;
 try{
  const located=done(await js(a,`var child;for(var end=Date.now()+4000;Date.now()<end;){child=(await page.frames()).find(f=>f.url.includes('mail.test'));if(child)break}if(!child?.process.includes('child'))throw Error('Missing OOPIF child');var childScope=page.frame(child.id);await childScope.locator('#marker').hover();await childScope.locator('#marker').focus();await page.keyboard.down('Control');await page.mouse.down({button:'left'});console.log(child);`));held=true;
  const target=JSON.parse(text(located)),reset=done(await h.client.reset(a.id));
  const events=JSON.parse(await observed.locator('#child-events').textContent());
  h.evidence.push({conditions:['REQ-RESET-002-C02'],status:events.some(e=>e.type==='keyup'&&e.key==='Control'&&e.trusted)&&events.some(e=>e.type==='mouseup'&&e.trusted)&&reset.result.cleanup?.status==='complete'?'pass':'fail',target,events,cleanup:reset.result.cleanup});
  assert(events.some(e=>e.type==='keydown'&&e.key==='Control'&&e.trusted));assert(events.some(e=>e.type==='keyup'&&e.key==='Control'&&e.trusted));assert(events.some(e=>e.type==='mousedown'&&e.trusted));assert(events.some(e=>e.type==='mouseup'&&e.trusted));
  assert.equal(reset.result.cleanup.status,'complete');assert(reset.result.cleanup.trace.some(e=>e.method==='Input.dispatchMouseEvent'&&e.target.sessionId&&e.status==='released'));
 }finally{if(held)done(await js(a,`var page=await browser.attach(${id});await page.keyboard.up('Control');await page.mouse.up({button:'left'});`))}
});

test('B01D never-settle late host queries and overlapping resets cannot finish new generation requests',async()=>{
 const {id,observed}=await setup(a,'late-query');
 const pending=await submit(a,'await page.evaluate(()=>new Promise(resolve=>setTimeout(()=>resolve("old-query"),900)));console.log("late-output");');await delay(150);
 const first=await h.client.request('/v1/sessions/'+a.id+'/reset',{}),second=await h.client.request('/v1/sessions/'+a.id+'/reset',{});
 const r1=await h.client.wait(first.requestId),r2=done(await h.client.wait(second.requestId));
 const fresh=done(await js(a,`var page=await browser.attach(${id});console.log('only-new');`));assert.equal(text(fresh),'only-new');assert.equal(fresh.generation,r2.generation);
 assert.equal((await h.client.wait(pending.requestId)).status,'cancelled');assert(['cancelled','completed'].includes(r1.status));await delay(1100);
 assert.equal(text(done(await js(a,'console.log("next-new")'))),'next-new');assert.equal(await observed.locator('#marker').inputValue(),'initial');
 const eventWait=await submit(a,`await page.waitForEvent('popup',{timeout:4000});console.log('old-event-output')`);await delay(100);
 const eventReset=done(await h.client.reset(a.id));assert.equal((await h.client.wait(eventWait.requestId)).status,'cancelled');
 assert.equal(text(done(await js(a,`var page=await browser.attach(${id});console.log('after-event-reset')`))),'after-event-reset');
 h.evidence.push({conditions:['REQ-RESET-002-C01'],status:'pass',first:r1.status,second:r2.status,generation:fresh.generation,eventReset:eventReset.result});
});

test('B01D reset emits actual trusted key and mouse releases with truthful cleanup traces',async()=>{
 const {id,observed}=await setup(a,'input');
 done(await js(a,`await page.locator('#marker').focus();await page.keyboard.down('Control');await page.mouse.move(110,145);await page.mouse.down({button:'left'});`));
 const before=await observed.locator('#events').textContent(),reset=done(await h.client.reset(a.id));
 const events=JSON.parse(await observed.locator('#events').textContent());
 try{
  h.evidence.push({conditions:['REQ-RESET-002-C02'],status:events.some(e=>e.type==='keyup'&&e.key==='Control'&&e.trusted)&&events.some(e=>e.type==='mouseup'&&e.trusted)&&reset.result.cleanup?.status==='complete'?'pass':'fail',before:JSON.parse(before),after:events,cleanup:reset.result.cleanup});
  assert(events.some(e=>e.type==='keydown'&&e.key==='Control'&&e.trusted));assert(events.some(e=>e.type==='mousedown'&&e.button===0&&e.trusted));
  assert(events.some(e=>e.type==='keyup'&&e.key==='Control'&&e.trusted));assert(events.some(e=>e.type==='mouseup'&&e.button===0&&e.trusted));
  assert.equal(await observed.locator('#held').textContent(),'해제됨');
  assert.equal(reset.result.cleanup.status,'complete');assert(reset.result.cleanup.trace.some(e=>e.method==='Input.dispatchKeyEvent'&&e.status==='released'));assert(reset.result.cleanup.trace.some(e=>e.method==='Input.dispatchMouseEvent'&&e.status==='released'));
 }finally{done(await js(a,`var page=await browser.attach(${id});await page.keyboard.up('Control');await page.mouse.up({button:'left'});`))}
});

test('B01D reset blocks previously waiting locator clicks and queued VM work after a delayed target appears',async()=>{
 const rows=[];
 for(let i=0;i<2;i++){
  const {id,observed}=await setup(a,'queued-'+i);
  const pending=await submit(a,`await page.locator('#arm').click();await page.locator('#late').click();console.log('old-click-completed')`);
  await observed.locator('#armed').filter({hasText:'armed'}).waitFor();await delay(100);
  const queued=await submit(a,'await page.locator("#marker").fill("queued-change");console.log("queued-output")');
  const reset=done(await h.client.reset(a.id));
  done(await js(a,`var page=await browser.attach(${id});console.log('new-generation');`));
  await observed.locator('#late').waitFor();await delay(350);
  const count=Number(await observed.locator('#click-count').textContent()),value=await observed.locator('#marker').inputValue();
  rows.push({count,value,old:(await h.client.wait(pending.requestId)).status,queued:(await h.client.wait(queued.requestId)).status,cleanup:reset.result.cleanup});
 }
 h.evidence.push({conditions:['REQ-RESET-003-C01'],status:rows.every(r=>r.count===0&&r.value==='initial')?'pass':'fail',rows});
 assert(rows.every(r=>r.count===0&&r.value==='initial'&&r.old==='cancelled'&&r.queued==='cancelled'),JSON.stringify(rows));
});

test('B01D actual VM limits reset with cleanup whereas a subordinate wait timeout preserves bindings and effects',async()=>{
 const {id,observed}=await setup(a,'limits'),uploaded=await asset(a);
 done(await js(a,`var retained=17;await page.locator('#marker').fill('A');`));
 const subordinate=await js(a,`await page.waitForFunction(()=>false,null,{timeout:100});`,{timeoutMs:2000});assert.equal(subordinate.status,'failed');assert.equal(subordinate.result.runtimeReset,false);
 assert.equal(text(done(await js(a,'console.log(retained)'))),'17');
 const rows=[];
 for(const [code,timeoutMs,errorCode] of [['await page.keyboard.down("Control");while(true){}',150,'TIMEOUT'],['await page.keyboard.down("Control");await new Promise(()=>{})',150,'TIMEOUT'],['await page.keyboard.down("Control");function resetStack(){return resetStack()}resetStack()',1000,'RESOURCE_LIMIT']]){
  const limit=await js(a,code,{timeoutMs}),held=await observed.locator('#held').textContent();
  const fresh=done(await js(a,`var page=await browser.attach(${id});console.log(typeof retained);console.log(await page.locator('#marker').inputValue())`));assert.equal(text(fresh),'undefined\nA');assert.equal(fresh.generation,limit.generation+1);
  rows.push({expectedCode:errorCode,error:limit.result.error,cleanup:limit.result.cleanup,held,generations:[limit.generation,fresh.generation],passed:limit.status==='failed'&&limit.result.error?.code===errorCode&&limit.result.runtimeReset===true&&limit.result.cleanup?.status==='complete'&&held==='해제됨'});
 }
 assert.equal(await observed.locator('#marker').inputValue(),'A');assert.equal(await assetText(a,uploaded.id),'asset-persist');
 done(await js(a,'await page.keyboard.up("Control")'));
 h.evidence.push({conditions:['REQ-C-RUNTIME-003-C01'],status:rows.every(r=>r.passed)?'pass':'fail',subordinate:subordinate.result,rows});
 assert.deepEqual(rows.filter(r=>!r.passed),[]);
});

test('B01D a missing browser target reports actual release failure without preventing a fresh VM',async()=>{
 const isolated=await h.client.session(),{observed}=await setup(isolated,'release-failure');
 done(await js(isolated,`var old=123;await page.locator('#marker').focus();await page.keyboard.down('Control');`));
 // Deliberate external target loss is the failure condition. It does not stand
 // in for any product action under test: reset and release still use the bridge.
 await observed.close();
 const reset=done(await h.client.reset(isolated.id));
 const recovered=done(await js(isolated,'console.log(typeof old,(await browser.list())[0].id)'));
 h.evidence.push({conditions:['REQ-RESET-002-C02','REQ-RESET-003-C01'],status:reset.result.cleanup?.status==='partial'?'pass':'fail',reset:reset.result,recovered:text(recovered)});
 assert.equal(reset.result.cleanup?.status,'partial');assert(reset.result.cleanup.warnings.some(e=>e.method==='Input.dispatchKeyEvent'&&e.status==='failed'));assert(reset.result.cleanup.trace.some(e=>e.method==='Input.dispatchKeyEvent'&&e.status==='failed'));
 assert.equal(text(recovered),'undefined current');
});
