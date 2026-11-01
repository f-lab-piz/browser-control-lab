# Codex 조사 A · 2차 교차조사 / 설계 적용과 반례

기준 head `7c9851bb237e309b7507ca6fa1094b2b5135b71a`, 제품 baseline `700a6a06af3f97729327afaf9becb4ee29bb475b`. 2026-11-01. 조사 A의 제안이며 독립 최종 리뷰/메인 수용 판정이 아니다. 정본·제품·fixture·테스트 변경0, 새 browser/실측/원격 호출0이다.

외부3·내부64·공통5의 **184 REQ 부모규범과252 Cnn의 조건/준비/실행/판정**을 전부 읽었다. API 계약 입력/출력도 함께 확인했다. 아래10개는 기존 기능의 판정 공백/부모-사례 연결을 줄이는 후보이며 경쟁 기능을 가져오기 위한 MUST 확대가 아니다. 모두 미실행 검증 설계다.

## 후보

### C2A-01 · P2 · 재선언의 실제 결과를 선택하지 않은 채 guide에 위임한다

- 위치: `external/js.md:99-104`, `REQ-JS-003-C01`; 부모 `REQ-JS-003`. 공통 `REQ-C-RUNTIME-002-C01`과 연결.
- 발생 조건: 같은 persistent 세션에서 `let x=1` 뒤 `let x=2`, `const y=1` 뒤 `const y=2`, `var v=1` 뒤 `var v=2`를 각각 실행한다. 현재 판정은 “지원하는 변환/거절 정책을 명시”여서 선언을 var로 바꿔 x=2로 만드는 구현과 lexical redeclaration 오류로 x=1을 지키는 구현 모두 통과할 수 있다.
- 제안할 확정 규범: **호출 간 top-level lexical binding은 유지하고 같은 이름 let/const 재선언 및 var↔lexical 충돌은 구문/재선언 오류로 거절한다. 기존 binding 값과 무관 변수·다른 세션은 보존한다. 기존 var의 var 재선언/재할당은 허용한다. 선언종류를 자동 변환하지 않는다.** 선언 충돌이 있는 요청은 평가 시작 전 거절하며 그 요청의 선행문장 효과도0이다. guide에는 이 결과를 안내한다. 다른 정책을 택하려면 메인이 위 결과표를 대체해 명시 결정해야 한다.
- 판정 fixture: x/y/v와 unrelated=7, 두 세션을 준비한다. `marker++; let x=2` 충돌 요청에서 marker0·x1·unrelated7·타세션 불변, `var v=2`는 v2. 외부 접수/QuickJS 구문 오류와 runtime throw를 구분한다.
- 근거: 현재 Cnn의 결정 미완료 문구. Aside 원문은 const/let 지속 및 fresh names를 안내할 뿐 우리 변환 정책을 결정하지 않는다(`evidence/aside/current-repl-guide.txt`, Environment). Codex도 persistent라는 DOC만으로 재선언 결과를 확인하지 않았다.

### C2A-02 · P2 · '+' 키와 조합 구분자 문법에 아직 판정 규칙이 없다

- 위치: `internal/keyboard.press.md:42-47`, `REQ-KEYBOARD-PRESS-001-C02`; `REQ-KEYBOARD-DOWN-002-C01`, `REQ-LOCATOR-PRESS-002-C01`에도 같은 key parser를 적용해야 한다.
- 발생 조건: `press('+')`, `press('Control++')`, `press('Control+Shift+A')`, `press('Control+')`, `press('Control+Shift')`를 보낸다. 현재 “명시 규칙대로”라는 판정이 가리킬 문자열 분해 규칙/지원 키 목록은 정본에 없다. 빈 token을 거절하면 '+' 자체도 잘못 거절할 수 있다.
- 제안할 확정 규범: **단독 '+'는 literal plus 주키로 처리한다. 조합은 지원 modifier 0개 이상+주키 정확히1개다. modifier 뒤 최종 '++'는 plus 주키 1개를 뜻한다(`Control++`). 다른 빈 token·주키 없는 modifier-only·주키2개·알 수 없는 key는 사전 오류다. modifier down은 선언 순서, 주키 down/up 후 새 modifier는 역순 해제한다.** 기존 명시 down은 유지한다. v1 제안 표는 modifier=Control/Alt/Shift/Meta(철자 대소문자 구분·별칭 없음), 주키=단일 printable ASCII 문자(U+0020..U+007E) 또는 Enter/Tab/Escape/Backspace/Delete/ArrowLeft/ArrowRight/ArrowUp/ArrowDown/Home/End/PageUp/PageDown이다. down/up은 modifier 또는 이 주키를 받으며 press의 조합에는 주키가 필요하다. 공통 표 한 곳을 down/up/press/locator.press가 참조한다. 표 밖은 미지원 키 오류다. OS별 Meta↔Control 자동 치환은 하지 않는다. 이 표는 설계 제안이며 현재 제품 지원을 좁히는 호환성 약속으로 자동 적용하지 않고 메인이 기존 업무 필요와 대조한다.
- 판정 fixture: key/code/ctrlKey/shiftKey/keyup 순서를 기록한다. '+', Control++, Control+Shift+A의 요청 구성을 각각 확인하고 나머지 불량은 focus/keydown 변화0. 기존 Control down을 둔 경우 새 Shift만 정리한다.
- 근거: 현재 Cnn 준비에 '+'가 있으나 기대값이 외부 미정 문구에 의존한다. Aside key grammar와 Codex 지속 modifier는 미확인이므로 경쟁 문법을 그대로 가져오지 않는다.

### C2A-03 · P2 · wait timeout의 타입·단위와 총 deadline 계산을 공통으로 확정해야 한다

- 위치: `REQ-LOCATOR-WAITFOR-002-C01`, `REQ-PAGE-WAITFORURL-002-C01`, `REQ-PAGE-WAITFORLOADSTATE-002-C01`, `REQ-PAGE-WAITFORFUNCTION-001-C01`, `REQ-PAGE-WAITFOREVENT-003-C01`; 각 API 입력표의 `positive ms`, 공통 `REQ-C-RUNTIME-004-C01`.
- 발생 조건: timeout을 `true`, `'10'`, `Infinity`, `0.5`, `undefined`, 0으로 보낸다. arming ack가 지연된 event wait에100ms를 주거나 외부 js는50ms·내부 wait는1000ms로 둔다. 양수만으로는 유한 정수/강제변환/등록시간 포함 여부가 결정되지 않는다.
- 제안할 확정 규범: **명시 timeout은 유한 양의 정수 number(ms)만 허용하고 문자열/boolean/NaN/Infinity/0/음수/소수는 polling·등록·입력 전에 거절한다. 생략 또는 undefined는 API별 기존 기본값(waitFor5000ms, page waits10000ms)을 쓴다. 총 deadline은 JS에서 해당 wait를 호출한 시각부터 계산하여 queue/arming/setup/poll/settle을 모두 포함하며, 유효 deadline은 이 값과 바깥 js deadline 중 이른 값이다. 새 poll/navigation 재평가/arming 재시도로 연장하지 않는다.** 새 timeout 옵션을 추가하지 말고 현재 옵션명 timeout을 유지한다.
- 판정 fixture: 타입별 사전오류/host 등록0, 제어 가능한 adapter clock로 ack delay60ms+event60ms인100ms wait는 timeout, outer50ms는 실행취소로 먼저 종결, late event/settle 누수0. 실제 wall time assertion은 scheduler 허용오차를 별도 두고 deadline 비교는 제어 clock으로 판정한다.
- 근거: 이미 존재하는 기본기간/총deadline/arming 요구를 공통화한다. Codex timeoutMs와 Aside timeout 문법 차이는 우리 이름/정수 정책의 근거가 아니다.

