# 2차 교차조사 B · 설계 적용/요구 개선

고정 문서 head `7c9851bb237e309b7507ca6fa1094b2b5135b71a`, 제품 `700a6a06af3f97729327afaf9becb4ee29bb475b`. 2026-11-01. 이 문서는 메인 판단을 위한 후보이며 독립 최종 리뷰/제품 적합성 승인이 아니다. 정본·제품·테스트 변경0, 새 브라우저·새 실측·원본제품 소스 조사0, 원격 게시0이다.

공개 Codex IAB 문서·원본 Aside CLI 가이드·보충 Chrome CUA 관측을 교차 참고했다. 보충 Chrome 9사례를 IAB 지원으로 올리지 않았고 Aside 과거 실패/현재 문서 공백을 미지원으로 단정하지 않았다. 아래 수정안은 우리 사용자 필요와 현재 규범의 결정 가능성을 위한 **제안**이다. 경쟁 도구와 다르다는 이유로 버그/MUST를 만들지 않는다.

## 실제 읽은 범위

- 정본72문서의 계약 입력/출력,184 REQ 규범,252 Cnn의 조건·준비·실행·판정을 읽었다. 이전에 읽은 중복 상태/지원 문구는 중복 제거했고 현재 고정본의 규범/사례와 EDIT15 의미 변경은 다시 대조했다. 일부 대량 출력의 잘린 snapshot/evaluate/dialog 부분은 별도 읽기로 보충했다. 정확한 REQ/Cnn 목록·파일 hash는 `cycle2-read-manifest.json`에 보존한다.
- `reference-methods`의6본문72 reference에서 제품별 관계·예제 상태·방법·우리 판단을 읽었다. 반복 규범/미확인 목록은 정본 및 provider mapping과 함께 읽었다. Codex mapping의 API67+공통5 method/syntax/claim/제안/반례를 전부 교차검토했고 Aside의 같은72항목을 대조했다. source 위치는 관련 원문 발췌와 연결했다.
- Codex `sources.md`, `findings.md`(mapping과 중복 제안 포함), `raw/cua-entry-excerpts.md`, `raw/public-contract-excerpts.md`, `raw/file-uploads.md`, `raw/boundary1-observed.json`, `raw/review1-claim-audit.json`을 읽었다. raw boundary9사례와 public first/null 설명의 표면 차이를 유지했다. 이 자료에서 이름 충돌 우선순위·VM 재선언·우리 세션/asset 정책이 실측됐다고 쓰지 않는다.
- `reference-methods/decisions.md`, `reviews/cycle-1/review.md`, `reviews/cycle-1/decisions.md`와 `requirements/test-design.md`, `requirements/evidence/validation-method.md`를 읽었다. REF1-01..03의 분리/보존 원문과 EDIT-01..15의 실제 사례 변경을 확인했다.
- 미검토: 경쟁제품을 새로 호출한 결과/내부 구현, 기존 거대 raw/requirements-read.json 중복 전문, 모든 과거 실행 trace/픽셀/파일 바이트, 제품/테스트 구현 적합성. 고정본 이후의 메인/다른 조사자 편집은 이번 범위가 아니다. 368/504개의 지원 확인 또는 독립 리뷰 완료를 주장하지 않는다.

## 후보 요약

|ID|성격|핵심|추천 판단|
|---|---|---|---|
|C2B-01|설계 결정 필요|const/let 동명 재선언의 기대값 없음|lexical 재선언 거절을 확정하고 값/실행횟수 oracle 추가|
|C2B-02|설계 결정 필요|role/label의 충돌 이름 우선순위 없음|지원 소스 범위에서 유효 ARIA→label→본문 순서 확정|
|C2B-03|설계 결정 필요|지원 편집타입·native/ARIA 상태의 우선순위 없음|작은 공통 판정표를 확정, 전체 AX 확장 금지|
|C2B-04|설계 결정 필요|동시 waiter 충돌의 거절 대상/시점 미정|dialog/chooser 중복 등록 즉시 거절, 나머지는 공유 identity|
|C2B-05|설계 결정 필요|reset/timeout/Page close의 owner·handle·asset 수명 미정|종결 종류별 수명표와 idempotency namespace 결정|
|C2B-06|설계 결정 필요|파일 메타데이터·drop 빈값의 판정 미정|형식/기본값/empty record와 empty MIME value를 분리|
|C2B-07|설계 결정 필요|키 목록/조합 grammar가 미래 guide로 순환|v1 키 토큰/문자+·미지원 chord를 고정|
|C2B-08|설계 결정 필요|fill/check/focus의 사후 상태가 무한 미래 보장처럼 읽힘|반환 직전의 유한 관측 시점을 확정|
|C2B-09|일부 문구+판정 설계|click 안정 임계값과 정지한 대상만의 충돌|같은 임계값으로 판정하며 deterministic trace oracle 설계|
|C2B-10|문구/실행 표기만|ref.getAttribute·await browser.list가 실제 표현식과 다름|Locator 변환/호출 괄호를 명시, 새 API 금지|

