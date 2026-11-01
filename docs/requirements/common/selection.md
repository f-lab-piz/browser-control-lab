# 공통 계약: selection

범위: 이를 참조하는 API. 규범은 목표, 구현/통과 보고가 아니다. 잘못된 입력은 사전 거절한다. 브라우저 자체의 불가역 효과까지 원자성을 약속하지 않는다.

### REQ-C-SELECTION-001

- 수준/판단: **MUST / 수용** (검토 1차 반영, 2026-11-01).
- 규범: count/evaluateAll 및 아래 상태 대기의 명시 예외 외에 단일 대상 조회·조작은 0/다중 매칭을 구분해 거절한다. 자동 첫번째 선택은 없다. CSS 상태 대기는 waitFor의 0/1/N 표를 따른다. 발급 ref의 stale 오류는 부재 성공으로 흡수하지 않는다.
- 근거: SKILL, HIST-COMP. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 동일이름두개와0개대상
- When: 읽기/조작
- Then: 오류구분과무입력;count는2/0이다.
- 검증 계획: `PLAN-C-SELECTION-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-C-SELECTION-002

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: Locator는 지연평가 불변 조합이다. filter와 nth의 호출 순서를 보존하며 이전 Locator를 바꾸지 않는다.
- 근거: DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: A/B/C중B만flag텍스트
- When: filter→nth와nth→filter비교
- Then: 각순서결과가정의대로다르며원locatorcount3이다.
- 검증 계획: `PLAN-C-SELECTION-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-C-SELECTION-003

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 문자열 검색은 공백정규화 후 기본부분일치·exact전체일치, 대소문자 구분이다. RegExp source/flags를 보존하고 g/y도 후보마다 독립 평가한다.
- 근거: CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 한글/이모지/줄바꿈/두번동일패턴
- When: 문자열및정규식반복검색
- Then: 같은입력은같은결과;잘못된정규식은오류다.
- 검증 계획: `PLAN-C-SELECTION-003`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-C-SELECTION-004

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 검색 본문은 composed text node의 실제 순서로 연결해 whitespace run을 한칸으로 정규화한다. 인접 span 사이에 없는 공백은 추가하지 않는다. script/style/noscript/template 및 aria-hidden=true subtree는 제외한다. CSS hidden 본문은 포함하되 visible 필터로 분리한다.
- 근거: HIST-INLINE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: foo+bar인접span,실제foo bar,aria-hidden토큰,CSS숨김토큰
- When: getByText와hasText/hasNotText검색
- Then: foobar와foo bar구분,ARIA숨김제외,CSS숨김포함,양음필터보완이다.
- 검증 계획: `PLAN-C-SELECTION-004`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-C-SELECTION-005

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 접근 이름(role/label)과 검색 본문(getByText/filter), 원문textContent를 구분한다. 출력 이름 축약이 검색범위를 줄이지 않는다.
- 근거: HIST-R2, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: aria-label별도인긴본문버튼
- When: 세방식조회
- Then: 각정의대로매칭되고본문끝검색가능하다.
- 검증 계획: `PLAN-C-SELECTION-005`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-C-SELECTION-006

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: ref는 page/frame/document/element에 결합한다. 같은 문서에서 연결된 동일요소의 ref는 후속snapshot에도 유지가능하지만 detach/교체시 stale다.
- 근거: CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: snapshot2회후요소교체
- When: 각ref조회
- Then: 동일요소ref는작동,교체전ref는실패한다.
- 검증 계획: `PLAN-C-SELECTION-006`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.
