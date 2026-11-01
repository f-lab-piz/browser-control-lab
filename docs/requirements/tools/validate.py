"""문서 구조/추적/제품 동결 검사. 제품 테스트/브라우저 실행이 아니다. 실제 Git checkout에서 실행한다."""
from pathlib import Path
import re,json,hashlib,subprocess,collections,os
os.chdir(Path(__file__).resolve().parents[3])
R=Path('docs/requirements');D=R/'reference-methods';i=json.loads((R/'index.json').read_text());m=json.loads((R/'verification-matrix.json').read_text());c=json.loads((R/'condition-index.json').read_text())['conditions'];r=json.loads((D/'index.json').read_text());e=json.loads((D/'evidence-index.json').read_text());ids={x['id'] for x in m['requirements']};caseids={x['id'] for x in c}
assert len(ids)==len(m['requirements']);assert len(caseids)==len(c)
assert ids=={x['id'] for x in r['requirements']}
assert {x['requirement'] for x in c}==ids
claims={x['id'] for x in e['claims']};sources={x['id'] for x in e['sources']}
assert all(x['sourceId'] in sources for x in e['claims'])
for entry in i['external']+i['internal']+i['common']:
 p=R/entry['path'];s=p.read_text();assert re.findall(r'^### (REQ-[A-Z0-9-]+)$',s,re.M)==entry['requirements']
 for rid in entry['requirements']:
  b=re.search(r'(?ms)^### '+re.escape(rid)+r'\n(.*?)(?=^### |^## |\Z)',s)[1];v=next(x for x in m['requirements'] if x['id']==rid)['verification']
  for key in ['Given','When','Then']:assert re.search(r'(?m)^- '+key+': (.+)$',b)[1]==v[key.lower()],(rid,key)
for x in c:
 s=(R/x['spec']).read_text();b=re.search(r'(?ms)^#### '+re.escape(x['id'])+r'\n(.*?)(?=^#### |^### |^## |\Z)',s);assert b,x['id']
 for k in ['조건','준비','실행','판정']:assert re.search(r'(?m)^- '+k+': .+$',b[1]),(x['id'],k)
for x in r['requirements']:
 assert {s['provider'] for s in x['slots']}=={'codex','aside'}
 for s in x['slots']:
  assert {z['conditionId'] for z in s['conditions']}=={z['id'] for z in c if z['requirement']==x['id']}
  assert all(k in claims for k in s['relatedClaims'])
  path,anchor=s['reference'].split('#');text=(D/path).read_text();assert '## '+anchor in text
# REQ/PLAN/backlog 및 조건별 검증계획의 교차 연결을 검사한다.
b=json.loads((R/'backlog-map.json').read_text())['items']
cm=json.loads((R/'condition-verification-map.json').read_text())['conditions']
assert len({x['id'] for x in b})==len(b) and {x['id'] for x in b}==ids
assert len({x['id'] for x in cm})==len(cm) and {x['id'] for x in cm}==caseids
bm={x['id']:x for x in b}; mm={x['id']:x for x in m['requirements']}; rm={x['id']:x for x in r['requirements']}; cmm={x['id']:x for x in cm}
plans=set()
for rid in ids:
    entry=mm[rid]; backlog=bm[rid]; reference=rm[rid]
    plan=entry['verification']['id']; expected=rid.replace('REQ-', 'PLAN-', 1)
    assert plan==expected and plan not in plans,(rid,'parent PLAN'); plans.add(plan)
    assert backlog['verificationId']==reference['planId']==plan,(rid,'PLAN links')
    assert backlog['workItem']==reference['workItem'] and backlog['workItem'] in {'B01','B02','B03','B04','B05','B06'},(rid,'work item')
    assert backlog['api']==entry['api'] and backlog['level']==entry['level'],(rid,'backlog metadata')
    assert reference['spec']==entry['spec'] and entry['anchor']==rid.lower(),(rid,'spec/anchor')
    own=[x for x in c if x['requirement']==rid]
    assert set(entry['verification']['conditionIds'])=={x['id'] for x in own},(rid,'condition set')
    assert len(entry['verification']['conditionIds'])==len(own),(rid,'duplicate condition')
    for condition in own:
        cid=condition['id']; mapped=cmm[cid]; expected=plan+'.'+cid.rsplit('-',1)[1]
        assert condition['planId']==mapped['planId']==expected,(cid,'condition PLAN')
        assert condition['workItem']==mapped['workItem']==backlog['workItem'],(cid,'condition work item')
        assert condition['spec']==mapped['spec']==entry['spec'],(cid,'condition spec')
        assert condition['anchor']==mapped['anchor']==cid.lower(),(cid,'condition anchor')
        assert condition['level']==entry['level'] and condition['api']==entry['api'],(cid,'condition metadata')
        assert mapped['requirement']==rid,(cid,'condition parent')
        assert expected not in plans,(cid,'duplicate PLAN'); plans.add(expected)
catalog=json.loads(Path('docs/api-catalog.json').read_text())
for category in ['external','internal']:
    names=[x['name'] for x in i[category]]
    assert len(names)==len(set(names)) and set(names)=={x['name'] for x in catalog[category]},category

f=json.loads((R/'evidence/product-freeze.json').read_text())
for p,h in f['paths'].items():
 assert hashlib.sha256(Path(p).read_bytes()).hexdigest()==h
 assert subprocess.check_output(['git','show',f['baseline']+':'+p])==Path(p).read_bytes()
print(json.dumps({'requirements':len(ids),'detailedCases':len(c),'slots':len(ids)*2,'conditionUnits':len(c)*2,'claims':len(claims),'sources':len(sources),'productFilesUnchanged':len(f['paths']),'status':'DOCUMENT_STRUCTURE_ONLY_PASS'}))

for c in e['claims']:
 assert (D/c['sourceFile']).is_file(),c['id']
for source in e['sources']:
 assert (D/source['registry']).is_file(),source['id']
for run in e['runs']:
 assert (D/run['file']).is_file(),run['id']
for p in R.rglob('*.md'):
 if '/reference-methods/evidence/' in str(p):continue
 for target in re.findall(r'\]\(([^)]+)\)',p.read_text()):
  if '://' in target or target.startswith('#'):continue
  assert (p.parent/target.split('#')[0]).exists(),(p,target)
print('All canonical local links, source registries and run artifacts exist.')
