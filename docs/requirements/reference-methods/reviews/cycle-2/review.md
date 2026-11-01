# 참고 방식 보완 2차 독립 리뷰 · 설계 적용/요구 개선

- 검토 head: `f8a275fa35371ba5938fde80cd59620fc67adc3d`. 시작 HEAD와 일치, tracked working tree clean.
- 직전 1차 수정 head: `7c9851bb237e309b7507ca6fa1094b2b5135b71a`.
- 제품 baseline: `700a6a06af3f97729327afaf9becb4ee29bb475b`.
- 적용: `AGENTS.md`, `.agents/skills/browser-control-development/SKILL.md`, `references/reference-improvement.md`, `references/pr-review.md`, `planning/spec-reference-improvement-loop.md`.
- 역할: 고정본의 독립 문서 리뷰. 정본/제품/테스트 편집, 브라우저·원격·subagent 호출 없음. 이 보고서의 반례는 문서 계약 대조이며 제품에서 관찰한 실패가 아니다.

## 발견 후보

### REF2-01 · P2 · 개별 clip과의 양의 교차만으로는 중첩 scrollport에서 실제 노출을 판정할 수 없다

- 정확 위치: `docs/requirements/internal/locator.scrollIntoView.md:36-39`, **REQ-LOCATOR-SCROLLINTOVIEW-001-C01**. 연관 결정 `docs/requirements/reference-methods/reviews/cycle-2/research-decisions.md:15`의 C2A-09.
- 발생 조건/반례: 같은 main 좌표계에서 viewport의 y범위 V=[0,600], outer clip C1=[0,100], 그 안의 아직 바깥에 위치한 inner clip C2=[200,300], oversized target T=[0,300]을 둔다. x범위는 모두 겹친다. 이는 outer의 스크롤 밖에 있는 inner scrollport와 그 위로 돌출한 큰 자식 box로 구성할 수 있는 설계 fixture다. T∩V, T∩C1, T∩C2는 각각 양의 면적이지만 T∩V∩C1∩C2는 공집합이다. inner가 outer에 전부 잘리므로 대상 픽셀은 보이지 않는다.
- 기대/현재 계약의 문제: 부모의 “관련 scrollport에 노출”을 만족하려면 같은 부분이 전체 clipping 경로를 통과해야 한다. 현재 “각 관련 clip ... 교차길이가 모두 양수”, “box교차”, “이미 노출이면 불필요 scroll없다”는 **각각의 교집합**만 계산하는 구현/판정기를 통과시킬 수 있다. 그 경우 실제 노출0인데 true/no-scroll이 된다. 전체포함/center/overlay 제거를 요구하는 문제와 다르다.
- 사용자 영향: 중첩 영역에서 scrollIntoView 성공을 받았는데 실제 대상은 여전히 보이지 않으며 후속 발견/입력 흐름이 틀어진다. 이번 고정본은 제품 성공을 주장하지 않으므로 현재 제품 버그로 확정하지 않는다.
- 제안: 기존 최소 노출 선택을 유지하고 성공식을 `area(targetRect ∩ viewportRect ∩ clipRect1 ∩ ... ∩ clipRectN) > 0`으로 명시한다. 각 clip을 main CSS 좌표로 맞춘 뒤 **누적 교집합**을 판정하고, 위 반례는 이미 노출로 처리하지 않도록 C01의 준비/판정에 추가한다. oversized 정상 사례/overlay 별개 정책은 유지한다.
- 근거/도입: 2차 C2A-09 수용으로 새로 확정한 oracle의 논리적 공백이다. 경쟁 scroll API의 지원 여부나 실행 관측을 근거로 삼지 않았다.

### REF2-02 · P2 · MIME key 정규화 뒤 충돌하는 유효 record의 처리 결과가 미정이다

