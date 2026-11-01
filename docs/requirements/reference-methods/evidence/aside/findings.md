# 조사 B · Aside 원본 · 1회 근거/대응 검토

기준 문서 850326772bb826b37fa182b98007b1313c925a2c, 제품 700a6a0. 2026-11-01. 정본·제품·테스트 수정 없음. 새 브라우저 실측0. 공개 CLI guide/help만 실행했고 원본 코드/번들/WASM·개인 프로필/탭/인증을 열람하지 않았다. 자체 wrapper·일반 Playwright는 근거로 사용하지 않았다.

## 전체 읽기 범위

외부3+내부64=67 API, 공통5 문서, REQ 총184개. 아래 전체 목록과 read-manifest.json은 읽은 규범/GWT의 범위이며 전 조건의 경쟁제품 확인률/실측률이 아니다.

- docs/requirements/external/guide.md: REQ-GUIDE-001, REQ-GUIDE-002
- docs/requirements/external/reset.md: REQ-RESET-001, REQ-RESET-002, REQ-RESET-003
- docs/requirements/external/js.md: REQ-JS-001, REQ-JS-002, REQ-JS-003
- docs/requirements/internal/browser.list.md: REQ-BROWSER-LIST-001, REQ-BROWSER-LIST-002
- docs/requirements/internal/browser.tabs.md: REQ-BROWSER-TABS-001, REQ-BROWSER-TABS-002
- docs/requirements/internal/browser.open.md: REQ-BROWSER-OPEN-001, REQ-BROWSER-OPEN-002
- docs/requirements/internal/browser.attach.md: REQ-BROWSER-ATTACH-001, REQ-BROWSER-ATTACH-002
- docs/requirements/internal/page.activate.md: REQ-PAGE-ACTIVATE-001, REQ-PAGE-ACTIVATE-002
- docs/requirements/internal/page.close.md: REQ-PAGE-CLOSE-001, REQ-PAGE-CLOSE-002
- docs/requirements/internal/page.goto.md: REQ-PAGE-GOTO-001, REQ-PAGE-GOTO-002
- docs/requirements/internal/page.back.md: REQ-PAGE-BACK-001, REQ-PAGE-BACK-002
- docs/requirements/internal/page.forward.md: REQ-PAGE-FORWARD-001, REQ-PAGE-FORWARD-002
- docs/requirements/internal/page.reload.md: REQ-PAGE-RELOAD-001, REQ-PAGE-RELOAD-002
- docs/requirements/internal/scope.snapshot.md: REQ-SCOPE-SNAPSHOT-001, REQ-SCOPE-SNAPSHOT-002, REQ-SCOPE-SNAPSHOT-003, REQ-SCOPE-SNAPSHOT-004, REQ-SCOPE-SNAPSHOT-005, REQ-SCOPE-SNAPSHOT-006, REQ-SCOPE-SNAPSHOT-007, REQ-SCOPE-SNAPSHOT-008, REQ-SCOPE-SNAPSHOT-009, REQ-SCOPE-SNAPSHOT-010, REQ-SCOPE-SNAPSHOT-011
- docs/requirements/internal/page.screenshot.md: REQ-PAGE-SCREENSHOT-001, REQ-PAGE-SCREENSHOT-002, REQ-PAGE-SCREENSHOT-003, REQ-PAGE-SCREENSHOT-004
- docs/requirements/internal/page.frames.md: REQ-PAGE-FRAMES-001, REQ-PAGE-FRAMES-002
- docs/requirements/internal/page.frame.md: REQ-PAGE-FRAME-001, REQ-PAGE-FRAME-002
- docs/requirements/internal/scope.locator.md: REQ-SCOPE-LOCATOR-001, REQ-SCOPE-LOCATOR-002
- docs/requirements/internal/scope.getByRole.md: REQ-SCOPE-GETBYROLE-001, REQ-SCOPE-GETBYROLE-002
- docs/requirements/internal/scope.getByText.md: REQ-SCOPE-GETBYTEXT-001, REQ-SCOPE-GETBYTEXT-002, REQ-SCOPE-GETBYTEXT-003
- docs/requirements/internal/scope.getByLabel.md: REQ-SCOPE-GETBYLABEL-001, REQ-SCOPE-GETBYLABEL-002
- docs/requirements/internal/locator.filter.md: REQ-LOCATOR-FILTER-001, REQ-LOCATOR-FILTER-002, REQ-LOCATOR-FILTER-003, REQ-LOCATOR-FILTER-004
- docs/requirements/internal/locator.nth.md: REQ-LOCATOR-NTH-001, REQ-LOCATOR-NTH-002
- docs/requirements/internal/locator.count.md: REQ-LOCATOR-COUNT-001, REQ-LOCATOR-COUNT-002
- docs/requirements/internal/locator.textContent.md: REQ-LOCATOR-TEXTCONTENT-001, REQ-LOCATOR-TEXTCONTENT-002
- docs/requirements/internal/locator.getAttribute.md: REQ-LOCATOR-GETATTRIBUTE-001, REQ-LOCATOR-GETATTRIBUTE-002
- docs/requirements/internal/locator.inputValue.md: REQ-LOCATOR-INPUTVALUE-001, REQ-LOCATOR-INPUTVALUE-002
- docs/requirements/internal/locator.isVisible.md: REQ-LOCATOR-ISVISIBLE-001, REQ-LOCATOR-ISVISIBLE-002
- docs/requirements/internal/locator.isEnabled.md: REQ-LOCATOR-ISENABLED-001, REQ-LOCATOR-ISENABLED-002
- docs/requirements/internal/locator.isEditable.md: REQ-LOCATOR-ISEDITABLE-001, REQ-LOCATOR-ISEDITABLE-002
- docs/requirements/internal/locator.isChecked.md: REQ-LOCATOR-ISCHECKED-001, REQ-LOCATOR-ISCHECKED-002
- docs/requirements/internal/locator.boundingBox.md: REQ-LOCATOR-BOUNDINGBOX-001, REQ-LOCATOR-BOUNDINGBOX-002
- docs/requirements/internal/locator.click.md: REQ-LOCATOR-CLICK-001, REQ-LOCATOR-CLICK-002
- docs/requirements/internal/locator.fill.md: REQ-LOCATOR-FILL-001, REQ-LOCATOR-FILL-002
- docs/requirements/internal/locator.press.md: REQ-LOCATOR-PRESS-001, REQ-LOCATOR-PRESS-002
- docs/requirements/internal/locator.hover.md: REQ-LOCATOR-HOVER-001, REQ-LOCATOR-HOVER-002
- docs/requirements/internal/locator.focus.md: REQ-LOCATOR-FOCUS-001, REQ-LOCATOR-FOCUS-002
- docs/requirements/internal/locator.scrollIntoView.md: REQ-LOCATOR-SCROLLINTOVIEW-001, REQ-LOCATOR-SCROLLINTOVIEW-002
- docs/requirements/internal/locator.setChecked.md: REQ-LOCATOR-SETCHECKED-001, REQ-LOCATOR-SETCHECKED-002
- docs/requirements/internal/locator.selectOption.md: REQ-LOCATOR-SELECTOPTION-001, REQ-LOCATOR-SELECTOPTION-002
- docs/requirements/internal/locator.dragTo.md: REQ-LOCATOR-DRAGTO-001, REQ-LOCATOR-DRAGTO-002
- docs/requirements/internal/locator.drop.md: REQ-LOCATOR-DROP-001, REQ-LOCATOR-DROP-002
- docs/requirements/internal/mouse.move.md: REQ-MOUSE-MOVE-001, REQ-MOUSE-MOVE-002
- docs/requirements/internal/mouse.down.md: REQ-MOUSE-DOWN-001, REQ-MOUSE-DOWN-002
- docs/requirements/internal/mouse.up.md: REQ-MOUSE-UP-001, REQ-MOUSE-UP-002
- docs/requirements/internal/mouse.click.md: REQ-MOUSE-CLICK-001, REQ-MOUSE-CLICK-002
- docs/requirements/internal/mouse.wheel.md: REQ-MOUSE-WHEEL-001, REQ-MOUSE-WHEEL-002
- docs/requirements/internal/keyboard.down.md: REQ-KEYBOARD-DOWN-001, REQ-KEYBOARD-DOWN-002
- docs/requirements/internal/keyboard.up.md: REQ-KEYBOARD-UP-001, REQ-KEYBOARD-UP-002
- docs/requirements/internal/keyboard.press.md: REQ-KEYBOARD-PRESS-001, REQ-KEYBOARD-PRESS-002
- docs/requirements/internal/keyboard.type.md: REQ-KEYBOARD-TYPE-001, REQ-KEYBOARD-TYPE-002
- docs/requirements/internal/locator.waitFor.md: REQ-LOCATOR-WAITFOR-001, REQ-LOCATOR-WAITFOR-002
- docs/requirements/internal/page.waitForEvent.md: REQ-PAGE-WAITFOREVENT-001, REQ-PAGE-WAITFOREVENT-002, REQ-PAGE-WAITFOREVENT-003
- docs/requirements/internal/page.waitForURL.md: REQ-PAGE-WAITFORURL-001, REQ-PAGE-WAITFORURL-002
- docs/requirements/internal/page.waitForFunction.md: REQ-PAGE-WAITFORFUNCTION-001, REQ-PAGE-WAITFORFUNCTION-002
- docs/requirements/internal/page.waitForLoadState.md: REQ-PAGE-WAITFORLOADSTATE-001, REQ-PAGE-WAITFORLOADSTATE-002
- docs/requirements/internal/locator.setFiles.md: REQ-LOCATOR-SETFILES-001, REQ-LOCATOR-SETFILES-002, REQ-LOCATOR-SETFILES-003
- docs/requirements/internal/chooser.setFiles.md: REQ-CHOOSER-SETFILES-001, REQ-CHOOSER-SETFILES-002
- docs/requirements/internal/download.save.md: REQ-DOWNLOAD-SAVE-001, REQ-DOWNLOAD-SAVE-002
- docs/requirements/internal/download.cancel.md: REQ-DOWNLOAD-CANCEL-001, REQ-DOWNLOAD-CANCEL-002
- docs/requirements/internal/dialog.accept.md: REQ-DIALOG-ACCEPT-001, REQ-DIALOG-ACCEPT-002
- docs/requirements/internal/dialog.dismiss.md: REQ-DIALOG-DISMISS-001, REQ-DIALOG-DISMISS-002
- docs/requirements/internal/scope.evaluate.md: REQ-SCOPE-EVALUATE-001, REQ-SCOPE-EVALUATE-002
- docs/requirements/internal/locator.evaluateAll.md: REQ-LOCATOR-EVALUATEALL-001, REQ-LOCATOR-EVALUATEALL-002
- docs/requirements/internal/page.logs.md: REQ-PAGE-LOGS-001, REQ-PAGE-LOGS-002
- docs/requirements/internal/console.log.md: REQ-CONSOLE-LOG-001, REQ-CONSOLE-LOG-002
- docs/requirements/internal/display.md: REQ-DISPLAY-001, REQ-DISPLAY-002
- docs/requirements/common/runtime.md: REQ-C-RUNTIME-001, REQ-C-RUNTIME-002, REQ-C-RUNTIME-003, REQ-C-RUNTIME-004, REQ-C-RUNTIME-005, REQ-C-RUNTIME-006, REQ-C-RUNTIME-007, REQ-C-RUNTIME-008
- docs/requirements/common/dom-frames.md: REQ-C-DOMFRAMES-001, REQ-C-DOMFRAMES-002, REQ-C-DOMFRAMES-003, REQ-C-DOMFRAMES-004, REQ-C-DOMFRAMES-005, REQ-C-DOMFRAMES-006
- docs/requirements/common/selection.md: REQ-C-SELECTION-001, REQ-C-SELECTION-002, REQ-C-SELECTION-003, REQ-C-SELECTION-004, REQ-C-SELECTION-005, REQ-C-SELECTION-006
- docs/requirements/common/input.md: REQ-C-INPUT-001, REQ-C-INPUT-002, REQ-C-INPUT-003, REQ-C-INPUT-004, REQ-C-INPUT-005
- docs/requirements/common/files-events.md: REQ-C-FILESEVENTS-001, REQ-C-FILESEVENTS-002, REQ-C-FILESEVENTS-003, REQ-C-FILESEVENTS-004, REQ-C-FILESEVENTS-005, REQ-C-FILESEVENTS-006, REQ-C-FILESEVENTS-007

