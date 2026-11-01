# 계획 색인

현재는 요구사항 기반21단계 중 B02A(6단계)까지 완료/머지했고 이후15단계는 미착수다. [현재 ledger](implementation-plan.json), [구현 현황](../implementation/index.md), [새 PC 재개](../docs/development-handoff.md)를 우선 읽는다. 아래는 계획이 발전한 순서의 이력이며 과거 전체Goal 착수 승인은 이후 중단 지시를 덮지 않는다.

## 2026-11-01 · 도구별 요구사항과 독립 검토

선택 방향: 외부3개·내부64 API의 개별 요구사항, 공통 계약과 근거·검증 매핑을 작성하고 Sol 6.1 high의 새 컨텍스트로3회 검토·갱신한 뒤 개발한다.

상태: 개발 전 명세 정립 완료. 67개 API·공통5개·184개 요구, Sol6.1 high 독립3회와 후보17개 메인 판단 완료. 제품/테스트 구현은 미실행.

- 최종 명세: [요구사항](../docs/requirements/README.md)
- 다음 개발: [backlog](../docs/requirements/backlog.md)

- 상세: [도구 요구사항 계획](spec-tool-requirements.md)
- 이력: [계획 로그](log.md)
- 기준 소스: main `700a6a06af3f97729327afaf9becb4ee29bb475b`

## 2026-11-01 · 요구사항·참고 방식 개선 루프

선택 방향: 두 제품 조사 A/B→메인 통합·판단→독립 Sol6.1 high 검토를 근거 정확성/설계 적용/반례의3사이클로 운영한다. 제품/테스트 구현은 동결한다.

상태: 루프 설계·Sol6.1 high 독립 검토 완료. 비차단 제안1건을 메인이 수용해 집계 기준을 보완했다. 전체 참고 조사 루프는 미실행.

- 상세: [참고 방식 보완 루프](spec-reference-improvement-loop.md)

## 2026-11-01 · 상세화/참고 방식 루프 실행

현재: 조사A/B의 1차공개자료/이전관측 조사 후 메인이184개 요구를252개 구체사례로 상세화하고 양쪽참고368슬롯을 연결했다. 단순링크연결과조건전체확인은별도집계한다. 독립1차검토를 시작하며 제품/테스트원본은동결이다.

## 최신 · 참고 방식/상세화 루프 완료

현재185REQ/254상세사례/양쪽370슬롯. 조사A/B협업과새컨텍스트Sol6.1 high 독립3회완료, 마지막367c16f의문서범위PASS·신규0건이다. 규범72파일/참고6본문은마지막검토와해시동일. [최종결과](../docs/requirements/reference-methods/completion.md)와 [개발backlog](../docs/requirements/backlog.md)를기준으로다음구현을진행한다. 이번제품/테스트/fixture/빌드변경0이며구현은미시작이다. 위진행중/184개표현은당시기록이다.


## 2026-11-01 · 요구사항 기반 구현 Goal 착수

문서 PR #6은 Sol6.1 high 재리뷰 PASS 후 main d5bd4ff로 머지했다. 다음 기준은 [실행 계획](spec-requirements-implementation.md), [185 REQ/254조건의 담당·상태](implementation-plan.json)이다. 21 slice를 순서대로 개발·검증·독립 리뷰하고 gate 충족 시 사용자의 재확인 없이 메인이 머지한다. 구현 상태는 계획 ledger와 implementation/log.md에 기록하고 이전 문서 단계의 미실행 기록은 당시 이력으로 유지한다.
