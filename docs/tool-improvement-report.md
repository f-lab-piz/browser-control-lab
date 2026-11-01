# 툴 수정 전 진단 결과와 개선 제안

2026-11-01. 기준 제품 커밋 `35077f5`. 확장/중계기/빌드 엔진은 수정하지 않았다. 스킬·요구사항·테스트 페이지·테스트 하니스·평가 문서만 보완했다.

## 완료한 작업

1. 프로젝트 개발 스킬에 평가 모드,64 API 검증 등급, 동일 fixture 비교와 증거 기준을 추가했다. development-requirements.md에 이전 요구를 관찰·검색·입력·파일·런타임·복잡 업무·자동화 단위로 정리했다.
2. 기존7개 업무 페이지를 유지하고 `/audit`에16개 진단 구역을 추가했다.31개 테스트가 의미/상태·가림·중복·지연·readonly·slot/중첩 Shadow·HTML DnD·MIME·다중 파일·로컬 drop·POST/cookie/blob·변형 iframe·큰 DOM을 다룬다. `/coverage`에서64 API의 기본 테스트와 추가 진단 매핑을 확인한다.
3. 현재 제품의 HTTP→확장→QuickJS→브라우저 경로로 진단했다. 서버 업무 이벤트, 파일 바이트, 독립 DOM/이미지 크기로 판정했다. 실패도 그대로 기록했다.
4. 동일 페이지에서 Codex 브라우저를 실측했다. Aside는 설치된 CLI의 현재 가이드를 확인했으나 프로필의 daemon 연결이 없어 실측은 차단됐다. 원본 코드나 WASM은 추출하지 않았다.

## 결과

| 등급 | 결과 | 의미 |
|---|---:|---|
| 기존 제품 회귀 |24 PASS / 0 FAIL / 외부1 SKIP|기존 복합 업무와 기본 호출 유지 |
| 새 제품 진단 |19 PASS / 12 FAIL / 총31|지원 경계와 잘못된 성공까지 포함 |
| 진단 fixture oracle |2 PASS / 0 FAIL|판정기 및 지연/slot/DnD/readonly/변형 iframe/clip이 독립 브라우저에서 작동 |
| 기존 단위 |7 PASS / 0 FAIL|기존 판정·중계 계약 유지 |
| 스킬 기본 검사 |PASS|frontmatter·이름·참조 경로 검토 |

숫자들을 합산해 전반 성공률로 표현하지 않는다.31개는 의도적으로 취약 경계를 고른 진단이며 일반 사이트 성공률 표본이 아니다.64 API 매핑은 모든 옵션의 완전 검증을 뜻하지 않는다. 기존 일부 smoke는 묶인 assertion이므로 향후 API별 독립 assertion으로 강화할 여지가 있다.

## 개선 우선순위와 수용 기준

| 우선 | 실패 ID | 현재 확인한 현상 | 제안·다음 구현 때의 수용 기준 |
|---|---|---|---|
|P0|readonly-fill|readonly 값은 LOCKED로 유지됐는데 fill이 completed 반환|입력 가능성 사전 확인과 입력 후 값 확인. 변경 불가이면 구체적 오류를 반환하고 성공으로 보고하지 않을 것 |
|P0|scaled-frame-click|CSS scale(.8) iframe 클릭이 completed여도 대상 이벤트가 발생하지 않음|프레임 변환 행렬/클리핑/히트 테스트 처리. scale·translate·중첩 스크롤에서 정확한 target 이벤트와 서버 판정을 확인할 것 |
|P1|snapshot-states|체크/선택/확장 상태가 반환 text/ref에서 빠짐|checked/selected/expanded/readonly/busy 등을 compact 상태로 보존. 의미가 다른 두 상태를 스냅샷만으로 구별할 것 |
|P1|slot-name|slot 텍스트가 이름인 버튼을 getByRole로 못 찾음|composed tree/assignedNodes와 접근 이름 규칙 반영. snapshot→이름 검색→클릭이 모두 일치할 것 |
|P1|snapshot-collapsed|닫힌 details의 내부 버튼이 기본 snapshot에 포함됨|렌더링/접근성 표시 규칙을 적용. 기본에서는 숨기고 showHidden 요청 시 숨김 표시와 함께 수집할 것 |
|P1|regex-role|정규식 이름 조건이0개 매칭으로 끝남|정규식의 source/flags를 보존하거나 미지원 오류. 지원한다고 문서화한 조건을 조용히 실패시키지 않을 것 |
|P1|filter-visible|visible:true가 무시돼 숨은 버튼 포함3개, 기대2개|필터 옵션 검증·평가. 지원하지 않는 옵션은 명시적 오류로 반환할 것 |
|P1|delayed-enabled|disabled 해제 전 즉시 ELEMENT_DISABLED|제한 시간 안의 enabled/visible/stable/hit-target 대기와 원인별 실패. 영구 disabled와 지연 활성화를 구분할 것 |
|P2|html-drag|포인터 이동은 완료됐지만 DataTransfer 업무가 미완료|HTML DnD 경로를 공통 드래그 엔진에 추가. 격자 포인터 드래그와 데이터 기반 드래그를 각각 검증할 것 |
|P2|local-file-drop|로컬 파일 경로 drop 명시적 미지원|setFiles와 파일 해석을 공유해 drop도 전달하거나 guide에서 변환 경로 안내. 파일 내용으로 판정할 것 |
|P2|screenshot-clip|clip 요청에도1280px 폭의 viewport 반환|clip 지원 전에는 미지원 오류. 지원 후 실제320×240 이미지로 확인할 것 |
|P2|negative-nth|nth(-1)이 조용히0개 매칭|음수 인덱스 지원 또는 유효 범위 오류. 마지막 요소를 의도했다는 사실을 잃지 않을 것 |

