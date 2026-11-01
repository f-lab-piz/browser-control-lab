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

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: viewport/fullPage/clip의 범위를 구분하고 clip은 현재 viewport CSS 좌표로 캡처한다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 독립 세션·해당 Page/Scope/핸들을 준비한다. 입력 계약: options.fullPage?:boolean(기본false), clip?:{x,y,width,height}; 둘은 배타적.
- When: `page.screenshot`를 정상 입력으로 호출하고 반환/실제 효과를 독립 판독한다.
- Then: viewport/fullPage/clip의 범위를 구분하고 clip은 현재 viewport CSS 좌표로 캡처한다.
- 검증 계획: `PLAN-PAGE-SCREENSHOT-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-PAGE-SCREENSHOT-002

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 가로·세로 스크롤과 DPR2에서 clip의 대상 픽셀과 크기를 확인하며 viewport가 변하면 재시도 후 명시 실패한다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 독립 세션·해당 Page/Scope/핸들을 준비한다. 입력 계약: options.fullPage?:boolean(기본false), clip?:{x,y,width,height}; 둘은 배타적. 반례 조건: 가로·세로 스크롤과 DPR2에서 clip의 대상 픽셀과 크기를 확인하며 viewport가 변하면 재시도 후 명시 실패한다.
- When: `page.screenshot`를 해당 경계에서 호출하고 오류·반환 및 전후 효과를 판독한다.
- Then: 가로·세로 스크롤과 DPR2에서 clip의 대상 픽셀과 크기를 확인하며 viewport가 변하면 재시도 후 명시 실패한다.
- 검증 계획: `PLAN-PAGE-SCREENSHOT-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

## 현재 사실과 근거 한계

기준 구현은 `700a6a06af3f97729327afaf9becb4ee29bb475b`. [카탈로그](../../api-catalog.json)의 과거 상태 `partial`는 기본 호출/당시 제한 기록이다. 본 명세의 모든 옵션·반례 충족을 뜻하지 않는다. [기존 테스트 연결](../../api-test-matrix.json)은 후보이며 소스 fingerprint가 현재와 다른 부분은 과거 증거다. 새 제품 테스트는 이번에 실행·추가하지 않았다. 규범과 다른 코드가 보이면 규범을 낮추지 않고 backlog에서 조사한다.

### REQ-PAGE-SCREENSHOT-003

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: clip 좌표/크기는 유한 양수/비음수이고 fullPage와배타적이다. clip은정수 CSS pixel 크기만지원하며fractional은사전오류다.
- 근거: DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 잘못된clip·fullPage충돌
- When: 캡처호출
- Then: 입력오류로구분하고이미지를성공반환하지않는다.
- 검증 계획: `PLAN-PAGE-SCREENSHOT-003`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-PAGE-SCREENSHOT-004

- 수준/판단: **SHOULD / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 전체문서 캡처는 픽셀/바이트 상한을 안내하고 초과는 명시 실패 또는 부분 이미지 표시를 한다. fullPage는 iframe내부 미노출content전체를의미하지않는다.
- 근거: USR, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 거대한페이지와내부스크롤iframe
- When: fullPage캡처
- Then: 범위·제한이명시되고메모리실패를성공으로포장하지않는다.
- 검증 계획: `PLAN-PAGE-SCREENSHOT-004`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.
