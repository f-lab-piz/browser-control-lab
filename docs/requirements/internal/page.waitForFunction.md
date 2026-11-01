# page.waitForFunction

## 계약과 적용 범위

대상: 확장 QuickJS에 공개하는 기존 API.

공통 계약: [runtime](../common/runtime.md), [dom-frames](../common/dom-frames.md). Page/Frame의 Scope 메서드는 같은 API로 센다. 공통 필수 조건도 이 API의 개발 수용 기준에 포함한다.

- 목적: Page main frame에서 arg를 받아 truthy를 제한시간까지 기다리고 closure는지원하지않는다.
- 입력/기본값: fn:직렬화가능함수,arg?:JSON, options.timeout?:positive ms(기본10000).
- 출력/성공 의미: Promise<JSON> 최초truthy값.
- 허용 부작용: 매 polling 페이지 함수실행;사용자함수 부작용가능.
- 오류/경계: 함수오류·navigation재시도·직렬화불가를구분하며 sideeffect있는함수는반복실행됨을안내한다.
- 재시도: 읽기는 최신 문서 상태로 다시 관찰할 수 있다. 입력은 완료 여부를 먼저 확인하며 응답 유실만으로 재전송하지 않는다.
- 지원: Chrome debugger/CDP, 허용된 HTTP(S), 현재 연결 DOM. Firefox/Safari·closed Shadow·모든 사이트 완전 지원은 이번 약속이 아니다.

## 개별 요구사항

### REQ-PAGE-WAITFORFUNCTION-001

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/lifecycle-evaluation.md#ref-page-waitforfunction). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (검토 3차 반영, 2026-11-01).
- 규범: Page main frame에서 fn(arg)를 반복 호출하고 각 Promise/thenable의 settled JSON 값이 truthy일 때 그 값을 반환한다. false/0/빈문자열/null은 미충족으로 다음 polling을 한다. 기본 총10초 대기이며 바깥 js deadline보다 연장하지 않는다. 이전 호출이 settle하기 전에 다음 함수를 겹쳐 실행하지 않는다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-PAGE-WAITFORFUNCTION-001-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-PAGE-WAITFORFUNCTION-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-page.waitForFunction` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-PAGE-WAITFORFUNCTION-001-C01

- 조건: settled JSON값의truthiness로만성공판정한다.
- 준비: async false→7·never-settle
- 실행: waitForFunction
- 판정: Promise자체로성공하지않고7만정상반환·겹친poll없다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-PAGE-WAITFORFUNCTION-002

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/lifecycle-evaluation.md#ref-page-waitforfunction). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (검토 3차 반영, 2026-11-01).
- 규범: 인자/결과 직렬화 오류와 사용자 throw/async reject는 즉시 실패한다. navigation으로 실행 context가 사라진 경우만 남은 총 deadline 내 새 main document에서 다시 평가할 수 있다. 사용자 함수는 polling으로 반복될 수 있으므로 부작용을 명시하며 이미 발생한 변경은 되돌리거나 숨기지 않는다. timeout/reset 뒤 late settle은 종료한 요청/새 세대에 결과를 주지 않는다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-PAGE-WAITFORFUNCTION-002-C01부터 C02까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-PAGE-WAITFORFUNCTION-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-page.waitForFunction` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-PAGE-WAITFORFUNCTION-002-C01

- 조건: 사용자throw/reject/직렬화오류를timeout으로삼키지않는다.
- 준비: ReferenceError·undefined·DOMnode
- 실행: wait
- 판정: 즉시구분가능오류·사용자함수효과는별도기록이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-PAGE-WAITFORFUNCTION-002-C02

- 조건: navigation context소멸만deadline내재평가한다.
- 준비: navigation/close/reset경합
- 실행: wait
- 판정: 새main context재평가가능·사용자오류재실행없고종결1회다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

## 현재 사실과 근거 한계

기준 구현은 `700a6a06af3f97729327afaf9becb4ee29bb475b`. [카탈로그](../../api-catalog.json)의 과거 상태 `verified-basic`는 기본 호출/당시 제한 기록이다. 본 명세의 모든 옵션·반례 충족을 뜻하지 않는다. [기존 테스트 연결](../../api-test-matrix.json)은 후보이며 소스 fingerprint가 현재와 다른 부분은 과거 증거다. 새 제품 테스트는 이번에 실행·추가하지 않았다. 규범과 다른 코드가 보이면 규범을 낮추지 않고 backlog에서 조사한다.
