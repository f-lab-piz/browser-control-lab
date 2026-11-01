# 3차 반례/예제 교차조사 B

검토 고정 head `704b316f14bd5c3062436c72a1efe6da4fb7d4d3`, 제품 `700a6a06af3f97729327afaf9becb4ee29bb475b`. 2026-11-01. 아래는 정본·근거의 **문서 대조 후보**이며 제품 실패 실측이나 독립 최종 리뷰 판정이 아니다. 새 브라우저/실측/제품소스/원격/subagent 호출0, 정본·제품·테스트 변경0이다.

## 읽기 범위와 이미 해결된 선택

- 외부3/내부64/공통5의72정본에서 입력/출력·185 REQ 규범과254 Cnn의 조건/준비/실행/판정을 모두 읽었다.254사례는64/64/64/62개로 나눠 현재 원문을 재출력해 잘림 없이 읽었다. 규범/입출력도 분할했으며 잘린 mouse/keyboard와 공통표는 별도 출력으로 보충했다. 반복 지원/현재사실 문장은 중복 제거했다. 정확 ID/파일 hash는 `cycle3-read-manifest.json`이다.
- 공통 runtime 수명표, input 상태/키/완료관측표, selection 이름표, files-events MIME/소비/current-query표를 현재 고정본에서 읽었다.6참고본문72 reference는 직전 전체 읽기 결과를 재사용하고 고정본까지의 모든 본문 변경을 직접 대조했다. 변경 없는 방법/예제/claim은 지난 읽기와 같은 텍스트이며 신규 REQ004의 slot/claim/실제 본문 경로는 별도 확인했다.
- `reviews/cycle-2/research-decisions.md`의 A10/B10 판단, `review.md`의 REF2-01..03과 실제 범위/한계, `decisions.md`의 수용 수정과 메인 자체 점검을 읽었다. REF2 논리를 현재 scrollIntoView 누적 교집합, MIME 소문자 충돌 전송 전 DUPLICATE_MIME_TYPE, 이미 down한 주키 press의 KEY_ALREADY_DOWN으로 대조했다.
- lexical 재선언 표준 거절/var 재선언 허용을 확인했다. Control++ 지원은 메인이 채택한 grammar로 유지한다. includeCurrent는 현재 dialog만 명시 복구하며 다른 event는 미지원인 선택을 확인했다. Page close는 해당 Page만, reset은 전체 소유 Page의 down 정리/구세대 핸들 무효·탭 owner/asset 유지인 선택을 유지한다. 데이터 ref 문자열과 JS 객체 핸들의 수명 차이도 읽었다.2차의 대안 선택을 다시 결함으로 등록하지 않았다.
- 미검토/한계: 새 브라우저 실행, 제품/fixture 구현 적합성, 모든 과거 trace/픽셀/파일바이트, 경쟁 원본 구현/번들/WASM, 거대 중복 raw/requirements-read 전문은 재검토하지 않았다. 현재 고정본 이후 편집은 포함하지 않는다. 미독 정본 REQ/Cnn은0이지만 경쟁제품 전체조건 확인 수와 독립리뷰 완료 수는 이 수치와 무관하다.

## 후보 요약

|ID|우선순위|내용|
|---|---|---|
|C3B-01|P2|단순 하위 timeout에도 새 변수 세대를 기대하는 Cnn이 새 수명표와 충돌|
|C3B-02|P2|신규 현재dialog 요구에 Aside download waiter를 direct 대응으로 재사용|
|C3B-03|P2 판단 후보|기존 미래dialog waiter와 current-query가 섞인 claim 경합의 oracle 공백|
|C3B-04|P3|cancel의 파일 삭제 없음이 완료파일/브라우저 임시부분파일을 구분하지 않음|
|C3B-05|P3|drop 거절 준비의 data 빈값이 허용된 빈문자열 MIME 값과 혼동됨|
|C3B-06|P3|이식된 Aside 근거 location이 ignored scratch 경로를 계속 가리킴|

