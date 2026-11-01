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
