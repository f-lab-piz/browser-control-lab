# Codex 조사 A · 3차 마지막 반례/예제 교차조사

고정 head `704b316f14bd5c3062436c72a1efe6da4fb7d4d3`, 제품 baseline `700a6a06af3f97729327afaf9becb4ee29bb475b`. 2026-11-01. 조사자의 교차검토이며 독립 Sol C의 최종 판정을 대신하지 않는다.

**새 P0/P1/P2 필수 충돌은 이번 범위에서 확정하지 않았다.** 아래 C3A-01은 기존 공통 규칙을 바꾸지 않는 P3 사례 문구 명확화 후보다. 새 API/임의로 강한 요구/경쟁 실측 추가를 요청하지 않는다. 제품이 요구를 충족했다고 판정한 결과도 아니다.

## C3A-01 · P3 · drop 거절 사례의 'data 빈값'을 빈 record로 적어야 한다

- 정확 대상: `internal/locator.drop.md:65-70`, **REQ-LOCATOR-DROP-002-C01**의 준비 “files 없고 data 빈값”. 연결 규범은 `common/files-events.md:157-162` **REQ-C-FILESEVENTS-007-C01**, 상세표 `:171`의 “빈 문자열 value도 유효, {}는 없음”.
- 구체 반례: 거절 fixture 작성자가 “data 빈값”을 `drop({data:{'text/plain':''}})`로 구현하고 입력 오류/dropcounter0을 기대할 수 있다. 최신 공통표에서는 이 입력이 유효하다. 반면 `drop({data:{}})`는 파일도 없으면 빈 payload라 거절된다. 상위 공통표로 해석하면 현재 정책 자체는 정해져 있으므로 새 MUST 충돌로 보지는 않는다.
- 최소 수정안: C01 준비만 **“files 없음+data:{}; 문자열 아닌 MIME value; 잘못된 file source”**처럼 구체 값으로 교정한다. 기존 공통007의 정상 사례 `data:{'text/plain':''}`를 링크해 빈 record와 빈 value를 구분한다. REQ/Cnn/API 수를 늘리거나 유효 빈 문자열을 거절로 바꾸지 않는다.
- 판정 계획(미실행): 파일 없는 data:{}는 전송 전 오류·dragenter/dragover/drop0. 빈 문자열 MIME value는 일반 untrusted drop 전달 사례에서 `DataTransfer.types`에 text/plain 존재, getData('text/plain')==''와 반환파일[]를 확인한다. getData('text/plain')==''만으로는 key 부재와 구분되지 않으므로 types도 판독한다. 업무 완료/isTrusted 필수 사이트 성공은 별도다.
- 근거 범위: 최신 정본의 문자 의미를 대조한 명확화다. 실제 브라우저/제품 오류를 관측하지 않았다. 메인이 공통표 참조만으로 충분하다고 판단하면 기각해도 필수 충돌을 남기는 것으로 보지 않는다.

## 2차 수정과 주요 반례 재확인

### REF2-01 / 프레임·scroll·clip

- **REQ-LOCATOR-SCROLLINTOVIEW-001-C01**은 개별 clip마다 교차하는 조건에서 **target∩viewport∩모든 관련 overflow clip의 누적면적>0**으로 바뀌었다. V/outer/inner/target 반례를 그대로 준비에 넣었고 전체포함/center/overlay 제거를 보장하지 않는다. 개별 교집합만 양수인 잘린 대상을 이미 노출로 통과시킬 oracle 공백은 보완되었다.
- **REQ-C-DOMFRAMES-005-C01**, **REQ-LOCATOR-BOUNDINGBOX-001/002-C01**, **REQ-LOCATOR-CLICK-002-C02/C03**은 같은 main CSS 좌표·조상 hit/clipping·document identity를 구분한다. box 계산 자체와 실제 대상 명중/클릭 업무 성공은 별도로 판독하도록 남아 있다. 부모 overlay가 있는 자식을 CDP 좌표 전송 성공만으로 통과시킬 근거는 없다.
- **REQ-PAGE-SCREENSHOT-002-C01/C02**, **003-C01**은 DPR 정규화 크기와 픽셀 위치, viewport 전체포함 검사, resize의 최대3회 정합성을 구분한다. viewport 밖 clip을 교집합 crop/padding으로 성공시키지 않는다. fullPage가 iframe 내부 미노출 전체를 뜻하지 않는다는 경계도 유지된다. 제품의 실제 픽셀/재시도 구현은 미실행이다.

### REF2-02 / 파일 MIME·사전거절

- **REQ-C-FILESEVENTS-007-C01**과 `common/files-events.md:180`은 정규화 후 중복 key를 **값이 같거나 비어 있어도 DUPLICATE_MIME_TYPE으로 전체 사전 거절**한다고 확정했다. 파일 혼합에서도 전달0·기존선택 보존을 요구한다. 앞값/뒷값을 임의 선택하는 정책으로 읽을 수 없다.
- inline의 명시 MIME token 문법과 브라우저/서버 원본 metadata는 구분되며 Unicode filename·동명 다른 바이트·0-byte·[] 삭제·한파일/합32MiB가 독립 판정된다. 이 선택을 Aside/Codex 파일 API 지원이라고 표현하지 않는다.

### REF2-03 / 키·입력·부분효과

- **REQ-KEYBOARD-PRESS-001-C01**과 `common/input.md:137`은 해당 Page에 이미 명시 down인 주키를 동일 press할 때 **KEY_ALREADY_DOWN, focus/새 key 이벤트0, 기존 down 유지**로 정했다. 기존 Control modifier 재사용 정상 흐름과 분리했고 locator.press도 같은 정책을 따른다. 새 주키만 정상 down/up 시퀀스를 실행하므로 이전 부모 소유 보존과의 충돌은 보완되었다.
- **REQ-KEYBOARD-PRESS-001-C02**, **REQ-C-INPUT-003-C01**, **REQ-LOCATOR-PRESS-002-C01/C02**는 '+', Control++, modifier 선언순/새소유 역순 release, 사전오류/중도 fault를 구분한다. alias/F키/ControlOrMeta 자동치환을 추가 지원으로 확대하지 않는다.
- **REQ-LOCATOR-CLICK-001-C04**는 2rAF의 x/y/width/height 각1CSSpx 이하로 안정성을 정했고 0.5px/2px 이동·정지·rAF없음 sequence와 총5초를 구분한다. 무조건 완전정지를 요구하던 oracle로 되돌리지 않았다.
- **REQ-C-INPUT-004-C01**의 동기 handler+다음 microtask 뒤 동일 identity 사후판독을 fill/check/select/focus가 공유한다. 입력 뒤 timer의 임의 미래 변경까지 실패로 만들거나 재입력으로 상태를 맞추지 않는다. 준비 scroll/focus와 실제 값변경·down 뒤 fault의 부분효과도 분리한다.

