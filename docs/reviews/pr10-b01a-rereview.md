# PR #10 B01A 독립 재리뷰

## 발견 사항

### P2 — 길이가 긴 허용 requestId는 실행된 뒤 결과 조회가 HTTP 431로 실패한다

- 위치: `bridge/server.mjs:63-64`(ID 접수), `bridge/client.mjs:3`(query GET 결과 조회). 현재 ID 계약은 `docs/runtime-usage.md:72`, `docs/requirements/common/runtime.md:208`이다.
- 연결 요구: `REQ-C-RUNTIME-005-C01`, `REQ-JS-002-C02` 및 external/js의 “조회 가능한 실행 상태·명시 출력·오류” 계약.
- 발생 조건: `requestId = '한'.repeat(2000)` 또는 `'x'.repeat(20000)`은 비어 있지 않은 올바른 Unicode 문자열이며 현재 접수 검증과 512KiB HTTP 본문 한도 안에 있다. POST는 접수되고 확장 QuickJS가 정상 실행한다. 그러나 client가 조회할 query는 각각 18,023 / 20,023 bytes이며 검토 환경의 Node HTTP 요청 헤더 한도16,384bytes를 넘는다. 서버의 route handler 전에 HTTP 431/빈 본문이 반환되어 `client.js`/`client.wait`가 `SyntaxError: Unexpected end of JSON input`으로 끝난다.
- 기대/실제: 접수·실행한 ID는 클라이언트가 종결 상태와 정확한 결과를 조회할 수 있어야 한다. 실제 제품 반례에서 한글 ID 요청의 버튼 클릭은 fixture 서버가 accepted 1회로 기록했고, 요청 record는 `completed`, 출력 `long-id-clicked`, 실행 위치 `extension-worker/QuickJS-WASM`이었다. 호출자는 결과를 받지 못했다. ASCII 20,000자 ID도 `completed`/`long-id-finished`와 조회431을 재현했다.
- 영향: 유효하다고 허용한 ID에서 실제 브라우저 부작용 뒤 완료 확인이 불가능해진다. 같은 ID 재전송도 조회 한도 문제를 해결하지 못하며, 호출자가 오류를 실행 실패로 오인해 새 ID로 재시도하면 중복 효과 위험이 있다.
- 증거: `output/rereview-b01a/request-id-product.json`, `id-product/results.json`, `request-id-product.log`; 전송 단위 대조군은 `long-id-transport.json`/`.log`다. 실제 제품 재현은 HTTP → 확장 → QuickJS → audit 버튼이며 Playwright는 기동과 독립 판독만 했다. 스크립트는 `.local/goal-development/rereview-b01a/request-id-product.mjs`, `long-id-transport.mjs`다.
- 도입 여부: base에도 긴 ID의 경로 조회 한도 문제가 존재한다. 이번 보완에서 새로 도입한 회귀라고 주장하지 않는다. 다만 이번 PR이 수용하는 요청 식별·접수 계약의 잔여 왕복 경계다. ID의 인코딩 후 조회 크기를 고려한 명시 한도를 접수 전에 무부작용으로 적용하거나, 허용한 ID를 URL 크기에 의존하지 않고 조회할 수 있게 해야 한다. 제한을 택하면 client/server/문서와 경계 반례를 함께 맞춰야 한다.

이전 P2 중 짧은 예약문자·한글 ID의 조회 불가와 `job#part`가 기존 `job` 결과를 읽던 오조회는 해결됐다. 독립 제품 재현에서 먼저 `job`을 완료한 뒤 `job#part`를 실행했으며 각각 정확한 ID와 별도 marker가 돌아왔다. slash, query, percent literal, dot segment, plus/space, NUL ID 및 조합형/분해형 Unicode까지 14개를 대조했다. malformed surrogate 두 종류는 400이며 요청 수·세대가 바뀌지 않았다.

그 밖에 B01A 실제 diff와 연결 6 REQ/9조건 범위에서 확정된 P0/P1/P2 발견 사항은 없다. 중계기는 개인용 로컬 전송 프로그램이며 하나의 소유자 토큰이 본인의 여러 대화를 관리하는 범위로 검토했다. 계정 서비스를 요구하지 않았다.

