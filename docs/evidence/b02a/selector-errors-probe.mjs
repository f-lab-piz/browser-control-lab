import path from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const {productRuntime,resultText}=await import(pathToFileURL(path.resolve('tests/helpers/product-runtime.mjs')).href);
const h=await productRuntime('selector-errors',{extraSources:[path.relative(process.cwd(),fileURLToPath(import.meta.url))]});const s=await h.client.session(),rows=[];
try{
 let r=await h.client.js(s.id,`var p=await browser.open(${JSON.stringify(h.fixture.url+'/selection?embedded=1&case=errors')});await p.locator('#click-count').waitFor();var oldRef=(await p.snapshot({root:'#refs'})).refs.find(r=>r.name==='Stable Ref').ref;`);assert.equal(r.status,'completed');
 for(const code of ["await p.locator('[').count()","await p.locator('[').click()"]){r=await h.client.js(s.id,code);assert.equal(r.status,'failed');assert.match(r.result.error.message,/SyntaxError|valid selector/i);rows.push({case:'malformed-css',code,error:r.result.error})}
 r=await h.client.js(s.id,`await p.goto(${JSON.stringify(h.fixture.url+'/selection?embedded=1&case=new-errors')});`);assert.equal(r.status,'completed');
 for(const code of ['await p.locator(oldRef).count()','await p.locator(oldRef).click()']){r=await h.client.js(s.id,code);assert.equal(r.status,'failed');assert.match(r.result.error.message,/STALE_DOCUMENT_REF/);rows.push({case:'stale-document',code,error:r.result.error})}
 r=await h.client.js(s.id,"console.log(await p.locator('#click-count').textContent())");assert.equal(resultText(r),'0');
 const observed=h.context.pages().find(p=>p.url().includes('case=new-errors'));assert.equal(await observed.locator('#click-count').textContent(),'0');
 const result={grade:'HTTP-extension-QuickJS-product-supplement',status:'PASS',rows,clicks:0};h.evidence.push(result);await mkdir('output/finish-stage6',{recursive:true});await writeFile('output/finish-stage6/selector-errors.json',JSON.stringify(result,null,2)+'\n');console.log('PASS:4 public errors,0 clicks');
}finally{await h.close()}
