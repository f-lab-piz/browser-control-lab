import {createServer} from 'node:http';
import {writeFile} from 'node:fs/promises';
import {productRuntime,resultText} from '../../tests/helpers/product-runtime.mjs';
const html=`<!doctype html><html lang="ko"><head><title>Scope probe</title></head><body id="body"><div id="one">One</div><div id="host"><button id="slotted" slot="x">Slot Hidden</button></div><script>document.querySelector('#host').attachShadow({mode:'open'}).innerHTML='<div style="visibility:hidden"><slot name="x"></slot></div>';</script></body></html>`;
const server=createServer((req,res)=>{res.setHeader('content-type','text/html');res.end(html)});await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/';let h;const rows=[];
try{
 h=await productRuntime('independent-probes');const s=await h.client.session();
 const run=async code=>{const r=await h.client.js(s.id,code);if(r.status!=='completed')throw Error(JSON.stringify(r));return JSON.parse(resultText(r))};
 await run(`var p=await browser.open(${JSON.stringify(url)});await p.locator('#one').waitFor();console.log(true)`);
 rows.push({kind:'product-queries',actual:await run(`var attempt=async fn=>{try{return {value:await fn()}}catch(error){return {error:error.message}}};console.log({scope:await p.locator(':scope').evaluateAll(es=>es.map(e=>e.tagName+'#'+e.id)),scopeBody:await p.locator(':scope > body').count(),bodyId:await attempt(()=>p.locator(':scope > body').getAttribute('id')),hiddenSlotRole:await p.getByRole('button',{name:'Slot Hidden',exact:true}).count(),hiddenSlotIncluded:await p.getByRole('button',{name:'Slot Hidden',exact:true,includeHidden:true}).count()});`)});
 const observed=h.context.pages().find(p=>p.url()===url);rows.push({kind:'native-read-only-oracle',actual:await observed.evaluate(()=>({scope:[...document.querySelectorAll(':scope')].map(e=>e.tagName+'#'+e.id),scopeBody:document.querySelectorAll(':scope > body').length,bodyId:document.querySelector(':scope > body')?.id,slotVisible:getComputedStyle(document.querySelector('#slotted')).visibility,rects:document.querySelector('#slotted').getClientRects().length}))});
 h.evidence.push(...rows);await writeFile('output/pr20-rereview/independent-probes.json',JSON.stringify(rows,null,2));console.log(JSON.stringify(rows,null,2));
}finally{await h?.close();await new Promise(r=>server.close(r))}
