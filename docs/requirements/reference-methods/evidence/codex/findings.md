# Codex 조사 1 · 판정 조건과 규범 보완 후보

전체184 REQ의 규범을 읽었고 외부3/내부64/공통5 모두 매핑했다. 현재 제품 지원·전체실측·독립승인 완료를 뜻하지 않는다. 정본 수정 권한은 메인에게 있으며 아래는 후보다. 새 MUST를 자동 제안하지 않는다. API가 존재한다는 사실은 조건 전체 지원 증거가 아니다.

## 우선 판단이 필요한 차이

1. 공개 evaluate는 read-only다. 우리 변경가능 Scope/Locator 평가를 Codex 예제로 검증했다고 적으면 잘못된 참고 흐름이 된다. Promise 타입은 문서에 있지만 JSON/undefined/NaN·thenable·reset late settle 계약은 미확인이다.
2. textContent/getAttribute/isVisible/isEnabled의 공개 설명은 first matched이고 textContent는 missing null을 명시한다. 우리 단일 조회 0/N strict를 Codex와 일치한다고 쓰지 않는다. 실제 원본 동작이 설명과 다른지는 후속 fixture 조사다.
3. domSnapshot은 무옵션 string API다. 우리 ref/cursor/since/bytes/scrollport JSON 계약은 비교 원본에서 확인되지 않았다. getAXState diff는 별도 관찰이므로 snapshot since의 동등근거가 아니다.
4. direct file input API를 invent하지 않는다. 공개 업로드는 wait filechooser→click→setFiles(absolute paths)다. local/asset/inline source를 자동 동일시하지 않는다. Download.path와 서버 asset/save/cancel은 다른 계약이다.
5. networkidle 공개지원, filter has/hasNot, selector descriptor와 우리거절정책 차이를 경쟁모방으로 없애지 않는다. 사용자의 결정적 검증·단순범위 이유가 있으면 우리정책 유지가 가능하다.
6. mouse/keyboard down/up, locator hover/focus/dragTo/drop/scrollIntoView는 현재 IAB 공개목록에서 못찾았다. native Target 계약은 DOM-only throw를 명시하므로 숨은 우회경로로 쓰지 않는다. 미열거는 제품 전체 미지원 증명이 아니다.

## GWT 보완 방식

현재 67 API 중59개가 개별2 REQ다. 개수 자체가 결함은 아니지만 목적→목적을 Then에서 반복하면 독립 판정할 수 없다. 기존 ID를 유지하면서 requirement에 포함된 정상/경계/무부작용 조건을 testable conditionKey로 분해하는 편이 좋다. 공통 조항은 재복제하지 않고 참조한다. 선언된 목적의 모든 내용을 새 MUST로 늘리지 않으며, 구체화는 기존 계약의 판독가능성에 한정한다.

각 후보 아래의 입력 데이터·최종상태·오류/무입력 표를 검증계획의 GWT에 넣고, 규범이 이미 같은 의미면 정본 문구 변경 없이 PLAN만 보완할 수 있다. 예외/타입/반환값이 아직 모호하면 메인이 기존 목적·사용자 업무 근거로 판단한다. 경쟁사 존재는 MUST 확대 근거가 아니다.

## 전체 읽은 목록

