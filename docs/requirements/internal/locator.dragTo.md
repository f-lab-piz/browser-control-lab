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

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/input-state.md#ref-locator-dragto). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: draggable은 실제 dragstart/native DragData, 격자는 연속 pointer 경로로 조작한다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-LOCATOR-DRAGTO-001-C01부터 C02까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-LOCATOR-DRAGTO-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-locator.dragTo` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-LOCATOR-DRAGTO-001-C01

- 조건: native draggable은실제dragstart의데이터로한번drop한다.
- 준비: 같은document의HTML DnD
- 실행: dragTo
- 판정: trusted dragstart·서버drop1회·목적업무완료이며중복전송없다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-LOCATOR-DRAGTO-001-C02

- 조건: 비draggable격자는연속pointer경로로범위를선택한다.
- 준비: 회의실격자3칸
- 실행: source.dragTo(target)후doubleclick
- 판정: 선택구간이정확하고HTML DataTransfer로대체하지않는다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-LOCATOR-DRAGTO-002

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/input-state.md#ref-locator-dragto). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (검토 3차 반영, 2026-11-01).
- 규범: Locator.dragTo v1은 같은 Page·같은 frame document·같은 CDP 입력 target 안에서만 지원한다. 다른 Page/다른 frame document는 전송 전 거절하며 다른 CDP target은 CROSS_TARGET_DRAG_UNSUPPORTED다. 동일 process의 다른 frame도 이번에는 CROSS_DOCUMENT_DRAG_UNSUPPORTED다. 모호/stale 대상은 사전 거절하며 중도 오류는 해당 연산이 획득한 버튼/drag 상태만 정리하고 drop을 자동 재전송하지 않는다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-LOCATOR-DRAGTO-002-C01부터 C02까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-LOCATOR-DRAGTO-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-locator.dragTo` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-LOCATOR-DRAGTO-002-C01

- 조건: 사전경계거절은dragstart/down전에실행한다.
- 준비: 다른Page/다른document/OOPIF target·모호target
- 실행: dragTo
- 판정: 명시경계/strict오류·dragstart/drop0이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-LOCATOR-DRAGTO-002-C02

- 조건: dragstart후detach/실패는상태정리하고재drop하지않는다.
- 준비: 이동중frame교체·adapterfault
- 실행: dragTo
- 판정: 부분trace·자기버튼release·drop중복0이며정리실패를숨기지않는다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

## 현재 사실과 근거 한계

기준 구현은 `700a6a06af3f97729327afaf9becb4ee29bb475b`. [카탈로그](../../api-catalog.json)의 과거 상태 `partial`는 기본 호출/당시 제한 기록이다. 본 명세의 모든 옵션·반례 충족을 뜻하지 않는다. [기존 테스트 연결](../../api-test-matrix.json)은 후보이며 소스 fingerprint가 현재와 다른 부분은 과거 증거다. 새 제품 테스트는 이번에 실행·추가하지 않았다. 규범과 다른 코드가 보이면 규범을 낮추지 않고 backlog에서 조사한다.