### C2A-04 · P2 · 접근 이름의 우선순위가 없으면 role/label의 정답 집합이 다르다

- 위치: `REQ-SCOPE-GETBYROLE-001-C01/C02`, `REQ-SCOPE-GETBYROLE-002-C01`, `REQ-SCOPE-GETBYLABEL-001-C01/C02`, `REQ-C-SELECTION-005-C01`.
- 발생 조건: 한 제어에 native label='Native', aria-label='ARIA', aria-labelledby='b a'가 동시에 있고 #a='Alpha', #b='Beta'다. 현재 각 경로 지원은 있지만 어떤 이름으로 검색되는지, IDREF 순서/일부 누락/순환/빈 소스의 결과가 없다. 단순 name 미지정/빈name과 후보별 이름을 비교하는 oracle을 고정할 수 없다.
- 제안할 확정 규범: **현재 지원 제어 범위에서 유효한 aria-labelledby 참조 텍스트를 IDREF 선언 순서로 공백 연결→비어 있지 않은 aria-label→연결 native label들의 문서순서 텍스트→그 역할에서 허용한 composed 본문 순으로 이름을 하나 계산한다. 유효참조가 하나도 없으면 다음 소스로 fallback하며, 일부 유효면 유효참조만 사용한다. IDREF 중복은 첫 항목만, 순환 참조 분기는 빈 기여로 종료한다. 공통 공백정규화를 적용한다.** getByRole는 이 최종 이름을 검색하고, getByLabel는 명시 ARIA/native label 소스가 있는 제어에 한해 같은 명시 이름을 검색한다(일반 본문 fallback으로 비연결 label을 만들지 않음). 직접 연결한 native label/aria-labelledby 참조 본문은 CSS/ARIA 숨김 여부와 무관하게 이름 소스로 읽고 script/style/noscript/template은 제외한다(검색 본문의 aria-hidden 제외와 의도적으로 분리). 대상 자체의 hidden 포함 여부는 includeHidden이 결정한다. native 요소별 alt/title 등의 추가 이름 소스는 이번 후보로 full AX 전체 지원을 확대하지 않고 기존 지원 범위 표에서 별도 관리한다.
- 판정 fixture: 위 제어는 'Beta Alpha'로만 명시 이름 검색, 잘못된 IDREF만 있는 제어는 ARIA, 유효labelledby+aria-label/native 충돌에서는 유효labelledby가 우선, nonlabel 일반본문은 getByLabel0. 숨김 참조 label 텍스트도 이름에 포함되되 hidden 대상은 기본 role 검색에서 제외함을 따로 판정한다.
- 근거: 접근 이름·본문·원문 분리라는 우리 요구의 oracle 공백이다. Aside regex/slot 실패와 Codex slot 과거성공은 우선순위/누락/순환을 결정하지 않는다. 이 후보의 최종 행렬은 메인이 기존 지원 범위를 확인해 채택/보류해야 하며 새로운 AX 전체 알고리즘 구현 요구로 해석하면 안 된다.

### C2A-05 · P2 · 입력 사후상태의 판독 시점이 없으면 임의의 미래 되돌림까지 실패로 읽힌다

- 위치: `REQ-LOCATOR-FILL-001-C02`, `REQ-LOCATOR-FILL-002-C02`, `REQ-LOCATOR-SETCHECKED-001-C02`, `REQ-LOCATOR-SELECTOPTION-001-C02`, `REQ-C-INPUT-004-C01`.
- 발생 조건: input/change handler가 동기로 값을 되돌리는 사례, queueMicrotask로 되돌리는 사례, API가 반환한 다음 setTimeout에서 바꾸는 사례를 나눈다. “실제 값이 요청과 다르면 실패”에 시점이 없으면 무한 미래의 변경을 감시하거나 임의 sleep을 넣어야 한다. 동기 재렌더로 같은 CSS 새 요소가 생겼을 때 어느 identity를 판독할지도 중요하다.
- 제안할 확정 규범: **사후상태를 약속하는 입력은 자신의 최종 입력 전송과 그 입력의 동기 handler·다음 microtask checkpoint가 끝난 뒤, 성공 반환 직전에 대상의 동일 document/element identity와 약속 상태를 한 번 다시 판독한다. 이 판독에서 mismatch는 상태미변경 오류, 대상 교체는 stale/부분효과다. 이후 timer/서버 update까지 영속 상태를 보장하지 않으며 같은 입력을 재전송하여 맞추지 않는다.** 이 관찰 시점을 공통 정본에 두고 fill/check/select/focus 사례는 링크한다.
- 판정 fixture: sync/microtask revert는 API 실패·실제 되돌린 상태·입력1회, 판독 이후 timer 변경은 API 당시에 성공했을 수 있고 별도 업무 관찰에서 바뀐 값을 기록한다. 동기 교체는 새 요소로 조용히 재바인딩하지 않는다. fixture의 timer gate는 테스트 하니스가 제어하고 API 응답 이후에만 해제해 경합 없는 oracle로 만든다.
- 근거: 기존 “API 상태 확인”과 “업무 완료 별도”를 시간 경계까지 적용하는 제안이다. Aside fresh snapshot 확인은 이 판독시점 계약을 입증하지 않으며, Codex readonly 보충관측도 masking 재검증 근거가 아니다.

### C2A-06 · P2 · goto의 모든 정상 URL에 새 document identity를 요구하면 hash 이동과 충돌한다

- 위치: `internal/page.goto.md:34-39`, `REQ-PAGE-GOTO-001-C01`; `REQ-PAGE-BACK-002-C02`, `REQ-PAGE-FORWARD-002-C02`, `REQ-C-DOMFRAMES-004-C01`, `REQ-C-SELECTION-006-C01`.
- 발생 조건: 현재 A에서 절대URL `A#section`으로 goto한다. same-document URL 변경은 기존 document를 유지할 수 있는데 C01은 “새 document identity”를 무조건 요구한다. 반대로 동일 URL reload는 별도 API가 있고 다른 문서로의 HTTP 탐색은 identity를 바꿔야 한다.
- 제안할 확정 규범: **goto 성공 준비는 요청으로 확정된 현재 URL/문서에 연결되고 해당 문서가 interactive 이상인 상태다. 브라우저가 same-document navigation으로 처리한 경우 document identity와 연결된 ref는 유지하며, 실제 document 교체가 일어난 경우에만 old document ref를 stale로 한다. URL 문자열 변경 자체를 문서 교체의 증거로 쓰지 않는다.** 같은 URL을 강제 재로딩하려면 기존 reload API를 사용한다.
- 판정 fixture: A→A#x는 URL 변경·document nonce동일·oldref유효, A→B는 nonce변경·oldrefstale, A.reload는 URL동일·nonce변경. 각각 다른 탭 입력0. 목적 URL이 redirect되면 이미 정한 최종문서를 판독한다.
- 근거: 정본 자체가 history에 hash/SPA 동일문서 이동을 인정하고 ref를 문서/요소 identity로 정의한다. 경쟁사 동작을 따르기 위한 범위 확장이 아니다.

### C2A-07 · P2 · 가변 event 중복 wait를 “이중발급 없음”만으로 판정하면 명시 충돌 거절을 빠뜨린다

