# 다른 PC·새 대화에서 개발 이어가기

2026-11-02 기준 인계다. 최신 사용자 지시와 [기계 판독 ledger](../planning/implementation-plan.json)가 이후 변경되면 그것을 우선한다. 이 문서는 재개 준비이며 7단계 구현이나 중단된 전체 Goal을 자동 시작하라는 지시가 아니다.

## 현재 완료 지점과 읽는 순서

- 프로젝트: browser-control-lab. 현재 저장소 주소와 소유 조직은 `git remote get-url origin`으로 확인한다.
- 6단계 B02A까지 완료. PR20 정상 squash merge: `b14fccb2ad7e94f183daf6c7d1714f4e9b1acd47`, 이슈19 CLOSED.
- 1~6단계37부모/54조건 PASS. 다음은 7단계 B02B, 이후15개 slice는 not-started다. 전체185REQ/254조건 완료가 아니다.
- 과거 macOS arm64 / Node25.2.1 / Playwright1.64.1 / Chrome145.0.7632.6의 전체132 PASS/외부1 SKIP, 단독 headed45 PASS다. 단위42·native fixture13·transport1·실제 제품76으로 구분한다. 다른 PC의 성공 증거가 아니다.
- 정확23aff96 제품 리뷰 PASS와 정확d513cfa 최종 문서 delta PASS를 보존했다. [제품 리뷰](reviews/pr20-b02a-final.md), [문서 delta 리뷰](reviews/pr20-b02a-docs-delta.md), [manifest](evidence/b02a/manifest.json)를 따른다.

새 Codex는 이 순서로 읽는다.

1. [AGENTS.md](../AGENTS.md) → [프로젝트 스킬](../.agents/skills/browser-control-development/SKILL.md). 전역 개인 스킬 설치 없이 저장소 경로를 직접 읽는다.
2. [현재 상태](status.md) → [구현 색인](../implementation/index.md) → [개발 로그](../implementation/log.md). 과거의 '재리뷰 전' 문구는 당시 이력이다.
3. [현재21단계 계획](../planning/spec-requirements-implementation.md) → [ledger](../planning/implementation-plan.json). [예전8단계 계획](implementation-plan.md)은 초기 프로토타입 이력이며 지금의 단계 번호와 다르다.
4. 해당 slice의 [정본 요구사항](requirements/README.md), 공통 계약, 검증계획/참고 방식 및 이전 slice 보고서.
5. [테스트 방법](testing.md), [실행 안내](runtime-usage.md), 독립 리뷰 시 [리뷰 규칙](../.agents/skills/browser-control-development/references/pr-review.md).

## 경로와 과거 참조의 표기

추적 문서의 작업 경로 `.`는 저장소 루트다. 내부 파일은 루트 기준 상대 경로로 설명하며 Markdown 링크는 문서 위치 기준 상대 경로다. 저장소 밖 Codex 설치 경로는 CODEX_HOME으로 일반화했고, 과거 검증 명령을 재현하려면 현재 PC의 실제 설치 위치를 설정한다.

개인 저장소의 전체 주소 대신 PR/Issue 번호와 검토 commit을 남겼다. ledger의 issue/pullRequest 필드도 `#번호` 형태다. 다른 조직의 새 저장소에서는 이 번호가 현재 원격 PR을 뜻하지 않을 수 있으므로 이전 기록은 과거 개발 이력으로 읽는다. 이후 작업은 현재 origin의 실제 PR/Issue와 연결한다. Git 객체까지 가져오지 않은 경우 과거 commit 기준의 Before 재현 가능성도 새로 확인하고, 불가능한 실측을 재현했다고 표시하지 않는다.

추적된 과거 리뷰/증거의 개인 표기를 일반화했다. 판정·실측·검토 SHA와 원시 sourceSha256은 그대로이며, 보존 사본 sha256/정규화 설명을 갱신했다. 과거 원시 파일과 Git 작성자/commit 이력은 수정하지 않았다. 외부 공식/라이선스 출처 주소는 유지한다.

## 새 PC 설치·인증·초기 검증

