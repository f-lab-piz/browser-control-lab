# PR #16 B01D 정확 새 head 후속 독립 검토

## 발견 사항

**확정된 P0/P1/P2/P3 발견 사항 없음. 이전 전체 독립 리뷰 범위와 이번 delta 검증을 결합한 새 head 판정은 PASS다.** 이전 보고서의 PASS를 그대로 전제하지 않고, 실제 Git diff·원시 캡처·전달 바이트·실행 결과·현재 소스 fingerprint를 직접 대조했다.

이전 검토 head 이후 실제 변경은 정확 세 파일이다.

- `docs/evidence/b01d/aside-guide.txt`: 마지막 빈줄 한 줄 제거. 이전 바이트에서 마지막 LF 하나를 뺀 것과 정확히 같으며 내용 문자는 동일하다.
- `docs/evidence/b01d/aside-repl-guide.txt`: 같은 EOF 정규화다.
- `docs/evidence/b01d/manifest.json`: 위 두 파일의 전달 `sha256`과 `normalization` 갱신, 최상위 `captureFormatting` 설명 추가다. 원시 `sourceSha256`·원시 파일은 유지된다.

그 외 tracked 389개 파일은 이전 head·새 head·현재 작업 트리 사이에서 모두 바이트 동일하다. 제품 소스, 테스트/fixture/helper/빌드, 실행 명령과 의존성 manifest/lockfile, `docs/runtime-usage.md`·architecture/testing·API catalog, 계획/조건 ledger는 모두 이 집합에 포함된다. 제품의 guide endpoint는 runtime-usage/catalog를 읽으며, 빌드와 테스트 실행 경로에서 변경된 evidence 파일을 실행 입력으로 사용하는 참조는 발견하지 못했다. build-extension의 실제 입력 경로도 확인했다. 따라서 이 delta는 이전 전체 검토의 실행 입력이나 수용 조건을 변경하지 않는다.

## 직접 실행·감사한 내용과 결과

시작 HEAD는 지정 새 head와 같고 tracked 변경은 없었다. AGENTS.md, 프로젝트 SKILL.md, `references/pr-review.md`·`autonomous-implementation.md`, 요구 색인·reset/runtime 계약, 실행 계획·B01D ledger/보고서, 이전 전체 독립 리뷰와 원시 로컬 증거를 읽었다. 원본 제품/테스트/문서는 읽기 전용으로 유지했다.

| 직접 수행한 명령/감사 | 결과 |
|---|---|
| 이전 검토 head→새 head 전체 diff | exit0, 위 세 evidence 파일만 변경 |
| `git diff --check 05b0e6a71e2b112b5dbb75e1b0ac3c951887fbd2 0e0580250f115b2a170127a0eb9117cb382cf0b3` | exit0, 전체 PR whitespace 오류 없음 |
| 이전 검토 head→새 head `git diff --check` | exit0 |
| `python3 docs/requirements/tools/validate.py` | exit0, DOCUMENT_STRUCTURE_ONLY_PASS; 185 REQ·254 조건·370 슬롯·508 condition units·152 claims·19 sources |
| `python3 docs/requirements/tools/validate_development_plan.py` | exit0, PLAN_STRUCTURE_PASS; 21 slices·185 REQ·254 조건 |
| `python3 -m unittest discover -s docs/requirements/tools -p 'test_*.py'` | exit0, 6 tests OK |
| `python3 .local/goal-development/b01d-format-review/audit.py` | exit0, 캡처/소스/실행 증거 감사 PASS |
| `gh pr view 16 …` 읽기 조회 | exit0, 지정 base/새 head 일치, OPEN·MERGEABLE, statusCheckRollup 빈 배열 |

문서 검사 PASS는 제품 동작 PASS와 구분한다. 과거 문서 단계의 제품 동결 검사는 이번 구현 PR의 gate가 아니므로 실행하지 않았다. GitHub에 보고된 check run이 없는 상태를 CI 테스트 통과 수로 표현하지 않는다. 보호 규칙 우회나 원격 변경은 하지 않았다.

### 캡처·normalization 검증

manifest의 27개 모두 원시 경로가 존재한다. `sourceSha256`은 원시 바이트의 실제 SHA256과 일치하고 이전 manifest 값과 같다. 전달 `sha256`도 각각 현재 전달 파일의 바이트와 일치한다. 원시에서 저장소 절대 경로를 `<repo>`로 치환하고 줄 끝 spaces/tabs를 제거한 뒤, 두 guide에만 추가된 trailing blank-line collapse를 적용하면 **27개 모두 전달 바이트와 정확히 같다**. 정규화 설명 이상의 내용 변형은 없다.

| 캡처 | 원시 SHA256 | 전달 SHA256 |
|---|---|---|
| aside-guide.txt | `69efe203e5d7b1e91e0617dc46adde5c50c52299af1b1436ac8e6e17275653ec` | `6512500c099f57595096e2ba0b354361424953378eb6586efb5dbba8fd842742` |
| aside-repl-guide.txt | `0f36a95f730dd2f021b37c0bcc915bb9f0c90f375e42ba8fd64ef4e93649254c` | `0c396eb814818cd40458eed5602dfe41514f2474eb6727bbe1c0fcab0a2d0876` |

두 원시 캡처는 LF 두 개로 끝나고 전달본은 LF 하나로 끝난다. 새 manifest는 이 차이를 숨기지 않는다. 원시/전달 해시를 동일하게 유지해야 한다는 잘못된 조건을 적용하지 않았다.

