// Review regressions: all product actions use HTTP → extension → QuickJS.
import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {inflateSync} from 'node:zlib';
import path from 'node:path';import os from 'node:os';
import {startFixture} from '../test-site/server.mjs';
import {startBridge} from '../bridge/server.mjs';
import {bridgeClient} from '../bridge/client.mjs';
import {buildExtension} from '../scripts/build-extension.mjs';
let site,bridge,client,context,root,session,page;const evidence=[];
const text=r=>r.result?.content?.filter(c=>c.type==='text').map(c=>c.text).join('\n');
async function run(code){const r=await client.js(session.id,code);assert.equal(r.status,'completed',JSON.stringify(r.result?.error));return r}
// Inspect PNG pixels, independent of CDP clip coordinate implementation.
function pngPixels(bytes){
 assert.equal(bytes.subarray(1,4).toString(),'PNG');const w=bytes.readUInt32BE(16),h=bytes.readUInt32BE(20),type=bytes[25];assert.equal(bytes[24],8);assert([2,6].includes(type));const channels=type===6?4:3,parts=[];
 for(let offset=8;offset<bytes.length;){const n=bytes.readUInt32BE(offset),kind=bytes.toString('ascii',offset+4,offset+8);if(kind==='IDAT')parts.push(bytes.subarray(offset+8,offset+8+n));offset+=n+12}
 const raw=inflateSync(Buffer.concat(parts)),stride=w*channels,pixels=Buffer.alloc(stride*h);let cursor=0;
 const paeth=(a,b,c)=>{const p=a+b-c,da=Math.abs(p-a),db=Math.abs(p-b),dc=Math.abs(p-c);return da<=db&&da<=dc?a:db<=dc?b:c};
 for(let y=0;y<h;y++){const filter=raw[cursor++];assert(filter<=4);for(let x=0;x<stride;x++){const at=y*stride+x,left=x>=channels?pixels[at-channels]:0,up=y?pixels[at-stride]:0,corner=y&&x>=channels?pixels[at-stride-channels]:0;const prediction=[0,left,up,Math.floor((left+up)/2),paeth(left,up,corner)][filter];pixels[at]=(raw[cursor++]+prediction)&255}}
 return {w,h,sample:(x,y)=>[...pixels.subarray((y*w+x)*channels,(y*w+x)*channels+3)]};
}
before(async()=>{
 await mkdir('output/review-fixes',{recursive:true});root=await mkdtemp(path.join(os.tmpdir(),'bcl-review-'));site=await startFixture();bridge=await startBridge();client=bridgeClient(bridge.url,bridge.token);
 const extension=await buildExtension({directory:path.join(root,'extension'),connection:{url:bridge.url,token:bridge.extensionToken}});
 context=await chromium.launchPersistentContext(path.join(root,'profile'),{executablePath:process.env.TEST_CHROME||path.join(os.homedir(),'Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'),headless:process.env.HEADED!=='1',args:['--window-size=1440,1100','--disable-extensions-except='+extension,'--load-extension='+extension]});
 for(let i=0;i<200;i++){if((await client.request('/v1/status')).connected)break;await new Promise(r=>setTimeout(r,50))}session=await client.session();
 await run(`var p=await browser.open(${JSON.stringify(site.url+'/review-boundaries.html')});await p.waitForFunction(()=>Boolean(document.getElementById('host')?.shadowRoot?.querySelector('button')));`);page=context.pages().find(p=>p.url().includes('review-boundaries'));
});
after(async()=>{await writeFile('output/review-fixes/boundaries.json',JSON.stringify({browser:context?.browser()?.version(),evidence},null,2));await context?.close();await bridge?.close();await site?.close();if(root)await rm(root,{recursive:true,force:true})});
test('long hasText and hasNotText search the full text independently of snapshot budget',async()=>{
 const r=await run(`console.log(await p.locator('#long').filter({hasText:'needle'}).count(),await p.locator('#long').filter({hasNotText:'needle'}).count());console.log(await p.locator('#long').filter({hasText:/NEEDLE$/i}).count());console.log(await p.locator('#slot-long').filter({hasText:'slotneedle'}).count(),await p.locator('#slot-long').filter({hasNotText:'slotneedle'}).count());`);
 assert.equal(text(r),'1 0\n1\n1 0');assert((await page.locator('#long').textContent()).endsWith('needle'));evidence.push({case:'full-text-filter',pass:true});
});
test('adjacent inline nodes preserve DOM text in positive negative and regex filters',async()=>{
 const r=await run(`console.log(await p.locator('#adjacent').filter({hasText:'foobar'}).count(),await p.locator('#adjacent').filter({hasNotText:'foobar'}).count());console.log(await p.locator('#adjacent').filter({hasText:/^foobarSelect row$/}).count());console.log(await p.locator('#nested').filter({hasText:'foobar'}).count());console.log(await p.locator('#slot-adjacent').filter({hasText:'foobar'}).count(),await p.locator('#slot-adjacent').filter({hasNotText:'foobar'}).count());`);
 assert.equal(text(r),'1 0\n1\n1\n1 0');assert.equal(await page.locator('#adjacent').textContent(),'foobarSelect row');assert.equal(await page.locator('#adjacent').innerText(),'foobarSelect row');evidence.push({case:'adjacent-inline-filter',pass:true});
});
test('explicit DOM whitespace keeps separated words distinct from adjacent text',async()=>{
 const r=await run(`console.log(await p.locator('#spaced').filter({hasText:'foobar'}).count(),await p.locator('#spaced').filter({hasNotText:'foobar'}).count(),await p.locator('#spaced').filter({hasText:'foo bar'}).count());`);assert.equal(text(r),'0 1 1');assert.equal(await page.locator('#spaced').textContent(),'foo bar');evidence.push({case:'explicit-whitespace-filter',pass:true});
});
test('snapshot text budget does not alter native labels or aria-labelledby',async()=>{
 const r=await run(`console.log(await p.getByLabel('Only visible label',{exact:true}).count(),await p.getByRole('textbox',{name:'Only aria labelled',exact:true}).count());`);assert.equal(text(r),'1 1');evidence.push({case:'accessible-labels',pass:true});
});
test('closed details exposes summary shadow control and hides content controls',async()=>{
 const r=await run(`console.log(await p.getByRole('button',{name:'Shadow summary',exact:true}).count(),await p.getByRole('button',{name:'Hidden shadow content',exact:true}).count(),await p.getByRole('button',{name:'Hidden content',exact:true}).count());console.log((await p.snapshot({root:'details'})).text);await p.getByRole('button',{name:'Shadow summary',exact:true}).click();`);
 assert.match(text(r),/^1 0 0/);assert.match(text(r),/Shadow summary/);assert(!text(r).includes('Hidden shadow content'));assert(!text(r).includes('Hidden content'));assert.equal(await page.locator('#host').getByRole('button').textContent(),'clicked');evidence.push({case:'summary-shadow',pass:true});
});
test('scrolled viewport clip captures current blue area rather than document red top',async()=>{
 const r=await run(`await p.locator('#bottom').scrollIntoView();await p.waitForFunction(()=>scrollY>500);display(await p.screenshot({clip:{x:0,y:0,width:100,height:100}}));`);
 const oracle=await page.evaluate(()=>({y:scrollY,hit:document.elementFromPoint(10,10).id}));assert(oracle.y>500);assert.equal(oracle.hit,'bottom');const bytes=Buffer.from(r.result.content.find(c=>c.type==='image').data,'base64'),png=pngPixels(bytes);assert.equal(png.w,100);assert.equal(png.h,100);for(const [x,y] of [[0,0],[20,20],[99,99]])assert.deepEqual(png.sample(x,y),[0,0,255]);await writeFile('output/review-fixes/scrolled-clip.png',bytes);evidence.push({case:'viewport-clip-vertical',pass:true,oracle});
});
test('clip respects horizontal scroll and nonzero viewport origin',async()=>{
 const r=await run(`await p.mouse.move(200,100);await p.mouse.wheel(700,0);await p.waitForFunction(()=>scrollX>100);display(await p.screenshot({clip:{x:20,y:20,width:80,height:60}}));`);
 const oracle=await page.evaluate(()=>({x:scrollX,y:scrollY,hit:document.elementFromPoint(30,30).id}));assert(oracle.x>100);assert.equal(oracle.hit,'bottom');const png=pngPixels(Buffer.from(r.result.content.find(c=>c.type==='image').data,'base64'));assert.equal(png.w,80);assert.equal(png.h,60);assert.deepEqual(png.sample(20,20),[0,0,255]);evidence.push({case:'viewport-clip-horizontal',pass:true,oracle});
});
