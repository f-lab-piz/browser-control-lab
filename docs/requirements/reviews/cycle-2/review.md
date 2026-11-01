# 요구사항 독립 검토 2회차

검토일 2026-11-01. 관점은 Codex/Aside 공개 안내·기존 실측의 증거 등급, 누락/과잉 범위, 중복 및 기능 조합이다. 이 보고서는 제품 실패 재현 목록이 아니라 메인이 수용/기각/보류할 명세 후보다.

- 제품 baseline: `700a6a06af3f97729327afaf9becb4ee29bb475b`
- 검토 문서 head: `0a470f0541719ae987e3bc04825186204fa27f86`
- 시작·종료 시 head 일치, tracked/untracked `git status --short` 빈 결과 확인. 보고서는 ignored `.local/`에만 작성.
- AGENTS.md, 프로젝트 SKILL.md, references/requirements-review.md와 pr-review.md를 적용했다. 하위 에이전트, 원격 게시, 개인 탭, 원본 번들/WASM 열람은 없었다.
- 판정: **CHANGES_REQUESTED (개발 전 명세)**. P2 후보 3개, P3 후보 1개. 제품 적합성은 **미검증**이며 이 판정은 제품 구현 완료/실패 또는 PR 승인 판정이 아니다.

## 후보

### R2-01 · P2 · 키워드 미지 탐색에서 내부 스크롤 컨테이너를 발견할 계약이 빠져 있다

- 정확한 위치/REQ: `docs/requirements/internal/scope.snapshot.md:59` REQ-SCOPE-SNAPSHOT-004, 같은 파일:48 REQ-SCOPE-SNAPSHOT-003; `docs/requirements/internal/mouse.wheel.md:22` REQ-MOUSE-WHEEL-001; `docs/requirements/test-design.md:10` S04와 :13 S07. 상위 사용자 요구는 `docs/development-requirements.md:7`의 영역·프레임·스크롤 컨테이너·생략/후속 조회 단서다.
- 문서에서 확인한 누락: snapshot-004는 프레임/landmark/heading/영역 요약은 열거하지만 scrollport의 발견 가능성·ref 또는 후속 조사 경로는 정하지 않는다. wheel은 먼저 포인터를 내부 목록에 옮겨야 하고 scrollIntoView는 이미 DOM에 연결된 대상을 요구하므로 미로드 목표를 스스로 발견하는 대체 기능이 아니다.
- 구체 반례: 같은 iframe에 이름 없는 `overflow:auto` div 두 개가 있고 각각 20개 행만 가상화되어 있다. 목표는 아직 DOM에 없으며 실행자는 CSS/목표명을 모른다. 일반 heading/현재 행만 반환하는 구현은 현 snapshot-004의 열거 조건을 만족했다고 주장할 수 있으나 어느 컨테이너로 포인터를 옮겨 어느 축으로 진행해야 하는지 계약상 단서가 없다. DOM에 없는 목표를 snapshot에 있다고 꾸미면 안 된다는 기존 요구는 유지한다.
- 영향: 이미 요구된 관찰→범위 좁히기→내부 스크롤→새 DOM 관찰 조합을 사전 selector 하드코딩 없이 검증하기 어렵다.
- 채택 검토 수정안: 새 API 대신 snapshot-004에 현재 DOM에서 탐색 가능한 스크롤 영역의 ref/프레임·축·현재 위치/추가 진행 가능 여부 또는 이 정보를 얻는 명시 후속 조회 단서를 포함할지 결정한다. 전체 scrollHeight/정확한 잔여 레코드 수나 자동 로딩까지 보장할 필요는 없다. 관찰은 계속 무스크롤이고 예산 생략 시 후속 경로를 둔다. S04와 S07에 이 조합을 연결한다.
- 구체 검증: 랜덤 이름의 두 scrollport, 가로/세로·끝·preventDefault·중첩 OOPIF를 별도 seed로 준비한다. 첫 관찰에서는 scroll/request count 불변, 발견한 ref→boundingBox→mouse.move→wheel→새 snapshot 이후에만 DOM이 늘어나는지 본다. 의도한 scrollport만 움직였고 최종 업무는 fixture 서버가 판정했는지 확인한다. 실행자에게 목표 CSS/키워드를 주지 않는다.
- 출처/등급: **문서 사실** USR는 내부 스크롤 단서를 요구한다. **과거 실측** HIST-COMP는 대형 DOM 끝 목표와 query 범위 조회이며 이 미지 스크롤 조합의 성공 증거가 아니다. **경쟁 안내** ASIDE-GUIDE의 offscreen/자동 click scroll은 현재 DOM 설명이며 virtual 미로드 영역 지원 증명이 아니다. **추론/설계 제안**이 위 누락의 범위와 수정안이다. 경쟁사가 제공한다는 이유로 추가한 MUST가 아니다. 이번 제품/경쟁 재현은 미실행.

