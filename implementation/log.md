# 구현 로그

## 2026-11-01 · B01A 요청 식별·접수 검증

### Plan Input

문서 #6(d5bd4ff)·계획 #8(3c87245) 머지 기준. B01A 담당6 REQ/9조건, issue#9. 사용자 확인:중계기는 개인용 로컬 프로그램이며 다중 사용자 계정 서비스를 만들지 않는다.

### Implemented

실효 operation/code/timeout digest와 동일 ID 충돌409, 정상 재전송·reset 이후 기록/오프라인 재조회, 엄격 접수 입력, chunk UTF-8 보존, 버전·지원 범위·unknown API 안내. 확장 실행 경로는 유지했다. 계획 리뷰 P3 후속 partial_pass 회귀의 부모 근거를 추가해 실제 자식 집계 거절을 직접 검증한다.

### Test Coverage

전송 단위5개 Before0/5→After5/5, 동일 제품4개 Before2/4→After4/4. 소스 비교는 bridge/server.mjs만 다르다. 조건별 proof는 docs/evidence/b01a와 보고서에 연결했다.

### Test Command and Result

npm test12 PASS, npm run test:all55 PASS/외부1 SKIP, HEADED=1 npm run test:requirements4 PASS. 문서 구조·계획 구조 및 검사기 회귀 각3개 메서드 PASS. 실제 요구를 pass로 올리자 false_slice_pass 테스트가 미검증 전제를 잃는 문제를 발견해, 해당 음성 테스트가 미검증 부모를 명시 준비하도록 보완했다. 완료 음성 테스트도 미완료 slice를 명시 준비한다.

### Decisions

요청 동일성은 operation/code/effective timeout이다. 기본 timeout 생략과30000은 같고 관리 client는 본인의 모든 세션을 제어한다. Codex/Aside의 해당 전송 계약은 미확인으로 유지해 새 수치·경쟁 동등성을 주장하지 않는다.

### Next Actions

PR 작성→정확 head의 Sol6.1 high 독립 리뷰→수정/재리뷰→gate 충족 후 머지. 이후 B01B.


## 2026-11-01 · B01A 독립 리뷰의 요청 ID 왕복 보완

### Plan Input

PR#10 첫 head47e59e0의 P2:한글/예약문자 ID 조회 실패 및 job#part→job 잘못된 결과.

### Implemented

client query encoding·server query/path decoding, malformed surrogate 사전 거절. 원문 ID14개 단위/12개 제품 왕복과 prefix 오조회 반례를 추가했다. 원래 코드47e59e0에서는 같은 최종 제품 테스트3 PASS/1 FAIL→After4 PASS. 전체 baseline3c87245에 대해서는 전송0/6→6/6, 제품2/4→4/4다.

### Test Coverage

최종 helper는 client도 source hash에 포함하며 baseline/After는 server/client 두 파일만 차이가 난다. raw 기록과 manifest를 갱신했다. 발견한 console NUL 잘림은 B01C, 최초 프레임 회귀 실패는 B03A에 미확인 하위 사례로 남겼다.

### Test Command and Result

HEADED=1 npm run test:requirements4 PASS. npm run test:all56 PASS/외부1 SKIP/FAIL0(단위13 포함). 최초 독립 프레임3 FAIL과 순차 재실행55 PASS/1 SKIP는 당시 기록으로 보존했다.

### Decisions

요청 ID는 query로 데이터로 왕복하며 예약문자를 제한하지 않는다. NUL ID는 정확히 반환하지만 console NUL 출력은 아직 미검증/실패로 추적한다.

### Next Actions

새 head 독립 재리뷰 후 gate 충족 시 머지한다.


## 2026-11-01 · 긴 ID 본문 조회와 회귀 조사

### Plan Input

head565602b 재리뷰의 긴 ID431 P2 및 두 차례 calendar missing.

### Implemented

