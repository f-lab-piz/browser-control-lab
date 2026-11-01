# 검증 설계 · 개발 전

이 문서는 다음 개발에서 추가할 테스트의 설계다. fixture/제품 테스트 파일을 이번에 만들거나 실행하지 않았다. 각 REQ의 PLAN 항목은 이 설계와 함께 정상·거절·전후 효과의 assertion으로 구체화한다.

| 시나리오 | 준비와 실제 확장 동작 | 독립 판정/반례 |
|---|---|---|
|S01 런타임/외부|두 세션, 변수·top-level await·오류·루프·텍스트/이미지한도, 진행중 reset, requestId 재조회|세대·출력·실제 웹값 분리, 같은id다른payload거절, 클릭1회, late응답차단|
|S02 탭/탐색|서로 다른 두 탭, activate/attach/close, A→B→C/back/forward/reload, SPA/hash 이동|tabId/URL/document identity, 이력경계false, 닫힌/다른세션/금지scheme거절·다른탭불변|
|S03 선택/이름|5행, 서로다른 A/B조건, foo+bar/실제공백, 10k본문끝, label·ARIA·slot·hidden·details|문자열/regex/g/y/양음필터·순서·nth의 기대 ref 집합, 원 locator 불변, stale/중복무입력|
|S04 키워드 미지 탐색|긴URL 1만개, 랜덤 명칭의 중첩/OOPIF 업무프레임, 대형영역. 정확한 제목/CSS/ref는 숨기고 아래 manifest의 공개 업무 predicate를 제공|첫 구조→영역/프레임→상세→목표 제어 trace, scroll0 관찰/미로드구분, 역할·상태·바이트예산. 성공은 사후 fixture서버판정|
|S05 snapshot 정합성|작은 예산의 정적 DOM, 순회중 DOM순서/문서/root/옵션변경, since보관만료|정적 고유 ref 합집합/중복0, 변동시재시작, 부분출력차이를삭제로오인하지않음, password비출력|
|S06 입력상태|native/editor, readonly/disabled/fieldset/ARIA, overlay, 즉시rerender/입력되돌림, 비focusable|전후 값·activeElement·실제hit·inputtrace, 사전거절무입력/중도부분효과 구분|
|S07 좌표/스크롤|중첩iframe양의scale/translate·DPR2·가로세로scroll, rotate미지원, 내부메일목록|box mainviewport와hit일치, pointer/wheel 대상scrollport, 캡처PNG색/크기·origin, unsupported무입력|
|S08 예약격자|격자3칸 pointer drag→clickCount2→editor 입력→저장|서버가회의실/시간구간/제목검증, pointertrace·팝업1회, 잘못된칸은PASS불가|
|S09 HTML/file drop|draggable native DnD와 file/MIME drop, 중도실패·cross-target|서버accepted1회, trusted/untrusted구분, buttons/임시DOM정리, 재전송없음|
|S10 긴 메뉴/선택|가상화dropdown내부scroll→목표, native single/multiple select|DOM존재후선택, 실제value·input/change횟수, 없는/disabled/중복label거절및이전선택보존|
|S11 업로드|로컬/서버asset/inline bytes/base64·혼합, 0byte/32MiB/초과/없는경로·이름/MIME경계, chooser OOPIF|실제 multipart바이트hash·파일수·이름, []삭제, wrongsession/expired/잘못된입력사전거절, 임시DOM0|
|S12 다운로드|인증쿠키GET·POST·blob·느린전송, 같은origin두탭·다른session, local/server 저장·cancel|실제응답hash/저장경로/asset소유·상태, 모호원인명시오류, 이미완료파일자동삭제없음|
|S13 이벤트/대기|등록즉시popup/chooser/dialog, close/reset/timeout경합, 두dialog연속·oldhandle사용, URL/load/function 상태|동일eventidentity·순서·소비정책, waiter누수0, 새dialog불변, 함수throw와재시도가능navigation오류구분|
|S14 평가/로그/출력|Scope/Locator evaluate alias/evaluateAll 빈배열, JSON·undefined·throw·순환·DOMnode, pageconsole vs REPL출력|직렬화계약·범위·closure오류, page 로그필터/수집기간, 모델출력예산·이미지형식. evaluate로업무PASS주입금지|

S04는 이름 없는 scrollport 두 개의 ref·축·현재 위치/진행 단서도 포함한다. S07은 RTL/끝/preventDefault에서 wheel 전달과 실제 이동을 구분한다. S12는 save의 30초 완료대기·동시/순차 동일목적지 identity·server/local 전환·동명 다른 hash 파일 보존을 검증한다. S13은 close waiter의 정상 metadata와 다른 waiter의 PAGE_CLOSED를 구분한다.

S04는 에이전트 방식 평가다. 성공률만 측정하지 않고 첫 관찰에 없는 목표를 어떻게 발견했는지 출력·호출 trace를 보존한다. 시드·브라우저/확장버전·viewport/DPR·HTTP/프레임오류·수집/반환노드·바이트·제어성공을 기록한다. 실행자의 사전 selector/키워드 하드코딩은 허용하지 않는다. 목표가 실제 DOM에 있는 사례와 아직 로드되지 않은 사례를 분리한다.

기존 fixture에 없는 조건은 신규 fixture 설계 backlog다. Playwright는 fixture oracle/실행 기동/독립 읽기용이며 제품 동작을 대신하지 않는다. 실사이트는 Naver 읽기 탐색처럼 별도 표본으로 기록하며 회사환경은 접근 가능 전까지 미검증이다.

