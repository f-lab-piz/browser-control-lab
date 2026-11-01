# 요구사항 기반 자율 구현

사용자가 전체 구현 및 리뷰 후 머지를 명시 승인했을 때 적용한다. 일반 리뷰 요청만으로 머지 승인을 추정하지 않는다. 이번 Goal의 승인·범위·순서는 planning/spec-requirements-implementation.md와 planning/implementation-plan.json에 기록되어 있다.

- 담당 slice의 REQ/PLAN/Cnn과 공통 계약을 읽고 Before→수정→동일 조건 After→관련/복합 회귀를 수행한다. 제품 조작은 HTTP→확장→QuickJS 경로로, 독립 판독은 DOM/서버 판정/실제 파일 bytes로 확인한다.
- 판정기를 우회하거나 기대 조건을 느슨하게 바꾸지 않는다. fixture oracle과 제품 PASS, 과거 결과와 새 조건 결과를 분리한다. 각 조건의 증거가 모여야 부모를 PASS로 올린다.
- 같은 fixture의 Codex·Aside·우리 Before/After를 비교하고 실측/문서/과거/차단을 표시한다. 실행 불가는 미지원 판정이 아니며 우리 필수 테스트의 통과를 대신하지 않는다. 원본 코드/번들/WASM 복사는 금지한다.
- PR은 issue·REQ·변경·검증·Before/After·비교·제한을 포함한다. pr-review.md의 Sol6.1 high 새 컨텍스트 독립 리뷰를 적용한다. 지적은 메인이 판단·수정하고 중요한 변경은 정확한 새 head로 재리뷰한다.
- 머지 gate는 범위 내 MUST 조건/회귀/필수 CI 통과, 독립 PASS, 미해결 P0/P1/P2 없음, 계약·안내 일치, mergeable이다. P3 보류는 영향·후속 담당을 기록한다. admin 우회는 하지 않는다. base 변경 영향은 재검증한다.
- gate를 통과하면 사용자에게 재확인하지 않고 승인된 저장소의 PR을 머지하고 main·issue·실행 로그·조건 ledger를 갱신한다. 실패는 계속 보완하되 횟수만으로 승인하지 않는다. 자율 해결 불가인 필수 외부 차단은 증거와 재개 조건을 남기고 실제 독립 작업을 진행한다.
- 배포, 개인 프로필/계정 변경, 범위 밖 기능은 자동 머지 승인에 포함하지 않는다. 기록은 planning 및 implementation에 유지한다.