- 위치: `internal/page.waitForEvent.md:57-62`, `REQ-PAGE-WAITFOREVENT-002-C01`; 부모 공통 `REQ-C-FILESEVENTS-005` 및 `REQ-C-FILESEVENTS-005-C01`.
- 발생 조건: 같은 Page에 dialog waiter 두 개를 등록한 뒤 dialog1개를 연다. 두번째를 영원히대기/timeout시키거나 다음 dialog로 queue해도 Cnn의 “같은 event 두 가변핸들 없음”은 만족하지만 부모의 소비 충돌 명시거절이 확인되지 않는다.
- 제안할 확정 규범: **같은 Page/세션에서 dialog 또는 filechooser 타입당 진행 중인 소비 waiter는1개만 허용한다. 두번째 동시 등록은 즉시 소비충돌 오류로 reject하고 첫 waiter의 등록·deadline을 바꾸지 않는다. 서로 다른 type, 다른 Page의 waiter는 허용한다. 첫 waiter가 종결/제거되면 같은 type을 다시 등록할 수 있다.** 등록중 arming 단계도 진행중에 포함한다. popup/download/close를 같은 가변소비 정책으로 자동 확대하지 않는다.
- 판정 fixture: arming 지연중 두번째 wait는 error1, first→event1 handle1, 첫 종결후 새 wait→event2 handle2. timeout/reset 뒤 late registration0. 다른Page/type는 계속 동작한다. error의 대소문자 코드명은 기존 의미분류 원칙대로 별도 대응표에 둘 수 있다.
- 근거: 부모 MUST와 상세 검증의 간극이다. Aside 공개download 예제/Codex chooser 예제는 중복소비 규범을 입증하지 않으며, 기존 API 조합만 사용한다.

### C2A-08 · P2 · clip이 viewport 밖으로 나갔을 때 crop/blank/error 중 결과가 정해져 있지 않다

- 위치: `REQ-PAGE-SCREENSHOT-003-C01`, `REQ-PAGE-SCREENSHOT-002-C01/C02`, 부모 `REQ-PAGE-SCREENSHOT-001/003`.
- 발생 조건: viewport가800×600인데 clip={x:790,y:590,width:20,height:20} 또는 x=800을 보낸다. 현재 음수/0/소수크기/비유한/병용만 거절한다. 교집합10×10, padding20×20, 캡처오류는 서로 다른 결과이며 요청 정수크기 약속과도 맞춰야 한다.
- 제안할 확정 규범: **clip의 양의 정수 width/height와 유한 비음수 x/y에 더해 요청 사각형 전체가 캡처 대상 viewport 안에 있어야 한다. x+width>viewportWidth 또는 y+height>viewportHeight는 입력/범위 오류로 거절한다. 임의 clamp/padding은 하지 않는다.** 기존 fractional position 정책은 바꾸지 않고 fractional size만 거절한다. 준비후 viewport가 변하면 기존 최대3회 정합성 정책으로 처리한다.
- 판정 fixture: 우하단에 서로 다른 색을 둔800×600 페이지에서 (790,590,10,10)은 정확10×10, 20×20과 x800은 오류/이미지없음. DPR1/2에서 같은CSS bounds. resize 경합은 invalid-input과 VIEWPORT_CHANGED를 어느 시점에서 판정했는지 trace에 기록한다.
- 근거: 기존 screenshot 의미의 미정 경계다. Aside PNG640×480/Codex JPEG320×240 과거값에서 이 정책을 추론하지 않는다.

### C2A-09 · P3 · scrollIntoView의 '노출'은 oversized target에서 판정 불가능할 수 있다

- 위치: `internal/locator.scrollIntoView.md:34-39`, `REQ-LOCATOR-SCROLLINTOVIEW-001-C01`; `REQ-LOCATOR-SCROLLINTOVIEW-002-C01`, 공통 `REQ-C-INPUT-002-C01`.
- 발생 조건:100px높이 scrollport 안의300px 대상, 또는 nested 가로/세로 scrollport에 걸친 대상이다. “각 관련 scrollport에서 대상 box가 노출”가 완전 포함인지 양의 교차면 충분한지 없다. 전체포함을 oracle로 택하면 oversized target은 어떤 스크롤로도 성공 불가다.
- 제안할 확정 규범: **성공은 각 관련 clipping scrollport와 main viewport에 대상의 가로/세로 교차 길이가 모두 양수인 상태다. 전체 box 포함·center 노출·overlay 제거·click 가능은 약속하지 않는다. 입력 전부터 노출되어 있으면 불필요 scroll 없이 성공한다.** 정렬의 정확offset은 판정대상에서 제외한다. DOM미존재는 기존 대상없음이며 스크롤로 임의 생성하지 않는다.
- 판정 fixture:300px 대상의 rect∩100pxport가 양의면적임을 독립 판독하고 eventclick0, hidden/없는 대상은 별도사전오류, sticky overlay는 제거하지 않는다. 이는 사용자 업무상 전체노출을 요구하는 API가 아니라 기존 최소 노출의 명확화 후보다.
- 근거: Aside mapping의 최소교차/완전포함 후보와 우리 Cnn를 대조했다. 공개 경쟁 scroll API가 이 의미를 제공한다는 주장은 없다. 메인이 최소노출보다 다른값을 원하면 이 후보를 기각하고 대체 oracle을 명시하면 된다.

### C2A-10 · P2 · contenteditable inputValue가 어떤 문자열인지 정하지 않았다

- 위치: `REQ-LOCATOR-INPUTVALUE-001-C01`, `REQ-LOCATOR-FILL-001-C01`, `REQ-KEYBOARD-TYPE-001-C02`; 공통 `REQ-C-SELECTION-005-C01`.
- 발생 조건: editor가 `<div>A</div><div>B</div>`와 숨김텍스트를 가진다. textContent는 AB계열, innerText는 줄바꿈이 있는 표시문자열이 될 수 있다. 현재 “정의한 본문 값/현재 문자열”이라고 하지만 그 정의가 없어서 독립 oracle·fill 반환검사가 선택에 따라 다르다.
- 제안할 확정 규범: **INPUT/TEXTAREA/SELECT는 현재 value property를, contenteditable은 element.innerText의 현재 문자열을 반환한다. contenteditable의 CRLF는 LF로 정규화하며 추가 trim/공백압축을 하지 않는다. 반환은 검색용 composed 본문이나 접근 이름이 아니다. raw DOM textContent는 기존 textContent API로 별도 읽는다.** fill/type의 지원 제어별 줄바꿈 기대값과 사후검증도 같은 현재값 정의를 참조한다. 이 규범은 제안이며 현재 구현이 이렇다고 주장하지 않는다.
- 판정 fixture: block/BR/숨김자식/인접span editor와 textarea를 나눠 독립 DOM.innerText/value를 oracle로 쓴다. ABC 선택범위삽입, 한글🙂, 개행, 빈문자열을 판정하되 getByText 공백정규화 결과를 inputValue 정답으로 쓰지 않는다.
- 근거: 부모의 value-vs-attribute 구분은 분명하지만 contenteditable branch가 미정이다. Aside 자료도 반환정의를 확정하라고 제안하고 있으며, Codex element.value 조합은 contenteditable 지원 근거가 아니다.

## 확대/중복을 피하기 위해 후보로 만들지 않은 사항

- Aside의 snapshot마다ref무효화와 우리의동일문서stable ref, Codex read-only와 우리의효과평가, 단일조회strict와 first-matched는 이미 의도된차이/미확인으로 기록되었다. 경쟁사와 같게바꾸자는 후보는 없다.
- role regex/visible filter/nth 음수/slot/frame/DnD 과거성패는 각 fixture범위다. 그 차이를 근거로 새API·더많은MUST를 만들지 않는다.
- 모든조합입력에 전역적인 오류우선순위를 새로 강요하지 않는다. 사전입력오류→전송0, 대상/문서/소유경계→다른대상무입력, 중도부분효과→trace/cleanup이라는 기존 단계가 우선이다. 복수사전오류에 허용한 의미분류가둘이면 하나의코드만oracle로고정하지 않는다. C2A-02/03/07은 이미 정한준비전검증/명시충돌의 실제결과만구체화한다.
- 공통계약은 API별로 복사하지 않는다. 위 수용후 키문법/timeout/접근이름/사후샘플링은 공통정본한곳+API Cnn링크로두고 상속조건분모를 재복제하지 않는다.
- 이미명시한 snapshot maxChars/maxNodes/bytes/depth·image출력4/8MiB·파일32MiB·download30/10초·waitFor0/1/N표·hash/SPA history·file source형식·dialog prompt/confirm/alert 결과에는 이번범위에서 추가필수충돌을 찾지 못했다. 새 경쟁 실측이 없다는 이유만으로 낮추지 않는다.
- S04의 공개업무predicate/유일성·동률·미로드·INCOMPLETE·120호출180초는 test-design에 구체화되어 있었다. 현재는 hidden-answer oracle이 필수인 과제로 보지 않는다. 기존 fixture 구현이 아직없으므로 이번문서조회로 S04 실행성공을 주장하지 않는다.