- `external/guide.md`: REQ-GUIDE-001, REQ-GUIDE-002
- `external/reset.md`: REQ-RESET-001, REQ-RESET-002, REQ-RESET-003
- `external/js.md`: REQ-JS-001, REQ-JS-002, REQ-JS-003
- `internal/browser.list.md`: REQ-BROWSER-LIST-001, REQ-BROWSER-LIST-002
- `internal/browser.tabs.md`: REQ-BROWSER-TABS-001, REQ-BROWSER-TABS-002
- `internal/browser.open.md`: REQ-BROWSER-OPEN-001, REQ-BROWSER-OPEN-002
- `internal/browser.attach.md`: REQ-BROWSER-ATTACH-001, REQ-BROWSER-ATTACH-002
- `internal/page.activate.md`: REQ-PAGE-ACTIVATE-001, REQ-PAGE-ACTIVATE-002
- `internal/page.close.md`: REQ-PAGE-CLOSE-001, REQ-PAGE-CLOSE-002
- `internal/page.goto.md`: REQ-PAGE-GOTO-001, REQ-PAGE-GOTO-002
- `internal/page.back.md`: REQ-PAGE-BACK-001, REQ-PAGE-BACK-002
- `internal/page.forward.md`: REQ-PAGE-FORWARD-001, REQ-PAGE-FORWARD-002
- `internal/page.reload.md`: REQ-PAGE-RELOAD-001, REQ-PAGE-RELOAD-002
- `internal/scope.snapshot.md`: REQ-SCOPE-SNAPSHOT-001, REQ-SCOPE-SNAPSHOT-002, REQ-SCOPE-SNAPSHOT-003, REQ-SCOPE-SNAPSHOT-004, REQ-SCOPE-SNAPSHOT-005, REQ-SCOPE-SNAPSHOT-006, REQ-SCOPE-SNAPSHOT-007, REQ-SCOPE-SNAPSHOT-008, REQ-SCOPE-SNAPSHOT-009, REQ-SCOPE-SNAPSHOT-010, REQ-SCOPE-SNAPSHOT-011
- `internal/page.screenshot.md`: REQ-PAGE-SCREENSHOT-001, REQ-PAGE-SCREENSHOT-002, REQ-PAGE-SCREENSHOT-003, REQ-PAGE-SCREENSHOT-004
- `internal/page.frames.md`: REQ-PAGE-FRAMES-001, REQ-PAGE-FRAMES-002
- `internal/page.frame.md`: REQ-PAGE-FRAME-001, REQ-PAGE-FRAME-002
- `internal/scope.locator.md`: REQ-SCOPE-LOCATOR-001, REQ-SCOPE-LOCATOR-002
- `internal/scope.getByRole.md`: REQ-SCOPE-GETBYROLE-001, REQ-SCOPE-GETBYROLE-002
- `internal/scope.getByText.md`: REQ-SCOPE-GETBYTEXT-001, REQ-SCOPE-GETBYTEXT-002, REQ-SCOPE-GETBYTEXT-003
- `internal/scope.getByLabel.md`: REQ-SCOPE-GETBYLABEL-001, REQ-SCOPE-GETBYLABEL-002
- `internal/locator.filter.md`: REQ-LOCATOR-FILTER-001, REQ-LOCATOR-FILTER-002, REQ-LOCATOR-FILTER-003, REQ-LOCATOR-FILTER-004
- `internal/locator.nth.md`: REQ-LOCATOR-NTH-001, REQ-LOCATOR-NTH-002
- `internal/locator.count.md`: REQ-LOCATOR-COUNT-001, REQ-LOCATOR-COUNT-002
- `internal/locator.textContent.md`: REQ-LOCATOR-TEXTCONTENT-001, REQ-LOCATOR-TEXTCONTENT-002
- `internal/locator.getAttribute.md`: REQ-LOCATOR-GETATTRIBUTE-001, REQ-LOCATOR-GETATTRIBUTE-002
- `internal/locator.inputValue.md`: REQ-LOCATOR-INPUTVALUE-001, REQ-LOCATOR-INPUTVALUE-002
- `internal/locator.isVisible.md`: REQ-LOCATOR-ISVISIBLE-001, REQ-LOCATOR-ISVISIBLE-002
- `internal/locator.isEnabled.md`: REQ-LOCATOR-ISENABLED-001, REQ-LOCATOR-ISENABLED-002
- `internal/locator.isEditable.md`: REQ-LOCATOR-ISEDITABLE-001, REQ-LOCATOR-ISEDITABLE-002
- `internal/locator.isChecked.md`: REQ-LOCATOR-ISCHECKED-001, REQ-LOCATOR-ISCHECKED-002
- `internal/locator.boundingBox.md`: REQ-LOCATOR-BOUNDINGBOX-001, REQ-LOCATOR-BOUNDINGBOX-002
- `internal/locator.click.md`: REQ-LOCATOR-CLICK-001, REQ-LOCATOR-CLICK-002
- `internal/locator.fill.md`: REQ-LOCATOR-FILL-001, REQ-LOCATOR-FILL-002
- `internal/locator.press.md`: REQ-LOCATOR-PRESS-001, REQ-LOCATOR-PRESS-002
- `internal/locator.hover.md`: REQ-LOCATOR-HOVER-001, REQ-LOCATOR-HOVER-002
- `internal/locator.focus.md`: REQ-LOCATOR-FOCUS-001, REQ-LOCATOR-FOCUS-002
- `internal/locator.scrollIntoView.md`: REQ-LOCATOR-SCROLLINTOVIEW-001, REQ-LOCATOR-SCROLLINTOVIEW-002
- `internal/locator.setChecked.md`: REQ-LOCATOR-SETCHECKED-001, REQ-LOCATOR-SETCHECKED-002
- `internal/locator.selectOption.md`: REQ-LOCATOR-SELECTOPTION-001, REQ-LOCATOR-SELECTOPTION-002
- `internal/locator.dragTo.md`: REQ-LOCATOR-DRAGTO-001, REQ-LOCATOR-DRAGTO-002
- `internal/locator.drop.md`: REQ-LOCATOR-DROP-001, REQ-LOCATOR-DROP-002
- `internal/mouse.move.md`: REQ-MOUSE-MOVE-001, REQ-MOUSE-MOVE-002
- `internal/mouse.down.md`: REQ-MOUSE-DOWN-001, REQ-MOUSE-DOWN-002
- `internal/mouse.up.md`: REQ-MOUSE-UP-001, REQ-MOUSE-UP-002
- `internal/mouse.click.md`: REQ-MOUSE-CLICK-001, REQ-MOUSE-CLICK-002
- `internal/mouse.wheel.md`: REQ-MOUSE-WHEEL-001, REQ-MOUSE-WHEEL-002
- `internal/keyboard.down.md`: REQ-KEYBOARD-DOWN-001, REQ-KEYBOARD-DOWN-002
- `internal/keyboard.up.md`: REQ-KEYBOARD-UP-001, REQ-KEYBOARD-UP-002
- `internal/keyboard.press.md`: REQ-KEYBOARD-PRESS-001, REQ-KEYBOARD-PRESS-002
- `internal/keyboard.type.md`: REQ-KEYBOARD-TYPE-001, REQ-KEYBOARD-TYPE-002
- `internal/locator.waitFor.md`: REQ-LOCATOR-WAITFOR-001, REQ-LOCATOR-WAITFOR-002
- `internal/page.waitForEvent.md`: REQ-PAGE-WAITFOREVENT-001, REQ-PAGE-WAITFOREVENT-002, REQ-PAGE-WAITFOREVENT-003
- `internal/page.waitForURL.md`: REQ-PAGE-WAITFORURL-001, REQ-PAGE-WAITFORURL-002
- `internal/page.waitForFunction.md`: REQ-PAGE-WAITFORFUNCTION-001, REQ-PAGE-WAITFORFUNCTION-002
- `internal/page.waitForLoadState.md`: REQ-PAGE-WAITFORLOADSTATE-001, REQ-PAGE-WAITFORLOADSTATE-002
- `internal/locator.setFiles.md`: REQ-LOCATOR-SETFILES-001, REQ-LOCATOR-SETFILES-002, REQ-LOCATOR-SETFILES-003
- `internal/chooser.setFiles.md`: REQ-CHOOSER-SETFILES-001, REQ-CHOOSER-SETFILES-002
- `internal/download.save.md`: REQ-DOWNLOAD-SAVE-001, REQ-DOWNLOAD-SAVE-002
- `internal/download.cancel.md`: REQ-DOWNLOAD-CANCEL-001, REQ-DOWNLOAD-CANCEL-002
- `internal/dialog.accept.md`: REQ-DIALOG-ACCEPT-001, REQ-DIALOG-ACCEPT-002
- `internal/dialog.dismiss.md`: REQ-DIALOG-DISMISS-001, REQ-DIALOG-DISMISS-002
- `internal/scope.evaluate.md`: REQ-SCOPE-EVALUATE-001, REQ-SCOPE-EVALUATE-002
- `internal/locator.evaluateAll.md`: REQ-LOCATOR-EVALUATEALL-001, REQ-LOCATOR-EVALUATEALL-002
- `internal/page.logs.md`: REQ-PAGE-LOGS-001, REQ-PAGE-LOGS-002
- `internal/console.log.md`: REQ-CONSOLE-LOG-001, REQ-CONSOLE-LOG-002
- `internal/display.md`: REQ-DISPLAY-001, REQ-DISPLAY-002
- `common/runtime.md`: REQ-C-RUNTIME-001, REQ-C-RUNTIME-002, REQ-C-RUNTIME-003, REQ-C-RUNTIME-004, REQ-C-RUNTIME-005, REQ-C-RUNTIME-006, REQ-C-RUNTIME-007, REQ-C-RUNTIME-008
- `common/dom-frames.md`: REQ-C-DOMFRAMES-001, REQ-C-DOMFRAMES-002, REQ-C-DOMFRAMES-003, REQ-C-DOMFRAMES-004, REQ-C-DOMFRAMES-005, REQ-C-DOMFRAMES-006
- `common/selection.md`: REQ-C-SELECTION-001, REQ-C-SELECTION-002, REQ-C-SELECTION-003, REQ-C-SELECTION-004, REQ-C-SELECTION-005, REQ-C-SELECTION-006
- `common/input.md`: REQ-C-INPUT-001, REQ-C-INPUT-002, REQ-C-INPUT-003, REQ-C-INPUT-004, REQ-C-INPUT-005
- `common/files-events.md`: REQ-C-FILESEVENTS-001, REQ-C-FILESEVENTS-002, REQ-C-FILESEVENTS-003, REQ-C-FILESEVENTS-004, REQ-C-FILESEVENTS-005, REQ-C-FILESEVENTS-006, REQ-C-FILESEVENTS-007

미독 규범 목록: 없음. 개별 파일 전체 원문과 해시는 raw/requirements-read.json에 보존한다. 일부 대량 읽기 출력은 도구에서 잘렸기 때문에 규범-only 배치로 외부·내부·공통 전부 다시 읽어 보완했다. GWT 전체의 독립 재판정은 이 조사자의 승인 대상이 아니며 다음 통합/독립 리뷰 범위다.

## API별 구체 후보

### guide · REQ-GUIDE-001, REQ-GUIDE-002

- 확인된 부분: 최초 호출 시 안내 자동 출력, 이름 기반 문서 읽기
- 빠진 판정조건: guide api=unknown을 호출해 전체 안내로 조용히 fallback하는 반례
- 구체 반례: guide({api:"typo.api"})가 전체목록을 주면서 성공으로 보이면 명시 미지원 검증이 빠진다.
- 규범·PLAN 보완 후보: 전체/개별 API 요청·알수없는 이름을 분리하고 반환 schema의 catalog 개수·runtime 위치·현행 제약을 assertion으로 적는다
- 증거: CUA-DOC-ENTRY; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### reset · REQ-RESET-001, REQ-RESET-002, REQ-RESET-003

- 확인된 부분: JS bindings 제거, browser tabs/apps/state는 닫거나 지우지 않음
- 빠진 판정조건: 진행중 입력 뒤 reset의 실제 키 release, late hostcall·generation 정책 미확인
- 구체 반례: 입력 X 직후 waiter가 남은 상태를 reset한 뒤 old Promise가 resolve되면 새 요청에 old 결과가 섞일 수 있다.
- 규범·PLAN 보완 후보: 변수 삭제만으로 통과하지 않게 reset 뒤 typeof 변수와 새 실행을 확인하고 wait 취소·late 결과·실제 키 trace를 별도 판정한다
- 증거: CUA-DOC-ENTRY; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### js · REQ-JS-001, REQ-JS-002, REQ-JS-003