## 검증/재현 명령 및 결과

시작/종료 시 checkout HEAD는 지정 head와 일치하고 `git status --short`는 비어 있었다. 브라우저 검사는 서로 겹치지 않게 순차 실행했다. 제품·테스트·문서를 수정하지 않았으며 scratch와 결과만 ignored 경로에 썼다.

|명령/확인|결과|증거|
|---|---|---|
|`npm test`|종료0, 13 PASS/0 FAIL|`output/rereview-b01a/npm-test.log`|
|`BCL_RUN_DIR=output/rereview-b01a/requirements npm run test:requirements`|종료0, 제품4 PASS/0 FAIL, 9조건 연결|`requirements.log`, `requirements/results.json`|
|`BCL_RUN_DIR=output/rereview-b01a/runtime npm run test:all`|종료1. unit13·fixture7·bootstrap1 PASS, runtime23 PASS/1 FAIL/외부1 SKIP. 요구/경계 후속 단계는 `&&`에 의해 미실행|`all.log`, `runtime/results.json`|
|`BCL_RUN_DIR=output/rereview-b01a/runtime-rerun npm run test:all`|종료1. 동일하게 unit13·fixture7·bootstrap1 PASS, runtime23 PASS/1 FAIL/외부1 SKIP. 요구/경계 후속 단계는 미실행|`all-rerun.log`, `runtime-rerun/results.json`|
|`BCL_RUN_DIR=output/rereview-b01a/id-product node .local/goal-development/rereview-b01a/request-id-product.mjs`|종료0. 짧은14개 ID 정확 왕복, surrogate 거절 확인; 긴2개 ID의 실제 실행 완료/조회431 반례를 assertion으로 확인한 재현 성공. 긴 ID 제품 계약의 PASS를 의미하지 않음|`request-id-product.json`, `id-product/results.json`|
|`node .local/goal-development/rereview-b01a/long-id-transport.mjs`|종료0. 가짜 extension poll을 쓴 전송 단위로 긴2개 ID 접수·완료/조회431 재현. 제품 PASS 집계 아님|`long-id-transport.json`, `long-id-transport.log`|
|`BCL_RUN_DIR=output/rereview-b01a/boundaries npm run test:review-boundaries`|종료0, 제품 경계7 PASS/0 FAIL|`boundaries.log`, `boundaries/boundaries.json`, `boundaries/scrolled-clip.png`|
|`python3 docs/requirements/tools/validate.py`|종료0, DOCUMENT_STRUCTURE_ONLY_PASS; 185REQ/254조건/370슬롯|`validate.log`|
|`python3 docs/requirements/tools/validate_development_plan.py`|종료0, PLAN_STRUCTURE_PASS; 21slice/185REQ/254조건|`validate-plan.log`|
|`python3 docs/requirements/tools/test_validate.py`|종료0, 3 tests OK|`test-validate.log`|
|`python3 docs/requirements/tools/test_development_plan.py`|종료0, 3 tests OK|`test-plan.log`|
|증거 manifest·source hash|전달 artifact17개 SHA256 모두 일치. Before 제품의 bridge/server·client hash는 지정 base, ID Before는 이전 head와 일치. After의 모든 기록 source hash는 현재 파일과 일치. 각 Before→After 차이는 server/client2개뿐|`evidence-audit.json`|
|`git diff --check <base> <head>`|종료0|지정 SHA diff 직접 확인|
|`git ls-remote origin refs/pull/10/head refs/heads/main`|원격 PR head는 지정 head, main은 지정 base와 일치|재리뷰 중 직접 조회|

두 번의 전체 회귀 실패는 모두 `tests/runtime-e2e.test.mjs:77` 예약의 `calendar missing`이며 HTTP 요청 record도 `failed`/`JS_ERROR`였다. fixture oracle의 예약은 두 번 모두 PASS였다. 알려진 `B03A.knownSubcases`의 cross-site frame 발견 문제와 관찰이 일치하지만, 원인·도입 시점은 이번 리뷰로 확정하지 않았다. 확장/browser-engine 제품 소스는 base→head에서 변하지 않았다. 이 실패를 B01A 신규 회귀로 단정하거나 전체 회귀 PASS로 표현하지 않는다.

