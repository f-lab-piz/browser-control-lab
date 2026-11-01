# Testing

## Three evidence levels

1. **계약·판정기**: API 카탈로그, 이벤트·서버 상태 전이, 잘못된 업무 조건 거부.
2. **테스트 사이트 검증**: Playwright로 실제 fixture를 조작해 사이트 자체가 올바르게 PASS/미완료를 판단하는지 확인. 제품 성능 증거와 분리한다.
3. **제품 확장 E2E**: 별도 Chromium 프로필에 개발 확장을 로드하고 HTTP 중계기를 통해 guide/reset/js 호출. 모든 업무 조작은 확장이 수행한다. Playwright는 기동·설치·독립 결과 판독·아티팩트에만 사용한다.

이후 네이버 등 외부 사이트를 읽기 기반으로 별도 검증한다. 회사 사이트는 실제 접근할 수 있는 환경에서만 통과 여부를 기록한다.

## 실행 명령

- `npm test`: 판정기/카탈로그/중계기 검증 7개.
- `npm run test:fixtures`: 실제 브라우저의 테스트 사이트 동작 검증 7개.
- `npm run test:bootstrap`: 임시 개발 확장 로드 및 HTTP 왕복 실험 1개.
- `npm run test:all`: 기본 단위·fixture·probe·제품 runtime 회귀를 순서대로 실행. 새 경계 진단은 test:audit으로 별도 실행.

임시 확장 bootstrap은 브라우저 API 조회만 수행하며, 구현되지 않은 제품 런타임/HTTP 계약을 통과한 것으로 표시하지 않는다. 보고서 grade를 `extension-transport-probe`로 구분한다.

## Existing fixture scenarios

| Scenario | Complexity | Objective pass condition |
|---|---|---|
| basic | 입력·체크·제출, 알림·팝업 | 이름 테스터 및 체크 후 제출 |
| mail | 메인→portal→mail 중첩 iframe, 내부 스크롤, 지연 추가 로딩 | 실제 로딩 범위 안의 메일137을 열고 읽음 처리 |
| booking | 내부 가로스크롤, 8×24 격자, 포인터 드래그, 더블클릭, 예약 dialog | 회의실C 13–15시 선택 후 설계 회의/4명으로 저장 |
| dropdown | 총600항목, DOM에는14개만 생성, 내부 스크롤 | 스크롤하여 생성된 부서230 선택 |
| large | 링크3200개, 긴 추적 URL, 화면 밖 DOM | 정산 내역2761 확인 |
| files | 기본 file input·다중선택·드롭 영역·다운로드 | 업로드 바이트 SHA256 검증 후 결과 발행; 하니스가 실제 내려받은 바이트도 확인 |
| dynamic | open Shadow DOM, 같은 이름 요소 교체 | 교체 뒤 현재 세대의 요소 조작 |

run마다 id, task, events, accepted, 서버 상태와 PASS가 분리된다. UI의 PASS 텍스트만 바꾸면 통과하는 판정은 금지한다. 서버 판정은 결정적 업무 조건을 검증한다. 이것은 공격 방어용 원격 증명은 아니므로 테스트가 내부 판정 API를 직접 호출하면 제품 동작 증거로 인정하지 않는다.

`?cross=1`과 테스트 런처 host-resolver를 사용하면 app.test→portal.test→mail.test/calendar.test로 서로 다른 사이트의 iframe을 구성한다. 포트만 다르다고 OOPIF를 검증했다고 주장하지 않는다. 제품 E2E에서 실제 CDP Target/세션 정보도 기록한다.

## Additional required fixtures before full implementation acceptance

