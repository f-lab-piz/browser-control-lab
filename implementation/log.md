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
