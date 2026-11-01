# 인접 인라인 텍스트 필터 회귀 수정

기준: 재리뷰가 지적한 `01ad334`의 P2 1건. 재리뷰 보고서를 저장한 문서 커밋 `6bae21c`에서도 제품 소스는 동일했다.

## Before / After

```html
<div id="row"><span>foo</span><span>bar</span><button>Select row</button></div>
```

독립 DOM의 textContent/innerText는 `foobarSelect row`인데, 기존 필터는 노드마다 공백을 넣어 `foo bar Select row`를 검색했다. 그 결과 `hasText:'foobar'`는0, `hasNotText:'foobar'`는1이었다.

수정 후 필터의 composed 텍스트 추출은 노드의 실제 텍스트를 이어 붙이고 실제 존재하는 공백만 정규화한다. 결과는 **1 / 0**이다. 스냅샷·접근 이름의 기존 요약/분리 방식과 길이 제한은 변경하지 않는다. 인접 텍스트 수정과 이전 긴 텍스트 제한 해제를 함께 유지한다.

## 회귀 범위

`npm run test:review-boundaries`에2개를 추가해 총7개다.

- 인접/중첩 inline 노드와2개 slot의 문자열을 hasText/hasNotText·정규식으로 검색한다. Playwright 독립 textContent/innerText를 원문 대조에 쓴다.
- 실제 DOM에 공백이 있는 `foo bar`는 `foobar`와 구분한다.
- 기존 긴 텍스트·label·summary Shadow·세로/가로 스크롤 clip의5건을 유지한다.

제품 호출은 HTTP→확장→QuickJS→브라우저 경로다. 테스트가 성공 값을 주입하거나 Playwright로 제품 입력을 대신하지 않는다. 재리뷰와 검증 결과는 아래 실행 기록으로 구분하며, 과거 CHANGES_REQUESTED 보고서는 해당 SHA의 이력으로 보존한다.

## 검증과 재리뷰

수정 후 테스트 결과를 확인한 뒤 같은 PR #4에 추가 커밋한다. Sol 6.1 high의 새 컨텍스트로 재리뷰하며 판정을 미리 승인으로 표시하지 않는다. Codex/Aside를 이번 작은 후속 수정에서 다시 측정한 것은 아니다. 초기3개 도구 비교는 초기 수정 당시 기록이다.

- headed/headless 경계 회귀: 각각7/7 PASS
- 확장 진단:36/36 PASS
- 기존 복합 업무 회귀:24 PASS, 외부1 SKIP
- 단위·계약:7/7 PASS

위 수치는 수정 구현 측 검증이며 독립 재리뷰 판정을 대체하지 않는다.
