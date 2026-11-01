# 근거 레지스트리

수집/작성 2026-11-01. 개인정보·토큰·프로필·원본 제품 코드/번들/WASM은 수집하지 않았다. 버전이 바뀌는 경쟁 제품의 문서는 당시 계약이며 전 사이트 보장이 아니다.

|ID|유형·출처|적용/한계|
|---|---|---|
|USR|현재 사용자의 요구와 [개발 요구](../development-requirements.md), [계획](../../planning/spec-tool-requirements.md)|외부3/내부64, 파일 양쪽 소스·다운로드, 복잡 iframe/예약격자, 전체현재DOM/예산·탐색, 3회검토. 목표의 근거이며 실행 증거 아님|
|SCOPE|[카탈로그](../api-catalog.json), [공개 런타임 계약](../runtime-usage.md)|기준 main에서 수집. 개수/지원 범위 근거. verified-basic을 새 규범 전체 통과로 해석하지 않음|
|SKILL|[프로젝트 스킬](../../.agents/skills/browser-control-development/SKILL.md)|프레임·stale·무조작관찰·실제확장경로·공정 비교 규칙|
|CODE|기준 `700a6a06af3f97729327afaf9becb4ee29bb475b`의 extension/api-source.mjs, page-agent.mjs, browser-engine.mjs, files.mjs, runtime-worker.mjs 및 bridge/server.mjs|직접 읽은 구현 사실. 이 경로를 참조한 MUST도 목표 설계가 포함될 수 있으며 구현 준수의 근거로 쓰지 않음. 파일 해시는 evidence/product-freeze.json|
|HIST-COMP|[Before/After](../fixes-before-after.md), [진단 증거](../evidence/diagnostics-before-after.json)|2026-11-01 기록. Chrome for Testing145.0.7632.6, AsideCLI1.26.1028.2335, Codex in-app browser. 전체진단 경쟁동등 실행 아님. 최초 수정 단계 증거|
|HIST-R2|[후속 리뷰2](../review-round2.md), [증거](../evidence/review-round2.json)|긴텍스트·slot/summary·clip 관련 당시 범위. 후속 inline 수정 전 과거 결과|
|HIST-INLINE|[후속 리뷰3](../review-round3.md), [증거](../evidence/inline-filter-fix.json), tests/review-boundaries.test.mjs|인접span·실제공백·긴본문·label·summary·가로/세로clip. 증거의 page-agent hash를 현재와 대조 가능. 모든 신규규범을 입증하지 않음|
|ASIDE-GUIDE|[main 안내 캡처](evidence/aside-main-guide.txt), [REPL 안내 캡처](evidence/aside-repl-guide.txt)|이번 작업에서 `aside guide`, `aside guide repl` 읽기만 실행. CLI1.26.1028.2335/skill3. ES2023+,120초,명시console출력,compact tree/offscreen/childiframe,selector/ref부분조회,new snapshot invalidates refs,다운로드 이벤트 처리. 제품 원본코드 미열람|
|CODEX-OBS|[기존 실측 표](../fixes-before-after.md#codex--aside--우리-툴)|당시 이 대화 CUA의 domSnapshot/getByRole/filter/nth/fill/frameLocator/screenshot 실제 호출 기록. 이번 명세 작업에서 Codex 신규 비교실측은 하지 않음. 현재 모든 세부 API 계약/일반 Playwright와의 동등성을 주장하지 않음|
|DESIGN|이번 메인 설계 판단 및 reviews/cycle-N/decisions.md|독립 사용자필요·조합·실패영향에서 도출한 목표/추론. 경쟁도구의 현재동작 사실이나 현재 구현 증명이 아님|

## 참고에서 채택까지

|관찰/문서|요구 판단|차이/보류|
|---|---|---|
|Aside는 compact snapshot·iframe/offscreen·selector/ref부분조회 안내; Codex 기존 큰 전체스냅샷 실측|바이트예산+생략+구조·영역 발견+부분조회|단순 글자수가 적다는 이유로 정보완전성/성능 우위를 주장하지 않음|
|Aside는 snapshot때마다ref무효화 안내|우리ref는동일문서동일연결요소에안정,교체시stale|무효화주기를 그대로 모방하지 않음. 문서/요소 identity가 안전성 핵심|
|Codex 기존 regex/visible/nth(-1)/slot/frame 성공 관찰|우리도 검색·상태·프레임·입력의 일관된 기본계약 채택|경쟁제품 특정fixture실패를 우리제품요구의 유일근거로 삼지 않음|
|Aside는waitForEvent(download)→click→path 안내|업무발생전wait등록,실제브라우저다운로드바이트 검증|우리목적지는local/server,Aside의fs·fetch·서비스전용 전역은 자동추가안함|

옵션별 비교가 문서/과거 실측에 없는 경우 `미확인`으로 둔다. 이번 작업은 새 경쟁 제품 벤치마크/회사 사이트 검증이 아니다. 두번째 리뷰는 이 제한을 포함해 근거 타당성을 검토한다.