## C2B-01 · lexical 재선언이 두 상반된 구현을 모두 수용할 수 있음

- 위치: `external/js.md` REQ-JS-001/003, **REQ-JS-001-C01, REQ-JS-003-C01**; `common/runtime.md` REQ-C-RUNTIME-002/C01. 현재 C01의 Then은 “지원하는 변환/거절 정책을 명시”라서 `let a`를 `var a`로 바꾸는 구현과 lexical SyntaxError 구현이 모두 통과한다. guide와 같다는 oracle만으로 사용자에게 다음 호출의 값을 예측할 계약이 없다.
- 구체 반례: 첫 호출 `let p=7; const q=8; var other=0;`, 둘째 호출 `let p=9; other++;` 뒤 p/other 조회. 변환이면 p9/other1, 거절이면 p7/other0이다. const 재대입 허용 여부까지 변환 선택에 따라 바뀔 수 있다.
- 선택할 규범 수정안(추천): “성공한 top-level let/const/var binding은 같은 세션 세대에서 유지한다. 같은 lexical 이름의 let/const/var 재선언은 구문/재선언 오류로 실행 전에 거절하며 기존 값과 다른 binding을 보존한다. let 재대입은 허용하고 const 재대입은 함수/실행 오류로 거절한다. 자동 var 변환은 하지 않는다. var→var 재선언은 허용한다.” 변환을 의도했다면 반대 정책도 가능하지만 그때 p/q/other의 정확한 기대값을 별도로 고정해야 한다.
- fixture 판정: 위3호출에서 p7/q8/other0; `p=10` 뒤10; `q=11` 뒤 오류/q8; 별도 세션에서 p 없음; reset 뒤 typeof p는 문자열 `undefined`. 재선언 앞에 있는 부작용 코드도 실행0임을 격리 counter로 판정한다. 이는 브라우저 업무 PASS 주입과 별개의 런타임 계약 사례다.
- 근거: Aside 공개 가이드는 const/let 지속과 fresh name을 안내할 뿐 이 재선언 결과 전체의 실측 근거가 아니다. Codex persistent 설명도 우리 lexical 변환 정책을 정하지 않는다. 상대 mapping `js.normativeProposal`의 조건 분해를 수용하되 기대값을 추가하는 **우리 설계**다. 경쟁 호환 때문에 변환을 MUST로 추가하지 않는다.

## C2B-02 · label/role 이름 소스가 충돌할 때 기대 집합을 고를 수 없음

