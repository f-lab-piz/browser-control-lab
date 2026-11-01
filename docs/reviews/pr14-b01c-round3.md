# PR #14 B01C 정확 head 독립 3차 리뷰

## 발견 사항

### P2 — 잘못된 DEFLATE 저장 블록을 수용해 표시 불가능한 PNG를 성공 반환한다

- 위치: `extension/output.mjs:15` (`inflateChecked`의 fflate 스트림 호출; 연결 코드 7–17행 및 87행).
- 발생 조건: 정상 1×1 RGBA8 PNG의 IDAT를 zlib `level:0` 저장 블록으로 만들고 LEN=5의 NLEN을 `fa ff`에서 `fb ff`로 한 비트 바꾼다. PNG IDAT chunk CRC는 다시 계산한다. scanline은 정상 5 bytes이며 zlib Adler checksum도 해당 scanline과 일치한다. 전체 PNG는 73 bytes로 모든 출력/메모리 한도 안에 있다.
- 기대: 손상 압축 데이터는 `display`가 동기 `INVALID_IMAGE`로 거절하고 이미지 블록을 넣지 않으며 catch 뒤 로그는 유지한다. REQ-DISPLAY-002-C01의 corrupt 입력, REQ-DISPLAY-001-C01의 실제 이미지 전달 및 `docs/runtime-usage.md`의 잘못된 압축 데이터 입력 오류 안내에 해당한다.
- 실제: fflate 0.8.3의 `inflt` 저장 블록 경로는 LEN으로 데이터를 복사하면서 NLEN의 1의 보수 관계를 검사하지 않는다. `inflateChecked`는 반환 길이/행/filter/Adler만 검사하므로 이 손상을 발견하지 못한다. 실제 HTTP→확장→QuickJS `display`는 `completed`, 원본 `image`, `accepted`, `after`, `truncated:false`를 반환한다. 같은 바이트의 Node zlib `inflateSync`는 `invalid stored block lengths`, 독립 Chromium `createImageBitmap`은 `The source image could not be decoded.`로 실패한다. 정상 NLEN 대조는 양쪽 decoder와 제품 모두 성공하고 픽셀 `[12,34,56,255]`다.
- 영향: 모델이 표시할 수 없는 손상 이미지를 정상 블록으로 전달하여 신규 PNG 검증과 6부모/7조건 PASS 주장의 corrupt 입력 경계가 성립하지 않는다. base도 입력 검증 없이 손상 이미지를 수용했으므로, 기존 누락을 이번 validator/조건 PASS가 아직 해결하지 못한 경우다. PNG 표준 전체 적합성을 요구해서 지적한 것이 아니라 실제 표시 실패와 이번 범위의 명시된 corrupt 입력 계약을 확인했다.
- 증거: `.local/goal-development/b01c-round3-review/probes.mjs`, `probes.json`, `probes.log`, `output/goal-b01c-review3/probes/review3-independent/results.json`의 `invalid-stored-NLEN` 및 정상 대조. 독립 관찰자는 디코딩/픽셀 판독만 했고 제품 `display`를 대신하지 않았다.
- 최소 입력 base64: `iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEElEQVR4AQEFAPv/AAwiOP8CCgFm465/QgAAAABJRU5ErkJggg==`.
- 재현: `BCL_RUN_DIR=output/goal-b01c-review3/probes node .local/goal-development/b01c-round3-review/probes.mjs`. 이 스크립트의 exit0은 진단 수집 완료이며 제품 PASS를 뜻하지 않는다. 엄격한 DEFLATE 유효성 검증과 이 입력의 거절/정상 저장 블록 수용 회귀가 필요하다.

P0/P1 및 추가 확정 P2/P3는 없다. 미재현 가설을 버그로 합산하지 않았다. 앞선 두 리뷰의 Adam7/ICC/위조 예외/color-depth/PLTE 반례는 현재 필수 회귀의 거절/복구/정상 원본 보존으로 통과한다.

## 검증 명령·종료 코드·결과

