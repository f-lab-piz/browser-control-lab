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
 let browser,socket,stderr='';const observer={pauseOverrides:0};
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
  socket=new WebSocket(info.webSocketDebuggerUrl);
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
  return {context:browser.contexts()[0],close,observer};
 }catch(error){await close();throw error}
}
