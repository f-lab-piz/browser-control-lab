// 자체 확장 제품 조작과 외부 관찰자의 연결 여부를 분리하는 진단이다.
import {spawn} from 'node:child_process';
import {mkdtemp,mkdir,readFile,writeFile,rm,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import os from 'node:os';import path from 'node:path';
import {chromium} from 'playwright';
import {startBridge} from '../bridge/server.mjs';
import {bridgeClient} from '../bridge/client.mjs';
import {startFixture} from '../test-site/server.mjs';
import {buildExtension} from '../scripts/build-extension.mjs';
const dir=process.env.BCL_FRAME_DIR||'output/raw-frame-ab';await mkdir(dir,{recursive:true});
const root=await mkdtemp(path.join(os.tmpdir(),'bcl-raw-frame-'));let fixture,bridge,child,observer;
const observerMode=process.env.BCL_OBSERVER_MODE||'standard';
if(!['standard','nonpausing'].includes(observerMode))throw Error('Unknown observer mode');
const report={observerMode,grade:'diagnostic-product-extension; observer is the A/B variable',phases:[],traffic:[],sourceSha256:createHash('sha256').update(await readFile('extension/browser-engine.mjs')).digest('hex')};
const text=r=>r.result?.content?.filter(c=>c.type==='text').map(c=>c.text).join('\n');
try{
 fixture=await startFixture();fixture.server.on('request',(req,res)=>{const row={at:Date.now(),host:req.headers.host,url:req.url};report.traffic.push(row);res.on('finish',()=>{row.finishedAt=Date.now();row.status=res.statusCode})});
 bridge=await startBridge();const client=bridgeClient(bridge.url,bridge.token),session=await client.session();
 const extension=await buildExtension({directory:path.join(root,'extension'),connection:{url:bridge.url,token:bridge.extensionToken}});
 const binary=process.env.TEST_CHROME||path.join(os.homedir(),'Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
 child=spawn(binary,['--headless=new','--password-store=basic','--use-mock-keychain','--no-sandbox','--disable-background-networking','--disable-component-update','--disable-default-apps','--disable-search-engine-choice-screen','--enable-automation','--test-type','--enable-unsafe-extension-debugging','--no-first-run','--no-default-browser-check','--remote-debugging-port=0','--user-data-dir='+path.join(root,'profile'),'--window-size=1440,1100','--site-per-process','--host-resolver-rules=MAP app.test 127.0.0.1, MAP portal.test 127.0.0.1, MAP mail.test 127.0.0.1, MAP calendar.test 127.0.0.1','--no-proxy-server','--disable-extensions-except='+extension,'--load-extension='+extension,'about:blank'],{stdio:['ignore','ignore','pipe']});
 let stderr='';child.stderr.on('data',c=>{if(stderr.length<4000)stderr+=c});
 let port;
 for(let i=0;i<200;i++){
  try{port=Number((await readFile(path.join(root,'profile/DevToolsActivePort'),'utf8')).split('\n')[0])}catch{}
  if(port&&(await client.request('/v1/status')).connected)break;
  await new Promise(r=>setTimeout(r,50));
 }
 report.boot={port,status:await client.request('/v1/status'),exitCode:child.exitCode,signal:child.signalCode,stderr,files:await readdir(path.join(root,'profile')).catch(()=>[])};
 if(!port||!(await client.request('/v1/status')).connected)throw Error('Raw Chrome bootstrap failed: '+stderr.slice(-2000));
 for(const withObserver of [false,true]){
  if(withObserver&&observerMode==='standard')observer=await chromium.connectOverCDP('http://127.0.0.1:'+port);
  if(withObserver&&observerMode==='nonpausing'){
   const info=await fetch('http://127.0.0.1:'+port+'/json/version').then(r=>r.json());
   const socket=new WebSocket(info.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject});
   const transport={send(message){if(message.method==='Target.setAutoAttach')message={...message,params:{...message.params,waitForDebuggerOnStart:false}};socket.send(JSON.stringify(message))},close(){socket.close()}};
   socket.onmessage=e=>transport.onmessage?.(JSON.parse(e.data));socket.onclose=()=>transport.onclose?.();
   observer=await chromium.connectOverCDP(transport);
  }
  const phase={withObserver,cycles:[]};report.phases.push(phase);
  for(const [index,scenario] of ['mail','booking','mail','booking','mail','booking'].entries()){
   const url='http://app.test:'+fixture.port+'/?scenario='+scenario+'&cross=1',host=scenario==='mail'?'mail.test':'calendar.test',selector=scenario==='mail'?'[role="list"]':'[data-row="2"][data-col="8"]';
   const code=(index===0?'var rawPage=await browser.open('+JSON.stringify(url)+');':'await rawPage.goto('+JSON.stringify(url)+');')+`var selected;for(var until=Date.now()+10000;Date.now()<until;){selected=(await rawPage.frames()).find(f=>f.url.includes(${JSON.stringify(host)}));if(selected)break}if(!selected)throw Error('FRAME_DISCOVERY_TIMEOUT');await rawPage.frame(selected.id).locator(${JSON.stringify(selector)}).waitFor({state:'attached'});console.log(selected.url);`;
   const r=await client.js(session.id,code);phase.cycles.push({index,scenario,status:r.status,text:text(r),error:r.result?.error});
   if(r.status!=='completed'){phase.productFrames=await client.js(session.id,'console.log(await rawPage.frames())');break}
  }
 }
}catch(error){report.error=error.stack;process.exitCode=1}
finally{
 await writeFile(path.join(dir,'results.json'),JSON.stringify(report,null,2));
 await observer?.close().catch(()=>{});
 if(child&&child.exitCode===null&&child.signalCode===null)await new Promise(resolve=>{const timer=setTimeout(()=>child.kill('SIGKILL'),5000);child.once('exit',()=>{clearTimeout(timer);resolve()});child.kill('SIGTERM')});
 await bridge?.close();await fixture?.close();await rm(root,{recursive:true,force:true});
}
console.log(JSON.stringify({phases:report.phases,error:report.error}));
