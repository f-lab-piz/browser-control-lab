# 참고 방식: input-state

다음 내용은 공개 사용 계약/관측과 우리 설계 판단이다. 내부 구현 알고리즘을 알아냈다는 뜻이 아니다. DOC·HISTORICAL·LIVE는 표시한 범위에만 적용하며 예제 문법 확인은 실제 실행과 다르다.

## ref-locator-inputvalue

대상: **locator.inputValue**. 관련 요구: REQ-LOCATOR-INPUTVALUE-001, REQ-LOCATOR-INPUTVALUE-002. 정본: [개별 요구](../internal/locator.inputValue.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `composition` — locator.evaluate read-only property
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await locator.evaluate(el => el.value)
```

- `CL-CODEX-locator-inputValue-01` **DOC**: read-only 단일 element evaluate(fn,arg?,options?) 공개 서명. 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:152-152. 범위: public declaration only; limits in unknownConditions.

- `CL-CODEX-locator-inputValue-02` **INFERENCE**: element.value 읽기 조합은 조사자 제안이며 제어요소/CE 타입정책·오류를 입증하지 않는다. 근거 `CODEX-RESEARCH-INFERENCE` / sources.md#ref1-정리-조합-추론의-범위. 범위: 조사자의 미실행 조합 제안; DOC/LIVE 확정분자 제외.

추가 확인할 조건:

- input/textarea/select/CE 통일값·타입오류 의미 미확인
- REQ-LOCATOR-INPUTVALUE-001: 전체 규범 충족은 미확인: 현재 편집 값을 읽고 HTML value 속성의 초기 값과 구분한다.
- REQ-LOCATOR-INPUTVALUE-002: 전체 규범 충족은 미확인: 비입력 요소에는 타입 오류를 내며 빈 입력을 실패나 일반 텍스트 값과 혼동하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: 현재 편집 값을 읽고 HTML value 속성의 초기 값과 구분한다.
- 우리규범 추가 확인: 비입력 요소에는 타입 오류를 내며 빈 입력을 실패나 일반 텍스트 값과 혼동하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-LOCATOR-INPUTVALUE-001, PLAN-LOCATOR-INPUTVALUE-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-locator-isvisible

대상: **locator.isVisible**. 관련 요구: REQ-LOCATOR-ISVISIBLE-001, REQ-LOCATOR-ISVISIBLE-002. 정본: [개별 요구](../internal/locator.isVisible.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — locator.isVisible
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await locator.isVisible()
```

- `CL-CODEX-locator-isVisible-01` **DOC**: first matched visible boolean 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:89-89; raw/public-contract-excerpts.md:157-157. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- 우리 strict와 first 설명 차이; offscreen/details/overlay 세부 미확인
- REQ-LOCATOR-ISVISIBLE-001: 전체 규범 충족은 미확인: layout상 숨김/닫힌 details/조상 숨김을 판정하며 offscreen은 visible일 수 있다.
- REQ-LOCATOR-ISVISIBLE-002: 전체 규범 충족은 미확인: 가려진 요소와 화면 밖 요소를 hidden으로 오인하지 않고0/다중 매칭은 공통 단일 조회 오류다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: layout상 숨김/닫힌 details/조상 숨김을 판정하며 offscreen은 visible일 수 있다.
- 우리규범 추가 확인: 가려진 요소와 화면 밖 요소를 hidden으로 오인하지 않고0/다중 매칭은 공통 단일 조회 오류다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-LOCATOR-ISVISIBLE-001, PLAN-LOCATOR-ISVISIBLE-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-locator-isenabled

대상: **locator.isEnabled**. 관련 요구: REQ-LOCATOR-ISENABLED-001, REQ-LOCATOR-ISENABLED-002. 정본: [개별 요구](../internal/locator.isEnabled.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — locator.isEnabled
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await locator.isEnabled()
```

- `CL-CODEX-locator-isEnabled-01` **DOC**: first matched enabled boolean 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:88-88; raw/public-contract-excerpts.md:156-156. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- fieldset legend/ARIA 상속·readonly 차이 미확인
- REQ-LOCATOR-ISENABLED-001: 전체 규범 충족은 미확인: native disabled/disabled fieldset 및 aria-disabled 정책에 따라 상태를 반환한다.
- REQ-LOCATOR-ISENABLED-002: 전체 규범 충족은 미확인: readonly는 disabled와 구분하고 disabled 조상·예외 legend 조건을 검증한다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: native disabled/disabled fieldset 및 aria-disabled 정책에 따라 상태를 반환한다.
- 우리규범 추가 확인: readonly는 disabled와 구분하고 disabled 조상·예외 legend 조건을 검증한다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-LOCATOR-ISENABLED-001, PLAN-LOCATOR-ISENABLED-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-locator-iseditable

대상: **locator.isEditable**. 관련 요구: REQ-LOCATOR-ISEDITABLE-001, REQ-LOCATOR-ISEDITABLE-002. 정본: [개별 요구](../internal/locator.isEditable.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `composition` — locator.evaluate read-only state
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await locator.evaluate(el => ({tag:el.tagName,disabled:el.disabled,readOnly:el.readOnly,isContentEditable:el.isContentEditable}))
```

- `CL-CODEX-locator-isEditable-01` **DOC**: read-only 단일 element evaluate(fn,arg?,options?) 공개 서명. 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:152-152. 범위: public declaration only; limits in unknownConditions.

- `CL-CODEX-locator-isEditable-02` **INFERENCE**: 공개 evaluate에 DOM 상태를 읽는 함수를 전달하는 조합을 제안한다. editable 공통정책은 자체 판단이며 미실행이다. 근거 `CODEX-RESEARCH-INFERENCE` / sources.md#ref1-정리-조합-추론의-범위. 범위: 조사자의 미실행 조합 제안; DOC/LIVE 확정분자 제외.

추가 확인할 조건:

- aria-readonly·상속·허용type·fill 일관성 미확인
- REQ-LOCATOR-ISEDITABLE-001: 전체 규범 충족은 미확인: 지원 텍스트 입력/textarea/contenteditable 중 enabled이며 readonly가 아닌 대상만true다.
- REQ-LOCATOR-ISEDITABLE-002: 전체 규범 충족은 미확인: button·checkbox·disabled input·aria-readonly 대상은false며 fill 가능성과 모순되지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: 지원 텍스트 입력/textarea/contenteditable 중 enabled이며 readonly가 아닌 대상만true다.
- 우리규범 추가 확인: button·checkbox·disabled input·aria-readonly 대상은false며 fill 가능성과 모순되지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-LOCATOR-ISEDITABLE-001, PLAN-LOCATOR-ISEDITABLE-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-locator-ischecked

대상: **locator.isChecked**. 관련 요구: REQ-LOCATOR-ISCHECKED-001, REQ-LOCATOR-ISCHECKED-002. 정본: [개별 요구](../internal/locator.isChecked.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `composition` — locator.evaluate + getAttribute
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await locator.evaluate(el => ({checked:el.checked,aria:el.getAttribute("aria-checked")}))
```

- `CL-CODEX-locator-isChecked-01` **DOC**: read-only 단일 element evaluate와 getAttribute 공개 서명. 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:152-152; raw/public-contract-excerpts.md:81-81. 범위: public declaration only; limits in unknownConditions.

- `CL-CODEX-locator-isChecked-02` **INFERENCE**: native property/ARIA attribute를 읽어 체크상태를 판정하는 조합을 제안한다. mixed/타입정책은 미확인이다. 근거 `CODEX-RESEARCH-INFERENCE` / sources.md#ref1-정리-조합-추론의-범위. 범위: 조사자의 미실행 조합 제안; DOC/LIVE 확정분자 제외.

추가 확인할 조건:

- mixed boolean 정책·지원role·타입오류 미확인
- REQ-LOCATOR-ISCHECKED-001: 전체 규범 충족은 미확인: checked 상태를 native property 또는 명시 ARIA 상태로 읽는다.
- REQ-LOCATOR-ISCHECKED-002: 전체 규범 충족은 미확인: 비체크형 요소는 타입 오류로 거절하고 mixed를true로 오인하지 않는다. mixed 원문은 getAttribute로 조회한다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: checked 상태를 native property 또는 명시 ARIA 상태로 읽는다.
- 우리규범 추가 확인: 비체크형 요소는 타입 오류로 거절하고 mixed를true로 오인하지 않는다. mixed 원문은 getAttribute로 조회한다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-LOCATOR-ISCHECKED-001, PLAN-LOCATOR-ISCHECKED-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-locator-click

대상: **locator.click**. 관련 요구: REQ-LOCATOR-CLICK-001, REQ-LOCATOR-CLICK-002. 정본: [개별 요구](../internal/locator.click.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — locator.click / dblclick
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await locator.click({button:"left",timeoutMs:1000})
```

- `CL-CODEX-locator-click-01` **DOC**: click/dblclick은 LocatorClickOptions(button/force/modifiers/timeoutMs)를 받아 Promise<void>를 반환하는 선언이다. 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:72-72; raw/public-contract-excerpts.md:74-74; raw/public-contract-excerpts.md:128-128. 범위: public declaration only; limits in unknownConditions.

- `CL-CODEX-locator-click-02` **HISTORICAL**: {"slotClick": true, "scaledFrameClick": true} 근거 `HIST-CODEX-AUDIT` / raw/historical-diagnostics-before-after.json#/codex/slotClick; raw/historical-diagnostics-before-after.json#/codex/scaledFrameClick. 범위: 2026-11-01 이전 audit 기록의 해당 값만; 현재 재실행/모든 옵션 지원 아님; 빌드/상세 호출 trace 미보존.

추가 확인할 조건:

- clickCount옵션 없음; overlay/actionability/partial cleanup 모두 미확인
- REQ-LOCATOR-CLICK-001: 전체 규범 충족은 미확인: visible/enabled/안정·가림 검사 후 정확히 대상에 클릭하며 clickCount2로 더블클릭 조합 가능하다.
- REQ-LOCATOR-CLICK-002: 전체 규범 충족은 미확인: 중복·stale·overlay는 입력 전에 거절하고 닫힌 details·slot·scaled iframe에서 잘못된 다른 요소를 클릭하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `direct` — Locator click
- 공개 예제 상태: 미실행예제(공개문법). 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await page.locator("button.export").click()
```

- `CL-ASIDE-locator-click-01` **DOC**: click이 interactivity/DOM stability를 기다리고 필요시 scroll한다는 DOC. 근거 `A-DOC-REPL` / .local/reference-loop-execution/aside/current-repl-guide.txt :: Navigation and Actions: click interactivity/stability wait and needed scroll. 범위: 현재 공개 가이드 계약만; 실행검증 아님. 2026-11-01 Aside CLI1.26.1028.2335/skill3. Navigation and Actions: click interactivity/stability wait and needed scroll.

- `CL-ASIDE-locator-click-02` **HISTORICAL**: 과거 slot 이름 role 검색 오류 HISTORICAL. 근거 `A-HIST-SLOT` / docs/evidence/diagnostics-before-after.json#/aside/cases[id=slot-name]; scripts/compare-aside.mjs slot-name :: role lookup error before intended slot click. 범위: 과거 원본 Aside CLI1.26.1028.2335 동일 /audit 단일 비교run의 기재조건만. 브라우저버전 미기재. 이번 새실측 아님. role lookup error before intended slot click.

- `CL-ASIDE-locator-click-03` **HISTORICAL**: 과거 scale frame 호출 뒤 업무 이름변경0·서버PASS없음 HISTORICAL. 근거 `A-HIST-FRAME` / docs/evidence/diagnostics-before-after.json#/aside/cases[id=scaled-frame-click]; scripts/compare-aside.mjs scaled-frame-click; docs/fixes-before-after.md Codex / Aside / 우리 툴 :: name-change count0/server success absent. 범위: 과거 원본 Aside CLI1.26.1028.2335 동일 /audit 단일 비교run의 기재조건만. 브라우저버전 미기재. 이번 새실측 아님. name-change count0/server success absent.

추가 확인할 조건:

- button/clickCount 옵션·overlay·엄격매칭·소유키·중복효과·실제 입력trace는 미확인.
- 우리규범 추가 확인: visible/enabled/안정·가림 검사 후 정확히 대상에 클릭하며 clickCount2로 더블클릭 조합 가능하다.
- 우리규범 추가 확인: 중복·stale·overlay는 입력 전에 거절하고 닫힌 details·slot·scaled iframe에서 잘못된 다른 요소를 클릭하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-LOCATOR-CLICK-001, PLAN-LOCATOR-CLICK-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-locator-fill

대상: **locator.fill**. 관련 요구: REQ-LOCATOR-FILL-001, REQ-LOCATOR-FILL-002. 정본: [개별 요구](../internal/locator.fill.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — locator.fill
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await locator.fill("",{timeoutMs:1000})
```

- `CL-CODEX-locator-fill-01` **DOC**: fill(value:string,{timeoutMs?}):Promise<void>를 선언한다. 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:78-78. 범위: public declaration only; limits in unknownConditions.

- `CL-CODEX-locator-fill-02` **HISTORICAL**: {"readonly": "rejected"} 근거 `HIST-CODEX-AUDIT` / raw/historical-diagnostics-before-after.json#/codex/readonly. 범위: 2026-11-01 이전 audit 기록의 해당 값만; 현재 재실행/모든 옵션 지원 아님; 빌드/상세 호출 trace 미보존.

추가 확인할 조건:

- mask/rerender 결과 재검증·CE·empty·disabled 전체 미확인
- REQ-LOCATOR-FILL-001: 전체 규범 충족은 미확인: readonly/disabled/비편집 대상을 사전 거절하고 빈 문자열도 채울 수 있다.
- REQ-LOCATOR-FILL-002: 전체 규범 충족은 미확인: 입력 masking이나 rerender로 실제 값이 요청과 다르면 INPUT_VALUE_NOT_CHANGED며 거짓 성공을 주지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `direct` — Locator fill(과거 호출)
- 공개 예제 상태: 과거실측문법 재사용·이번 미실행. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await page.getByLabel("고정 문서번호", {exact:true}).fill("BROKEN", {timeout:500})
```

- `CL-ASIDE-locator-fill-01` **HISTORICAL**: 과거 readonly 사례 rejected HISTORICAL; 집계는 상세 오류 원인을 생략. 근거 `A-HIST-READONLY` / docs/evidence/diagnostics-before-after.json#/aside/cases[id=readonly-fill]; scripts/compare-aside.mjs readonly-fill :: getByLabel→fill catch returns rejected; error cause not preserved. 범위: 과거 원본 Aside CLI1.26.1028.2335 동일 /audit 단일 비교run의 기재조건만. 브라우저버전 미기재. 이번 새실측 아님. getByLabel→fill catch returns rejected; error cause not preserved.

추가 확인할 조건:

- 정상·빈값·contenteditable·타입·사후값검증/입력이벤트0 보장은 미확인.
- 우리규범 추가 확인: readonly/disabled/비편집 대상을 사전 거절하고 빈 문자열도 채울 수 있다.
- 우리규범 추가 확인: 입력 masking이나 rerender로 실제 값이 요청과 다르면 INPUT_VALUE_NOT_CHANGED며 거짓 성공을 주지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-LOCATOR-FILL-001, PLAN-LOCATOR-FILL-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-locator-press

대상: **locator.press**. 관련 요구: REQ-LOCATOR-PRESS-001, REQ-LOCATOR-PRESS-002. 정본: [개별 요구](../internal/locator.press.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — locator.press
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await locator.press("Enter",{timeoutMs:1000})
```

- `CL-CODEX-locator-press-01` **DOC**: locator focus후 key press 공개 근거 `CUA-DOC-API` / raw/cua-entry-excerpts.md:139-139. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- focus 검증·실패전무입력·기존modifier 보존 미확인
- REQ-LOCATOR-PRESS-001: 전체 규범 충족은 미확인: 정확한 대상에 focus를 확인하고 키를 입력해 현재 다른 focus에 보내지 않는다.
- REQ-LOCATOR-PRESS-002: 전체 규범 충족은 미확인: focus 불가·stale·비활성 대상은 다른 요소 입력 없이 실패한다. 키 입력 단계는 keyboard.press와 같은 modifier 소유 정책을 따르며, focus 이전 실패는 기존 명시 down 상태를 임의 해제하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: 정확한 대상에 focus를 확인하고 키를 입력해 현재 다른 focus에 보내지 않는다.
- 우리규범 추가 확인: focus 불가·stale·비활성 대상은 다른 요소 입력 없이 실패한다. 키 입력 단계는 keyboard.press와 같은 modifier 소유 정책을 따르며, focus 이전 실패는 기존 명시 down 상태를 임의 해제하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-LOCATOR-PRESS-001, PLAN-LOCATOR-PRESS-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-locator-hover

대상: **locator.hover**. 관련 요구: REQ-LOCATOR-HOVER-001, REQ-LOCATOR-HOVER-002. 정본: [개별 요구](../internal/locator.hover.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `unknown` — None
- 공개 예제 상태: not-available. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- `CL-CODEX-locator-hover-01` **DOC**: native Target에는 coordinate actions가 있으나 DOM-only 입력은 throw 근거 `CUA-DOC-ENTRY` / raw/cua-entry-excerpts.md:21-31; raw/cua-entry-excerpts.md:54-54. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- IAB locator hover 없음; DOM event dispatch 우회는 read-only 평가로 금지
- REQ-LOCATOR-HOVER-001: 전체 규범 충족은 미확인: 대상의 실제 hit 영역에 포인터를 이동한다.
- REQ-LOCATOR-HOVER-002: 전체 규범 충족은 미확인: 가림/숨김/unsupported frame이면 명시 실패하고 hover 성공으로 표시하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: 대상의 실제 hit 영역에 포인터를 이동한다.
- 우리규범 추가 확인: 가림/숨김/unsupported frame이면 명시 실패하고 hover 성공으로 표시하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-LOCATOR-HOVER-001, PLAN-LOCATOR-HOVER-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-locator-focus

대상: **locator.focus**. 관련 요구: REQ-LOCATOR-FOCUS-001, REQ-LOCATOR-FOCUS-002. 정본: [개별 요구](../internal/locator.focus.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `unknown` — None
- 공개 예제 상태: not-available. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- `CL-CODEX-locator-focus-01` **DOC**: locator.press는 대상이 focus된 상태에서 키를 누른다는 공개 설명이다. focus-only 동등성은 미확인이다. 근거 `CUA-DOC-API` / raw/cua-entry-excerpts.md:139-139. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- press로 focus만 대체하면 키 부작용; evaluate focus는 read-only 위반
- REQ-LOCATOR-FOCUS-001: 전체 규범 충족은 미확인: 대상의 focus 또는 composed activeElement를 확인하고 반환한다.
- REQ-LOCATOR-FOCUS-002: 전체 규범 충족은 미확인: 비focusable/disabled/분리 대상은 실패하며 el.focus 호출만으로 성공 처리하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: 대상의 focus 또는 composed activeElement를 확인하고 반환한다.
- 우리규범 추가 확인: 비focusable/disabled/분리 대상은 실패하며 el.focus 호출만으로 성공 처리하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-LOCATOR-FOCUS-001, PLAN-LOCATOR-FOCUS-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-locator-scrollintoview

대상: **locator.scrollIntoView**. 관련 요구: REQ-LOCATOR-SCROLLINTOVIEW-001, REQ-LOCATOR-SCROLLINTOVIEW-002. 정본: [개별 요구](../internal/locator.scrollIntoView.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `unknown` — None
- 공개 예제 상태: not-available. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- `CL-CODEX-locator-scrollIntoView-01` **DOC**: native Target.scroll 서명과 DOM-only tab의 native 입력 wrapper가 입력 전에 throw한다는 공개 설명. 근거 `CUA-DOC-ENTRY` / raw/cua-entry-excerpts.md:27-27; raw/cua-entry-excerpts.md:54-54. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- click의 자동스크롤을 단독노출 API와 동등 취급 불가
- REQ-LOCATOR-SCROLLINTOVIEW-001: 전체 규범 충족은 미확인: 연결된 offscreen 요소를 필요한 조상 scrollport에서 가로·세로로 노출한다.
- REQ-LOCATOR-SCROLLINTOVIEW-002: 전체 규범 충족은 미확인: DOM에 없는 virtual row는 자동 생성하지 않으며 sticky overlay 등으로 클릭 가능까지 보장하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: 연결된 offscreen 요소를 필요한 조상 scrollport에서 가로·세로로 노출한다.
- 우리규범 추가 확인: DOM에 없는 virtual row는 자동 생성하지 않으며 sticky overlay 등으로 클릭 가능까지 보장하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-LOCATOR-SCROLLINTOVIEW-001, PLAN-LOCATOR-SCROLLINTOVIEW-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-locator-setchecked

대상: **locator.setChecked**. 관련 요구: REQ-LOCATOR-SETCHECKED-001, REQ-LOCATOR-SETCHECKED-002. 정본: [개별 요구](../internal/locator.setChecked.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — locator.setChecked
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await locator.setChecked(true,{timeoutMs:1000})
```

- `CL-CODEX-locator-setChecked-01` **DOC**: boolean, force/timeoutMs, check/uncheck도 공개 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:97-97; raw/public-contract-excerpts.md:71-71; raw/public-contract-excerpts.md:100-100; raw/public-contract-excerpts.md:127-127. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- 이미상태일때 클릭0·되돌림실패·ARIA role범위 미확인
- REQ-LOCATOR-SETCHECKED-001: 전체 규범 충족은 미확인: 이미 요청 상태면 클릭하지 않고 checkbox/radio/switch 지원대상 상태를 확인한다.
- REQ-LOCATOR-SETCHECKED-002: 전체 규범 충족은 미확인: disabled·비체크형은 거절하고 핸들러가 상태를 되돌리면 CHECK_STATE_NOT_CHANGED로 실패한다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: 이미 요청 상태면 클릭하지 않고 checkbox/radio/switch 지원대상 상태를 확인한다.
- 우리규범 추가 확인: disabled·비체크형은 거절하고 핸들러가 상태를 되돌리면 CHECK_STATE_NOT_CHANGED로 실패한다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-LOCATOR-SETCHECKED-001, PLAN-LOCATOR-SETCHECKED-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-locator-selectoption

대상: **locator.selectOption**. 관련 요구: REQ-LOCATOR-SELECTOPTION-001, REQ-LOCATOR-SELECTOPTION-002. 정본: [개별 요구](../internal/locator.selectOption.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `direct` — locator.selectOption
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await locator.selectOption([{value:"A"}],{timeoutMs:1000})
```

- `CL-CODEX-locator-selectOption-01` **DOC**: string/descriptor/array, descriptor index/label/value; 반환void 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:96-96; raw/public-contract-excerpts.md:135-135; raw/public-contract-excerpts.md:144-144. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- 우리 string[] 결과/value우선label fallback/사전전체검증 미확인
- REQ-LOCATOR-SELECTOPTION-001: 전체 규범 충족은 미확인: native select만 지원하고 요청된 모든 옵션이 존재·enabled인 경우 선택 결과를 확인한다.
- REQ-LOCATOR-SELECTOPTION-002: 전체 규범 충족은 미확인: 없는/중복 label·disabled option·single select 복수 요청은 사전 거절해 기존 선택을 지우지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: native select만 지원하고 요청된 모든 옵션이 존재·enabled인 경우 선택 결과를 확인한다.
- 우리규범 추가 확인: 없는/중복 label·disabled option·single select 복수 요청은 사전 거절해 기존 선택을 지우지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-LOCATOR-SELECTOPTION-001, PLAN-LOCATOR-SELECTOPTION-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-locator-dragto

대상: **locator.dragTo**. 관련 요구: REQ-LOCATOR-DRAGTO-001, REQ-LOCATOR-DRAGTO-002. 정본: [개별 요구](../internal/locator.dragTo.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `unknown` — None
- 공개 예제 상태: not-available. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- `CL-CODEX-locator-dragTo-01` **DOC**: native Target.drag(from,to) 서명과 DOM-only tab의 native 입력 wrapper가 입력 전에 throw한다는 공개 설명. 근거 `CUA-DOC-ENTRY` / raw/cua-entry-excerpts.md:26-26; raw/cua-entry-excerpts.md:54-54. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- IAB locator dragTo/native DragData 미확인; 과거 Codex DnD 미측정
- REQ-LOCATOR-DRAGTO-001: 전체 규범 충족은 미확인: draggable은 실제 dragstart/native DragData, 격자는 연속 pointer 경로로 조작한다.
- REQ-LOCATOR-DRAGTO-002: 전체 규범 충족은 미확인: Locator.dragTo v1은 같은 Page·같은 frame document·같은 CDP 입력 target 안에서만 지원한다. 다른 Page/다른 frame document는 전송 전 거절하며 다른 CDP target은 CROSS_TARGET_DRAG_UNSUPPORTED다. 동일 process의 다른 frame도 이번에는 CROSS_DOCUMENT_DRAG_UNSUPPORTED다. 모호/stale 대상은 사전 거절하며 중도 오류는 해당 연산이 획득한 버튼/drag 상태만 정리하고 drop을 자동 재전송하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `direct` — Locator dragTo(과거 호출)
- 공개 예제 상태: 과거실측문법 재사용·이번 미실행. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await page.locator("#drag-source").dragTo(page.locator("#drag-target"))
```

- `CL-ASIDE-locator-dragTo-01` **HISTORICAL**: 과거 audit에서 drag 서버PASS; 단일 호출에서 accepted 이벤트2개 HISTORICAL. 근거 `A-HIST-DRAG` / docs/evidence/diagnostics-before-after.json#/aside/cases[id=html-drag],/aside/serverPassed/drag,/aside/events; scripts/compare-aside.mjs html-drag :: drag PASS and two accepted events in one invocation. 범위: 과거 원본 Aside CLI1.26.1028.2335 동일 /audit 단일 비교run의 기재조건만. 브라우저버전 미기재. 이번 새실측 아님. drag PASS and two accepted events in one invocation.

추가 확인할 조건:

- trusted/native DragData·pointer 격자·cross document/target·중도cleanup·정확1회 보장은 미확인.
- 우리규범 추가 확인: draggable은 실제 dragstart/native DragData, 격자는 연속 pointer 경로로 조작한다.
- 우리규범 추가 확인: Locator.dragTo v1은 같은 Page·같은 frame document·같은 CDP 입력 target 안에서만 지원한다. 다른 Page/다른 frame document는 전송 전 거절하며 다른 CDP target은 CROSS_TARGET_DRAG_UNSUPPORTED다. 동일 process의 다른 frame도 이번에는 CROSS_DOCUMENT_DRAG_UNSUPPORTED다. 모호/stale 대상은 사전 거절하며 중도 오류는 해당 연산이 획득한 버튼/drag 상태만 정리하고 drop을 자동 재전송하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-LOCATOR-DRAGTO-001, PLAN-LOCATOR-DRAGTO-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-mouse-move

대상: **mouse.move**. 관련 요구: REQ-MOUSE-MOVE-001, REQ-MOUSE-MOVE-002. 정본: [개별 요구](../internal/mouse.move.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `unknown` — None
- 공개 예제 상태: not-available. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- `CL-CODEX-mouse-move-01` **DOC**: native Target.drag/scroll은 존재, move primitive는 열거안됨 근거 `CUA-DOC-ENTRY` / raw/cua-entry-excerpts.md:21-31. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- IAB page.mouse 없음; native좌표입력/DOM-only 경계를 넘기지 않음
- REQ-MOUSE-MOVE-001: 전체 규범 충족은 미확인: 정확한 좌표로 이동하며 iframe 좌표를 사용자가중복 변환하지 않는다.
- REQ-MOUSE-MOVE-002: 전체 규범 충족은 미확인: NaN/Infinity 등 잘못된 좌표는 이벤트 없이 거절하며 이 API에는 locator 엄격 매칭을 요구하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: 정확한 좌표로 이동하며 iframe 좌표를 사용자가중복 변환하지 않는다.
- 우리규범 추가 확인: NaN/Infinity 등 잘못된 좌표는 이벤트 없이 거절하며 이 API에는 locator 엄격 매칭을 요구하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-MOUSE-MOVE-001, PLAN-MOUSE-MOVE-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-mouse-down

대상: **mouse.down**. 관련 요구: REQ-MOUSE-DOWN-001, REQ-MOUSE-DOWN-002. 정본: [개별 요구](../internal/mouse.down.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `unknown` — None
- 공개 예제 상태: not-available. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- `CL-CODEX-mouse-down-01` **DOC**: Target 공개 발췌는 click/drag/scroll을 열거한다. down 지속상태·atomicity·cleanup은 미확인이다. 근거 `CUA-DOC-ENTRY` / raw/cua-entry-excerpts.md:21-31. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- down→move→up 지속상태 조합 미확인
- REQ-MOUSE-DOWN-001: 전체 규범 충족은 미확인: 누른 버튼상태가 다음 move/up에 이어져 격자 범위 선택을 구성할 수 있다.
- REQ-MOUSE-DOWN-002: 전체 규범 충족은 미확인: 지원 안하는 버튼·상태 충돌은 오류이며 다른 세션의 버튼 상태를 바꾸지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: 누른 버튼상태가 다음 move/up에 이어져 격자 범위 선택을 구성할 수 있다.
- 우리규범 추가 확인: 지원 안하는 버튼·상태 충돌은 오류이며 다른 세션의 버튼 상태를 바꾸지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-MOUSE-DOWN-001, PLAN-MOUSE-DOWN-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-mouse-up

대상: **mouse.up**. 관련 요구: REQ-MOUSE-UP-001, REQ-MOUSE-UP-002. 정본: [개별 요구](../internal/mouse.up.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `unknown` — None
- 공개 예제 상태: not-available. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- `CL-CODEX-mouse-up-01` **DOC**: 열람한 공개 인터페이스 발췌에는 개별 up 메서드가 열거되지 않았다. 제품 전체 실제지원은 미확인이다. 근거 `CUA-DOC-ENTRY` / raw/cua-entry-excerpts.md:21-31. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- release/reset/close 실제상태 확인 불가
- REQ-MOUSE-UP-001: 전체 규범 충족은 미확인: 대응 down을 해제해 드래그를 끝내고 반복 up은 새 클릭을 만들지 않는다.
- REQ-MOUSE-UP-002: 전체 규범 충족은 미확인: 탭 close/reset 뒤 정리된 상태와 충돌하면 명시 처리하고 버튼이 눌린 채 잔류하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: 대응 down을 해제해 드래그를 끝내고 반복 up은 새 클릭을 만들지 않는다.
- 우리규범 추가 확인: 탭 close/reset 뒤 정리된 상태와 충돌하면 명시 처리하고 버튼이 눌린 채 잔류하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-MOUSE-UP-001, PLAN-MOUSE-UP-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-mouse-click

대상: **mouse.click**. 관련 요구: REQ-MOUSE-CLICK-001, REQ-MOUSE-CLICK-002. 정본: [개별 요구](../internal/mouse.click.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `unknown` — Target.click (native only)
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await nativeTab.click([100,100],{mouseButton:"left",clickCount:1})
```

- `CL-CODEX-mouse-click-01` **DOC**: native click(Vec2/options) 계약; DOM-only tabs에서는 입력전 throw 근거 `CUA-DOC-ENTRY` / raw/cua-entry-excerpts.md:25-25; raw/cua-entry-excerpts.md:11-16; raw/cua-entry-excerpts.md:54-54. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- IAB native 사용가능성을 미실측; down/up/실패release 경계 미확인
- REQ-MOUSE-CLICK-001: 전체 규범 충족은 미확인: 좌표에서 down/up을 수행하며 해당 위치 UI를 바꾸는 낮은수준 도구임을 명시한다.
- REQ-MOUSE-CLICK-002: 전체 규범 충족은 미확인: 오류 중간에도 버튼 release를 시도하고 임의 다른 좌표로 보정하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: 좌표에서 down/up을 수행하며 해당 위치 UI를 바꾸는 낮은수준 도구임을 명시한다.
- 우리규범 추가 확인: 오류 중간에도 버튼 release를 시도하고 임의 다른 좌표로 보정하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-MOUSE-CLICK-001, PLAN-MOUSE-CLICK-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-mouse-wheel

대상: **mouse.wheel**. 관련 요구: REQ-MOUSE-WHEEL-001, REQ-MOUSE-WHEEL-002. 정본: [개별 요구](../internal/mouse.wheel.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `unknown` — Target.scroll (native only)
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await nativeTab.scroll([100,100],"down",1)
```

- `CL-CODEX-mouse-wheel-01` **DOC**: native scroll target/direction/pages 계약, raw deltaX/Y 아님 근거 `CUA-DOC-ENTRY` / raw/cua-entry-excerpts.md:27-27; raw/cua-entry-excerpts.md:18-18. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- DOM-only throw; axis deltas·pointer별 routing 미확인
- REQ-MOUSE-WHEEL-001: 전체 규범 충족은 미확인: pointer를 iframe/내부목록에 move한 뒤 해당 위치에 가로·세로 wheel을 전달한다.
- REQ-MOUSE-WHEEL-002: 전체 규범 충족은 미확인: scroll 끝·preventDefault에서는 이동이0일 수 있고 이를 더 많은 데이터 로딩 성공으로 주장하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: pointer를 iframe/내부목록에 move한 뒤 해당 위치에 가로·세로 wheel을 전달한다.
- 우리규범 추가 확인: scroll 끝·preventDefault에서는 이동이0일 수 있고 이를 더 많은 데이터 로딩 성공으로 주장하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-MOUSE-WHEEL-001, PLAN-MOUSE-WHEEL-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-keyboard-down

대상: **keyboard.down**. 관련 요구: REQ-KEYBOARD-DOWN-001, REQ-KEYBOARD-DOWN-002. 정본: [개별 요구](../internal/keyboard.down.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `unknown` — None
- 공개 예제 상태: not-available. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- `CL-CODEX-keyboard-down-01` **DOC**: Tab.pressKey와 locator.press 공개 서명이다. 개별 down/지속 modifier는 미확인이다. 근거 `CUA-DOC-ENTRY` / raw/cua-entry-excerpts.md:57-57; raw/public-contract-excerpts.md:94-94. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- 지속modifier/세션소유를 조합할 근거 없음
- REQ-KEYBOARD-DOWN-001: 전체 규범 충족은 미확인: 키·modifier 상태가 후속 press/type/up에 일관되게 이어진다.
- REQ-KEYBOARD-DOWN-002: 전체 규범 충족은 미확인: 알 수없는 key는 입력 전 실패하며 세션간 modifier가 공유되지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: 키·modifier 상태가 후속 press/type/up에 일관되게 이어진다.
- 우리규범 추가 확인: 알 수없는 key는 입력 전 실패하며 세션간 modifier가 공유되지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-KEYBOARD-DOWN-001, PLAN-KEYBOARD-DOWN-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-keyboard-up

대상: **keyboard.up**. 관련 요구: REQ-KEYBOARD-UP-001, REQ-KEYBOARD-UP-002. 정본: [개별 요구](../internal/keyboard.up.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `unknown` — None
- 공개 예제 상태: not-available. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- `CL-CODEX-keyboard-up-01` **DOC**: 열람한 공개 인터페이스 발췌에는 개별 up 메서드가 열거되지 않았다. 제품 전체 실제지원은 미확인이다. 근거 `CUA-DOC-ENTRY` / raw/cua-entry-excerpts.md:55-66; raw/public-contract-excerpts.md:67-113. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- 원하는키만 release·실패 후 실제잔류 미확인
- REQ-KEYBOARD-UP-001: 전체 규범 충족은 미확인: 해당 키를 해제하며 다른 modifier를 임의로 해제하지 않는다.
- REQ-KEYBOARD-UP-002: 전체 규범 충족은 미확인: close/reset/실패 뒤 release 실패를 숨기지 않고 다음 요청에 눌림 상태를 유출하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: 해당 키를 해제하며 다른 modifier를 임의로 해제하지 않는다.
- 우리규범 추가 확인: close/reset/실패 뒤 release 실패를 숨기지 않고 다음 요청에 눌림 상태를 유출하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-KEYBOARD-UP-001, PLAN-KEYBOARD-UP-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-keyboard-press

대상: **keyboard.press**. 관련 요구: REQ-KEYBOARD-PRESS-001, REQ-KEYBOARD-PRESS-002. 정본: [개별 요구](../internal/keyboard.press.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `composition` — locator.press / Target.pressKey
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await focusedLocator.press("Control+A",{timeoutMs:1000})
```

- `CL-CODEX-keyboard-press-01` **DOC**: locator.press는 focus대상 지정; native tab.pressKey는 DOM-only throw 근거 `CUA-DOC-ENTRY` / raw/cua-entry-excerpts.md:57-57; raw/cua-entry-excerpts.md:54-54; raw/cua-entry-excerpts.md:139-139. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- 현재 focus 유지키와 독립modifier 소유는 미확인
- REQ-KEYBOARD-PRESS-001: 전체 규범 충족은 미확인: press는 호출 전 이미 유지되던 modifier를 보존한다. 자신이 새로 누른 modifier/주키만 정해진 순서로 해제하며 중도 오류에도 같은 정리를 시도한다. 명시 down의 소유 상태는 대응 up 또는 reset/close가 끝낸다.
- REQ-KEYBOARD-PRESS-002: 전체 규범 충족은 미확인: 알 수없는 조합은 사전 오류며 중간 실패 시 modifier 정리 결과를 표시한다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: press는 호출 전 이미 유지되던 modifier를 보존한다. 자신이 새로 누른 modifier/주키만 정해진 순서로 해제하며 중도 오류에도 같은 정리를 시도한다. 명시 down의 소유 상태는 대응 up 또는 reset/close가 끝낸다.
- 우리규범 추가 확인: 알 수없는 조합은 사전 오류며 중간 실패 시 modifier 정리 결과를 표시한다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-KEYBOARD-PRESS-001, PLAN-KEYBOARD-PRESS-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-keyboard-type

대상: **keyboard.type**. 관련 요구: REQ-KEYBOARD-TYPE-001, REQ-KEYBOARD-TYPE-002. 정본: [개별 요구](../internal/keyboard.type.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `composition` — locator.type / pressSequentially
- 공개 예제 상태: syntax-confirmed-not-executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

```text
await focusedLocator.type("한글🙂\n",{timeoutMs:1000})
```

- `CL-CODEX-keyboard-type-01` **DOC**: 기존내용을 지우지않는 type, pressSequentially 문자별 입력 공개 근거 `CUA-DOC-API` / raw/cua-entry-excerpts.md:141-141; raw/cua-entry-excerpts.md:140-140. 범위: public declaration only; limits in unknownConditions.

추가 확인할 조건:

- 현재focus primitive와 차이, CE/newline/Unicode/failedfocus 미확인
- REQ-KEYBOARD-TYPE-001: 전체 규범 충족은 미확인: 기존 선택 위치에 Unicode·여러 줄을 제어 타입 규칙대로 삽입하며 fill과 구분한다.
- REQ-KEYBOARD-TYPE-002: 전체 규범 충족은 미확인: 이모지·한글을 손상하지 않고 입력불가 focus에서 값 변경을 보장했다고 반환하지 않는다. keydown별발생은보장하지않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `unknown` — 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 공개 예제 상태: 예제 없음·API 발명 금지. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- 확인된 개별 동작 근거 없음. API 미지원이라는 의미가 아니다.

추가 확인할 조건:

- Playwright-compatible/Playwright API available라는 총괄 문구는 개별 API·옵션·반환형의 증거가 아님.
- 우리규범 추가 확인: 기존 선택 위치에 Unicode·여러 줄을 제어 타입 규칙대로 삽입하며 fill과 구분한다.
- 우리규범 추가 확인: 이모지·한글을 손상하지 않고 입력불가 focus에서 값 변경을 보장했다고 반환하지 않는다. keydown별발생은보장하지않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-KEYBOARD-TYPE-001, PLAN-KEYBOARD-TYPE-002. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## ref-input

대상: **input**. 관련 요구: REQ-C-INPUT-001, REQ-C-INPUT-002, REQ-C-INPUT-003, REQ-C-INPUT-004, REQ-C-INPUT-005. 정본: [개별 요구](../common/input.md).

### Codex

- 제품/표면: Codex CUA / ChatGPT in-app browser (iab).
- 대응 관계: `composition` — locator click/fill/press/setChecked/selectOption
- 공개 예제 상태: common mechanism; use specific API examples, not independently executed. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- `CL-CODEX-input-01` **DOC**: locator click/fill/press/setChecked/selectOption 공개 서명. 근거 `CUA-DOC-API` / raw/public-contract-excerpts.md:72-72; raw/public-contract-excerpts.md:78-78; raw/public-contract-excerpts.md:94-94; raw/public-contract-excerpts.md:97-97; raw/public-contract-excerpts.md:96-96. 범위: 공개 선언/안내만; 실행 또는 전체조건 충족 주장 아님.

- `CL-CODEX-input-02` **HISTORICAL**: {"readonly": "rejected", "slotClick": true, "scaledFrameClick": true} 근거 `HIST-CODEX-AUDIT` / raw/historical-diagnostics-before-after.json#/codex/readonly; raw/historical-diagnostics-before-after.json#/codex/slotClick; raw/historical-diagnostics-before-after.json#/codex/scaledFrameClick. 범위: 과거 audit의 해당 필드만; 현재/모든 옵션/일반 환경으로 확대하지 않음.

추가 확인할 조건:

- down/up ownership·actualrelease·hit/actionability·post-state재확인·no-blind-retry 미확인
- locator 입력은 단일 대상·visible/enabled·안정·실제hit/편집가능 등 적용 전제조건을 검증한다. 실패 전 입력이 없으면 무입력, 중도 실패면 부분효과를 구분한다.
- visible는 layout 존재와 조상숨김/닫힌details 기준이다. offscreen·overlay는visible와별개며 자동스크롤은 입력/명시scroll에만 허용한다.

전체 근거/미확인 목록: [조사 매핑](evidence/codex/mapping.json), [공개 계약·한계](evidence/codex/sources.md).

### Aside

- 제품/표면: Aside original CLI 1.26.1028.2335 / Skill version 3.
- 대응 관계: `composition` — 관찰→입력→새 snapshot·실제 업무상태; API 반환을 업무성공으로 일반화 금지
- 공개 예제 상태: 조합설계·이번 미실행. 아래 문법은 원문/가이드에 근거한 호출 조각이며 변수/선행 관찰은 실제 fixture에서 먼저 준비한다.

문법이 확인되지 않은 API 호출은 만들지 않는다. 공개 방법이 없으면 아래 확인 과제를 먼저 수행한다.

- `CL-ASIDE-input-01` **DOC**: click interactivity/DOM stability/필요시scroll·fresh snapshot 사후확인 DOC. 근거 `A-DOC-REPL` / .local/reference-loop-execution/aside/current-repl-guide.txt :: Navigation and Actions: click wait/scroll; action unconfirmed until fresh snapshot expected state. 범위: 현재 공개 가이드 계약만; 실행검증 아님. 2026-11-01 Aside CLI1.26.1028.2335/skill3. Navigation and Actions: click wait/scroll; action unconfirmed until fresh snapshot expected state.

- `CL-ASIDE-input-02` **INFERENCE**: 조합 대응 판단: 관찰→입력→새 snapshot·실제 업무상태; API 반환을 업무성공으로 일반화 금지 근거 `A-DOC-REPL` / .local/reference-loop-execution/aside/current-repl-guide.txt :: underlying public/historical mechanism. 범위: 조사자의 목적 대응 판단. 우리 API의 전체 조건 충족이나 경쟁 API의 동등성 확인이 아님. confirmedConditions 분자에 넣지 않음..

추가 확인할 조건:

- 우리규범 추가 확인: locator 입력은 단일 대상·visible/enabled·안정·실제hit/편집가능 등 적용 전제조건을 검증한다. 실패 전 입력이 없으면 무입력, 중도 실패면 부분효과를 구분한다.
- 우리규범 추가 확인: visible는 layout 존재와 조상숨김/닫힌details 기준이다. offscreen·overlay는visible와별개며 자동스크롤은 입력/명시scroll에만 허용한다.
- 우리규범 추가 확인: 좌표 primitive는 main viewport CSS 좌표와 유효한 버튼/키를 사용한다. 사전 검증/focus 실패는 기존 명시 down 상태를 보존한다. 입력 중 실패는 그 연산이 새로 획득한 키/버튼만 정리하고 이전 명시 down은 보존한다. reset/close는 해당 세션이 소유한 전체 실제 눌림 정리를 시도한다. 실제 release 실패를 내부 상태 초기화로 숨기지 않고 잔류/불확실을 보고한다. click/drag가 사용할 버튼이 이미 명시 down이면 사전 상태충돌로 거절하며 다른 down을 해제하지 않는다.

전체 근거/미확인 목록: [조사 매핑](evidence/aside/mapping.json), [공개 계약·한계](evidence/aside/sources.md).

### 우리 설계 판단과 검증

조정 채택: 확인된 공개 호출/관찰 흐름만 참고하고 우리 입력·성공·실패 경계는 정본의 상세조건으로 결정한다. 직접 대응이 없는 조건은 기존 primitive 조합/명시 실패와 자체 검증으로 판단한다.

구현 흐름(설계, 미실행): 입력/범위 확인 → 공개 방법으로 대상 관찰/선택 → 필요한 입력·대기 → 실제 상태/바이트/이벤트 판독 → 부분효과/정리 확인. 단일 정상 호출을 전체 요구 충족으로 취급하지 않는다.

연결 PLAN: PLAN-C-INPUT-001, PLAN-C-INPUT-002, PLAN-C-INPUT-003, PLAN-C-INPUT-004, PLAN-C-INPUT-005. 세부 조건은 [condition index](../condition-index.json)에 있으며 정상·거절·부분효과 fixture가 없으면 다음 개발에서 먼저 작성한다.

## 별도 보충 표면 관측

IAB fixture 연결은 차단되었으며 CUA/Chrome-extension에서 기존 fixture의9개부분사례를 관찰했다. [보충 원자료](evidence/codex/raw/boundary1.json)와 [IAB 차단](evidence/codex/raw/boundary1-iab-blocked.json)을 구분한다. 인접/실제공백·긴본문 filter, label 조회, 0/N 조회 오류·readonly 거절 관측은 해당 어댑터/fixture 범위뿐이다. 부분확인으로서 주 IAB의 전체조건 근거 확인률은 올리지 않는다. 문서상 first-matched/null과 이Chrome실측의일부strict/timeout차이는 미해결표면차이로 보존한다.

## 우리 구현 선택의 확정 규칙

[공통 상세 정책](../common/input.md#상태와-키-및-완료-관측-상세표)를 해당 정본과 함께 읽는다. 정책은 [2차 메인 판단](reviews/cycle-2/research-decisions.md)에서 이유와 대안을 기록했다. DOC/관측으로 확인된 경쟁방법과 우리 선택을 혼동하지 않는다.
