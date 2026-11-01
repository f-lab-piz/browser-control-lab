# 진단 12건 수정과 3개 브라우저 툴 비교

이 문서와 evidence/diagnostics-before-after.json은 초기 수정 단계의 비교 기록이다. 이후 독립 리뷰에서 발견한3건과 후속 소스의 검증은 [review-round2.md](review-round2.md)를 따른다.

2026-11-01. 기존 PR #2의 `06887ed`를 Before로 보존했다. 제품 파일은 이 시점에 `35077f5`와 같았다. 이번 수정은 별도 브랜치에서 진행했으며 기존 PR을 병합하거나 수정하지 않았다. 기계 판독 결과는 [evidence/diagnostics-before-after.json](evidence/diagnostics-before-after.json)에 있다.

## 결과

| 검증 | Before | After |
|---|---:|---:|
| 원래 진단31개 |19 PASS / 12 FAIL|31 PASS / 0 FAIL|
| 추가 경계5개 포함 |해당 없음|36 PASS / 0 FAIL|
| 기존 복합 업무 회귀 |24 PASS|24 PASS / 외부1 SKIP|
| 단위·계약 |7 PASS|7 PASS|

추가5개는 상태3종 각각, 미지원 필터 거절, 잘못된 clip 거절, 정규식 반복 flags, showHidden 표시를 검증한다. 원래31개의 성공 조건을 느슨하게 바꾸지 않았다. HTML DnD는 기존 서버 판정에 더해 `DRAGSTART true`와 업무 이벤트1회까지 확인했다. 서로 다른 종류의 테스트 숫자를 합산해 사이트 전반의 성공률로 주장하지 않는다.

## 수정별 Before / After

| 항목 | Before | After |
|---|---|---|
|readonly fill|값 LOCKED인데 completed|입력 전에 ELEMENT_NOT_EDITABLE로 거절, LOCKED 유지|
|scale iframe|completed여도 클릭 대상 미변경|양의 scale/translate·border 좌표 변환으로 실제 버튼/서버 판정 성공|
|snapshot 상태|checked/selected/expanded 누락|상태를 text/ref에 보존, 상태별 독립 assertion 통과|
|slot 이름|검색 불가 또는 가림 판정 오류|assignedNodes 이름 계산·composed ancestry 히트 판정으로 성공|
|닫힌 details|숨겨진 내부 버튼 포함|기본 제외, showHidden에는 hidden 표시|
|정규식|직렬화 시 손실되어0개|source/flags 전달·실제 정규식 매칭, 반복 호출도1개|
|visible 필터|옵션 무시,3개|2개로 필터, hasNotText 지원, 미지원 필터는 오류|
|지연 활성화|즉시 ELEMENT_DISABLED|visible/enabled 제한 대기 후 클릭|
|HTML DnD|포인터 이동 후 업무 미완료|누른 버튼을 mouseMoved에도 유지, native dragstart/interception/DragData/drop으로 성공|
|로컬 파일 drop|미지원 오류|임시 file input과 기존 전달 엔진을 공유, 실제 내용 판정 성공·임시 요소 정리|
|clip|부분 요청에도 전체 viewport 이미지|요청 크기로 CDP 캡처·Retina 배율 보정,320×240 픽셀 확인|
|nth(-1)|0개|마지막 요소1개, 비정수 index는 명시적 오류|

