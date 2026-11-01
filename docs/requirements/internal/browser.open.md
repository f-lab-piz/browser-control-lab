# browser.open

## 계약과 적용 범위

대상: 확장 QuickJS에 공개하는 기존 API.

공통 계약: [runtime](../common/runtime.md). Page/Frame의 Scope 메서드는 같은 API로 센다. 공통 필수 조건도 이 API의 개발 수용 기준에 포함한다.

- 목적: 요청 URL을 한 번 열고 준비된 Page를 반환한다.
- 입력/기본값: url:절대 HTTP(S) URL, options.active?:boolean(기본true).
- 출력/성공 의미: Promise<Page>, id/tabId를 가진 세션 소유 핸들.
- 허용 부작용: 새 탭1개; active 옵션에 따른 포커스.
- 오류/경계: 금지 scheme·잘못된 URL·권한 실패는 성공 Page를 주지 않으며 새로 만든 실패 탭의 잔여 여부를 설명한다.
- 재시도: 읽기는 최신 문서 상태로 다시 관찰할 수 있다. 입력은 완료 여부를 먼저 확인하며 응답 유실만으로 재전송하지 않는다.
- 지원: Chrome debugger/CDP, 허용된 HTTP(S), 현재 연결 DOM. Firefox/Safari·closed Shadow·모든 사이트 완전 지원은 이번 약속이 아니다.

## 개별 요구사항

### REQ-BROWSER-OPEN-001

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/lifecycle-evaluation.md#ref-browser-open). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 요청 URL을 한 번 열고 준비된 Page를 반환한다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-BROWSER-OPEN-001-C01부터 C02까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-BROWSER-OPEN-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-browser.open` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-BROWSER-OPEN-001-C01

- 조건: active 옵션을 생략하면 새 탭을 활성화하고 false면 기존 탭을 유지한다.
- 준비: 활성탭A와 유효fixtureURL
- 실행: open active생략/false를별도run
- 판정: 새탭정확히1개와 Page id 일치, 활성정책도 일치한다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-BROWSER-OPEN-001-C02

- 조건: 반환된 Page는 지정 URL 문서의 제어 가능한 준비 상태다.
- 준비: 느린 HTTP문서
- 실행: open 후 즉시 snapshot
- 판정: 이전/빈 초기문서를 요청문서로 성공 반환하지 않는다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-BROWSER-OPEN-002

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/lifecycle-evaluation.md#ref-browser-open). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 금지 scheme·잘못된 URL·권한 실패는 성공 Page를 주지 않으며 새로 만든 실패 탭의 잔여 여부를 설명한다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-BROWSER-OPEN-002-C01부터 C02까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-BROWSER-OPEN-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-browser.open` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-BROWSER-OPEN-002-C01

- 조건: 금지 scheme/잘못된URL은 생성 전에 거절한다.
- 준비: javascript:/file:/잘못된URL
- 실행: open
- 판정: 탭수불변,허용스킴 오류다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-BROWSER-OPEN-002-C02

- 조건: 생성 후 attach/준비 실패는 생성된 tabId와 잔여 여부를 알린다.
- 준비: 탭생성은성공·debugger실패
- 실행: open
- 판정: 성공Page없고 사용자가 새탭의존재/정리결과를 알 수 있다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

## 현재 사실과 근거 한계

기준 구현은 `700a6a06af3f97729327afaf9becb4ee29bb475b`. [카탈로그](../../api-catalog.json)의 과거 상태 `verified-basic`는 기본 호출/당시 제한 기록이다. 본 명세의 모든 옵션·반례 충족을 뜻하지 않는다. [기존 테스트 연결](../../api-test-matrix.json)은 후보이며 소스 fingerprint가 현재와 다른 부분은 과거 증거다. 새 제품 테스트는 이번에 실행·추가하지 않았다. 규범과 다른 코드가 보이면 규범을 낮추지 않고 backlog에서 조사한다.