## 메인 판단 후보

1. A-B01(근거): Playwright-compatible라는 한 문구로 미기재 메서드를 direct로 채우지 않는다. 정확 공개 서명/기존 개별 호출이 없는 API는 unknown을 유지한다. 이는 미지원 판정이 아니다.
2. A-B02(차이): Aside snapshot마다 이전 ref 무효화와 우리 동일문서/동일요소 ref 안정성을 의도된 차이로 기록한다. 우리 stable ref 규범은 fresh snapshot 후 ref 전면 폐기 방식으로 몰래 낮추지 않는다.
3. A-B03(반례): visible filter3/negative nth DOMException/slot 이름 실패/scale frame 효과0/drag accepted2는 원인 추론 없이 해당 fixture 관측으로만 인용한다. 현재·모든사이트 지원/미지원의 증명으로 쓰지 않는다.
4. A-B04(계약혼동): Aside download path/saveAs/fs 조합과 우리 server asset/fileId API는 다르다. GET fetch 예제는 POST/blob 다운로드 대체가 아니다. 우리 file source 3종/32MiB/strict base64는 독립 설계이며 Aside 지원으로 쓰지 않는다.
5. A-B05(공개문서 충돌): 현재 repl --help의 getTabs()와 guide repl의 listBrowserTabs()/tabs가 일치하지 않는다. getTabs의 서명/지원 여부를 실행 없이 결정하지 말고 공개문서 충돌로 기록한다.
6. A-B06(계약강도): 59개 API의 목적 반복을 새로운 기능 수입으로 해결하지 않는다. 아래 표는 기존 사용자 필요를 판정 가능한 사례/입력표로 좁히는 제안이다. 수용/기각/보류는 메인 판단이며, 아직 규범이 아니다.

