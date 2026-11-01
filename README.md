# Browser Control Lab

직접 구현하는 브라우저 제어 확장과 검증 사이트 프로젝트입니다. Aside/Codex의 방향성을 참고하되 원본 실행 코드·번들·제품 WASM을 복사하지 않습니다.

## 현재 상태

개발 확장·HTTP 중계기·확장 내부 QuickJS WASM 실행기와 내부64 API의 기본 호출을 구현했습니다. 복잡한 iframe 업무와 파일 전송을 실제 확장 경로로 검증했습니다. 일부 고급 옵션과 상용 배포 조건은 남아 있습니다. [상태](docs/status.md)를 기준으로 진행합니다.

## 도구

외부 도구 계약은 **guide / reset / js 세 개**입니다. JS 실행은 확장 내부에서 수행하고 외부 중계기는 통신을 담당합니다. 내부 API **64종**은 아래와 같습니다. 현재 MCP 등록 없이 HTTP로 호출합니다. Page/Frame 공통 메서드·옵션·이벤트 이름은 중복 계산하지 않습니다.

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

제품 E2E는 별도 Chrome 프로필에 확장을 로드하고 **HTTP → 확장 → 내부 런타임 → 브라우저** 경로로 수행합니다. 외부 Playwright가 제품 클릭을 대신해서 성공했다고 기록하지 않습니다.

## 실행과 검증

```sh
npm run bridge
npm run test:runtime
HEADED=1 EXTERNAL_SITE=1 npm run test:runtime
```

브리지 실행 후 출력된 `.local/extension`을 Chrome 개발자 모드에서 로드합니다. 설치·세션·HTTP 호출·파일 전달 예제는 [사용 안내](docs/runtime-usage.md)를 참고합니다. 테스트는 임시 프로필에 확장을 자동 설치하므로 수동 설치가 필요 없습니다.

- 계약·판정기·중계기·프레임 상태 단위와 요구사항별 실제 확장 검증.
- fixture UI 검증 7개, 초기 확장 왕복 probe 1개.
- 기존 제품 확장 복합 회귀와 선택적 실제 네이버 검색 관찰. 요구사항 구현의 최신 수·범위는 [실행 현황](implementation/index.md)과 [상태 문서](docs/status.md)에서 확인합니다.

`verified-basic`은 기본 호출의 실제 검증이며 모든 옵션을 지원한다는 뜻은 아닙니다. 카탈로그의 partial 항목과 사용 안내의 제약을 함께 확인합니다. 결과는 `output/`에 생성하며 Git에서 제외합니다.

## 개발 문서와 스킬

- [순차 구현 계획](docs/implementation-plan.md)
- [의존성·라이선스](docs/third-party.md)
- [아키텍처·HTTP 계약](docs/architecture.md)
- [스냅샷 전략](docs/snapshot-strategy.md)
- [검증 등급·복잡 시나리오·성공 판정](docs/testing.md)
- [개발·검증 스킬](.agents/skills/browser-control-development/SKILL.md) — 프로젝트 AGENTS.md에서 로드

개발은 API 계약→단위 검증→기본 fixture→복잡 fixture→제품 확장 E2E→외부 사이트 검증 순으로 진행합니다. GitHub 원격은 비공개 [browser-control-lab](https://github.com/f-lab-piz/browser-control-lab)입니다.

## 수정 전 진단 평가

`npm run site` 후 `/audit`에서16개 진단 구역을, `/coverage`에서64 API의 테스트 매핑을 확인합니다. `npm run test:audit`은 현 툴의 경계 진단31개를 실행합니다. 초기 수정 전 기록은19 PASS/12 FAIL입니다. 실패가 있으면 종료 코드1을 반환하며, 당시 알려진 미지원 옵션과 거짓 성공의 진단 이력입니다. 이후 수정 결과는 아래 Before/After 보고서와 구분합니다.

- `npm run test:audit-fixture`: 독립 fixture oracle, 제품 성능과 구분
- `node scripts/build-audit-matrix.mjs`: 진단 결과를 반영해64 API 매핑과 정적 coverage 페이지 생성
- [요구사항](docs/development-requirements.md), [평가 계획](docs/evaluation-plan.md), [개선 제안](docs/tool-improvement-report.md)

## 진단 수정 Before/After

진단12건의 수정 결과는 [3개 툴 비교 보고서](docs/fixes-before-after.md)와 [증거 요약 JSON](docs/evidence/diagnostics-before-after.json)에 기록했습니다. 원래 진단은19/31→31/31, 추가 경계 포함36/36, 기존 회귀24/24가 통과했습니다. `AUDIT_EXTRA=1 npm run test:audit`으로 추가 검사를 실행합니다. 평가 전 보고서는 이력으로 보존합니다.

## 요구사항과 다음 개발

[개발 전 명세](docs/requirements/README.md)에 외부3·내부64 API와 공통 계약, 근거·검증계획·독립3회 판단을 정리했다. 이 문서는 다음 개발의 목표이며 현재 지원 기능은 기존 실행 안내/카탈로그를 확인한다. [개발 backlog](docs/requirements/backlog.md)는 요구 ID별 재현·검증·구현 순서를 정한다.
