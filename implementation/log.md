# 구현 로그

## 2026-11-01 · B01A 요청 식별·접수 검증

### Plan Input

문서 #6(d5bd4ff)·계획 #8(3c87245) 머지 기준. B01A 담당6 REQ/9조건, issue#9. 사용자 확인:중계기는 개인용 로컬 프로그램이며 다중 사용자 계정 서비스를 만들지 않는다.

### Implemented

실효 operation/code/timeout digest와 동일 ID 충돌409, 정상 재전송·reset 이후 기록/오프라인 재조회, 엄격 접수 입력, chunk UTF-8 보존, 버전·지원 범위·unknown API 안내. 확장 실행 경로는 유지했다. 계획 리뷰 P3 후속 partial_pass 회귀의 부모 근거를 추가해 실제 자식 집계 거절을 직접 검증한다.

### Test Coverage

전송 단위5개 Before0/5→After5/5, 동일 제품4개 Before2/4→After4/4. 소스 비교는 bridge/server.mjs만 다르다. 조건별 proof는 docs/evidence/b01a와 보고서에 연결했다.

### Test Command and Result

npm test12 PASS, npm run test:all55 PASS/외부1 SKIP, HEADED=1 npm run test:requirements4 PASS. 문서 구조·계획 구조 및 검사기 회귀 각3개 메서드 PASS. 실제 요구를 pass로 올리자 false_slice_pass 테스트가 미검증 전제를 잃는 문제를 발견해, 해당 음성 테스트가 미검증 부모를 명시 준비하도록 보완했다. 완료 음성 테스트도 미완료 slice를 명시 준비한다.

### Decisions

요청 동일성은 operation/code/effective timeout이다. 기본 timeout 생략과30000은 같고 관리 client는 본인의 모든 세션을 제어한다. Codex/Aside의 해당 전송 계약은 미확인으로 유지해 새 수치·경쟁 동등성을 주장하지 않는다.

### Next Actions

PR 작성→정확 head의 Sol6.1 high 독립 리뷰→수정/재리뷰→gate 충족 후 머지. 이후 B01B.


## 2026-11-01 · B01A 독립 리뷰의 요청 ID 왕복 보완

### Plan Input

PR#10 첫 head47e59e0의 P2:한글/예약문자 ID 조회 실패 및 job#part→job 잘못된 결과.

### Implemented

client query encoding·server query/path decoding, malformed surrogate 사전 거절. 원문 ID14개 단위/12개 제품 왕복과 prefix 오조회 반례를 추가했다. 원래 코드47e59e0에서는 같은 최종 제품 테스트3 PASS/1 FAIL→After4 PASS. 전체 baseline3c87245에 대해서는 전송0/6→6/6, 제품2/4→4/4다.

### Test Coverage

최종 helper는 client도 source hash에 포함하며 baseline/After는 server/client 두 파일만 차이가 난다. raw 기록과 manifest를 갱신했다. 발견한 console NUL 잘림은 B01C, 최초 프레임 회귀 실패는 B03A에 미확인 하위 사례로 남겼다.

### Test Command and Result

HEADED=1 npm run test:requirements4 PASS. npm run test:all56 PASS/외부1 SKIP/FAIL0(단위13 포함). 최초 독립 프레임3 FAIL과 순차 재실행55 PASS/1 SKIP는 당시 기록으로 보존했다.

### Decisions

요청 ID는 query로 데이터로 왕복하며 예약문자를 제한하지 않는다. NUL ID는 정확히 반환하지만 console NUL 출력은 아직 미검증/실패로 추적한다.

### Next Actions

새 head 독립 재리뷰 후 gate 충족 시 머지한다.
