# 공통 계약: files-events

범위: 이를 참조하는 API. 규범은 목표, 구현/통과 보고가 아니다. 잘못된 입력은 사전 거절한다. 브라우저 자체의 불가역 효과까지 원자성을 약속하지 않는다.

### REQ-C-FILESEVENTS-001

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/files-events.md#ref-files-events). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: FileInput은 Chrome호스트 로컬경로·세션서버asset·명시bytes/base64를 한 엔진으로 처리한다. 서버경로를 로컬경로로 해석하지 않는다.
- 근거: USR, CODE. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-C-FILESEVENTS-001-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-C-FILESEVENTS-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-files-events` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-C-FILESEVENTS-001-C01

- 조건: 같은 이름의 local/asset은 선택한 소스의 바이트를 쓴다.
- 준비: 이름 같고 hash 다른 local/asset
- 실행: 소스별 setFiles/drop
- 판정: 원소스 hash·이름·MIME이며 서버 경로를 local로 오인하지 않는다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-C-FILESEVENTS-002

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/files-events.md#ref-files-events). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (검토 1차 반영, 2026-11-01).
- 규범: 각 파일과 한 호출의 전체 파일 바이트 합은 각각32MiB 이하로 제한한다. single/multiple 개수·형식·asset 소유·로컬 권한을 전달 전 검증한다. 사전 오류는 기존 선택을 보존하고, 불가피한 중도 실패는 적용된 목록/불확실 여부를 밝힌다. 임시 DOM/file 자원은 정리한다.
- 근거: DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-C-FILESEVENTS-002-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-C-FILESEVENTS-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-files-events` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-C-FILESEVENTS-002-C01

- 조건: 파일 전체 사전 검증과 불가피한 부분 효과를 구분한다.
- 준비: 여러 파일 중 마지막 invalid·전송 중 fault
- 실행: 전달
- 판정: 사전 선택 보존·중도 적용 목록/불확실·임시 DOM0이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-C-FILESEVENTS-003

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/files-events.md#ref-files-events). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 다운로드는 실제 브라우저 이벤트/전송을 사용한다. 쿠키/POST/blob을 단순URL 재요청으로 대체하지 않는다.
- 근거: USR, CODE. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-C-FILESEVENTS-003-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-C-FILESEVENTS-003`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-files-events` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-C-FILESEVENTS-003-C01

- 조건: 다운로드는 브라우저의 인증 POST/blob 결과를 쓴다.
- 준비: 쿠키/POST/redirect/blob
- 실행: event→save
- 판정: URL 재요청 없이 원응답 hash·목적지 hash 일치다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-C-FILESEVENTS-004

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/files-events.md#ref-files-events). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (검토 2차 반영, 2026-11-01).
- 규범: event waiter는 등록 이후 같은 페이지/세션의 이벤트만 소비한다. timeout/reset은 단일 종결 후 제거한다. 자기 close event waiter는 정상 close metadata로 resolve하고 다른 waiter만 PAGE_CLOSED로 reject한다. 발급핸들은 실제 event identity와 수명을 가진다.
- 근거: DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-C-FILESEVENTS-004-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-C-FILESEVENTS-004`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-files-events` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-C-FILESEVENTS-004-C01

- 조건: 발급 event identity와 수명은 페이지/세션에 묶인다.
- 준비: dialog2개/oldchooser·close와 다른 wait
- 실행: old 핸들 조작/close
- 판정: 새 event 무변경·close만 metadata·나머지 PAGE_CLOSED·종결 1 회다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-C-FILESEVENTS-005

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/files-events.md#ref-files-events). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: wait는 조작 전에 등록한다. 동시 waiter 중 같은 가변 event의 소비 충돌은명시거절하고 늦은 event를 이미끝난wait에전달하지않는다.
- 근거: CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-C-FILESEVENTS-005-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-C-FILESEVENTS-005`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-files-events` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-C-FILESEVENTS-005-C01

