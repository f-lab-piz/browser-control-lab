"""누락·순환·부분 PASS를 개발 계획 검사가 거절하는지 확인한다."""
from copy import deepcopy
from pathlib import Path
import json
import unittest
from validate_development_plan import validate

ROOT = Path(__file__).resolve().parents[3]
read = lambda p: json.loads((ROOT / p).read_text())
PLAN = read('planning/implementation-plan.json')
REQS = read('docs/requirements/backlog-map.json')['items']
CASES = read('docs/requirements/condition-index.json')['conditions']


class DevelopmentPlanTest(unittest.TestCase):
    def test_canonical_plan(self):
        validate(PLAN, REQS, CASES)

    def test_missing_or_unsafe_state_is_rejected(self):
        def missing_owner(d): d['slices'][0]['requirements'].pop()
        def cyclic(d): d['slices'][0]['dependsOn'] = [d['slices'][-1]['id']]
        def missing_case(d): d['conditions'].pop()
        def partial_pass(d):
            d['requirements'][0]['status'] = 'pass'
            d['requirements'][0]['evidence'] = ['report.md']
            first = d['requirements'][0]['conditions'][0]
            next(c for c in d['conditions'] if c['id'] == first)['status'] = 'unverified'
        def pass_without_evidence(d):
            d['conditions'][0]['status'] = 'pass'
            d['conditions'][0]['evidence'] = []
        def defer_must(d): d['requirements'][0]['status'] = 'deferred'
        def defer_should_without_decision(d):
            row = next(r for r in d['requirements'] if r['level'] == 'SHOULD')
            row.update(status='deferred', evidence=[])
        def defer_should_with_unresolved_children(d):
            row = next(r for r in d['requirements'] if r['level'] == 'SHOULD')
            row.update(status='deferred', evidence=['decision.md'])
            for case in d['conditions']:
                if case['requirement'] == row['requirement']: case['status'] = 'unverified'
        def invalid_slice(d): d['slices'][0]['status'] = 'INVALID'
        def early_start(d):
            d['slices'][0]['status'] = 'not-started'
            d['slices'][1]['status'] = 'in-progress'
        def false_slice_pass(d):
            d['slices'][0].update(status='pass', evidence=['report.md'])
            first = d['slices'][0]['requirements'][0]
            next(r for r in d['requirements'] if r['requirement'] == first)['status'] = 'unverified'
        def false_completion(d):
            d['status'] = 'complete'
            d['slices'][-1]['status'] = 'not-started'
        for change in [missing_owner, cyclic, missing_case, partial_pass, pass_without_evidence,
                       defer_must, defer_should_without_decision, defer_should_with_unresolved_children,
                       invalid_slice, early_start, false_slice_pass, false_completion]:
            with self.subTest(probe=change.__name__):
                broken = deepcopy(PLAN)
                change(broken)
                with self.assertRaises(AssertionError):
                    validate(broken, REQS, CASES)

    def test_documented_should_deferral_is_allowed(self):
        plan = deepcopy(PLAN)
        row = next(r for r in plan['requirements'] if r['level'] == 'SHOULD')
        row.update(status='deferred', evidence=['decision.md'])
        for case in plan['conditions']:
            if case['requirement'] == row['requirement']:
                case.update(status='deferred', evidence=['decision.md'])
        validate(plan, REQS, CASES)


if __name__ == '__main__':
    unittest.main()