P2 세 번째는 기존 단일 claim/다음 event 규범의 조합에서 확인할 정책 경계이며 구현 실패를 확정한 것이 아니다. 모든 후보는 메인의 수용/기각/보류 판단 대상으로 남긴다.

## C3B-01 · P2 · 단순 wait timeout에서 변수 새 세대를 기대하면 정상 구현을 실패시킴

- 정확 위치: `docs/requirements/common/runtime.md:66-71`, **REQ-C-RUNTIME-003-C01**, 특히 실행 `reset/timeout 후 새 실행`과 판정 `변수 새 세대`. 같은 파일 `:197-198`의 수명표는 session reset과 timeout을 구분하며 “단순 하위 wait timeout은 VM 전체 reset을 의미하지 않음”이라고 한다. 연관 REQ-JS-002-C01, REQ-RESET-002-C01은 실행 제한/명시 reset의 복구다.
- 반례: 세션에서 `let kept=7`을 성공시키고 유효 CSS의 `waitFor({state:'visible',timeout:10})`가 대기 timeout으로 끝난 뒤 `kept`를 읽는다. VM을 재생성하지 않은 정상 단순 timeout에서는7을 보존해도 수명표에 맞지만 현재 C003/C01의 “새 세대”를 문자 그대로 쓰는 oracle은 이를 실패로 판정한다. 이를 통과하려고 모든 timeout에 VM reset을 넣으면 새 상세표의 목적과 다르게 정상 변수가 사라진다.
- 최소 수정: C003/C01을 하나의 ID 안에서 (a) reset/실제로 VM 재생성한 실행 제한과 (b) VM을 재생성하지 않은 하위 wait timeout으로 나눈다. (a)는 generation 변경·old binding 없음·late 차단, (b)는 같은 generation·kept7·해당 waiter 단일 종결·late 차단을 판정한다. VM 재생성 여부는 결과의 generation/runtimeReset으로 설명하고 공통으로 페이지 값/asset은 보존한다. 단순 timeout에서 반드시 VM reset을 금지하는 더 강한 새 규범을 넣자는 뜻이 아니다.
- fixture: 제어 clock의 하위 wait timeout과 명시 reset 두 run을 분리한다. 세션 binding/세대, UI marker, waiter terminal 수와 late output 수를 각각 기록한다. 실행 제한으로 VM이 재생성된 별도 run만 old binding 제거를 기대한다. 테스트/제품 구현은 이번에 만들지 않는다.
- 근거:2차 수용 수명표와 기존 Cnn의 내부 불일치이며 Codex/Aside 구현을 참고해 우리 규범을 바꾸는 주장이 아니다.

## C3B-02 · P2 · current-dialog 요구의 Aside direct는 실제 문서 방법이 없음