### R2-02 · P2 · download.save의 완료 대기와 반복 저장/이름 충돌을 결정하지 않고 나중 안내로 미룬다

- 정확한 위치/REQ: `docs/requirements/internal/download.save.md:10` 입력/기본값, :22 REQ-DOWNLOAD-SAVE-001, :33 REQ-DOWNLOAD-SAVE-002; `docs/requirements/test-design.md:18` S12; `docs/requirements/verification-matrix.json:4070` PLAN-DOWNLOAD-SAVE-002.
- 문서에서 확인한 미확정 사항: save는 실제 바이트 저장 성공을 요구하나 미완료일 때 즉시 거절인지 완료까지 대기인지와 대기 한도는 정하지 않는다. 002는 "중복save/이름충돌정책을명시"하라는 요구일 뿐 어떤 정책인지 자체를 고정하지 않는다. 이 문서는 다음 개발의 수용 기준이므로 문서화 자체만 확인해서는 실제 조합 결과를 판정할 수 없다.
- 구체 반례: 이벤트 직후 아직 진행 중인 download에 `save({target:'server'})`를 두 번 호출하거나 한 번 server 다음 local로 저장한다. A 구현은 처음 호출을 미완료 오류로, B는 완료까지 대기로 해석할 수 있다. 완료 후 두 server save가 같은 fileId를 돌려주는지 두 자산을 만드는지도 미정이다. 같은 suggested filename으로 다른 바이트를 받는 두 download가 있어도 충돌 처리를 검증할 기대값이 없다. 데이터 덮어쓰기가 현재 발생했다고 주장하는 반례는 아니다.
- 영향: 안내된 waitForEvent→click→save 흐름에서 다운로드 길이와 호출 타이밍에 따라 "정상"의 의미가 달라지고, 재호출·목적지 전환의 바이트/소유 판정이 불명확하다.
- 채택 검토 수정안: 기존 save에 대해 (a) 진행 중 완료 대기 여부와 유한 한도/초과 결과, (b) 동일 핸들·동일 목적지 반복 호출의 자산 identity/중복 생성 허용 여부, (c) server/local 전환 허용과 독립 결과, (d) 동명 다른 download의 충돌·기존 파일 보존 정책을 결정한다. 지원하지 않을 조합은 명시 거절로 충분하다. 새 download.path/saveAs API나 임의 경로 옵션을 늘릴 필요는 없다. 현재 코드에 30초 polling이 있다는 사실은 확인했으나 그 수치를 반드시 목표로 채택하자는 제안은 아니다.
- 구체 검증: 느린 스트림 다운로드를 이벤트 직후 save, 완료 뒤 순차/동시 같은 목적지 save, 목적지 전환, 같은 이름·다른 hash의 두 다운로드로 독립 run을 만든다. 반환 fileId/path와 실제 바이트·자산 수·타세션 접근·기존 파일 hash를 판독한다. cancel과 경합하면 취소/완료/timeout을 구분하고, URL 재요청이나 완료 파일 삭제로 성공을 만들지 않는다.
- 출처/등급: **문서 사실** 002의 정책이 미정이다. **현재 자체 코드 읽기** extension/files.mjs:29..35는 완료 polling 후 반환하지만 이것을 목표 규범 준수 증거로 계산하지 않았다. **경쟁 안내** ASIDE-GUIDE는 download.path 뒤 완료 파일을 읽는 사용법을 안내한다. 이는 우리 API 이름/반환형 변경의 근거가 아니다. **과거 실측** HIST-COMP의 다운로드 바이트 성공은 반복/충돌 조합 검증이 아니다. **추론/설계 제안**이 위 정책 확정이다. 이번 실행 재현은 없음.

### R2-03 · P2 · close 이벤트 성공과 close에 따른 waiter 정리의 순서가 구별되지 않는다

