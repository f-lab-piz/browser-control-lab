import {readFile,writeFile} from 'node:fs/promises';
const catalog=JSON.parse(await readFile('docs/api-catalog.json','utf8'));
const basic='remaining query, keyboard, pointer, evaluation and selection primitives are exercised';
const nav='navigation history, load and URL waits work through product APIs';
const mapping={
 'browser.list':'bindings persist and top-level await invokes browser APIs asynchronously',
 'browser.open':'product extension opens a tab, observes DOM and completes the basic form using real input',
 'scope.snapshot':'snapshot scope, output budget, continuation and diff are explicit',
 'page.screenshot':'viewport and full-page screenshots are actual images returned through display',
 'page.frames':'product extension discovers cross-site nested frames and snapshots mailbox without outer scrolling',
 'page.frame':'product extension scrolls nested mailbox, loads mail 137 and marks it read',
 'locator.click':'product extension opens a tab, observes DOM and completes the basic form using real input',
 'locator.fill':'product extension opens a tab, observes DOM and completes the basic form using real input',
 'locator.setChecked':'product extension opens a tab, observes DOM and completes the basic form using real input',
 'locator.dragTo':'product extension selects booking cells by drag and double click, then saves reservation',
 'locator.hover':'product extension scrolls a virtualized dropdown and selects the requested option',
 'mouse.wheel':'product extension scrolls a virtualized dropdown and selects the requested option',
 'locator.waitFor':'product extension scrolls nested mailbox, loads mail 137 and marks it read',
 'page.waitForEvent':'popup and dialog events return controllable objects',
 'locator.setFiles':'server-staged bytes upload through product setFiles and actual browser download exports to server',
 'chooser.setFiles':'local path upload and intercepted file chooser use the same product upload engine',
 'download.save':'server-staged bytes upload through product setFiles and actual browser download exports to server',
 'download.cancel':'download cancellation interrupts an actual browser transfer',
 'dialog.accept':'popup and dialog events return controllable objects','dialog.dismiss':'popup and dialog events return controllable objects',
 'locator.drop':'file data drop uses the product file resolver',
 'console.log':'JavaScript executes inside extension WASM and explicit output is collected',
 'display':'viewport and full-page screenshots are actual images returned through display',
 'page.waitForFunction':'server-staged bytes upload through product setFiles and actual browser download exports to server'
};
const diagnostics={
 'scope.snapshot':['snapshot-password-hidden','snapshot-states','snapshot-offscreen','snapshot-full-budget','snapshot-collapsed','snapshot-since-filter','snapshot-no-duplicate-label'],
 'scope.getByRole':['regex-role','slot-name','duplicate-strict'], 'scope.getByLabel':['semantic-email','readonly-fill'],
 'locator.filter':['filter-hasText','filter-visible'],'locator.nth':['negative-nth'],
 'locator.click':['delayed-enabled','overlay-reject','overlay-recover','nested-shadow','slot-name','scaled-frame-click','clipped-input'],
 'locator.fill':['semantic-email','readonly-fill'],'locator.dragTo':['html-drag'],'locator.drop':['mime-drop','local-file-drop'],
 'locator.setFiles':['multi-files'],'download.save':['blob-download','post-download','cookie-download'],'page.screenshot':['screenshot-clip'],
 'page.frame':['scaled-frame-click'],'page.frames':['scaled-frame-click']
};
const source=await readFile('tests/runtime-e2e.test.mjs','utf8');const results=JSON.parse(await readFile('output/tool-audit/results.json','utf8'));
const matrix=catalog.internal.map(api=>{const baseline=mapping[api.name]||(['page.goto','page.back','page.forward','page.reload','page.close','page.waitForURL','page.waitForLoadState'].includes(api.name)?nav:basic);if(!source.includes("test('"+baseline+"'"))throw Error('Missing test '+baseline);return {api:api.name,baseline:{file:'tests/runtime-e2e.test.mjs',test:baseline,grade:'basic-call regression; 일부는 복합 assertion'},diagnostics:(diagnostics[api.name]||[]).map(id=>{const c=results.cases.find(c=>c.id===id);if(!c)throw Error('Missing diagnostic '+id);return {id,status:c.status}}),scope:'기본 호출 매핑. 모든 옵션/실패/환경 조합 검증을 의미하지 않음'}});
await writeFile('docs/api-test-matrix.json',JSON.stringify({productCommit:'35077f5',count:matrix.length,external:{guide:'guide and authentication',reset:'reset cancels unresolved execution, clears variables and creates a usable generation',js:'JavaScript executes inside extension WASM and explicit output is collected'},internal:matrix},null,2)+'\n');
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
await writeFile('test-site/coverage.html','<!doctype html><html lang="ko"><meta charset="utf-8"><title>64 API · 검증 매핑</title><link rel="stylesheet" href="/style.css"><header><h1>64 API · 검증 매핑</h1></header><nav><a href="/audit">진단 실험실</a></nav><main style="display:block"><p>정적 테스트 매핑이며 이 화면 자체가 실시간 PASS 판정은 아닙니다. 기본 호출과 경계 진단을 구분합니다.</p><table><tr><th>API</th><th>기본 검증</th><th>추가 진단</th></tr>'+matrix.map(x=>'<tr><td><code>'+x.api+'</code></td><td>'+escape(x.baseline.test)+'</td><td>'+x.diagnostics.map(d=>d.id+' · '+d.status).join('<br>')+'</td></tr>').join('')+'</table></main></html>');
console.log('Mapped '+matrix.length+' internal APIs and 3 external tools');
