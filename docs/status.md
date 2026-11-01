현재 실행 범위는 사용자 요청에 따라 6단계 B02A까지다. 전체21단계 Goal은 중단되어 있고 7단계 이후는 착수하지 않는다. 최종 라벨 경계 수정 후 전체132 PASS/외부1 SKIP·단독 창 모드45 PASS이며 정확 새head 독립 리뷰/머지 전이다.

아래는 단계별 이전 기록이다. 최신 최종 검증은 [B02A 보고서](implementation/b02a.md)와 [manifest](evidence/b02a/manifest.json)를 따른다.

이전 진행: B01E PR18은 정확70ba037 독립 PASS 후0452cbe로 머지됐다(5부모/7조건, 전체114 PASS/외부1 SKIP·단독 창 모드32 PASS). B02A 이슈19는 검색/이름13부모/21조건을 국소 제품 검증했고 Before3/12→After12/12, 전체130 PASS/외부1 SKIP·단독 창 모드44 PASS다. 첫 리뷰의 기존 P2 두 건을 수정했고 정확 새head 재리뷰 전이며 [보고서](implementation/b02a.md)를 따른다. 과거 headed 프레임조회 실패는 B03A에서 계속 추적한다.

# 현재 상태

최신 구현 진행:문서 PR #6·계획 PR #8 머지 후 B01A를 구현했다. 해당6 REQ/9조건은 국소 제품 검증을 통과했으나 PR#10 리뷰의 긴 ID와 프레임 회귀를 보완해 전체64 PASS/외부1 SKIP다. Sol6.1 high 독립 재리뷰 PASS 후 PR#10이367a5d2로 머지됐다. B01B(이슈#11)는 네이티브 lexical 실행과4개 제품 검증을 보완해 전체68 PASS/외부1 SKIP이며 Sol6.1 high 독립 PASS 후 PR#12가0446e5b로 머지됐다. B01C(이슈#13)는6 REQ/7조건을 제품 검증했고 전체85 PASS/외부1 SKIP다. 세 독립 리뷰의 PNG/예외/압축 지적을 보완했고 정확41ff8e3 Sol6.1 high PASS 후 PR14가05b0e6a로 머지됐으며 [보고서](implementation/b01c.md)를 따른다. [B01B 보고서](implementation/b01b.md)를 따른다. [B01A 보고서](implementation/b01a.md), [실행 현황](../implementation/index.md), [조건 ledger](../planning/implementation-plan.json)를 따른다. B01D(이슈#15)는4 REQ/6조건의 국소 제품 판정을 통과했고 전체100 PASS/외부1 SKIP·창 모드25 PASS다. [보고서](implementation/b01d.md)를 따르며 정확0e05802의 독립 결합 gate PASS 후 PR16이8d7c7d8로 머지됐다. B01E(이슈#17)는5부모/7조건의 평가/JSON 직렬화를 국소 제품 검증했고 Before0/7→After7/7, 전체114 PASS/외부1 SKIP·단독 창 모드32 PASS다. [보고서](implementation/b01e.md)를 따르며 첫 독립 리뷰의 큰 timeout P2를 수정했고 새head 재리뷰 전이다. 아래 기록은 각 단계 당시의 이력이다.

2026-11-01. 독립 구현의 첫 실행 버전이다. 모든 브라우저·사이트 지원 또는 상용 배포 완료를 뜻하지 않는다.

## 구현과 실제 검증

- Git main, README·설계·검증 문서와 프로젝트 전용 개발 스킬 작성.
- 외부 guide/reset/js 계약의 HTTP 중계기와 별도 인증, 요청 순서·재전송 중복 방지·세션 격리·reset 구현. MCP 등록 어댑터는 포함하지 않는다.
- 개발 확장 → offscreen 문서 → 세션 Worker → 범용 QuickJS WASM에서 사용자 JS 실행. Node/Playwright가 사용자 코드를 대신 실행하지 않는다.
- 내부64 API의 기본 표면 구현. 카탈로그는 59개 verified-basic, 5개 partial이며 세부 미지원 조건을 기록했다.
- 자체 DOM snapshot/ref/selector, 전체 현재 DOM·화면 밖 탐색, 출력 예산·이어보기·차이, open Shadow DOM과 낡은 참조 거절.
- 중첩·교차 사이트·OOPIF 탐색과 입력. 별도 CDP target에는 해당 target의 로컬 좌표로 입력하고, 명시적 page.mouse 좌표는 최상위 페이지 기준을 유지한다.
- 실제 폼 입력, 메일함 내부 스크롤→137번 읽음, 격자 드래그→더블클릭→예약, 가상화 600개 선택지 중230번 선택 모두 서버 업무 판정 PASS.
- 로컬 경로/서버 asset/바이트 업로드, 파일 선택창, 파일 데이터 drop, 실제 다운로드 바이트 일치·로컬 결과·서버 전달·취소 확인.
- 팝업·alert/confirm·페이지 이동/뒤로/앞으로·키보드/마우스·로그·이미지 출력 검증.
- 런타임 변수 유지·오류 복구·CPU 시간 제한·reset 취소·출력 제한 검증.