### 기존 full-review 실행 증거의 현재 적용성

기존 독립 전체 리뷰의 all/headed B01A~D 결과 8개를 각각 원본에서 읽었다. 모두 실제 `head=3d4246f…`, `dirty=false`, Chrome `145.0.7632.6`이고 기록된 각 sourceSha256은 현재 새 head 소스와 전부 일치한다. 독립 추가 probes 결과도 같은 이전 head·clean이며 3 PASS, 기록 소스는 현재와 일치한다. 기존 결과를 새 head에서 새로 실행한 것처럼 metadata를 바꾸지 않았다.

기존 `test-all.log`의 각 하위 실행 pass/fail/skip 집계를 다시 계산하면 **100 PASS / FAIL0 / SKIP1**, headed log는 **25 PASS / FAIL0**다. full100은 unit34·fixture oracle9·bootstrap1·기존 제품24·요구 제품25·경계7이며 전부 제품 E2E라는 뜻은 아니다. 외부 Naver1건 SKIP도 유지된다. 기존 full-review 보고서의 추가 반례는 다중 실제 key/button release·다른 세션 격리, 하위 event timeout의 VM 보존, 전송 중 host 조회의 불확실성/late 차단 3개이며 원시 결과의 PASS를 확인했다.

최종 구현자가 보존한 Before/After의 fingerprint도 재계산했다. After/headed의 기록 소스 34개는 모두 현재 파일과 같다. Before와 After 사이의 차이는 정확 `bridge/server.mjs`, `extension/runtime-worker.mjs`, `extension/offscreen.js`, `extension/browser-engine.mjs`, `extension/files.mjs`, `extension/background.js` 여섯 소유 파일이고, 여섯 Before hash는 각각 지정 PR base의 실제 Git blob SHA256과 일치한다. 나머지 기록 입력은 동일하다. 원시 결과의 Before1 PASS/6 FAIL→After7 PASS도 유지된다. 이 비교는 최종 fixture/tests/helper/안내/의존성 및 미사용 lifecycle 모듈을 고정한 통제 비교이며 전체 과거 환경 재현이 아니다.

이전 full-review의 범위는 전체 base→이전 head의 제품/연결 코드·계약·B01D4부모/6조건·회귀·Before/After·비교 근거 등급이었다. 이번 delta에는 그 범위를 줄이거나 판정 조건을 바꾼 변경이 없다. 현재 B01D slice는 `in-progress`이며 국소 조건 PASS를 전체185 REQ 완료나 머지 완료로 확대하지 않는다. Codex 자료는 제한된 LIVE 수신 출력 전사, Aside 자료는 DOC이며 새 EOF 정규화는 그 등급을 바꾸지 않는다.

감사 결과는 이 폴더의 `audit.json`, 재현용 `audit.py`, 실행/미실행 기록은 `commands.json`에 보존했다. 이전 전체 리뷰와 로그는 `.local/goal-development/b01d-review/`, 실제 실행 결과는 `output/goal-b01d-review/`에 그대로 있다.

## 미실행과 그 근거

- 이번 후속 검토에서는 full100·headed25·독립 제품 probes3을 재실행하지 않았다. 제품·테스트·fixture·helper·실행 안내·의존성·빌드의 바이트 동일성과 실제 읽기 경로를 확인했고 기존 실행 결과 fingerprint가 현재와 같기 때문이다. 이 판정은 **이전 실제 실행 + 새 head의 입력 동등성**으로 구성되며 새 head 브라우저 실행을 주장하지 않는다.
- Before 브라우저와 경쟁 Codex/Aside LIVE도 새로 기동하지 않았다. 보존된 원시 파일/해시/등급·최종 입력 동등성을 감사했으며 새 경쟁 성능/기능 수치는 없다.
- 전체/회사 외부 사이트, 장기·최대 동시 세션 부하, 모든 CDP 장애/chooser 실패 순서, process peak 메모리·강제 crash/서비스워커 중단·재연결 조합은 이번 검토와 이전 full-review에서도 모두 검증된 것이 아니다.

## 잔여 위험

이미 전송된 브라우저 명령과 페이지 비동기 효과의 취소/rollback은 보장되지 않는다. 기존 제품은 in-flight 불확실성과 release 실패 partial/warnings로 이를 구분하며 이 delta는 그 동작을 변경하지 않는다. 유한한 기존 회귀가 모든 타이밍 경합을 보장하지 않으며, 과거 native relay나 다운로드 취소의 간헐 실패 원인이 이번 포맷 수정으로 해결됐다는 결론은 없다. B01E·B02~B06의 후속 계약도 이 판정 밖이다.

## 정확 SHA와 결합 gate 판정

- PR: #16
- PR base: `05b0e6a71e2b112b5dbb75e1b0ac3c951887fbd2`
- 이전 전체 검토 head: `3d4246f2821a67a9417585d8547782872eefbefa`
- 이번 새 검토 head: `0e0580250f115b2a170127a0eb9117cb382cf0b3`
- 판정: **PASS**. 이전 전체 독립 검토의 실행·범위와 이번 delta의 직접 검증을 결합하면 정확 새 head의 B01D review gate를 충족한다. 확인된 미해결 P0/P1/P2/P3 없음, 전체 PR diff-check와 문서/계획 검사 통과, 캡처 원시/전달/정규화와 실행 입력 일치다. 원격 댓글·리뷰·승인·머지는 수행하지 않았다.
