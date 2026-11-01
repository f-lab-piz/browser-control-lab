// Independent native-browser oracle. This does not prove product execution.
import test from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import os from 'node:os';
import path from 'node:path';
import {existsSync} from 'node:fs';
import {mkdir,writeFile} from 'node:fs/promises';
import {startFixture} from '../test-site/server.mjs';
test('reset fixture observes trusted root and OOPIF releases and delayed real clicks without injecting verdicts',async()=>{
 const fixture=await startFixture();let browser,page;
 try{
  const fallback=path.join(os.homedir(),'Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
  browser=await chromium.launch({executablePath:process.env.TEST_CHROME||(existsSync(fallback)?fallback:undefined),args:['--site-per-process','--host-resolver-rules=MAP mail.test 127.0.0.1','--no-proxy-server']});
  page=await browser.newPage();await page.goto(fixture.url+'/reset');
  await page.locator('#marker').fill('A');await page.keyboard.down('Control');const root=await page.locator('#marker').boundingBox();await page.mouse.move(root.x+10,root.y+10);await page.mouse.down();await page.mouse.up();await page.keyboard.up('Control');
  assert.equal(await page.locator('#held').textContent(),'해제됨');assert.equal(await page.locator('#marker').inputValue(),'A');
  const child=page.frameLocator('iframe');await child.locator('#marker').click();
  // Use the child locator's focused key path, rather than the page-global
  // keyboard immediately after a cross-process pointer focus transition.
  await child.locator('#marker').press('Control');
  // The child keyup is synchronous, but its cross-process parent relay is not.
  // Poll the actual DOM from the observer; do not depend on the parent's rAF.
  let relay;for(let deadline=Date.now()+3000;Date.now()<deadline;){relay=await page.locator('#child-events').textContent();if(relay.includes('keyup'))break;await new Promise(resolve=>setTimeout(resolve,25))}
  assert(relay?.includes('keyup'),'The parent relay must contain the actual child keyup');
  const childEvents=JSON.parse(await page.locator('#child-events').textContent());assert(childEvents.some(e=>e.type==='keydown'&&e.trusted));assert(childEvents.some(e=>e.type==='keyup'&&e.trusted));
  await page.locator('#arm').click();await page.locator('#late').waitFor();assert.equal(await page.locator('#click-count').textContent(),'0');await page.locator('#late').click();assert.equal(await page.locator('#click-count').textContent(),'1');
 }catch(error){
  const out=process.env.BCL_RUN_DIR||'output/goal-b01d/native-fixture';await mkdir(out,{recursive:true});
  const observation={error:error.message,parent:await page?.evaluate(()=>({active:document.activeElement?.outerHTML,events:document.querySelector('#events')?.textContent,childEvents:document.querySelector('#child-events')?.textContent})).catch(e=>({error:e.message})),children:[]};
  for(const frame of page?.frames()||[])if(frame!==page.mainFrame())observation.children.push({url:frame.url(),document:await frame.evaluate(()=>({active:document.activeElement?.outerHTML,events:document.querySelector('#events')?.textContent})).catch(e=>({error:e.message}))});
  await writeFile(path.join(out,'reset-native-failure.json'),JSON.stringify(observation,null,2));throw error;
 }finally{await browser?.close();await fixture.close()}
});