## API별 누락 판정조건·반례·규범 보완 후보

각 행은 기존 REQ/PLAN ID를 유지해 구체 GWT/관찰값을 보완하는 제안이다. 공통 안전조건은 한 번 정의하고 상속한다. 경쟁제품이 갖는다고 MUST를 추가하지 않는다. 사례가 현재 fixture에 없으면 설계로만 남기고 개발/테스트를 변경하지 않는다.

### guide

- 해당 REQ: REQ-GUIDE-001, REQ-GUIDE-002
- Aside 관계/근거: direct; A-DOC-MAIN, A-DOC-REPL. aside guide / aside guide repl
- 확인 범위: CLI main은 exec/repl 표면·프로필 선택·기본 운영을 안내한다. / REPL 가이드는 환경·snapshot 옵션·download 사용법을 공개한다.
- 빠진 판정조건·반례·구체 제안: 전체/정확 API/없는 API/빈문자열·잘못된 타입을 구분하고 guide 전후 탭·변수·출력버퍼 불변을 판독한다. 개별 조회도 상속 공통 계약과 실제 미구현/목표 계약을 구분해 안내할지 결정한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### reset

- 해당 REQ: REQ-RESET-001, REQ-RESET-002, REQ-RESET-003
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: 진행 hostcall 직전/입력 down 직후/late event 직전의 세 시점을 고정하고 세대번호·종결 결과 1회·이전 변수 ReferenceError·새 1+1 실행으로 재사용 가능을 판정한다. release 실패는 실패/불확실 결과의 필드와 잔류 버튼을 함께 확인한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### js

- 해당 REQ: REQ-JS-001, REQ-JS-002, REQ-JS-003
- Aside 관계/근거: direct; A-DOC-REPL, A-DOC-HELP. Aside 원본 CLI repl
- 확인 범위: ES2023+·async/await·120초·const/let 지속·import/require 금지·명시 console 출력은 DOC.
- 빠진 판정조건·반례·구체 제안: 같은 세션 let 선언→후속 참조→동명 재선언 SyntaxError 후 기존값 보존을 고정한다. 로그 전후 사용자 throw와 timeout의 보존 출력/실행 상태를 분리하고 requestId 동시 중복·동일 payload·상이 payload에서 입력 횟수를 세어 판정한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### browser.list

- 해당 REQ: REQ-BROWSER-LIST-001, REQ-BROWSER-LIST-002
- Aside 관계/근거: composition; A-DOC-MAIN. host/profile 목록 후 profile 선택
- 확인 범위: remote host별 profile 조회와 --profile 선택이 DOC.
- 빠진 판정조건·반례·구체 제안: 연결 0/1/2와 연결 해제 중 목록을 각각 정의한다. 연결 없음의 오류와 정상 빈목록 중 선택을 확정하고 id의 안정 범위(현재 연결/세션)를 명시한다. 호출 전후 attach 수와 active tab 불변으로 읽기를 검증한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### browser.tabs

- 해당 REQ: REQ-BROWSER-TABS-001, REQ-BROWSER-TABS-002
- Aside 관계/근거: direct; A-DOC-REPL, A-DOC-HELP. REPL 전역 listBrowserTabs
- 확인 범위: attach 없이 브라우저 열린 탭 목록, targetId/active/title/url 예시는 DOC.
- 빠진 판정조건·반례·구체 제안: 동명·동일URL 탭 2개와 서로 다른 window를 사용해 id/url/title/active/windowId 필드 타입과 identity를 검증한다. 목록 시점 뒤 닫힌 ID attach 실패와 활성 탭 불변을 확인하고 제어불가 scheme 포함 여부/필터 정책을 명시한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### browser.open

- 해당 REQ: REQ-BROWSER-OPEN-001, REQ-BROWSER-OPEN-002
- Aside 관계/근거: direct; A-DOC-REPL. REPL 전역 openTab
- 확인 범위: openTab(url)는 새 탭을 열고 interactive까지 기다려 page/tabs를 갱신한다고 DOC.
- 빠진 판정조건·반례·구체 제안: HTTP 리다이렉트→최종 문서, 빈 body 초기화, 네트워크 실패를 분리한다. active:false가 기존 활성 탭을 보존하는지, 성공이 DOM interactive인지 제품 정의를 고정한다. 입력오류는 탭 생성0, 생성 후 실패는 생성 ID·잔여 탭을 보고하도록 설계한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### browser.attach

- 해당 REQ: REQ-BROWSER-ATTACH-001, REQ-BROWSER-ATTACH-002
- Aside 관계/근거: direct; A-DOC-REPL. REPL 전역 attachBrowserTab
- 확인 범위: 열린 targetId 탭을 attach하고 page로 설정하는 API는 DOC.
- 빠진 판정조건·반례·구체 제안: 동일 URL/title인 두 탭 중 요청 ID만 연결되고 탐색/새탭0인지 관찰한다. 같은 세션 반복 attach의 반환 identity·멱등성을 선택하고 다른 세션 소유/닫힘/권한 오류를 각각 판정한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### page.activate

- 해당 REQ: REQ-PAGE-ACTIVATE-001, REQ-PAGE-ACTIVATE-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: 두 window에 같은 제목 탭을 두고 요청 tabId만 active가 되는지 판정한다. 활성화 성공이 window focus까지 뜻하는지 고정하고 URL/history/탭수 불변, 닫힌 ID의 다른 탭 활성0을 확인한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### page.close

- 해당 REQ: REQ-PAGE-CLOSE-001, REQ-PAGE-CLOSE-002
- Aside 관계/근거: composition; A-DOC-REPL. Page 메서드 대신 closeTab 전역
- 확인 범위: 반드시 closeTab(tab)을 쓰고 page.close()는 메모리누수 때문에 금지한다는 DOC.
- 빠진 판정조건·반례·구체 제안: 탭 A/B 및 A의 이벤트 waiter·입력 down을 준비한다. close 뒤 A 핸들 stale/closed와 close waiter 종결, B 생존·대기 유지·입력 상태 보존을 판정한다. 반복 close는 false/오류/메타데이터 중 하나로 확정한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### page.goto

