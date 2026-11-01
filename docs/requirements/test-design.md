# 검증 설계 · 개발 전

이 문서는 다음 개발에서 추가할 테스트의 설계다. fixture/제품 테스트 파일을 이번에 만들거나 실행하지 않았다. 각 REQ의 PLAN 항목은 이 설계와 함께 정상·거절·전후 효과의 assertion으로 구체화한다.

| 시나리오 | 준비와 실제 확장 동작 | 독립 판정/반례 |
|---|---|---|
|S01 런타임/외부|두 세션, 변수·top-level await·오류·루프·텍스트/이미지한도, 진행중 reset, requestId 재조회|세대·출력·실제 웹값 분리, 같은id다른payload거절, 클릭1회, late응답차단|
|S02 탭/탐색|서로 다른 두 탭, activate/attach/close, A→B→C/back/forward/reload, SPA/hash 이동|tabId/URL/document identity, 이력경계false, 닫힌/다른세션/금지scheme거절·다른탭불변|
|S03 선택/이름|5행, 서로다른 A/B조건, foo+bar/실제공백, 10k본문끝, label·ARIA·slot·hidden·details|문자열/regex/g/y/양음필터·순서·nth의 기대 ref 집합, 원 locator 불변, stale/중복무입력|
|S04 키워드 미지 탐색|긴URL 1만개, 랜덤 명칭의 중첩/OOPIF 업무프레임, 대형영역. 목표명/CSS는 실행자에게 숨기고 업무유형만 제공|첫 구조→영역/프레임→상세→목표 제어 trace, scroll0 관찰/미로드구분, 역할·상태·바이트예산. 성공은 사후 fixture서버판정|
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

S04는 에이전트 방식 평가다. 성공률만 측정하지 않고 첫 관찰에 없는 목표를 어떻게 발견했는지 출력·호출 trace를 보존한다. 시드·브라우저/확장버전·viewport/DPR·HTTP/프레임오류·수집/반환노드·바이트·제어성공을 기록한다. 실행자의 사전 selector/키워드 하드코딩은 허용하지 않는다. 목표가 실제 DOM에 있는 사례와 아직 로드되지 않은 사례를 분리한다.

기존 fixture에 없는 조건은 신규 fixture 설계 backlog다. Playwright는 fixture oracle/실행 기동/독립 읽기용이며 제품 동작을 대신하지 않는다. 실사이트는 Naver 읽기 탐색처럼 별도 표본으로 기록하며 회사환경은 접근 가능 전까지 미검증이다.
