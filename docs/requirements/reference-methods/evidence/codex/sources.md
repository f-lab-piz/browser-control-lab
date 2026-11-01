# Codex 조사 1 · 공개 계약과 근거

확인일 2026-11-01 (KST). 조사 기준 `850326772bb826b37fa182b98007b1313c925a2c`, 제품 기준 `700a6a06af3f97729327afaf9becb4ee29bb475b`.

## 범위와 원자료

비교 표면은 이 세션이 제공한 **Codex CUA / ChatGPT in-app browser(type=iab)**다. 툴 이름은 `mcp__cua_repl.js`, `mcp__cua_repl.js_reset`이다. 자체 Codex-style 브라우저 bridge, Aside wrapper, 일반 Playwright, Responses API computer tool과 동등하다고 보지 않는다. 공개 메서드의 이름이 Playwright와 같아도 이 표면의 반환형/옵션/읽기 전용 제한이 우선한다. 앱/브라우저 정확한 빌드 버전은 공개 문서에 없어 미확인이다.

원본 구현/번들/WASM/사용자 프로필/개인 탭은 읽지 않았다. 인벤토리 조회도 하지 않았다. 유일한 신규 탭은 `cua.createBrowserTab("iab", "about:blank", {visible:false})`로 만든 연구 탭이며 마지막에 닫았다. 공개 문서 수신과 빈 DOM 판독만 했다. 제품·fixture·테스트를 실행/수정하지 않았다.

