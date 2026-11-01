# 2차 교차조사 메인 판단

조사 고정본7c9851b. A10건/B10건을 각각 검토했고 중복 주제는 공통 정책표 한 곳에서 해결했다. 모두 공백을 명확히 하자는 취지는 수용하되 아래 대안 선택은 메인의 독립 설계다. 전체 AX/새 외부도구/범용 타브라우저 기능 확대는 하지 않는다.

|후보|판단과 반영|
|---|---|
|C2A-01|수용: lexical 재선언/const 대입 오류, var 재선언 허용. 실행 전 충돌/기존값 보존을 확정. 기존 prototype의 top-level property변환과 다른 목표로 이행 필요.|
|C2A-02|수용: named/ASCII 키 표, 중복없는 modifier+주키, 단독+와Control++를 명료화.|
|C2A-03|수용: timeout의 유한 양의 정수 ms와 호출시작부터 queue/arming/settle을 포함한 총deadline.|
|C2A-04|수용: 유효labelledby 순서→aria-label→native label→제한된fallback. 직접 참조 숨김 텍스트와 검색본문을 분리.|
|C2A-05|수용: 동기handler/microtask뒤 반환직전 같은identity에서 사후상태 판독. 무한미래보장하지않음.|
|C2A-06|수용: goto hash same-document는기존identity/ref유지, 실제교체만stale.|
|C2A-07|수용: dialog/chooser 둘째 활성wait의 등록단계 즉시충돌. 관찰event는identity공유.|
|C2A-08|수용: viewport밖clip은전체범위오류로거절. clamp/padding하지않음.|
|C2A-09|수용: oversized scrollIntoView는모든관련clip영역과양의교차면적이면성공,전체포함/click가능은보장않음.|
|C2A-10|수용: CE현재값은innerText CRLF→LF, native는value. raw textContent/검색정규화와구분.|
|C2B-01|수용: A01과같은lexical정책. 현재코드에맞춰요구를낮추지않고호환이행과기존테스트갱신을backlog로명시.|
|C2B-02|수용: A04와공유. getByLabel은명시연결소스만검색, 일반본문을label로발명하지않음.|
|C2B-03|수용: 유한편집타입/disabled·readonly/native checked 우선과customARIA mixed를상태표로확정. full AX확장안함.|
|C2B-04|수용: A07과공유. 거절대상은둘째등록,기존wait와deadline보존.|
|C2B-05|조정수용: Pageclose는해당Page만release, reset은세션전체. 탭소유/asset/tombstone유지·구세대명령무효를수명표로명시. reset뒤남은모달을자동닫지않고회복하도록기존waitForEvent에dialog전용includeCurrent옵션/REQ-PAGE-WAITFOREVENT-004를추가했다. 새도구없음. download/chooser범용재획득확장은보류목록으로분리.|
|C2B-06|수용: inline메타문자열/생략기본/MIMEtoken소문자·dropdata빈문자열과빈record를분리. native/asset 메타의unknown빈type은별도취급.|
|C2B-07|조정수용: 최소키표는공유하되literal chord plus는불필요API없이명확히parse가능하므로 A02의Control++지원선택. 모든키별칭/F키확장은보류.|
|C2B-08|수용: A05와공유,사후상태관측시점과동일identity를확정.|
|C2B-09|수용: x/y/width/height 각각≤1px의2rAF기준과정지oracle를통일. 수치는우리설계이며경쟁내부구현주장아님.|
|C2B-10|수용: ref→scope.locator(ref).getAttribute('href'), 실제browser.list()호출과button 옵션문구정정.|

후보20/수용20(이중2건은조정수용)/기각0/보류0. 후보 안의 대안 중 F키/모든별칭·전체AX·범용current download/chooser 확대는 현재 범위 밖이다. 새공통정책은다음독립Sol6.1 high가검토하며이교차조사결과를독립승인으로세지않는다.