- 위치: `scope.getByRole.md` **REQ-SCOPE-GETBYROLE-001-C01/C02**, `scope.getByLabel.md` **REQ-SCOPE-GETBYLABEL-001-C01/C02**, `common/selection.md` **REQ-C-SELECTION-005-C01**. 소스들을 나열하지만 같은 제어에 동시에 존재할 때의 우선순위, 빈/깨진 참조의 fallback, label과 role이 같은 이름 함수를 쓰는지 미정이다.
- 반례: `<label for=i>Visible</label>`, `<span id=x>Referenced</span>`, `<input id=i aria-label="ARIA" aria-labelledby="x">`. Referenced/ARIA/Visible 중 어느 query가 1인지 현재 Cnn은 판정하지 않는다. 두 ID `x y`, 중복 ID 참조, 존재하지 않는 ID만 있는 경우도 다르게 구현할 수 있다.
- 선택할 규범 수정안(추천, 현재 지원 소스에 한정): 유효한 `aria-labelledby` 참조 텍스트를 지정 ID 순서로 공백 정규화/결합 → 비어 있지 않은 `aria-label` → 연결 native label(여러 개면 문서 순서) → 해당 지원 role의 composed 본문 순서로 유효 이름을 하나 만든다. 전체가 비거나 참조가 전부 무효이면 다음 소스로 fallback한다. 순환 참조는 반복을 끊고 이름을 무한 재귀하지 않는다. getByRole name과 getByLabel의 지원 제어 이름은 이 함수를 공유할지 **메인이 선택**한다. 추천은 공유이며 이 경우 하위 우선순위 label 문자열로 우회 매칭하지 않는다. label을 원천별 합집합 검색으로 의도했다면 그 차이를 명시해야 한다.
- fixture 판정(추천 선택 기준): 위예제 role textbox/name Referenced 및 getByLabel Referenced 각각1, ARIA/Visible 각각0. labelledby 무효만 남기면 ARIA1; aria-label도 비우면 Visible1. x/y 문구가 First/Second면 `First Second` exact1, 역순0. 일반 p의 동일 텍스트는 label control0. 동일 유효 이름의 두 제어 fill은 strict·두 값 불변. 숨김 참조의 포함 정책은 이름과 검색 본문을 혼동하지 않도록 별도 한 행으로 결정한다.
- 근거: Codex Chrome B05는 label-for와 aria-labelledby가 **각각** 동작한 부분관측이며 동시 충돌 우선순위를 실측하지 않았다. Aside readonly catch도 label 우선순위의 증거가 아니다. 전체 AX 표준/모든 role/모든 native naming source를 새 MUST로 확대하지 않고 현재 나열된 범위의 유일 결과만 확정한다.

## C2B-03 · 편집/활성/체크 상태의 공통 표가 필요

- 위치: `locator.isEnabled.md` **REQ-LOCATOR-ISENABLED-001-C01**, `locator.isEditable.md` **REQ-LOCATOR-ISEDITABLE-001-C01/002-C01**, `locator.isChecked.md` **REQ-LOCATOR-ISCHECKED-001-C01**, `locator.fill.md` **REQ-LOCATOR-FILL-002-C01**, `common/input.md` **REQ-C-INPUT-004-C01**. “지원 텍스트 타입”과 “aria-disabled 정책”을 다시 미래 guide로 보내고 native checked/ARIA 충돌 시 우선순위를 선택하지 않는다.
- 반례: number/date/file input을 isEditable true로 반환하고 fill은 타입 오류인 구현; `input.checked=false`인데 `aria-checked=true`인 checkbox; `checked=true,indeterminate=true`인 native checkbox; `fieldset disabled` 내부 첫 legend의 input과 `aria-disabled=true` 조상 아래 input. 서로 다른 예상값이 가능하다.
- 선택할 규범 수정안(추천): v1 편집 타입을 입력 type 기본/text/search/tel/url/email/password, textarea, effective contenteditable로 먼저 열거한다. number/date/time/color/range/file 등은 이번 텍스트 편집 지원에서 제외할지 메인이 선택하고, 제외하면 isEditable false/fill 타입 오류로 통일한다. isEnabled는 native disabled/fieldset 첫 legend 예외를 적용하고 aria-disabled는 해당 요소 및 composed 조상 중 값 true가 있으면 false로 할지 확정한다. native readonly와 요소의 aria-readonly=true는 편집을 막되 readonly만으로 enabled=false로 만들지 않는다. ARIA boolean의 허용 문자열·정규화도 같은 표로 정의한다.
- 체크 상태 추천: native checkbox/radio는 checked property를 우선하고 ARIA로 덮지 않는다. native indeterminate는 checked와 별도이며 현재 boolean API의 “mixed=false” 문구는 ARIA mixed에 한정한다. custom 지원 role checkbox/switch/radio는 aria-checked=true만 true, false/mixed는 false로 정하고 mixed 원문은 getAttribute로 읽는다. native indeterminate 원문을 getAttribute로 읽을 수 있다는 약속은 하지 않는다. native mixed까지 false로 의도했다면 그 정책을 별도 표로 명시한다.
- fixture 판정: 위 input별 isEnabled/isEditable/fill 가능성의 동일 행렬, readonly attribute 문자열 false여도 native readonly property 기준, native checked/ARIA 충돌에서 property 값, ARIA mixed=false와 원문 mixed, 비체크형 타입 오류를 관측한다. 바이트/이벤트/값은 독립 읽기로 판독한다.
- 근거: 상대 Codex의 evaluate DOM property 조합은 INFERENCE이고 우리 상태 정책의 증거가 아니다. B08의0/N 비엄격 결과도 우리 strict를 바꾸는 이유가 아니다. 타입을 많이 지원하도록 강제하지 말고 이미 지원을 약속한 타입을 유한하게 정의한다.