- 조건: wait는 발생 전 등록하고 가변 event를 이중 소비하지 않는다.
- 준비: 등록 지연·동시 waiter·timeout 직후 event
- 실행: wait→click
- 판정: arming 후 action·중복 핸들 없음·늦은 waiter0이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-C-FILESEVENTS-006

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/files-events.md#ref-files-events). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (검토 1차 반영, 2026-11-01).
- 규범: FileInput source는 로컬 절대경로 문자열 또는 fileId/bytes/base64 중 정확히 하나를 가진 객체다. bytes는 일반 number[]만 지원하고 각 원소는0..255 정수다. Uint8Array·문자열·겹친 source는 사전 거절한다. base64는 RFC4648 표준 alphabet와 올바른 padding의 문자열로서 공백/URL-safe를 거절하고 빈문자열은0-byte다. bytes:[]도0-byte다.
- 근거: DESIGN. 설계 판단이며 현재 충족 증명이 아니다.
- 충족 상태: **미검증**. 구현/테스트는 다음 개발 범위다.
- Given: 아래 REQ-C-FILESEVENTS-006-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-C-FILESEVENTS-006`; [매핑](../verification-matrix.json).


- 상세화 판단: `DETAIL-files-events` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-C-FILESEVENTS-006-C01

- 조건: source는 하나,bytes는 0..255 정수 배열,base64는 표준 형식이다.
- 준비: 빈 파일·Uint8Array·[256,-1]·URL-safe·복수 source
- 실행: 세 파일 API
- 판정: 정상 0byte 포함·불량 전달 전 오류·강제 변환 없다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-C-FILESEVENTS-007

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/files-events.md#ref-files-events). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (검토 1차 반영, 2026-11-01).
- 규범: inline name은 생략 시 file.bin, mimeType은 application/octet-stream이다. name은 NUL을 거절하고 /와 역슬래시로 경로를 분리한 마지막 비어 있지 않은 basename을 사용하며 빈 basename은 거절한다. fileId의 이름/MIME은 서버 자산 메타데이터, 로컬은 실제 파일 메타데이터를 사용한다. 파일 수는 single input 최대1개, multiple/drop은32MiB 전송예산 안의 임의 개수며 별도 고정 개수 상한은 두지 않는다.
- 근거: DESIGN. 설계 판단이며 현재 충족 증명이 아니다.
- 충족 상태: **미검증**. 구현/테스트는 다음 개발 범위다.
- Given: 아래 REQ-C-FILESEVENTS-007-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-C-FILESEVENTS-007`; [매핑](../verification-matrix.json).

- 상세화 판단: `DETAIL-files-events` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-C-FILESEVENTS-007-C01

- 조건: 파일메타/inline MIME/dropdata는파일상세표의타입·생략기본·정규화·빈값정책을쓴다.
- 준비: name/mimeType 숫자/null/빈값·유효MIME대소문자·data{}와text/plain빈문자열·files[]조합을준비한다.
- 실행: setFiles/chooser/drop을각입력으로호출한다.
- 판정: invalid명시메타는사전입력0,유효MIME은소문자,data빈문자열은전달·빈record는payload없음·text-only파일목록[]이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

## 파일과 이벤트 상세표

|정책|v1 계약|
|---|---|
|메타데이터|명시 inline name/mimeType은문자열만허용. 생략만file.bin/application/octet-stream 기본값. 명시빈name/빈mimeType/null/number는사전거절. 기존basename/NUL 규칙유지.|
|MIME문법|명시inline mimeType/drop.data key는ASCII MIME token(type/subtype 각각 A-Z,a-z,0-9 및 !#$%&'*+-.^_`|~ 허용)의 type와subtype사이슬래시1개,공백/제어문자/매개변수없음. IANA등록목록으로제한하지않고ASCII소문자로정규화. native/asset 메타는브라우저/서버원본의ASCII MIME값(unknown빈type·매개변수포함가능)을File.type의소문자정규화로전달하며사용자inline문법과혼동하지않음.|
|drop.data|일반 record의own MIME key→string value. key1개이상이면payload가있고빈문자열value도유효하다. {}는없음. files=[]단독은drop오류,[]+유효data는text-only이며반환파일목록[]. setFiles[]해제는별개.|
|가변wait|같은Page/세션/event의dialog/filechooser 활성waiter는1개. 두번째등록을EVENT_WAITER_CONFLICT로즉시reject하고첫wait/arming/deadline보존. 첫terminal뒤다음등록허용.|
|관찰wait|popup/download/close는같은다음event identity를각등록waiter에한번공유한다. download save/cancel은기존id멱등/최종상태정책을따른다.|
|기존dialog복구|waitForEvent('dialog',{includeCurrent:true})는현재열린자기Page의기록된dialog를조회해현세대핸들을발급한다. 없으면CURRENT_EVENT_NOT_FOUND,같은세대에유효핸들이이미있으면EVENT_ALREADY_CLAIMED. reset은기존핸들만무효화하므로현세대에서다시획득할수있음. 자동accept/dismiss하지않음.|

includeCurrent 기본false는등록후이벤트만기다리는기존계약이다. true는dialog에서만허용하고다른event는UNSUPPORTED_EVENT_OPTION으로거절한다. current-query는미래event를기다리는waiter가아니며없으면즉시오류다. 실제dialog identity는현재기록/native닫힘과대조한다. 다운로드/chooser의reset후범용재획득까지약속하지않으며기록된자산/완료파일수명은runtime표를따른다. 필요하면별도후속요구로조사한다.

한도/스키마/소유검증은입력전이다. 전송중불가피한오류는적용목록/불확실과임시자원정리를기록하며원자적rollback을위장하지않는다.