- 해당 REQ: REQ-PAGE-GOTO-001, REQ-PAGE-GOTO-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: HTTP redirect, same-document hash, 실패한 탐색 후 기존문서 보존을 분리하고 성공 반환이 최종 URL/준비상태 무엇을 보장하는지 고정한다. redirect 이후 old ref 무효·현재 새 document identity를 확인한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### page.back

- 해당 REQ: REQ-PAGE-BACK-001, REQ-PAGE-BACK-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: 서로 다른 문서 A→B와 hash history 변형에서 back의 준비 기준과 document ref 세대를 나눠 판정한다. 최하단 false에서 URL·history·입력 횟수 불변을 확인하며 연속 호출의 직렬화/동시 오류 정책을 명시한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### page.forward

- 해당 REQ: REQ-PAGE-FORWARD-001, REQ-PAGE-FORWARD-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: A→B→back→C 이후 forward false를 판정하고 새 탭·B 재탐색0을 확인한다. same-document history와 document 교체에서 ref 유지/폐기를 나눠 정의한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### page.reload

- 해당 REQ: REQ-PAGE-RELOAD-001, REQ-PAGE-RELOAD-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: 동일 URL의 서버 문서 generation 증가를 관측해 새 document 준비를 판정한다. reload 후 old ref 실패와 새 동일모양 버튼 무입력, reload 도중 실패의 URL/문서 상태를 기록한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### scope.snapshot

- 해당 REQ: REQ-SCOPE-SNAPSHOT-001, REQ-SCOPE-SNAPSHOT-002, REQ-SCOPE-SNAPSHOT-003, REQ-SCOPE-SNAPSHOT-004, REQ-SCOPE-SNAPSHOT-005, REQ-SCOPE-SNAPSHOT-006, REQ-SCOPE-SNAPSHOT-007, REQ-SCOPE-SNAPSHOT-008, REQ-SCOPE-SNAPSHOT-009, REQ-SCOPE-SNAPSHOT-010, REQ-SCOPE-SNAPSHOT-011
- Aside 관계/근거: direct; A-DOC-REPL, A-HIST-SNAPSHOT. REPL 전역 snapshot
- 확인 범위: snapshot(page,{interactive?,showHidden?,ref?,selector?}) => Promise<{tree,diff}> 명시 서명 DOC. / offscreen/child-iframe/title/url·CSS selector 또는 ref 부분조회 DOC. / 새 snapshot은 이전 모든 ref 무효화; tree 후 action마다 diff 인쇄 DOC. / 과거 audit에서 기본13175자/tail 미포함/생략표시, selector tail104자에서 발견 HISTORICAL.
- 빠진 판정조건·반례·구체 제안: 기존 상세11REQ를 유지한다. showHidden/interactive 조합별 출력 상태를 구체 예시로 고정하고 같은 DOM의 root 변경·부분 출력 diff에서 거짓 삭제0을 판정한다. 키워드 미지 탐색의 predicate·정답 유일성·예산을 각각 고정하고 출력 행 수와 refs 수가 다른 경우 maxNodes의 계수 단위를 확정한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### page.screenshot

- 해당 REQ: REQ-PAGE-SCREENSHOT-001, REQ-PAGE-SCREENSHOT-002, REQ-PAGE-SCREENSHOT-003, REQ-PAGE-SCREENSHOT-004
- Aside 관계/근거: direct; A-DOC-REPL, A-HIST-CLIP. Page screenshot 및 annotatedScreenshot
- 확인 범위: raw screenshot 및 ref box 포함 annotatedScreenshot 사용은 DOC. / 과거 clip320x240 CSS 요청이 PNG640x480이었음(HISTORICAL/DPR).
- 빠진 판정조건·반례·구체 제안: 체커보드·원점 표식의 main viewport를 DPR1/2·가로세로 scroll에서 캡처해 원본 픽셀과 CSS 정규화 크기를 판독한다. clip이 viewport를 벗어났을 때 오류/교집합 정책과 이미지 픽셀·바이트 상한 숫자를 확정하고 fullPage 캡처의 scroll 복원 여부를 명시한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### page.frames

- 해당 REQ: REQ-PAGE-FRAMES-001, REQ-PAGE-FRAMES-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: main→same-origin→cross-origin→OOPIF 부모 트리에서 id,parent,name,url,process 필드의 타입과 미수집 상태를 명시한다. detach/reparent 직후 snapshot과 목록이 어느 시점의 일관성을 보장하는지, 부분 스캔 결과를 완전으로 표시하지 않는지 판정한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### page.frame

- 해당 REQ: REQ-PAGE-FRAME-001, REQ-PAGE-FRAME-002
- Aside 관계/근거: composition; A-HIST-FRAME. iframe selector 기반 frameLocator(과거 호출)
- 확인 범위: 과거 frameLocator→getByRole→click 문법 실행됨; 업무 이름변경0·서버PASS없음 HISTORICAL.
- 빠진 판정조건·반례·구체 제안: 동명 frame 2개에서 ID로 얻은 Scope가 유일 문서만 검색/평가함을 marker로 판정한다. 존재하지 않는 ID가 즉시오류인지 지연 사용오류인지 확정하고 detach 뒤 재사용 ID가 새 문서에 붙지 않는지 확인한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### scope.locator

- 해당 REQ: REQ-SCOPE-LOCATOR-001, REQ-SCOPE-LOCATOR-002
- Aside 관계/근거: direct; A-DOC-REPL. Page locator에 CSS 또는 virtual ref 전달
- 확인 범위: virtual ref는 page.locator(ref)로 전달하며 DOM property/CSS와 혼합금지 DOC. / download button CSS locator 예시 DOC.
- 빠진 판정조건·반례·구체 제안: CSS 구문오류의 발생 시점(생성/해석)을 확정한다. 동일 CSS가 main/child에 있는 상황과 발급 ref가 다른 Scope에 전달되는 상황을 나누어 교차 frame ref 라우팅/거절 정책을 명시하고 잘못된 qualified ref를 CSS로 재해석하지 않는다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### scope.getByRole

- 해당 REQ: REQ-SCOPE-GETBYROLE-001, REQ-SCOPE-GETBYROLE-002
- Aside 관계/근거: direct; A-HIST-REGEX, A-HIST-SLOT. Page getByRole(과거 호출)
- 확인 범위: 과거 regex role count1 HISTORICAL. / slot 이름 role 탐색은 Role selector not found HISTORICAL.
- 빠진 판정조건·반례·구체 제안: native/명시 role, aria-labelledby 다중 ID 순서·누락·순환, aria-label과 visible text 불일치를 case table로 고정한다. includeHidden true는 CSS hidden/aria-hidden/closed details 각각의 대상 포함 정책을 명시한다. RegExp g/y 반복과 slot 이름은 별도 판정한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### scope.getByText

