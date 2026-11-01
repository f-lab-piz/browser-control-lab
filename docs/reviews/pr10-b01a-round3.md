# PR #10 B01A 독립 재리뷰 (round3)

## 발견 사항

### P3 — 테스트 실행 안내의 개수가 최종 테스트와 다르다

- 위치: `docs/testing.md:13`, `docs/testing.md:16`.
- 발생 조건/재현: 지정 HEAD에서 `npm test`와 `npm run test:requirements`를 실행하고 문서의 “현재13개”, “B01A4개 테스트/9개 상세조건”과 대조한다.
- 기대/실제: 현재 등록된 단위 테스트는 프레임 상태 7개를 포함한 20개이고 요구 제품 테스트는 프레임 회귀 1개를 포함한 5개다. 문서는 이전 13개/4개 수를 남겨두었다. B01A의 9개 요구 조건 자체는 4개 제품 테스트에 연결되고 추가 1개는 프레임 회귀이므로 그 구분을 함께 적으면 된다.
- 영향: 실행할 검증 범위와 예상 집계를 읽는 사람이 프레임 회귀 추가를 놓칠 수 있다. 실행 결과·제품 판정·필수 회귀를 바꾸는 결함은 아니며 비차단 문서 수정이다.
- 도입 여부: 이번 PR에서 추가한 테스트 문서가 후속 프레임 회귀 추가를 반영하지 못한 불일치다.
- 증거: 본 디렉터리의 `npm-test.log`, `requirements.log`, `all.log`, `headed.log`.

그 밖에 검토 범위에서 확정된 P0/P1/P2 발견 사항은 없다. 과거 ID 결함과 프레임 실패를 고쳐졌다고 전제하지 않고 아래 실행과 소스 검토로 다시 판단했다. 개인용 로컬 전송 프로그램의 단일 소유자 토큰이 본인의 여러 대화 세션을 관리하는 범위를 적용했으며 다중 사용자 계정 서비스를 요구하지 않았다.

## 검증/재현 명령 및 결과

시작과 종료 모두 checkout HEAD는 지정 head와 일치했고 `git status --porcelain`은 비어 있었다. AGENTS.md, 프로젝트 SKILL.md, 독립 리뷰 규칙과 자율 구현 규칙을 읽었다. 전체 base→head 변경 목록과 제품/테스트/문서 변경, B01A의 6 REQ/9조건, guide/js/runtime 및 page.frames/page.frame/dom-frames 계약, 상태 ledger, Before/After 주장과 증거를 대조했다.

결과는 모두 본 디렉터리 아래에 있다. 고정 output 경로를 쓰는 기존 테스트가 있어 전체 회귀·headed 및 Before는 `exact-source/`, `before-source/`의 소스 복사본에서 실행했다. 복사본은 지정 HEAD의 tracked 파일을 그대로 복사하고 기존 node_modules만 링크했다. Before만 문서와 동일하게 네 제품 파일을 지정 base로 교체했다. 원본 제품·테스트·문서는 수정하지 않았다.