- 확인된 부분: persistent JS REPL과 명시 nodeRepl.write 출력; 기본30초
- 빠진 판정조건: 실행 위치가 QuickJS라는 근거 없음; 마지막식/오류분류/120초상한 미확인
- 구체 반례: a=7 선언후 다음 호출의 a 읽기, 마지막표현식 7 단독, console.log(7), throw를 모두 동일 출력성공으로 세면 잘못이다.
- 규범·PLAN 보완 후보: top-level await·동일 변수 후속읽기·다른세션 격리·마지막식/명시출력·syntax/timeout를 독립 조건으로 분해한다
- 증거: CUA-DOC-ENTRY; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### browser.list · REQ-BROWSER-LIST-001, REQ-BROWSER-LIST-002

- 확인된 부분: BrowserInfo의 id/name/family/type/profileName/metadata 공개
- 빠진 판정조건: 연결 안 된 browser를 빈 정상 목록으로 반환하는지 미확인
- 구체 반례: 프로필 A는 연결되고 B는 연결실패했는데 B도 정상 id로 반환하거나 모든실패를 []로 숨기는 경우.
- 규범·PLAN 보완 후보: 연결 프로필2개와 끊긴 어댑터1개를 준비해 id 유일성/오류/새 브라우저 생성0을 판정한다
- 증거: CUA-DOC-ENTRY; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### browser.tabs · REQ-BROWSER-TABS-001, REQ-BROWSER-TABS-002

- 확인된 부분: TabInfo id/browserId/providerTabId/title/url; listing does not claim
- 빠진 판정조건: active/windowId 부재; 방금 닫은 탭의 ID로 getTab시 유사 제목 fallback 미확인
- 구체 반례: 동명 A/B를 목록조회후 A만 닫았는데 attach(A)가 B에 붙는 경우.
- 규범·PLAN 보완 후보: A/B 동명탭을 목록 후 A만 닫고 attach A를 실패로, B URL/소유/포커스 불변으로 판정한다
- 증거: CUA-DOC-ENTRY; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### browser.open · REQ-BROWSER-OPEN-001, REQ-BROWSER-OPEN-002

- 확인된 부분: 새 background about:blank 탭 생성 실제 성공
- 빠진 판정조건: visible와 active는 다름; HTTP(S) 금지scheme·실패 잔여탭 미실측
- 구체 반례: 권한실패 URL을 한 번 요청했는데 탭2개가 생기거나 빈 Page를 성공반환하는 경우.
- 규범·PLAN 보완 후보: active true/false 각각 대상 ID/탭 수 delta1·기존탭 URL불변을 확인하고 실패시 잔여탭 정책을 정한다
- 증거: CUA-DOC-ENTRY, CUA-LIVE-BLANK; 예제 상태 executed-limited-about-blank; mapping syntax may differ: see E-LIVE-01. 전체규범은 미확인.

### browser.attach · REQ-BROWSER-ATTACH-001, REQ-BROWSER-ATTACH-002

- 확인된 부분: ID/mention/URL로 기존 탭 binding; create와 별도
- 빠진 판정조건: 독점 소유·타세션·닫힌탭·debugger attach 미확인
- 구체 반례: 현재문서 nonce=A인 기존탭 attach가 탭을 reload해 nonce=B로 바꾸는 경우.
- 규범·PLAN 보완 후보: 기존 문서의 nonce와 ID가 유지되는지, 다른 세션/닫힌 ID 오류에서 원탭의 내용/소유불변을 검사한다
- 증거: CUA-DOC-ENTRY; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### page.activate · REQ-PAGE-ACTIVATE-001, REQ-PAGE-ACTIVATE-002

- 확인된 부분: IAB visible 생성/브라우저 visibility capability는 별도 존재
- 빠진 판정조건: 특정 tab.activate 공개 메서드 없음; browser visible를 탭활성으로 오인
- 구체 반례: 지정한 A 대신 같은제목 B를 활성화하거나 포커스전환 중 A URL을 reload하는 경우.
- 규범·PLAN 보완 후보: 두 탭을 두고 지정 ID의 active 전환·기존 URL/탭수불변·닫힌핸들 무효를 판정한다
- 증거: CUA-DOC-API; 예제 상태 not-available. 전체규범은 미확인.

### page.close · REQ-PAGE-CLOSE-001, REQ-PAGE-CLOSE-002

- 확인된 부분: close():Promise<void>; 연구탭 close 예외 없음
- 빠진 판정조건: 다른 waiter 종결·키 cleanup·재close 반환 미확인
- 구체 반례: A close후 같은제목 B까지 닫거나, A close waiter를 정상metadata대신 PAGE_CLOSED로 거절하는 경우.
- 규범·PLAN 보완 후보: A/B 동일 제목에서 A close 후 A handle 오류·B 생존·close waiter와 다른 waiter의 서로 다른 terminal을 확인한다
- 증거: CUA-DOC-API, CUA-LIVE-BLANK; 예제 상태 executed-limited-about-blank; mapping syntax may differ: see E-LIVE-01. 전체규범은 미확인.

### page.goto · REQ-PAGE-GOTO-001, REQ-PAGE-GOTO-002

- 확인된 부분: goto(url):Promise<void>; boolean 반환 아님
- 빠진 판정조건: 새 DOM 준비/네트워크 실패/old ref 정리 미확인
- 구체 반례: 네트워크실패 후 이전문서 nonce A를 관찰했으나 B 탐색성공 true로 반환하는 경우.
- 규범·PLAN 보완 후보: 서로 다른 nonce 문서 A→B 전환 시 URL·새 nonce·old ref stale 확인; 실패URL은 새문서 성공과 구분한다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### page.back · REQ-PAGE-BACK-001, REQ-PAGE-BACK-002

- 확인된 부분: back():Promise<void>
- 빠진 판정조건: 이력없음 false 규약은 문서에 없음
- 구체 반례: 이력끝에서 URL불변인데 true를주거나 A→B→C에서 연속back이 이전문서 ref를 새문서 버튼에 연결하는 경우.
- 규범·PLAN 보완 후보: A→B→C에서 뒤로1회 B nonce, 2회 A nonce, 이력끝 false·불변; 동시에 보낸 두호출의 순서정책을 적는다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### page.forward · REQ-PAGE-FORWARD-001, REQ-PAGE-FORWARD-002

- 확인된 부분: forward():Promise<void>
- 빠진 판정조건: 앞이력 삭제/false 규약 미확인
- 구체 반례: A→B→back→C 후 지워진 B URL을 새탭으로 열어 forward 성공처럼 처리하는 경우.
- 규범·PLAN 보완 후보: A→B→back→C에서 forward 결과 false와 C URL·새탭0을 고정 판정한다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### page.reload · REQ-PAGE-RELOAD-001, REQ-PAGE-RELOAD-002

- 확인된 부분: reload():Promise<void>
- 빠진 판정조건: 문서 generation 새값·stale ref 미확인
- 구체 반례: reload후 새문서 동일이름 요소를 reload전 ref로 눌러버리는 경우.
- 규범·PLAN 보완 후보: URL은 유지하되 서버 nonce는 바뀌고 이전 document ref를 유사 새요소로 연결하지 않는지 판정한다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### scope.snapshot · REQ-SCOPE-SNAPSHOT-001, REQ-SCOPE-SNAPSHOT-002, REQ-SCOPE-SNAPSHOT-003, REQ-SCOPE-SNAPSHOT-004, REQ-SCOPE-SNAPSHOT-005, REQ-SCOPE-SNAPSHOT-006, REQ-SCOPE-SNAPSHOT-007, REQ-SCOPE-SNAPSHOT-008, REQ-SCOPE-SNAPSHOT-009, REQ-SCOPE-SNAPSHOT-010, REQ-SCOPE-SNAPSHOT-011