### 이름·상태 표와 runtime 이행

- `common/selection.md`는 IDREF를 대상의 Document/ShadowRoot 안에서만 찾도록 명시했다. **REQ-SCOPE-GETBYLABEL-001-C01**도 main/open ShadowRoot의 같은 id/다른 이름을 준비한다. 다른 root/frame의 같은 id로 fallback하는 오류를 정답으로 만들지 않는다.
- `common/input.md`와 **REQ-LOCATOR-ISCHECKED-001-C01**은 native checked property/별도 indeterminate와 custom aria-checked=mixed→false를 구분한다. native와 ARIA 원문을 혼용해 native indeterminate를 무조건 boolean false로 덮지 않는다.
- lexical binding 목표와 기존 prototype 코드/테스트의 차이는 README/backlog의 **향후 이행 대상**으로 유지된다. 이번에 제품 코드를 조사하지 않았고, 그 알려진 차이를 새 문서 결함/현재 제품 실패 실측으로 반복하지 않는다.
- **REQ-PAGE-WAITFOREVENT-004-C01/C02**의 includeCurrent는 **현재 구현이 아닌 목표 옵션**이다(`docs/requirements/README.md:48`). current-query가 미래 waiter가 아니며 없음/이미claim/타event 오류, reset후 새 핸들, 자동accept/dismiss없음이 공통표와 연결되어 있다. 기본 등록후 event 규칙과 별도 예외이므로 새로운 충돌로 보지 않았다. download/chooser 범용 재획득까지 확장하지 않는다.

## snapshot 분할·unknown-target·평가

- **REQ-SCOPE-SNAPSHOT-001~011** 전체를 현재 DOM 수집과 반환예산으로 나누어 읽었다. offscreen/미로드/출력생략/접근불가 frame이 다른 이유이며, cursor는 정적 순회의 ref 합집합·중복0 및 변동시 재시작으로 판정한다. since는 동일문서/범위/옵션/양쪽완전성 전제에서만 diff를 준다. 제한 출력에서 삭제를 발명할 수 없다.
- 이름 없는 scrollport의 axes/offset/물리방향은 단서이며 wheel 소비/새데이터 로딩 보장이 아니다. **REQ-SCOPE-SNAPSHOT-004-C01/C02**와 `test-design.md` S04는 공개 업무 predicate·수신시각/첨부/읽음 상태를 UI에서 관찰할 수 있게 하고, 유일/동률/부재/미완료를 구분한다. 정확 selector/정답ID를 몰라도 접근 가능한 과제다. 실행자에게 서버 oracle ID를 주거나 서버 PASS를 직접 변경해야만 통과하는 설계로 읽히지 않는다.
- **REQ-C-RUNTIME-008-C01**, **REQ-SCOPE-EVALUATE-001/002-C01/C02**, **REQ-LOCATOR-EVALUATEALL-001/002-C01**, **REQ-PAGE-WAITFORFUNCTION-001/002-C01/C02**는 Promise settle·JSON/undefined 오류·arg null·선택 Scope·callback 호출횟수·사용자 throw와 navigation context 소멸·부분효과/late 결과를 나눈다. effectful 평가는 무조작 관찰의 예외다. waitForFunction의 반복평가를 single evaluate의 자동 재전송과 혼동하지 않는다.
- 같은문서 hash 이동과 실제문서 교체는 goto Cnn/ref수명표로 나뉘며 URL 변경만으로 stale을 결정하지 않는다. Page close는 해당Page만, reset은 세션전체 눌림 정리지만 실제탭/소유·완료파일/asset·tombstone과 데이터ref의 수명은 별도다.

## 예제·근거 상태 확인

- 현재6참고본문의 공개 호출 조각을 파싱했다. **79개 parse-ok / 오류0**, CLI shell3개는 JS 파싱에서 제외했다. JSON 요청은 JSON.parse, JS는 async function으로 컴파일만 했고 반환함수/브라우저를 호출하지 않았다. 의사코드 주석도 문법검사에 포함되므로 이 숫자는79개 API/실행/제품 PASS 수가 아니다. 결과는 `raw/cycle3-syntax.json`이다.
- keyboard.type의 newline은 여전히 `\n` 이스케이프이며 미실행 표시를 유지한다. DOM selector/name/변수·파일경로는 앞선 fixture 관찰/준비가 필요한 조각이다. 컴파일만 통과했다고 권한·옵션·실제 목표성공을 확인한 것으로 보지 않는다.
- DOC는 공개 서명/설명, 빈탭 LIVE는 해당 결과 객체, HISTORICAL은 audit의 구체 필드, DOM 조합은 INFERENCE로 나뉜 상태를 재확인했다. registry152 claim=DOC101/HISTORICAL31/INFERENCE15/LIVE5이며 고유 run이나 조건 충족 수가 아니다. 이번에는 원본/경쟁 도구/새 공개 문서 호출 없이 고정 자료의 해당 구분을 읽었다.
- 주 표면 IAB의508개 조건단위는 계속 not-established다. Chrome CUA의9부분관측과 IAB BLOCKED는 보충/차단 자료이며 주지원으로 승격되지 않았다. 현재 getByRole/filter/nth/slot/readonly/clip의 과거 값에서 새 이름/상태/기간/프레임 전체 지원을 끌어내는 새 혼합 주장은 이번 범위에서 발견하지 못했다.

## 실제 검토 범위 / 미검토

