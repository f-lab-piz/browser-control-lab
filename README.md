# Browser Control Lab

직접 구현하는 브라우저 제어 확장과 검증 사이트 프로젝트입니다. Aside/Codex의 방향성을 참고하되 원본 실행 코드·번들·제품 WASM을 복사하지 않습니다.

## 현재 상태

프로젝트 기반·개발 문서·테스트 사이트를 준비한 단계입니다. 제품 확장·HTTP 중계기·JS 런타임과 내부64 API는 아직 구현하지 않았습니다. [상태](docs/status.md)를 기준으로 진행합니다.

## 도구

외부 MCP 도구는 **guide / reset / js 세 개**입니다. JS 실행은 확장 내부에서 수행하고 외부 중계기는 통신을 담당합니다. 내부 API **64종**은 아래와 같습니다. Page/Frame 공통 메서드·옵션·이벤트 이름은 중복 계산하지 않습니다.

| 분류 | API |
|---|---|
| 브라우저·탭 — 6종 | `browser.list()`, `browser.tabs()`, `browser.open()`, `browser.attach()`, `page.activate()`, `page.close()` |
| 페이지 이동 — 4종 | `page.goto()`, `page.back()`, `page.forward()`, `page.reload()` |
| 화면·프레임 — 4종 | `scope.snapshot()`, `page.screenshot()`, `page.frames()`, `page.frame()` |
| 요소 선택 — 6종 | `scope.locator()`, `scope.getByRole()`, `scope.getByText()`, `scope.getByLabel()`, `locator.filter()`, `locator.nth()` |
| 요소 조사 — 9종 | `locator.count()`, `locator.textContent()`, `locator.getAttribute()`, `locator.inputValue()`, `locator.isVisible()`, `locator.isEnabled()`, `locator.isEditable()`, `locator.isChecked()`, `locator.boundingBox()` |
| 요소 조작 — 10종 | `locator.click()`, `locator.fill()`, `locator.press()`, `locator.hover()`, `locator.focus()`, `locator.scrollIntoView()`, `locator.setChecked()`, `locator.selectOption()`, `locator.dragTo()`, `locator.drop()` |
| 마우스·키보드 — 9종 | `mouse.move()`, `mouse.down()`, `mouse.up()`, `mouse.click()`, `mouse.wheel()`, `keyboard.down()`, `keyboard.up()`, `keyboard.press()`, `keyboard.type()` |
| 대기·이벤트 — 5종 | `locator.waitFor()`, `page.waitForEvent()`, `page.waitForURL()`, `page.waitForFunction()`, `page.waitForLoadState()` |
| 파일 — 4종 | `locator.setFiles()`, `chooser.setFiles()`, `download.save()`, `download.cancel()` |
| 대화상자 — 2종 | `dialog.accept()`, `dialog.dismiss()` |
| JavaScript 조사 — 2종 | `scope.evaluate()`, `locator.evaluateAll()` |
| 진단·출력 — 3종 | `page.logs()`, `console.log()`, `display()` |

상세 동작·집계 기준은 [툴 명세](docs/toolset.md), 기계 판독 목록은 [카탈로그](docs/api-catalog.json)를 참고합니다.

## 테스트 사이트 실행

```sh
npm ci
npm run site
```

기본 주소: http://127.0.0.1:8787 . 다른 포트는 `PORT=8790 npm run site`로 지정합니다. 사이트마다 run ID와 서버 판정 결과를 보여줍니다.

```sh
npm test
npm run test:fixtures
npm run test:bootstrap
HEADED=1 npm run test:fixtures
```

브라우저가 없으면 `npx playwright install chromium`을 실행하거나 `TEST_CHROME`에 확장 로드가 가능한 Chrome for Testing 실행 파일을 지정합니다. fixture UI 테스트는 테스트 사이트의 작동 검증이며 제품 확장의 통과 증거가 아닙니다.

## 테스트 범위

- 메인→portal→메일의 중첩 iframe, 메일함 내부 스크롤과 추가 로딩
- 회의실 격자 드래그→더블클릭→예약 폼 확정
- 가상화된 긴 선택 목록 내부 스크롤
- 큰 문서·긴 URL·화면 밖 요소
- 파일 내용 검증과 실제 다운로드, Shadow DOM·동적 요소 교체

제품 E2E는 별도 Chrome 프로필에 확장을 로드하고 **HTTP → 확장 → 내부 런타임 → 브라우저** 경로로 수행할 예정입니다. 외부 Playwright가 제품 클릭을 대신해서 성공했다고 기록하지 않습니다.

## 확인한 초기 결과

- 계약·판정기 5개 통과.
- 실제 Chrome에서 fixture 시나리오 7개 통과.
- 개발 모드 임시 확장 로드 및 HTTP 명령 왕복 실험 1개 통과.
- 프로젝트 스킬 검증 통과.

이는 제품 64 API의 구현·통과를 의미하지 않습니다. 결과는 `output/`에 생성하며 Git에서 제외합니다.

## 개발 문서와 스킬

- [아키텍처·HTTP 계약](docs/architecture.md)
- [스냅샷 전략](docs/snapshot-strategy.md)
- [검증 등급·복잡 시나리오·성공 판정](docs/testing.md)
- [개발·검증 스킬](.agents/skills/browser-control-development/SKILL.md) — 프로젝트 AGENTS.md에서 로드

개발은 API 계약→단위 검증→기본 fixture→복잡 fixture→제품 확장 E2E→외부 사이트 검증 순으로 진행합니다. GitHub 원격 저장소는 아직 연결하지 않았습니다.