P0는 이번 평가에서 먼저 고칠 것을 권하는 내부 순위이며 외부 보안 등급이 아니다. 알려진 미지원인 HTML DnD·local drop·clip도 요청 조건을 제외하지 않고 FAIL로 포함했다.

## snapshot·검색·제어의 비교

같은 `/audit`에는 긴 URL의 링크1800개와 문서 끝 목표가 있다. 브라우저와 viewport, 반환 데이터 계약은 같지 않으므로 이 측정으로 처리 속도나 압축률의 우승을 선언하지 않는다.

| 항목 | 현재 우리 툴 | Codex 실제 호출 | Aside 현재 가이드/실행 |
|---|---|---|---|
|큰 페이지 기본 snapshot|text11,972자·266개 ref·직렬화45,913바이트, truncated=true·cursor266|DOM snapshot2,682,070자, 끝 목표 포함|가이드는 compact tree·diff·범위/interactive 옵션 설명; 실측 차단 |
|끝 목표 탐색|기본 반환에는 없음; query로44자·1개 ref 반환, 스크롤0 유지|기본 snapshot에 포함|가이드상 viewport 밖·자식 iframe 포함; 미측정 |
|slot 이름 버튼|탐색 FAIL|탐색·클릭 PASS|미측정 |
|정규식 이름|0개|1개|이번 가이드만으로 지원 범위 확정하지 않음 |
|visible 필터|3개(옵션 무시)|2개|미측정 |
|readonly fill|completed, 실제 값은 LOCKED|거절, 실제 값은 LOCKED|미측정 |
|scale iframe 클릭|업무 미완료|클릭 PASS|미측정 |
|clip|viewport 반환|JPEG320×240 확인|annotatedScreenshot 안내; clip은 미측정 |
|상태|selected/checked/expanded 누락|selected 표시 확인; 모든 상태를 시험한 것은 아님|compact 접근성 tree 안내; 상태별 미측정 |

우리 출력이 작다는 사실은 전체 내용이 보존됐다는 뜻이 아니다. 기본 snapshot은 예산으로 중단돼 끝 목표가 빠지고, query는 목표 이름을 이미 알 때만 유용하다. 사용자가 강조한 “무슨 키워드로 찾을지 모르는 상황”에는 다음 개선이 필요하다.

1. **개요를 먼저 반환:** 문서/랜드마크/프레임/스크롤 컨테이너 구조와 영역별 노드 수·로드/생략 여부를 기본 예산 안에 제공한다. 긴 목록이 뒤쪽 주요 영역을 가리지 않게 한다.
2. **영역 안에서 탐색:** 기존 snapshot의 root/query/interactive 옵션과 Locator.filter를 강화한다. 구조 문맥, 접근 이름과 상태, 주변 텍스트를 함께 보존한다. 외부 MCP 도구 수를 늘릴 필요는 없다.
3. **범위와 생략을 정확히 표현:** current DOM과 미로드 데이터, 의도한 root 범위와 자식 프레임 오류를 구별한다. 현재 root CSS를 모든 프레임에 적용해 불필요한 ELEMENT_NOT_FOUND 프레임 오류가 붙는 경우도 관찰했다.
4. **조회 연속성:** 숫자 cursor를 snapshot 세대/필터 조건과 연결하고, 중간 DOM 변경 시 reset 필요를 알려야 한다. 이는 현재 코드/계약 검토로 도출한 제안이며 이번에 경쟁 조건을 재현한 결과는 아니다.
5. **검색과 조작의 의미를 일치:** snapshot의 이름·역할·상태, getByRole/filter, actionability가 같은 의미 체계를 써야 한다. 일치 실패·다중 매칭·미지원 옵션을0개나 성공으로 숨기지 않는다.

Aside에서 참고할 방향은 compact 구조, action 후 diff, scope(ref/selector), 시각적 ref 안내와 읽기 단계 안내다. 고유 구현을 복제할 필요는 없다. Codex에서 실제 확인한 조합은 slot/정규식/visible 필터/변형 frame 입력/readonly 거절이다. 반면 이 페이지의 Codex 전체 snapshot은 매우 길어 우리 요구에 맞는 출력 예산과 구조화를 별도로 설계해야 한다.

## 그대로 유지할 부분

중복 매칭 거절·오버레이 감지와 해제 후 복구·중첩 open Shadow DOM·MIME drop·다중 파일 내용·Blob/POST/cookie 다운로드 바이트·화면 밖 목표 query·기본 예산/부분조회·변경 없는 diff·버튼 라벨 중복 축소는 이번 진단에서 통과했다. 기존 교차 사이트 iframe 메일·예약·가상 목록 회귀도 통과했다.

## 재현과 후속 범위

`npm run site` 후 `/audit`와 `/coverage`를 연다. 자동 실행은 `npm run test:audit`이다. FAIL이 있으면 명령도 비정상 종료 코드를 반환하며 결과는 output/tool-audit/results.json에 보존한다. fixture oracle은 `npm run test:audit-fixture`, 기존 회귀는 `npm run test:runtime`이다.

다음 구현 순서는 P0의 거짓 성공/좌표, P1의 관찰·검색·대기, P2 옵션이다. 이번에는 툴 수정 패치를 만들지 않았다. 메모리 고갈, 연결 단절/재연결, 다중 동시 다운로드 귀속, 대규모 프레임 detach, 닫힌 Shadow DOM·canvas·PDF, 실제 회사 사이트는 미검증으로 남아 있다. Aside 실측도 프로필 연결이 복구된 환경에서 별도 수행해야 한다.