요청 조회 기본을 POST JSON 본문으로 옮겼다. ID 길이를 URI 한도로 축소하지 않고 짧은/긴/예약문자/Unicode/UTF-16 surrogate 문자열을 보존한다. VM 진단 filename은 원문 ID 대신 세션 내 순번을 쓴다.

### Test Coverage

전송18개·실제제품16개 ID 왕복을 기존6개 unit/4개 제품 테스트에 포함했다. NUL 출력과 식별은 별도로 검증한다. 프레임 실패는 원래 성공 조건/대기시간을 유지한 별도 재현에서 독립 DOM/실제 프레임·CDP 이벤트를 읽어 조사한다.

### Test Command and Result

npm test13 PASS, npm run test:requirements4 PASS. 변경 후 전체 회귀와 독립 재리뷰는 아직 필요하다.

### Decisions

선택한 해결책은 본문 데이터 왕복이며 접수 허용 범위를 URL 한도로 줄이지 않는다. 프레임 첫 진단3회는1회 calendar missing/2회 통과였다. 실패 시 browser에는 portal까지만 연결돼 있고 calendar iframe src는 정상인데 제품 map의 child url은 ':'였다. 원인은 CDP 이벤트를 추가 관찰 중이며 추측을 확정 버그로 처리하지 않는다.

### Next Actions

프레임 차단 원인 확인·필요 수정과 회귀, B01A 증거 갱신·재리뷰 후 gate 충족 시 머지.


## 2026-11-02 · 중첩 프레임 회귀 원인 분리

### 확인한 사실

실제 CDP 조회에서 app/portal의 Page.getFrameTree가 OOPIF 자식을 생략하고 각 자식 세션의 트리가 parentId를 제공하는 경우를 확인했다. 부모 트리의 childFrames만으로 도달 가능성을 판단하면 로드된 mail 프레임까지 제거했다. 새 frame-state 모듈은 자식 대상 자신의 루트 문서와 부모의 stub을 구분하고, 실제 자식 세션이 제공한 부모 연결을 보존한다. 분리 시 하위 프레임을 제거하고 루트 문서 교체와 늦게 도착한 조회를 구분한다.

### 검증 및 미해결

단위20 PASS. 고정된 동일 10초/실제 selector 조건의 반복 제품 검증은 일부 통과했지만 다른 실행에서 여전히 실패했다. 원시 Chrome에 관찰자를 연결하지 않은 6회 mail/booking 이동은 모두 통과했고, 동일 브라우저에 Playwright 관찰자를 연결한 직후에는 자식 문서가 about:blank에 남았다. 이 결과는 output/raw-frame-ab/owned-roots-fixed/results.json에 보존했다. 초기 제품의 stale frame 결함과 관찰자 간섭을 혼동하지 않으며, 이 한 번의 대조만으로 전체 회귀 PASS를 선언하지 않는다.

### 다음 작업

관찰자가 문서를 일시정지시키지 않는 검증 연결을 별도로 대조한다. 제품의 성공 조건·대기시간·원격 입력 경로는 유지하고, 변경된 검증 연결과 기존 연결의 차이도 기록한다. 이후 전체 회귀·증거 갱신·정확 head 독립 재리뷰를 진행한다.


## 2026-11-02 · B01A round3 최종 검증

개인용 전송 범위를 유지한다. 요청 결과는 POST JSON으로 조회하고 긴/예약문자/Unicode/UTF-16 문자열을 원문으로 보존한다. 프레임 수명·OOPIF 연결을 보완했으며 관찰자의 시작 일시정지를 끄는 독립 연결을 사용한다. 테스트용 다운로드 설정 세션을 유지해 허용된 임시 경로의 실제 bytes를 검증한다.

같은 최종 테스트·fixture·관찰 연결의 Before는 base3c87245 제품 네 파일만 다르다. 전송0/6→6/6, 실제 제품2/5→5/5다. 전체 test:all은64 PASS/외부1 SKIP/FAIL0이고 창을 띄운 요구사항 제품 테스트도5 PASS다. 문서/계획 구조·각 검사기 음성 회귀3개도 통과했다. 실패한 관찰자·다운로드 설정 대조를 삭제하지 않고 manifest에 포함했다. 기존9조건의 evidence는 새 실행으로 연결하되 B03A 전체 요구를 pass로 올리지 않는다.

