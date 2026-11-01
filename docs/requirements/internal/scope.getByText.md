# scope.getByText

## 계약과 적용 범위

대상: 확장 QuickJS에 공개하는 기존 API.

공통 계약: [runtime](../common/runtime.md), [dom-frames](../common/dom-frames.md), [selection](../common/selection.md). Page/Frame의 Scope 메서드는 같은 API로 센다. 공통 필수 조건도 이 API의 개발 수용 기준에 포함한다.

- 목적: 검색용 본문 텍스트를 사용하며 화면 출력용 이름 길이 제한 때문에 뒤쪽 목표를 잃지 않는다.
- 입력/기본값: text:string/RegExp, options.exact?:boolean(기본false).
- 출력/성공 의미: 지연 평가 Locator.
- 허용 부작용: 없음.
- 오류/경계: 접근 이름과 다른 본문·인접 span·실제 공백·긴 텍스트에서 검색 의미를 공통 selection 계약대로 유지한다.
- 재시도: 읽기는 최신 문서 상태로 다시 관찰할 수 있다. 입력은 완료 여부를 먼저 확인하며 응답 유실만으로 재전송하지 않는다.
- 지원: Chrome debugger/CDP, 허용된 HTTP(S), 현재 연결 DOM. Firefox/Safari·closed Shadow·모든 사이트 완전 지원은 이번 약속이 아니다.

## 개별 요구사항

### REQ-SCOPE-GETBYTEXT-001

- 수준/판단: **MUST / 수용** (검토 1차 반영, 2026-11-01).
- 규범: 공통 selection의 정규화된 composed 본문을 검색하며 출력용 이름 축약과 무관하게 전체 본문을 사용한다. 같은 검색조건에 맞는 composed 후손 요소가 있으면 조상은 제외하는 최소 일치 요소 정책을 적용한다. 남은 연결 요소는 중복 없이 composed 문서 순서로 반환한다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: <div><button><span>확인</span></button></div>, 직접 텍스트와 자식 텍스트가 섞인 div, 두 형제 버튼, open slot을 준비한다.
- When: exact/부분일치/정규식으로 getByText를 만들고 count·evaluateAll identity·click을 확인한다.
- Then: 첫 DOM은 span만 남으며 click은 button으로 버블링한다. 두 형제의 동일 텍스트는 둘 다 남아 직접 click이 다중 오류다. slot 경계에서도 조상 중복이 없다.
- 검증 계획: `PLAN-SCOPE-GETBYTEXT-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-SCOPE-GETBYTEXT-002

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 접근 이름과 다른 본문·인접 span·실제 공백·긴 텍스트에서 검색 의미를 공통 selection 계약대로 유지한다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 독립 세션·해당 Page/Scope/핸들을 준비한다. 입력 계약: text:string/RegExp, options.exact?:boolean(기본false). 반례 조건: 접근 이름과 다른 본문·인접 span·실제 공백·긴 텍스트에서 검색 의미를 공통 selection 계약대로 유지한다.
- When: `scope.getByText`를 해당 경계에서 호출하고 오류·반환 및 전후 효과를 판독한다.
- Then: 접근 이름과 다른 본문·인접 span·실제 공백·긴 텍스트에서 검색 의미를 공통 selection 계약대로 유지한다.
- 검증 계획: `PLAN-SCOPE-GETBYTEXT-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

## 현재 사실과 근거 한계

기준 구현은 `700a6a06af3f97729327afaf9becb4ee29bb475b`. [카탈로그](../../api-catalog.json)의 과거 상태 `verified-basic`는 기본 호출/당시 제한 기록이다. 본 명세의 모든 옵션·반례 충족을 뜻하지 않는다. [기존 테스트 연결](../../api-test-matrix.json)은 후보이며 소스 fingerprint가 현재와 다른 부분은 과거 증거다. 새 제품 테스트는 이번에 실행·추가하지 않았다. 규범과 다른 코드가 보이면 규범을 낮추지 않고 backlog에서 조사한다.

### REQ-SCOPE-GETBYTEXT-003

- 수준/판단: **MUST / 수용** (검토 1차 반영, 2026-11-01).
- 규범: text는 비어 있지 않은 문자열 또는 RegExp다. 문자열 빈 값은 입력 오류, exact는 문자열 전체 일치에만 적용한다. 정규식에 exact를 함께 주면 exact는 무시하지 않고 미지원 옵션 조합으로 거절한다.
- 근거: DESIGN. 설계 판단이며 현재 충족 증명이 아니다.
- 충족 상태: **미검증**. 구현/테스트는 다음 개발 범위다.
- Given: 빈 문자열, /확인/와 exact:true, /확인/만을 준비한다.
- When: getByText를 호출하고 count로 평가한다.
- Then: 앞 두 입력은 명시 입력 오류, 정규식 단독은 정규식 의미대로 동작하며 입력 부작용은 없다.
- 검증 계획: `PLAN-SCOPE-GETBYTEXT-003`; [매핑](../verification-matrix.json).
