import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {productRuntime,resultText as text} from './helpers/product-runtime.mjs';
import {outputPng,pngFormatCases,compressionPngCases} from '../test-site/output-png.mjs';
let h,a,b;
const KiB=1024,MiB=1024*KiB;
const done=r=>{assert.equal(r.status,'completed',JSON.stringify(r.result?.error));assert.equal(r.result.execution,'extension-worker/QuickJS-WASM');return r.result};
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
async function js(code,session=a){
 const accepted=await h.client.request('/v1/sessions/'+session.id+'/js',{code,timeoutMs:5000});
 try{return await h.client.wait(accepted.requestId,9000)}catch(error){await h.client.reset(session.id);if(session===a)done(await h.client.js(a.id,'var outputPage=await browser.open('+JSON.stringify(h.fixture.url+'/audit')+')'));throw error}
}
const imageCode=size=>`await outputPage.evaluate(async size=>{const r=await fetch('/output-image?bytes='+size);return r.json()},${size})`;
const reason=(result,name)=>assert(result.truncationReasons?.includes(name),JSON.stringify({truncated:result.truncated,reasons:result.truncationReasons}));
before(async()=>{h=await productRuntime('b01c',{extraSources:['tests/output-runtime.test.mjs','test-site/output-png.mjs','tests/output-fixture.test.mjs']});a=await h.client.session();b=await h.client.session();done(await js(`var outputPage=await browser.open(${JSON.stringify(h.fixture.url+'/audit')});`))});
after(async()=>await h?.close());

test('B01C explicit ordered text preserves NUL Unicode and circular values without page console leakage',async()=>{
 const r=done(await js(String.raw`console.log("x\0y",{name:"한😀"},7);var cyclic={name:"cycle"};cyclic.self=cyclic;console.log(cyclic);await outputPage.evaluate(()=>{console.log('page-only');return null});42`));
 assert.deepEqual(r.content.map(c=>c.text),['x\0y {"name":"한😀"} 7','{"name":"cycle","self":"[Circular]"}']);
 assert.equal(text(await js('console.log("next")',b)),'next');
 h.evidence.push({conditions:['REQ-CONSOLE-LOG-001-C01','REQ-CONSOLE-LOG-002-C02'],status:'pass',texts:r.content.map(c=>c.text)});
});

test('B01C UTF8 text and combined block limits mark reasons and keep following requests isolated',async()=>{
 const rows=[];
 for(const extra of [0,1,2]){
  const r=done(await js(`console.log('한'.repeat(21845)+'${'x'.repeat(extra)}')`));
  const bytes=Buffer.byteLength(r.content[0].text);assert(bytes<=65536);assert(!r.content[0].text.includes('\ufffd'));
  assert.equal(r.truncated,extra===2);assert.equal(bytes,extra===2?65536:65535+extra);if(extra===2)reason(r,'text-bytes');rows.push({extra,bytes,truncated:r.truncated});
 }
 const emoji=done(await js("console.log('😀'.repeat(16385))"));assert.equal(Buffer.byteLength(emoji.content[0].text),65536);assert(!emoji.content[0].text.includes('\ufffd'));reason(emoji,'text-bytes');
 for(const count of [255,256,257]){const r=done(await js(`for(let i=0;i<${count};i++)console.log(i)`));assert.equal(r.content.length,Math.min(count,256));assert.equal(r.truncated,count===257);if(count===257)reason(r,'blocks')}
 assert.equal(text(await js('console.log("fresh")')),'fresh');assert.equal(text(await js('console.log("isolated")',b)),'isolated');
 h.evidence.push({conditions:['REQ-CONSOLE-LOG-002-C01'],status:'pass',rows,emojiBytes:65536,blockBoundary:[255,256,257]});
});

test('B01C actual screenshot and valid PNG bytes remain complete between text blocks',async()=>{
 const r=done(await js(`console.log('before');display(await outputPage.screenshot());display(${imageCode(128)});console.log('after');`));
 assert.deepEqual(r.content.map(c=>c.type),['text','image','image','text']);assert.equal(r.content[0].text,'before');assert.equal(r.content[3].text,'after');
 for(const image of r.content.filter(c=>c.type==='image')){assert.equal(image.mimeType,'image/png');assert.equal(Buffer.from(image.data,'base64').readUInt32BE(0),0x89504e47)}
 assert.equal(digest(Buffer.from(r.content[2].data,'base64')),digest(outputPng(128)));
 h.evidence.push({conditions:['REQ-DISPLAY-001-C01'],status:'pass',kinds:r.content.map(c=>c.type),pngSha256:digest(outputPng(128))});
});

