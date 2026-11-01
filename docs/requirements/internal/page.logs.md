# page.logs

## 계약과 적용 범위

대상: 확장 QuickJS에 공개하는 기존 API.

공통 계약: [runtime](../common/runtime.md). Page/Frame의 Scope 메서드는 같은 API로 센다. 공통 필수 조건도 이 API의 개발 수용 기준에 포함한다.

- 목적: 페이지콘솔/오류로그를시간·level로조회하고REPLconsole.log출력과구분한다.
- 입력/기본값: options.since?:epoch ms, level?:지원level.
- 출력/성공 의미: Promise<{entries:Array<{at:number,level:string,text:string}>,collection:{startedAt:number,retainedFrom:number|null,retainedTo:number|null,dropped:number,partial:boolean}}>. since는 at>since, level은 정확 일치. level은 log/debug/info/warning/error/assert 등 수집한 Chrome console type 문자열이다. 배열 반환에서 envelope로의 목표 변경이며 개발에서 guide/호출 예제를 함께 이행한다.
- 허용 부작용: 로그조회만.
- 오류/경계: 버퍼범위·유실·미수집기간을표시하며다른페이지/세션의민감로그를섞지않는다.
- 재시도: 읽기는 최신 문서 상태로 다시 관찰할 수 있다. 입력은 완료 여부를 먼저 확인하며 응답 유실만으로 재전송하지 않는다.
- 지원: Chrome debugger/CDP, 허용된 HTTP(S), 현재 연결 DOM. Firefox/Safari·closed Shadow·모든 사이트 완전 지원은 이번 약속이 아니다.

## 개별 요구사항

### REQ-PAGE-LOGS-001

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/lifecycle-evaluation.md#ref-page-logs). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 페이지콘솔/오류로그를시간·level로조회하고REPLconsole.log출력과구분한다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-PAGE-LOGS-001-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-PAGE-LOGS-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-page.logs` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-PAGE-LOGS-001-C01

- 조건: entries는since초과/level정확일치로필터한다.
- 준비: 같은ms의log/debug/error와빈버퍼
- 실행: logs since/level
- 판정: at>since인정확level만반환·REPL로그와구분한다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-PAGE-LOGS-002

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/lifecycle-evaluation.md#ref-page-logs). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (검토 1차 반영, 2026-11-01).
- 규범: 페이지별 최근1000개를 보관하며 수집 시작시각·보관범위·누적 dropped·partial을 collection에 제공한다. attach 전 기간과 overflow가 since 범위에 걸리면 partial=true다. 실제 로그 entries에 합성 warning을 섞지 않고 다른 페이지/세션 로그를 포함하지 않는다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-PAGE-LOGS-002-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-PAGE-LOGS-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-page.logs` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-PAGE-LOGS-002-C01

- 조건: collection은수집전/유실/보관범위를실제로그와분리한다.
- 준비: attach전로그와1002개발생
- 실행: logs
- 판정: 최근1000·dropped/partial·시작/보관시각이맞고합성warning/타페이지로그없다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

## 현재 사실과 근거 한계

기준 구현은 `700a6a06af3f97729327afaf9becb4ee29bb475b`. [카탈로그](../../api-catalog.json)의 과거 상태 `verified-basic`는 기본 호출/당시 제한 기록이다. 본 명세의 모든 옵션·반례 충족을 뜻하지 않는다. [기존 테스트 연결](../../api-test-matrix.json)은 후보이며 소스 fingerprint가 현재와 다른 부분은 과거 증거다. 새 제품 테스트는 이번에 실행·추가하지 않았다. 규범과 다른 코드가 보이면 규범을 낮추지 않고 backlog에서 조사한다.
