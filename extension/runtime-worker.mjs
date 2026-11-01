import {newQuickJSWASMModuleFromVariant,newVariant} from 'quickjs-emscripten-core';
import variant from '@jitl/quickjs-wasmfile-release-sync';
import {transformCode} from './transform.mjs';
import {OutputBuffer,installConsole} from './output.mjs';
import {LIMITS} from '../shared/limits.mjs';
import {installBrowserApi} from './api-source.mjs';
// QuickJS public flags: GLOBAL(0) | STRICT(1<<3) | ASYNC(1<<7).
// https://github.com/bellard/quickjs/blob/master/quickjs.h
const GLOBAL_ASYNC_STRICT=(1<<3)|(1<<7);
const binary=await fetch(new URL('quickjs.wasm',import.meta.url)).then(r=>r.arrayBuffer());
const engine=await newQuickJSWASMModuleFromVariant(newVariant(variant,{wasmBinary:binary}));
const runtime=engine.newRuntime();runtime.setMemoryLimit(LIMITS.memoryBytes);runtime.setMaxStackSize(LIMITS.stackBytes);
const vm=runtime.newContext(),pending=new Map();let nextId=0,nextRequest=0,current=null;
const parseValue=value=>vm.unwrapResult(vm.evalCode('('+JSON.stringify(value===undefined?null:value)+')'));
function setFunction(name,fn){const handle=vm.newFunction(name,fn);vm.setProp(vm.global,name,handle);handle.dispose()}
setFunction('__print',value=>{if(current)current.output.text(JSON.parse(vm.getString(value)));return vm.undefined});
setFunction('__hostCall',(methodHandle,argsHandle)=>{
 const promise=vm.newPromise(),id=++nextId;pending.set(id,promise);postMessage({type:'host',id,method:vm.getString(methodHandle),args:vm.dump(argsHandle)});return promise.handle;
});
vm.unwrapResult(vm.evalCode('('+installConsole.toString()+')()')).dispose();
vm.unwrapResult(vm.evalCode('('+installBrowserApi.toString()+')()')).dispose();
setFunction('display',value=>{if(current)current.output.image(vm.dump(value));return vm.undefined});
runtime.setInterruptHandler(()=>Boolean(current&&Date.now()>current.deadline));
function guestError(handle){
 const dumped=vm.dump(handle);let name=dumped?.name;
 if(dumped&&typeof dumped==='object'){const property=vm.getProp(handle,'name');try{name=vm.getString(property)}finally{property.dispose()}}
 return Object.assign(Error(dumped?.message||JSON.stringify(dumped)),{guestName:name});
}
function pump(){const result=runtime.executePendingJobs(64);if(result.error){const error=vm.dump(result.error);result.error.dispose();if(current)current.jobError=error}}
onmessage=async({data})=>{
 if(data.type==='hostResult'){
  const deferred=pending.get(data.id);if(!deferred)return;pending.delete(data.id);
  if(data.error){const error=vm.newError(data.error);deferred.reject(error);error.dispose()}else{const handle=parseValue(data.value);deferred.resolve(handle);handle.dispose()}
  deferred.dispose();pump();return;
 }
 if(data.type!=='execute')return;
 if(current){postMessage({type:'result',id:data.id,result:{error:{code:'SESSION_BUSY',message:'Runtime busy'}}});return}
 const started=performance.now();current={output:new OutputBuffer(),deadline:Date.now()+data.timeoutMs};let handle,timer;
 try{
  // 임의 식별자를 C filename으로 넘기지 않고 짧은 진단용 이름을 쓴다.
  const code=transformCode(data.code),result=vm.evalCode(code,'request-'+(++nextRequest)+'.js',GLOBAL_ASYNC_STRICT);
  if(result.error){const error=guestError(result.error);result.error.dispose();throw error}
  handle=result.value;timer=setInterval(pump,5);pump();
  const settled=await vm.resolvePromise(handle);
  if(settled.error){const error=guestError(settled.error);settled.error.dispose();throw error}
  settled.value.dispose();
  postMessage({type:'result',id:data.id,result:current.output.result({execution:'extension-worker/QuickJS-WASM',metrics:{durationMs:performance.now()-started}})});
 }catch(error){
  const timeout=Date.now()>current.deadline;
  const resource=error instanceof RangeError&&/call stack|stack overflow/i.test(error.message)?'stack':['InternalError','RangeError'].includes(error.guestName)?(/out of memory/i.test(error.message)?'memory':/stack (?:size |overflow)|call stack/i.test(error.message)?'stack':null):null;
  postMessage({type:'result',id:data.id,result:current.output.result({execution:'extension-worker/QuickJS-WASM',error:{code:timeout?'TIMEOUT':resource?'RESOURCE_LIMIT':'JS_ERROR',...(resource?{reason:resource}:{}),message:error.message},runtimeReset:timeout||Boolean(resource),metrics:{durationMs:performance.now()-started}})})
 }
 finally{clearInterval(timer);handle?.dispose();current=null}
};

postMessage({type:'ready'});
