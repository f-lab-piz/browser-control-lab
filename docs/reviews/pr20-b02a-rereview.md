# PR20 B02A 독립 재리뷰2차

- gpt-6.1-sol/high/fork_turns:none, 읽기 전용. 원격 게시·승인·머지 없음.
- base0452cbe2474ed73069167c43d683ae1514c4f29c → headbf91d5615d82af9f0e1f2ab9923de17f105d2718.
- 시작/종료 local/remote head 일치, tracked clean. **CHANGES_REQUESTED**, 기존 P2 1건. 첫 리뷰2건은 수정 확인.

## P2: document CSS :scope를 후보 자신에 재결합

검토 당시 page-agent.mjs:51은 후보별 Element.matches를 사용했다. 정상 HTML에서 제품 :scope는 HTML1 대신10후보, :scope > body는0/단일읽기 ELEMENT_NOT_FOUND였다. Native document.querySelectorAll은 각각HTML1/body1이었다. REQ-SCOPE-LOCATOR-001/C01 document CSS 의미 위반이며 정확base소유2파일 통제에서도6후보/0으로 재현된 기존오류다. 문서전체열거확장으로후보수가늘었지만핵심원인을새로도입했다고주장하지않았다.

## 직접 검증

전체130 PASS/FAIL0/외부1 SKIP(unit42·fixture12·bootstrap1·기존제품24·요구제품44·경계7), 이후단독headed44 PASS. 구조검증2종·Python6·diff-check PASS. B02A31개/B01E24개아티팩트hash와Before3/9→After12/0·소스fingerprint가일치했다. 독립HTTP→확장→QuickJS probe와정확base2파일통제, native읽기전용판독으로재현했다.

신규Codex/Aside실측·외부/회사사이트는실행하지않았다. 전체185REQ·후속slice·과거PR18프레임오류해결을판정하지않았다. 첫비활성composed후손/html-head지적2건은수정/회귀확인했으며추가P0/P1/P3없음이다.

메인은지적을수용해document/ShadowRoot별native루트조회로고치고 :scope/:scope > head/:scope > body/:is조합과main/child루트단일읽기를공개제품·native검증에추가했다. 새head검증/재리뷰는별도기록한다. 원본보고서·head/base probe는manifest에보존한다.