- `CUA-DOC-ENTRY` (DOC): 현재 도구 진입 설명과 첫 `createBrowserTab` 응답의 Computer Use / API / Output / Notes / DOM-only 경계. 원자료는 조사 tool transcript의 최초 `mcp__cua_repl.js` 응답. 아래와 `raw/public-contract-excerpts.md`에 관련 원문 서명을 발췌 보존한다. **전체 응답의 byte-identical 복제본이라고 주장하지 않는다.**
- `CUA-DOC-API` (DOC): 같은 응답의 `# API Reference` TypeScript 정의와 `# API Use`, `# WebMCP`, `# Additional Documentation`. 원자료 동일. `raw/public-contract-excerpts.md`의 서명은 그 계약의 발췌이며 추가 의미를 구현 내부 사실로 추론하지 않는다.
- `CUA-DOC-UPLOAD` (DOC): `agent.documentation.get("file-uploads")` 직접 반환. `raw/file-uploads.md`에 반환 전체 텍스트 보존. chooser 흐름만 업로드 공개 경로라고 명시하며 locator.setInputFiles를 찾지 말라고 한다.
- `CUA-LIVE-BLANK` (LIVE): 1개 빈 탭에서 URL/locator.count/read-only evaluate 실행. `raw/blank-probe.json`. button count=0, bodyText='', title=''. 그 밖의 정상/실패/옵션 지원을 실측한 것으로 확대하지 않는다.
- `HIST-CODEX-AUDIT` (HISTORICAL): `docs/fixes-before-after.md`의 Codex / Aside / 우리 툴 절과 `docs/evidence/diagnostics-before-after.json#/codex`. 당시 `/audit` 실측, Codex 빌드와 상세 call log 미보존. 공개 결과만 재사용한다. 원자료 사본 `raw/historical-*` 및 해시 manifest. 현재 재실행 아님.
- `HIST-OWN-BOUNDARIES` (HISTORICAL, 우리 제품): `docs/evidence/review-round2.json`, `inline-filter-fix.json`. Codex 측정이 **없다**. 인접 span/긴 본문/summary/scroll clip 결과를 Codex 결과로 전용 금지.
- `REQ-BASELINE` (규범, 비교지원 근거 아님): index가 지정한 외부3+내부64+공통5 문서 전체. 전체184개 규범을 읽었다. `raw/requirements-read.json`에 각 파일 원문/sha256/REQ ID를 보존한다.
- `OFFICIAL-CUA-OVERVIEW` (DOC, 표면 차이 확인): [OpenAI Computer use](https://developers.openai.com/api/docs/guides/tools-computer-use), 검색 후 실제 열람. API 통합 예시와 desktop/browser runtime 설명이며 여기의 Codex IAB 메서드 계약이 아니다. 이 자료로 IAB 개별 API 지원을 채우지 않았다.

각 mapping의 `confirmedConditions`는 문서상 서명/설명 또는 해당 과거 관찰의 **부분 조건**이다. REQ 전체 충족률을 의미하지 않는다. `unknownConditions`에는 실제 읽은 규범을 기준으로 미확인 전체 조건을 남겼다. 모든 미확인을 미지원으로 해석하지 않는다.

## 현재 공개 계약의 핵심 서명

자세한 원문 발췌는 `raw/public-contract-excerpts.md` 참조. 예제는 독자적으로 작성했다.

|표면|문서 계약 / 차이|
|---|---|
|CUA 실행|`js({code:string,timeout_ms?:integer,title?:string})` 기본30초; persistent REPL. reset은 모든 JS binding을 버리되 탭·앱·상태는 닫거나 지우지 않음. 우리 QuickJS/50..120000ms/requestId 계약은 이 문서로 확인되지 않음|
|안내|초기 호출/브라우저 선택 시 문서 자동 반환. `browser.documentation():Promise<string>`, `agent.documentation.get(name):Promise<string>`. 우리 `guide({api})`와 같은 API별 검색 계약 없음|
|탭|`cua.createBrowserTab(browserId,url?,{visible?,sessionName?})`, `cua.getTab(reference,{browser?})`; `tab.goto/back/forward/reload/close():Promise<void>`; URL·title은 `Promise<string|undefined>`|
|snapshot|`tab.playwright.domSnapshot():Promise<string>` expanded iframe body when available. `getAXState({disableDiffing?,emit?})`는 별도 관찰이며 DOM-only에서는 numeric index 없음. root/query/maxChars/maxNodes/cursor/since 옵션은 domSnapshot 서명에 없음|
|선택|locator/CSS, frameLocator 중첩, getByRole(role,{name?,exact?}), getByText/Label(text,{exact?}), `TextMatcher=string|RegExp`. Role includeHidden 옵션은 공개 서명에 없음|
|필터|`filter({has?,hasNot?,hasText?,hasNotText?,visible?})`; 우리 has/hasNot 거절 정책과 의도적 차이|
|조회|count/textContent/getAttribute/isVisible/isEnabled, evaluate/evaluateAll. textContent는 `string|null`, getAttribute는 `string|null`; 일부 설명은 first matched이고 evaluate는 unambiguous single임. 우리 모든 단일 조회 strict와 자동 동등 아님|
|입력|click({button?,force?,modifiers?,timeoutMs?}), dblclick(같은 옵션), fill, press, type/pressSequentially, setChecked, selectOption. locator focus/hover/dragTo/scrollIntoView 및 mouse.down/up primitive는 이 IAB Playwright 서명에서 확인되지 않음|
|native CUA|Target.click(target:number|[x,y],{mouseButton?,clickCount?,key?,durationMs?}), drag(from,to), scroll(target,direction,pages?). **DOM-only tab에서는 native input wrapper가 입력 전 throw**. IAB locator 동작의 mouse primitive로 가정하지 않음|
|대기|waitFor({state,timeoutMs?}), waitForURL(url,{timeoutMs?,waitUntil?}), waitForLoadState({state?,timeoutMs?}), expectNavigation(action,{timeoutMs?,url?,waitUntil?}). LoadState는 load/domcontentloaded/networkidle. 우리 interactive는 별도이며 networkidle 거절 정책을 경쟁사 지원 탓으로 바꾸지 않음|
|이벤트|`waitForEvent("download"|"filechooser",{timeoutMs?})`. popup/dialog/close overload는 없음. 다른 방식으로 가능한지 미확인|
|파일|chooser.setFiles(string|string[],{timeoutMs?})는 browser-visible 절대경로; chooser.isMultiple():boolean. bytes/base64/fileId·32MiB 정책 미확인|
|다운로드|waitForEvent(download)는 완료까지 기다림; Download.path({timeoutMs?}):Promise<string|null>. save/cancel/server asset/destination 통일 계약 없음. downloadMedia(options)는 별도 의미로 쿠키 POST 원본 다운로드의 대체로 쓰지 않음|
|dialog|tab.getJsDialog():Promise<Dialog|undefined>; confirm accept(), prompt accept(text), 모두 dismiss. alert/beforeunload는 공개 union에서 accept 없음|
|평가|페이지 evaluate(fn,arg?,{timeoutMs?})와 locator evaluate/evaluateAll은 **read-only scope**. Promise 타입 표기 있음. 우리 변경 가능 evaluate의 지원 근거가 아님. JSON/thenable/undefined 세부정책 미확인|
|로그|tab.dev.logs({filter?,levels?,limit?}):Array<{level,message,timestamp,url?}>. 우리 since/envelope/collection/dropped/1000개 계약과 다름|
|출력|`nodeRepl.write(value)` 및 `nodeRepl.emitImage(image)`가 공개 권장. emitImage는 data/file URL, PNG/JPEG/WebP bytes 또는 {bytes,mimeType}. 우리 display PNG-envelope/출력 예산과 다름|

## 최소 예제와 실행 상태

### E-LIVE-01 · 실행확인 (빈 탭만)

```js
var researchTab = await cua.createBrowserTab("iab", "about:blank", { visible: false });
// 최초 호출에는 다른 API를 함께 넣지 않았다.
var blankProbe = {
  url: await researchTab.url(),
  count: await researchTab.playwright.locator("button").count(),
  readOnlyValue: await researchTab.playwright.evaluate(() => ({
    title: document.title, bodyText: document.body.textContent
  }))
};
nodeRepl.write(blankProbe);
await researchTab.close();
```

각 단계는 별도 tool call로 실행했다. URL about:blank, count0, 빈 title/bodyText만 확인.

### E-DOC-SELECT · 문법확인만, fixture 미실행

```js
const scope = tab.playwright.frameLocator("iframe[data-workspace]");
const rows = scope.getByRole("row", {name:/예약/}).filter({hasNotText:"취소",visible:true});
nodeRepl.write(await rows.count());
await rows.nth(0).getByRole("button", {name:"선택",exact:true}).click({timeoutMs:1000});
nodeRepl.write(await tab.playwright.domSnapshot());
```

선행조건: 해당 DOM을 먼저 관찰해 selector/name을 확인한 테스트 fixture. strict·조합 순서·무부작용은 미실측. timeoutMs를 우리 timeout 옵션으로 혼용 금지.

### E-DOC-DOWNLOAD · 문법확인만, fixture 미실행

```js
const pending = tab.playwright.waitForEvent("download", {timeoutMs:10000});
await tab.playwright.getByRole("button", {name:"내보내기",exact:true}).click();
const download = await pending;
nodeRepl.write(await download.path({timeoutMs:10000}));
```

문서는 완료 이벤트/로컬 path만 제공한다. POST/blob/쿠키 바이트 hash, 동시 save idempotency, server asset, cancel을 확인하지 않았다.

### E-DOC-CHOOSER · 문법확인만, fixture 미실행

```js
const pending = tab.playwright.waitForEvent("filechooser", {timeoutMs:10000});
await tab.playwright.locator('input[type="file"]').click();
const chooser = await pending;
await chooser.setFiles(["/absolute/path/to/test-only-file.txt"]);
```

공개 문서 예시의 흐름을 따라 독자 구성. source 경로는 placeholder이며 실제 파일을 열거나 업로드하지 않았다. readonly 상태에서 input.click이 되는지는 fixture 조건별 확인 필요.

### E-DOC-READ · 문법확인만, fixture 미실행

```js
const field = tab.playwright.getByLabel("이메일",{exact:true});
nodeRepl.write(await field.evaluate(el => el.value));
nodeRepl.write(await tab.dev.logs({levels:["error"],limit:20}));
nodeRepl.emitImage(await tab.screenshot({clip:{x:0,y:0,width:320,height:240}}));
```

value property는 element type 사전 확인 필요. read-only evaluate로 focus/scroll/DOM mutation을 우회하는 예제를 만들지 않는다.

## 과거 관측의 정확한 경계

HIST-CODEX-AUDIT는 snapshotChars=2682070, tail=true, selected=true, secret=false, regex=1, visibleFilter=2, nthMinusOne=1, slotClick=true, scaledFrameClick=true, readonly='rejected', clip JPEG320×240를 기록한다. 값의 문자열 의미는 과거 문서/fixture에 한정한다. visibleFilter가 has/hasNot 모든 옵션·AND·hidden 정체를 증명하지 않는다. readonly='rejected'는 해당 입력의 거절이며 모든 mask/rerender 재확인까지 증명하지 않는다. scaledFrameClick는 fixture의 변환이며 중첩/OOPIF/rotate/skew를 포괄하지 않는다. clip은 한 크기이며 DPR2·scroll·pixel origin 범위를 포괄하지 않는다. 인접 span·긴 텍스트·summary·수평/수직 clip 후속 증거는 우리 제품뿐이다.