정확 head로 Sol6.1 high 독립 재리뷰를 요청하며 PR10은 아직 미머지다. 본 검증만으로 리뷰 gate를 대신하지 않는다.


## 2026-11-02 · B01A 머지와 B01B 선언 실행 구현

### Plan Input

PR10 정확 head bcaa0ba의 Sol6.1 high 독립 PASS. 전체64 PASS/외부1 SKIP, headed5 PASS와 동일 Before/A-B를 직접 재현했다. P0/P1/P2 없음, P3 문서 개수1건을 이슈11로 연결했다. 승인된 gate를 확인해 PR10을367a5d2로 squash merge했고 이슈9는 닫혔다. 이슈11·feat/11-runtime-bindings에서 B01B를 진행한다.

### Implemented

범용 QuickJS의 global async/strict 평가로 선언 종류·지속 lexical 환경을 보존한다. AST는 import/export를 검증하고 선언을 바꾸지 않는다. generator astring 의존성을 제거하고 package/확장0.2.0·사용 예제를 이행했다. B01B3 REQ/4조건에 실제 확장 테스트4개를 연결했다.

### Test Coverage

두 세션의 같은 변수/출력/서로 다른 자기 탭, 실제 host await·구조분해·closure/class, var 무초기값 재선언, 표현식과 명시 텍스트/실제 이미지, lexical 충돌5개와 선행 실제 클릭·변수 증가0·세대/기존 값/타세션 보존을 판정한다. 대상 탭을 준비에서 activate하고 import/export/구문 오류도 기존 상태 유지로 확인한다. 최종 Before는 같은 테스트/fixture/helper/version에서 worker/transform만367a5d2로 두었다. 이전 generator는 scratch에만 공급했다.

### Test Command and Result

동일 제품 Before2 PASS/2 FAIL→After4 PASS. 전체68 PASS/외부1 SKIP/FAIL0, headed 요구 제품9 PASS. 문서/계획 구조·각 검사기3개 회귀도 통과했다. 초기 비일시정지 Playwright의 프레임 목록 누락 실패를 보존하고 독립 CDP의 실제 target id/주소/DOM 읽기로 oracle을 보완했다. 제품 입력·selector·10초 제한을 완화하지 않았다. 두 요구 테스트의 결과 디렉터리를 이름별로 구분했다.

### Decisions and Next Actions

Codex/Aside의 공개 지속/명시 출력 계약과 미확인 세부 의미를 구분한다. 신규 경쟁 실측0이며 네이티브 VM 선택은 우리 구현 결정이다. B01B 전체 slice는 리뷰 전 in-progress이며3부모/4조건만 제품 pass다. PR 작성→정확 head Sol6.1 high 독립 리뷰→필요 수정/재리뷰→gate 충족 머지 후 B01C로 진행한다. NUL/예산·late hostcall·평가 직렬화는 이번 PASS에 포함하지 않는다.


## 2026-11-02 · B01B 독립 PASS·머지 및 B01C 준비

Sol6.1 high 새 컨텍스트의 PR12 리뷰는 정확697e92d에 PASS, P0/P1/P2 없음이었다. 단위20·요구 제품9(headless/headed)·전체68 PASS/외부1 SKIP, 같은 Before2/4→After4/4, 별도 선언 경계와 증거/소스 해시를 직접 확인했다. 비차단 P3 최신 현황 불일치1건을 이슈13에 연결하고, gate 확인 후 PR12를0446e5b로 머지했다. 이슈11은 닫혔다. 리뷰 보고서를 docs/reviews/pr12-b01b.md에 보존하고 현황의 하드코딩된 미착수 범위를 정본 ledger 연결로 수정했다.

