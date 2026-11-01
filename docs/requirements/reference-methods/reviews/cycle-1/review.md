# 참고 방식 보완 1차 독립 리뷰

- 검토 head: `ad821711153ffd8296b2557289214abaa9212774` (시작 시 HEAD와 일치, tracked working tree clean).
- 문서 base: `850326772bb826b37fa182b98007b1313c925a2c`.
- 제품 baseline: `700a6a06af3f97729327afaf9becb4ee29bb475b`.
- 적용: AGENTS.md, 프로젝트 SKILL.md, references/reference-improvement.md 및 pr-review.md, planning/spec-reference-improvement-loop.md.
- 역할: 근거/대응 정확성의 독립 검토. 정본/제품/테스트 수정, 브라우저 호출, 원격 게시, subagent 생성 없음.

## 발견 후보

### REF1-01 · P2 · 문법 확인 표시의 keyboard.type 예제가 JavaScript로 파싱되지 않는다

- 위치: `docs/requirements/reference-methods/input-state.md:1109` 및 `:1112-1113`, `ref-keyboard-type`; 대응 REQ-KEYBOARD-TYPE-001/002, 특히 REQ-KEYBOARD-TYPE-001-C02.
- 조건/반례: Codex 호출 조각을 그대로 JS REPL에 넣는다. 이중따옴표 문자열 내부에 실제 개행이 들어 있어 `await focusedLocator.type("한글🙂` 다음 줄에서 문자열을 닫는다.
- 기대/실제: syntax-confirmed-not-executed 예제는 JS 문법을 만족해야 하나, 브라우저 실행 전 파싱 단계에서 `Invalid or unexpected token`이다. 여러 줄 입력 참고 예제를 이용할 수 없다.
- 확인: 코드 블록을 추출해 async 함수 본문으로 `new Function`에 전달하는 **컴파일만** 수행했다. 브라우저/예제 실행은 하지 않았다. runtime-output의 외부 js 요청 JSON은 JS 문장이 아닌 요청 객체이므로 같은 검사에서 나온 colon 오류를 별도 결함으로 세지 않았다.
- 수정안: 실제 개행을 `\n` 이스케이프로 작성하거나 적절한 template literal을 사용한다. 원본 조사 mapping의 syntax와 본문을 함께 고친다. 실행확인으로 올리지는 않는다.
- 도입: base→head에서 추가된 참고 본문의 오류.

### REF1-02 · P2 · 현재 DOC claim에 과거/신규 실측 주장이 혼합된다

- 대표 위치: `docs/requirements/reference-methods/evidence-index.json:126-134` (`CL-CODEX-browser-open-01`, kind=DOC인데 claim="새 background about:blank 탭 생성 실제 성공").
- 같은 유형: `:283` snapshot tail/selected 과거 관찰, `:349` screenshot JPEG320x240 과거 관찰, `:470` getByRole regex/slot 과거 성공, `:558` filter 과거2, `:591` nth(-1) 과거1, `:624` count0 실측, `:767` click 과거slot/scale, `:822` fill 과거readonly, `:1295` console 출력실측. 각 배치 본문에도 같은 DOC 문장이 복사된다.
- 대응 REQ: BROWSER-OPEN, SCOPE-SNAPSHOT, PAGE-SCREENSHOT, SCOPE-GETBYROLE, LOCATOR-FILTER/NTH/COUNT/CLICK/FILL, CONSOLE-LOG의 연결 REQ. 조건 전체의 동등 지원을 잘못 확인한 문제라는 뜻은 아니다.
- 조건/반례: DOC 종류로 개별 claim을 필터하거나 현재 공개 가이드에 근거한 사실만 재사용하면, 문서가 새 탭 실제 성공/과거 fixture 성공을 증명하는 것처럼 보인다. 같은 owner의 별도 LIVE/HISTORICAL claim이 있어도 해당 DOC claim 자체의 잘못된 provenance는 남는다. 공개 서명은 실행 결과를 증명하지 않는다.
- 근거: `evidence/codex/raw/blank-probe.json`은 실제 생성/count0/종료 run의 LIVE 근거이고, `raw/historical-diagnostics-before-after.json#/codex`의 clip/regex/filter/nth/slot/readonly 등은 HISTORICAL이다. 현재 `raw/public-contract-excerpts.md`는 서명/설명 자료다. 규칙은 문서 전체가 아닌 claim별 근거 종류를 분리하도록 한다.
- 수정안: DOC claim은 현재 공개 서명/설명으로 좁히고, 관측 사실은 이미 있는 LIVE/HISTORICAL claim에 구체 값과 해당 JSON 위치를 넣는다. 현재 "only applicable audit result named in sources.md" 같은 공통 HISTORICAL 문장을 owner별 관측으로 구체화하면 reader가 source를 역추적하기 쉽다. 조건504개 not-established 및 고유 run 수는 유지할 수 있다.
- 도입: base→head에서 생성된 registry/참고 본문.

