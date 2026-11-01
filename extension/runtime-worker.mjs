import {newQuickJSWASMModuleFromVariant,newVariant} from 'quickjs-emscripten-core';
import variant from '@jitl/quickjs-wasmfile-release-sync';
import {transformCode} from './transform.mjs';
import {installBrowserApi} from './api-source.mjs';
const binary=await fetch(new URL('quickjs.wasm',import.meta.url)).then(r=>r.arrayBuffer());
const engine=await newQuickJSWASMModuleFromVariant(newVariant(variant,{wasmBinary:binary}));
const runtime=engine.newRuntime();runtime.setMemoryLimit(64*1024*1024);runtime.setMaxStackSize(512*1024);
const vm=runtime.newContext(),pending=new Map();let nextId=0,current=null;
const parseValue=value=>vm.unwrapResult(vm.evalCode('('+JSON.stringify(value===undefined?null:value)+')'));
function setFunction(name,fn){const handle=vm.newFunction(name,fn);vm.setProp(vm.global,name,handle);handle.dispose()}
setFunction('__print',(...args)=>{
 if(!current)return vm.undefined;if(current.content.length>=256){current.truncated=true;return vm.undefined}const values=args.map(h=>vm.dump(h));let text=values.map(v=>typeof v==='string'?v:JSON.stringify(v)).join(' ');const remaining=65536-current.bytes;if(remaining<=0){current.truncated=true;return vm.undefined}let bytes=new TextEncoder().encode(text);if(bytes.length>remaining){text=new TextDecoder().decode(bytes.slice(0,remaining),{stream:true});bytes=new TextEncoder().encode(text);current.truncated=true}current.bytes+=bytes.length;current.content.push({type:'text',text});return vm.undefined;
});
setFunction('__hostCall',(methodHandle,argsHandle)=>{
 const promise=vm.newPromise(),id=++nextId;pending.set(id,promise);postMessage({type:'host',id,method:vm.getString(methodHandle),args:vm.dump(argsHandle)});return promise.handle;
});
vm.unwrapResult(vm.evalCode(`globalThis.console={log:(...args)=>__print(...args)};`)).dispose();
vm.unwrapResult(vm.evalCode('('+installBrowserApi.toString()+')()')).dispose();
setFunction('display',value=>{if(current){const image=vm.dump(value);if(image?.type!=='image')throw Error('display expects an image result');current.content.push(image)}return vm.undefined});
runtime.setInterruptHandler(()=>Boolean(current&&Date.now()>current.deadline));
function pump(){const result=runtime.executePendingJobs(64);if(result.error){const error=vm.dump(result.error);result.error.dispose();if(current)current.jobError=error}}
onmessage=async({data})=>{
 if(data.type==='hostResult'){
  const deferred=pending.get(data.id);if(!deferred)return;pending.delete(data.id);
  if(data.error){const error=vm.newError(data.error);deferred.reject(error);error.dispose()}else{const handle=parseValue(data.value);deferred.resolve(handle);handle.dispose()}
  deferred.dispose();pump();return;
 }
 if(data.type!=='execute')return;
 if(current){postMessage({type:'result',id:data.id,result:{error:{code:'SESSION_BUSY',message:'Runtime busy'}}});return}
 const started=performance.now();current={content:[],bytes:0,truncated:false,deadline:Date.now()+data.timeoutMs};let handle,timer;
 try{
  const code=transformCode(data.code),result=vm.evalCode(code,'request-'+data.id+'.mjs',{type:'module'});
  if(result.error){const error=vm.dump(result.error);result.error.dispose();throw Error(error?.message||JSON.stringify(error))}
  handle=result.value;timer=setInterval(pump,5);pump();
  const settled=await vm.resolvePromise(handle);
  if(settled.error){const error=vm.dump(settled.error);settled.error.dispose();throw Error(error?.message||JSON.stringify(error))}
  settled.value.dispose();
  postMessage({type:'result',id:data.id,result:{execution:'extension-worker/QuickJS-WASM',content:current.content,truncated:current.truncated,metrics:{durationMs:performance.now()-started,outputChars:current.bytes}}});
 }catch(error){postMessage({type:'result',id:data.id,result:{execution:'extension-worker/QuickJS-WASM',content:current.content,error:{code:Date.now()>current.deadline?'TIMEOUT':'JS_ERROR',message:error.message},runtimeReset:Date.now()>current.deadline,metrics:{durationMs:performance.now()-started}}})}
 finally{clearInterval(timer);handle?.dispose();current=null}
};

postMessage({type:'ready'});
