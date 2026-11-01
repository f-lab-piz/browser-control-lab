"""실제 문서를 바꾸지 않고 연결 오류를 주입하는 문서 검사기 회귀."""
from pathlib import Path
from unittest.mock import patch
import contextlib
import io
import json
import runpy
import unittest

ROOT = Path(__file__).resolve().parents[3]
VALIDATOR = ROOT / 'docs/requirements/tools/validate.py'
READ = Path.read_text


class TraceabilityTest(unittest.TestCase):
    def run_validator(self, target=None, change=None):
        def read(path, *args, **kwargs):
            value = READ(path, *args, **kwargs)
            if target and path.resolve() == ROOT / target:
                data = json.loads(value)
                change(data)
                return json.dumps(data)
            return value
        with patch.object(Path, 'read_text', read), contextlib.redirect_stdout(io.StringIO()):
            runpy.run_path(str(VALIDATOR), run_name='__main__')

    def test_canonical_documents(self):
        self.run_validator()

    def test_broken_links_are_rejected(self):
        probes = [
            ('condition-index.json', lambda d: d['conditions'][0].update(planId='PLAN-NONEXISTENT')),
            ('reference-methods/index.json', lambda d: d['requirements'][0].update(planId='PLAN-NONEXISTENT')),
            ('reference-methods/index.json', lambda d: d['requirements'][0].update(workItem='B99')),
            ('backlog-map.json', lambda d: d.update(items=[])),
            ('condition-verification-map.json', lambda d: d.update(conditions=[])),
            ('condition-verification-map.json', lambda d: d['conditions'][0].update(requirement='REQ-MISSING')),
            ('verification-matrix.json', lambda d: d['requirements'][0]['verification'].update(id='PLAN-NONEXISTENT')),
            ('verification-matrix.json', lambda d: d['requirements'][0]['verification'].update(conditionIds=[])),
        ]
        for filename, change in probes:
            with self.subTest(filename=filename, change=probes.index((filename, change))):
                with self.assertRaises(AssertionError):
                    self.run_validator('docs/requirements/' + filename, change)


if __name__ == '__main__':
    unittest.main()
