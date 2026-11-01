# 2차 독립 리뷰 · 메인 판단

고정 f8a275fa35371ba5938fde80cd59620fc67adc3d. P2 3건을 수용하고 3차 고정본에서 재확인한다.

|후보|판단·수정|
|---|---|
|REF2-01|수용. scrollIntoView는개별교차가아닌target∩viewport∩모든clip의누적교집합면적>0을판정한다. V/outer/inner/target반례와oversized정상을C01에고정.|
|REF2-02|수용. MIME소문자정규화후중복key는동일값/빈값이어도전송전 DUPLICATE_MIME_TYPE. files혼합도입력이벤트0/선택보존.|
|REF2-03|수용. 같은Page에이미명시down한주키의press는focus/새key이벤트전 KEY_ALREADY_DOWN. 기존modifier재사용정상과분리하고마지막명시up까지주키보존.|

후보3/수용3/기각0/보류0. 별도 메인 자체점검으로 IDREF의Document/ShadowRoot범위를 명시해 다른트리같은id를이름에섞지않게했고, native indeterminate와customARIA mixed의부모요약을상태표와일치시켰다. MIME허용문자표의backtick/verticalbar는Unicode코드포인트로표기해Markdown표의열구분과혼동하지않게했다. 이자체점검도다음3차의검토대상이다.

새제품·fixture·테스트구현과경쟁신규실측은없다. 1차 REF1-01..03의실제반영은2차독립리뷰가확인했다. 이번후속편집을같은리뷰어가승인했다고표시하지않는다.
