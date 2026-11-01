// Native fixture oracle only. Product behavior must use the separate extension tests.
import test from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {existsSync} from 'node:fs';
import os from 'node:os';import path from 'node:path';
import {startFixture} from '../test-site/server.mjs';
test('selection fixture preserves raw names roots slots mutations and trusted outcome judges',async()=>{
 const fixture=await startFixture();let browser;
 try{
  const fallback=path.join(os.homedir(),'Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
  browser=await chromium.launch({executablePath:process.env.TEST_CHROME||(existsSync(fallback)?fallback:undefined),args:['--site-per-process','--host-resolver-rules=MAP mail.test 127.0.0.1','--no-proxy-server']});
  const page=await browser.newPage();await page.goto(fixture.url+'/selection');
  assert.equal(await page.locator('#long-label-text').textContent(),'x'.repeat(1000)+' 라벨끝🧭');assert.equal(await page.locator('#long-body').textContent(),'v'.repeat(1000)+' 본문끝🧭');
  assert.equal(await page.locator('#name-shadow #ref-beta').textContent(),'Shadow Beta');assert.equal(await page.locator('body > #ref-beta').count(),0);assert.equal(await page.locator('#names > #ref-beta').textContent(),'Beta');
  assert.deepEqual(await page.locator('#label-host').evaluate(el=>[el.shadowRoot.firstChild.textContent,el.shadowRoot.querySelector('slot').assignedNodes()[0].textContent]),['Shadow ','Slot Name']);
  assert.equal(await page.frameLocator('#child').locator('#css-child').textContent(),'Main CSS');
  await page.locator('#add').click();assert.equal(await page.locator('#css-added').textContent(),'Added CSS');
  const original=await page.locator('#ref-target').elementHandle();await page.locator('#replace').click();assert.equal(await original.evaluate(el=>el.isConnected),false);assert.equal(await page.locator('#click-count').textContent(),'0');
  await page.getByRole('button',{name:'Proof Button',exact:true}).click();await page.getByLabel('Proof Field',{exact:true}).fill('selection-proof');assert.equal(await page.locator('#verdict').textContent(),'PASS: proof clicked');assert.equal(await page.locator('#fill-verdict').textContent(),'PASS: proof filled');
  const events=JSON.parse(await page.locator('#events').textContent());assert.deepEqual(events,[{type:'click',id:'proof-button',trusted:true}]);
 }finally{await browser?.close();await fixture.close()}
});

test('selection boundary fixture distinguishes projected text from hidden physical DOM and exposes document metadata',async()=>{
 const fixture=await startFixture();let browser;
 try{
  const fallback=path.join(os.homedir(),'Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
  browser=await chromium.launch({executablePath:process.env.TEST_CHROME||(existsSync(fallback)?fallback:undefined),args:['--site-per-process','--host-resolver-rules=MAP mail.test 127.0.0.1','--no-proxy-server']});
  const page=await browser.newPage();await page.goto(fixture.url+'/selection-boundaries');
  assert.deepEqual(await page.evaluate(()=>({root:[...document.querySelectorAll(':scope')].map(el=>el.tagName),body:[...document.querySelectorAll(':scope > body')].map(el=>el.tagName)})),{root:['HTML'],body:['BODY']});assert.equal(await page.locator('html').getAttribute('lang'),'ko');assert.equal(await page.locator('title').textContent(),'Selection boundary metadata');assert.equal(await page.locator('#boundary-meta').getAttribute('content'),'metadata-proof');assert.equal(await page.locator('#boundary-data').textContent(),'{"fixture":"inert"}');
  assert.equal(await page.locator('#ghost').isVisible(),false);assert.equal(await page.locator('#fallback-ghost').isVisible(),false);assert.equal(await page.locator('#pruning').isVisible(),true);assert.equal(await page.locator('#pruned-ghost').isVisible(),false);assert.equal(await page.locator('#active-fallback-span').isVisible(),true);
  assert.equal(await page.frameLocator('#boundary-child').locator('html').getAttribute('data-scope'),'child');
  await page.locator('#pruning').click();await page.locator('#raw-slot').click();await page.locator('#active-fallback-span').click();assert.equal(await page.locator('#verdict').textContent(),'PASS: projected controls clicked');assert.equal(await page.locator('#click-count').textContent(),'3');
  assert.deepEqual(JSON.parse(await page.locator('#events').textContent()),[{id:'pruning',trusted:true},{id:'raw-slot',trusted:true},{id:'active-fallback',trusted:true}]);
 }finally{await browser?.close();await fixture.close()}
});
