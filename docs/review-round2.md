# Sol 독립 리뷰 3건 후속 수정

기준: PR #4의 첫 독립 리뷰 head `d50339b`. 해당 리뷰에서 재현한 P2 3건을 같은 PR의 추가 커밋으로 수정한다. 이전 3개 툴 비교/증거 JSON은 초기 수정 당시 기록으로 보존하며 이 후속 검증과 구분한다.

| 리뷰 항목 | 수정 전 | 후속 수정 |
|---|---|---|
|긴 요소 hasText/hasNotText|약600자 이후 텍스트 누락, 각각0/1|필터는 전체 composed 텍스트를 검색,1/0. snapshot/접근 이름 출력 예산과 분리|
|닫힌 details의 summary Shadow 버튼|보이는 버튼 count0·클릭 시간초과|summary 포함 여부를 composed ancestry로 판단. 버튼 count1·실제 clicked 변경. details 본문 Shadow/일반 버튼은 계속 숨김|
|스크롤 후 viewport clip|문서(0,0)의 빨간/텍스트 영역 캡처|visual viewport의 문서 오프셋을 더해 현재 영역 캡처. native capture로 viewport/scroll anchoring이 바뀌면 좌표를 다시 잡고,3회 안에 안정화하지 않으면 명시적 오류. 세로·가로 스크롤과 x/y가0이 아닌 요청을 모두 확인|

텍스트 추출 함수의 출력 제한 인자를 map callback의 index가 덮어쓰지 않게 label 호출도 명시적으로 감쌌다. native label·aria-labelledby를 별도 회귀 검사한다.

## 재현 fixture와 회귀

`test-site/review-boundaries.html`은 긴 텍스트·슬롯 배정 텍스트, closed details 안 summary/body Shadow DOM, 문서 위쪽 빨강/아래쪽 파랑 영역과 가로 overflow를 포함한다. `npm run test:review-boundaries`는 아래5건을 실제 HTTP→확장→QuickJS→브라우저로 수행한다.

1. 일반/슬롯 요소의 긴 hasText·hasNotText와 정규식 suffix
2. native label·aria-labelledby 검색 유지
3. summary Shadow 버튼 관찰·실제 클릭과 본문 버튼 숨김 유지
4. 세로 스크롤 후 clip의 실제 픽셀을 파랑으로 확인
5. 가로 스크롤 및 viewport의 nonzero x/y clip 크기·내용 확인

Playwright는 브라우저 기동과 독립 DOM 판독만 담당한다. clip 테스트는 PNG 픽셀을 독립 디코딩하여 검사하므로 이미지 크기만 맞아도 통과하지 않는다. 이 명령은 test:all에도 포함했다.

## 검증 결과

- `HEADED=1 npm run test:review-boundaries`:5/5 PASS
- `npm run test:review-boundaries`:5/5 PASS
- `AUDIT_EXTRA=1 npm run test:audit`:36/36 PASS
- `npm test`:7/7 PASS
- `npm run test:runtime`:24 PASS, 외부 사이트1 SKIP

후속 커밋을 원격 PR에 반영한 뒤 같은 `gpt-6.1-sol` high 모델의 새 컨텍스트로 재리뷰한다. 재리뷰 판정은 별도 보고하며 이 문서에서 미리 승인으로 표시하지 않는다. 이전 단발 runtime 프레임 탐색 실패의 원인을 이번3건 수정으로 해결했다고 주장하지 않는다. Codex/Aside 비교와 외부 사이트 검증도 이번 후속 수정에서 다시 실행한 것은 아니다.

## 재리뷰 결과 복원

공간 확보 후 저장하지 못했던 Sol 6.1 재리뷰 보고서를 [reviews/sol-rereview-01ad334.md](reviews/sol-rereview-01ad334.md)에 복원했다. 검토 head는01ad334이며 이전3건은 해결, 신규 P2 인접 인라인 텍스트 필터 문제1건으로 CHANGES_REQUESTED다. 재리뷰 당시 진단36·새 경계5·회귀24·단위7건은 통과했으나 해당 신규 재현은 실패했다. 이번 문서 저장은 새 검증이나 승인·병합이 아니다.
