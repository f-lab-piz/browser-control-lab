# 참고 방식 보완 3차 독립 리뷰 · 반례/예제·완료 판정

- 검토 head: `367c16f7fd9ca6de7bac52290ebabe50ba88ee90`. 시작/종료 HEAD 일치, tracked working tree clean.
- 직전 독립 리뷰 head: `f8a275fa35371ba5938fde80cd59620fc67adc3d`; 직전 수정 head: `704b316f14bd5c3062436c72a1efe6da4fb7d4d3`.
- 제품 baseline: `700a6a06af3f97729327afaf9becb4ee29bb475b`.
- 적용: `AGENTS.md`, `.agents/skills/browser-control-development/SKILL.md`, 동 스킬의 `references/reference-improvement.md`, `references/pr-review.md`, `planning/spec-reference-improvement-loop.md`. README/status의 기존 구현·과거 검증과 이번 목표 명세를 구분했다.
- 역할: 고정 문서의 독립 반박 검토. 정본/제품/테스트/fixture 변경, 브라우저·원격·subagent 호출 없음. 이 리뷰에 제품 실패 재현이나 새로운 경쟁 실측은 없다.

## 발견 사항

**신규 REF3 후보 없음. P0/P1/P2/P3 확정 지적 0건.** 아래 확인은 문서 내부 일관성·보존 출처·설계 oracle 검토이며 경쟁제품 지원이나 우리 제품 적합성 PASS가 아니다.

## 이전 후보와 3차 변경 재확인

|대상|확인 위치와 반박 검토 결과|
|---|---|
|REF2-01 누적 clip|`internal/locator.scrollIntoView.md:36-39`는 target∩viewport∩모든 clip의 누적면적>0이다. V=[0,600], outer=[0,100], inner=[200,300], target=[0,300]의 개별교차 반례는 전체교차0으로 실패하며 필요한 scroll을 요구한다. oversized 정상과 전체포함/center/overlay 제거 비보장을 함께 유지해 과도한 노출보장으로 바뀌지 않았다.|
|REF2-02 MIME 충돌|`common/files-events.md:159-162,180`에서 ASCII 소문자 정규화 뒤 중복을 동일값/빈값도 DUPLICATE_MIME_TYPE으로 전체 사전 거절한다. 파일혼합도 전달·dragenter/dragover/drop0이다. 앞/뒤값 승자를 임의로 고를 공백이 닫혔다.|
|REF2-03 이미 down한 주키|`common/input.md:131-137`, `internal/keyboard.press.md:35-49`는 기존 modifier 재사용과 기존 주키 down을 나눈다. 주키가 이미 down이면 keyboard/locator press 모두 focus/새 키 전에 KEY_ALREADY_DOWN이며 기존 down은 명시 up까지 유지한다. 주키 down/up 시퀀스와 보존 정책이 충돌하지 않는다.|
|C3B-01 timeout/세대|`common/runtime.md:66-72`는 실제 VM 재생성/reset과 VM 유지 하위 wait timeout을 독립 run으로 나눈다. 전자는 old binding 제거, 후자는 같은 generation/binding 유지다. 수명표의 runtimeReset 설명과 일치한다. 하위 timeout을 전부 reset으로 강제하지 않는다.|
|C3B-02 current-dialog 참고|`internal/page.waitForEvent.md:98-125`, `reference-methods/files-events.md:467-481` 및 index의 REQ-PAGE-WAITFOREVENT-004 양쪽 슬롯은 미래 download waiter와 현재 dialog 조회를 분리한다. Codex는 getJsDialog의 좁은 DOC/미실행 조각, Aside는 unknown/관련 claim 없음이다. reset 복구·claim/error 정책을 경쟁 DOC로 증명하지 않는다.|
|C3B-03 예약/기록 순서|`common/files-events.md:172-182`, `internal/page.waitForEvent.md:119-125`에서 event 기록시 선행 eligible waiter가 identity를 예약한다. D0→W ready→query는 D0 처리와 W의 D1 대기를 나누며, W ready→D1 기록/예약→응답 gate→query는 query 거절·W 예약/deadline 유지다. response gate를 현재 여부와 혼동하지 않으며 reset/close도 adapter 기록 순서의 단일 종결로 판정한다. wall clock 동시성이나 sleep이 정답 oracle가 아니다.|
|C3B-04 cancel 파일|`internal/download.cancel.md:35-39`는 API가 완료 사용자 파일을 삭제하지 않는 것과 브라우저 관리 부분파일 정리/잔여 경로를 분리한다. 10초 최종 interrupted 확인은 상위 규범에 유지되며 성공을 요청 전달만으로 주장하지 않는다.|
|C3A-01/C3B-05 빈 data|`internal/locator.drop.md:65-71`, `common/files-events.md:171`는 data:{}를 payload 없음으로, {'text/plain':''}를 정상 type 존재/길이0으로 나눈다. getData의 빈 문자열만으로 타입 존재를 추론하지 않고 types·drop 횟수·파일목록을 함께 본다.|
|C3B-06 출처 이식|Aside claim의 location은 tracked `evidence/aside/current-*.txt`를 가리키며 기존 ignored 경로는 originalLocation이다. main/repl/help 원문과 실제 claim을 대조했다. 가이드의 listBrowserTabs와 help의 getTabs 차이는 미확인으로 보존한다.|

