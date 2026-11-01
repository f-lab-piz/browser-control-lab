# scope.snapshot

## 계약과 적용 범위

대상: 확장 QuickJS에 공개하는 기존 API.

공통 계약: [runtime](../common/runtime.md), [dom-frames](../common/dom-frames.md), [selection](../common/selection.md). Page/Frame의 Scope 메서드는 같은 API로 센다. 공통 필수 조건도 이 API의 개발 수용 기준에 포함한다.

- 목적: 현재 연결 DOM 전체를 읽되 화면 밖 요소를 찾을 수 있고 가상화로 미존재한 데이터와 예산 생략을 구분한다.
- 입력/기본값: options:{root?:CSS/ref,interactive?:boolean,showHidden?:boolean,query?:string,maxDepth?:nonnegative integer,maxChars?:integer,maxNodes?:integer,maxOutputBytes?:integer,cursor?:token,since?:snapshotId}.
- 출력/성공 의미: snapshotId,text,frames,refs,truncated,nextCursor,totalMatchedNodes,metrics; 선택적diff.
- 허용 부작용: 관찰만. 스크롤·클릭·추가 로딩 금지.
- 오류/경계: 긴 URL·대형 DOM에서 예산 생략을 표시하고 후속 root/cursor/frames 조회 경로를 남긴다. 키워드 없는 탐색은 별도 요구를 따른다.
- 재시도: 읽기는 최신 문서 상태로 다시 관찰할 수 있다. 입력은 완료 여부를 먼저 확인하며 응답 유실만으로 재전송하지 않는다.
- 지원: Chrome debugger/CDP, 허용된 HTTP(S), 현재 연결 DOM. Firefox/Safari·closed Shadow·모든 사이트 완전 지원은 이번 약속이 아니다.

## 개별 요구사항

### REQ-SCOPE-SNAPSHOT-001

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/snapshot-frames.md#ref-scope-snapshot). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 현재 연결 DOM 전체를 읽되 화면 밖 요소를 찾을 수 있고 가상화로 미존재한 데이터와 예산 생략을 구분한다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-SCOPE-SNAPSHOT-001-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-SCOPE-SNAPSHOT-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-scope.snapshot` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-SCOPE-SNAPSHOT-001-C01

- 조건: 현재연결된offscreen DOM은기본수집대상이다.
- 준비: 문서끝목표와가상화미로드행
- 실행: 기본/범위snapshot
- 판정: 끝목표는후속조회가능·미로드행은관찰했다고주장하지않고scroll/request수불변이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-SCOPE-SNAPSHOT-002

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/snapshot-frames.md#ref-scope-snapshot). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 긴 URL·대형 DOM에서 예산 생략을 표시하고 후속 root/cursor/frames 조회 경로를 남긴다. 키워드 없는 탐색은 별도 요구를 따른다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-SCOPE-SNAPSHOT-002-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-SCOPE-SNAPSHOT-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-scope.snapshot` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-SCOPE-SNAPSHOT-002-C01

- 조건: 예산생략과접근불가/DOM미존재는다른표지를쓴다.
- 준비: 작은예산·접근불가frame·미로드행
- 실행: snapshot과후속cursor/root
- 판정: truncated/프레임오류/미관찰을구분하며고유ref를복구할경로가있다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

## 현재 사실과 근거 한계

기준 구현은 `700a6a06af3f97729327afaf9becb4ee29bb475b`. [카탈로그](../../api-catalog.json)의 과거 상태 `partial`는 기본 호출/당시 제한 기록이다. 본 명세의 모든 옵션·반례 충족을 뜻하지 않는다. [기존 테스트 연결](../../api-test-matrix.json)은 후보이며 소스 fingerprint가 현재와 다른 부분은 과거 증거다. 새 제품 테스트는 이번에 실행·추가하지 않았다. 규범과 다른 코드가 보이면 규범을 낮추지 않고 backlog에서 조사한다.

### REQ-SCOPE-SNAPSHOT-003

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/snapshot-frames.md#ref-scope-snapshot). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 기본 응답은 길어진 href를 나열하지 않고 역할·이름·상태·ref·프레임·생략 이유를 남긴다. 속성 원문은 getAttribute로 조회 가능해야 한다.
- 근거: USR, HIST-COMP. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-SCOPE-SNAPSHOT-003-C01부터 C02까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-SCOPE-SNAPSHOT-003`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-scope.snapshot` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-SCOPE-SNAPSHOT-003-C01

- 조건: 기본행은역할/이름/상태/ref만압축하고긴href는속성조회로복원한다.
- 준비: 추적URL1만개·checked/selected/expanded/readonly/busy
- 실행: snapshot후해당ref.getAttribute href
- 판정: 기본에URL원문반복없고상태가보존되며속성은원문이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-SCOPE-SNAPSHOT-003-C02

