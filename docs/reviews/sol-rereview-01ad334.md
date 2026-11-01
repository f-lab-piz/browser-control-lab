# PR #4 Sol 6.1 독립 재리뷰

판정: **CHANGES_REQUESTED — P2 1건**.

이 문서는 공간 부족으로 파일 저장이 실패했던 리뷰어의 최종 응답과 보존된 결과·로그를 바탕으로 복원했다. 복원 작업은 새 리뷰나 새 테스트 실행이 아니다. 검토 대상은 아래 고정 SHA이며 문서 복원 후 커밋을 재검토한 것으로 표시하지 않는다.

- 모델: `gpt-6.1-sol`, 추론 `high`, 새 독립 컨텍스트
- PR: https://github.com/f-lab-piz/browser-control-lab/pull/4
- Base: `06887edc8eb3740e5ee7d8159cc0e455d5936955`
- 이전 리뷰 head: `d50339baf50b449d17e3a4474ee8dfab0e540310`
- 이번 리뷰 head: `01ad334d1aa367041692b063722c2fcd106ef7d1`
- 제품 코드·테스트 수정, 원격 리뷰 게시·승인·병합은 수행하지 않았다.

## 발견 사항

### [P2] 인라인 텍스트 노드 사이에 공백을 삽입해 필터 결과가 뒤집힌다

위치: 검토 head의 `extension/page-agent.mjs:27`; 원인은10행의 `value+=' '+node.nodeValue`다.

```html
<div id="row"><span>foo</span><span>bar</span><button>Select row</button></div>
```

위 요소에 `filter({hasText:'foobar'}).count()`와 `filter({hasNotText:'foobar'}).count()`를 실행한다.

- 기대: 독립 DOM 판독의 textContent와 innerText가 모두 `foobarSelect row`이므로 각각 **1 / 0**.
- 실제 head: **0 / 1**. readableText가 각 텍스트 노드 앞에 공백을 넣어 `foo bar Select row`로 바꾼다. 길이 제한을 Infinity로 해제해도 남는 문제다.
- 영향: 인라인 태그로 나뉜 문자열을 가진 행·카드를 찾지 못하며, hasNotText가 제외해야 할 요소를 남겨 후속 작업 후보를 잘못 좁힐 수 있다.
- PR 관계: 전체 PR에서 도입된 hasText 회귀다. 정확한 base는 el.textContent를 검색해 동일 확장 경로에서1을 반환했다. 이전 리뷰 이후의 추가 커밋이 새로 도입한 문제라는 뜻은 아니다. hasNotText는 이번 PR 신규 지원의 오류다. base가 해당 옵션을 무시하므로 base 결과1을 지원 증거로 쓰지 않는다.
- 증거: `filter-head.log`, `filter-head/boundary-results.json`의 adjacent-filter와 oracle; `filter-base.log`, `filter-base/boundary-results.json`의 base 대조. 스크립트는 `filter-head.mjs`, `filter-base.mjs`다.
- 같은 스크립트의 aria-hidden 텍스트 차이는 계약 판단을 확정하지 않아 별도 발견으로 계산하지 않았다.

## 이전 P2 3건의 판정

| 항목 | 독립 재확인 | 판정 |
|---|---|---|
|600자 뒤 필터 누락|원재현700자 뒤 needle의1/0, 긴 slot·정규식 suffix 확인|해결. 새 인라인 경계 문제와 구분|
|closed details summary Shadow 버튼|역할 count1·제품 클릭 완료·clicked DOM 변경, 본문 일반/Shadow 버튼은 숨김 유지|해결|
|스크롤 후 viewport clip|scrollY671에서 실제 파랑 확인, 추가 세로/가로 및 nonzero x/y clip 픽셀 확인|해결|

작성자의 PASS 주장에 의존하지 않고 원래 재현과 새 회귀를 직접 실행했다.

## 검증

환경: macOS arm64, Node v25.2.1, Chrome for Testing145.0.7632.6. 제품 입력은 HTTP→확장→QuickJS→브라우저 경로이며 Playwright는 기동·독립 관찰에 사용했다. 판정기에 성공을 주입하지 않았다.

