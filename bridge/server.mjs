import http from 'node:http';
import crypto from 'node:crypto';
import {readFile,realpath,stat} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
export async function startBridge({port=0,token=crypto.randomBytes(32).toString('hex'),downloadRoots=[path.join(os.homedir(),'Downloads')]}={}){
 const extensionToken=crypto.randomBytes(32).toString('hex'),assets=new Map();
 const sessions=new Map(),requests=new Map(),queue=[];let poll=null,lastSeen=0;
 const json=(res,value,status=200)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(value))};
 const finish=(req,result)=>{if(!req||['completed','failed','cancelled'].includes(req.status))return;clearTimeout(req.timer);req.status=result.error?'failed':'completed';req.result=result;req.finishedAt=Date.now();const session=sessions.get(req.sessionId);if(result.runtimeReset&&session&&req.generation===session.generation)session.generation++;pump()};
 const dispatch=()=>{if(!poll)return;const index=queue.findIndex(c=>c.operation==='reset'||!queue.some(q=>q.sessionId===c.sessionId&&q!==c&&q.sequence<c.sequence)&&!Array.from(requests.values()).some(r=>r.sessionId===c.sessionId&&r.status==='running'));if(index<0)return;const command=queue.splice(index,1)[0],waiting=poll;poll=null;clearTimeout(waiting.timer);const req=requests.get(command.requestId);if(req){req.status='running';req.startedAt=Date.now()}json(waiting.res,command)};
 function pump(){dispatch()}
 const server=http.createServer(async(req,res)=>{
  const url=new URL(req.url,'http://127.0.0.1');
  try{
   if(req.headers.authorization!=='Bearer '+(url.pathname.startsWith('/v1/extension/')?extensionToken:token)&&!(url.pathname.startsWith('/v1/assets/')&&req.headers.authorization==='Bearer '+extensionToken))return json(res,{error:'Unauthorized'},401);
   if(req.headers.origin&&!req.headers.origin.startsWith('chrome-extension://'))return json(res,{error:'Unexpected origin'},403);
   if(url.pathname==='/v1/status')return json(res,{connected:Date.now()-lastSeen<25000,sessions:sessions.size,queued:queue.length});
   if(url.pathname==='/v1/extension/next'&&req.method==='GET'){
    lastSeen=Date.now();if(poll){clearTimeout(poll.timer);json(poll.res,null)}
    const waiter={res,timer:setTimeout(()=>{if(poll===waiter)poll=null;json(res,null)},15000)};poll=waiter;res.on('close',()=>{if(poll===waiter){clearTimeout(waiter.timer);poll=null}});pump();return;
   }
   if(url.pathname==='/v1/guide'){
    const catalog=JSON.parse(await readFile(path.join(root,'docs/api-catalog.json'),'utf8'));
    return json(res,{external:['guide','reset','js'],execution:'extension-worker/QuickJS-WASM',output:'Use console.log(value); values are not automatically printed.',instructions:await readFile(path.join(root,'docs/runtime-usage.md'),'utf8'),api:url.searchParams.get('api')?catalog.internal.find(a=>a.name===url.searchParams.get('api'))||null:catalog});
   }
   if(url.pathname==='/v1/assets'&&req.method==='POST'){
    const sessionId=url.searchParams.get('sessionId');if(!sessions.has(sessionId))throw Error('Unknown asset session');let size=0;const chunks=[];for await(const chunk of req){size+=chunk.length;if(size>32*1024*1024)throw Error('Asset exceeds 32 MiB');chunks.push(chunk)}
    const asset={id:crypto.randomUUID(),sessionId,name:path.basename(url.searchParams.get('name')||'file.bin'),mimeType:url.searchParams.get('mimeType')||'application/octet-stream',bytes:Buffer.concat(chunks)};assets.set(asset.id,asset);return json(res,{id:asset.id,name:asset.name,size:asset.bytes.length,mimeType:asset.mimeType},201);
   }
   const assetPath=url.pathname.match(/^\/v1\/assets\/([^/]+)$/);
   if(assetPath){const asset=assets.get(assetPath[1]);if(!asset)return json(res,{error:'Asset not found'},404);if(url.searchParams.get('sessionId')!==asset.sessionId)return json(res,{error:'Wrong asset session'},403);res.writeHead(200,{'Content-Type':asset.mimeType,'X-File-Name':encodeURIComponent(asset.name),'Content-Length':asset.bytes.length});res.end(asset.bytes);return}
   let body={};if(req.method==='POST'){let text='';for await(const c of req){text+=c;if(Buffer.byteLength(text)>(url.pathname==='/v1/extension/result'?1048576:262144))throw Error('Request body exceeds limit')}body=JSON.parse(text||'{}')}
   if(url.pathname==='/v1/extension/download'&&req.method==='POST'){
    if(!sessions.has(body.sessionId))throw Error('Unknown download session');const source=await realpath(body.path);const roots=await Promise.all(downloadRoots.map(r=>realpath(r).catch(()=>path.resolve(r))));if(!roots.some(r=>source.startsWith(r+path.sep)))throw Error('Download is outside allowed download roots');if((await stat(source)).size>32*1024*1024)throw Error('Download exceeds 32 MiB');const bytes=await readFile(source);const asset={id:crypto.randomUUID(),sessionId:body.sessionId,name:path.basename(source),mimeType:body.mimeType||'application/octet-stream',bytes};assets.set(asset.id,asset);return json(res,{fileId:asset.id,name:asset.name,size:bytes.length,path:source,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});
   }
   if(url.pathname==='/v1/extension/result'&&req.method==='POST'){
    lastSeen=Date.now();const request=requests.get(body.requestId);if(!request||request.sessionId!==body.sessionId||request.generation!==body.generation)return json(res,{error:'Stale result'},409);finish(request,body.result);return json(res,{ok:true});
   }
   if(url.pathname==='/v1/sessions'&&req.method==='POST'){
    if(sessions.size>=8)return json(res,{error:'Session limit reached'},429);
    const session={id:crypto.randomUUID(),generation:1,sequence:0};sessions.set(session.id,session);return json(res,session,201);
   }
   const resultPath=url.pathname.match(/^\/v1\/requests\/([^/]+)$/);
   if(resultPath){const r=requests.get(resultPath[1]);if(!r)return json(res,{error:'Request not found'},404);const {timer,...publicResult}=r;return json(res,publicResult)}
   const match=url.pathname.match(/^\/v1\/sessions\/([^/]+)\/(js|reset)$/);
   if(match&&req.method==='POST'){
    const session=sessions.get(match[1]);if(!session)return json(res,{error:'Session not found'},404);
    const operation=match[2];
    if(operation==='js'&&(typeof body.code!=='string'||Buffer.byteLength(body.code)>65536))throw Error('code must be a string of at most 64 KiB');
    if(operation==='js'&&Date.now()-lastSeen>25000)return json(res,{error:'Extension is not connected'},503);
    const requestId=body.requestId||crypto.randomUUID();if(requests.has(requestId)){const r=requests.get(requestId);if(r.sessionId!==session.id)throw Error('Request ID belongs to another session');return json(res,{requestId,status:r.status},202)}
    if(operation==='reset'){
     session.generation++;
     for(let i=queue.length-1;i>=0;i--)if(queue[i].sessionId===session.id)queue.splice(i,1);
     for(const r of requests.values())if(r.sessionId===session.id&&['queued','running'].includes(r.status)){clearTimeout(r.timer);r.status='cancelled';r.result={error:{code:'RESET',message:'Session reset; previous browser side effects may have occurred'}}}
    }
    const timeoutMs=Math.min(120000,Math.max(50,Number(body.timeoutMs)||30000));
    const command={requestId,sessionId:session.id,generation:session.generation,sequence:++session.sequence,operation,code:body.code,timeoutMs};
    const request={requestId,sessionId:session.id,generation:session.generation,status:'queued',createdAt:Date.now(),timer:setTimeout(()=>{const index=queue.findIndex(c=>c.requestId===requestId);if(index>=0)queue.splice(index,1);finish(request,{error:{code:'TRANSPORT_TIMEOUT',message:'Extension did not complete the request; inspect before retrying'},runtimeReset:false})},timeoutMs+20000)};
    requests.set(requestId,request);operation==='reset'?queue.unshift(command):queue.push(command);pump();return json(res,{requestId,generation:session.generation,status:request.status},202);
   }
   json(res,{error:'Not found'},404);
  }catch(error){json(res,{error:error.message},400)}
 });
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve)});
 return {url:'http://127.0.0.1:'+server.address().port,token,extensionToken,sessions,requests,async close(){for(const r of requests.values())clearTimeout(r.timer);if(poll){clearTimeout(poll.timer);json(poll.res,null);poll=null}await new Promise(resolve=>{server.close(resolve);server.closeAllConnections()})}};
}