- 조건: password값은기본/숨김snapshot어디에도없다.
- 준비: password입력에고유secret값
- 실행: 기본/showHidden/root/query
- 판정: text/refs/diff에secret없다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-SCOPE-SNAPSHOT-004

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/snapshot-frames.md#ref-scope-snapshot). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (검토 2차 반영, 2026-11-01).
- 규범: 키워드를 모르는 상태에서도 공개된 업무 조건으로 식별 가능한 목표를 프레임/landmark/heading/영역 요약과 현재 DOM의 scrollport 단서를 따라 찾을 수 있어야 한다. 정확한 제목/CSS/ref/프레임 ID를 사전 제공하지 않아도 관찰 가능한 업무 predicate가 있어야 한다. 이름 없는 scrollport의 ref·frameId·축·현재 위치/진행 단서를 제공하며 관찰이 직접 스크롤/로딩하지 않는다. 예산 생략과 미로드를 구분하고 후속 root/cursor로 연결한다.
- 근거: USR, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-SCOPE-SNAPSHOT-004-C01부터 C02까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-SCOPE-SNAPSHOT-004`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-scope.snapshot` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-SCOPE-SNAPSHOT-004-C01

- 조건: 목표predicate를관찰할수있는과제에서영역/스크롤단서를제공한다.
- 준비: 두이름없는scrollport·첨부미읽음최신승인메일과decoy
- 실행: 구조→ref→명시wheel→재관찰
- 판정: 유일목표읽음1·decoy0·첫관찰scroll/request불변이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-SCOPE-SNAPSHOT-004-C02

- 조건: 부재/동률/접근불가/예산중단을분리한다.
- 준비: NOT_FOUND/AMBIGUOUS/INCOMPLETE seed
- 실행: 최대120호출180초내탐색
- 판정: 완전관찰부재만NOT_FOUND·동률임의클릭0·불완전은INCOMPLETE다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-SCOPE-SNAPSHOT-005

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/snapshot-frames.md#ref-scope-snapshot). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: continuation은 snapshot/문서세대·옵션과 결합한다. DOM 변화·다른 root·다른 session cursor는 재시작 필요를 반환하고 누락/중복 없는 정적 페이지 순회를 보장한다.
- 근거: DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-SCOPE-SNAPSHOT-005-C01부터 C02까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-SCOPE-SNAPSHOT-005`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-scope.snapshot` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-SCOPE-SNAPSHOT-005-C01

- 조건: 정적continuation은고유ref의누락/중복없는순회를보장한다.
- 준비: 연결DOM1000개와작은예산
- 실행: cursor로끝까지순회
- 판정: 합집합이정적기대집합과같고중복0이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-SCOPE-SNAPSHOT-005-C02

- 조건: 문서/DOM순서변화는정적offset으로계속하지않는다.
- 준비: 첫페이지후행삽입/제거/reorder/navigation
- 실행: 후속cursor
- 판정: SNAPSHOT_CHANGED/재시작결과이며누락없는완료로포장하지않는다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-SCOPE-SNAPSHOT-006

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/snapshot-frames.md#ref-scope-snapshot). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (검토 1차 반영, 2026-11-01).
- 규범: since diff는 같은 비교범위/모든 옵션/문서·보관중 snapshot이고 이전·현재 출력 모두 완전할 때만 비교한다. 하나라도 다르면 resetRequired다. 부분 출력 차이를 전체 DOM 삭제로 표시하지 않는다.
- 근거: DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-SCOPE-SNAPSHOT-006-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-SCOPE-SNAPSHOT-006`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-scope.snapshot` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-SCOPE-SNAPSHOT-006-C01

- 조건: diff는문서/범위/옵션과완전성이같을때만계산한다.
- 준비: 완전snapshot과변경행·다른root·부분출력
- 실행: since
- 판정: 비교가능은정확added/removed,나머지는resetRequired다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-SCOPE-SNAPSHOT-007

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/snapshot-frames.md#ref-scope-snapshot). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: root는 선택 프레임의 유일 CSS/ref 대상에 한정하며 다른 프레임에 같은 selector를 강제하지 않는다. showHidden은 hidden을 표기하고 interactive는 본문없는것이완전본문수집이아님을알린다.
- 근거: HIST-R2, CODE. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-SCOPE-SNAPSHOT-007-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-SCOPE-SNAPSHOT-007`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-scope.snapshot` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-SCOPE-SNAPSHOT-007-C01

