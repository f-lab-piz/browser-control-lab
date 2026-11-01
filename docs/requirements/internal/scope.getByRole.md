# scope.getByRole

## 계약과 적용 범위

대상: 확장 QuickJS에 공개하는 기존 API.

공통 계약: [runtime](../common/runtime.md), [dom-frames](../common/dom-frames.md), [selection](../common/selection.md). Page/Frame의 Scope 메서드는 같은 API로 센다. 공통 필수 조건도 이 API의 개발 수용 기준에 포함한다.

- 목적: 네이티브·명시 role과 접근 이름으로 검색하고 기본 숨김 제외/화면 밖 포함을 구분한다.
- 입력/기본값: role:string, options.name?:string/RegExp, exact?:boolean(기본false),includeHidden?:boolean(기본false).
- 출력/성공 의미: 지연 평가 Locator.
- 허용 부작용: 없음.
- 오류/경계: 정규식 source/flags와 exact 문자열을 보존하고 slot/aria-labelledby 이름의 동작을 검증한다.
- 재시도: 읽기는 최신 문서 상태로 다시 관찰할 수 있다. 입력은 완료 여부를 먼저 확인하며 응답 유실만으로 재전송하지 않는다.
- 지원: Chrome debugger/CDP, 허용된 HTTP(S), 현재 연결 DOM. Firefox/Safari·closed Shadow·모든 사이트 완전 지원은 이번 약속이 아니다.

## 개별 요구사항

### REQ-SCOPE-GETBYROLE-001

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/selection-search.md#ref-scope-getbyrole). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 네이티브·명시 role과 접근 이름으로 검색하고 기본 숨김 제외/화면 밖 포함을 구분한다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-SCOPE-GETBYROLE-001-C01부터 C03까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-SCOPE-GETBYROLE-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-scope.getByRole` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-SCOPE-GETBYROLE-001-C01

- 조건: role과name 조건은 함께 적용되며 name 미지정과 빈 name은 구분한다.
- 준비: button 이름A/빈이름·다른roleA
- 실행: name생략/빈문자열exact/이름A조회
- 판정: 각조건의정확한집합이며빈name을name생략으로처리하지않는다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-SCOPE-GETBYROLE-001-C02

- 조건: 문자열 exact와 RegExp는 별도 matching이다.
- 준비: 이름저장/저장하기/Save·한글slotlabel
- 실행: 부분/exact/정규식조회
- 판정: exact는전체문자열,정규식은source/flags,반복호출결과동일이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-SCOPE-GETBYROLE-001-C03

- 조건: includeHidden은 layout숨김을 포함하며 offscreen은 기본포함이다.
- 준비: hidden버튼과offscreen버튼
- 실행: 기본/true조회
- 판정: 기본은hidden제외·offscreen포함,true는hidden도포함한다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-SCOPE-GETBYROLE-002

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/selection-search.md#ref-scope-getbyrole). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 정규식 source/flags와 exact 문자열을 보존하고 slot/aria-labelledby 이름의 동작을 검증한다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-SCOPE-GETBYROLE-002-C01부터 C02까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-SCOPE-GETBYROLE-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-scope.getByRole` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-SCOPE-GETBYROLE-002-C01

- 조건: 잘못된 role/옵션타입/정규식 조합은 조용히 무시하지 않는다.
- 준비: 빈role·includeHidden문자열·regex와exact true
- 실행: 조회
- 판정: 입력/미지원조합오류와무입력이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-SCOPE-GETBYROLE-002-C02

- 조건: 중복 role/name을 조작하면 strict 오류다.
- 준비: 같은저장버튼2개
- 실행: getByRole(...).click
- 판정: 다중오류와서버click0이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

## 현재 사실과 근거 한계

기준 구현은 `700a6a06af3f97729327afaf9becb4ee29bb475b`. [카탈로그](../../api-catalog.json)의 과거 상태 `verified-basic`는 기본 호출/당시 제한 기록이다. 본 명세의 모든 옵션·반례 충족을 뜻하지 않는다. [기존 테스트 연결](../../api-test-matrix.json)은 후보이며 소스 fingerprint가 현재와 다른 부분은 과거 증거다. 새 제품 테스트는 이번에 실행·추가하지 않았다. 규범과 다른 코드가 보이면 규범을 낮추지 않고 backlog에서 조사한다.
