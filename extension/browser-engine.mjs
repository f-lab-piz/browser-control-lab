import {uploadFiles,saveDownload} from './files.mjs';
import {installPageAgent} from './page-agent.mjs';
const tabs=new Map(),owners=new Map(),downloads=new Map();
function emit(state,type,payload){for(const waiter of [...(state.waiters||[])])if(waiter.type===type){state.waiters.delete(waiter);clearTimeout(waiter.timer);waiter.resolve(payload)}}
function waitEvent(state,type,timeout=10000){state.waiters??=new Set();return new Promise((resolve,reject)=>{const waiter={type,resolve,reject,timer:setTimeout(()=>{state.waiters.delete(waiter);reject(Error('EVENT_TIMEOUT: '+type))},timeout)};state.waiters.add(waiter)})}
function matchPopup(tab){const source=tabs.get(tab.openerTabId)||[...tabs.values()].find(s=>s.pendingPopup&&(tab.pendingUrl===s.pendingPopup.url||tab.url===s.pendingPopup.url));if(source&&[...(source.waiters||[])].some(w=>w.type==='popup')){owners.set(tab.id,owners.get(source.tabId));source.pendingPopup=null;emit(source,'popup',{tabId:tab.id})}}
chrome.tabs.onCreated.addListener(matchPopup);chrome.tabs.onUpdated.addListener((id,change,tab)=>{if(change.url)matchPopup(tab)});
chrome.tabs.onRemoved.addListener(tabId=>{const state=tabs.get(tabId);if(state)emit(state,'close',{});tabs.delete(tabId);owners.delete(tabId)});
chrome.downloads.onCreated.addListener(async item=>{const candidates=[];for(const state of tabs.values()){if(![...(state.waiters||[])].some(w=>w.type==='download'))continue;const tab=await chrome.tabs.get(state.tabId).catch(()=>null);if(!tab)continue;const origin=new URL(tab.url).origin;if((item.url||'').startsWith(origin)||(item.url||'').startsWith('blob:'+origin)||(item.referrer||'').startsWith(origin))candidates.push(state)}if(candidates.length===1){const state=candidates[0];downloads.set(item.id,{sessionId:owners.get(state.tabId),tabId:state.tabId});emit(state,'download',{id:item.id,url:item.url,name:item.filename?.split(/[\\/]/).at(-1)})}else if(candidates.length>1){for(const state of candidates)for(const w of [...state.waiters])if(w.type==='download'){state.waiters.delete(w);clearTimeout(w.timer);w.reject(Error('AMBIGUOUS_DOWNLOAD'))}}});
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const send=(state,method,params={},sessionId)=>chrome.debugger.sendCommand({tabId:state.tabId,...(sessionId?{sessionId}:{})},method,params);
function recordTree(state,tree,parent=null,sessionId){const old=state.frames.get(tree.frame.id);state.frames.set(tree.frame.id,{...old,id:tree.frame.id,parent:tree.frame.parentId||parent||old?.parent||null,name:tree.frame.name||'',url:tree.frame.url,sessionId:old?.sessionId||sessionId});for(const child of tree.childFrames||[])recordTree(state,child,tree.frame.id,sessionId)}
async function initializeTarget(state,sessionId){await send(state,'Page.enable',{},sessionId);await send(state,'Runtime.enable',{},sessionId);await send(state,'Target.setAutoAttach',{autoAttach:true,flatten:true,waitForDebuggerOnStart:false},sessionId);const tree=await send(state,'Page.getFrameTree',{},sessionId);recordTree(state,tree.frameTree,null,sessionId);if(!sessionId)state.mainFrame=tree.frameTree.frame.id}
chrome.debugger.onEvent.addListener((source,method,params)=>{
 const state=tabs.get(source.tabId);if(!state)return;
 if(method==='Input.dragIntercepted')emit(state,'dragdata',params.data);
 if(method==='Page.windowOpen'){state.pendingPopup=params;state.logs.push({at:Date.now(),level:'debug',text:'Popup requested: '+params.url})}
 if(method==='Page.domContentEventFired')emit(state,'domcontentloaded',{});
 if(method==='Page.loadEventFired')emit(state,'load',{});
 if(method==='Page.fileChooserOpened')emit(state,'filechooser',{frameId:params.frameId,backendNodeId:params.backendNodeId,multiple:params.mode==='selectMultiple'});
 if(method==='Page.javascriptDialogOpening'){state.dialog=params;emit(state,'dialog',{type:params.type,message:params.message,defaultPrompt:params.defaultPrompt})}
 if(method==='Target.attachedToTarget'&&params.targetInfo.type==='iframe'){
  state.childSessions.add(params.sessionId);const old=state.frames.get(params.targetInfo.targetId)||{};state.frames.set(params.targetInfo.targetId,{...old,id:params.targetInfo.targetId,parent:old.parent||params.targetInfo.parentFrameId,sessionId:params.sessionId,url:params.targetInfo.url});initializeTarget(state,params.sessionId).catch(error=>state.errors.push(error.message));
 }
 if(method==='Page.frameNavigated'){
  const f=params.frame;if(!f.parentId&&!source.sessionId)emit(state,'navigation',{url:f.url});const old=state.frames.get(f.id)||{};state.frames.set(f.id,{...old,id:f.id,parent:f.parentId||old.parent||null,name:f.name||'',url:f.url,sessionId:source.sessionId,contextId:undefined});
 }
 if(method==='Page.frameDetached'&&params.reason!=='swap')state.frames.delete(params.frameId);
 if(method==='Runtime.executionContextsCleared')for(const frame of state.frames.values())if(frame.sessionId===source.sessionId)frame.contextId=undefined;
 if(method==='Runtime.consoleAPICalled')state.logs.push({at:Date.now(),level:params.type,text:params.args.map(a=>a.value??a.description??'').join(' ')});
 if(method==='Runtime.exceptionThrown')state.logs.push({at:Date.now(),level:'error',text:params.exceptionDetails.exception?.description||params.exceptionDetails.text});
 if(state.logs.length>200)state.logs.shift();
});
chrome.debugger.onDetach.addListener(source=>{tabs.delete(source.tabId)});
async function attach(sessionId,tabId){
 tabId=Number(tabId);let tab=await chrome.tabs.get(tabId);for(let retry=0;retry<100&&!tab.url&&!tab.pendingUrl;retry++){await delay(25);tab=await chrome.tabs.get(tabId)}const effectiveUrl=tab.pendingUrl||tab.url||'';if(!/^https?:/.test(effectiveUrl)&&!(effectiveUrl==='about:blank'&&owners.get(tabId)===sessionId))throw Error('Only HTTP(S) pages can be controlled');
 const owner=owners.get(tabId);if(owner&&owner!==sessionId)throw Error('TAB_OWNED_BY_ANOTHER_SESSION');owners.set(tabId,sessionId);
 let state=tabs.get(tabId);if(!state){state={tabId,frames:new Map(),childSessions:new Set(),logs:[],errors:[],snapshots:new Map(),frameAliases:new Map()};tabs.set(tabId,state);try{await chrome.debugger.attach({tabId},'1.3');await initializeTarget(state)}catch(error){tabs.delete(tabId);owners.delete(tabId);throw error}}
 return state;
}
async function context(state,frameId){
 const tree=await send(state,'Page.getFrameTree');recordTree(state,tree.frameTree);state.mainFrame=tree.frameTree.frame.id;const id=frameId||state.mainFrame;
 for(let attempt=0;attempt<20;attempt++){
  const frame=state.frames.get(id);if(!frame)throw Error('FRAME_NOT_FOUND');
  if(frame.contextId)return frame;
  const sessions=[...new Set([frame.sessionId,undefined,...state.childSessions])];
  for(const sessionId of sessions)try{
   const {executionContextId}=await send(state,'Page.createIsolatedWorld',{frameId:id,worldName:'browser-control-lab'},sessionId);
   const injected=await send(state,'Runtime.evaluate',{expression:'('+installPageAgent.toString()+')()',contextId:executionContextId,returnByValue:true},sessionId);if(injected.exceptionDetails)throw Error(injected.exceptionDetails.text);frame.contextId=executionContextId;frame.sessionId=sessionId;return frame;
  }catch{}
  await delay(50);
 }
 throw Error('FRAME_CONTEXT_UNAVAILABLE');
}
async function ready(state,loaderId){
 const deadline=Date.now()+10000;
 while(Date.now()<deadline){try{if(loaderId){const tree=await send(state,'Page.getFrameTree');if(tree.frameTree.frame.loaderId!==loaderId){await delay(25);continue}}const frame=await context(state);const result=await send(state,'Runtime.evaluate',{expression:'document.readyState!=="loading" && Boolean(document.body)',contextId:frame.contextId,returnByValue:true},frame.sessionId);if(result.result.value)return true}catch{for(const frame of state.frames.values())frame.contextId=undefined}await delay(50)}
 throw Error('DOCUMENT_READY_TIMEOUT');
}
async function dom(state,frameId,method,args={}){const frame=await context(state,frameId);const result=await send(state,'Runtime.callFunctionOn',{functionDeclaration:'function(method,args){return globalThis.__bcl.call(method,args)}',executionContextId:frame.contextId,arguments:[{value:method},{value:args}],returnByValue:true,awaitPromise:true},frame.sessionId);if(result.exceptionDetails)throw Error(result.exceptionDetails.exception?.description||result.exceptionDetails.text);return result.result.value}
async function rootPoint(state,frameId,p){
 const frame=await context(state,frameId);if(!frame.parent)return p;const parent=await context(state,frame.parent);
 const {backendNodeId}=await send(state,'DOM.getFrameOwner',{frameId:frame.id},parent.sessionId);const {object}=await send(state,'DOM.resolveNode',{backendNodeId},parent.sessionId);
 try{
  await send(state,'DOM.scrollIntoViewIfNeeded',{objectId:object.objectId,rect:{x:p.x,y:p.y,width:2,height:2}},parent.sessionId);
  const result=await send(state,'Runtime.callFunctionOn',{objectId:object.objectId,functionDeclaration:'function(){const r=this.getBoundingClientRect();const style=getComputedStyle(this),m=new DOMMatrix(style.transform);if(!m.is2D||m.a<=0||m.d<=0||Math.abs(m.b)>1e-6||Math.abs(m.c)>1e-6)throw Error("ROTATED_FRAME_UNSUPPORTED");return {x:r.x+this.clientLeft*r.width/this.offsetWidth,y:r.y+this.clientTop*r.height/this.offsetHeight,sx:r.width/this.offsetWidth,sy:r.height/this.offsetHeight}}',returnByValue:true},parent.sessionId);
  if(result.exceptionDetails)throw Error(result.exceptionDetails.exception?.description||result.exceptionDetails.text);return rootPoint(state,frame.parent,{x:p.x*result.result.value.sx+result.result.value.x,y:p.y*result.result.value.sy+result.result.value.y});
 }finally{await send(state,'Runtime.releaseObject',{objectId:object.objectId},parent.sessionId).catch(()=>{})}
}
async function point(state,args){const box=await dom(state,args.frameId,'point',{query:args.query});const p=await rootPoint(state,args.frameId,{x:box.x,y:box.y});await evaluate(state,{source:'()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))'});const frame=await context(state,args.frameId);return {...p,input:frame.sessionId?{x:box.x,y:box.y,sessionId:frame.sessionId}:undefined}}