- 현재72정본의 API 입력/출력,185부모규범,254Cnn의 조건/준비/실행/판정을 모두 읽었다. 대량출력 잘림을 피하려고 외부/탭·snapshot·frame, 선택·상태·입력, mouse/key/wait, 파일·평가·로그·출력, 공통5 배치로 나누었다. 아래 ID/sha 목록은 고정head 원문과 바이트일치 확인 결과다.
- 공통 runtime/input/selection/files-events의 추가 상세표와 Document/ShadowRoot IDREF 수정, native checked/indeterminate 수정, REF2-01~03 수용결정과 Cnn변경을 직접 읽었다. 2차 research-decisions20개와 독립review2·수정decisions를 읽고 반영된 정책을 다시 후보로 늘리지 않았다.
- 6참고본문/72reference를 상태·관계·호출·claim·미확인·우리선택 중심으로 중복제거해 다시 읽었다. 큰 합본에서 잘린 input-state는 별도 재출력했고, 이전고정본 대비6본문 변경 diff도 읽어 includeCurrent 연결/공통표 링크 외에 기존 근거내용이 몰래 바뀌지 않았는지 대조했다.
- 미독 REQ/Cnn 목록: 없음. **미검토/미실행**: 제품/테스트/fixture 소스, 내부 구현 가능성/성능, 실제 브라우저/회사·개인사이트, 픽셀·파일바이트·입력trace의 신규실측. Source/API 실측을 새로 조사하지 않았다. 현재 모든 목표가 제품에서 실행가능/통과한다는 승인이 아니다.
- 새 browser·외부tool·원격·subagent 호출0, 정본/제품/fixture/테스트 수정0. 이번 산출물은 ignored 조사보고서와 예제파싱 결과뿐이다. 최종수용/기각과 독립최종리뷰는 메인의 후속절차다.

## 전체 읽은 ID와 파일 fingerprint

- `external/guide.md` — sha256 `0692607f3ae3b40fd744edad7e12a4c4653e6e2c1f1b866e80ee2578dda76a68`
  - REQ: REQ-GUIDE-001, REQ-GUIDE-002
  - Cnn: REQ-GUIDE-001-C01, REQ-GUIDE-001-C02, REQ-GUIDE-002-C01, REQ-GUIDE-002-C02
- `external/reset.md` — sha256 `a85fffa9d3f2c1c7ea44734ff170f7c2618f266c718caa3bde92cad4e99c056f`
  - REQ: REQ-RESET-001, REQ-RESET-002, REQ-RESET-003
  - Cnn: REQ-RESET-001-C01, REQ-RESET-001-C02, REQ-RESET-002-C01, REQ-RESET-002-C02, REQ-RESET-003-C01
- `external/js.md` — sha256 `192de8036a482f6c71ca4e7465a7ecbbf3e42a659f1881e2775eb3d08fbdd476`
  - REQ: REQ-JS-001, REQ-JS-002, REQ-JS-003
  - Cnn: REQ-JS-001-C01, REQ-JS-001-C02, REQ-JS-002-C01, REQ-JS-002-C02, REQ-JS-003-C01
- `internal/browser.list.md` — sha256 `41f597e2fc0a5ba12eec07f5a7a4824a010e5850738dd6a3697de709ac35a14f`
  - REQ: REQ-BROWSER-LIST-001, REQ-BROWSER-LIST-002
  - Cnn: REQ-BROWSER-LIST-001-C01, REQ-BROWSER-LIST-001-C02, REQ-BROWSER-LIST-002-C01
- `internal/browser.tabs.md` — sha256 `003becf9ae07e2bbc22d65599b8729b59f7deefe7d6bd2fdc7becd5bd757e979`
  - REQ: REQ-BROWSER-TABS-001, REQ-BROWSER-TABS-002
  - Cnn: REQ-BROWSER-TABS-001-C01, REQ-BROWSER-TABS-001-C02, REQ-BROWSER-TABS-002-C01
- `internal/browser.open.md` — sha256 `d13016fb909e572ccf1f8b20744650f881cf9f07a64a2b9fab0035d79b726fe4`
  - REQ: REQ-BROWSER-OPEN-001, REQ-BROWSER-OPEN-002
  - Cnn: REQ-BROWSER-OPEN-001-C01, REQ-BROWSER-OPEN-001-C02, REQ-BROWSER-OPEN-002-C01, REQ-BROWSER-OPEN-002-C02
- `internal/browser.attach.md` — sha256 `fed762baa7b0d4b293287ee08f9f3ccb64e55ffbbea4482eeaa78b42f4120968`
  - REQ: REQ-BROWSER-ATTACH-001, REQ-BROWSER-ATTACH-002
  - Cnn: REQ-BROWSER-ATTACH-001-C01, REQ-BROWSER-ATTACH-002-C01
- `internal/page.activate.md` — sha256 `dea227ea018f9d6cf6165e4ff0e21993743f2481da95f7bc56d19e12bc054f00`
  - REQ: REQ-PAGE-ACTIVATE-001, REQ-PAGE-ACTIVATE-002
  - Cnn: REQ-PAGE-ACTIVATE-001-C01, REQ-PAGE-ACTIVATE-002-C01
- `internal/page.close.md` — sha256 `daf0bd246fe4ac565aea4736120ccfbeeed591a948a35fe0b3d08ee14582f2ab`
  - REQ: REQ-PAGE-CLOSE-001, REQ-PAGE-CLOSE-002
  - Cnn: REQ-PAGE-CLOSE-001-C01, REQ-PAGE-CLOSE-002-C01
- `internal/page.goto.md` — sha256 `73677228a146fff68a7339a273dfbf5dd771699239f02cb3d29996ef39c04875`
  - REQ: REQ-PAGE-GOTO-001, REQ-PAGE-GOTO-002
  - Cnn: REQ-PAGE-GOTO-001-C01, REQ-PAGE-GOTO-001-C02, REQ-PAGE-GOTO-002-C01, REQ-PAGE-GOTO-002-C02, REQ-PAGE-GOTO-002-C03
- `internal/page.back.md` — sha256 `dafc1ec31ac670642470742751f5f09d81e19841dec8726185ba74a5e88272b2`
  - REQ: REQ-PAGE-BACK-001, REQ-PAGE-BACK-002
  - Cnn: REQ-PAGE-BACK-001-C01, REQ-PAGE-BACK-002-C01, REQ-PAGE-BACK-002-C02
