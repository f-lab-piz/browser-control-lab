# 범위와 현재 표면 조사

기준: main `700a6a06af3f97729327afaf9becb4ee29bb475b`. 카탈로그와 `extension/api-source.mjs`를 대조했다. 기존 계획의 ideation 폴더는 없으므로 사용자의 요구와 개발/비교/리뷰 문서를 기획 근거로 삼았다.

| 구분 | 수 | 결정 |
|---|---:|---|
|외부 논리 도구|3|guide/reset/js. 현재 HTTP로 연결하며 MCP 어댑터는 미포함|
|내부 카탈로그 API|64|Page/Frame의 Scope 중복 없이 개별 명세|
|공통 계약|5|API 수에 합산하지 않음|
|Locator.evaluate 별칭|1|기존 scope.evaluate의 단일 요소 수신 형태로 호환 유지. 신규 65번째 API로 늘리지 않음|
|Scope.args / Locator.args|2|직렬화 helper가 prototype에 노출된 구현 사실. 지원 사용자 API가 아님. 이를 불러 입력 덮어쓰기로 경계를 우회할 가능성은 다음 개발의 캡슐화/host validation 조사 항목|

`page.mouse`, `page.keyboard`, `id/tabId`, download의 id/url/name, dialog의 type/message, chooser의 event 데이터는 객체 필드/핸들이다. 별도 도구 수로 늘리지 않는다. runtime.delay 및 session.reset host 명령은 내부 전송 명령이다.

`docs/toolset.md`의 일부 계획형 문장과 초기 미구현 설명, `docs/status.md`의 초기 단계 이력은 시간순 기록이다. 카탈로그의 verified-basic(59개)/partial(5개)은 당시 기본 호출/제약을 의미한다. 실제 메서드와 다르면 코드를 구현 사실로, 이 requirements를 목표 규범으로 구분한다. 기존 api-test-matrix의 fingerprint도 최종 inline 수정 전 값이 있으므로 현재 전옵션 통과 증거로 사용하지 않는다.

제품·테스트·fixture·빌드 원본 35개 파일을 기준 커밋과 비교해 [동결 해시](evidence/product-freeze.json)에 보관했다. 이 작업의 문서/스킬 변경은 제품 개발에 포함하지 않으며 최종 다시 동결 검사를 한다.

형식과 현재 구현이 다른 목표도 있다. 예: locator 조합의 선언 순서 보존, getByText 본문 전체 검색, 좌표의 main viewport 통일, 이벤트 핸들 identity, 파일 전달 사전 검증. 이는 이번에 구현하거나 테스트 성공으로 표시하지 않는다.
