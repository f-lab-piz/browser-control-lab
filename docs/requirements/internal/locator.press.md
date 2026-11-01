# locator.press

## 계약과 적용 범위

대상: 확장 QuickJS에 공개하는 기존 API.

공통 계약: [runtime](../common/runtime.md), [dom-frames](../common/dom-frames.md), [selection](../common/selection.md), [input](../common/input.md). Page/Frame의 Scope 메서드는 같은 API로 센다. 공통 필수 조건도 이 API의 개발 수용 기준에 포함한다.

- 목적: 정확한 대상에 focus를 확인하고 키를 입력해 현재 다른 focus에 보내지 않는다.
- 입력/기본값: key:string; 예:Enter,Control+A.
- 출력/성공 의미: Promise<boolean>; 대상 focus후 키 시퀀스.
- 허용 부작용: 포커스·키 입력.
- 오류/경계: focus 불가·stale·비활성 대상은 다른 요소 입력 없이 실패한다. 사전 실패는 명시 down을 보존하며 키 입력 단계는 keyboard.press의 소유 정책을 따른다.
- 재시도: 읽기는 최신 문서 상태로 다시 관찰할 수 있다. 입력은 완료 여부를 먼저 확인하며 응답 유실만으로 재전송하지 않는다.
- 지원: Chrome debugger/CDP, 허용된 HTTP(S), 현재 연결 DOM. Firefox/Safari·closed Shadow·모든 사이트 완전 지원은 이번 약속이 아니다.

## 개별 요구사항

### REQ-LOCATOR-PRESS-001

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/input-state.md#ref-locator-press). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 정확한 대상에 focus를 확인하고 키를 입력해 현재 다른 focus에 보내지 않는다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-LOCATOR-PRESS-001-C01부터 C02까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-LOCATOR-PRESS-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-locator.press` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-LOCATOR-PRESS-001-C01

- 조건: 대상focus를확인한후그대상에키를전달한다.
- 준비: inputA/B와focus불가div
- 실행: A.press Enter
- 판정: A가active이고A의event만발생하며div는focus오류다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-LOCATOR-PRESS-001-C02

- 조건: 복합키는keyboard.press의소유정책을공유한다.
- 준비: 기존Control down
- 실행: 대상press Control+A
- 판정: 기존Control유지·새키만해제되며직접keyboard경로와일관된다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-LOCATOR-PRESS-002

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/input-state.md#ref-locator-press). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (검토 1차 반영, 2026-11-01).
- 규범: focus 불가·stale·비활성 대상은 다른 요소 입력 없이 실패한다. 키 입력 단계는 keyboard.press와 같은 modifier 소유 정책을 따르며, focus 이전 실패는 기존 명시 down 상태를 임의 해제하지 않는다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-LOCATOR-PRESS-002-C01부터 C02까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-LOCATOR-PRESS-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-locator.press` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-LOCATOR-PRESS-002-C01

- 조건: 잘못된키/조합은focus준비전검증한다.
- 준비: 빈키·알수없는조합·disabled대상
- 실행: press
- 판정: 키입력0이고가능한한기존focus/down을보존한다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-LOCATOR-PRESS-002-C02

- 조건: focus이전실패와키전송중실패를구분한다.
- 준비: 기존Control와새Alt·중간전송fault
- 실행: press 및후속C
- 판정: 기존Control보존·새Alt정리·부분이벤트기록이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

## 현재 사실과 근거 한계

기준 구현은 `700a6a06af3f97729327afaf9becb4ee29bb475b`. [카탈로그](../../api-catalog.json)의 과거 상태 `verified-basic`는 기본 호출/당시 제한 기록이다. 본 명세의 모든 옵션·반례 충족을 뜻하지 않는다. [기존 테스트 연결](../../api-test-matrix.json)은 후보이며 소스 fingerprint가 현재와 다른 부분은 과거 증거다. 새 제품 테스트는 이번에 실행·추가하지 않았다. 규범과 다른 코드가 보이면 규범을 낮추지 않고 backlog에서 조사한다.