- 해당 REQ: REQ-SCOPE-GETBYTEXT-001, REQ-SCOPE-GETBYTEXT-002, REQ-SCOPE-GETBYTEXT-003
- Aside 관계/근거: direct; A-HIST-DRAG. Page getByText(과거 호출)
- 확인 범위: 과거 drag 후 exact text waitFor가 완료되어 workflow 판단에 사용 HISTORICAL.
- 빠진 판정조건·반례·구체 제안: CSS hidden 포함·aria-hidden 제외, adjacent spans AB와 A B, nested 동일 텍스트의 최소 일치 요소 순서를 fixture로 고정한다. composed order에서 assigned slot과 fallback slot의 선택을 정하고 빈 RegExp·exact와 RegExp 조합의 오류를 구분한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### scope.getByLabel

- 해당 REQ: REQ-SCOPE-GETBYLABEL-001, REQ-SCOPE-GETBYLABEL-002
- Aside 관계/근거: direct; A-HIST-READONLY. Page getByLabel(과거 호출)
- 확인 범위: 과거 getByLabel→fill 호출에서 오류로 rejected를 기록 HISTORICAL.
- 빠진 판정조건·반례·구체 제안: label for/래핑/aria-label/aria-labelledby 각각의 소스와 우선순위를 고정하고 숨김 label 텍스트·여러 label·같은 label 2개 제어를 판독한다. label 자체와 연결 control 중 반환대상을 명시하며 비연결 일반 텍스트 count0을 확인한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### locator.filter

- 해당 REQ: REQ-LOCATOR-FILTER-001, REQ-LOCATOR-FILTER-002, REQ-LOCATOR-FILTER-003, REQ-LOCATOR-FILTER-004
- Aside 관계/근거: direct; A-HIST-FILTER. Locator filter(과거 호출)
- 확인 범위: 과거 visible:true 요청 결과3(숨김 포함) HISTORICAL; 우리 기대2와 다름.
- 빠진 판정조건·반례·구체 제안: filter(A).nth(0).filter(B)와 filter(A).filter(B).nth(0)의 결과가 다르게 되는 반례를 고정한다. visible:true/false, 빈 hasText 문자열/정규식, 미지원키+지원키 혼합을 명시해 invalid 전체호출의 원 Locator 불변을 판정한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### locator.nth

- 해당 REQ: REQ-LOCATOR-NTH-001, REQ-LOCATOR-NTH-002
- Aside 관계/근거: direct; A-HIST-NTH. Locator nth(과거 호출)
- 확인 범위: 과거 nth(-1) 호출이 DOMException HISTORICAL.
- 빠진 판정조건·반례·구체 제안: 3개 후보에서 0/2/-1/-3 및 3/-4의 순서/count를 표로 고정한다. Infinity/문자열/소수/NaN의 사전 오류, filter와 nth 순서 및 DOM 재정렬 뒤 지연평가 결과를 확인한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### locator.count

- 해당 REQ: REQ-LOCATOR-COUNT-001, REQ-LOCATOR-COUNT-002
- Aside 관계/근거: direct; A-HIST-REGEX, A-HIST-FILTER. Locator count(과거 호출)
- 확인 범위: 과거 role count1/filter count3 수치를 반환 HISTORICAL.
- 빠진 판정조건·반례·구체 제안: 동일 요소가 여러 선택 경로로 잡힐 때 DOM 요소 identity 중복 제거와 서로 다른 동일 텍스트 요소 2개 보존을 구분한다. 0/1/N·DOM 변경·stale ref·잘못된 CSS를 별도 결과로 판정하고 조회 전후 scroll/event0을 확인한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### locator.textContent

- 해당 REQ: REQ-LOCATOR-TEXTCONTENT-001, REQ-LOCATOR-TEXTCONTENT-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: 숨김 자식·aria-hidden·script 텍스트와 실제 공백을 포함한 DOM textContent 원문을 검색용 composed text와 비교한다. slot host의 light DOM 원문과 composed 이름 차이를 명시하고 null인 DOM textContent의 string 변환 정책을 확정한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### locator.getAttribute

- 해당 REQ: REQ-LOCATOR-GETATTRIBUTE-001, REQ-LOCATOR-GETATTRIBUTE-002
- Aside 관계/근거: direct; A-HIST-HARNESS. Locator getAttribute(과거 하니스 호출)
- 확인 범위: 개별 원본 API 동작 확정 없음. getAttribute(data-run) 하니스 문법과 서버판독 결과의 연결은 INFERENCE로만 이동했다.
- 빠진 판정조건·반례·구체 제안: 없음 null/빈문자열/초기 value 속성 vs 바뀐 value property/상대 href vs resolved href를 구분한다. HTML 속성 이름 대소문자와 빈·공백 name 입력 정책을 고정하고 긴 값은 JS 값 보존과 console 출력 잘림을 구분한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### locator.inputValue

- 해당 REQ: REQ-LOCATOR-INPUTVALUE-001, REQ-LOCATOR-INPUTVALUE-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: 사용자 편집 후 value attr 초기값과 현재 property를 비교한다. textarea 줄바꿈·single/multiple select·contenteditable 텍스트의 반환정의를 고정한다. checkbox file input 등 지원 타입 포함 여부를 명시하고 비지원 요소를 빈값으로 숨기지 않는다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### locator.isVisible

- 해당 REQ: REQ-LOCATOR-ISVISIBLE-001, REQ-LOCATOR-ISVISIBLE-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: display:none/visibility:hidden·collapse/opacity:0/zero box/closed details/hidden ancestor/화면밖/overlay의 true·false 표를 확정한다. slot의 composed 조상을 포함하고 count0과 stale ref가 false가 아닌 오류인지 판정한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### locator.isEnabled

- 해당 REQ: REQ-LOCATOR-ISENABLED-001, REQ-LOCATOR-ISENABLED-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: disabled fieldset의 첫 legend 내부/두번째 legend/외부, optgroup/option disabled와 aria-disabled 조상 전파를 표로 확정한다. readonly는 enabled true일 수 있음을 확인하고 지원 안 되는 role은 기본 상태/오류 중 선택한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### locator.isEditable

- 해당 REQ: REQ-LOCATOR-ISEDITABLE-001, REQ-LOCATOR-ISEDITABLE-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: input type별(text/number/date/password/checkbox/file)·textarea·contenteditable true/plaintext-only/false와 aria-readonly의 행렬을 확정한다. fill의 지원 타입과 같은 판정표를 공유하고 input[type=number] invalid 문자열의 효과를 별도로 검증한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### locator.isChecked