## C2B-04 · 같은 가변 이벤트 waiter의 승자/실패 시점 미정

- 위치: `page.waitForEvent.md` **REQ-PAGE-WAITFOREVENT-002-C01/003-C01**, `common/files-events.md` **REQ-C-FILESEVENTS-004-C01/005-C01**. 부모는 충돌의 명시 거절을 요구하지만 Cnn은 두 핸들이 발급되지 않기만 하면 통과한다. 둘째를 pending 상태로 남겨 timeout시키는 구현, 첫째를 취소하는 구현, event 후 임의 승자 선택이 모두 남는다.
- 반례: 같은 Page에 p1=dialog wait, p2=dialog wait 후 버튼 한 번. p1/p2 중 누가 거절되는지 정하지 않으면 회복 코드가 새 dialog를 놓치거나 불필요한 timeout을 기다린다.
- 선택할 규범 수정안(추천): 같은 Page·세션·event 종류의 dialog/filechooser waiter는 동시 활성1개만 허용하고 두 번째 **등록 단계**에서 상태충돌로 즉시 reject한다. 기존 waiter의 arming/timeout은 유지한다. 첫 waiter가 terminal이면 다음 등록을 허용한다. popup/download/close 관찰 waiter는 같은 event identity/metadata를 각 waiter에 한 번 전달하는 공유 정책을 명시한다(다른 선택도 가능하지만 종류별 표가 필요). Download 핸들 공유 시 save/cancel은 기존 download identity 정책을 그대로 따른다. 공개 ready API는 추가하지 않는다.
- fixture 판정: 등록 ack를 제어하는 격리 adapter fixture에서 p1 ready→p2 reject→action→event→p1 resolve 순서를 확인한다. p2 오류가 page input을 발생시키지 않고 첫 dialog를 바꾸지 않음을 확인한다. timeout 직전/직후 두 event를 별도 시퀀스로 만들어 취소된 waiter가 다음 event를 먹지 않는지 판정한다. 단순 벽시계 동시발생을 기대 oracle로 삼지 않고 adapter terminal trace의 순서를 기준으로 한다.
- 근거: Codex/Aside 공개 download/chooser 사전등록 예제는 동시 소비 정책을 보장하지 않는다. 지금의 우리 부모 규범을 결정 가능하게 좁히는 제안이며 경쟁기능 추가가 아니다.

## C2B-05 · reset/timeout/개별 Page close의 수명표와 release 범위