- `internal/page.forward.md` — sha256 `22f416c27b5b201a2fc35d74f8cc6a20c25b3d1a2a81ef3472b7db85a31c4297`
  - REQ: REQ-PAGE-FORWARD-001, REQ-PAGE-FORWARD-002
  - Cnn: REQ-PAGE-FORWARD-001-C01, REQ-PAGE-FORWARD-002-C01, REQ-PAGE-FORWARD-002-C02
- `internal/page.reload.md` — sha256 `f98b5f92728915dd3d77c6bc30ed5e9d082816aeb259f3a8a98c9d9f445617bc`
  - REQ: REQ-PAGE-RELOAD-001, REQ-PAGE-RELOAD-002
  - Cnn: REQ-PAGE-RELOAD-001-C01, REQ-PAGE-RELOAD-002-C01, REQ-PAGE-RELOAD-002-C02
- `internal/scope.snapshot.md` — sha256 `e510bc94a310bb92816e43126e7359d14f5d7e28d7b217b65aaa42f79201369c`
  - REQ: REQ-SCOPE-SNAPSHOT-001, REQ-SCOPE-SNAPSHOT-002, REQ-SCOPE-SNAPSHOT-003, REQ-SCOPE-SNAPSHOT-004, REQ-SCOPE-SNAPSHOT-005, REQ-SCOPE-SNAPSHOT-006, REQ-SCOPE-SNAPSHOT-007, REQ-SCOPE-SNAPSHOT-008, REQ-SCOPE-SNAPSHOT-009, REQ-SCOPE-SNAPSHOT-010, REQ-SCOPE-SNAPSHOT-011
  - Cnn: REQ-SCOPE-SNAPSHOT-001-C01, REQ-SCOPE-SNAPSHOT-002-C01, REQ-SCOPE-SNAPSHOT-003-C01, REQ-SCOPE-SNAPSHOT-003-C02, REQ-SCOPE-SNAPSHOT-004-C01, REQ-SCOPE-SNAPSHOT-004-C02, REQ-SCOPE-SNAPSHOT-005-C01, REQ-SCOPE-SNAPSHOT-005-C02, REQ-SCOPE-SNAPSHOT-006-C01, REQ-SCOPE-SNAPSHOT-007-C01, REQ-SCOPE-SNAPSHOT-008-C01, REQ-SCOPE-SNAPSHOT-009-C01, REQ-SCOPE-SNAPSHOT-010-C01, REQ-SCOPE-SNAPSHOT-011-C01
- `internal/page.screenshot.md` — sha256 `f45f4865957670f9e718e511d8ce80b8ac3cce87226d8001deac8d054f96163f`
  - REQ: REQ-PAGE-SCREENSHOT-001, REQ-PAGE-SCREENSHOT-002, REQ-PAGE-SCREENSHOT-003, REQ-PAGE-SCREENSHOT-004
  - Cnn: REQ-PAGE-SCREENSHOT-001-C01, REQ-PAGE-SCREENSHOT-002-C01, REQ-PAGE-SCREENSHOT-002-C02, REQ-PAGE-SCREENSHOT-003-C01, REQ-PAGE-SCREENSHOT-004-C01
- `internal/page.frames.md` — sha256 `ec3ed5f49d2b1d5ab791c1794139b97b8dfad846f7c14c88c70cfd30ca73ead2`
  - REQ: REQ-PAGE-FRAMES-001, REQ-PAGE-FRAMES-002
  - Cnn: REQ-PAGE-FRAMES-001-C01, REQ-PAGE-FRAMES-002-C01
- `internal/page.frame.md` — sha256 `3ba441cd3f7bb56905d8cee330c8331c9c8d887c8bae367a4e12be7b9bf29617`
  - REQ: REQ-PAGE-FRAME-001, REQ-PAGE-FRAME-002
  - Cnn: REQ-PAGE-FRAME-001-C01, REQ-PAGE-FRAME-002-C01
- `internal/scope.locator.md` — sha256 `0660e9664dcb20cef44a6fbf70a6d4c84e9b61cd895be9725ed5a94b47e63ab2`
  - REQ: REQ-SCOPE-LOCATOR-001, REQ-SCOPE-LOCATOR-002
  - Cnn: REQ-SCOPE-LOCATOR-001-C01, REQ-SCOPE-LOCATOR-001-C02, REQ-SCOPE-LOCATOR-002-C01
- `internal/scope.getByRole.md` — sha256 `b9c52504a1df6bbe2d0778361120484508d2354a5f94d0b9cf040ea44cbf59cb`
  - REQ: REQ-SCOPE-GETBYROLE-001, REQ-SCOPE-GETBYROLE-002
  - Cnn: REQ-SCOPE-GETBYROLE-001-C01, REQ-SCOPE-GETBYROLE-001-C02, REQ-SCOPE-GETBYROLE-001-C03, REQ-SCOPE-GETBYROLE-002-C01, REQ-SCOPE-GETBYROLE-002-C02
- `internal/scope.getByText.md` — sha256 `52f6a83cc39ea805b80de3c3abb5428a016b3ad56bfb46cceee1253f27c757b8`
  - REQ: REQ-SCOPE-GETBYTEXT-001, REQ-SCOPE-GETBYTEXT-002, REQ-SCOPE-GETBYTEXT-003
  - Cnn: REQ-SCOPE-GETBYTEXT-001-C01, REQ-SCOPE-GETBYTEXT-001-C02, REQ-SCOPE-GETBYTEXT-002-C01, REQ-SCOPE-GETBYTEXT-002-C02, REQ-SCOPE-GETBYTEXT-003-C01
- `internal/scope.getByLabel.md` — sha256 `9e669f35e69c46602458ec6c19c82aec84c8358e88bc54bc60e681cdf943464a`
  - REQ: REQ-SCOPE-GETBYLABEL-001, REQ-SCOPE-GETBYLABEL-002
  - Cnn: REQ-SCOPE-GETBYLABEL-001-C01, REQ-SCOPE-GETBYLABEL-001-C02, REQ-SCOPE-GETBYLABEL-002-C01, REQ-SCOPE-GETBYLABEL-002-C02
