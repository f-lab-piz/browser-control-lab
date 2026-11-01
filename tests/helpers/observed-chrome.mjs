// The independent observer must not pause targets that the product extension owns.
// Playwright's public CDP transport keeps all observation APIs available while
// disabling only its debugger-start pause. Product commands use another channel.
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
export async function observedChrome({profile,executablePath,headless=true,downloadsPath,args=[]}){
 const child=spawn(executablePath||chromium.executablePath(),[
  ...(headless?['--headless=new']:[]),'--password-store=basic','--use-mock-keychain',
  '--no-sandbox','--disable-background-networking','--disable-component-update','--disable-default-apps',
  '--disable-search-engine-choice-screen','--enable-automation','--test-type',
  '--enable-unsafe-extension-debugging','--no-first-run','--no-default-browser-check',
  '--remote-debugging-port=0','--user-data-dir='+profile,...args,'about:blank'
 ],{stdio:['ignore','ignore','pipe']});
 let browser,socket,endpoint,stderr='';const observer={pauseOverrides:0};
 child.stderr.on('data',chunk=>{if(stderr.length<4000)stderr+=chunk});
 const exited=new Promise(resolve=>{child.once('error',error=>resolve({error}));child.once('exit',()=>resolve({}))});
 let spawnError;child.once('error',error=>{spawnError=error});
 async function close(){
  try{await browser?.close()}finally{
   socket?.close();
   if(child.exitCode===null&&child.signalCode===null&&!spawnError){
    const timer=setTimeout(()=>child.kill('SIGKILL'),5000);child.kill('SIGTERM');await exited;clearTimeout(timer);
   }
  }
 }
 try{
  let port;
  for(let i=0;i<200;i++){
   if(spawnError)throw spawnError;
   if(child.exitCode!==null||child.signalCode!==null)throw Error('Test Chrome exited: '+stderr);
   try{port=Number((await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0])}catch{}
   if(port)break;await new Promise(resolve=>setTimeout(resolve,50));
  }
  if(!port)throw Error('Test Chrome startup timeout: '+stderr);
  const info=await fetch('http://127.0.0.1:'+port+'/json/version').then(r=>r.json());
  endpoint=info.webSocketDebuggerUrl;socket=new WebSocket(endpoint);
  await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=()=>reject(Error('Observer websocket failed'))});
  const transport={
   send(message){
    if(message.method==='Target.setAutoAttach'&&message.params?.waitForDebuggerOnStart){
     observer.pauseOverrides++;message={...message,params:{...message.params,waitForDebuggerOnStart:false}};
    }
    socket.send(JSON.stringify(message));
   },
   close(){socket.close()}
  };
  socket.onmessage=event=>transport.onmessage?.(JSON.parse(event.data));socket.onclose=()=>transport.onclose?.();
  browser=await chromium.connectOverCDP(transport,{noDefaults:true});
  if(downloadsPath){
   const configuration=await browser.newBrowserCDPSession();
   // Keep the configuration session alive: Chrome resets its download override on detach.
   await configuration.send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:downloadsPath,eventsEnabled:true});
  }
  return {context:browser.contexts()[0],close,observer,inspectFrame:(id,selector)=>inspectFrame(endpoint,id,selector)};
 }catch(error){await close();throw error}
}

// Separate read-only oracle: no auto-attach, start pause, page-agent or product RPC.
// A nonpausing Playwright observer may miss an early iframe attachment event.
async function inspectFrame(endpoint,targetId,selector){
 const connection=new WebSocket(endpoint);const pending=new Map();let next=0;
 connection.onmessage=event=>{const message=JSON.parse(event.data),entry=pending.get(message.id);if(entry){pending.delete(message.id);clearTimeout(entry.timer);message.error?entry.reject(Error(message.error.message)):entry.resolve(message.result)}};
 const closed=()=>{for(const entry of pending.values()){clearTimeout(entry.timer);entry.reject(Error('Independent observer closed'))}pending.clear()};
 connection.onclose=closed;
 function send(method,params={},sessionId){return new Promise((resolve,reject)=>{const id=++next,timer=setTimeout(()=>{pending.delete(id);reject(Error('Independent observation timeout: '+method))},5000);pending.set(id,{resolve,reject,timer});connection.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}))})}
 try{
  await new Promise((resolve,reject)=>{connection.onopen=resolve;connection.onerror=()=>reject(Error('Independent observation connection failed'))});
  const {sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});
  const tree=await send('Page.getFrameTree',{},sessionId);
  const expression='({url:location.href,ready:document.readyState,found:Boolean(document.querySelector('+JSON.stringify(selector)+'))})';
  const result=await send('Runtime.evaluate',{expression,returnByValue:true},sessionId);
  if(result.exceptionDetails)throw Error('Independent DOM observation failed: '+result.exceptionDetails.text);
  return {frame:tree.frameTree.frame,document:result.result.value};
 }finally{connection.close();closed()}
}
