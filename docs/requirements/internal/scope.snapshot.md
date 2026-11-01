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

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 현재 연결 DOM 전체를 읽되 화면 밖 요소를 찾을 수 있고 가상화로 미존재한 데이터와 예산 생략을 구분한다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 독립 세션·해당 Page/Scope/핸들을 준비한다. 입력 계약: options:{root?:CSS/ref,interactive?:boolean,showHidden?:boolean,query?:string,maxDepth?:nonnegative integer,maxChars?:integer,maxNodes?:integer,maxOutputBytes?:integer,cursor?:token,since?:snapshotId}.
- When: `scope.snapshot`를 정상 입력으로 호출하고 반환/실제 효과를 독립 판독한다.
- Then: 현재 연결 DOM 전체를 읽되 화면 밖 요소를 찾을 수 있고 가상화로 미존재한 데이터와 예산 생략을 구분한다.
- 검증 계획: `PLAN-SCOPE-SNAPSHOT-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-SCOPE-SNAPSHOT-002

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 긴 URL·대형 DOM에서 예산 생략을 표시하고 후속 root/cursor/frames 조회 경로를 남긴다. 키워드 없는 탐색은 별도 요구를 따른다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 독립 세션·해당 Page/Scope/핸들을 준비한다. 입력 계약: options:{root?:CSS/ref,interactive?:boolean,showHidden?:boolean,query?:string,maxDepth?:nonnegative integer,maxChars?:integer,maxNodes?:integer,maxOutputBytes?:integer,cursor?:token,since?:snapshotId}. 반례 조건: 긴 URL·대형 DOM에서 예산 생략을 표시하고 후속 root/cursor/frames 조회 경로를 남긴다. 키워드 없는 탐색은 별도 요구를 따른다.
- When: `scope.snapshot`를 해당 경계에서 호출하고 오류·반환 및 전후 효과를 판독한다.
- Then: 긴 URL·대형 DOM에서 예산 생략을 표시하고 후속 root/cursor/frames 조회 경로를 남긴다. 키워드 없는 탐색은 별도 요구를 따른다.
- 검증 계획: `PLAN-SCOPE-SNAPSHOT-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

## 현재 사실과 근거 한계

기준 구현은 `700a6a06af3f97729327afaf9becb4ee29bb475b`. [카탈로그](../../api-catalog.json)의 과거 상태 `partial`는 기본 호출/당시 제한 기록이다. 본 명세의 모든 옵션·반례 충족을 뜻하지 않는다. [기존 테스트 연결](../../api-test-matrix.json)은 후보이며 소스 fingerprint가 현재와 다른 부분은 과거 증거다. 새 제품 테스트는 이번에 실행·추가하지 않았다. 규범과 다른 코드가 보이면 규범을 낮추지 않고 backlog에서 조사한다.

### REQ-SCOPE-SNAPSHOT-003

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 기본 응답은 길어진 href를 나열하지 않고 역할·이름·상태·ref·프레임·생략 이유를 남긴다. 속성 원문은 getAttribute로 조회 가능해야 한다.
- 근거: USR, HIST-COMP. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 긴URL만1만개와checked/selected/expanded/readonly/busy가있는페이지
- When: 기본snapshot후필요href조회
- Then: 출력예산이내·상태보존·원문href복구이며passwordvalue는없다.
- 검증 계획: `PLAN-SCOPE-SNAPSHOT-003`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-SCOPE-SNAPSHOT-004

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 키워드를 모르는 상태에서 프레임/landmark/heading/영역 요약과 부분 조회 경로로 목표 영역을 좁힐 수 있어야 한다. 요약도 예산 제한·미수집 영역을 표시한다.
- 근거: USR, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 목표명은평가자만알고있는랜덤메일/예약프레임·긴본문fixture
- When: 첫snapshot만본에이전트가frame/영역을선택해다음조회
- Then: 사전CSS/목표키워드없이범위발견→목표발견→실제제어하며관찰scroll0이다.
- 검증 계획: `PLAN-SCOPE-SNAPSHOT-004`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-SCOPE-SNAPSHOT-005

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: continuation은 snapshot/문서세대·옵션과 결합한다. DOM 변화·다른 root·다른 session cursor는 재시작 필요를 반환하고 누락/중복 없는 정적 페이지 순회를 보장한다.
- 근거: DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 작은예산으로끊긴정적/변동DOM
- When: cursor순회및중간navigation/root변경
- Then: 정적은전체고유ref를합칠수있고변동은정합성오류/재시작이다.
- 검증 계획: `PLAN-SCOPE-SNAPSHOT-005`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-SCOPE-SNAPSHOT-006

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: since diff는 같은 비교범위/옵션/문서·보관중snapshot에만 비교한다. 부분 출력끼리의 차이는 전체 DOM 삭제로 표시하지 않는다.
- 근거: DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 예산이다른두snapshot와문서교체
- When: since요청
- Then: 비교가능조건명시또는resetRequired이며가짜삭제없다.
- 검증 계획: `PLAN-SCOPE-SNAPSHOT-006`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-SCOPE-SNAPSHOT-007

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: root는 선택 프레임의 유일 CSS/ref 대상에 한정하며 다른 프레임에 같은 selector를 강제하지 않는다. showHidden은 hidden을 표기하고 interactive는 본문없는것이완전본문수집이아님을알린다.
- 근거: HIST-R2, CODE. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: root가main에만있는중첩fixture
- When: root/interactive/showHidden조합
- Then: 관련없는frame오류없음·숨김과생략구분·다음조회경로존재다.
- 검증 계획: `PLAN-SCOPE-SNAPSHOT-007`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.
