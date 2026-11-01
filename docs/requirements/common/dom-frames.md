# 공통 계약: dom-frames

범위: 이를 참조하는 API. 규범은 목표, 구현/통과 보고가 아니다. 잘못된 입력은 사전 거절한다. 브라우저 자체의 불가역 효과까지 원자성을 약속하지 않는다.

### REQ-C-DOMFRAMES-001

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/snapshot-frames.md#ref-dom-frames). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: snapshot/selector/상태 조회 등 관찰 API의 기본 범위는 현재 연결 DOM의 화면 밖 영역까지다. 이들 관찰은 scroll·click·추가 데이터 로딩을 발생시키지 않는다. evaluate/evaluateAll/waitForFunction의 사용자 함수는 명시적으로 효과를 낼 수 있으며 무조작 관찰 보장의 예외다.
- 근거: USR, SKILL. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-C-DOMFRAMES-001-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-C-DOMFRAMES-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-dom-frames` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-C-DOMFRAMES-001-C01

- 조건: 관찰은 연결 DOM 범위만 읽고 scroll/추가 로딩을 발생시키지 않는다.
- 준비: offscreen과 미로드 virtual 행
- 실행: snapshot/selector/상태 조회
- 판정: offscreen 발견·미로드 미관찰·scroll/request 불변이며 effectful evaluate는 별도다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-C-DOMFRAMES-002

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/snapshot-frames.md#ref-dom-frames). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: Frame Scope는 선택 프레임과 연결된 자식 관찰 범위를 명시한다. CSS/role/text 선택은 해당 document에 한정하고 ref는 발급frame로 라우팅한다.
- 근거: USR, CODE. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-C-DOMFRAMES-002-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-C-DOMFRAMES-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-dom-frames` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-C-DOMFRAMES-002-C01

- 조건: Scope 선택과 snapshot 자식 프레임 관찰 범위를 구분한다.
- 준비: main/중첩/형제에 동일 CSS
- 실행: frame별 locator와 snapshot
- 판정: locator는 지정 document·기본 snapshot은 명시한 하위 범위이며 ref는 발급 frame이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-C-DOMFRAMES-003

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/snapshot-frames.md#ref-dom-frames). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: open Shadow와 slot의 composed 텍스트·hit ancestry를 지원한다. closed Shadow·canvas·PDF 의미 분석은 이번 범위 밖이다.
- 근거: HIST-INLINE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-C-DOMFRAMES-003-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-C-DOMFRAMES-003`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-dom-frames` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-C-DOMFRAMES-003-C01

- 조건: open shadow/slot와 닫힌 details의 composed 경계를 따른다.
- 준비: summary 안 slotbutton과 닫힌 본문 shadow
- 실행: 관찰/검색/click
- 판정: summary 제어 가능·본문 숨김·closedShadow의 의미 지원 주장 없다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-C-DOMFRAMES-004

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/snapshot-frames.md#ref-dom-frames). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 프레임 detach/navigation 및 문서 교체를 식별하고 같은 frameId라도 오래된 document ref를 재사용하지 않는다.
- 근거: SKILL, CODE. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-C-DOMFRAMES-004-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-C-DOMFRAMES-004`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-dom-frames` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-C-DOMFRAMES-004-C01

- 조건: 같은 frameId라도 document 교체는 ref를 무효화한다.
- 준비: iframe src 교체 전 ref
- 실행: oldref 읽기/click
- 판정: stale document·두 문서 입력 0이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-C-DOMFRAMES-005

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/snapshot-frames.md#ref-dom-frames). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 양의 scale/translate 중첩 프레임과 OOPIF 좌표를 main viewport CSS 좌표에 맞춘다. rotate/skew/음수scale/3D는 사전 미지원 오류다.
- 근거: HIST-COMP, CODE. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-C-DOMFRAMES-005-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-C-DOMFRAMES-005`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-dom-frames` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-C-DOMFRAMES-005-C01

- 조건: 양의 scale/translate만 지원하고 입력은 모든 조상 hit를 확인한다.
- 준비: 중첩 OOPIF/부모 overlay/rotate/skew/음수/3D
- 실행: box/point/click
- 판정: 지원 좌표 일치·가림/미지원은 사전 오류·다른 대상 입력 0이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-C-DOMFRAMES-006

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/snapshot-frames.md#ref-dom-frames). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **SHOULD / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 접근할 수 없는 프레임과 깊이 제한은 프레임 목록·snapshot에 이유와 재조회 경로를 남긴다.
- 근거: DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-C-DOMFRAMES-006-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-C-DOMFRAMES-006`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

- 상세화 판단: `DETAIL-dom-frames` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-C-DOMFRAMES-006-C01

- 조건: 접근 불가 frame과 DOM 노드 깊이 제한은 서로 다른 부분 관찰 이유로 표시한다.
- 준비: 접근 불가 iframe과 별도로 문서 내부 snapshot maxDepth:0 사례를 준비한다.
- 실행: snapshot
- 판정: 정상 frame 관찰은 유지한다. frame 접근 오류와 노드 depthLimited를 구분하며 maxDepth를 frame 재귀 깊이로 해석하지 않는다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.