## S04 과제·식별 가능성과 판정 계약

실행자에게 제공할 공개 과제 예시: **“받은편지함에서 첨부가 있는 미읽음 승인 요청 중 수신시각이 가장 최근인 메일을 찾아 열고 읽음 처리하세요.”** 정확한 제목·CSS·ref·프레임 ID·정답 record ID는 주지 않는다. 업무 조건 자체까지 숨기는 과제가 아니다. 유형·수신시각·첨부·읽음 여부는 실제 UI의 이름/본문/상태에서 관찰 가능해야 한다.

fixture manifest는 seed, 공개 task, UI로 판독 가능한 predicate, 후보의 날짜/유형/첨부/읽음 데이터, oracle 전용 정답 ID, 예상 결과, 행동/시간 예산을 가진다. predicate는 받은편지함/첨부/미읽음/승인요청 조건을 만족하는 후보 중 수신시각 최대값이다. 동일 최대시각은 자동 ID tie-break 없이 모호로 판정한다. 하니스는 manifest에서 정상 seed의 유일성을 독립 확인한다. 실행자에게 oracle 데이터/서버 정답을 제공하지 않는다.

- 정상 seed 1/7/13/29/41: 위치·제목·frame명·decoy를 바꾸고 유일 목표를 보장한다. 목표 open+읽음 처리1회, decoy 변경0을 서버가 판정한다. 전체를 순서대로 읽어 우연히 PASS하는 방식은 실패다.
- 부재 seed: 모든 관련 frame/scrollport를 관찰하고 UI의 “모든 항목을 표시했습니다” 상태까지 확인한 뒤에만 NOT_FOUND다. 불완전 관찰은 부재가 아니다.
- 동률 seed: 같은 predicate의 최대시각 후보2개는 AMBIGUOUS이며 임의로 읽음 처리하지 않는다.
- 접근불가/예산 seed: frame 접근 실패·미로드 미완료·종료예산 초과는 INCOMPLETE와 관찰 범위를 남긴다. 목표가 없다고 주장하지 않는다.
- 기본 종료 한도: 내부 브라우저 API 호출120회(관찰/입력 모두 포함), 전체180초. 각 js 호출 deadline은 별도로 기록한다. 한 번의 js 안 반복도 실제 내부 호출 수로 센다. 예산 자체의 비교는 같은 seed·viewport·브라우저 조건에서만 한다.

첫 관찰의 scroll/request count 불변, 명시 wheel 이후 대상 scrollport만 변하는지, 목표가 DOM에 등장한 시점, 선택 근거와 서버 결과를 trace로 연결한다. READ_SUCCESS/NOT_FOUND/AMBIGUOUS/INCOMPLETE는 **업무 평가 결과**이며 신규 제품 API/오류를 추가하는 것이 아니다. 아직 이 fixture manifest나 실행 하니스를 구현한 것은 아니다.

## S07/S09 프레임 hit와 drag 경계

입력은 자식 document 내부 hit만으로 성공 판정하지 않는다. 자식 요소→frame element→각 조상 frame→main viewport까지 가림/clipping을 확인하는 fixture를 둔다. translate/양의 scale·테두리·가로/세로 scroll·OOPIF·open-shadow slot 버튼을 조합하고 parent overlay/클리핑·unsupported rotate를 따로 둔다. 정상은 정확한 버튼 서버 카운터1, 사전 거절은 버튼 입력0·다른 요소 카운터불변이다. auto-scroll 준비 효과와 실제 click을 분리 기록한다.

|dragTo 경계|v1 기대|
|---|---|
|같은 Page/frame document/CDP 입력 target|지원: native HTML DnD 또는 격자 pointer 방식, 업무완료와 drop1회 검증|
|같은 Page·같은 process지만 다른 frame document|CROSS_DOCUMENT_DRAG_UNSUPPORTED, 입력 전 거절|
|같은 Page·OOPIF의 다른 debugger target|CROSS_TARGET_DRAG_UNSUPPORTED, 입력 전 거절|
|다른 Page|세션이 같아도 사전 거절|

이는 Locator.dragTo의 범위다. primitive mouse의 수동 경로 구성까지 같은 보장을 추가하지 않는다. down/dragstart 뒤 frame detach·overlay·reset의 중도 실패는 이미 발생한 이벤트를 남기고 버튼/drag 정리 결과와 drop 중복0을 판독한다. fault 주입은 adapter 전송 경계에 격리하며 서버 PASS를 주입하지 않는다.

## S13/S14 평가 비동기·직렬화

Scope fn(arg), Locator 별칭 fn(element,arg), evaluateAll fn(elements,arg)을 각각 확인한다. arg 생략은 null, 동기 JSON/null과 async resolve(7)는 정상이다. waitForFunction의 async false는 계속 미충족이며 Promise 객체 자체가 성공이 되어서는 안 된다. async reject/throw는 함수 오류, undefined·순환·DOM node·비유한 값은 직렬화 오류, never-settle은 deadline이다. marker 변경 후 실패·timeout/reset은 실제 부분효과를 보존하고 late fulfillment를 차단한다. navigation context 소멸만 재평가 가능하며 사용자 ReferenceError를 timeout까지 삼키지 않는다. 업무 판정 API를 바꾸지 않는 격리 평가 fixture에서 수행한다.