## 예제 보완 제안

경쟁사 호출 조각 자체와 우리제품 실행예제를 분리한다. C2A-02/03/05/07/10이 수용되면 우리제품 예제에 기존 API만 사용한 짧은 sequence를 더한다. 예를 들어 event는 `const p=page.waitForEvent('filechooser',{timeout:1000}); await upload.click(); const c=await p; await c.setFiles(...)`로 arming-before-action을 보여주고, 중복등록은 별도 negative 예제로두어 두번째wait의충돌을명시한다. 현재 Codex의 `timeoutMs`, Aside의 `timeout`, 우리의 `timeout`을 한문법처럼 합치지 않는다. 이 예제는 미실행/설계이며 모르는경쟁메서드를발명하지 않는다.

## 검토 범위와 한계

- 현재72정본의 입력/출력,184부모규범,252사례의 조건/준비/실행/판정을 배치별추출로전부읽었다. 반복상태/근거문구를 제거한 출력도 사용했고 잘린구간은 외부·탭/스냅샷·선택·입력·수명/파일·공통 배치로 나누어 다시읽었다. 아래 전체ID목록이 범위다.
- 6참고본문(runtime-output/selection-search/snapshot-frames/input-state/files-events/lifecycle-evaluation)의 대응관계·예제·근거주장·공백·우리판단을 읽었다. 긴 반복REQ문구/동일범위설명은 dedup했고 selection/input/files/lifecycle의claim문장은 별도추출로보충했다.
- Aside 원본 보존 main/repl/help 전체, sources/findings의 판단후보, mapping67+공통5의방법/제안/주장을읽었다. 장문읽기에서잘린 isEditable~scrollIntoView 구간은 별도로 다시읽었다. wrapper나 일반Playwright를 원본지원근거로 쓰지 않았다.
- REF1-01~03 메인수용기록과 15개가독성/상세화메모의수정사실을확인했다. 교정한 expected string, mouse scroll chaining, prompt/confirm/alert 및 depth≠frame recursion 구분을 새결함으로반복하지않았다.
- 제품/테스트소스·회사/개인사이트·새브라우저실측·fixture현재동작은 이번회차에서 읽거나 실행하지 않았다. 과거자료는 설계차이확인용이며 현재지원/실패의증거로승격하지않았다. 새로운C2A후보의fixture도전부미실행이다.
- 미독 REQ/Cnn 목록: 없음. 미검토: 제품수정가능성/구체성능/새fixture실측과 모든경쟁옵션의실제지원. 독립최종리뷰는별도 C의책임이며 이 보고서를승인으로세지않는다.

## 전체 읽은 ID 목록

- `external/guide.md` (sha256 `0692607f3ae3b40fd744edad7e12a4c4653e6e2c1f1b866e80ee2578dda76a68`)
  - REQ: REQ-GUIDE-001, REQ-GUIDE-002
  - Cnn: REQ-GUIDE-001-C01, REQ-GUIDE-001-C02, REQ-GUIDE-002-C01, REQ-GUIDE-002-C02
- `external/reset.md` (sha256 `a85fffa9d3f2c1c7ea44734ff170f7c2618f266c718caa3bde92cad4e99c056f`)
  - REQ: REQ-RESET-001, REQ-RESET-002, REQ-RESET-003
  - Cnn: REQ-RESET-001-C01, REQ-RESET-001-C02, REQ-RESET-002-C01, REQ-RESET-002-C02, REQ-RESET-003-C01
- `external/js.md` (sha256 `1c18c653584f3343922f364788007bbda5240927c1058307090f049af0945f45`)
  - REQ: REQ-JS-001, REQ-JS-002, REQ-JS-003
  - Cnn: REQ-JS-001-C01, REQ-JS-001-C02, REQ-JS-002-C01, REQ-JS-002-C02, REQ-JS-003-C01
- `internal/browser.list.md` (sha256 `41f597e2fc0a5ba12eec07f5a7a4824a010e5850738dd6a3697de709ac35a14f`)
  - REQ: REQ-BROWSER-LIST-001, REQ-BROWSER-LIST-002
  - Cnn: REQ-BROWSER-LIST-001-C01, REQ-BROWSER-LIST-001-C02, REQ-BROWSER-LIST-002-C01
- `internal/browser.tabs.md` (sha256 `003becf9ae07e2bbc22d65599b8729b59f7deefe7d6bd2fdc7becd5bd757e979`)
  - REQ: REQ-BROWSER-TABS-001, REQ-BROWSER-TABS-002
  - Cnn: REQ-BROWSER-TABS-001-C01, REQ-BROWSER-TABS-001-C02, REQ-BROWSER-TABS-002-C01
- `internal/browser.open.md` (sha256 `d13016fb909e572ccf1f8b20744650f881cf9f07a64a2b9fab0035d79b726fe4`)
  - REQ: REQ-BROWSER-OPEN-001, REQ-BROWSER-OPEN-002
  - Cnn: REQ-BROWSER-OPEN-001-C01, REQ-BROWSER-OPEN-001-C02, REQ-BROWSER-OPEN-002-C01, REQ-BROWSER-OPEN-002-C02
- `internal/browser.attach.md` (sha256 `fed762baa7b0d4b293287ee08f9f3ccb64e55ffbbea4482eeaa78b42f4120968`)
  - REQ: REQ-BROWSER-ATTACH-001, REQ-BROWSER-ATTACH-002
  - Cnn: REQ-BROWSER-ATTACH-001-C01, REQ-BROWSER-ATTACH-002-C01
- `internal/page.activate.md` (sha256 `dea227ea018f9d6cf6165e4ff0e21993743f2481da95f7bc56d19e12bc054f00`)
  - REQ: REQ-PAGE-ACTIVATE-001, REQ-PAGE-ACTIVATE-002
  - Cnn: REQ-PAGE-ACTIVATE-001-C01, REQ-PAGE-ACTIVATE-002-C01
- `internal/page.close.md` (sha256 `daf0bd246fe4ac565aea4736120ccfbeeed591a948a35fe0b3d08ee14582f2ab`)
  - REQ: REQ-PAGE-CLOSE-001, REQ-PAGE-CLOSE-002
  - Cnn: REQ-PAGE-CLOSE-001-C01, REQ-PAGE-CLOSE-002-C01
- `internal/page.goto.md` (sha256 `9dfbfd2f1298f5292a31c22e1fbe45d3781af583de07f7aaaa724e138bac339f`)
  - REQ: REQ-PAGE-GOTO-001, REQ-PAGE-GOTO-002
  - Cnn: REQ-PAGE-GOTO-001-C01, REQ-PAGE-GOTO-001-C02, REQ-PAGE-GOTO-002-C01, REQ-PAGE-GOTO-002-C02, REQ-PAGE-GOTO-002-C03
- `internal/page.back.md` (sha256 `dafc1ec31ac670642470742751f5f09d81e19841dec8726185ba74a5e88272b2`)
  - REQ: REQ-PAGE-BACK-001, REQ-PAGE-BACK-002
  - Cnn: REQ-PAGE-BACK-001-C01, REQ-PAGE-BACK-002-C01, REQ-PAGE-BACK-002-C02
