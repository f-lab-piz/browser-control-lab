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

- 수준/판단: **MUST / 수용** (검토 3차 반영, 2026-11-01).
- 규범: Page main frame에서 fn(arg)를 반복 호출하고 각 Promise/thenable의 settled JSON 값이 truthy일 때 그 값을 반환한다. false/0/빈문자열/null은 미충족으로 다음 polling을 한다. 기본 총10초 대기이며 바깥 js deadline보다 연장하지 않는다. 이전 호출이 settle하기 전에 다음 함수를 겹쳐 실행하지 않는다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: async resolve(false), 이후 true/7로 바뀌는 predicate와 never-settle 함수를 준비한다.
- When: waitForFunction을 충분한/짧은 deadline에서 호출한다.
- Then: Promise 자체로 즉시 성공하지 않는다. truthy JSON일 때만 반환, 계속false/never-settle은대기timeout 또는 더빠른바깥실행취소이며 중복polling은없다.
- 검증 계획: `PLAN-PAGE-WAITFORFUNCTION-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-PAGE-WAITFORFUNCTION-002

- 수준/판단: **MUST / 수용** (검토 3차 반영, 2026-11-01).
- 규범: 인자/결과 직렬화 오류와 사용자 throw/async reject는 즉시 실패한다. navigation으로 실행 context가 사라진 경우만 남은 총 deadline 내 새 main document에서 다시 평가할 수 있다. 사용자 함수는 polling으로 반복될 수 있으므로 부작용을 명시하며 이미 발생한 변경은 되돌리거나 숨기지 않는다. timeout/reset 뒤 late settle은 종료한 요청/새 세대에 결과를 주지 않는다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: ReferenceError/reject, undefined, navigation 중 context 소멸, marker 변경 후 reject/never-settle을 준비한다.
- When: 함수 대기와 timeout/reset을 수행하고 독립 marker/호출 횟수/late 출력을 판독한다.
- Then: 사용자 오류를 timeout까지 흡수하지 않는다. navigation만 재평가 가능하고 기존 효과는 남는다. 종료는 한 번이며 late 결과와 겹친 polling은 없다.
- 검증 계획: `PLAN-PAGE-WAITFORFUNCTION-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

## 현재 사실과 근거 한계

기준 구현은 `700a6a06af3f97729327afaf9becb4ee29bb475b`. [카탈로그](../../api-catalog.json)의 과거 상태 `verified-basic`는 기본 호출/당시 제한 기록이다. 본 명세의 모든 옵션·반례 충족을 뜻하지 않는다. [기존 테스트 연결](../../api-test-matrix.json)은 후보이며 소스 fingerprint가 현재와 다른 부분은 과거 증거다. 새 제품 테스트는 이번에 실행·추가하지 않았다. 규범과 다른 코드가 보이면 규범을 낮추지 않고 backlog에서 조사한다.