- 확인된 부분: string DOM snapshot, iframe body when available; 과거 tail/selected 관찰
- 빠진 판정조건: root/query/cursor/since/budgets/scrollport/완전성 옵션 미확인
- 구체 반례: 본문끝 목표가 현재 DOM에 있고 출력예산 밖인데 미로드로 표시하거나, 부분diff에서 보이지않은 노드를 삭제로 보고하는 경우.
- 규범·PLAN 보완 후보: 11 REQ별 수집DOM/반환출력/미로드를 분리; static cursor 무중복/무누락, diff 완전성, metadata budget, 키워드 미지 탐색을 각각 판정한다
- 증거: CUA-DOC-API, HIST-CODEX-AUDIT; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### page.screenshot · REQ-PAGE-SCREENSHOT-001, REQ-PAGE-SCREENSHOT-002, REQ-PAGE-SCREENSHOT-003, REQ-PAGE-SCREENSHOT-004

- 확인된 부분: clip/fullPage 옵션, Uint8Array; 과거 JPEG320x240 관찰
- 빠진 판정조건: DPR·scroll origin·fractional·두옵션 배타성 미확인
- 구체 반례: scrollX700/scrollY800에서 clip(10,20,320,240)이 크기는맞지만 document원점의 다른픽셀을 담는 경우.
- 규범·PLAN 보완 후보: 크기 검사와 픽셀위치 검사를 분리하고 x/y scroll×DPR1/2 색상표식·viewport변경 경계를 명시한다
- 증거: CUA-DOC-API, HIST-CODEX-AUDIT; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### page.frames · REQ-PAGE-FRAMES-001, REQ-PAGE-FRAMES-002

- 확인된 부분: snapshot에 iframe body when available; evaluate는 main DOM 읽기
- 빠진 판정조건: DOM iframe 요소 목록은 main/nested/OOPIF process tree와 동등하지 않음
- 구체 반례: sandbox 접근불가 child를 아예목록에서 빼고 모든프레임완전수집이라고 표시하는 경우.
- 규범·PLAN 보완 후보: main/child/sibling/cross-origin·이름중복·로드중·detach를 분리해 parent/id와 접근불가 이유를 판정한다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### page.frame · REQ-PAGE-FRAME-001, REQ-PAGE-FRAME-002

- 확인된 부분: CSS frame selector로 frame builder, 중첩 frameLocator 지원
- 빠진 판정조건: frameId binding·document lifetime·Scope.snapshot/evaluate 없음
- 구체 반례: detach된 frameId를 참조했는데 같은CSS가있는 main frame으로 조용히 대체하는 경우.
- 규범·PLAN 보완 후보: frame ID와 document generation을 구분하고 동명형제 두개 중 지정frame만 입력되는지·detach후 main fallback0을 확인한다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### scope.locator · REQ-SCOPE-LOCATOR-001, REQ-SCOPE-LOCATOR-002

- 확인된 부분: 페이지/frame의 CSS locator builder
- 빠진 판정조건: qualified ref 입력/invalidCSS 시점/stale·Shadow piercing 범위 미확인
- 구체 반례: 삭제된 ref의 요소와 새 요소가 같은이름인데 ref조작이 새요소에 적용되는 경우.
- 규범·PLAN 보완 후보: CSS와 ref를 다른 테스트로 나누고 교체 전ref→동일name 새요소 무입력을 판정한다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### scope.getByRole · REQ-SCOPE-GETBYROLE-001, REQ-SCOPE-GETBYROLE-002

- 확인된 부분: role/name/exact, TextMatcher RegExp; 과거 regex/slot 성공
- 빠진 판정조건: includeHidden 옵션 없음; name 계산 전체·g/y/aria-labelledby 미확인
- 구체 반례: slot으로 이름을얻은 offscreen버튼을 누락하거나 regex /예약/g의 두번째조회 count가0이되는 경우.
- 규범·PLAN 보완 후보: native/explicit role, 이름우선순위·hidden/offscreen·slot·중복 labelledby·반복 regex를 별도 수용조건으로 적는다
- 증거: CUA-DOC-API, HIST-CODEX-AUDIT; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### scope.getByText · REQ-SCOPE-GETBYTEXT-001, REQ-SCOPE-GETBYTEXT-002, REQ-SCOPE-GETBYTEXT-003

- 확인된 부분: TextMatcher와 exact 공개
- 빠진 판정조건: composed 최소요소·인접span·ARIA숨김·CSS숨김·빈문자열/regex+exact 미확인
- 구체 반례: <span>foo</span><span>bar</span>를 foo bar로 붙이거나 aria-label이있는 버튼의 본문말미검색을 막는 경우.
- 규범·PLAN 보완 후보: foobar와 foo bar를 같은문서에서 구분하고 조상/자식 중 최소요소·결과순서/중복없음·1500자말미 매칭을 판정한다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### scope.getByLabel · REQ-SCOPE-GETBYLABEL-001, REQ-SCOPE-GETBYLABEL-002

- 확인된 부분: TextMatcher+exact로 label text 검색
- 빠진 판정조건: for/wrapped/ARIA 모든 경로·다중 strict 미확인
- 구체 반례: 일반 p의 이메일 본문을 label로 간주해 무관한 input을 채우거나 동명label2개중 첫input에 입력하는 경우.
- 규범·PLAN 보완 후보: for/wrap/aria-label/labelledby와 비연결 동일본문을 개별 fixture 조건으로, 중복label 입력0을 판정한다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### locator.filter · REQ-LOCATOR-FILTER-001, REQ-LOCATOR-FILTER-002, REQ-LOCATOR-FILTER-003, REQ-LOCATOR-FILTER-004

- 확인된 부분: has/hasNot/text/negativeText/visible 옵션; 과거 visible 결과2
- 빠진 판정조건: AND·연속호출·인접span·g/y·ARIA/CSS hidden 본문 미확인
- 구체 반례: A(no flag)/B(flag)에서 filter(flag).nth(0)와 nth(0).filter(flag) 순서를 재배열하거나 후속filter가 첫filter를지우는 경우.
- 규범·PLAN 보완 후보: 단일 목적반복 대신 3행A/B/C의 양음AND 결과집합·순서별 차이·원locator불변·미지원키 무입력을 명시한다
- 증거: CUA-DOC-API, HIST-CODEX-AUDIT; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### locator.nth · REQ-LOCATOR-NTH-001, REQ-LOCATOR-NTH-002

- 확인된 부분: number index; 과거 nth(-1) count1
- 빠진 판정조건: 소수/NaN/범위밖/원불변의 오류·정책 미확인
- 구체 반례: 3매칭에서 nth(-1)이0개, nth(0.5)가첫요소로 강제변환되거나 nth(9)조작이마지막요소를누르는 경우.
- 규범·PLAN 보완 후보: 3대상에서 0/2/-1/-3/3/-4/0.5/NaN의 count·오류·원count3을 표로 적는다
- 증거: CUA-DOC-API, HIST-CODEX-AUDIT; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### locator.count · REQ-LOCATOR-COUNT-001, REQ-LOCATOR-COUNT-002

- 확인된 부분: Promise<number>; about:blank button count0 실측
- 빠진 판정조건: stale ref와 0개 구분·중복collapse·순서조합 미확인
- 구체 반례: 동일이름2요소를1개로축약하거나 교체된 ref의 stale을 정상0으로 반환하는 경우.
- 규범·PLAN 보완 후보: 0/1/2 matched 결과 0/1/2와 no input, DOM교체 old ref는 0이 아니라 stale로 별도 판정한다
- 증거: CUA-DOC-API, CUA-LIVE-BLANK; 예제 상태 executed-limited-about-blank; mapping syntax may differ: see E-LIVE-01. 전체규범은 미확인.

### locator.textContent · REQ-LOCATOR-TEXTCONTENT-001, REQ-LOCATOR-TEXTCONTENT-002

