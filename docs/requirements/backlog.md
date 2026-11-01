# 개발 backlog와 착수 기준

이번 작업은 명세·검증계획까지만 완료한다. 아래 작업의 구현/테스트 코딩/제품 실행은 **시작하지 않았다**. 각 요구는 [요구별 개발 매핑](backlog-map.json)에서 담당 작업과 PLAN ID로 연결된다. MUST는 다음 개발 버전 수용 조건이고 SHOULD는 영향/비용을 기록해 순서를 조정할 수 있다.

기존 PASS를 새 요구 전체의 PASS로 합산하지 않는다. 정적 코드에서 확인한 차이는 재현 테스트를 먼저 추가하고, 나머지는 검증 후 구현 필요성을 판단한다. 여기서의 우선순위는 제품 버그 severity 확정이 아니라 개발 순서다.

|작업|우선순위·의존|개발할 검증과 목표|현재 정적 차이/미확인|
|---|---|---|---|
|B01 실행·출력·복구 계약|P1, 선행없음|S01/S14. 세션분리·requestId payload 동일성·reset late hostcall/실제 key/button 정리, 텍스트/이미지 예산, guide와 결과형식 이행|CODE에서 requestId는세션만비교, display는type외한도검사없음, reset은내부keys.clear/buttons=0. 실제release/host late effect는추가검증. bridge현재결과body1MiB는목표16MiB와차이|
|B02 검색·조합|P1, B01의실행하니스|S03. 본문/접근이름/원문 분리, 텍스트 최소후보·정규식·ARIA/hidden정책, filter/nth 호출순서·불변|CODE의filter/nth는query한필드덮어쓰기, getByText는300자name검색. 목표와차이가확인되지만신규fixture실패실측은아님|
|B03 프레임·스냅샷·캡처|P1, B01/B02|S04/S05/S07. 키워드없는영역탐색·세대결합cursor·완전diff·예산/메타데이터·문서/프레임범위·CSS좌표/캡처|cursor숫자offset, since는문서목록만비교. boundingBox는frame-local,point는변환. 개요/재시작/동일좌표에목표차이. 전체AX표준복제/주석도구추가는포함안함|
|B04 상태·입력·복합업무|P1, B01/B02/B03|S06/S07/S08/S09/S10. focus/value/checked/option 사후확인, readonly/disabled/overlay·modifier소유/좌표상태,메일내부스크롤·예약·긴메뉴|focus후실제active확인없음,isEditable은input타입/disabled분리부족,일반요소inputValue/isChecked도빈값/false반환,없는selectOption은선택을지울수있는코드경로. 새반례실측부터수행|
|B05 파일·이벤트|P1, B01/B03/B04|S11/S12/S13. 공통FileInput schema·사전검증/소유/cleanup·업로드hash, 실제download, cancel최종상태, waiterordering·단일소비/핸들identity|로컬file input변경이remote검증보다먼저. Dialog는page/type/message만보관해event identity검사없음. emit은같은typewaiter전부resolve. 다운로드origin추정경합한계. 반환계약/guide/예제이행필요|
|B06 수명·대기·평가·로그 회귀|P2, B01/B02/B03/B05|S02/S13/S14. 탭/이력·URL/load/state/timeout·evaluate직렬화·로그collection, 외부읽기표본|back/forward는navigate뒤바로boolean.waitForunknownstate는즉시거절없음.logs는배열만반환. 환경/권한/문서교체조합과직렬화오류는새검증필요|

## 검증 준비와 PR 단위

각 B 항목은 공통 엔진 단위로 나누어 PR을 만든다. 한 PR이 크면 같은 B 안에서 재현/관찰 정확성/호환성 이행으로 다시 나눌 수 있다. 먼저 해당 REQ/PLAN과 실패를 고정하고, 제품 경로에서 재현한 Before→수정→같은 조건 After→기존 복합 회귀→Sol6.1 high 독립 리뷰를 수행한다. Codex/Aside 비교는 같은 fixture·목표·범위에서 실제측정/문서/차단을 구분한다. 모든수치를매번재실측하지않았으면기존수치로현재우위를주장하지않는다.

공통 completion gate: 해당 MUST의 정상·거절·무부작용/부분효과 assertion, 기존메일/예약/가상메뉴 회귀, 실제HTTP→확장→QuickJS 경로, guide/카탈로그/예제의지원형식일치, 원본증거·환경·hash, 독립리뷰 잔여위험. 매핑에 테스트가 없으면 테스트설계부터개발범위에포함한다.

## 명세 단계와 구현 단계의 경계

요구 ID별 status=unverified는 현재구현실패확정도현재통과도아니다. 위 정적차이와기존실측을별도로보존하고 개발에서 상태를갱신한다. 회사사이트/현재외부사이트·다른Chrome버전·Firefox/Safari는미검증/범위밖을구분한다. 새로운외부도구·서비스전용기능·closedShadow/canvas의미분석은이backlog에자동추가하지않는다.

## 현재 범위 밖의 후보

서비스별 전용 API, 새 외부 툴, 전체 접근성 표준 동등성, Firefox/Safari, closed Shadow/canvas/PDF 의미 추출, 임의 Pod 저장, screenshot 주석과 범용 외부 modules는 이번 MUST가 아니다. 기존 도구 조합이나 명시 실패로 현재 범위를 유지하며 사용자 필요/근거가 생기면 신규 요구 후보로 검토한다. 세 리뷰에서 실제 보류한 후보와 이 제품 범위 밖 목록을 혼동하지 않는다.

추가 확정 사항: B01/B06은 REQ-C-RUNTIME-008의 Promise settle/JSON/undefined 오류와 기존 호출 예제의 명시 return null 이행을 포함한다. B04는 기존 down 보존과 연산 소유 cleanup, B03/S04는 공개 predicate와 부재/동률/접근불가/예산의 구분, B04/S07/S09는 ancestor hit·cross-document/CDP target 사전 거절을 검증한다. 세 회차의 판단은 reviews/index.json에서 추적한다.
