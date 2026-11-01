import test from 'node:test';
import assert from 'node:assert/strict';
import {SessionLifecycle,releaseHeldInputs} from '../extension/session-lifecycle.mjs';
const deferred=()=>{let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve}};
test('an operation invalidated before the dispatch microtask never reaches the adapter',async()=>{
 const lifecycle=new SessionLifecycle(),entered=deferred(),calls=[];
 const old=lifecycle.run('one',1,{},scope=>{
  const pending=scope.call(()=>calls.push('unsent'),{method:'click'});
  entered.resolve(lifecycle.reset('one',2,async info=>info));return pending;
 });
 const reset=await entered.promise;await assert.rejects(old,/SESSION_RESET/);assert.equal((await reset).inFlight.length,0);assert.deepEqual(calls,[]);
});
test('reset blocks unsent continuation while recording already transmitted uncertain effects',async()=>{
 const lifecycle=new SessionLifecycle(),entered=deferred(),wire=deferred(),calls=[];
 const old=lifecycle.run('one',1,{requestId:'old'},async scope=>{await scope.call(()=>{calls.push('down');entered.resolve();return wire.promise},{method:'Input.dispatchKeyEvent'});await scope.call(()=>calls.push('late-click'),{method:'Input.dispatchMouseEvent'})});
 await entered.promise;let observed;
 const reset=lifecycle.reset('one',2,async input=>{observed=input;return 'cleaned'});
 await assert.rejects(old,/SESSION_RESET/);assert.equal(await reset,'cleaned');
 assert.equal(observed.inFlight.length,1);assert.equal(observed.inFlight[0].method,'Input.dispatchKeyEvent');
 wire.resolve();await Promise.resolve();await Promise.resolve();assert.deepEqual(calls,['down']);
 assert.equal(await lifecycle.run('one',2,{},scope=>scope.call(()=>42,{method:'read'})),42);
});
test('overlapping reset barriers block new work and stale reset cannot invalidate new generation',async()=>{
 const lifecycle=new SessionLifecycle(),first=deferred(),calls=[];
 await lifecycle.start('one',1);
 const r1=lifecycle.reset('one',2,async()=>{calls.push('first');await first.promise});
 const r2=lifecycle.reset('one',3,async()=>calls.push('second'));
 const fresh=lifecycle.run('one',3,{},async()=>calls.push('new'));
 await Promise.resolve();assert.deepEqual(calls,['first']);first.resolve();await Promise.all([r1,r2,fresh]);assert.deepEqual(calls,['first','second','new']);
 await assert.rejects(lifecycle.reset('one',2,()=>calls.push('stale')),/stale/);assert.equal(await lifecycle.run('one',3,{},()=>7),7);
});
test('event wait and trigger stay concurrent and another session is independent',async()=>{
 const lifecycle=new SessionLifecycle(),event=deferred();
 const wait=lifecycle.run('one',1,{},scope=>scope.call(()=>event.promise,{method:'waitForEvent'}));
 const input=lifecycle.run('one',1,{},scope=>scope.call(()=>event.resolve('popup'),{method:'click'}));
 assert.equal(await wait,'popup');await input;
 await lifecycle.reset('one',2,async()=>{});assert.equal(await lifecycle.run('two',1,{},()=>9),9);
});
test('release failure and uncertainty retain held input and a later reset can retry it',async()=>{
 const target={tabId:12,sessionId:'child'},record={target,method:'Input.dispatchMouseEvent',kind:'mouse',button:'left',params:{type:'mouseReleased',button:'left',buttons:0,x:5,y:8}};
 const inputs=new Map([['mouse',record]]);
 const failed=await releaseHeldInputs(inputs,async()=>{throw Error('Target detached')});assert.equal(failed.status,'partial');assert.equal(failed.trace[0].status,'failed');assert.match(failed.warnings[0].message,/detached/);assert.equal(inputs.size,1);
 const timeout=await releaseHeldInputs(inputs,()=>new Promise(()=>{}),{timeoutMs:10});assert.equal(timeout.status,'partial');assert.equal(inputs.size,1);assert.match(timeout.warnings[0].message,/unknown/);
 const calls=[],ok=await releaseHeldInputs(inputs,async(...args)=>calls.push(args));assert.equal(ok.status,'complete');assert.equal(ok.trace[0].status,'released');assert.equal(inputs.size,0);assert.deepEqual(calls,[[target,record.method,record.params]]);
});
