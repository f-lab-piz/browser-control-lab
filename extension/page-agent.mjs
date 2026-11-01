// Own DOM observation/selection implementation. Installed in an isolated world per document.
export function installPageAgent(){
 if(globalThis.__bcl)return;
 const documentId=Array.from(crypto.getRandomValues(new Uint32Array(4)),n=>n.toString(16).padStart(8,'0')).join(''),registry=new Map(),ids=new WeakMap();let next=0;
 let depthLimited=false;
 const ref=element=>{let id=ids.get(element);if(!id){id='e'+(++next);ids.set(element,id);registry.set(id,element)}return id};
 const inert=node=>['script','style','noscript','template'].includes(node.localName?.toLowerCase());
 function all(root=document.body,maxDepth=Infinity,includeInert=false){const elements=[],seen=new Set(),stack=root?[{node:root,depth:0}]:[];depthLimited=false;while(stack.length){const {node,depth}=stack.pop();if(node.nodeType!==1||seen.has(node)||!includeInert&&inert(node))continue;seen.add(node);elements.push(node);const assigned=node.tagName==='SLOT'?node.assignedElements({flatten:true}):[],children=[...assigned,...(node.shadowRoot?.children||[]),...node.children];if(depth>=maxDepth){if(children.length)depthLimited=true;continue}for(let i=children.length-1;i>=0;i--)stack.push({node:children[i],depth:depth+1})}return elements}

 const roles=new Set('alert alertdialog application article banner blockquote button caption cell checkbox code columnheader combobox complementary contentinfo definition deletion dialog directory document emphasis feed figure form generic grid gridcell group heading iframe img insertion link list listbox listitem log main marquee math menu menubar menuitem menuitemcheckbox menuitemradio meter navigation none note option paragraph presentation progressbar radio radiogroup region row rowgroup rowheader scrollbar search searchbox separator slider spinbutton status strong subscript suggestion superscript switch tab table tablist tabpanel term textbox time timer toolbar tooltip tree treegrid treeitem'.split(' '));
 const normalize=value=>String(value??'').replace(/\s+/g,' ').trim();
 const parentOf=node=>node.assignedSlot||node.parentElement||node.getRootNode()?.host;
 function projected(el){
  for(let node=el;node;){
   if(node.assignedSlot){node=node.assignedSlot;continue}
   const parent=node.parentElement;
   if(parent?.shadowRoot||parent?.tagName==='SLOT'&&parent.assignedNodes().length)return false;
   node=parent||node.getRootNode()?.host;
  }
  return true;
 }
 function ariaHidden(el){for(let node=el;node;node=parentOf(node))if(node.getAttribute?.('aria-hidden')==='true')return true;return false}
 function role(el){const explicit=(el.getAttribute('role')||'').trim().split(/\s+/).find(token=>roles.has(token));if(explicit)return explicit;const tag=el.tagName.toLowerCase();if(tag==='input')return el.type==='hidden'?'':({checkbox:'checkbox',radio:'radio',button:'button',submit:'button',reset:'button',image:'button',range:'slider',number:'spinbutton',file:'button'})[el.type]||'textbox';if(tag==='select')return el.multiple||el.size>1?'listbox':'combobox';return ({button:'button',a:el.hasAttribute('href')?'link':'',textarea:'textbox',option:'option',h1:'heading',h2:'heading',h3:'heading',h4:'heading',h5:'heading',h6:'heading',table:'table',tr:'row',th:'columnheader',td:'cell',summary:'button',iframe:'iframe',dialog:'dialog',ul:'list',ol:'list',li:'listitem',img:'img',main:'main',nav:'navigation',aside:'complementary',article:'article',progress:'progressbar',meter:'meter'})[tag]||''}
 function childrenOf(node){if(node.tagName==='SLOT'){const assigned=node.assignedNodes({flatten:true});if(assigned.length)return assigned}return node.shadowRoot?.childNodes||node.childNodes}
 function readableText(el,limit=Infinity,separateNodes=false,includeAriaHidden=false){
  if(!includeAriaHidden&&ariaHidden(el))return '';
  let value='';const seen=new Set(),stack=[el];
  while(stack.length&&value.length<limit){const node=stack.pop();if(seen.has(node))continue;seen.add(node);if(node.nodeType===3){value+=node.nodeValue;continue}if(node.nodeType!==1&&node.nodeType!==11)continue;if(node.nodeType===1&&(inert(node)||!includeAriaHidden&&node.getAttribute('aria-hidden')==='true'))continue;const children=childrenOf(node);for(let i=children.length-1;i>=0;i--)stack.push(children[i])}
  return normalize(value);
 }
 function matches(value,pattern,exact=false){if(pattern?.__bclRegex)return new RegExp(pattern.source,pattern.flags).test(value);const expected=normalize(pattern);return exact?value===expected:value.includes(expected)}
 function name(el,{explicitOnly=false,fromReference=false,seen=new Set()}={}){
  if(seen.has(el))return '';seen=new Set(seen);seen.add(el);
  const references=[...new Set((el.getAttribute('aria-labelledby')||'').split(/\s+/).filter(Boolean))].map(id=>el.getRootNode().getElementById?.(id)).filter(Boolean);
  const labelled=normalize(references.map(node=>name(node,{fromReference:true,seen})).join(' '));if(labelled)return labelled;
  const aria=normalize(el.getAttribute('aria-label'));if(aria)return aria;
  const label=normalize([...(el.labels||[])].map(node=>readableText(node,Infinity,false,true)).join(' '));if(label)return label;
  // A missing label is not an empty connected label. Regexes may match the
  // latter, but must never manufacture a connection for an unlabelled control.
  if(explicitOnly)return references.length||(el.labels||[]).length?'':null;
  if(el.tagName==='IMG'||el.tagName==='INPUT'&&el.type==='image'){const alt=normalize(el.getAttribute('alt'));if(alt)return alt}
  const title=normalize(el.getAttribute('title'));if(title)return title;
  if(['INPUT','TEXTAREA'].includes(el.tagName)){const placeholder=normalize(el.getAttribute('placeholder'));if(placeholder)return placeholder}
  const semantic=role(el);return fromReference||!semantic||['button','link','heading','option','tab'].includes(semantic)?readableText(el,Infinity,false,fromReference):'';
 }
 function composedContains(root,el){for(let node=el;node;node=node.assignedSlot||node.parentElement||node.getRootNode()?.host)if(node===root)return true;return false}
 function visible(el){if(el.hidden)return false;for(let p=el;p;p=p.parentElement||p.getRootNode()?.host){const style=getComputedStyle(p);if(p.hidden||style.display==='none'||style.visibility==='hidden'||style.visibility==='collapse')return false;if(p.tagName==='DETAILS'&&!p.open){const summary=[...p.children].find(n=>n.tagName==='SUMMARY');if(el!==p&&!(summary&&composedContains(summary,el)))return false}}return el.getClientRects().length>0}
 function meta(el){const box=el.getBoundingClientRect();return {ref:ref(el),role:role(el),name:name(el).slice(0,300),tag:el.tagName.toLowerCase(),visible:visible(el),offscreen:box.bottom<0||box.right<0||box.top>innerHeight||box.left>innerWidth,enabled:!el.matches(':disabled')&&el.getAttribute('aria-disabled')!=='true',editable:el.matches('input:not([readonly]),textarea:not([readonly])')||el.isContentEditable,checked:'checked'in el?el.checked:el.getAttribute('aria-checked'),expanded:el.getAttribute('aria-expanded'),selected:el.getAttribute('aria-selected'),readonly:el.readOnly||el.getAttribute('aria-readonly')==='true',busy:el.getAttribute('aria-busy'),value:'value'in el&&el.type!=='password'?String(el.value):undefined,box:{x:box.x,y:box.y,width:box.width,height:box.height}}}
 function find(query){
  if(query.documentPrefix&&!documentId.startsWith(query.documentPrefix))throw Error('STALE_DOCUMENT_REF');
  let elements;
  if(query.kind==='ref'){const el=registry.get(query.value);if(!el||!el.isConnected)throw Error('STALE_REF: element is detached; take a new snapshot');elements=[el]}
  else {elements=query.kind==='css'?all(document.documentElement,Infinity,true):all();if(query.kind==='css'){
    // Native root queries keep :scope bound to the document/ShadowRoot. Using
    // Element.matches here would rebind :scope to every candidate instead.
    const roots=[document,...elements.filter(el=>el.shadowRoot).map(el=>el.shadowRoot)],matched=new Set();
    for(const root of roots)for(const el of root.querySelectorAll(query.value))matched.add(el);
    elements=elements.filter(el=>matched.has(el));
   }
   else if(query.kind==='role')elements=elements.filter(el=>role(el)===query.value&&(query.options?.name===undefined||matches(name(el),query.options.name,query.options.exact))&&(query.options?.includeHidden||visible(el)&&!ariaHidden(el)));
   else if(query.kind==='label')elements=elements.filter(el=>{if(!el.matches('input,textarea,select,button'))return false;const label=name(el,{explicitOnly:true});return label!==null&&matches(label,query.value,query.options?.exact)});
   else if(query.kind==='text'){elements=elements.filter(el=>el.tagName!=='SLOT'&&projected(el)&&!ariaHidden(el)&&matches(readableText(el),query.value,query.options?.exact));const matched=new Set(elements),ancestors=new Set();for(const el of elements)for(let node=parentOf(el);node;node=parentOf(node))if(matched.has(node))ancestors.add(node);elements=elements.filter(el=>!ancestors.has(el))}
   else throw Error('Unknown selector type');
  }
  if(query.filter){for(const key of Object.keys(query.filter))if(!['hasText','hasNotText','visible'].includes(key))throw Error('UNSUPPORTED_FILTER: '+key);if(query.filter.hasText!==undefined)elements=elements.filter(el=>matches(readableText(el,Infinity,false),query.filter.hasText));if(query.filter.hasNotText!==undefined)elements=elements.filter(el=>!matches(readableText(el,Infinity,false),query.filter.hasNotText));if(query.filter.visible!==undefined)elements=elements.filter(el=>visible(el)===query.filter.visible)}
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