- `internal/locator.filter.md` — sha256 `1bbd9d8228f122e9a2a32287555f84182c44760612c1c94531b0d12f10adeb27`
  - REQ: REQ-LOCATOR-FILTER-001, REQ-LOCATOR-FILTER-002, REQ-LOCATOR-FILTER-003, REQ-LOCATOR-FILTER-004
  - Cnn: REQ-LOCATOR-FILTER-001-C01, REQ-LOCATOR-FILTER-001-C02, REQ-LOCATOR-FILTER-002-C01, REQ-LOCATOR-FILTER-002-C02, REQ-LOCATOR-FILTER-003-C01, REQ-LOCATOR-FILTER-004-C01
- `internal/locator.nth.md` — sha256 `9d1dda19b177f4ae8e7b7ef089379745e0cd5e8dffc0aa030c3714c26d472e71`
  - REQ: REQ-LOCATOR-NTH-001, REQ-LOCATOR-NTH-002
  - Cnn: REQ-LOCATOR-NTH-001-C01, REQ-LOCATOR-NTH-002-C01
- `internal/locator.count.md` — sha256 `889b491352223d4b6764d78f6ed8737c85476f4d6da059dec49982b07ba34e6a`
  - REQ: REQ-LOCATOR-COUNT-001, REQ-LOCATOR-COUNT-002
  - Cnn: REQ-LOCATOR-COUNT-001-C01, REQ-LOCATOR-COUNT-001-C02, REQ-LOCATOR-COUNT-002-C01
- `internal/locator.textContent.md` — sha256 `fde358ec8ba40e2858225d62c703aabf34debe2dc2ab3316d0110ea1aa699419`
  - REQ: REQ-LOCATOR-TEXTCONTENT-001, REQ-LOCATOR-TEXTCONTENT-002
  - Cnn: REQ-LOCATOR-TEXTCONTENT-001-C01, REQ-LOCATOR-TEXTCONTENT-002-C01
- `internal/locator.getAttribute.md` — sha256 `b662313f6f594985c0d938b63ee3da3fb8fd3bdf84d9136d00245f3854dab852`
  - REQ: REQ-LOCATOR-GETATTRIBUTE-001, REQ-LOCATOR-GETATTRIBUTE-002
  - Cnn: REQ-LOCATOR-GETATTRIBUTE-001-C01, REQ-LOCATOR-GETATTRIBUTE-002-C01
- `internal/locator.inputValue.md` — sha256 `d85e375a8091d6ac1bb40c0da932b8865aaeacf4e366d6120baf7b375fb323f4`
  - REQ: REQ-LOCATOR-INPUTVALUE-001, REQ-LOCATOR-INPUTVALUE-002
  - Cnn: REQ-LOCATOR-INPUTVALUE-001-C01, REQ-LOCATOR-INPUTVALUE-002-C01
- `internal/locator.isVisible.md` — sha256 `d6561e7d272ea87c545b7d4b9deaf21e2c59cae0691554e7ccb0c8eab75fac67`
  - REQ: REQ-LOCATOR-ISVISIBLE-001, REQ-LOCATOR-ISVISIBLE-002
  - Cnn: REQ-LOCATOR-ISVISIBLE-001-C01, REQ-LOCATOR-ISVISIBLE-002-C01
- `internal/locator.isEnabled.md` — sha256 `4e94f70e27c0673fbcb3eb64991b84f01f6032d78d48d69fd7b645d88917a720`
  - REQ: REQ-LOCATOR-ISENABLED-001, REQ-LOCATOR-ISENABLED-002
  - Cnn: REQ-LOCATOR-ISENABLED-001-C01, REQ-LOCATOR-ISENABLED-002-C01
- `internal/locator.isEditable.md` — sha256 `0c282e867336633e41c0f5538157f87c0612d552169ac126190930ed79459188`
  - REQ: REQ-LOCATOR-ISEDITABLE-001, REQ-LOCATOR-ISEDITABLE-002
  - Cnn: REQ-LOCATOR-ISEDITABLE-001-C01, REQ-LOCATOR-ISEDITABLE-002-C01
- `internal/locator.isChecked.md` — sha256 `5dc5ffc15d467a014490e97c0a373f5dd9e93bdf0d2e7bf18eca313b27737b26`
  - REQ: REQ-LOCATOR-ISCHECKED-001, REQ-LOCATOR-ISCHECKED-002
  - Cnn: REQ-LOCATOR-ISCHECKED-001-C01, REQ-LOCATOR-ISCHECKED-002-C01
- `internal/locator.boundingBox.md` — sha256 `323d6f853a47ca1439e86a813836ea5b91c8b5214f9217135266fb2181541b15`
  - REQ: REQ-LOCATOR-BOUNDINGBOX-001, REQ-LOCATOR-BOUNDINGBOX-002
  - Cnn: REQ-LOCATOR-BOUNDINGBOX-001-C01, REQ-LOCATOR-BOUNDINGBOX-002-C01
- `internal/locator.click.md` — sha256 `9877ab38c23f8f93ac02ca4ca757a798cb7481ea83ef4f96af2c833555d83623`
  - REQ: REQ-LOCATOR-CLICK-001, REQ-LOCATOR-CLICK-002
  - Cnn: REQ-LOCATOR-CLICK-001-C01, REQ-LOCATOR-CLICK-001-C02, REQ-LOCATOR-CLICK-001-C03, REQ-LOCATOR-CLICK-001-C04, REQ-LOCATOR-CLICK-002-C01, REQ-LOCATOR-CLICK-002-C02, REQ-LOCATOR-CLICK-002-C03, REQ-LOCATOR-CLICK-002-C04
- `internal/locator.fill.md` — sha256 `d92b1a4b7e6d6d52d1662d3bc29db64ac2d4e7937ee54c32654ec3777e4da4a6`
  - REQ: REQ-LOCATOR-FILL-001, REQ-LOCATOR-FILL-002
  - Cnn: REQ-LOCATOR-FILL-001-C01, REQ-LOCATOR-FILL-001-C02, REQ-LOCATOR-FILL-002-C01, REQ-LOCATOR-FILL-002-C02, REQ-LOCATOR-FILL-002-C03