- 정확 위치: `docs/requirements/reference-methods/index.json:6769-6830`, **REQ-PAGE-WAITFOREVENT-004**의 Aside 슬롯 및 **REQ-PAGE-WAITFOREVENT-004-C01/C02**. `relation:"direct"`와 `CL-ASIDE-page-waitForEvent-01`을 연결한다. 해당 claim은 `evidence-index.json:1173`에서 **download waiter를 action 전에 등록하는 DOC 예제**뿐이다. `files-events.md:53-100`의 ref-page-waitforevent도 Aside 방법을 “Page download 이벤트 wait”라고만 설명한다.
- 반례/영향: 이 신규 요구를 읽는 구현자가 direct reference의 공개예제를 따라 `page.waitForEvent('download')`를 등록해도 열린 현재dialog를 즉시 조회할 수 없다. 현재query·dialog 지원을 입증하는 Aside DOC/실측은 보존 자료에 없다. `not-established`가 있어서 전체지원 확인률 과장은 아니지만, 직접 대응 방법이라는 관계값은 새 요구의 목표와 맞지 않는다.
- 최소 수정: Aside의 **004 전용** relation을 unknown으로 표시하고 “현재dialog 조회의 공개 방법/서명 미확인”을 이유로 남긴다. 기존001..003의 download 미래wait 부분 직접 대응까지 지우지 않는다. 관련 download claim은 탐색 단서로 유지할 수 있으나 current-query의 직접 방법이라고 쓰지 않는다. 미확인을 미지원으로 바꾸지 않는다.
- Codex 쪽 보완: 같은004의 `CL-CODEX-current-dialog-01`은 `tab.getJsDialog():Promise<Dialog|undefined>`의 좁은 DOC로 올바르게 등록돼 있다(`evidence-index.json:1711`). ref-page-waitforevent 본문에 “미래 waitForEvent와 다른 current-query는 getJsDialog; 없으면undefined인 공개 계약이며 우리 오류/claim/reset 복구 보장은 별도 설계”를 한 단락으로 연결하면 실제 참고 흐름을 읽을 수 있다. 예제는 `const current = await tab.getJsDialog();` 수준의 **문법 근거 있는 미실행 조각**으로 표시하고 reset 복구 성공으로 승격하지 않는다.
- fixture/검사: 정적 문서 검사로004 Aside relation/미확인 이유와 provider별 method가 같은 목표를 가리키는지 확인한다. current lookup/dropdownload를 실행하거나 새로운 Aside API를 찾아 만들지 않는다. 이 수정으로 조건 확인률·실측률을 올리지 않는다.

## C3B-03 · P2 판단 후보 · current-query와 기존 미래 waiter의 event claim 경계

- 정확 위치: `common/files-events.md:172-176`의 가변wait/기존dialog복구/current-query 구분, `internal/page.waitForEvent.md` **REQ-PAGE-WAITFOREVENT-002-C01, REQ-PAGE-WAITFOREVENT-003-C01, REQ-PAGE-WAITFOREVENT-004-C01/C02**. C004/C02는 “기존 dialog/미래 waiter 상태는 변하지 않는다”를 검사하지만 이미 claim한 현재 event/없음/다른 종류만 준비하고 **아직 future waiter의 응답 핸들이 전달되지 않은 current event**는 다루지 않는다.
- 반례: (1) D0가 이미 열린 뒤 기본 future waiter W를 등록한다. W는 등록 전 D0를 소비하면 안 된다. includeCurrent로 D0를 얻어 처리하는 것은 가능해야 W가 D1을 기다리며 회복할 수 있다. (2) W 등록 뒤 새 D1이 기록됐지만 W의 핸들 전달을 adapter gate로 지연시키고 current-query를 호출한다. query가 D1을 먼저 claim하고 W를 timeout시킬지, W에 예약된 identity이므로 query를 거절할지 현재 표의 “같은 세대 유효 핸들이 이미 있으면”만으로는 oracle를 정하기 어렵다. 두 mutable 핸들을 새로 발급하는 것은 이미 기존 규범으로 금지돼 있다.
- 최소 수정(추천): event를 기록할 때 등록시각/sequence에 맞는 기존 mutable waiter의 claim을 함께 예약하고, 응답 전달 지연은 그 예약을 해제하지 않는다고 명시한다. query는 등록 전의 unclaimed D0는 획득할 수 있지만 W에 예약된 D1은 EVENT_ALREADY_CLAIMED(또는 메인이 고른 명시 충돌)로 즉시 거절하며 W/그 deadline을 바꾸지 않는다. 활성 future waiter가 있다는 이유만으로 모든 current-query를 거절하면 (1)의 회복을 막으므로 단순 일괄거절을 제안하지 않는다.
- fixture: timestamp에 sleep을 쓰지 않고 세 개 순서 `D0 기록→W ready→query D0`, `W ready→D1 기록/claim→응답 gate→query D1`, `query D1과reset/close`를 adapter 이벤트 경계로 제어한다. D0 처리1회·W는 D1만, D1 query는 오류·W에 동일 event1회, reset/close는 stale/단일종결이며 새 dialog 입력0을 판정한다. 새 공개 ready/query API는 추가하지 않는다.
- 범위/근거: 새 includeCurrent의 성공을 구현했다는 실측이 없다. 이 후보는 기존 “다음 event”, 등록 전 event 제외, 단일 claim과 회복 경로를 함께 판정할 때 필요한 경계다. 메인이 현재 규범의 원자적 event-dispatch 의미만으로 충분하다고 판단하면 그 해석을 기록하고 fixture 사례만 보강할 수 있다.

