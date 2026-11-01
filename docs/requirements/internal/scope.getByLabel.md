# scope.getByLabel

## 계약과 적용 범위

대상: 확장 QuickJS에 공개하는 기존 API.

공통 계약: [runtime](../common/runtime.md), [dom-frames](../common/dom-frames.md), [selection](../common/selection.md). Page/Frame의 Scope 메서드는 같은 API로 센다. 공통 필수 조건도 이 API의 개발 수용 기준에 포함한다.

- 목적: label for/감싼 label/aria-label/aria-labelledby로 연결된 제어를 검색한다.
- 입력/기본값: text:string/RegExp, options.exact?:boolean(기본false).
- 출력/성공 의미: 연결된 제어의 Locator.
- 허용 부작용: 없음.
- 오류/경계: 같은 label의 여러 제어는 엄격 조작을 거절하고 비연결 일반 텍스트를 label로 오인하지 않는다.
- 재시도: 읽기는 최신 문서 상태로 다시 관찰할 수 있다. 입력은 완료 여부를 먼저 확인하며 응답 유실만으로 재전송하지 않는다.
- 지원: Chrome debugger/CDP, 허용된 HTTP(S), 현재 연결 DOM. Firefox/Safari·closed Shadow·모든 사이트 완전 지원은 이번 약속이 아니다.

## 개별 요구사항

### REQ-SCOPE-GETBYLABEL-001

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/selection-search.md#ref-scope-getbylabel). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: label for/감싼 label/aria-label/aria-labelledby로 연결된 제어를 검색한다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-SCOPE-GETBYLABEL-001-C01부터 C02까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-SCOPE-GETBYLABEL-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-scope.getByLabel` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-SCOPE-GETBYLABEL-001-C01

- 조건: label for/감싼 label/ARIA 이름이 연결된 제어를 찾는다.
- 준비: for/wrappedlabel/aria-label/labelledby 제어와 같은 일반본문을 둔다. main과open ShadowRoot에같은id/다른참조이름을추가한다.
- 실행: exact/regex 조회
- 판정: 연결된제어의최종명시이름만매칭하고일반본문으로대체하지않는다. IDREF는대상의Document/ShadowRoot범위로만조회해바깥같은id이름을섞지않는다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-SCOPE-GETBYLABEL-001-C02

- 조건: 긴 label과 slot/aria-labelledby 이름은 출력 축약과 별개다.
- 준비: 1000자 label 끝 needle
- 실행: 전체 이름 검색
- 판정: 실제 연결 이름으로 대상 조회 가능하다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-SCOPE-GETBYLABEL-002

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/selection-search.md#ref-scope-getbylabel). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 같은 label의 여러 제어는 엄격 조작을 거절하고 비연결 일반 텍스트를 label로 오인하지 않는다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-SCOPE-GETBYLABEL-002-C01부터 C02까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-SCOPE-GETBYLABEL-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-scope.getByLabel` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-SCOPE-GETBYLABEL-002-C01

- 조건: 같은 label의 복수 제어는 임의 선택하지 않는다.
- 준비: label 같은 input2개
- 실행: fill
- 판정: strict 오류·두 값 불변이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-SCOPE-GETBYLABEL-002-C02

- 조건: 없는 label/잘못된 문자열·정규식 옵션은 명시 처리한다.
- 준비: 비연결 label·빈 문자열·잘못된 exact 형식
- 실행: 조회/조작
- 판정: 빈 문자열은 입력 오류,비연결은 0개,조작은 대상 없음이며 자동 본문 대체 없다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

## 현재 사실과 근거 한계

기준 구현은 `700a6a06af3f97729327afaf9becb4ee29bb475b`. [카탈로그](../../api-catalog.json)의 과거 상태 `verified-basic`는 기본 호출/당시 제한 기록이다. 본 명세의 모든 옵션·반례 충족을 뜻하지 않는다. [기존 테스트 연결](../../api-test-matrix.json)은 후보이며 소스 fingerprint가 현재와 다른 부분은 과거 증거다. 새 제품 테스트는 이번에 실행·추가하지 않았다. 규범과 다른 코드가 보이면 규범을 낮추지 않고 backlog에서 조사한다.