fill은 실제 값이 요청과 다른 경우도 오류로 반환한다. root snapshot은 해당 프레임 범위만 관찰해 관련 없는 자식 프레임의 CSS root 오류를 없앴다. HTML DnD의 native 경로는 [Chrome DevTools Input 프로토콜](https://chromedevtools.github.io/devtools-protocol/tot/Input/)을 사용하며 제품 원본 코드를 복제하지 않았다.

## Codex / Aside / 우리 툴

동일 `/audit` fixture에 대한 현재 실측이다. Codex는 이 대화의 in-app browser, Aside는 CLI `1.26.1028.2335` REPL, 우리 툴은 Chrome for Testing `145.0.7632.6` 확장이다. API·기본 예산·브라우저·viewport/DPR이 다르므로 단순 글자 수로 성능 우열을 말하지 않는다. 측정하지 않은 기능은 미측정으로 표시한다.

| 동작 | Codex 스타일 실측 | Aside 스타일 실측 | 우리 Before → After |
|---|---|---|---|
|정규식 role 검색|1개|1개|0 → 1|
|visible 필터|2개|3개, 숨김 포함|3 → 2|
|nth(-1)|1개|DOMException|0 → 1|
|slot 이름 클릭|성공|Role selector not found|실패 → 성공|
|readonly fill|거절·LOCKED|거절|거짓 성공 → 거절·LOCKED|
|scale iframe 클릭|실제 이름 변경 확인|이름 변경0개·서버 성공 기록 없음|업무 미완료 → 실제 이름 변경·서버 PASS|
|HTML DnD|미측정|서버 PASS. 단일 호출에서 accepted 이벤트2회 관찰|미완료 → trusted dragstart·서버 PASS1회|
|clip 320×240|JPEG320×240|PNG640×480(DPR 반영)|전체 viewport → PNG320×240|
|selected 상태|표시 확인|표시 확인|누락 → 표시|
|나머지 진단의 경쟁 도구 비교|전체 동일 진단 실행은 아님|전체 동일 진단 실행은 아님|우리 원래31건은 모두 실행|

Aside의 iframe/드래그는 snapshot 문구만으로 판정하지 않고 새 이름 count와 fixture 서버 기록을 함께 확인했다. 이전 보고서의 Aside 연결 차단은 이번에 실행 중인 연결을 찾아 해소했다. 관찰한 오류를 Aside의 모든 버전·사이트에 일반화하지 않는다. Aside의 드래그 accepted2회 역시 이 fixture·단일 호출에서 관찰한 결과이며 일반적인 중복 처리 원인을 단정하지 않는다.

## 스냅샷 출력과 탐색

- Codex 전체 DOM snapshot: **2,682,070자**, 문서 끝 목표 포함. 긴 링크가 많은 이 fixture에서는 출력이 크다.
- Aside 기본 tree: **13,175자**, truncation 표시, 문서 끝 목표는 기본 반환에 없음. `selector:'#tail-target'` 범위 조회104자에서 목표를 확인했다.
- 우리 툴: Before/After의 정확한 text/ref/직렬화 바이트·cursor는 증거 JSON에 기록했다. 기본48KB 예산과 생략 표시를 유지한다. 상태가 풍부해졌지만 기본 반환에 문서 끝 목표가 전부 포함되는 것은 아니다. query로 끝 목표를 찾아도 scrollY=0이다.

세 툴의 기본 반환 계약이 달라 전체 수집 정보량과 동일하지 않다. 우리 툴은 생략과 후속 조회를 명시하지만, 목표 키워드를 모르는 상황의 영역별 개요·커서 세대 검증은 여전히 다음 개선 범위다. 이번에는 실제로 실패한12개를 먼저 수정했다.

## 재현

```sh
npm ci
npm run site
HEADED=1 npm run test:audit
AUDIT_EXTRA=1 npm run test:audit
npm run test:runtime
npm test
FIXTURE_URL=http://127.0.0.1:8787/audit ASIDE_ACCOUNT=<연결된계정> npm run compare:aside
```

Aside 비교 전 `aside guide`, `aside guide repl`을 읽는다. 기본 개발 서버8787과 독립 비교 서버8794를 혼동하지 않도록 FIXTURE_URL을 명시한다. Aside 비교기는 raw 응답을 output/before-after/에 저장하고, fixture 외의 사용자 탭·파일·인증을 읽지 않는다. Codex 측정은 동일 페이지에서 domSnapshot/getByRole/filter/nth/fill/frameLocator/screenshot을 호출했다. 자체 수정 결과를 일반 Playwright 동작으로 대체하지 않았다.

## 남은 제약

회전/기울임/음수 scale/3D frame은 안전하게 명시적 오류로 거절한다. 서로 다른 target 간 드래그, full AX 표준, screenshot ref/주석, Firefox/Safari, 실제 회사 사이트는 검증하지 않았다. 외부 파일/MIME drop은 DOM DataTransfer 이벤트이므로 trusted 필수 사이트는 별도 검증이 필요하다. CDP drag interception은 실험적 API라 Chrome 버전별 회귀가 필요하다.

프로젝트 스킬에는 앞으로 동일 Before 보존 → 수정 → 원래 진단/회귀 → Codex·Aside·우리 비교 → 증거 포함 PR 순서로 개발하도록 명시했다. 평가 전용 요청이면 기존 동결 모드를 그대로 따른다.
