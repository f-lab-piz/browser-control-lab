# PR #6 독립 문서 리뷰

## 발견 사항

### DOC-01 · P2 · PLAN/backlog 연결이 끊어져도 문서 검사기가 PASS를 반환한다

- 위치: `docs/requirements/tools/validate.py:19-24` (JSON 로드 목록은 같은 파일 5행). 문서상 약속: `docs/requirements/evidence/validation-method.md:19`.
- PR에서 새로 도입된 검증 누락이다. 검사기는 `condition-index.json`의 `planId`, 참고 index의 `planId`/`workItem`을 검사하지 않고 `backlog-map.json`, `condition-verification-map.json`은 읽지도 않는다. 19~24행의 참고 슬롯 검사는 provider/condition ID 집합/claim ID/참고 제목만 확인한다.
- 발생 조건: 상세조건 또는 참고 index의 PLAN/담당 작업이 존재하지 않는 ID로 변경되거나, 요구별/조건별 개발 매핑이 누락되는 경우다. 문서는 이 명령이 PLAN/backlog 연결을 검사한다고 안내하므로, 개발자가 검사를 통과한 문서에서 요구→검증계획→담당 작업의 연결을 신뢰할 수 없게 된다.
- 기대: 정본 REQ/조건 집합과 두 매핑의 집합·고유성 및 PLAN/담당 작업 대응이 어긋나면 nonzero 종료해야 한다. 실제: 아래 두 메모리 변형에서 모두 종료 코드 0과 `DOCUMENT_STRUCTURE_ONLY_PASS`를 반환했다.
  1. 첫 condition의 `planId`를 `PLAN-NONEXISTENT`로 바꾼 입력.
  2. 첫 reference requirement의 `planId`를 `PLAN-NONEXISTENT`, `workItem`을 `B99`로 바꾼 입력.
- 재현은 `Path.read_text`의 반환값을 실행 중 메모리에서만 대체했다. 제품/테스트/문서 파일은 수정하지 않았다. 별도 읽기 감시에서 backlog/condition-verification-map 접근은 0회였다. 재현 코드와 결과: `probe_validator.py`, `probe-validator-result.jsonl`.
- 현재 HEAD 데이터 자체는 독립 교차검사에서 정상이다. 이 지적은 현존하는 끊어진 PLAN을 주장하는 것이 아니라, 이번 PR의 문서 도구가 명시적으로 보장한 구조 검증을 수행하지 않는 재현된 결함이다.

### 비차단 검사 결과 · EOF 공백

`git diff --check`는 `docs/requirements/reference-methods/evidence/aside/current-main-guide.txt:88`, `current-repl-guide.txt:153`의 추가 EOF 빈 줄 때문에 종료 코드 2다. 둘 다 CLI 원문 캡처이며 내용 보존의 이유가 있으므로 의미론적 결함으로 합산하지 않았다. 정규화 여부 또는 원문 예외 처리는 메인 판단 사항이다. 현재 bytes/hash는 아래에 보존했다.

그 외 확인한 범위에서 확정 P0/P1 및 잘못된 경쟁 지원 승격은 발견하지 않았다.

## 검증/재현 명령 및 결과

작업 경로: `.` (저장소 루트; 개인 경로 표기만 일반화).

