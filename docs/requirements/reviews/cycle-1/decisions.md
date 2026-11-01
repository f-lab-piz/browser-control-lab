# 1차 메인 판단과 갱신

리뷰 문서 head `6561d2227c8c0bbc34f6dd902428d35e38a79dcd`, 제품 baseline `700a6a06af3f97729327afaf9becb4ee29bb475b`. 리뷰 후보9개를 전부 검토했다. 제품 버그 재현으로 취급하지 않고 명세의 모호함을 해소한다.

|후보|판단|이유·변경 요구|
|---|---|---|
|R1-01|수용|부재 성공과 strict의 충돌은 실제 계약 충돌이다. REQ-C-SELECTION-001, REQ-LOCATOR-WAITFOR-001에 0/1/N 표와 ref stale 예외 확정|
|R1-02|수용|조상·자식 모두 매칭되면 조작 대상을 정할 수 없다. REQ-SCOPE-GETBYTEXT-001에 최소 일치 요소·composed 문서순서, 003에 빈 입력/regex exact 조합 거절 확정|
|R1-03|수용|예산과 기본 범위가 검증 가능한 수치여야 한다. REQ-SCOPE-SNAPSHOT-008..010 추가, 006 보완. 기본 전체DOM·16000chars/500nodes/48000bytes, 타입/범위·Unicode 단위·envelope 상한·cursor/since 호환성 확정. 기존 코드의 clamp/숫자 cursor와는 목표 차이다|
|R1-04|수용|파일 source 강제변환·우선순위는 바이트 오전달 위험이다. REQ-C-FILESEVENTS-006/007에 source 배타·number[]·표준 base64·0-byte·이름/MIME 정책 확정. 002에 단일 및 한 호출 합32MiB 명시. 합계 상한은 메모리/전달 사전검증을 위한 새 설계 판단이며 현재 구현 보장이 아니다|
|R1-05|수용|64KiB 텍스트와 일반 PNG를 같은 회계로 보면 모순이다. REQ-C-RUNTIME-004/007과 REQ-DISPLAY-002에서 텍스트/이미지 분리, 이미지4MiB/합8MiB/4장, 전체256블록, 결과16MiB, 원이미지 전체 생략/메타표시를 확정. 기존 bridge 제한 변경은 다음 구현에서 필요|
|R1-06|수용|유실은 로그행으로 위장하지 않고 메타데이터로 전달해야 한다. REQ-PAGE-LOGS-002와 출력 계약을 entries/collection envelope로 변경. 현재 배열 반환과의 호환 변경은 다음 개발 guide/호출 예제 이행 작업으로 명시|
|R1-07|수용|취소 접수만으로 전송 중단을 주장할 수 없다. REQ-DOWNLOAD-CANCEL-001/002는 최종 상태를 기다리는 구조화 결과로 확정. 새 API 대신 기존 cancel 반환 계약을 다음 버전에서 이행|
|R1-08|수용|임의 sleep이나 event Promise를 먼저 await하는 우회는 해결이 아니다. REQ-PAGE-WAITFOREVENT-003에 같은 세션 host action의 등록 완료 후 실행 보장 확정. 공개 ready 도구는 늘리지 않음|
|R1-09|수용|명시 down 상태와 press가 임시로 누른 상태의 소유를 구분해야 한다. REQ-KEYBOARD-PRESS-001, REQ-LOCATOR-PRESS-002에 기존 modifier 보존/자기 소유만 해제 정책 확정|

수용9/기각0/보류0. 신규 요구7개와 기존 규범·출력 계약을 갱신했다. 총182개(외부/내부/API 수는3+64 유지). 새 테스트/제품 구현은 없다. 구체적인 fixture/oracle 설계는 test-design.md의 S01..S14에 연결했다. 다음 회차는 갱신된 문서 커밋을 기준으로 비교 근거·조합·과잉 범위를 독립 검토한다.