- 확인된 부분: raw textContent first matched, string|null
- 빠진 판정조건: 우리 0/다중strict와 문서 first/null 충돌; 긴값 출력 완전성 미확인
- 구체 반례: 2대상 조회에서 첫텍스트를반환하거나 긴값출력이잘렸는데 원래완전값이라고 표시하는 경우.
- 규범·PLAN 보완 후보: API 값과 모델 출력잘림을 구분하고 숨김/공백 원문·0/2매칭 오류를 명시; Codex 차이는 유지한다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### locator.getAttribute · REQ-LOCATOR-GETATTRIBUTE-001, REQ-LOCATOR-GETATTRIBUTE-002

- 확인된 부분: first matched attribute value, string|null
- 빠진 판정조건: 우리 다중strict와 first 설명 충돌; property와 attr·빈값/없음 미실측
- 구체 반례: href=""와 href없음을 모두 null로주거나 초기value attr와 현재value property를같게반환하는 경우.
- 규범·PLAN 보완 후보: href 원문/빈문자열/null의 세결과, input.value property와 attr 차이·2매칭 오류를 판정한다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### locator.inputValue · REQ-LOCATOR-INPUTVALUE-001, REQ-LOCATOR-INPUTVALUE-002

- 확인된 부분: read-only element evaluate는 공개; value 읽기 조합은 추론
- 빠진 판정조건: input/textarea/select/CE 통일값·타입오류 의미 미확인
- 구체 반례: HTML value=A지만 사용자가 B로바꾼 input에서 A를반환하거나 button본문을입력값처럼반환하는 경우.
- 규범·PLAN 보완 후보: 초기attr=A 후 실제값=B를 만들어 B 판정, CE·빈값·button 타입오류를 구분한다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### locator.isVisible · REQ-LOCATOR-ISVISIBLE-001, REQ-LOCATOR-ISVISIBLE-002

- 확인된 부분: first matched visible boolean
- 빠진 판정조건: 우리 strict와 first 설명 차이; offscreen/details/overlay 세부 미확인
- 구체 반례: 화면밖/overlay버튼을hidden으로반환하거나 닫힌details 내부를visible로반환하는 경우.
- 규범·PLAN 보완 후보: 화면밖true·overlaytrue·displaynonefalse·닫힌details 자식false·0/2오류 표를 명시한다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### locator.isEnabled · REQ-LOCATOR-ISENABLED-001, REQ-LOCATOR-ISENABLED-002

- 확인된 부분: first matched enabled boolean
- 빠진 판정조건: fieldset legend/ARIA 상속·readonly 차이 미확인
- 구체 반례: disabled fieldset의 첫legend 제어와 다른자식제어를 모두false로두거나 readonly를disabled로오인하는 경우.
- 규범·PLAN 보완 후보: disabled fieldset내 첫legend 예외와 다른자식, readonly enabled true·disabled/aria-disabled 각각을 명시한다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### locator.isEditable · REQ-LOCATOR-ISEDITABLE-001, REQ-LOCATOR-ISEDITABLE-002

- 확인된 부분: read-only state 수집 가능 서명; editable 판정은 우리 조합
- 빠진 판정조건: aria-readonly·상속·허용type·fill 일관성 미확인
- 구체 반례: checkbox나 aria-readonly contenteditable을true라하면서 fill은항상실패하는 경우.
- 규범·PLAN 보완 후보: text/textarea/CE true와 button/checkbox/disabled/readonly/aria-readonly false 표를 결정하고 fill과 같은 공통함수 근거를 적는다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### locator.isChecked · REQ-LOCATOR-ISCHECKED-001, REQ-LOCATOR-ISCHECKED-002

- 확인된 부분: native/ARIA 원상태 read-only 수집 조합 가능
- 빠진 판정조건: mixed boolean 정책·지원role·타입오류 미확인
- 구체 반례: aria-checked="mixed"를 true로반환하거나 일반button의 checked없음을false성공으로숨기는 경우.
- 규범·PLAN 보완 후보: checkbox/radio/switch/mixed/비체크type별 값을 적고 mixed 원문 getAttribute 경로와 Boolean 반환을 구분한다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### locator.boundingBox · REQ-LOCATOR-BOUNDINGBOX-001, REQ-LOCATOR-BOUNDINGBOX-002

- 확인된 부분: DOM rect 읽기는 공개 evaluate 조합; frame내 rect는 local
- 빠진 판정조건: 메인viewport 변환·hidden null·OOPIF·unsupported transform 미확인
- 구체 반례: scale iframe내local rect를그대로mainviewport좌표로반환해 클릭이형제영역을맞히는 경우.
- 규범·PLAN 보완 후보: local rect를 main 값으로 오인하지 않게 frame border/scale/scroll을 표시한 marker와 입력 hit를 비교한다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### locator.click · REQ-LOCATOR-CLICK-001, REQ-LOCATOR-CLICK-002

- 확인된 부분: button/force/modifiers/timeoutMs, dblclick 별도; 과거 slot/scale 클릭
- 빠진 판정조건: clickCount옵션 없음; overlay/actionability/partial cleanup 모두 미확인
- 구체 반례: overlay가덮인버튼 클릭이 overlay업무를실행하거나 clickCount2인데 click1개만전송하고성공하는 경우.
- 규범·PLAN 보완 후보: 1/2 clickCount별 실제 click/dblclick trace, overlay/stale/다중0입력·scale frame 올바른대상만을 판정한다
- 증거: CUA-DOC-API, HIST-CODEX-AUDIT; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### locator.fill · REQ-LOCATOR-FILL-001, REQ-LOCATOR-FILL-002

- 확인된 부분: fill(value:string,{timeoutMs?}):void; 과거 readonly 거절
- 빠진 판정조건: mask/rerender 결과 재검증·CE·empty·disabled 전체 미확인
- 구체 반례: mask handler가 요청값123을12로되돌렸는데 completed를반환하는 경우.
- 규범·PLAN 보완 후보: LOCKED 불변 거절, empty 성공, mask가 값되돌린 후 실패·실제최종값·부분focus효과를 판정한다
- 증거: CUA-DOC-API, HIST-CODEX-AUDIT; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### locator.press · REQ-LOCATOR-PRESS-001, REQ-LOCATOR-PRESS-002

- 확인된 부분: locator focus후 key press 공개
- 빠진 판정조건: focus 검증·실패전무입력·기존modifier 보존 미확인
- 구체 반례: B가focus불가능한데 이전focus A에Enter를보내거나 기존Control down을사전실패후풀어버리는 경우.
- 규범·PLAN 보완 후보: A포커스 상태에서 B press는 B trace만; B focus실패면 A키0·기존Control down보존을 판정한다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### locator.hover · REQ-LOCATOR-HOVER-001, REQ-LOCATOR-HOVER-002

- 확인된 부분: native Target에는 coordinate actions가 있으나 DOM-only 입력은 throw
- 빠진 판정조건: IAB locator hover 없음; DOM event dispatch 우회는 read-only 평가로 금지
- 구체 반례: overlay로가려진A의중앙으로이동해B에mouseover가났는데A hover성공으로표시하는 경우.
- 규범·PLAN 보완 후보: hit영역 marker에서 mouseover 발생과 overlay/unsupported frame에서 무입력오류를 적는다
- 증거: CUA-DOC-API; 예제 상태 not-available. 전체규범은 미확인.

### locator.focus · REQ-LOCATOR-FOCUS-001, REQ-LOCATOR-FOCUS-002

- 확인된 부분: locator.press는 focus를 수반하지만 focus-only 계약은 없음
- 빠진 판정조건: press로 focus만 대체하면 키 부작용; evaluate focus는 read-only 위반
- 구체 반례: focus()가예외없이끝났으나 activeElement는body인데성공으로표시하는 경우.
- 규범·PLAN 보완 후보: 비focusable div와 실제input을 분리해 composed activeElement가 목표인지, focus호출만 성공으로 세지 않게 한다
- 증거: CUA-DOC-API; 예제 상태 not-available. 전체규범은 미확인.

### locator.scrollIntoView · REQ-LOCATOR-SCROLLINTOVIEW-001, REQ-LOCATOR-SCROLLINTOVIEW-002