- 해당 REQ: REQ-LOCATOR-ISCHECKED-001, REQ-LOCATOR-ISCHECKED-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: native checkbox/radio의 property와 aria-checked 충돌 시 우선순위, mixed/true/false/속성없음의 boolean을 표로 확정한다. mixed→false의 손실을 원문 속성 조회로 복구하고 role switch/지원 안 되는 role 결과를 명시한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### locator.boundingBox

- 해당 REQ: REQ-LOCATOR-BOUNDINGBOX-001, REQ-LOCATOR-BOUNDINGBOX-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: main/중첩frame의 border·positive scale/translate 및 양축scroll을 넣어 box의 CSS 좌표와 실제 hit를 독립 비교한다. 숨김 null과 count0 오류·zero-area box 정책을 나누고 unsupported transform은 좌표 반환 전 거절함을 판정한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### locator.click

- 해당 REQ: REQ-LOCATOR-CLICK-001, REQ-LOCATOR-CLICK-002
- Aside 관계/근거: direct; A-DOC-REPL, A-HIST-FRAME, A-HIST-SLOT. Locator click
- 확인 범위: click이 interactivity/DOM stability를 기다리고 필요시 scroll한다는 DOC. / 과거 slot 검색 오류·scale frame 업무변경0 HISTORICAL.
- 빠진 판정조건·반례·구체 제안: 중앙점만 overlay인 대상의 다른 클릭점 탐색 여부와 안정 판정 기준을 확정한다. clickCount2의 실제 click/dblclick 순서·button별 컨텍스트 메뉴 효과를 판정하고 사전 대상오류는0회, 입력중 오류는 trace·부분효과를 기록한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### locator.fill

- 해당 REQ: REQ-LOCATOR-FILL-001, REQ-LOCATOR-FILL-002
- Aside 관계/근거: direct; A-HIST-READONLY. Locator fill(과거 호출)
- 확인 범위: 과거 readonly 사례 rejected HISTORICAL; 집계는 상세 오류 원인을 생략.
- 빠진 판정조건·반례·구체 제안: input/textarea/contenteditable의 빈값·한글·emoji·줄바꿈과 mask/동기 revert/비동기 revert의 사후판정 시점을 고정한다. select/file/readonly/disabled는 입력0으로 거절하고 fill의 input/change 이벤트 의미를 press/type과 구분한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### locator.press

- 해당 REQ: REQ-LOCATOR-PRESS-001, REQ-LOCATOR-PRESS-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: focus A→B로 이동한 직후 key를 보내는 경우와 focus handler가 C로 빼앗는 경우를 구분한다. composed activeElement를 확인할 시점·실패 결과를 고정하고 사전 key 문법오류는 focus 이동도0인지 결정한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### locator.hover

- 해당 REQ: REQ-LOCATOR-HOVER-001, REQ-LOCATOR-HOVER-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: hover CSS/enter·leave 이벤트의 대상과 실제 위치를 확인한다. 목표 중앙이 overlay·목표가 offscreen·움직이는 경우에서 scroll 허용/안정 timeout을 고정하고 실패 시 임의 대체점에 pointer를 보내지 않는다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### locator.focus

- 해당 REQ: REQ-LOCATOR-FOCUS-001, REQ-LOCATOR-FOCUS-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: tabindex=-1/disabled/input/Shadow 내부에 focus를 주고 composed activeElement로 확인한다. focus handler가 즉시 blur/다른 요소 focus하면 실패와 발생한 부분효과를 기록하고 스크롤은 브라우저 focus 효과로 허용하는지 명시한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### locator.scrollIntoView

- 해당 REQ: REQ-LOCATOR-SCROLLINTOVIEW-001, REQ-LOCATOR-SCROLLINTOVIEW-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: 가로+세로 중첩 scrollport 및 frame에서 대상 box와 각 scroller 전후 좌표로 노출을 판정한다. 노출의 최소 교차/완전 포함 기준과 scroll-behavior smooth 완료 기준을 정하고 sticky 가림은 click 보장과 분리한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### locator.setChecked

- 해당 REQ: REQ-LOCATOR-SETCHECKED-001, REQ-LOCATOR-SETCHECKED-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: 이미 true→true/false→false는 입력 event0을 확인한다. checked radio에 false 요청과 ARIA mixed에 true/false 요청의 지원/거절정책을 확정한다. handler revert·disabled·비체크형은 성공 상태를 꾸미지 않고 값·event 횟수를 판정한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### locator.selectOption

- 해당 REQ: REQ-LOCATOR-SELECTOPTION-001, REQ-LOCATOR-SELECTOPTION-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: 동일 value 복수 option, value와 다른 option label의 충돌, 중복 요청 value 및 []의 비우기 의미를 확정한다. 모든 요청 사전 검증 후 변경하고 single select에 복수·disabled optgroup은 기존 selection·event0을 확인한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### locator.dragTo

- 해당 REQ: REQ-LOCATOR-DRAGTO-001, REQ-LOCATOR-DRAGTO-002
- Aside 관계/근거: direct; A-HIST-DRAG. Locator dragTo(과거 호출)
- 확인 범위: 과거 audit에서 drag 서버PASS; 단일 호출에서 accepted 이벤트2개 HISTORICAL.
- 빠진 판정조건·반례·구체 제안: native draggable와 pointer 격자 각각 dragstart/drop·서버 업무카운트로 판정한다. 동일 Page 다른 frame(동일process 포함)과 다른 CDP target을 사전 구별하고 source=target 정책·중간실패 후 button 상태 및 drop 중복0을 명시한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### locator.drop

- 해당 REQ: REQ-LOCATOR-DROP-001, REQ-LOCATOR-DROP-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: files/data 함께 전달 시 MIME 충돌과 파일항목 순서를 정한다. text/plain·text/html·빈 문자열 값/빈 MIME·잘못된 record를 입력표로 고정하며 isTrusted=false를 한계로 안내하고 실제 File bytes·임시노드0·drop1을 확인한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### mouse.move

- 해당 REQ: REQ-MOUSE-MOVE-001, REQ-MOUSE-MOVE-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: 현재 viewport의 음수/바깥 유한 좌표를 허용/거절 중 확정한다. iframe 위 위치에서 clientX/Y·composed target과 down 지속 buttons를 trace로 판정하며 NaN/Infinity에서 pointer 이동0을 확인한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### mouse.down

- 해당 REQ: REQ-MOUSE-DOWN-001, REQ-MOUSE-DOWN-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: left/right/middle 각각의 buttons 비트와 후속 move의 지속을 확인한다. 동일 button 중복 down을 충돌로 거절할지 명시하고 clickCount 0/소수/음수와 기존 다른 down 보존을 검증한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### mouse.up