B01C는 이슈13·feat/13-output-budgets에서 준비 중이다. 아직 제품 코드 변경은 없다. 실제 확장 probe에서 NUL 잘림, [Circular] 누락, 절단 원인 누락, 잘못된 MIME/base64 이미지 허용을 확인했다. stack 초과는 JS_ERROR 후 같은 세대로 복구됐다. 큰 반복 문자열은 deadline에 걸렸으므로 메모리 한도 증거로 쓰지 않았다. 별도 Uint8Array 실제 할당 probe에서는 out of memory JS_ERROR·runtimeReset false와 다음 요청 복구를 확인했다. 원시 결과는 ignored output/goal-b01c-before-probe 및 output/goal-b01c-memory-probe에 보존한다. 이는 다음 단계의 Before 조사이며 어떤 B01C 조건도 pass로 올리지 않는다.

다음은 전체6 REQ/7조건의 테스트·경계 fixture를 준비하고 동일 최종 Before를 수집한 뒤 공통 출력/이미지/전송/자원 한도를 구현한다. 이미지 검증은 PNG magic만 확인해 유효성으로 단정하지 않으며 원본 파일 bytes·정상 초과 전체 생략·후속 로그·무누출을 함께 판정한다. 전체 Goal의 B01D~B06와 최종 문서/회귀·리뷰·머지는 계속 남아 있다.


## 2026-11-02 · B01C 출력·이미지·자원·전송 경계 구현

이슈13의6 REQ/7조건을 실제 확장 테스트6개로 구현했다. 공통 요청 출력 버퍼, guest 문자열 escape·순환 표지, PNG 실제 디코딩/CRC/고정 inflate/Adler 확인,64KiB 텍스트·4MiB/합8MiB/4장 이미지·256블록·16MiB 결과를 분리한다. 메모리/호스트 WebAssembly 스택 한도는 RESOURCE_LIMIT·runtimeReset와 새 세대로 복구하며 일반 Error의 같은 문구는 JS_ERROR로 남긴다. fake extension 전송 경계2개·출력 buffer2개 단위와 별도 native PNG oracle을 추가했다.

최종 소스/fixture/helper/docs/의존성을 고정하고 server/worker 진입 파일만0446e5b로 둔 Before는 제품1/6·전송0/2, After는6/6·2/2다. 전체79 PASS/외부1 SKIP/FAIL0, headed 요구 제품15 PASS. 첫 병렬 PNG fixture 프로세스는 live PID를 확인해 TERM 후에도 live임을 재확인하고 KILL로 종료했으며 raw 중단 로그를 보존했다. native oracle 단계 제한과 fixture 순차 실행 뒤 정상 종료했다. 표준 PNG fixture를 actual Chromium createImageBitmap의 픽셀로 검증하고 제품 원본 SHA와 구분했다.

Codex CUA js와 Aside CLI1.26.1028.2335 one-shot REPL에서 같은 값의 bounded console/NUL/circular를 실제 비교했다. 사용자 탭/데이터를 읽지 않았고 Codex 임시 빈 탭은 닫았다. Codex는 NUL·[Circular *1]·after를 보존했고 Aside는 NUL 뒤가 잘리고 circular에서 RangeError가 나 after에 도달하지 않았다. CLI exit0과 런타임 오류를 구분했다. 우리 Before는 NUL 잘림/[object Object], After는 NUL/[Circular]/after다. Codex 증거는 수신 출력 전사, Aside는 CLI stdout 캡처로 출처를 구분한다. 그 외 예산/이미지/전송은 경쟁 신규 실측이 없으며 지원·성능을 추론하지 않는다.

정확 head 독립 Sol6.1 high 리뷰가 아직 필요하다. B01C slice는 in-progress이며185개 전체의 완료가 아니다. B01D 이후 전체 작업은 유지한다.


## 2026-11-02 · PR14 독립 P2 세 건 수정

