// Native browser oracle: fixture behavior only, not product execution evidence.
import test from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import os from 'node:os';
import path from 'node:path';
import {existsSync} from 'node:fs';
import {startFixture} from '../test-site/server.mjs';

test('evaluation fixture exposes root shadow slot identities and real frame lifecycle independently',async()=>{
 const fixture=await startFixture();let browser;
 try{
  const fallback=path.join(os.homedir(),'Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
  browser=await chromium.launch({executablePath:process.env.TEST_CHROME||(existsSync(fallback)?fallback:undefined),args:['--site-per-process','--host-resolver-rules=MAP mail.test 127.0.0.1','--no-proxy-server']});
  const page=await browser.newPage();await page.goto(fixture.url+'/evaluation');
  assert.equal(await page.locator('body').getAttribute('data-scope'),'main');
  assert.deepEqual(await page.locator('#order > *').evaluateAll(els=>els.map(el=>el.id)),['a','host','b']);
  assert.deepEqual(await page.locator('#host').evaluate(el=>Array.from(el.shadowRoot.children).flatMap(child=>child.tagName==='SLOT'?child.assignedElements().map(el=>el.id):[child.id])),['s','light','t']);
  await page.getByRole('button',{name:'순서 바꾸기',exact:true}).click();
  assert.deepEqual(await page.locator('#order > *').evaluateAll(els=>els.map(el=>el.id)),['b','a','host']);
  const frame=page.frameLocator('#child');await frame.locator('#effect').waitFor();
  assert.equal(await frame.locator('body').getAttribute('data-scope'),'child');
  assert.equal(await frame.locator('#effect').textContent(),'0');
  // This isolated fixture explicitly tests evaluation effects and the real
  // child-to-parent relay. No completion verdict is written or synthesized.
  await frame.locator('body').evaluate(()=>parent.postMessage({evaluationEffect:true},'*'));
  await page.waitForFunction(()=>document.querySelector('#child-effect').textContent==='1');
  const child=page.frames().find(frame=>frame.url().includes('mail.test'));assert(child);
  await Promise.all([child.waitForURL('**version=2'),page.getByRole('button',{name:'프레임 교체',exact:true}).click()]);
  assert.equal(await page.locator('#frame-state').textContent(),'navigated');
  await frame.locator('#effect').waitFor();assert.equal(await frame.locator('#effect').textContent(),'0');
  await page.getByRole('button',{name:'프레임 분리',exact:true}).click();
  assert.equal(await page.locator('iframe').count(),0);assert.equal(await page.locator('#frame-state').textContent(),'detached');
 }finally{await browser?.close();await fixture.close()}
});
