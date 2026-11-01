# PR #14 B01C 정확 head 독립 4차 리뷰

## 발견 사항

**확정된 P0/P1/P2/P3 발견 사항 없음.** 지정 base→head 전체 변경과 연결 코드, B01C 6개 요구/7개 조건을 검토하고 현재 head에서 필수 검증과 별도 경계 probe를 실행했다. 기존 PR본문·구현 보고서·세 차례 리뷰의 수정/PASS 주장을 검증의 출발점으로만 사용했다. 미재현 가설, 전체 PNG 표준 적합성, 후속 slice의 수명/평가 계약을 이번 범위의 확정 버그로 올리지 않았다.

기존 세 리뷰의 잘린 Adam7·과도한 ICC 확장·위조 guest 예외 자동 reset·금지 color/depth·필수/과도 PLTE·손상 stored LEN/NLEN은 현재 실제 제품 회귀에서 기대한 거절/복구/원본 보존으로 통과한다. 최신 pako 경로는 zlib-only framing, DEFLATE 오류, Adler/종결/전체 입력 소비를 검사하며, PNG 행/필터/palette 검사는 원본 이미지 bytes를 유지한다.

## 실행 명령·종료 코드·집계

환경: macOS15.6.1 arm64, Node25.2.1, Python3.14.2, Chrome for Testing145.0.7632.6. 시작 HEAD는 `41ff8e310d57a9366259163052cd17cf38e90f18`이며 `git status --short`는 비어 있었다. AGENTS.md, 프로젝트 SKILL.md, references/pr-review.md·autonomous-implementation.md, 요구사항 README와 common/runtime·internal/console.log·internal/display, architecture/testing·runtime-usage·정본 ledger를 읽었다. 제품/테스트/문서는 읽기 전용으로 유지했고 scratch와 결과만 ignored `.local/`·`output/`에 기록했다.

| 명령/확인 | 종료 코드·결과 | 증거 |
|---|---|---|
| `npm run test:all` | exit0, 85 PASS / 외부1 SKIP / FAIL0 | `.local/goal-development/b01c-round4-review/test-all.log`, `test-all.exit` |
| `HEADED=1 BCL_RUN_DIR=output/goal-b01c-review4/headed npm run test:requirements` | exit0,18 PASS / FAIL0 | `headed.log`, `headed.exit`, `output/goal-b01c-review4/headed/{b01a,b01b,b01c}/results.json` |
| `python3 docs/requirements/tools/validate.py` | exit0, DOCUMENT_STRUCTURE_ONLY_PASS;185REQ·254조건 | 직접 tool 출력 |
| `python3 docs/requirements/tools/validate_development_plan.py` | exit0, PLAN_STRUCTURE_PASS;21 slices·185REQ·254조건 | 직접 tool 출력 |
| `python3 -m unittest discover -s docs/requirements/tools -p 'test_*.py'` | exit0,6 tests OK | 직접 tool 출력 |
| `BCL_RUN_DIR=output/goal-b01c-review4/probe node .local/goal-development/b01c-round4-review/probe.mjs` | exit0, PNG11개·console1개 독립 probe 기록을 직접 대조해 모두 기대 결과 확인 | `probes.json`, `probes.log`, `probes.exit`, `output/goal-b01c-review4/probe/independent-probe/results.json` |
| 증거/소스 해시·Before 차이 확인 | 전달51개 SHA 일치; 최신 After 소스 전부 일치; Before 파일의 baseline SHA 일치 | `evidence-audit.json`, 직접 tool 출력 |
| `git diff --check 0446e5b3ae683bb7801184648078f99de96ea55d 41ff8e310d57a9366259163052cd17cf38e90f18` | exit0 | 직접 tool 출력 |

전체 회귀 집계는 unit27·fixture oracle8·bootstrap1·기존 제품24(+외부1 SKIP)·요구 제품18·경계7이다. PNG native oracle 및 fake-extension 전송 단위는 각각 fixture/transport 등급이며 제품 성공으로 전용하지 않았다. 전체 합계85개가 모두 제품 E2E라는 의미는 아니다. 제품 동작은 HTTP→확장 offscreen→세션 Worker QuickJS→브라우저 경로로 수행됐고 Playwright는 기동·독립 판독에만 쓰였다. fixture의 서버 판정/DOM/실제 파일 bytes를 유지하며 PASS 주입이나 업무 동작 대체를 발견하지 못했다.

과거 간헐 TIMEOUT이 남아 있는 다운로드 취소는 이번 전체 실행에서 295ms로 통과했다. 이 한 번의 통과로 간헐 원인을 해결했다고 해석하지 않는다.

별도 probe는 다음을 확인했다.

