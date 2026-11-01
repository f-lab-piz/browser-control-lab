# locator.click

## 계약과 적용 범위

대상: 확장 QuickJS에 공개하는 기존 API.

공통 계약: [runtime](../common/runtime.md), [dom-frames](../common/dom-frames.md), [selection](../common/selection.md), [input](../common/input.md). Page/Frame의 Scope 메서드는 같은 API로 센다. 공통 필수 조건도 이 API의 개발 수용 기준에 포함한다.

- 목적: visible/enabled/안정·가림 검사 후 정확히 대상에 클릭하며 clickCount2로 더블클릭 조합 가능하다.
- 입력/기본값: options.button?:left/right/middle, clickCount?:positive integer; 기본left/1.
- 출력/성공 의미: Promise<boolean> 입력 전달 성공true; 업무 성공은 별도 관찰.
- 허용 부작용: 대상 auto-scroll·실제 포인터 입력.
- 오류/경계: 중복·stale·overlay는 입력 전에 거절하고 닫힌 details·slot·scaled iframe에서 잘못된 다른 요소를 클릭하지 않는다.
- 재시도: 읽기는 최신 문서 상태로 다시 관찰할 수 있다. 입력은 완료 여부를 먼저 확인하며 응답 유실만으로 재전송하지 않는다.
- 지원: Chrome debugger/CDP, 허용된 HTTP(S), 현재 연결 DOM. Firefox/Safari·closed Shadow·모든 사이트 완전 지원은 이번 약속이 아니다.

## 개별 요구사항

### REQ-LOCATOR-CLICK-001

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/input-state.md#ref-locator-click). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: visible/enabled/안정·가림 검사 후 정확히 대상에 클릭하며 clickCount2로 더블클릭 조합 가능하다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-LOCATOR-CLICK-001-C01부터 C04까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-LOCATOR-CLICK-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-locator.click` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-LOCATOR-CLICK-001-C01

- 조건: 기본 left 단일 클릭은 정확한 대상에 mouse down/up 한 쌍을 전달한다.
- 준비: 서버 clickcounter와 pointertrace가 있는 버튼
- 실행: 기본 click
- 판정: 대상 counter1·다른 counter0·buttons 잔류 0이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-LOCATOR-CLICK-001-C02

- 조건: button/right/middle 및 clickCount2는 요청한 이벤트 구성을 따른다.
- 준비: contextmenu/auxclick/dblclick별 카운터
- 실행: 각 옵션을 독립 run
- 판정: 우클릭/중클릭/더블클릭을 단일 left로 대체하지 않고 dblclick 업무 1 회다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-LOCATOR-CLICK-001-C03

- 조건: 대상이 화면 밖이면 필요한 scrollport만 노출시킨 후 입력한다.
- 준비: 내부 iframe·가로 scroll 밖 버튼
- 실행: click
- 판정: 대상 hit 일치·목적 scroll 변경을 기록하고 다른 영역 클릭 없다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-LOCATOR-CLICK-001-C04

- 조건: 안정은 연속 2animation frame에서 연결 문서와 box 변동이 CSS1px 이하인 상태다.
- 준비: 버튼이 움직이다 정지하는 fixture
- 실행: click
- 판정: 기본 총 5초 내 정지한 대상만 클릭하고 계속 움직이면 ACTIONABILITY_TIMEOUT이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-LOCATOR-CLICK-002

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/input-state.md#ref-locator-click). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 중복·stale·overlay는 입력 전에 거절하고 닫힌 details·slot·scaled iframe에서 잘못된 다른 요소를 클릭하지 않는다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-LOCATOR-CLICK-002-C01부터 C04까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-LOCATOR-CLICK-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-locator.click` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-LOCATOR-CLICK-002-C01

- 조건: 없는 대상은 기본 총 5 초까지만 기다리고 중복은 발견 즉시 거절한다.
- 준비: 지연 등장/끝내 없음/중복 버튼
- 실행: click
- 판정: 지연 등장은 1회,없음 timeout·중복 strict·거절 시 입력 0이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-LOCATOR-CLICK-002-C02

- 조건: 최종 hit는 자식 요소와 모든 조상 iframe의 가림/clipping을 검사한다.
- 준비: 자식 버튼은 visible지만 parentoverlay가 가림
- 실행: click
- 판정: ELEMENT_OBSCURED·버튼/overlay 입력 0이며 자동 overlay 제거 없다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-LOCATOR-CLICK-002-C03

- 조건: 좌표 준비 후 문서/ref 교체는 다른 요소로 재지정하지 않는다.
- 준비: ref 발급 후 element 교체·좌표 계산 후 frame 교체
- 실행: click
- 판정: ref/document stale이며 새 버튼 click0이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-LOCATOR-CLICK-002-C04

- 조건: 입력 도중 실패는 부분 효과와 자기 소유 버튼 정리를 알린다.
- 준비: down 후 adapter 실패/대상 detach
- 실행: click
- 판정: 발생 down은 기록·up 정리 시도·완료 불확실 표시·자동 두 번째 클릭 없다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

## 현재 사실과 근거 한계

기준 구현은 `700a6a06af3f97729327afaf9becb4ee29bb475b`. [카탈로그](../../api-catalog.json)의 과거 상태 `verified-basic`는 기본 호출/당시 제한 기록이다. 본 명세의 모든 옵션·반례 충족을 뜻하지 않는다. [기존 테스트 연결](../../api-test-matrix.json)은 후보이며 소스 fingerprint가 현재와 다른 부분은 과거 증거다. 새 제품 테스트는 이번에 실행·추가하지 않았다. 규범과 다른 코드가 보이면 규범을 낮추지 않고 backlog에서 조사한다.
