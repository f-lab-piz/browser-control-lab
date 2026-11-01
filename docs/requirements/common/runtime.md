# 공통 계약: runtime

범위: 이를 참조하는 API. 규범은 목표, 구현/통과 보고가 아니다. 잘못된 입력은 사전 거절한다. 브라우저 자체의 불가역 효과까지 원자성을 약속하지 않는다.

### REQ-C-RUNTIME-001

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 外部 도구는 guide/reset/js 세 개를 유지한다. 관리 HTTP endpoint와 내부64개는 외부 도구 수에 포함하지 않는다.
- 근거: USR, SCOPE. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 세션 생성·파일 전달 관리경로가 있는 환경
- When: guide의 공개도구목록을 조회
- Then: 3개와 관리경로 역할이 구분된다.
- 검증 계획: `PLAN-C-RUNTIME-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-C-RUNTIME-002

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: JS는 확장 내 세션별 QuickJS에서 실행하고 외부 중계기는 제품코드 평가를 대신하지 않는다.
- 근거: USR, CODE. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 두 세션에 같은 변수명을 선언
- When: 한 세션에서 변경후 다른세션조회
- Then: 변수·출력·핸들소유가 독립이다.
- 검증 계획: `PLAN-C-RUNTIME-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-C-RUNTIME-003

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: reset/timeout은 이전세대 대기·late결과를 구분하고 브라우저에 이미 발생한 효과는 rollback했다고 주장하지 않는다.
- 근거: USR, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 입력 후 long wait가 남은 요청
- When: reset후 새요청실행
- Then: 이전값·결과가 섞이지 않으며 이미변경된 웹값은 그대로다.
- 검증 계획: `PLAN-C-RUNTIME-003`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-C-RUNTIME-004

- 수준/판단: **MUST / 수용** (검토 1차 반영, 2026-11-01).
- 규범: 시간·메모리·코드·텍스트·이미지 예산을 guide에 안내하고 초과는 잘림/취소/실행실패로 구분한다. 기본30초(허용50..120000ms), 코드64KiB UTF-8, VM64MiB·stack512KiB, 텍스트64KiB UTF-8를 적용한다. 이미지 한도와 결합 블록 수는 아래 출력 계약을 따른다.
- 근거: CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 기본30초/64KiB코드/64MiB메모리/64KiB출력·256블록 환경
- When: 경계와초과입력실행
- Then: 예산정책과 오류가 일치하고 새세션/세대 복구가능하다.
- 검증 계획: `PLAN-C-RUNTIME-004`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-C-RUNTIME-005

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 비멱등 입력은 응답 유실만으로 자동 재실행하지 않는다. 같은 requestId는 같은 요청에만 재사용하고 payload 충돌을 거절한다.
- 근거: DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 한번만 증가해야하는 클릭요청
- When: 동일id·동일payload재조회및다른payload재전송
- Then: 업무효과1회,다른payload오류,불확실완료는불확실로표시한다.
- 검증 계획: `PLAN-C-RUNTIME-005`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-C-RUNTIME-006

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 연결·인증·session 소유 실패를 정상 빈 결과와 구분하고 타세션 핸들·asset·출력을 읽거나 변경하지 않는다.
- 근거: CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 서로다른session과잘못된token
- When: 교차핸들/asset접근
- Then: 오류와무부작용을확인한다.
- 검증 계획: `PLAN-C-RUNTIME-006`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-C-RUNTIME-007

- 수준/판단: **MUST / 수용** (검토 1차 반영, 2026-11-01).
- 규범: 이미지 출력은 디코딩한 파일 bytes 기준 한 이미지4MiB/요청 합8MiB/최대4장, 텍스트+이미지+진단 합256블록이다. 텍스트64KiB는 이미지 base64를 포함하지 않는다. 요청별 전체 결과 JSON 전송 한도는16MiB UTF-8다. 정상 한도 이내 이미지도 VM/캡처 환경 실패를 숨기지 않는다.
- 근거: DESIGN. 설계 판단이며 현재 충족 증명이 아니다.
- 충족 상태: **미검증**. 구현/테스트는 다음 개발 범위다.
- Given: 텍스트/고엔트로피 PNG를 각 한도 직전·정확히·초과로 준비하고 혼합 출력한다.
- When: before 로그→display→after 로그 및 블록 경계를 실행한다.
- Then: 정상 이미지는 원바이트의 완전 블록이다. 한도 초과 이미지는 통째로 생략하고 truncated/이유를 출력 envelope에 남기며 다른 유효 로그는 예산 내 보존한다. 결과가 한도를 넘으면 전송 실패로 구분한다.
- 검증 계획: `PLAN-C-RUNTIME-007`; [매핑](../verification-matrix.json).

### REQ-C-RUNTIME-008

- 수준/판단: **MUST / 수용** (검토 3차 반영, 2026-11-01).
- 규범: 페이지 evaluate/evaluateAll/waitForFunction은 Promise/thenable 반환을 최종 settle까지 기다린 뒤 값을 판정한다. arg 생략/undefined는 null로 전달한다. 인자/최종 결과는 null/boolean/string/유한 number/이들로만 구성된 조밀한 Array·일반 Object의 JSON 값이어야 한다. 결과 undefined, NaN/Infinity, BigInt/Symbol/function/DOM node/순환/undefined 필드·희소배열은 직렬화 오류로 거절하며 성공 null로 바꾸지 않는다. async reject/throw는 함수 오류, timeout/reset은 실행/대기 취소로 구분한다. 이미 일어난 사용자 함수 효과는 남으며 단일 evaluate를 자동 재실행하지 않는다.
- 근거: DESIGN. 설계 판단이며 현재 충족 증명이 아니다.
- 충족 상태: **미검증**. 구현/테스트는 다음 개발 범위다.
- Given: 동기 JSON/null, async resolve(7)/resolve(false)/reject/never-settle, undefined·순환·DOM node와 효과 후 실패 함수를 격리 fixture에 둔다.
- When: 각 평가·함수 대기에서 정상/오류/deadline/reset을 적용한다.
- Then: 평가는 JSON 결과만 반환하고 Promise 자체를 truthy로 판단하지 않는다. 부적합 결과/함수 오류가 구분되며 부분 효과와 late 결과 차단이 확인된다.
- 검증 계획: `PLAN-C-RUNTIME-008`; [매핑](../verification-matrix.json).