- 확인된 부분: native Target.scroll은 DOM-only throw, IAB locator scrollIntoView 없음
- 빠진 판정조건: click의 자동스크롤을 단독노출 API와 동등 취급 불가
- 구체 반례: 가로스크롤은그대로라목표가숨겨져있거나 DOM에없는virtual row를관찰로생성해성공하는 경우.
- 규범·PLAN 보완 후보: 중첩 가로/세로 scrollport에 목표 rect가 노출되는지, virtual 미존재·sticky 가림과 분리해 판정한다
- 증거: CUA-DOC-API; 예제 상태 not-available. 전체규범은 미확인.

### locator.setChecked · REQ-LOCATOR-SETCHECKED-001, REQ-LOCATOR-SETCHECKED-002

- 확인된 부분: boolean, force/timeoutMs, check/uncheck도 공개
- 빠진 판정조건: 이미상태일때 클릭0·되돌림실패·ARIA role범위 미확인
- 구체 반례: 이미true인checkbox에클릭해false로바꾸거나 handler되돌림후성공하는 경우.
- 규범·PLAN 보완 후보: 이미true event0, false→true 실제상태, 핸들러되돌림 실패, disabled/타입오류와 기존상태불변을 명시한다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### locator.selectOption · REQ-LOCATOR-SELECTOPTION-001, REQ-LOCATOR-SELECTOPTION-002

- 확인된 부분: string/descriptor/array, descriptor index/label/value; 반환void
- 빠진 판정조건: 우리 string[] 결과/value우선label fallback/사전전체검증 미확인
- 구체 반례: 현재선택A에서 요청[B,없는C]를순차적용해B만남기고사전오류라고주장하는 경우.
- 규범·PLAN 보완 후보: 여러요청 마지막invalid시 기존선택보존·label중복·disabled·single복수 정책과 실제 selectedValues를 판정한다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### locator.dragTo · REQ-LOCATOR-DRAGTO-001, REQ-LOCATOR-DRAGTO-002

- 확인된 부분: native Target.drag(from,to)는 있으나 DOM-only wrapper throw
- 빠진 판정조건: IAB locator dragTo/native DragData 미확인; 과거 Codex DnD 미측정
- 구체 반례: 같은process의다른frame document로drag를허용하거나 partial실패뒤drop을재전송해업무2회가되는 경우.
- 규범·PLAN 보완 후보: HTML dragstart trusted/DataTransfer/업무1회와 pointer grid 선택을 분리; samePage/frame/target 경계와 버튼cleanup을 판정한다
- 증거: CUA-DOC-API; 예제 상태 not-available. 전체규범은 미확인.

### locator.drop · REQ-LOCATOR-DROP-001, REQ-LOCATOR-DROP-002

- 확인된 부분: chooser 업로드는 공개지만 drop/files+MIME 대체 근거 아님
- 빠진 판정조건: IAB locator.drop 없음; read-only evaluate로 synthetic drop 우회 불가
- 구체 반례: 파일2개중마지막invalid인데첫파일drop을먼저발생시키거나 임시file input이남는 경우.
- 규범·PLAN 보완 후보: 파일바이트hash+텍스트MIME을 검증하고 invalid last file은 drop0·임시input0, trusted필수 사이트 보장제외를 적는다
- 증거: CUA-DOC-API; 예제 상태 not-available. 전체규범은 미확인.

### mouse.move · REQ-MOUSE-MOVE-001, REQ-MOUSE-MOVE-002

- 확인된 부분: native Target.drag/scroll은 존재, move primitive는 열거안됨
- 빠진 판정조건: IAB page.mouse 없음; native좌표입력/DOM-only 경계를 넘기지 않음
- 구체 반례: NaN을0으로강제변환해좌상단에pointermove를발생시키는 경우.
- 규범·PLAN 보완 후보: finite 좌표에서 pointermove marker, NaN/Infinity event0·main viewport 좌표를 명시한다
- 증거: CUA-DOC-API; 예제 상태 not-available. 전체규범은 미확인.

### mouse.down · REQ-MOUSE-DOWN-001, REQ-MOUSE-DOWN-002

- 확인된 부분: click/drag는 atomic native 메서드; 개별down 공개안됨
- 빠진 판정조건: down→move→up 지속상태 조합 미확인
- 구체 반례: left down이후 move의buttons=0이라격자선택이끊기거나 다른세션down을덮는 경우.
- 규범·PLAN 보완 후보: leftdown→move→up의 buttons trace와 충돌/invalid 사전0·타세션 상태불변을 판정한다
- 증거: CUA-DOC-API; 예제 상태 not-available. 전체규범은 미확인.

### mouse.up · REQ-MOUSE-UP-001, REQ-MOUSE-UP-002

- 확인된 부분: 개별up 공개안됨
- 빠진 판정조건: release/reset/close 실제상태 확인 불가
- 구체 반례: left up을두번보내새click이추가되거나 reset뒤실제버튼이여전히눌려있는 경우.
- 규범·PLAN 보완 후보: 반복up이 click을 새로 만들지 않는지, reset release실패를 잔류/불확실로 드러내는지 검사한다
- 증거: CUA-DOC-API; 예제 상태 not-available. 전체규범은 미확인.

### mouse.click · REQ-MOUSE-CLICK-001, REQ-MOUSE-CLICK-002

- 확인된 부분: native click(Vec2/options) 계약; DOM-only tabs에서는 입력전 throw
- 빠진 판정조건: IAB native 사용가능성을 미실측; down/up/실패release 경계 미확인
- 구체 반례: down후up오류에서release시도없이끝나후속이동이드래그가되는 경우.
- 규범·PLAN 보완 후보: 고정좌표 marker A/B중 A만 hit·중도실패 release시도와 좌표자동보정0을 판정한다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### mouse.wheel · REQ-MOUSE-WHEEL-001, REQ-MOUSE-WHEEL-002

- 확인된 부분: native scroll target/direction/pages 계약, raw deltaX/Y 아님
- 빠진 판정조건: DOM-only throw; axis deltas·pointer별 routing 미확인
- 구체 반례: 내부iframe위pointer인데바깥문서만스크롤하거나 preventDefault의0이동을새데이터로딩성공이라하는 경우.
- 규범·PLAN 보완 후보: 내부iframe와 외부scroll container를 나눠 실제 wheel target/offset, preventDefault 이동0을 판정한다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### keyboard.down · REQ-KEYBOARD-DOWN-001, REQ-KEYBOARD-DOWN-002

- 확인된 부분: native pressKey/locator press는 atomic; 개별down 열거안됨
- 빠진 판정조건: 지속modifier/세션소유를 조합할 근거 없음
- 구체 반례: Control down후 type이modifier를잊거나 unknown key가부분keydown을전송하는 경우.
- 규범·PLAN 보완 후보: Control down→type/press→up 실제 trace와 invalid키 사전0·타세션 modifier불변을 적는다
- 증거: CUA-DOC-API; 예제 상태 not-available. 전체규범은 미확인.

### keyboard.up · REQ-KEYBOARD-UP-001, REQ-KEYBOARD-UP-002

- 확인된 부분: 개별key up 열거안됨
- 빠진 판정조건: 원하는키만 release·실패 후 실제잔류 미확인
- 구체 반례: Control+Shift중Control만up요청했는데Shift까지풀거나 release실패를정상초기화로숨기는 경우.
- 규범·PLAN 보완 후보: Control+Shift 유지중 Control up시 Shift보존, close/reset release실패의 불확실 상태를 판정한다
- 증거: CUA-DOC-API; 예제 상태 not-available. 전체규범은 미확인.

### keyboard.press · REQ-KEYBOARD-PRESS-001, REQ-KEYBOARD-PRESS-002

- 확인된 부분: locator.press는 focus대상 지정; native tab.pressKey는 DOM-only throw
- 빠진 판정조건: 현재 focus 유지키와 독립modifier 소유는 미확인
- 구체 반례: 기존Control down중Shift+A를보낸뒤Control까지해제해후속조합이달라지는 경우.
- 규범·PLAN 보완 후보: 기존Control down와 새Shift 조합을 분리해 호출이획득한키만 release하고 invalid조합은 입력0을 판정한다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### keyboard.type · REQ-KEYBOARD-TYPE-001, REQ-KEYBOARD-TYPE-002

