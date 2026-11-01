# Aside 原본 CLI · sources / claim registry · cycle 1

확인일 2026-11-01. 공개 CLI `aside guide`, `aside guide repl`, `aside repl --help` 출력만 새로 수집했다. CLI 1.26.1028.2335 · Skill version 3이며 업데이트 안내는 없었다. `aside repl <code>`·브라우저·개인 탭·프로필/메모리 조회는 실행하지 않았다. A의 브라우저 실측 사용권을 지켰다. 정본/제품/테스트 수정 없음. 원본 코드/번들/WASM 없음.

## 제품/출처 구분

- 조사 대상: **Aside 원본 CLI**의 공개 가이드 및 이 repository가 보존한 원본 CLI 과거 fixture 관측.
- 제외: Aside-style 자체 wrapper/guide MCP, public browser-agent-bridge, 일반 Playwright 문서. `Playwright-compatible`는 개별 서명/옵션/동작의 증거가 아니다.
- DOC: 지금 읽은 공개 계약. LIVE: 해당 run 실제 브라우저 관찰(이번 0). HISTORICAL: 보존된 audit fixture 측정. INFERENCE: 아래 우리 설계/조합 판단. NONE: 자료 공백.
- 과거 결과는 당시 CLI 버전과 fixture의 관측이다. 같은 버전이라고 모든 상태가 그대로라는 증명은 아니다.
- 예시의 변수/fixture URL은 작성한 최소 예제다. `current-*.txt`는 직접 guide 캡처이며, mapping의 모든 예제는 이번 미실행이다.

## 직접 문서 주장

| sourceId | 종류 / 파일 / 절 | 확인한 좁은 주장 | 확인하지 않은 것 |
|---|---|---|---|
| A-DOC-MAIN | DOC `current-main-guide.txt` / Browser usage, Persistence, Remote control | exec/repl 표면; host/profile 선택; `aside host profiles --host <id-or-name>`; REPL profile 변경은 변수/attached tabs reset 안내 | 우리 외부 guide/reset/js3도구·현재 연결 프로필만 목록·QuickJS 구현·세션소유·오류·requestId |
| A-DOC-REPL | DOC `current-repl-guide.txt` / Environment | ES2023+·async/await·120초·import/require금지·const/let 호출간 지속·console.log 명시출력, page/tabs/fs/path/Buffer/sleep/display/pwd 전역 | 메모리/코드/출력 예산·reset CLI·requestId·표현식 자동출력 부재의 엄격 계약·display 인자형 |
| A-DOC-REPL | DOC / Open browser tabs | neutral session; page가 사용자 current tab이라고 가정금지. listBrowserTabs는 attach안하고 목록; targetId/active/title/url 예시. attachBrowserTab/attachActiveBrowserTab/getTabByTargetId/openTab/closeTab 전역 목록 | 목록 타입 상세·windowId·HTTP(S)범위·attach 충돌·already closed |
| A-DOC-REPL | DOC / Snapshot의 실제 TypeScript 서명 | `snapshot(page:Page, options?:{interactive?:boolean;showHidden?:boolean;ref?:string;selector?:string}):Promise<{tree:string;diff:string}>`; ref 또는 selector 중 하나로 범위 좁힘. selector는 CSS이며 role 이름과 다름 | root/query/cursor/since/maxChars/maxNodes/maxOutputBytes/maxDepth 미기재이며 미지원으로 단정하지 않음 |
| A-DOC-REPL | DOC / Snapshot bullet | compact accessibility tree, title/URL/childiframe/offscreen, virtual ref e12/f1e1는 `page.locator('e31')` 전달, snapshot마다 과거 모든 ref 무효. tree 첫 출력/동작 후 diff 출력·snapshot 임의잘림금지 | 모든 iframe/OOPIF·closedShadow·무스크롤/무네트워크·diff 정합성·기본예산·unloaded 데이터 관찰 |
| A-DOC-REPL | DOC / Reading Escalation, Navigation and Actions | interactive snapshot→full snapshot→변화중만 brief wait→annotated/raw screenshot. 정확 selector 없으면 evaluate/content 피함. openTab/closeTab 필수, page.close/context.newPage 금지(누수). click/openTab interactivity/DOM stability 대기; click 필요시 scroll; fresh snapshot 기대상태로 입력확인 | evaluate fn/arg/JSON·locator strict·click button/count·stability 시간·unsupported transform |
| A-DOC-REPL | DOC / Downloads | 발견·검증한 same-origin/trusted direct GET/HEAD는 cookie-bearing fetch; mutation/credential forwarding 금지. download waiter 사전등록→click→download.path→suggestedFilename/fs.stat. path의 완료파일은 같은 REPL세션에서만 읽기 가능; one-shot은 같은 명령내 검증. saveAs는 명시 artifacts 복사 필요시 | download.cancel·우리 server asset/fileId·save 멱등·hash·local/server 목적지·filechooser/upload/drop 지원 |
| A-DOC-HELP | DOC `current-repl-help.txt` / Notes/Examples | CLI --account/--host/--profile 플래그·120초·console.log; page unset·getTabs() 예시 | getTabs 구현/서명은 실행 미확인. guide의 listBrowserTabs와 불일치하므로 통합하지 않음 |

`A-DOC-REPL`은 같은 문서의 sourceID다. 표의 각 행은 서로 다른 claim이고 일부 조건만 확인한다. 전체 문서 하나를 조건 전부의 확인으로 세지 않는다. 인라인 길이/옵션은 캡처 원문 절을 직접 확인한다.

## 보존 관측 주장

