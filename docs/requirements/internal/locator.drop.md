# locator.drop

## 계약과 적용 범위

대상: 확장 QuickJS에 공개하는 기존 API.

공통 계약: [runtime](../common/runtime.md), [dom-frames](../common/dom-frames.md), [selection](../common/selection.md), [input](../common/input.md), [files-events](../common/files-events.md). Page/Frame의 Scope 메서드는 같은 API로 센다. 공통 필수 조건도 이 API의 개발 수용 기준에 포함한다.

- 목적: 로컬/서버/bytes 파일과 텍스트 MIME을 공통 엔진으로 전달하고 임시 file input을 정리한다.
- 입력/기본값: options:{files?:FileInput 또는 FileInput[],data?:Record<MIME,string>}; 적어도 하나의 비어 있지 않은 files/data. []로 비우기는 setFiles 전용이다.
- 출력/성공 의미: Promise<Array<{name:string,size:number,type:string}>>; drop에 전달한 파일 목록. 텍스트만이면 [].
- 허용 부작용: 파일/MIME DOM DataTransfer drop 이벤트, untrusted.
- 오류/경계: trusted 필수 사이트 지원을 주장하지 않고 파일 검증 실패는 drop 이전에 거절한다. MIME/옵션은 guide와 일치해야 한다.
- 재시도: 읽기는 최신 문서 상태로 다시 관찰할 수 있다. 입력은 완료 여부를 먼저 확인하며 응답 유실만으로 재전송하지 않는다.
- 지원: Chrome debugger/CDP, 허용된 HTTP(S), 현재 연결 DOM. Firefox/Safari·closed Shadow·모든 사이트 완전 지원은 이번 약속이 아니다.

## 개별 요구사항

### REQ-LOCATOR-DROP-001

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/files-events.md#ref-locator-drop). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: 로컬/서버/bytes 파일과 텍스트 MIME을 공통 엔진으로 전달하고 임시 file input을 정리한다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-LOCATOR-DROP-001-C01부터 C02까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-LOCATOR-DROP-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-locator.drop` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-LOCATOR-DROP-001-C01

- 조건: 파일과MIME문자열은같은DataTransfer로전달한다.
- 준비: 파일1개와text/plain,application/x-test
- 실행: drop files/data
- 판정: 대상파일hash·각MIME값일치·dragenter/dragover/drop순서다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-LOCATOR-DROP-001-C02

- 조건: local파일도임시요소를통해공통파일엔진을쓴다.
- 준비: local절대경로·서버fileId·inlinebytes
- 실행: 소스별drop
- 판정: 바이트/이름/MIME일치·임시fileinput잔류0이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

### REQ-LOCATOR-DROP-002

- 참고 방식: [Codex·Aside의 공개 방법과 우리 판단](../reference-methods/files-events.md#ref-locator-drop). 관련 근거가 조건 전체의 충족을 의미하지 않는다.
- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: trusted 필수 사이트 지원을 주장하지 않고 파일 검증 실패는 drop 이전에 거절한다. MIME/옵션은 guide와 일치해야 한다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 아래 REQ-LOCATOR-DROP-002-C01부터 C02까지의 독립 준비 조건을 사용한다. 각 반례는 별도 run이다.
- When: 조건별 실행 절차를 실제 브라우저 경로로 수행하고 독립 관찰/이벤트/파일 바이트로 판독한다. 이번 문서 작업에서는 실행하지 않았다.
- Then: 아래 각 조건의 판정식을 모두 만족해야 이 요구의 적용 범위를 충족한다. 하나의 정상 호출로 다른 조건의 통과를 대신하지 않는다.
- 검증 계획: `PLAN-LOCATOR-DROP-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.


- 상세화 판단: `DETAIL-locator.drop` — 구현 전 설계 수용, 실제 충족 미검증. 공통 조건은 중복 정의하지 않고 이 API에 필요한 관찰 가능한 경계를 구체화한다.

#### REQ-LOCATOR-DROP-002-C01

- 조건: 빈payload/잘못된MIME값/invalid파일은drop전에거절한다.
- 준비: files없고data빈값·문자열아닌data·잘못된source
- 실행: drop
- 판정: 입력오류·dropcounter0·기존대상불변이다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

#### REQ-LOCATOR-DROP-002-C02

- 조건: DOM합성drop은trusted가아님을명시한다.
- 준비: isTrusted필수drop영역
- 실행: drop
- 판정: 전달방식은untrusted로기록하며예외없음을업무완료로주장하지않는다.
- 근거/상태: DESIGN · 수용된 목표 상세조건 · 제품 미검증.

## 현재 사실과 근거 한계

기준 구현은 `700a6a06af3f97729327afaf9becb4ee29bb475b`. [카탈로그](../../api-catalog.json)의 과거 상태 `partial`는 기본 호출/당시 제한 기록이다. 본 명세의 모든 옵션·반례 충족을 뜻하지 않는다. [기존 테스트 연결](../../api-test-matrix.json)은 후보이며 소스 fingerprint가 현재와 다른 부분은 과거 증거다. 새 제품 테스트는 이번에 실행·추가하지 않았다. 규범과 다른 코드가 보이면 규범을 낮추지 않고 backlog에서 조사한다.
