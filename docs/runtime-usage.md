# 로컬 실행과 HTTP 호출

중계기는 한 사람이 로컬에서 사용하는 전송 프로그램이다. 대화별 세션은 JS 상태와 탭·파일 작업을 구분하며 사용자 계정 체계를 만들지 않는다. 클라이언트 토큰은 본인의 모든 세션을 관리하는 로컬 자격이고, 확장 토큰은 중계기와 확장 사이의 연결에 사용한다.

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
- `POST /v1/sessions/:id/js`: `{code,timeoutMs?,requestId?}`. 접수 결과의 requestId로 `POST /v1/requests`의 `{requestId}` 본문으로 조회.
- `POST /v1/sessions/:id/reset`: 진행 요청 취소, 변수 초기화. 이미 발생한 브라우저 변경은 되돌리지 않는다.
- `POST /v1/assets?sessionId=…&name=…&mimeType=…`: 파일 바이트 업로드, 반환된 id를 `setFiles({fileId:id})`에 전달.
- `GET /v1/assets/:id?sessionId=…`: 저장된 바이트 읽기.

모든 클라이언트 경로에 `Authorization: Bearer <client token>`이 필요하다. 중계기는 loopback에만 바인딩한다. 한 사람이 자신의 로컬 브라우저와 여러 대화를 연결하는 전송 프로그램이다.

JS의 마지막 값은 자동 출력되지 않는다. `console.log(value)`로 텍스트를, `display(await page.screenshot({fullPage:true}))`로 이미지를 반환한다. 0.2.0부터 한 세션의 top-level var/let/const 선언은 원래 종류와 함께 다음 호출에 유지된다. let/const 재선언과 var↔lexical 이름 충돌은 그 요청의 앞선 코드도 실행하기 전에 오류다. var 재선언과 let 대입은 허용하고 const 대입은 오류다. 수정하려는 값은 처음에 let으로 선언하고 이후에는 이름에 대입한다. 선언 종류를 전역 속성으로 바꾸던0.1.x 동작과 다르다. reset이나 실행 제한으로 런타임이 재생성되면 다시 선언한다.

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


## 요청 재전송과 안내 조회

- `requestId`는 생략하거나 비어 있지 않은 JavaScript 문자열을 준다. 한글·예약문자·`.`/`..`·NUL·UTF-16 surrogate도 JSON escape를 통해 ID 데이터로 왕복한다. `POST /v1/requests`에 `{requestId}`를 보내는 방식이 기본이며 client.wait도 이 방식을 쓴다. 접수 가능한 본문 범위 안에서 조회 본문은 원래 접수보다 작으므로 URL/header 길이 한도에 의존하지 않는다. 짧은 ID의 GET query/인코딩 경로 조회도 호환 제공한다. 같은 세션의 operation/code/effective timeout이 같은 재전송은 기존 상태/결과를 반환하고 다시 실행하지 않는다. timeoutMs 생략은30000과 같다. 다른 payload/operation/세션은409/REQUEST_ID_CONFLICT다. reset 이후에도 기록은 중계기 프로세스 동안 유지한다. 연결이 끊겨도 기존 요청 조회는 가능하고 신규 JS는503이다. 프로세스 재시작 뒤 복구·업무 취소는 보장하지 않는다. 원문 ID는 실행의 식별 데이터로만 쓰고 VM 진단 파일명은 짧은 순번을 사용한다.
- 외부 js의 timeoutMs는50..120000 범위의 정수 number(ms), 기본30000이다. 문자열·boolean·null·소수·범위 밖 값은 접수 전에 거절한다. code는 UTF-8 기준64KiB까지이며 HTTP 조각 사이에 걸친 한글도 원문으로 전달한다.
- guide는 현재 package version, 외부3개·내부64개, 실행 위치, 명시 출력 방법과 기존 기본 검증의 범위를 알려준다. `?api=js`, `?api=scope.snapshot`처럼 정확한 이름을 조회할 수 있고 없는 이름은 HTTP404/UNKNOWN_API다. 카탈로그의 기존 status는 새 요구사항 전체 충족을 뜻하지 않는다.

## 출력과 실행 한도

- JS timeout은 기본30000ms, 허용50..120000ms이며 code는64KiB UTF-8다. 세션 VM은64MiB, stack은512KiB다. 호스트 WebAssembly 물리 스택 초과는 RESOURCE_LIMIT(reason stack), runtimeReset:true로 보고하고 다음 요청은 새 generation에서 실행한다. guest 예외의 이름/문구는 사용자가 만들 수 있으므로 메모리 고갈 여부나 VM 재생성의 근거로 삼지 않는다. 실제 메모리 한도의 guest InternalError도 JS_ERROR·guestName으로 보고하며 VM이 유지되면 runtimeReset:false다. 일반 예외는 값과 세대를 보존하며, 필요하면 명시 reset으로 메모리를 회수한다.
- console.log의 순서·NUL·Unicode 문자열을 보존한다. 객체는 JSON 형태로, 순환 연결은 [Circular]로 표시한다. 텍스트는 요청 합64KiB UTF-8이며 코드포인트 중간을 자르지 않는다.
- display는 `{type:'image',mimeType:'image/png',data:base64}`만 지원하고 JS 반환값은 undefined다. MIME/base64/PNG 구조·CRC·Adam7 각 pass의 정확한 scanline·압축 데이터/ICC·텍스트 메타데이터가 잘못되면 동기 입력 오류다. PNG 디코딩 작업 공간은64MiB 범위로 제한하며 초과는 명시적인 IMAGE_RESOURCE_LIMIT다. 정상 이미지도 이 환경의 VM/디코딩 실패를 숨기지 않는다.
- 이미지 한 장4MiB/요청 합8MiB/최대4장이다. 기준은 base64 글자 수가 아니라 디코딩한 PNG **파일 bytes**다. 텍스트와 별도로 계산하며 텍스트·이미지 합256블록이다.
- 유효 이미지가 출력 한도를 넘으면 전체 이미지를 생략하고 실행을 계속한다. 부분 base64를 반환하지 않는다. 결과의 truncated와 truncationReasons(text-bytes/blocks/image-bytes/image-total-bytes/image-count 등)를 확인한다. 이후 로그는 남은 텍스트/블록 예산 안에서 보존된다.
- 전체 결과 JSON은16MiB UTF-8 이내이며 상관 ID가 든 전송 envelope는 별도다. 초과는 RESULT_LIMIT로 명시한다. metrics.outputBytes는 텍스트 UTF-8 bytes, imageBytes는 원본 이미지 파일 bytes다. 기존 outputChars는 호환용 bytes 카운터이며 글자 수가 아니다.
