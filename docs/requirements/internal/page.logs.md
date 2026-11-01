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

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 페이지콘솔/오류로그를시간·level로조회하고REPLconsole.log출력과구분한다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 독립 세션·해당 Page/Scope/핸들을 준비한다. 입력 계약: options.since?:epoch ms, level?:지원level.
- When: `page.logs`를 정상 입력으로 호출하고 반환/실제 효과를 독립 판독한다.
- Then: 페이지콘솔/오류로그를시간·level로조회하고REPLconsole.log출력과구분한다.
- 검증 계획: `PLAN-PAGE-LOGS-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-PAGE-LOGS-002

- 수준/판단: **MUST / 수용** (검토 1차 반영, 2026-11-01).
- 규범: 페이지별 최근1000개를 보관하며 수집 시작시각·보관범위·누적 dropped·partial을 collection에 제공한다. attach 전 기간과 overflow가 since 범위에 걸리면 partial=true다. 실제 로그 entries에 합성 warning을 섞지 않고 다른 페이지/세션 로그를 포함하지 않는다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: attach 이전 로그, 1002개 이후 로그, 빈 로그와 같은시각의 로그를 준비한다.
- When: since 경계와 level 필터로 page.logs를 조회한다.
- Then: entries는 at>since와 level 정확 일치, collection은 필터 전 수집 보관 범위와 dropped를 표시하며 미수집을 무로그로 오인하지 않는다.
- 검증 계획: `PLAN-PAGE-LOGS-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

## 현재 사실과 근거 한계

기준 구현은 `700a6a06af3f97729327afaf9becb4ee29bb475b`. [카탈로그](../../api-catalog.json)의 과거 상태 `verified-basic`는 기본 호출/당시 제한 기록이다. 본 명세의 모든 옵션·반례 충족을 뜻하지 않는다. [기존 테스트 연결](../../api-test-matrix.json)은 후보이며 소스 fingerprint가 현재와 다른 부분은 과거 증거다. 새 제품 테스트는 이번에 실행·추가하지 않았다. 규범과 다른 코드가 보이면 규범을 낮추지 않고 backlog에서 조사한다.