|명령/확인|결과|증거|
|---|---|---|
|`npm test` (원본 checkout)|종료0, 단위20 PASS / 0 FAIL|`npm-test.log`|
|`BCL_RUN_DIR=.local/goal-development/round3-review/requirements npm run test:requirements` (원본 checkout)|종료0, 실제 제품5 PASS / 0 FAIL; B01A 9조건과 반복 프레임 회귀|`requirements.log`, `requirements/results.json`|
|`BCL_RUN_DIR=output/round3-review/requirements npm run test:all` (exact-source)|종료0, 64 PASS / 0 FAIL / 외부1 SKIP. 단위20·fixture7·bootstrap1·제품runtime24·요구제품5·경계7|`all.log`, `exact-source/output/`|
|`HEADED=1 BCL_RUN_DIR=output/round3-review/headed npm run test:requirements` (exact-source)|종료0, 창을 띄운 제품5 PASS / 0 FAIL|`headed.log`, `exact-source/output/round3-review/headed/results.json`|
|`python3 docs/requirements/tools/validate.py`|종료0, DOCUMENT_STRUCTURE_ONLY_PASS; 185 REQ / 254 조건 / 370 슬롯|`validate.log`|
|`python3 docs/requirements/tools/validate_development_plan.py`|종료0, PLAN_STRUCTURE_PASS; 21 slice / 185 REQ / 254 조건|`validate-plan.log`|
|`python3 docs/requirements/tools/test_validate.py`|종료0, 3 tests OK|`test-validate.log`|
|`python3 docs/requirements/tools/test_development_plan.py`|종료0, 3 tests OK. 변경된 음성 전제가 실제 미검증 자식/부모를 다시 준비하는지 코드도 확인|`test-plan.log`|
|`node --test tests/transport-requirements.test.mjs` (before-source)|종료1, 동일 최종 전송6개 0 PASS / 6 FAIL. After의 동일6개는 npm test에서 PASS|`before-unit.log`|
|`BCL_RUN_DIR=output/round3-review/before-product npm run test:requirements` (before-source)|종료1, 동일 최종 제품5개 2 PASS / 3 FAIL. guide·요청충돌·반복프레임 실패를 재현. 이번 프레임 실패는 `Session with given id not found`이며 저자 실행의 세부 오류와 같다고 주장하지 않음|`before-product.log`, `before-source/output/round3-review/before-product/results.json`|
|`BCL_FRAME_DIR=.local/goal-development/round3-review/observer-standard BCL_OBSERVER_MODE=standard node scripts/diagnose-frame-observer.mjs`|진단 종료0. 관찰자 없음6/6 completed, 같은 브라우저에 일반 관찰자를 연결한 뒤 첫 mail이 FRAME_DISCOVERY_TIMEOUT. 이 실패를 제품 PASS로 합산하지 않음|`observer-standard.log`, `observer-standard/results.json`|
|`BCL_FRAME_DIR=.local/goal-development/round3-review/observer-nonpausing BCL_OBSERVER_MODE=nonpausing node scripts/diagnose-frame-observer.mjs`|진단 종료0. 관찰자 없음6/6, 일시정지 없는 관찰자 연결 후6/6 completed|`observer-nonpausing.log`, `observer-nonpausing/results.json`|
|manifest·source hashes 검증|전달 artifact29/29 SHA256 일치. 실제 로컬 원본 경로가 있는27/27 sourceSha256 일치. 경로/행끝 공백 및 마지막 LF 차이를 제외한 전달 본문 일치. console-NUL 두 artifact의 source는 설명 문자열이므로 원본 경로 재검증 대상으로 셀 수 없고 전달 hash만 확인|`evidence-integrity.json`|
|round3 Before/After source hashes|기록된22개 파일의 After hash가 모두 현재 HEAD와 일치. Before/After 차이는 server/client/runtime-worker/browser-engine 네 파일뿐이며 각 Before hash는 지정 base의 해당 파일과 일치|`evidence-integrity.json`|
|`git diff --check <base> <head>`|종료0|직접 실행|

환경: macOS15.6.1 arm64, Node v25.2.1, Python3.14.2, Chrome for Testing145.0.7632.6. headless와 headed 모두 별도 임시 프로필을 사용했다. 테스트 helper/진단 스크립트가 만든 브라우저·서버는 해당 실행의 finally/close에서 종료했고 원본 사용자 프로필을 사용하지 않았다.

실제 제품 조작은 HTTP→확장→세션 QuickJS→브라우저 경로였다. 새 테스트의 Playwright 사용은 탭/포커스/DOM/file input의 독립 판독과 대기뿐이며 제품 클릭·입력을 대신하거나 서버 PASS/사이트 내부 판정 상태를 주입하지 않는다. 동시 재전송은 fixture 서버의 accepted 클릭 이벤트가 정확히1개인지 확인하고 충돌409 뒤 세대/요청 수 불변도 확인한다. 잘못된 인증·타세션 탭/asset 접근은 오류와 파일 입력·기존 소유 자산의 무변경을 함께 확인한다. timeout·code/UTF-8·정확한 guide 항목·ID 원문과 별도 marker 반환도 대조했다.

