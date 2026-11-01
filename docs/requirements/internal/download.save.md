# download.save

## 계약과 적용 범위

대상: 확장 QuickJS에 공개하는 기존 API.

공통 계약: [runtime](../common/runtime.md), [files-events](../common/files-events.md). Page/Frame의 Scope 메서드는 같은 API로 센다. 공통 필수 조건도 이 API의 개발 수용 기준에 포함한다.

- 목적: 쿠키·POST·blob 다운로드를 브라우저가 받은 바이트대로 저장하고 실제 크기/hash를 확인한다.
- 입력/기본값: destination.target?:server/local(기본server); 임의Pod경로없음.
- 출력/성공 의미: server:{fileId:string,name:string,size:number,path:string,sha256:string}; local:{name:string,path:string,size:number,state:"complete"}. MIME은 asset 읽기 응답에 보존한다.
- 허용 부작용: 실제브라우저다운로드 완료및선택목적지저장.
- 오류/경계: 미완료·취소·디스크오류·다른세션id는성공저장으로표시하지않고 중복save/이름충돌정책을명시한다.
- 재시도: 읽기는 최신 문서 상태로 다시 관찰할 수 있다. 입력은 완료 여부를 먼저 확인하며 응답 유실만으로 재전송하지 않는다.
- 지원: Chrome debugger/CDP, 허용된 HTTP(S), 현재 연결 DOM. Firefox/Safari·closed Shadow·모든 사이트 완전 지원은 이번 약속이 아니다.

## 개별 요구사항

### REQ-DOWNLOAD-SAVE-001

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/files-events.md#ref-download-save). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (검토 2차 반영, 2026-11-01).
- 규범: save는 같은 핸들의 실제 브라우저 다운로드 완료를 최대30초 기다리고 완료 바이트를 요청 목적지로 반환한다. 쿠키/POST/blob을 URL 재요청으로 대체하지 않는다. 바깥 js deadline은 연장하지 않으며 더 짧은 실행 제한에 걸리면 실행 취소/불확실로 구분한다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-DOWNLOAD-SAVE-001-C01부터 C02까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-DOWNLOAD-SAVE-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-download.save` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-DOWNLOAD-SAVE-001-C01

- 조건: 실제 진행 중 다운로드 완료를 최대 30초 기다린다.
- 준비: 쿠키 GET/POST/blob/느린 전송
- 실행: save server/local
- 판정: 원본 브라우저 바이트 hash와 목적지 결과가 같고 URL 재요청 없다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-DOWNLOAD-SAVE-001-C02

- 조건: 동일 id/목적지의 동시·순차 저장은 같은 결과다.
- 준비: 완료 download 하나
- 실행: save server 동시 2회/반복
- 판정: fileId 하나·원본 바이트 하나이며 자산 중복 없다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-DOWNLOAD-SAVE-002

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/files-events.md#ref-download-save). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (검토 2차 반영, 2026-11-01).
- 규범: 같은 세션·download id·목적지의 순차/동시 save는 하나의 결과를 공유한다. server는 같은 fileId, local은 같은 완료 path를 반환하고 재다운로드/중복 자산을 만들지 않는다. server↔local 전환은 허용하며 같은 원본 바이트를 반환한다. 다른 download의 동명 파일은 기존 파일을 덮어쓰지 않고 브라우저의 유일 이름/path와 서로 다른 asset id를 사용한다. 목적지 미지원·권한·저장/취소 실패와 부분효과는 구분한다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-DOWNLOAD-SAVE-002-C01부터 C02까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-DOWNLOAD-SAVE-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-download.save` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-DOWNLOAD-SAVE-002-C01

- 조건: 목적지 전환/동명 다른 파일은 기존 바이트를 보존한다.
- 준비: 이름 같고 hash 다른 download2개
- 실행: server→local 및 각 save
- 판정: 목적지별 같은 원본 hash·다른 download 유일 path/id·기존 파일 비덮어쓰기다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-DOWNLOAD-SAVE-002-C02

- 조건: 취소/디스크/권한/timeout은 성공 파일 결과를 주지 않는다.
- 준비: 각 실패와 짧은 jsdeadline
- 실행: save
- 판정: interrupted/저장 실패/deadline을 구분하고 부분 파일 존재를 숨기지 않는다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

## 현재 사실과 근거 한계

기준 구현은 `700a6a06af3f97729327afaf9becb4ee29bb475b`. [카탈로그](../../api-catalog.json)의 과거 상태 `partial`는 기본 호출/당시 제한 기록이다. 본 명세의 모든 옵션·반례 충족을 뜻하지 않는다. [기존 테스트 연결](../../api-test-matrix.json)은 후보이며 소스 fingerprint가 현재와 다른 부분은 과거 증거다. 새 제품 테스트는 이번에 실행·추가하지 않았다. 규범과 다른 코드가 보이면 규범을 낮추지 않고 backlog에서 조사한다.
