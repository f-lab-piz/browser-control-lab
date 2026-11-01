# 요구사항 독립 검토 3회차

검토일 2026-11-01. 관점은 복잡 iframe/Shadow/입력/파일/이벤트·runtime 조합의 논리 반례, 키워드 미지 탐색의 실제 테스트 가능성, 수용된 MUST의 충돌 및 실행 가능한 판정이다.

- 제품 baseline: `700a6a06af3f97729327afaf9becb4ee29bb475b`
- 검토 문서 head: `0e2e7fb28c75d2ae181a660556eb47f0ee4c853d`
- 시작 및 보고서 작성 직전 `git rev-parse HEAD` 일치, `git status --short` 빈 결과로 clean 확인. 이 보고서는 ignored `.local/requirements-cycle3-review.md`에만 썼다.
- AGENTS.md, `.agents/skills/browser-control-development/SKILL.md`, `references/requirements-review.md`, `references/pr-review.md` 적용. 새 컨텍스트의 독립 리뷰이며 제품·테스트·규범 원본 수정, 원격 게시/승인/병합, nested subagent 생성은 하지 않았다.
- 판정: **CHANGES_REQUESTED — 개발 전 명세**. P2 후보 3개, P3 후보 1개를 메인 판단에 제출한다. 현재 제품의 실제 FAIL을 발견했다고 주장하지 않으며 제품 적합성은 **미검증**이다.

## 발견 후보

### R3-01 · P2 · 입력실패 공통 cleanup MUST가 기존 modifier 보존 MUST와 여전히 충돌한다