- 위치: `external/reset.md` **REQ-RESET-001-C01/002-C01/003-C01**, `common/runtime.md` **REQ-C-RUNTIME-003-C01/005-C01/006-C01**, `common/input.md` **REQ-C-INPUT-003-C01**, `page.close.md` **REQ-PAGE-CLOSE-001-C01**, `browser.attach.md` **REQ-BROWSER-ATTACH-001-C01**, `download.save.md` **REQ-DOWNLOAD-SAVE-001-C02**. reset은 변수와 late 결과를 정하지만 기존 탭 owner·재attach·이미 완성된 asset·발급 download 핸들·requestId tombstone의 유지 범위가 없다. timeout의 새 세대 복구가 항상 VM reset인지도 모호하다.
- 반례1: 동일 세션에서 탭 A/B를 소유하고 B의 명시 Control/left down을 유지한 채 A.close. 부모 input003은 “close는 세션 소유 전체 release”라서 B의 입력도 끝낼 수 있다. 개별 Page close의 범위를 탭별로 생각한 사용자는 B의 진행 drag를 잃는다. 이는 현재 구현 오류 확정이 아니라 **부모 규범의 범위 선택 문제**다.
- 반례2: 다운로드를 server asset으로 저장한 뒤 reset; 동일 session fileId를 재업로드할 수 있는가? 같은 requestId를 reset 후 재전송하면 과거 입력을 다시 실행하는가? 양쪽 선택이 현재 Cnn에서 판정되지 않는다.
- 선택할 규범 수정안(추천 수명표): reset은 JS 세대를 새로 만들고 old Page/Frame/Locator/event 핸들은 invalid generation; 세션이 소유한 실제 탭은 닫지 않고 소유를 유지하며 같은 session attach로 새 세대 핸들을 얻는다. 완료 server asset은 session 동안 유지하고 타세션 접근은 계속 거절한다. timeout은 해당 실행을 취소하되 VM을 재생성했다면 generation 변경을 결과에 명시한다. 같은 session requestId의 종결 결과/tombstone은 세대를 넘어 유지해 old request가 재실행되지 않는다. 저장 완료 local 사용자 파일은 reset/close 때문에 삭제하지 않는다. 세션 제거 시점의 asset 정리는 별도 관리 정책으로 적는다.
- release 추천: Page close는 해당 Page/input target이 소유한 down만 정리, session reset은 세션 전체 정리로 나눈다. 이 선택을 수용하려면 부모 REQ-C-INPUT-003의 close 범위를 함께 고쳐야 한다. 기존의 close→세션 전체 release를 의도적으로 유지한다면 A.close가 B down을 종료할 수 있음을 guide/허용 부작용/Cnn에 명시하고 B 상태를 그대로 보존한다고 쓰지 않는다.
- fixture 판정: A/B·타세션 C에서 각 owner/down trace를 분리하고 A.close/reset 두 경로의 release 대상과 C 불변을 확인한다. reset 뒤 old handle 오류→self attach 성공→기존 URL/DOM 보존, asset hash 재사용, 동일 requestId의 old terminal 조회/입력 횟수1을 검사한다. 이 fixture는 다음 개발 설계이며 지금 실행하지 않았다.
- 근거: Codex reset의 탭 보존 DOC·Aside profile 변경 reset 안내는 참고 단서일 뿐 우리 owner/asset/tombstone 계약의 증거가 아니다. 새 session API나 공개 lifecycle 도구를 추가하지 않고 현재 관리 경로/세대 계약을 보완한다.

## C2B-06 · 파일 메타데이터/빈 MIME 값의 수용 조건을 고정해야 함

- 위치: `common/files-events.md` **REQ-C-FILESEVENTS-006-C01/007-C01**, `locator.setFiles.md` **REQ-LOCATOR-SETFILES-002-C01/003-C01**, `locator.drop.md` **REQ-LOCATOR-DROP-001-C01/002-C01**. source/bytes/base64는 상세하지만 제공된 name/mimeType의 타입과 MIME 유효 문법, data 빈값이 빈 record인지 빈 문자열 value인지 미정이다. 단순 “MIME 형식오류”만으로 구현별 허용 집합을 고를 수 없다.
- 반례: `{bytes:[],name:7,mimeType:7}`를 묵시 문자열화하는 구현; `{data:{"text/plain":""}}`를 빈 payload로 거절하거나 empty string MIME 항목을 전달하는 구현; files=[]+유효 data와 files=[] 단독의 차이.
- 선택할 규범 수정안(추천): 명시 name/mimeType은 문자열만 허용하고 생략만 기본값을 적용한다. name은 기존 basename/NUL 정책을 그대로 사용한다. MIME은 v1의 type/subtype 토큰 두 개·슬래시1개·공백/제어문자/매개변수 없음으로 검증하고 ASCII 소문자 정규화 여부를 명시한다(추천 정규화). IANA 등록 여부로 제한하지 않는다. data는 plain record의 own MIME 키→문자열 값이며 키1개 이상이면 payload가 있다. `""` value는 길이0인 데이터 항목으로 허용하고 `{}`와 구분한다. files=[] 단독은 drop에서 오류, files=[]+유효 data는 텍스트-only drop으로 허용한다. source 파일 형식/32MiB·순서/중복명 정책은 유지한다.
- fixture 판정: 유효0-byte 파일, name/mimeType 숫자/null/빈값/제어문자, `{}`, `{"text/plain":""}`, invalid MIME key, nonstring value, files[] 조합을 표로 나눠 전송 전 거절 시 drop/input event0·기존 선택 보존, 정상 text-only는 File 목록[]·정확 MIME 데이터·drop1을 판정한다.
- 근거: Codex chooser 경로/Aside path/fs 공개 가이드는 우리 inline payload/MIME 검증의 증거가 아니다. 이 제안은 새 파일 source나 새 API를 늘리지 않는다. MIME 매개변수를 반드시 지원하자는 확장도 아니다. 메인이 최소 문법을 택해야 한다.

