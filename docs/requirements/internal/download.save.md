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

- 수준/판단: **MUST / 수용** (검토 2차 반영, 2026-11-01).
- 규범: save는 같은 핸들의 실제 브라우저 다운로드 완료를 최대30초 기다리고 완료 바이트를 요청 목적지로 반환한다. 쿠키/POST/blob을 URL 재요청으로 대체하지 않는다. 바깥 js deadline은 연장하지 않으며 더 짧은 실행 제한에 걸리면 실행 취소/불확실로 구분한다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 느린 쿠키/POST/blob 다운로드를 시작하고 이벤트 직후 핸들을 받는다. 충분한 js deadline과 짧은 deadline을 각각 쓴다.
- When: save({target:'server'}) 또는 save({target:'local'})를 진행 중 호출한다.
- Then: 완료 시 원본과 바이트 hash가 같고 올바른 목적지 결과를 반환한다. 30초 초과는 DOWNLOAD_TIMEOUT, interrupted는 원인 오류, 바깥 deadline은 실행 취소/불확실이며 성공 저장이 아니다.
- 검증 계획: `PLAN-DOWNLOAD-SAVE-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-DOWNLOAD-SAVE-002

- 수준/판단: **MUST / 수용** (검토 2차 반영, 2026-11-01).
- 규범: 같은 세션·download id·목적지의 순차/동시 save는 하나의 결과를 공유한다. server는 같은 fileId, local은 같은 완료 path를 반환하고 재다운로드/중복 자산을 만들지 않는다. server↔local 전환은 허용하며 같은 원본 바이트를 반환한다. 다른 download의 동명 파일은 기존 파일을 덮어쓰지 않고 브라우저의 유일 이름/path와 서로 다른 asset id를 사용한다. 목적지 미지원·권한·저장/취소 실패와 부분효과는 구분한다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 같은 핸들의 동시/순차 저장, 목적지 전환, 같은 이름·다른 hash의 두 다운로드, 취소/디스크 실패·타세션을 준비한다.
- When: 각 save를 실행하고 반환 identity·실제 파일 hash·asset 수를 확인한다.
- Then: 동일 목적지 재호출은 같은 결과, 목적지 전환은 바이트 동일, 다른 파일은 기존 파일 보존·자산 분리다. 실패를 저장 성공으로 표시하지 않고 타세션 접근을 거절한다.
- 검증 계획: `PLAN-DOWNLOAD-SAVE-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

## 현재 사실과 근거 한계

기준 구현은 `700a6a06af3f97729327afaf9becb4ee29bb475b`. [카탈로그](../../api-catalog.json)의 과거 상태 `partial`는 기본 호출/당시 제한 기록이다. 본 명세의 모든 옵션·반례 충족을 뜻하지 않는다. [기존 테스트 연결](../../api-test-matrix.json)은 후보이며 소스 fingerprint가 현재와 다른 부분은 과거 증거다. 새 제품 테스트는 이번에 실행·추가하지 않았다. 규범과 다른 코드가 보이면 규범을 낮추지 않고 backlog에서 조사한다.
