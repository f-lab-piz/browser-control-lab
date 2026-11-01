// This function is serialized into the isolated QuickJS context.
export function installBrowserApi(stringifyJsonValue){
 const encode=value=>value instanceof RegExp?{__bclRegex:true,source:value.source,flags:value.flags}:Array.isArray(value)?value.map(encode):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([k,v])=>[k,encode(v)])):value;
 const call=(method,args)=>__hostCall(method,encode(args));
 const roles=new Set('alert alertdialog application article banner blockquote button caption cell checkbox code columnheader combobox complementary contentinfo definition deletion dialog directory document emphasis feed figure form generic grid gridcell group heading iframe img insertion link list listbox listitem log main marquee math menu menubar menuitem menuitemcheckbox menuitemradio meter navigation none note option paragraph presentation progressbar radio radiogroup region row rowgroup rowheader scrollbar search searchbox separator slider spinbutton status strong subscript suggestion superscript switch tab table tablist tabpanel term textbox time timer toolbar tooltip tree treegrid treeitem'.split(' '));
 const pattern=(value,empty=false)=>{
  if(value instanceof RegExp)return value;
  if(typeof value!=='string')throw Error('INVALID_SELECTOR: expected string or RegExp');
  const normalized=value.replace(/\s+/g,' ').trim();if(!empty&&!normalized)throw Error('INVALID_SELECTOR: empty search text');return normalized;
 };
 const search=(scope,kind,value,options)=>{
  if(!options||typeof options!=='object'||Array.isArray(options))throw Error('INVALID_SELECTOR_OPTIONS: expected object');
  const allowed=kind==='role'?['name','exact','includeHidden']:['exact'];
  for(const key of Object.keys(options))if(!allowed.includes(key))throw Error('UNSUPPORTED_SELECTOR_OPTION: '+key);
  for(const key of ['exact','includeHidden'])if(options[key]!==undefined&&typeof options[key]!=='boolean')throw Error('INVALID_SELECTOR_OPTIONS: '+key+' must be boolean');
  const opts={...options};
  if(kind==='role'){
   if(typeof value!=='string'||!roles.has(value))throw Error('INVALID_ROLE: expected a supported concrete role');
   if(opts.name!==undefined)opts.name=pattern(opts.name,true);
  }else value=pattern(value);
  if(options.exact===true&&(kind==='role'?opts.name:value) instanceof RegExp)throw Error('UNSUPPORTED_SELECTOR_OPTION: RegExp with exact true');
  return new Locator(scope,{kind,value,options:opts});
 };
 const evaluation=async(method,args,fn,arg)=>{
  if(typeof fn!=='function')throw Error('EVALUATION_ERROR: expected a function');
  let argJson;
  try{argJson=stringifyJsonValue(arg===undefined?null:arg)}catch(error){throw Error('SERIALIZATION_ERROR: argument '+error.message)}
  const result=await call(method,{...args,source:Function.prototype.toString.call(fn),argJson});
  if(result?.__bclEvaluation!==true||typeof result.json!=='string')throw Error('EVALUATION_ERROR: invalid evaluation response');
  return JSON.parse(result.json);
 };
 class Scope{
  constructor(tabId,frameId){this.tabId=tabId;this.frameId=frameId}
  args(extra={}){return {tabId:this.tabId,frameId:this.frameId,...extra}}
  locator(value){if(typeof value!=='string'||!value.trim())throw Error('INVALID_SELECTOR: expected nonempty CSS or qualified ref');return new Locator(this,/^f\d+:[a-f0-9]+:e\d+$/.test(value)?{kind:'ref',value}:{kind:'css',value})}
  getByRole(value,options={}){return search(this,'role',value,options)}
  getByText(value,options={}){return search(this,'text',value,options)}
  getByLabel(value,options={}){return search(this,'label',value,options)}
  evaluate(fn,arg){return evaluation('scope.evaluate',this.args(),fn,arg)}
  snapshot(options={}){return call('scope.snapshot',this.args({options}))}
 }
 class Locator{
  constructor(scope,query){this.scope=scope;this.query=query}
  args(extra={}){return this.scope.args({query:this.query,...extra})}
  filter(filter){return new Locator(this.scope,{...this.query,filter})}
  nth(nth){return new Locator(this.scope,{...this.query,nth})}
  count(){return call('locator.count',this.args())}
  textContent(){return call('locator.textContent',this.args())}
  getAttribute(name){return call('locator.getAttribute',this.args({name}))}
  inputValue(){return call('locator.inputValue',this.args())}
  isVisible(){return call('locator.isVisible',this.args())}
  isEnabled(){return call('locator.isEnabled',this.args())}
  isEditable(){return call('locator.isEditable',this.args())}
  isChecked(){return call('locator.isChecked',this.args())}
  boundingBox(){return call('locator.boundingBox',this.args())}
  click(options={}){return call('locator.click',this.args({options}))}
  fill(value){return call('locator.fill',this.args({value}))}
  hover(){return call('locator.hover',this.args())}
  focus(){return call('locator.focus',this.args())}
  scrollIntoView(){return call('locator.scrollIntoView',this.args())}
  setChecked(value){return call('locator.setChecked',this.args({value}))}
  selectOption(value){return call('locator.selectOption',this.args({value}))}
  evaluate(fn,arg){return evaluation('scope.evaluate',this.args(),fn,arg)}
  evaluateAll(fn,arg){return evaluation('locator.evaluateAll',this.args(),fn,arg)}
  press(key){return call('locator.press',this.args({key}))}
  setFiles(files){return call('locator.setFiles',this.args({files}))}
  drop(options={}){return call('locator.drop',this.args(options))}
  dragTo(target){return call('locator.dragTo',this.args({target:target.args()}))}
  async waitFor(options={}){const end=Date.now()+(options.timeout||5000),state=options.state||'visible';while(Date.now()<end){const count=await this.count();if(state==='attached'){if(count)return true}else if(state==='detached'){if(!count)return true}else if(count){const visible=await this.isVisible();if(state==='visible'&&visible||state==='hidden'&&!visible)return true}else if(state==='hidden')return true;await call('runtime.delay',{ms:50})}throw Error('WAIT_TIMEOUT: '+state)}
 }
 class FileChooser{
  constructor(page,event){this.page=page;this.event=event}
  setFiles(files){return call('chooser.setFiles',this.page.args({...this.event,files}))}
 }
 class Download{
  constructor(event){this.id=event.id;this.url=event.url;this.name=event.name}
  save(destination={target:'server'}){return call('download.save',{id:this.id,destination})}
  cancel(){return call('download.cancel',{id:this.id})}
 }
 class Dialog{
  constructor(page,event){this.page=page;this.type=event.type;this.message=event.message}
  accept(value){return call('dialog.accept',this.page.args({value}))}
  dismiss(){return call('dialog.dismiss',this.page.args())}
 }
 class Mouse{
  constructor(page){this.page=page}
  move(x,y){return call('mouse.move',this.page.args({x,y}))}
  down(options={}){return call('mouse.down',this.page.args(options))}
  up(options={}){return call('mouse.up',this.page.args(options))}
  click(x,y,options={}){return call('mouse.click',this.page.args({x,y,...options}))}
  wheel(deltaX,deltaY){return call('mouse.wheel',this.page.args({deltaX,deltaY}))}
 }
 class Keyboard{
  constructor(page){this.page=page}
  down(key){return call('keyboard.down',this.page.args({key}))}
  up(key){return call('keyboard.up',this.page.args({key}))}
  press(key){return call('keyboard.press',this.page.args({key}))}
  type(text){return call('keyboard.type',this.page.args({text}))}
 }
 class Page extends Scope{
  constructor(id){super(id);this.id=id;this.mouse=new Mouse(this);this.keyboard=new Keyboard(this)}
  activate(){return call('page.activate',this.args())}
  close(){return call('page.close',this.args())}
  goto(url){return call('page.goto',this.args({url}))}
  back(){return call('page.back',this.args())}
  forward(){return call('page.forward',this.args())}
  reload(){return call('page.reload',this.args())}
  frames(){return call('page.frames',this.args())}
  frame(frameId){return new Scope(this.tabId,frameId)}
  screenshot(options={}){return call('page.screenshot',this.args({options}))}
  async waitForEvent(event,options={}){const result=await call('page.waitForEvent',this.args({event,options}));return event==='popup'?new Page(result.tabId):event==='filechooser'?new FileChooser(this,result):event==='download'?new Download(result):event==='dialog'?new Dialog(this,result):result}
  waitForURL(url,options={}){return call('page.waitForURL',this.args({url,options}))}
  waitForFunction(fn,arg,options={}){
   const timeout=options.timeout===undefined?10000:options.timeout;
   if(!Number.isFinite(timeout)||!Number.isInteger(timeout)||timeout<=0)return Promise.reject(Error('INVALID_TIMEOUT: expected a positive integer'));
   return evaluation('page.waitForFunction',this.args({options,deadlineAt:Date.now()+timeout}),fn,arg);
  }
  waitForLoadState(state='interactive',options={}){return call('page.waitForLoadState',this.args({state,options}))}
  logs(options={}){return call('page.logs',this.args({options}))}
 }
 globalThis.browser={
  list:()=>call('browser.list',{}),tabs:()=>call('browser.tabs',{}),
  async open(url,options={}){const tab=await call('browser.open',{url,...options});return new Page(tab.id)},
  async attach(tabId){const tab=await call('browser.attach',{tabId});return new Page(tab.id)}
 };
}
