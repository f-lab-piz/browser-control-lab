# page.waitForEvent

## 계약과 적용 범위

대상: 확장 QuickJS에 공개하는 기존 API.

공통 계약: [runtime](../common/runtime.md), [dom-frames](../common/dom-frames.md), [files-events](../common/files-events.md). Page/Frame의 Scope 메서드는 같은 API로 센다. 공통 필수 조건도 이 API의 개발 수용 기준에 포함한다.

- 목적: 조작 전에 등록한 waiter가 해당 Page의 다음 일치 이벤트를 받아 조작가능 핸들을 준다.
- 입력/기본값: event:popup/filechooser/download/dialog/close, options.timeout?:positive ms(기본10000).
- 출력/성공 의미: Promise<Page/FileChooser/Download/Dialog/close metadata>.
- 허용 부작용: wait등록; chooser interception가능.
- 오류/경계: 다른 탭·이전 이벤트를 재사용하지 않고 timeout/close/reset시 waiter를 정리하며 하나의 chooser/dialog를 이중 소비하지 않는다.
- 재시도: 읽기는 최신 문서 상태로 다시 관찰할 수 있다. 입력은 완료 여부를 먼저 확인하며 응답 유실만으로 재전송하지 않는다.
- 지원: Chrome debugger/CDP, 허용된 HTTP(S), 현재 연결 DOM. Firefox/Safari·closed Shadow·모든 사이트 완전 지원은 이번 약속이 아니다.

## 개별 요구사항

### REQ-PAGE-WAITFOREVENT-001

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 조작 전에 등록한 waiter가 해당 Page의 다음 일치 이벤트를 받아 조작가능 핸들을 준다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 독립 세션·해당 Page/Scope/핸들을 준비한다. 입력 계약: event:popup/filechooser/download/dialog/close, options.timeout?:positive ms(기본10000).
- When: `page.waitForEvent`를 정상 입력으로 호출하고 반환/실제 효과를 독립 판독한다.
- Then: 조작 전에 등록한 waiter가 해당 Page의 다음 일치 이벤트를 받아 조작가능 핸들을 준다.
- 검증 계획: `PLAN-PAGE-WAITFOREVENT-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-PAGE-WAITFOREVENT-002

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 다른 탭·이전 이벤트를 재사용하지 않고 timeout/close/reset시 waiter를 정리하며 하나의 chooser/dialog를 이중 소비하지 않는다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 독립 세션·해당 Page/Scope/핸들을 준비한다. 입력 계약: event:popup/filechooser/download/dialog/close, options.timeout?:positive ms(기본10000). 반례 조건: 다른 탭·이전 이벤트를 재사용하지 않고 timeout/close/reset시 waiter를 정리하며 하나의 chooser/dialog를 이중 소비하지 않는다.
- When: `page.waitForEvent`를 해당 경계에서 호출하고 오류·반환 및 전후 효과를 판독한다.
- Then: 다른 탭·이전 이벤트를 재사용하지 않고 timeout/close/reset시 waiter를 정리하며 하나의 chooser/dialog를 이중 소비하지 않는다.
- 검증 계획: `PLAN-PAGE-WAITFOREVENT-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

## 현재 사실과 근거 한계

기준 구현은 `700a6a06af3f97729327afaf9becb4ee29bb475b`. [카탈로그](../../api-catalog.json)의 과거 상태 `verified-basic`는 기본 호출/당시 제한 기록이다. 본 명세의 모든 옵션·반례 충족을 뜻하지 않는다. [기존 테스트 연결](../../api-test-matrix.json)은 후보이며 소스 fingerprint가 현재와 다른 부분은 과거 증거다. 새 제품 테스트는 이번에 실행·추가하지 않았다. 규범과 다른 코드가 보이면 규범을 낮추지 않고 backlog에서 조사한다.

### REQ-PAGE-WAITFOREVENT-003

- 수준/판단: **MUST / 수용** (검토 1차 반영, 2026-11-01).
- 규범: 같은 세션 JS에서 waitForEvent 호출 다음에 발행한 host action은 해당 waiter의 브라우저 등록/chooser arming 완료 뒤에만 실행한다. event Promise 자체는 이벤트 때 resolve하며 별도 공개 ready API는 추가하지 않는다. timeout/reset 시 미완료 등록도 취소해 늦은 waiter를 남기지 않는다.
- 근거: USR, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 등록 ack를 지연시키고 즉시 popup/chooser/dialog를 발생시키는 fixture를 준비한다.
- When: var pending=page.waitForEvent('dialog'); await button.click(); var d=await pending;를 임의 sleep 없이 반복한다.
- Then: trace가 register-ready→action→event 순서이며 이벤트 누락/늦은 waiter 누수/중복 소비가 없다.
- 검증 계획: `PLAN-PAGE-WAITFOREVENT-003`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.
