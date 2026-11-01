const connection=await fetch(chrome.runtime.getURL('connection.json')).then(r=>r.json());
const sessions=new Map();
async function api(path,data){const response=await fetch(connection.url+path,{method:data===undefined?'GET':'POST',headers:{authorization:'Bearer '+connection.token,'Content-Type':'application/json'},...(data===undefined?{}:{body:JSON.stringify(data)})});if(!response.ok)throw Error('Bridge HTTP '+response.status);return response.json()}
async function report(command,result){try{await api('/v1/extension/result',{requestId:command.requestId,sessionId:command.sessionId,generation:command.generation,result})}catch(error){console.warn('Result not accepted:',error.message)}}
async function control(sessionId,generation,kind){const response=await chrome.runtime.sendMessage({target:'background',control:kind,sessionId,generation,args:{}});if(response?.error)throw Error(response.error);return response.value}
async function cleanup(sessionId,generation){try{return await control(sessionId,generation,'reset')}catch(error){return {status:'partial',trace:[],warnings:[{method:'session.reset',status:'failed',message:error.message}],inFlightEffectsUncertain:true}}}
function remove(sessionId,expected){const session=sessions.get(sessionId);if(!session||expected&&session!==expected)return;session.worker.terminate();session.resolveReady?.(false);if(session.active){clearTimeout(session.active.timer);session.active=null}sessions.delete(sessionId)}
async function finishReset(sessionId,session,active,result){
 remove(sessionId,session);
 const cleaned=await cleanup(sessionId,session.generation+1);
 await report(active.command,{...result,runtimeReset:true,rollback:false,cleanup:cleaned});
}
function create(command){
 const worker=new Worker(chrome.runtime.getURL('runtime-worker.js'),{type:'module'}),session={worker,generation:command.generation,active:null};
 const ready=new Promise(resolve=>session.resolveReady=resolve);sessions.set(command.sessionId,session);
 session.ready=Promise.all([ready,control(command.sessionId,command.generation,'start')]).then(([value])=>value);
 // execute awaits this promise, including errors, before dispatching guest code.
 session.ready.catch(()=>{});
 worker.onmessage=async({data})=>{
  if(sessions.get(command.sessionId)!==session)return;
  if(data.type==='ready'){session.resolveReady(true);return}
  if(data.type==='host'){
   const active=session.active;
   if(!active||data.requestId!==active.command.requestId){worker.postMessage({type:'hostResult',id:data.id,error:'NO_ACTIVE_REQUEST: host call is no longer active'});return}
   const response=await chrome.runtime.sendMessage({target:'background',method:data.method,args:data.args,sessionId:command.sessionId,generation:session.generation,requestId:data.requestId}).catch(error=>({error:error.message}));
   if(sessions.get(command.sessionId)===session)worker.postMessage({type:'hostResult',id:data.id,...response});return;
  }
  if(data.type==='result'&&session.active&&data.id===session.active.command.requestId){
   const active=session.active;session.active=null;clearTimeout(active.timer);
   if(data.result.runtimeReset)await finishReset(command.sessionId,session,active,data.result);
   else await report(active.command,data.result);
  }
 };
 worker.onerror=async error=>{
  if(sessions.get(command.sessionId)!==session)return;
  const active=session.active;
  if(active){session.active=null;clearTimeout(active.timer);await finishReset(command.sessionId,session,active,{error:{code:'WORKER_ERROR',message:error.message}})}
  else remove(command.sessionId,session);
 };
 return session;
}
async function execute(command){
 if(command.operation==='reset'){
  remove(command.sessionId);
  const cleaned=await cleanup(command.sessionId,command.generation);
  await report(command,{content:[],execution:'extension-worker',reset:true,runtimeReset:true,rollback:false,cleanup:cleaned});return;
 }
 let session=sessions.get(command.sessionId);
 if(!session||session.generation!==command.generation){remove(command.sessionId);session=create(command)}
 if(session.active){await report(command,{error:{code:'SESSION_BUSY',message:'Runtime already executing'}});return}
 const active={command};session.active=active;
 active.timer=setTimeout(async()=>{
  if(sessions.get(command.sessionId)!==session||session.active!==active)return;
  session.active=null;
  await finishReset(command.sessionId,session,active,{error:{code:'TIMEOUT',message:'Execution timed out; runtime was reset'}});
 },command.timeoutMs+500);
 try{
  if(!await session.ready||sessions.get(command.sessionId)!==session||session.active!==active)return;
  session.worker.postMessage({type:'execute',id:command.requestId,code:command.code,timeoutMs:command.timeoutMs});
 }catch(error){
  if(sessions.get(command.sessionId)!==session||session.active!==active)return;
  session.active=null;clearTimeout(active.timer);
  await finishReset(command.sessionId,session,active,{error:{code:'DISPATCH_ERROR',message:error.message}});
 }
}
for(;;){try{const command=await api('/v1/extension/next');if(command)execute(command).catch(error=>report(command,{error:{code:'DISPATCH_ERROR',message:error.message}}))}catch(error){await new Promise(resolve=>setTimeout(resolve,500))}}
