"""Exercise the merge gates through their CLI against disposable Git histories."""

from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest


SCRIPT = Path(__file__).resolve().parents[2] / 'change-gates.py'


class ChangeGates(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.repo = Path(self.temp.name)
        self.git('init', '-q')
        self.git('config', 'user.name', 'Gate test')
        self.git('config', 'user.email', 'gate-test@example.invalid')
        self.write('.42p/engineering/2026-10-06_example_allocation_edit-0.1.md',
                   '# Allocation\n\n### A-inputs — Inputs\n\n### A-build — Build\n')
        self.base = self.commit()

    def git(self, *args):
        return subprocess.check_output(['git', *args], cwd=self.repo,
                                       stderr=subprocess.PIPE, text=True).strip()

    def write(self, path, content):
        file = self.repo / path
        file.parent.mkdir(parents=True, exist_ok=True)
        file.write_text(content)

    def commit(self):
        self.git('add', '-A')
        self.git('commit', '-qm', 'Fixture')
        return self.git('rev-parse', 'HEAD')

    def location(self, name='acquire-inputs', archived=True, day='2026-10-06'):
        return '.42p/openspec/changes/' + (f'archive/{day}-' if archived else '') + name

    def report(self, name='acquire-inputs'):
        return f'''---
schema_version: 1
change: {name}
allocation_unit: A-inputs
checked_commit: {self.base}
verdict: passed
coverage:
  allocation_to_change: 100
  change_to_allocation: 100
openspec_verify: passed
repository_checks: passed
applicable_tests: passed
---

# Evidence

Coverage, OpenSpec findings and executable checks are recorded here.
'''

    def add_change(self, name='acquire-inputs', archived=True, report=True, day='2026-10-06'):
        path = self.location(name, archived, day)
        self.write(path + '/.openspec.yaml', 'schema: spec-driven\n')
        self.write(path + '/tasks.md', '- [x] Fixture task\n')
        if report:
            self.write(path + '/verification.md', self.report(name))
        return path

    def run_gate(self, gate='verification', base=None, head=None, passed=True, message=None):
        result = subprocess.run(['python3', str(SCRIPT), gate,
                                 '--base', base or self.base,
                                 '--head', head or self.git('rev-parse', 'HEAD')],
                                cwd=self.repo, capture_output=True, text=True)
        self.assertEqual(result.returncode, 0 if passed else 1, result.stdout + result.stderr)
        if message:
            self.assertIn(message, result.stdout + result.stderr)
        return result

    def test_no_change_is_explicitly_not_applicable(self):
        self.write('tools/canon.txt', 'Maintenance\n')
        self.commit()
        for gate in ('verification', 'archive'):
            self.run_gate(gate, message='not applicable')

    def test_new_archived_change_passes_both_gates(self):
        self.add_change()
        self.commit()
        for gate in ('verification', 'archive'):
            self.run_gate(gate, message='passed for acquire-inputs')

    def test_active_change_verifies_but_cannot_merge(self):
        self.add_change(archived=False)
        self.commit()
        self.run_gate()
        self.run_gate('archive', passed=False, message='still active')

    def test_site_units_with_underscores_require_exact_allocated_handle(self):
        units = ('A-site_shell', 'A-site_docs', 'A-site_demo')
        self.write('.42p/engineering/2026-10-06_example_allocation_edit-0.1.md',
                   '# Allocation\n\n' + ''.join(f'### {unit} — Site\n\n' for unit in units))
        path = self.add_change()
        for unit in units:
            with self.subTest(unit=unit):
                self.write(path + '/verification.md', self.report().replace('A-inputs', unit))
                self.commit()
                self.run_gate(message='passed for acquire-inputs')
        for unit in ('A-site', 'A-site_unknown'):
            with self.subTest(unit=unit):
                self.write(path + '/verification.md', self.report().replace('A-inputs', unit))
                self.commit()
                self.run_gate(passed=False, message='must identify a unit')

    def test_active_change_without_report_fails(self):
        self.add_change(archived=False, report=False)
        self.commit()
        for gate in ('verification', 'archive'):
            self.run_gate(gate, passed=False, message='Missing required artifact')

    def test_move_from_base_active_to_archive_is_recognized(self):
        active = self.add_change(archived=False)
        self.base = self.commit()
        archived = self.repo / self.location()
        archived.parent.mkdir(parents=True)
        shutil.move(self.repo / active, archived)
        self.commit()
        for gate in ('verification', 'archive'):
            self.run_gate(gate)

    def test_deletion_without_archive_fails(self):
        path = self.add_change(archived=False)
        self.base = self.commit()
        shutil.rmtree(self.repo / path)
        self.commit()
        for gate in ('verification', 'archive'):
            self.run_gate(gate, passed=False, message='deleted without')

    def test_unchanged_active_and_archive_are_ignored(self):
        self.add_change('other-active', archived=False, report=False)
        self.add_change('other-archive', report=False)
        self.base = self.commit()
        self.write('README.md', 'Maintenance\n')
        self.commit()
        for gate in ('verification', 'archive'):
            self.run_gate(gate, message='not applicable')

    def test_changed_existing_archive_is_checked(self):
        path = self.add_change()
        self.base = self.commit()
        self.write(path + '/verification.md', self.report().replace('verdict: passed', 'verdict: failed'))
        self.commit()
        self.run_gate(passed=False, message='verdict: failed')

    def test_duplicate_active_and_archive_fails(self):
        self.add_change()
        self.add_change(archived=False)
        self.commit()
        for gate in ('verification', 'archive'):
            self.run_gate(gate, passed=False, message='multiple locations')

    def test_duplicate_archives_fail(self):
        self.add_change()
        self.add_change(day='2026-10-05')
        self.commit()
        self.run_gate(passed=False, message='multiple locations')

    def test_one_failed_change_blocks_all(self):
        self.add_change('first')
        path = self.add_change('second')
        self.write(path + '/verification.md', self.report('second').replace('verdict: passed', 'verdict: blocked'))
        self.commit()
        self.run_gate(passed=False, message='second: verdict: blocked')

    def test_all_invalid_frontmatter_variants_fail(self):
        path = self.add_change()
        original = self.report()
        variants = {
            'missing': original.replace('schema_version: 1\n', ''),
            'duplicate': original.replace('schema_version: 1', 'schema_version: 1\nschema_version: 1'),
            'nested duplicate': original.replace('  allocation_to_change: 100',
                '  allocation_to_change: 100\n  allocation_to_change: 100'),
            'unknown': original.replace('schema_version: 1', 'schema_version: 1\nextra: passed'),
            'unknown nested': original.replace('  allocation_to_change: 100', '  surprise: 100'),
            'unsupported version': original.replace('schema_version: 1', 'schema_version: 2'),
            'string version': original.replace('schema_version: 1', 'schema_version: "1"'),
            'mismatched identity': original.replace('change: acquire-inputs', 'change: other'),
            'unknown allocation': original.replace('allocation_unit: A-inputs', 'allocation_unit: A-unknown'),
            'short SHA': original.replace(self.base, '123abc'),
            'coverage incomplete': original.replace('allocation_to_change: 100', 'allocation_to_change: 99'),
            'coverage null': original.replace('change_to_allocation: 100', 'change_to_allocation: null'),
            'coverage boolean': original.replace('change_to_allocation: 100', 'change_to_allocation: true'),
            'coverage overflow': original.replace('change_to_allocation: 100', 'change_to_allocation: 101'),
            'flow mapping': original.replace('coverage:\n  allocation_to_change: 100\n  change_to_allocation: 100',
                                            'coverage: {allocation_to_change: 100, change_to_allocation: 100}'),
            'tab indentation': original.replace('  allocation_to_change', '\tallocation_to_change'),
            'unclosed': original.replace('---\n\n# Evidence', '# Evidence'),
            'missing body': original.split('# Evidence')[0],
            'no delimiter': original.removeprefix('---\n'),
        }
        for key in ('verdict', 'openspec_verify', 'repository_checks', 'applicable_tests'):
            for state in ('failed', 'blocked', 'unknown'):
                variants[key + state] = original.replace(f'{key}: passed', f'{key}: {state}')
        for case, text in variants.items():
            with self.subTest(case=case):
                self.write(path + '/verification.md', text)
                self.commit()
                self.run_gate(passed=False)

    def test_numeric_100_point_zero_and_comments_pass(self):
        path = self.add_change()
        text = self.report().replace('schema_version: 1', '# Format\nschema_version: 1').replace(': 100', ': 100.0')
        self.write(path + '/verification.md', text)
        self.commit()
        self.run_gate()

    def test_symlink_report_fails(self):
        path = self.add_change(report=False)
        self.write('report.md', self.report())
        (self.repo / path / 'verification.md').symlink_to('../../../../report.md')
        self.commit()
        self.run_gate(passed=False, message='regular Git file')

    def test_missing_change_metadata_fails(self):
        path = self.add_change()
        (self.repo / path / '.openspec.yaml').unlink()
        self.commit()
        self.run_gate(passed=False, message='.openspec.yaml')

    def test_invalid_archive_date_fails(self):
        self.add_change(day='2026-02-30')
        self.commit()
        self.run_gate(passed=False, message='Invalid archive date')

    def test_diff_uses_merge_base_not_unrelated_base_updates(self):
        self.git('branch', 'base-side')
        self.add_change()
        head = self.commit()
        self.git('checkout', '-q', 'base-side')
        self.add_change('unrelated', archived=False, report=False)
        advanced_base = self.commit()
        self.run_gate(base=advanced_base, head=head)

    def test_zero_diff_is_not_applicable(self):
        self.run_gate(message='not applicable')

    def test_inaccessible_commit_and_short_ref_fail(self):
        self.run_gate(base='0' * 40, passed=False)
        self.run_gate(base='HEAD', passed=False, message='full 40-character')


if __name__ == '__main__':
    unittest.main()
