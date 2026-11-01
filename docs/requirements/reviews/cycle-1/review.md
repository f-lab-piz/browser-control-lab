# 요구사항 독립 검토 1회차

검토일: 2026-11-01. 관점: 전체 API 기본 계약, 입력/출력, 거절, 부작용, 공통 조건의 일관성.

- 제품 baseline: `700a6a06af3f97729327afaf9becb4ee29bb475b`
- 검토 문서 head: `6561d2227c8c0bbc34f6dd902428d35e38a79dcd`
- 시작 시 `git rev-parse HEAD` 일치, `git status --short` 빈 결과로 clean 확인.
- AGENTS.md, 프로젝트 SKILL.md, references/requirements-review.md, pr-review.md 적용. 이 보고서만 ignored `.local/`에 작성한다. 제품/테스트/규범 원본 수정, 경쟁 제품 실행, 원격 게시/승인/병합, 하위 에이전트 생성은 하지 않았다.
- 판정: **CHANGES_REQUESTED (개발 전 명세)**. 아래는 메인이 판단할 명세 후보이며 제품 실패 재현 목록이 아니다. 제품 적합성은 **미검증**이다.

## 발견 후보

### R1-01 · P1 · 단일대상 공통 규칙과 waitFor의 부재 성공 조건 충돌

- 위치/REQ: `docs/requirements/common/selection.md:8` REQ-C-SELECTION-001; `internal/locator.waitFor.md:22` REQ-LOCATOR-WAITFOR-001, 같은 파일:33 REQ-LOCATOR-WAITFOR-002.
- 근거: 공통 규칙은 count/evaluateAll만 예외로 두고 단일 조회의 0/다중 매칭을 거절한다. waitFor는 selection을 필수 상속하면서 detached=0개, hidden=0개 또는 숨김으로 정의한다. attached는 단순 매칭 존재로 정의되어 여러 개의 처리도 공통 strict와 갈린다.
- 구체 반례: CSS `#toast`가 이미 없을 때 `await locator.waitFor({state:'hidden'})`와 `{state:'detached'}`는 개별 규범대로 즉시 true여야 하지만 공통 규범대로는 대상 없음 오류여야 한다. `attached`에서 2개 일치할 때도 결과가 미확정이다.
- 사용자 영향: 부재를 기다리는 기본 업무에서 구현/테스트가 상반된 결과를 모두 정당화할 수 있다.
- 목표 규범 수정안: 공통 규칙에 상태 대기의 명시 예외를 추가한다. CSS 기반 attached/detached/hidden/visible별 0/1/N 정책을 표로 고정하고, 발급 ref의 stale는 CSS의 현재 0개와 분리한다. 예: attached는 하나 이상, detached는 0, hidden은 0 또는 단일 hidden, visible은 단일 visible; N 정책은 메인이 선택한다.
- 검증 제안: 각 state × 0/1/N, 단일 hidden/visible, CSS 제거/재삽입, ref detach/navigation을 독립 케이스로 설계한다. 무스크롤과 오류 구분도 판독한다.
- 증거 등급: 명세 간 직접 충돌. 제품 실행 없음. 제품 기존 구현과 다르기 때문에 제기한 항목이 아니다.

### R1-02 · P2 · getByText의 후보 요소 집합이 없어 기본 검색의 단일성 판단 불가

