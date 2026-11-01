"""개발 계획의 담당·의존·조건 상태를 정본과 대조한다. 제품 테스트가 아니다."""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[3]


def validate(plan, requirements, conditions):
    slices = {item['id']: item for item in plan['slices']}
    assert len(slices) == len(plan['slices']), 'duplicate slice'
    seen = set()
    for item in plan['slices']:
        assert set(item['dependsOn']) <= seen, (item['id'], 'dependency order/cycle')
        seen.add(item['id'])
    owners = [rid for item in plan['slices'] for rid in item['requirements']]
    canonical = {r['id']: r for r in requirements}
    assert len(owners) == len(set(owners)) and set(owners) == set(canonical), 'REQ ownership'
    mapped = {r['requirement']: r for r in plan['requirements']}
    assert len(mapped) == len(plan['requirements']) and set(mapped) == set(canonical)
    cases = {c['id']: c for c in conditions}
    ledger = {c['id']: c for c in plan['conditions']}
    assert len(ledger) == len(plan['conditions']) and set(ledger) == set(cases)
    for rid, r in mapped.items():
        expected = canonical[rid]
        assert r['slice'] in slices and rid in slices[r['slice']]['requirements'], rid
        assert r['level'] == expected['level'] and r['workItem'] == expected['workItem'], rid
        own = {c['id'] for c in conditions if c['requirement'] == rid}
        assert len(r['conditions']) == len(set(r['conditions'])) and set(r['conditions']) == own, rid
        assert r['status'] in {'unverified', 'in-progress', 'pass', 'fail', 'blocked', 'deferred'}, rid
        assert r['status'] != 'deferred' or r['level'] == 'SHOULD', rid
        if r['status'] == 'pass':
            assert all(ledger[cid]['status'] == 'pass' for cid in own), (rid, 'partial PASS')
    for cid, row in ledger.items():
        rid = cases[cid]['requirement']
        assert row['requirement'] == rid and row['slice'] == mapped[rid]['slice'], cid
        assert row['status'] in {'unverified', 'in-progress', 'pass', 'fail', 'blocked', 'deferred'}, cid
        assert row['status'] != 'deferred' or cases[cid]['level'] == 'SHOULD', cid
        if row['status'] in {'pass', 'fail', 'blocked', 'deferred'}:
            assert row['evidence'], (cid, 'missing evidence/decision')


if __name__ == '__main__':
    read = lambda name: json.loads((ROOT / name).read_text())
    plan = read('planning/implementation-plan.json')
    validate(plan, read('docs/requirements/backlog-map.json')['items'],
             read('docs/requirements/condition-index.json')['conditions'])
    print(json.dumps({'slices': len(plan['slices']), 'requirements': len(plan['requirements']),
                      'conditions': len(plan['conditions']), 'status': 'PLAN_STRUCTURE_PASS'}))
