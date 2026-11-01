# locator.dragTo

## 계약과 적용 범위

대상: 확장 QuickJS에 공개하는 기존 API.

공통 계약: [runtime](../common/runtime.md), [dom-frames](../common/dom-frames.md), [selection](../common/selection.md), [input](../common/input.md). Page/Frame의 Scope 메서드는 같은 API로 센다. 공통 필수 조건도 이 API의 개발 수용 기준에 포함한다.

- 목적: draggable은 실제 dragstart/native DragData, 격자는 연속 pointer 경로로 조작한다.
- 입력/기본값: target:같은 세션·Page·frame document·CDP 입력 target의 단일 Locator. cross-target은 frame 이름이 아니라 debugger 입력 target 경계다.
- 출력/성공 의미: Promise<boolean> 입력 전달 성공; 서버 업무판정 별도.
- 허용 부작용: 스크롤·포인터 drag 또는 native HTML DnD.
- 오류/경계: cross-target drag·모호한 대상은 사전 거절하고 중도 오류에도 버튼·drag 상태를 정리하며 drop을 자동 재전송하지 않는다.
- 재시도: 읽기는 최신 문서 상태로 다시 관찰할 수 있다. 입력은 완료 여부를 먼저 확인하며 응답 유실만으로 재전송하지 않는다.
- 지원: Chrome debugger/CDP, 허용된 HTTP(S), 현재 연결 DOM. Firefox/Safari·closed Shadow·모든 사이트 완전 지원은 이번 약속이 아니다.

## 개별 요구사항

### REQ-LOCATOR-DRAGTO-001

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: draggable은 실제 dragstart/native DragData, 격자는 연속 pointer 경로로 조작한다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 독립 세션·해당 Page/Scope/핸들을 준비한다. 입력 계약: target:같은 세션·Page·frame document·CDP 입력 target의 단일 Locator. cross-target은 frame 이름이 아니라 debugger 입력 target 경계다.
- When: `locator.dragTo`를 정상 입력으로 호출하고 반환/실제 효과를 독립 판독한다.
- Then: draggable은 실제 dragstart/native DragData, 격자는 연속 pointer 경로로 조작한다.
- 검증 계획: `PLAN-LOCATOR-DRAGTO-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-LOCATOR-DRAGTO-002

- 수준/판단: **MUST / 수용** (검토 3차 반영, 2026-11-01).
- 규범: Locator.dragTo v1은 같은 Page·같은 frame document·같은 CDP 입력 target 안에서만 지원한다. 다른 Page/다른 frame document는 전송 전 거절하며 다른 CDP target은 CROSS_TARGET_DRAG_UNSUPPORTED다. 동일 process의 다른 frame도 이번에는 CROSS_DOCUMENT_DRAG_UNSUPPORTED다. 모호/stale 대상은 사전 거절하며 중도 오류는 해당 연산이 획득한 버튼/drag 상태만 정리하고 drop을 자동 재전송하지 않는다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 같은 document, 동일 process 다른 frame, OOPIF 다른 CDP target, 다른 Page의 source/destination과 중도 detach를 준비한다.
- When: dragTo를 호출하고 trace·drop 서버 카운터·잔류 버튼을 판독한다.
- Then: 지원 범위는 drop1회 업무 판정, 사전 거절 범위는 dragstart/drop0이다. 중도 실패는 이미발생이벤트와정리결과를표시하고다른대상으로재지정하지않는다.
- 검증 계획: `PLAN-LOCATOR-DRAGTO-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

## 현재 사실과 근거 한계

기준 구현은 `700a6a06af3f97729327afaf9becb4ee29bb475b`. [카탈로그](../../api-catalog.json)의 과거 상태 `partial`는 기본 호출/당시 제한 기록이다. 본 명세의 모든 옵션·반례 충족을 뜻하지 않는다. [기존 테스트 연결](../../api-test-matrix.json)은 후보이며 소스 fingerprint가 현재와 다른 부분은 과거 증거다. 새 제품 테스트는 이번에 실행·추가하지 않았다. 규범과 다른 코드가 보이면 규범을 낮추지 않고 backlog에서 조사한다.