- 정확 위치: `docs/requirements/common/files-events.md:170-171`, **REQ-C-FILESEVENTS-007-C01**(`:159-162`) 및 `docs/requirements/internal/locator.drop.md:36-39`, **REQ-LOCATOR-DROP-001-C01**.
- 발생 조건/반례: `drop({data:{"Text/Plain":"A","text/plain":"B"}})`를 전달한다. 두 own key는 새 MIME token 문법에 모두 유효하며, 명시한 ASCII 소문자 정규화 뒤에는 둘 다 `text/plain`이 된다. 이를 별도 항목으로 보존할 수 없는데, 현재 상세표에는 정규화된 key 충돌의 거절/승자 규칙이 없다.
- 기대/현재 계약의 문제: `각 MIME 값 일치`와 `유효 MIME은 소문자`만으로는 A/B 중 어느 값을 전달할지, 둘을 합칠지, 호출을 사전 거절할지 판정할 수 없다. 구현이 임의로 앞/뒤 값을 버려도 정본이 유일한 oracle을 주지 못한다. 빈 문자열도 유효하므로 `{"Text/Plain":"","text/plain":"B"}`에서 truthiness를 써 처리하면 별도의 조용한 데이터 유실이 가능하다.
- 사용자 영향: 유효 입력에서 drop 데이터가 예측 불가능하게 덮어써지거나 동일 fixture가 구현별로 다른 결과를 통과시킨다. 파일/이벤트 확대가 아닌 새 정규화 규칙 자체의 충돌 경계다.
- 제안: 전송 전에 **정규화된 MIME key의 중복을 명시 입력 오류로 거절**하는 최소 정책을 권장한다. 메인이 last-write 등 다른 정책을 선택해도 가능하나 own-key 순서/동일값 중복/빈값의 기대 결과를 확정해야 한다. C007/C01 또는 drop Cnn에 대소문자 충돌과 data+files 혼합 사례를 넣고, 거절 선택이면 dragenter/dragover/drop0·파일선택/대상 불변을 판정한다.
- 근거/도입: C2B-06 수용으로 2차에 추가된 소문자 정규화/own-record 규칙과 기존 drop의 값 보존 요구를 대조했다. 브라우저 DataTransfer를 실제 호출하거나 경쟁제품의 미지원으로 판정한 것이 아니다.

### REF2-03 · P2 · 이미 명시 down한 주키에 대한 press 시퀀스가 기존 소유 보존과 충돌한다

- 정확 위치: `docs/requirements/common/input.md:131-133`; 부모 `docs/requirements/internal/keyboard.press.md:23`(**REQ-KEYBOARD-PRESS-001**)와 `:36-39`(**C01**). `locator.press`는 같은 소유 정책을 공유한다(`internal/locator.press.md:44-47`).
- 발생 조건/반례: 같은 Page에서 `keyboard.down("ArrowDown")`을 성공시킨 뒤 `keyboard.press("ArrowDown")` 또는 대상 Locator의 `press("ArrowDown")`를 호출한다. named primary key는 down/up의 유효 단일 토큰이고 press의 문법도 유효하다. 기존 주키 down과의 충돌을 사전 거절한다는 규칙은 현재 없다.
- 기대/현재 계약의 문제: 새 상세표는 press에 “주키down/up”을 요구하면서 끝에서 “기존명시down은보존”을 요구한다. 부모도 자신이 **새로 누른** modifier/주키만 해제하며 명시 down 소유는 대응 up/reset/close가 끝낸다고 한다. 기존에 누른 주키에 정상 down/up을 내보내면 그 명시 down까지 해제하고, up을 생략하면 표의 정상 press 시퀀스와 다르다. 현재 C01은 기존 **modifier Control**만 준비하므로 이 충돌을 잡지 못한다.
- 사용자 영향: down으로 구성한 지속 입력이 후속 press에 의해 예기치 않게 끝나거나 실제 브라우저 눌림과 내부 소유 상태가 갈라질 수 있다. 현재 제품이 그렇게 동작한다는 실측 주장은 아니다.
- 제안: mouse.click의 이미 필요한 버튼 down 경계와 같이, **press 주키가 이미 해당 Page에 명시 down이면 focus/키입력 전에 상태충돌로 거절하고 기존 down을 보존**하도록 최소 정책을 확정하는 것을 권장한다. 다른 처리도 가능하지만 주키 이벤트/최종 down 상태를 명시해야 한다. C01/C02에 기존 주키 down→동일 주키 press→명시 up 사례를 추가하고 기존 modifier 재사용 정상 사례는 유지한다.
- 근거/도입: 새 2차 키 grammar/이벤트 순서가 기존 부모의 소유 보존 규범을 구체화하면서 만든 충돌이다. `keyboard.down`은 처음부터 modifier뿐 아니라 단일키도 지원한다. 새 키/F키/alias/API를 요구하지 않는다.

