# 3차 메인 판단과 갱신

리뷰 문서 head `0e2e7fb28c75d2ae181a660556eb47f0ee4c853d`. 마지막 후보4건을 실제 규범·판정 설계와 대조했다. 제품 실행이 아닌 명세의 논리적 문제/검증 보완으로 수용한다.

|후보|판단|이유·변경|
|---|---|---|
|R3-01|수용|공통 cleanup MUST와 기존 modifier 보존 MUST가 반대 assertion을 만든다. REQ-C-INPUT-003과 GWT를 사전실패=기존 down 보존, 중도실패=새소유만 정리, reset/close=전체 정리로 통일. 명시 mouse down도 같은 소유 원칙, composite가 이미 눌린 버튼 필요 시 사전 상태충돌로 거절|
|R3-02|수용|목표 ID만 숨겨 놓고 업무 유형만 주면 과제가 식별 불가능할 수 있다. REQ-SCOPE-SNAPSHOT-004 및 S04에 공개 의미 predicate·유일성·동률/부재/접근불가·120호출/180초·oracle 분리 확정. 정확한 DOM 키워드를 모르는 것과 업무 조건 자체를 모르는 것을 구분|
|R3-03|수용|Promise 객체 자체 truthiness와 undefined→null 강제변환은 oracle이 달라진다. REQ-C-RUNTIME-008 추가, scope.evaluate/evaluateAll/waitForFunction 규범/GWT·수신 인자 확정. Promise settle 지원, 명시null 정상/undefined 직렬화오류, async reject 즉시오류, navigation context만 재시도, polling 비중첩·deadline/late결과 차단. 기존 undefined 반환 호출 예제 이행은 개발 backlog|
|R3-04|수용|기존 실제 hit 조건을 자식 문서만 검사해도 된다고 오해하지 않도록 S07/S09에 ancestor overlay/clipping·OOPIF fixture를 명시. dragTo는 같은 Page/frame document/CDP target만 지원으로 결정. same-process라도 cross-document는 사전 미지원. 새 cross-frame drag 기능을 확대하지 않고 검증 가능 경계 확정|

수용4/기각0/보류0. 신규 공통 요구1개로 총184개(개별API67개·공통5문서 유지). 세 리뷰의 후보는 총17개, 모두 이유와 적용 ID를 기록했다. 신규 제안이 모두 유용한 계약/검증 공백이어서 수용했으며, 개수를 늘리기 위한 추가나 경쟁기능의 자동 채택은 하지 않았다.

세 리뷰의 CHANGES_REQUESTED는 각각 당시 초안의 판정이다. 이 메인 갱신을 독립 리뷰어가 다시 승인했다고 표현하지 않는다. 메인이 알려진 필수 충돌·미정 기대값을 해소하고 문서 추적/동결 검사를 한 뒤 **명세 단계만 완료**한다. 제품의 신규 요구 충족은 여전히 미검증이며 구현은 별도 단계다.