- 확인된 부분: 기존내용을 지우지않는 type, pressSequentially 문자별 입력 공개
- 빠진 판정조건: 현재focus primitive와 차이, CE/newline/Unicode/failedfocus 미확인
- 구체 반례: 한글🙂선택영역입력에서surrogate가깨지거나 readonly포커스에값변경성공을반환하는 경우.
- 규범·PLAN 보완 후보: 선택영역 한글/이모지·여러줄 후 value/caret·keydown보장범위를 명시하고 비편집focus에서 거짓성공을 거절한다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### locator.waitFor · REQ-LOCATOR-WAITFOR-001, REQ-LOCATOR-WAITFOR-002

- 확인된 부분: attached/detached/visible/hidden과 timeoutMs; Promise<void>
- 빠진 판정조건: 우리 0/1/N 표·stale ref 예외·기본visible 미확인
- 구체 반례: hidden에서2매칭을성공으로흡수하거나 stale ref를detached상태충족으로처리하는 경우.
- 규범·PLAN 보완 후보: 4상태×0/1/N 조합과 hidden/visible N즉시다중·stale 별도·invalidstate/timeout 사전오류를 표로 판정한다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### page.waitForEvent · REQ-PAGE-WAITFOREVENT-001, REQ-PAGE-WAITFOREVENT-002, REQ-PAGE-WAITFOREVENT-003

- 확인된 부분: download/filechooser overload, 호출을 조작전에 등록하라고 문서안내
- 빠진 판정조건: popup/dialog/close 없음; arming barrier·동시소비·timeout/close/reset 경합 미확인
- 구체 반례: browser등록지연중click이먼저실행되어동기chooser를놓치거나 timeout뒤latechooser가다음wait에전달되는 경우.
- 규범·PLAN 보완 후보: 서버 지연0 이벤트·wait등록지연·timeout동시발생·같은이벤트두wait·다른page를 분리해 단일terminal/late누수0을 판정한다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### page.waitForURL · REQ-PAGE-WAITFORURL-001, REQ-PAGE-WAITFORURL-002

- 확인된 부분: string URL와 timeoutMs/waitUntil; 반환void
- 빠진 판정조건: 문자열 exact/glob 해석·현재즉시·RegExp거절 미확인
- 구체 반례: 요청문자열의 *를glob으로해석해다른URL에서성공하거나현재일치임에도deadline까지기다리는 경우.
- 규범·PLAN 보완 후보: 현재일치즉시·변경후일치·비슷한URL/fragment/encoding 구분·glob/regex 명시오류를 판정한다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### page.waitForFunction · REQ-PAGE-WAITFORFUNCTION-001, REQ-PAGE-WAITFORFUNCTION-002

- 확인된 부분: evaluate Promise 타입은 공개; built-in waitForFunction 없음
- 빠진 판정조건: thenable settled truthiness·poll간격·context교체·부작용 함수 미확인
- 구체 반례: async()=>false의Promise객체를truthy로즉시성공하거나 never-settle함수를중복polling하는 경우.
- 규범·PLAN 보완 후보: resolve(false) 반복·resolve(7) 종료·reject 즉시·never-settle deadline, 중복호출0과 late결과 차단을 명시한다
- 증거: CUA-DOC-API; 예제 상태 pseudocode. 전체규범은 미확인.

### page.waitForLoadState · REQ-PAGE-WAITFORLOADSTATE-001, REQ-PAGE-WAITFORLOADSTATE-002

- 확인된 부분: load/domcontentloaded/networkidle 공개, 반환void
- 빠진 판정조건: interactive 지원없음; 우리 readyState반환/networkidle거절과 다름
- 구체 반례: document complete를SPA예약저장완료와같게판정하거나 미지원networkidle을무한대기하는 경우.
- 규범·PLAN 보완 후보: loading/interactive/complete 표를정의하고 SPA업무완료 신호는 별도로, networkidle은 우리 정책대로 거절한다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### locator.setFiles · REQ-LOCATOR-SETFILES-001, REQ-LOCATOR-SETFILES-002, REQ-LOCATOR-SETFILES-003

- 확인된 부분: 공개 업로드는 chooser흐름; locator.setInputFiles 찾지말라고 안내
- 빠진 판정조건: fileId/bytes/base64·32MiB·empty[]·existing input보존 미확인
- 구체 반례: 같은이름local/asset의서로다른bytes를섞거나[valid,invalid]중valid만먼저선택하는 경우.
- 규범·PLAN 보완 후보: 동명이명바이트 local/asset/inline hash와 이름/MIME, []제거, single/multiple·잘못된마지막파일 사전보존을 명시한다
- 증거: CUA-DOC-API, CUA-DOC-UPLOAD; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### chooser.setFiles · REQ-CHOOSER-SETFILES-001, REQ-CHOOSER-SETFILES-002

- 확인된 부분: browser-visible absolute path string|string[], chooser.isMultiple
- 빠진 판정조건: OOPIF·stale/consumed·타세션·inline/server source 미확인
- 구체 반례: 이미소비한chooser핸들이나중새input에파일을넣거나OOPIFchooser대신maininput에넣는 경우.
- 규범·PLAN 보완 후보: 기본/중첩/OOPIF 실제input별 bytes 검사, 소비핸들재사용은 새chooser 무영향·오류를 판정한다
- 증거: CUA-DOC-API, CUA-DOC-UPLOAD; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### download.save · REQ-DOWNLOAD-SAVE-001, REQ-DOWNLOAD-SAVE-002

- 확인된 부분: download event 완료 후 local path string|null
- 빠진 판정조건: save destination/server/local·POST/blob hash·동시idempotency·30초 미확인
- 구체 반례: 인증POST결과대신GET재요청을저장하거나 같은download동시save2개가asset2개를만드는 경우.
- 규범·PLAN 보완 후보: POST/blob/쿠키 원다운로드 hash와 local/server동일바이트·동명다른id·반복동시save 하나자산을 판정한다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### download.cancel · REQ-DOWNLOAD-CANCEL-001, REQ-DOWNLOAD-CANCEL-002

- 확인된 부분: Download 공개서명은 path만
- 빠진 판정조건: cancel/최종중단상태 조회 없음; null path를 cancelled로 해석 불가
- 구체 반례: cancel요청전송만으로cancelled를반환하거나 이미complete인데USER_CANCELED로꾸미는 경우.
- 규범·PLAN 보완 후보: 진행/완료/USER_CANCELED/다른interrupted/경합별 최종상태와 10초 deadline·권한오류를 명시한다
- 증거: CUA-DOC-API; 예제 상태 not-available. 전체규범은 미확인.

### dialog.accept · REQ-DIALOG-ACCEPT-001, REQ-DIALOG-ACCEPT-002

- 확인된 부분: prompt accept(text), confirm accept(); alert/beforeunload accept 없음
- 빠진 판정조건: event handle identity/stale/once·기본prompt빈문자열 미확인
- 구체 반례: prompt1처리뒤prompt2가열렸을때oldhandle.accept가prompt2를처리하는 경우.
- 규범·PLAN 보완 후보: prompt/confirm 각각 최종값/횟수1과 oldhandle→newdialog 무영향을 검사; 지원 dialog별 accept방법을 확정한다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### dialog.dismiss · REQ-DIALOG-DISMISS-001, REQ-DIALOG-DISMISS-002

- 확인된 부분: alert/beforeunload/confirm/prompt 모두 dismiss 공개
- 빠진 판정조건: 현재dialog 교체·다른page·stale/once 미확인
- 구체 반례: dismiss완료된confirm핸들을다시써나중새prompt를닫아버리는 경우.
- 규범·PLAN 보완 후보: oldprompt처리 후 newconfirm이열린 상태에서 oldhandle 재dismiss 오류·newdialog존재/취소결과를 판정한다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### scope.evaluate · REQ-SCOPE-EVALUATE-001, REQ-SCOPE-EVALUATE-002

