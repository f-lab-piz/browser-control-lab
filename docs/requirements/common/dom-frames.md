# 공통 계약: dom-frames

범위: 이를 참조하는 API. 규범은 목표, 구현/통과 보고가 아니다. 잘못된 입력은 사전 거절한다. 브라우저 자체의 불가역 효과까지 원자성을 약속하지 않는다.

### REQ-C-DOMFRAMES-001

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: snapshot/selector/상태 조회 등 관찰 API의 기본 범위는 현재 연결 DOM의 화면 밖 영역까지다. 이들 관찰은 scroll·click·추가 데이터 로딩을 발생시키지 않는다. evaluate/evaluateAll/waitForFunction의 사용자 함수는 명시적으로 효과를 낼 수 있으며 무조작 관찰 보장의 예외다.
- 근거: USR, SKILL. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: offscreen과가상화미로드row가함께있는메일iframe
- When: snapshot/조회
- Then: 현재offscreen은발견하고미로드는미관찰로남기며scroll·서버요청수불변이다.
- 검증 계획: `PLAN-C-DOMFRAMES-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-C-DOMFRAMES-002

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: Frame Scope는 선택 프레임과 연결된 자식 관찰 범위를 명시한다. CSS/role/text 선택은 해당 document에 한정하고 ref는 발급frame로 라우팅한다.
- 근거: USR, CODE. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 중첩/OOPIF마다같은이름버튼
- When: frame지정검색과ref조작
- Then: 정해진frame에만영향,frame오류는명시된다.
- 검증 계획: `PLAN-C-DOMFRAMES-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-C-DOMFRAMES-003

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: open Shadow와 slot의 composed 텍스트·hit ancestry를 지원한다. closed Shadow·canvas·PDF 의미 분석은 이번 범위 밖이다.
- 근거: HIST-INLINE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: slot의summary안span과닫힌details
- When: snapshot/검색/입력
- Then: 닫힌본문은숨김,summary는제어가능,불가영역은명시한다.
- 검증 계획: `PLAN-C-DOMFRAMES-003`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-C-DOMFRAMES-004

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 프레임 detach/navigation 및 문서 교체를 식별하고 같은 frameId라도 오래된 document ref를 재사용하지 않는다.
- 근거: SKILL, CODE. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: ref발급후iframe src교체
- When: oldref클릭
- Then: stale오류와두문서무입력을확인한다.
- 검증 계획: `PLAN-C-DOMFRAMES-004`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-C-DOMFRAMES-005

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 양의 scale/translate 중첩 프레임과 OOPIF 좌표를 main viewport CSS 좌표에 맞춘다. rotate/skew/음수scale/3D는 사전 미지원 오류다.
- 근거: HIST-COMP, CODE. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 양의scale프레임과회전프레임
- When: boundingBox및입력
- Then: 지원frame은대상명중,미지원frame은무입력오류다.
- 검증 계획: `PLAN-C-DOMFRAMES-005`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-C-DOMFRAMES-006

- 수준/판단: **SHOULD / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 접근할 수 없는 프레임과 깊이 제한은 프레임 목록·snapshot에 이유와 재조회 경로를 남긴다.
- 근거: DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: sandbox또는로드중frame
- When: 전체snapshot
- Then: 일부오류가다른frame관찰을막지않고완전성은부분으로표시한다.
- 검증 계획: `PLAN-C-DOMFRAMES-006`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.