## REF1-01..03 실제 반영 확인

- REF1-01: `input-state.md:1118`와 `evidence/codex/mapping.json`의 keyboard.type.syntax 모두 실제 개행 대신 `\n`을 가진 문자열이다. 직접 문서 조각 컴파일 검사에서 문법 오류0. 실행확인으로 승격되지 않았다.
- REF1-02: six-batch 본문과 evidence-index의 DOC는 공개 서명/설명으로 좁혔고 blank LIVE의 createdTab/output/count/readOnlyValue/close 및 HISTORICAL audit의 각 JSON pointer를 별도 claim으로 읽었다. `raw/blank-probe.json`과 `raw/historical-diagnostics-before-after.json#/codex`의 해당 값도 직접 대조했다. 같은 run 재사용을 새 실측으로 세지 않는다.
- REF1-03: `raw/cua-entry-excerpts.md`의 BrowserInfo/TabInfo/listBrowsers/listTabs/getTab/Target/ClickOptions/Direction/DOM-only 설명, logs substring/ISO timestamp와 추가 공개 문법 주석을 직접 읽었다. `raw/public-contract-excerpts.md`의 해당 서명 및 `sources.md`의 source 연결과 대조했다. 이 범위에서는 기존의 원문 대조 공백이 보완되었다. 공개 응답의 byte-identical 전체 보존이나 모든 과거 실행의 재현을 확인한 것은 아니다.

## 전체 범위의 판단과 수용 가능한 차이

- top-level lexical 재선언 거절/var 재선언 허용, 유한 timeout/호출시작 총deadline, 제한된 naming 우선순위, native/ARIA 상태와 편집타입, 동기 handler·microtask 후 동일 identity 사후판독, same-document goto, clip 전체포함 경계, Page close/reset의 분리된 수명·소유 정책은 자체 선택임을 분명히 표시한다. 경쟁 DOC/과거관측으로 현재 우리 구현 완료를 주장하지 않는다.
- includeCurrent:true는 일반 미래 waiter와 별도로 정의한 **현재 dialog 명시 조회**다. 공통 files-events:176이 current-query는 waiter가 아니라고 정해 등록 이후 event 규범과 구분하고, 없음/이미claim/타event의 즉시오류와 reset 후 새세대 획득을 C01/C02에 둔다. 자동 응답·범용 download/chooser 재획득·새 외부도구를 요구하지 않아 이번 범위를 넘는 확장으로 보지 않았다. 외부3/내부64 유지, PLAN/backlog/condition/양쪽 slot 연결을 확인했다.
- Codex 주표면 IAB와 보충 Chrome의 9개 부분관측 및 HISTORICAL을 분리한다. Chrome 일부 strict 관측과 IAB 문서의 first/null 차이는 미해결 표면 차이로 보존된다. 508개 not-established는 조건 전체의 동등성이 아직 입증되지 않았다는 의미이며 미지원/조사 실패/개발 자동 차단으로 해석하지 않았다.
- query/ref/세션/자산/출력 예산, snapshot cursor/diff/가상화·프레임·scroll 단서, strict/readonly·stale·부분효과, 파일 source/바이트/다운로드, 평가 JSON/Promise·수명/로그의 나머지 배치를 검토했다. 위 후보 외에 이번 범위의 필수 설계 충돌을 확정하지 않았다. 알려진 경쟁 공백을 이유로 규범을 완화하거나 새 API를 요구하지 않는다.

## 실제 읽은 범위

