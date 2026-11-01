# PR #6 독립 문서 재리뷰

## 발견 사항

확정 신규 P0/P1/P2/P3 지적은 없다. 이전 **DOC-01 · P2는 이번 보완 범위에서 해결**되었다.

- 이전 재현의 첫 condition `planId=PLAN-NONEXISTENT`, 첫 reference `planId=PLAN-NONEXISTENT`/`workItem=B99`, 빈 backlog map, 빈 condition verification map을 새 head에 메모리 주입했다. 네 입력 모두 validator가 해당 파일을 실제로 읽고 `AssertionError`로 거절했다. 원래 누락된 파일 읽기와 PLAN/작업 대응 검사가 추가된 코드 경로도 확인했다(`docs/requirements/tools/validate.py:25`).
- 보완은 부모 PLAN의 REQ 유도 형식·고유성, backlog/reference PLAN·작업 대응, backlog API/수준, spec/anchor, 부모의 상세조건 집합·중복, 조건 PLAN·작업·spec·anchor·API/수준·부모 대응 및 catalog API 이름을 검사한다. 추가한 회귀가 정상 문서의 성공과 8개 손상 입력의 실패를 확인하는지 직접 실행했다.
- 독립 작성한 20개 메모리 손상 검사에서도 원래 4건과 backlog/조건 매핑 중복, PLAN·작업·API·수준·spec·anchor 드리프트, 중복 부모 조건, API 이름 변형을 모두 거절했다. 재현 파일은 같은 scratch 폴더의 `probe_validator.py`, 결과는 `probe-results.json`이다. 정본 파일을 수정하지 않는다.
- 현재 데이터는 정본 Markdown의 REQ/조건 ID를 별도로 추출해 matrix·condition index·backlog·condition map·reference index와 집합/고유성을 대조했다. 185 부모 REQ·254 조건·439 고유 PLAN·370 슬롯·508 조건단위가 일치했고 부모 spec/API의 정본 index 대응 및 조건 ID의 부모도 일치했다. 이는 검사기 자체의 성공 반환과 별도로 확인했다.

기존 비차단 EOF 두 건은 남아 있다. Aside 실제 stdout의 끝 `\n\n`을 보존한다는 사유가 `docs/requirements/evidence/validation-method.md:26`에 기록되어 있고, 두 파일의 바이트/hash는 이전 검토 head와 동일하다. 이 재리뷰에서 의미론적 결함으로 격상하지 않는다.

## 검증/재현 명령 및 결과

작업 경로: `.` (저장소 루트; 개인 경로 표기만 일반화).

|실행|종료 코드·결과|
|---|---|
|`git rev-parse HEAD`|요청 head `3c742660c1d42c33c7fcbe2dfaad38cfd130df93`와 일치|
|`python3 docs/requirements/tools/validate.py`|0. 185 REQ / 254 조건 / 370 슬롯 / 508 단위 / 152 claims / 19 sources / 동결 제품35파일. `DOCUMENT_STRUCTURE_ONLY_PASS`, 로컬 링크·레지스트리·run 파일 존재 확인|
|`python3 docs/requirements/tools/test_validate.py`|0. 2 unittest 메서드 통과. 손상 회귀 메서드는 8개 subtest를 포함|
|`npm test`|0. 7 tests / 7 pass / 0 fail / 0 skip|
|`python3 .local/goal-development/review-docs/probe_validator.py`|0. 원래 4개 probe 모두 `REJECTED: AssertionError`; 대상 파일 읽기 모두 확인|
|`python3 .local/goal-development/rereview-docs/probe_validator.py`|0. 독립 손상 20개 모두 REJECTED, 대상 파일 읽기 모두 확인. 결과 JSON 저장|
|독립 inline Python 정본 교차검사|0. 위 ID·고유성·정본 경로/API·조건 부모·실제 슬롯 수 일치|
|`git diff --check b9f6db00fe997f7841caf3b31af452dd3c110a5c..3c742660c1d42c33c7fcbe2dfaad38cfd130df93`|0. 보완 diff whitespace 오류 없음|
|`git diff --check 700a6a06af3f97729327afaf9becb4ee29bb475b..3c742660c1d42c33c7fcbe2dfaad38cfd130df93`|2. 기존 `current-main-guide.txt:88`, `current-repl-guide.txt:153` EOF blank 두 건만 출력|

