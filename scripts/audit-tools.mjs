// Evaluation harness only. Product engine is frozen during this audit.
import {chromium} from 'playwright';
import {mkdtemp,mkdir,writeFile,rm,readFile} from 'node:fs/promises';
import path from 'node:path';import os from 'node:os';import assert from 'node:assert/strict';
import {startFixture} from '../test-site/server.mjs';import {startBridge} from '../bridge/server.mjs';import {bridgeClient} from '../bridge/client.mjs';import {buildExtension} from './build-extension.mjs';
const out='output/tool-audit';await mkdir(out,{recursive:true});const root=await mkdtemp(path.join(os.tmpdir(),'bcl-audit-'));await mkdir(path.join(root,'downloads'));await writeFile(path.join(root,'local-proof.txt'),'local-proof');
const fixture=await startFixture(),bridge=await startBridge({downloadRoots:[path.join(root,'downloads')]}),client=bridgeClient(bridge.url,bridge.token);
let context;const results=[];const text=r=>r.result?.content?.filter(x=>x.type==='text').map(x=>x.text).join('\n');
const cases=[];
function add(id,code,check,expectation){cases.push({id,code,check,expectation})}
const success=r=>assert.equal(r.status,'completed',JSON.stringify(r.result?.error));
const judge=key=>async(r,page,run)=>{success(r);await page.waitForFunction(key=>document.querySelector('#'+key+' output')?.textContent.startsWith('PASS'),key,{timeout:2000});const result=await fetch(fixture.url+'/api/runs/'+run).then(r=>r.json());assert.equal(result.state.passed[key],true)};
add('semantic-email',`await p.getByLabel('받는 사람',{exact:true}).fill('tester@example.test');await p.getByRole('button',{name:'레이블 저장',exact:true}).click();`,judge('semantics'),'명시 label과 aria-labelledby로 입력·저장');
add('snapshot-password-hidden',`console.log(await p.snapshot({root:'#semantics',showHidden:true}));`,r=>{success(r);assert(!text(r).includes('never-print-this-secret'));const s=JSON.parse(text(r));assert(!s.refs.some(x=>x.role==='textbox'&&x.name==='hidden-sentinel'))},'비밀번호·숨은 값 출력 제외');
add('snapshot-states',`console.log(await p.snapshot({root:'#semantics'}));`,r=>{success(r);assert.match(text(r),/aria-selected|selected|checked|expanded/)},'탭 selected, switch checked, 메뉴 expanded 관찰 가능');
add('duplicate-strict',`await p.getByRole('button',{name:'저장',exact:true}).click();`,r=>{assert.equal(r.status,'failed');assert.match(r.result.error.message,/MULTIPLE_MATCHES/)},'중복 요소의 임의 선택 거절');
add('duplicate-scoped',`await p.locator('[data-unit="right"] button').click();`,judge('duplicates'),'범위 지정 후 올바른 저장');
add('filter-hasText',`console.log(await p.locator('#duplicates [data-unit]').filter({hasText:'확정'}).count());`,r=>{success(r);assert.equal(text(r),'1')},'부모 범위 텍스트 필터');
add('regex-role',`console.log(await p.getByRole('button',{name:/레이블 저장/}).count());`,r=>{success(r);assert.equal(text(r),'1')},'의미 기반 정규식 검색');
add('filter-visible',`console.log(await p.locator('#duplicates button').filter({visible:true}).count());`,r=>{success(r);assert.equal(text(r),'2')},'visible 필터로 hidden 요소 제외');
add('negative-nth',`console.log(await p.locator('#duplicates [data-unit]').nth(-1).count());`,r=>{success(r);assert.equal(text(r),'1')},'마지막 요소의 음수 인덱스 지원 또는 명시적 오류');
add('delayed-enabled',`await p.getByRole('button',{name:'지연 승인',exact:true}).click();`,judge('delay'),'disabled 해제까지 자동 대기 후 클릭');
add('overlay-reject',`await p.getByRole('button',{name:'아래 작업 실행',exact:true}).click();`,r=>{assert.equal(r.status,'failed');assert.match(r.result.error.message,/OBSCURED/)},'가려진 버튼의 잘못된 성공 거절');
add('overlay-recover',`await p.getByRole('button',{name:'가림 해제',exact:true}).click();await p.getByRole('button',{name:'아래 작업 실행',exact:true}).click();`,judge('overlay'),'가림 해제 후 성공');
add('readonly-fill',`await p.getByLabel('고정 문서번호',{exact:true}).fill('BROKEN');`,r=>{assert.equal(r.status,'failed');assert.match(r.result.error.message,/EDITABLE|READONLY|READ_ONLY/)},'readonly 입력 명시적 거절');
add('nested-shadow',`await p.getByRole('button',{name:'중첩 그림자 실행',exact:true}).click();`,judge('shadow'),'중첩 open Shadow DOM 제어');
add('slot-name',`await p.getByRole('button',{name:'슬롯 승인',exact:true}).click();`,judge('slot'),'slot 배정 텍스트로 접근 이름 검색');
add('details-expand',`await p.getByRole('button',{name:'추가 설정 열기',exact:true}).click();await p.getByRole('button',{name:'세부 확정',exact:true}).click();`,judge('details'),'닫힌 details 열기와 제어');
add('html-drag',`await p.locator('#drag-source').dragTo(p.locator('#drag-target'));`,judge('drag'),'HTML DnD DataTransfer로 업무 데이터 전달');
add('mime-drop',`await p.locator('#mime-target').drop({data:{'text/plain':'mime-proof'}});`,judge('mime'),'외부 MIME text 전달');
add('multi-files',`await p.getByLabel('다중 첨부',{exact:true}).setFiles([{name:'a.txt',bytes:[65]},{name:'b.txt',bytes:[66]}]);`,judge('multi'),'2개 파일 이름·바이트 확인');
add('local-file-drop',`await p.locator('#local-drop').drop({files:[${JSON.stringify(path.join(root,'local-proof.txt'))}]});`,judge('localdrop'),'로컬 경로 파일 drop');
for(const [id,locator] of [['blob-download',"p.getByRole('button',{name:'Blob 다운로드',exact:true})"],['post-download',"p.getByRole('button',{name:'POST 다운로드',exact:true})"],['cookie-download',"p.getByRole('link',{name:'쿠키 다운로드',exact:true})"]])add(id,`var pending=p.waitForEvent('download');await ${locator}.click();var dl=await pending;console.log(await dl.save({target:'server'}));`,async r=>{success(r);const asset=JSON.parse(text(r));const bytes=await fetch(bridge.url+'/v1/assets/'+asset.fileId+'?sessionId='+session.id,{headers:{authorization:'Bearer '+bridge.token}}).then(r=>r.text());assert.equal(bytes,'audit-export-proof')},'브라우저 실제 다운로드 바이트 일치');
add('clipped-input',`await p.getByRole('button',{name:'잘린 내부 버튼',exact:true}).click();`,judge('clipped'),'overflow hidden 내부 대상을 실제 입력으로 제어');
add('snapshot-offscreen',`console.log(await p.snapshot({query:'문서 끝 승인'}));`,async(r,page)=>{success(r);assert.match(text(r),/문서 끝 승인/);assert.equal(await page.evaluate(()=>scrollY),0)},'관찰로 스크롤하지 않고 문서 끝 발견');
add('snapshot-full-budget',`console.log(await p.snapshot());`,r=>{success(r);assert(!r.result.truncated,'REPL output truncated');const s=JSON.parse(text(r));assert(s.truncated);assert(s.nextCursor!==null);assert(Buffer.byteLength(text(r))<60000);assert(!s.text.includes('long-param-'))},'기본 출력의 구조 유효성·예산·이어보기');
add('snapshot-since-filter',`var one=await p.snapshot({query:'문서 끝 승인'});console.log(await p.snapshot({query:'문서 끝 승인',since:one.snapshotId}));`,r=>{success(r);assert.deepEqual(JSON.parse(text(r)).diff.added,[])},'변경 없는 필터 스냅샷 diff');
add('snapshot-collapsed',`console.log(await p.snapshot({root:'#details'}));`,r=>{success(r);const s=JSON.parse(text(r));assert(!s.refs.some(x=>x.name==='세부 확정'))},'닫힌 details 내부를 숨김으로 판단');
add('snapshot-no-duplicate-label',`console.log(await p.snapshot({root:'#semantics'}));`,r=>{success(r);const s=JSON.parse(text(r));assert.equal(s.refs.filter(x=>x.name==='레이블 저장').length,1)},'버튼 라벨 leaf 중복 축소');
add('screenshot-clip',`display(await p.screenshot({clip:{x:0,y:0,width:320,height:240}}));`,r=>{success(r);const im=r.result.content.find(x=>x.type==='image');const b=Buffer.from(im.data,'base64');assert.equal(b.readUInt32BE(16),320);assert.equal(b.readUInt32BE(20),240)},'clip 옵션의 실제 PNG 크기');
add('scaled-frame-click',`var frame=(await p.frames()).find(f=>f.url.includes('/audit-frame'));await p.frame(frame.id).getByRole('button',{name:'좌표 내부 실행',exact:true}).click();`,async(r,page)=>{success(r);await page.frameLocator('iframe').getByRole('button',{name:'좌표 성공',exact:true}).waitFor({timeout:1500})},'CSS transform 적용 iframe 좌표 클릭');
let session;
try{
 const directory=await buildExtension({directory:path.join(root,'extension'),connection:{url:bridge.url,token:bridge.extensionToken}});
 const fallback=path.join(os.homedir(),'Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
 context=await chromium.launchPersistentContext(path.join(root,'profile'),{executablePath:process.env.TEST_CHROME||fallback,headless:process.env.HEADED!=='1',downloadsPath:path.join(root,'downloads'),acceptDownloads:true,args:['--window-size=1440,1100','--disable-extensions-except='+directory,'--load-extension='+directory]});
 for(let i=0;i<200;i++){if((await client.request('/v1/status')).connected)break;await new Promise(r=>setTimeout(r,50))}session=await client.session();
 for(const c of cases){
  const start=Date.now();let r,page,run;
  try{
   r=await client.js(session.id,`var p=await browser.open(${JSON.stringify(fixture.url+'/audit')});await p.getByRole('status').waitFor();await p.waitForFunction(()=>document.getElementById('summary').textContent==='진단 준비 완료');console.log(p.id);`);success(r);
   page=context.pages().find(p=>p.url()===fixture.url+'/audit'&&!p.__audited);page.__audited=true;run=await page.getAttribute('body','data-run');
   r=await client.js(session.id,c.code,{timeoutMs:12000});await c.check(r,page,run);results.push({id:c.id,status:'PASS',expectation:c.expectation,ms:Date.now()-start,result:r});
  }catch(error){results.push({id:c.id,status:'FAIL',expectation:c.expectation,error:error.message,ms:Date.now()-start,result:r});}
  if(run){const observed=await fetch(fixture.url+'/api/runs/'+run).then(r=>r.json());results.at(-1).serverPassed=observed.state.passed||{};results.at(-1).eventCount=observed.events.length;results.at(-1).readonlyValue=await page.getByLabel('고정 문서번호').inputValue();}
  console.log(results.at(-1).status+' '+c.id);
  if(page){if(c.id==='semantic-email')await page.screenshot({path:out+'/audit-page.png'});await client.js(session.id,'await p.close()').catch(()=>{})}
 }
}finally{
 const summary={date:new Date().toISOString(),grade:'frozen-product-extension-audit',browser:context?.browser()?.version(),productCommit:'35077f5',pass:results.filter(x=>x.status==='PASS').length,fail:results.filter(x=>x.status==='FAIL').length,total:results.length,cases:results};await writeFile(out+'/results.json',JSON.stringify(summary,null,2));console.log(JSON.stringify({pass:summary.pass,fail:summary.fail,total:summary.total}));process.exitCode=summary.fail?1:0;await context?.close();await bridge.close();await fixture.close();await rm(root,{recursive:true,force:true});
}
