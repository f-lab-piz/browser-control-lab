# locator.setFiles

## 계약과 적용 범위

대상: 확장 QuickJS에 공개하는 기존 API.

공통 계약: [runtime](../common/runtime.md), [dom-frames](../common/dom-frames.md), [selection](../common/selection.md), [files-events](../common/files-events.md). Page/Frame의 Scope 메서드는 같은 API로 센다. 공통 필수 조건도 이 API의 개발 수용 기준에 포함한다.

- 목적: Chrome호스트 로컬경로와 서버asset을 구분하며 실제 업로드된 바이트·이름·MIME을 검증한다.
- 입력/기본값: files:FileInput 또는 FileInput[]; []는비우기. FileInput=로컬경로/{fileId}/{name,mimeType,bytes}/{name,mimeType,base64}.
- 출력/성공 의미: Promise<Array<{name:string,size:number,type:string}>>; 적용 파일의 메타데이터.
- 허용 부작용: file input선택·input/change;공통파일전달.
- 오류/경계: single/multiple·파일수·32MiB제한·권한·없는경로·다른세션asset을 전체사전검증하고 실패시기존선택보존여부를알린다.
- 재시도: 읽기는 최신 문서 상태로 다시 관찰할 수 있다. 입력은 완료 여부를 먼저 확인하며 응답 유실만으로 재전송하지 않는다.
- 지원: Chrome debugger/CDP, 허용된 HTTP(S), 현재 연결 DOM. Firefox/Safari·closed Shadow·모든 사이트 완전 지원은 이번 약속이 아니다.

## 개별 요구사항

### REQ-LOCATOR-SETFILES-001

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/files-events.md#ref-locator-setfiles). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: Chrome호스트 로컬경로와 서버asset을 구분하며 실제 업로드된 바이트·이름·MIME을 검증한다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-LOCATOR-SETFILES-001-C01부터 C03까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-LOCATOR-SETFILES-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-locator.setFiles` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-LOCATOR-SETFILES-001-C01

- 조건: local/asset/bytes/base64는 같은 파일 내용을 전달한다.
- 준비: 같은 바이너리 4 소스
- 실행: 각 setFiles 후 실제 multipartsubmit
- 판정: 파일 hash/안전 이름/MIME/크기 일치다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-LOCATOR-SETFILES-001-C02

- 조건: 빈 파일과[] 선택 해제는 구분한다.
- 준비: 0byte inline 파일과 기존 파일 선택
- 실행: 0byte 설정 후[]
- 판정: 첫 file1 size0·이후 file0이며 파일 없는 오류와 혼동 없다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-LOCATOR-SETFILES-001-C03

- 조건: 성공 파일 목록은 입력 순서와 메타데이터를 보존한다.
- 준비: 중복명/Unicode 명 3 파일
- 실행: multiple setFiles
- 판정: 서로 다른 바이트가 합쳐지지 않고 각 name/size/type와 순서가 맞다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-LOCATOR-SETFILES-002

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/files-events.md#ref-locator-setfiles). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: single/multiple·파일수·32MiB제한·권한·없는경로·다른세션asset을 전체사전검증하고 실패시기존선택보존여부를알린다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-LOCATOR-SETFILES-002-C01부터 C03까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-LOCATOR-SETFILES-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-locator.setFiles` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-LOCATOR-SETFILES-002-C01

- 조건: 여러 source/불량 bytes/base64는 전체 사전 검증한다.
- 준비: [256,-1]·bytes와 fileId 동시·불량 base64
- 실행: setFiles
- 판정: 전달 전 오류·기존 선택/hash/event 불변이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-LOCATOR-SETFILES-002-C02

- 조건: 한 파일 및 총합 32MiB와 single/multiple을 검증한다.
- 준비: 경계/1byte 초과·single2개
- 실행: setFiles
- 판정: 허용 경계만 진행·초과/개수 오류 전 선택 유지다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-LOCATOR-SETFILES-002-C03

- 조건: local 읽기/asset 소유 실패는 혼합 입력도 사전 거절한다.
- 준비: 유효 local+다른 세션 asset/없는 경로
- 실행: setFiles
- 판정: 기존 선택 보존·partiallocal 이벤트 없음·임시 DOM0이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

## 현재 사실과 근거 한계

기준 구현은 `700a6a06af3f97729327afaf9becb4ee29bb475b`. [카탈로그](../../api-catalog.json)의 과거 상태 `verified-basic`는 기본 호출/당시 제한 기록이다. 본 명세의 모든 옵션·반례 충족을 뜻하지 않는다. [기존 테스트 연결](../../api-test-matrix.json)은 후보이며 소스 fingerprint가 현재와 다른 부분은 과거 증거다. 새 제품 테스트는 이번에 실행·추가하지 않았다. 규범과 다른 코드가 보이면 규범을 낮추지 않고 backlog에서 조사한다.

### REQ-LOCATOR-SETFILES-003

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/files-events.md#ref-locator-setfiles). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 동일파일명은 경로 분리자를 제거한안전이름으로 다루고 bytes/base64/MIME 형식오류·크기초과를 명시한다. 업로드 제거 []와 input multiple정책을 문서화한다.
- 근거: USR, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-LOCATOR-SETFILES-003-C01부터 C01까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-LOCATOR-SETFILES-003`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

- 상세화 판단: `DETAIL-locator.setFiles` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-LOCATOR-SETFILES-003-C01

- 조건: 안전 이름/MIME 기본·빈 파일·삭제를 같은 엔진 정책으로 유지한다.
- 준비: 경로 분리자/NUL·기본명·빈 bytes·[]
- 실행: setFiles와 실제 submit
- 판정: basename 정책·MIME·0byte와 선택 해제가 정확하고 invalid는 전달 전 거절이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.