- 동일 이름 요소 여러 개, 렌더링 중 교체·navigation·frame detach.
- 중첩 Shadow DOM, 닫힌 Shadow DOM 지원/실패 경계.
- 오버레이·sticky header·가려진 요소·disabled→enabled·지연 비동기 완료.
- 실제 HTML drag/drop, 파일/텍스트 MIME DataTransfer, 내부·외부 스크롤 경합.
- popup→새 탭 연결, alert/confirm/prompt, URL 변경·load·조건 대기 실패.
- 로그인 쿠키 기반 GET, POST 생성, blob 다운로드, 서버 파일 전달 후 iframe 업로드, 다중 파일·용량 제한·실패·취소.
- JS 변수 유지, 로그·이미지 출력, 무한 반복 reset, 시간초과·메모리·출력 예산, 확장 재시작·브리지 재연결.
- viewport/full-page/내부 컨테이너 캡처 차이, 긴URL 축약·원문속성 접근, snapshot 부분검색·diff·예산초과 후속조회.

## API matrix
64 API 각각을 docs/api-catalog.json에 유지한다. API 단위 smoke와 복잡 시나리오 연결, 실제 HTTP→확장 증거 파일을 각각 기록한다. catalog의 verified-basic은 실제 확장 경로에서 기본 호출을 검증했다는 뜻이다. partial은 기본 검증 외에 명시한 미지원 조건이 남아 있다. fixture 단독 PASS를 제품 API 증거로 쓰지 않는다.

## External-site validation
네이버에서 삼성전자 검색 결과를 대상으로 주요 영역 파악·결과 선택·뒤로가기와 스냅샷 크기를 측정한다. 결과 순위나 특정 문구를 고정하지 않고 작업 목표와 관찰 범위를 기록한다. 원문 전체를 불필요하게 로그로 저장하지 않는다. 사이트별 helper 없이 공통 API로 수행한다.

## Reports
각 run의 브라우저/OS/엔진버전, seed, 요청/이벤트 trace, 상태·실패 이유, snapshot 글자/UTF8바이트/ref/프레임 수·제한/생략, 지연시간, 스크린샷을 output/에 남긴다. 허용된 관찰 예산 안에서 목표 작업 성공률과 실패 복구를 같이 평가한다. 실패 케이스를 빼고 성공률을 계산하지 않는다.

## 제품 실행 명령

```sh
npm run test:runtime
HEADED=1 EXTERNAL_SITE=1 npm run test:runtime
```

TEST_CHROME으로 실행 파일을 지정한다. 별도 임시 프로필·중계기·확장을 만들고 시험 종료 시 지운다. 실제 입력은 HTTP 경로로만 수행한다. Playwright 대화상자 자동 닫기가 제품 검증을 방해하지 않도록 수동 처리 리스너를 설치하며 실제 accept/dismiss는 제품 API가 수행한다. DOM 준비와 비동기 업무 화면 준비는 구별해 대상 요소를 기다린다.
결과는 output/runtime-e2e/results.json, 실제 네이버 관찰은 external.json, 캡처는 viewport.png다. 네이버 시험은 EXTERNAL_SITE=1일 때만 실행하며 환경 차단은 SKIP/blocked로 기록한다.

## 수정 전 경계 진단

`npm run test:audit`: `/audit`의31개 요구 조건을 현재 확장 경로로 검사. FAIL을 제외하지 않고 JSON에 보존하며 명령도 종료 코드1을 반환한다.
`npm run test:audit-fixture`: 독립 Playwright로 fixture의 DnD/slot/disabled/readonly/변형 frame/clip과 서버 판정을 확인한다.
전체64 API는 api-test-matrix.json에서 기본 호출과 경계 진단을 구분한다. 동결 평가에서는 extension/bridge/빌드 엔진의 해시를 기준 커밋과 비교한다.

## 독립 리뷰 발견 사항의 회귀

`npm run test:review-boundaries`는 긴 텍스트 필터, label, closed details summary의 Shadow DOM, 스크롤 후 clip의 실제 내용까지5개를 검증한다. fixture는 review-boundaries.html이다. 독립 PNG 픽셀 검사로 위치 오류를 검출한다. HEAD/리뷰 범위와 결과는 docs/review-round2.md를 따른다.