## 검증 결과

Chrome for Testing **145.0.7632.6**, macOS, 별도 임시 프로필.

| 검증 등급 | 결과 |
|---|---|
| 계약·업무 판정기·중계기 단위 | 7/7 PASS |
| 테스트 사이트 자체의 UI 검증 | 7/7 PASS |
| 초기 개발 확장 왕복 probe | 1/1 PASS |
| 제품 경로, 실제 창을 띄운 Chrome | 24/24 PASS |
| 제품 경로, headless Chrome | 24/24 PASS; 외부 사이트 시험은 기본 설정상 SKIP |
| 실제 네이버 삼성전자 검색의 읽기 관찰 | 1/1 PASS |

제품 경로는 HTTP→확장→QuickJS→브라우저다. Playwright는 기동·확장 설치·독립 상태 판독만 수행했다. 런타임 E2E의 assertion과 실제 fixture 업무 판정을 함께 사용했다. 과거 디버깅 중 발견한 iframe 입력 오류와 비동기 화면 준비 문제를 수정한 뒤 최종 실행을 통과했다. 실패 기록은 output/runtime-e2e/*.log에 남아 있다.

네이버 결과는 외부 페이지의 현재 DOM 관찰 검증이다. 뉴스 결과 선택·뒤로가기까지의 실사이트 업무 흐름이나 누락률의 정량 평가는 아직 하지 않았다. 회사 실사이트는 접근·검증하지 않았다.

## 남은 범위

1. Chrome 외 브라우저 어댑터, 배포·업데이트·상용 인증/권한 UI, 프로세스 재시작과 장기 연결 복구.
2. screenshot clip/ref/주석, HTML DnD 전용 데이터 이동과 다른 target 간 drag, 로컬 경로 직접 파일 drop, 임의 Pod 목적지 다운로드.
3. 정규식 selector, 전체 접근성 이름 규칙, 닫힌 Shadow DOM·canvas·PDF의 지원 경계.
4. overlay/sticky·프레임 교체·연결 단절·메모리 고갈, 인증 GET/POST/blob·다중 파일 등 추가 실패 조합과 장기 부하 검증.
5. 외부 사이트의 실제 탐색 흐름·성공률·누락률 측정. 전 사이트·전 브라우저의 보편적 성공을 주장하지 않는다.

재현 방법은 runtime-usage.md, 검증 확장은 testing.md를 따른다. 원격 GitHub 저장소는 연결하지 않았다.

## 2026-11-01 수정 전 추가 평가

사용자의 요청에 따라 제품 툴 코드를 동결하고 요구사항·스킬·진단 페이지·테스트만 보완했다. 새 진단31개는19 PASS/12 FAIL이며 기존24개 회귀는 PASS다. 이전 verified-basic은 전체 옵션·실패 조건 검증을 뜻하지 않는다. 상세 결과와 우선순위는 tool-improvement-report.md,64 API 매핑은 api-test-matrix.json을 따른다. Aside 실측은 프로필 연결 문제로 차단됐으며 가이드 비교와 Codex 실제 호출을 구분했다. 툴 보완 구현은 아직 하지 않았다.

## 2026-11-01 진단 수정 구현

후속 사용자 요청으로12건을 수정했다. 원래 진단31/31·추가 경계 포함36/36·기존 회귀24/24·단위7/7을 통과했다. Codex와 Aside 모두 동일 fixture에서 실측했으며 Before/After와 남은 제약은 fixes-before-after.md 및 evidence/diagnostics-before-after.json을 따른다. 평가 당시 보고서는 변경하지 않고 이력으로 남긴다. 기존 PR #2 위의 별도 수정 PR로 검토한다.

## 재리뷰 보고서 저장 완료

디스크 공간 부족으로 저장하지 못했던01ad334 대상 재리뷰를 docs/reviews/sol-rereview-01ad334.md에 복원했다. 이전3건은 해결 확인, 신규 P2 인접 인라인 텍스트 필터 회귀1건은 미해결이다. 판정 CHANGES_REQUESTED를 유지하며 이 문서 추가를 제품 수정이나 재승인으로 해석하지 않는다.

## 인라인 텍스트 필터 후속 수정

인접 노드에 가짜 공백을 넣던 필터를 수정했다. 전체 경계 회귀7/7(두 모드), 진단36/36, 기존 회귀24 PASS/외부1 SKIP, 단위7/7을 확인했다. 세부 Before/After와 재리뷰 범위는 review-round3.md에 기록한다. 독립 재리뷰 결과와 구현 측 PASS를 구분하며 과거 CHANGES_REQUESTED 보고서는 당시 SHA의 기록으로 보존한다.