- 해당 REQ: REQ-MOUSE-UP-001, REQ-MOUSE-UP-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: 누르지 않은 button up의 멱등 결과(무전송 true/구분 오류)를 고정한다. left/right 동시 down 후 left up이 right를 보존하고 click 새 발생0인지 trace로 판정한다. release 전송 실패의 잔류 표기를 확인한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### mouse.click

- 해당 REQ: REQ-MOUSE-CLICK-001, REQ-MOUSE-CLICK-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: down/up/click 순서를 버튼·clickCount별로 확인하고 단일 API 내 down 후 실패를 주입해 자신이 획득한 button만 release하는지 판정한다. 기존 명시 down 충돌은 전송0이며 좌표 사전오류 때 focus/활성화도 변경하지 않는다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### mouse.wheel

- 해당 REQ: REQ-MOUSE-WHEEL-001, REQ-MOUSE-WHEEL-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: pointer가 main/중첩 scroller/OOPIF 위인 세 경우의 실제 wheel target·delta를 확인한다. 양축·RTL·끝·preventDefault·scroll chaining에서 전달 성공과 실제 이동량/로드량을 분리한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### keyboard.down

- 해당 REQ: REQ-KEYBOARD-DOWN-001, REQ-KEYBOARD-DOWN-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: modifier 별 event.key/code/location과 repeat down의 repeat 처리정책을 고정한다. 명시 down 뒤 다른 key와 type에 전달되는 modifier 및 다른 세션 소유 접근 실패를 trace로 판정한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### keyboard.up

- 해당 REQ: REQ-KEYBOARD-UP-001, REQ-KEYBOARD-UP-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: 두 modifier 중 하나만 해제해 나머지 상태가 다음 입력에 남음을 검증한다. 미보유 key up의 반환·전송정책을 정하고 reset/close 시 실패주입의 실제 release 잔류/불확실을 표시한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### keyboard.press

- 해당 REQ: REQ-KEYBOARD-PRESS-001, REQ-KEYBOARD-PRESS-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: Control+A 문법·별칭·OS별 Meta/Control 의미·알 수 없는 조합을 guide의 유한 목록으로 확정한다. 기존 modifier down vs 새로 획득한 modifier를 구분하여 주키 실패 후 cleanup trace를 판정한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### keyboard.type

- 해당 REQ: REQ-KEYBOARD-TYPE-001, REQ-KEYBOARD-TYPE-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: 선택 범위가 있는 input·textarea·contenteditable에서 한글/emoji/CRLF/빈문자열을 전달하고 최종값을 판독한다. input의 newline 처리와 readonly/non-editable focus에서 API 성공이 insertText 전달만 뜻하는지 명확히 한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### locator.waitFor

- 해당 REQ: REQ-LOCATOR-WAITFOR-001, REQ-LOCATOR-WAITFOR-002
- Aside 관계/근거: direct; A-HIST-DRAG. Locator waitFor(과거 호출)
- 확인 범위: 과거 drag 후 텍스트 완료대기 문법이 실행됨 HISTORICAL.
- 빠진 판정조건·반례·구체 제안: 현재0/1/N 표를 유지하고 state가 대기 중 바뀌는 순서(0→2→1, visible→detach)를 판정한다. timeout 총예산·ref detach 즉시stale·navigation CSS 재평가·관찰 scroll0을 검증한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### page.waitForEvent

- 해당 REQ: REQ-PAGE-WAITFOREVENT-001, REQ-PAGE-WAITFOREVENT-002, REQ-PAGE-WAITFOREVENT-003
- Aside 관계/근거: direct; A-DOC-REPL. Page download 이벤트 wait
- 확인 범위: download waiter를 action 전에 등록하는 공개 예제 DOC.
- 빠진 판정조건·반례·구체 제안: download 예제만으로 popup/chooser/dialog/close를 일반화하지 않는다. 5종 각각 등록지연→action ordering·두 waiter 충돌·timeout/reset/close 경합의 terminal1·다른탭 소비0을 판정한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### page.waitForURL

- 해당 REQ: REQ-PAGE-WAITFORURL-001, REQ-PAGE-WAITFORURL-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: 문자열의 URL 정규화/percent encoding/trailing slash·hash·redirect 경유URL vs 최종URL 처리정책을 고정한다. 현재일치는 즉시, SPA pushState도 관찰 가능함을 판정하며 glob처럼 보이는 문자열을 정확 URL과 구분한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### page.waitForFunction

- 해당 REQ: REQ-PAGE-WAITFORFUNCTION-001, REQ-PAGE-WAITFORFUNCTION-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: settled truthiness/비중첩 polling 기존 상세규범을 유지한다. 첫 poll 시점과 polling 간격·전체deadline 우선순위를 정하고 arg는 한 번 복사되는지 navigation 재평가 시 동일값인지 판정한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### page.waitForLoadState

- 해당 REQ: REQ-PAGE-WAITFORLOADSTATE-001, REQ-PAGE-WAITFORLOADSTATE-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: loading→interactive→complete를 조절하는 fixture로 현재상태 즉시반환/이후상태 대기를 판정한다. domcontentloaded 별칭과 새 navigation 도중 어느 document를 따르는지 명시하며 networkidle은 즉시 입력오류로 확인한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### locator.setFiles

- 해당 REQ: REQ-LOCATOR-SETFILES-001, REQ-LOCATOR-SETFILES-002, REQ-LOCATOR-SETFILES-003
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: 기존 공통 파일 문법·32MiB를 유지한다. input 아닌 요소/disabled file input/동일파일 재선택/[] 비우기에서 change 발생정책·메타데이터 순서를 확정하고 업로드 서버 hash를 독립 판독한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### chooser.setFiles

- 해당 REQ: REQ-CHOOSER-SETFILES-001, REQ-CHOOSER-SETFILES-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: 실제 input identity가 다른 연속 chooser A/B를 만들고 A 소비 후 재사용이 B 파일을 바꾸지 않는지 판정한다. multiple/file engine은 공유하되 chooser 취소/페이지탐색/이벤트경합의 stale 시점을 명시한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### download.save

- 해당 REQ: REQ-DOWNLOAD-SAVE-001, REQ-DOWNLOAD-SAVE-002
- Aside 관계/근거: composition; A-DOC-REPL. Download.path + fs 검증 또는 saveAs 아티팩트 복사
- 확인 범위: 브라우저 download.path의 실제 완료파일은 현재 REPL 세션에서 읽기 가능 DOC. / saveAs는 명시 artifact 복사가 필요할 때만; one-shot은 같은 command 내 검증 DOC. / POST/blob/redirect는 가능할 경우 브라우저 download handling; 안전한 직접 GET/HEAD fetch와 구분 DOC.
- 빠진 판정조건·반례·구체 제안: 기존 상세대기/멱등 요구는 충분히 유지한다. 서버자산 hash·브라우저완료파일 hash와 filename MIME을 함께 판독하고 local 경로를 server 자산 경로로 혼동하지 않는다. 완료 후 reset 시 서버자산 생존/정리정책을 명시한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### download.cancel

