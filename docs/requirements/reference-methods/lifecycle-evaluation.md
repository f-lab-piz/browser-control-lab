# 참고 방식: lifecycle-evaluation

다음 내용은 공개 사용 계약/관측과 우리 설계 판단이다. 내부 구현 알고리즘을 알아냈다는 뜻이 아니다. DOC·HISTORICAL·LIVE는 표시한 범위에만 적용하며 예제 문법 확인은 실제 실행과 다르다.

## ref-browser-list

대상: **browser.list**. 관련 요구: REQ-BROWSER-LIST-001, REQ-BROWSER-LIST-002. 정본: [개별 요구](../internal/browser.list.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — cua.listBrowsers
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await cua.listBrowsers({emit:false})
```

- `CL-CODEX-browser-list-01` **DOC**: BrowserInfo의 id/name/family/type/profileName/metadata 공개 근거 `CUA-DOC-ENTRY` / raw/cua-entry-excerpts.md:33-41; raw/cua-entry-excerpts.md:83-83. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- 연결 안 된 browser를 빈 정상 목록으로 반환하는지 미확인
- REQ-BROWSER-LIST-001: 전체 규범 충족은 미확인: 연결 프로필을 식별할 수 있고 존재하지 않는 브라우저 지원을 만들지 않는다.
- REQ-BROWSER-LIST-002: 전체 규범 충족은 미확인: 확장 연결이 없으면 연결 실패를 표시하며 정상 연결 목록으로 꾸미지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `composition` — host/profile 목록 후 profile 선택
- 공개 예제 상태: 미실행예제(공개문법). 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
aside host list; aside host profiles --host <id-or-name>
```

- `CL-ASIDE-browser-list-01` **DOC**: remote host별 profile 조회와 --profile 선택이 DOC. 근거 `A-DOC-MAIN` / evidence/aside/current-main-guide.txt :: Remote control: aside host profiles --host / --profile selection. 범위: 현재 공개 가이드 계약만; 실행검증 아님. 2026-11-01 Aside CLI1.26.1028.2335/skill3. Remote control: aside host profiles --host / --profile selection.

- `CL-ASIDE-browser-list-02` **INFERENCE**: 조합 대응 판단: host/profile 목록 후 profile 선택 근거 `A-DOC-MAIN` / evidence/aside/current-main-guide.txt :: underlying public/historical mechanism. 범위: 조사자의 목적 대응 판단. 우리 API의 전체 조건 충족이나 경쟁 API의 동등성 확인이 아님. confirmedConditions 분자에 넣지 않음..

추가 확인할 조건:

- 현재 연결 프로필만 반환하는 우리 browser.list와 같은 목록/필드/오류 계약은 미확인.
- 우리규범 추가 확인: 연결 프로필을 식별할 수 있고 존재하지 않는 브라우저 지원을 만들지 않는다.
- 우리규범 추가 확인: 확장 연결이 없으면 연결 실패를 표시하며 정상 연결 목록으로 꾸미지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-BROWSER-LIST-001, PLAN-BROWSER-LIST-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-browser-tabs

대상: **browser.tabs**. 관련 요구: REQ-BROWSER-TABS-001, REQ-BROWSER-TABS-002. 정본: [개별 요구](../internal/browser.tabs.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — cua.listTabs
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await cua.listTabs({browser:"iab",emit:false})
```

- `CL-CODEX-browser-tabs-01` **DOC**: TabInfo id/browserId/providerTabId/title/url; listing does not claim 근거 `CUA-DOC-ENTRY` / raw/cua-entry-excerpts.md:42-49; raw/cua-entry-excerpts.md:84-84; raw/cua-entry-excerpts.md:90-90. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- active/windowId 부재; 방금 닫은 탭의 ID로 getTab시 유사 제목 fallback 미확인
- REQ-BROWSER-TABS-001: 전체 규범 충족은 미확인: 제어 후보 HTTP(S) 탭의 현재 메타데이터를 반환하며 목록 조회만으로 attach하지 않는다.
- REQ-BROWSER-TABS-002: 전체 규범 충족은 미확인: 나열 직후 닫힌 tabId를 attach하면 실패하며 비슷한 제목 탭으로 바꾸지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `direct` — REPL 전역 listBrowserTabs
- 공개 예제 상태: 미실행예제(공개문법). 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
console.log(await listBrowserTabs())
```

- `CL-ASIDE-browser-tabs-01` **DOC**: attach 없이 브라우저 열린 탭 목록, targetId/active/title/url 예시는 DOC. 근거 `A-DOC-REPL` / evidence/aside/current-repl-guide.txt :: Environment listBrowserTabs / Open browser tabs list example. 범위: 현재 공개 가이드 계약만; 실행검증 아님. 2026-11-01 Aside CLI1.26.1028.2335/skill3. Environment listBrowserTabs / Open browser tabs list example.

추가 확인할 조건:

- windowId·HTTP(S)필터·정확 필드 타입은 미확인.
- --help의 getTabs와 guide의 listBrowserTabs 관계는 미확인.
- 우리규범 추가 확인: 제어 후보 HTTP(S) 탭의 현재 메타데이터를 반환하며 목록 조회만으로 attach하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-BROWSER-TABS-001, PLAN-BROWSER-TABS-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-browser-open

대상: **browser.open**. 관련 요구: REQ-BROWSER-OPEN-001, REQ-BROWSER-OPEN-002. 정본: [개별 요구](../internal/browser.open.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — cua.createBrowserTab
- 공개 예제 상태: executed-limited-about-blank; mapping syntax may differ: see E-LIVE-01. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await cua.createBrowserTab("iab","about:blank",{visible:false})
```

- `CL-CODEX-browser-open-01` **DOC**: createBrowserTab(browserId,url?,options?):Promise<Tab>; options는 visible/sessionName을 선언한다. 근거 `CUA-DOC-ENTRY` / raw/cua-entry-excerpts.md:73-78; raw/cua-entry-excerpts.md:52-52. 범위: public declaration only; limits in unknownConditions.

- `CL-CODEX-browser-open-02` **LIVE**: 새 background about:blank 탭 생성 성공; createdTab="about:blank". 근거 `CUA-LIVE-BLANK` / raw/blank-probe.json#/createdTab. 범위: about:blank 1회 기록만; fixture/오류/옵션 경계 지원 근거 아님.

추가 확인할 조건:

- visible와 active는 다름; HTTP(S) 금지scheme·실패 잔여탭 미실측
- REQ-BROWSER-OPEN-001: 전체 규범 충족은 미확인: 요청 URL을 한 번 열고 준비된 Page를 반환한다.
- REQ-BROWSER-OPEN-002: 전체 규범 충족은 미확인: 금지 scheme·잘못된 URL·권한 실패는 성공 Page를 주지 않으며 새로 만든 실패 탭의 잔여 여부를 설명한다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `direct` — REPL 전역 openTab
- 공개 예제 상태: 미실행예제(공개문법). 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
const t1 = await openTab("http://127.0.0.1:8794/audit")
```

- `CL-ASIDE-browser-open-01` **DOC**: openTab(url)는 새 탭을 열고 interactive까지 기다려 page/tabs를 갱신한다고 DOC. 근거 `A-DOC-REPL` / evidence/aside/current-repl-guide.txt :: Environment openTab: open, wait interactive, update page/tabs. 범위: 현재 공개 가이드 계약만; 실행검증 아님. 2026-11-01 Aside CLI1.26.1028.2335/skill3. Environment openTab: open, wait interactive, update page/tabs.

추가 확인할 조건:

- active:false·실패탭 정리·리다이렉트·소유 identity는 미확인.
- 우리규범 추가 확인: 요청 URL을 한 번 열고 준비된 Page를 반환한다.
- 우리규범 추가 확인: 금지 scheme·잘못된 URL·권한 실패는 성공 Page를 주지 않으며 새로 만든 실패 탭의 잔여 여부를 설명한다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-BROWSER-OPEN-001, PLAN-BROWSER-OPEN-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-browser-attach

대상: **browser.attach**. 관련 요구: REQ-BROWSER-ATTACH-001, REQ-BROWSER-ATTACH-002. 정본: [개별 요구](../internal/browser.attach.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — cua.getTab
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await cua.getTab(knownTabId,{browser:"iab"})
```

- `CL-CODEX-browser-attach-01` **DOC**: ID/mention/URL로 기존 탭 binding; create와 별도 근거 `CUA-DOC-ENTRY` / raw/cua-entry-excerpts.md:78-83. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- 독점 소유·타세션·닫힌탭·debugger attach 미확인
- REQ-BROWSER-ATTACH-001: 전체 규범 충족은 미확인: 현재 HTTP(S) 탭에 연결하고 원래 URL과 내용을 보존한다.
- REQ-BROWSER-ATTACH-002: 전체 규범 충족은 미확인: 다른 세션 소유·닫힌 탭·권한 거부는 구분해 실패하고 소유를 빼앗지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `direct` — REPL 전역 attachBrowserTab
- 공개 예제 상태: 미실행예제(공개문법). 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await attachBrowserTab(targetId)
```

- `CL-ASIDE-browser-attach-01` **DOC**: 열린 targetId 탭을 attach하고 page로 설정하는 API는 DOC. 근거 `A-DOC-REPL` / evidence/aside/current-repl-guide.txt :: Environment attachBrowserTab / Open browser tabs. 범위: 현재 공개 가이드 계약만; 실행검증 아님. 2026-11-01 Aside CLI1.26.1028.2335/skill3. Environment attachBrowserTab / Open browser tabs.

추가 확인할 조건:

- 타세션 충돌·동일 핸들 멱등성·권한실패 결과는 미확인.
- 우리규범 추가 확인: 현재 HTTP(S) 탭에 연결하고 원래 URL과 내용을 보존한다.
- 우리규범 추가 확인: 다른 세션 소유·닫힌 탭·권한 거부는 구분해 실패하고 소유를 빼앗지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-BROWSER-ATTACH-001, PLAN-BROWSER-ATTACH-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-page-activate

대상: **page.activate**. 관련 요구: REQ-PAGE-ACTIVATE-001, REQ-PAGE-ACTIVATE-002. 정본: [개별 요구](../internal/page.activate.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `unknown` — None
- 공개 예제 상태: not-available. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- `CL-CODEX-page-activate-01` **DOC**: IAB visible 생성/브라우저 visibility capability는 별도 존재 근거 `CUA-DOC-ENTRY` / raw/cua-entry-excerpts.md:112-116. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- 특정 tab.activate 공개 메서드 없음; browser visible를 탭활성으로 오인
- REQ-PAGE-ACTIVATE-001: 전체 규범 충족은 미확인: 자기 탭을 활성화하고 탐색이나 탭 복제를 하지 않는다.
- REQ-PAGE-ACTIVATE-002: 전체 규범 충족은 미확인: 닫힌 핸들이나 다른 세션 탭은 실패하며 임의 탭을 활성화하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: 자기 탭을 활성화하고 탐색이나 탭 복제를 하지 않는다.
- 우리규범 추가 확인: 닫힌 핸들이나 다른 세션 탭은 실패하며 임의 탭을 활성화하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-PAGE-ACTIVATE-001, PLAN-PAGE-ACTIVATE-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-page-close

대상: **page.close**. 관련 요구: REQ-PAGE-CLOSE-001, REQ-PAGE-CLOSE-002. 정본: [개별 요구](../internal/page.close.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — tab.close
- 공개 예제 상태: executed-limited-about-blank; mapping syntax may differ: see E-LIVE-01. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await tab.close()
```

- `CL-CODEX-page-close-01` **DOC**: Tab.close():Promise<void>를 선언한다. 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:30-30. 범위: public declaration only; limits in unknownConditions.

- `CL-CODEX-page-close-02` **LIVE**: 연구 탭 close가 예외 없이 반환; tabClosedAfterProbe=true. 근거 `CUA-LIVE-BLANK` / raw/blank-probe.json#/tabClosedAfterProbe. 범위: about:blank 1회 기록만; fixture/오류/옵션 경계 지원 근거 아님.

추가 확인할 조건:

- 다른 waiter 종결·키 cleanup·재close 반환 미확인
- REQ-PAGE-CLOSE-001: 전체 규범 충족은 미확인: 지정한 탭만 닫고 기존 핸들은 사용할 수 없게 한다.
- REQ-PAGE-CLOSE-002: 전체 규범 충족은 미확인: 이미 닫힌 핸들은 구분 가능한 실패/이미 닫힘 결과를 주고 다른 탭을 닫지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `composition` — Page 메서드 대신 closeTab 전역
- 공개 예제 상태: 미실행예제(공개문법). 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await closeTab(t1)
```

- `CL-ASIDE-page-close-01` **DOC**: 반드시 closeTab(tab)을 쓰고 page.close()는 메모리누수 때문에 금지한다는 DOC. 근거 `A-DOC-REPL` / evidence/aside/current-repl-guide.txt :: Navigation and Actions: ALWAYS openTab/closeTab; NEVER page.close. 범위: 현재 공개 가이드 계약만; 실행검증 아님. 2026-11-01 Aside CLI1.26.1028.2335/skill3. Navigation and Actions: ALWAYS openTab/closeTab; NEVER page.close.

- `CL-ASIDE-page-close-02` **INFERENCE**: 조합 대응 판단: Page 메서드 대신 closeTab 전역 근거 `A-DOC-REPL` / evidence/aside/current-repl-guide.txt :: underlying public/historical mechanism. 범위: 조사자의 목적 대응 판단. 우리 API의 전체 조건 충족이나 경쟁 API의 동등성 확인이 아님. confirmedConditions 분자에 넣지 않음..

추가 확인할 조건:

- close 반환형·중복 close·waiter/input 해제 계약은 미확인.
- 우리규범 추가 확인: 지정한 탭만 닫고 기존 핸들은 사용할 수 없게 한다.
- 우리규범 추가 확인: 이미 닫힌 핸들은 구분 가능한 실패/이미 닫힘 결과를 주고 다른 탭을 닫지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-PAGE-CLOSE-001, PLAN-PAGE-CLOSE-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-page-goto

대상: **page.goto**. 관련 요구: REQ-PAGE-GOTO-001, REQ-PAGE-GOTO-002. 정본: [개별 요구](../internal/page.goto.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — tab.goto
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await tab.goto(fixtureUrl)
```

- `CL-CODEX-page-goto-01` **DOC**: goto(url):Promise<void>; boolean 반환 아님 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:33-33. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- 새 DOM 준비/네트워크 실패/old ref 정리 미확인
- REQ-PAGE-GOTO-001: 전체 규범 충족은 미확인: 새 문서에 연결 가능한 상태까지 기다리고 탐색 실패를 구분한다.
- REQ-PAGE-GOTO-002: 전체 규범 충족은 미확인: 잘못된 URL·네트워크 실패에서 이전 DOM 관찰을 새 문서 성공으로 반환하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: 새 문서에 연결 가능한 상태까지 기다리고 탐색 실패를 구분한다.
- 우리규범 추가 확인: 잘못된 URL·네트워크 실패에서 이전 DOM 관찰을 새 문서 성공으로 반환하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-PAGE-GOTO-001, PLAN-PAGE-GOTO-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-page-back

대상: **page.back**. 관련 요구: REQ-PAGE-BACK-001, REQ-PAGE-BACK-002. 정본: [개별 요구](../internal/page.back.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — tab.back
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await tab.back()
```

- `CL-CODEX-page-back-01` **DOC**: back():Promise<void> 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:29-29. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- 이력없음 false 규약은 문서에 없음
- REQ-PAGE-BACK-001: 전체 규범 충족은 미확인: 뒤 이력으로 이동하며 경계에서는false와 URL 불변을 반환한다.
- REQ-PAGE-BACK-002: 전체 규범 충족은 미확인: 빠른 연속 뒤로 이동에서 다른 탭이나 이전 문서 ref에 입력하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: 뒤 이력으로 이동하며 경계에서는false와 URL 불변을 반환한다.
- 우리규범 추가 확인: 빠른 연속 뒤로 이동에서 다른 탭이나 이전 문서 ref에 입력하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-PAGE-BACK-001, PLAN-PAGE-BACK-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-page-forward

대상: **page.forward**. 관련 요구: REQ-PAGE-FORWARD-001, REQ-PAGE-FORWARD-002. 정본: [개별 요구](../internal/page.forward.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — tab.forward
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await tab.forward()
```

- `CL-CODEX-page-forward-01` **DOC**: forward():Promise<void> 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:31-31. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- 앞이력 삭제/false 규약 미확인
- REQ-PAGE-FORWARD-001: 전체 규범 충족은 미확인: 앞 이력으로 이동하며 경계에서는false와 URL 불변을 반환한다.
- REQ-PAGE-FORWARD-002: 전체 규범 충족은 미확인: 뒤로 후 새 탐색으로 앞 이력이 사라졌으면false이며 사라진 URL을 새 탭으로 열지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: 앞 이력으로 이동하며 경계에서는false와 URL 불변을 반환한다.
- 우리규범 추가 확인: 뒤로 후 새 탐색으로 앞 이력이 사라졌으면false이며 사라진 URL을 새 탭으로 열지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-PAGE-FORWARD-001, PLAN-PAGE-FORWARD-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-page-reload

대상: **page.reload**. 관련 요구: REQ-PAGE-RELOAD-001, REQ-PAGE-RELOAD-002. 정본: [개별 요구](../internal/page.reload.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — tab.reload
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await tab.reload()
```

- `CL-CODEX-page-reload-01` **DOC**: reload():Promise<void> 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:36-36. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- 문서 generation 새값·stale ref 미확인
- REQ-PAGE-RELOAD-001: 전체 규범 충족은 미확인: 현재 URL을 다시 로드하고 새 문서 준비 이후 반환한다.
- REQ-PAGE-RELOAD-002: 전체 규범 충족은 미확인: reload 전 ref를 다음 조작에 쓰면 stale 오류이며 새 문서의 유사 요소로 연결하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: 현재 URL을 다시 로드하고 새 문서 준비 이후 반환한다.
- 우리규범 추가 확인: reload 전 ref를 다음 조작에 쓰면 stale 오류이며 새 문서의 유사 요소로 연결하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-PAGE-RELOAD-001, PLAN-PAGE-RELOAD-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-locator-waitfor

대상: **locator.waitFor**. 관련 요구: REQ-LOCATOR-WAITFOR-001, REQ-LOCATOR-WAITFOR-002. 정본: [개별 요구](../internal/locator.waitFor.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — locator.waitFor
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await locator.waitFor({state:"visible",timeoutMs:1000})
```

- `CL-CODEX-locator-waitFor-01` **DOC**: attached/detached/visible/hidden과 timeoutMs; Promise<void> 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:101-101; raw/public-contract-excerpts.md:136-136; raw/public-contract-excerpts.md:145-145. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- 우리 0/1/N 표·stale ref 예외·기본visible 미확인
- REQ-LOCATOR-WAITFOR-001: 전체 규범 충족은 미확인: CSS 기반 대기는 attached=1개 이상이면 true, detached=0개면 true, hidden=0개 또는 단일 hidden이면 true, visible=단일 visible이면 true다. attached/detached 외 hidden/visible에서 N>1은 즉시 다중 오류다. 아직 만족하지 않는 유효 상태는 timeout까지 기다린다. ref는 어떤 state에서도 detach/document 교체 시 stale 오류다.
- REQ-LOCATOR-WAITFOR-002: 전체 규범 충족은 미확인: 알수없는state·잘못된timeout은즉시오류며 stale ref를 단순 detached로 무조건 흡수하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `direct` — Locator waitFor(과거 호출)
- 공개 예제 상태: 과거실측문법 재사용·이번 미실행. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await page.getByText("PASS · drag", {exact:true}).waitFor({timeout:2000})
```

- `CL-ASIDE-locator-waitFor-01` **HISTORICAL**: 과거 drag 후 텍스트 완료대기 문법이 실행됨 HISTORICAL. 근거 `A-HIST-DRAG` / docs/evidence/diagnostics-before-after.json#/aside/cases[id=html-drag],/aside/serverPassed/drag,/aside/events; scripts/compare-aside.mjs html-drag :: exact text waitFor(timeout2000) completed before true. 범위: 과거 원본 Aside CLI1.26.1028.2335 동일 /audit 단일 비교run의 기재조건만. 브라우저버전 미기재. 이번 새실측 아님. exact text waitFor(timeout2000) completed before true.

추가 확인할 조건:

- state4종·0/1/N·ref stale·default timeout·무scroll은 미확인.
- 우리규범 추가 확인: CSS 기반 대기는 attached=1개 이상이면 true, detached=0개면 true, hidden=0개 또는 단일 hidden이면 true, visible=단일 visible이면 true다. attached/detached 외 hidden/visible에서 N>1은 즉시 다중 오류다. 아직 만족하지 않는 유효 상태는 timeout까지 기다린다. ref는 어떤 state에서도 detach/document 교체 시 stale 오류다.
- 우리규범 추가 확인: 알수없는state·잘못된timeout은즉시오류며 stale ref를 단순 detached로 무조건 흡수하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-LOCATOR-WAITFOR-001, PLAN-LOCATOR-WAITFOR-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-page-waitforurl

대상: **page.waitForURL**. 관련 요구: REQ-PAGE-WAITFORURL-001, REQ-PAGE-WAITFORURL-002. 정본: [개별 요구](../internal/page.waitForURL.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — tab.playwright.waitForURL
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await tab.playwright.waitForURL(expectedUrl,{timeoutMs:1000,waitUntil:"commit"})
```

- `CL-CODEX-page-waitForURL-01` **DOC**: string URL와 timeoutMs/waitUntil; 반환void 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:56-56; raw/public-contract-excerpts.md:126-126. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- 문자열 exact/glob 해석·현재즉시·RegExp거절 미확인
- REQ-PAGE-WAITFORURL-001: 전체 규범 충족은 미확인: 현재 URL이 요청문자열과 같으면 즉시, 이동후 같으면그때 반환한다.
- REQ-PAGE-WAITFORURL-002: 전체 규범 충족은 미확인: glob/RegExp는이번지원아님을 안내·거절하며 시간초과를네트워크완료로오인하지않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: 현재 URL이 요청문자열과 같으면 즉시, 이동후 같으면그때 반환한다.
- 우리규범 추가 확인: glob/RegExp는이번지원아님을 안내·거절하며 시간초과를네트워크완료로오인하지않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-PAGE-WAITFORURL-001, PLAN-PAGE-WAITFORURL-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-page-waitforfunction

대상: **page.waitForFunction**. 관련 요구: REQ-PAGE-WAITFORFUNCTION-001, REQ-PAGE-WAITFORFUNCTION-002. 정본: [개별 요구](../internal/page.waitForFunction.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `composition` — read-only evaluate + host polling
- 공개 예제 상태: pseudocode. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
// 의사코드: deadline 내 read-only evaluate를 순차 await; truthy면 종료
```

- `CL-CODEX-page-waitForFunction-01` **DOC**: page evaluate는 read-only 서명으로 Promise 결과 타입을 포함한다. 내장 waitForFunction 실제지원은 미확인이다. 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:151-151; raw/public-contract-excerpts.md:120-120. 범위: public declaration only; limits in unknownConditions.

- `CL-CODEX-page-waitForFunction-02` **INFERENCE**: 호스트에서 read-only evaluate를 순차 반복하는 조합은 의사코드다. 내장 waitForFunction 또는 effectful 함수 지원의 증거가 아니다. 근거 `CODEX-RESEARCH-INFERENCE` / sources.md#ref1-정리-조합-추론의-범위. 범위: 조사자의 미실행 조합 제안; DOC/LIVE 확정분자 제외.

추가 확인할 조건:

- thenable settled truthiness·poll간격·context교체·부작용 함수 미확인
- REQ-PAGE-WAITFORFUNCTION-001: 전체 규범 충족은 미확인: Page main frame에서 fn(arg)를 반복 호출하고 각 Promise/thenable의 settled JSON 값이 truthy일 때 그 값을 반환한다. false/0/빈문자열/null은 미충족으로 다음 polling을 한다. 기본 총10초 대기이며 바깥 js deadline보다 연장하지 않는다. 이전 호출이 settle하기 전에 다음 함수를 겹쳐 실행하지 않는다.
- REQ-PAGE-WAITFORFUNCTION-002: 전체 규범 충족은 미확인: 인자/결과 직렬화 오류와 사용자 throw/async reject는 즉시 실패한다. navigation으로 실행 context가 사라진 경우만 남은 총 deadline 내 새 main document에서 다시 평가할 수 있다. 사용자 함수는 polling으로 반복될 수 있으므로 부작용을 명시하며 이미 발생한 변경은 되돌리거나 숨기지 않는다. timeout/reset 뒤 late settle은 종료한 요청/새 세대에 결과를 주지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: Page main frame에서 fn(arg)를 반복 호출하고 각 Promise/thenable의 settled JSON 값이 truthy일 때 그 값을 반환한다. false/0/빈문자열/null은 미충족으로 다음 polling을 한다. 기본 총10초 대기이며 바깥 js deadline보다 연장하지 않는다. 이전 호출이 settle하기 전에 다음 함수를 겹쳐 실행하지 않는다.
- 우리규범 추가 확인: 인자/결과 직렬화 오류와 사용자 throw/async reject는 즉시 실패한다. navigation으로 실행 context가 사라진 경우만 남은 총 deadline 내 새 main document에서 다시 평가할 수 있다. 사용자 함수는 polling으로 반복될 수 있으므로 부작용을 명시하며 이미 발생한 변경은 되돌리거나 숨기지 않는다. timeout/reset 뒤 late settle은 종료한 요청/새 세대에 결과를 주지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-PAGE-WAITFORFUNCTION-001, PLAN-PAGE-WAITFORFUNCTION-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-page-waitforloadstate

대상: **page.waitForLoadState**. 관련 요구: REQ-PAGE-WAITFORLOADSTATE-001, REQ-PAGE-WAITFORLOADSTATE-002. 정본: [개별 요구](../internal/page.waitForLoadState.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — tab.playwright.waitForLoadState
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await tab.playwright.waitForLoadState({state:"domcontentloaded",timeoutMs:1000})
```

- `CL-CODEX-page-waitForLoadState-01` **DOC**: load/domcontentloaded/networkidle 공개, 반환void 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:54-54; raw/public-contract-excerpts.md:125-125; raw/public-contract-excerpts.md:122-122. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- interactive 지원없음; 우리 readyState반환/networkidle거절과 다름
- REQ-PAGE-WAITFORLOADSTATE-001: 전체 규범 충족은 미확인: interactive/domcontentloaded는readyState가loading이아닌상태,load는complete로정의한다.
- REQ-PAGE-WAITFORLOADSTATE-002: 전체 규범 충족은 미확인: networkidle은지원하지않아즉시거절하며SPA업무완료와load를동일시하지않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: interactive/domcontentloaded는readyState가loading이아닌상태,load는complete로정의한다.
- 우리규범 추가 확인: networkidle은지원하지않아즉시거절하며SPA업무완료와load를동일시하지않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-PAGE-WAITFORLOADSTATE-001, PLAN-PAGE-WAITFORLOADSTATE-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-scope-evaluate

대상: **scope.evaluate**. 관련 요구: REQ-SCOPE-EVALUATE-001, REQ-SCOPE-EVALUATE-002. 정본: [개별 요구](../internal/scope.evaluate.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — tab.playwright.evaluate / locator.evaluate
- 공개 예제 상태: executed-limited-about-blank; mapping syntax may differ: see E-LIVE-01. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await tab.playwright.evaluate(() => ({title:document.title}))
```

- `CL-CODEX-scope-evaluate-01` **DOC**: read-only page/element evaluate, function|string, optional arg/options, Promise 반환타입 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:151-151; raw/public-contract-excerpts.md:152-152; raw/public-contract-excerpts.md:120-120; raw/public-contract-excerpts.md:130-130. 범위: public declaration only; limits in unknownConditions.

- `CL-CODEX-scope-evaluate-02` **LIVE**: read-only evaluate 결과={bodyText:"",title:""}. 근거 `CUA-LIVE-BLANK` / raw/blank-probe.json#/output/readOnlyValue. 범위: about:blank 1회 기록만; fixture/오류/옵션 경계 지원 근거 아님.

추가 확인할 조건:

- 우리 mutation가능Scope/framecontext·thenable/JSON/undefined 정책과 다름
- REQ-SCOPE-EVALUATE-001: 전체 규범 충족은 미확인: Scope.evaluate(fn,arg)는 선택 프레임의 document를 전역 context로 두고 fn(arg)를 호출한다. Locator.evaluate 호환 별칭은 단일 element를 첫 인자, arg를 둘째 인자로 전달한다. QuickJS closure는 전달하지 않는다. Promise/JSON/오류/deadline은 REQ-C-RUNTIME-008을 따르며 반환값을 자동 모델 출력하지 않는다.
- REQ-SCOPE-EVALUATE-002: 전체 규범 충족은 미확인: navigation/분리frame/순환값/DOMnode/throw는직렬화또는실행오류로구분하며성공null로숨기지않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `direct` — Page evaluate 공개 언급
- 공개 예제 상태: 미실행예제(공개문법). 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
page.evaluate(fn) // signature incomplete: only method name documented
```

- `CL-ASIDE-scope-evaluate-01` **DOC**: 정확 selector를 알 때 외에는 evaluate/content 피하라는 DOC에 메서드명 등장. 근거 `A-DOC-REPL` / evidence/aside/current-repl-guide.txt :: Reading Escalation: avoid page.evaluate/page.content unless exact selector known. 범위: 현재 공개 가이드 계약만; 실행검증 아님. 2026-11-01 Aside CLI1.26.1028.2335/skill3. Reading Escalation: avoid page.evaluate/page.content unless exact selector known.

추가 확인할 조건:

- arg/closure/Frame scope/Promise/JSON/undefined·실패정책은 서명 미공개로 전부 미확인.
- 우리규범 추가 확인: Scope.evaluate(fn,arg)는 선택 프레임의 document를 전역 context로 두고 fn(arg)를 호출한다. Locator.evaluate 호환 별칭은 단일 element를 첫 인자, arg를 둘째 인자로 전달한다. QuickJS closure는 전달하지 않는다. Promise/JSON/오류/deadline은 REQ-C-RUNTIME-008을 따르며 반환값을 자동 모델 출력하지 않는다.
- 우리규범 추가 확인: navigation/분리frame/순환값/DOMnode/throw는직렬화또는실행오류로구분하며성공null로숨기지않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

우리 방식 유지: 우리 평가는 명시적으로 페이지 효과를 허용하되 JSON/오류/부분효과 경계를 검증한다. Codex CUA의 read-only 평가는 변경 허용의 근거가 아니다. Aside 평가 세부 계약은 미확인이다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-SCOPE-EVALUATE-001, PLAN-SCOPE-EVALUATE-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-locator-evaluateall

대상: **locator.evaluateAll**. 관련 요구: REQ-LOCATOR-EVALUATEALL-001, REQ-LOCATOR-EVALUATEALL-002. 정본: [개별 요구](../internal/locator.evaluateAll.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — locator.evaluateAll
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await locator.evaluateAll(elements => elements.map(el=>el.textContent))
```

- `CL-CODEX-locator-evaluateAll-01` **DOC**: read-only matched element array, optional arg/options Promise 타입 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:153-153; raw/public-contract-excerpts.md:131-131. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- 0배열1회·composed순서·crossframe·직렬화/thenable 정책 미확인
- REQ-LOCATOR-EVALUATEALL-001: 전체 규범 충족은 미확인: evaluateAll은 현재 선택 결과 전체를 composed 문서 순서 배열로 첫 인자, arg를 둘째 인자로 전달하며 0개는 빈 배열로 한 번 호출한다. Promise settle과 JSON 결과·실패는 REQ-C-RUNTIME-008을 따른다. 단일 대상 strict는 적용하지 않는다.
- REQ-LOCATOR-EVALUATEALL-002: 전체 규범 충족은 미확인: 중복매칭은허용하지만세션·프레임경계는유지하고직렬화오류를구분한다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: evaluateAll은 현재 선택 결과 전체를 composed 문서 순서 배열로 첫 인자, arg를 둘째 인자로 전달하며 0개는 빈 배열로 한 번 호출한다. Promise settle과 JSON 결과·실패는 REQ-C-RUNTIME-008을 따른다. 단일 대상 strict는 적용하지 않는다.
- 우리규범 추가 확인: 중복매칭은허용하지만세션·프레임경계는유지하고직렬화오류를구분한다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

우리 방식 유지: 우리 평가는 명시적으로 페이지 효과를 허용하되 JSON/오류/부분효과 경계를 검증한다. Codex CUA의 read-only 평가는 변경 허용의 근거가 아니다. Aside 평가 세부 계약은 미확인이다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-LOCATOR-EVALUATEALL-001, PLAN-LOCATOR-EVALUATEALL-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-page-logs

대상: **page.logs**. 관련 요구: REQ-PAGE-LOGS-001, REQ-PAGE-LOGS-002. 정본: [개별 요구](../internal/page.logs.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — tab.dev.logs
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await tab.dev.logs({levels:["error"],limit:20})
```

- `CL-CODEX-page-logs-01` **DOC**: levels/filter substring/limit; ISO timestamp,message,url 배열 근거 `CUA-DOC-API` / raw/cua-entry-excerpts.md:121-133. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- since·1000개·collection range/dropped/partial 없음
- REQ-PAGE-LOGS-001: 전체 규범 충족은 미확인: 페이지콘솔/오류로그를시간·level로조회하고REPLconsole.log출력과구분한다.
- REQ-PAGE-LOGS-002: 전체 규범 충족은 미확인: 페이지별 최근1000개를 보관하며 수집 시작시각·보관범위·누적 dropped·partial을 collection에 제공한다. attach 전 기간과 overflow가 since 범위에 걸리면 partial=true다. 실제 로그 entries에 합성 warning을 섞지 않고 다른 페이지/세션 로그를 포함하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: 페이지콘솔/오류로그를시간·level로조회하고REPLconsole.log출력과구분한다.
- 우리규범 추가 확인: 페이지별 최근1000개를 보관하며 수집 시작시각·보관범위·누적 dropped·partial을 collection에 제공한다. attach 전 기간과 overflow가 since 범위에 걸리면 partial=true다. 실제 로그 entries에 합성 warning을 섞지 않고 다른 페이지/세션 로그를 포함하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-PAGE-LOGS-001, PLAN-PAGE-LOGS-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## 별도 보충 표면 관측

IAB fixture 연결은 차단되었으며 CUA/Chrome-extension에서 기존 fixture의9개부분사례를 관찰했다. [보충 원자료](evidence/codex/raw/boundary1.json)와 [IAB 차단](evidence/codex/raw/boundary1-iab-blocked.json)을 구분한다. 인접/실제공백·긴본문 filter, label 조회, 0/N 조회 오류·readonly 거절 관측은 해당 어댑터/fixture 범위뿐이다. 부분확인으로서 주 IAB의 전체조건 근거 확인률은 올리지 않는다. 문서상 first-matched/null과 이Chrome실측의일부strict/timeout차이는 미해결표면차이로 보존한다.

## 우리 구현 선택의 확정 규칙

[공통 상세 정책](../common/runtime.md#실행과-수명-상세표), [공통 상세 정책](../common/input.md#상태와-키-및-완료-관측-상세표)를 해당 정본과 함께 읽는다. 정책은 [2차 메인 판단](reviews/cycle-2/research-decisions.md)에서 이유와 대안을 기록했다. DOC/관측으로 확인된 경쟁방법과 우리 선택을 혼동하지 않는다.
