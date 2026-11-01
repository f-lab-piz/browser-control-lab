# PR22 독립 문서·스킬·계정중립 리뷰

## 발견 사항

**새 P0/P1/P2/P3 발견 없음. PASS — 지정한 전체 base→head의 문서·스킬·인계·계정중립 정리 범위.** 기존 PASS를 정답으로 삼지 않고 실제 35파일 diff, 연결 정본·계획·개발 기록·증거·소스 바이트를 대조했다. 제품 브라우저 suite를 이번 head에서 새로 실행했다는 뜻이 아니다.

- 재현 가능한 신규 결함이 없어 결함별 재현/기대·실제/사용자 영향 항목은 없다.
- 기존 raw 문서 보존 사본 `docs/requirements/reference-methods/evidence/codex/raw/historical-fixes-before-after.md`의 `review-round2.md` 및 `evidence/diagnostics-before-after.json` 상대링크 2개는 base와 head 양쪽에서 동일하게 대상이 없다. 원문 위치에 종속된 과거 링크이며 이번 PR이 도입하거나 악화하지 않았다. 새 인계 문서는 보존 스크립트/문서의 원래 상대경로 한계를 설명한다.
- 개인정보 탐색의 넓은 대소문자 무시 패턴이 검출한 3파일은 모두 `Home/End` 키 목록이었다. 실제 사용자 홈 경로로 판정하지 않았다. Git 작성자/과거 이력과 기존 ignored 파일의 개인 표기는 현재 tracked 파일 잔존으로 계산하지 않았다.

## 직접 검증 및 근거

적용: `AGENTS.md`, `.agents/skills/browser-control-development/SKILL.md`, `references/pr-review.md`, `references/autonomous-implementation.md`. 관련 정본은 locator.filter/nth, 공통 selection, 21단계 계획/ledger, 테스트·runtime 사용법, B02A 제품/최종 delta 보고서·manifest를 읽었다.

작업 기준은 저장소 루트 `.`다. 시작 시 실제 HEAD가 지정 head와 일치했고 `git status --short`는 비어 있었다. 검토 중 tracked 파일·기존 ignored 자료·Git 설정을 수정하지 않았으며 새 scratch/report/export는 `output/pr22-independent-review/`에만 기록했다. 원격 댓글·리뷰·승인·머지를 하지 않았다.

|검증/명령|직접 결과|
|---|---|
|`git diff b14fccb2ad7e94f183daf6c7d1714f4e9b1acd47 289e7b4731567f529b84ea3e6c546b0da2b3abd5` 전체 이름/내용 검토|35파일; 제품·테스트·fixture·빌드·의존성 변경 없음|
|`python3 docs/requirements/tools/validate.py`|exit 0, DOCUMENT_STRUCTURE_ONLY_PASS; 185 REQ/254조건/370슬롯. 과거 제품 동결 옵션은 요청하지 않음|
|`python3 docs/requirements/tools/validate_development_plan.py`|exit 0, PLAN_STRUCTURE_PASS; 21 slice/185 REQ/254조건|
|`PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s docs/requirements/tools -p 'test_*.py'`|exit 0, 6 tests PASS|
|`PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=.local/skill-validation-deps python3 "$CODEX_HOME/skills/.system/skill-creator/scripts/quick_validate.py" .agents/skills/browser-control-development`|exit 0, Skill is valid. 기존 의존성 배치는 읽기만 사용|
|`git diff --check b14fccb2ad7e94f183daf6c7d1714f4e9b1acd47 289e7b4731567f529b84ea3e6c546b0da2b3abd5`|exit 0|
|`git ls-files -z`에 열거된 전체516파일의 bytes 검색|알려진 개인 owner/user/domain/PC, 개인 SSH, Unix/Windows 절대 홈 경로의 확인된 잔존 0. 일반 email 패턴은 결정적 fixture의 example.test 값만 확인|
|6개 `docs/evidence/*/manifest.json`의 retained SHA-256 직접 계산|215/215 일치: B01A29, B01B9, B01C53, B01D29, B01E24, B02A71. 기존 artifact 삭제0, 기존 sourceSha256 변경0|
|정규화 대상 증거3개의 원시 경로를 읽기만 하여 sourceSha256 계산|3/3 원시 digest 일치. 이전 문서 commit 대비 retained 변화도 URL/저장소 지정 인자의 개인정보 일반화만이며 테스트 결과·검토 SHA·판정 불변|
|승인 제품 JSON의36개 sourceSha256을 승인 SHA/base/head/현재 파일에서 계산|36/36 모두 일치|
|지문36개 외 실제 실행 입력까지 대조|bridge/extension/shared/scripts/tests/test-site/설정 및 runtime-usage/api-catalog/package/lock의73파일이 승인 SHA·base·head에서 불변. build-extension, manifest/offscreen, 테스트 helper 등 지문 밖 입력도 포함|
|전체 Markdown/text 로컬 파일 링크의 base/head 대조|새 파손0. 위 기존 raw 사본2건만 동일|
|삭제된 외부 URL 분류|개인 저장소 참조 외 공식 소스·라이선스 링크 삭제0|
|`git archive <head>` tracked-only 내보내기|516파일 모두 원본 bytes와 일치; `.git`/node_modules/output/.local 없음|
|내보낸 폴더에서 두 validator 및 동일 Python unittest|모두 exit 0, Python6 PASS. ignored 체크포인트/인증/의존성 없이 문서 구조·ledger·정본 연결 검증 가능|
|`gh pr view 20 --json number,state,mergeCommit,headRefOid,baseRefOid`|읽기 전용 exit 0; MERGED, head d513cfa8b9636fab324d633988a81566d3f72a76, merge b14fccb2ad7e94f183daf6c7d1714f4e9b1acd47|
|`gh issue view 19 --json number,state`|읽기 전용 exit 0; CLOSED|
|`gh pr view 22 --json number,state,headRefOid,baseRefOid`|읽기 전용 exit 0; OPEN, 요청된 base/head 일치|