정확99aa574의 Sol6.1 high 독립 리뷰는 CHANGES_REQUESTED였다. CRC가 맞는 잘린 Adam7이 정상 수용되고(native decode 실패),81,634bytes PNG의 ICC80MiB 확장이 workspace를 우회했으며 사용자 RangeError('out of memory')가 자동 reset/binding 소실을 일으켰다. 리뷰 보고서와 원시 반례를 보존했다.

Adam7 각 pass의 정확한 scanline 길이·전체 CRC·압축 메타데이터를 작은 입력 조각 스트림으로 확인한다. 검증용 pixel 사본에서는 ICC/텍스트를 제거해 범용 decoder의 별도 무제한 해제를 막고 반환 원본은 유지한다. 정상 Adam7/잘린 Adam7의 native oracle와 실제 display·ICC 과도 확장 거절/후속 log를 추가했다.

guest 예외 이름과 메시지는 원인 증명이 아니므로 자동 VM 재생성에 사용하지 않는다. 실제 호스트 WASM 스택 trap만 RESOURCE_LIMIT·새 generation이고, guest 메모리 한도 InternalError는 JS_ERROR·guestName·유지된 VM의 runtimeReset:false를 명시한다. 이는 실제 재생성 여부를 구분하는 정본 계약을 따른다. 실제64MiB 한도 실패/후속 정리·복구를 확인하고 Error/RangeError/위조 InternalError 등5개 사용자 예외가 binding123과 generation을 보존하는 반례를 보강했다.

같은 최종7개 제품 테스트: base0446e5b의 entry2파일 비교1 PASS/6 FAIL→7 PASS, review99aa574의 worker/output 비교5 PASS/2 FAIL→7 PASS. 두 비교 모두 그 두 파일 외 기록 source hash는 같다. 전체81 PASS/외부1 SKIP/FAIL0, headed 요구 제품16 PASS, 문서/계획·각 검사기 회귀 통과. 초기6개/79개 phase는 이력으로 보존한다. 새 정확 head의 독립 재리뷰가 남아 있으며 아직 미머지다.


## 2026-11-02 · PR14 두 번째 독립 P2 보완과 형식 corpus 확대

정확5747487의 재리뷰가 찾은 금지 color/depth·필수 PLTE 누락과 과도한 palette 할당을 보완했다. generic fast-png/iobuffer를 제품 의존성에서 제거하고 자체 색상·palette·transparency·행/Adam7·필터 검사와 제한 fflate 스트림을 사용한다. 전체 raster/palette 배열 없이 indexed 두 행만 복원하며 IDAT는 파일 길이 이내 단일 버퍼로 모은다. 확장64MiB와 작업 공간 예산을 분리 검사한다. 정상40·거절26의66행과 native oracle의 필터별 픽셀 판독을 추가했다.

최종8개 제품 비교 base1/8→8/8, 직전 리뷰574의 output만 복원하면7/8→8/8(66행 중26개 오판)이다. base 형식 행렬은1MiB wire timeout으로 중도 실패해66행 기록이 없고, 이를 전부 실행한 것처럼 표시하지 않는다. 최종 final4 전체83 PASS/외부1 SKIP, 최종 source hash 일치. 직전 final2 실행의 다운로드 취소 TIMEOUT1건도 실패 기록으로 보존한다. 비중첩 재실행은 통과했지만 간헐 원인은 미확정이다. 새 정확 head의 Sol6.1 high 재리뷰가 남아 있고 B01C는in-progress다. 중계기는 개인용 로컬 전송이며 다중 사용자 계정/할당량 기능은 범위 밖이다.


## 2026-11-02 · PR14 압축 구조 검증 보완

정확64f2de4의 세 번째 독립 리뷰는 stored DEFLATE LEN/NLEN 불일치73bytes PNG를 실제 이미지로 수용하는 P2 한 건으로 CHANGES_REQUESTED였다. Node zlib·Chromium은 거절하지만 기존 fflate 스트림이 허용했다. 범용 pako3.0.3(MIT AND Zlib)의 zlib-only Inflate로 교체하고 고정64KiB 출력 조각/256bytes 입력·예산 callback·종결/입력 전체 소비 검사를 적용했다. 자체 행 검사·원본 bytes·64MiB 한도는 유지한다.