## C2B-07 · 키 grammar의 “명시 규칙대로”가 실제 규칙으로 연결되지 않음

- 위치: `keyboard.down.md` **REQ-KEYBOARD-DOWN-001-C01/002-C01**, `keyboard.press.md` **REQ-KEYBOARD-PRESS-001-C02/002-C01**, `locator.press.md` **REQ-LOCATOR-PRESS-002-C01**. 입력은 guide의 지원목록을 참조하지만 개발 전 정본에 키 목록/alias/조합 grammar가 없고 Cnn은 문자+와 구분자+가 “명시 규칙대로”라고만 한다.
- 반례: `press("+")`, `press("Control++")`, `press("Control+key")`, `down("Control+A")`, `press("Control+Control+A")`의 예상 성공/거절을 fixture가 선택하지 못한다. Control+key는 placeholder인지 실제 key 토큰인지도 불명확하다.
- 선택할 규범 수정안(추천 최소 v1): down/up은 단일 modifier 또는 단일 키만, press는 modifier의 중복 없는 `+` 목록 뒤 주키 하나만 허용한다. 지원 named key 목록과 alias를 정본 표로 확정한다. 기본 예시로 Control/Alt/Shift/Meta, Enter/Tab/Escape/Backspace/Delete/Arrow*/Home/End/PageUp/PageDown 등을 쓰되 추가 F키/미디어키/ControlOrMeta 호환은 별도 채택 전 보류한다. 단독 `"+"`는 문자키로 허용, chord의 literal plus는 v1 미지원으로 사전 거절하고 `type("+")` 조합을 대안으로 안내할 수 있다. 더 넓은 `Control++` grammar를 택한다면 모호성 없는 parse 결과를 표로 고정한다.
- fixture 판정: 확정 표의 정상 토큰마다 실제 key/code/modifier trace, 빈/unknown/중복modifier/빈주키에서 focus/input0, 기존 down 보존. `Control+key` placeholder를 실제 `Control+A`로 바꾸고 단독 plus 입력의 최종 문자+와 이벤트를 판독한다.
- 근거: 두 경쟁표면의 locator press/type 이름이 같아도 우리 grammar/alias와 지속 modifier 소유는 미확인이다. 모든 Playwright key 별칭 호환을 새 MUST로 요구하지 않는다.

## C2B-08 · 사후 상태 확인의 유한 시점이 없어 무한 미래를 증명할 수 있음

