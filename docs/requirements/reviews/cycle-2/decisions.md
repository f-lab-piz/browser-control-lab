# 2차 메인 판단과 갱신

리뷰 문서 head `0a470f0541719ae987e3bc04825186204fa27f86`. 후보4건의 근거를 확인했고 모두 수용한다. 경쟁 제품의 미확인 기능을 MUST로 복제하지 않고 사용자 업무와 기존 API 조합을 완결한다.

|후보|판단|이유·변경|
|---|---|---|
|R2-01|수용|wheel 이전에 내부 scrollport를 발견해야 한다. REQ-SCOPE-SNAPSHOT-004 보완·011 추가. 이름 없는 영역의 ref/frame·축·현재 offset/물리방향 진행 가능 단서를 예산 안에 포함. 미로드 수/자동wheel 성공 보장은 하지 않음. S04/S07 보완|
|R2-02|수용|정책을 나중에 문서화하라는 문구만으로는 완료·중복·충돌을 판정할 수 없다. REQ-DOWNLOAD-SAVE-001/002에서 최대30초 대기(외부 deadline 우선), 동일id/목적지 멱등 결과·동시 공유, 목적지 전환 허용, 다른 동명 파일 비덮어쓰기 확정. S12 보완|
|R2-03|수용|정상 terminal event와 다른 대기 취소를 구별한다. REQ-PAGE-WAITFOREVENT-002·REQ-C-FILESEVENTS-004에 close metadata, close waiter resolve 후 정리, 다른 wait PAGE_CLOSED, 이미 닫힌 핸들 즉시거절, terminal 경합 단일결과 확정. S13 보완|
|R2-04|수용|규범만 고치고 검증문구를 남겨서는 반대 assertion이 생길 수 있다. REQ-LOCATOR-PRESS-002의 요약/Given/When/Then과 matrix를 modifier 소유 정책에 일치시킴. 신규 요구는 추가하지 않음|

수용4/기각0/보류0. 신규 요구1개, 총183개. API는3+64 그대로다. 비교 근거 등급과 범위는 sources.md대로 유지하며 새 Codex/Aside 실측이나 제품 테스트를 실행했다고 표시하지 않는다. 마지막 회차는 이 갱신 이후의 고정 커밋에서 반례·충돌·검증 가능성을 본다.