Git, Node22 이상과 npm, Python3, 확장을 로드할 수 있는 Chromium/Chrome for Testing을 준비한다. 실측 버전은 위 기록이고 다른 OS/버전의 호환성은 새 실행으로 확인한다. Python 문서 검사기는 표준 라이브러리만 사용한다.

저장소 읽기 권한을 가진 해당 작업 계정으로 clone한다. 아래 REPOSITORY_URL은 사용할 저장소의 실제 clone 주소로 바꾼다. PR 작업에 쓰는 GitHub CLI도 해당 PC의 작업 계정으로 인증한다.

```sh
git clone "<REPOSITORY_URL>" browser-control-lab
cd browser-control-lab
npm ci
npx playwright install chromium
```

문서 PR이 아직 main에 머지되지 않았다면 그 PR의 branch를 checkout해야 이 인계 보완본을 받을 수 있다. 이 인계의 branch는 `docs/21-portable-handoff`다. 나중에는 원격 PR/branch 상태를 먼저 확인한다.

현재 여러 테스트에 이전 Mac의 Chrome 캐시 경로가 fallback으로 남아 있다. 특히 review-boundaries/audit 일부는 설치된 Playwright 브라우저로 자동 fallback하지 않는다. 따라서 **모든 브라우저 테스트 전에 TEST_CHROME을 명시**한다. 설치된 Chromium 실행 경로를 얻는 예:

macOS/Linux 계열 셸:

```sh
export TEST_CHROME="$(node --input-type=module -e 'import {chromium} from "playwright";process.stdout.write(chromium.executablePath())')"
"$TEST_CHROME" --version
```

Windows PowerShell:

```powershell
$env:TEST_CHROME = node --input-type=module -e 'import {chromium} from "playwright";process.stdout.write(chromium.executablePath())'
& $env:TEST_CHROME --version
```

다른 Chrome for Testing을 사용하려면 TEST_CHROME에 그 실행 파일 경로를 넣는다. Linux는 브라우저 OS 라이브러리와 headed용 디스플레이가 필요할 수 있다. Windows/Linux에서 이 프로젝트 전체를 통과했다고 주장하지 않는다. `test:bootstrap`부터 실제 확장 로드 가능 여부를 확인한다. 브라우저 기동/연결 실패를 API 기능 실패나 PASS로 바꾸지 않는다.

새 PC baseline은 아래 순서로 실행하고 명령·종료 코드·환경·실제 수를 새 로그에 기록한다. 동일 프로필/고정 출력 경로 충돌을 피하도록 전체 실행과 headed 실행은 순차 진행한다.

```sh
npm test
npm run test:bootstrap
npm run test:all
```

그 뒤 별도로 POSIX 셸은 `HEADED=1 npm run test:requirements`, PowerShell은 `$env:HEADED = '1'` 설정 후 `npm run test:requirements`를 실행한다. 끝나면 그 환경 변수를 해제한다. 첫 두 명령은 환경 진단용이며 test:all에 중복 포함되므로 합산하지 않는다. 외부 Naver는 기본 SKIP이며 EXTERNAL_SITE=1로 실제 실행한 경우만 별도로 기록한다.

BCL_RUN_DIR을 `output/<새PC-날짜-실행ID>/all`처럼 고유하게 지정하면 요구사항 결과가 그 아래 b01a~b02a에 저장된다. 다만 legacy runtime/review-boundaries/bootstrap과 일부 fixture 출력은 여전히 `output/runtime-e2e`, `output/review-fixes`, `output/extension-bootstrap` 등 고정 위치다. 다음 실행 전에 해당 결과를 실행ID 폴더로 복사하고 manifest에 원시·보존 위치/hash를 남긴다. BCL_RUN_DIR이 모든 출력을 격리한다고 가정하지 않는다.

문서/ledger 확인:

```sh
python3 docs/requirements/tools/validate.py
python3 docs/requirements/tools/validate_development_plan.py
python3 -m unittest discover -s docs/requirements/tools -p 'test_*.py'
```

Python 명령 이름은 해당 PC의 설치에 맞춘다. 위 검사는 문서 구조/검사기 검증이며 브라우저 제품 PASS가 아니다. `--check-frozen-product`는 과거 명세 작성 시의 제품 동결 검사로, 현재 구현 baseline의 정상 재개 검사에 붙이지 않는다.