- 해당 REQ: REQ-DOWNLOAD-CANCEL-001, REQ-DOWNLOAD-CANCEL-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: 이미완료·사용자취소·다른 interrupted 원인의 상태표를 유지한다. 취소→진행 save Promise의 종결관계와 마지막 chunk 경합에서 terminal을 무엇으로 관측하는지 명시하고 완료 파일 삭제0을 확인한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### dialog.accept

- 해당 REQ: REQ-DIALOG-ACCEPT-001, REQ-DIALOG-ACCEPT-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: alert/confirm/prompt 3종에서 accept(undefined)·빈문자열·Unicode prompt를 판정한다. nonprompt value 전달의 오류/무시 정책과 두번째 dialog가 떠 있을 때 첫핸들 재사용의 새 dialog 무변경을 확정한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### dialog.dismiss

- 해당 REQ: REQ-DIALOG-DISMISS-001, REQ-DIALOG-DISMISS-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: confirm은 false, prompt는 null, alert dismiss의 브라우저 처리결과를 UI marker로 판정한다. A dismiss→B dialog 발생 후 A 반복 dismiss가 B를 닫지 않고 명시 stale인지 확인한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### scope.evaluate

- 해당 REQ: REQ-SCOPE-EVALUATE-001, REQ-SCOPE-EVALUATE-002
- Aside 관계/근거: direct; A-DOC-REPL. Page evaluate 공개 언급
- 확인 범위: 정확 selector를 알 때 외에는 evaluate/content 피하라는 DOC에 메서드명 등장.
- 빠진 판정조건·반례·구체 제안: 동기/async·명시null·undefined·sparse array·DOM node·getter throw의 실패유형을 표로 고정한다. main/child marker와 arg 생략 null·closure 미전달을 판정하고 navigation 후 자동 재실행0·사용자 부분효과 보존을 확인한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### locator.evaluateAll

- 해당 REQ: REQ-LOCATOR-EVALUATEALL-001, REQ-LOCATOR-EVALUATEALL-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: 0/1/N에서 callback 호출횟수1과 composed 순서를 검사한다. DOM이 callback 중 바뀌어도 전달한 배열의 고정 시점/연결상태 보장 범위를 정하고 shared JSON 규칙과 async settle·부분효과를 판정한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### page.logs

- 해당 REQ: REQ-PAGE-LOGS-001, REQ-PAGE-LOGS-002
- Aside 관계/근거: unknown; 직접근거 없음. 현재 공개 Aside guide와 기존 증거에서 정확 대응 미확인
- 확인 범위: 개별 공개계약 미확인.
- 빠진 판정조건·반례·구체 제안: 보관1000·since >·정확level 기존규범을 유지한다. page.navigate 후 같은 Page의 이전문서 로그 유지/구분정책과 at 동일밀리초 순서를 정하며 필터결과 빈배열에도 collection partial이 보존되는지 확인한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### console.log

- 해당 REQ: REQ-CONSOLE-LOG-001, REQ-CONSOLE-LOG-002
- Aside 관계/근거: direct; A-DOC-REPL, A-DOC-HELP. 명시 REPL 출력
- 확인 범위: 자신에게 값을 돌려받으려면 항상 console.log 사용 DOC.
- 빠진 판정조건·반례·구체 제안: 여러 인자 문자열/객체/undefined/Error/순환값의 표시정책과 블록 순서를 고정한다. 호출 전후 JS 상태 및 page console 분리를 판정하고 텍스트 예산초과 뒤 다음 작은 로그가 남는지 정책을 정한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

### display

- 해당 REQ: REQ-DISPLAY-001, REQ-DISPLAY-002
- Aside 관계/근거: direct; A-DOC-REPL. REPL 전역 display
- 확인 범위: display 전역 존재 DOC.
- 빠진 판정조건·반례·구체 제안: 지원 PNG의 서명·MIME 불일치·잘못된 padding·0-byte·한이미지/합계/블록수 경계의 우선 오류를 정한다. before→display→after 순서와 전체 이미지 생략 뒤 실행 지속·다른요청 이미지 혼입0을 판정한다.
- 적용 판단: 기존 목적/오류 범위의 명확화 우선. 새로운 동작선택/숫자/타입 확대는 메인 결정 전 보류. 상세 미확인은 mapping.json unknownConditions 참조.

## 새 실측 우선순위와 경계

- P1: 공개문법 충돌(getTabs vs listBrowserTabs), snapshot showHidden/interactive 조합·ref 수명·scope 미일치 diff. 단, 브라우저 사용권 재배정 전 실행 금지.
- P1: 입력 안전성을 바꿀 수 있는 slot/scale frame/visible filter/nth의 현재 관측은 기존과 같은 fixture·predicate·server assertion으로만 필요 시 재확인. 기존 실패를 고치기 위해 fixture 기대를 낮추지 않는다.
- P1: download event/path의 실제 bytes와 one-shot 수명은 공개문서 기반 조합을 검증할 수 있으나 우리 server/local 자산 계약의 증거로 승격하지 않는다.
- P2: 나머지 unknown은 기능군별 최소 공개 안내 탐색 또는 기존 증거가 확보될 때 조사한다. 추측한 메서드를 우선 실행하지 않는다.

## 집계 주의

67 API+공통5의 모든 매핑은 존재하지만 조건별 근거확인률은 이 결과에서 산출하지 않았다. confirmedConditions는 좁은 DOC/HISTORICAL 주장이고 unknownConditions에 REQ 규범을 보수적으로 그대로 남겨 중첩을 허용한다. 메인이 conditionKey를 고정하고 각 직접 주장 적용조건을 대조해야 확인 분자를 계산할 수 있다. 새실측0, 과거 audit run은 여러 API로 재사용했어도 고유 run1이다. 문법재사용 예제는 이번 실행완료가 아니다.

## 1차 통합 형식 보완

메인 요청에 따라 mapping.json의72개 API/common 항목마다 evidenceClaims를 추가했다. confirmedConditions는 주장별 DOC/HISTORICAL sourceId·절/JSON경로·scope와 1:1 연결한다. 혼합 문장은 분할했고 INFERENCE는 confirmed에서 제외한다. locator.getAttribute의 하니스 문법은 실제 원본 개별동작을 직접 확인한 것으로 세지 않도록 confirmed에서 제거했다. 이 보완은 2차 교차검토 실행이 아니다.