- 위치: `common/input.md` **REQ-C-INPUT-004-C01**, `locator.fill.md` **REQ-LOCATOR-FILL-001-C02/002-C02**, `locator.setChecked.md` **REQ-LOCATOR-SETCHECKED-001-C02**, `locator.focus.md` **REQ-LOCATOR-FOCUS-001-C01**, `locator.selectOption.md` **REQ-LOCATOR-SELECTOPTION-001-C02**. 요청 상태를 실제 확인해야 한다는 규범은 타당하지만 동기 handler·microtask·나중 서버 갱신을 모두 같은 “되돌리면 실패”로 읽으면 유한한 API가 성공 시점을 정할 수 없다.
- 반례: input handler가 즉시123→12로 바꾸는 제어와, fill 반환을 확인한 뒤 별도 페이지 action이123→12로 바꾸는 제어. 후자는 이미 완료한 fill의 결과를 소급 실패로 바꿀 수 없다. 임의 sleep50ms/500ms를 넣으면 fixture 실행속도마다 결과가 달라진다.
- 선택할 규범 수정안(추천): 각 API가 내보내는 입력/이벤트 처리 뒤 반환 직전에 선택 문서/요소 identity와 약속 상태를 다시 읽는다. 이 완료 관측에서 요청값/checked/selected/focus가 달라지면 실패이며 실제 부분효과를 보고한다. 완료 이후의 독립적인 페이지/서버 변경까지 지속 보장하지 않는다. 동기 및 해당 이벤트가 예약한 microtask 변형은 다음 관측 전에 반영되도록 판정하고 macrotask 이후 변화는 별도 업무 상태로 기록한다. 어떤 이벤트를 발행하는지와 읽기 순서를 API별 표로 고정한다.
- fixture 판정: 격리 제어1은 동기 revert,2는 queueMicrotask revert로 완료 전 불일치를 만들고 오류/실제값을 확인한다. 제어3은 API 반환 뒤 별도 UI 동작으로 revert하여 원래 API 완료와 이후 상태를 구분한다. hidden oracle로 “미래에 절대 안 바뀜”을 확인하지 않는다. fill/check/select/focus를 같은 완료 경계 표로 연결한다.
- 근거: Aside fresh snapshot 확인 흐름과 Codex readonly 거절 관측은 유한한 관찰만 제공한다. 이를 무한 상태유지나 transaction rollback으로 확대하지 않고 기존 우리 목표를 판정 가능하게 만드는 제안이다.

## C2B-09 · click 안정의 수치와 “정지한 대상만”을 같은 oracle로 맞춤

- 위치: `locator.click.md` **REQ-LOCATOR-CLICK-001-C04/002-C01/002-C03**; `test-design.md` S06/S07의 phase fault 계획. 현재 C04의 조건은 2 animation frame에서 box 변동≤1 CSSpx인데 판정은 “정지한 대상만”이다. 0.5px씩 계속 움직이는 요소는 앞 기준을 만족해도 뒤 표현은 만족하지 않는다. box 변동이 x/y/width/height 각각인지 거리합인지도 미정이다.
- 반례: 매 frame x+0.5, 너비 불변인 버튼 vs frame마다 x+2 버튼. 임계값을 쓰는 제품과 완전 정지를 기다리는 제품을 같은 oracle로 판정하면 결론이 갈린다.
- 선택할 규범 수정안(추천): 두 연속 rAF 표본에서 같은 연결 document/element이고 x/y/width/height 각각의 절대차≤1 CSSpx이면 이 v1의 안정 조건 충족으로 정의한다. 판정의 “정지한 대상만”을 이 조건 충족으로 고친다. 완전 정지/특정 velocity 추정을 추가 요구하지 않는다. rAF가 오지 않거나 deadline 내 조건 불충족이면5초 총예산 내 actionability timeout이다. 최종 hit/ref 유효성은 입력 직전 다시 검사한다.
- fixture 판정: 다음 개발의 격리 fixture는 각 rAF의 box/세대와 실제 pointer event 수를 기록한다. 안정/불안정 expected sequence는 fixture seed로 고정하고 클릭 이벤트의 target·시점이 허용 sample 이후인지 독립 trace로 확인한다. document 교체/down 직전 fault는 제품 API에 새 공개 hook을 넣지 않고 test adapter의 전송 경계에서 제어한다. 서버 업무 PASS를 주입하거나 임의50ms sleep에 의존하지 않는다.
- 근거:2rAF/1px/5초는 이미 우리 설계로 표시됐으며 두 제품의 내부 알고리즘으로 주장하지 않는다. 새로운 더 강한 정지 보장을 추가하기보다 기존 숫자의 의미를 확정한다.

## C2B-10 · 실제 호출과 서술 축약의 구분(문구 수정만)

