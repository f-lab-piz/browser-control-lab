// 기동과 독립 판독만 Playwright를 사용한다. 제품 조작은 client.js를 통한다.
import {chromium} from 'playwright';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import {startBridge} from '../../bridge/server.mjs';
import {bridgeClient} from '../../bridge/client.mjs';
import {startFixture} from '../../test-site/server.mjs';
import {buildExtension} from '../../scripts/build-extension.mjs';

export const resultText=r=>r.result?.content?.filter(c=>c.type==='text').map(c=>c.text).join('\n');
export async function productRuntime(name){
 const evidence=[],startedAt=new Date().toISOString();
 const output=process.env.BCL_RUN_DIR||'output/requirements-runtime/'+name+'-'+startedAt.replace(/[:.]/g,'-');
 let root,bridge,fixture,context;
 async function close(){
  try{
   await mkdir(output,{recursive:true});
   const files=['bridge/server.mjs','extension/runtime-worker.mjs','extension/transform.mjs','extension/api-source.mjs','extension/offscreen.js','extension/browser-engine.mjs','extension/page-agent.mjs','extension/files.mjs','tests/helpers/product-runtime.mjs','tests/requirements-runtime.test.mjs','test-site/server.mjs','test-site/audit.html','test-site/audit.js','test-site/index.html','test-site/fixture.js','docs/runtime-usage.md','docs/api-catalog.json','package.json','package-lock.json'];
   const sourceSha256=Object.fromEntries(await Promise.all(files.map(async f=>[f,createHash('sha256').update(await readFile(f)).digest('hex')])));
   await writeFile(path.join(output,'results.json'),JSON.stringify({grade:'HTTP-extension-QuickJS-product',name,startedAt,finishedAt:new Date().toISOString(),browser:context?.browser()?.version(),headed:process.env.HEADED==='1',head:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),dirty:Boolean(execFileSync('git',['status','--porcelain'],{encoding:'utf8'}).trim()),sourceSha256,evidence},null,2));
  }finally{
   try{await context?.close()}finally{try{await bridge?.close()}finally{await fixture?.close();if(root)await rm(root,{recursive:true,force:true})}}
  }
 }
 try{
  root=await mkdtemp(path.join(os.tmpdir(),'bcl-requirements-'));await mkdir(path.join(root,'downloads'));
  fixture=await startFixture();bridge=await startBridge({downloadRoots:[path.join(root,'downloads')]});
  const client=bridgeClient(bridge.url,bridge.token);
  const directory=await buildExtension({directory:path.join(root,'extension'),connection:{url:bridge.url,token:bridge.extensionToken}});
  const fallback=path.join(os.homedir(),'Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
  context=await chromium.launchPersistentContext(path.join(root,'profile'),{executablePath:process.env.TEST_CHROME||(existsSync(fallback)?fallback:undefined),headless:process.env.HEADED!=='1',downloadsPath:path.join(root,'downloads'),acceptDownloads:true,args:['--window-size=1440,1100','--site-per-process','--host-resolver-rules=MAP app.test 127.0.0.1, MAP portal.test 127.0.0.1, MAP mail.test 127.0.0.1, MAP calendar.test 127.0.0.1','--no-proxy-server','--disable-extensions-except='+directory,'--load-extension='+directory]});
  let connected=false;
  for(let i=0;i<200;i++){if((await client.request('/v1/status')).connected){connected=true;break}await new Promise(r=>setTimeout(r,50))}
  if(!connected)throw Error('Product extension did not connect');
  const request=async(route,body,token=bridge.token)=>{
   const r=await fetch(bridge.url+route,{method:body===undefined?'GET':'POST',headers:{authorization:'Bearer '+token,'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});return {status:r.status,value:await r.json()};
  };
  return {bridge,client,request,fixture,context,output,evidence,close};
 }catch(error){await close();throw error}
}