## 옮기는 파일과 새로 만드는 상태

Git으로 가져오는 것은 제품 소스·package-lock·정본 요구/ledger·fixture/tests·스킬·docs/evidence의 보존 증거·리뷰/개발 기록이다. npm 의존성은 npm ci로 다시 설치한다.

- `.local/extension`, `.local/client.json`, 임시 프로필/중계기 토큰·세션·탭/frame/ref·agent ID·프로세스는 PC 간 실행 상태가 아니다. 새 PC에서 `npm run bridge`를 실행하면 확장과 연결 정보를 새로 생성한다. 제품 테스트는 별도 임시 프로필/중계기/확장을 자동 생성한다.
- `.local/goal-development/goal-checkpoint.json`, 그 안의 B02B 읽기 메모, output 원시는 Git에서 제외된다. 이 문서·ledger·보고서를 정본으로 삼고 존재를 전제로 재개하지 않는다. 필요한 B02B 준비는 아래에 옮겼다.
- 개인 로그인 파일·브라우저 프로필·SSH 개인키·토큰을 repo에 넣지 않는다. GitHub/Aside/Codex 비교 도구는 새 PC에서 본인 계정으로 연결한다. 원격 push는 현재 PC에서 인증된 계정과 `origin`을 사용한다. 개인 SSH 별칭을 저장소의 공통 전제로 고정하지 않는다.
- Codex/Aside 실제 비교 기능이 없으면 저장된 자료를 과거 관측으로 읽고 신규 실행을 차단/미실행으로 남긴다. 다른 도구로 조용히 대체하거나 기존 수치를 새 실측으로 표시하지 않는다.

## 다음 개발: 7단계 B02B 준비

실제 착수는 새 대화에서 사용자 재개 범위를 확인한 뒤 한다. 이 인계 작업에서는 제품·테스트 구현을 시작하지 않았다. B02B는 불변 locator 조합,7부모/9조건이며 선행 B02A는 PASS다.

읽을 정본: [locator.filter](requirements/internal/locator.filter.md), [locator.nth](requirements/internal/locator.nth.md), [공통 selection](requirements/common/selection.md)의 REQ-C-SELECTION-002.9개 조건은 ledger에서 slice=B02B로 찾는다. 요구/조건은 이 문서에서 새로 정의하지 않는다.

읽기 조사 당시의 후보 차이: api-source의 filter/nth가 각각 단일 query 필드를 덮고 page-agent가 filter 뒤 nth로 평가하므로 연속 조합과 호출 순서가 보존되는지 Before로 확인해야 한다. 정적 관측이며 아직 정식 실패 재현/구현/수용 결과가 아니다.

준비할 반례:

- 원본 Locator를 유지하면서 filter A→filter B가 누적되는지, nth→filter와 filter→nth의 결과 차이, 연속 nth와 DOM 추가 뒤 지연 재조회.
- 옵션 객체를 나중에 바꿔도 생성한 Locator가 바뀌지 않는지, 기존 frame/document/ref provenance와 strict/stale 경계.
- 긴 slot/인접 inline/실제 공백, hasText/hasNotText의 문자열·정규식 g/y, visible·ARIA/CSS 숨김, snapshot 출력 예산 독립성.
- nth의0/양수/음수/범위 밖/비정수. 범위 밖 조회0과 거절 조작의 값·이벤트 불변을 함께 확인.
- 지원 필터 hasText/hasNotText/visible의 타입 검증과 미지원 has/hasNot을 조용히 무시하지 않는지.

이후 해당 REQ의 고정 fixture/테스트·판정 → 실제 제품 Before → 공통 엔진 수정 → 같은 조건 After → 기존 회귀/3도구 비교 → 새 컨텍스트 Sol6.1 high 리뷰 → 지적 처리/새 head 리뷰 순으로 진행한다. 자동 머지는 당시 사용자가 승인한 범위에서만 한다. 새 환경 실패를 해결한다는 이유로 업무 판정이나 요구 수준을 낮추지 않는다.

