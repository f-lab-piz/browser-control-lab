import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import {productRuntime,resultText as text} from './helpers/product-runtime.mjs';
let h,session;
const done=r=>{assert.equal(r.status,'completed',JSON.stringify(r.result));return r};
const js=(code,options={})=>h.client.js(session.id,code,options);
async function setup(name){
 const url=h.fixture.url+'/evaluation?case='+name;
 const result=done(await js(`var page=await browser.open(${JSON.stringify(url)});await page.locator('#effect').waitFor();console.log(page.id);`));
 const observed=h.context.pages().find(p=>p.url()===url);assert(observed);return {id:Number(text(result)),observed};
}
const marker=async(observed,id='effect')=>Number(await observed.locator('#'+id).textContent());
before(async()=>{h=await productRuntime('b01e',{extraSources:['shared/json-value.mjs','extension/evaluation.mjs','extension/background.js','extension/session-lifecycle.mjs','tests/evaluation-runtime.test.mjs','tests/evaluation-boundaries.test.mjs','tests/json-value.test.mjs','tests/evaluation-fixture.test.mjs','test-site/evaluation.html']});session=await h.client.session()});
after(async()=>await h?.close());

test('B01E Scope Locator alias and child document receive explicit arguments without the QuickJS closure',async()=>{
 await setup('arguments');
 const r=done(await js(`var b01eClosureSecret=123;var main=await page.evaluate(arg=>({scope:document.body.dataset.scope,arg}),{n:7});var alias=await page.locator('#a').evaluate((el,arg)=>({id:el.id,text:el.textContent,arg}),false);var child;for(var end=Date.now()+4000;Date.now()<end;){child=(await page.frames()).find(f=>f.url.includes('mail.test'));if(child)break}var childValue=await page.frame(child.id).evaluate(arg=>({scope:document.body.dataset.scope,arg}),['x']);var absent=await page.evaluate(arg=>arg);var explicit=await page.evaluate(arg=>arg,undefined);var closure;try{await page.evaluate(()=>b01eClosureSecret)}catch(error){closure=error.message}console.log({main,alias,child:childValue,absent,explicit,closure});`));
 const v=JSON.parse(text(r));assert.deepEqual(v.main,{scope:'main',arg:{n:7}});assert.deepEqual(v.alias,{id:'a',text:'A',arg:false});assert.deepEqual(v.child,{scope:'child',arg:['x']});assert.equal(v.absent,null);assert.equal(v.explicit,null);assert.match(v.closure,/EVALUATION_ERROR/);
 h.evidence.push({conditions:['REQ-SCOPE-EVALUATE-001-C01'],status:'pass',values:v});
});

test('B01E synchronous async thenable JSON and special string data round trip without automatic output',async()=>{
 await setup('values');
 const silent=done(await js('await page.evaluate(async()=>7)'));assert.deepEqual(silent.result.content,[]);
 const r=done(await js(String.raw`var values=await page.evaluate(async arg=>{await Promise.resolve();return [null,false,7,'x\0한😀',arg]},JSON.parse('{"__proto__":{"marker":"own"},"constructor":7}'));var lexical=await page.evaluate(()=>typeof argumentJson);var method=await page.evaluate(({['computed'](arg){return arg+1}}).computed,6);var thenable=await page.evaluate(()=>({then(resolve){resolve(11)}}));var negative=await page.evaluate(arg=>({n:arg.n,top:-0}),{n:-0});console.log({values,lexical,method,thenable,negative:[Object.is(negative.n,-0),Object.is(negative.top,-0)]});`));
 const v=JSON.parse(text(r));assert.deepEqual(v.values,[null,false,7,'x\0한😀',JSON.parse('{"__proto__":{"marker":"own"},"constructor":7}')]);assert.equal(v.lexical,'undefined');assert.equal(v.method,7);assert.equal(v.thenable,11);assert.deepEqual(v.negative,[true,true]);
 h.evidence.push({conditions:['REQ-SCOPE-EVALUATE-001-C02','REQ-C-RUNTIME-008-C01'],status:'pass',values:v});
});

