# 공통 계약: runtime

범위: 이를 참조하는 API. 규범은 목표, 구현/통과 보고가 아니다. 잘못된 입력은 사전 거절한다. 브라우저 자체의 불가역 효과까지 원자성을 약속하지 않는다.

### REQ-C-RUNTIME-001

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/runtime-output.md#ref-runtime). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 外部 도구는 guide/reset/js 세 개를 유지한다. 관리 HTTP endpoint와 내부64개는 외부 도구 수에 포함하지 않는다.
- 근거: USR, SCOPE. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-C-RUNTIME-001-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-C-RUNTIME-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-runtime` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-C-RUNTIME-001-C01

- 조건: 논리 외부 도구와 관리 경로/API 수를 구분한다.
- 준비: guide와 session/asset 관리 경로
- 실행: 안내와 색인 대조
- 판정: 외부 3·내부 64이며 관리 endpoint를 4번째 도구로 세지 않는다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-C-RUNTIME-002

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/runtime-output.md#ref-runtime). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: JS는 확장 내 세션별 QuickJS에서 실행하고 외부 중계기는 제품코드 평가를 대신하지 않는다.
- 근거: USR, CODE. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-C-RUNTIME-002-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-C-RUNTIME-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-runtime` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-C-RUNTIME-002-C01

- 조건: 세션 변수/출력/핸들은 확장 QuickJS 별로 격리한다.
- 준비: 같은 이름의 변수와 서로 다른 자기 소유 탭을 가진 독립 세션2개를 준비한다.
- 실행: 한쪽 변경 후 양쪽 조회
- 판정: 변수/출력/소유 독립·Node 평가 대체 없다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-C-RUNTIME-003

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/runtime-output.md#ref-runtime). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: reset/timeout은 이전세대 대기·late결과를 구분하고 브라우저에 이미 발생한 효과는 rollback했다고 주장하지 않는다.
- 근거: USR, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-C-RUNTIME-003-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-C-RUNTIME-003`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-runtime` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-C-RUNTIME-003-C01

- 조건: 세대 종결은 late 결과를 차단하되 웹 효과를 남긴다.
- 준비: 값변경뒤긴wait가있는세션에서(a)명시reset/실제VM재생성실행제한,(b)VM재생성없는하위wait timeout을독립run으로준비한다.
- 실행: 각종결후generation/runtimeReset·기존binding·페이지marker/asset·late출력을읽는다.
- 판정: (a)는새generation·oldbinding없음,(b)는같은generation·기존binding유지다. 둘다종결1회·late결과혼합0·웹값/asset보존이며재생성여부를결과에명시한다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-C-RUNTIME-004

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/runtime-output.md#ref-runtime). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (검토 1차 반영, 2026-11-01).
- 규범: 시간·메모리·코드·텍스트·이미지 예산을 guide에 안내하고 초과는 잘림/취소/실행실패로 구분한다. 기본30초(허용50..120000ms), 코드64KiB UTF-8, VM64MiB·stack512KiB, 텍스트64KiB UTF-8를 적용한다. 이미지 한도와 결합 블록 수는 아래 출력 계약을 따른다.
- 근거: CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-C-RUNTIME-004-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-C-RUNTIME-004`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-runtime` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-C-RUNTIME-004-C01

- 조건: 실행 한도는 명시된 단위와 오류를 쓴다.
- 준비: 50/30000/120000ms·64KiB 코드·메모리/stack 초과
- 실행: 경계/초과 실행
- 판정: 허용 경계와 명시 제한 오류·다음 실행 복구를 구분한다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-C-RUNTIME-005

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/runtime-output.md#ref-runtime). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 비멱등 입력은 응답 유실만으로 자동 재실행하지 않는다. 같은 requestId는 같은 요청에만 재사용하고 payload 충돌을 거절한다.
- 근거: DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-C-RUNTIME-005-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-C-RUNTIME-005`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-runtime` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-C-RUNTIME-005-C01

- 조건: requestId 재조회는 효과 1 회를 유지한다.
- 준비: counter 증가 클릭
- 실행: 같은 ID 같은/다른 payload 동시 접수
- 판정: 같은 결과 공유·충돌 거절·counter1·유실 시 자동 재실행 없다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-C-RUNTIME-006

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/runtime-output.md#ref-runtime). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 연결·인증·session 소유 실패를 정상 빈 결과와 구분하고 타세션 핸들·asset·출력을 읽거나 변경하지 않는다.
- 근거: CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-C-RUNTIME-006-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-C-RUNTIME-006`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-runtime` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-C-RUNTIME-006-C01