- 정확한 위치/REQ: `docs/requirements/internal/page.waitForEvent.md:10..11` close 입력/출력, :22 REQ-PAGE-WAITFOREVENT-001, :33 REQ-PAGE-WAITFOREVENT-002; `docs/requirements/common/files-events.md:41` REQ-C-FILESEVENTS-004; `docs/requirements/internal/page.close.md:22` REQ-PAGE-CLOSE-001.
- 문서에서 확인한 모호함: waitForEvent는 `close`를 지원 이벤트로 열거하고 다음 일치 이벤트를 반환해야 한다. 동시에 002와 공통004는 close 때 waiter를 해제한다고만 쓴다. 정상 close waiter를 먼저 resolve한 뒤 나머지를 거절/정리하는지 명시하지 않으며 close metadata shape도 없다.
- 구체 반례: `var closed=p.waitForEvent('close'); await p.close(); console.log(await closed)`와 같은 페이지의 pending download waiter가 함께 있는 경우, 정상 close waiter까지 PAGE_CLOSED로 거절하는 구현과 close metadata로 resolve하는 구현이 서로 다른 결과를 낸다. "해제"가 resolve 뒤 정리라는 해석은 가능하지만 수용 기준에 그 순서가 없다. 이미 닫힌 Page에서 새 close wait의 결과도 미정이다.
- 영향: 기존 두 API의 가장 단순한 조합에 대해 정상 완료와 정리 오류의 경계를 테스트가 고정하지 못한다.
- 채택 검토 수정안: 등록된 close waiter는 관측한 자기 페이지 close를 정확히 한 번 resolve하고 그 뒤 정리한다는 식으로 정상 terminal event와 다른 대기 취소를 구분할지 결정한다. close metadata의 최소 값(tab identity 등), 이미 닫힌 핸들에서 등록, timeout/reset과 close 경합 결과를 기존 오류 분류 안에서 고정한다. 새 이벤트 API는 필요 없다.
- 구체 검증: close waiter+별도 download waiter를 등록한 뒤 자기 page.close/fixture가 닫은 popup/다른 탭 close를 각각 실행한다. 자기 close만 정상 수신, 다른 wait는 명시 페이지 종료, 이미 닫힌 Page는 즉시 구분 오류, timeout/reset 경합은 단일 종결·누수0인지 trace로 확인한다. 페이지는 fixture/임시 프로필만 사용한다.
- 출처/등급: **문서 사실**인 지원 이벤트와 정리 규칙을 조합한 **논리 반례/설계 제안**이다. ASIDE/Codex close 세부 동작은 이번 근거에 없으므로 **미확인**이며 경쟁 동등성 요구를 제기하지 않는다. 현재 제품의 close 이벤트 실패를 재현한 것은 아니다.

### R2-04 · P3 · 1차 modifier 소유 결정이 locator.press의 요약과 검증문구에는 반영되지 않았다

- 정확한 위치/REQ: `docs/requirements/internal/locator.press.md:13`, :36..38의 REQ-LOCATOR-PRESS-002 검증 계획; 같은 파일:33 규범; `docs/requirements/verification-matrix.json:2678..2680` PLAN-LOCATOR-PRESS-002; `docs/requirements/reviews/cycle-1/decisions.md:15` R1-09.
- 문서에서 확인한 차이: 규범은 focus 이전 실패가 기존 명시 down 상태를 해제하지 않는다고 확정했다. 요약/Then은 여전히 "focus 불가…실패하며 조합키는 끝에 release"로 남아 있어 사전 실패 때도 기존 modifier를 release해야 한다고 읽을 수 있다. 원문과 matrix의 GWT 문자열은 서로 일치하므로 구조 검사로는 잡히지 않는다.
- 구체 반례: `keyboard.down('Control')` 이후 disabled locator.press('Control+A')가 focus 단계에서 거절되고, 다음 keyboard.press('C')를 실행한다. 새 규범은 Control 보존인데 오래된 Then만 보고 만든 검증은 Control 해제를 기대할 수 있다.
- 채택 검토 수정안: 새 요구를 추가하지 말고 요약/Given/Then과 matrix를 현 규범에 맞춘다. focus 이전 실패는 기존 down 보존, 키 시퀀스 중 실패는 press가 새로 소유한 키만 release한다는 기대를 적는다. 공통 modifier 규범을 재복사하기보다 해당 REQ를 참조해도 된다.
- 구체 검증: S06/S08의 독립 입력 trace에서 위 사전 실패와 실제 키 시퀀스 중 실패를 구별한다. 기존 down 없음/있음과 locator focus 성공/실패의 교차 결과를 판독한다.
- 출처/등급: **문서 사실**인 1차 결정과 최신 규범/GWT 불일치의 **추론**이다. 제품 실행 증거·경쟁 비교 결과는 아니다. README가 Markdown REQ를 규범 원본으로 정했으므로 새 규범 자체 충돌은 아니며 비차단 P3로 분류했다.

