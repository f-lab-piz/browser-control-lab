# PR #8 독립 리뷰

## 발견 사항

### PLAN-01 · P2 — SHOULD 부모를 근거 없이 최종 보류 처리해도 검사 통과

- 위치: `docs/requirements/tools/validate_development_plan.py:29-32`.
- 이번 PR이 도입한 상태 검사는 부모 `deferred`에 대해 SHOULD 수준인지만 검사한다. 부모의 `evidence`는 읽지 않고, 자식 상태 집계도 부모 `pass`에만 적용한다.
- 재현: 현재 계획을 메모리 복제하고 `REQ-C-DOMFRAMES-006`만 `status='deferred', evidence=[]`로 바꿨다. 해당 상세 조건 `REQ-C-DOMFRAMES-006-C01`은 `unverified`, `evidence=[]`를 유지했다. `validate(...)`는 예외 없이 ACCEPTED했다. 원본 ledger는 수정하지 않았다.
- 기대: 최종 보류에는 기록된 판단 근거가 필요하고, 부모 완료/보류와 조건별 처리 사이의 모순을 거절해야 한다. 실행 계획 104행은 SHOULD의 비용/영향/판단·잔여 제한 기록, 109행은 SHOULD3의 명시 처리를 완료 조건으로 둔다. 조건 행에서는 deferred의 근거를 이미 필수로 요구하지만 부모만 바꾸면 그 검사가 적용되지 않는다.
- 영향: 구현자가 부모 보류 상태로 세 SHOULD의 처리 완료를 집계하면서 실제 판단/조건 처리는 누락해도 구조 검사를 통과한다. 부모의 보류 근거와 자식의 처리 상태 사이 집계 규칙을 명시·검사하고 이 손상 입력을 회귀에 추가할 필요가 있다. 이 지적은 SHOULD 구현 자체를 MUST로 바꾸라는 뜻이 아니다.

그 외 확정 P0/P1/P2는 발견하지 못했다. 아래 slice 상태 한계는 별도의 남은 위험으로 기록한다.

## 검증/재현 명령 및 결과

검토 경로: `/Users/kihoon/Documents/Codex/2026-10-29/files-pasted-by-the-user-1/browser-control-lab`.

|명령/검사|결과|
|---|---|
|`git rev-parse HEAD` 및 `git status --short`|요청 head `2bb9cb4ff0c1af2f1c3252984801f2f3b0a72819` 일치, tracked/untracked 변경 출력 없음. 종료0|
|실제 base→head diff 및 연결 문서/검사기 확인|14파일, 제품/fixture/제품 테스트 구현 변경 없음. 21 slice, 185 REQ, 254 조건 연결 확인|
|`python3 docs/requirements/tools/validate.py`|종료0. 185 REQ/254 조건/370 슬롯/508 조건단위/152 claims/19 sources. `frozenProductCheck=false`, `productFilesUnchanged=null`, DOCUMENT_STRUCTURE_ONLY_PASS|
|`python3 docs/requirements/tools/validate.py --check-frozen-product`|종료0. 위 문서 검사와 기준 제품35파일 byte/SHA 동결 확인. frozenProductCheck=true|
|`python3 docs/requirements/tools/validate_development_plan.py`|종료0. 21 slice/185 REQ/254 조건, PLAN_STRUCTURE_PASS|
|`python3 docs/requirements/tools/test_validate.py`|종료0. 3 unittest 메서드 통과. 기존 매핑 손상과 명시 동결 옵션 검사 포함|
|`python3 docs/requirements/tools/test_development_plan.py`|종료0. 2 unittest 메서드 통과. 손상 검사 메서드는6개 subtest 포함|
|`npm test`|종료0. 7 tests / 7 pass / 0 fail / 0 skip|
|`PYTHONPATH=.local/skill-validation-deps python3 /Users/kihoon/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/browser-control-development`|종료0. Skill is valid|
|`git diff --check d5bd4ffddbb70cbfc4e6c908663c30c2ab8468ea 2bb9cb4ff0c1af2f1c3252984801f2f3b0a72819`|종료0. 이번 diff whitespace 오류 없음|
|`python3 .local/goal-development/review-plan/probe_plan.py`|종료0. 메모리 손상4개를 독립 실행, 모두 ACCEPTED. 결과는 `probe-results.json`; 첫 probe가 PLAN-01 재현|