test('B01E invalid arguments fail before the page function and invalid results never become successful null',async()=>{
 const {id,observed}=await setup('invalid');const rows=[];
 const args=['NaN','Infinity','1n','Symbol("x")','(()=>1)','new Date()','({x:undefined})','[,1]','page','Object.defineProperty({},"x",{enumerable:true,get(){throw Error("getter must not execute")}})','(()=>{var v={};v.self=v;return v})()'];
 for(const expression of args){
  const r=await js(`try{await page.evaluate(arg=>{document.querySelector('#effect').textContent='99';return arg},${expression});console.log('accepted')}catch(error){console.log(error.message)}`);
  rows.push({kind:'arg',expression,status:r.status,diagnostic:text(r)||r.result?.error?.message,effect:await marker(observed)});
  if(r.result?.runtimeReset)done(await js(`var page=await browser.attach(${id});`));
 }
 const results=['undefined','NaN','Infinity','1n','Symbol("x")','(()=>1)','document.body','new Date()','({x:undefined})','[,1]','(()=>{var v={};v.self=v;return v})()'];
 for(const expression of results){
  const r=await js(`try{await page.evaluate(()=>{document.querySelector('#poll').textContent=String(Number(document.querySelector('#poll').textContent)+1);return ${expression}});console.log('accepted')}catch(error){console.log(error.message)}`);
  rows.push({kind:'result',expression,status:r.status,diagnostic:text(r)||r.result?.error?.message});
 }
 const effect=await marker(observed),calls=await marker(observed,'poll'),pass=rows.every(row=>row.diagnostic?.startsWith('SERIALIZATION_ERROR'))&&effect===0&&calls===results.length;
 h.evidence.push({conditions:['REQ-SCOPE-EVALUATE-002-C01','REQ-C-RUNTIME-008-C01'],status:pass?'pass':'fail',rows,effect,calls});assert(pass,JSON.stringify({rows,effect,calls}));
});

test('B01E evaluateAll receives zero or all identities once in composed order and after actual reorder',async()=>{
 const {observed}=await setup('all');
 const r=done(await js(`var empty=await page.locator('.absent').evaluateAll((els,arg)=>{document.querySelector('#empty-count').textContent=String(Number(document.querySelector('#empty-count').textContent)+1);return {length:els.length,arg}},7);var before=await page.locator('.item').evaluateAll(async els=>els.map(el=>el.id));await page.getByRole('button',{name:'순서 바꾸기',exact:true}).click();var after=await page.locator('.item').evaluateAll(els=>els.map(el=>el.id));console.log({empty,before,after});`));
 const v=JSON.parse(text(r));assert.deepEqual(v.empty,{length:0,arg:7});assert.deepEqual(v.before,['a','s','light','t','b']);assert.deepEqual(v.after,['b','a','s','light','t']);assert.equal(await marker(observed,'empty-count'),1);
 h.evidence.push({conditions:['REQ-LOCATOR-EVALUATEALL-001-C01'],status:'pass',values:v});
});

test('B01E throw reject and an outer timeout preserve exactly one real page effect and never replay',async()=>{
 const rows=[];
 for(const [name,body] of [['throw','throw Error("expected throw")'],['reject','return Promise.reject(Error("expected reject"))'],['never','return new Promise(()=>{})']]){
  const {id,observed}=await setup('failure-'+name),options={timeoutMs:name==='never'?300:3000};
  const r=await js(`await page.evaluate(()=>{document.querySelector('#effect').textContent=String(Number(document.querySelector('#effect').textContent)+1);${body}});console.log('late-output')`,options);
  if(r.result?.runtimeReset)done(await js(`var page=await browser.attach(${id});`));
  const count=await marker(observed),again=await h.client.wait(r.requestId);
  rows.push({name,status:r.status,error:r.result?.error,runtimeReset:r.result?.runtimeReset,count,stable:again.finishedAt===r.finishedAt,output:text(r)});
 }
 const pass=rows.every(r=>r.status==='failed'&&r.count===1&&r.stable&&!r.output?.includes('late-output')&&(r.name==='never'?r.error.code==='TIMEOUT'&&r.runtimeReset===true:r.error.message.startsWith('EVALUATION_ERROR')));
 h.evidence.push({conditions:['REQ-SCOPE-EVALUATE-002-C02'],status:pass?'pass':'fail',rows});assert(pass,JSON.stringify(rows));
});