- 빈 IDAT와 여러 IDAT로 나뉜 정상 zlib는 원본 이미지로 반환하고, 사이에 ancillary chunk가 낀 비연속 IDAT는 동기 INVALID_IMAGE로 거절했다.
- zlib 뒤 쓰레기 bytes, 이어 붙인 두 zlib 스트림, raw DEFLATE, gzip은 모두 거절했다. 오류 뒤 `after` 로그가 남고 image 블록은 없었다.
- 정상 압축 iTXt는 원본 bytes를 유지하고 잘못된 zTXt compression method 및 손상 iTXt 압축 스트림은 거절했다.
- 31×19 indexed Adam7의 Up/depth2·Average/depth4 입력은 완전한 원본 이미지로 반환했다.
- 객체의 공통 참조를 순환으로 오인하지 않고 배열 자기참조를 `[Circular]`로 표시했다. 이미 출력한40 bytes를 포함해 요청 텍스트 합65536 bytes를 지키고 다음 emoji를 중간 절단하지 않았으며 `text-bytes`를 표시했다.

추가 probe는 자동 성공 assertion 수를 만들기 위한 테스트 변경이 아니라 기록된 제품 결과와 기대값의 독립 대조다. 최초 scratch 실행은 `\1` octal escape 때문에 Node parsing에서 exit1이었다. 제품 실행에 도달하지 않았고 `probes-initial-syntax.log`로 보존했다. scratch만 `\x01`로 수정한 최종 실행은 exit0이다.

### 요구·조건별 확인

| 조건 | 현재 head의 확인 범위 |
|---|---|
| REQ-CONSOLE-LOG-001-C01 | 명시 순서·문자열/JSON/여러 인자·NUL/Unicode 보존, 마지막 표현식/페이지 console 분리, 요청/세션별 출력 독립 |
| REQ-CONSOLE-LOG-002-C01 | UTF8 65535/65536/65537 bytes·emoji·255/256/257블록, 유효 문자열·truncated/원인·후속 요청/세션 무누출 |
| REQ-CONSOLE-LOG-002-C02 | 객체/배열 순환 표지, 공통 참조 구별, 실행 계속과 출력 한도 |
| REQ-DISPLAY-001-C01 | 실제 screenshot과 정상 PNG 원본 SHA·MIME·이미지 블록, before/after 순서, base64 일반 로그 대체 없음 |
| REQ-DISPLAY-002-C01 | MIME/base64/signature/CRC/scanline/압축 등 손상 거절, 정상 초과 전체 생략·원인·후속 log·이전 이미지 재사용 없음 |
| REQ-C-RUNTIME-007-C01 | 파일4MiB±1·합8MiB−1/정확/1byte 초과·4/5장·혼합256블록·텍스트 별도 계산; 결과JSON16MiB/1byte 초과는 fake-extension 전송 단위로 별도 확인 |
| REQ-C-RUNTIME-004-C01 | timeout50/30000/120000 허용·code64KiB/초과 거절·실제 stack/메모리 실패와 복구·guide 단위, host stack 새 generation·guest 예외/메모리 실패의 실제 유지 세대 구분 |

guest 예외 이름/문구를 원인 증명으로 삼지 않는 정책은 일반 오류의 세션 상태를 보존한다. 실제 메모리 한도 guest InternalError는 JS_ERROR/guestName과 runtimeReset:false이고 다음 요청으로 회복한다. 실제 host stack RangeError는 RESOURCE_LIMIT/stack과 runtimeReset:true로 VM을 제거하고 generation을 갱신한다. 정본은 실제 재생성 여부의 구분을 요구하며 메모리 예외마다 무조건 reset하라는 추가 규범을 넣지 않았다.

### 안내·Before/After·증거 검토