## 비교 근거 판정

|근거|이번 실제 검토 범위|판정·한계|
|---|---|---|
|ASIDE-GUIDE|저장된 main/repl 안내 전문, CLI1.26.1028.2335/skill3|이번 명세 작업에서 캡처한 문서. ES2023+, 120초, 명시 console 출력, persistent binding, compact tree, offscreen/child iframe, ref/selector 범위, snapshot마다 ref 무효화, download event/path 안내가 있다. 이 리뷰는 CLI를 새로 실행하지 않았다. 모든 Playwright 옵션 지원의 증명이 아니다.|
|CODEX-OBS|fixes-before-after.md의 Codex 표/스냅샷/재현 절, evidence/diagnostics-before-after.json의 codex 객체|과거 동일 /audit fixture 실제 호출을 요약한 증거다. 신규 측정이나 현 Codex 전체 공개 API 계약이 아니다. regex/visible/nth/slot/readonly/scaled frame/clip/selected의 당시 결과만 읽었다.|
|HIST-COMP|동일 비교 보고서 및 JSON의 Before/After·aside·codex 요약|경쟁 전체 31/36개 진단 동등 실행이 아니다. 브라우저·viewport/DPR·출력 계약이 다름을 문서가 명시한다. 2,682,070자 대 13,175자 등의 수치로 성능 우열을 만들지 않는다.|
|HIST-R2/HIST-INLINE|sources와 연결된 요구의 이력 요약/한계|후속 수정 전 결과 또는 특정 slot/inline/clip 범위다. 이번에 모든 역사 run을 재검증하지 않았다. 새 182개 규범의 PASS로 쓰지 않는다.|
|DESIGN/USR|sources·계획·개발 요구·cycle-1 결정|경쟁 문서와 다른 수명/ref, 제한·반환형을 독립 설계로 채택한 이유가 구분돼 있다. DESIGN을 현재 구현/실측으로 읽지 않는다.|

범위 확대/중복에 관한 수용 가능한 현재 판단:

- 외부3/내부64와 공통5, Page/Frame 중복 제외, Locator.evaluate 별칭 호환이라는 집계는 일관된다. index 파일 67개를 직접 확인했다. Aside의 fs/fetch/서비스 전역/remote delegate/pdf/viewport 등을 범위에 자동 추가하지 않은 결정은 적절하다.
- Aside의 snapshot ref 무효화와 우리 stable identity ref의 차이는 명시된 독립 설계다. 차이라는 이유로 버그나 MUST를 만들지 않았다.
- 음수 nth/visible/slot/scale/clip의 과거 경쟁 차이는 특정 버전·fixture 사실이다. 우리 요구의 유일 근거로 사용하지 않는다. 우리 clip을 CSS 크기로 통일한 것과 Aside의 DPR 반영은 출력 계약 차이로 다뤄야 한다.
- download→upload는 기존 server fileId와 공통 파일 엔진으로 조합할 수 있고, 더블클릭은 clickCount2, 내부 스크롤은 move+wheel, 선택은 filter/nth, 이벤트는 waiter 사전 등록으로 조합하는 방향이다. 사이트 전용 메서드를 늘릴 이유는 찾지 못했다.
- 1차 결정의 logs/cancel envelope와 cursor 문자열 변경은 README에서 다음 개발의 호환 이행임을 명시한다. 현재 guide/제품이 이미 제공한다고 해석하지 않았다.
- 근거 레지스트리와 상태표는 문서/과거 실측/새 규범 미검증을 대체로 잘 구분한다. 이번 비교 관점에서 허위 신규 경쟁 PASS 또는 미측정 우월성 주장은 찾지 못했다. 현재 Codex 세부 공식 가이드의 전체 재수집은 하지 않았고, 그 부족을 제품 옵션의 미지원으로 해석하지 않는다.

## 실제 읽은 API 범위

