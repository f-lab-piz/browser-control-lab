# 범용 의존성

제품 전용 코드를 복사하지 않고 아래 공개 범용 라이브러리를 사용한다. 실제 버전과 무결성은 package-lock.json에 고정된다.

| 패키지 | 버전 | 용도 | 라이선스 |
|---|---|---|---|
| quickjs-emscripten-core | 0.32.0 | 확장 내부 QuickJS 호스트 | MIT |
| @jitl/quickjs-wasmfile-release-sync | 0.32.0 | 범용 QuickJS WASM 엔진 | MIT |
| fast-png | 8.0.0 | PNG 실제 디코딩·CRC 검증 | MIT |
| fflate | 0.8.3 | 작은 입력 조각의 스트림으로 PNG 압축 해제 경계 검증 | MIT |
| acorn | 8.19.0 | REPL 소스 구문 분석 | MIT |
| esbuild | 0.28.2 | 확장 번들 빌드 | MIT |
| playwright | 1.64.1 | 시험 브라우저 기동·독립 판독 | Apache-2.0 |

QuickJS 원본의 라이선스는 MIT다. 배포 전에는 node_modules 내 라이선스와 전이 의존성의 고지를 함께 포함해야 한다. Aside/Codex 원본 WASM·번들·스냅샷 알고리즘은 사용하지 않았다.

0.2.0부터 top-level 선언을 전역 속성으로 바꾸지 않는다. QuickJS의 global async/strict 평가를 사용하며, 플래그 의미는 [공식 quickjs.h](https://github.com/bellard/quickjs/blob/master/quickjs.h)의 JS_Eval flags를 참고했다. 설치된 범용 WASM0.32.0에서 실제 확장 경로로 지원을 검증한다. 원본 제품 코드와 별개인 범용 엔진의 공개 인터페이스다.

PNG 검증은 [fast-png 공개 API](https://github.com/image-js/fast-png)의 decode/checkCrc와 [fflate 공개 API](https://github.com/101arrowz/fflate)의 작은 입력 조각을 받는 Unzlib 스트림을 사용한다. ICC/압축 텍스트도 같은 확장 예산으로 검증하고 pixel decoder에는 제거한 내부 검증용 사본만 넘겨 중복 무제한 해제를 막는다. 모델로 반환하는 원본 bytes는 바꾸지 않는다. 별도의 입력 길이·scanline·zlib checksum 검증을 적용해 선언 크기가 작은 압축 폭탄을 정상 이미지로 취급하지 않는다.
