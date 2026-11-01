# PR #14 B01C 독립 재리뷰

## 발견 사항

### P2 — PNG color type/bit depth 및 필수 팔레트 검증 누락으로 표시 불가능한 이미지를 성공 반환한다

- 위치: `extension/output.mjs:51–52` (허용 bit depth를 color type과 무관하게 검사), 연결 경로 `:45`, `:73`.
- 조건: CRC·zlib checksum·선언 scanline 길이는 유효하지만 (a) truecolor2/depth1, (b) RGBA6/depth4, (c) greyscale-alpha4/depth1, (d) indexed3/depth8에 필수 PLTE가 없는 1×1 PNG를 `display`에 전달한다. 파일은67/68 bytes다.
- 기대: 잘못된 PNG를 동기 `INVALID_IMAGE`로 거절하고 이미지 블록을 추가하지 않으며 catch 뒤 로그는 보존해야 한다. REQ-DISPLAY-002-C01의 corrupt 입력과 REQ-DISPLAY-001-C01의 실제 이미지 전달에 해당한다. [PNG 표준 IHDR 표12 및 PLTE](https://www.w3.org/TR/png-3/#11IHDR)는 color type별 허용 깊이와 indexed의 필수 PLTE를 정한다.
- 실제: 네 입력 모두 HTTP→확장→QuickJS 경로에서 `completed`, 원본 image 블록, `accepted`, `after`를 반환한다. 출력 버퍼의 `imageBytes` 직접 호출도 모두 수용한다. 동일 bytes의 독립 Chromium `createImageBitmap`은 네 입력을 모두 `InvalidStateError: The source image could not be decoded.`로 거절한다. RGBA8 정상 대조는 제품/독립 decoder 모두 성공한다.
- 영향: 모델에 디코딩할 수 없는 이미지를 정상 블록으로 전달하므로 PNG 유효성 검증 및6부모/7조건 PASS 주장의 corrupt 입력 경계가 성립하지 않는다. base도 손상 PNG를 검증하지 않았으므로 기존 결함을 이번 신규 validator/조건 PASS가 아직 해소하지 못한 경우다.
- 증거: `probe-structure.mjs`, `probe-structure.log`, `probe-structure.json`, `custom/structure-probes/results.json`. 최소 truecolor2/depth1 base64: `iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQIAAACdZzGvAAAACklEQVR4nGNgAAAAAgABSK+kcQAAAABJRU5ErkJggg==`.

### P2 — PLTE 길이를 검증하지 않아 palette decoder가64MiB 작업 공간을 우회한다

- 위치: `extension/output.mjs:45` (PLTE를 무제한 보존하여 `:73`의 decoder에 전달), `:57`의 예산은 scanline/압축 metadata만 계산한다.
- 조건: 1×1 indexed PNG에 PLTE1,048,576개(3,145,728 bytes)를 넣는다. 전체 PNG3,145,807 bytes로 한 이미지4MiB 이내다. IHDR와 IDAT는 작고 CRC/압축 checksum은 유효하다.
- 기대: [PNG PLTE 표준](https://www.w3.org/TR/png-3/#11PLTE)의1..256 entries/bit-depth별 상한을 검사해 decoder 전에 입력 오류로 거절해야 한다. 공개 안내 `docs/runtime-usage.md:80`의 PNG64MiB 작업 공간도 넘기면 명시 제한 오류가 필요하다.
- 실제: 실제 제품은 원본3,145,807bytes image와 `accepted`/`after`, `truncated:false`를 반환한다. fast-png8.0.0 `png_decoder.js:240–251`의 `decodePLTE`는 `length/3`마다 JS 배열을 생성하며 상한이 없다. 같은 파일을 exact-source의 동일 decoder로 실행하고 반환 palette를 보존한 Node/V8 측정에서1,048,576 entries·heap 증가100,774,904bytes(약96MiB)를 확인했다. 정확 `imageBytes` 함수도 거절하지 않는다. 압축 ICC를 제거해도 이 비압축 critical chunk 경로는 남는다.
- 영향: 작은 raster/정상 파일 크기만으로 decoder가 공개64MiB 범위를 넘는 호스트 할당을 수행한다. 반복/동시 이미지에서 확장 메모리 압박을 유발할 수 있다. 이 decoder 할당 경로는 PR에서 새로 도입됐다. OOM/crash를 유발하지 않았고, Node 측정치를 Chrome 확장의 정확 peak 수치로 주장하지 않는다. 실제 제품의 수용과 연결 decoder의 무제한 배열 생성, 동일 함수의 직접 할당을 구분해 확인했다.
- 증거: `probe-palette.mjs`, `probe-palette.json/log`, `probe-palette-product.mjs`, `probe-palette-product.json/log`, `custom/palette-probe/results.json`. Chromium native decoder는 이 PLTE를 관대하게 수용했으므로 이 항목의 근거는 native 표시 실패가 아니라 구조/작업 공간 한도 위반이다.

P0/P1 발견 사항은 없다. 위2건은 실제 제품 경로와 연결 코드로 확인한 P2이며 가설을 확정 버그로 올리지 않았다. 첫 리뷰의 잘린 Adam7/압축 ICC80MiB/사용자 RangeError 자동 reset 세 반례는 현재 추가 회귀에서 거절·복구/상태 보존으로 통과한다. 그 해결이 새 구조/PLTE 반례를 상쇄하지는 않는다.

## 검증/재현 명령 및 결과

시작 HEAD는 요청한 `5747487ac72c613e650fc1977b28159b48ec7824`였고 원본 `git status --short`는 비어 있었다. AGENTS.md, 프로젝트 SKILL.md, pr-review.md/autonomous-implementation.md, 요구사항 README·common/runtime·internal/console.log·internal/display, B01C6 REQ/7조건, 전체 base→head diff 및 worker/offscreen/bridge/decoder 연결 코드, 첫 리뷰·구현 보고·manifest를 확인했다. 작성자의 해결/PASS 주장을 전제하지 않았다.

원본 제품·테스트·문서는 수정하지 않았다. 고정 경로 회귀는 이 ignored 폴더의 `exact-source/` shared clone에서 수행했고 node_modules 링크만 `.git/info/exclude`로 제외했다. exact-source HEAD/clean은 테스트 전후 동일하다. 제품 조작은 HTTP→확장→세션별 QuickJS이며 Playwright는 기동·독립 판독에만 썼다.

환경: macOS15.6.1 arm64, Node25.2.1, Python3.14.2, Chrome for Testing145.0.7632.6, 전용 임시 프로필.

|명령/확인|결과|증거|
|---|---|---|
|`npm test`|exit0,25 PASS/0 FAIL|`npm-test.log`|
|`BCL_RUN_DIR=../requirements npm run test:requirements`|exit0,16 PASS/0 FAIL|`requirements.log`, `requirements/`|
|`BCL_RUN_DIR=../all-requirements npm run test:all`|exit0,81 PASS/외부1 SKIP/0 FAIL|`all.log`, `all-requirements/`, `exact-source/output/`|
|`HEADED=1 BCL_RUN_DIR=../headed npm run test:requirements`|exit0,16 PASS/0 FAIL|`headed.log`, `headed/`|
|`python3 docs/requirements/tools/validate.py`|exit0, DOCUMENT_STRUCTURE_ONLY_PASS|`validate.log`|
|`python3 docs/requirements/tools/validate_development_plan.py`|exit0, PLAN_STRUCTURE_PASS|`validate-plan.log`|
|`python3 -m unittest discover -s docs/requirements/tools -p 'test_*.py'`|exit0,6 tests OK|`validators-regression.log`|
|`BCL_RUN_DIR=../custom node ../probe-structure.mjs`|exit0, 위4손상 입력 제품 수용/native 거절, 정상 대조 통과|`probe-structure.json/log`|
|`node --expose-gc ../probe-palette.mjs`|exit0, 동일 decoder palette100,774,904bytes heap 증가·imageBytes 수용|`probe-palette.json/log`|
|`BCL_RUN_DIR=../custom node ../probe-palette-product.mjs`|exit0, 제품 원본 bytes 수용 확인|`probe-palette-product.json/log`|
|`git diff --check <base>..<head>`|exit0|직접 실행|

전체 회귀 집계는 unit25·fixture oracle8·bootstrap1·기존 제품24(+외부1 SKIP)·요구 제품16·경계7이다. fake extension16MiB 전송 단위와 native fixture decoder는 제품 PASS로 전용하지 않았다. output-runtime의7개 제품 테스트는 NUL/순환/UTF8/블록/이미지4MiB·합8MiB·수/전송, 실제 host stack reset·guest 메모리 실패 복구와 위조 오류의 세대/binding 보존을 포함한다.

Before는 별도 `before-source/`에서 최종 테스트/fixture/의존성/helper/문서/새 output·limits를 고정하고 server/worker 두 파일만 정확 base로 되돌려 재실행했다. `BCL_RUN_DIR=../before-product node --test tests/output-runtime.test.mjs`는1 PASS/6 FAIL, `node --test tests/output-transport.test.mjs`는0 PASS/2 FAIL(둘 다 예상 exit1)이다. 현재 대응7개/2개는 통과한다. 이 통제 비교를 전체 과거 환경 재현으로 표현하지 않는다.

증거 독립 확인:

- 실제 위치는 `docs/evidence/b01c/manifest.json`이다(요청의 `evidence/b01c/manifest.json`는 존재하지 않음). 전달25개 SHA256과 원시25개 sourceSha256이 모두 일치한다(`manifest-audit.json`).
- 최종 round2 제품 증거의 기록 소스28개가 정확 현재 head와 모두 일치한다. 당시 metadata는99aa574/dirty=true지만 파일 hash가 보완된 실제 소스를 특정하며 문서도 정확 새 head 독립 리뷰가 남았다고 분리한다.
- round2 Before base/After 차이는 server·worker2개, 첫 리뷰99aa574/After 차이는 worker·output2개이며 각 Before 파일 hash가 정확 해당 SHA와 일치한다. bounded console Before/After도 server·worker만 다르다(`comparison-audit.json`).
- Codex LIVE 자료는 수신 tool 출력의 전사, Aside는 CLI stdout/exit 캡처로 명시되어 있다. bounded console·NUL·순환 이외의 예산/이미지/전송은 신규 미측정이고 DOC/HISTORICAL과 구분한다. 서로 다른 출력 계약의 글자 수로 성능 우위를 주장하지 않는다. 신규 경쟁 실측은 이번 재리뷰에서 수행하지 않았다.
- 새 범용 fast-png/fflate 및 기존 QuickJS의 출처/버전을 기록하고 있다. diff에서 경쟁 원본 코드·번들·WASM 추가는 발견하지 않았다. 로컬 개인 전송/자기 대화 세션 격리를 다중 사용자 계정 보안으로 확장해 판정하지 않았다.

## 미실행/차단

- 외부 사이트1건은 기존 기본 조건대로 SKIP. 외부/회사 사이트의 전체 적합성은 미검증이다.
- 경쟁 Codex/Aside LIVE 호출을 새로 실행하지 않았다. 전사만으로 당시 원본 tool payload를 독립 복원할 수 없다.
- PNG OOM/crash는 유발하지 않았다. Node heap delta는 동일 decoder의 직접 측정이며 Chrome 확장의 정확 peak 메모리는 계측하지 않았다.
- B01D/B01E/B02~B06, 전체185요구 적합성은 범위 밖이다. 문서/계획 검사 PASS는 제품 전체 PASS가 아니다.
- 필수 명령의 환경 차단은 없었다. 원격 댓글·리뷰·승인·머지는 수행하지 않았다.

## 잔여 위험

PNG 전체 구조의 형식별 제약과 decoder가 실제 처리하는 보존 chunk를 추가로 다뤄야 한다. 특히 PLTE·tRNS의 수/길이/순서/형식별 허용 여부를 scanline·압축 metadata 제한과 함께 검증할 필요가 있다. 이 목록의 미재현 세부항목은 추가 조사 범위이며 확정 버그로 합산하지 않았다.

실제 메모리 한도에서 VM이 살아남는 guest InternalError를 JS_ERROR/guestName/runtimeReset:false로 보고하는 현재 정책은 정본의 '실제 VM 재생성 여부' 구분과 모순으로 보지 않았다. 이름/문구를 신뢰해 VM을 파괴하던 앞선 문제의 해결을 확인했다. B01D의 전체 late hostcall/입력 cleanup을 이 결과로 대신하지 않는다.

자체 helper/추가 HTTP server/브라우저/프로필은 finally로 종료했다. 종료 후 자체 `bcl-requirements-*`/재리뷰 명령 프로세스는 남지 않았다. 다른 작업의 기존 test-site 프로세스는 건드리지 않았다. 최종 원본·exact-source HEAD/clean을 다시 확인했다.

## 정확 SHA와 판정

- PR: https://github.com/f-lab-piz/browser-control-lab/pull/14
- base: `0446e5b3ae683bb7801184648078f99de96ea55d`
- head: `5747487ac72c613e650fc1977b28159b48ec7824`
- 범위: 전체 base→head diff·연결 코드·B01C6 REQ/7조건·증거 계약.
- 판정: **CHANGES_REQUESTED** — P2 두 건. 첫3건 보완과 필수 회귀 통과는 확인했지만 새 PNG 구조/PLTE 자원 한도 위반을 해결한 새 head 재검증이 필요하다.
