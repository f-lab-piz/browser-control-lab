# 문서 검증 방법과 한계

검사 대상은 docs/requirements의 규범 Markdown·index.json·verification-matrix.json과 sources.md다. 메인이 ignored .local/validate-requirements.py로 문서 검사를 실행했고 독립 리뷰어도 각 회차에 읽기 전용 검사로 범위를 확인했다. 이 검사기는 제품/테스트 코드에 포함하지 않았다.

검사 항목:

1. docs/api-catalog.json과 index의 외부3/내부64 이름 집합 일치, 이름 중복0, 개별 파일67개.
2. 각 spec의 `### REQ-*` 순서/ID와 index 일치, 전체 ID 고유, matrix와 같은 ID 집합.
3. MUST/SHOULD 수준, 수용/미검증 상태와 Given/When/Then 및 고유 PLAN ID 존재. 기존 테스트 후보의 파일과 test 이름이 원본에 존재하는지도 확인.
4. 각 Markdown의 Given/When/Then과 matrix 동등성, sources ID 참조, 로컬 문서 링크 존재. 원격 URL의 현재 접근 가능성은 별도 범위다.
5. 리뷰 각 회차의 고정 SHA·모델·검토 API 범위, 후보 ID와 메인 결정 ID의 일치. 모든 수용 변경은 다음 회차 전 커밋으로 고정.
6. backlog-map에서 모든 REQ에 담당 B 작업·PLAN ID 연결. 구조 검사 성공이 의미론적 충분성을 보장하지 않으므로 세 독립 리뷰로 보완.
7. 제품 baseline 700a6a06af3f97729327afaf9becb4ee29bb475b의 extension/bridge/scripts/tests/test-site/package*.json 총35개를 현재 파일과 byte 단위 비교하고 SHA256을 product-freeze.json에 기록. 제품 변경0 확인.

최종 결과는 document-validation.json이다. 제품/unit/fixture/E2E를 새로 실행하지 않았으며, 예전 테스트 결과도 이번 실행으로 집계하지 않는다. 회사/외부사이트·현재 경쟁제품 재벤치마크는 미실행이다. 비교의 날짜·버전·실측/안내/설계 구분은 sources.md를 따른다.

## v2 문서 단계의 재현 명령

실제 프로젝트의 Git checkout에서 `python3 docs/requirements/tools/validate.py --check-frozen-product`를 실행하면 정본185REQ/254Cnn·370슬롯·claim/source·PLAN·backlog·앵커·로컬링크와 기준제품35파일의byte/SHA를 검사한다. 문서 단계 당시 기본 동결 검사는 구현 단계부터 명시 옵션으로 분리했다. 소스/테스트를실행하거나수정하지않는다. 문서만있는전달ZIP에는Git/제품소스가없으므로제품동결검사는실제checkout에서재현한다. 문서판정은제품PASS가아니다.


## PR #6 보완 검증

PR 독립 리뷰에서 PLAN/backlog 교차 검사 누락을 재현했다. 보완한 검사기는 부모/상세 PLAN의 고유 형식과 연결, 담당 작업·API·수준·spec/anchor·부모 조건 집합을 대조한다. 회귀 확인은 `python3 docs/requirements/tools/test_validate.py`로 JSON 내용을 메모리에서만 변형해 수행한다. 원본 파일은 변경하지 않는다.

`git diff --check 700a6a0..HEAD`의 Aside 공개 원문 current-main-guide.txt:88/current-repl-guide.txt:153 EOF blank 경고2건은 실제 stdout 끝 `\n\n`의 보존에 따른다. 원문을 정규화하지 않았으며 다른 경로의 whitespace 오류는 별도로 검사한다. 과거 document-validation.json과 독립3회 기록은 당시 head의 기록으로 유지한다.


## 구현 착수 후 검사 모드

기본 `python3 docs/requirements/tools/validate.py`는 문서 구조/추적만 확인하며 결과의 frozenProductCheck=false/productFilesUnchanged=null로 동결 검사를 미실행임을 표시한다. 과거 제품 동결을 재현하려면 `--check-frozen-product`를 지정한다. manifest와 역사적 보고는 보존하며, 제품이 바뀐 구현 branch에서 동결 실패는 예상되는 결과다. 기본 검사 PASS를 제품 동결이나 제품 동작 PASS로 인용하지 않는다. 계획 ledger 검사는 `python3 docs/requirements/tools/validate_development_plan.py`, 검사기 회귀는 `python3 docs/requirements/tools/test_validate.py` 및 `python3 docs/requirements/tools/test_development_plan.py`다.