문서 일관성:

- clone의 REPOSITORY_URL 자리표시자, 현재 origin 사용, CODEX_HOME/TEST_CHROME 설정과 POSIX/PowerShell 예제가 실제 제품·하니스의 환경변수 사용과 연결된다. 과거 PR/Issue 번호는 이전 저장소 이력일 수 있으며 현재 원격의 같은 번호와 같다고 가정하지 않도록 설명한다.
- 새 PC 설치·bootstrap→전체→단독 headed 순서, 실행 수 중복 합산 금지, BCL_RUN_DIR의 부분 적용과 legacy 고정 출력 즉시 보존 안내가 하니스와 일치한다. 다른 OS/PC의 제품 성공을 주장하지 않는다.
- PR20 제품 승인 SHA와 최종 문서 delta SHA, 실제 merge SHA를 구분한다. 과거 delta의 보존69개와 현재71개를 구분하며, 현재 sha256은 정규화 사본, sourceSha256은 당시 원시 바이트를 가리킨다. 원시 runtime 고정경로 덮어쓰기 한계도 숨기지 않는다.
- ledger의 executionScope/requirements/conditions는 base와 완전히 같다. 첫6 slice PASS/37부모54조건, 이후15 slice not-started. B02B는7부모9조건이며 인계에 연결된 요구/반례는 정본과 일치한다. 정적 조사 후보를 실패 재현/구현 완료로 바꾸지 않았다.
- 개발 로그·색인·상태·초기8단계 계획의 이력 표시는 재개 흐름을 연결한다. 새 컨텍스트 정식 리뷰, 진행 중 재현 보충의 기존 리뷰어 재사용, 문서 delta의 실행 입력/환경 검증, 새 PC baseline 요구를 서로 혼동하지 않는다.

재현 보조 자료: `output/pr22-independent-review/audit.py`, `audit.json`, `supplemental-audit.json` 및 각 context의 검사 로그. broad 홈 패턴 후보는 supplemental의 수동 판독 결과와 함께 해석한다.

## 환경·설정·미실행

직접 확인한 환경은 Darwin arm64, Node25.2.1, Python3.14.2, Playwright1.64.1, Chrome for Testing145.0.7632.6이다. TEST_CHROME은 unset이며 하니스 기존 fallback 실행 파일의 `--version`을 읽었다. `npm ls --depth=0`는 exit0으로 고정 설치 버전을 보여줬다. 의존성 설치/업데이트나 브라우저 실행 설정 변경은 하지 않았다. 과거 실측 기록과 표시 버전이 일치하지만 다른 PC의 호환성을 증명하지 않는다.

- npm test, 전체132/외부1 SKIP, 단독 headed45, 추가 제품3그룹, bootstrap 및 제품 브라우저 경계는 이번 리뷰에서 새 실행하지 않았다. 승인 제품 입력36개와 지문 밖 실행 입력을 포함한 실제 소스·fixture·의존성·도구 사용법이 그대로이고, 환경 표시 버전도 동일하며 이번 문서 변경이 추가 제품 실행을 요구하는 회귀 근거는 발견하지 못했다. 따라서 문서 delta 검증 범위를 적용했다.
- 과거132/45/3그룹은 정확23aff96 제품 승인에서 실행된 기록으로만 확인했다. 현재 head의 새 제품 PASS로 집계하지 않는다.
- 새 OS/PC의 npm ci·브라우저 설치·확장 bootstrap·실제 제품 suite, 경쟁툴 신규 비교, 외부 Naver/회사 사이트, 전체185REQ 수용은 미실행이다.
- GitHub 보호규칙·필수 CI·mergeable 최종 gate 및 실제 머지는 메인의 후속 범위다. 이 읽기 전용 리뷰가 이를 대신하지 않는다.

## 남은 위험

B03A 과거 headed frame-tree timeout의 원인 미확정, 외부1 SKIP 및 B02B 이후 미구현·미검증은 그대로다. 현재 Mac 전용 fallback·legacy 고정 출력·과거 원시 경로 덮어쓰기·raw 사본의 원래 상대경로 의존성은 기존 한계로 인계에서 설명한다. 개인정보 탐색은 현재 tracked bytes를 대상으로 한 검토이며 Git 과거 이력/인증/ignored 원시 자료 삭제·변경을 했다는 의미가 아니다.

## 검토 SHA·리뷰 설정·판정

- PR: #22.
- 전체 base: `b14fccb2ad7e94f183daf6c7d1714f4e9b1acd47`.
- 전체 head: `289e7b4731567f529b84ea3e6c546b0da2b3abd5`.
- 제품 승인 비교점: `23aff96a23710c41702eb0079cd99b7e221144f4`.
- Agent: `/root/pr22_portable_privacy_review`. 메인이 확인해 전달한 생성 요청값은 model=gpt-6.1-sol, reasoning_effort=high, fork_turns=none이다. 이 리뷰어에게 별도 실행 메타데이터가 직접 노출되지는 않았으며 요청값과 런타임 확인값을 같은 것으로 꾸며 쓰지 않는다.
- 시작/최종 실제 HEAD 동일, tracked 작업 트리 clean. 모든 변경은 지정된 ignored 리뷰 폴더에만 있다.
- **PASS — 신규 미해결 P0/P1/P2/P3 없음.** 이 판정은 위 문서/스킬/증거/계정중립 범위와 정확 SHA에 한정한다. 7단계 이후나 중단된 전체 Goal의 재개 승인이 아니다.
