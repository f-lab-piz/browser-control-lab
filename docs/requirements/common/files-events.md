# 공통 계약: files-events

범위: 이를 참조하는 API. 규범은 목표, 구현/통과 보고가 아니다. 잘못된 입력은 사전 거절한다. 브라우저 자체의 불가역 효과까지 원자성을 약속하지 않는다.

### REQ-C-FILESEVENTS-001

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: FileInput은 Chrome호스트 로컬경로·세션서버asset·명시bytes/base64를 한 엔진으로 처리한다. 서버경로를 로컬경로로 해석하지 않는다.
- 근거: USR, CODE. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 동명이지만다른바이트인local/asset
- When: 각setFiles
- Then: 업로드바이트hash·이름·MIME이선택소스와같다.
- 검증 계획: `PLAN-C-FILESEVENTS-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-C-FILESEVENTS-002

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 파일 개수/multiple·단일32MiB·형식·asset소유·접근권한을 전달전 검증하고 실패시 부분효과 여부를 밝힌다. 임시 DOM/file자원은 정리한다.
- 근거: DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 여러파일중마지막만invalid
- When: setFiles/drop
- Then: 사전오류면기존선택보존·임시요소0;중도오류면적용목록명시다.
- 검증 계획: `PLAN-C-FILESEVENTS-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-C-FILESEVENTS-003

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 다운로드는 실제 브라우저 이벤트/전송을 사용한다. 쿠키/POST/blob을 단순URL 재요청으로 대체하지 않는다.
- 근거: USR, CODE. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 인증POST및blob다운로드
- When: waitForEvent후save
- Then: 브라우저원본과저장hash가같다.
- 검증 계획: `PLAN-C-FILESEVENTS-003`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-C-FILESEVENTS-004

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: event waiter는 등록 이후 같은 페이지/세션의 이벤트만 소비한다. timeout/close/reset은 해제하며 발급핸들은 실제event identity와수명을 가진다.
- 근거: DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 두dialog/chooser가순서대로발생
- When: 첫핸들재사용
- Then: 두번째event에영향없고stale오류다.
- 검증 계획: `PLAN-C-FILESEVENTS-004`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-C-FILESEVENTS-005

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: wait는 조작 전에 등록한다. 동시 waiter 중 같은 가변 event의 소비 충돌은명시거절하고 늦은 event를 이미끝난wait에전달하지않는다.
- 근거: CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: wait→click→event와waittimeout→event
- When: 동시/지연대기
- Then: 인과순서와소비정책을검증하며누수0이다.
- 검증 계획: `PLAN-C-FILESEVENTS-005`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.
