# 범용 의존성

제품 전용 코드를 복사하지 않고 아래 공개 범용 라이브러리를 사용한다. 실제 버전과 무결성은 package-lock.json에 고정된다.

| 패키지 | 버전 | 용도 | 라이선스 |
|---|---|---|---|
| quickjs-emscripten-core | 0.32.0 | 확장 내부 QuickJS 호스트 | MIT |
| @jitl/quickjs-wasmfile-release-sync | 0.32.0 | 범용 QuickJS WASM 엔진 | MIT |
| acorn | 8.19.0 | REPL 소스 구문 분석 | MIT |
| astring | 1.9.0 | 자체 REPL 변환 후 JS 생성 | MIT |
| esbuild | 0.28.2 | 확장 번들 빌드 | MIT |
| playwright | 1.64.1 | 시험 브라우저 기동·독립 판독 | Apache-2.0 |

QuickJS 원본의 라이선스는 MIT다. 배포 전에는 node_modules 내 라이선스와 전이 의존성의 고지를 함께 포함해야 한다. Aside/Codex 원본 WASM·번들·스냅샷 알고리즘은 사용하지 않았다.