- `internal/locator.press.md` — sha256 `b1339c61cc5e45ea3c1bc2f3210675d86fd3e1fb351c165f530de0ac31ab86bd`
  - REQ: REQ-LOCATOR-PRESS-001, REQ-LOCATOR-PRESS-002
  - Cnn: REQ-LOCATOR-PRESS-001-C01, REQ-LOCATOR-PRESS-001-C02, REQ-LOCATOR-PRESS-002-C01, REQ-LOCATOR-PRESS-002-C02
- `internal/locator.hover.md` — sha256 `dd7f748469433bd5e16857f111b7125223be68fd10c351f459cf8b0a82057408`
  - REQ: REQ-LOCATOR-HOVER-001, REQ-LOCATOR-HOVER-002
  - Cnn: REQ-LOCATOR-HOVER-001-C01, REQ-LOCATOR-HOVER-002-C01
- `internal/locator.focus.md` — sha256 `48d1a72bb75d168bb26a94038f5987d34e66f3298b6dc1991a691bf518767202`
  - REQ: REQ-LOCATOR-FOCUS-001, REQ-LOCATOR-FOCUS-002
  - Cnn: REQ-LOCATOR-FOCUS-001-C01, REQ-LOCATOR-FOCUS-002-C01
- `internal/locator.scrollIntoView.md` — sha256 `fe5d1f248f098e8f82d79bff6e3637dc59c754b7ff2caaf5794772b5a571701c`
  - REQ: REQ-LOCATOR-SCROLLINTOVIEW-001, REQ-LOCATOR-SCROLLINTOVIEW-002
  - Cnn: REQ-LOCATOR-SCROLLINTOVIEW-001-C01, REQ-LOCATOR-SCROLLINTOVIEW-002-C01
- `internal/locator.setChecked.md` — sha256 `14db2a4231643e223bd7a502dd8664db52393f277e4780529b2267681825083d`
  - REQ: REQ-LOCATOR-SETCHECKED-001, REQ-LOCATOR-SETCHECKED-002
  - Cnn: REQ-LOCATOR-SETCHECKED-001-C01, REQ-LOCATOR-SETCHECKED-001-C02, REQ-LOCATOR-SETCHECKED-002-C01
- `internal/locator.selectOption.md` — sha256 `747200b4e8260459582ec63ecff9832bea231e8c401e865fe166e5a85f0570a0`
  - REQ: REQ-LOCATOR-SELECTOPTION-001, REQ-LOCATOR-SELECTOPTION-002
  - Cnn: REQ-LOCATOR-SELECTOPTION-001-C01, REQ-LOCATOR-SELECTOPTION-001-C02, REQ-LOCATOR-SELECTOPTION-002-C01, REQ-LOCATOR-SELECTOPTION-002-C02
- `internal/locator.dragTo.md` — sha256 `867f4c93f0f549f224b5d2ac4d54412177004d67581b6f9860c392a88331a1ec`
  - REQ: REQ-LOCATOR-DRAGTO-001, REQ-LOCATOR-DRAGTO-002
  - Cnn: REQ-LOCATOR-DRAGTO-001-C01, REQ-LOCATOR-DRAGTO-001-C02, REQ-LOCATOR-DRAGTO-002-C01, REQ-LOCATOR-DRAGTO-002-C02
- `internal/locator.drop.md` — sha256 `cccfba30131cfa5785f063e104234dc6f72e5c5ae515412767986abfcaeb51fb`
  - REQ: REQ-LOCATOR-DROP-001, REQ-LOCATOR-DROP-002
  - Cnn: REQ-LOCATOR-DROP-001-C01, REQ-LOCATOR-DROP-001-C02, REQ-LOCATOR-DROP-002-C01, REQ-LOCATOR-DROP-002-C02
- `internal/mouse.move.md` — sha256 `e9e15dbd7612fd539aeafc3afd0e41ae3158c542874ae954873bfe84bca35221`
  - REQ: REQ-MOUSE-MOVE-001, REQ-MOUSE-MOVE-002
  - Cnn: REQ-MOUSE-MOVE-001-C01, REQ-MOUSE-MOVE-002-C01
- `internal/mouse.down.md` — sha256 `25a9d0647aff467d3bd24008544943dec8a86c900f2874b8146f78b74c60f0d3`
  - REQ: REQ-MOUSE-DOWN-001, REQ-MOUSE-DOWN-002
  - Cnn: REQ-MOUSE-DOWN-001-C01, REQ-MOUSE-DOWN-002-C01
- `internal/mouse.up.md` — sha256 `f1264c702ec039f0fc76ba37eac7de448247870a3bfe397d13e8876f93628bb7`
  - REQ: REQ-MOUSE-UP-001, REQ-MOUSE-UP-002
  - Cnn: REQ-MOUSE-UP-001-C01, REQ-MOUSE-UP-002-C01
- `internal/mouse.click.md` — sha256 `aaa6b2a29e95d0ec8cfba4ae5a163732d8d1b6e2655854d51211c60581a4d89b`
  - REQ: REQ-MOUSE-CLICK-001, REQ-MOUSE-CLICK-002
  - Cnn: REQ-MOUSE-CLICK-001-C01, REQ-MOUSE-CLICK-002-C01, REQ-MOUSE-CLICK-002-C02
- `internal/mouse.wheel.md` — sha256 `291f65b78e72d3ce2fbac4293dc86de492e2686c373fceb6850bc6b9549f7a3a`
  - REQ: REQ-MOUSE-WHEEL-001, REQ-MOUSE-WHEEL-002
  - Cnn: REQ-MOUSE-WHEEL-001-C01, REQ-MOUSE-WHEEL-002-C01, REQ-MOUSE-WHEEL-002-C02
- `internal/keyboard.down.md` — sha256 `e3bb0ab0aeeec394f89dd30af62b01d033c70e18917c6cb1b7196b3db7e22f5c`
  - REQ: REQ-KEYBOARD-DOWN-001, REQ-KEYBOARD-DOWN-002
  - Cnn: REQ-KEYBOARD-DOWN-001-C01, REQ-KEYBOARD-DOWN-002-C01
