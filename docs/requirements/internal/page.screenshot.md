# page.screenshot

## 계약과 적용 범위

대상: 확장 QuickJS에 공개하는 기존 API.

공통 계약: [runtime](../common/runtime.md), [dom-frames](../common/dom-frames.md). Page/Frame의 Scope 메서드는 같은 API로 센다. 공통 필수 조건도 이 API의 개발 수용 기준에 포함한다.

- 목적: viewport/fullPage/clip의 범위를 구분하고 clip은 현재 viewport CSS 좌표로 캡처한다.
- 입력/기본값: options.fullPage?:boolean(기본false), clip?:{x,y,width,height}; 둘은 배타적.
- 출력/성공 의미: {type:'image',mimeType:'image/png',data:base64}; clip CSS 크기로 정규화.
- 허용 부작용: 캡처; 사이트 입력 없음.
- 오류/경계: 가로·세로 스크롤과 DPR2에서 clip의 대상 픽셀과 크기를 확인하며 viewport가 변하면 재시도 후 명시 실패한다.
- 재시도: 읽기는 최신 문서 상태로 다시 관찰할 수 있다. 입력은 완료 여부를 먼저 확인하며 응답 유실만으로 재전송하지 않는다.
- 지원: Chrome debugger/CDP, 허용된 HTTP(S), 현재 연결 DOM. Firefox/Safari·closed Shadow·모든 사이트 완전 지원은 이번 약속이 아니다.

## 개별 요구사항

### REQ-PAGE-SCREENSHOT-001

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/snapshot-frames.md#ref-page-screenshot). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: viewport/fullPage/clip의 범위를 구분하고 clip은 현재 viewport CSS 좌표로 캡처한다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-PAGE-SCREENSHOT-001-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-PAGE-SCREENSHOT-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-page.screenshot` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-PAGE-SCREENSHOT-001-C01

- 조건: viewport/fullPage/clip은 서로 다른 범위다.
- 준비: 큰 문서와 내부 iframe·스크롤된 viewport
- 실행: 각 모드 캡처
- 판정: viewport는 현재 영역·fullPage는 문서 범위·iframe 내부 전체를 자동 펼치지 않는다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-PAGE-SCREENSHOT-002

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/snapshot-frames.md#ref-page-screenshot). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 가로·세로 스크롤과 DPR2에서 clip의 대상 픽셀과 크기를 확인하며 viewport가 변하면 재시도 후 명시 실패한다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-PAGE-SCREENSHOT-002-C01부터 C02까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-PAGE-SCREENSHOT-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-page.screenshot` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-PAGE-SCREENSHOT-002-C01

- 조건: clip은 현재 viewport CSS 좌표와 요청 정수 크기로 정규화한다.
- 준비: 가로 세로 scroll·DPR2·clip 320x240
- 실행: clip 캡처와 독립 PNG 판독
- 판정: 정확한 대상 색/320x240이며 문서 원점이나 DPR640x480로 바꾸지 않는다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-PAGE-SCREENSHOT-002-C02

- 조건: 캡처 중 viewport가 바뀌면 정합성 재시도 후 명시 실패한다.
- 준비: 스크롤/resize 변화 조건
- 실행: clip
- 판정: 최대 3회 정합성 시도 후 VIEWPORT_CHANGED 오류이며 stale 픽셀 성공 없다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

## 현재 사실과 근거 한계

기준 구현은 `700a6a06af3f97729327afaf9becb4ee29bb475b`. [카탈로그](../../api-catalog.json)의 과거 상태 `partial`는 기본 호출/당시 제한 기록이다. 본 명세의 모든 옵션·반례 충족을 뜻하지 않는다. [기존 테스트 연결](../../api-test-matrix.json)은 후보이며 소스 fingerprint가 현재와 다른 부분은 과거 증거다. 새 제품 테스트는 이번에 실행·추가하지 않았다. 규범과 다른 코드가 보이면 규범을 낮추지 않고 backlog에서 조사한다.

### REQ-PAGE-SCREENSHOT-003

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/snapshot-frames.md#ref-page-screenshot). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: clip 좌표/크기는 유한 양수/비음수이고 fullPage와배타적이다. clip은정수 CSS pixel 크기만지원하며fractional은사전오류다.
- 근거: DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-PAGE-SCREENSHOT-003-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-PAGE-SCREENSHOT-003`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-page.screenshot` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-PAGE-SCREENSHOT-003-C01

- 조건: clip전체사각형은viewport안에있어야하며소수크기/비유한/음수/0크기/fullPage병용은거절한다.
- 준비: viewport800x600에clip(790,590,10,10),(790,590,20,20),x800을DPR1/2에서준비한다.
- 실행: 각clip과불량옵션캡처를호출한다.
- 판정: 완전포함10x10만정확크기이며밖으로나간요청은범위오류·이미지없음·clamp/padding없다. resize뒤정합성은기존3회정책이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-PAGE-SCREENSHOT-004

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/snapshot-frames.md#ref-page-screenshot). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **SHOULD / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 전체문서 캡처는 픽셀/바이트 상한을 안내하고 초과는 명시 실패 또는 부분 이미지 표시를 한다. fullPage는 iframe내부 미노출content전체를의미하지않는다.
- 근거: USR, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-PAGE-SCREENSHOT-004-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-PAGE-SCREENSHOT-004`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

- 상세화 판단: `DETAIL-page.screenshot` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-PAGE-SCREENSHOT-004-C01

- 조건: 거대 문서 캡처는 메모리/전송 예산 실패를 명시한다.
- 준비: 큰 PNG·매우 긴 문서
- 실행: fullPage/이후 display
- 판정: 한도 초과/부분 수집을 숨기지 않고 현재 viewport나 iframe 내부 전체로 오인하지 않는다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.
