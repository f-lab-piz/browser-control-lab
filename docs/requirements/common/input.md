# 공통 계약: input

범위: 이를 참조하는 API. 규범은 목표, 구현/통과 보고가 아니다. 잘못된 입력은 사전 거절한다. 브라우저 자체의 불가역 효과까지 원자성을 약속하지 않는다.

### REQ-C-INPUT-001

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: locator 입력은 단일 대상·visible/enabled·안정·실제hit/편집가능 등 적용 전제조건을 검증한다. 실패 전 입력이 없으면 무입력, 중도 실패면 부분효과를 구분한다.
- 근거: SKILL, HIST-COMP. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: overlay/readonly/disabled/rerender조건
- When: 해당입력
- Then: 성공을꾸미지않고trace와실제값으로전후효과를확인한다.
- 검증 계획: `PLAN-C-INPUT-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-C-INPUT-002

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: visible는 layout 존재와 조상숨김/닫힌details 기준이다. offscreen·overlay는visible와별개며 자동스크롤은 입력/명시scroll에만 허용한다.
- 근거: USR, HIST-INLINE. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 화면밖visible와overlay대상
- When: isVisible후click
- Then: 조회불변,click은스크롤가능하나overlay오류다.
- 검증 계획: `PLAN-C-INPUT-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-C-INPUT-003

- 수준/판단: **MUST / 수용** (검토 3차 반영, 2026-11-01).
- 규범: 좌표 primitive는 main viewport CSS 좌표와 유효한 버튼/키를 사용한다. 사전 검증/focus 실패는 기존 명시 down 상태를 보존한다. 입력 중 실패는 그 연산이 새로 획득한 키/버튼만 정리하고 이전 명시 down은 보존한다. reset/close는 해당 세션이 소유한 전체 실제 눌림 정리를 시도한다. 실제 release 실패를 내부 상태 초기화로 숨기지 않고 잔류/불확실을 보고한다. click/drag가 사용할 버튼이 이미 명시 down이면 사전 상태충돌로 거절하며 다른 down을 해제하지 않는다.
- 근거: DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 기존 Control/left button down이 있는/없는 상태와 focus 이전 실패·키/버튼 전송 중 실패·reset/close를 각각 준비한다.
- When: press/click/drag의 각 실패 단계 및 별도 reset/close를 실행한다.
- Then: 사전 실패는 새 입력0·기존 down 유지, 중도 실패는 새로 소유한 키/버튼만 release, reset/close는 전체 release 시도다. event trace와 후속 실제 입력으로 확인하고 이미 발생한 효과는 rollback하지 않는다.
- 검증 계획: `PLAN-C-INPUT-003`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-C-INPUT-004

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 입력전달 성공과 업무완료를 구분한다. fill/checked/selection/focus처럼 API가 사후상태를 약속한 경우 실제상태를 확인한다.
- 근거: USR, SKILL. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 서버판정예약격자와값되돌림제어
- When: 입력후독립관찰
- Then: 업무판정은별도,되돌린값은API실패다.
- 검증 계획: `PLAN-C-INPUT-004`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-C-INPUT-005

- 수준/판단: **SHOULD / 수용** (초안 설계 결정, 2026-11-01).
- 규범: timeout/재시도 기본값은 guide에 안내하고 stale ref나 비멱등 drop/click을 다른대상에 자동재시도하지 않는다.
- 근거: DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 입력응답이유실된상황
- When: 요청결과확인
- Then: 재관찰경로를제시하고효과중복없다.
- 검증 계획: `PLAN-C-INPUT-005`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.