- 위치/REQ: `internal/scope.getByText.md:22,33` REQ-SCOPE-GETBYTEXT-001/002; `common/selection.md:41,52` REQ-C-SELECTION-004/005.
- 근거: 본문 구성/정규화/ARIA 제외는 자세하지만, 그 본문이 같은 조상과 자식 중 어떤 요소를 Locator 후보로 남기는지는 정의하지 않았다. getByText는 엄격한 조작과 결합하는 공개 기본 선택 API다.
- 구체 반례: `<div><button><span>확인</span></button></div>`에서 exact 텍스트가 span/button/div/body에 함께 존재한다. 구현 A는 모두 반환하여 click을 다중 오류로 만들고, B는 최하위 span만, C는 button만 반환한다. 모두 현재 본문 규범을 만족한다. `<div>확인<span>확인</span></div>`에서 exact와 부분일치의 조상 제거도 달라진다.
- 사용자 영향: 같은 문서에서 기본 텍스트 탐색의 count/nth/click 의미가 결정되지 않는다.
- 목표 규범 수정안: 텍스트 후보 생성과 조상/자식 동시 매칭의 규칙을 명시한다. 최소 일치 요소 정책 등을 선택하되 button/label/slot, 직접 텍스트와 자식 텍스트 혼합, 문서순서와 중복제거를 함께 고정한다. 기존 코드의 휴리스틱을 자동 수용하자는 뜻은 아니다.
- 검증 제안: 위 두 DOM과 slot, nested text, 동일 문자열 두 형제 버튼에서 count/반환 대상 identity/실제 click 대상과 중복 거절을 판독한다.
- 증거 등급: 목표 계약 누락을 보이는 논리 반례. 경쟁 가이드/현재 코드의 동등성 주장 없음.

### R1-03 · P2 · snapshot의 기본 옵션과 예산 단위/경계 미정

- 위치/REQ: `internal/scope.snapshot.md:10-11,33,70,81` REQ-SCOPE-SNAPSHOT-002/005/006/007.
- 근거: 선택적 root/interactive/showHidden/query/maxDepth/maxChars/maxNodes/maxOutputBytes/cursor/since를 열거했으나 기본값과 여러 예산 동시 적용의 판정은 목표 규범에 없다. 공통 runtime 출력 예산과 snapshot 예산의 층위도 분리되지 않았다.
- 구체 반례: 1만 링크/긴 한국어 본문에서 `snapshot()` 호출 시 interactive 기본 true/false, maxDepth/maxNodes의 무제한/유한 선택에 따라 포함 범위가 달라진다. `{maxChars:0,maxOutputBytes:100}` 또는 `{maxNodes:-1}`의 유효성/결과가 미정이다. text는 예산 안이지만 frames/refs/metrics를 합친 응답은 초과할 수도 있다.
- 사용자 영향: 키워드 미지 탐색, 잘림 표시, 후속 cursor가 언제 필요한지와 예산 회귀의 기준이 정해지지 않는다.
- 목표 규범 수정안: 옵션별 타입/기본/허용범위, chars의 Unicode 단위와 bytes의 UTF-8 기준, text만/전체 envelope 중 예산 대상, 다중 상한 우선순위를 정한다. root/cursor/since의 배타/호환 옵션도 최소한 명시한다. 수치는 메인이 결정하며 현재 구현 수치를 그대로 규범으로 요구하지 않는다.
- 검증 제안: 생략 기본값, 0/음수/소수/NaN 및 상한 경계, 한글/이모지, 여러 예산 동시 적용, 큰 frames/refs 메타데이터를 비교한다. 정적 continuation의 합집합과 diff 정합성을 이 기본값에 고정한다.
- 증거 등급: 입력/출력 기본 계약 누락. 현재 snapshot 실패로 판정하지 않음.

### R1-04 · P2 · FileInput의 bytes/base64 형식과 여러 source 동시 제공의 의미 미정