모든 HISTORICAL 항목의 환경은 `docs/fixes-before-after.md`의 “Codex / Aside / 우리 툴” 절에 기록된 원본 Aside CLI 1.26.1028.2335, 동일 `/audit` fixture다. Chrome for Testing145.0.7632.6은 우리 확장 측 환경이며 **Aside 브라우저 버전으로 복사하지 않는다**. Aside 브라우저 버전은 해당 자료에 별도 없음. 시각은 2026-11-01 기록이며 run artifact/원시응답을 이번에 새로 실행하지 않았다.

| sourceId | 위치 | 관측 및 좁은 한계 |
|---|---|---|
| A-HIST-REGEX | `docs/evidence/diagnostics-before-after.json` `aside.cases[id=regex-role]`; `scripts/compare-aside.mjs` 해당 호출 | `getByRole('button',{name:/레이블 저장/}).count()` 값1. g/y·full role/hidden 정책의 증거 아님 |
| A-HIST-FILTER | same `aside.cases[id=filter-visible]`; script | `locator('#duplicates button').filter({visible:true}).count()` 값3(보고서 숨김포함). visible 옵션이 무시됐다는 내부원인/전버전 미지원은 추론금지 |
| A-HIST-NTH | same `aside.cases[id=negative-nth]`; script | `nth(-1).count()` DOMException. 양수·0·다른 음수 지원은 미확인 |
| A-HIST-SLOT | same `aside.cases[id=slot-name]`; script | `getByRole('button',{name:'슬롯 승인',exact:true}).click()` Role selector not found. 모든 Shadow DOM 실패 증거 아님 |
| A-HIST-READONLY | same `aside.cases[id=readonly-fill]`; script | getByLabel exact→fill BROKEN timeout500 호출의 catch가 rejected 기록. 집계에는 상세오류가 없어서 label 탐색성공/readonly 사전거절/값무변경을 각각 증명하지 못함. 보고서는 readonly 거절로 요약 |
| A-HIST-FRAME | same `aside.cases[id=scaled-frame-click]`; report/script | frameLocator→role click→fresh snapshot→새이름 count0, 서버성공기록 없음. click 예외없음 자체가 목적달성 아님. OOPIF/다른 transform 전체로 확대금지 |
| A-HIST-DRAG | same `aside.cases[id=html-drag]`, `aside.serverPassed.drag`, `aside.events`; script | dragTo→snapshot→exact text waitFor(timeout2000), 서버PASS, accepted shipment-A 2개(at1793520989505/9512). native/trusted 구현원인·모든드래그 중복 보장금지 |
| A-HIST-CLIP | same `aside.cases[id=screenshot-clip]`; report/script | CSS clip320x240 요청에서 PNG640x480. 보고서 DPR반영. viewport/DPR모든범위 정책 추론금지 |
| A-HIST-SNAPSHOT | same `aside.snapshot`/`aside.scoped`; report/script | 기본tree13175자·tail없음·selected있음·secret없음·생략표시; selector tail104자에서 tail있음. 전체DOM수집/기본정확예산/모든상태 보장의 증거 아님 |
| A-HIST-HARNESS | `scripts/compare-aside.mjs` 및 above 결과의 serverPassed/events 연결 | getAttribute('data-run')로 서버 run을 선택하는 과거 하니스 문법. 누락속성/빈속성·strict의 전용 assertion 없음 |

`docs/evidence/diagnostics-before-after.json`의 before/after31건/추가36/회귀24건은 **우리 제품**의 수치다. Aside 64API 전체 PASS로 가져오지 않는다. 이 파일의 `codex`도 Aside 증거가 아니다. `.local` 출력을 제외한 제품/정본은 수정하지 않는다.

## 추론과 공백

- INFERENCE: snapshots→현재 ref→locator action→fresh snapshot은 공개 운영 흐름의 조합이다. 특정 REQ 전체 성공은 실행 전 미확인이다.
- INFERENCE: page.frame 요구와 과거 frameLocator 사용은 목적이 일부 겹치지만 ID tree discovery/Scope API가 다르므로 composition으로 둔다.
- INFERENCE: download.path/fs 검증은 원본 bytes 검증의 설계 참고이나 우리 server asset 반환/멱등성을 대신하지 못한다.
- NONE: 공개 guide/해당 과거 개별호출에 없는 메서드40개는 unknown이다. 원래 API가 없음/미지원이라고 쓰지 않는다. scope.evaluate는 메서드 이름만, display는 전역 존재만 DOC여서 서명·성공 조건은 대부분 미확인이다.
- 우리 선택: 문서/반례를 참고해 조건을 구체화하되 Aside file system/서비스전용전역/PDF/viewport APIs를 모두 추가하지 않는다. 제품 사용자 필요·기존 API 조합·비용은 메인 판단 근거다.

## 산출물과 집계

`mapping.json`:67API+공통5. `read-manifest.json`:72문서/184REQ. `findings.md`:전체 읽은ID+67API별 구체 반례/명확화후보. sourceID는 문서 또는 과거 claim별 행으로 연결되며 DOC와 HISTORICAL을 혼합해 전 조건 확인으로 세지 않는다. 새 브라우저 run0. 과거 audit 단일 비교run의 재사용을 API별 새 run으로 세지 않는다.

## 1차 통합용 claim 형식 보완

`mapping.json`의 `evidenceClaims:[{claim,kind,sourceId,location,scope}]`가 실제 주장별 연결 원본이다.72항목 모두 필드를 가지며 DOC27·HISTORICAL21·INFERENCE9개다(여러 API 재사용 포함, 고유source/run 수 아님). confirmedClaims48개는 DOC/HISTORICAL만 포함한다. `locator.getAttribute` 하니스 문법을 원본 개별 동작의 직접관측으로 확정하지 않고 INFERENCE로 이동했다. 혼합 common/locator.count/locator.click 문장은 출처별로 분리했다. 이 형식 보완은 2차 교차검토가 아니다.