test('B01C invalid MIME base64 and corrupt PNG are synchronous display errors without substituted images',async()=>{
 const valid=outputPng(128),bad=Buffer.from(valid);bad[30]^=1;
 const values=[{type:'image',mimeType:'text/html',data:valid.toString('base64')},{type:'image',mimeType:'image/png',data:'????'},{type:'image',mimeType:'image/png',data:Buffer.from('not a PNG').toString('base64')},{type:'image',mimeType:'image/png',data:bad.toString('base64')}];
 for(const value of values){const r=done(await js(`try{display(${JSON.stringify(value)});console.log('accepted')}catch(error){console.log('invalid',error.message)}console.log('after')`));assert.equal(r.content.length,2);assert.match(r.content[0].text,/^invalid .*INVALID_IMAGE/);assert.equal(r.content[1].text,'after')}
 h.evidence.push({conditions:['REQ-DISPLAY-002-C01'],status:'pass',invalidCases:values.length,imageBlocks:0});
});

test('B01C image file bytes total count and mixed block budgets omit whole images and preserve logs',async()=>{
 const rows=[];
 for(const size of [4*MiB-1,4*MiB,4*MiB+1]){
  const r=done(await js(`display(${imageCode(size)});console.log('after')`));const images=r.content.filter(c=>c.type==='image');assert.equal(images.length,size>4*MiB?0:1);assert.equal(r.content.at(-1).text,'after');
  if(images.length)assert.equal(digest(Buffer.from(images[0].data,'base64')),digest(outputPng(size)));else reason(r,'image-bytes');rows.push({size,images:images.length,truncated:r.truncated});
 }
 // Reuse a single guest object to avoid keeping multiple large VM inputs alive.
 let r=done(await js(`var largeImage=${imageCode(4*MiB)};display(largeImage);display(largeImage);display(${imageCode(128)});console.log('after-total');largeImage=null;`));
 assert.equal(r.content.filter(c=>c.type==='image').length,2);assert.equal(r.content.at(-1).text,'after-total');reason(r,'image-total-bytes');
 for(const image of r.content.filter(c=>c.type==='image'))assert.equal(digest(Buffer.from(image.data,'base64')),digest(outputPng(4*MiB)));
 r=done(await js(`display(${imageCode(4*MiB)});display(${imageCode(4*MiB-1)})`));assert.equal(r.metrics.imageBytes,8*MiB-1);assert.equal(r.truncated,false);
 r=done(await js(`display(${imageCode(4*MiB)});display(${imageCode(4*MiB-127)});display(${imageCode(128)});console.log('one-byte-over')`));assert.equal(r.content.filter(c=>c.type==='image').length,2);reason(r,'image-total-bytes');assert.equal(r.content.at(-1).text,'one-byte-over');
 r=done(await js(`var smallImage=${imageCode(128)};for(let i=0;i<5;i++)display(smallImage);console.log('after-count')`));assert.equal(r.content.filter(c=>c.type==='image').length,4);reason(r,'image-count');assert.equal(r.content.at(-1).text,'after-count');
 r=done(await js(`for(let i=0;i<255;i++)console.log(i);display(smallImage);display(smallImage)`));assert.equal(r.content.length,256);assert.equal(r.content.at(-1).type,'image');reason(r,'blocks');
 r=done(await js(`console.log('x'.repeat(65536));display(smallImage)`));assert.equal(r.content[0].text.length,65536);assert.equal(r.content[1].type,'image');assert.equal(r.truncated,false);
 assert.equal(text(await js('console.log("fresh")',b)),'fresh');
 h.evidence.push({conditions:['REQ-C-RUNTIME-007-C01','REQ-DISPLAY-002-C01'],status:'pass',rows,totalImageBytes:8*MiB,imagesAtCountLimit:4,mixedBlocks:256});
});

test('B01C declared code time memory and stack limits report resource failures and recover',async()=>{
 for(const timeoutMs of [50,30000,120000]){const r=await h.client.js(b.id,'console.log("boundary")',{timeoutMs});assert.equal(text(r),'boundary')}
 let r=await js('//'+'한'.repeat(21844)+'xx',b);done(r);
 const rejected=await h.request('/v1/sessions/'+b.id+'/js',{code:'x'.repeat(65537)});assert.equal(rejected.status,400);
 const rows=[];
 r=await js('function resourceRecur(){return resourceRecur()}resourceRecur()',b);assert.equal(r.status,'failed');assert.equal(r.result.error.code,'RESOURCE_LIMIT');assert.equal(r.result.error.reason,'stack');assert.equal(r.result.runtimeReset,true);
 let next=await js('var protectedValue=123;console.log("recovered",typeof retained)',b);assert.equal(text(next),'recovered undefined');assert.equal(next.generation,r.generation+1);rows.push({name:'host-stack',error:r.result.error,generation:[r.generation,next.generation]});
 for(const code of ['throw new Error("out of memory")','throw new RangeError("out of memory")','throw new InternalError("out of memory")','throw Object.assign(new Error("out of memory"),{name:"InternalError"})','throw Object.assign(new Error("Maximum call stack size exceeded"),{name:"RangeError"})']){
  const ordinary=await js(code,b);assert.equal(ordinary.result.error.code,'JS_ERROR');assert.equal(ordinary.result.runtimeReset,false);assert.equal(text(await js('console.log(protectedValue)',b)),'123');assert.equal(h.bridge.sessions.get(b.id).generation,ordinary.generation);
 }
 r=await js('var retained=[];while(true)retained.push(new Uint8Array(1048576))',b);assert.equal(r.status,'failed');assert.equal(r.result.error.code,'JS_ERROR');assert.equal(r.result.error.guestName,'InternalError');assert.match(r.result.error.message,/out of memory/i);assert.equal(r.result.runtimeReset,false);
 next=await js('retained=null;console.log("recovered",protectedValue)',b);assert.equal(text(next),'recovered 123');assert.equal(next.generation,r.generation);rows.push({name:'guest-memory-exception',error:r.result.error,runtimeReset:r.result.runtimeReset,generation:[r.generation,next.generation]});
 h.evidence.push({conditions:['REQ-C-RUNTIME-004-C01'],status:'pass',codeBytes:65536,timeBoundary:[50,30000,120000],rows});
});


