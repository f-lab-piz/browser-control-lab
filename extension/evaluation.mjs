import {parse} from 'acorn';
import {stringifyJsonValue} from '../shared/json-value.mjs';

export function evaluationDeadline(scope,deadline){
 const timeoutError=()=>Error('WAIT_TIMEOUT: page.waitForFunction');
 let timer,expiredFlag=false;
 const expired=new Promise((_,reject)=>{
  const arm=()=>{
   const remaining=deadline-Date.now();
   if(remaining<=0){expiredFlag=true;reject(timeoutError());return}
   // Browser timers have a signed 32-bit delay. Recheck the absolute deadline
   // after each bounded interval rather than overflowing or expiring early.
   timer=setTimeout(arm,Math.min(remaining,2147483647));
  };
  arm();
 });
 expired.catch(()=>{});
 const assert=()=>{scope.assert();if(expiredFlag||Date.now()>=deadline)throw timeoutError()};
 const wait=async promise=>{const value=await Promise.race([promise,expired]);assert();return value};
 return {
  scope:{...scope,assert,call:async(dispatch,description)=>{assert();return wait(scope.call(()=>{assert();return dispatch()},description))}},
  wait,close:()=>clearTimeout(timer)
 };
}

export function evaluationSource(source){
 if(typeof source!=='string')throw Error('EVALUATION_ERROR: expected function source');
 try{
  const node=parse('('+source+')',{ecmaVersion:'latest'}).body[0]?.expression;
  if(!['FunctionExpression','ArrowFunctionExpression'].includes(node?.type))throw Error('Expected function');
  return '('+source+')';
 }catch{
  // Function#toString also returns object/getter/computed method syntax. Parse
  // its shape without evaluating the property key or adding a name binding.
  try{
   const wrapped='({'+source+'})',node=parse(wrapped,{ecmaVersion:'latest'}).body[0]?.expression;
   const property=node?.properties?.[0],fn=property?.value;
   if(node?.properties?.length!==1||fn?.type!=='FunctionExpression'||!(property.method||['get','set'].includes(property.kind)))throw Error('Expected method');
   const normalized=(fn.async?'async ':'')+'function'+(fn.generator?'*':'')+wrapped.slice(fn.start,fn.end);
   parse('('+normalized+')',{ecmaVersion:'latest'});return '('+normalized+')';
  }catch{throw Error('EVALUATION_ERROR: function cannot be transferred without its closure')}
 }
}

// The user function is compiled separately in the selected page context, then
// passed as an object reference. Its free variables cannot capture this wrapper.
export const EVALUATION_WRAPPER=`async function(fn,receiver,argumentJson,hasReceiver){
 'use strict';
 const serialize=(${stringifyJsonValue.toString()});
 const describe=error=>{try{return (error&&typeof error.message==='string'?error.message:String(error)).slice(0,65536)}catch{return 'User exception'}};
 let argument,value;
 try{argument=JSON.parse(argumentJson)}catch(error){return {ok:false,code:'SERIALIZATION_ERROR',message:describe(error)}}
 try{value=await (hasReceiver?fn(receiver,argument):fn(argument))}
 catch(error){return {ok:false,code:'EVALUATION_ERROR',message:describe(error)}}
 try{return {ok:true,json:serialize(value)}}
 catch(error){return {ok:false,code:'SERIALIZATION_ERROR',message:describe(error)}}
}`;