환경: macOS15.6.1 arm64, Node25.2.1, Python3.14.2, Chrome for Testing145.0.7632.6. 시작 시 HEAD는 지정 `64f2de4e7bf62413ed93a0382c6c565798430dcf`, `git status --short`는 비어 있었다. AGENTS.md, 프로젝트 SKILL.md, pr-review.md, autonomous-implementation.md, 요구사항 README 및 runtime/console.log/display 정본, 전체 base→head diff와 연결 worker/offscreen/bridge/빌드·fixture·테스트·안내를 검토했다. 제품·테스트·문서는 읽기 전용으로 유지했고 scratch는 지정 ignored `.local/` 및 `output/`에만 작성했다.

| 명령/확인 | 종료 코드·결과 | 증거 |
|---|---|---|
| `npm run test:all` | exit0, 83 PASS / 외부1 SKIP / FAIL0 | `.local/goal-development/b01c-round3-review/test-all.log` |
| `HEADED=1 BCL_RUN_DIR=output/goal-b01c-review3/headed npm run test:requirements` | exit0,17 PASS / FAIL0 | `headed-requirements.log`, `output/goal-b01c-review3/headed/{b01a,b01b,b01c}/results.json` |
| `python3 docs/requirements/tools/validate.py` | exit0, DOCUMENT_STRUCTURE_ONLY_PASS;185REQ·254조건 | 직접 tool 출력 |
| `python3 docs/requirements/tools/validate_development_plan.py` | exit0, PLAN_STRUCTURE_PASS;21 slices | 직접 tool 출력 |
| `python3 -m unittest discover -s docs/requirements/tools -p 'test_*.py'` | exit0,6 tests OK | 직접 tool 출력 |
| `BCL_RUN_DIR=output/goal-b01c-review3/probes node .local/goal-development/b01c-round3-review/probes.mjs` | exit0, 위 손상 PNG 제품 수용/독립 decoder 거절, 정상 대조 성공 | `probes.json/log`, 제품 results.json |
| 독립 console probe | 공통 참조는 순환으로 오인하지 않음, 배열 자기참조는 `[Circular]`, undefined/BigInt/Symbol/function 출력 후 계속 | 같은 `probes.json` 마지막 행 |
| `git diff --check 0446e5b3ae683bb7801184648078f99de96ea55d 64f2de4e7bf62413ed93a0382c6c565798430dcf` | exit0 | 직접 tool 출력 |

`test:all` 집계는 unit26·fixture oracle8·bootstrap1·기존 제품24(+외부1 SKIP)·요구 제품17·경계7이다. fixture native decoder와 fake-extension 전송 단위는 각각 별도 검증 등급이며 제품 성공으로 전용하지 않았다. 제품 입력·출력은 HTTP→확장→세션 QuickJS로 실행했다. 앞서 기록된 다운로드 취소 간헐 TIMEOUT은 이번 전체 회귀에서 295ms에 통과했지만 원인 해결을 입증한 것은 아니다.

B01C 6 REQ/7조건의 명시 출력/NUL/순환/Unicode·UTF8 64KiB·256블록·이미지4MiB/합8MiB/4장·전체 결과16MiB·실제 stack/메모리 실패와 다음 요청 복구를 확인했다. PNG66행 corpus는 정상40/거절26을 현재 제품에서 통과하며, 이것이 위 신규 손상 압축 반례까지 포괄하지는 않는다. 자원 이름/문구를 위조한 guest 예외를 자동 reset하지 않고, 실제 host stack trap과 VM 재생성 여부를 구분하는 정책은 정본과 모순으로 보지 않았다. 개인용 로컬 중계기를 다중 사용자 계정 서비스로 확장해 판정하지 않았다.

증거·Before/After·비교 확인:

- `docs/evidence/b01c/manifest.json`의 보존38개 전달 파일 SHA256이 전부 일치한다. 원시 경로38개가 존재하며37개는 sourceSha256도 일치한다. 남은 `output/runtime-e2e/results.json`은 이 리뷰의 필수 `npm run test:all`이 동일 고정 경로에 새 결과를 기록하여 raw hash가 달라졌다. 원본 보존 `round3-runtime-regression.json`의 manifest hash는 일치한다. 이 실행 후 교체를 과거 증거 변조로 지적하지 않았다. 상세는 `evidence-audit.json`이다.
- `round3-after-product.json`과 `round3-after-headed.json`의 기록된 모든 sourceSha256은 현재 head 파일과 일치한다. 당시 metadata는5747487/dirty=true지만 보완된 실제 소스는 파일 해시로 특정되고, 문서는 새 정확 head 독립 리뷰 전이라고 분리한다. 이번 headed 결과는 정확64f2de4/dirty=false이며 기록 hash도 모두 일치한다.
- 최종 base Before와 After의 차이는 정확 server/worker 두 파일이고, 두 Before hash는 정확0446e5b 파일과 일치한다. 직전 리뷰 Before와 After의 차이는 output.mjs 하나이며 정확5747487 파일 hash와 일치한다. 최종 테스트/fixture/의존성/안내 고정의 통제 비교임을 문서에서 명시했고 전체 과거 환경 재현으로 표현하지 않았다.
- Before1/8→After8/8 및 직전7/8→8/8의 로그/증거 행,83 PASS/1 SKIP 집계를 확인했다. base의 형식 행렬은1MiB wire timeout으로 완주하지 않았다는 제한도 보존한다. 이번 리뷰에서 Before 사본을 재기동하지는 않았다.
- Codex 자료는 직접 수신 출력의 전사이며 원본 자동 export가 아님을 명시한다. Aside CLI stdout/exit 캡처는 NUL 뒤 누락·circular 오류와 exit0을 구분한다. bounded console LIVE, 기타 예산/이미지/전송 미측정, DOC/HISTORICAL 근거가 분리돼 있다. 출력 계약이 다른 글자 수로 성능 우위를 주장하지 않는다.
- 공개 범용 fflate0.8.3와 기존 QuickJS 사용·버전·라이선스/출처를 확인했다. diff에서 경쟁 제품 원본 코드·추출 번들·제품 WASM 추가는 발견하지 않았다.

## 미검증·차단

- 필수 명령의 환경 차단은 없다.
- 외부 사이트1건은 기존 조건대로 SKIP. 외부/회사 사이트 전체 적합성은 미검증이다.
- 경쟁 Codex/Aside LIVE 실행을 새로 수행하지 않았다. 저장 전사/캡처·hash·범위를 검토했으며 전사만으로 당시 원본 tool payload를 독립 복구할 수 없다.
- 통제 Before를 이번 리뷰에서 재실행하지 않았다. 원시 결과·최종 고정 파일·정확 baseline hash/차이·집계 검증과 현재 After 재실행을 수행했다.
- PNG 전체 표준 적합성/임의 malformed DEFLATE fuzzing, 실제 확장 peak 메모리, OOM/crash는 검증하지 않았다.
- B01D/B01E/B02~B06·전체185REQ 적합성은 범위 밖이다. 문서/계획 검사 PASS를 제품 PASS로 해석하지 않는다.

## 잔여 위험

스트림 inflater가 디코딩한 결과의 길이와 checksum만 맞는다고 압축 입력의 구조적 유효성이 증명되지는 않는다. 현재 재현된 stored LEN/NLEN 반례를 해결하고 정상 압축 방식의 호환성/자원 상한을 유지해야 한다. 다른 DEFLATE 경계는 미재현 조사 후보이며 확정 버그로 올리지 않았다.

다운로드 취소의 과거 간헐 TIMEOUT은 이번 통과만으로 해소됐다고 단정할 수 없다. 장기 실행/동시 요청·late hostcall 수명은 후속 범위와 구분한다.

추가 probe와 필수 테스트의 자기 소유 임시 브라우저·프로필·fixture·bridge는 helper의 finally 경로로 종료했다. 원격 댓글·리뷰·승인·머지를 수행하지 않았다. 최종 원본 HEAD는 동일하며 tracked 작업 트리 변경은 없다.

## 정확 base/head와 판정

- PR: https://github.com/f-lab-piz/browser-control-lab/pull/14
- base: `0446e5b3ae683bb7801184648078f99de96ea55d`
- head: `64f2de4e7bf62413ed93a0382c6c565798430dcf`
- 범위: 전체 base→head diff·연결 코드·B01C6 REQ/7조건·Before/After/안내·증거/비교 등급.
- 판정: **CHANGES_REQUESTED** — P2 1건. 필수 회귀83 PASS/외부1 SKIP 및 headed17 PASS는 확인했으나, 실제 표시 불가능한 손상 PNG를 정상 이미지로 반환하는 입력 검증 경계를 해결한 새 head 검증이 필요하다.
