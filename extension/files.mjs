const connectionPromise=fetch(chrome.runtime.getURL('connection.json')).then(r=>r.json());
async function broker(path,data){const connection=await connectionPromise;const response=await fetch(connection.url+path,{method:data===undefined?'GET':'POST',headers:{authorization:'Bearer '+connection.token,'Content-Type':'application/json'},...(data===undefined?{}:{body:JSON.stringify(data)})});if(!response.ok)throw Error('File bridge: '+await response.text());return response}
function base64(bytes){let s='';for(let offset=0;offset<bytes.length;offset+=8192)s+=String.fromCharCode(...bytes.subarray(offset,offset+8192));return btoa(s)}
export async function uploadFiles({state,args,sessionId,context,send,dom,drop=false}){
 const frame=await context(state,args.frameId);let objectId;
 try{
  const target=args.backendNodeId?await send(state,'DOM.resolveNode',{backendNodeId:args.backendNodeId,executionContextId:frame.contextId},frame.sessionId):await send(state,'Runtime.callFunctionOn',{functionDeclaration:'function(q){return globalThis.__bcl.resolve(q)}',executionContextId:frame.contextId,arguments:[{value:args.query}],returnByValue:false},frame.sessionId);
  if(target.exceptionDetails)throw Error(target.exceptionDetails.exception?.description||target.exceptionDetails.text);objectId=target.object?.objectId||target.result?.objectId;if(!objectId)throw Error('FILE_TARGET_NOT_FOUND');
  const {node}=await send(state,'DOM.describeNode',{objectId},frame.sessionId),files=args.files==null?[]:Array.isArray(args.files)?args.files:[args.files];
  const local=files.filter(f=>typeof f==='string');if(local.length){if(drop)throw Error('Local-path file drop requires a browser-readable transfer; use an imported file reference');await send(state,'DOM.setFileInputFiles',{files:local,backendNodeId:node.backendNodeId},frame.sessionId)}
  const remote=files.filter(f=>typeof f!=='string'),transferId=crypto.randomUUID();
  await send(state,'Runtime.callFunctionOn',{functionDeclaration:'function(id,keep){this.__bclTransfers??=new Map();this.__bclTransfers.set(id,{files:keep?Array.from(this.files||[]):[],chunks:[]})}',objectId,arguments:[{value:transferId},{value:local.length>0}],returnByValue:true},frame.sessionId);
  try{
   for(const file of remote){
    let bytes,name=file.name||'file.bin',mimeType=file.mimeType||'application/octet-stream';
    if(file.fileId){const response=await broker('/v1/assets/'+encodeURIComponent(file.fileId)+'?sessionId='+encodeURIComponent(sessionId));bytes=new Uint8Array(await response.arrayBuffer());name=decodeURIComponent(response.headers.get('X-File-Name')||name);mimeType=response.headers.get('Content-Type')||mimeType}
    else if(file.bytes)bytes=new Uint8Array(file.bytes);else if(file.base64)bytes=Uint8Array.from(atob(file.base64),c=>c.charCodeAt(0));else throw Error('Expected fileId, bytes or base64 file content');
    if(bytes.length>32*1024*1024)throw Error('File exceeds 32 MiB');
    for(let offset=0;offset<bytes.length;offset+=196608){const chunk=base64(bytes.subarray(offset,offset+196608));await send(state,'Runtime.callFunctionOn',{functionDeclaration:'function(id,b64){this.__bclTransfers.get(id).chunks.push(Uint8Array.from(atob(b64),c=>c.charCodeAt(0)))}',objectId,arguments:[{value:transferId},{value:chunk}],returnByValue:true},frame.sessionId)}
    await send(state,'Runtime.callFunctionOn',{functionDeclaration:'function(id,name,type){const s=this.__bclTransfers.get(id);s.files.push(new File(s.chunks,name,{type}));s.chunks=[]}',objectId,arguments:[{value:transferId},{value:name},{value:mimeType}],returnByValue:true},frame.sessionId);
   }
   const result=await send(state,'Runtime.callFunctionOn',{functionDeclaration:'function(id,drop,data){const s=this.__bclTransfers.get(id),dt=new DataTransfer();for(const f of s.files)dt.items.add(f);for(const [type,value] of Object.entries(data||{}))dt.setData(type,value);if(drop){for(const name of ["dragenter","dragover","drop"])this.dispatchEvent(new DragEvent(name,{dataTransfer:dt,bubbles:true,cancelable:true}))}else{if(this.tagName!=="INPUT"||this.type!=="file")throw Error("Expected file input");this.files=dt.files;this.dispatchEvent(new Event("input",{bubbles:true}));this.dispatchEvent(new Event("change",{bubbles:true}))}return s.files.map(f=>({name:f.name,size:f.size,type:f.type}))}',objectId,arguments:[{value:transferId},{value:drop},{value:args.data||{}}],returnByValue:true},frame.sessionId);
   if(result.exceptionDetails)throw Error(result.exceptionDetails.exception?.description||result.exceptionDetails.text);return result.result.value;
  }finally{await send(state,'Runtime.callFunctionOn',{functionDeclaration:'function(id){this.__bclTransfers?.delete(id)}',objectId,arguments:[{value:transferId}],returnByValue:true},frame.sessionId).catch(()=>{})}
 }finally{if(objectId)await send(state,'Runtime.releaseObject',{objectId},frame.sessionId).catch(()=>{})}
}
export async function saveDownload({id,sessionId,downloads,roots,destination}){
 const info=downloads.get(id);if(!info||info.sessionId!==sessionId)throw Error('DOWNLOAD_NOT_OWNED_BY_SESSION');
 const deadline=Date.now()+30000;let item;
 while(Date.now()<deadline){[item]=await chrome.downloads.search({id:Number(id)});if(item?.state==='interrupted')throw Error('DOWNLOAD_INTERRUPTED: '+item.error);if(item?.state==='complete')break;await new Promise(r=>setTimeout(r,50))}
 if(item?.state!=='complete')throw Error('DOWNLOAD_TIMEOUT');
 if(destination?.target==='local'||destination==='local')return {name:item.filename.split(/[\\/]/).at(-1),path:item.filename,size:item.fileSize,state:item.state};
 const response=await broker('/v1/extension/download',{sessionId,path:item.filename,mimeType:item.mime});return response.json();
}