REF1의 개행 예제·DOC/LIVE/HISTORICAL 분리·CUA 원문 발췌도 현재 고정본에서 다시 대조했다. `keyboard.type`은 실제 개행이 아닌 `\n`을 사용하며, 공개 CUA entry/API의 관련 줄과 blank/과거 audit의 실제 값에 각각 연결된다. wrapper나 일반 Playwright의 지원을 원본 제품 지원으로 가져온 새 확정 오류는 발견하지 않았다.

## 전체 범위 반례 검토

- 검색은 접근 이름/검색 본문/raw textContent, 인접 span/실제 공백, slot/composed 순서, ARIA 숨김 제외/CSS 숨김 포함, g/y 후보별 독립, filter/nth 불변·순서, 0/N strict와 명시 예외를 구분한다. 이름 계산의 Document/ShadowRoot IDREF 범위와 숨김 직접참조, native checked/indeterminate 및 custom mixed의 차이를 상태표와 대조했다.
- snapshot은 현재 연결 DOM/미로드/예산생략/접근불가 frame을 나누고, cursor 정적 합집합·중복0/변경시 재시작, 완전성 전제 diff, 출력 예산·후속경로를 연결한다. S04는 UI에서 수신시각·첨부·읽음·유형을 관찰 가능한 공개 predicate이며 oracle 전용 정답 ID를 실행자에게 주지 않는다. 부재/동률/불완전 종료가 식별 불가능한 숨은 정답 과제로 바뀌지 않았다.
- 입력/좌표는 조상 frame hit·OOPIF·허용 transform, 명시 auto-scroll, 사전 오류와 중도 부분효과, 기존 down 보존·새 소유 release를 구분한다. 2rAF/1px/5초는 우리 목표 수치다. focus/fill/check/select의 사후 판독은 sync handler/microtask 뒤 같은 identity의 한 시점이며 영속성/무한 미래 상태를 약속하지 않는다.
- 파일은 source 선택/메타/MIME·바이트 예산·사전검증/부분효과, 업로드 실제 hash, 브라우저 download와 URL 재요청의 차이, save 멱등/동명보존·목적지 전환, cancel 최종상태·완료파일 보호를 분리한다. 새 파일 API/범용 current download·chooser 회복을 강제할 이유를 발견하지 않았다.
- 수명은 JS 객체/데이터 ref/탭 소유/asset·완료파일/tombstone을 구분한다. same-document goto는 URL 변경만으로 ref를 stale 처리하지 않는다. close/reset/timeout의 범위, 총 deadline·arming 포함, 함수 Promise settle·JSON/undefined·사용자 오류/재평가 가능한 context 소멸·late 차단을 교차 대조했다. 단일 evaluate의 무재실행과 waitForFunction의 명시 반복을 혼동하지 않는다.
- provider direct/composition은 좁은 공개 방법의 관계이며 전체 조건 지원이 아니다. Codex first/null DOC와 Chrome 보충의 일부 strict 관측 차이, read-only 평가와 우리 effectful 평가, Aside snapshot마다 ref 무효화와 우리 안정 ref의 의도된 차이를 유지한다. 과거 audit 수치와 Chrome 보충9사례/IAB 차단을 새 IAB 전체 지원으로 올리지 않는다.

## 실제 읽은 범위와 구조 검사