- 위치/REQ: `internal/locator.setFiles.md:10,48` REQ-LOCATOR-SETFILES-003; `common/files-events.md:8,19` REQ-C-FILESEVENTS-001/002. chooser.setFiles/drop가 같은 엔진을 상속한다.
- 근거: FileInput은 `{name,mimeType,bytes}` 또는 `{name,mimeType,base64}`로만 적혀 있고 bytes의 공개 JS 타입/원소 범위와 base64 허용 문법, source 필드의 배타 규칙이 없다. 형식 오류를 반드시 사전 거절하라는 요구를 판정할 기준이 부족하다.
- 구체 반례: `{bytes:[256,-1],base64:'AA==',name:'a',mimeType:'text/plain'}`; `{fileId:'own-id',base64:'…'}`; Uint8Array/일반 배열/문자열 bytes; 빈 파일의 `base64:''`. 서로 다른 구현이 우선순위/강제변환/거절을 다르게 정해도 현재 문구만으로 결론을 내릴 수 없다.
- 사용자 영향: 의도와 다른 바이트를 업로드하거나 잘못된 소스를 선택할 수 있고, 사전 거절/기존 선택 보존 검증이 재현 불가능해진다.
- 목표 규범 수정안: source는 정확히 하나라는 규칙, bytes 지원 타입과 0..255 정수 검증, base64 문법(빈 값/패딩/공백/URL-safe 여부), name/mimeType 필수/기본/정규화 규칙을 공통 schema로 정한다. 파일 개수 검증이 multiple에 따른 cardinality인지 별도 총수 제한인지도 명시한다. 임의의 새 제한을 추가하자는 요구는 아니다.
- 검증 제안: 정상 0-byte/Unicode/binary 각각과 위 모호 입력을 세 API에서 같은 결과로 검증하고 upload/drop 전 trace, 기존 선택, 바이트 hash, 임시 요소 잔여를 확인한다.
- 증거 등급: 목표 schema 누락. local/server/bytes 통합 목표는 유지한다.

### R1-05 · P2 · 64KiB 출력 예산과 이미지 출력의 회계가 분리되지 않음

- 위치/REQ: `common/runtime.md:41,44` REQ-C-RUNTIME-004; `internal/display.md:10-13,33` REQ-DISPLAY-001/002; `internal/page.screenshot.md:11,59` REQ-PAGE-SCREENSHOT-004.
- 근거: 기본 64KiB 출력·256블록이 공통 예산이고 display는 screenshot을 실제 이미지로 반환해야 한다. 텍스트/이미지의 별도 한도, base64 전후 어느 바이트를 계산하는지, 이미지 초과가 실행 전체 실패인지 단일 블록 생략인지가 없다.
- 구체 반례: 고엔트로피 1024×768 PNG 한 장은 흔히 64KiB를 넘는다. `console.log('before'); display(await page.screenshot()); console.log('after')`에서 유효 이미지 전달, 64KiB 총출력 준수, 뒷 로그 유지의 우선순위가 미정이다. 이 반례는 예산 회계 논점이며 크기를 실제 측정한 결과가 아니다.
- 사용자 영향: 일반 screenshot→display 기본 흐름을 어떤 기준으로 성공/절단 판정할지 불명확하다.
- 목표 규범 수정안: 텍스트 예산/이미지 예산을 분리하거나 총예산에 이미지가 포함됨을 명시하고 이미지 상한/초과 처리·오류/생략 표지의 보존 규칙을 정한다. GUIDE에 알려야 할 수치와 측정 단위를 규범으로 연결한다.
- 검증 제안: 한도 전/후의 텍스트·이미지·혼합 출력, 256블록 경계, 큰 이미지의 부분 반환 금지, 후속 요청과 세션 격리를 확인한다.
- 증거 등급: 목표 공통 예산 해석 누락. 현재 runtime 구현의 display 예산 적용 여부를 PASS/FAIL로 판정하지 않았다.

### R1-06 · P2 · page.logs의 유실 표지를 반환할 출력 계약 없음

- 위치/REQ: `internal/page.logs.md:11,33` REQ-PAGE-LOGS-002.
- 근거: 출력은 `Array<{at,level,text}>`로 고정하지만 필수 규범은 버퍼범위/유실/미수집기간을 표시하라고 한다. 정상 로그와 구별되는 메타데이터 전달 방식은 없다.
- 구체 반례: attach 전 10초와 버퍼 overflow 후 100개 로그가 사라진 뒤 `logs({since:t})`가 정상 로그 5개만 반환하면 호출자는 5개가 전부인지 판단할 수 없다. 가상의 warning 로그를 섞으면 실제 페이지 콘솔 로그와 구분되지 않는다.
- 사용자 영향: 원인 조사에서 미수집을 무로그로 오인한다.
- 목표 규범 수정안: 배열 호환성을 유지할지 결정하면서 typed metadata/envelope 또는 문서화된 구별 가능한 진단 항목을 확정한다. 최소 수집 시작, 보관 범위, dropped/partial 및 의미를 정의한다. 반환 형식 변경은 guide/호환성 결정에 연결한다.
- 검증 제안: attach 이전, 버퍼 overflow, since 경계, navigation/페이지 분리에서 실제 로그와 진단 표지가 구별되는지 판독한다.
- 증거 등급: 요구된 관찰값과 출력 shape의 연결 누락.

