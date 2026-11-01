import {createServer} from 'node:http';
import {writeFile} from 'node:fs/promises';
import {productRuntime,resultText} from '../../tests/helpers/product-runtime.mjs';
const html=`<!doctype html><html><head><title>Review title</title></head><body>
<div id="unassigned"><span id="ghost">Ghost Needle</span></div>
<div id="fallback"><span slot="x" id="assigned">Active Needle</span></div>
<div id="pruning"><span id="pruned-ghost">Prune Needle</span></div>
<button id="proof" onclick="document.querySelector('#out').textContent='clicked'">Ready</button><output id="out">0</output>
<script>
document.querySelector('#unassigned').attachShadow({mode:'open'}).innerHTML='<span>Rendered Content</span>';
document.querySelector('#fallback').attachShadow({mode:'open'}).innerHTML='<slot name="x"><span id="fallback-ghost">Fallback Needle</span></slot>';
document.querySelector('#pruning').attachShadow({mode:'open'}).textContent='Prune Needle';
</script></body></html>`;
const server=createServer((req,res)=>{res.setHeader('content-type','text/html');res.end(html)});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const url='http://127.0.0.1:'+server.address().port;let h;const rows=[];
try{
 h=await productRuntime('independent-probes');const s=await h.client.session();
 const run=async code=>{const r=await h.client.js(s.id,code);if(r.status!=='completed')throw Error(JSON.stringify(r));return JSON.parse(resultText(r))};
 rows.push({kind:'open',actual:await run(`var p=await browser.open(${JSON.stringify(url)});await p.locator('#proof').waitFor();console.log({ready:await p.locator('#proof').count()})`)});
 rows.push({kind:'product-queries',actual:await run(`console.log({ghost:await p.getByText('Ghost Needle',{exact:true}).evaluateAll(es=>es.map(e=>({id:e.id,rects:e.getClientRects().length}))),fallback:await p.getByText('Fallback Needle',{exact:true}).evaluateAll(es=>es.map(e=>({id:e.id,rects:e.getClientRects().length}))),prune:await p.getByText('Prune Needle',{exact:true}).evaluateAll(es=>es.map(e=>({id:e.id,rects:e.getClientRects().length}))),cssHTML:await p.locator('html').count(),cssHead:await p.locator('head').count()})`)});
 const observed=h.context.pages().find(p=>p.url()===url+'/');rows.push({kind:'native-read-only-oracle',actual:await observed.evaluate(()=>({ghostBox:document.querySelector('#ghost').getClientRects().length,fallbackBox:document.querySelector('#fallback').shadowRoot.querySelector('#fallback-ghost').getClientRects().length,pruneHostBox:document.querySelector('#pruning').getClientRects().length,pruneGhostBox:document.querySelector('#pruned-ghost').getClientRects().length,htmlCount:document.querySelectorAll('html').length,headCount:document.querySelectorAll('head').length}))});
 rows.push({kind:'action-on-pruned',actual:await run(`try{await p.getByText('Prune Needle',{exact:true}).click();console.log({accepted:true})}catch(e){console.log({accepted:false,error:e.message})}`)});
 h.evidence.push(...rows);await writeFile('output/pr20-review/independent-probes.json',JSON.stringify(rows,null,2));console.log(JSON.stringify(rows,null,2));
}finally{await h?.close();await new Promise(r=>server.close(r))}