- 조건: 소유/인증 실패는 정상 빈값과 다르다.
- 준비: 잘못된 token·타세션 tab/asset
- 실행: 접근
- 판정: 권한 오류·데이터 비노출·무변경이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-C-RUNTIME-007

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/runtime-output.md#ref-runtime). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (검토 1차 반영, 2026-11-01).
- 규범: 이미지 출력은 디코딩한 파일 bytes 기준 한 이미지4MiB/요청 합8MiB/최대4장, 텍스트+이미지+진단 합256블록이다. 텍스트64KiB는 이미지 base64를 포함하지 않는다. 요청별 전체 결과 JSON 전송 한도는16MiB UTF-8다. 정상 한도 이내 이미지도 VM/캡처 환경 실패를 숨기지 않는다.
- 근거: DESIGN. 설계 판단이며 현재 충족 증명이 아니다.
- 충족 상태: **미검증**. 구현/테스트는 다음 개발 범위다.
- Given: 아래 REQ-C-RUNTIME-007-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-C-RUNTIME-007`; [매핑](../verification-matrix.json).


- 상세화 판단: `DETAIL-runtime` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-C-RUNTIME-007-C01

- 조건: 이미지/텍스트/전체 결과 한도를 분리 계산한다.
- 준비: 텍스트 64KiB·이미지 4MiB/합 8MiB/4장·256 블록·16MiB 결과
- 실행: 경계 혼합 출력
- 판정: 한도 내 원이미지·초과 이미지 전체 생략/원인·부분 base64 없음이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-C-RUNTIME-008

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/runtime-output.md#ref-runtime). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (검토 3차 반영, 2026-11-01).
- 규범: 페이지 evaluate/evaluateAll/waitForFunction은 Promise/thenable 반환을 최종 settle까지 기다린 뒤 값을 판정한다. arg 생략/undefined는 null로 전달한다. 인자/최종 결과는 null/boolean/string/유한 number/이들로만 구성된 조밀한 Array·일반 Object의 JSON 값이어야 한다. 결과 undefined, NaN/Infinity, BigInt/Symbol/function/DOM node/순환/undefined 필드·희소배열은 직렬화 오류로 거절하며 성공 null로 바꾸지 않는다. async reject/throw는 함수 오류, timeout/reset은 실행/대기 취소로 구분한다. 이미 일어난 사용자 함수 효과는 남으며 단일 evaluate를 자동 재실행하지 않는다.
- 근거: DESIGN. 설계 판단이며 현재 충족 증명이 아니다.
- 충족 상태: **미검증**. 구현/테스트는 다음 개발 범위다.
- Given: 아래 REQ-C-RUNTIME-008-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-C-RUNTIME-008`; [매핑](../verification-matrix.json).

- 상세화 판단: `DETAIL-runtime` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-C-RUNTIME-008-C01

- 조건: Promise settle 뒤 JSON만 반환하고 undefined와 null을 구분한다.
- 준비: async7/false/reject·undefined/null/순환/DOMnode
- 실행: 평가와 함수 대기
- 판정: JSON 정상·undefined 직렬화 오류·reject 즉시 함수 오류·효과 후 실패는 남는다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

## 실행과 수명 상세표

이 표는 우리 설계 선택이며 경쟁 제품 지원/현재 구현과 다를 수 있다.

|항목|수용 계약|
|---|---|
|top-level binding|var/let/const는 세대 안에서 유지한다. let/const 이름의 재선언과 var↔lexical 충돌은 요청 실행 전 거절한다. 이 요청의 선행 marker도 실행0이며 기존 binding은 유지한다. var→var 재선언/재할당과 let 재할당은 허용, const 재할당은 오류다. 선언종류를 자동 변환해 이 계약을 우회하지 않는다.|
|wait timeout|명시 값은 유한 양의 정수 number(ms). boolean/string/NaN/Infinity/0/음수/소수는 등록/입력 전에 거절. 생략/undefined는 기존 기본값(locator.waitFor5000, Page wait10000ms).|
|총 deadline|JS에서 wait 호출한 시각부터 queue/arming/setup/poll/Promise settle을 포함. 바깥 js deadline과 이른 값이 우선이며 재평가로 연장하지 않음. 제어 clock oracle와 실환경 허용오차를 구분.|
|session reset|JS 세대 갱신, 구세대 핸들/미전송명령/late결과 무효. 실제 탭·소유는 같은 세션에 유지하고 browser.attach(id)로 새 핸들을 얻는다. 세션 server asset과 완료 local파일은 유지한다. reset은 웹값을 rollback하지 않음.|
|timeout|해당 실행을 단일 종결한다. CPU/메모리/실행제한으로 VM을 재생성했다면 generation 변경/runtimeReset을 결과에 명시한다. 단순 하위 wait timeout은 VM 전체 reset을 의미하지 않음.|
|Page close|그 Page의 핸들/대기/눌림만 정리. 다른 자기 Page와 타세션은 유지. 해당 Page의 close wait는 정상, 나머지는PAGE_CLOSED.|
|멱등 기록|requestId의 종결/tombstone과 payload digest는 세대를 넘어 session동안 유지하며 같은id입력을 재실행하지 않음. payload 충돌은거절. server asset은session동안유지. bridge종료/관리층session삭제후는더이상유효하지않고복구/업무취소를보장하지않음.|
|데이터 ref|발급 ref 문자열은 같은 세션·Page·document·연결 element이면 reset만으로 대상이 바뀌지 않는다. JS 객체 핸들/구세대 명령과 구분. 실제 문서교체/분리는 stale.|

기존 프로토타입의 top-level 선언 전역 property 변환과 달라지는 목표 계약이다. 기존 재선언 허용 테스트/guide는 구현 단계에서 버전·예제와 함께 이행한다. 이 선택은 현재 코드에 맞춰 요구를 낮추기보다 일반 lexical 예측 가능성을 우선한 결정이다.


## 요청 식별자의 전송 정책

requestId는 생략하거나 비어 있지 않은 JavaScript 문자열이다. 한글·예약문자·dot segment·NUL·UTF-16 surrogate도 JSON escape로 ID 원문을 유지한다. 기본 결과 조회는 POST /v1/requests의 {requestId} 본문이며 수용된 접수 본문보다 작은 조회 데이터를 같은 JSON 경로로 전달한다. 짧은 ID의 GET query/경로 조회도 호환한다. ID를 URL/header 길이로 제한하거나 다른 요청 결과로 대체하지 않는다. 런타임 진단 파일명에는 임의 ID를 삽입하지 않고 짧은 순번을 사용한다. 이는 REQ-C-RUNTIME-005/REQ-JS-002의 기존 식별 계약을 구현하며 별도 외부 도구를 추가하지 않는다.