추가8개 압축 사례 중 정상 stored/fixed/dynamic과 손상 LEN/NLEN·truncated/header/Adler/metadata를 실제 확장에서 구분했다. 동일 최종9개 테스트 base1/9→9/9, 직전64 output만 복원8/9→9/9다. 정상 native 지원과 일부 손상 checksum/ancillary 관대함을 분리하고 첫 native 기대값 오류를 성공으로 숨기지 않는다. 최종 전체/창 모드 검증과 새 head 독립 리뷰 결과는 round4 manifest를 따른다. B01C 이후 단계의 완료를 선언하지 않는다.


## 2026-11-02 · PR14 독립 PASS·머지와 B01D 착수

정확41ff8e3의 Sol6.1 high 독립 4차 리뷰가 PASS였다. 전체85 PASS/외부1 SKIP·headed18 PASS·문서/계획 및 검사기6개 회귀, 별도 실제 PNG11개/console1개와 증거 hash/Before 차이를 독립 확인했다. P0~P3 없음·정확 원격base/head·CLEAN/MERGEABLE 확인 후 PR14를05b0e6a로 squash merge하고 이슈13을 닫았다. 보고서·독립 probe를 보존한다. B01C6부모/7조건만 완료다.

B01D 이슈15·feat/15-reset-lifecycle에서4부모/6조건을 시작한다. 기존 session.reset은 내부 keys/buttons만 지우며 실제 release하지 않고, worker 종료 뒤 background hostcall continuation도 남는다. 먼저 페이지/input event 추적·늦은 대상 fixture와 최종 동일 Before를 준비한다. 실제 해제 실패 경고와 이미 전송된 효과의 불확실성을 숨기지 않고 탭/페이지/asset/완료 파일은 유지한다. 다중 사용자 계정 서비스는 범위 밖이다. B01D 조건은 아직 미검증이다.


## 2026-11-02 · B01D 세대 차단·실제 입력 해제와 최종 국소 검증

이슈15의4부모/6조건을7개 실제 제품 테스트로 판정했다. offscreen/background/worker에 고정 provenance와 세대 장벽을 연결하고 CDP·직접 탭/다운로드/file broker 후속 전송을 차단한다. 실제 down/interception의 release 응답·실패 trace/warnings/inFlight 불확실을 반환한다. 명시 reset의 중복 generation 증가, await 이후 실제 stack pump 오류의 늦은 종결, 거절된 attach의 소유 예약 회귀를 찾아 고정했다. 탭·A·ref·다른 세션77·asset/완료 파일은 보존된다.

같은 최종 소스 입력에서 기존 소유6파일만05b0e6a로 복원한 Before1 PASS/6 FAIL→After7 PASS다. 기존 보존 자체는 Before에서도 됐으며 명시 metadata·실제 release·늦은 클릭 차단·해제 오류 보고가 개선된 점을 구분한다. 최종 전체100 PASS/외부1 SKIP·창 모드25 PASS, 기록 소스 일치·정확 baseline6파일 hash 확인. native oracle의 rAF/relay 관찰 실패를 raw로 남기고 child focused press+DOM polling으로 원래 trusted keyup 조건을 유지했다.3회 native oracle와 최종 전체 통과는 원인 보편적 해결 주장과 구분한다.

Codex의 own fixture reset은 변수undefined·동일 tab7·A 보존을 LIVE 전사로 기록하고 임시 탭만 닫았다. Aside는 fresh guide/repl guide/help DOC에서 explicit reset 방법을 확인하지 못했으며 지원 불가로 해석하거나 API를 발명하지 않았다. 경쟁 actual release/late hostcall 실측은 없다고 명시한다. 새 정확 head 독립 Sol6.1 high 리뷰와 gate·머지가 남아 있으므로 slice는in-progress다. 전체 Goal의 B01E~B06와 최종 현황/전체 회귀는 계속 남는다.


