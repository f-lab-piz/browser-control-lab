// Product-path tests: actions must travel via HTTP → extension → QuickJS worker.
import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import {observedChrome} from './helpers/observed-chrome.mjs';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {startBridge} from '../bridge/server.mjs';
import {bridgeClient} from '../bridge/client.mjs';
import {startFixture} from '../test-site/server.mjs';
import {buildExtension} from '../scripts/build-extension.mjs';
let bridge,client,context,root,session,fixture,browser;const evidence=[];
const text=result=>result.result?.content?.filter(c=>c.type==='text').map(c=>c.text).join('\n');
before(async()=>{
 fixture=await startFixture();root=await mkdtemp(path.join(os.tmpdir(),'bcl-runtime-'));await mkdir(path.join(root,'downloads'));bridge=await startBridge({downloadRoots:[path.join(root,'downloads')]});client=bridgeClient(bridge.url,bridge.token);
 const directory=await buildExtension({directory:path.join(root,'extension'),connection:{url:bridge.url,token:bridge.extensionToken}});
 const fallback=path.join(os.homedir(),'Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
 browser=await observedChrome({profile:path.join(root,'profile'),executablePath:process.env.TEST_CHROME||(existsSync(fallback)?fallback:undefined),headless:process.env.HEADED!=='1',downloadsPath:path.join(root,'downloads'),args:['--window-size=1440,1100','--site-per-process','--host-resolver-rules=MAP app.test 127.0.0.1, MAP portal.test 127.0.0.1, MAP mail.test 127.0.0.1, MAP calendar.test 127.0.0.1','--no-proxy-server','--disable-extensions-except='+directory,'--load-extension='+directory]});context=browser.context;
 for(let i=0;i<200;i++){if((await client.request('/v1/status')).connected)break;await new Promise(r=>setTimeout(r,50))}
 context.on('page',p=>p.on('dialog',()=>{}));for(const p of context.pages())p.on('dialog',()=>{});
 assert((await client.request('/v1/status')).connected,'Extension did not connect');session=await client.session();
});
after(async()=>{
 await mkdir('output/runtime-e2e',{recursive:true});await writeFile('output/runtime-e2e/results.json',JSON.stringify({grade:'product-extension-runtime',browser:context?.browser()?.version(),observer:browser?.observer,evidence},null,2));
 await browser?.close();await bridge?.close();await fixture?.close();if(root)await rm(root,{recursive:true,force:true});
});
test('guide and authentication',async()=>{
 const r=await fetch(bridge.url+'/v1/status');assert.equal(r.status,401);
 const guide=await client.request('/v1/guide');assert.deepEqual(guide.external,['guide','reset','js']);
 evidence.push({case:'guide-auth',passed:true});
});
test('JavaScript executes inside extension WASM and explicit output is collected',async()=>{
 const r=await client.js(session.id,'console.log(6 * 7);');assert.equal(r.status,'completed',JSON.stringify(r));assert.equal(text(r),'42');assert.equal(r.result.execution,'extension-worker/QuickJS-WASM');evidence.push({case:'wasm-execution',passed:true,result:r});
});
test('bindings persist and top-level await invokes browser APIs asynchronously',async()=>{
 let r=await client.js(session.id,'const saved = 40; const {x,y}={x:1,y:2}; console.log(saved+x+y);');assert.equal(text(r),'43',JSON.stringify(r));
 r=await client.js(session.id,'const saved = saved + 2; const profiles = await browser.list(); console.log(saved, profiles[0].id);');assert.equal(text(r),'42 current',JSON.stringify(r));evidence.push({case:'persistent-async',passed:true});
});
test('sessions do not share JavaScript variables',async()=>{
 const other=await client.session();const r=await client.js(other.id,'console.log(typeof saved)');assert.equal(text(r),'undefined',JSON.stringify(r));evidence.push({case:'session-isolation',passed:true});
});
test('syntax and execution errors return failures and later requests still work',async()=>{
 const bad=await client.js(session.id,'throw new Error("expected failure")');assert.equal(bad.status,'failed');assert.match(bad.result.error.message,/expected failure/);
 const ok=await client.js(session.id,'console.log("recovered")');assert.equal(text(ok),'recovered');evidence.push({case:'error-recovery',passed:true});
});
test('infinite computation is interrupted by its deadline',async()=>{
 const started=Date.now(),r=await client.js(session.id,'while(true) {}',{timeoutMs:150});assert.equal(r.status,'failed',JSON.stringify(r));assert.equal(r.result.error.code,'TIMEOUT');assert(Date.now()-started<5000);evidence.push({case:'cpu-deadline',passed:true});
});
test('reset cancels unresolved execution, clears variables and creates a usable generation',async()=>{
 const running=await client.request('/v1/sessions/'+session.id+'/js',{code:'await new Promise(()=>{})',timeoutMs:20000});await new Promise(r=>setTimeout(r,100));
 const reset=await client.reset(session.id);assert.equal(reset.status,'completed',JSON.stringify(reset));assert.equal((await client.wait(running.requestId)).status,'cancelled');
 const r=await client.js(session.id,'console.log(typeof saved, 1+2)');assert.equal(text(r),'undefined 3',JSON.stringify(r));evidence.push({case:'reset-cancel',passed:true,generation:r.generation});
});
test('output budget truncation is explicit',async()=>{
 const r=await client.js(session.id,'console.log("x".repeat(100000))');assert.equal(r.status,'completed');assert.equal(r.result.truncated,true);assert(text(r).length<=65536);evidence.push({case:'output-budget',passed:true});
});

test('product extension opens a tab, observes DOM and completes the basic form using real input',async()=>{
 const r=await client.js(session.id,`var page=await browser.open(${JSON.stringify(fixture.url+'/?scenario=basic')});await page.getByLabel('이름',{exact:true}).waitFor();await page.getByLabel('이름',{exact:true}).fill('테스터');await page.getByLabel('약관 확인').setChecked(true);await page.getByRole('button',{name:'제출',exact:true}).click();var snap=await page.snapshot({query:'완료 조건 충족'});console.log(snap.text);console.log(page.id);`);
 assert.equal(r.status,'completed',JSON.stringify(r));const tabId=Number(text(r).trim().split('\n').at(-1));const independent=context.pages().find(p=>p.url().includes('/?scenario=basic'));assert(independent);await independent.getByText('PASS · 완료 조건 충족',{exact:true}).waitFor();evidence.push({case:'product-basic-form',passed:true,tabId});
});
test('product snapshot finds offscreen DOM and avoids long tracking URLs without scrolling',async()=>{
 const r=await client.js(session.id,`await page.goto(${JSON.stringify(fixture.url+'/?scenario=large')});await page.getByRole('link',{name:'정산 내역 2761',exact:true}).waitFor();var before=await page.snapshot({query:'정산 내역 2761'});console.log(before.text);console.log(before.metrics);`);
 assert.equal(r.status,'completed',JSON.stringify(r));assert.match(text(r),/정산 내역 2761/);assert(!text(r).includes('tracking-'));assert(text(r).length<3000);const independent=context.pages().find(p=>p.url().includes('/?scenario=large'));assert.equal(await independent.evaluate(()=>scrollY),0);evidence.push({case:'product-offscreen-snapshot',passed:true,outputChars:text(r).length});
});
test('product extension discovers cross-site nested frames and snapshots mailbox without outer scrolling',async()=>{
 const url='http://app.test:'+fixture.port+'/?scenario=mail&cross=1';
 const r=await client.js(session.id,`await page.goto(${JSON.stringify(url)});var frames=[],mail;for(var until=Date.now()+10000;Date.now()<until;){frames=await page.frames();mail=frames.find(f=>f.url.includes('mail.test'));if(mail)break}console.log(frames);if(!mail)throw Error('mail frame missing');await page.frame(mail.id).getByRole('list',{name:'메일 목록'}).waitFor();var snap=await page.frame(mail.id).snapshot({interactive:true});console.log(snap.text);`);
 assert.equal(r.status,'completed',JSON.stringify(r));assert.match(text(r),/mail.test/);assert.match(text(r),/메일 1/);evidence.push({case:'product-cross-site-frames',passed:true});
});

test('product extension scrolls nested mailbox, loads mail 137 and marks it read',async()=>{
 const r=await client.js(session.id,`var mailScope=page.frame(mail.id);var list=mailScope.getByRole('list',{name:'메일 목록'});await list.waitFor();for(var loaded of [60,90,120,150]){await list.hover();await page.mouse.wheel(0,3000);await mailScope.locator('[data-mail="'+loaded+'"]').waitFor({state:'attached'});}await mailScope.getByRole('button',{name:'메일 137 · 계약서 최종 확인',exact:true}).click();await mailScope.getByRole('button',{name:'읽음 처리',exact:true}).waitFor();await mailScope.getByRole('button',{name:'읽음 처리',exact:true}).click();`);
 assert.equal(r.status,'completed',JSON.stringify(r));const independent=context.pages().find(p=>p.url().includes('scenario=mail'));await independent.getByText('PASS · 완료 조건 충족',{exact:true}).waitFor();evidence.push({case:'product-nested-mail-scroll',passed:true});
});
test('product extension selects booking cells by drag and double click, then saves reservation',async()=>{
 const url='http://app.test:'+fixture.port+'/?scenario=booking&cross=1';
 const r=await client.js(session.id,`await page.goto(${JSON.stringify(url)});var calendar;for(var until=Date.now()+10000;Date.now()<until;){calendar=(await page.frames()).find(f=>f.url.includes('calendar.test'));if(calendar)break}if(!calendar)throw Error('calendar missing');var cal=page.frame(calendar.id);var start=cal.locator('[data-row="2"][data-col="8"]'),end=cal.locator('[data-row="2"][data-col="11"]');await start.waitFor();await start.dragTo(end);await start.click({clickCount:2});await cal.getByLabel('회의 제목',{exact:true}).waitFor();await cal.getByLabel('회의 제목',{exact:true}).fill('설계 회의');await cal.getByLabel('참석 인원',{exact:true}).fill('4');await cal.getByRole('button',{name:'예약 확정',exact:true}).click();`);
 assert.equal(r.status,'completed',JSON.stringify(r));const independent=context.pages().find(p=>p.url().includes('scenario=booking'));await independent.getByText('PASS · 완료 조건 충족',{exact:true}).waitFor();evidence.push({case:'product-booking-grid',passed:true});
});
test('product extension scrolls a virtualized dropdown and selects the requested option',async()=>{
 const r=await client.js(session.id,`await page.goto(${JSON.stringify(fixture.url+'/?scenario=dropdown')});await page.getByRole('button',{name:'부서 선택',exact:true}).click();var box=page.getByRole('listbox',{name:'부서 목록'});for(var i=0;i<50;i++){if(await page.getByRole('option',{name:'부서 230',exact:true}).count())break;await box.hover();var prior=await page.getByRole('option').nth(0).textContent();await page.mouse.wheel(0,252);await page.waitForFunction(prior=>document.querySelector('.option')?.textContent!==prior,prior);}await page.getByRole('option',{name:'부서 230',exact:true}).click();`);
 assert.equal(r.status,'completed',JSON.stringify(r));const independent=context.pages().find(p=>p.url().includes('scenario=dropdown'));await independent.getByText('PASS · 완료 조건 충족',{exact:true}).waitFor();evidence.push({case:'product-virtual-dropdown',passed:true});
});
test('product snapshot ref becomes stale after Shadow DOM element replacement',async()=>{
 let r=await client.js(session.id,`await page.goto(${JSON.stringify(fixture.url+'/?scenario=dynamic')});await page.getByRole('button',{name:'현재 세대 완료',exact:true}).waitFor();var oldSnap=await page.snapshot({query:'현재 세대 완료'});var oldRef=oldSnap.refs.find(n=>n.role==='button').ref;await page.getByRole('button',{name:'요소 교체',exact:true}).click();`);assert.equal(r.status,'completed',JSON.stringify(r));
 r=await client.js(session.id,'await page.locator(oldRef).click()');assert.equal(r.status,'failed');assert.match(r.result.error.message,/STALE_REF/);
 r=await client.js(session.id,`await page.getByRole('button',{name:'현재 세대 완료',exact:true}).click();`);assert.equal(r.status,'completed',JSON.stringify(r));const independent=context.pages().find(p=>p.url().includes('scenario=dynamic'));await independent.getByText('PASS · 완료 조건 충족',{exact:true}).waitFor();evidence.push({case:'product-shadow-stale-ref',passed:true});
});
test('server-staged bytes upload through product setFiles and actual browser download exports to server',async()=>{
 const asset=await fetch(bridge.url+'/v1/assets?sessionId='+session.id+'&name=remote-proof.txt&mimeType=text/plain',{method:'POST',headers:{authorization:'Bearer '+bridge.token},body:'browser-control-upload-proof'}).then(r=>r.json());assert(asset.id);
 const r=await client.js(session.id,`await page.goto(${JSON.stringify(fixture.url+'/?scenario=files')});await page.getByLabel('검증 파일',{exact:true}).setFiles({fileId:${JSON.stringify(asset.id)}});await page.waitForFunction(()=>document.getElementById('file-info').textContent.includes('검증 완료'));var pendingDownload=page.waitForEvent('download');await page.getByRole('button',{name:'결과 다운로드',exact:true}).click();var download=await pendingDownload;var local=await download.save({target:'local'});if(local.state!=='complete')throw Error('Local download incomplete');var saved=await download.save({target:'server'});console.log(saved);`);
 assert.equal(r.status,'completed',JSON.stringify(r));const saved=JSON.parse(text(r));const bytes=await fetch(bridge.url+'/v1/assets/'+saved.fileId+'?sessionId='+session.id,{headers:{authorization:'Bearer '+bridge.token}}).then(r=>r.text());assert.equal(bytes,'browser-control-upload-proof');evidence.push({case:'product-server-upload-download',passed:true,size:saved.size});
});
test('local path upload and intercepted file chooser use the same product upload engine',async()=>{
 const file=path.join(root,'local-proof.txt');await writeFile(file,'browser-control-upload-proof');
 let r=await client.js(session.id,`await page.goto(${JSON.stringify(fixture.url+'/?scenario=files')});await page.getByLabel('검증 파일',{exact:true}).setFiles(${JSON.stringify(file)});await page.waitForFunction(()=>document.getElementById('file-info').textContent.includes('검증 완료'));console.log('local-upload-ok');`);assert.equal(r.status,'completed',JSON.stringify(r));assert.match(text(r),/local-upload-ok/);
 r=await client.js(session.id,`await page.goto(${JSON.stringify(fixture.url+'/?scenario=files')});var chooserEvent=page.waitForEvent('filechooser');await page.getByLabel('검증 파일',{exact:true}).click();var chooser=await chooserEvent;await chooser.setFiles(${JSON.stringify(file)});await page.waitForFunction(()=>document.getElementById('file-info').textContent.includes('검증 완료'));console.log('chooser-upload-ok');`);assert.equal(r.status,'completed',JSON.stringify(r));assert.match(text(r),/chooser-upload-ok/);evidence.push({case:'product-local-and-chooser-upload',passed:true});
});
test('file data drop uses the product file resolver',async()=>{
 const r=await client.js(session.id,`await page.goto(${JSON.stringify(fixture.url+'/?scenario=files')});await page.locator('.dropzone').waitFor();await page.locator('.dropzone').drop({files:[{name:'dropped.txt',mimeType:'text/plain',bytes:Array.from('browser-control-upload-proof',c=>c.charCodeAt(0))}]});await page.waitForFunction(()=>document.getElementById('file-info').textContent.includes('검증 완료'));console.log('drop-ok');`);assert.equal(r.status,'completed',JSON.stringify(r));assert.match(text(r),/drop-ok/);evidence.push({case:'product-file-drop',passed:true});
});
test('remaining query, keyboard, pointer, evaluation and selection primitives are exercised',async()=>{
 const r=await client.js(session.id,`await page.goto(${JSON.stringify(fixture.url+'/?scenario=basic')});await page.activate();console.log((await browser.tabs()).some(t=>t.id===page.id));var same=await browser.attach(page.id);console.log(same.id===page.id);var nameField=page.getByLabel('이름',{exact:true});await nameField.waitFor();console.log(await nameField.isEditable(),await nameField.isEnabled(),await nameField.isVisible());await nameField.focus();await page.keyboard.type('abc');await page.keyboard.press('Backspace');await nameField.press('End');await page.keyboard.down('Shift');await page.keyboard.up('Shift');console.log(await nameField.inputValue());console.log(await nameField.getAttribute('aria-label'));console.log(await page.getByText('기본 입력 테스트',{exact:true}).textContent());console.log(await page.getByRole('button').filter({hasText:'제출'}).count());console.log(await page.getByRole('button').nth(0).textContent());console.log(await page.getByLabel('약관 확인').isChecked());var box=await nameField.boundingBox();await page.mouse.move(box.x+5,box.y+5);await page.mouse.down();await page.mouse.up();await page.mouse.click(box.x+10,box.y+10);console.log(await nameField.evaluate(el=>el.tagName));console.log(await page.locator('button').evaluateAll(els=>els.length));await page.evaluate(()=>console.log('page-diagnostic'));console.log(await page.logs());await page.evaluate(()=>{var select=document.createElement('select');select.id='eval-api-select';select.innerHTML='<option value="a">A</option><option value="b">B</option>';document.body.append(select)});await page.locator('#eval-api-select').selectOption('b');console.log(await page.locator('#eval-api-select').inputValue());await page.getByLabel('이름',{exact:true}).scrollIntoView();`);
 assert.equal(r.status,'completed',JSON.stringify(r));assert.match(text(r),/true true true/);assert.match(text(r),/이름/);assert.match(text(r),/INPUT/);assert.match(text(r),/page-diagnostic/);assert.match(text(r),/\nb$/);evidence.push({case:'product-basic-primitives',passed:true});
});
test('navigation history, load and URL waits work through product APIs',async()=>{
 const r=await client.js(session.id,`await page.goto(${JSON.stringify(fixture.url+'/?scenario=basic')});await page.waitForURL(${JSON.stringify(fixture.url+'/?scenario=basic')});await page.waitForLoadState('load');await page.goto(${JSON.stringify(fixture.url+'/?scenario=dynamic')});await page.back();await page.waitForURL(${JSON.stringify(fixture.url+'/?scenario=basic')});await page.forward();await page.waitForURL(${JSON.stringify(fixture.url+'/?scenario=dynamic')});await page.reload();await page.waitForLoadState();var extra=await browser.open(${JSON.stringify(fixture.url+'/?scenario=basic')});var closed=extra.waitForEvent('close');await extra.close();await closed;console.log('navigation-ok');`);
 assert.equal(r.status,'completed',JSON.stringify(r));assert.match(text(r),/navigation-ok/);evidence.push({case:'product-navigation',passed:true});
});
test('snapshot scope, output budget, continuation and diff are explicit',async()=>{
 const r=await client.js(session.id,`await page.goto(${JSON.stringify(fixture.url+'/?scenario=large')});await page.getByRole('link',{name:'정산 내역 2761',exact:true}).waitFor();var defaultSnap=await page.snapshot();if(JSON.stringify(defaultSnap).length>60000)throw Error('Default snapshot exceeds output budget');var first=await page.snapshot({maxChars:1200,maxNodes:10});console.log(first.truncated,first.nextCursor,first.metrics.chars);var next=await page.snapshot({cursor:first.nextCursor,maxChars:1200,maxNodes:10});console.log(next.refs[0].ref!==first.refs[0].ref);var scoped=await page.snapshot({root:'.large-list',query:'2761'});console.log(scoped.text);var unchanged=await page.snapshot({root:'.large-list',query:'2761',since:scoped.snapshotId});console.log(unchanged.diff);`);
 assert.equal(r.status,'completed',JSON.stringify(r));assert.match(text(r),/^true/);assert.match(text(r),/定|정산 내역 2761/);assert.match(text(r),/"added":\[\]/);evidence.push({case:'product-snapshot-budget-diff',passed:true});
});
test('popup and dialog events return controllable objects',async()=>{
 const r=await client.js(session.id,`await page.goto(${JSON.stringify(fixture.url+'/?scenario=basic')});await page.getByRole('button',{name:'새 창 열기',exact:true}).waitFor();var popupPending=page.waitForEvent('popup');await page.getByRole('button',{name:'새 창 열기',exact:true}).click();var popup=await popupPending;await popup.getByRole('button',{name:'닫기',exact:true}).waitFor();console.log(await popup.getByRole('heading').textContent());await popup.close();var dialogPending=page.waitForEvent('dialog');var clickPending=page.getByRole('button',{name:'알림창',exact:true}).click();var dialog=await dialogPending;console.log(dialog.message);await dialog.accept();await clickPending;var confirmPending=page.waitForEvent('dialog');await page.evaluate(()=>setTimeout(()=>confirm('dismiss-probe'),0));var confirmDialog=await confirmPending;await confirmDialog.dismiss();console.log('dialogs-ok');`);
 assert.equal(r.status,'completed',JSON.stringify(r));assert.match(text(r),/팝업 연결 확인/);assert.match(text(r),/알림창 확인/);assert.match(text(r),/dialogs-ok/);evidence.push({case:'product-popup-dialogs',passed:true});
});
test('viewport and full-page screenshots are actual images returned through display',async()=>{
 const r=await client.js(session.id,`await page.goto(${JSON.stringify(fixture.url+'/?scenario=basic')});await page.evaluate(()=>{var d=document.createElement('div');d.style.height='1400px';d.textContent='screenshot-extension-proof';document.body.append(d)});display(await page.screenshot());display(await page.screenshot({fullPage:true}));`);
 assert.equal(r.status,'completed',JSON.stringify(r));const images=r.result.content.filter(i=>i.type==='image');assert.equal(images.length,2);const small=Buffer.from(images[0].data,'base64'),full=Buffer.from(images[1].data,'base64');assert(small.subarray(1,4).equals(Buffer.from('PNG')));assert(full.readUInt32BE(20)>small.readUInt32BE(20));await mkdir('output/runtime-e2e',{recursive:true});await writeFile('output/runtime-e2e/viewport.png',small);evidence.push({case:'product-screenshots',passed:true,viewportHeight:small.readUInt32BE(20),fullHeight:full.readUInt32BE(20)});
});

test('download cancellation interrupts an actual browser transfer',async()=>{
 const r=await client.js(session.id,`await page.goto(${JSON.stringify(fixture.url+'/?scenario=files')});await page.getByLabel('검증 파일',{exact:true}).setFiles({name:'cancel-proof.txt',bytes:Array.from('browser-control-upload-proof',c=>c.charCodeAt(0))});await page.waitForFunction(()=>document.getElementById('file-info').textContent.includes('검증 완료'));var pending=page.waitForEvent('download');await page.getByRole('button',{name:'느린 다운로드',exact:true}).click();var slow=await pending;await slow.cancel();try{await slow.save({target:'server'});throw Error('Cancelled download incorrectly saved')}catch(error){if(!error.message.includes('INTERRUPTED'))throw error}console.log('cancel-confirmed');`);
 assert.equal(r.status,'completed',JSON.stringify(r));assert.match(text(r),/cancel-confirmed/);evidence.push({case:'product-download-cancel',passed:true});
});

test('read-only Naver search observes actual external DOM through extension', {skip:process.env.EXTERNAL_SITE!=='1'},async t=>{
 const url='https://search.naver.com/search.naver?query='+encodeURIComponent('삼성전자');
 const r=await client.js(session.id,`var externalPage=await browser.open(${JSON.stringify(url)});var externalSnapshot=await externalPage.snapshot({maxChars:10000,maxNodes:150});console.log({text:externalSnapshot.text,metrics:externalSnapshot.metrics,frames:externalSnapshot.frames,truncated:externalSnapshot.truncated});`,{timeoutMs:30000});
 if(r.status!=='completed'){const blocked={case:'external-naver',passed:false,status:'blocked',error:r.result.error};evidence.push(blocked);await writeFile('output/runtime-e2e/external.json',JSON.stringify(blocked,null,2));t.skip('External navigation blocked: '+r.result.error.message);return}
 const snapshot=JSON.parse(text(r));const report={case:'external-naver',passed:/삼성전자/.test(snapshot.text),url,snapshot};evidence.push({case:report.case,passed:report.passed,metrics:snapshot.metrics,truncated:snapshot.truncated});await writeFile('output/runtime-e2e/external.json',JSON.stringify(report,null,2));assert(report.passed,'Search term missing from actual Naver snapshot');assert(snapshot.metrics.chars<=10000);assert(!snapshot.text.includes('nclicks.naver.com'));
});
