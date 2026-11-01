# 참고 방식: runtime-output

다음 내용은 공개 사용 계약/관측과 우리 설계 판단이다. 내부 구현 알고리즘을 알아냈다는 뜻이 아니다. DOC·HISTORICAL·LIVE는 표시한 범위에만 적용하며 예제 문법 확인은 실제 실행과 다르다.

## ref-guide

대상: **guide**. 관련 요구: REQ-GUIDE-001, REQ-GUIDE-002. 정본: [개별 요구](../external/guide.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `composition` — browser.documentation + agent.documentation.get
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await agent.documentation.get("file-uploads")
```

- `CL-CODEX-guide-01` **DOC**: 최초 호출 시 안내 자동 출력, 이름 기반 문서 읽기 근거 `CUA-DOC-ENTRY` / raw/cua-entry-excerpts.md:100-100; raw/public-contract-excerpts.md:117-117; raw/public-contract-excerpts.md:117-117. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- guide api=unknown을 호출해 전체 안내로 조용히 fallback하는 반례
- REQ-GUIDE-001: 전체 규범 충족은 미확인: guide/reset/js와 내부64개, 실행 위치·출력 방법·현재 제약을 함께 안내한다.
- REQ-GUIDE-002: 전체 규범 충족은 미확인: 알 수 없는 api를 요청하면 다른 항목으로 대체하지 않고 구분 가능한 미지원 결과를 준다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `direct` — aside guide / aside guide repl
- 공개 예제 상태: 미실행예제(공개문법). 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
aside guide; aside guide repl
```

- `CL-ASIDE-guide-01` **DOC**: CLI main은 exec/repl 표면·프로필 선택·기본 운영을 안내한다. 근거 `A-DOC-MAIN` / evidence/aside/current-main-guide.txt :: Browser usage / Persistence / Remote control. 범위: 현재 공개 가이드 계약만; 실행검증 아님. 2026-11-01 Aside CLI1.26.1028.2335/skill3. Browser usage / Persistence / Remote control.

- `CL-ASIDE-guide-02` **DOC**: REPL 가이드는 환경·snapshot 옵션·download 사용법을 공개한다. 근거 `A-DOC-REPL` / evidence/aside/current-repl-guide.txt :: Environment / Snapshot / Downloads. 범위: 현재 공개 가이드 계약만; 실행검증 아님. 2026-11-01 Aside CLI1.26.1028.2335/skill3. Environment / Snapshot / Downloads.

추가 확인할 조건:

- api 이름별 부분조회/알 수 없는 api 결과는 확인 안 됨.
- 우리규범 추가 확인: guide/reset/js와 내부64개, 실행 위치·출력 방법·현재 제약을 함께 안내한다.
- 우리규범 추가 확인: 알 수 없는 api를 요청하면 다른 항목으로 대체하지 않고 구분 가능한 미지원 결과를 준다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-GUIDE-001, PLAN-GUIDE-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-reset

대상: **reset**. 관련 요구: REQ-RESET-001, REQ-RESET-002, REQ-RESET-003. 정본: [개별 요구](../external/reset.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — mcp__cua_repl.js_reset
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
{}
```

- `CL-CODEX-reset-01` **DOC**: JS bindings 제거, browser tabs/apps/state는 닫거나 지우지 않음 근거 `CUA-DOC-ENTRY` / raw/cua-entry-excerpts.md:108-110. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- 진행중 입력 뒤 reset의 실제 키 release, late hostcall·generation 정책 미확인
- REQ-RESET-001: 전체 규범 충족은 미확인: reset 성공 이후 이전 변수는 없고 새 JS 호출은 실행 가능해야 한다.
- REQ-RESET-002: 전체 규범 충족은 미확인: 진행 중 무한 루프와 event wait를 reset하면 종료 결과를 구분하고 이전 세대 결과가 새 요청에 섞이지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: reset 성공 이후 이전 변수는 없고 새 JS 호출은 실행 가능해야 한다.
- 우리규범 추가 확인: 진행 중 무한 루프와 event wait를 reset하면 종료 결과를 구분하고 이전 세대 결과가 새 요청에 섞이지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-RESET-001, PLAN-RESET-002, PLAN-RESET-003. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-js

대상: **js**. 관련 요구: REQ-JS-001, REQ-JS-002, REQ-JS-003. 정본: [개별 요구](../external/js.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — mcp__cua_repl.js
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
{"code":"var a = 1; nodeRepl.write(a)","timeout_ms":30000}
```

- `CL-CODEX-js-01` **DOC**: persistent JS REPL과 명시 nodeRepl.write 출력; 기본30초 근거 `CUA-DOC-ENTRY` / raw/cua-entry-excerpts.md:98-98; raw/cua-entry-excerpts.md:96-96; raw/cua-entry-excerpts.md:106-106. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- 실행 위치가 QuickJS라는 근거 없음; 마지막식/오류분류/120초상한 미확인
- REQ-JS-001: 전체 규범 충족은 미확인: top-level await와 세션 변수 유지, console.log/display 출력이 확장 QuickJS 안에서 실행된다.
- REQ-JS-002: 전체 규범 충족은 미확인: 구문 오류·제한 초과는 실행 오류로 구분하며 중계기 Node나 다른 세션에서 실행하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `direct` — Aside 원본 CLI repl
- 공개 예제 상태: 미실행예제(공개문법). 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
aside repl "console.log(1)"
```

- `CL-ASIDE-js-01` **DOC**: ES2023+·async/await·120초·const/let 지속·import/require 금지·명시 console 출력은 DOC. 근거 `A-DOC-REPL` / evidence/aside/current-repl-guide.txt :: Environment; persistent const/let; Always use console.log. 범위: 현재 공개 가이드 계약만; 실행검증 아님. 2026-11-01 Aside CLI1.26.1028.2335/skill3. Environment; persistent const/let; Always use console.log.

추가 확인할 조건:

- 확장 QuickJS·세션격리·requestId·코드/출력 크기·구체 취소/오류 계약은 DOC 없음.
- 우리규범 추가 확인: top-level await와 세션 변수 유지, console.log/display 출력이 확장 QuickJS 안에서 실행된다.
- 우리규범 추가 확인: 구문 오류·제한 초과는 실행 오류로 구분하며 중계기 Node나 다른 세션에서 실행하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-JS-001, PLAN-JS-002, PLAN-JS-003. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-console-log

대상: **console.log**. 관련 요구: REQ-CONSOLE-LOG-001, REQ-CONSOLE-LOG-002. 정본: [개별 요구](../internal/console.log.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `composition` — nodeRepl.write
- 공개 예제 상태: executed-limited-about-blank; mapping syntax may differ: see E-LIVE-01. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
nodeRepl.write({value:1})
```

- `CL-CODEX-console-log-01` **DOC**: 명시 텍스트 출력용 nodeRepl.write(value)를 안내한다. console.log 별칭의 동등성은 미확인이다. 근거 `CUA-DOC-ENTRY` / raw/cua-entry-excerpts.md:96-96. 범위: public declaration only; limits in unknownConditions.

- `CL-CODEX-console-log-02` **LIVE**: nodeRepl.write로 URL/count/readOnlyValue 객체가 출력됨; 실제 console.log 호출은 아님. 근거 `CUA-LIVE-BLANK` / raw/blank-probe.json#/output. 범위: about:blank 1회 기록만; fixture/오류/옵션 경계 지원 근거 아님.

추가 확인할 조건:

- console.log 별칭/순환/예산/truncated·세션격리 미확인
- REQ-CONSOLE-LOG-001: 전체 규범 충족은 미확인: 명시호출출력만반환하며마지막표현식이나페이지console과혼동하지않는다.
- REQ-CONSOLE-LOG-002: 전체 규범 충족은 미확인: 큰출력·순환값·여러블록은실행출력예산내에서절단표시하며메모리/세션을넘어유출하지않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `direct` — 명시 REPL 출력
- 공개 예제 상태: 미실행예제(공개문법). 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
console.log(await listBrowserTabs())
```

- `CL-ASIDE-console-log-01` **DOC**: 자신에게 값을 돌려받으려면 항상 console.log 사용 DOC. 근거 `A-DOC-REPL` / evidence/aside/current-repl-guide.txt :: Environment: Always use console.log to return values. 범위: 현재 공개 가이드 계약만; 실행검증 아님. 2026-11-01 Aside CLI1.26.1028.2335/skill3. Environment: Always use console.log to return values.

추가 확인할 조건:

- 마지막표현식 자동출력 부재의 엄격 보장·순환값·예산/블록·이후실행은 미확인.
- 우리규범 추가 확인: 명시호출출력만반환하며마지막표현식이나페이지console과혼동하지않는다.
- 우리규범 추가 확인: 큰출력·순환값·여러블록은실행출력예산내에서절단표시하며메모리/세션을넘어유출하지않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-CONSOLE-LOG-001, PLAN-CONSOLE-LOG-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-display

대상: **display**. 관련 요구: REQ-DISPLAY-001, REQ-DISPLAY-002. 정본: [개별 요구](../internal/display.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `composition` — nodeRepl.emitImage
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
nodeRepl.emitImage(await tab.screenshot({fullPage:false}))
```

- `CL-CODEX-display-01` **DOC**: data/file URL, PNG/JPEG/WebP bytes, {bytes,mimeType} 허용 근거 `CUA-DOC-ENTRY` / raw/cua-entry-excerpts.md:94-94. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- 우리 PNG envelope·4/8MiB·최대4장·256블록·invalid/overflow계속실행 미확인
- REQ-DISPLAY-001: 전체 규범 충족은 미확인: screenshot을실제이미지로모델에전달하며base64를일반로그로쏟지않는다.
- REQ-DISPLAY-002: 전체 규범 충족은 미확인: 잘못된 MIME/base64는 display 입력 오류다. 유효 이미지가 출력 한도를 넘으면 이미지 전체를 생략하고 truncated/이유를 결과 envelope에 표시하며 실행은 계속한다. 부분 base64 이미지를 반환하거나 다른 요청 이미지를 재사용하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `direct` — REPL 전역 display
- 공개 예제 상태: 미실행예제(공개문법). 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
display // global exists; argument signature not documented
```

- `CL-ASIDE-display-01` **DOC**: display 전역 존재 DOC. 근거 `A-DOC-REPL` / evidence/aside/current-repl-guide.txt :: Environment available globals: fs,path,Buffer,sleep,display,pwd. 범위: 현재 공개 가이드 계약만; 실행검증 아님. 2026-11-01 Aside CLI1.26.1028.2335/skill3. Environment available globals: fs,path,Buffer,sleep,display,pwd.

추가 확인할 조건:

- 이미지 인자형식·출력블록·MIME/base64·예산/생략·반환은 미확인.
- 우리규범 추가 확인: screenshot을실제이미지로모델에전달하며base64를일반로그로쏟지않는다.
- 우리규범 추가 확인: 잘못된 MIME/base64는 display 입력 오류다. 유효 이미지가 출력 한도를 넘으면 이미지 전체를 생략하고 truncated/이유를 결과 envelope에 표시하며 실행은 계속한다. 부분 base64 이미지를 반환하거나 다른 요청 이미지를 재사용하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-DISPLAY-001, PLAN-DISPLAY-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-runtime

대상: **runtime**. 관련 요구: REQ-C-RUNTIME-001, REQ-C-RUNTIME-002, REQ-C-RUNTIME-003, REQ-C-RUNTIME-004, REQ-C-RUNTIME-005, REQ-C-RUNTIME-006, REQ-C-RUNTIME-007, REQ-C-RUNTIME-008. 정본: [개별 요구](../common/runtime.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `composition` — js/reset + nodeRepl output
- 공개 예제 상태: common mechanism; use specific API examples, not independently executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- `CL-CODEX-runtime-01` **DOC**: persistent CUA REPL, reset binding 제거, 명시 nodeRepl.write 출력 안내. 근거 `CUA-DOC-ENTRY` / raw/cua-entry-excerpts.md:98-98; raw/cua-entry-excerpts.md:108-110; raw/cua-entry-excerpts.md:96-96. 범위: 공개 선언/안내만; 실행 또는 전체조건 충족 주장 아님.

추가 확인할 조건:

- QuickJS 확장내 실행·requestId dedupe·예산·session소유·late hostcall·release 전부 별도 미확인
- 外部 도구는 guide/reset/js 세 개를 유지한다. 관리 HTTP endpoint와 내부64개는 외부 도구 수에 포함하지 않는다.
- JS는 확장 내 세션별 QuickJS에서 실행하고 외부 중계기는 제품코드 평가를 대신하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `direct` — 공개 CLI 환경 계약을 참고하고 확장 QuickJS·요청멱등·reset/예산은 우리 독립 설계로 유지
- 공개 예제 상태: 조합설계·이번 미실행. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- `CL-ASIDE-runtime-01` **DOC**: 120초·ES2023+·const/let 지속·import/require 금지·명시console은 DOC. 근거 `A-DOC-REPL` / evidence/aside/current-repl-guide.txt :: Environment. 범위: 현재 공개 가이드 계약만; 실행검증 아님. 2026-11-01 Aside CLI1.26.1028.2335/skill3. Environment.

추가 확인할 조건:

- 우리규범 추가 확인: 外部 도구는 guide/reset/js 세 개를 유지한다. 관리 HTTP endpoint와 내부64개는 외부 도구 수에 포함하지 않는다.
- 우리규범 추가 확인: JS는 확장 내 세션별 QuickJS에서 실행하고 외부 중계기는 제품코드 평가를 대신하지 않는다.
- 우리규범 추가 확인: reset/timeout은 이전세대 대기·late결과를 구분하고 브라우저에 이미 발생한 효과는 rollback했다고 주장하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-C-RUNTIME-001, PLAN-C-RUNTIME-002, PLAN-C-RUNTIME-003, PLAN-C-RUNTIME-004, PLAN-C-RUNTIME-005, PLAN-C-RUNTIME-006, PLAN-C-RUNTIME-007, PLAN-C-RUNTIME-008. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## 우리 구현 선택의 확정 규칙

[공통 상세 정책](../common/runtime.md#실행과-수명-상세표)를 해당 정본과 함께 읽는다. 정책은 [2차 메인 판단](reviews/cycle-2/research-decisions.md)에서 이유와 대안을 기록했다. DOC/관측으로 확인된 경쟁방법과 우리 선택을 혼동하지 않는다.