## 2026-11-02 · PR16 독립 PASS·머지와 B01E 준비

정확3d4246f의 Sol6.1 high 독립 전체 리뷰는100 PASS/외부1 SKIP·headed25 PASS·추가 제품3 PASS와 증거/소스를 재검증했고 P0~P3 없음으로 PASS였다. 캡처 EOF2개/manifest만 정리한 정확0e05802는 별도 새 컨텍스트 delta 리뷰 PASS. 제품·실행 입력389개 동일성과 기존 exactclean 실행의 현재 소스fingerprint를 확인해 불필요한 브라우저 재실행 없이 결합gate를 충족했다. 원격 base/head·CLEAN/MERGEABLE 확인 뒤 PR16을8d7c7d8로 정상 squash merge, 이슈15를 닫았다. 두 보고서·독립 probe/감사를 보존한다.

B01E는 이슈17·feat/17-evaluation-serialization에서5부모/7조건을 준비한다. 아직 제품 코드는 바꾸지 않았다. 현재 returnByValue/parseValue가 undefined 등을 null로 숨길 수 있고 waitForFunction의 catch-all이 reject/직렬화 오류를 timeout으로 오인할 수 있어 공통 strict JSON/Promise settle·에러 경로를 먼저 명세와 대조했다. 최종 fixture/테스트와 Before를 고정한 뒤 구현한다. B02~B06와 최종 전체 요구/회귀 문서까지 이어지는 Goal은 유지한다.

- B01E 이슈17: 엄격한 JSON/Promise settle/오류·문서 경계와 wait deadline을 구현. 실제 제품7 PASS·전체113 PASS/외부1 SKIP·headed32 PASS. Before0/7, 원시 준비 predicate 실패를 보존. Codex/Aside root LIVE 계약 비교 기록. 독립 리뷰 전이며 slice in-progress.

- PR18 정확7bae78a Sol6.1 high 독립 CHANGES_REQUESTED(P2 큰 timeout 타이머 overflow). bounded interval 재설정으로 수정하고 제품4경계/단위1 추가. 전체114 PASS/외부1 SKIP·단독 headed32 PASS, 병렬 headed의 프레임조회1건 실패도 원시 보존·B03A 추적. 새head 재리뷰 대기.

- PR18 정확70ba037 독립 재리뷰 PASS(114/외부1 SKIP·headed32·추가15행), 원격 exact gate 확인 후0452cbe 정상 머지·이슈17 닫힘. B02A 이슈19와 feat/19-selection-naming 시작.

- B02A 이슈19: 공통 이름/본문/출력 분리·IDREF root/우선순위·composed 최소text·입력검증·detachedN 예외 보완. Before3/10→After10/10, 전체127 PASS/외부1 SKIP·단독 headed42 PASS. Codex/Aside 같은 최종root16조회+실제proof 비교와 원시 실패 보존. 독립 리뷰 전.

- PR20 정확f664dd1 독립 CHANGES_REQUESTED: 기존 P2 composed ghost/문서CSS 누락2건을 수용. 선택projection/문서root/inertCSS를 보완하고 유효한 별도fixture·nativeoracle·2제품case추가. Before3/12→After12/12, 전체130 PASS/외부1 SKIP·단독 headed44 PASS. 추가3도구root실측·초기잘못된fixture실패를구분보존. 새head재리뷰전.

- 사용자범위변경: 전체Goal중단,6단계B02A까지만마무리. 재리뷰bf91의기존 :scope P2를 native루트CSS로수정, 최신고정입력Before3/12→After12/12·전체130 PASS/외부1 SKIP·headed44 PASS. Codex/Aside :scope4조회도새실측. 새head독립리뷰후정상머지하고7단계는시작하지않는다.
