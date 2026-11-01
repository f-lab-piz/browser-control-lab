# display

## 계약과 적용 범위

대상: 확장 QuickJS에 공개하는 기존 API.

공통 계약: [runtime](../common/runtime.md). Page/Frame의 Scope 메서드는 같은 API로 센다. 공통 필수 조건도 이 API의 개발 수용 기준에 포함한다.

- 목적: screenshot을실제이미지로모델에전달하며base64를일반로그로쏟지않는다.
- 입력/기본값: image:{type:'image',mimeType:'image/png',data:base64};지원타입은guide안내.
- 출력/성공 의미: 모델이미지출력블록;JS반환값undefined.
- 허용 부작용: 세션출력추가.
- 오류/경계: 잘못된MIME/base64·초과이미지는명시오류/생략이며다른요청이미지를재사용하지않는다.
- 재시도: 읽기는 최신 문서 상태로 다시 관찰할 수 있다. 입력은 완료 여부를 먼저 확인하며 응답 유실만으로 재전송하지 않는다.
- 지원: Chrome debugger/CDP, 허용된 HTTP(S), 현재 연결 DOM. Firefox/Safari·closed Shadow·모든 사이트 완전 지원은 이번 약속이 아니다.

## 개별 요구사항

### REQ-DISPLAY-001

- 수준/판단: **MUST / 수용** (초안 설계 결정, 2026-11-01).
- 규범: screenshot을실제이미지로모델에전달하며base64를일반로그로쏟지않는다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 독립 세션·해당 Page/Scope/핸들을 준비한다. 입력 계약: image:{type:'image',mimeType:'image/png',data:base64};지원타입은guide안내.
- When: `display`를 정상 입력으로 호출하고 반환/실제 효과를 독립 판독한다.
- Then: screenshot을실제이미지로모델에전달하며base64를일반로그로쏟지않는다.
- 검증 계획: `PLAN-DISPLAY-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-DISPLAY-002

- 수준/판단: **MUST / 수용** (검토 1차 반영, 2026-11-01).
- 규범: 잘못된 MIME/base64는 display 입력 오류다. 유효 이미지가 출력 한도를 넘으면 이미지 전체를 생략하고 truncated/이유를 결과 envelope에 표시하며 실행은 계속한다. 부분 base64 이미지를 반환하거나 다른 요청 이미지를 재사용하지 않는다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 지원 PNG와 잘못된 MIME/base64 및 이미지 한도 초과 데이터를 준비한다.
- When: before 로그→display→after 로그를 실행한다.
- Then: 형식 오류는 명시 JS/입력 오류다. 한도 초과는 이미지 생략·truncated/이유와 이후 유효 로그가 남고 다음 요청은 독립이다.
- 검증 계획: `PLAN-DISPLAY-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

## 현재 사실과 근거 한계

기준 구현은 `700a6a06af3f97729327afaf9becb4ee29bb475b`. [카탈로그](../../api-catalog.json)의 과거 상태 `verified-basic`는 기본 호출/당시 제한 기록이다. 본 명세의 모든 옵션·반례 충족을 뜻하지 않는다. [기존 테스트 연결](../../api-test-matrix.json)은 후보이며 소스 fingerprint가 현재와 다른 부분은 과거 증거다. 새 제품 테스트는 이번에 실행·추가하지 않았다. 규범과 다른 코드가 보이면 규범을 낮추지 않고 backlog에서 조사한다.