### REF1-03 · P2 · 일부 현재 CUA DOC 주장의 원문이 고정 산출물에 보존되지 않아 독립 대조가 불가능하다

- 대표 위치: `docs/requirements/reference-methods/lifecycle-evaluation.md:12-19`, `ref-browser-list`, REQ-BROWSER-LIST-001/002. `cua.listBrowsers({emit:false})` 문법 및 BrowserInfo id/name/family/type/profileName/metadata를 DOC로 확정한다.
- 연관 위치: `evidence/codex/sources.md:11-12`는 원자료를 첫 tool transcript라고만 지칭하고 원문 발췌로 `raw/public-contract-excerpts.md`를 안내한다. 그런데 그 파일은 Browser/Tabs/Tab부터 시작하며 `cua.listBrowsers`, BrowserInfo, `cua.listTabs`, TabInfo 정의, Target.click/scroll/pressKey 등의 실제 진입 계약은 없다. sources.md:30/36은 작성자의 요약이다.
- 조건/반례: 현재 head만 받은 리뷰어가 위 문법/필드/네이티브 옵션을 확인하려 해도 원문 계약으로 대조할 수 없다. 첫 응답의 안정적 transcript 포인터도 기록되지 않았다. 이는 API가 없다는 판정이나 요약이 틀렸다는 확정이 아니라 **직접 근거의 재검토 공백**이다.
- 추가 예: `CL-CODEX-page-logs-01` (`evidence-index.json:1284`)의 "filter substring/ISO timestamp"는 발췌의 `filter?: string`, `timestamp: string`만으로는 해당 의미까지 입증되지 않는다. 원문에 그 설명이 있었다면 해당 설명도 보존해야 한다.
- 수정안: 이미 수신한 공개 응답에서 해당 주장에 필요한 원문 서명/의미만 추가 보존하고 정확한 파일·절 또는 줄 범위로 연결한다. 전체 응답 복사나 신규 브라우저 실측은 필요 없다. 보존 원문을 얻지 못한 의미는 명시 미확인/추론으로 낮추되, 경쟁 제품 미지원으로 표현하지 않는다.
- 도입: 이번 문서가 DOC를 선언하면서 재검토 가능한 발췌 범위를 누락함.

## 실제 검토 범위

