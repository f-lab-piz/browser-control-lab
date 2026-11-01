# 참고 방식: files-events

다음 내용은 공개 사용 계약/관측과 우리 설계 판단이다. 내부 구현 알고리즘을 알아냈다는 뜻이 아니다. DOC·HISTORICAL·LIVE는 표시한 범위에만 적용하며 예제 문법 확인은 실제 실행과 다르다.

## ref-locator-drop

대상: **locator.drop**. 관련 요구: REQ-LOCATOR-DROP-001, REQ-LOCATOR-DROP-002. 정본: [개별 요구](../internal/locator.drop.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `unknown` — None
- 공개 예제 상태: not-available. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- `CL-CODEX-locator-drop-01` **DOC**: chooser 업로드는 공개지만 drop/files+MIME 대체 근거 아님 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:106-109. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- IAB locator.drop 없음; read-only evaluate로 synthetic drop 우회 불가
- REQ-LOCATOR-DROP-001: 전체 규범 충족은 미확인: 로컬/서버/bytes 파일과 텍스트 MIME을 공통 엔진으로 전달하고 임시 file input을 정리한다.
- REQ-LOCATOR-DROP-002: 전체 규범 충족은 미확인: trusted 필수 사이트 지원을 주장하지 않고 파일 검증 실패는 drop 이전에 거절한다. MIME/옵션은 guide와 일치해야 한다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: 로컬/서버/bytes 파일과 텍스트 MIME을 공통 엔진으로 전달하고 임시 file input을 정리한다.
- 우리규범 추가 확인: trusted 필수 사이트 지원을 주장하지 않고 파일 검증 실패는 drop 이전에 거절한다. MIME/옵션은 guide와 일치해야 한다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-LOCATOR-DROP-001, PLAN-LOCATOR-DROP-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-page-waitforevent

대상: **page.waitForEvent**. 관련 요구: REQ-PAGE-WAITFOREVENT-001, REQ-PAGE-WAITFOREVENT-002, REQ-PAGE-WAITFOREVENT-003. 정본: [개별 요구](../internal/page.waitForEvent.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — tab.playwright.waitForEvent
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
const pending=tab.playwright.waitForEvent("download",{timeoutMs:1000})
```

- `CL-CODEX-page-waitForEvent-01` **DOC**: download/filechooser overload, 호출을 조작전에 등록하라고 문서안내 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:52-53; raw/public-contract-excerpts.md:158-158. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- popup/dialog/close 없음; arming barrier·동시소비·timeout/close/reset 경합 미확인
- REQ-PAGE-WAITFOREVENT-001: 전체 규범 충족은 미확인: 조작 전에 등록한 waiter가 해당 Page의 다음 일치 이벤트를 받아 조작가능 핸들을 준다.
- REQ-PAGE-WAITFOREVENT-002: 전체 규범 충족은 미확인: 다른 탭·등록 전 이벤트는 재사용하지 않는다. 자기 Page close가 관측되면 등록된 close waiter는 {tabId:number,closedAt:epochMs}로 정확히 한 번 resolve하고 제거한다. 다른 event waiter는 PAGE_CLOSED로 reject/정리한다. 이미 닫힌 핸들에 새 wait 등록은 즉시 PAGE_CLOSED다. timeout/reset/close 경합은 실제 먼저 확정된 terminal 결과 하나만 유지하고 late 결과는 무시한다. chooser/dialog는 동일 event를 이중 소비하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `direct` — Page download 이벤트 wait
- 공개 예제 상태: 미실행예제(공개문법). 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
const p1 = page.waitForEvent("download"); await page.locator("button.export").click(); const d1 = await p1
```

- `CL-ASIDE-page-waitForEvent-01` **DOC**: download waiter를 action 전에 등록하는 공개 예제 DOC. 근거 `A-DOC-REPL` / .local/reference-loop-execution/aside/current-repl-guide.txt :: Downloads: waitForEvent(download) before click example. 범위: 현재 공개 가이드 계약만; 실행검증 아님. 2026-11-01 Aside CLI1.26.1028.2335/skill3. Downloads: waitForEvent(download) before click example.

추가 확인할 조건:

- popup/filechooser/dialog/close·등록ack·충돌·timeout/reset·1회 terminal은 미확인.
- 우리규범 추가 확인: 조작 전에 등록한 waiter가 해당 Page의 다음 일치 이벤트를 받아 조작가능 핸들을 준다.
- 우리규범 추가 확인: 다른 탭·등록 전 이벤트는 재사용하지 않는다. 자기 Page close가 관측되면 등록된 close waiter는 {tabId:number,closedAt:epochMs}로 정확히 한 번 resolve하고 제거한다. 다른 event waiter는 PAGE_CLOSED로 reject/정리한다. 이미 닫힌 핸들에 새 wait 등록은 즉시 PAGE_CLOSED다. timeout/reset/close 경합은 실제 먼저 확정된 terminal 결과 하나만 유지하고 late 결과는 무시한다. chooser/dialog는 동일 event를 이중 소비하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-PAGE-WAITFOREVENT-001, PLAN-PAGE-WAITFOREVENT-002, PLAN-PAGE-WAITFOREVENT-003. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-locator-setfiles

대상: **locator.setFiles**. 관련 요구: REQ-LOCATOR-SETFILES-001, REQ-LOCATOR-SETFILES-002, REQ-LOCATOR-SETFILES-003. 정본: [개별 요구](../internal/locator.setFiles.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `composition` — waitForEvent(filechooser) + click + chooser.setFiles
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
const p=tab.playwright.waitForEvent("filechooser",{timeoutMs:1000}); await fileLocator.click(); const c=await p; await c.setFiles([absoluteTestPath]);
```

- `CL-CODEX-locator-setFiles-01` **DOC**: file-uploads 문서는 waitForEvent(filechooser)→click→chooser.setFiles 순서를 안내하며 locator.setInputFiles를 찾지 말라고 한다. 근거 `CUA-DOC-UPLOAD` / raw/file-uploads.md:5-10; raw/file-uploads.md:15-15. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- fileId/bytes/base64·32MiB·empty[]·existing input보존 미확인
- REQ-LOCATOR-SETFILES-001: 전체 규범 충족은 미확인: Chrome호스트 로컬경로와 서버asset을 구분하며 실제 업로드된 바이트·이름·MIME을 검증한다.
- REQ-LOCATOR-SETFILES-002: 전체 규범 충족은 미확인: single/multiple·파일수·32MiB제한·권한·없는경로·다른세션asset을 전체사전검증하고 실패시기존선택보존여부를알린다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: Chrome호스트 로컬경로와 서버asset을 구분하며 실제 업로드된 바이트·이름·MIME을 검증한다.
- 우리규범 추가 확인: single/multiple·파일수·32MiB제한·권한·없는경로·다른세션asset을 전체사전검증하고 실패시기존선택보존여부를알린다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 사전 waiter/브라우저 다운로드/chooser 흐름을 참고한다. local/server asset/inline bytes와 멱등 저장·최종 취소 상태는 우리 독립 설계이며 경쟁 API에 같은 기능이 있다고 주장하지 않는다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-LOCATOR-SETFILES-001, PLAN-LOCATOR-SETFILES-002, PLAN-LOCATOR-SETFILES-003. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-chooser-setfiles

대상: **chooser.setFiles**. 관련 요구: REQ-CHOOSER-SETFILES-001, REQ-CHOOSER-SETFILES-002. 정본: [개별 요구](../internal/chooser.setFiles.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — chooser.setFiles
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await chooser.setFiles([absoluteTestPath],{timeoutMs:1000})
```

- `CL-CODEX-chooser-setFiles-01` **DOC**: browser-visible absolute path string|string[], chooser.isMultiple 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:106-109; raw/public-contract-excerpts.md:137-137; raw/public-contract-excerpts.md:159-159. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- OOPIF·stale/consumed·타세션·inline/server source 미확인
- REQ-CHOOSER-SETFILES-001: 전체 규범 충족은 미확인: 같은파일엔진으로 기본/중첩/OOPIF의 실제 chooser input에 파일을 넣는다.
- REQ-CHOOSER-SETFILES-002: 전체 규범 충족은 미확인: 소비한/닫힌/다른세션 chooser는 실패하며 다른 input에 재지정하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: 같은파일엔진으로 기본/중첩/OOPIF의 실제 chooser input에 파일을 넣는다.
- 우리규범 추가 확인: 소비한/닫힌/다른세션 chooser는 실패하며 다른 input에 재지정하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 사전 waiter/브라우저 다운로드/chooser 흐름을 참고한다. local/server asset/inline bytes와 멱등 저장·최종 취소 상태는 우리 독립 설계이며 경쟁 API에 같은 기능이 있다고 주장하지 않는다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-CHOOSER-SETFILES-001, PLAN-CHOOSER-SETFILES-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-download-save

대상: **download.save**. 관련 요구: REQ-DOWNLOAD-SAVE-001, REQ-DOWNLOAD-SAVE-002. 정본: [개별 요구](../internal/download.save.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `composition` — waitForEvent(download) + download.path
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
const d=await pendingDownload; nodeRepl.write(await d.path({timeoutMs:1000}))
```

- `CL-CODEX-download-save-01` **DOC**: download event 완료 후 local path string|null 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:158-158; raw/public-contract-excerpts.md:103-105. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- save destination/server/local·POST/blob hash·동시idempotency·30초 미확인
- REQ-DOWNLOAD-SAVE-001: 전체 규범 충족은 미확인: save는 같은 핸들의 실제 브라우저 다운로드 완료를 최대30초 기다리고 완료 바이트를 요청 목적지로 반환한다. 쿠키/POST/blob을 URL 재요청으로 대체하지 않는다. 바깥 js deadline은 연장하지 않으며 더 짧은 실행 제한에 걸리면 실행 취소/불확실로 구분한다.
- REQ-DOWNLOAD-SAVE-002: 전체 규범 충족은 미확인: 같은 세션·download id·목적지의 순차/동시 save는 하나의 결과를 공유한다. server는 같은 fileId, local은 같은 완료 path를 반환하고 재다운로드/중복 자산을 만들지 않는다. server↔local 전환은 허용하며 같은 원본 바이트를 반환한다. 다른 download의 동명 파일은 기존 파일을 덮어쓰지 않고 브라우저의 유일 이름/path와 서로 다른 asset id를 사용한다. 목적지 미지원·권한·저장/취소 실패와 부분효과는 구분한다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `composition` — Download.path + fs 검증 또는 saveAs 아티팩트 복사
- 공개 예제 상태: 미실행예제(공개문법). 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
const p1 = await d1.path(); console.log((await fs.stat(p1)).size); await d1.saveAs("./artifacts/name.ext")
```

- `CL-ASIDE-download-save-01` **DOC**: 브라우저 download.path의 실제 완료파일은 현재 REPL 세션에서 읽기 가능 DOC. 근거 `A-DOC-REPL` / .local/reference-loop-execution/aside/current-repl-guide.txt :: Downloads: completed download.path readable in same REPL session. 범위: 현재 공개 가이드 계약만; 실행검증 아님. 2026-11-01 Aside CLI1.26.1028.2335/skill3. Downloads: completed download.path readable in same REPL session.

- `CL-ASIDE-download-save-02` **DOC**: saveAs는 명시 artifact 복사가 필요할 때만; one-shot은 같은 command 내 검증 DOC. 근거 `A-DOC-REPL` / .local/reference-loop-execution/aside/current-repl-guide.txt :: Downloads: saveAs artifacts copy only when needed / one-shot same command validation. 범위: 현재 공개 가이드 계약만; 실행검증 아님. 2026-11-01 Aside CLI1.26.1028.2335/skill3. Downloads: saveAs artifacts copy only when needed / one-shot same command validation.

- `CL-ASIDE-download-save-03` **DOC**: POST/blob/redirect는 가능할 경우 브라우저 download handling; 안전한 직접 GET/HEAD fetch와 구분 DOC. 근거 `A-DOC-REPL` / .local/reference-loop-execution/aside/current-repl-guide.txt :: Downloads: safe direct GET/HEAD vs browser handling for blob/redirect/POST-backed. 범위: 현재 공개 가이드 계약만; 실행검증 아님. 2026-11-01 Aside CLI1.26.1028.2335/skill3. Downloads: safe direct GET/HEAD vs browser handling for blob/redirect/POST-backed.

- `CL-ASIDE-download-save-04` **INFERENCE**: 조합 대응 판단: Download.path + fs 검증 또는 saveAs 아티팩트 복사 근거 `A-DOC-REPL` / .local/reference-loop-execution/aside/current-repl-guide.txt :: underlying public/historical mechanism. 범위: 조사자의 목적 대응 판단. 우리 API의 전체 조건 충족이나 경쟁 API의 동등성 확인이 아님. confirmedConditions 분자에 넣지 않음..

추가 확인할 조건:

- 우리server asset/fileId·hash·서버/로컬 멱등·timeout·권한·취소경합은 미확인.
- 우리규범 추가 확인: save는 같은 핸들의 실제 브라우저 다운로드 완료를 최대30초 기다리고 완료 바이트를 요청 목적지로 반환한다. 쿠키/POST/blob을 URL 재요청으로 대체하지 않는다. 바깥 js deadline은 연장하지 않으며 더 짧은 실행 제한에 걸리면 실행 취소/불확실로 구분한다.
- 우리규범 추가 확인: 같은 세션·download id·목적지의 순차/동시 save는 하나의 결과를 공유한다. server는 같은 fileId, local은 같은 완료 path를 반환하고 재다운로드/중복 자산을 만들지 않는다. server↔local 전환은 허용하며 같은 원본 바이트를 반환한다. 다른 download의 동명 파일은 기존 파일을 덮어쓰지 않고 브라우저의 유일 이름/path와 서로 다른 asset id를 사용한다. 목적지 미지원·권한·저장/취소 실패와 부분효과는 구분한다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 사전 waiter/브라우저 다운로드/chooser 흐름을 참고한다. local/server asset/inline bytes와 멱등 저장·최종 취소 상태는 우리 독립 설계이며 경쟁 API에 같은 기능이 있다고 주장하지 않는다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-DOWNLOAD-SAVE-001, PLAN-DOWNLOAD-SAVE-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-download-cancel

대상: **download.cancel**. 관련 요구: REQ-DOWNLOAD-CANCEL-001, REQ-DOWNLOAD-CANCEL-002. 정본: [개별 요구](../internal/download.cancel.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `unknown` — None
- 공개 예제 상태: not-available. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- `CL-CODEX-download-cancel-01` **DOC**: Download 공개서명은 path만 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:103-105. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- cancel/최종중단상태 조회 없음; null path를 cancelled로 해석 불가
- REQ-DOWNLOAD-CANCEL-001: 전체 규범 충족은 미확인: 진행 다운로드에 취소를 요청하고 최대10초 내 브라우저 interrupted(USER_CANCELED) 상태를 확인한 뒤 cancelled를 반환한다. 확인이 안되면 timeout/불확실 오류이며 중단 성공을 주장하지 않는다.
- REQ-DOWNLOAD-CANCEL-002: 전체 규범 충족은 미확인: 이미 complete는 already-complete, 이미 사용자 취소는 already-cancelled, 다른 이유 interrupted는 interrupted와 원인으로 반환한다. 완료/cancel 경합도 관측한 최종 상태로 구분하고 타세션 id는 권한 오류다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: 진행 다운로드에 취소를 요청하고 최대10초 내 브라우저 interrupted(USER_CANCELED) 상태를 확인한 뒤 cancelled를 반환한다. 확인이 안되면 timeout/불확실 오류이며 중단 성공을 주장하지 않는다.
- 우리규범 추가 확인: 이미 complete는 already-complete, 이미 사용자 취소는 already-cancelled, 다른 이유 interrupted는 interrupted와 원인으로 반환한다. 완료/cancel 경합도 관측한 최종 상태로 구분하고 타세션 id는 권한 오류다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 사전 waiter/브라우저 다운로드/chooser 흐름을 참고한다. local/server asset/inline bytes와 멱등 저장·최종 취소 상태는 우리 독립 설계이며 경쟁 API에 같은 기능이 있다고 주장하지 않는다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-DOWNLOAD-CANCEL-001, PLAN-DOWNLOAD-CANCEL-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-dialog-accept

대상: **dialog.accept**. 관련 요구: REQ-DIALOG-ACCEPT-001, REQ-DIALOG-ACCEPT-002. 정본: [개별 요구](../internal/dialog.accept.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `composition` — tab.getJsDialog + typed dialog.accept
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
const d=await tab.getJsDialog(); if(d?.type==="prompt") await d.accept("값"); else if(d?.type==="confirm") await d.accept();
```

- `CL-CODEX-dialog-accept-01` **DOC**: prompt accept(text), confirm accept(); alert/beforeunload accept 없음 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:32-32; raw/public-contract-excerpts.md:113-116. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- event handle identity/stale/once·기본prompt빈문자열 미확인
- REQ-DIALOG-ACCEPT-001: 전체 규범 충족은 미확인: 발급된현재dialog를정확히한번accept하며prompt내용을보낸다.
- REQ-DIALOG-ACCEPT-002: 전체 규범 충족은 미확인: 이미처리/교체/다른페이지dialog핸들은거절하며새dialog에수락을보내지않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: 발급된현재dialog를정확히한번accept하며prompt내용을보낸다.
- 우리규범 추가 확인: 이미처리/교체/다른페이지dialog핸들은거절하며새dialog에수락을보내지않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-DIALOG-ACCEPT-001, PLAN-DIALOG-ACCEPT-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-dialog-dismiss

대상: **dialog.dismiss**. 관련 요구: REQ-DIALOG-DISMISS-001, REQ-DIALOG-DISMISS-002. 정본: [개별 요구](../internal/dialog.dismiss.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `composition` — tab.getJsDialog + dialog.dismiss
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
const d=await tab.getJsDialog(); if(d) await d.dismiss();
```

- `CL-CODEX-dialog-dismiss-01` **DOC**: alert/beforeunload/confirm/prompt 모두 dismiss 공개 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:32-32; raw/public-contract-excerpts.md:113-116. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- 현재dialog 교체·다른page·stale/once 미확인
- REQ-DIALOG-DISMISS-001: 전체 규범 충족은 미확인: 현재dialog를정확히한번dismiss하며prompt/confirm취소결과를확인한다.
- REQ-DIALOG-DISMISS-002: 전체 규범 충족은 미확인: 오래된핸들이후새dialog가열려도새dialog를닫지않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: 현재dialog를정확히한번dismiss하며prompt/confirm취소결과를확인한다.
- 우리규범 추가 확인: 오래된핸들이후새dialog가열려도새dialog를닫지않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-DIALOG-DISMISS-001, PLAN-DIALOG-DISMISS-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-files-events

대상: **files-events**. 관련 요구: REQ-C-FILESEVENTS-001, REQ-C-FILESEVENTS-002, REQ-C-FILESEVENTS-003, REQ-C-FILESEVENTS-004, REQ-C-FILESEVENTS-005, REQ-C-FILESEVENTS-006, REQ-C-FILESEVENTS-007. 정본: [개별 요구](../common/files-events.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `composition` — waitForEvent + chooser.setFiles/download.path + getJsDialog
- 공개 예제 상태: common mechanism; use specific API examples, not independently executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- `CL-CODEX-files-events-01` **DOC**: download 완료 이벤트와 Download.path, browser-visible 절대경로 chooser.setFiles 선언. 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:158-158; raw/public-contract-excerpts.md:103-105; raw/public-contract-excerpts.md:159-159. 범위: 공개 선언/안내만; 실행 또는 전체조건 충족 주장 아님.

- `CL-CODEX-files-events-02` **DOC**: filechooser waiter를 click전에 시작하도록 안내. 근거 `CUA-DOC-UPLOAD` / raw/file-uploads.md:11-11. 범위: 공개 선언/안내만; 실행 또는 전체조건 충족 주장 아님.

추가 확인할 조건:

- inline/asset/32MiB·source형식·cleanup·POST/blob byte보존·cancel·eventarming/terminal경합 미확인
- FileInput은 Chrome호스트 로컬경로·세션서버asset·명시bytes/base64를 한 엔진으로 처리한다. 서버경로를 로컬경로로 해석하지 않는다.
- 각 파일과 한 호출의 전체 파일 바이트 합은 각각32MiB 이하로 제한한다. single/multiple 개수·형식·asset 소유·로컬 권한을 전달 전 검증한다. 사전 오류는 기존 선택을 보존하고, 불가피한 중도 실패는 적용된 목록/불확실 여부를 밝힌다. 임시 DOM/file 자원은 정리한다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `composition` — 브라우저 다운로드 vs 검증된 안전 direct GET/HEAD fetch를 구분
- 공개 예제 상태: 조합설계·이번 미실행. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- `CL-ASIDE-files-events-01` **DOC**: download waiter 사전등록→click→path→fs.stat/같은세션 bytes 검증 DOC. 근거 `A-DOC-REPL` / .local/reference-loop-execution/aside/current-repl-guide.txt :: Downloads browser event example and same-session path verification. 범위: 현재 공개 가이드 계약만; 실행검증 아님. 2026-11-01 Aside CLI1.26.1028.2335/skill3. Downloads browser event example and same-session path verification.

- `CL-ASIDE-files-events-02` **INFERENCE**: 조합 대응 판단: 브라우저 다운로드 vs 검증된 안전 direct GET/HEAD fetch를 구분 근거 `A-DOC-REPL` / .local/reference-loop-execution/aside/current-repl-guide.txt :: underlying public/historical mechanism. 범위: 조사자의 목적 대응 판단. 우리 API의 전체 조건 충족이나 경쟁 API의 동등성 확인이 아님. confirmedConditions 분자에 넣지 않음..

추가 확인할 조건:

- 우리규범 추가 확인: FileInput은 Chrome호스트 로컬경로·세션서버asset·명시bytes/base64를 한 엔진으로 처리한다. 서버경로를 로컬경로로 해석하지 않는다.
- 우리규범 추가 확인: 각 파일과 한 호출의 전체 파일 바이트 합은 각각32MiB 이하로 제한한다. single/multiple 개수·형식·asset 소유·로컬 권한을 전달 전 검증한다. 사전 오류는 기존 선택을 보존하고, 불가피한 중도 실패는 적용된 목록/불확실 여부를 밝힌다. 임시 DOM/file 자원은 정리한다.
- 우리규범 추가 확인: 다운로드는 실제 브라우저 이벤트/전송을 사용한다. 쿠키/POST/blob을 단순URL 재요청으로 대체하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 사전 waiter/브라우저 다운로드/chooser 흐름을 참고한다. local/server asset/inline bytes와 멱등 저장·최종 취소 상태는 우리 독립 설계이며 경쟁 API에 같은 기능이 있다고 주장하지 않는다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-C-FILESEVENTS-001, PLAN-C-FILESEVENTS-002, PLAN-C-FILESEVENTS-003, PLAN-C-FILESEVENTS-004, PLAN-C-FILESEVENTS-005, PLAN-C-FILESEVENTS-006, PLAN-C-FILESEVENTS-007. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.