`runtime-e2e.test.mjs`와 `review-boundaries.test.mjs`는 BCL_RUN_DIR 대신 고정 output 경로에 일부 결과를 쓰므로 실행 직후 해당 run의 결과를 본 재리뷰 경로로 복사해 보존했다. BCL_RUN_DIR로 저장된 requirements 결과와 혼동하지 않는다.

환경: macOS, Node v25.2.1, Python3.14.2, Chrome for Testing145.0.7632.6, headless, 별도 임시 프로필. 실제 사용자 프로필/인증 파일은 쓰지 않았다.

## 미실행/차단

- HEADED=1은 독립 재리뷰에서 재실행하지 않았다. 저자의 headed4/4 원시 결과와 현재 source hash 일치까지만 확인했다. 그 JSON의 head는 이전 checkout/dirty=true지만 manifest의 source fingerprint가 현재 파일과 맞으므로 현재 clean SHA 실행이라고 바꾸지 않았다.
- 외부 Naver1건은 기본 설정상 SKIP다. 회사 사이트·경쟁 Codex/Aside 신규 실측은 하지 않았다. 비교표는 DOC/미확인/미측정을 구분하며 성능 우위를 주장하지 않는다.
- base/이전 head의 Before 테스트는 별도 checkout에서 재실행하지 않았다. 보존된 Before 원시 로그·manifest·소스 hash를 대조했다.
- 전체 회귀는 두 번 모두 런타임 실패로 종료해 그 명령 안의 requirements/boundaries가 실행되지 않았다. requirements는 독립 실행4/4를 확인했다. 경계 검사는 별도 실행7/7을 확인했다.
- 원격 리뷰 게시·승인·머지는 하지 않았다.

## 남은 위험

- 긴 ID 왕복 P2가 남아 있어 B01A 요청 식별 계약을 수용하기 어렵다. 현재 UUID와 짧은 ID의 일반 경로 및 이번 원지적 사례는 통과한다.
- 예약 프레임 발견은 이번 두 순차 회귀에서도 실패했다. B03A의 unverified 알려진 항목으로 남기며 현재 성공으로 집계하지 않는다.
- console NUL 잘림은 `B01C.knownSubcases`에 unverified로 연결되어 있고 원시 실패가 보존됐다. JSON marker를 쓰는 ID 왕복 검사는 NUL 출력 처리 자체의 PASS가 아니다. 이번 재리뷰에서 직접 console NUL 출력은 재실행하지 않았다.
- lexical(B01B), 출력·이미지/전송 예산(B01C), late hostcall·실제 입력 release(B01D), 평가 직렬화(B01E) 등은 이번6부모/9조건 수용 범위 밖이다. 전체185REQ 적합성·프로세스 재시작 복구를 승인하지 않는다.

## 검토 SHA와 판정

- PR: https://github.com/f-lab-piz/browser-control-lab/pull/10
- base: `3c87245964a3f15565897320708fc88092975dfd`
- 이전 검토 head: `47e59e0aa608b9c2846365d21b872c1743a802e5`
- 재리뷰 head: `565602b02a3fd478073fe80947ce6ef24ae823b0`
- 범위: 실제 base→head 및 이전 head→새 head diff, 연결 REQ-C-RUNTIME-001/005/006, REQ-GUIDE-001/002, REQ-JS-002의9상세조건, 재현·회귀·증거 정확성.
- 판정: **CHANGES_REQUESTED**. 짧은 ID 원지적은 해결됐으나 접수 가능한 긴 ID가 실행 뒤 조회 불가능한 P2가 남아 있다. 전체 회귀 역시 이번 실행에서는 PASS가 아니며 B03A 실패를 별도로 유지해야 한다.


## 메인 판단

긴 ID의 조회431 P2를 수용했다. 접수 가능한 ID를 잘라 제한하지 않고 POST 본문 조회로 옮겼다. 이 경로는 UTF-16 surrogate도 JSON으로 왕복하므로 앞선 URI 제약에 따른 거절 정책을 제거했다. ID와 C filename을 분리해 짧은 실행 순번으로 진단한다. 최초/두번째 전체 회귀의 calendar missing 실패도 보존하며 독립 판독으로 원인을 조사한다. 아직 머지하지 않았다.