- 외부3/내부64/공통5 = 72문서. 계약 입력/출력/부작용/오류, 184개 REQ 규범, 252개 #### 사례의 조건·준비·실행·판정 필드를 전체 읽었다. 반복 메타/상태/지원/재시도·현재 사실 문장은 중복 제거한 텍스트도 읽어 규범/구현 상태의 분리를 확인했다. 조건/REQ의 정확 목록과 파일별 hash는 `review1-manifest.json`에 남긴다.
- reference-methods의6본문 전체72 reference를 API별로 확인했다. 현재 주 표면/관계/예제/claim/추가확인/우리설계/PLAN은 반복 템플릿을 제외한 추출본으로도 읽었다. 본문 일부 도구 출력이 잘린 구간은 input-state/files-events 별도 출력과 scope.evaluate 원문으로 보충했다.
- 184 REQ×2=368 slot의 provider/reference/relation/relatedClaims 및 condition 연결을 API별 동일 튜플로 묶어 전부 읽고 구조 검사했다. 252조건×2=504단위의 미확인 상태/이유·claim 연결을 검사했고 각 조건의 의미와 대응 공백을 검토했다. 이는 경쟁 지원504개를 입증한 것이 아니다.
- evidence-index의136 claim을 모두 읽고 source/kind/owner를 확인했다. registry/sources/coverage/decisions를 읽었다. Aside current main/repl/help 원문 전체와 Codex public-contract-excerpts/file-uploads, blank probe, 과거 audit의 Codex/Aside 하위 결과, compare-aside 하니스의 관련 경로를 직접 대조했다. 보존 역사 source-manifest4개 사본 hash 일치를 확인했다.
- 규범상의 click2frame/1px/5초, asset/세션/예산/strict/stable ref/effectful evaluate는 우리 설계로 표시된다. Codex read-only·first-matched/Aside snapshot ref 무효화와 구별된다. wrapper/일반 Playwright 결과를 원본 지원으로 합산한 확정 오류는 발견하지 않았다.

## 형식/읽기 검사 결과

- REQ 집합184 일치, linkedSlots368, provider별184, 조건252/단위504 일치.
- 누락 reference anchor, 누락 REQ 참고 링크, condition anchor, relatedClaim 고아ID: 발견0.
- fullConditionEvidence.not-established=504. 이를 미지원/조사실패로 해석하지 않았고 0%라는 이유로 후보를 만들지 않았다.
- distinct sourceId16과 claim136을 확인했다. 새 빈탭 run1/과거 비교보고 run1의 집계 방식은 반복 API 재사용을 새 run으로 세지 않는다.
- 문서 base→head 및 제품baseline→head에서 extension/bridge/scripts/tests/fixtures/package 파일의 변경 없음(읽기 전용 git diff). 제품/테스트 실행 없음.
- 코드 조각 파싱은 API 구현·옵션 의미·권한·전제조건을 검증하지 않는다. 외부 js 요청 JSON은 JSON으로 읽어야 하므로 JS문장 검사에서 제외한다. 파싱 외부/제품 test suite는 실행하지 않았다.

## 미검토/자료 한계와 남은 위험

- 현 도구를 직접 재호출하거나 브라우저 실측하지 않았다. fixed-head 출처만 리뷰했다. A/B의 이후 ignored 보강은 읽지 않았다.
- 거대 `raw/requirements-read.json` 옛중복스냅샷 전문과 A/B findings 제안 전체, 예전 우리 제품의 각 실행 trace/픽셀/파일 바이트는 전문 검토하지 않았다. 정본72문서와 현재 증거의 해당 claim 경로를 우선했다.
- 과거 Codex 상세 호출 trace/빌드는 원래 미보존이다. 현재 결과로 확대할 수 없다. Aside readonly catch는 상세 원인이 없어 readonly 사전거절/무변경 각각을 증명하지 못하는 한계를 문서가 올바르게 남긴다.
- REF1-03 대상은 원문 누락 때문에 현재 DOC 사실의 독립 재검증까지 완료하지 못했다. 전체 원본 지원 확인 또는 개발 준비 승인을 의미하는 리뷰가 아니다.
- 2차의 설계 선택/규범 충돌 심화 검토, 3차의 새 반례·실행 가능성 심화 검토를 대신하지 않는다.

## 판정

**CHANGES_REQUESTED** — P0/P1 없음, P2 후보3건. 조건/slot 연결 전반은 유효하나 실행 불가능한 공개 예제 및 claim provenance/원문 대조 공백을 정리한 뒤 다음 고정본으로 진행한다. 주어진 head에 대한 판단이며 메인의 후속 수정이 독립 승인된 것으로 표시하면 안 된다.
