# PR20 B02A 라벨 경계 독립 리뷰와 대응

- 리뷰어: gpt-6.1-sol / high / 새 컨텍스트, tracked/원격 변경 없음.
- base:0452cbe2474ed73069167c43d683ae1514c4f29c → head:a59c560245e40e6842b580c9e9b8864aef9bb8f1.
- 판정: CHANGES_REQUESTED, P2 한 건. [독립 원문](../evidence/b02a/reviewer-label-report.txt).

명시 label 없는 placeholder-only input에 `getByLabel(/^$/)`이 count1을 반환하고 fill이 실제 trusted input을 발생시켰다. 같은 입력/하니스에서 소유2파일만 정확 base로 복원하면 이 패턴은 count0·입력거절·값/이벤트 불변이었다. base의 모든 정규식 경계가 정상이라는 뜻은 아니다. 후속 정식 테스트에서 더 넓은 `/.*/`/빈 패턴도 함께 검사한다.

메인은 정본의 명시 label 연결 제한 위반으로 수용했다. 라벨 부재는 null, 유효한 빈 IDREF/연결 native label의 빈 이름은 문자열로 분리하여 regex 전에 provenance를 제한한다. 비어 있는 aria-label만 있거나 깨진 IDREF만 있는 경우 연결을 만들지 않는다. 기존 role 이름과 문자열 빈label 입력거절은 유지한다.

독립 검증은 전체130 PASS/외부1 SKIP·단독headed44 PASS, validators/Python6 PASS였지만 이 추가 경계를 놓쳤다. 추가4그룹 제품 probe도 통과했다. 리뷰의 제품 실패와 native fixture oracle을 별도로 보존하고 이 판정을 PASS로 바꾸지 않는다. 수정 후의 정확 새head 독립 리뷰가 필요하다.
