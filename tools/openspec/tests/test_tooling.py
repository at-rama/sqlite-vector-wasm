import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest

SOURCE = Path(__file__).resolve().parents[1]


class ToolingTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        shutil.copytree(SOURCE, self.root / 'tools/openspec', ignore=shutil.ignore_patterns('tests'))
        shutil.copyfile(SOURCE.parent / 'openspec.sh', self.root / 'tools/openspec.sh')
        self.install = self.root / '.work/openspec'
        self.install.mkdir(parents=True)
        for name in ('package.json', 'package-lock.json'):
            shutil.copyfile(SOURCE / name, self.install / name)
        self.lock = json.loads((SOURCE / 'package-lock.json').read_text())
        for path, entry in self.lock['packages'].items():
            if path:
                folder = self.install / path
                folder.mkdir(parents=True, exist_ok=True)
                (folder / 'package.json').write_text(json.dumps({'version': entry['version'], 'type': 'module'}))
        self.cli = self.install / 'node_modules/@fission-ai/openspec/bin/openspec.js'
        self.cli.parent.mkdir()
        self.cli.write_text("console.log(process.argv[2] === '--version' ? '1.14.0' : process.cwd());\n")
        self.skill = self.root / '.42p/.agents/skills/openspec-verify-change/SKILL.md'
        self.skill.parent.mkdir(parents=True)
        self.skill.write_text('---\nmetadata:\n  generatedBy: "1.14.0"\n---\n')
        for name in ('propose', 'explore', 'apply-change', 'update-change', 'sync-specs', 'archive-change'):
            folder = self.skill.parents[1] / ('openspec-' + name)
            folder.mkdir()
            shutil.copyfile(self.skill, folder / 'SKILL.md')

    def run_tool(self, *args):
        return subprocess.run(['sh', str(self.root / 'tools/openspec.sh'), *args],
                              cwd=self.root.parent, capture_output=True, text=True)

    def assert_blocked(self, text):
        result = self.run_tool('exec', 'list')
        self.assertNotEqual(result.returncode, 0, result.stdout)
        self.assertIn(text, result.stderr)
        self.assertNotIn(str(self.root / '.42p'), result.stdout)

    def test_conforming_install_and_project_directory(self):
        self.assertEqual(self.run_tool('check').returncode, 0)
        result = self.run_tool('exec', 'list')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stdout.strip(), str(self.root / '.42p'))

    def test_missing_install_fails_without_fallback(self):
        shutil.rmtree(self.install)
        self.assert_blocked('ENOENT')

    def test_changed_lock_requires_reinstall(self):
        with (self.install / 'package-lock.json').open('a') as stream:
            stream.write('\n')
        self.assert_blocked('differs')

    def test_wrong_cli_version_blocks_command(self):
        self.cli.write_text("console.log('1.15.0');\n")
        self.assert_blocked('CLI reports 1.15.0')

    def test_cli_failure_blocks_command(self):
        self.cli.write_text('process.exit(7);\n')
        self.assert_blocked('failed (7)')

    def test_transitive_version_drift_blocks_command(self):
        path = next(p for p in self.lock['packages'] if p and p != 'node_modules/@fission-ai/openspec')
        (self.install / path / 'package.json').write_text('{"version":"0.0.0"}')
        self.assert_blocked('dependency differs')

    def test_generated_version_drift_blocks_command(self):
        self.skill.write_text('---\nmetadata:\n  generatedBy: "1.13.0"\n---\n')
        self.assert_blocked('does not match')

    def test_missing_required_skill_blocks_command(self):
        self.skill.unlink()
        self.assert_blocked('ENOENT')

    def test_requested_command_failure_is_propagated(self):
        self.cli.write_text("if (process.argv[2] === '--version') console.log('1.14.0'); else process.exit(9);\n")
        self.assert_blocked('failed (9)')

    def test_floating_manifest_is_rejected(self):
        path = self.root / 'tools/openspec/package.json'
        manifest = json.loads(path.read_text())
        manifest['dependencies']['@fission-ai/openspec'] = '^1.14.0'
        path.write_text(json.dumps(manifest))
        self.assert_blocked('exact release')

    def test_missing_integrity_is_rejected(self):
        path = self.root / 'tools/openspec/package-lock.json'
        del self.lock['packages']['node_modules/@fission-ai/openspec']['integrity']
        path.write_text(json.dumps(self.lock))
        self.assert_blocked('Missing registry integrity')


if __name__ == '__main__':
    unittest.main()