- `internal/keyboard.up.md` — sha256 `383cc3504b33701cb4524ce7f77e066f8377b7bb9210e8445fe27de913757292`
  - REQ: REQ-KEYBOARD-UP-001, REQ-KEYBOARD-UP-002
  - Cnn: REQ-KEYBOARD-UP-001-C01, REQ-KEYBOARD-UP-002-C01
- `internal/keyboard.press.md` — sha256 `b220f2bc887ad27433c5a5604a5d8f994978fe07b64ddbf484ae702d5b881c00`
  - REQ: REQ-KEYBOARD-PRESS-001, REQ-KEYBOARD-PRESS-002
  - Cnn: REQ-KEYBOARD-PRESS-001-C01, REQ-KEYBOARD-PRESS-001-C02, REQ-KEYBOARD-PRESS-002-C01
- `internal/keyboard.type.md` — sha256 `49d5a1fdc93c679a1e224d9aaaeba1b82800b3ef89229e636ebd7c97dd9cbf74`
  - REQ: REQ-KEYBOARD-TYPE-001, REQ-KEYBOARD-TYPE-002
  - Cnn: REQ-KEYBOARD-TYPE-001-C01, REQ-KEYBOARD-TYPE-001-C02, REQ-KEYBOARD-TYPE-002-C01, REQ-KEYBOARD-TYPE-002-C02
- `internal/locator.waitFor.md` — sha256 `515f369e98927a43a37f6440ec72244954dc1b58e5f081d4d82921f29570314d`
  - REQ: REQ-LOCATOR-WAITFOR-001, REQ-LOCATOR-WAITFOR-002
  - Cnn: REQ-LOCATOR-WAITFOR-001-C01, REQ-LOCATOR-WAITFOR-002-C01, REQ-LOCATOR-WAITFOR-002-C02
- `internal/page.waitForEvent.md` — sha256 `787cadf4fdbf749c6413a1076c087409f459dcc93753ebc67db404e14577d953`
  - REQ: REQ-PAGE-WAITFOREVENT-001, REQ-PAGE-WAITFOREVENT-002, REQ-PAGE-WAITFOREVENT-003, REQ-PAGE-WAITFOREVENT-004
  - Cnn: REQ-PAGE-WAITFOREVENT-001-C01, REQ-PAGE-WAITFOREVENT-002-C01, REQ-PAGE-WAITFOREVENT-002-C02, REQ-PAGE-WAITFOREVENT-003-C01, REQ-PAGE-WAITFOREVENT-004-C01, REQ-PAGE-WAITFOREVENT-004-C02
- `internal/page.waitForURL.md` — sha256 `4d32bca01b94c6a875fb73f2a6e2f2b720755fb7fe611fab08416e3d1fd462be`
  - REQ: REQ-PAGE-WAITFORURL-001, REQ-PAGE-WAITFORURL-002
  - Cnn: REQ-PAGE-WAITFORURL-001-C01, REQ-PAGE-WAITFORURL-002-C01, REQ-PAGE-WAITFORURL-002-C02
- `internal/page.waitForFunction.md` — sha256 `3fecc27c027b0829354c84000ea7b0f8de1c975066e38f9c42c8889fdaf41d49`
  - REQ: REQ-PAGE-WAITFORFUNCTION-001, REQ-PAGE-WAITFORFUNCTION-002
  - Cnn: REQ-PAGE-WAITFORFUNCTION-001-C01, REQ-PAGE-WAITFORFUNCTION-002-C01, REQ-PAGE-WAITFORFUNCTION-002-C02
- `internal/page.waitForLoadState.md` — sha256 `543758a43b3eb723ef13a007e887da1e37c8a7a7241f211a44cd31c872413443`
  - REQ: REQ-PAGE-WAITFORLOADSTATE-001, REQ-PAGE-WAITFORLOADSTATE-002
  - Cnn: REQ-PAGE-WAITFORLOADSTATE-001-C01, REQ-PAGE-WAITFORLOADSTATE-002-C01
- `internal/locator.setFiles.md` — sha256 `6e038e082896d079de41f403012223203f96f79d49c19424090c78aeda25569e`
  - REQ: REQ-LOCATOR-SETFILES-001, REQ-LOCATOR-SETFILES-002, REQ-LOCATOR-SETFILES-003
  - Cnn: REQ-LOCATOR-SETFILES-001-C01, REQ-LOCATOR-SETFILES-001-C02, REQ-LOCATOR-SETFILES-001-C03, REQ-LOCATOR-SETFILES-002-C01, REQ-LOCATOR-SETFILES-002-C02, REQ-LOCATOR-SETFILES-002-C03, REQ-LOCATOR-SETFILES-003-C01
- `internal/chooser.setFiles.md` — sha256 `a2a029bdc683dadd6e8570fd946d43ff4132012c0b8492c77e1073c9d1c3bc8b`
  - REQ: REQ-CHOOSER-SETFILES-001, REQ-CHOOSER-SETFILES-002
  - Cnn: REQ-CHOOSER-SETFILES-001-C01, REQ-CHOOSER-SETFILES-002-C01, REQ-CHOOSER-SETFILES-002-C02
- `internal/download.save.md` — sha256 `ff17b744cf9f8080d4569c39492d73e176f255d87f78107fa19ac560e24c5a40`
  - REQ: REQ-DOWNLOAD-SAVE-001, REQ-DOWNLOAD-SAVE-002
  - Cnn: REQ-DOWNLOAD-SAVE-001-C01, REQ-DOWNLOAD-SAVE-001-C02, REQ-DOWNLOAD-SAVE-002-C01, REQ-DOWNLOAD-SAVE-002-C02
- `internal/download.cancel.md` — sha256 `8e8bd26cdde23a00bec85099c72d06871a648cfdc43ad5c7cbe4655dad1c4947`
  - REQ: REQ-DOWNLOAD-CANCEL-001, REQ-DOWNLOAD-CANCEL-002
  - Cnn: REQ-DOWNLOAD-CANCEL-001-C01, REQ-DOWNLOAD-CANCEL-002-C01
- `internal/dialog.accept.md` — sha256 `5553ccf4f592d9768542eced5edd7784c7f9a26f0cd1e0dbe4326f48c700f263`
  - REQ: REQ-DIALOG-ACCEPT-001, REQ-DIALOG-ACCEPT-002
  - Cnn: REQ-DIALOG-ACCEPT-001-C01, REQ-DIALOG-ACCEPT-002-C01