- 위치1: `scope.snapshot.md` **REQ-SCOPE-SNAPSHOT-003-C01** 실행의 “해당 ref.getAttribute href”. ref가 문자열인 계약에서는 ref 자체에 메서드가 없다. “발급 ref로 Locator를 만든 뒤 getAttribute('href')”로 적으면 기존 API 조합만으로 실행 가능하다. exact syntax는 우리 guide의 Scope.locator 계약을 따른다.
- 위치2: `external/js.md` **REQ-JS-001-C01**의 “await browser.list”는 실제 JS라면 함수값을 await할 뿐 호출하지 않는다. 호출 예제 목적이라면 `await browser.list()`라고 명시한다.
- 위치3: `locator.click.md` **REQ-LOCATOR-CLICK-001-C02**의 “button/right/middle”은 button=right/middle 두 옵션이라는 뜻을 문장으로 풀고 left 기본/각각 독립 run을 구분한다.
- 판정: API/숫자/오류/부작용 정책을 바꾸지 않고, 같은 Locator→속성 원문 반환/비동기 list 호출/각 button event trace라는 현재 PLAN을 유지한다. 공개 API를 추가하지 않는다. source의 provider 예제와 우리 호출 조각을 혼용하지 않는다.

## 과도한 MUST·중복/확장 검토 결과

- v1 dragTo의 same Page/frame document/CDP target 제한을 유지한다. 경쟁도구의 다른 경로가 보이더라도 cross-frame drag를 추가하지 않는다. 수동 mouse primitive와 같은 성공 보장을 자동 부여하지 않는다.
- Codex chooser 경로와 Aside download path/fs 조합은 현재 API 조합 설계에 참고한다. locator.setInputFiles/PDF·viewport 변경·서비스 전용 globals·fetch 외부도구·별도 ready API를 새로 추가할 필요를 찾지 못했다.
- 우리 strict 단일조회/안정 ref/effectful evaluate·3외부도구/파일source3계열은 기존 사용자/설계 근거를 유지한다. Codex first/null 설명 또는 Chrome 상태조회0/N 차이, Aside snapshot마다 ref 무효화와 같게 만들지 않는다.
-1차EDIT-07은 정상 wheel의 delta 소비 위치와 경계 chaining 허용을 구분했고 EDIT-08은 이미 false radio no-op과 true→false 거절을 구분했다. 같은 후보를 새 실패로 재등록하지 않았다. EDIT-12의 절대URL 별표 리터럴 정책, EDIT-15의 DOM 노드 maxDepth와 frame 접근실패 분리도 유지한다.
- S04는 공개 predicate와 UI 데이터가 있고 oracle 전용 ID를 실행자에게 숨기는 설계다. 식별 불가능한 숨은 정답을 요구하는 결함은 발견하지 못했다. NOT_FOUND는 완전 관찰, 불완전은 INCOMPLETE라는 구분을 유지한다.120호출/180초는 업무 평가 예산이며 API 신규 오류를 만들지 않는다.

## 배치별 전체 검토 기록

|배치|이번 검토 내용|남은 판단/제약|
|---|---|---|
|B01 실행/출력|guide·reset·js·console·display·runtime8요구, 예산/명시출력/JSON·순환값·요청멱등|C2B-01/05. VM·이미지 출력 예산 수치는 우리 설계이며 새 지원 확인 없음|
|B02 선택/검색|CSS/ref/role/text/label/filter/nth/count/raw text/attribute·selection6요구|C2B-02. 공백/최소일치/체인·strict·stable ref 정책 유지|
|B03 snapshot/frame/capture|11snapshot요구·clip/DPR·frame/box·dom-frames6요구|C2B-10 문구. 수집/출력/미로드와 diff완전성·cursor세대 구분 유지|
|B04 상태/입력|5상태조회·fill/press/click/focus/hover/scroll/check/select·mouse/keyboard·drag|C2B-03/07/08/09, close release 범위는05. 새 기능 수입 없음|
|B05 파일/이벤트|drop/upload/chooser/download/save/cancel/dialog·files-events7요구|C2B-04/05/06. bytes/base64/size·real download·save멱등 유지|
|B06 수명/대기/평가/로그|탭목록/연결/이력·4statewait/URL/function/load·evaluate/all·page.logs|C2B-04/05/08. EDIT15 적용과 기존 Promise/serializable·partial/late 정책 유지|

범위 누락: 정본184 REQ와252 Cnn 중 미검토0. 경쟁제품의 각 조건 전체지원 미확인은 그대로이며 이 “미검토0”과 다른 축이다. 후보10건(설계 판단8+혼합1+문구1)은 메인이 전부 수용/기각/보류로 기록해야 한다.3차 예제·반례/독립 Sol C 검토를 대신하지 않는다.
