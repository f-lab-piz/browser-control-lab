# 범용 의존성

제품 전용 코드를 복사하지 않고 아래 공개 범용 라이브러리를 사용한다. 실제 버전과 무결성은 package-lock.json에 고정된다.

| 패키지 | 버전 | 용도 | 라이선스 |
|---|---|---|---|
| quickjs-emscripten-core | 0.32.0 | 확장 내부 QuickJS 호스트 | MIT |
| @jitl/quickjs-wasmfile-release-sync | 0.32.0 | 범용 QuickJS WASM 엔진 | MIT |
| pako | 3.0.3 | 고정 출력 조각 스트림으로 PNG zlib/DEFLATE·체크섬 검증 | MIT AND Zlib |
| acorn | 8.19.0 | REPL 및 전달할 페이지 함수 소스 구문 분석 | MIT |
| esbuild | 0.28.2 | 확장 번들 빌드 | MIT |
| playwright | 1.64.1 | 시험 브라우저 기동·독립 판독 | Apache-2.0 |

QuickJS 원본의 라이선스는 MIT다. 배포 전에는 node_modules 내 라이선스와 전이 의존성의 고지를 함께 포함해야 한다. Aside/Codex 원본 WASM·번들·스냅샷 알고리즘은 사용하지 않았다.

0.2.0부터 top-level 선언을 전역 속성으로 바꾸지 않는다. QuickJS의 global async/strict 평가를 사용하며, 플래그 의미는 [공식 quickjs.h](https://github.com/bellard/quickjs/blob/master/quickjs.h)의 JS_Eval flags를 참고했다. 설치된 범용 WASM0.32.0에서 실제 확장 경로로 지원을 검증한다. 원본 제품 코드와 별개인 범용 엔진의 공개 인터페이스다.

PNG 검증은 [W3C PNG 표준](https://www.w3.org/TR/png-3/)의 색상·팔레트·Adam7·행 필터 규칙을 자체 스트리밍 검사기로 구현하고 [pako 공개 API](https://nodeca.github.io/pako/classes/Inflate.html)의 고정64KiB 출력 조각 Inflate 스트림을 사용한다. 파일 전체 CRC·scanline·Adler·DEFLATE stored LEN/NLEN·zlib 완결성을 검증하고 원본 bytes를 유지한다. fflate0.8.3은 잘못된 LEN/NLEN 압축 스트림을 수용하는 실제 반례로 제품에서 제거했으며 과거 비교에만 쓴다. 초기 PR14의 fast-png8.0.0 범용 decoder는 잘못된/과도한 구조 수용과 정상 저비트 Adam7 거절이 확인되어 현재 제품 의존성에서 제거했다. 과거 Before 재현에만 해당 당시 fast-png8.0.0/iobuffer/fflate를 ignored scratch에 공급한다. 원본 경쟁 제품의 코드/번들/WASM을 사용하지 않는다.
