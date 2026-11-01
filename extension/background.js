import {browserCall} from './browser-engine.mjs';
let creating;
async function boot(){if(await chrome.offscreen.hasDocument())return;creating??=chrome.offscreen.createDocument({url:'offscreen.html',reasons:['WORKERS'],justification:'Run the user-requested browser automation JavaScript engine in an extension-owned worker'}).finally(()=>creating=null);await creating}
chrome.runtime.onInstalled.addListener(()=>boot().catch(console.error));chrome.runtime.onStartup.addListener(()=>boot().catch(console.error));boot().catch(console.error);
chrome.runtime.onMessage.addListener((message,sender,respond)=>{
 if(message.target!=='background')return;
 if(sender.id!==chrome.runtime.id){respond({error:'Invalid sender'});return}
 (async()=>{
  return browserCall(message.sessionId,message.method||'',message.args,{control:message.control,generation:message.generation,requestId:message.requestId});
 })().then(value=>respond({value}),error=>respond({error:error.message}));return true;
});