### R1-07 · P2 · download.cancel의 최종 상태 확인 경로가 계약에 없음

- 위치/REQ: `internal/download.cancel.md:11,22,33` REQ-DOWNLOAD-CANCEL-001/002; `inventory.md:13` 다운로드 객체 필드 목록.
- 근거: 반환은 취소요청 확인 boolean이고 종료상태는 별도라고 한다. 규범은 최종 interrupted 확인과 이미 완료/취소 상태의 구분을 요구하지만 어떤 기존 API/핸들 필드/오류가 그 상태를 제공하는지 없다. inventory에는 download id/url/name만 명시한다.
- 구체 반례: 완료 직전 cancel과 이미 complete 뒤 cancel이 모두 true를 반환할 때 호출자는 실제 취소인지 정상 완료인지 알 수 없다. 이후 save 실패만으로는 cancel/디스크오류/권한 문제를 구별할 수 없다.
- 사용자 영향: 성공적으로 전송을 중단했다고 잘못 해석하거나 완료된 파일을 취소 상태로 다룰 수 있다.
- 목표 규범 수정안: cancel이 최종 interrupted를 기다려 반환하는 계약인지, 요청접수만 반환하고 기존 핸들의 상태를 확인하는 계약인지 선택한다. complete/interrupted/cancelled/already-handled 결과와 확인 경로를 고정한다. 65번째 새 API를 무조건 추가할 필요는 없다.
- 검증 제안: 진행중 느린 전송, 완료와 cancel 경합, 이미 완료/취소, 연속 cancel, 타세션을 독립 run으로 검증한다. 서버 연결 종료/브라우저 실제 상태는 독립 판독하고 사용자에게 주는 상태도 비교한다.
- 증거 등급: 비동기 성공 의미와 후속 관찰 계약 누락. 실제 취소 실패를 재현했다고 주장하지 않음.

### R1-08 · P2 · event waiter의 arming 계약이 결정 과제로 남아 있음

- 위치/REQ: `internal/page.waitForEvent.md:48` REQ-PAGE-WAITFOREVENT-003; `common/files-events.md:52` REQ-C-FILESEVENTS-005; PLAN-PAGE-WAITFOREVENT-003.
- 근거: 현재 요구는 경합 없는 사용법을 제시하고 필요하면 ready/arming 계약을 정하라고 한다. 그러나 API 출력은 이벤트 발생 후 resolve되는 Promise뿐이어서, 호출이 반환되었다는 사실과 브라우저 등록 완료 사이의 보장이 규범으로 확정되지 않았다.
- 구체 반례: `var pending=page.waitForEvent('dialog'); await button.click(); var dialog=await pending;`에서 click이 등록 ack보다 먼저 브라우저에 도착하는 구현은 이벤트를 놓칠 수 있다. 등록 ready를 기다리려 `await pending`하면 dialog 발생 전에 대기가 멈춰 click을 실행할 수 없다.
- 사용자 영향: guide의 기본 조합을 따른 즉시 popup/dialog/chooser 업무가 경합에 의존한다.
- 목표 규범 수정안: 같은 세션에서 wait 호출 다음 hostcall보다 등록이 먼저 완료되는 ordering 보장을 채택하거나, 실제 공개 표면에 맞는 ready 신호와 사용법을 확정한다. "필요하면 정한다"를 구체적 보장으로 바꾼다.
- 검증 제안: waiter 등록을 의도적으로 지연한 조건에서 즉시 이벤트를 반복 발생시켜 trace의 register-ready→action→event 순서를 검증한다. timeout/reset에서 늦은 등록이 남지 않는지도 확인한다. 임의 sleep으로 우연히 통과시키지 않는다.
- 증거 등급: 문서 자체가 인정한 미확정 설계. 현재 제품 경합 재현이 아니다.

