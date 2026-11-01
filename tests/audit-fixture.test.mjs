// Fixture-only oracle. These actions are intentionally not product evidence.
import test from 'node:test';import assert from 'node:assert/strict';import {chromium} from 'playwright';import {startFixture,createRun,applyEvent} from '../test-site/server.mjs';import os from 'node:os';import path from 'node:path';
test('audit judge refuses wrong values and records each correct step independently',()=>{const r=createRun('audit');assert(!applyEvent(r,{type:'audit-step',key:'drag',value:'wrong'}).accepted);assert(!applyEvent(r,{type:'audit-step',key:'injected',value:'clicked'}).accepted);assert(applyEvent(r,{type:'audit-step',key:'drag',value:'shipment-A'}).accepted);assert.equal(r.status,'pending');assert(!r.state.passed.slot)});
test('fixture oracle: delayed, slotted, HTML drag, readonly and transformed frame really work',async()=>{
 const site=await startFixture();const browser=await chromium.launch({executablePath:process.env.TEST_CHROME||path.join(os.homedir(),'Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'),headless:true});
 try{const coverage=await fetch(site.url+'/coverage');assert.equal(coverage.status,200);assert.equal(((await coverage.text()).match(/<code>/g)||[]).length,64);const p=await browser.newPage();await p.goto(site.url+'/audit');await p.getByText('진단 준비 완료',{exact:true}).waitFor();
 await p.getByRole('button',{name:'지연 승인',exact:true}).click();await p.getByText('PASS · delay',{exact:true}).waitFor();
 await p.getByRole('button',{name:'슬롯 승인',exact:true}).click();await p.getByText('PASS · slot',{exact:true}).waitFor();
 await p.locator('#drag-source').dragTo(p.locator('#drag-target'));await p.getByText('PASS · drag',{exact:true}).waitFor();
 await assert.rejects(p.getByLabel('고정 문서번호',{exact:true}).fill('BROKEN',{timeout:400}),/editable|Timeout/);assert.equal(await p.getByLabel('고정 문서번호').inputValue(),'LOCKED');
 await p.frameLocator('iframe').getByRole('button',{name:'좌표 내부 실행',exact:true}).click();await p.frameLocator('iframe').getByRole('button',{name:'좌표 성공',exact:true}).waitFor();await p.getByText('PASS · coordinates',{exact:true}).waitFor();
 const image=await p.screenshot({clip:{x:0,y:0,width:320,height:240}});assert.equal(image.readUInt32BE(16),320);assert.equal(image.readUInt32BE(20),240);
 const id=await p.getAttribute('body','data-run');const run=await fetch(site.url+'/api/runs/'+id).then(r=>r.json());for(const key of ['delay','slot','drag'])assert(run.state.passed[key]);
 }finally{await browser.close();await site.close()}
});