async function mouse(state,type,args){
 state.pointer??={x:0,y:0};
 const implicit=args.x===undefined&&args.y===undefined;
 const p={x:args.x??state.pointer.x,y:args.y??state.pointer.y,input:args.input??(implicit?state.pointer.input:undefined)};
 state.pointer=p;const wire=p.input||p,button=args.button||'left';
 await send(state,'Input.dispatchMouseEvent',{type,x:wire.x,y:wire.y,button:type==='mouseMoved'?(state.buttons?({1:'left',2:'right',4:'middle'}[state.buttons]||'left'):'none'):button,buttons:type==='mousePressed'?({left:1,right:2,middle:4}[button]):type==='mouseReleased'?0:(state.buttons||0),clickCount:args.clickCount||1,modifiers:args.modifiers||0,...(type==='mouseWheel'?{deltaX:args.deltaX||0,deltaY:args.deltaY||0}:{})},wire.sessionId);
 state.buttons=type==='mousePressed'?({left:1,right:2,middle:4}[button]):type==='mouseReleased'?0:(state.buttons||0);return true;
}
function modifiers(keys=[]){return keys.reduce((mask,key)=>mask|({Alt:1,Control:2,Meta:4,Shift:8}[key]||0),0)}
async function click(state,args){if(state.arming)await state.arming;state.lastActionAt=Date.now();const p=await point(state,args),options=args.options||{},count=options.clickCount||1;await mouse(state,'mouseMoved',p);for(let i=1;i<=count;i++){await mouse(state,'mousePressed',{...p,button:options.button,clickCount:i,modifiers:modifiers(options.modifiers)});await mouse(state,'mouseReleased',{...p,button:options.button,clickCount:i,modifiers:modifiers(options.modifiers)})}return true}
async function evaluate(state,args,all=false){
 const frame=await context(state,args.frameId);let objectId;
 try{
  const argumentsList=[];
  if(args.query){const target=await send(state,'Runtime.callFunctionOn',{functionDeclaration:all?'function(q){return globalThis.__bcl.find(q)}':'function(q){return globalThis.__bcl.resolve(q)}',executionContextId:frame.contextId,arguments:[{value:args.query}],returnByValue:false},frame.sessionId);if(target.exceptionDetails)throw Error(target.exceptionDetails.exception?.description||target.exceptionDetails.text);objectId=target.result.objectId;argumentsList.push({objectId})}
  argumentsList.push({value:args.arg??null});
  const result=await send(state,'Runtime.callFunctionOn',{functionDeclaration:args.source,executionContextId:frame.contextId,arguments:argumentsList,returnByValue:true,awaitPromise:true},frame.sessionId);if(result.exceptionDetails)throw Error(result.exceptionDetails.exception?.description||result.exceptionDetails.text);return result.result.value;
 }finally{if(objectId)await send(state,'Runtime.releaseObject',{objectId},frame.sessionId).catch(()=>{})}
}
const keyCodes={Enter:13,Tab:9,Escape:27,Backspace:8,Delete:46,ArrowLeft:37,ArrowUp:38,ArrowRight:39,ArrowDown:40,Home:36,End:35,PageUp:33,PageDown:34,Control:17,Shift:16,Alt:18,Meta:91,' ':32};
async function key(state,type,name){
 state.keys??=new Set();if(type==='keyDown'&&['Control','Shift','Alt','Meta'].includes(name))state.keys.add(name);
 const virtual=keyCodes[name]||(name.length===1?name.toUpperCase().charCodeAt(0):0),mods=modifiers([...state.keys]);
 const char=name.length===1&&!(mods&6)?name:undefined;
 await send(state,'Input.dispatchKeyEvent',{type,key:name,windowsVirtualKeyCode:virtual,nativeVirtualKeyCode:virtual,modifiers:mods,...(char&&type==='keyDown'?{text:char,unmodifiedText:name}:{})});
 if(type==='keyUp')state.keys.delete(name);return true;
}
async function press(state,combination){const parts=combination==='+'?['+']:combination.split('+'),last=parts.pop();for(const mod of parts)await key(state,'keyDown',mod);await key(state,'keyDown',last);await key(state,'keyUp',last);for(const mod of parts.reverse())await key(state,'keyUp',mod);return true}
async function snapshot(state,args){
 const options=args.options||{},main=await context(state,args.frameId);const selected=new Set([main.id]);if(args.frameId){let changed=true;while(changed){changed=false;for(const f of state.frames.values())if(selected.has(f.parent)&&!selected.has(f.id)){selected.add(f.id);changed=true}}}const frames=args.frameId?[...state.frames.values()].filter(f=>selected.has(f.id)):[...state.frames.values()];const result={snapshotId:crypto.randomUUID(),text:'',frames:[],refs:[],truncated:false,nextCursor:null},rows=[];
 for(const frame of frames){try{if(options.root&&frame.id!==main.id)continue;const data=await dom(state,frame.id,'snapshot',{options});let alias=state.frameAliases.get(frame.id);if(!alias){alias='f'+state.frameAliases.size;state.frameAliases.set(frame.id,alias)}result.frames.push({id:frame.id,alias,parent:frame.parent,url:frame.url.slice(0,240),urlTruncated:frame.url.length>240,name:frame.name,status:'observed',documentId:data.documentId,depthLimited:data.depthLimited,nodeCount:data.nodes.length});for(const node of data.nodes){const qualified=alias+':'+data.documentId.slice(0,8)+':'+node.ref;rows.push({text:qualified+' '+(node.role||node.tag)+' '+JSON.stringify(node.name)+(node.visible===false?' [hidden]':'')+(node.offscreen?' [offscreen]':'')+(node.enabled===false?' [disabled]':'')+['checked','selected','expanded','readonly','busy'].filter(k=>node[k]!==undefined&&node[k]!==null&&(k!=='readonly'||node[k])).map(k=>' ['+k+'='+node[k]+']').join(''),meta:{ref:qualified,frameId:frame.id,role:node.role,name:node.name,checked:node.checked??undefined,selected:node.selected??undefined,expanded:node.expanded??undefined,readonly:node.readonly||undefined,busy:node.busy??undefined}})}}catch(error){result.frames.push({id:frame.id,status:'error',error:error.message})}}
 const cursor=Number(options.cursor)||0,maxChars=Math.min(100000,Math.max(1000,options.maxChars||16000)),maxNodes=Math.min(10000,options.maxNodes||500),maxOutputBytes=Math.min(60000,Math.max(4096,options.maxOutputBytes||48000));let index=cursor;
 for(;index<rows.length;index++){const row=rows[index];if(result.text.length+row.text.length>maxChars||result.refs.length>=maxNodes||new TextEncoder().encode(JSON.stringify({...result,text:result.text+row.text+'\n',refs:[...result.refs,row.meta]})).length>maxOutputBytes-2048){result.truncated=true;result.nextCursor=index;break}result.text+=row.text+'\n';result.refs.push(row.meta)}
 result.totalMatchedNodes=rows.length;result.metrics={chars:result.text.length,nodes:result.refs.length,frames:result.frames.length,bytes:new TextEncoder().encode(JSON.stringify(result)).length};
 if(options.since){const previous=state.snapshots.get(options.since);result.diff=previous&&previous.documents===JSON.stringify(result.frames.map(f=>[f.id,f.documentId]))?{added:result.text.split('\n').filter(l=>l&&!previous.text.split('\n').includes(l)),removed:previous.text.split('\n').filter(l=>l&&!result.text.split('\n').includes(l))}:{resetRequired:true}}
 if(new TextEncoder().encode(JSON.stringify(result)).length>maxOutputBytes&&result.diff)result.diff={resetRequired:true,reason:'DIFF_OUTPUT_BUDGET'};
 state.snapshots.set(result.snapshotId,{text:result.text,documents:JSON.stringify(result.frames.map(f=>[f.id,f.documentId]))});if(state.snapshots.size>8)state.snapshots.delete(state.snapshots.keys().next().value);return result;
}
async function captureScreenshot(state,options){
 const capture=params=>send(state,'Page.captureScreenshot',params);
 if(!options.clip){const params={format:'png',captureBeyondViewport:Boolean(options.fullPage)};if(options.fullPage){const m=await send(state,'Page.getLayoutMetrics');params.clip={x:0,y:0,width:m.cssContentSize.width,height:m.cssContentSize.height,scale:1}}return {type:'image',mimeType:'image/png',data:(await capture(params)).data}}
 if(options.fullPage)throw Error('clip and fullPage are mutually exclusive');
 const c=options.clip;if(![c.x,c.y,c.width,c.height].every(Number.isFinite)||c.x<0||c.y<0||c.width<=0||c.height<=0)throw Error('INVALID_SCREENSHOT_CLIP');
 const viewport=()=>evaluate(state,{source:'async()=>{await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));return {x:visualViewport?.pageLeft??scrollX,y:visualViewport?.pageTop??scrollY,w:innerWidth,h:innerHeight,dpr:devicePixelRatio}}'});
 const size=data=>{const bytes=Uint8Array.from(atob(data.slice(0,48)),c=>c.charCodeAt(0)),view=new DataView(bytes.buffer);return {w:view.getUint32(16),h:view.getUint32(20)}};
 for(let attempt=0;attempt<3;attempt++){
  const before=await viewport();
  const params={format:'png',captureBeyondViewport:true,clip:{x:c.x+before.x,y:c.y+before.y,width:c.width,height:c.height,scale:1/(before.dpr||1)}};
  let result=await capture(params),actual=size(result.data);
  if(actual.w!==c.width||actual.h!==c.height){params.clip.scale*=c.width/actual.w;result=await capture(params);actual=size(result.data);if(actual.w!==c.width||actual.h!==c.height)throw Error('SCREENSHOT_SIZE_MISMATCH')}
  // Native capture can change Chrome's viewport under device emulation.
  // Rebase after layout/scroll anchoring rather than returning stale pixels.
  const after=await viewport();if(JSON.stringify(before)===JSON.stringify(after))return {type:'image',mimeType:'image/png',data:result.data};
 }
 throw Error('VIEWPORT_CHANGED_DURING_SCREENSHOT');
}
function resolveRef(state,args){if(args.query?.kind!=='ref')return args;const parts=args.query.value.split(':');if(parts.length!==3)throw Error('INVALID_REF');const frameId=[...state.frameAliases].find(([,alias])=>alias===parts[0])?.[0];if(!frameId)throw Error('STALE_FRAME_REF');return {...args,frameId,query:{...args.query,value:parts[2],documentPrefix:parts[1]}}}
export async function browserCall(sessionId,method,args={}){
 if(method==='session.reset'){for(const [tabId,owner] of owners)if(owner===sessionId){const state=tabs.get(tabId);if(!state)continue;for(const w of state.waiters||[]){clearTimeout(w.timer);w.reject(Error('SESSION_RESET'))}state.waiters?.clear();await send(state,'Runtime.terminateExecution').catch(()=>{});state.keys?.clear();state.buttons=0}return true}
 if(method==='download.save')return saveDownload({id:args.id,sessionId,downloads,destination:args.destination});
 if(method==='download.cancel'){if(downloads.get(args.id)?.sessionId!==sessionId)throw Error('DOWNLOAD_NOT_OWNED_BY_SESSION');await chrome.downloads.cancel(Number(args.id));return true}
 if(method==='runtime.delay'){await delay(Math.min(Number(args.ms)||0,1000));return true}
 if(method==='browser.list')return [{id:'current',name:'Connected Chrome profile'}];
 if(method==='browser.tabs')return (await chrome.tabs.query({})).filter(t=>/^https?:/.test(t.url||'')).map(t=>({id:t.id,url:t.url,title:t.title,active:t.active,windowId:t.windowId}));
 if(method==='browser.open'){const tab=await chrome.tabs.create({url:args.url,active:args.active??true});owners.set(tab.id,sessionId);await delay(50);const created=await attach(sessionId,tab.id);await ready(created);return {id:tab.id}}
 if(method==='browser.attach'){const state=await attach(sessionId,args.tabId);await ready(state);return {id:Number(args.tabId)}}
 const state=await attach(sessionId,args.tabId);if(method==='scope.snapshot'&&typeof args.options?.root==='string'){const root=args.options.root;if(/^f\d+:[a-f0-9]+:e\d+$/.test(root)){args=resolveRef(state,{...args,query:{kind:'ref',value:root}});args.options={...args.options,root:args.query};delete args.query}else args.options={...args.options,root:{kind:'css',value:root}}}args=resolveRef(state,args);

 if(['locator.click','locator.fill','locator.hover','locator.focus','locator.scrollIntoView','locator.setChecked','locator.selectOption','locator.dragTo','locator.drop','locator.setFiles','locator.press'].includes(method)&&args.query?.kind!=='ref'){
  const end=Date.now()+5000;let count=0;
  do{count=await dom(state,args.frameId,'count',{query:args.query});if(count)break;await delay(50)}while(Date.now()<end);
  if(count!==1)throw Error(count?'MULTIPLE_MATCHES: '+count+' elements':'ELEMENT_NOT_FOUND_TIMEOUT');
 }
 if(method==='page.waitForEvent'){const pending=waitEvent(state,args.event,args.options?.timeout||10000);if(args.event==='filechooser'){state.arming=(async()=>{for(const targetSession of [undefined,...state.childSessions])await send(state,'Page.setInterceptFileChooserDialog',{enabled:true},targetSession).catch(()=>{})})();await state.arming}return pending}
 if(method==='dialog.accept'||method==='dialog.dismiss'){await send(state,'Page.handleJavaScriptDialog',{accept:method==='dialog.accept',promptText:args.value||''});return true}
 if(method==='locator.setFiles'||method==='chooser.setFiles'||method==='locator.drop')return uploadFiles({state,args,sessionId,context,send,dom,drop:method==='locator.drop'});
 if(method==='page.activate'){await chrome.tabs.update(state.tabId,{active:true});return true}
 if(method==='page.close'){await chrome.tabs.remove(state.tabId);emit(state,'close',{});owners.delete(state.tabId);tabs.delete(state.tabId);return true}
 if(method==='page.goto'){const nav=await send(state,'Page.navigate',{url:args.url});if(nav.errorText)throw Error('NAVIGATION_FAILED: '+nav.errorText);await ready(state,nav.loaderId);return true}
 if(method==='page.reload'){await send(state,'Page.reload');await delay(50);await ready(state);return true}
 if(method==='page.back'||method==='page.forward'){const history=await send(state,'Page.getNavigationHistory');const target=history.entries[history.currentIndex+(method==='page.back'?-1:1)];if(target)await send(state,'Page.navigateToHistoryEntry',{entryId:target.id});return Boolean(target)}
 if(method==='page.frames'){await context(state);return [...state.frames.values()].map(({id,parent,name,url,sessionId})=>({id,parent,name,url,process:sessionId?'child-target':'root-target'}))}
 if(method==='scope.snapshot')return snapshot(state,args);
 if(method==='scope.evaluate'||method==='locator.evaluateAll')return evaluate(state,args,method==='locator.evaluateAll');
 if(method==='page.waitForURL'||method==='page.waitForFunction'||method==='page.waitForLoadState'){
  if(method==='page.waitForLoadState'&&!['interactive','domcontentloaded','load'].includes(args.state))throw Error('Unsupported load state: '+args.state);const end=Date.now()+(args.options?.timeout||10000);while(Date.now()<end){try{const value=method==='page.waitForURL'?await evaluate(state,{source:'()=>location.href'}):method==='page.waitForLoadState'?await evaluate(state,{source:'()=>document.readyState'}):await evaluate(state,args);if(method==='page.waitForURL'?value===args.url:method==='page.waitForLoadState'?(args.state==='load'?value==='complete':value!=='loading'):Boolean(value))return value}catch{}await delay(50)}throw Error('WAIT_TIMEOUT: '+method);
 }
 if(method==='locator.press'){await dom(state,args.frameId,'focus',{query:args.query});return press(state,args.key)}
 if(method==='keyboard.type'){await send(state,'Input.insertText',{text:String(args.text)});return true}
 if(method==='keyboard.press')return press(state,args.key);
 if(method==='keyboard.down'||method==='keyboard.up')return key(state,method==='keyboard.down'?'keyDown':'keyUp',args.key);
 if(method==='page.logs')return state.logs.filter(log=>(!args.options?.since||log.at>args.options.since)&&(!args.options?.level||log.level===args.options.level));
 if(method==='page.screenshot')return captureScreenshot(state,args.options||{});
 if(method==='locator.click')return click(state,args);
 if(method==='locator.hover'){await mouse(state,'mouseMoved',await point(state,args));await evaluate(state,{source:'()=>new Promise(r=>requestAnimationFrame(r))'});return true}
 if(method==='locator.fill'){await dom(state,args.frameId,'prepareFill',{query:args.query});const frame=await context(state,args.frameId);await send(state,'Input.insertText',{text:String(args.value)},frame.sessionId);if(await dom(state,args.frameId,'inputValue',{query:args.query})!==String(args.value))throw Error('INPUT_VALUE_NOT_CHANGED');return true}
 if(method==='locator.setChecked'){const current=await dom(state,args.frameId,'isChecked',{query:args.query});if(current!==args.value)await click(state,args);if(await dom(state,args.frameId,'isChecked',{query:args.query})!==args.value)throw Error('CHECK_STATE_NOT_CHANGED');return true}
 if(method==='locator.dragTo'){
  if((await dom(state,args.frameId,'meta',{query:args.query})).draggable){
   let from=await point(state,args);const to=await point(state,args.target);from=await point(state,args);if(from.input?.sessionId!==to.input?.sessionId)throw Error('CROSS_TARGET_DRAG_UNSUPPORTED');const targetSession=from.input?.sessionId;
   await send(state,'Input.setInterceptDrags',{enabled:true},targetSession);const dataPending=waitEvent(state,'dragdata',2500);dataPending.catch(()=>{});
   try{await mouse(state,'mouseMoved',from);await mouse(state,'mousePressed',from);await delay(30);await mouse(state,'mouseMoved',{...from,x:from.x+8,y:from.y+2,input:from.input?{...from.input,x:from.input.x+8,y:from.input.y+2}:undefined});await delay(30);await mouse(state,'mouseMoved',to);const data=await dataPending;const p=to.input||to;for(const type of ['dragEnter','dragOver','drop'])await send(state,'Input.dispatchDragEvent',{type,x:p.x,y:p.y,data},targetSession);return true}finally{await mouse(state,'mouseReleased',to);await send(state,'Input.setInterceptDrags',{enabled:false},targetSession)}
  }
  let from=await point(state,args);const to=await point(state,args.target);from=await point(state,args);
  if(from.input?.sessionId!==to.input?.sessionId)throw Error('CROSS_TARGET_DRAG_UNSUPPORTED');
  await mouse(state,'mouseMoved',from);await mouse(state,'mousePressed',from);
  try{for(let i=1;i<=12;i++)await mouse(state,'mouseMoved',{x:from.x+(to.x-from.x)*i/12,y:from.y+(to.y-from.y)*i/12,input:from.input?{sessionId:from.input.sessionId,x:from.input.x+(to.input.x-from.input.x)*i/12,y:from.input.y+(to.input.y-from.input.y)*i/12}:undefined})}finally{await mouse(state,'mouseReleased',to)}return true;
 }
 const domMethods=['count','textContent','getAttribute','inputValue','isVisible','isEnabled','isEditable','isChecked','boundingBox','scrollIntoView','focus','selectOption'];
 if(method.startsWith('locator.')&&domMethods.includes(method.slice(8)))return dom(state,args.frameId,method.slice(8),args);
 if(method==='mouse.click'){await mouse(state,'mouseMoved',args);await mouse(state,'mousePressed',args);return mouse(state,'mouseReleased',args)}
 if(method.startsWith('mouse.'))return mouse(state,({move:'mouseMoved',down:'mousePressed',up:'mouseReleased',click:'mousePressed',wheel:'mouseWheel'})[method.slice(6)],args);
 throw Error('API not implemented: '+method);
}
