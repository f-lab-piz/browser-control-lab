# 로컬 실행과 HTTP 호출

Node 22 이상과 확장을 로드할 수 있는 Chrome for Testing이 필요하다.

```sh
npm ci
npm run bridge
```

출력된 `.local/extension` 폴더를 별도 Chrome 프로필의 확장 관리 화면에서 개발자 모드 → 압축 해제된 확장 프로그램 로드로 설치한다. 서비스 워커가 offscreen 문서와 세션별 Worker를 생성하며, 사용자 JS는 이 Worker 안의 QuickJS WASM에서 실행된다.
중계기 주소·제어 토큰은 `.local/client.json`에 저장한다. 확장 토큰은 별도로 생성한다. 두 파일과 프로필은 Git에 넣지 않는다. 중계기 재시작 후에는 확장을 다시 로드한다.

호출 예제는 프로젝트 루트에서 실행한다.

```js
import {readFile} from 'node:fs/promises';
import {bridgeClient} from './bridge/client.mjs';
const config=JSON.parse(await readFile('.local/client.json','utf8'));
const client=bridgeClient(config.url,config.token);
const session=await client.session();
console.log(await client.request('/v1/guide'));
console.log(await client.js(session.id, `
  var page=await browser.open('http://127.0.0.1:8787/');
  console.log(await page.snapshot({maxChars:12000}));
`));
console.log(await client.reset(session.id));
```

외부 도구 계약은 guide/reset/js 세 개다. 현재는 MCP 등록 없이 HTTP로 시험한다. 세션 생성과 파일 바이트 전송은 중계 계층의 관리 경로다.

- `GET /v1/guide`: API 목록과 실행 안내. `?api=scope.snapshot`으로 항목 조회.
- `POST /v1/sessions`: 세션 생성.
- `POST /v1/sessions/:id/js`: `{code,timeoutMs?,requestId?}`. 접수 결과의 requestId로 `GET /v1/requests/:id` 조회.
- `POST /v1/sessions/:id/reset`: 진행 요청 취소, 변수 초기화. 이미 발생한 브라우저 변경은 되돌리지 않는다.
- `POST /v1/assets?sessionId=…&name=…&mimeType=…`: 파일 바이트 업로드, 반환된 id를 `setFiles({fileId:id})`에 전달.
- `GET /v1/assets/:id?sessionId=…`: 저장된 바이트 읽기.

모든 클라이언트 경로에 `Authorization: Bearer <client token>`이 필요하다. 중계기는 loopback에만 바인딩한다. 신뢰한 로컬 개발 환경을 위한 초기 구현이며 다중 사용자 서비스 인증 체계는 아직 없다.

JS의 마지막 값은 자동 출력되지 않는다. `console.log(value)`로 텍스트를, `display(await page.screenshot({fullPage:true}))`로 이미지를 반환한다. 한 세션의 top-level 변수는 다음 호출에 유지된다. reset이나 실행 제한으로 런타임이 재생성되면 다시 선언한다.

이벤트는 조작 전에 대기시킨다.

```js
var pending=page.waitForEvent('download');
await page.getByRole('button',{name:'결과 다운로드',exact:true}).click();
var download=await pending;
console.log(await download.save({target:'server'}));
```

파일은 로컬 경로 문자열, `{fileId}`, `{name,mimeType,bytes}` 또는 `{name,mimeType,base64}` 형식을 사용한다. 로컬 경로는 Chrome이 실행되는 컴퓨터의 경로다. 서버 파일은 먼저 중계기에 올린 뒤 참조한다. 단일 파일 제한은 32 MiB다.

## 현재 제약

Chrome 계열의 debugger/CDP 어댑터만 구현했다. Firefox/Safari, Chrome 웹스토어 배포, 닫힌 Shadow DOM, PDF/캔버스의 의미 분석은 검증하지 않았다. 스냅샷은 현재 DOM을 대상으로 하므로 아직 로드되지 않은 데이터는 내부 스크롤 등으로 불러온 뒤 다시 관찰한다. role/name 계산은 자체 기본 구현이며 전체 접근성 표준과 동등하다고 보장하지 않는다. 이름/텍스트의 정규식(source/flags), visible/hasText/hasNotText 필터, 음수 nth, viewport 좌표 clip을 지원한다. clip은 요청한 CSS 크기의 픽셀 출력으로 정규화한다. screenshot 주석, 전체 접근성 이름 표준, 모든 HTML DnD 호환성은 추가 작업이다.

## 진단 수정 후 계약

- readonly fill은 변경 전에 거절하며, fill 후 실제 값이 요청과 다르면 INPUT_VALUE_NOT_CHANGED를 반환한다. contenteditable도 내용을 확인한다.
- click/hover/drag의 대상은 visible/enabled를 제한 시간 안에 기다린다. 중복·낡은 ref·실제 가림은 명시적으로 거절한다.
- slot으로 배정된 텍스트를 접근 이름에 포함하고 composed ancestry로 히트 대상을 확인한다. 닫힌 details 내부는 기본 snapshot에서 제외하고 showHidden에는 hidden을 표시한다. checked/selected/expanded/readonly/busy 상태를 출력한다.
- 양의 scale·translate iframe 좌표를 변환한다. 회전·기울임·음수 scale·3D 프레임은 명시적 미지원이다.
- draggable 요소의 dragTo는 Chrome의 실제 dragstart를 가로채 native DragData와 dispatchDragEvent로 전달한다. 비 draggable 격자는 기존 포인터 드래그를 유지한다. 서로 다른 target 간 드래그는 미지원이다.
- 로컬 파일 drop은 일시적인 숨은 file input으로 파일을 읽고 기존 파일 전달 엔진으로 처리한다. 임시 요소는 정리한다. 외부 파일/MIME drop 이벤트는 DOM DataTransfer 방식이므로 trusted 이벤트를 필수로 요구하는 사이트는 별도 검증이 필요하다.
- root snapshot은 지정한 프레임 안에서 범위를 좁힌다. 다른 프레임은 page.frames()/page.frame(id)로 명시하여 관찰한다. 기본 전체 snapshot은 모든 현재 프레임을 관찰한다.
