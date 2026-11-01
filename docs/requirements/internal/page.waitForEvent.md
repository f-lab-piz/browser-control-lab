# page.waitForEvent

## 계약과 적용 범위

대상: 확장 QuickJS에 공개하는 기존 API.

공통 계약: [runtime](../common/runtime.md), [dom-frames](../common/dom-frames.md), [files-events](../common/files-events.md). Page/Frame의 Scope 메서드는 같은 API로 센다. 공통 필수 조건도 이 API의 개발 수용 기준에 포함한다.

- 목적: 조작 전에 등록한 waiter가 해당 Page의 다음 일치 이벤트를 받아 조작가능 핸들을 준다.
- 입력/기본값: event:popup/filechooser/download/dialog/close, options.timeout?:positive ms(기본10000).
- 출력/성공 의미: Promise<Page/FileChooser/Download/Dialog/{tabId:number,closedAt:number}>. close는 관측한 탭 종료 시각의 epoch ms를 반환한다.
- 허용 부작용: wait등록; chooser interception가능.
- 오류/경계: 다른 탭·이전 이벤트를 재사용하지 않고 timeout/close/reset시 waiter를 정리하며 하나의 chooser/dialog를 이중 소비하지 않는다.
- 재시도: 읽기는 최신 문서 상태로 다시 관찰할 수 있다. 입력은 완료 여부를 먼저 확인하며 응답 유실만으로 재전송하지 않는다.
- 지원: Chrome debugger/CDP, 허용된 HTTP(S), 현재 연결 DOM. Firefox/Safari·closed Shadow·모든 사이트 완전 지원은 이번 약속이 아니다.

## 개별 요구사항

### REQ-PAGE-WAITFOREVENT-001

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/files-events.md#ref-page-waitforevent). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 조작 전에 등록한 waiter가 해당 Page의 다음 일치 이벤트를 받아 조작가능 핸들을 준다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-PAGE-WAITFOREVENT-001-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-PAGE-WAITFOREVENT-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-page.waitForEvent` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-PAGE-WAITFOREVENT-001-C01

- 조건: 발생전등록한페이지이벤트는조작가능한핸들을준다.
- 준비: popup/chooser/dialog/download버튼
- 실행: wait선언→click→await
- 판정: 해당페이지발급핸들·identity·event순서가맞다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-PAGE-WAITFOREVENT-002

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/files-events.md#ref-page-waitforevent). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (검토 2차 반영, 2026-11-01).
- 규범: 다른 탭·등록 전 이벤트는 재사용하지 않는다. 자기 Page close가 관측되면 등록된 close waiter는 {tabId:number,closedAt:epochMs}로 정확히 한 번 resolve하고 제거한다. 다른 event waiter는 PAGE_CLOSED로 reject/정리한다. 이미 닫힌 핸들에 새 wait 등록은 즉시 PAGE_CLOSED다. timeout/reset/close 경합은 실제 먼저 확정된 terminal 결과 하나만 유지하고 late 결과는 무시한다. chooser/dialog는 동일 event를 이중 소비하지 않는다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-PAGE-WAITFOREVENT-002-C01부터 C02까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-PAGE-WAITFOREVENT-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-page.waitForEvent` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-PAGE-WAITFOREVENT-002-C01

- 조건: 같은가변event의중복소비와timeout누수를방지한다.
- 준비: dialog/chooser waiter두개·timeout후event
- 실행: wait등록/소비
- 판정: 같은event에두가변핸들발급없고늦은event가종료wait에전달되지않는다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-PAGE-WAITFOREVENT-002-C02

- 조건: close는정상close waiter와다른wait의오류를분리한다.
- 준비: close와download wait동시등록
- 실행: 자기Page.close
- 판정: close metadata정상·다른wait PAGE_CLOSED·다른페이지wait유지다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

## 현재 사실과 근거 한계

기준 구현은 `700a6a06af3f97729327afaf9becb4ee29bb475b`. [카탈로그](../../api-catalog.json)의 과거 상태 `verified-basic`는 기본 호출/당시 제한 기록이다. 본 명세의 모든 옵션·반례 충족을 뜻하지 않는다. [기존 테스트 연결](../../api-test-matrix.json)은 후보이며 소스 fingerprint가 현재와 다른 부분은 과거 증거다. 새 제품 테스트는 이번에 실행·추가하지 않았다. 규범과 다른 코드가 보이면 규범을 낮추지 않고 backlog에서 조사한다.

### REQ-PAGE-WAITFOREVENT-003

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/files-events.md#ref-page-waitforevent). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (검토 1차 반영, 2026-11-01).
- 규범: 같은 세션 JS에서 waitForEvent 호출 다음에 발행한 host action은 해당 waiter의 브라우저 등록/chooser arming 완료 뒤에만 실행한다. event Promise 자체는 이벤트 때 resolve하며 별도 공개 ready API는 추가하지 않는다. timeout/reset 시 미완료 등록도 취소해 늦은 waiter를 남기지 않는다.
- 근거: USR, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-PAGE-WAITFOREVENT-003-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-PAGE-WAITFOREVENT-003`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

- 상세화 판단: `DETAIL-page.waitForEvent` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-PAGE-WAITFOREVENT-003-C01

- 조건: wait선언다음hostaction은등록/arming완료뒤실행한다.
- 준비: 등록ack지연·즉시dialog/chooser/popup
- 실행: wait선언→click→await
- 판정: register-ready→action→event순서·sleep없음·timeout/reset뒤late등록0이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.