- 정본 **72문서(공통5/외부3/내부64)**의 입력/출력·오류·부작용, **185 REQ**, **254 Cnn**의 조건/준비/실행/판정 필드를 전체 읽었다. 반복 지원·현재사실·재시도 문구는 중복 제거한 텍스트도 읽었다. 초기 대량 출력에서 잘린 console/dialog/download/keyboard 구간은 별도 출력으로 보충했다. 미독 REQ/Cnn 없음.
- reference-methods의 **6본문/72 reference**에서 관계·제품별 예제/상태·claim·공백·우리 판단·PLAN을 읽었다. 반복 규범은 정본과 연결해 중복 제거한 추출본을 사용했다. input-state는 앞/뒤로 나눠 잘림 없이 보충했다.
- reference index **185×2=370 슬롯**의 provider/surface/reference/relation/relatedClaims/support, **254×2=508 condition unit**의 연결/coverage/reason/claim을 전체 파싱했고 동일 튜플을 묶어 전부 읽었다. 첫 긴 출력의 잘린 구간은 반복 surface/reason을 제거한 전체 재출력으로 보충했다. 이는 508개 경쟁 지원을 확인한 수치가 아니다.
- evidence-index **152 claim**의 id/kind/source/location/claim을 모두 읽었고 첫 긴 출력의 뒤쪽 누락은 80번 이후 별도 출력으로 보충했다. REF1 source/현재dialog 공개서명 및 대표 DOC/LIVE/HISTORICAL 원자료를 대조했다. coverage/1차 독립 리뷰 및 메인 판단/2차 A·B 후보 요약과 메인20개 판단도 읽었다. A/B 원문 전체와 원시 실행 trace의 전수 재리뷰를 했다고 주장하지 않는다.
- 정확한 ID/파일별 sha256/370 slot/508 condition 연결은 별도 `review2-manifest.json`에 보존했다.

## 검증/재현 명령과 결과

1. `git rev-parse HEAD`, `git status --short`: 지정 head 일치, tracked 변경 없음.
2. 정본 Markdown의 `### REQ` / `#### REQ...-Cnn` 추출과 JSON 매핑 대조: 정본72/REQ185/Cnn254/slot370/unit508/claim152. 중복/누락 REQ·condition·PLAN 매핑·관련 claim ID·reference anchor 오류0. 세부 결과는 manifest의 checks.
3. six-batch Codex text code block의 **문서 파싱만** 수행: JS는 async function compile, reset/js 요청은 JSON.parse. 총55블록(공통 waitForFunction 주석 의사코드1개 포함), 문법 오류0. 함수 호출/브라우저 실행 없음. `review2-syntax-check.json`에 저장했다. 문법 검사는 API 실제지원/옵션/전제조건/동작을 증명하지 않는다.
4. `git diff --name-only 700a6a06af3f97729327afaf9becb4ee29bb475b HEAD -- extension bridge scripts tests fixtures package.json package-lock.json`: 출력0. 제품·테스트·fixture·빌드 동결을 확인했다.
5. `.local/reference-loop-execution/review2.md`가 Git ignored임을 확인했다. 리뷰 산출물 외 변경 없음.

## 미실행·미검토·남은 위험

- 제품/fixture/test suite, 브라우저/경쟁 도구 호출, 원격 작업은 실행하지 않았다. 요구/예제가 실제 제품 경로에서 동작한다는 승인이 아니다.
- 새 정책을 구현하는 비용/성능, 모든 과거 trace·픽셀·실제 파일 바이트, 거대 중복 raw/requirements-read.json, 경쟁 제품 내부 구현은 미검토다. 기존 원시자료의 전체 재현을 REF1 재검증으로 과장하지 않는다.
- 3차 반례/예제 단계가 남아 있다. 이번 review2 이후 메인의 수정은 본 리뷰가 승인한 것으로 표시하면 안 된다.

## 판정

**CHANGES_REQUESTED** — P0/P1 없음, P2 후보3건. 새 정책의 노출/정규화 충돌/기존 주키 소유 경계를 메인이 수용·기각·보류 판단하고 정본 및 해당 Cnn의 oracle를 맞춘 뒤 3차로 진행한다. 나머지 전체 범위의 연결·표면/근거 구분·미검증 표시는 유효하다. 추가 API나 경쟁 실측 횟수를 완료 조건으로 요구하지 않는다.