- `internal/page.forward.md` (sha256 `22f416c27b5b201a2fc35d74f8cc6a20c25b3d1a2a81ef3472b7db85a31c4297`)
  - REQ: REQ-PAGE-FORWARD-001, REQ-PAGE-FORWARD-002
  - Cnn: REQ-PAGE-FORWARD-001-C01, REQ-PAGE-FORWARD-002-C01, REQ-PAGE-FORWARD-002-C02
- `internal/page.reload.md` (sha256 `f98b5f92728915dd3d77c6bc30ed5e9d082816aeb259f3a8a98c9d9f445617bc`)
  - REQ: REQ-PAGE-RELOAD-001, REQ-PAGE-RELOAD-002
  - Cnn: REQ-PAGE-RELOAD-001-C01, REQ-PAGE-RELOAD-002-C01, REQ-PAGE-RELOAD-002-C02
- `internal/scope.snapshot.md` (sha256 `4e9aab861d2b10ba3f404a38c2deb59d574359af1e42143a965d13485309f337`)
  - REQ: REQ-SCOPE-SNAPSHOT-001, REQ-SCOPE-SNAPSHOT-002, REQ-SCOPE-SNAPSHOT-003, REQ-SCOPE-SNAPSHOT-004, REQ-SCOPE-SNAPSHOT-005, REQ-SCOPE-SNAPSHOT-006, REQ-SCOPE-SNAPSHOT-007, REQ-SCOPE-SNAPSHOT-008, REQ-SCOPE-SNAPSHOT-009, REQ-SCOPE-SNAPSHOT-010, REQ-SCOPE-SNAPSHOT-011
  - Cnn: REQ-SCOPE-SNAPSHOT-001-C01, REQ-SCOPE-SNAPSHOT-002-C01, REQ-SCOPE-SNAPSHOT-003-C01, REQ-SCOPE-SNAPSHOT-003-C02, REQ-SCOPE-SNAPSHOT-004-C01, REQ-SCOPE-SNAPSHOT-004-C02, REQ-SCOPE-SNAPSHOT-005-C01, REQ-SCOPE-SNAPSHOT-005-C02, REQ-SCOPE-SNAPSHOT-006-C01, REQ-SCOPE-SNAPSHOT-007-C01, REQ-SCOPE-SNAPSHOT-008-C01, REQ-SCOPE-SNAPSHOT-009-C01, REQ-SCOPE-SNAPSHOT-010-C01, REQ-SCOPE-SNAPSHOT-011-C01
- `internal/page.screenshot.md` (sha256 `e3936324ce2f99ad2728987b64b1c8d9f66598d5c8939aa60a82cfff4ccd598d`)
  - REQ: REQ-PAGE-SCREENSHOT-001, REQ-PAGE-SCREENSHOT-002, REQ-PAGE-SCREENSHOT-003, REQ-PAGE-SCREENSHOT-004
  - Cnn: REQ-PAGE-SCREENSHOT-001-C01, REQ-PAGE-SCREENSHOT-002-C01, REQ-PAGE-SCREENSHOT-002-C02, REQ-PAGE-SCREENSHOT-003-C01, REQ-PAGE-SCREENSHOT-004-C01
- `internal/page.frames.md` (sha256 `ec3ed5f49d2b1d5ab791c1794139b97b8dfad846f7c14c88c70cfd30ca73ead2`)
  - REQ: REQ-PAGE-FRAMES-001, REQ-PAGE-FRAMES-002
  - Cnn: REQ-PAGE-FRAMES-001-C01, REQ-PAGE-FRAMES-002-C01
- `internal/page.frame.md` (sha256 `3ba441cd3f7bb56905d8cee330c8331c9c8d887c8bae367a4e12be7b9bf29617`)
  - REQ: REQ-PAGE-FRAME-001, REQ-PAGE-FRAME-002
  - Cnn: REQ-PAGE-FRAME-001-C01, REQ-PAGE-FRAME-002-C01
- `internal/scope.locator.md` (sha256 `0660e9664dcb20cef44a6fbf70a6d4c84e9b61cd895be9725ed5a94b47e63ab2`)
  - REQ: REQ-SCOPE-LOCATOR-001, REQ-SCOPE-LOCATOR-002
  - Cnn: REQ-SCOPE-LOCATOR-001-C01, REQ-SCOPE-LOCATOR-001-C02, REQ-SCOPE-LOCATOR-002-C01
- `internal/scope.getByRole.md` (sha256 `5472e365c6d158096b8b1f7ac95ae234aafd3f6297fa42336ba5e925a949c070`)
  - REQ: REQ-SCOPE-GETBYROLE-001, REQ-SCOPE-GETBYROLE-002
  - Cnn: REQ-SCOPE-GETBYROLE-001-C01, REQ-SCOPE-GETBYROLE-001-C02, REQ-SCOPE-GETBYROLE-001-C03, REQ-SCOPE-GETBYROLE-002-C01, REQ-SCOPE-GETBYROLE-002-C02
- `internal/scope.getByText.md` (sha256 `52f6a83cc39ea805b80de3c3abb5428a016b3ad56bfb46cceee1253f27c757b8`)
  - REQ: REQ-SCOPE-GETBYTEXT-001, REQ-SCOPE-GETBYTEXT-002, REQ-SCOPE-GETBYTEXT-003
  - Cnn: REQ-SCOPE-GETBYTEXT-001-C01, REQ-SCOPE-GETBYTEXT-001-C02, REQ-SCOPE-GETBYTEXT-002-C01, REQ-SCOPE-GETBYTEXT-002-C02, REQ-SCOPE-GETBYTEXT-003-C01
- `internal/scope.getByLabel.md` (sha256 `5a7ebce9e0452a40093bdb4a94478c364e269161c7ef3fa839e1c13e38f5529f`)
  - REQ: REQ-SCOPE-GETBYLABEL-001, REQ-SCOPE-GETBYLABEL-002
  - Cnn: REQ-SCOPE-GETBYLABEL-001-C01, REQ-SCOPE-GETBYLABEL-001-C02, REQ-SCOPE-GETBYLABEL-002-C01, REQ-SCOPE-GETBYLABEL-002-C02
- `internal/locator.filter.md` (sha256 `1bbd9d8228f122e9a2a32287555f84182c44760612c1c94531b0d12f10adeb27`)
  - REQ: REQ-LOCATOR-FILTER-001, REQ-LOCATOR-FILTER-002, REQ-LOCATOR-FILTER-003, REQ-LOCATOR-FILTER-004
  - Cnn: REQ-LOCATOR-FILTER-001-C01, REQ-LOCATOR-FILTER-001-C02, REQ-LOCATOR-FILTER-002-C01, REQ-LOCATOR-FILTER-002-C02, REQ-LOCATOR-FILTER-003-C01, REQ-LOCATOR-FILTER-004-C01
- `internal/locator.nth.md` (sha256 `9d1dda19b177f4ae8e7b7ef089379745e0cd5e8dffc0aa030c3714c26d472e71`)
  - REQ: REQ-LOCATOR-NTH-001, REQ-LOCATOR-NTH-002
  - Cnn: REQ-LOCATOR-NTH-001-C01, REQ-LOCATOR-NTH-002-C01
- `internal/locator.count.md` (sha256 `889b491352223d4b6764d78f6ed8737c85476f4d6da059dec49982b07ba34e6a`)
  - REQ: REQ-LOCATOR-COUNT-001, REQ-LOCATOR-COUNT-002
  - Cnn: REQ-LOCATOR-COUNT-001-C01, REQ-LOCATOR-COUNT-001-C02, REQ-LOCATOR-COUNT-002-C01
