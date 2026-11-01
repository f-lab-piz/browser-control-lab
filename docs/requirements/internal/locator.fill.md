# locator.fill

## 계약과 적용 범위

대상: 확장 QuickJS에 공개하는 기존 API.

공통 계약: [runtime](../common/runtime.md), [dom-frames](../common/dom-frames.md), [selection](../common/selection.md), [input](../common/input.md). Page/Frame의 Scope 메서드는 같은 API로 센다. 공통 필수 조건도 이 API의 개발 수용 기준에 포함한다.

- 목적: readonly/disabled/비편집 대상을 사전 거절하고 빈 문자열도 채울 수 있다.
- 입력/기본값: value:string; 지원 텍스트 제어/contenteditable.
- 출력/성공 의미: Promise<boolean>; 요청 값 반영 확인true.
- 허용 부작용: 포커스·선택·입력 이벤트·값 변경.
- 오류/경계: 입력 masking이나 rerender로 실제 값이 요청과 다르면 INPUT_VALUE_NOT_CHANGED며 거짓 성공을 주지 않는다.
- 재시도: 읽기는 최신 문서 상태로 다시 관찰할 수 있다. 입력은 완료 여부를 먼저 확인하며 응답 유실만으로 재전송하지 않는다.
- 지원: Chrome debugger/CDP, 허용된 HTTP(S), 현재 연결 DOM. Firefox/Safari·closed Shadow·모든 사이트 완전 지원은 이번 약속이 아니다.

## 개별 요구사항

### REQ-LOCATOR-FILL-001

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/input-state.md#ref-locator-fill). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: readonly/disabled/비편집 대상을 사전 거절하고 빈 문자열도 채울 수 있다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-LOCATOR-FILL-001-C01부터 C02까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-LOCATOR-FILL-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-locator.fill` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-LOCATOR-FILL-001-C01

- 조건: fill은기존전체값을교체하며빈문자열은삭제다.
- 준비: text/textarea/editor의기존ABC
- 실행: fill 한글🙂 및빈문자열
- 판정: 각요청값이독립inputValue와같고선택위치삽입과구분된다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-LOCATOR-FILL-001-C02

- 조건: 성공은전달성공이아니라실제값일치를확인한다.
- 준비: 입력을되돌리는masking/rerender제어
- 실행: fill 123
- 판정: 값이123아니면INPUT_VALUE_NOT_CHANGED이고거짓true없다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-LOCATOR-FILL-002

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/input-state.md#ref-locator-fill). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 입력 masking이나 rerender로 실제 값이 요청과 다르면 INPUT_VALUE_NOT_CHANGED며 거짓 성공을 주지 않는다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-LOCATOR-FILL-002-C01부터 C03까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-LOCATOR-FILL-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-locator.fill` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-LOCATOR-FILL-002-C01

- 조건: readonly/disabled/비텍스트입력은값변경전에거절한다.
- 준비: readonly/aria-readonly/disabled/checkbox
- 실행: fill
- 판정: 제어타입/편집불가오류·기존값과inputcounter불변이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-LOCATOR-FILL-002-C02

- 조건: focus/선택후오류는준비효과와변경효과를분리한다.
- 준비: focus시rerender·입력후detach
- 실행: fill
- 판정: 현재값/포커스·발생event를기록하며전체무부작용이나rollback을주장하지않는다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-LOCATOR-FILL-002-C03

- 조건: 동일값재호출도새업무성공으로합산하지않는다.
- 준비: 값이이미A인제어
- 실행: fill A 후서버상태확인
- 판정: 값일치와이벤트전달을구분하며업무저장완료를추정하지않는다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

## 현재 사실과 근거 한계

기준 구현은 `700a6a06af3f97729327afaf9becb4ee29bb475b`. [카탈로그](../../api-catalog.json)의 과거 상태 `verified-basic`는 기본 호출/당시 제한 기록이다. 본 명세의 모든 옵션·반례 충족을 뜻하지 않는다. [기존 테스트 연결](../../api-test-matrix.json)은 후보이며 소스 fingerprint가 현재와 다른 부분은 과거 증거다. 새 제품 테스트는 이번에 실행·추가하지 않았다. 규범과 다른 코드가 보이면 규범을 낮추지 않고 backlog에서 조사한다.