## C3B-04 · P3 · cancel의 파일 삭제 금지를 완료 파일로 한정해 부모와 맞춤

- 정확 위치: `internal/download.cancel.md:12` 허용 부작용은 “진행브라우저전송중단;완료파일삭제아님”인데 **REQ-DOWNLOAD-CANCEL-001-C01**(`:35-39`)은 느린 진행전송을 준비하고 “파일 삭제 없다”라고만 한다. `test-design.md` S12도 “이미완료파일자동삭제없음”이다.
- 반례: 브라우저가 관리하는 부분전송 임시 파일과 이미 완료된 사용자 파일을 동시에 관찰하는 fixture. cancel API가 완료파일을 건드리지 않아도 브라우저가 부분파일을 자체 정리하는 경우까지 파일 삭제 없음 oracle에 포함할지 현 문구는 애매하다. 특정 Chrome 버전에서 실제 이렇게 동작한다는 새 관측 주장은 아니다.
- 최소 문구 수정: C01을 “완료된 사용자 파일을 API가 삭제하지 않는다. 브라우저 관리 부분파일의 보존/정리는 실제 상태·잔여 경로로 기록하고 완료파일 보호와 구분한다”로 부모 허용 부작용과 맞춘다. 서버 자산/완료 local파일을 유지한다는 runtime 정책을 낮추지 않는다.
- fixture 판정: completed F의 hash/존재는 불변, 취소 대상 P의 최종 interrupted 상태·부분파일 존재 여부/누가 정리했는지 trace를 별도 기록한다. P의 임시파일이 반드시 남아야 한다는 새 지원 요구를 추가하지 않는다.

## C3B-05 · P3 · data 빈값을 {}로 써서 허용 empty MIME value와 구분

- 정확 위치: `internal/locator.drop.md:65-70`, **REQ-LOCATOR-DROP-002-C01** 준비 “files 없고 data 빈값”. `common/files-events.md:171`의 drop.data 표와 **REQ-C-FILESEVENTS-007-C01**은 `{"text/plain":""}`을 유효 payload로 허용하고 `{}`만 payload 없음으로 정했다.
- 최소 문구 수정: 거절 run의 준비를 `files 없음 + data:{}`, `data 값이 문자열이 아닌 record`, `잘못된 source`처럼 독립 입력으로 적는다. `data:{"text/plain":""}`과 files=[]+유효 data는 별도 정상 run이라고 연결한다. 기존 policy를 다시 선택하는 것이 아니라 정해진 oracle를 읽기 쉽게 만드는 P3다.
- fixture 판정: {} 단독 drop0, empty string MIME 값은 정확히 길이0인 항목·반환파일목록[]·drop1. MIME 대소문자 중복은 이미 REF2-02에서 해결한 DUPLICATE_MIME_TYPE이므로 별도 신규 결함으로 세지 않는다.

## C3B-06 · P3 · 공개 근거의 정본 경로를 표시하면 다른 checkout에서 직접 대조 가능

- 정확 위치 예: `reference-methods/runtime-output.md:39/41/143`, `files-events.md:87/239` 및 `evidence-index.json`의 A-DOC-MAIN/A-DOC-REPL location은 `.local/reference-loop-execution/aside/current-*.txt`라는 ignored scratch 경로다. 실제 고정 산출물은 `reference-methods/evidence/aside/current-main-guide.txt`, `current-repl-guide.txt`, `current-repl-help.txt`에 보존돼 있다.
- 최소 수정: 조사 당시 원경로가 필요하면 provenance로 남기되, claim의 직접 대조 location과6참고본문에는 추적되는 `evidence/aside/current-*.txt :: 절`을 우선 표시한다. sourceId/문서 내용/DOC 종류/확인 범위는 그대로다. 원문이 없거나 claim이 허위라는 후보가 아니다. source registry를 통해 우회 대조는 가능한 현재 상태의 이식성/가독성 정리다.
- 검사: fresh checkout에 `.local`이 없어도 정본 location의 파일·절을 열 수 있는지 정적 경로 검사로 판정한다. CLI 재호출·가이드 재수집·실측 승격은 필요 없다.