- `internal/locator.textContent.md` (sha256 `fde358ec8ba40e2858225d62c703aabf34debe2dc2ab3316d0110ea1aa699419`)
  - REQ: REQ-LOCATOR-TEXTCONTENT-001, REQ-LOCATOR-TEXTCONTENT-002
  - Cnn: REQ-LOCATOR-TEXTCONTENT-001-C01, REQ-LOCATOR-TEXTCONTENT-002-C01
- `internal/locator.getAttribute.md` (sha256 `b662313f6f594985c0d938b63ee3da3fb8fd3bdf84d9136d00245f3854dab852`)
  - REQ: REQ-LOCATOR-GETATTRIBUTE-001, REQ-LOCATOR-GETATTRIBUTE-002
  - Cnn: REQ-LOCATOR-GETATTRIBUTE-001-C01, REQ-LOCATOR-GETATTRIBUTE-002-C01
- `internal/locator.inputValue.md` (sha256 `2a7246ec2230312d9d4ea1ce5020bcdd3963cf1a70bf06dc73ed2571baabda5a`)
  - REQ: REQ-LOCATOR-INPUTVALUE-001, REQ-LOCATOR-INPUTVALUE-002
  - Cnn: REQ-LOCATOR-INPUTVALUE-001-C01, REQ-LOCATOR-INPUTVALUE-002-C01
- `internal/locator.isVisible.md` (sha256 `d6561e7d272ea87c545b7d4b9deaf21e2c59cae0691554e7ccb0c8eab75fac67`)
  - REQ: REQ-LOCATOR-ISVISIBLE-001, REQ-LOCATOR-ISVISIBLE-002
  - Cnn: REQ-LOCATOR-ISVISIBLE-001-C01, REQ-LOCATOR-ISVISIBLE-002-C01
- `internal/locator.isEnabled.md` (sha256 `4e94f70e27c0673fbcb3eb64991b84f01f6032d78d48d69fd7b645d88917a720`)
  - REQ: REQ-LOCATOR-ISENABLED-001, REQ-LOCATOR-ISENABLED-002
  - Cnn: REQ-LOCATOR-ISENABLED-001-C01, REQ-LOCATOR-ISENABLED-002-C01
- `internal/locator.isEditable.md` (sha256 `ab7584f68afc0511bb73e46b1dcf1222db4858c9ab09127b6b465ed4d592e859`)
  - REQ: REQ-LOCATOR-ISEDITABLE-001, REQ-LOCATOR-ISEDITABLE-002
  - Cnn: REQ-LOCATOR-ISEDITABLE-001-C01, REQ-LOCATOR-ISEDITABLE-002-C01
- `internal/locator.isChecked.md` (sha256 `36c0805380883cca74428da0b78da223e71843303c5ede0c13086251c01e8948`)
  - REQ: REQ-LOCATOR-ISCHECKED-001, REQ-LOCATOR-ISCHECKED-002
  - Cnn: REQ-LOCATOR-ISCHECKED-001-C01, REQ-LOCATOR-ISCHECKED-002-C01
- `internal/locator.boundingBox.md` (sha256 `323d6f853a47ca1439e86a813836ea5b91c8b5214f9217135266fb2181541b15`)
  - REQ: REQ-LOCATOR-BOUNDINGBOX-001, REQ-LOCATOR-BOUNDINGBOX-002
  - Cnn: REQ-LOCATOR-BOUNDINGBOX-001-C01, REQ-LOCATOR-BOUNDINGBOX-002-C01
- `internal/locator.click.md` (sha256 `f7c4571aaec093b145fa40b87c194e3f0bd2394eb09597cd70a090b68f8db14e`)
  - REQ: REQ-LOCATOR-CLICK-001, REQ-LOCATOR-CLICK-002
  - Cnn: REQ-LOCATOR-CLICK-001-C01, REQ-LOCATOR-CLICK-001-C02, REQ-LOCATOR-CLICK-001-C03, REQ-LOCATOR-CLICK-001-C04, REQ-LOCATOR-CLICK-002-C01, REQ-LOCATOR-CLICK-002-C02, REQ-LOCATOR-CLICK-002-C03, REQ-LOCATOR-CLICK-002-C04
- `internal/locator.fill.md` (sha256 `d92b1a4b7e6d6d52d1662d3bc29db64ac2d4e7937ee54c32654ec3777e4da4a6`)
  - REQ: REQ-LOCATOR-FILL-001, REQ-LOCATOR-FILL-002
  - Cnn: REQ-LOCATOR-FILL-001-C01, REQ-LOCATOR-FILL-001-C02, REQ-LOCATOR-FILL-002-C01, REQ-LOCATOR-FILL-002-C02, REQ-LOCATOR-FILL-002-C03
- `internal/locator.press.md` (sha256 `b1339c61cc5e45ea3c1bc2f3210675d86fd3e1fb351c165f530de0ac31ab86bd`)
  - REQ: REQ-LOCATOR-PRESS-001, REQ-LOCATOR-PRESS-002
  - Cnn: REQ-LOCATOR-PRESS-001-C01, REQ-LOCATOR-PRESS-001-C02, REQ-LOCATOR-PRESS-002-C01, REQ-LOCATOR-PRESS-002-C02
- `internal/locator.hover.md` (sha256 `dd7f748469433bd5e16857f111b7125223be68fd10c351f459cf8b0a82057408`)
  - REQ: REQ-LOCATOR-HOVER-001, REQ-LOCATOR-HOVER-002
  - Cnn: REQ-LOCATOR-HOVER-001-C01, REQ-LOCATOR-HOVER-002-C01
- `internal/locator.focus.md` (sha256 `48d1a72bb75d168bb26a94038f5987d34e66f3298b6dc1991a691bf518767202`)
  - REQ: REQ-LOCATOR-FOCUS-001, REQ-LOCATOR-FOCUS-002
  - Cnn: REQ-LOCATOR-FOCUS-001-C01, REQ-LOCATOR-FOCUS-002-C01
- `internal/locator.scrollIntoView.md` (sha256 `2a496f1259cc143b0a942e672c2e1e220160e057e614df38a6298f7275ff59c4`)
  - REQ: REQ-LOCATOR-SCROLLINTOVIEW-001, REQ-LOCATOR-SCROLLINTOVIEW-002
  - Cnn: REQ-LOCATOR-SCROLLINTOVIEW-001-C01, REQ-LOCATOR-SCROLLINTOVIEW-002-C01
- `internal/locator.setChecked.md` (sha256 `14db2a4231643e223bd7a502dd8664db52393f277e4780529b2267681825083d`)
  - REQ: REQ-LOCATOR-SETCHECKED-001, REQ-LOCATOR-SETCHECKED-002
  - Cnn: REQ-LOCATOR-SETCHECKED-001-C01, REQ-LOCATOR-SETCHECKED-001-C02, REQ-LOCATOR-SETCHECKED-002-C01
- `internal/locator.selectOption.md` (sha256 `747200b4e8260459582ec63ecff9832bea231e8c401e865fe166e5a85f0570a0`)
  - REQ: REQ-LOCATOR-SELECTOPTION-001, REQ-LOCATOR-SELECTOPTION-002
  - Cnn: REQ-LOCATOR-SELECTOPTION-001-C01, REQ-LOCATOR-SELECTOPTION-001-C02, REQ-LOCATOR-SELECTOPTION-002-C01, REQ-LOCATOR-SELECTOPTION-002-C02
- `internal/locator.dragTo.md` (sha256 `867f4c93f0f549f224b5d2ac4d54412177004d67581b6f9860c392a88331a1ec`)
  - REQ: REQ-LOCATOR-DRAGTO-001, REQ-LOCATOR-DRAGTO-002
  - Cnn: REQ-LOCATOR-DRAGTO-001-C01, REQ-LOCATOR-DRAGTO-001-C02, REQ-LOCATOR-DRAGTO-002-C01, REQ-LOCATOR-DRAGTO-002-C02