test('B01E evaluateAll failures keep partial effects and old frame execution cannot retarget a replacement',async()=>{
 const rows=[];
 for(const mode of ['navigate','detach']){
  const {observed}=await setup('frame-'+mode);
  const r=done(await js(`var child;for(var end=Date.now()+4000;Date.now()<end;){child=(await page.frames()).find(f=>f.url.includes('mail.test'));if(child)break}var pending=page.frame(child.id).locator('.item').evaluateAll(async els=>{document.querySelector('#effect').textContent='1';parent.postMessage({evaluationEffect:true},'*');return new Promise(()=>{})}).then(value=>({accepted:true,value}),error=>({accepted:false,error:error.message}));await page.waitForFunction(()=>document.querySelector('#child-effect').textContent==='1');await page.locator('#${mode}').click();console.log(await pending);`));
  const value=JSON.parse(text(r)),count=await marker(observed,'child-effect');rows.push({mode,value,count});
 }
 const {observed}=await setup('all-reject');const rejected=await js(`await page.locator('.item').evaluateAll(async els=>{document.querySelector('#effect').textContent='1';throw Error('all reject')})`);rows.push({mode:'reject',error:rejected.result?.error,count:await marker(observed)});
 const invalid=await js(`await page.locator('.item').evaluateAll(els=>els[0])`);rows.push({mode:'DOMnode',error:invalid.result?.error});
 const pass=rows.slice(0,2).every(r=>!r.value.accepted&&/EVALUATION_CONTEXT_ERROR/.test(r.value.error)&&r.count===1)&&rows[2].error?.message.startsWith('EVALUATION_ERROR')&&rows[2].count===1&&rows[3].error?.message.startsWith('SERIALIZATION_ERROR');
 h.evidence.push({conditions:['REQ-LOCATOR-EVALUATEALL-002-C01','REQ-SCOPE-EVALUATE-002-C02'],status:pass?'pass':'fail',rows});assert(pass,JSON.stringify(rows));
});

test('B01E function wait settles promises and reports reject invalid JSON and inner deadline without resetting the VM',async()=>{
 const rows=[];
 for(const [name,body] of [['reject','throw Error("predicate reject")'],['invalid','return undefined'],['never','return new Promise(()=>{})']]){
  const {observed}=await setup('wait-'+name);
  done(await js('var retainedEval=17;'));
  const started=Date.now(),r=await js(`await page.waitForFunction(async()=>{document.querySelector('#effect').textContent=String(Number(document.querySelector('#effect').textContent)+1);${body}},null,{timeout:200})`,{timeoutMs:2000});
  const kept=await js('console.log(retainedEval)');rows.push({name,error:r.result?.error,runtimeReset:r.result?.runtimeReset,generation:[r.generation,kept.generation],binding:text(kept),count:await marker(observed),elapsed:Date.now()-started});
 }
 await setup('wait-true');const positive=done(await js(`console.log(await page.waitForFunction(async()=>{document.querySelector('#poll').textContent=String(Number(document.querySelector('#poll').textContent)+1);return Number(document.querySelector('#poll').textContent)>=3},null,{timeout:2000}));`));
 const pass=rows.every(r=>r.count===1&&r.runtimeReset===false&&r.binding==='17'&&r.generation[0]===r.generation[1]&&(r.name==='reject'?r.error.message.startsWith('EVALUATION_ERROR'):r.name==='invalid'?r.error.message.startsWith('SERIALIZATION_ERROR'):r.error.message.startsWith('WAIT_TIMEOUT')))&&text(positive)==='true';
 h.evidence.push({conditions:['REQ-C-RUNTIME-008-C01'],status:pass?'pass':'fail',rows,positive:text(positive)});assert(pass,JSON.stringify(rows));
});