관찰 helper는 관찰자의 CDP transport에만 Target.setAutoAttach.waitForDebuggerOnStart=false를 적용하고 제품 확장의 CDP 채널은 이 transport를 통과하지 않는다. noDefaults와 테스트용 다운로드 설정을 확인했다. 기존 mail137·예약·가상 메뉴230의 서버 판정과 실제 다운로드 bytes 검증은 전체 회귀에서 유지되어 통과했다. 일반 관찰자 실패/일시정지 없는 관찰자 성공의 독립 실행은 기록된 간섭 분리 주장과 일치한다.

기록된 제품 Before/After의 head 필드는 과거 checkout 565602b/dirty=true다. 이를 현재 clean SHA 실행으로 바꾸어 해석하지 않았다. 대신 소스 fingerprint를 대조했고, 현재 정확 HEAD에서 별도로 After와 동일 조건 Before를 직접 실행했다. 경쟁 Codex/Aside 비교는 문서/미확인/미측정을 구분하고 새 실측·성능 우위를 주장하지 않는 것도 확인했다.

## 미실행/차단

- 외부 Naver1건은 기본 설정상 SKIP다. 외부 사이트·회사 사이트·경쟁 Codex/Aside 신규 브라우저 실측은 수행하지 않았다.
- 이번 독립 재리뷰에서 B03A의 모든 동적 frame 교체/접근 실패 조건을 전수 검증하지 않았다. 변경된 frame-state 단위7개, 기존 제품 복합 회귀, mail↔booking 반복 검색, 관찰자 A/B가 확인 범위다.
- 별도 test:audit 전체 진단은 실행하지 않았다. 이번 B01A 6 REQ/9조건 및 연결 회귀가 판정 범위다.
- 원격 댓글·리뷰·승인·머지를 수행하지 않았다.

## 남은 위험

- 문서의 테스트 수 P3는 정리할 필요가 있다. 기능 수용을 막는 P0/P1/P2는 이번 검토 범위에서 확인되지 않았다.
- 프레임 이벤트 순서·임의 사이트·오랜 실행·프로세스 재시작 복구의 보편적 성공을 이 결과로 확대하지 않는다. 기본 Playwright 관찰자의 실제 간섭은 별도 실패 대조로 계속 보존해야 한다.
- B01B lexical binding, B01C 출력/NUL·이미지/전송 예산, B01D late hostcall·입력 release, B01E 평가 직렬화는 후속 범위다. 특히 console 실제 NUL 출력 잘림은 ledger의 knownSubcases에 남아 있고 이번 ID 왕복 PASS가 그 출력 계약의 PASS는 아니다.
- Before 재현은 전체 base checkout이 아니라 최종 테스트/fixture/관찰 연결을 고정하고 제품4파일만 base로 바꾼 통제 비교다. 동일 조건 비교라는 문서 주장과는 일치하지만 당시 전체 base 환경의 재현과 구분한다.
- 부모 요구6개/상세9조건의 수용 범위이며 전체185REQ 적합성은 판단하지 않았다.

## 검토 SHA와 판정

- PR: https://github.com/f-lab-piz/browser-control-lab/pull/10
- base: `3c87245964a3f15565897320708fc88092975dfd`
- head: `bcaa0bafcabaa4ede22f8594cc330e3c4064f77d`
- 시작/종료: HEAD 동일, tracked working tree clean.
- 판정: **PASS (P3 문서 개수 불일치 1건, 비차단)**. B01A 6 REQ/9조건과 이번 변경의 연결 회귀에서 수정 요청이 필요한 P0/P1/P2를 확인하지 못했다. 이 판정은 원격 PR 승인·머지를 수행했다는 뜻이 아니다.