- 확인된 부분: read-only page/element evaluate, function|string, optional arg/options, Promise 반환타입
- 빠진 판정조건: 우리 mutation가능Scope/framecontext·thenable/JSON/undefined 정책과 다름
- 구체 반례: Promise.resolve(undefined)를null성공으로바꾸거나 선택frame대신main document에서평가하는 경우.
- 규범·PLAN 보완 후보: page fn(arg)와 locator fn(el,arg) 구분·async truth/false/reject·nonJSON·부분효과를 독립조건으로, Codex read-only 예제로 mutation을 제안하지 않는다
- 증거: CUA-DOC-API, CUA-LIVE-BLANK; 예제 상태 executed-limited-about-blank; mapping syntax may differ: see E-LIVE-01. 전체규범은 미확인.

### locator.evaluateAll · REQ-LOCATOR-EVALUATEALL-001, REQ-LOCATOR-EVALUATEALL-002

- 확인된 부분: read-only matched element array, optional arg/options Promise 타입
- 빠진 판정조건: 0배열1회·composed순서·crossframe·직렬화/thenable 정책 미확인
- 구체 반례: 0매칭일때fn을호출하지않거나 async배열결과를settle하지않고Promise객체로반환하는 경우.
- 규범·PLAN 보완 후보: 0/1/2개 배열의 호출횟수1·순서·arg 전달 및 Promise/JSON 경계를 공통008과 연결한다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### page.logs · REQ-PAGE-LOGS-001, REQ-PAGE-LOGS-002

- 확인된 부분: levels/filter substring/limit; ISO timestamp,message,url 배열
- 빠진 판정조건: since·1000개·collection range/dropped/partial 없음
- 구체 반례: attach전기간이포함된since조회에서[]를완전한무로그로표시하거나1002로그중2개유실을숨기는 경우.
- 규범·PLAN 보완 후보: attach이전+1002개+동시각에서 at>since/level정확일치·필터전보관범위·무수집partial을 따로 판정한다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

### console.log · REQ-CONSOLE-LOG-001, REQ-CONSOLE-LOG-002

- 확인된 부분: 명시텍스트출력 API는 nodeRepl.write; 빈탭 probe 출력실측
- 빠진 판정조건: console.log 별칭/순환/예산/truncated·세션격리 미확인
- 구체 반례: 마지막식만있는호출을명시출력처럼보내거나 순환로그가다음세션출력을손상시키는 경우.
- 규범·PLAN 보완 후보: 마지막식단독/명시2개출력/페이지console을구분하고 UTF8경계·순환/블록넘침의 진단·다음요청깨끗함을 확인한다
- 증거: CUA-DOC-API, CUA-LIVE-BLANK; 예제 상태 executed-limited-about-blank; mapping syntax may differ: see E-LIVE-01. 전체규범은 미확인.

### display · REQ-DISPLAY-001, REQ-DISPLAY-002

- 확인된 부분: data/file URL, PNG/JPEG/WebP bytes, {bytes,mimeType} 허용
- 빠진 판정조건: 우리 PNG envelope·4/8MiB·최대4장·256블록·invalid/overflow계속실행 미확인
- 구체 반례: 초과이미지base64일부만전송하거나 before/display/after에서한도초과후after로그까지이유없이잃는 경우.
- 규범·PLAN 보완 후보: valid/invalid/초과 이미지를 before→image→after 로그와함께 검사해 format오류/전체생략/계속실행을 구분한다
- 증거: CUA-DOC-API; 예제 상태 syntax-confirmed-not-executed. 전체규범은 미확인.

## 공통 조건 후보

### common.runtime

- 확인된 부분: persistent CUA REPL·reset bindings와 명시출력 계약
- 미확인 조건: QuickJS 확장내 실행·requestId dedupe·예산·session소유·late hostcall·release 전부 별도 미확인
- 구체 반례: 같은 requestId 다른 payload가 두번입력되거나 reset뒤 late결과가 새요청에 섞이는 경우
- 보완 후보: 우리 3도구/QuickJS/예산은 독립 사용자설계로 유지; Promise settle/undefined 직렬화·부분효과·원자rollback없음을 PLAN에서 구분

### common.dom-frames

- 확인된 부분: iframe body when available, frameLocator 중첩; 과거 scale/slot 일부
- 미확인 조건: 모든 offscreen DOM·무스크롤·request0·nested/OOPIF·stale·openShadow·unsupported transform 거절 미확인
- 구체 반례: main/child/형제에 같은이름 버튼, iframe navigation 뒤 oldref 또는 scaled rect local좌표를 main에 쓰는 경우
- 보완 후보: 관찰 무부작용과 명시입력 스크롤을 구분; DOM 미존재/출력생략/접근불가frame 이유와 독립scope를 판정

### common.selection

- 확인된 부분: 문서상 선택/필터/RegExp/exact 조합; 과거 regex/visible/nth(-1)/slot 일부
- 미확인 조건: 우리 refidentity·composed본문·mintext·case·g/y·불변·조합순서·0/N strict 미확인
- 구체 반례: getAttribute/textContent 등 first matched 설명을 모든단일strict라고 쓰는 경우
- 보완 후보: Codex first/null 설명과 우리의 strict 정책을 의도된차이로 보존하고 각 query의 결과집합·순서·오류·무입력을 명시

### common.input

- 확인된 부분: 공개 semantic input와 과거 readonly거절·slot/scale클릭
- 미확인 조건: down/up ownership·actualrelease·hit/actionability·post-state재확인·no-blind-retry 미확인
- 구체 반례: 기존Control down 상태에서 focus실패 후 Control이 풀리거나 mask가 value되돌렸는데 성공하는 경우
- 보완 후보: 사전거절0입력/중도부분효과/새로획득한키만cleanup/reset전체release를 구분; 업무성공은 별도증거

### common.files-events

- 확인된 부분: wait before action 권장; chooser 절대경로·download완료/path
- 미확인 조건: inline/asset/32MiB·source형식·cleanup·POST/blob byte보존·cancel·eventarming/terminal경합 미확인
- 구체 반례: wait 호출 반환이 빨라도 browser등록전 click이 먼저가거나 두 dialog중 oldhandle이 두번째를 처리하는 경우
- 보완 후보: source별 파일hash/메타데이터와 invalid마지막항목 보존을명시; event 등록barrier·소비정책·late누수0을 독립 판정

## 증거 범위와 계수

- 읽은 문서72/REQ184, 매핑 API67+공통5. 관계 분포: {'composition': 16, 'direct': 37, 'unknown': 14}.
- 신규 LIVE는 about:blank 1 run뿐이며 fixture 신규실측0. 첫 진입 도구 응답의 공개 계약을 읽은 것은 DOC, 빈DOM count/evaluate는 LIVE, 기존audit 결과는 HISTORICAL로 구분한다.
- HIST-CODEX-AUDIT 고유 원자료는 진단JSON의 codex object와 설명문서다. 동일 관측을 여러 API/REQ에 연결해도 실측횟수 증가로 세지 않는다.
- 184개 REQ 전체충족 확인0으로 두었다. 이 숫자는 전부실패/미지원0 또는184를 의미하지 않으며 세부 조건분모를 아직 고정하지 않았으므로 확인률/실측률을 계산하지 않는다.
- 현재확인된 것은 공개문서의 부분 API 계약과 과거 일부fixture 관측이다. 이번 조사에서 에러/입력·file/event·nested/OOPIF를 실행하지 않았다.
- 정본/제품/fixture/테스트/빌드 변경0, 원격게시0. 생성 파일은 ignored .local/reference-loop-execution/codex/ 안뿐이다.

## 다음 사이클

메인이 이 결과와 Aside 결과를 통합한 고정 SHA를 지정한 후, 조합·실패/복구·중복 API 대안과 서로 다른 정책의 근거를 교차검토한다. 이 보고서를 전체3회 완료로 세지 않는다.