## 8~21단계와 후속 개발

|단계|slice|범위|
|---|---|---|
|8|B02C|조회 결과 계약|
|9|B03A|프레임·소유·좌표|
|10|B03B|스냅샷 탐색·예산·차이|
|11|B03C|화면·전체·부분 캡처|
|12|B04A|요소 상태·사후 판정|
|13|B04B|폼과 키보드|
|14|B04C|포인터·스크롤·드래그|
|15|B04D|복합 업무 통합|
|16|B05A|공통 업로드·drop|
|17|B05B|이벤트 대기·대화상자·선택창|
|18|B05C|다운로드·취소|
|19|B06A|탭·이력·문서 수명|
|20|B06B|대기·deadline|
|21|B06C|로그·최종 통합|


선행 관계·담당 요구·조건·상태는 ledger가 정본이다. 위 표의 단계를 모두 완료하기 전에는 전체185REQ/254조건 통과로 표시하지 않는다.21단계 뒤에는 요구별 집계·현재 지원/제약·사용법/카탈로그·전체 회귀·실환경 미검증을 정리한다. 새 기능·브라우저 어댑터·서비스화·상용 배포 등은 새 요구 ID/판정·우선순위를 먼저 기록하고 별도 사용자 범위로 진행한다.

## 개발 중단·완료마다 남길 기록

- **implementation/log.md**: 날짜/현재 branch·commit/담당 slice·REQ/변경 이유/실제 실행 명령·환경·등급·PASS·FAIL·SKIP/독립 리뷰 agent·model·reasoning·fork·base/head/지적 판단과 대응/다음 한 가지 작업과 중단 범위.
- **docs/implementation/<slice>.md**: 요구·조건별 증거, 고정 Before/After, 비교의 실측/과거/차단 구분, 미해결 위험. **docs/reviews/**에 최종 제품/재리뷰/문서 delta 보고서, **docs/evidence/<slice>/**에 필요한 보존 증거와 원시/보존 hash·정규화·환경/소스 지문을 둔다.
- **planning/implementation-plan.json**: 해당 조건→부모→slice 상태와 증거를 순서대로 갱신한다. **docs/status.md / implementation/index.md**에 최신 완료 지점·현재 범위·다음 후보를 갱신한다. 이번 문서 수정은 과거 실행 상태를 보존하며 B02B를 in-progress로 올리지 않는다.
- 새 PC/새 대화에서 읽어야 할 결론·재현 스크립트·실패/차단은 tracked 파일에 남긴다. output/.local의 임시 기록만 남기지 않는다. 저장한 과거 스크립트의 상대 import가 원래 output 경로 기준이면 그 위치에 복원하거나 정식 회귀 테스트로 재현하고, docs/evidence에서 곧바로 실행 가능하다고 가정하지 않는다.
- 이 인계의 완료 지점·merge/PR·다음 작업이 바뀌면 이 문서도 갱신한다. 진행 중 작업이 있으면 clean/dirty, 미커밋 파일, 살아 있는 프로세스의 취소/재생성 필요 여부를 적는다. 기록 자체로 작업 실행/메시지 전송/배포 권한을 추가하지 않는다.

## 현재 남은 이식성 개선 후보

이번에는 문서/스킬만 보완한다. 다음 항목은 제품/하니스 후속 개발 후보이며 완료로 표시하지 않는다.

1. 여러 테스트에 흩어진 Mac Chrome fallback을 공통 탐색/환경 진단으로 모으기. 현재는 TEST_CHROME 명시로 대응한다.
2. legacy runtime/경계/fixture/bootstrap 결과를 모두 실행ID별 경로로 격리하기. 현재는 매 실행 직후 보존 사본/hash를 만든다.
3. 다른 PC와 OS에서 npm ci→확장 bootstrap→전체 제품/단독 headed를 실제 실행하기. 이 문서의 깨끗한 소스 내보내기 검증은 설치·브라우저 호환성 검증을 대신하지 않는다.
4. 향후 요구/검증이 늘면 실행 입력 지문 목록이 새 fixture/config/helper를 포함하는지 점검하고, 원시/보존 경로·hash 감사의 자동화를 검토하기.
