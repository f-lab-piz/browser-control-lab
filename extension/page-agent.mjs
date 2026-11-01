// Own DOM observation/selection implementation. Installed in an isolated world per document.
export function installPageAgent(){
 if(globalThis.__bcl)return;
 const documentId=Array.from(crypto.getRandomValues(new Uint32Array(4)),n=>n.toString(16).padStart(8,'0')).join(''),registry=new Map(),ids=new WeakMap();let next=0;
 let depthLimited=false;
 const ref=element=>{let id=ids.get(element);if(!id){id='e'+(++next);ids.set(element,id);registry.set(id,element)}return id};
 function all(root=document.body,maxDepth=Infinity){const elements=[],stack=root?[{node:root,depth:0}]:[];depthLimited=false;while(stack.length){const {node,depth}=stack.pop();if(node.nodeType!==1||['SCRIPT','STYLE','NOSCRIPT','TEMPLATE'].includes(node.tagName))continue;elements.push(node);const children=[...(node.shadowRoot?.children||[]),...node.children];if(depth>=maxDepth){if(children.length)depthLimited=true;continue}for(let i=children.length-1;i>=0;i--)stack.push({node:children[i],depth:depth+1})}return elements}

 function role(el){const explicit=el.getAttribute('role');if(explicit)return explicit;const tag=el.tagName.toLowerCase();if(tag==='input')return ({checkbox:'checkbox',radio:'radio',button:'button',submit:'button',range:'slider',number:'spinbutton',file:'button'})[el.type]||'textbox';return ({button:'button',a:el.hasAttribute('href')?'link':'',textarea:'textbox',select:'combobox',option:'option',h1:'heading',h2:'heading',h3:'heading',h4:'heading',table:'table',tr:'row',th:'columnheader',td:'cell',summary:'button',iframe:'iframe',dialog:'dialog',ul:'list',ol:'list',li:'listitem',img:'img'})[tag]||''}
 function readableText(el){let value='';const stack=[el];while(stack.length&&value.length<600){const node=stack.pop();if(node.nodeType===3){value+=' '+node.nodeValue;continue}if(node.nodeType!==1&&node.nodeType!==11)continue;if(node.nodeType===1&&(['SCRIPT','STYLE','NOSCRIPT','TEMPLATE'].includes(node.tagName)||node.getAttribute('aria-hidden')==='true'))continue;const assigned=node.tagName==='SLOT'?node.assignedNodes({flatten:true}):[],children=assigned.length?assigned:node.childNodes;for(let i=children.length-1;i>=0;i--)stack.push(children[i])}return value.replace(/\s+/g,' ').trim()}

 function matches(value,pattern,exact=false){if(pattern?.__bclRegex){return new RegExp(pattern.source,pattern.flags).test(value)}return exact?value===String(pattern):value.includes(String(pattern))}
 function name(el){const labelled=(el.getAttribute('aria-labelledby')||'').split(/\s+/).filter(Boolean).map(id=>el.getRootNode().getElementById?.(id)).filter(Boolean).map(readableText).join(' ');const label=el.labels?.length?[...el.labels].map(readableText).join(' '):'';const structural=['main','search','region','navigation','list','listitem','table','row','dialog'].includes(role(el));return (el.getAttribute('aria-label')||labelled||label||el.getAttribute('alt')||el.getAttribute('title')||el.getAttribute('placeholder')||(structural?'':readableText(el))).replace(/\s+/g,' ').trim().slice(0,300)}
 function visible(el){if(el.hidden)return false;for(let p=el;p;p=p.parentElement||p.getRootNode()?.host){const style=getComputedStyle(p);if(p.hidden||style.display==='none'||style.visibility==='hidden'||style.visibility==='collapse')return false;if(p.tagName==='DETAILS'&&!p.open){const summary=[...p.children].find(n=>n.tagName==='SUMMARY');if(el!==p&&!(summary&&summary.contains(el)))return false}}return el.getClientRects().length>0}
 function meta(el){const box=el.getBoundingClientRect();return {ref:ref(el),role:role(el),name:name(el),tag:el.tagName.toLowerCase(),visible:visible(el),offscreen:box.bottom<0||box.right<0||box.top>innerHeight||box.left>innerWidth,enabled:!el.matches(':disabled')&&el.getAttribute('aria-disabled')!=='true',editable:el.matches('input:not([readonly]),textarea:not([readonly])')||el.isContentEditable,checked:'checked'in el?el.checked:el.getAttribute('aria-checked'),expanded:el.getAttribute('aria-expanded'),selected:el.getAttribute('aria-selected'),readonly:el.readOnly||el.getAttribute('aria-readonly')==='true',busy:el.getAttribute('aria-busy'),value:'value'in el&&el.type!=='password'?String(el.value):undefined,box:{x:box.x,y:box.y,width:box.width,height:box.height}}}
 function find(query){
  if(query.documentPrefix&&!documentId.startsWith(query.documentPrefix))throw Error('STALE_DOCUMENT_REF');
  let elements;
  if(query.kind==='ref'){const el=registry.get(query.value);if(!el||!el.isConnected)throw Error('STALE_REF: element is detached; take a new snapshot');elements=[el]}
  else {elements=all();if(query.kind==='css')elements=elements.filter(el=>el.matches(query.value));
   else if(query.kind==='role')elements=elements.filter(el=>role(el)===query.value&&(!query.options?.name||(matches(name(el),query.options.name,query.options.exact)))&&(query.options?.includeHidden||visible(el)));
   else if(query.kind==='label')elements=elements.filter(el=>el.matches('input,textarea,select,button')&&(matches(name(el),query.value,query.options?.exact)));
   else if(query.kind==='text')elements=elements.filter(el=>(matches(name(el),query.value,query.options?.exact))&&!Array.from(el.children).some(c=>matches(name(c),query.value,query.options?.exact)));
   else throw Error('Unknown selector type');
  }
  if(query.filter){for(const key of Object.keys(query.filter))if(!['hasText','hasNotText','visible'].includes(key))throw Error('UNSUPPORTED_FILTER: '+key);if(query.filter.hasText!==undefined)elements=elements.filter(el=>matches(readableText(el),query.filter.hasText));if(query.filter.hasNotText!==undefined)elements=elements.filter(el=>!matches(readableText(el),query.filter.hasNotText));if(query.filter.visible!==undefined)elements=elements.filter(el=>visible(el)===query.filter.visible)}
  if(query.nth!==undefined){if(!Number.isInteger(query.nth))throw Error('INVALID_INDEX');const index=query.nth<0?elements.length+query.nth:query.nth;elements=elements[index]?[elements[index]]:[]}
  return elements;
 }
 function single(query){const matches=find(query);if(matches.length!==1)throw Error(matches.length?'MULTIPLE_MATCHES: '+matches.length+' elements':'ELEMENT_NOT_FOUND');return matches[0]}
 function action(el){if(!visible(el))throw Error('ELEMENT_HIDDEN');if(el.matches(':disabled')||el.getAttribute('aria-disabled')==='true')throw Error('ELEMENT_DISABLED');el.scrollIntoView({block:'nearest',inline:'nearest'});const rect=el.getBoundingClientRect();if(!rect.width||!rect.height)throw Error('ELEMENT_WITHOUT_BOX');const x=rect.left+rect.width/2,y=rect.top+rect.height/2;let top=document.elementFromPoint(x,y);while(top?.shadowRoot){const next=top.shadowRoot.elementFromPoint(x,y);if(!next||next===top)break;top=next}let related=false;for(let node=top;node;node=node.assignedSlot||node.parentElement||node.getRootNode()?.host)if(node===el){related=true;break}if(!top||top!==el&&!el.contains(top)&&!top.contains(el)&&!related)throw Error('ELEMENT_OBSCURED');return {x,y,...meta(el)}}
 globalThis.__bcl={documentId,async call(method,args={}){
  if(method==='snapshot'){
   const options=args.options||{},root=options.root?single(options.root):document.body;for(const [id,el] of registry)if(!el.isConnected)registry.delete(id);let elements=all(root,options.maxDepth??Infinity).filter(el=>options.showHidden||visible(el));
   if(options.interactive)elements=elements.filter(el=>['button','link','textbox','checkbox','radio','combobox','option','slider','spinbutton'].includes(role(el))||el.isContentEditable);
   else elements=elements.filter(el=>{if(role(el))return true;if(el.children.length||!name(el))return false;for(let p=el.parentElement||el.getRootNode()?.host;p;p=p.parentElement||p.getRootNode()?.host)if(['button','link','heading','option','checkbox','radio','tab'].includes(role(p)))return false;return true});
   if(options.query)elements=elements.filter(el=>name(el).toLowerCase().includes(String(options.query).toLowerCase()));
   return {documentId,depthLimited,nodes:elements.map(meta)};
  }
  if(method==='count')return find(args.query).length;
  const el=single(args.query);
  if(method==='meta')return {...meta(el),draggable:el.draggable};

  if(method==='point'){const end=Date.now()+5000;while(!visible(el)||el.matches(':disabled')||el.getAttribute('aria-disabled')==='true'){if(Date.now()>end)throw Error('ACTIONABILITY_TIMEOUT');await new Promise(r=>setTimeout(r,50));if(!el.isConnected)throw Error('STALE_REF')}action(el);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));if(!el.isConnected){if(args.query.kind==='ref')throw Error('STALE_REF: element changed during layout');return action(single(args.query))}return action(el)}
  if(method==='textContent')return el.textContent;
  if(method==='getAttribute')return el.getAttribute(args.name);
  if(method==='inputValue')return el.isContentEditable?el.textContent:el.value??'';
  if(method==='isVisible')return visible(el);
  if(method==='isEnabled')return !el.matches(':disabled')&&el.getAttribute('aria-disabled')!=='true';
  if(method==='isEditable')return meta(el).editable;
  if(method==='isChecked')return Boolean(el.checked??el.getAttribute('aria-checked')==='true');
  if(method==='boundingBox')return visible(el)?meta(el).box:null;
  if(method==='scrollIntoView'){el.scrollIntoView({block:'nearest',inline:'nearest'});return true}
  if(method==='focus'){el.focus();return true}
  if(method==='prepareFill'){if(el.readOnly||el.getAttribute('aria-readonly')==='true'||!(el.matches('input,textarea')||el.isContentEditable))throw Error('ELEMENT_NOT_EDITABLE');action(el);el.focus();if(el.isContentEditable){const selection=getSelection(),range=document.createRange();range.selectNodeContents(el);selection.removeAllRanges();selection.addRange(range)}else if(typeof el.select==='function')el.select();else throw Error('ELEMENT_NOT_EDITABLE');return true}
  if(method==='selectOption'){if(el.tagName!=='SELECT')throw Error('Expected native select');const values=Array.isArray(args.value)?args.value:[args.value];for(const option of el.options)option.selected=values.includes(option.value)||values.includes(option.label);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));return [...el.selectedOptions].map(o=>o.value)}
  throw Error('Unknown DOM operation: '+method);
 },resolve:single,find};
}
