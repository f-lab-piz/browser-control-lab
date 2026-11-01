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

- 수준/판단: **MUST / 수용** (검토 1차 반영, 2026-11-01).
- 규범: press는 호출 전 이미 유지되던 modifier를 보존한다. 자신이 새로 누른 modifier/주키만 정해진 순서로 해제하며 중도 오류에도 같은 정리를 시도한다. 명시 down의 소유 상태는 대응 up 또는 reset/close가 끝낸다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: Control을 명시 down한 상태와 아무 modifier가 없는 상태를 각각 준비한다.
- When: press('Control+A')→press('C')→up('Control')를 실행하고 중간 오류도 주입한다.
- Then: 첫 경우 Control이 C까지 유지되고 마지막 up에만 풀린다. 새로 누른 modifier만 정리되며 오류 후 잔류 상태/정리 실패를 확인할 수 있다.
- 검증 계획: `PLAN-KEYBOARD-PRESS-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-KEYBOARD-PRESS-002

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 알 수없는 조합은 사전 오류며 중간 실패 시 modifier 정리 결과를 표시한다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 독립 세션·해당 Page/Scope/핸들을 준비한다. 입력 계약: key:string; Enter/Control+A 등의 조합. 반례 조건: 알 수없는 조합은 사전 오류며 중간 실패 시 modifier 정리 결과를 표시한다.
- When: `keyboard.press`를 해당 경계에서 호출하고 오류·반환 및 전후 효과를 판독한다.
- Then: 알 수없는 조합은 사전 오류며 중간 실패 시 modifier 정리 결과를 표시한다.
- 검증 계획: `PLAN-KEYBOARD-PRESS-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

## 현재 사실과 근거 한계

기준 구현은 `700a6a06af3f97729327afaf9becb4ee29bb475b`. [카탈로그](../../api-catalog.json)의 과거 상태 `verified-basic`는 기본 호출/당시 제한 기록이다. 본 명세의 모든 옵션·반례 충족을 뜻하지 않는다. [기존 테스트 연결](../../api-test-matrix.json)은 후보이며 소스 fingerprint가 현재와 다른 부분은 과거 증거다. 새 제품 테스트는 이번에 실행·추가하지 않았다. 규범과 다른 코드가 보이면 규범을 낮추지 않고 backlog에서 조사한다.