- `internal/dialog.dismiss.md` — sha256 `84575a8f3aa6536142df0a95429ee6b5e5698ebc395199ea21ed07d593827707`
  - REQ: REQ-DIALOG-DISMISS-001, REQ-DIALOG-DISMISS-002
  - Cnn: REQ-DIALOG-DISMISS-001-C01, REQ-DIALOG-DISMISS-002-C01
- `internal/scope.evaluate.md` — sha256 `d11d1a749ff229a32519c578d6e6094e2b666ce8123282dc9fd70d7d422d6765`
  - REQ: REQ-SCOPE-EVALUATE-001, REQ-SCOPE-EVALUATE-002
  - Cnn: REQ-SCOPE-EVALUATE-001-C01, REQ-SCOPE-EVALUATE-001-C02, REQ-SCOPE-EVALUATE-002-C01, REQ-SCOPE-EVALUATE-002-C02
- `internal/locator.evaluateAll.md` — sha256 `6f582c212c138acba60f8594c99c4fb28d83a22bbadd96239def8f26770922d8`
  - REQ: REQ-LOCATOR-EVALUATEALL-001, REQ-LOCATOR-EVALUATEALL-002
  - Cnn: REQ-LOCATOR-EVALUATEALL-001-C01, REQ-LOCATOR-EVALUATEALL-002-C01
- `internal/page.logs.md` — sha256 `f6a9c15c97a96913629321b6a272ff2e5a1d2f2450a18f735cdd1919418cf4aa`
  - REQ: REQ-PAGE-LOGS-001, REQ-PAGE-LOGS-002
  - Cnn: REQ-PAGE-LOGS-001-C01, REQ-PAGE-LOGS-002-C01
- `internal/console.log.md` — sha256 `3e43132ef2b22647061e119e15c90b05add5e47f9d42fa368e90294ecf1e1ae5`
  - REQ: REQ-CONSOLE-LOG-001, REQ-CONSOLE-LOG-002
  - Cnn: REQ-CONSOLE-LOG-001-C01, REQ-CONSOLE-LOG-002-C01, REQ-CONSOLE-LOG-002-C02
- `internal/display.md` — sha256 `6747c978abf7f42af60d1ce6fb7480e5aee86d6fa4b052101b484cd9fc40a874`
  - REQ: REQ-DISPLAY-001, REQ-DISPLAY-002
  - Cnn: REQ-DISPLAY-001-C01, REQ-DISPLAY-002-C01
- `common/runtime.md` — sha256 `bc1fab8faeeee0429c9d4df3aade7a179ce19d51e99a755b303d18eac6a83ed4`
  - REQ: REQ-C-RUNTIME-001, REQ-C-RUNTIME-002, REQ-C-RUNTIME-003, REQ-C-RUNTIME-004, REQ-C-RUNTIME-005, REQ-C-RUNTIME-006, REQ-C-RUNTIME-007, REQ-C-RUNTIME-008
  - Cnn: REQ-C-RUNTIME-001-C01, REQ-C-RUNTIME-002-C01, REQ-C-RUNTIME-003-C01, REQ-C-RUNTIME-004-C01, REQ-C-RUNTIME-005-C01, REQ-C-RUNTIME-006-C01, REQ-C-RUNTIME-007-C01, REQ-C-RUNTIME-008-C01
- `common/dom-frames.md` — sha256 `a1ee529882d5457855f1a07b9272f91214b440226875d15e858a2f6f65238ec6`
  - REQ: REQ-C-DOMFRAMES-001, REQ-C-DOMFRAMES-002, REQ-C-DOMFRAMES-003, REQ-C-DOMFRAMES-004, REQ-C-DOMFRAMES-005, REQ-C-DOMFRAMES-006
  - Cnn: REQ-C-DOMFRAMES-001-C01, REQ-C-DOMFRAMES-002-C01, REQ-C-DOMFRAMES-003-C01, REQ-C-DOMFRAMES-004-C01, REQ-C-DOMFRAMES-005-C01, REQ-C-DOMFRAMES-006-C01
- `common/selection.md` — sha256 `1fb2cd2b00cdbc526e9e20fd0652f04ca31a3f42268fff7bb99ec54b866abfdc`
  - REQ: REQ-C-SELECTION-001, REQ-C-SELECTION-002, REQ-C-SELECTION-003, REQ-C-SELECTION-004, REQ-C-SELECTION-005, REQ-C-SELECTION-006
  - Cnn: REQ-C-SELECTION-001-C01, REQ-C-SELECTION-002-C01, REQ-C-SELECTION-003-C01, REQ-C-SELECTION-004-C01, REQ-C-SELECTION-005-C01, REQ-C-SELECTION-006-C01
- `common/input.md` — sha256 `4cad559f5bed263dbcd52ae3ed8995c4e27163e0769958a5e27f8f83bf1c8185`
  - REQ: REQ-C-INPUT-001, REQ-C-INPUT-002, REQ-C-INPUT-003, REQ-C-INPUT-004, REQ-C-INPUT-005
  - Cnn: REQ-C-INPUT-001-C01, REQ-C-INPUT-002-C01, REQ-C-INPUT-003-C01, REQ-C-INPUT-004-C01, REQ-C-INPUT-005-C01
- `common/files-events.md` — sha256 `796a049a50a9321674f56ed4600c332d142a5bb4479c318f4bdfe994cdca869f`
  - REQ: REQ-C-FILESEVENTS-001, REQ-C-FILESEVENTS-002, REQ-C-FILESEVENTS-003, REQ-C-FILESEVENTS-004, REQ-C-FILESEVENTS-005, REQ-C-FILESEVENTS-006, REQ-C-FILESEVENTS-007
  - Cnn: REQ-C-FILESEVENTS-001-C01, REQ-C-FILESEVENTS-002-C01, REQ-C-FILESEVENTS-003-C01, REQ-C-FILESEVENTS-004-C01, REQ-C-FILESEVENTS-005-C01, REQ-C-FILESEVENTS-006-C01, REQ-C-FILESEVENTS-007-C01

합계72문서 / 185 REQ / 254 Cnn. 전체ID중복/누락0, 고정head원문일치.
