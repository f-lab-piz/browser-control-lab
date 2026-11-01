# Architecture

## Product boundary
외부 도구 guide/reset/js, JS 내부 API64종을 제공하는 자체 Chrome 확장 프로젝트다. 현재 상태는 docs/status.md를 따른다.

```text
에이전트/검증 스크립트
 → HTTP 중계기 (전송·인증·요청 상관관계)
 → 확장 service worker (브라우저 연결·권한·CDP 세션)
 → 확장 offscreen document + 실행 Worker (JS 런타임·변수)
 → 자체 Page/Frame/Locator/스냅샷·입력·파일 계층
 → Chrome debugger/CDP/확장 API
```

중계기는 에이전트용 MCP 등록 없이도 검증할 수 있게 HTTP 계약을 제공한다. 에이전트 코드를 Node에서 실행하거나 Playwright로 제품 조작을 대체하지 않는다. QuickJS 등 범용 엔진의 브라우저 빌드를 사용할 수 있으나 Aside의 실행 코드·번들·WASM은 가져오지 않는다. 엔진 버전·라이선스·패키지 출처를 기록한다.

중계기는 개인용 로컬 전송 프로그램이다. 하나의 클라이언트 토큰이 본인의 여러 대화 세션을 관리하며 다중 사용자 계정 서비스를 제공하지 않는다. JS 평가·브라우저 조작은 확장이 담당한다.

## HTTP contract
실제 실행 예제와 현재 지원 범위는 runtime-usage.md를 따른다.
- POST /v1/sessions: 격리 세션 생성. sessionId 및 generation 반환.
- GET /v1/guide?api=...: API 사용법 조회.
- POST /v1/sessions/:id/js: {requestId,code,timeoutMs}; 실행은 확장에서 수행.
- POST /v1/sessions/:id/reset: 실행·변수·참조 초기화. 이미 수행된 페이지 작업은 되돌리지 않는다.
- POST /v1/requests: {requestId} 본문으로 상태·출력·오류 조회. ID를 URL 길이에 종속시키지 않는다. 짧은 ID의 GET query와 기존 /v1/requests/:id는 호환 경로다. HTTP 완료와 브라우저 업무 성공은 다르다.

요청 조회 응답은 {requestId,sessionId,generation,status,result:{content:[text|image],error?,metrics?}} 구조를 사용한다. 세션과 요청 식별자를 혼동하지 않는다. 로컬 인증 토큰과 출력 파일은 Git에 넣지 않는다. 연결 재시도 시 비멱등 클릭·제출·업로드를 자동 재실행하지 않는다.

## Runtime lifecycle
MV3 service worker 종료에 내성이 필요하다. JS 상태를 서비스 워커 전역 변수에만 두지 않는다. offscreen document의 Worker에 런타임을 두는 후보를 최소 실험으로 검증한다. 무한 반복은 deadline/메모리 제한과 worker 종료로 해제한다. reset과 예기치 않은 재시작은 generation 변경으로 알리고 stale 핸들을 사용하지 않는다.

## Browser contexts
탭→프레임→CDP 세션→실행 컨텍스트를 명시적으로 관리한다. 교차 출처 iframe을 상위 페이지 JS로 읽는 방식에 의존하지 않는다. 같은 프로세스 frame과 OOPIF의 연결을 별도로 추적한다. DOM 교체나 navigation 이후 예전 ref를 임의의 유사 요소에 연결하지 않는다.

## Files
로컬 경로는 브라우저 PC 기준이다. 서버·Pod 파일은 바이트/파일 참조로 전달한다. locator.setFiles와 chooser.setFiles는 같은 엔진을 쓴다. 바이너리 전송을 모델 텍스트 로그와 분리한다. local file path 접근 범위, POST/인증/blob 다운로드의 바이트 획득, 서버 export 경로는 실제 구현·검증이 필요하다.