담당 중복/누락과 부모/조건 연결을 실제 canonical 자료와 대조하는 코드 경로를 확인했다. dependsOn은 기존 순서에서 앞선 slice만 참조하게 해 정적 순환/미존재 참조를 거절한다. B01E의 공통 evaluate/직렬화 및 B03A의 ref 수명 선행 이행은 계획에서 명시하며, B04D는 소유 REQ 없는 복합 검증 slice라는 설명과 데이터가 일치한다. MUST 부분 PASS 금지와 조건 terminal evidence 검사는 정상 손상 회귀에서 작동한다.

## 미실행/차단

- AGENTS.md, 프로젝트 SKILL.md, 독립 리뷰 규칙, autonomous-implementation 규칙, 실제 diff, 계획 명세/JSON, 정본 backlog/index·관련 SHOULD 규범, 변경된 문서 검사기·회귀를 읽었다. 이전 PR #6 리뷰 기록은 이번 변경의 이력으로만 읽었으며 그 PASS를 이번 판정 근거로 전용하지 않았다.
- 제품 브라우저/확장 E2E, fixture oracle, runtime suite, 조건별 신규 제품 동작, Codex/Aside 현재 비교 및 외부/회사 사이트는 실행하지 않았다. 이번 PR은 제품 변경 없는 계획/문서/검사기 범위다. npm test와 동결 검사는 새 목표계약의 제품 PASS가 아니다.
- 185 REQ/254 조건 전체의 규범 의미를 처음부터 재승인하거나 원시 참고 근거를 전수 재검토하지 않았다. 이번 검토는 계획 분할·추적·게이트와 검사기 변경에 집중했다.
- GitHub 보호 규칙·현재 checks/mergeable은 읽지 않았다. 원격 게시/승인/병합은 수행하지 않았다. 필수 검증 명령의 환경 차단은 없었다.
- 원본 코드/문서/테스트는 변경하지 않았다. 생성 파일은 허용된 ignored `.local/goal-development/review-plan/`에만 작성했다.

## 남은 위험

- slice의 status와 최상위 status는 검사기가 검증하지 않는다. 독립 probe에서 모든 slice `status='pass'`/조건 전부 unverified, 첫 slice `status='INVALID'`, B01B in-progress·선행 B01A not-started 모두 통과했다. 현재 상태는 모두 not-started로 모순이 없고, 문서가 메인의 수동 gate 판정을 별도로 요구하므로 이 결과만으로 자동 머지가 된다는 주장은 하지 않는다. 다만 구현 중에는 PLAN_STRUCTURE_PASS를 slice 완료/의존 충족 승인으로 사용하면 안 되며, 상태의 수용값·집계·착수 규칙을 정하거나 이 필드를 비권위 정보로 명시하는 편이 안전하다.
- evidence는 조건에서 truthy 여부만 확인한다. 실제 파일 존재·내용·실행 환경·hash·독립 리뷰·현재 CI와 머지 가능 여부는 검사기가 보장하지 않는다. 명세의 머지 gate는 메인이 별도로 실제 증거를 확인해야 한다. 구조 PASS와 머지 gate를 구분하는 문구는 유지해야 한다.
- 현재 동결 검사는 통과했다. 이후 제품 구현 branch에서 역사적 동결 실패를 예상 결과로 분리하는 변경은 합리적이며, 동결 옵션을 빼고도 제품 불변을 검증했다고 보고해서는 안 된다.

## 검토 SHA와 판정

- PR: https://github.com/f-lab-piz/browser-control-lab/pull/8
- Base: `d5bd4ffddbb70cbfc4e6c908663c30c2ab8468ea`
- Head: `2bb9cb4ff0c1af2f1c3252984801f2f3b0a72819` (검토 시작/종료 동일)
- 판정: **CHANGES_REQUESTED — PLAN-01 P2 해결 후 해당 검사와 회귀 재확인 필요.** 이번 판정은 계획/문서 검사기 범위이며 제품 구현 승인이나 원격 PR 리뷰를 뜻하지 않는다.


## 메인 판단

PLAN-01 수용. 부모 종결/보류 근거와 하위 조건 집계 검사를 추가했다. 남은 위험으로 제시된 slice 허용 상태·선행 통과·종결 근거도 수용해 보완했다. 정상 SHOULD 보류와 근거 없는 보류/미처리 조건/잘못된 상태/선행 미완료/허위 완료의 회귀를 추가한다. 실제 판정과 독립 리뷰는 수동 gate로 유지하며 구조 검사 PASS가 자동 머지 승인이 아님을 명시한다.