| 실행 | 결과 | 보존된 증거 |
|---|---|---|
|npm test|종료0,7 PASS|unit.log|
|node output/sol-rereview/boundary-repro.mjs|종료0, 이전3건 해소|boundary.log, boundary-results.json, PNG2개|
|node --test output/sol-rereview/review-boundaries.test.mjs|종료0,5 PASS|review-boundaries.log, review-fixes/|
|node output/sol-rereview/filter-head.mjs|종료0, 새 문제0/1 재현|filter-head.log, filter-head/|
|node output/sol-rereview/filter-base.mjs|종료0, base hasText1|filter-base.log, filter-base/|
|AUDIT_EXTRA=1 PRODUCT_REVISION=01ad334d1aa367041692b063722c2fcd106ef7d1 node output/sol-rereview/audit-tools.mjs|종료0,36 PASS|audit.log, tool-audit/results.json|
|node --test output/sol-rereview/runtime-e2e.test.mjs|종료0,24 PASS /1 SKIP|runtime.log, runtime-e2e/results.json|
|git diff --check 06887edc8eb3740e5ee7d8159cc0e455d5936955..HEAD|종료0|리뷰 당시 직접 실행|

커스텀 재현의 종료0은 측정기의 완료이며 제품 PASS가 아니다. 실제/기대 차이는 결과 JSON에 보존했다. 원래 결과를 덮어쓰지 않기 위해 하니스를 ignored sol-rereview 폴더로 복사하고 import·출력 경로만 조정했다. 원본 assertion은 변경하지 않았다.

검토 범위는 이전 head→이번 head 증분과 정확한 base→head의 제품 엔진·파일·API 및 연결 테스트·fixture·문서다.

## 미실행 및 환경 차단

- EXTERNAL_SITE=1을 설정하지 않아 Naver1건 SKIP. 회사 사이트, 다른 브라우저와 Chrome 버전은 미검증이다.
- test:fixtures, test:audit-fixture, test:bootstrap, test:all 자체는 이번 재리뷰에서 실행하지 않았다. 이전 실행을 이번 head 실행으로 계산하지 않는다.
- Codex/Aside 비교는 재실행하지 않았고, 저장된 비교를 현재 도구의 재측정으로 보지 않는다.
- 시작 여유 약436MiB, 테스트 완료 시 약428MiB였다. 테스트는 순차 실행하고 임시 브라우저·프로필을 정리했다. 테스트 자체는 공간 때문에 차단되지 않았다.
- 최종 보고서 저장만 ENOSPC로 실패했다. 셸 here-document, Node 쓰기, apply_patch가 실패했으며 결과 로그는 이미 저장되어 있었다. 이번 리뷰의 base-source 복사본 약84KiB만 정리했다.
- base 대조를 다시 실행하려면 아래 정확한 base의 extension과 빌드 스크립트를 `output/sol-rereview/base-source/`로 복원해야 한다.

```sh
git archive 06887edc8eb3740e5ee7d8159cc0e455d5936955 extension scripts/build-extension.mjs
```

## 남은 위험과 결론

36개 진단과5개 경계 회귀가 모두 통과해도 인접 인라인 노드 필터의 의미를 보장하지 않는다. 이번에 재현한 P2는 테스트 공백이다. 이전 단발 calendar missing은 이번 runtime1회에서는 재현되지 않았으며 원인 규명·장기 안정성 입증은 하지 않았다.

전체 AX 표준, 닫힌 Shadow DOM, 회전/기울임/음수 scale/3D 프레임, target 간 드래그, trusted 필수 외부 file/MIME drop, 모든 배율·모바일 visual viewport·애니메이션은 추가 입증하지 않았다.

검토 시작·종료의 HEAD와 tracked 작업 트리는 일치하고 clean이었다. 리뷰어는 원격 head를 재조회하지 않았으므로 위 고정 SHA에 대한 판정이다.

**CHANGES_REQUESTED** — 이전3건은 해결되었지만 실제 base/head 대조로 확인한 P2 필터 회귀1건이 남아 있다. 해당 P2는 이번 문서 복원 작업에서 수정하지 않았다.