### R1-09 · P2 · 명시 down으로 유지한 modifier와 press가 소유하는 modifier의 경계 미정

- 위치/REQ: `internal/keyboard.down.md:22` REQ-KEYBOARD-DOWN-001; `internal/keyboard.press.md:22` REQ-KEYBOARD-PRESS-001; `internal/keyboard.up.md:22` REQ-KEYBOARD-UP-001; `internal/locator.press.md:33` REQ-LOCATOR-PRESS-002.
- 근거: down 상태는 후속 press/type/up에 이어져야 하고 up은 다른 modifier를 임의 해제하지 않아야 한다. 동시에 press/locator.press는 마지막에 modifier를 release하라고 하며 이미 눌린 modifier의 소유권을 구분하지 않는다.
- 구체 반례: `down('Control'); press('Control+A'); press('C'); up('Control')`. 두 번째 호출이 Control을 해제하면 원래 명시 down을 유지하려는 조합이 깨지고, 아무 것도 해제하지 않으면 press가 새로 누른 modifier의 release 요구와 혼동된다.
- 사용자 영향: 복합 단축키/격자 선택에서 후속 입력 의미가 달라진다.
- 목표 규범 수정안: press가 시작 전에 유지되던 modifier는 보존하고 자신이 새로 누른 것만 정리하는지, 모든 press가 유지 상태를 소비하는지 한 정책을 선택한다. locator.press도 같은 정책과 오류 시 cleanup 예외를 상속한다.
- 검증 제안: 기존 modifier 없음/일부 있음/동일 modifier 있음, 중도 키 오류, locator focus 실패, 다음 press/type를 키 이벤트 trace와 실제 값으로 판독한다.
- 증거 등급: 상태 조합 의미 누락. 특정 기존 코드의 릴리스 동작을 버그로 단정하지 않음.

## 실제 읽은 범위와 미검토

아래 이름은 모두 `index.json`의 67개 API를 포함한다. 각 파일의 계약 요약(입력/기본값·출력·효과·오류)과 모든 REQ 규범을 읽고 공통조건을 대조했다. 반복되는 GWT/근거/미검증 boilerplate는 구조화 추출 및 원문↔matrix 일치 검사도 병행했다. 전체 문서를 전부 제품 경로로 실행했다는 뜻은 아니다.

|그룹|읽은 API 이름|검토 깊이|
|---|---|---|
|외부 3|guide, reset, js|기본 입력/출력·세대·예산·격리·재시도|
|브라우저 4|browser.list, browser.tabs, browser.open, browser.attach|목록/소유·탭 생성/연결·실패 잔여 효과|
|페이지 수명 6|page.activate, page.close, page.goto, page.back, page.forward, page.reload|반환·탐색 준비·경계·stale·다른 탭 무효과|
|관찰/프레임 4|scope.snapshot, page.screenshot, page.frames, page.frame|범위/예산·좌표·프레임/문서·부분 표시|
|선택/조합 7|scope.locator, scope.getByRole, scope.getByText, scope.getByLabel, locator.filter, locator.nth, locator.count|지연 불변 조합·엄격성·본문/접근이름·오류|
|대상 조회 8|locator.textContent, locator.getAttribute, locator.inputValue, locator.isVisible, locator.isEnabled, locator.isEditable, locator.isChecked, locator.boundingBox|반환 타입·0/N·속성/값·시각 상태·좌표|
|대상 입력 10|locator.click, locator.fill, locator.press, locator.hover, locator.focus, locator.scrollIntoView, locator.setChecked, locator.selectOption, locator.dragTo, locator.drop|입력 전제·사후 확인·부분 효과·무입력/정리|
|좌표/키 9|mouse.move, mouse.down, mouse.up, mouse.click, mouse.wheel, keyboard.down, keyboard.up, keyboard.press, keyboard.type|좌표/상태·전달 성공·release·Unicode|
|대기 5|locator.waitFor, page.waitForEvent, page.waitForURL, page.waitForFunction, page.waitForLoadState|state/timeout·관찰/사용자 함수 효과·arming|
|파일/이벤트 6|locator.setFiles, chooser.setFiles, download.save, download.cancel, dialog.accept, dialog.dismiss|source/바이트·실제 event identity·최종 상태/핸들 수명|
|평가/출력 5|scope.evaluate, locator.evaluateAll, page.logs, console.log, display|context/직렬화·함수 효과·명시출력/예산·유실|