Aside 원문 바이트/hash 독립 대조:

- `current-main-guide.txt`: 4452 bytes, SHA256 `69efe203e5d7b1e91e0617dc46adde5c50c52299af1b1436ac8e6e17275653ec`, 끝 `\n\n`.
- `current-repl-guide.txt`: 8409 bytes, SHA256 `0f36a95f730dd2f021b37c0bcc915bb9f0c90f375e42ba8fd64ef4e93649254c`, 끝 `\n\n`.

## 실제 검토 범위 / 미실행·차단

- AGENTS.md, 프로젝트 SKILL.md, `references/pr-review.md`, 이전 `docs/reviews/pr6-documents.md`, validator와 신규 회귀 전체, validation-method 전체, 요구 README/backlog/완료·참고완료 및 현재 상태 문서를 읽었다.
- base→head 변경 목록/통계와 이전 검토 head→새 head 전체 diff를 확인했다. 새 diff는 validator 32행, 신규 회귀48행, 보완 설명7행, 이전 리뷰/메인판단59행의 4파일·146행 추가다. 제품·fixture·기존 테스트 구현 변경은 없다.
- 이번 재리뷰의 의미론적 집중 범위는 DOC-01 및 위 보완 4파일이다. 185 REQ/254 조건은 ID/경로/API/매핑의 구조 대상으로 독립 교차검사했다. 기존 문서 약 7.6만 추가행 전체와 모든 원시 근거를 처음부터 의미론적으로 다시 판정하지 않았다. 이전 PASS 보고서를 새 승인 근거로 전용하지 않았다.
- 브라우저/확장 E2E, fixture oracle, 신규 요구별 제품 테스트, 현재 Codex/Aside 비교, 외부·회사 사이트는 실행하지 않았다. 문서 검사 및 기존 npm 단위/계약 테스트는 제품의 새 목표계약 충족 증거가 아니다.
- 제품·문서·테스트 원본, 원격 PR 댓글/리뷰/승인/병합은 변경하지 않았다. 생성 파일은 ignored `.local/goal-development/rereview-docs/` 아래로 한정했다.

## 남은 위험

- validator는 정합성 검사이며 모든 규범의 의미론적 충분성이나 이후 제품 구현의 정확성을 증명하지 않는다. 20개 독립 손상 probe도 모든 가능한 손상 조합의 전수 검사는 아니다.
- 과거 `document-validation.json`과 독립3회 기록은 당시 head의 기록으로 유지한다는 새 설명을 확인했다. 그 기록을 새 head의 제품 테스트나 재승인으로 해석하지 않는다.
- 두 원문 EOF 경고 때문에 전체 base diff의 `git diff --check`는 여전히 nonzero다. 보완 diff 자체는 clean이며, 보존 사유/원문 hash를 분리 기록했다.
- 제품 적합성·현재 경쟁조건 전체 동등성·실서비스 범용 지원은 이 재리뷰에서 확인하지 않았다. 다음 구현 단계의 조건별 실제 검증이 필요하다.

## 검토 SHA와 판정

- PR: #6
- Base: `700a6a06af3f97729327afaf9becb4ee29bb475b`
- 이전 검토 head: `b9f6db00fe997f7841caf3b31af452dd3c110a5c`
- 이번 검토 head: `3c742660c1d42c33c7fcbe2dfaad38cfd130df93`
- 판정: **PASS — DOC-01 해결 및 이번 문서 검사기 보완 범위.** 제품 구현/새 요구 충족 또는 미검토 전체 의미의 승인을 뜻하지 않는다. 원격 승인은 게시하지 않았다.
