import {productRuntime,resultText} from '../../tests/helpers/product-runtime.mjs';
import {writeFile} from 'node:fs/promises';
const h=await productRuntime('long-timeout'),s=await h.client.session(),rows=[];
try{
 rows.push(await h.client.js(s.id,`var page=await browser.open(${JSON.stringify(h.fixture.url+'/evaluation?case=long-timeout')});await page.locator('#effect').waitFor();`));
 for(const timeout of [10000,2147483648,4294967295,Number.MAX_SAFE_INTEGER]){
  const started=Date.now(),r=await h.client.js(s.id,`console.log(await page.waitForFunction(async()=>{document.querySelector('#effect').textContent=String(Number(document.querySelector('#effect').textContent)+1);await new Promise(resolve=>setTimeout(resolve,80));return true},null,{timeout:${timeout}}));`,{timeoutMs:2000});
  const observed=h.context.pages().find(p=>p.url().includes('case=long-timeout'));
  rows.push({timeout,elapsed:Date.now()-started,r,effect:await observed.locator('#effect').textContent()});
 }
 h.evidence.push(...rows);await writeFile('output/pr18-review/long-timeout.json',JSON.stringify(rows,null,2));console.log(JSON.stringify(rows,null,2));
}finally{await h.close()}
