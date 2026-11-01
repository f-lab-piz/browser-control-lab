# 공통 계약: selection

범위: 이를 참조하는 API. 규범은 목표, 구현/통과 보고가 아니다. 잘못된 입력은 사전 거절한다. 브라우저 자체의 불가역 효과까지 원자성을 약속하지 않는다.

### REQ-C-SELECTION-001

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/selection-search.md#ref-selection). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (검토 1차 반영, 2026-11-01).
- 규범: count/evaluateAll 및 아래 상태 대기의 명시 예외 외에 단일 대상 조회·조작은 0/다중 매칭을 구분해 거절한다. 자동 첫번째 선택은 없다. CSS 상태 대기는 waitFor의 0/1/N 표를 따른다. 발급 ref의 stale 오류는 부재 성공으로 흡수하지 않는다.
- 근거: SKILL, HIST-COMP. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-C-SELECTION-001-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-C-SELECTION-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-selection` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-C-SELECTION-001-C01

- 조건: 단일 조회/조작은 strict이며 명시 예외만 0/N을 허용한다.
- 준비: 0/2 매칭과 count/evaluateAll/상태 wait
- 실행: 각 API 호출
- 판정: 단일 strict·count0/2·all 배열·wait 표 정책 일치다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-C-SELECTION-002

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/selection-search.md#ref-selection). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: Locator는 지연평가 불변 조합이다. filter와 nth의 호출 순서를 보존하며 이전 Locator를 바꾸지 않는다.
- 근거: DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-C-SELECTION-002-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-C-SELECTION-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-selection` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-C-SELECTION-002-C01

- 조건: query 조합은 지연 평가 불변 연산 체인이다.
- 준비: DOM 갱신·A/B 필터·nth 순서
- 실행: 같은 원본과 파생 query 조회
- 판정: 원본 보존·호출 순서와 최신 DOM 결과 일치다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-C-SELECTION-003

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/selection-search.md#ref-selection). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 문자열 검색은 공백정규화 후 기본부분일치·exact전체일치, 대소문자 구분이다. RegExp source/flags를 보존하고 g/y도 후보마다 독립 평가한다.
- 근거: CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-C-SELECTION-003-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-C-SELECTION-003`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-selection` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-C-SELECTION-003-C01

- 조건: 문자열/regex의 정규화·대소문자·반복 상태는 일관된다.
- 준비: 한글/이모지/줄바꿈·같은 후보 2개
- 실행: exact/부분/regex g,y 반복
- 판정: 문자열 대소문자 구분·공백 정규화·regex 후보별 lastIndex 독립이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-C-SELECTION-004

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/selection-search.md#ref-selection). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 검색 본문은 composed text node의 실제 순서로 연결해 whitespace run을 한칸으로 정규화한다. 인접 span 사이에 없는 공백은 추가하지 않는다. script/style/noscript/template 및 aria-hidden=true subtree는 제외한다. CSS hidden 본문은 포함하되 visible 필터로 분리한다.
- 근거: HIST-INLINE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-C-SELECTION-004-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-C-SELECTION-004`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-selection` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-C-SELECTION-004-C01

- 조건: 검색 본문은 실제 composed text 순서로 연결한다.
- 준비: 인접 span/실제 공백·script/style·ARIA/CSS 숨김
- 실행: 양음 본문 검색
- 판정: 없는 공백 삽입 0·실제 공백 구분·제외/포함 정책 정확하다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-C-SELECTION-005

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/selection-search.md#ref-selection). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 접근 이름(role/label)과 검색 본문(getByText/filter), 원문textContent를 구분한다. 출력 이름 축약이 검색범위를 줄이지 않는다.
- 근거: HIST-R2, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-C-SELECTION-005-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-C-SELECTION-005`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-selection` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-C-SELECTION-005-C01

- 조건: 접근 이름/검색 본문/원문을 별도로 판정한다.
- 준비: labelA·긴 본문 B·raw 개행
- 실행: role/label/text/filter/textContent
- 판정: 각 정의 결과가 다르고 출력 축약이 검색을 줄이지 않는다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-C-SELECTION-006

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/selection-search.md#ref-selection). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: ref는 page/frame/document/element에 결합한다. 같은 문서에서 연결된 동일요소의 ref는 후속snapshot에도 유지가능하지만 detach/교체시 stale다.
- 근거: CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-C-SELECTION-006-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-C-SELECTION-006`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

- 상세화 판단: `DETAIL-selection` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-C-SELECTION-006-C01

- 조건: ref의 문서/요소 identity를 제목/순서와 바꾸지 않는다.
- 준비: 동일 문서 2snapshot 후 element 교체
- 실행: old/new ref
- 판정: 동일 연결 요소 ref 유지·교체 oldstale·다른 세션 ref 불가다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

## 이름 계산 상세표

v1의 현재 지원 naming 소스만 순서를 정하며 전체 AX 표준 동등성을 추가 약속하지 않는다.

1. aria-labelledby의 유효 IDREF를 지정 순서로 읽는다. 중복 IDREF는 첫 항목만, 일부 유효면 유효 참조만 사용한다. 참조가 전부 없거나 결합 결과가 비면 다음 소스로 fallback한다. 대상 element의 getRootNode()가 반환한 Document/ShadowRoot 안에서 getElementById 기준 첫 id요소를 사용하며 다른 frame/ShadowRoot로 fallback하지 않는다. 순환 분기는 빈 기여로 끊는다.
2. 비어 있지 않은 aria-label.
3. 연결된 native label들의 document 순서 텍스트.
4. img/input image는 alt, 그 다음 title, input/textarea는 placeholder, 그 다음 본문 이름을 허용한 역할의 composed 본문. 본문 fallback 대상은 button/link/heading/option/tab 및 일반 텍스트 후보이며 main/region/navigation/table/row/list의 무명 본문을 긴 이름으로 합치지 않는다.

각 단계는 공통 whitespace 정규화를 적용하고 검색 이름을 출력용300자 예산으로 자르지 않는다. 직접 참조한 label/aria-labelledby 본문은 CSS/ARIA 숨김이어도 이름 소스에 포함하되 script/style/noscript/template을 제외한다. 대상 자체 숨김은 getByRole.includeHidden이 결정한다.

getByRole의 name은 최종 이름을 쓴다. getByLabel은 명시 ARIA/native label 소스가 연결된 지원 제어(input/textarea/select/button)에 한해 같은 우선순위의 명시 이름을 쓴다. 일반 본문/placeholder만으로 label 연결을 만들지 않는다. 유효 labelledby와 aria-label/native label이 충돌하면 최종 이름만 검색하며 하위 이름 합집합으로 우회하지 않는다.
