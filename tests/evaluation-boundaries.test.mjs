import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluationSource,evaluationDeadline} from '../extension/evaluation.mjs';
import {runInNewContext} from 'node:vm';
test('function source keeps method bodies without executing computed property keys or moving closure names',async()=>{
 for(const source of ['()=>7','async()=>7','method(){return 7}','async method(){return 7}','[missingKey](){return 7}','get value(){return 7}'])assert.equal(await runInNewContext(evaluationSource(source))(),7,source);
 assert.throws(()=>evaluationSource('function () { [native code] }'),/EVALUATION_ERROR/);
});
test('evaluation deadline includes setup and blocks continuation after a delayed adapter response',async()=>{
 const calls=[],scope={assert(){},call:async(dispatch)=>dispatch()};
 const budget=evaluationDeadline(scope,Date.now()+20);
 try{
  await assert.rejects(budget.scope.call(async()=>{calls.push('setup');await new Promise(r=>setTimeout(r,60));return 7},{method:'setup'}),/WAIT_TIMEOUT/);
  await assert.rejects(budget.scope.call(()=>calls.push('user-function'),{method:'evaluate'}),/WAIT_TIMEOUT/);
  assert.deepEqual(calls,['setup']);
 }finally{budget.close()}
});
test('a timed out page promise releases its private handle and context monitor',async()=>{
 const previous=globalThis.chrome,originalInterval=globalThis.setInterval,originalClear=globalThis.clearInterval,intervals=new Set(),event={addListener(){}};let released=0;
 globalThis.setInterval=(...args)=>{const id=originalInterval(...args);intervals.add(id);return id};globalThis.clearInterval=id=>{intervals.delete(id);return originalClear(id)};
 globalThis.chrome={runtime:{getURL:()=> 'data:application/json,'+encodeURIComponent(JSON.stringify({url:'http://127.0.0.1:1',token:'test-only'}))},tabs:{get:async id=>({id,url:'http://example.test/'}),onCreated:event,onUpdated:event,onRemoved:event},downloads:{onCreated:event},debugger:{onEvent:event,onDetach:event,attach:async()=>{},sendCommand:async(target,method,args)=>{
  if(method==='Page.getFrameTree')return {frameTree:{frame:{id:'root',url:'http://example.test/',loaderId:'document1'}}};
  if(method==='Page.createIsolatedWorld')return {executionContextId:1};
  if(method==='Runtime.evaluate')return args.expression.includes('document.readyState')?{result:{value:true}}:args.expression.includes('installPageAgent')?{result:{value:null}}:{result:{type:'function',objectId:'owned-fn'}};
  if(method==='Runtime.callFunctionOn'&&args.awaitPromise)return new Promise(()=>{});
  if(method==='Runtime.releaseObject')released++;
  return {};
 }}};
 try{
  const {browserCall}=await import('../extension/browser-engine.mjs');await browserCall('timer','',{}, {control:'start',generation:1});
  await assert.rejects(browserCall('timer','page.waitForFunction',{tabId:10,source:'()=>new Promise(()=>{})',argJson:'null',options:{timeout:40}},{generation:1}),/WAIT_TIMEOUT/);
  await new Promise(r=>setTimeout(r,10));assert.equal(intervals.size,0);assert.equal(released,1);
 }finally{for(const id of intervals)originalClear(id);globalThis.setInterval=originalInterval;globalThis.clearInterval=originalClear;if(previous===undefined)delete globalThis.chrome;else globalThis.chrome=previous}
});