- `internal/locator.drop.md` (sha256 `cccfba30131cfa5785f063e104234dc6f72e5c5ae515412767986abfcaeb51fb`)
  - REQ: REQ-LOCATOR-DROP-001, REQ-LOCATOR-DROP-002
  - Cnn: REQ-LOCATOR-DROP-001-C01, REQ-LOCATOR-DROP-001-C02, REQ-LOCATOR-DROP-002-C01, REQ-LOCATOR-DROP-002-C02
- `internal/mouse.move.md` (sha256 `e9e15dbd7612fd539aeafc3afd0e41ae3158c542874ae954873bfe84bca35221`)
  - REQ: REQ-MOUSE-MOVE-001, REQ-MOUSE-MOVE-002
  - Cnn: REQ-MOUSE-MOVE-001-C01, REQ-MOUSE-MOVE-002-C01
- `internal/mouse.down.md` (sha256 `25a9d0647aff467d3bd24008544943dec8a86c900f2874b8146f78b74c60f0d3`)
  - REQ: REQ-MOUSE-DOWN-001, REQ-MOUSE-DOWN-002
  - Cnn: REQ-MOUSE-DOWN-001-C01, REQ-MOUSE-DOWN-002-C01
- `internal/mouse.up.md` (sha256 `f1264c702ec039f0fc76ba37eac7de448247870a3bfe397d13e8876f93628bb7`)
  - REQ: REQ-MOUSE-UP-001, REQ-MOUSE-UP-002
  - Cnn: REQ-MOUSE-UP-001-C01, REQ-MOUSE-UP-002-C01
- `internal/mouse.click.md` (sha256 `aaa6b2a29e95d0ec8cfba4ae5a163732d8d1b6e2655854d51211c60581a4d89b`)
  - REQ: REQ-MOUSE-CLICK-001, REQ-MOUSE-CLICK-002
  - Cnn: REQ-MOUSE-CLICK-001-C01, REQ-MOUSE-CLICK-002-C01, REQ-MOUSE-CLICK-002-C02
- `internal/mouse.wheel.md` (sha256 `291f65b78e72d3ce2fbac4293dc86de492e2686c373fceb6850bc6b9549f7a3a`)
  - REQ: REQ-MOUSE-WHEEL-001, REQ-MOUSE-WHEEL-002
  - Cnn: REQ-MOUSE-WHEEL-001-C01, REQ-MOUSE-WHEEL-002-C01, REQ-MOUSE-WHEEL-002-C02
- `internal/keyboard.down.md` (sha256 `e3bb0ab0aeeec394f89dd30af62b01d033c70e18917c6cb1b7196b3db7e22f5c`)
  - REQ: REQ-KEYBOARD-DOWN-001, REQ-KEYBOARD-DOWN-002
  - Cnn: REQ-KEYBOARD-DOWN-001-C01, REQ-KEYBOARD-DOWN-002-C01
- `internal/keyboard.up.md` (sha256 `383cc3504b33701cb4524ce7f77e066f8377b7bb9210e8445fe27de913757292`)
  - REQ: REQ-KEYBOARD-UP-001, REQ-KEYBOARD-UP-002
  - Cnn: REQ-KEYBOARD-UP-001-C01, REQ-KEYBOARD-UP-002-C01
- `internal/keyboard.press.md` (sha256 `2322a76e39854b2a7fd69f2c5a04f9721ac787e6d042caf3ab59260db3232d68`)
  - REQ: REQ-KEYBOARD-PRESS-001, REQ-KEYBOARD-PRESS-002
  - Cnn: REQ-KEYBOARD-PRESS-001-C01, REQ-KEYBOARD-PRESS-001-C02, REQ-KEYBOARD-PRESS-002-C01
- `internal/keyboard.type.md` (sha256 `49d5a1fdc93c679a1e224d9aaaeba1b82800b3ef89229e636ebd7c97dd9cbf74`)
  - REQ: REQ-KEYBOARD-TYPE-001, REQ-KEYBOARD-TYPE-002
  - Cnn: REQ-KEYBOARD-TYPE-001-C01, REQ-KEYBOARD-TYPE-001-C02, REQ-KEYBOARD-TYPE-002-C01, REQ-KEYBOARD-TYPE-002-C02
- `internal/locator.waitFor.md` (sha256 `515f369e98927a43a37f6440ec72244954dc1b58e5f081d4d82921f29570314d`)
  - REQ: REQ-LOCATOR-WAITFOR-001, REQ-LOCATOR-WAITFOR-002
  - Cnn: REQ-LOCATOR-WAITFOR-001-C01, REQ-LOCATOR-WAITFOR-002-C01, REQ-LOCATOR-WAITFOR-002-C02
- `internal/page.waitForEvent.md` (sha256 `4d35fdbdfe1aedfedd518aaec7f0c9836b3b1ec5d6b64530c0135ffa2d076a62`)
  - REQ: REQ-PAGE-WAITFOREVENT-001, REQ-PAGE-WAITFOREVENT-002, REQ-PAGE-WAITFOREVENT-003
  - Cnn: REQ-PAGE-WAITFOREVENT-001-C01, REQ-PAGE-WAITFOREVENT-002-C01, REQ-PAGE-WAITFOREVENT-002-C02, REQ-PAGE-WAITFOREVENT-003-C01
- `internal/page.waitForURL.md` (sha256 `4d32bca01b94c6a875fb73f2a6e2f2b720755fb7fe611fab08416e3d1fd462be`)
  - REQ: REQ-PAGE-WAITFORURL-001, REQ-PAGE-WAITFORURL-002
  - Cnn: REQ-PAGE-WAITFORURL-001-C01, REQ-PAGE-WAITFORURL-002-C01, REQ-PAGE-WAITFORURL-002-C02
- `internal/page.waitForFunction.md` (sha256 `3fecc27c027b0829354c84000ea7b0f8de1c975066e38f9c42c8889fdaf41d49`)
  - REQ: REQ-PAGE-WAITFORFUNCTION-001, REQ-PAGE-WAITFORFUNCTION-002
  - Cnn: REQ-PAGE-WAITFORFUNCTION-001-C01, REQ-PAGE-WAITFORFUNCTION-002-C01, REQ-PAGE-WAITFORFUNCTION-002-C02
- `internal/page.waitForLoadState.md` (sha256 `543758a43b3eb723ef13a007e887da1e37c8a7a7241f211a44cd31c872413443`)
  - REQ: REQ-PAGE-WAITFORLOADSTATE-001, REQ-PAGE-WAITFORLOADSTATE-002
  - Cnn: REQ-PAGE-WAITFORLOADSTATE-001-C01, REQ-PAGE-WAITFORLOADSTATE-002-C01
- `internal/locator.setFiles.md` (sha256 `6e038e082896d079de41f403012223203f96f79d49c19424090c78aeda25569e`)
  - REQ: REQ-LOCATOR-SETFILES-001, REQ-LOCATOR-SETFILES-002, REQ-LOCATOR-SETFILES-003
  - Cnn: REQ-LOCATOR-SETFILES-001-C01, REQ-LOCATOR-SETFILES-001-C02, REQ-LOCATOR-SETFILES-001-C03, REQ-LOCATOR-SETFILES-002-C01, REQ-LOCATOR-SETFILES-002-C02, REQ-LOCATOR-SETFILES-002-C03, REQ-LOCATOR-SETFILES-003-C01
