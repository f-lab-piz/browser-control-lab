# scope.evaluate

## 계약과 적용 범위

대상: 확장 QuickJS에 공개하는 기존 API.

공통 계약: [runtime](../common/runtime.md), [dom-frames](../common/dom-frames.md), [selection](../common/selection.md). Page/Frame의 Scope 메서드는 같은 API로 센다. 공통 필수 조건도 이 API의 개발 수용 기준에 포함한다.

- 목적: 확장QuickJS closure와페이지context를분리하고명시arg로만데이터전달한다.
- 입력/기본값: fn:function,arg?:JSON(생략 시 null); Scope는 fn(arg), Locator.evaluate 별칭은 fn(element,arg). document는 선택 프레임의 전역 context다.
- 출력/성공 의미: Promise<JSON 직렬화값>.
- 허용 부작용: 사용자함수가요청한페이지관찰/변경 가능.
- 오류/경계: navigation/분리frame/순환값/DOMnode/throw는직렬화또는실행오류로구분하며성공null로숨기지않는다.
- 재시도: 읽기는 최신 문서 상태로 다시 관찰할 수 있다. 입력은 완료 여부를 먼저 확인하며 응답 유실만으로 재전송하지 않는다.
- 지원: Chrome debugger/CDP, 허용된 HTTP(S), 현재 연결 DOM. Firefox/Safari·closed Shadow·모든 사이트 완전 지원은 이번 약속이 아니다.

## 개별 요구사항

### REQ-SCOPE-EVALUATE-001

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/lifecycle-evaluation.md#ref-scope-evaluate). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (검토 3차 반영, 2026-11-01).
- 규범: Scope.evaluate(fn,arg)는 선택 프레임의 document를 전역 context로 두고 fn(arg)를 호출한다. Locator.evaluate 호환 별칭은 단일 element를 첫 인자, arg를 둘째 인자로 전달한다. QuickJS closure는 전달하지 않는다. Promise/JSON/오류/deadline은 REQ-C-RUNTIME-008을 따르며 반환값을 자동 모델 출력하지 않는다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-SCOPE-EVALUATE-001-C01부터 C02까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-SCOPE-EVALUATE-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-scope.evaluate` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-SCOPE-EVALUATE-001-C01

- 조건: Scope와Locator별칭의수신인자를구분한다.
- 준비: main/childdocument·element·명시arg
- 실행: 각fn평가
- 판정: Scope fn(arg),별칭 fn(el,arg),선택document전역이며closure전달없다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-SCOPE-EVALUATE-001-C02

- 조건: 평가는Promise를settle하고JSON결과만반환한다.
- 준비: syncnull·async7·명시JSON
- 실행: evaluate
- 판정: 정확한JSON값이며모델출력은별도console/display다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-SCOPE-EVALUATE-002

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/lifecycle-evaluation.md#ref-scope-evaluate). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: navigation/분리frame/순환값/DOMnode/throw는직렬화또는실행오류로구분하며성공null로숨기지않는다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-SCOPE-EVALUATE-002-C01부터 C02까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-SCOPE-EVALUATE-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-scope.evaluate` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-SCOPE-EVALUATE-002-C01

- 조건: undefined/순환/DOMnode/비유한값/closure오류는성공null이아니다.
- 준비: 각결과와arg·미정의closure
- 실행: evaluate
- 판정: 직렬화/함수오류구분·실행전arg실패는효과0이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-SCOPE-EVALUATE-002-C02

- 조건: 효과뒤throw/timeout은부분효과를보존하고재실행하지않는다.
- 준비: marker증가후reject/never-settle
- 실행: 평가→reset/후속판독
- 판정: marker1·late출력없음·rollback/자동재실행주장없다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

## 현재 사실과 근거 한계

기준 구현은 `700a6a06af3f97729327afaf9becb4ee29bb475b`. [카탈로그](../../api-catalog.json)의 과거 상태 `verified-basic`는 기본 호출/당시 제한 기록이다. 본 명세의 모든 옵션·반례 충족을 뜻하지 않는다. [기존 테스트 연결](../../api-test-matrix.json)은 후보이며 소스 fingerprint가 현재와 다른 부분은 과거 증거다. 새 제품 테스트는 이번에 실행·추가하지 않았다. 규범과 다른 코드가 보이면 규범을 낮추지 않고 backlog에서 조사한다.
