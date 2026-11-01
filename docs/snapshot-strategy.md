# Snapshot strategy

## Observation scope
기본 스냅샷은 viewport에 한정하지 않고 현재 DOM에 연결된 문서 전체를 조사한다. 대상은 메인 문서, 접근 가능한 Shadow DOM과 연결된 프레임 문서다. 이를 위해 자동으로 스크롤하거나 화면을 변경하지 않는다.

가상화 리스트의 아직 생성되지 않은 600번째 행이나 무한 스크롤로 아직 받지 않은 메일은 DOM에 없다. 이를 전체 수집한 것처럼 표현하지 않는다. 알려진 스크롤 컨테이너와 현재 생성된 영역을 표시하고, 실제 스크롤 동작 후 다시 관찰한다. 숨겨진 메뉴의 상태와 화면 밖 요소를 구분한다.

## Structured representation
첫 단계는 역할·이름·상태·계층·frame 경계를 갖는 구조화된 노드다. 텍스트 렌더링, 부분 검색, 차이 출력은 이 표현을 공유한다. 모든 div와 중복 텍스트를 그대로 반환하지 않는다. 텍스트 병합·빈 장식 노드 압축은 ref의 조작성과 의미를 보존해야 한다.

- ref: {frameId,documentGeneration,nodeId}에 대응하는 짧은 표시.
- 링크: 이름·역할·필요 시 짧은 origin/path 표시. 추적 query·긴 서명 URL 전체는 기본 출력하지 않는다.
- href 원문: getAttribute/evaluate로 명시적으로 조회 가능. 표시 축약이 실제 클릭 대상을 바꾸지 않는다.
- 상태: visible/offscreen/hidden, enabled, checked, expanded, selected, editable.
- 프레임: url/name/parent, 관찰 성공/실패/미수집, 작업 후보 수.
- 예산: maxChars/maxNodes/maxDepth/cursor. 초과 시 생략 이유·범위·다음 읽기 단서를 반환한다. 조용한 잘림은 금지.
- since: 같은 범위와 문서 세대일 때 diff. 세대가 달라지면 새 snapshot 필요를 표시한다.

후보 최적화는 측정 후 채택한다. 처음부터 전체 DOM mutation마다 전체 재계산하지 않되, 변경 추적 캐시가 stale 상태를 돌려주지 않는지 검증한다. 사이트별 키워드·CSS 하드코딩으로 좋은 점수를 만들지 않는다.

## Coverage and efficiency are separate
1. 화면 밖 대상과 프레임 내부 조작 요소가 실제로 발견·제어 가능한가.
2. 이름·역할·상태가 올바른가.
3. 긴 URL/중복 텍스트를 줄이면서 작업 성공률을 유지하는가.
4. 출력 예산 안에 못 들어간 경우 부분 조회로 대상까지 도달 가능한가.

기본 출력 목표는 초기 16~24 KiB 범위를 후보로 측정하되 구현 결과 없이 확정 수치나 우수성을 주장하지 않는다. raw DOM, URL 포함 단순 덤프와 제안 표현의 글자수·UTF-8 바이트·응답시간·태스크 성공률을 비교한다.

## Screenshot
viewport 캡처와 full-page 캡처를 모두 제공한다. 영역/요소 및 주석은 같은 API 옵션이다. full-page 캡처도 미로딩 콘텐츠나 모든 내부 스크롤 컨테이너의 숨은 영역까지 자동 수집했다는 뜻은 아니다. 내부 스크롤 영역의 캡처는 범위를 별도로 명시한다.

## 현재 구현

현재 DOM 전체를 순회하고 offscreen 여부를 표시한다. SCRIPT/STYLE/NOSCRIPT/TEMPLATE와 제어 요소 내부의 중복 leaf 텍스트를 기본 스냅샷에서 제외한다. 역할·접근 이름·프레임별 ref를 반환하고 href 원문은 getAttribute로 별도 조회한다. 구조 영역의 이름에 자식 스크립트/본문 전체를 붙이지 않는다.

maxChars는 text 예산, maxNodes는 반환 노드 수, maxOutputBytes는 반환 구조의 예산이다(기본48KB). ref 목록에는 선택에 필요한 식별자·역할·이름·프레임만 넣고 box/속성은 요소 조사 API로 받는다. 프레임 URL은240자로 제한하고 urlTruncated를 표시한다. 전체 URL이 필요하면 page.frames()로 요청한다. 잘린 행은 nextCursor 또는 query/root 범위 조회로 이어 받는다. diff가 예산을 넘으면 resetRequired/DIFF_OUTPUT_BUDGET을 표시한다.

이름은 기본 DOM 규칙의 구현이며 전체 접근성 트리와 동일하다고 보장하지 않는다. 가상화 목록의 아직 생성되지 않은 요소는 별도 입력으로 로드한 뒤 재관찰한다.
