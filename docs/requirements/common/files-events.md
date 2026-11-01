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

- 수준/판단: **MUST / 수용** (검토 1차 반영, 2026-11-01).
- 규범: 각 파일과 한 호출의 전체 파일 바이트 합은 각각32MiB 이하로 제한한다. single/multiple 개수·형식·asset 소유·로컬 권한을 전달 전 검증한다. 사전 오류는 기존 선택을 보존하고, 불가피한 중도 실패는 적용된 목록/불확실 여부를 밝힌다. 임시 DOM/file 자원은 정리한다.
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

### REQ-C-FILESEVENTS-006

- 수준/판단: **MUST / 수용** (검토 1차 반영, 2026-11-01).
- 규범: FileInput source는 로컬 절대경로 문자열 또는 fileId/bytes/base64 중 정확히 하나를 가진 객체다. bytes는 일반 number[]만 지원하고 각 원소는0..255 정수다. Uint8Array·문자열·겹친 source는 사전 거절한다. base64는 RFC4648 표준 alphabet와 올바른 padding의 문자열로서 공백/URL-safe를 거절하고 빈문자열은0-byte다. bytes:[]도0-byte다.
- 근거: DESIGN. 설계 판단이며 현재 충족 증명이 아니다.
- 충족 상태: **미검증**. 구현/테스트는 다음 개발 범위다.
- Given: 정상 바이너리/0-byte와 [256,-1], Uint8Array, 중복 source, 공백/URL-safe base64를 준비한다.
- When: setFiles/chooser.setFiles/drop의 공통 입력으로 전달한다.
- Then: 정상 바이트 hash 일치, 잘못된 형식은 강제 변환 없이 전달 전 오류며 기존 선택/대상은 불변이다.
- 검증 계획: `PLAN-C-FILESEVENTS-006`; [매핑](../verification-matrix.json).

### REQ-C-FILESEVENTS-007

- 수준/판단: **MUST / 수용** (검토 1차 반영, 2026-11-01).
- 규범: inline name은 생략 시 file.bin, mimeType은 application/octet-stream이다. name은 NUL을 거절하고 /와 역슬래시로 경로를 분리한 마지막 비어 있지 않은 basename을 사용하며 빈 basename은 거절한다. fileId의 이름/MIME은 서버 자산 메타데이터, 로컬은 실제 파일 메타데이터를 사용한다. 파일 수는 single input 최대1개, multiple/drop은32MiB 전송예산 안의 임의 개수며 별도 고정 개수 상한은 두지 않는다.
- 근거: DESIGN. 설계 판단이며 현재 충족 증명이 아니다.
- 충족 상태: **미검증**. 구현/테스트는 다음 개발 범위다.
- Given: Unicode·중복명·경로분리자·빈basename·single/multiple과 혼합 source를 준비한다.
- When: 파일 선택/삭제 또는 drop한다.
- Then: 기본/안전이름·MIME·원본바이트를 보존하며 invalid 이름/개수는 전달 전 거절한다. 중복명은 허용하고 서로 다른 파일 바이트를 합치지 않는다.
- 검증 계획: `PLAN-C-FILESEVENTS-007`; [매핑](../verification-matrix.json).
