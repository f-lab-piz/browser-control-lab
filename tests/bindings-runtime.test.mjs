import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import {productRuntime,resultText as text} from './helpers/product-runtime.mjs';
let h,a,b,pageA,pageB,runA;
const completed=r=>{assert.equal(r.status,'completed',JSON.stringify(r));assert.equal(r.result.execution,'extension-worker/QuickJS-WASM');return r};
const execute=(session,code)=>h.client.js(session.id,code);
before(async()=>{h=await productRuntime('b01b',{extraSources:['tests/bindings-runtime.test.mjs','extension/manifest.json']});a=await h.client.session();b=await h.client.session()});
after(async()=>await h?.close());

test('B01B independent QuickJS sessions retain values, outputs and owned real page handles',async()=>{
 for(const [session,value] of [[a,7],[b,70]]){
  const r=completed(await execute(session,`let shared=${value};const stable=${value+1};var counter=0;let ownPage=await browser.open(${JSON.stringify(h.fixture.url+'/audit?binding-owner='+session.id)});await ownPage.locator('#duplicates [data-unit="right"] button').waitFor();console.log(ownPage.id,shared,stable,(await browser.list())[0].id);`));
  const id=Number(text(r).split(' ')[0]);assert.match(text(r),new RegExp(' '+value+' '+(value+1)+' current$'));
  if(session===a)pageA=id;else pageB=id;
 }
 assert.notEqual(pageA,pageB);
 const independent=h.context.pages().find(p=>!p.isClosed()&&p.url().includes('binding-owner='+a.id));
 assert(independent);runA=await independent.locator('body').getAttribute('data-run');
 completed(await execute(a,'shared=9;console.log(shared,stable,ownPage.id)'));
 assert.equal(text(completed(await execute(b,'console.log(shared,stable,counter,ownPage.id)'))),`70 71 0 ${pageB}`);
 assert.equal(text(completed(await execute(a,'console.log(shared,stable,counter,ownPage.id)'))),`9 8 0 ${pageA}`);
 const denied=await execute(b,`await browser.attach(${pageA})`);assert.equal(denied.status,'failed');assert.match(denied.result.error.message,/TAB_OWNED_BY_ANOTHER_SESSION/);
 h.evidence.push({conditions:['REQ-C-RUNTIME-002-C01','REQ-JS-001-C01'],status:'pass',pages:[pageA,pageB],execution:'extension-worker/QuickJS-WASM',values:[[9,8,0],[70,71,0]]});
});

test('B01B declarations, destructuring and closures persist across actual awaited host calls',async()=>{
 completed(await execute(a,'let [first,...rest]=[2,3,4];const {answer,nested:{word}}={answer:42,nested:{word:"kept"}};var plain=40;function add(n){return first+n}class Box{value(){return answer}};await browser.list();'));
 let r=completed(await execute(a,'var plain;console.log(first,rest,answer,word,plain,add(5),new Box().value());'));
 assert.equal(text(r),'2 [3,4] 42 kept 40 7 42');
 r=completed(await execute(a,'plain+=2;first=6;console.log(await browser.list(),plain,add(1));'));assert.match(text(r),/ 42 7$/);
 assert.equal(text(completed(await execute(b,'console.log(typeof first,typeof answer,typeof add,typeof Box)'))),'undefined undefined undefined undefined');
 h.evidence.push({conditions:['REQ-JS-001-C01'],status:'pass',varWithoutInitializer:40,destructuring:[2,[3,4],42,'kept'],closureAfterAssignment:7});
});

test('B01B only explicit console and display output is returned',async()=>{
 let r=completed(await execute(a,'42'));assert.deepEqual(r.result.content,[]);
 r=completed(await execute(a,'console.log(43);44'));assert.deepEqual(r.result.content,[{type:'text',text:'43'}]);
 r=completed(await execute(a,'display(await ownPage.screenshot());45'));assert.equal(r.result.content.length,1);
 const image=r.result.content[0];assert.equal(image.type,'image');assert.equal(image.mimeType,'image/png');assert.deepEqual([...Buffer.from(image.data,'base64').subarray(0,8)],[137,80,78,71,13,10,26,10]);
 h.evidence.push({conditions:['REQ-JS-001-C02'],status:'pass',expressionBlocks:0,logBlocks:1,imageMime:image.mimeType,imageBytes:Buffer.from(image.data,'base64').length});
});

test('B01B lexical conflicts reject the entire request before variable or real click effects',async()=>{
 completed(await execute(a,'await ownPage.activate();let p=7;const q=8;var other=0;'));
 const generation=h.bridge.sessions.get(a.id).generation;
 const marker=`other++;await ownPage.locator('#duplicates [data-unit="right"] button').click();`;
 const rows=[];
 for(const declaration of ['let p=9;','const q=9;','var p=9;','let other=9;','const {p}={p:9};']){
  const r=await execute(a,marker+declaration);assert.equal(r.status,'failed',JSON.stringify(r));assert.equal(r.result.error.code,'JS_ERROR');assert.equal(r.result.runtimeReset,false);
  assert.equal(text(completed(await execute(a,'console.log(p,q,other)'))),'7 8 0');
  const server=await fetch(h.fixture.url+'/api/runs/'+runA).then(r=>r.json());assert.equal(server.events.filter(e=>e.type==='audit-step'&&e.data.key==='duplicates').length,0);
  assert.equal(h.bridge.sessions.get(a.id).generation,generation);rows.push({declaration,error:r.result.error,clicks:0,other:0});
 }
 let r=completed(await execute(a,'var other=2;p=11;console.log(p,q,other)'));assert.equal(text(r),'11 8 2');
 r=await execute(a,'q=12;');assert.equal(r.status,'failed');assert.equal(r.result.error.code,'JS_ERROR');assert.equal(r.result.runtimeReset,false);
 for(const code of ['other++;let broken=;','other++;import x from \"not-available\";','other++;export const exported=1;']){const syntax=await execute(a,code);assert.equal(syntax.status,'failed');assert.equal(syntax.result.error.code,'JS_ERROR')}
 assert.equal(text(completed(await execute(a,'console.log(p,q,other)'))),'11 8 2');
 assert.equal(text(completed(await execute(b,'console.log(shared,stable,typeof p,typeof q,typeof other)'))),'70 71 undefined undefined undefined');
 assert.equal(h.bridge.sessions.get(a.id).generation,generation);
 h.evidence.push({conditions:['REQ-JS-003-C01'],status:'pass',rows,generation,finalBindings:[11,8,2],otherSessionUnchanged:true});
});