아래 전 이름은 67개 색인 전체를 포함한다. 각 API의 입력/기본값·출력·부작용·모든 REQ 규범을 읽었고, 선택/입력/이벤트/파일/런타임의 공통 계약 및 matrix의 GWT 대응을 대조했다. 반복 boilerplate는 구조화 추출을 병행했다. 이 범위는 모든 67개를 실제 호출했다는 뜻이 아니다.

|그룹|실제 읽은 전체 API 이름|
|---|---|
|외부3|guide, reset, js|
|탭6|browser.list, browser.tabs, browser.open, browser.attach, page.activate, page.close|
|탐색4|page.goto, page.back, page.forward, page.reload|
|화면/프레임4|scope.snapshot, page.screenshot, page.frames, page.frame|
|선택6|scope.locator, scope.getByRole, scope.getByText, scope.getByLabel, locator.filter, locator.nth|
|조사9|locator.count, locator.textContent, locator.getAttribute, locator.inputValue, locator.isVisible, locator.isEnabled, locator.isEditable, locator.isChecked, locator.boundingBox|
|조작10|locator.click, locator.fill, locator.press, locator.hover, locator.focus, locator.scrollIntoView, locator.setChecked, locator.selectOption, locator.dragTo, locator.drop|
|primitive9|mouse.move, mouse.down, mouse.up, mouse.click, mouse.wheel, keyboard.down, keyboard.up, keyboard.press, keyboard.type|
|대기5|locator.waitFor, page.waitForEvent, page.waitForURL, page.waitForFunction, page.waitForLoadState|
|파일4|locator.setFiles, chooser.setFiles, download.save, download.cancel|
|dialog2|dialog.accept, dialog.dismiss|
|evaluate2|scope.evaluate, locator.evaluateAll|
|진단3|page.logs, console.log, display|

추가로 common/runtime·dom-frames·selection·input·files-events 전체 규범, README, inventory, sources, index, verification-matrix, test-design, backlog, evidence의 구조/동결 자료, cycle-1 원문/결정, 상위 개발 요구와 계획을 검토했다. matrix 182개 전부의 ID/spec/GWT 대응은 기계 검사했고 GWT 원문을 모든 항목에서 별도 수동 의미 검증한 것은 아니다. API 규범 미검토는 0개다. 제품 소스 전체 구현 경로와 모든 기존 테스트 함수의 assertion 재리뷰는 이번 범위에서 하지 않았다.

## 실행한 확인 및 미실행

읽기/검사 결과:

- `git rev-parse HEAD`, `git status --short`: 시작·최종 head 일치/clean.
- `git diff --stat 700a6a0..HEAD`: 문서/스킬/계획 변경 범위 확인. 제품 변경 없음.
- Python 읽기 검사: 외부3/내부64 index 파일67개 존재, Markdown REQ182개/고유182개, matrix182개, 빠진 ID0, 원문↔matrix Given/When/Then 문자열 불일치0.
- 동결 manifest35개: 현재 파일 bytes와 baseline `git show` bytes, manifest SHA256를 모두 대조했고 불일치0.
- 저장된 Aside 안내 전문과 과거 비교/JSON 요약을 읽었다. 제품 일부 source(page-agent metadata, files.saveDownload)와 기존 audit 테스트의 관련 조건만 읽기 확인했다.

미실행/차단/한계:

- 제품 E2E/fixture oracle/npm test/경쟁 비교실측은 이번 리뷰에서 실행하지 않았다. 문서 요구 정립 단계이고 이번 후보는 문서 조합의 반례라 실행을 제품 PASS로 대체하지 않았다.
- 현 Codex/Aside 모든 API/옵션, 외부 사이트/회사 사이트, 실제 사용자 프로필/탭, 원본 코드·번들/WASM은 열람·조작하지 않았다. 미실행을 실패/미지원으로 표기하지 않는다.
- 저장된 비교 증거의 원시 output 전체·각 역사 실행의 브라우저 상태를 독립 재현하지 않았다. 그 수치의 현재 재현성은 미확인이다.
- 문서 구조 검사는 제품 동작 검증이 아니다. 제품/테스트 원본은 바꾸지 않았다.

최종 검토 SHA는 `0a470f0541719ae987e3bc04825186204fa27f86`, 제품 baseline은 `700a6a06af3f97729327afaf9becb4ee29bb475b`이다. **CHANGES_REQUESTED — 명세 후보 R2-01..04에 대한 메인 판단 후 다음 회차 진행.** 제품 구현/신규 요구 충족은 여전히 미검증이다.
