# locator.filter

## 계약과 적용 범위

대상: 확장 QuickJS에 공개하는 기존 API.

공통 계약: [runtime](../common/runtime.md), [dom-frames](../common/dom-frames.md), [selection](../common/selection.md). Page/Frame의 Scope 메서드는 같은 API로 센다. 공통 필수 조건도 이 API의 개발 수용 기준에 포함한다.

- 목적: 양·음 텍스트와 visible 조건을 AND로 조합하고 전체 composed 텍스트를 검색한다.
- 입력/기본값: {hasText?:string/RegExp,hasNotText?:string/RegExp,visible?:boolean}; 그 외 키 미지원.
- 출력/성공 의미: 기존 Locator를 변경하지 않는 새 Locator.
- 허용 부작용: 없음.
- 오류/경계: 없는 공백을 span 사이에 만들지 않고 실제 공백은 구분한다. has/hasNot 같은 미지원 키는 조용히 무시하지 않는다.
- 재시도: 읽기는 최신 문서 상태로 다시 관찰할 수 있다. 입력은 완료 여부를 먼저 확인하며 응답 유실만으로 재전송하지 않는다.
- 지원: Chrome debugger/CDP, 허용된 HTTP(S), 현재 연결 DOM. Firefox/Safari·closed Shadow·모든 사이트 완전 지원은 이번 약속이 아니다.

## 개별 요구사항

### REQ-LOCATOR-FILTER-001

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 양·음 텍스트와 visible 조건을 AND로 조합하고 전체 composed 텍스트를 검색한다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 독립 세션·해당 Page/Scope/핸들을 준비한다. 입력 계약: {hasText?:string/RegExp,hasNotText?:string/RegExp,visible?:boolean}; 그 외 키 미지원.
- When: `locator.filter`를 정상 입력으로 호출하고 반환/실제 효과를 독립 판독한다.
- Then: 양·음 텍스트와 visible 조건을 AND로 조합하고 전체 composed 텍스트를 검색한다.
- 검증 계획: `PLAN-LOCATOR-FILTER-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-LOCATOR-FILTER-002

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 없는 공백을 span 사이에 만들지 않고 실제 공백은 구분한다. has/hasNot 같은 미지원 키는 조용히 무시하지 않는다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 독립 세션·해당 Page/Scope/핸들을 준비한다. 입력 계약: {hasText?:string/RegExp,hasNotText?:string/RegExp,visible?:boolean}; 그 외 키 미지원. 반례 조건: 없는 공백을 span 사이에 만들지 않고 실제 공백은 구분한다. has/hasNot 같은 미지원 키는 조용히 무시하지 않는다.
- When: `locator.filter`를 해당 경계에서 호출하고 오류·반환 및 전후 효과를 판독한다.
- Then: 없는 공백을 span 사이에 만들지 않고 실제 공백은 구분한다. has/hasNot 같은 미지원 키는 조용히 무시하지 않는다.
- 검증 계획: `PLAN-LOCATOR-FILTER-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

## 현재 사실과 근거 한계

기준 구현은 `700a6a06af3f97729327afaf9becb4ee29bb475b`. [카탈로그](../../api-catalog.json)의 과거 상태 `verified-basic`는 기본 호출/당시 제한 기록이다. 본 명세의 모든 옵션·반례 충족을 뜻하지 않는다. [기존 테스트 연결](../../api-test-matrix.json)은 후보이며 소스 fingerprint가 현재와 다른 부분은 과거 증거다. 새 제품 테스트는 이번에 실행·추가하지 않았다. 규범과 다른 코드가 보이면 규범을 낮추지 않고 backlog에서 조사한다.

### REQ-LOCATOR-FILTER-003

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: filter 연속 호출과 nth 전후 조합은 선언 순서를 보존한다. 필터 조건이 새 호출로 덮어써지지 않는다.
- 근거: DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: A와B조건이서로다른5행
- When: filter(A).filter(B),nth(0).filter(B)를각조회
- Then: 전자는교집합,후자는먼저고른행에B를검사한다.
- 검증 계획: `PLAN-LOCATOR-FILTER-003`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-LOCATOR-FILTER-004

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: aria-hidden 제외와 CSS hidden 포함 본문 정책은 getByText와 동일하며 visible 필터가 시각 상태를 따로 결정한다.
- 근거: HIST-INLINE, HIST-R2, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: aria-hidden토큰·CSS숨김토큰·긴slot본문
- When: 양음정규식filter및visible조건
- Then: 본문정책에맞고뒤쪽텍스트도누락없으며g/y정규식반복결과가안정적이다.
- 검증 계획: `PLAN-LOCATOR-FILTER-004`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.
