# 참고 방식: snapshot-frames

다음 내용은 공개 사용 계약/관측과 우리 설계 판단이다. 내부 구현 알고리즘을 알아냈다는 뜻이 아니다. DOC·HISTORICAL·LIVE는 표시한 범위에만 적용하며 예제 문법 확인은 실제 실행과 다르다.

## ref-scope-snapshot

대상: **scope.snapshot**. 관련 요구: REQ-SCOPE-SNAPSHOT-001, REQ-SCOPE-SNAPSHOT-002, REQ-SCOPE-SNAPSHOT-003, REQ-SCOPE-SNAPSHOT-004, REQ-SCOPE-SNAPSHOT-005, REQ-SCOPE-SNAPSHOT-006, REQ-SCOPE-SNAPSHOT-007, REQ-SCOPE-SNAPSHOT-008, REQ-SCOPE-SNAPSHOT-009, REQ-SCOPE-SNAPSHOT-010, REQ-SCOPE-SNAPSHOT-011. 정본: [개별 요구](../internal/scope.snapshot.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — tab.playwright.domSnapshot
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await tab.playwright.domSnapshot()
```

- `CL-CODEX-scope-snapshot-01` **DOC**: string DOM snapshot, iframe body when available; 과거 tail/selected 관찰 근거 `CUA-DOC-API` / CUA API Reference: tab.playwright.domSnapshot and relevant option types. 범위: public declaration only; limits in unknownConditions.

- `CL-CODEX-scope-snapshot-02` **HISTORICAL**: only applicable audit result named in sources.md 근거 `HIST-CODEX-AUDIT` / docs/evidence/diagnostics-before-after.json#/codex; docs/fixes-before-after.md#codex--aside--우리-툴. 범위: prior audit fixture; build/call trace not recorded.

추가 확인할 조건:

- root/query/cursor/since/budgets/scrollport/완전성 옵션 미확인
- REQ-SCOPE-SNAPSHOT-001: 전체 규범 충족은 미확인: 현재 연결 DOM 전체를 읽되 화면 밖 요소를 찾을 수 있고 가상화로 미존재한 데이터와 예산 생략을 구분한다.
- REQ-SCOPE-SNAPSHOT-002: 전체 규범 충족은 미확인: 긴 URL·대형 DOM에서 예산 생략을 표시하고 후속 root/cursor/frames 조회 경로를 남긴다. 키워드 없는 탐색은 별도 요구를 따른다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `direct` — REPL 전역 snapshot
- 공개 예제 상태: 미실행예제(공개문법). 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
const s1 = await snapshot(page, { interactive: true }); console.log(s1.tree)
```

- `CL-ASIDE-scope-snapshot-01` **DOC**: snapshot(page,{interactive?,showHidden?,ref?,selector?}) => Promise<{tree,diff}> 명시 서명 DOC. 근거 `A-DOC-REPL` / .local/reference-loop-execution/aside/current-repl-guide.txt :: Snapshot TypeScript function signature. 범위: 현재 공개 가이드 계약만; 실행검증 아님. 2026-11-01 Aside CLI1.26.1028.2335/skill3. Snapshot TypeScript function signature.

- `CL-ASIDE-scope-snapshot-02` **DOC**: offscreen/child-iframe/title/url·CSS selector 또는 ref 부분조회 DOC. 근거 `A-DOC-REPL` / .local/reference-loop-execution/aside/current-repl-guide.txt :: Snapshot options ref/selector; compact tree/title/URL/childiframe/offscreen bullets. 범위: 현재 공개 가이드 계약만; 실행검증 아님. 2026-11-01 Aside CLI1.26.1028.2335/skill3. Snapshot options ref/selector; compact tree/title/URL/childiframe/offscreen bullets.

- `CL-ASIDE-scope-snapshot-03` **DOC**: 새 snapshot은 이전 모든 ref 무효화; tree 후 action마다 diff 인쇄 DOC. 근거 `A-DOC-REPL` / .local/reference-loop-execution/aside/current-repl-guide.txt :: Snapshot: each new snapshot invalidates earlier refs; tree/diff output bullets. 범위: 현재 공개 가이드 계약만; 실행검증 아님. 2026-11-01 Aside CLI1.26.1028.2335/skill3. Snapshot: each new snapshot invalidates earlier refs; tree/diff output bullets.

- `CL-ASIDE-scope-snapshot-04` **HISTORICAL**: 과거 audit에서 기본13175자/tail 미포함/생략표시, selector tail104자에서 발견 HISTORICAL. 근거 `A-HIST-SNAPSHOT` / docs/evidence/diagnostics-before-after.json#/aside/snapshot,/aside/scoped; scripts/compare-aside.mjs snapshot/scoped :: snapshot/scoped values. 범위: 과거 원본 Aside CLI1.26.1028.2335 동일 /audit 단일 비교run의 기재조건만. 브라우저버전 미기재. 이번 새실측 아님. snapshot/scoped values.

추가 확인할 조건:

- budget/cursor/since/query/maxDepth 공개계약·모든 frame 포함·OOPIF·무스크롤·diff 정합성·키워드미지 탐색은 미확인.
- 우리규범 추가 확인: 현재 연결 DOM 전체를 읽되 화면 밖 요소를 찾을 수 있고 가상화로 미존재한 데이터와 예산 생략을 구분한다.
- 우리규범 추가 확인: 긴 URL·대형 DOM에서 예산 생략을 표시하고 후속 root/cursor/frames 조회 경로를 남긴다. 키워드 없는 탐색은 별도 요구를 따른다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 현재 DOM/프레임·부분조회/이미지 관찰을 참고한다. 예산·세대 cursor·scrollport 단서·CSS clip은 우리 요구에 맞춰 선택하며 문서에 없는 경쟁 옵션을 발명하지 않는다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-SCOPE-SNAPSHOT-001, PLAN-SCOPE-SNAPSHOT-002, PLAN-SCOPE-SNAPSHOT-003, PLAN-SCOPE-SNAPSHOT-004, PLAN-SCOPE-SNAPSHOT-005, PLAN-SCOPE-SNAPSHOT-006, PLAN-SCOPE-SNAPSHOT-007, PLAN-SCOPE-SNAPSHOT-008, PLAN-SCOPE-SNAPSHOT-009, PLAN-SCOPE-SNAPSHOT-010, PLAN-SCOPE-SNAPSHOT-011. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-page-screenshot

대상: **page.screenshot**. 관련 요구: REQ-PAGE-SCREENSHOT-001, REQ-PAGE-SCREENSHOT-002, REQ-PAGE-SCREENSHOT-003, REQ-PAGE-SCREENSHOT-004. 정본: [개별 요구](../internal/page.screenshot.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — tab.screenshot
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await tab.screenshot({clip:{x:0,y:0,width:320,height:240}})
```

- `CL-CODEX-page-screenshot-01` **DOC**: clip/fullPage 옵션, Uint8Array; 과거 JPEG320x240 관찰 근거 `CUA-DOC-API` / CUA API Reference: tab.screenshot and relevant option types. 범위: public declaration only; limits in unknownConditions.

- `CL-CODEX-page-screenshot-02` **HISTORICAL**: only applicable audit result named in sources.md 근거 `HIST-CODEX-AUDIT` / docs/evidence/diagnostics-before-after.json#/codex; docs/fixes-before-after.md#codex--aside--우리-툴. 범위: prior audit fixture; build/call trace not recorded.

추가 확인할 조건:

- DPR·scroll origin·fractional·두옵션 배타성 미확인
- REQ-PAGE-SCREENSHOT-001: 전체 규범 충족은 미확인: viewport/fullPage/clip의 범위를 구분하고 clip은 현재 viewport CSS 좌표로 캡처한다.
- REQ-PAGE-SCREENSHOT-002: 전체 규범 충족은 미확인: 가로·세로 스크롤과 DPR2에서 clip의 대상 픽셀과 크기를 확인하며 viewport가 변하면 재시도 후 명시 실패한다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `direct` — Page screenshot 및 annotatedScreenshot
- 공개 예제 상태: 미실행예제(공개문법). 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await page.screenshot(); await annotatedScreenshot(page)
```

- `CL-ASIDE-page-screenshot-01` **DOC**: raw screenshot 및 ref box 포함 annotatedScreenshot 사용은 DOC. 근거 `A-DOC-REPL` / .local/reference-loop-execution/aside/current-repl-guide.txt :: Environment visual verification / Reading Escalation step4. 범위: 현재 공개 가이드 계약만; 실행검증 아님. 2026-11-01 Aside CLI1.26.1028.2335/skill3. Environment visual verification / Reading Escalation step4.

- `CL-ASIDE-page-screenshot-02` **HISTORICAL**: 과거 clip320x240 CSS 요청이 PNG640x480이었음(HISTORICAL/DPR). 근거 `A-HIST-CLIP` / docs/evidence/diagnostics-before-after.json#/aside/cases[id=screenshot-clip]; scripts/compare-aside.mjs screenshot-clip; docs/fixes-before-after.md Codex / Aside / 우리 툴 :: screenshot-clip result and DPR note. 범위: 과거 원본 Aside CLI1.26.1028.2335 동일 /audit 단일 비교run의 기재조건만. 브라우저버전 미기재. 이번 새실측 아님. screenshot-clip result and DPR note.

추가 확인할 조건:

- fullPage·clip 옵션 일반서명·viewport 경계·자동scroll·최대 크기는 미확인.
- 우리규범 추가 확인: viewport/fullPage/clip의 범위를 구분하고 clip은 현재 viewport CSS 좌표로 캡처한다.
- 우리규범 추가 확인: 가로·세로 스크롤과 DPR2에서 clip의 대상 픽셀과 크기를 확인하며 viewport가 변하면 재시도 후 명시 실패한다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 현재 DOM/프레임·부분조회/이미지 관찰을 참고한다. 예산·세대 cursor·scrollport 단서·CSS clip은 우리 요구에 맞춰 선택하며 문서에 없는 경쟁 옵션을 발명하지 않는다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-PAGE-SCREENSHOT-001, PLAN-PAGE-SCREENSHOT-002, PLAN-PAGE-SCREENSHOT-003, PLAN-PAGE-SCREENSHOT-004. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-page-frames

대상: **page.frames**. 관련 요구: REQ-PAGE-FRAMES-001, REQ-PAGE-FRAMES-002. 정본: [개별 요구](../internal/page.frames.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `composition` — domSnapshot + read-only DOM iframe inspection
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await tab.playwright.evaluate(() => Array.from(document.querySelectorAll("iframe"),e=>({src:e.getAttribute("src"),name:e.name})))
```

- `CL-CODEX-page-frames-01` **DOC**: snapshot에 iframe body when available; evaluate는 main DOM 읽기 근거 `CUA-DOC-API` / CUA API Reference: domSnapshot + read-only DOM iframe inspection and relevant option types. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- DOM iframe 요소 목록은 main/nested/OOPIF process tree와 동등하지 않음
- REQ-PAGE-FRAMES-001: 전체 규범 충족은 미확인: main·중첩·교차 출처/OOPIF 프레임을 부모 관계와 함께 찾을 수 있다.
- REQ-PAGE-FRAMES-002: 전체 규범 충족은 미확인: 분리·교체 중 접근 불가 프레임은 누락 이유 또는 재조회 필요를 표시하고 완전 관찰로 주장하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: main·중첩·교차 출처/OOPIF 프레임을 부모 관계와 함께 찾을 수 있다.
- 우리규범 추가 확인: 분리·교체 중 접근 불가 프레임은 누락 이유 또는 재조회 필요를 표시하고 완전 관찰로 주장하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-PAGE-FRAMES-001, PLAN-PAGE-FRAMES-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-page-frame

대상: **page.frame**. 관련 요구: REQ-PAGE-FRAME-001, REQ-PAGE-FRAME-002. 정본: [개별 요구](../internal/page.frame.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `composition` — tab.playwright.frameLocator
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
tab.playwright.frameLocator("iframe[data-workspace]")
```

- `CL-CODEX-page-frame-01` **DOC**: CSS frame selector로 frame builder, 중첩 frameLocator 지원 근거 `CUA-DOC-API` / CUA API Reference: tab.playwright.frameLocator and relevant option types. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- frameId binding·document lifetime·Scope.snapshot/evaluate 없음
- REQ-PAGE-FRAME-001: 전체 규범 충족은 미확인: 프레임 핸들은 그 프레임의 문서만 선택·평가하고 형제 프레임에 누출되지 않는다.
- REQ-PAGE-FRAME-002: 전체 규범 충족은 미확인: 분리된 frameId의 조작은 stale frame 오류이며 main frame으로 자동 대체하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `composition` — iframe selector 기반 frameLocator(과거 호출)
- 공개 예제 상태: 과거실측문법 재사용·이번 미실행. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
page.frameLocator("iframe").getByRole("button", {name:"좌표 내부 실행",exact:true})
```

- `CL-ASIDE-page-frame-01` **HISTORICAL**: 과거 frameLocator→getByRole→click 문법 실행됨; 업무 이름변경0·서버PASS없음 HISTORICAL. 근거 `A-HIST-FRAME` / docs/evidence/diagnostics-before-after.json#/aside/cases[id=scaled-frame-click]; scripts/compare-aside.mjs scaled-frame-click; docs/fixes-before-after.md Codex / Aside / 우리 툴 :: frameLocator call and observed business result. 범위: 과거 원본 Aside CLI1.26.1028.2335 동일 /audit 단일 비교run의 기재조건만. 브라우저버전 미기재. 이번 새실측 아님. frameLocator call and observed business result.

- `CL-ASIDE-page-frame-02` **INFERENCE**: 조합 대응 판단: iframe selector 기반 frameLocator(과거 호출) 근거 `A-HIST-FRAME` / docs/evidence/diagnostics-before-after.json#/aside/cases[id=scaled-frame-click]; scripts/compare-aside.mjs scaled-frame-click; docs/fixes-before-after.md Codex / Aside / 우리 툴 :: underlying public/historical mechanism. 범위: 조사자의 목적 대응 판단. 우리 API의 전체 조건 충족이나 경쟁 API의 동등성 확인이 아님. confirmedConditions 분자에 넣지 않음..

추가 확인할 조건:

- frameId 핸들·트리발견·OOPIF·detach·같은이름 frame의 확정 경로는 미확인.
- 우리규범 추가 확인: 프레임 핸들은 그 프레임의 문서만 선택·평가하고 형제 프레임에 누출되지 않는다.
- 우리규범 추가 확인: 분리된 frameId의 조작은 stale frame 오류이며 main frame으로 자동 대체하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-PAGE-FRAME-001, PLAN-PAGE-FRAME-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-locator-boundingbox

대상: **locator.boundingBox**. 관련 요구: REQ-LOCATOR-BOUNDINGBOX-001, REQ-LOCATOR-BOUNDINGBOX-002. 정본: [개별 요구](../internal/locator.boundingBox.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `composition` — locator.evaluate read-only rect
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await locator.evaluate(el => {const r=el.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}})
```

- `CL-CODEX-locator-boundingBox-01` **DOC**: DOM rect 읽기는 공개 evaluate 조합; frame내 rect는 local 근거 `CUA-DOC-API` / CUA API Reference: locator.evaluate read-only rect and relevant option types. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- 메인viewport 변환·hidden null·OOPIF·unsupported transform 미확인
- REQ-LOCATOR-BOUNDINGBOX-001: 전체 규범 충족은 미확인: 입력 좌표와 같은 main viewport 기준으로 box를 반환하며 숨김은null이다.
- REQ-LOCATOR-BOUNDINGBOX-002: 전체 규범 충족은 미확인: 중첩 scale/translate iframe과 scroll에서 좌표 일치, unsupported transform은명시 오류며 로컬 좌표를전역값으로 주지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: 입력 좌표와 같은 main viewport 기준으로 box를 반환하며 숨김은null이다.
- 우리규범 추가 확인: 중첩 scale/translate iframe과 scroll에서 좌표 일치, unsupported transform은명시 오류며 로컬 좌표를전역값으로 주지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-LOCATOR-BOUNDINGBOX-001, PLAN-LOCATOR-BOUNDINGBOX-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-dom-frames

대상: **dom-frames**. 관련 요구: REQ-C-DOMFRAMES-001, REQ-C-DOMFRAMES-002, REQ-C-DOMFRAMES-003, REQ-C-DOMFRAMES-004, REQ-C-DOMFRAMES-005, REQ-C-DOMFRAMES-006. 정본: [개별 요구](../common/dom-frames.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `composition` — domSnapshot + frameLocator + read-only evaluate
- 공개 예제 상태: common mechanism; use specific API examples, not independently executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- 모든 offscreen DOM·무스크롤·request0·nested/OOPIF·stale·openShadow·unsupported transform 거절 미확인
- snapshot/selector/상태 조회 등 관찰 API의 기본 범위는 현재 연결 DOM의 화면 밖 영역까지다. 이들 관찰은 scroll·click·추가 데이터 로딩을 발생시키지 않는다. evaluate/evaluateAll/waitForFunction의 사용자 함수는 명시적으로 효과를 낼 수 있으며 무조작 관찰 보장의 예외다.
- Frame Scope는 선택 프레임과 연결된 자식 관찰 범위를 명시한다. CSS/role/text 선택은 해당 document에 한정하고 ref는 발급frame로 라우팅한다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `composition` — snapshot 관찰→frameLocator 또는 ref 대상→action→새 snapshot 사후판정
- 공개 예제 상태: 조합설계·이번 미실행. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- `CL-ASIDE-dom-frames-01` **DOC**: snapshot은 offscreen/child iframe을 포함한다고 DOC. 근거 `A-DOC-REPL` / .local/reference-loop-execution/aside/current-repl-guide.txt :: Snapshot offscreen/childiframe bullet. 범위: 현재 공개 가이드 계약만; 실행검증 아님. 2026-11-01 Aside CLI1.26.1028.2335/skill3. Snapshot offscreen/childiframe bullet.

- `CL-ASIDE-dom-frames-02` **HISTORICAL**: 과거 scale frame 호출 뒤 업무 이름변경0·서버PASS없음 HISTORICAL. 근거 `A-HIST-FRAME` / docs/evidence/diagnostics-before-after.json#/aside/cases[id=scaled-frame-click]; scripts/compare-aside.mjs scaled-frame-click; docs/fixes-before-after.md Codex / Aside / 우리 툴 :: scaled-frame name-change0 and absent server success. 범위: 과거 원본 Aside CLI1.26.1028.2335 동일 /audit 단일 비교run의 기재조건만. 브라우저버전 미기재. 이번 새실측 아님. scaled-frame name-change0 and absent server success.

- `CL-ASIDE-dom-frames-03` **HISTORICAL**: 과거 slot 이름 role 검색 오류 HISTORICAL. 근거 `A-HIST-SLOT` / docs/evidence/diagnostics-before-after.json#/aside/cases[id=slot-name]; scripts/compare-aside.mjs slot-name :: slot role error. 범위: 과거 원본 Aside CLI1.26.1028.2335 동일 /audit 단일 비교run의 기재조건만. 브라우저버전 미기재. 이번 새실측 아님. slot role error.

- `CL-ASIDE-dom-frames-04` **INFERENCE**: 조합 대응 판단: snapshot 관찰→frameLocator 또는 ref 대상→action→새 snapshot 사후판정 근거 `A-DOC-REPL` / .local/reference-loop-execution/aside/current-repl-guide.txt :: underlying public/historical mechanism. 범위: 조사자의 목적 대응 판단. 우리 API의 전체 조건 충족이나 경쟁 API의 동등성 확인이 아님. confirmedConditions 분자에 넣지 않음..

추가 확인할 조건:

- 우리규범 추가 확인: snapshot/selector/상태 조회 등 관찰 API의 기본 범위는 현재 연결 DOM의 화면 밖 영역까지다. 이들 관찰은 scroll·click·추가 데이터 로딩을 발생시키지 않는다. evaluate/evaluateAll/waitForFunction의 사용자 함수는 명시적으로 효과를 낼 수 있으며 무조작 관찰 보장의 예외다.
- 우리규범 추가 확인: Frame Scope는 선택 프레임과 연결된 자식 관찰 범위를 명시한다. CSS/role/text 선택은 해당 document에 한정하고 ref는 발급frame로 라우팅한다.
- 우리규범 추가 확인: open Shadow와 slot의 composed 텍스트·hit ancestry를 지원한다. closed Shadow·canvas·PDF 의미 분석은 이번 범위 밖이다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 현재 DOM/프레임·부분조회/이미지 관찰을 참고한다. 예산·세대 cursor·scrollport 단서·CSS clip은 우리 요구에 맞춰 선택하며 문서에 없는 경쟁 옵션을 발명하지 않는다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-C-DOMFRAMES-001, PLAN-C-DOMFRAMES-002, PLAN-C-DOMFRAMES-003, PLAN-C-DOMFRAMES-004, PLAN-C-DOMFRAMES-005, PLAN-C-DOMFRAMES-006. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.
