# 공통 계약: input

범위: 이를 참조하는 API. 규범은 목표, 구현/통과 보고가 아니다. 잘못된 입력은 사전 거절한다. 브라우저 자체의 불가역 효과까지 원자성을 약속하지 않는다.

### REQ-C-INPUT-001

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/input-state.md#ref-input). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: locator 입력은 단일 대상·visible/enabled·안정·실제hit/편집가능 등 적용 전제조건을 검증한다. 실패 전 입력이 없으면 무입력, 중도 실패면 부분효과를 구분한다.
- 근거: SKILL, HIST-COMP. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-C-INPUT-001-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-C-INPUT-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-input` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-C-INPUT-001-C01

- 조건: 입력 전 조건 실패와 입력 중 부분 효과를 구분한다.
- 준비: disabled/readonly/overlay와 down 후 fault
- 실행: 해당 입력
- 판정: 사전 입력 0·중간 trace/변화값 기록·거짓 성공 없다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-C-INPUT-002

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/input-state.md#ref-input). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: visible는 layout 존재와 조상숨김/닫힌details 기준이다. offscreen·overlay는visible와별개며 자동스크롤은 입력/명시scroll에만 허용한다.
- 근거: USR, HIST-INLINE. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-C-INPUT-002-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-C-INPUT-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-input` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-C-INPUT-002-C01

- 조건: visible와 offscreen/overlay 및 자동 scroll은 분리한다.
- 준비: 화면 밖 버튼/overlay/닫힌 details
- 실행: 상태 조회 후 명시 입력
- 판정: 조회 scroll0·입력 준비 scroll 가능·가림은 입력 전 거절이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-C-INPUT-003

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/input-state.md#ref-input). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (검토 3차 반영, 2026-11-01).
- 규범: 좌표/키/상태 소유 정책은 input 상세표를 따른다. 사전 실패는 기존 down 보존, 중도 실패는 새소유만 release, Page close는 해당Page만, session reset은전체소유Page의release를시도한다. 실제release 실패는불확실로보고하며내부상태clear로숨기지않는다.
- 근거: DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-C-INPUT-003-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-C-INPUT-003`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-input` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-C-INPUT-003-C01

- 조건: cleanup은 연산 소유와 세션 전체 종료를 구분한다.
- 준비: 기존 Control/left down·새 Alt·fault·reset
- 실행: press/click/drag 및 reset
- 판정: 사전 기존 상태 보존·중도 새 소유만 release·reset 전체 시도·실패 불확실 명시다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-C-INPUT-004

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/input-state.md#ref-input). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 입력전달 성공과 업무완료를 구분한다. fill/checked/selection/focus처럼 API가 사후상태를 약속한 경우 실제상태를 확인한다.
- 근거: USR, SKILL. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-C-INPUT-004-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-C-INPUT-004`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-input` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-C-INPUT-004-C01

- 조건: 약속한사후상태는동기handler와다음microtask checkpoint뒤성공반환직전같은identity에서판독한다.
- 준비: sync/microtask revert,완료뒤gate로발생하는timer변경과동기element교체를준비한다.
- 실행: fill/check/select/focus완료와별도업무관찰을분리한다.
- 판정: 완료관측전mismatch/stale는실패·부분효과이며이후독립변경까지영속성공을보장하지않는다. 재입력으로맞추지않는다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-C-INPUT-005

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/input-state.md#ref-input). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **SHOULD / 수용** (초안 설계 결정, 2026-11-01).
- 규범: timeout/재시도 기본값은 guide에 안내하고 stale ref나 비멱등 drop/click을 다른대상에 자동재시도하지 않는다.
- 근거: DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-C-INPUT-005-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-C-INPUT-005`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

- 상세화 판단: `DETAIL-input` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-C-INPUT-005-C01

- 조건: 불확실 응답에서 비멱등 입력을 자동 재전송하지 않는다.
- 준비: 입력 성공 후 응답 유실
- 실행: 상태 관찰/요청 조회
- 판정: 효과 중복 0·현재 상태와 재시도 가능 여부를 안내한다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

## 상태와 키 및 완료 관측 상세표

|상태|v1 판정|
|---|---|
|ARIA boolean|문자열을ASCII trim/lowercase 후 true만참으로본다. false/mixed/기타는참이아님. aria-hidden/disabled/readonly의해당정책과체크상태에같은정규화를사용.|
|enabled|native disabled/disabled fieldset(첫 legend 예외) 또는 대상/composed조상 aria-disabled=true이면false. readonly만으로disabled로바꾸지않음.|
|editable|enabled이며native readonly/대상의aria-readonly=true가아닌 input 기본/text/search/tel/url/email/password, textarea, effective contenteditable만true. number/date/time/color/range/file/checkbox/radio/button 등은텍스트fill대상아님.|
|checked|native checkbox/radio는checked property 우선이며ARIA로덮지않음. native indeterminate는별도상태이고boolean checked를바꾸지않음. custom role checkbox/switch/radio는aria-checked=true만true, false/mixed는false. 비체크형은타입오류.|
|현재값|INPUT/TEXTAREA/SELECT는value property. contenteditable은innerText의CRLF→LF만정규화하고trim/공백압축없음. raw textContent/접근이름/검색본문과다름.|
|완료관측|상태를약속하는fill/check/select/focus는최종입력과동기핸들러·다음microtask checkpoint뒤,성공반환직전에같은document/element와값/상태를한번재판독. mismatch는해당상태오류,교체는stale/부분효과. 이후독립timer/서버변경은영속보장하지않음.|
|release범위|중도실패는그연산의새소유만release, Page close는해당Page만, session reset은세션의모든Page대상. 상태는Page별이며다른Page modifier를묵시적으로공유하지않음. 실제release실패명시.|

키 토큰: Control/Alt/Shift/Meta와 Enter/Tab/Escape/Backspace/Delete/ArrowLeft/ArrowRight/ArrowUp/ArrowDown/Home/End/PageUp/PageDown, printable ASCII 한 문자(U+0020..007E)를 지원한다. 철자 대소문자를 구분하고 alias/F키/미디어키/ControlOrMeta 자동치환은 이번 범위 밖이다. Unicode 문자열은 keyboard.type을 쓴다.

down/up은 단일 토큰만, press/locator.press는 중복 없는 modifier 목록+주키1개다. 단독 '+'는 plus, 최종 '++'는 plus 주키로 해석한다(Control++). 그 외 빈 token/주키없는 조합/주키2개/unknown은 사전거절이다. modifier는선언순down,주키down/up,새소유modifier역순up. 기존명시down은보존한다.

사후관측 테스트는sync/microtask revert와API완료뒤별도gate로발생시키는변경을나눈다. 임의sleep이나무한미래불변을oracle로쓰지않는다.