추가로 읽은 범위: requirements/README.md, index.json, common/runtime.md, dom-frames.md, selection.md, input.md, files-events.md, sources.md, inventory.md, backlog.md, verification-matrix.json. 관련 기존 docs/runtime-usage.md 및 API catalog/일부 extension 소스는 현재 사실을 오해하지 않는 용도로만 조회했다.

미검토/제한: 경쟁 Codex/Aside 현재 실측/원문 가이드 타당성의 전수 검증은 2회차 관점으로 남긴다. 현재 제품의 64 API 구현과 전 옵션 소스 경로를 전수 감사하지 않았다. fixture 판정기/테스트 assertion의 적합성, 복잡 OOPIF/입력/이벤트의 실제 실행, 회사/외부 사이트 접근도 실행하지 않았다. 이번 발견은 위 명세의 논리적 반례이며 현행 제품에서 실제 재현된 FAIL이 아니다.

## 실행·문서 검증 결과

1. 시작 HEAD/clean 확인 완료. 지정한 baseline→head diff의 변경 파일/통계를 읽었다.
2. 문서 검사(읽기 전용 Python): 외부3 + 내부64 = 67 API, 공통5, Markdown REQ175와 matrix175, 중복 REQ 0, 모든 spec 경로 존재. Markdown 각 REQ의 Given/When/Then과 matrix 전175개가 문자열 기준 일치한다. 상태는 전175개 unverified, 수준 MUST172/SHOULD3이다. 명세의 의미나 검증 시나리오의 충분성을 이 형식 검사만으로 보장하지 않는다.
3. `git diff --name-only baseline head -- extension bridge tests test-site scripts package.json package-lock.json`: 변경 없음. 동결 대상 소스/테스트를 이 리뷰에서 바꾸지 않았다.
4. matrix의 기존 테스트 연결과 모든 상태를 읽기 전용으로 조회했다. 후보 연결은 당시 basic-call regression이며 새 요구 PASS로 해석하지 않았다. 상세 GWT는 개별 파일과 동등하며, 다수 기본 요구의 GWT는 목적/경계를 반복한 수준이다. 위 후보의 수정과 함께 구체적인 fixture/oracle을 보완해야 한다.
5. 제품/unit/fixture/E2E 테스트 **미실행**. 브라우저 실행 **없음**. 제품 적합성 **NOT_RUN / 미검증**. 원격 게시/PR 승인/병합 **없음**.

## 남은 위험과 검토 버전 판정

67개 명세 연결과 175개 ID/검증계획 형식은 확인했다. R1-01은 수용된 MUST끼리 상반된 결과를 요구하므로 먼저 해소해야 한다. 나머지는 기본 API를 조합하는 데 필요한 의미/관찰 가능성/검증 기준의 공백이며 메인이 수용·기각·보류를 각각 결정할 후보이다. 경쟁 제품과 다르다는 이유 또는 현 구현과 다르다는 이유만으로 제기한 버그는 없다.

문서 head `6561d2227c8c0bbc34f6dd902428d35e38a79dcd`, 제품 baseline `700a6a06af3f97729327afaf9becb4ee29bb475b`에 대해 **CHANGES_REQUESTED (명세)**. 문서 검토 완료를 제품 PASS/배포 승인으로 사용해서는 안 된다. 다음 회차는 메인 판단과 문서 갱신을 고정한 새 SHA에서 수행해야 한다.
