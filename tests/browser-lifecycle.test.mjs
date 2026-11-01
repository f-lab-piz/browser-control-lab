// Chrome adapter boundary unit test, not a real browser/product PASS.
import test from 'node:test';
import assert from 'node:assert/strict';
test('a refused attachment releases its new reservation instead of falsely owning the tab',async()=>{
 const previous=globalThis.chrome,event={addListener(){}};let rejectAttach=true;
 globalThis.chrome={
  runtime:{getURL:()=> 'data:application/json,'+encodeURIComponent(JSON.stringify({url:'http://127.0.0.1:1',token:'test-only'}))},
  tabs:{get:async id=>({id,url:'http://example.test/'}),onCreated:event,onUpdated:event,onRemoved:event},downloads:{onCreated:event},
  debugger:{onEvent:event,onDetach:event,attach:async()=>{if(rejectAttach)throw Error('Adapter refused attachment')},sendCommand:async(target,method)=>method==='Page.getFrameTree'?{frameTree:{frame:{id:'root',url:'http://example.test/',loaderId:'document1'}}}:method==='Page.createIsolatedWorld'?{executionContextId:1}:method==='Runtime.evaluate'?{result:{value:true}}:{}}
 };
 try{
  const {browserCall}=await import('../extension/browser-engine.mjs');
  await browserCall('one','',{}, {control:'start',generation:1});await browserCall('two','',{}, {control:'start',generation:1});
  await assert.rejects(browserCall('one','browser.attach',{tabId:10},{generation:1}),/Adapter refused/);
  rejectAttach=false;assert.deepEqual(await browserCall('two','browser.attach',{tabId:10},{generation:1}),{id:10});
 }finally{if(previous===undefined)delete globalThis.chrome;else globalThis.chrome=previous}
});