- `internal/chooser.setFiles.md` (sha256 `a2a029bdc683dadd6e8570fd946d43ff4132012c0b8492c77e1073c9d1c3bc8b`)
  - REQ: REQ-CHOOSER-SETFILES-001, REQ-CHOOSER-SETFILES-002
  - Cnn: REQ-CHOOSER-SETFILES-001-C01, REQ-CHOOSER-SETFILES-002-C01, REQ-CHOOSER-SETFILES-002-C02
- `internal/download.save.md` (sha256 `ff17b744cf9f8080d4569c39492d73e176f255d87f78107fa19ac560e24c5a40`)
  - REQ: REQ-DOWNLOAD-SAVE-001, REQ-DOWNLOAD-SAVE-002
  - Cnn: REQ-DOWNLOAD-SAVE-001-C01, REQ-DOWNLOAD-SAVE-001-C02, REQ-DOWNLOAD-SAVE-002-C01, REQ-DOWNLOAD-SAVE-002-C02
- `internal/download.cancel.md` (sha256 `8e8bd26cdde23a00bec85099c72d06871a648cfdc43ad5c7cbe4655dad1c4947`)
  - REQ: REQ-DOWNLOAD-CANCEL-001, REQ-DOWNLOAD-CANCEL-002
  - Cnn: REQ-DOWNLOAD-CANCEL-001-C01, REQ-DOWNLOAD-CANCEL-002-C01
- `internal/dialog.accept.md` (sha256 `5553ccf4f592d9768542eced5edd7784c7f9a26f0cd1e0dbe4326f48c700f263`)
  - REQ: REQ-DIALOG-ACCEPT-001, REQ-DIALOG-ACCEPT-002
  - Cnn: REQ-DIALOG-ACCEPT-001-C01, REQ-DIALOG-ACCEPT-002-C01
- `internal/dialog.dismiss.md` (sha256 `84575a8f3aa6536142df0a95429ee6b5e5698ebc395199ea21ed07d593827707`)
  - REQ: REQ-DIALOG-DISMISS-001, REQ-DIALOG-DISMISS-002
  - Cnn: REQ-DIALOG-DISMISS-001-C01, REQ-DIALOG-DISMISS-002-C01
- `internal/scope.evaluate.md` (sha256 `d11d1a749ff229a32519c578d6e6094e2b666ce8123282dc9fd70d7d422d6765`)
  - REQ: REQ-SCOPE-EVALUATE-001, REQ-SCOPE-EVALUATE-002
  - Cnn: REQ-SCOPE-EVALUATE-001-C01, REQ-SCOPE-EVALUATE-001-C02, REQ-SCOPE-EVALUATE-002-C01, REQ-SCOPE-EVALUATE-002-C02
- `internal/locator.evaluateAll.md` (sha256 `6f582c212c138acba60f8594c99c4fb28d83a22bbadd96239def8f26770922d8`)
  - REQ: REQ-LOCATOR-EVALUATEALL-001, REQ-LOCATOR-EVALUATEALL-002
  - Cnn: REQ-LOCATOR-EVALUATEALL-001-C01, REQ-LOCATOR-EVALUATEALL-002-C01
- `internal/page.logs.md` (sha256 `f6a9c15c97a96913629321b6a272ff2e5a1d2f2450a18f735cdd1919418cf4aa`)
  - REQ: REQ-PAGE-LOGS-001, REQ-PAGE-LOGS-002
  - Cnn: REQ-PAGE-LOGS-001-C01, REQ-PAGE-LOGS-002-C01
- `internal/console.log.md` (sha256 `3e43132ef2b22647061e119e15c90b05add5e47f9d42fa368e90294ecf1e1ae5`)
  - REQ: REQ-CONSOLE-LOG-001, REQ-CONSOLE-LOG-002
  - Cnn: REQ-CONSOLE-LOG-001-C01, REQ-CONSOLE-LOG-002-C01, REQ-CONSOLE-LOG-002-C02
- `internal/display.md` (sha256 `6747c978abf7f42af60d1ce6fb7480e5aee86d6fa4b052101b484cd9fc40a874`)
  - REQ: REQ-DISPLAY-001, REQ-DISPLAY-002
  - Cnn: REQ-DISPLAY-001-C01, REQ-DISPLAY-002-C01
- `common/runtime.md` (sha256 `93eaf1ef36ed84c6a7e5284c90cd430d1ee2b2a4878bd112e7b53ce6470968b6`)
  - REQ: REQ-C-RUNTIME-001, REQ-C-RUNTIME-002, REQ-C-RUNTIME-003, REQ-C-RUNTIME-004, REQ-C-RUNTIME-005, REQ-C-RUNTIME-006, REQ-C-RUNTIME-007, REQ-C-RUNTIME-008
  - Cnn: REQ-C-RUNTIME-001-C01, REQ-C-RUNTIME-002-C01, REQ-C-RUNTIME-003-C01, REQ-C-RUNTIME-004-C01, REQ-C-RUNTIME-005-C01, REQ-C-RUNTIME-006-C01, REQ-C-RUNTIME-007-C01, REQ-C-RUNTIME-008-C01
- `common/dom-frames.md` (sha256 `a1ee529882d5457855f1a07b9272f91214b440226875d15e858a2f6f65238ec6`)
  - REQ: REQ-C-DOMFRAMES-001, REQ-C-DOMFRAMES-002, REQ-C-DOMFRAMES-003, REQ-C-DOMFRAMES-004, REQ-C-DOMFRAMES-005, REQ-C-DOMFRAMES-006
  - Cnn: REQ-C-DOMFRAMES-001-C01, REQ-C-DOMFRAMES-002-C01, REQ-C-DOMFRAMES-003-C01, REQ-C-DOMFRAMES-004-C01, REQ-C-DOMFRAMES-005-C01, REQ-C-DOMFRAMES-006-C01
- `common/selection.md` (sha256 `d7dbd6ccf16f4d6701f721ff48369d1a0c7c8f39d4adda126987882bb893f908`)
  - REQ: REQ-C-SELECTION-001, REQ-C-SELECTION-002, REQ-C-SELECTION-003, REQ-C-SELECTION-004, REQ-C-SELECTION-005, REQ-C-SELECTION-006
  - Cnn: REQ-C-SELECTION-001-C01, REQ-C-SELECTION-002-C01, REQ-C-SELECTION-003-C01, REQ-C-SELECTION-004-C01, REQ-C-SELECTION-005-C01, REQ-C-SELECTION-006-C01
- `common/input.md` (sha256 `27ddbd7ae4bbb109a1524b2c1a81f1bae4366255b8ee2a7241b91da7553947da`)
  - REQ: REQ-C-INPUT-001, REQ-C-INPUT-002, REQ-C-INPUT-003, REQ-C-INPUT-004, REQ-C-INPUT-005
  - Cnn: REQ-C-INPUT-001-C01, REQ-C-INPUT-002-C01, REQ-C-INPUT-003-C01, REQ-C-INPUT-004-C01, REQ-C-INPUT-005-C01
- `common/files-events.md` (sha256 `e9c92a8b4b2c8bcfa999c6270bfc2b827a8e1e4a51fc098b5eb48c168415925f`)
  - REQ: REQ-C-FILESEVENTS-001, REQ-C-FILESEVENTS-002, REQ-C-FILESEVENTS-003, REQ-C-FILESEVENTS-004, REQ-C-FILESEVENTS-005, REQ-C-FILESEVENTS-006, REQ-C-FILESEVENTS-007
  - Cnn: REQ-C-FILESEVENTS-001-C01, REQ-C-FILESEVENTS-002-C01, REQ-C-FILESEVENTS-003-C01, REQ-C-FILESEVENTS-004-C01, REQ-C-FILESEVENTS-005-C01, REQ-C-FILESEVENTS-006-C01, REQ-C-FILESEVENTS-007-C01

합계: 문서72 / 부모REQ184 / Cnn252. 시작고정SHA원문과읽은파일바이트일치확인.
