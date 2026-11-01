// Test-site validation only. These direct Playwright actions are NOT product-extension E2E evidence.
import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {startFixture} from '../test-site/server.mjs';
let site,browser,context,page;
const outcomes=[];
const fallback=path.join(os.homedir(),'Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
before(async()=>{
 site=await startFixture();
 const executablePath=process.env.TEST_CHROME||(existsSync(fallback)?fallback:undefined);
 browser=await chromium.launch({executablePath,headless:process.env.HEADED!=='1',args:['--site-per-process','--host-resolver-rules=MAP app.test 127.0.0.1, MAP portal.test 127.0.0.1, MAP mail.test 127.0.0.1, MAP calendar.test 127.0.0.1','--no-proxy-server']});
 context=await browser.newContext({viewport:{width:1500,height:1000}});page=await context.newPage();
 page.on('pageerror',e=>outcomes.push({pageError:e.message}));
});
after(async()=>{
 await mkdir('output/fixture-validation',{recursive:true});
 await writeFile('output/fixture-validation/results.json',JSON.stringify({grade:'fixture-site-only',browser:browser?.version(),outcomes},null,2));
 await browser?.close();await site?.close();
});
async function start(scenario,{cross=false}={}){
 await page.goto((cross?'http://app.test:'+site.port:site.url)+'/?scenario='+scenario+(cross?'&cross=1':''));
 await page.waitForFunction(()=>Boolean(document.body.dataset.run));
 return await page.getAttribute('body','data-run');
}
async function passed(id,name){
 await page.waitForFunction(()=>document.getElementById('verdict')?.textContent.startsWith('PASS'),{},{timeout:8000});
 const result=await fetch(site.url+'/api/runs/'+id).then(r=>r.json());assert.equal(result.status,'passed');outcomes.push({scenario:name,status:'passed',events:result.events.length});
}
test('basic form is judged by site state',async()=>{
 const id=await start('basic');await page.getByLabel('이름',{exact:true}).fill('테스터');await page.getByLabel('약관 확인').check();await page.getByRole('button',{name:'제출',exact:true}).click();await passed(id,'basic');
});
test('nested cross-site mailbox must scroll internally, lazy-load and read target',async()=>{
 const id=await start('mail',{cross:true});const shell=page.frameLocator('iframe[title="업무 포털"]'),mail=shell.frameLocator('iframe[title="메일 업무"]');const list=mail.getByRole('list',{name:'메일 목록'});
 for(let i=0;i<7;i++){
  if(await mail.getByRole('button',{name:'메일 137 · 계약서 최종 확인',exact:true}).count())break;
  await list.hover();await page.mouse.wheel(0,3000);
  await page.waitForTimeout(300);
 }
 await mail.getByRole('button',{name:'메일 137 · 계약서 최종 확인',exact:true}).click();await mail.getByRole('button',{name:'읽음 처리',exact:true}).click();await passed(id,'nested-mail');assert(page.frames().some(f=>new URL(f.url()).hostname==='mail.test'));
});
test('booking grid requires pointer drag, double click, editor and confirmation',async()=>{
 const id=await start('booking',{cross:true});const frame=page.frameLocator('iframe[title="업무 포털"]').frameLocator('iframe[title="회의실 업무"]');const source=frame.locator('[data-row="2"][data-col="8"]'),target=frame.locator('[data-row="2"][data-col="11"]');
 await target.scrollIntoViewIfNeeded();await source.scrollIntoViewIfNeeded();const a=await source.boundingBox(),b=await target.boundingBox();assert(a&&b);
 await page.mouse.move(a.x+a.width/2,a.y+a.height/2);await page.mouse.down();await page.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:12});await page.mouse.up();await source.dblclick();await frame.getByLabel('회의 제목',{exact:true}).fill('설계 회의');await frame.getByLabel('참석 인원',{exact:true}).fill('4');await frame.getByRole('button',{name:'예약 확정',exact:true}).click();await passed(id,'booking-grid');
});
test('virtualized dropdown loads only a window of rows and accepts scrolled target',async()=>{
 const id=await start('dropdown');await page.getByRole('button',{name:'부서 선택',exact:true}).click();const box=page.getByRole('listbox',{name:'부서 목록'});
 assert(await page.getByRole('option').count()<30);
 for(let i=0;i<38;i++){
  if(await page.getByRole('option',{name:'부서 230',exact:true}).count())break;
  await box.hover();await page.mouse.wheel(0,252);await page.waitForTimeout(70);
 }
 await page.getByRole('option',{name:'부서 230',exact:true}).click();await passed(id,'virtual-dropdown');
});
test('large DOM includes offscreen target and long links without scrolling to generate rows',async()=>{
 const id=await start('large');const target=page.getByRole('link',{name:'정산 내역 2761',exact:true});assert.equal(await page.locator('.large-list article').count(),3200);assert.equal(await page.evaluate(()=>scrollY),0);assert((await target.getAttribute('href')).length>2000);await target.click();await passed(id,'large-dom');
});
test('file bytes are verified and browser download contents match',async()=>{
 const id=await start('files');await page.getByLabel('검증 파일',{exact:true}).setInputFiles({name:'proof.txt',mimeType:'text/plain',buffer:Buffer.from('browser-control-upload-proof')});await page.getByText('업로드 내용 검증 완료',{exact:true}).waitFor();const pending=page.waitForEvent('download');await page.getByRole('button',{name:'결과 다운로드',exact:true}).click();const download=await pending;const file=await download.path();const {readFile}=await import('node:fs/promises');assert.equal(await readFile(file,'utf8'),'browser-control-upload-proof');await passed(id,'upload-download');
});
test('replaced Shadow DOM element is distinct and current generation is judged',async()=>{
 const id=await start('dynamic');await page.getByRole('button',{name:'요소 교체',exact:true}).click();await page.getByRole('button',{name:'현재 세대 완료',exact:true}).click();await passed(id,'shadow-dom-replacement');
 await mkdir('output/fixture-validation',{recursive:true});await page.screenshot({path:'output/fixture-validation/site.png',fullPage:true});
});
