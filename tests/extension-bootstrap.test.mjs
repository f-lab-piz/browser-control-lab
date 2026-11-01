// Transport feasibility probe, not the product JS runtime or 64 API implementation.
import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {mkdtemp,writeFile,rm,mkdir} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {chromium} from 'playwright';

test('unpacked extension receives an HTTP command and returns browser data through bridge',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'browser-control-probe-'));
 let context;const queue=[],pending=new Map();
 const server=http.createServer(async(req,res)=>{
  res.setHeader('Content-Type','application/json');res.setHeader('Access-Control-Allow-Origin','*');
  if(req.url==='/next'){res.end(JSON.stringify(queue.shift()||null));return}
  if(req.url==='/result'){
   let raw='';for await(const c of req)raw+=c;const result=JSON.parse(raw);const respond=pending.get(result.id);if(respond){pending.delete(result.id);respond.end(JSON.stringify(result))}res.end('{}');return;
  }
  if(req.url==='/command'){
   let raw='';for await(const c of req)raw+=c;const command=JSON.parse(raw);queue.push(command);pending.set(command.id,res);return;
  }
  res.end('{}');
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 try{
  const extension=path.join(root,'extension');await mkdir(extension);
  await writeFile(path.join(extension,'manifest.json'),JSON.stringify({manifest_version:3,name:'Browser Control HTTP Probe',version:'0.0.1',permissions:['tabs'],host_permissions:['http://127.0.0.1/*'],background:{service_worker:'worker.js'}}));
  await writeFile(path.join(extension,'worker.js'),`const base=${JSON.stringify(base)};\nconst until=Date.now()+20000;\nasync function tick(){try{const c=await fetch(base+'/next').then(r=>r.json());if(c){const value={extensionId:chrome.runtime.id,tabs:(await chrome.tabs.query({})).map(t=>({id:t.id,url:t.url}))};await fetch(base+'/result',{method:'POST',body:JSON.stringify({id:c.id,executedIn:'extension-service-worker',value})})}}catch(e){}if(Date.now()<until)setTimeout(tick,100)}tick();`);
  const fallback=path.join(os.homedir(),'Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
  const executablePath=process.env.TEST_CHROME||(existsSync(fallback)?fallback:undefined);
  context=await chromium.launchPersistentContext(path.join(root,'profile'),{executablePath,headless:process.env.HEADED!=='1',args:['--disable-extensions-except='+extension,'--load-extension='+extension]});
  const response=await fetch(base+'/command',{method:'POST',body:JSON.stringify({id:'probe-1',operation:'browser-info'}),signal:AbortSignal.timeout(15000)}).then(r=>r.json());
  assert.equal(response.executedIn,'extension-service-worker');assert(response.value.extensionId);assert(response.value.tabs.length>0);
  await mkdir('output/extension-bootstrap',{recursive:true});
  await writeFile('output/extension-bootstrap/results.json',JSON.stringify({grade:'extension-transport-probe',browser:context.browser()?.version(),response,productRuntimeImplemented:false},null,2));
 }finally{
  await context?.close();for(const res of pending.values())res.end('{"error":"probe closed"}');await new Promise(r=>{server.close(r);server.closeAllConnections()});await rm(root,{recursive:true,force:true});
 }
});
