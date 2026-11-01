# 브라우저 제어 툴셋 제안 v3

2026-11-01. 구현 전 API 제안이며, 기존 Aside/Codex API와 동일한 계약이라고 주장하지 않는다.

## 외부 도구: 3개

- `guide(topic?, api?)`: 목록·계약·예제 조회.
- `js(code)`: 확장 내부 JavaScript 런타임 실행 및 명시적 출력 반환.
- `reset()`: 실행 취소·변수·참조 초기화. 탭·로그인 상태는 기본 유지하며 실행된 웹 작업은 되돌리지 않는다.

## 내부 공개 API: 64종

집계는 아래에 명시한 호출 형태별이다. Page/Frame이 재사용하는 scope 메서드는 한 종류로 계산한다. 옵션·객체 속성·이벤트 문자열은 별도 계산하지 않는다. chooser.setFiles는 locator.setFiles와 같은 업로드 엔진을 쓰지만 공개 호출 형태가 달라 두 항목으로 센다. 실제 MCP 등록 도구는 3개다.

### 브라우저·탭 — 6종

연결된 브라우저/프로필 조회, 탭 목록·생성·연결·실제 활성화·닫기.

1. `browser.list()`
2. `browser.tabs()`
3. `browser.open()`
4. `browser.attach()`
5. `page.activate()`
6. `page.close()`

### 페이지 이동 — 4종

주소 이동, 뒤로/앞으로, 새로고침.

7. `page.goto()`
8. `page.back()`
9. `page.forward()`
10. `page.reload()`

### 화면·프레임 — 4종

범위·프레임·검색·차이·출력 예산 옵션의 스냅샷, 캡처, 프레임 지도와 선택.

11. `scope.snapshot()`
12. `page.screenshot()`
13. `page.frames()`
14. `page.frame()`

### 요소 선택 — 6종

CSS/ref/역할/텍스트/레이블로 선택하고 조건 필터와 인덱스로 범위 축소.

15. `scope.locator()`
16. `scope.getByRole()`
17. `scope.getByText()`
18. `scope.getByLabel()`
19. `locator.filter()`
20. `locator.nth()`

### 요소 조사 — 9종

개수, 텍스트, 속성, 입력값, 표시·활성·편집·체크 상태, 좌표 조회.

21. `locator.count()`
22. `locator.textContent()`
23. `locator.getAttribute()`
24. `locator.inputValue()`
25. `locator.isVisible()`
26. `locator.isEnabled()`
27. `locator.isEditable()`
28. `locator.isChecked()`
29. `locator.boundingBox()`

### 요소 조작 — 10종

기본 조작 및 요소 간 드래그와 외부 파일/MIME 데이터 드롭.

30. `locator.click()`
31. `locator.fill()`
32. `locator.press()`
33. `locator.hover()`
34. `locator.focus()`
35. `locator.scrollIntoView()`
36. `locator.setChecked()`
37. `locator.selectOption()`
38. `locator.dragTo()`
39. `locator.drop()`

### 마우스·키보드 — 9종

좌표 기반 마우스와 원시 키 입력. 드래그·단축키 조합의 기반.

40. `mouse.move()`
41. `mouse.down()`
42. `mouse.up()`
43. `mouse.click()`
44. `mouse.wheel()`
45. `keyboard.down()`
46. `keyboard.up()`
47. `keyboard.press()`
48. `keyboard.type()`

### 대기·이벤트 — 5종

요소 상태, download/popup/filechooser/dialog/navigation 등 이벤트, URL, 조건 함수, 로딩 상태 대기.

49. `locator.waitFor()`
50. `page.waitForEvent()`
51. `page.waitForURL()`
52. `page.waitForFunction()`
53. `page.waitForLoadState()`

### 파일 — 4종

경로/바이너리 참조를 같은 업로드 엔진으로 입력 또는 파일 선택창에 지정. 다운로드 저장·취소.

54. `locator.setFiles()`
55. `chooser.setFiles()`
56. `download.save()`
57. `download.cancel()`

### 대화상자 — 2종

alert/confirm/prompt 확인·입력·닫기.

58. `dialog.accept()`
59. `dialog.dismiss()`

### JavaScript 조사 — 2종

페이지/프레임/요소 JS 실행과 동일 프레임의 일치 요소 일괄 평가.

60. `scope.evaluate()`
61. `locator.evaluateAll()`

### 진단·출력 — 3종

사이트 로그 조회와 REPL 텍스트·이미지 출력.

62. `page.logs()`
63. `console.log()`
64. `display()`

## 중복 축소와 공통 계약

- snapshot의 query/root/frame/interactive/maxDepth/maxChars/since/cursor 옵션으로 전체·부분·검색·차이를 처리한다. 검색은 스냅샷 범위에서 수행되며 아직 수집하지 않은 요소를 자동 발견한다고 가정하지 않는다.
- click의 button/clickCount/modifiers 옵션으로 우클릭·더블클릭을 지원하고, setChecked(boolean)로 체크·해제를 통합한다.
- waitForEvent의 download/popup/filechooser/dialog/navigation 이벤트를 사용한다. waitForDownload/waitForPopup은 추가하지 않는다. 이벤트별 반환 객체는 Guide에 구분해 문서화한다.
- waitForLoadState는 문서 준비 상태다. 업무 처리 완료는 대상 요소·URL·조건 대기로 확인한다.
- getByRole/getByText/getByLabel 및 scope.locator는 같은 요소 선택 엔진을 공유한다. 의미 기반 선택을 위해 제공하며 $, $$, findElement 등 별칭은 추가하지 않는다.
- locator.dragTo는 요소 간 드래그와 HTML 드래그 이벤트를, locator.drop은 외부 파일/데이터 전달을 처리한다. 단순 마우스 이동만으로 모든 HTML DnD를 대체하지 않는다.
- locator.setFiles는 로컬 경로·전달받은 바이너리/파일 참조·다중 파일을 같은 API에서 처리한다. 서버 스테이징/분할 전송/임시 정리는 내부 계층이다. 파일 드롭도 같은 파일 입력 해석기를 사용한다.
- download.save(destination)는 완료 확인 뒤 지원되는 로컬 또는 서버/Pod 목적지로 전달한다. 로컬 디스크·일반 HTTP·인증·POST·blob 파일별 실제 전송 경로와 지원 제약을 검증해야 한다.
- screenshot은 영역·전체·요소 참조·주석 옵션을 지원하고 별도 annotatedScreenshot/elementScreenshot API는 늘리지 않는다.
- evaluate는 REPL과 별개인 페이지 컨텍스트에서 실행되며 인자를 명시적으로 전달한다. 기본 입력은 실제 브라우저 입력 엔진을 사용한다.
- console.log는 모델용 출력, page.logs는 사이트 자체 콘솔·오류 조회다. 이미지 출력은 display를 사용한다. 큰 바이너리는 모델 로그에 풀어 쓰지 않는다.

## 상용화 구현 기준

프레임/별도 프로세스 세션 추적, 접근 가능한 Shadow DOM, 가상 스크롤, stale ref 감지, 다중 매칭 오류, 입력 actionability, 타임아웃·취소·자원 제한, 브라우저별 어댑터와 연결 복구를 검증한다. 이들은 추가 도구가 아니라 엔진의 동작 계약이다. 모든 브라우저·사이트를 무조건 지원한다고 약속하지 않고 검증한 브라우저·버전·제약을 명시한다.