test('B01C malformed Adam7 and expanded ICC are rejected through real display while valid Adam7 stays complete',async()=>{
 const rows=[];
 for(const [kind,expected] of [['adam-short','INVALID_IMAGE'],['icc-large','IMAGE_RESOURCE_LIMIT']]){
  const code=`var candidate=await outputPage.evaluate(async kind=>fetch('/output-review-image?kind='+kind).then(r=>r.json()),${JSON.stringify(kind)});try{display(candidate);console.log('accepted')}catch(error){console.log('rejected',error.message)}console.log('after');candidate=null;`;
  const r=done(await js(code));assert.equal(r.content.length,2);assert.match(r.content[0].text,new RegExp('^rejected '+expected));assert.equal(r.content[1].text,'after');rows.push({kind,error:r.content[0].text});
 }
 const r=done(await js(`var adam=await outputPage.evaluate(async()=>fetch('/output-review-image?kind=adam-valid').then(r=>r.json()));display(adam);console.log('after-valid');adam=null`));assert.equal(r.content[0].type,'image');assert.equal(r.content[1].text,'after-valid');
 h.evidence.push({conditions:['REQ-DISPLAY-002-C01','REQ-C-RUNTIME-007-C01'],status:'pass',rows,validAdam7:true});
});


test('B01C complete PNG format matrix preserves supported originals and rejects invalid or excessive structures',async()=>{
 const rows=[],failures=[];
 for(const row of pngFormatCases()){
  const r=done(await js(`var matrixPng=await outputPage.evaluate(async name=>fetch('/output-format-image?name='+name).then(r=>r.json()),${JSON.stringify(row.name)});try{display(matrixPng);console.log('accepted')}catch(error){console.log('rejected',error.message)}console.log('after');matrixPng=null;`));
  const imageBlocks=r.content.filter(c=>c.type==='image').length,diagnostic=r.content.find(c=>c.type==='text')?.text,after=r.content.at(-1).text;
  const valid=imageBlocks===(row.valid?1:0)&&after==='after'&&(row.valid?diagnostic==='accepted':(row.resource?/^rejected IMAGE_RESOURCE_LIMIT/:/^rejected INVALID_IMAGE/).test(diagnostic));
  const record={name:row.name,expectedValid:row.valid,imageBlocks,diagnostic,after};rows.push(record);if(!valid)failures.push(record);
 }
 h.evidence.push({conditions:['REQ-DISPLAY-001-C01','REQ-DISPLAY-002-C01','REQ-C-RUNTIME-007-C01'],status:failures.length?'fail':'pass',rows});
 assert.deepEqual(failures,[],'All PNG format cases must match their specified admission and continuation');

});


test('B01C stored fixed and dynamic streams preserve valid images and reject malformed compression synchronously',async()=>{
 const rows=[];
 for(const row of compressionPngCases()){
  const result=await js(`var compressedImage=await outputPage.evaluate(async name=>(await fetch('/output-review-image?kind='+name)).json(),${JSON.stringify(row.name)});try{display(compressedImage);console.log('accepted')}catch(error){console.log('rejected '+error.message)}console.log('after');`);
  const content=done(result).content,images=content.filter(c=>c.type==='image');
  const diagnostic=content.find(c=>c.type==='text')?.text,after=content.at(-1).text;
  const valid=images.length===(row.valid?1:0)&&after==='after'&&(row.valid?diagnostic==='accepted':/^rejected INVALID_IMAGE/.test(diagnostic));
  rows.push({name:row.name,expectedValid:row.valid,imageBlocks:images.length,diagnostic,after,passed:valid});
 }
 h.evidence.push({conditions:['REQ-DISPLAY-001-C01','REQ-DISPLAY-002-C01'],status:rows.every(r=>r.passed)?'pass':'fail',rows});
 assert.deepEqual(rows.filter(r=>!r.passed),[]);
});