- 조건: root는지정frame의유일CSS/ref이고showHidden/interactive는수집범위를명시한다.
- 준비: root가main에만존재·hidden본문
- 실행: 옵션조합snapshot
- 판정: 다른frameroot오류없고hidden표시·interactive본문생략을명시한다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-SCOPE-SNAPSHOT-008

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/snapshot-frames.md#ref-scope-snapshot). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (검토 1차 반영, 2026-11-01).
- 규범: 기본값은 root=선택 Scope의 body, interactive=false, showHidden=false, query 없음, maxDepth=무제한, maxChars=16000 UTF-16 code unit, maxNodes=500, maxOutputBytes=48000 UTF-8 bytes, cursor/since 없음이다. maxChars는1000..100000 정수, maxNodes는1..10000 정수, maxOutputBytes는4096..60000 정수, maxDepth는0이상 정수(0=root만)다. 명시한 잘못된 값은 clamp/무시하지 않고 사전 입력 오류다.
- 근거: DESIGN. 설계 판단이며 현재 충족 증명이 아니다.
- 충족 상태: **미검증**. 구현/테스트는 다음 개발 범위다.
- Given: 아래 REQ-SCOPE-SNAPSHOT-008-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-SCOPE-SNAPSHOT-008`; [매핑](../verification-matrix.json).


- 상세화 판단: `DETAIL-scope.snapshot` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-SCOPE-SNAPSHOT-008-C01

- 조건: 생략기본값과허용범위는clamp없이검증한다.
- 준비: 기본요청·각상하한·0/NaN/소수
- 실행: 옵션별snapshot
- 판정: 16000chars/500nodes/48000bytes기본,불량은사전오류다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-SCOPE-SNAPSHOT-009

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/snapshot-frames.md#ref-scope-snapshot). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (검토 1차 반영, 2026-11-01).
- 규범: text는 maxChars, refs/행은 maxNodes, 전체 JSON envelope는 maxOutputBytes를 동시에 만족한다. UTF-16 surrogate pair를 잘라 잘못된 문자열을 만들지 않는다. 메타데이터/생략 표지만으로 bytes 상한을 넘으면 SNAPSHOT_METADATA_BUDGET 오류다. query는 정규화된 이름의 대소문자 무시 부분 문자열이며 RegExp는 미지원이다.
- 근거: DESIGN. 설계 판단이며 현재 충족 증명이 아니다.
- 충족 상태: **미검증**. 구현/테스트는 다음 개발 범위다.
- Given: 아래 REQ-SCOPE-SNAPSHOT-009-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-SCOPE-SNAPSHOT-009`; [매핑](../verification-matrix.json).


- 상세화 판단: `DETAIL-scope.snapshot` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-SCOPE-SNAPSHOT-009-C01

- 조건: 다중예산은전체envelope의UTF8bytes까지동시에지킨다.
- 준비: 한글/이모지·frame메타가큰문서
- 실행: 작은예산snapshot
- 판정: surrogate손상없고초과metadata는명시오류·truncated에도한도지킨다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-SCOPE-SNAPSHOT-010

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/snapshot-frames.md#ref-scope-snapshot). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (검토 1차 반영, 2026-11-01).
- 규범: cursor는 불투명 문자열 토큰으로 발급된 session/snapshot/document·query·root·interactive/showHidden/maxDepth와 예산 옵션에 결합한다. 후속 요청은 cursor만 또는 동일 옵션만 허용한다. cursor와 since는 배타적이다. since는 동일 문서/범위/옵션이고 두 출력이 완전할 때만 diff를 제공하고 그 외에는 resetRequired다. root는 유일 CSS/ref이며 접근 불가 body는 명시 오류다.
- 근거: DESIGN. 설계 판단이며 현재 충족 증명이 아니다.
- 충족 상태: **미검증**. 구현/테스트는 다음 개발 범위다.
- Given: 아래 REQ-SCOPE-SNAPSHOT-010-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-SCOPE-SNAPSHOT-010`; [매핑](../verification-matrix.json).


- 상세화 판단: `DETAIL-scope.snapshot` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-SCOPE-SNAPSHOT-010-C01

- 조건: cursor는범위/세대/옵션에결합하고since와배타적이다.
- 준비: root/예산/세션이바뀐cursor·since병용
- 실행: 후속요청
- 판정: 정합성/입력오류이며숫자offset을안전토큰으로주장하지않는다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-SCOPE-SNAPSHOT-011

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/snapshot-frames.md#ref-scope-snapshot). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (검토 2차 반영, 2026-11-01).
- 규범: scrollport 단서는 snapshot의 refs/구조 요약에서 대상 ref와 함께 scroll:{axes:"x"/"y"/"xy",x:number,y:number,canLeft:boolean,canRight:boolean,canUp:boolean,canDown:boolean}로 표현한다. 수치는 CSS scroll offset이고 RTL의 음수도 허용하며 방향 boolean은 물리적 진행 방향이다. 현재 overflow/extent만 관찰하고 wheel이 소비되거나 새 데이터가 반드시 생긴다는 보장은 하지 않는다. 해당 노드/메타데이터도 출력 예산에 포함한다.
- 근거: USR, DESIGN. 설계 판단이며 현재 충족 증명이 아니다.
- 충족 상태: **미검증**. 구현/테스트는 다음 개발 범위다.
- Given: 아래 REQ-SCOPE-SNAPSHOT-011-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-SCOPE-SNAPSHOT-011`; [매핑](../verification-matrix.json).

- 상세화 판단: `DETAIL-scope.snapshot` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-SCOPE-SNAPSHOT-011-C01

- 조건: scroll메타는현재물리방향과offset을반영한다.
- 준비: RTL/양축/끝/preventDefault scroller
- 실행: snapshot후명시wheel
- 판정: axes/offset/방향boolean이실제와같고wheel소비/새데이터를보장하지않는다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.
