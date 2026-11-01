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

- 조건: 단일조회/조작은strict이며명시예외만0/N을허용한다.
- 준비: 0/2매칭과count/evaluateAll/상태wait
- 실행: 각API호출
- 판정: 단일strict·count0/2·all배열·wait표정책일치다.
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

- 조건: query조합은지연평가불변연산체인이다.
- 준비: DOM갱신·A/B필터·nth순서
- 실행: 같은원본과파생query조회
- 판정: 원본보존·호출순서와최신DOM결과일치다.
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

- 조건: 문자열/regex의정규화·대소문자·반복상태는일관된다.
- 준비: 한글/이모지/줄바꿈·같은후보2개
- 실행: exact/부분/regex g,y반복
- 판정: 문자열대소문자구분·공백정규화·regex후보별lastIndex독립이다.
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

- 조건: 검색본문은실제composed text순서로연결한다.
- 준비: 인접span/실제공백·script/style·ARIA/CSS숨김
- 실행: 양음본문검색
- 판정: 없는공백삽입0·실제공백구분·제외/포함정책정확하다.
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

- 조건: 접근이름/검색본문/원문을별도로판정한다.
- 준비: labelA·긴본문B·raw개행
- 실행: role/label/text/filter/textContent
- 판정: 각정의결과가다르고출력축약이검색을줄이지않는다.
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

- 조건: ref의문서/요소identity를제목/순서와바꾸지않는다.
- 준비: 동일문서2snapshot후element교체
- 실행: old/new ref
- 판정: 동일연결요소ref유지·교체oldstale·다른세션ref불가다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