- 정본 **72문서(공통5/외부3/내부64)**의 입력/출력·허용 효과/오류, **185 REQ 규범과 254 Cnn**의 조건/준비/실행/판정을 전체 읽었다. 공통 상세 정책표도 전체 읽었다. 반복 지원·현재사실·재시도·상태 보일러플레이트는 중복 제거한 추출을 사용했다. 대량 출력에서 잘린 selection/textContent 및 waitForFunction 구간은 별도 출력으로 보충했다. 미독 REQ/Cnn 없음.
- reference-methods의 **6본문**에서 모든 provider 방법/예제·상태·claim·미확인·설계/PLAN을 읽었다. 반복 정본 규범/템플릿은 중복 제거했다. current-dialog의 추가 reference도 별도 읽었다. **370 슬롯**의 provider/surface/reference/relation/claims/support를 동일 튜플별 REQ 그룹으로 출력해 읽고, **508 condition 단위**의 ID·claim·상태/이유를 구조 대조했다.
- **152 claim** 전부를 읽고 kind/provider/source 및 owner별 한계를 대조했다. Aside 현재 main/repl/help, Codex public-contract/cua-entry/file-uploads와 source registry를 직접 읽었다. CUA DOC가 인용한 줄 범위의 텍스트를 모두 추출해 재확인했다. blank의 actualCalls/output, 과거 audit의 codex/aside 하위 값·compare-aside 관련 하니스, 보충 boundary1 observed/IAB blocked를 대조했다.
- index/condition-index/condition-verification-map/verification-matrix/backlog-map/양쪽 mapping/coverage/이전 두 리뷰와 메인 결정/3차 교차조사 판단 및 변경 diff를 확인했다. 원문 규범·각 Cnn·PLAN·backlog ID 집합 일치, 중복/고아 ID 0. reference anchor·provider별 relatedClaim 연결·run 파일 경로·tracked source registry 누락 0.
- 모든508 단위의 not-established를 결함으로 세지 않았다. 관련 근거와 조건 전체 동등성의 증명을 분리한 상태다. claim 고유 sourceId는18이고 registry에는 보충표면 전용 source도 포함돼19행이다. run은 LIVE2/과거1이며 API 재사용 횟수가 아니다.
- 상세 읽기 ID/파일 hash 및 검사 범위는 `review3-read-manifest.json`에 기록했다.

## 명령과 결과

- `git rev-parse HEAD`, `git status --short`: 시작/종료 고정 SHA 일치, tracked 변경 없음.
- `git diff 704b316... HEAD -- ...`: 3차 변경의 정본/참고/근거 갱신을 직접 읽었다.
- `python3 .local/reference-loop-execution/review3-audit.py`: exit0. 72문서/185REQ/254Cnn/370슬롯/508단위/152claim, 관계/PLAN/backlog·anchor·registry 검증 오류0.
- `node .local/reference-loop-execution/review3-compile.mjs`: exit0. 6본문과 양쪽 mapping의165개 조각 중 **JS async 함수 구성만155/요청 JSON 파싱2**, CLI6/의사코드2는 제외. 문법 오류0. 중복 조각을 포함하며 고유 API/실측 수가 아니다. 만든 함수를 호출하지 않았다. 결과는 `review3-syntax-check.json`.
- 제품 baseline→HEAD의 `extension/ bridge/ tests/ test-site/ scripts/ package.json package-lock.json` 변경목록 빈값. 제품·fixture·테스트·빌드 동결 유지.

## 미실행·미검토와 남은 한계

- 제품/fixture/테스트 suite, 브라우저 입력/경쟁 신규실측, 실제 HTTP→확장→QuickJS 실행은 수행하지 않았다. 모든 목표의 구현 난도/성능/실환경 통과를 승인한 것이 아니다. 필요한 새 fixture/fault gate는 검증 설계이며 아직 존재/작동을 입증하지 않았다.
- 경쟁 원본 구현/번들/WASM/사용자 프로필은 열지 않았다. 보존된 selected CUA excerpts를 대조했으며 원래 전체 tool 응답의 byte-identical 복제·과거 Codex 상세 call trace/정확 빌드·모든 원시 픽셀/파일바이트를 독립 재현하지 않았다. 기존 `raw/requirements-read.json`의 거대 중복 과거 정본 전문·무관한 제품 실행 trace는 다시 읽지 않았다.
- JS 컴파일은 API 존재/옵션 의미/권한/변수 선행조건/웹 목표 성공을 입증하지 않는다. sourceId가 같거나 같은 run을 재사용한 claim 수는 신규 실측 수가 아니다. Aside readonly catch의 상세 원인과 과거 scale-frame의 업무실패 원인은 여전히 미확인이다.
- 최종 완료 산출물·3차 집계·최신 수치 문구의 메인 갱신은 이 고정 SHA 뒤의 별도 작업이다. 기존 README/1차 기록의184/252 같은 당시 수치를 현재 전체 집계로 복사하지 않아야 한다. 이후 편집을 이 리뷰가 독립 승인했다고 쓰지 않는다.

## 판정

**PASS — 고정 head `367c16f7fd9ca6de7bac52290ebabe50ba88ee90`의 반례·예제·근거·규범/추적 검토 범위.** 신규 필수 설계 충돌, 불가능한 판정 oracle, 근거 없는 경쟁 지원 확정, 실행을 가장한 예제 오류를 발견하지 않았다. 메인의 마지막 문서 검사·종료 보고 후 문서 조사 루프/개발 준비 여부를 구분해 판정할 수 있다. 제품 구현·요구 충족은 계속 미검증이며 이번 리뷰는 개발 시작 허가나 제품 PASS가 아니다.
