# 수정 전 평가 계획

기준 제품 커밋:35077f5. 도구 구현은 동결한다.

1. 요구사항과 프로젝트 스킬을 대조해 누락·평가 모드를 문서화한다.
2. 기존7개 복합 시나리오를 유지하고 `/audit`에 상태·가림·중복·지연·readonly·slot/중첩 Shadow·HTML DnD·MIME·다중 파일·로컬 drop·POST/cookie/blob·변형 iframe·큰 DOM을 추가한다.
3. `npm run test:audit`은 HTTP→현재 확장→QuickJS→브라우저만으로 동작한다. 결과 JSON은 실패를 포함한다. 기대되는 안전한 거절은 PASS이며 지원해야 할 동작의 실패는 FAIL이다. 알려진 미지원도 분모에서 빼지 않는다.
4. `npm run test:audit-fixture`는 fixture oracle이다. 독립 Playwright로 지연/slot/DnD/readonly/변형 iframe/clip을 확인한다. 제품 결과와 합산하지 않는다.
5. 기존 runtime 회귀를 별도로 실행해 새 fixture가 기존 업무를 깨지 않았는지 확인한다. coverage matrix는64 API 모두를 기존/진단 assertion에 연결하되 기본/경계/미검증 옵션을 구분한다.
6. Codex in-app browser와 Aside CLI REPL에 동일 `/audit`을 열고 스냅샷 크기·끝 목표 발견·상태·slot/정규식·입력을 비교한다. 브라우저/뷰포트·트리 포함 내용이 다르므로 절대 속도·압축률 우승을 선언하지 않는다. 현재 가이드의 기능과 실측을 분리한다.
7. 우선순위는 잘못된 입력·거짓 성공 → 필수 상태/목표 누락 → 대기/좌표/탐색 → 추가 옵션·효율 순이다. 보고서에는 재현·영향·대안·다음 구현 시 수용 기준을 쓴다.

명령: `npm run test:audit`, `npm run test:audit-fixture`, `npm run test:runtime`.
진단 URL: `/audit`. 브라우저는 임시 프로필을 쓰며 파일은 fixture 데이터만 사용한다.
현재 진단은 모든 API의 모든 조합을 완전 검증하지 않는다. 연결 단절·메모리 고갈·다중 다운로드 귀속·닫힌 Shadow DOM 등은 별도 위험 목록으로 남긴다.
