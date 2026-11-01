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

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/selection-search.md#ref-scope-getbytext). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (검토 1차 반영, 2026-11-01).
- 규범: 공통 selection의 정규화된 composed 본문을 검색하며 출력용 이름 축약과 무관하게 전체 본문을 사용한다. 같은 검색조건에 맞는 composed 후손 요소가 있으면 조상은 제외하는 최소 일치 요소 정책을 적용한다. 남은 연결 요소는 중복 없이 composed 문서 순서로 반환한다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-SCOPE-GETBYTEXT-001-C01부터 C02까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-SCOPE-GETBYTEXT-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-scope.getByText` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-SCOPE-GETBYTEXT-001-C01

- 조건: 접근 이름이 달라도 본문 검색은 전체 정규화 본문을 쓴다.
- 준비: aria-label=A·본문1000자끝needle
- 실행: getByText needle
- 판정: name A로대체하거나300/600자에서끊지않고목표를찾는다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-SCOPE-GETBYTEXT-001-C02

- 조건: 동일 검색에 맞는 후손이 있으면 조상 후보를 제거한다.
- 준비: div/button/span 모두확인문자열
- 실행: exact확인조회
- 판정: 최소매칭span만남고같은형제2개는2개다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-SCOPE-GETBYTEXT-002

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/selection-search.md#ref-scope-getbytext). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 접근 이름과 다른 본문·인접 span·실제 공백·긴 텍스트에서 검색 의미를 공통 selection 계약대로 유지한다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-SCOPE-GETBYTEXT-002-C01부터 C02까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-SCOPE-GETBYTEXT-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-scope.getByText` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-SCOPE-GETBYTEXT-002-C01

- 조건: 실제 공백과 인접 노드의 무공백을 구분한다.
- 준비: foo+bar span/실제foo bar/slot
- 실행: 각문자열및regex조회
- 판정: foobar와foo bar의집합이다르고없는공백삽입없다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-SCOPE-GETBYTEXT-002-C02

- 조건: 본문 숨김 정책은 filter와 같고 조회가 스크롤하지 않는다.
- 준비: aria-hidden/CSS hidden/offscreen
- 실행: 본문조회전후scroll비교
- 판정: aria-hidden제외·CSS숨김포함·scroll불변이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

## 현재 사실과 근거 한계

기준 구현은 `700a6a06af3f97729327afaf9becb4ee29bb475b`. [카탈로그](../../api-catalog.json)의 과거 상태 `verified-basic`는 기본 호출/당시 제한 기록이다. 본 명세의 모든 옵션·반례 충족을 뜻하지 않는다. [기존 테스트 연결](../../api-test-matrix.json)은 후보이며 소스 fingerprint가 현재와 다른 부분은 과거 증거다. 새 제품 테스트는 이번에 실행·추가하지 않았다. 규범과 다른 코드가 보이면 규범을 낮추지 않고 backlog에서 조사한다.

### REQ-SCOPE-GETBYTEXT-003

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/selection-search.md#ref-scope-getbytext). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (검토 1차 반영, 2026-11-01).
- 규범: text는 비어 있지 않은 문자열 또는 RegExp다. 문자열 빈 값은 입력 오류, exact는 문자열 전체 일치에만 적용한다. 정규식에 exact를 함께 주면 exact는 무시하지 않고 미지원 옵션 조합으로 거절한다.
- 근거: DESIGN. 설계 판단이며 현재 충족 증명이 아니다.
- 충족 상태: **미검증**. 구현/테스트는 다음 개발 범위다.
- Given: 아래 REQ-SCOPE-GETBYTEXT-003-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-SCOPE-GETBYTEXT-003`; [매핑](../verification-matrix.json).

- 상세화 판단: `DETAIL-scope.getByText` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-SCOPE-GETBYTEXT-003-C01

- 조건: 빈문자열과regex+exact조합은사전거절한다.
- 준비: 빈text·/확인/와exact true
- 실행: count
- 판정: 입력오류이며정규식단독만패턴대로다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.