- PR 원격 base/head도 요청된 정확 SHA와 일치하며 OPEN이다. guide는 공유 LIMITS와 현재 runtime-usage를 읽고 외부3개·내부64개·한도·명시 출력과 기존 catalog 범위를 구분한다. 개인용 loopback 중계기를 다중 사용자 계정/할당량 서비스로 확장해 판정하지 않았다.
- `docs/evidence/b01c/manifest.json`의 전달51개 SHA256이 모두 일치한다. 원시 경로도51개 모두 존재하고50개 sourceSha256이 일치한다. 남은 고정 경로 `output/runtime-e2e/results.json`은 이번 필수 회귀로 교체되며, manifest가 이를 명시한다. 보존 `round3-runtime-regression.json`과 고유 `round4-runtime-regression.json`의 전달 hash는 일치한다. 이 사후 교체를 증거 변조로 해석하지 않았다.
- 최신 `round4-after-product.json`·`round4-after-headed.json`의 모든 sourceSha256이 현재 head의 제품/fixture/테스트/의존성/안내와 일치한다. 당시 git metadata는64f2de4/dirty=true이지만 파일 hash로 보완된 실제 소스가 특정된다. 이번 독립 headed B01A/B01B/B01C 및 추가 probe는 정확41ff8e3/dirty=false이며 기록 source hash도 모두 일치한다.
- 최종 base Before와 After의 소스 차이는 정확 server/worker 두 파일이다. 두 Before hash가 정확0446e5b의 해당 파일과 일치한다. 직전 리뷰64f2de4 Before와 After의 차이는 output.mjs 한 파일이고 그 hash도 정확 baseline과 일치한다. 최종 테스트/fixture/의존성/안내 고정의 통제 비교이며 전체 과거 환경 재현이라는 주장을 하지 않는다.
- phase1 제품6개/전체79개, phase2 제품7개/전체81개, phase3 제품8개/전체83개, 최신 phase4 제품9개/전체85개를 이력과 현재로 구분한다. 최종 base1/9→After9/9, 직전64f2de4의8/9→9/9, 추가 압축8행의 기존 stored/metadata LEN/NLEN 오판2개를 기록된 로그/결과와 대조했다. base 형식 행렬은1MiB wire timeout으로 중단됐다는 제한도 보존한다.
- PNG66행(정상40·거절26)과 추가 압축8행을 현재 실제 제품에서 통과했다. 정상 stored/fixed/dynamic의 허용, 손상 LEN/NLEN·truncated/header/Adler/metadata의 거절이 유지된다. native decoder의 손상 checksum/ancillary 관대함과 제품 규범 차이를 분리하고 최초 native 기대값 오류를 raw 실패로 보존했다.
- 첫 병렬 native 프로세스 중단·후속 순차 실행, round3 다운로드 취소 TIMEOUT 원시 기록을 숨기지 않았다. 현재 회귀는 기존 판정식을 완화하지 않고 통과했다.
- Codex 자료는 직접 수신 tool 출력의 전사로 표시되어 원본 export와 구분된다. Aside CLI stdout/exit은 NUL 뒤 누락·순환 오류·exit0을 각각 기록한다. bounded console LIVE와 다른 예산/이미지/전송 미측정, DOC/HISTORICAL은 분리된다. 서로 다른 출력 계약의 글자 수를 성능 우위로 해석하지 않는다.
- pako3.0.3·QuickJS의 범용 패키지/버전/라이선스/빌드 경로와 source 기록을 확인했다. 제품 의존성에서 fast-png/fflate는 제거돼 있다. 변경 diff에서 경쟁 제품의 원본 코드·추출 번들·제품 WASM 추가는 발견하지 못했다.

## 미검증·차단

- 필수 명령의 환경 차단 없음. 외부 Naver1건은 기존 기본 조건대로 SKIP이며 외부/회사 사이트 전체 동작은 미검증이다.
- 경쟁 Codex/Aside LIVE를 새로 실행하지 않았다. 저장 전사/캡처·hash·범위만 검토했고 전사로 당시 원본 tool payload를 독립 복구하지 못한다.
- 이번 리뷰에서 통제 Before 사본을 재기동하지 않았다. 원시 결과·최종 고정 소스·정확 baseline hash/차이·집계 확인과 현재 After 재실행을 수행했다.
- PNG 전체 표준 적합성, 임의 DEFLATE fuzzing, 실제 확장 peak 메모리·OOM/crash, 장기/최대 동시 세션 부하는 검증하지 않았다. 안내의 workspace는 코드의 보수적 예산이며 프로세스 peak 실측값이 아니다.
- B01D/B01E/B02~B06·185개 전체 요구 충족은 이번 국소 판정 밖이다. late hostcall/실제 입력 release/페이지 평가 직렬화가 이미 해결됐다고 판단하지 않는다. 문서·계획 검사 PASS는 제품 PASS가 아니다.

## 잔여 위험

PNG 검사는 범용 엄격 zlib inflater와 자체 구조/행 검사 조합이다. 추가 반례11개와 기존 corpus가 모든 malformed 입력/플랫폼 decoder 차이를 포괄하지 않는다. 이번 조사에서 재현되지 않은 추가 parser 가설은 확정 버그로 올리지 않았다.

과거 다운로드 취소 간헐 TIMEOUT의 원인은 미확정이다. 이번 전체 회귀 통과만으로 보편적 해결이나 PNG 변경과의 인과관계를 주장하지 않는다. 장기 실행·동시성·late hostcall 수명은 후속 slice에서 별도 검증이 필요하다.

자기 소유 임시 브라우저/프로필·fixture·bridge는 helper의 finally/close로 종료했다. 종료 뒤 해당 임시 프로필/검증 프로세스가 남지 않은 것도 확인했다. 원격 댓글·리뷰·승인·머지는 수행하지 않았다. 최종 HEAD는 동일하고 `git status --porcelain`는 비어 있다.

## 정확 base/head와 판정

- PR: #14
- base: `0446e5b3ae683bb7801184648078f99de96ea55d`
- head: `41ff8e310d57a9366259163052cd17cf38e90f18`
- 범위: 전체 base→head diff와 연결 코드·B01C6 REQ/7조건·안내·Before/After·현재/과거 phase·증거/비교 등급.
- 판정: **PASS** — 이 범위에서 수정 요청이 필요한 P0/P1/P2와 비차단 P3를 확인하지 못했다. 필수 전체85 PASS/외부1 SKIP 및 headed18 PASS, 독립 추가 probe의 기대 결과와 증거 일치를 확인했다. 원격 승인/머지를 수행했다는 의미는 아니다.
