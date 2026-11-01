# download.cancel

## 계약과 적용 범위

대상: 확장 QuickJS에 공개하는 기존 API.

공통 계약: [runtime](../common/runtime.md), [files-events](../common/files-events.md). Page/Frame의 Scope 메서드는 같은 API로 센다. 공통 필수 조건도 이 API의 개발 수용 기준에 포함한다.

- 목적: 실제진행중다운로드를중단하고최종interrupted상태를확인할수있다.
- 입력/기본값: 자기Download핸들;인자없음.
- 출력/성공 의미: Promise<{status:"cancelled"/"already-cancelled"/"already-complete"/"interrupted",state:"interrupted"/"complete",error?:string}>; 최종 브라우저 상태를 기다린 결과. boolean 반환에서 변경하는 목표 계약이다.
- 허용 부작용: 진행브라우저전송중단;완료파일삭제아님.
- 오류/경계: 이미완료/취소된download는상태를구분하고다른세션다운로드를취소하지않는다.
- 재시도: 읽기는 최신 문서 상태로 다시 관찰할 수 있다. 입력은 완료 여부를 먼저 확인하며 응답 유실만으로 재전송하지 않는다.
- 지원: Chrome debugger/CDP, 허용된 HTTP(S), 현재 연결 DOM. Firefox/Safari·closed Shadow·모든 사이트 완전 지원은 이번 약속이 아니다.

## 개별 요구사항

### REQ-DOWNLOAD-CANCEL-001

- 수준/판단: **MUST / 수용** (검토 1차 반영, 2026-11-01).
- 규범: 진행 다운로드에 취소를 요청하고 최대10초 내 브라우저 interrupted(USER_CANCELED) 상태를 확인한 뒤 cancelled를 반환한다. 확인이 안되면 timeout/불확실 오류이며 중단 성공을 주장하지 않는다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 충분히 느린 전송을 시작해 download 핸들을 받는다.
- When: cancel 후 반환값과 독립 브라우저 전송 상태를 판독한다.
- Then: 실제 중단일 때만 status=cancelled/state=interrupted이고 저장 완료 파일 삭제는 하지 않는다.
- 검증 계획: `PLAN-DOWNLOAD-CANCEL-001`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

### REQ-DOWNLOAD-CANCEL-002

- 수준/판단: **MUST / 수용** (검토 1차 반영, 2026-11-01).
- 규범: 이미 complete는 already-complete, 이미 사용자 취소는 already-cancelled, 다른 이유 interrupted는 interrupted와 원인으로 반환한다. 완료/cancel 경합도 관측한 최종 상태로 구분하고 타세션 id는 권한 오류다.
- 근거: USR, CODE, DESIGN. 문서/이력에서 도출한 목표 계약이며 현재 충족의 증명은 아니다.
- 충족 상태: **미검증**. 기존 구현 사실과 기본 PASS는 아래 후보 경로에서만 참고한다.
- Given: 완료 직전·이미 완료·이미 취소·네트워크 interrupted·타세션 다운로드를 준비한다.
- When: cancel을 반복 호출한다.
- Then: 반환 상태는 실제 최종 상태와 같고 다른 세션과 완료 파일에는 부작용이 없다.
- 검증 계획: `PLAN-DOWNLOAD-CANCEL-002`; [매핑](../verification-matrix.json). 정상과 적용되는 거절·무부작용/부분효과를 실제 확장 경로로 확인한다.

## 현재 사실과 근거 한계

기준 구현은 `700a6a06af3f97729327afaf9becb4ee29bb475b`. [카탈로그](../../api-catalog.json)의 과거 상태 `verified-basic`는 기본 호출/당시 제한 기록이다. 본 명세의 모든 옵션·반례 충족을 뜻하지 않는다. [기존 테스트 연결](../../api-test-matrix.json)은 후보이며 소스 fingerprint가 현재와 다른 부분은 과거 증거다. 새 제품 테스트는 이번에 실행·추가하지 않았다. 규범과 다른 코드가 보이면 규범을 낮추지 않고 backlog에서 조사한다.
