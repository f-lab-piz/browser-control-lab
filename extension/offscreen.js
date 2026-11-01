const connection=await fetch(chrome.runtime.getURL('connection.json')).then(r=>r.json());
const sessions=new Map();let callId=0;
async function api(path,data){const response=await fetch(connection.url+path,{method:data===undefined?'GET':'POST',headers:{authorization:'Bearer '+connection.token,'Content-Type':'application/json'},...(data===undefined?{}:{body:JSON.stringify(data)})});if(!response.ok)throw Error('Bridge HTTP '+response.status);return response.json()}
async function report(command,result){try{await api('/v1/extension/result',{requestId:command.requestId,sessionId:command.sessionId,generation:command.generation,result})}catch(error){console.warn('Result not accepted:',error.message)}}
function remove(sessionId){const session=sessions.get(sessionId);if(!session)return;session.worker.terminate();session.resolveReady?.(false);if(session.active){clearTimeout(session.active.timer);session.active=null}sessions.delete(sessionId)}
function create(command){
 const worker=new Worker(chrome.runtime.getURL('runtime-worker.js'),{type:'module'}),session={worker,generation:command.generation,active:null};session.ready=new Promise(resolve=>session.resolveReady=resolve);sessions.set(command.sessionId,session);
 worker.onmessage=async({data})=>{
  if(sessions.get(command.sessionId)!==session)return;
  if(data.type==='ready'){session.resolveReady(true);return}
  if(data.type==='host'){
   const response=await chrome.runtime.sendMessage({target:'background',method:data.method,args:data.args,sessionId:command.sessionId}).catch(error=>({error:error.message}));
   if(sessions.get(command.sessionId)===session)worker.postMessage({type:'hostResult',id:data.id,...response});return;
  }
  if(data.type==='result'&&session.active&&data.id===session.active.command.requestId){const active=session.active;session.active=null;clearTimeout(active.timer);if(data.result.runtimeReset){remove(command.sessionId);await chrome.runtime.sendMessage({target:'background',method:'session.reset',sessionId:command.sessionId,args:{}}).catch(()=>{})}await report(active.command,data.result)}
 };
 worker.onerror=async error=>{const active=session.active;remove(command.sessionId);if(active)await report(active.command,{error:{code:'WORKER_ERROR',message:error.message},runtimeReset:true})};
 return session;
}
async function execute(command){
 let session=sessions.get(command.sessionId);
 if(command.operation==='reset'){remove(command.sessionId);await chrome.runtime.sendMessage({target:'background',method:'session.reset',sessionId:command.sessionId,args:{}}).catch(()=>{});await report(command,{content:[],execution:'extension-worker',reset:true});return}
 if(!session||session.generation!==command.generation){remove(command.sessionId);session=create(command)}
 if(session.active){await report(command,{error:{code:'SESSION_BUSY',message:'Runtime already executing'}});return}
 session.active={command,timer:setTimeout(async()=>{remove(command.sessionId);await report(command,{error:{code:'TIMEOUT',message:'Execution timed out; runtime was reset'},runtimeReset:true})},command.timeoutMs+500)};
 if(!await session.ready)return;
 session.worker.postMessage({type:'execute',id:command.requestId,code:command.code,timeoutMs:command.timeoutMs});
}
for(;;){try{const command=await api('/v1/extension/next');if(command)execute(command).catch(error=>report(command,{error:{code:'DISPATCH_ERROR',message:error.message}}))}catch(error){await new Promise(resolve=>setTimeout(resolve,500))}}
