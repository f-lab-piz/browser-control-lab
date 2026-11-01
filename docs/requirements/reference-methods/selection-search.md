# 참고 방식: selection-search

다음 내용은 공개 사용 계약/관측과 우리 설계 판단이다. 내부 구현 알고리즘을 알아냈다는 뜻이 아니다. DOC·HISTORICAL·LIVE는 표시한 범위에만 적용하며 예제 문법 확인은 실제 실행과 다르다.

## ref-scope-locator

대상: **scope.locator**. 관련 요구: REQ-SCOPE-LOCATOR-001, REQ-SCOPE-LOCATOR-002. 정본: [개별 요구](../internal/scope.locator.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — scope.locator
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
tab.playwright.locator("button[data-action]")
```

- `CL-CODEX-scope-locator-01` **DOC**: 페이지/frame의 CSS locator builder 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:51-51; raw/public-contract-excerpts.md:58-66. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- qualified ref 입력/invalidCSS 시점/stale·Shadow piercing 범위 미확인
- REQ-SCOPE-LOCATOR-001: 전체 규범 충족은 미확인: CSS는 현재 Scope 안에서 평가하고 ref는 발급 문서·프레임·요소에 고정한다.
- REQ-SCOPE-LOCATOR-002: 전체 규범 충족은 미확인: 잘못된 CSS·낡은 ref는 실패하며 이름 유사도나 DOM 순서로 보정하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `direct` — Page locator에 CSS 또는 virtual ref 전달
- 공개 예제 상태: 미실행예제(공개문법). 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
page.locator("e31"); page.locator("button.export")
```

- `CL-ASIDE-scope-locator-01` **DOC**: virtual ref는 page.locator(ref)로 전달하며 DOM property/CSS와 혼합금지 DOC. 근거 `A-DOC-REPL` / .local/reference-loop-execution/aside/current-repl-guide.txt :: Snapshot: ref IDs are virtual locators; page.locator(e31). 범위: 현재 공개 가이드 계약만; 실행검증 아님. 2026-11-01 Aside CLI1.26.1028.2335/skill3. Snapshot: ref IDs are virtual locators; page.locator(e31).

- `CL-ASIDE-scope-locator-02` **DOC**: download button CSS locator 예시 DOC. 근거 `A-DOC-REPL` / .local/reference-loop-execution/aside/current-repl-guide.txt :: Downloads: page.locator(button.export).click example. 범위: 현재 공개 가이드 계약만; 실행검증 아님. 2026-11-01 Aside CLI1.26.1028.2335/skill3. Downloads: page.locator(button.export).click example.

추가 확인할 조건:

- Scope/Frame 범위 일반화·지연평가·strict·잘못된 CSS 오류시점은 미확인.
- 우리규범 추가 확인: CSS는 현재 Scope 안에서 평가하고 ref는 발급 문서·프레임·요소에 고정한다.
- 우리규범 추가 확인: 잘못된 CSS·낡은 ref는 실패하며 이름 유사도나 DOM 순서로 보정하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-SCOPE-LOCATOR-001, PLAN-SCOPE-LOCATOR-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-scope-getbyrole

대상: **scope.getByRole**. 관련 요구: REQ-SCOPE-GETBYROLE-001, REQ-SCOPE-GETBYROLE-002. 정본: [개별 요구](../internal/scope.getByRole.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — scope.getByRole
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
tab.playwright.getByRole("button",{name:/확인/,exact:false})
```

- `CL-CODEX-scope-getByRole-01` **DOC**: getByRole(role,{exact?,name?})와 TextMatcher=string|RegExp를 선언한다. 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:48-48; raw/public-contract-excerpts.md:123-123. 범위: public declaration only; limits in unknownConditions.

- `CL-CODEX-scope-getByRole-02` **HISTORICAL**: {"regex": 1, "slotClick": true} 근거 `HIST-CODEX-AUDIT` / raw/historical-diagnostics-before-after.json#/codex/regex; raw/historical-diagnostics-before-after.json#/codex/slotClick. 범위: 2026-11-01 이전 audit 기록의 해당 값만; 현재 재실행/모든 옵션 지원 아님; 빌드/상세 호출 trace 미보존.

추가 확인할 조건:

- includeHidden 옵션 없음; name 계산 전체·g/y/aria-labelledby 미확인
- REQ-SCOPE-GETBYROLE-001: 전체 규범 충족은 미확인: 네이티브·명시 role과 접근 이름으로 검색하고 기본 숨김 제외/화면 밖 포함을 구분한다.
- REQ-SCOPE-GETBYROLE-002: 전체 규범 충족은 미확인: 정규식 source/flags와 exact 문자열을 보존하고 slot/aria-labelledby 이름의 동작을 검증한다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `direct` — Page getByRole(과거 호출)
- 공개 예제 상태: 과거실측문법 재사용·이번 미실행. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
page.getByRole("button", {name:/레이블 저장/}).count()
```

- `CL-ASIDE-scope-getByRole-01` **HISTORICAL**: 과거 regex role count1 HISTORICAL. 근거 `A-HIST-REGEX` / docs/evidence/diagnostics-before-after.json#/aside/cases[id=regex-role]; scripts/compare-aside.mjs regex-role :: regex-role result value1. 범위: 과거 원본 Aside CLI1.26.1028.2335 동일 /audit 단일 비교run의 기재조건만. 브라우저버전 미기재. 이번 새실측 아님. regex-role result value1.

- `CL-ASIDE-scope-getByRole-02` **HISTORICAL**: slot 이름 role 탐색은 Role selector not found HISTORICAL. 근거 `A-HIST-SLOT` / docs/evidence/diagnostics-before-after.json#/aside/cases[id=slot-name]; scripts/compare-aside.mjs slot-name :: slot-name Role selector not found error. 범위: 과거 원본 Aside CLI1.26.1028.2335 동일 /audit 단일 비교run의 기재조건만. 브라우저버전 미기재. 이번 새실측 아님. slot-name Role selector not found error.

추가 확인할 조건:

- 모든 role/exact/includeHidden·aria 이름·g/y 정규식·오류 안전성은 미확인.
- 우리규범 추가 확인: 네이티브·명시 role과 접근 이름으로 검색하고 기본 숨김 제외/화면 밖 포함을 구분한다.
- 우리규범 추가 확인: 정규식 source/flags와 exact 문자열을 보존하고 slot/aria-labelledby 이름의 동작을 검증한다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-SCOPE-GETBYROLE-001, PLAN-SCOPE-GETBYROLE-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-scope-getbytext

대상: **scope.getByText**. 관련 요구: REQ-SCOPE-GETBYTEXT-001, REQ-SCOPE-GETBYTEXT-002, REQ-SCOPE-GETBYTEXT-003. 정본: [개별 요구](../internal/scope.getByText.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — scope.getByText
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
tab.playwright.getByText("foobar",{exact:true})
```

- `CL-CODEX-scope-getByText-01` **DOC**: TextMatcher와 exact 공개 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:50-50; raw/public-contract-excerpts.md:123-123. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- composed 최소요소·인접span·ARIA숨김·CSS숨김·빈문자열/regex+exact 미확인
- REQ-SCOPE-GETBYTEXT-001: 전체 규범 충족은 미확인: 공통 selection의 정규화된 composed 본문을 검색하며 출력용 이름 축약과 무관하게 전체 본문을 사용한다. 같은 검색조건에 맞는 composed 후손 요소가 있으면 조상은 제외하는 최소 일치 요소 정책을 적용한다. 남은 연결 요소는 중복 없이 composed 문서 순서로 반환한다.
- REQ-SCOPE-GETBYTEXT-002: 전체 규범 충족은 미확인: 접근 이름과 다른 본문·인접 span·실제 공백·긴 텍스트에서 검색 의미를 공통 selection 계약대로 유지한다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `direct` — Page getByText(과거 호출)
- 공개 예제 상태: 과거실측문법 재사용·이번 미실행. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
page.getByText("PASS · drag", {exact:true}).waitFor({timeout:2000})
```

- `CL-ASIDE-scope-getByText-01` **HISTORICAL**: 과거 drag 후 exact text waitFor가 완료되어 workflow 판단에 사용 HISTORICAL. 근거 `A-HIST-DRAG` / docs/evidence/diagnostics-before-after.json#/aside/cases[id=html-drag],/aside/serverPassed/drag,/aside/events; scripts/compare-aside.mjs html-drag :: getByText exact waitFor followed by true; server drag PASS. 범위: 과거 원본 Aside CLI1.26.1028.2335 동일 /audit 단일 비교run의 기재조건만. 브라우저버전 미기재. 이번 새실측 아님. getByText exact waitFor followed by true; server drag PASS.

추가 확인할 조건:

- 본문/aria 이름·공백·최소요소·대소문자·long text·hidden 정책은 미확인.
- 우리규범 추가 확인: 공통 selection의 정규화된 composed 본문을 검색하며 출력용 이름 축약과 무관하게 전체 본문을 사용한다. 같은 검색조건에 맞는 composed 후손 요소가 있으면 조상은 제외하는 최소 일치 요소 정책을 적용한다. 남은 연결 요소는 중복 없이 composed 문서 순서로 반환한다.
- 우리규범 추가 확인: 접근 이름과 다른 본문·인접 span·실제 공백·긴 텍스트에서 검색 의미를 공통 selection 계약대로 유지한다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-SCOPE-GETBYTEXT-001, PLAN-SCOPE-GETBYTEXT-002, PLAN-SCOPE-GETBYTEXT-003. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-scope-getbylabel

대상: **scope.getByLabel**. 관련 요구: REQ-SCOPE-GETBYLABEL-001, REQ-SCOPE-GETBYLABEL-002. 정본: [개별 요구](../internal/scope.getByLabel.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — scope.getByLabel
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
tab.playwright.getByLabel("이메일",{exact:true})
```

- `CL-CODEX-scope-getByLabel-01` **DOC**: TextMatcher+exact로 label text 검색 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:46-46; raw/public-contract-excerpts.md:123-123. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- for/wrapped/ARIA 모든 경로·다중 strict 미확인
- REQ-SCOPE-GETBYLABEL-001: 전체 규범 충족은 미확인: label for/감싼 label/aria-label/aria-labelledby로 연결된 제어를 검색한다.
- REQ-SCOPE-GETBYLABEL-002: 전체 규범 충족은 미확인: 같은 label의 여러 제어는 엄격 조작을 거절하고 비연결 일반 텍스트를 label로 오인하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `direct` — Page getByLabel(과거 호출)
- 공개 예제 상태: 과거실측문법 재사용·이번 미실행. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
page.getByLabel("고정 문서번호", {exact:true}).fill("BROKEN", {timeout:500})
```

- `CL-ASIDE-scope-getByLabel-01` **HISTORICAL**: 과거 getByLabel→fill 호출에서 오류로 rejected를 기록 HISTORICAL. 근거 `A-HIST-READONLY` / docs/evidence/diagnostics-before-after.json#/aside/cases[id=readonly-fill]; scripts/compare-aside.mjs readonly-fill :: whole getByLabel→fill call rejected; exact cause unavailable. 범위: 과거 원본 Aside CLI1.26.1028.2335 동일 /audit 단일 비교run의 기재조건만. 브라우저버전 미기재. 이번 새실측 아님. whole getByLabel→fill call rejected; exact cause unavailable.

추가 확인할 조건:

- 오류 원인이 label resolve인지 fill readonly인지 원시 상세없는 집계만으로 확정 불가; 모든 label 연결형식은 미확인.
- 우리규범 추가 확인: label for/감싼 label/aria-label/aria-labelledby로 연결된 제어를 검색한다.
- 우리규범 추가 확인: 같은 label의 여러 제어는 엄격 조작을 거절하고 비연결 일반 텍스트를 label로 오인하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-SCOPE-GETBYLABEL-001, PLAN-SCOPE-GETBYLABEL-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-locator-filter

대상: **locator.filter**. 관련 요구: REQ-LOCATOR-FILTER-001, REQ-LOCATOR-FILTER-002, REQ-LOCATOR-FILTER-003, REQ-LOCATOR-FILTER-004. 정본: [개별 요구](../internal/locator.filter.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — locator.filter
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
tab.playwright.getByRole("row",{}).filter({hasText:/예약/,hasNotText:"취소",visible:true})
```

- `CL-CODEX-locator-filter-01` **DOC**: filter(options)와 has/hasNot/hasText/hasNotText/visible 공개 옵션을 선언한다. 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:79-79; raw/public-contract-excerpts.md:132-132. 범위: public declaration only; limits in unknownConditions.

- `CL-CODEX-locator-filter-02` **HISTORICAL**: {"visibleFilter": 2} 근거 `HIST-CODEX-AUDIT` / raw/historical-diagnostics-before-after.json#/codex/visibleFilter. 범위: 2026-11-01 이전 audit 기록의 해당 값만; 현재 재실행/모든 옵션 지원 아님; 빌드/상세 호출 trace 미보존.

추가 확인할 조건:

- AND·연속호출·인접span·g/y·ARIA/CSS hidden 본문 미확인
- REQ-LOCATOR-FILTER-001: 전체 규범 충족은 미확인: 양·음 텍스트와 visible 조건을 AND로 조합하고 전체 composed 텍스트를 검색한다.
- REQ-LOCATOR-FILTER-002: 전체 규범 충족은 미확인: 없는 공백을 span 사이에 만들지 않고 실제 공백은 구분한다. has/hasNot 같은 미지원 키는 조용히 무시하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `direct` — Locator filter(과거 호출)
- 공개 예제 상태: 과거실측문법 재사용·이번 미실행. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
page.locator("#duplicates button").filter({visible:true}).count()
```

- `CL-ASIDE-locator-filter-01` **HISTORICAL**: 과거 visible:true 요청 결과3(숨김 포함) HISTORICAL; 우리 기대2와 다름. 근거 `A-HIST-FILTER` / docs/evidence/diagnostics-before-after.json#/aside/cases[id=filter-visible]; scripts/compare-aside.mjs filter-visible; docs/fixes-before-after.md Codex / Aside / 우리 툴 :: visible:true count3; hidden-included report note. 범위: 과거 원본 Aside CLI1.26.1028.2335 동일 /audit 단일 비교run의 기재조건만. 브라우저버전 미기재. 이번 새실측 아님. visible:true count3; hidden-included report note.

추가 확인할 조건:

- hasText/hasNotText·정규식·AND·순서·미지원키 처리 미확인; visible 지원이라고 단정 금지.
- 우리규범 추가 확인: 양·음 텍스트와 visible 조건을 AND로 조합하고 전체 composed 텍스트를 검색한다.
- 우리규범 추가 확인: 없는 공백을 span 사이에 만들지 않고 실제 공백은 구분한다. has/hasNot 같은 미지원 키는 조용히 무시하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-LOCATOR-FILTER-001, PLAN-LOCATOR-FILTER-002, PLAN-LOCATOR-FILTER-003, PLAN-LOCATOR-FILTER-004. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-locator-nth

대상: **locator.nth**. 관련 요구: REQ-LOCATOR-NTH-001, REQ-LOCATOR-NTH-002. 정본: [개별 요구](../internal/locator.nth.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — locator.nth
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
tab.playwright.locator("button").nth(-1)
```

- `CL-CODEX-locator-nth-01` **DOC**: nth(index:number):PlaywrightLocator를 선언한다. 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:92-92. 범위: public declaration only; limits in unknownConditions.

- `CL-CODEX-locator-nth-02` **HISTORICAL**: {"nthMinusOne": 1} 근거 `HIST-CODEX-AUDIT` / raw/historical-diagnostics-before-after.json#/codex/nthMinusOne. 범위: 2026-11-01 이전 audit 기록의 해당 값만; 현재 재실행/모든 옵션 지원 아님; 빌드/상세 호출 trace 미보존.

추가 확인할 조건:

- 소수/NaN/범위밖/원불변의 오류·정책 미확인
- REQ-LOCATOR-NTH-001: 전체 규범 충족은 미확인: 현재 필터 결과의 문서 순서에 인덱스를 적용하고 음수 끝 인덱스를 지원한다.
- REQ-LOCATOR-NTH-002: 전체 규범 충족은 미확인: 소수·NaN은 INVALID_INDEX, 범위 밖은 count0이며 조작 시 대상 없음; 원 Locator는 불변이다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `direct` — Locator nth(과거 호출)
- 공개 예제 상태: 과거실측문법 재사용·이번 미실행. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
page.locator("#duplicates [data-unit]").nth(-1).count()
```

- `CL-ASIDE-locator-nth-01` **HISTORICAL**: 과거 nth(-1) 호출이 DOMException HISTORICAL. 근거 `A-HIST-NTH` / docs/evidence/diagnostics-before-after.json#/aside/cases[id=negative-nth]; scripts/compare-aside.mjs negative-nth :: nth(-1) DOMException. 범위: 과거 원본 Aside CLI1.26.1028.2335 동일 /audit 단일 비교run의 기재조건만. 브라우저버전 미기재. 이번 새실측 아님. nth(-1) DOMException.

추가 확인할 조건:

- 음수전체/정상양수/범위밖/원본불변은 미확인; 한 실패를 전버전 미지원으로 일반화 금지.
- 우리규범 추가 확인: 현재 필터 결과의 문서 순서에 인덱스를 적용하고 음수 끝 인덱스를 지원한다.
- 우리규범 추가 확인: 소수·NaN은 INVALID_INDEX, 범위 밖은 count0이며 조작 시 대상 없음; 원 Locator는 불변이다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-LOCATOR-NTH-001, PLAN-LOCATOR-NTH-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-locator-count

대상: **locator.count**. 관련 요구: REQ-LOCATOR-COUNT-001, REQ-LOCATOR-COUNT-002. 정본: [개별 요구](../internal/locator.count.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — locator.count
- 공개 예제 상태: executed-limited-about-blank; mapping syntax may differ: see E-LIVE-01. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await tab.playwright.locator("button").count()
```

- `CL-CODEX-locator-count-01` **DOC**: count():Promise<number>를 선언한다. 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:73-73. 범위: public declaration only; limits in unknownConditions.

- `CL-CODEX-locator-count-02` **LIVE**: about:blank button locator count=0. 근거 `CUA-LIVE-BLANK` / raw/blank-probe.json#/output/count. 범위: about:blank 1회 기록만; fixture/오류/옵션 경계 지원 근거 아님.

추가 확인할 조건:

- stale ref와 0개 구분·중복collapse·순서조합 미확인
- REQ-LOCATOR-COUNT-001: 전체 규범 충족은 미확인: 현재 Scope와 필터를 모두 적용한 개수를 반환하며0개도 정상이다.
- REQ-LOCATOR-COUNT-002: 전체 규범 충족은 미확인: 중복 결과를1개로 축약하지 않으며 stale ref를 새 DOM0개와 혼동하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `direct` — Locator count(과거 호출)
- 공개 예제 상태: 과거실측문법 재사용·이번 미실행. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
console.log(await page.getByRole("button", {name:/레이블 저장/}).count())
```

- `CL-ASIDE-locator-count-01` **HISTORICAL**: 과거 regex role count1 HISTORICAL. 근거 `A-HIST-REGEX` / docs/evidence/diagnostics-before-after.json#/aside/cases[id=regex-role]; scripts/compare-aside.mjs regex-role :: role count1. 범위: 과거 원본 Aside CLI1.26.1028.2335 동일 /audit 단일 비교run의 기재조건만. 브라우저버전 미기재. 이번 새실측 아님. role count1.

- `CL-ASIDE-locator-count-02` **HISTORICAL**: 과거 visible filter count3 HISTORICAL. 근거 `A-HIST-FILTER` / docs/evidence/diagnostics-before-after.json#/aside/cases[id=filter-visible]; scripts/compare-aside.mjs filter-visible; docs/fixes-before-after.md Codex / Aside / 우리 툴 :: visible filter count3. 범위: 과거 원본 Aside CLI1.26.1028.2335 동일 /audit 단일 비교run의 기재조건만. 브라우저버전 미기재. 이번 새실측 아님. visible filter count3.

추가 확인할 조건:

- 0·다중·stale·중복제거·다른 Scope와 무조작은 미확인.
- 우리규범 추가 확인: 현재 Scope와 필터를 모두 적용한 개수를 반환하며0개도 정상이다.
- 우리규범 추가 확인: 중복 결과를1개로 축약하지 않으며 stale ref를 새 DOM0개와 혼동하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-LOCATOR-COUNT-001, PLAN-LOCATOR-COUNT-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-locator-textcontent

대상: **locator.textContent**. 관련 요구: REQ-LOCATOR-TEXTCONTENT-001, REQ-LOCATOR-TEXTCONTENT-002. 정본: [개별 요구](../internal/locator.textContent.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — locator.textContent
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await locator.textContent({timeoutMs:1000})
```

- `CL-CODEX-locator-textContent-01` **DOC**: raw textContent first matched, string|null 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:98-98; raw/public-contract-excerpts.md:154-154. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- 우리 0/다중strict와 문서 first/null 충돌; 긴값 출력 완전성 미확인
- REQ-LOCATOR-TEXTCONTENT-001: 전체 규범 충족은 미확인: 숨김 자식·실제 공백을 포함한 대상 textContent를 읽고 접근 이름으로 대체하지 않는다.
- REQ-LOCATOR-TEXTCONTENT-002: 전체 규범 충족은 미확인: 0/다중 매칭은 오류이며 긴 텍스트를 출력 예산으로 자를 때 원래 완전한 값인 것처럼 반환하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: 숨김 자식·실제 공백을 포함한 대상 textContent를 읽고 접근 이름으로 대체하지 않는다.
- 우리규범 추가 확인: 0/다중 매칭은 오류이며 긴 텍스트를 출력 예산으로 자를 때 원래 완전한 값인 것처럼 반환하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-LOCATOR-TEXTCONTENT-001, PLAN-LOCATOR-TEXTCONTENT-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-locator-getattribute

대상: **locator.getAttribute**. 관련 요구: REQ-LOCATOR-GETATTRIBUTE-001, REQ-LOCATOR-GETATTRIBUTE-002. 정본: [개별 요구](../internal/locator.getAttribute.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — locator.getAttribute
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await locator.getAttribute("href",{timeoutMs:1000})
```

- `CL-CODEX-locator-getAttribute-01` **DOC**: first matched attribute value, string|null 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:81-81; raw/public-contract-excerpts.md:155-155. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- 우리 다중strict와 first 설명 충돌; property와 attr·빈값/없음 미실측
- REQ-LOCATOR-GETATTRIBUTE-001: 전체 규범 충족은 미확인: 요청 속성 원문을 반환하고 긴 href를 snapshot 축약과 무관하게 읽을 수 있다.
- REQ-LOCATOR-GETATTRIBUTE-002: 전체 규범 충족은 미확인: 빈 속성과 없는 속성, property와 attribute를 구분하고0/다중 매칭은 실패한다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `direct` — Locator getAttribute(과거 하니스 호출)
- 공개 예제 상태: 과거실측문법 재사용·이번 미실행. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await page.locator("body").getAttribute("data-run")
```

- `CL-ASIDE-locator-getAttribute-01` **INFERENCE**: 과거 하니스 getAttribute(data-run) 문법과 서버판독 완료에서 호출 성공을 추론한다. 근거 `A-HIST-HARNESS` / scripts/compare-aside.mjs body data-run getAttribute call; docs/evidence/diagnostics-before-after.json#/aside/serverPassed,/aside/events. 범위: 자체 비교 하니스 코드와 요약결과의 연결 추론. 원본 API의 개별 반환/strict/null 동작을 확인한 DOC/HISTORICAL 분자에 넣지 않음..

추가 확인할 조건:

- getAttribute(data-run)는 과거 하니스 소스에 나타나며 전체 서버판독 완료에서 성공을 추론할 수 있으나 개별 반환/실패조건 원시 assertion은 없음. confirmed에서 제거함.
- 없음/빈값/relative href/property 차이·strict는 개별 원시 결과 미확인.
- 우리규범 추가 확인: 요청 속성 원문을 반환하고 긴 href를 snapshot 축약과 무관하게 읽을 수 있다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-LOCATOR-GETATTRIBUTE-001, PLAN-LOCATOR-GETATTRIBUTE-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-selection

대상: **selection**. 관련 요구: REQ-C-SELECTION-001, REQ-C-SELECTION-002, REQ-C-SELECTION-003, REQ-C-SELECTION-004, REQ-C-SELECTION-005, REQ-C-SELECTION-006. 정본: [개별 요구](../common/selection.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `composition` — locator/getBy*/filter/nth + count
- 공개 예제 상태: common mechanism; use specific API examples, not independently executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- `CL-CODEX-selection-01` **DOC**: TextMatcher=string|RegExp, exact 옵션과 filter/nth/count 서명. 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:123-123; raw/public-contract-excerpts.md:48-48; raw/public-contract-excerpts.md:132-132; raw/public-contract-excerpts.md:92-92; raw/public-contract-excerpts.md:73-73. 범위: 공개 선언/안내만; 실행 또는 전체조건 충족 주장 아님.

- `CL-CODEX-selection-02` **HISTORICAL**: {"regex": 1, "visibleFilter": 2, "nthMinusOne": 1, "slotClick": true} 근거 `HIST-CODEX-AUDIT` / raw/historical-diagnostics-before-after.json#/codex/regex; raw/historical-diagnostics-before-after.json#/codex/visibleFilter; raw/historical-diagnostics-before-after.json#/codex/nthMinusOne; raw/historical-diagnostics-before-after.json#/codex/slotClick. 범위: 과거 audit의 해당 필드만; 현재/모든 옵션/일반 환경으로 확대하지 않음.

추가 확인할 조건:

- 우리 refidentity·composed본문·mintext·case·g/y·불변·조합순서·0/N strict 미확인
- count/evaluateAll 및 아래 상태 대기의 명시 예외 외에 단일 대상 조회·조작은 0/다중 매칭을 구분해 거절한다. 자동 첫번째 선택은 없다. CSS 상태 대기는 waitFor의 0/1/N 표를 따른다. 발급 ref의 stale 오류는 부재 성공으로 흡수하지 않는다.
- Locator는 지연평가 불변 조합이다. filter와 nth의 호출 순서를 보존하며 이전 Locator를 바꾸지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `composition` — 최신 snapshot virtual ref→locator→관찰/조작; 우리 stable ref는 별도 정책
- 공개 예제 상태: 조합설계·이번 미실행. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- `CL-ASIDE-selection-01` **DOC**: 새 snapshot은 모든 이전 ref 무효화 DOC. 근거 `A-DOC-REPL` / .local/reference-loop-execution/aside/current-repl-guide.txt :: Snapshot ref invalidation bullet. 범위: 현재 공개 가이드 계약만; 실행검증 아님. 2026-11-01 Aside CLI1.26.1028.2335/skill3. Snapshot ref invalidation bullet.

- `CL-ASIDE-selection-02` **HISTORICAL**: 과거 regex role count1 HISTORICAL. 근거 `A-HIST-REGEX` / docs/evidence/diagnostics-before-after.json#/aside/cases[id=regex-role]; scripts/compare-aside.mjs regex-role :: regex count1. 범위: 과거 원본 Aside CLI1.26.1028.2335 동일 /audit 단일 비교run의 기재조건만. 브라우저버전 미기재. 이번 새실측 아님. regex count1.

- `CL-ASIDE-selection-03` **HISTORICAL**: 과거 visible filter count3 HISTORICAL. 근거 `A-HIST-FILTER` / docs/evidence/diagnostics-before-after.json#/aside/cases[id=filter-visible]; scripts/compare-aside.mjs filter-visible; docs/fixes-before-after.md Codex / Aside / 우리 툴 :: visible filter count3. 범위: 과거 원본 Aside CLI1.26.1028.2335 동일 /audit 단일 비교run의 기재조건만. 브라우저버전 미기재. 이번 새실측 아님. visible filter count3.

- `CL-ASIDE-selection-04` **HISTORICAL**: 과거 nth(-1) 호출 DOMException HISTORICAL. 근거 `A-HIST-NTH` / docs/evidence/diagnostics-before-after.json#/aside/cases[id=negative-nth]; scripts/compare-aside.mjs negative-nth :: nth(-1) DOMException. 범위: 과거 원본 Aside CLI1.26.1028.2335 동일 /audit 단일 비교run의 기재조건만. 브라우저버전 미기재. 이번 새실측 아님. nth(-1) DOMException.

- `CL-ASIDE-selection-05` **INFERENCE**: 조합 대응 판단: 최신 snapshot virtual ref→locator→관찰/조작; 우리 stable ref는 별도 정책 근거 `A-DOC-REPL` / .local/reference-loop-execution/aside/current-repl-guide.txt :: underlying public/historical mechanism. 범위: 조사자의 목적 대응 판단. 우리 API의 전체 조건 충족이나 경쟁 API의 동등성 확인이 아님. confirmedConditions 분자에 넣지 않음..

추가 확인할 조건:

- 우리규범 추가 확인: count/evaluateAll 및 아래 상태 대기의 명시 예외 외에 단일 대상 조회·조작은 0/다중 매칭을 구분해 거절한다. 자동 첫번째 선택은 없다. CSS 상태 대기는 waitFor의 0/1/N 표를 따른다. 발급 ref의 stale 오류는 부재 성공으로 흡수하지 않는다.
- 우리규범 추가 확인: Locator는 지연평가 불변 조합이다. filter와 nth의 호출 순서를 보존하며 이전 Locator를 바꾸지 않는다.
- 우리규범 추가 확인: 문자열 검색은 공백정규화 후 기본부분일치·exact전체일치, 대소문자 구분이다. RegExp source/flags를 보존하고 g/y도 후보마다 독립 평가한다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

우리 방식 유지: 같은 연결 요소의 ref는 문서 안에서 유지하고 교체 시 stale다. Aside의 snapshot마다 ref 무효화 정책과 의도적으로 다르다. strict/본문/조합은 사용자의 정확한 대상 제어 요구로 결정한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-C-SELECTION-001, PLAN-C-SELECTION-002, PLAN-C-SELECTION-003, PLAN-C-SELECTION-004, PLAN-C-SELECTION-005, PLAN-C-SELECTION-006. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## 별도 보충 표면 관측

IAB fixture 연결은 차단되었으며 CUA/Chrome-extension에서 기존 fixture의9개부분사례를 관찰했다. [보충 원자료](evidence/codex/raw/boundary1.json)와 [IAB 차단](evidence/codex/raw/boundary1-iab-blocked.json)을 구분한다. 인접/실제공백·긴본문 filter, label 조회, 0/N 조회 오류·readonly 거절 관측은 해당 어댑터/fixture 범위뿐이다. 부분확인으로서 주 IAB의 전체조건 근거 확인률은 올리지 않는다. 문서상 first-matched/null과 이Chrome실측의일부strict/timeout차이는 미해결표면차이로 보존한다.

## 우리 구현 선택의 확정 규칙

[공통 상세 정책](../common/selection.md#이름-계산-상세표)를 해당 정본과 함께 읽는다. 정책은 [2차 메인 판단](reviews/cycle-2/research-decisions.md)에서 이유와 대안을 기록했다. DOC/관측으로 확인된 경쟁방법과 우리 선택을 혼동하지 않는다.