## 초점 영역에서 결함으로 재등록하지 않은 결과

- 파일/MIME:0-byte 파일과 [] 해제, source 정확히1개·일반 number[]/strict base64, 각파일/총합32MiB·single/multiple, 사전 전체검증/중도부분효과, lowercase MIME collision 거절, native/asset unknown type와 inline default를 구분했다. 이 범위에 새 파일 source/임의 저장경로/더 강한 size/count를 추가할 이유를 찾지 못했다. P3의 빈 record 표현만 보완한다.
- arming:기존 “ready→action→event”, 호출 시작부터 총deadline, timeout/reset 후 late등록0을 유지한다. deadline 전에 arming이 실패한 queued action이 입력돼서는 안 된다는 것은 기존 arming 전 입력 금지의 회귀 사례로 남기면 된다. 별도 공개 ready API나 경쟁제품 내부 큐 구조를 요구하지 않는다.
- Page close/reset:Page별 down 분리와 실제 release 실패 불확실 표시, 다른 Page/타세션 보존을 유지한다. reset 후 old JS handle은 무효, 살아 있는 같은 대상의 ref 데이터 문자열은 안정, server asset/완료 local파일은 session 수명이라는 구분은 함께 구현 가능하다. 동일 requestId tombstone 유지도 새 세대 재입력을 방지한다.
- 현재dialog:record/native identity 대조·없음 즉시오류·같은세대 재claim 오류·다른event includeCurrent 미지원은 수용된 범위를 지킨다. 현재dialog 한정 복구를 새 범용 chooser/download 재획득 기능으로 확장하지 않는다. 이들 미확인을 Aside 미지원으로 단정하지 않는다.
- 목표발견:공개 task predicate/유일정답 검증/정확selector 숨김/NOT_FOUND는 완전관찰/동률은 임의입력0/예산·접근불가는 INCOMPLETE라는 oracle를 확인했다. 관찰이 끝나지 않은 상태에서 보이는 두 후보만 동률이라고 최종 판단하지 않고 INCOMPLETE로 남기는 반례는 기존 정책의 사례로 유지할 수 있다. 업무결과를 신규 API오류로 바꾸거나 더 큰120호출/180초 예산을 강제하지 않는다.
- 부분효과:fill/check/select/focus의 동기handler·다음microtask 후 완료관측과 이후독립변경, down후fault의 자기새소유 정리, 실제다운로드/저장hash·cancel종결을 구분한다. 예외 없음/HTTP200/문법컴파일만으로 업무 PASS를 만들지 않는다.
- 예제/근거:여섯 본문의 미실행/과거/의사코드 표지와 provider 구분을 유지한다. 원본 Aside와 wrapper·일반 Playwright를 합치지 않는다. Control++를 거절로 되돌리거나 lexical 변환을 지원하도록 요구하지 않는다. 여기서 제품 미실행 예제를 실측으로 올린 확정 오류는 찾지 못했고 신규004의 방법 관계만 C3B-02로 지적했다.

## 종료 범위

후보6건(P2 3건, P3 3건), 정본185REQ/254Cnn 미검토0. C3B-03은 메인 판단이 필요한 claim 경계 후보임을 별도 표시했다. 확인된 경쟁지원/미지원 수나 실측/독립 검토율을 이 후보 수로 계산하지 않는다. 이 문서는 메인의 최종 선택과 별도 Sol C의 마지막 독립 검토를 대신하지 않는다.