- 정확한 위치/REQ: `docs/requirements/common/input.md:30,33..35` REQ-C-INPUT-003 및 PLAN-C-INPUT-003; `docs/requirements/internal/keyboard.press.md:22` REQ-KEYBOARD-PRESS-001; `docs/requirements/internal/locator.press.md:33,36..38` REQ-LOCATOR-PRESS-002. 두 press는 common/input을 필수 상속한다. 1차 R1-09 및 2차 R2-04 결정과 연결된다.
- 문서 근거: 공통003은 reset/close/**입력실패** 때 실제 눌림과 내부 상태를 정리하며, Then은 down 후 오류에서 눌린 버튼/수정키가 잔류하지 않는다고 한다. 반면 개별 press 규범은 기존 명시 down을 보존하고, 특히 locator focus 이전 실패에서 기존 down을 해제하지 않는다고 확정했다. README는 공통/개별 MUST의 우선순위를 달리 정하지 않았다.
- 구체 반례: `keyboard.down('Control')` → disabled 대상 `locator.press('Control+A')` → `keyboard.press('C')` → `keyboard.up('Control')`. 공통003을 그대로 assertion으로 만들면 실패 직후 Control이 풀려야 한다. 개별002를 따르면 실패 전 눌린 Control이 C까지 유지되어야 한다. 키 시퀀스 중 실패에서도 기존 Control은 보존, 이번 press가 새로 누른 Alt만 해제하는 경우가 공통의 무잔류 문구와 갈린다.
- 영향: 같은 조합에 대해 공통 검증과 개별 검증이 반대 결과를 요구한다. modifier 소유 결정이 최종 검증/개발에 일관되게 적용되지 않는다.
- 목표 수정안: 새 기능을 추가하지 말고 common/input003을 소유 정책에 맞춘다. 사전 입력 검증/focus 실패는 기존 명시 down을 보존하고, 입력 중 실패는 그 연산이 새로 획득한 키/버튼만 정리하며 잔류/정리 실패를 표시한다. reset/close는 해당 세션이 소유한 전체 실제 눌림 정리를 시도한다. mouse의 명시 down에 대해서도 같은 원칙인지 또는 오류별 예외인지 한 정책을 명시한다. Given/Then과 matrix도 함께 수정한다.
- 구체 fixture/oracle/계획:
  - 정상: 임시 페이지의 keydown/up·modifier flags 기록과 실제 편집/단축키 결과를 사용한다. 명시 Control down → 정상 press → C → up에서 Control이 마지막 up까지 유지되는지 본다.
  - 거절: disabled/stale/focus 불가 또는 잘못된 조합은 해당 press의 키 이벤트 0, 기존 modifier 유지. 다음 C의 ctrlKey 및 실제 단축키 효과로 내부 상태만 보존한 거짓 성공도 배제한다.
  - 부분효과: 기존 Control에 새 Alt/주키를 추가한 뒤 host 입력 단계 실패를 유도한다. 이미 발생한 keydown은 기록하고 새 Alt/주키만 release, 기존 Control은 유지한다. reset/close 별도 run에서는 전부 release되거나 실제 정리 실패가 명시돼야 한다. fault 주입 지점은 adapter 전송 경계로 격리하고 업무 판정 상태를 직접 쓰지 않는다.
- 증거 등급: **직접 명세 충돌/논리 반례**. 현재 제품 입력 trace는 실행하지 않았다.

### R3-02 · P2 · 키워드 미지 탐색의 업무 목표를 식별하는 조건이 없어 S04의 성공/실패를 재현할 수 없다

- 정확한 위치/REQ: `docs/requirements/internal/scope.snapshot.md:59,62..64` REQ-SCOPE-SNAPSHOT-004; `docs/requirements/test-design.md:10,24` S04; PLAN-SCOPE-SNAPSHOT-004. scrollport 관찰값 자체는 2차 결정으로 보강됐으므로 R2-01을 다시 요구하는 항목이 아니다.
- 문서 근거: 현재 계획은 랜덤 명칭의 업무프레임/목표에서 목표명/CSS를 숨기고 실행자에게 **업무 유형만** 준다고 한다. 목표가 무엇인지 관찰로 판단할 공개 업무 조건, 복수 후보 처리, 종료/부재 판정의 기대값은 정하지 않는다. 서버가 사후 PASS를 정한다는 것만으로 목표 선택의 사전 근거가 생기지는 않는다.
- 구체 반례: 이름 없는 두 mail scrollport에 둘 다 읽지 않은 메일이 있고, 실행자에게 '메일 읽기'만 준다. 관찰 가능한 DOM/요약/프레임/스크롤 단서와 실행자 지시가 동일한 두 seed에서 서버의 숨은 정답만 A의 137번/B의 137번으로 바꾸면 올바른 제품도 두 경우를 구별할 수 없다. 전체를 무작위로 읽어서 PASS가 되는 fixture는 탐색/정확한 대상 제어를 입증하지 않는다. 반대로 유일한 업무 조건을 추가하면 키워드를 사전 제공하지 않고도 탐색이 성립한다.
- 영향: 실패가 snapshot 발견성 부족인지, 실행자 추론 실패인지, 아예 관찰로 식별할 수 없는 과제인지 분리할 수 없다. 동일 기능에 대해 사후 hidden target만 바꿔 결과를 달리 만들 수 있다.
- 목표 수정안: 새 API나 자동 탐색 기능을 요구하지 않는다. S04에 실행자가 처음 받는 업무 문장과 관찰 가능한 유일한 목표 predicate를 정한다. 예: '받은편지함에서 첨부 표시가 있고 아직 읽지 않은 가장 최근 승인 요청을 열기'처럼 의미 조건을 주되 실제 제목/CSS/ref/프레임 ID는 숨긴다. 또는 순번 업무라면 '137번째'라는 목표 조건은 제공하고 그 키워드/selector는 주지 않는다. 동률/부재/미로드/접근불가의 expected outcome과 시드별 종료 한도(행동 수/시간)를 fixture manifest에 둔다. 정답 ID는 oracle 전용이며 실행자에게 주지 않는다. 이 manifest와 trace를 함께 보관한다.
- 구체 fixture/oracle/계획:
  - 정상: 두 scrollport·랜덤 프레임명과 decoy를 둔다. 한 후보만 업무 predicate를 충족하게 하고 위치/이름을 seed로 바꾼다. 실행자는 첫 snapshot→구조/ref→범위 좁히기→명시 wheel→새 관찰로 목표를 고른다. 서버는 선택한 record ID, 읽기 1회, decoy 미조작을 판정한다. 하니스는 공개 업무 조건으로 정답이 유일함을 독립 판독한다.
  - 거절/부재: 목표 미존재, 두 동일 후보, 접근불가 frame은 각각 사전에 정한 '부재/모호/미검증' 결과다. 무작위 클릭으로 업무 PASS를 얻지 못해야 한다. 어떤 API 오류로 표현할지는 업무 에이전트 결과와 제품 API 오류를 구분한다.
  - 부분효과: 목표가 미로드이면 첫 관찰에 그 행이 있다고 주장하지 않는다. scroll0/request0 관찰 확인 후 명시 wheel에 따른 선택 scrollport의 위치/DOM/요청만 변해야 한다. 일부 frame 접근 실패를 완전 부재로 오인하지 않고 최종 미완료/부분관찰을 기록한다. 이미 수행한 스크롤은 되돌렸다고 주장하지 않는다.
- 증거 등급: **검증 설계의 식별 가능성에 관한 논리 반례**. 실제 S04 fixture/에이전트 run은 아직 만들거나 실행하지 않았다. 모든 seed에 위 반례가 존재한다고 단정하는 것이 아니라 현재 설계가 반례를 배제할 조건을 제공하지 않는다는 후보이다.

### R3-03 · P2 · 평가/함수 대기의 Promise·undefined 반환 처리가 미정이라 S14/13 oracle을 고정할 수 없다

- 정확한 위치/REQ: `docs/requirements/internal/scope.evaluate.md:10..13,22,33` REQ-SCOPE-EVALUATE-001/002; `docs/requirements/internal/locator.evaluateAll.md:10..13,22,33` REQ-LOCATOR-EVALUATEALL-001/002; `docs/requirements/internal/page.waitForFunction.md:10..13,22,33` REQ-PAGE-WAITFORFUNCTION-001/002; `docs/requirements/test-design.md:19..20` S13/S14.
- 문서 근거: 세 API는 함수를 받고 JSON 결과/최초 truthy 값을 돌려준다. throw/순환/DOMnode 등의 오류는 구분하지만 async 함수/thenable의 결과를 기다리는지, Promise를 즉시 직렬화하는지, 아예 미지원인지 명시하지 않는다. S14는 undefined를 경계로 열거하지만 undefined 반환이 오류인지 어떤 값인지 기대값이 없다. JSON 밖 값이라는 이유로 **명시 거절**하는 정책도 가능하나 그것을 계약으로 확정해야 한다.
- 구체 반례: `page.waitForFunction(async () => false)`와 `async () => { throw new Error('x') }`. Promise 객체 자체는 truthy이므로 그대로 판정하면 즉시 '충족' 경로에 들어가지만 await한 값으로 판정하면 전자는 timeout, 후자는 함수 오류다. `scope.evaluate(async () => 7)`는 7/빈 객체/미지원 오류 등 결과가 갈릴 수 있다. `evaluate(() => undefined)`는 표준 JSON 값이 아니므로 성공 null로 바꾸는지/undefined를 보존하는지/직렬화 오류인지도 S14만으로 선택할 수 없다. 이 반환값에 따른 후속 브라우저 조작은 서로 다른 업무 효과를 낼 수 있다.
- 영향: runtime 비동기와 evaluate/polling의 기본 조합에서 정상과 직렬화/함수 오류/timeout의 oracle이 정해지지 않는다. 기존 E2E가 async 자체를 다뤘어도 이 새 계약의 기대값으로 대체할 수 없다.
- 목표 수정안: async/Promise 반환을 지원한다면 평가 결과를 settle까지 기다리고, waitForFunction은 settled 값의 truthiness로 판단하며 거절은 함수 오류로 분류한다고 명시한다. 내부 대기/바깥 js deadline과 reset이 결과를 한 번만 종결시키는 정책에 연결한다. 비동기를 이번 범위 밖으로 둘 경우 함수/결과를 명시 미지원/직렬화 오류로 거절하는 선택도 가능하다. 이 후보는 async 지원 확대를 강제하지 않는다. undefined와 비JSON 반환은 기존 Promise<JSON>에 맞춰 구분 가능한 오류로 둘지 목표를 정한다. 성공 null과 혼동하지 않는다.
- 구체 fixture/oracle/계획:
  - 정상: 별도 격리 평가 fixture에서 동기 JSON scalar/object, 명시 null, evaluateAll 빈배열과 Scope/Locator 수신 identity를 판독한다. 비동기 수용 시 지연 resolve(7)/resolve(false)를 추가하고 Promise 객체를 truthy 결과로 오인하지 않는지 확인한다.
  - 거절: undefined·순환·DOMnode 및 비동기 reject를 정책에 맞는 오류로 판정한다. async 미지원 선택이면 정상/false/reject Promise 모두 명시 미지원이어야 하며 일반 JSON과 혼용하지 않는다. 각 평가 전후의 독립 marker로 사용자 함수가 실행되었는지 판독한다.
  - 부분효과: 함수가 marker를 한 번 바꾼 뒤 reject/직렬화 불가 값을 반환하거나, polling 중 timeout/reset을 맞는다. 변경은 실제 부분효과로 남기고 rollback을 주장하지 않으며 late fulfillment/output이 새 세대에 섞이지 않아야 한다. 함수를 재실행해 성공을 만들지 않는다. 업무 판정 API는 직접 쓰지 않는 격리 테스트다.
- 증거 등급: **미확정 입출력/비동기 의미의 논리 반례**. 현재 구현 일부의 CDP `awaitPromise:true`를 읽었으나 이를 목표 정책의 근거 또는 전체 경계 PASS로 쓰지 않았다. 제품/브라우저 실행 없음.

### R3-04 · P3 · 복잡 프레임 입력의 ancestor hit·OOPIF drag 경계를 검증 설계에서 분리하면 판정이 명확해진다

- 정확한 위치/REQ: `docs/requirements/common/dom-frames.md:30,52` REQ-C-DOMFRAMES-003/005; `docs/requirements/common/input.md:8` REQ-C-INPUT-001; `docs/requirements/internal/locator.click.md:22,33` REQ-LOCATOR-CLICK-001/002; `docs/requirements/internal/locator.dragTo.md:10,33` REQ-LOCATOR-DRAGTO-002; `docs/requirements/test-design.md:12..15` S06/S07/S09.
- 문서 근거: 실제 hit/가림 거절과 transformed/OOPIF 좌표는 요구되어 있으므로 새 제품 MUST의 누락으로 보지 않는다. 다만 현재 설계는 overlay·scale iframe·cross-target을 각각 한 단어로 묶어, 자식 document 내부 hit와 최상위 프레임 합성 hit의 차이, cross-target이 다른 Page/다른 CDP target/다른 frame 중 무엇인지에 대한 구체 expected case를 제공하지 않는다. 구현자가 쉬운 로컬 overlay와 같은 document drag만 넣어도 테스트 설계의 표면 설명은 충족하기 쉽다.
- 구체 반례: 자식 iframe 내부 `elementFromPoint`는 open-shadow slot 버튼을 맞히지만, 최상위 document의 overlay가 iframe 전체를 덮는다. 자식 내부 hit만 맞고 transform 계산도 정확하다는 이유로 click을 성공 처리하면 실제 입력은 부모 overlay에 전달된다. 별도 조합에서는 동일 Page의 same-process 자식 간 drag와 OOPIF 경계 drag가 둘 다 '서로 다른 frame'이지만 CDP target은 다를 수도 같을 수도 있다. 단순 cross-target 명칭만으로 어떤 fixture를 거절 케이스로 사용할지 정하기 어렵다.
- 목표 수정안: 기존 실제 hit MUST를 유지하면서 S07에 iframe의 모든 조상에서 가림/clipping을 판독하는 fixture를 명시한다. S09의 source/destination을 같은 document, same-process 다른 frame, OOPIF 다른 debugger target, 다른 Page로 나누고 각 지원/사전 거절 결정을 적는다. cross-target은 CDP 입력 target을 뜻하는지 등 기존 표현만 명료화한다. OOPIF 간 drag 지원을 추가하라는 요청이 아니다.
- 구체 fixture/oracle/계획:
  - 정상: translate/positive scale, 테두리·가로/세로 스크롤을 가진 중첩/OOPIF 안 open-shadow slot 버튼. 실제 parent/child event trace와 정확한 버튼의 서버 카운터가 1인지 확인한다.
  - 거절: parent overlay/클리핑으로 실제 hit 불가, 미지원 rotate, 정책상 unsupported drag 경계에서는 버튼/dragstart/drop 입력 0, 다른 요소 카운터 불변을 본다. auto-scroll이 허용되는 준비 효과인지도 trace에 분리한다.
  - 부분효과: 정상 down 또는 dragstart 뒤 iframe detach/overlay 등장/reset을 유도한다. 이미 난 이벤트는 남기고 drop 중복/다른 frame 재지정이 없으며 실제 button/drag release 정리 결과를 판독한다. cleanup 실패는 명시한다.
- 증거 등급: **기존 요구의 검증 구체화 제안**. 실제 ancestor-hit 오류나 drag 실패를 재현한 제품 버그가 아니다. R3-01..03과 달리 현재 MUST끼리 충돌하는 차단 항목으로 주장하지 않는다.

## 검토 범위 — 67개 API 전 이름

각 파일에서 계약 요약(입력/기본값·출력/성공·효과·오류), 모든 REQ 규범 및 해당 Given/When/Then을 실제 읽고 공통 규범과 대조했다. 반복되는 근거/미검증 boilerplate는 구조화 추출을 병행했다. 긴 출력의 잘린 locator 조회 구간은 별도 원문으로 다시 읽었다. 아래 모든 API는 개별 규범 검토 완료이며 **실제 제품 호출 완료라는 뜻이 아니다**.

|그룹|읽은 API 이름|초점|
|---|---|---|
|외부3|guide, reset, js|명시출력·세션/세대·deadline·멱등/취소|
|브라우저4|browser.list, browser.tabs, browser.open, browser.attach|목록·소유·실패 탭/권한·무탐색 attach|
|페이지6|page.activate, page.close, page.goto, page.back, page.forward, page.reload|수명·새 문서 준비·이력경계·ref stale|
|관찰/프레임4|scope.snapshot, page.screenshot, page.frames, page.frame|DOM/출력범위·scrollport·예산/cursor/diff·좌표/프레임|
|선택/조합7|scope.locator, scope.getByRole, scope.getByText, scope.getByLabel, locator.filter, locator.nth, locator.count|composed 본문·접근 이름·후손/순서·strict/0/N|
|상태/값8|locator.textContent, locator.getAttribute, locator.inputValue, locator.isVisible, locator.isEnabled, locator.isEditable, locator.isChecked, locator.boundingBox|실제 상태·원문/속성/값·hidden/offscreen·main viewport|
|대상입력10|locator.click, locator.fill, locator.press, locator.hover, locator.focus, locator.scrollIntoView, locator.setChecked, locator.selectOption, locator.dragTo, locator.drop|전제/사후·부분효과·실제hit·재전송/정리|
|primitive9|mouse.move, mouse.down, mouse.up, mouse.click, mouse.wheel, keyboard.down, keyboard.up, keyboard.press, keyboard.type|좌표/축·modifier/button 소유·실제release·Unicode|
|대기5|locator.waitFor, page.waitForEvent, page.waitForURL, page.waitForFunction, page.waitForLoadState|0/1/N·arming·terminal 경합·함수/직렬화|
|파일/이벤트6|locator.setFiles, chooser.setFiles, download.save, download.cancel, dialog.accept, dialog.dismiss|source/32MiB/바이트·event identity·저장/취소최종·타세션|
|평가/출력5|scope.evaluate, locator.evaluateAll, page.logs, console.log, display|수신/closure·JSON/비동기·수집/유실·출력 분리/한도|

추가 전수 규범: 공통5(runtime7, dom-frames6, selection6, input5, files-events7), 전체183개 REQ. scope.evaluate의 Locator.evaluate 별칭도 검토했으며 별도 68번째 API로 세지 않았다. index의 Scope.args/Locator.args 조사 항목을 새 지원 API로 추가하지 않았다.

추가 읽은 문서: requirements README/inventory/sources/index/verification-matrix/test-design/backlog, evidence의 freeze/document-validation 및 저장된 Aside main/repl 안내 전문, 1·2차 원문 보고서와 모든 decisions. 상위 development-requirements, architecture, runtime-usage 및 관련 기존 catalog/선택·입력·evaluate 소스 일부는 현재 구현과 목표의 차이를 오해하지 않기 위해 읽었다. 경쟁 안내는 저장된 문서 증거이며 최신 실측이 아니다.

미검토 API 규범: **0개**. 제품 전체 구현 경로/모든 테스트 assertion의 전수 감사, 역사 run 원시 아티팩트 전체의 독립 재현은 하지 않았다.

## 실행한 확인과 결과

읽기 전용 명령/검사만 수행했다. 제품/테스트/fixture를 작성하거나 실행한 결과는 없다.

1. `git rev-parse HEAD` 및 `git status --short`: 지정 문서 head 일치, 시작/작성 직전 clean.
2. `git diff --stat 700a6a0..HEAD`: 문서/계획/스킬 범위 확인. 제품/테스트 원본 변경 없음.
3. Python 원문↔index↔matrix 검사: 외부3+내부64=67 파일, 공통5, REQ183/고유183, matrix183. 빠진 ID 0, index별 실제 spec REQ 불일치0, 모든183개의 Given/When/Then 문자열 불일치0. 수준 MUST180/SHOULD3, 상태 전183개 unverified. 이 구조 검사는 R3-01처럼 동일한 문자열로 유지된 의미 충돌을 잡지 못한다.
4. 동결 manifest35개: 현재 bytes와 baseline의 `git show` bytes, manifest SHA256를 모두 대조. 불일치0.
5. matrix의 기존 테스트 후보147개 연결/36개 미연결, 결과 전부 `NOT_RUN_FOR_THIS_REQUIREMENT`를 확인했다. 후보 연결 수는 새 요구 coverage/PASS 수가 아니다. API 규범은 수동 읽기, 전체 GWT 매핑 일치는 기계 확인, 특히 후보 및 복잡 조합 GWT는 별도 수동 의미 검토다.
6. `.local/requirements-cycle3-review.md`가 ignored 경로임을 `git check-ignore`로 확인했다.

## 미실행/차단 및 남은 한계

- npm/unit/fixture oracle/제품 E2E/경쟁 도구 비교/외부 사이트 및 회사 페이지 실측은 **미실행**이다. 이번은 개발 전 명세 검토이며 새 E2E가 요구되지 않았다. 환경 차단을 만난 것이 아니라 실행 범위 밖으로 유지했다. 이 사실을 제품 PASS/FAIL로 바꾸지 않는다.
- 실제 브라우저/사용자 프로필/개인 탭을 열거나 조작하지 않았다. 원본 경쟁 제품 코드·번들·WASM을 수집하지 않았다. 현재 Codex/Aside 전체 옵션 지원은 미확인이다.
- 위 반례는 문서 자체의 논리/판정 공백이며 제품 실측 재현과 분리했다. Before/After·경쟁 성능 수치를 새로 만들지 않았다.
- 현재 backlog.md가 최종 편집 전 초안임을 이해한다. 메인이 이번 모든 후보를 판단한 뒤 세 회차 수용 요구를 ID별 개발 묶음에 최종 매핑할 예정이므로 초안의 포괄적인 목록만을 별도 결함으로 세지 않았다. R3-01의 충돌 및 R3-02/03의 기대값은 그 최종 매핑 전에 결정할 필요가 있다. R3-04는 기존 규범의 fixture 경계를 구체화하는 제안이다.
- 제품 개발 착수·구현 적합성·배포/원격 PR 승인을 이 보고서로 선언하지 않는다. 메인의 모든 후보 수용/기각/보류 및 이유, 필요한 규범/검증 계획 갱신과 backlog 확정에서 현재 사용자 승인 범위를 마친다.

## 검토 SHA와 판정

문서 head `0e2e7fb28c75d2ae181a660556eb47f0ee4c853d`, 제품 baseline `700a6a06af3f97729327afaf9becb4ee29bb475b`에 대해 **CHANGES_REQUESTED (개발 전 명세)**. R3-01은 상반된 MUST 정리, R3-02/03은 실행 가능한 검증 기대값 확정 후보, R3-04는 비차단 검증 구체화 후보다. 제품 구현 및 새183개 규범의 실제 충족은 **미검증**이다.
