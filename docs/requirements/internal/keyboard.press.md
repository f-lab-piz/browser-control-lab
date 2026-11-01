# keyboard.press

## 계약과 적용 범위

대상: 확장 QuickJS에 공개하는 기존 API.

공통 계약: [runtime](../common/runtime.md), [input](../common/input.md). Page/Frame의 Scope 메서드는 같은 API로 센다. 공통 필수 조건도 이 API의 개발 수용 기준에 포함한다.

- 목적: 정의된 순서로 조합키 down/주키/up을 보내고 마지막에 release한다.
- 입력/기본값: key:string; Enter/Control+A 등의 조합.
- 출력/성공 의미: Promise<boolean>.
- 허용 부작용: 현재 focus에 전체 key시퀀스.
- 오류/경계: 알 수없는 조합은 사전 오류며 중간 실패 시 modifier 정리 결과를 표시한다.
- 재시도: 읽기는 최신 문서 상태로 다시 관찰할 수 있다. 입력은 완료 여부를 먼저 확인하며 응답 유실만으로 재전송하지 않는다.
- 지원: Chrome debugger/CDP, 허용된 HTTP(S), 현재 연결 DOM. Firefox/Safari·closed Shadow·모든 사이트 완전 지원은 이번 약속이 아니다.

## 개별 요구사항

### REQ-KEYBOARD-PRESS-001

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/input-state.md#ref-keyboard-press). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (검토 1차 반영, 2026-11-01).
- 규범: press는 호출 전 이미 유지되던 modifier를 보존한다. 자신이 새로 누른 modifier/주키만 정해진 순서로 해제하며 중도 오류에도 같은 정리를 시도한다. 명시 down의 소유 상태는 대응 up 또는 reset/close가 끝낸다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-KEYBOARD-PRESS-001-C01부터 C02까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-KEYBOARD-PRESS-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-keyboard.press` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-KEYBOARD-PRESS-001-C01

- 조건: press는기존modifier를보존하지만주키가이미해당Page에명시down이면focus/새키전송전에상태충돌로거절한다.
- 준비: 기존Control만down한경우,아무down없는경우,ArrowDown또는A주키가이미명시down인경우를준비한다.
- 실행: Control+A→C와이미down한주키의keyboard.press/locator.press를별도실행한뒤명시up한다.
- 판정: modifier재사용은정상·새소유만release. 기존주키동일press는KEY_ALREADY_DOWN·추가focus/key이벤트0·기존주키down유지·마지막명시up으로해제한다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-KEYBOARD-PRESS-001-C02

- 조건: 키 문법은 input 상세표를 따른다. +와Control++는plus주키,Control+Shift+A는정상조합이다.
- 준비: '+', 'Control++', 'Control+Shift+A', 'Control+', 'Control+Shift', 중복 modifier와 unknown 키를 준비한다.
- 실행: 각 문자열을독립press하고key/modifier/down/up trace를읽는다.
- 판정: 정상은표의순서·키1개·새소유만release,불량은focus/키이벤트0·기존down보존이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-KEYBOARD-PRESS-002

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/input-state.md#ref-keyboard-press). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 알 수없는 조합은 사전 오류며 중간 실패 시 modifier 정리 결과를 표시한다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-KEYBOARD-PRESS-002-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-KEYBOARD-PRESS-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-keyboard.press` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-KEYBOARD-PRESS-002-C01

- 조건: 검증 실패/중도 실패에서 기존 키와 새 소유 키 정리를 구분한다.
- 준비: 기존 Control·새 Alt 중 fault
- 실행: press와 후속 C
- 판정: 사전 키 0·중도 새 키 해제·기존 Control 보존이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

## 현재 사실과 근거 한계

기준 구현은 `700a6a06af3f97729327afaf9becb4ee29bb475b`. [카탈로그](../../api-catalog.json)의 과거 상태 `verified-basic`는 기본 호출/당시 제한 기록이다. 본 명세의 모든 옵션·반례 충족을 뜻하지 않는다. [기존 테스트 연결](../../api-test-matrix.json)은 후보이며 소스 fingerprint가 현재와 다른 부분은 과거 증거다. 새 제품 테스트는 이번에 실행·추가하지 않았다. 규범과 다른 코드가 보이면 규범을 낮추지 않고 backlog에서 조사한다.