- `git rev-parse HEAD`: 요청한 `b9f6db00fe997f7841caf3b31af452dd3c110a5c`와 일치. 리뷰 시작/종료 시 tracked 변경 없음.
- `python3 docs/requirements/tools/validate.py`: exit 0. 185 REQ, 254 상세조건, 370 슬롯, 508 조건단위, 152 claims, 19 sources, 35 동결 제품파일을 출력했다. 이 결과가 확인하는 범위와 DOC-01에서 빠지는 범위를 구분한다.
- `npm test`: exit 0, 7 tests / 7 pass / 0 fail. 기존 계약·서버 테스트이며 신규 요구의 제품 적합성 증거로 해석하지 않았다.
- `git diff --check 700a6a06af3f97729327afaf9becb4ee29bb475b..b9f6db00fe997f7841caf3b31af452dd3c110a5c`: exit 2, 위 원문 캡처의 EOF 두 건.
- `python3 .local/goal-development/review-docs/probe_validator.py`: exit 0. 잘못된 PLAN/작업 두 입력 모두 검사기가 ACCEPTED. 두 개발 매핑 파일은 읽지 않음. 검사기를 호출한 프로브의 종료 코드와 검사기의 잘못된 성공 반환을 구분한다.
- 독립 read-only Python 교차검사: index/matrix/backlog/reference의 185 REQ ID 집합·고유성, PLAN ID·수준·작업 대응, 각 조건의 정본 REQ 내부 위치·spec·수준·작업, matrix conditionIds 및 condition-verification-map의 254 조건별 ID/PLAN/spec/anchor/담당 대응을 검사했다. 불일치 0.
- 해시/바이트 독립 대조: `document-validation.json`의 106개 documentDigests 전부 현재 일치. cycle-3 read-manifest의 78개 파일(정본 72+참고본문 6) 해시 전부 일치. 같은 78개는 Git의 마지막 검토 SHA `367c16f7fd9ca6de7bac52290ebabe50ba88ee90`과 현재 바이트도 동일.
- Codex 역사 source-manifest의 4개 원본/사본 쌍은 기록 hash와 모두 일치. review1-artifact-manifest의 현재 패키징된 18파일도 모두 일치. 당시 생성 스크립트 `build_research.py`, `record_boundary1.py`, `refine_research.py` 3개는 저장소에 없고 역사 manifest에만 남았다. 원시 자료/본문은 보존되어 있으며 이를 제품 또는 근거 조작으로 보고하지 않았다.
- Aside 원문 EOF 관련 현재 기록: main guide 4452 bytes, SHA256 `69efe203e5d7b1e91e0617dc46adde5c50c52299af1b1436ac8e6e17275653ec`; repl guide 8409 bytes, SHA256 `0f36a95f730dd2f021b37c0bcc915bb9f0c90f375e42ba8fd64ef4e93649254c`. 둘 다 끝 바이트는 `\n\n`.

## 실제 검토 범위 / 미실행·차단

- AGENTS.md, 프로젝트 SKILL.md와 pr-review.md, 실제 base→head 변경 목록/통계, 관련 두 계획 문서, 완료/상태 해석 문서, 검증 도구 전체를 읽었다.
- 185 REQ/254 조건/370 참고 슬롯 전체는 구조·매핑 대상으로 독립 검사했다. 152 claim의 종류/문장/위치 요약 전체를 확인하고, Codex 공개계약 발췌 및 Aside REPL 공개가이드, 제품 표면·미측정 구분을 대조했다. 여섯 참고본문의 73개 ref 섹션과 호출 조각을 추출해 확인했다.
- 의미론적 상세 검토는 실행/출력, snapshot/프레임, 파일/이벤트와 현재 dialog 복구, 일부 선택/입력/수명 예제 및 관련 근거를 중심으로 수행했다. 모든 185개 규범/254개 판정식과 모든 역사 원시 로그의 의미를 처음부터 전수 재판정한 것은 아니다. 과거 독립 PASS는 본 리뷰의 승인 근거로 전용하지 않았다.
- 브라우저·제품 확장 E2E, 신규 fixture/요구 테스트, 실제 Codex/Aside 비교 재실행, 외부/회사 사이트 실행은 하지 않았다. 문서 전용 범위이므로 해당 결과를 만들지 않았다.
- 원격 PR 게시/승인/병합은 수행하지 않았다. 수정은 ignored scratch의 재현 코드/결과와 본 보고서에 한정한다.

## 남은 위험

- 조건 전체 동등성 0/508 및 508 not-established가 제품 미지원이라는 뜻이 아니라는 구분은 명시되어 있다. 문서/부분 관측/과거 관측이 경쟁 전체지원 또는 우리 제품 PASS로 승격되었다고 확인하지 않았다.
- 매핑 데이터는 현재 정합하지만 DOC-01이 남으면 이후 PLAN/backlog 드리프트를 제공된 명령이 놓친다. 완료 문구의 검사 범위를 낮추거나 실제 검사를 보완하고, 동일 손상 입력을 거절하는지 확인해야 한다.
- 문서의 모든 설계 선택을 제품 동작과 대조한 리뷰가 아니며, 구현 착수 시 해당 조건별 정상/거절/부분효과 검증이 필요하다.

## 검토 SHA와 판정

- Base: `700a6a06af3f97729327afaf9becb4ee29bb475b`
- Head: `b9f6db00fe997f7841caf3b31af452dd3c110a5c`
- 판정: **CHANGES_REQUESTED** — 문서 추적성 검사에 관한 재현된 P2 한 건. 제품/테스트/문서의 수정은 이 리뷰에서 수행하지 않았다.


## 메인 판단

DOC-01을 수용했다. validator에 부모/상세 PLAN·backlog·검증 매핑·API 이름 교차 검사를 추가하고, 잘못된 JSON을 메모리에서 주입하는 회귀를 추가한다. 원문 EOF blank2건은 공개 stdout 보존 사유로 비차단 기록을 유지한다. 새 head의 독립 재리뷰 판정은 별도 기록한다.
