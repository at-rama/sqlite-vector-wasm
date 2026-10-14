import base64
import copy
import hashlib
import importlib.util
import io
import json
import os
from pathlib import Path
import shutil
import tarfile
import tempfile
import unittest
import warnings
import zipfile

ROOT = Path(__file__).resolve().parents[3]
spec = importlib.util.spec_from_file_location('update_notices', ROOT / 'tools/updates/notices.py')
n = importlib.util.module_from_spec(spec)
spec.loader.exec_module(n)


class NoticesTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.repo = self.root / 'repository'
        for name in ['inputs/sources.lock.json', 'tools/package/notices.json', 'LICENSE', 'tools/package/NOTICE.txt']:
            out = self.repo / name
            out.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(ROOT / name, out)
        shutil.copytree(ROOT / 'tools/package/notices', self.repo / 'tools/package/notices')
        self.baseline = json.loads((self.repo / 'inputs/sources.lock.json').read_text())
        self.baseline['sqlite'].update(version='3.53.4', archiveUrl='https://sqlite.org/2026/sqlite-src-3530400.zip', releaseUrl='https://sqlite.org/releaselog/3_53_4.html')
        self.baseline['sqliteVec'].update(version='0.1.9', archiveUrl='https://github.com/asg017/sqlite-vec/releases/download/v0.1.9/sqlite-vec-0.1.9-amalgamation.tar.gz', releaseUrl='https://github.com/asg017/sqlite-vec/releases/tag/v0.1.9')
        (self.repo / 'inputs/sources.lock.json').write_text(json.dumps(self.baseline) + '\n')
        records = json.loads((self.repo / 'tools/package/notices.json').read_text())
        for record in records['notices']:
            if record['project'] in self.baseline:
                record['version'] = self.baseline[record['project']]['version']
                record['origin'] = 'controlled offline fixture'
                record.pop('source', None)
        (self.repo / 'tools/package/notices.json').write_text(json.dumps(records) + '\n')
        self.selected = copy.deepcopy(self.baseline)
        self.selected['sqlite'].update(version='3.54.0', archiveUrl='https://sqlite.org/2026/sqlite-src-3540000.zip', releaseUrl='https://sqlite.org/releaselog/3_54_0.html')
        self.selected['sqliteVec'].update(version='0.1.10-alpha.1', archiveUrl='https://github.com/asg017/sqlite-vec/releases/download/v0.1.10-alpha.1/sqlite-vec-0.1.10-alpha.1-amalgamation.tar.gz', releaseUrl='https://github.com/asg017/sqlite-vec/releases/tag/v0.1.10-alpha.1')
        self.directory = self.repo / '.work/updates/run-test'
        self.directory.mkdir(parents=True)
        self.requests = []
        self.files = {'LICENSE-MIT': b'MIT wording  \n\n', 'LICENSE-APACHE': b'Apache wording\t\n'}
        self.commit, self.tree, self.tag = 'a' * 40, 'b' * 40, 'c' * 40
        self.bad_blob = False
        self.annotated = False
        self.bad_kind = False
        self.git_entries = []
        self.blobs = {}
        for name, raw in self.files.items():
            oid = hashlib.sha1(b'blob ' + str(len(raw)).encode() + b'\0' + raw).hexdigest()
            self.git_entries.append({'path': name, 'type': 'blob', 'mode': '100644', 'sha': oid})
            self.blobs[oid] = raw

    def archives(self, *, vec_notices=False, missing_sqlite=False, unsafe=False, duplicate=False, link=False, ambiguous=False):
        sql = io.BytesIO()
        with zipfile.ZipFile(sql, 'w') as z:
            for name, data in [('configure', '#!/bin/sh\n'), ('Makefile.in', 'make\n'), ('src/sqlite.h.in', 'header\n'), ('ext/wasm/GNUmakefile', 'wasm\n'),
                               ('LICENSE.md', 'SQLite wording  \n\n'), ('ext/wasm/api/sqlite3-license-version-header.js', '/* @preserve\n** WASM license  \n*/\nconst version = "not a notice";\n')]:
                if missing_sqlite and name == 'LICENSE.md':
                    continue
                info = zipfile.ZipInfo('sqlite-src-' + n.inputs.sqlite_code(self.selected['sqlite']['version']) + '/' + name)
                info.external_attr = (0o100755 if name == 'configure' else 0o100644) << 16
                z.writestr(info, data)
            if unsafe:
                z.writestr('../escape', 'bad')
            if duplicate:
                z.writestr('duplicate.txt', 'one')
                with warnings.catch_warnings():
                    warnings.simplefilter('ignore', UserWarning)
                    z.writestr('duplicate.txt', 'two')
            if link:
                info = zipfile.ZipInfo('symlink'); info.create_system = 3; info.external_attr = 0o120777 << 16
                z.writestr(info, 'target')
        vec = io.BytesIO()
        with tarfile.open(fileobj=vec, mode='w:gz') as t:
            files = {'sqlite-vec.c': b'C\n', 'sqlite-vec.h': b'header\n'}
            if vec_notices:
                files.update(self.files)
            if ambiguous:
                files.update({'one/LICENSE-MIT': b'one', 'two/LICENSE-MIT': b'two'})
            for name, raw in files.items():
                info = tarfile.TarInfo(name); info.size = len(raw)
                t.addfile(info, io.BytesIO(raw))
        self.archives_by_url = {self.selected['sqlite']['archiveUrl']: sql.getvalue(), self.selected['sqliteVec']['archiveUrl']: vec.getvalue()}
        for project in ('sqlite', 'sqliteVec'):
            data = self.archives_by_url[self.selected[project]['archiveUrl']]
            algorithm = self.selected[project]['digest']['algorithm'].replace('-', '_')
            self.selected[project]['digest']['value'] = hashlib.new(algorithm, data).hexdigest()

    def fetch(self, url, destination):
        self.requests.append(url)
        if url in self.archives_by_url:
            destination.write_bytes(self.archives_by_url[url]); return
        if getattr(self, 'transport_failure', False):
            raise OSError('private transport body must not enter the diagnostic')
        path = url.removeprefix(n.API)
        if path.startswith('/git/ref/tags/v'):
            value = {'ref': 'refs/tags/v' + self.selected['sqliteVec']['version'], 'object': {'type': 'tag' if self.annotated else 'commit', 'sha': self.tag if self.annotated else self.commit}}
        elif path == '/git/tags/' + self.tag:
            value = {'sha': self.tag, 'object': {'type': 'commit', 'sha': self.commit}}
        elif path == '/git/commits/' + self.commit:
            value = {'sha': self.commit, 'tree': {'sha': self.tree}}
        elif path == '/git/trees/' + self.tree:
            entries = copy.deepcopy(self.git_entries)
            if self.bad_kind:
                entries[0]['mode'] = '120000'
            value = {'sha': self.tree, 'truncated': False, 'tree': entries}
        elif path.startswith('/git/blobs/'):
            oid = path.rsplit('/', 1)[1]; raw = self.blobs[oid]
            value = {'sha': oid, 'encoding': 'base64', 'content': base64.b64encode(raw + b'x' if self.bad_blob else raw).decode(), 'size': len(raw)}
        else:
            raise AssertionError('Unexpected request ' + url)
        destination.write_text(json.dumps(value))

    def run_reconcile(self):
        return n.reconcile(self.repo, self.selected, self.directory, fetch=self.fetch)

    def test_archive_first_normalization_header_and_metadata(self):
        self.archives(vec_notices=True)
        before = (self.repo / 'tools/package/notices.json').read_bytes()
        result = self.run_reconcile()
        prepared = Path(result['prepared'])
        records = json.loads((prepared / 'tools/package/notices.json').read_text())['notices']
        expected = {'SQLite-LICENSE.txt': b'SQLite wording\n', 'SQLite-WASM-NOTICE.txt': b'/* @preserve\n** WASM license\n*/\n', 'sqlite-vec-MIT.txt': b'MIT wording\n', 'sqlite-vec-APACHE.txt': b'Apache wording\n'}
        for record in records:
            data = (prepared / 'tools/package/notices' / record['name']).read_bytes()
            if record['name'] in expected:
                self.assertEqual(data, expected[record['name']])
                self.assertEqual(record['sha256'], hashlib.sha256(expected[record['name']]).hexdigest())
                self.assertEqual(record['version'], self.selected[record['project']]['version'])
                self.assertEqual(record['source']['kind'], 'archive')
                self.assertEqual(record['source']['archiveDigest'], self.selected[record['project']]['digest'])
            else:
                old = json.loads(before)['notices'][records.index(record)]
                self.assertEqual(record, old)
        self.assertEqual((self.repo / 'tools/package/notices.json').read_bytes(), before)
        self.assertFalse((self.repo / '.work/inputs').exists())
        self.assertFalse(any('/git/' in url for url in self.requests))

    def test_missing_vec_licenses_use_one_immutable_annotated_tag(self):
        self.archives(); self.annotated = True
        result = self.run_reconcile()
        records = json.loads((Path(result['prepared']) / 'tools/package/notices.json').read_text())['notices'][2:4]
        for record in records:
            source = record['source']
            self.assertEqual(source['commit'], self.commit)
            self.assertEqual(source['tag'], 'v0.1.10-alpha.1')
            self.assertEqual(source['sha256'], hashlib.sha256(self.files[source['path']]).hexdigest())
            self.assertIn('/blob/' + self.commit + '/', record['origin'])
        self.assertEqual(sum('/git/ref/' in url for url in self.requests), 1)
        self.assertFalse(list(self.directory.glob('git-*.json')))

    def test_unchanged_pair_is_byte_preserving_without_fetch(self):
        self.selected = copy.deepcopy(self.baseline)
        result = n.reconcile(self.repo, self.selected, self.directory, acquire=lambda *_: self.fail('acquisition'), fetch=lambda *_: self.fail('network'))
        self.assertEqual((Path(result['prepared']) / 'tools/package/notices.json').read_bytes(), (self.repo / 'tools/package/notices.json').read_bytes())
        report = json.loads(Path(result['reportPath']).read_text())
        self.assertTrue(all(item['disposition'] == 'retained' and item['rawSource'] == 'not-established' for item in report['notices']))
        self.assertNotIn('acquisition', report)

    def test_failures_retain_diagnostics_and_do_not_change_inputs(self):
        for mode in ['digest', 'unsafe', 'duplicate', 'link', 'missing', 'ambiguous', 'blob', 'kind', 'transport']:
            with self.subTest(mode=mode):
                self.directory = self.repo / '.work/updates' / mode; self.directory.mkdir()
                self.archives(missing_sqlite=mode == 'missing', unsafe=mode == 'unsafe', duplicate=mode == 'duplicate', link=mode == 'link', ambiguous=mode == 'ambiguous')
                self.bad_blob = mode == 'blob'; self.bad_kind = mode == 'kind'
                if mode == 'digest': self.selected['sqlite']['digest']['value'] = '0' * 64
                before = (self.repo / 'tools/package/notices.json').read_bytes()
                self.transport_failure = mode == 'transport'
                with self.assertRaises(Exception): self.run_reconcile()
                report = json.loads((self.directory / 'notices.json').read_text())
                self.assertEqual(report['status'], 'failed')
                self.assertIn(report['failure']['project'], ('sqlite', 'sqliteVec'))
                self.assertTrue(report['failure']['notices'])
                self.assertEqual((self.repo / 'tools/package/notices.json').read_bytes(), before)
                self.assertFalse((self.repo / '.work/inputs').exists())


    def test_single_upstream_groups_and_same_wording_new_version(self):
        for changed in ('sqlite', 'sqliteVec'):
            with self.subTest(changed=changed):
                other = 'sqliteVec' if changed == 'sqlite' else 'sqlite'
                self.selected[other] = copy.deepcopy(self.baseline[other])
                self.directory = self.repo / '.work/updates' / changed
                self.directory.mkdir()
                self.archives(vec_notices=True)
                before = json.loads((self.repo / 'tools/package/notices.json').read_text())
                if changed == 'sqlite':
                    # Independently specified identical normalized wording still needs new provenance.
                    (self.repo / 'tools/package/notices/SQLite-LICENSE.txt').write_bytes(b'SQLite wording\n')
                    before['notices'][0]['sha256'] = hashlib.sha256(b'SQLite wording\n').hexdigest()
                    (self.repo / 'tools/package/notices.json').write_text(json.dumps(before) + '\n')
                result = self.run_reconcile()
                manifest = json.loads((Path(result['prepared']) / 'tools/package/notices.json').read_text())
                for old, record in zip(before['notices'], manifest['notices']):
                    if record['project'] != changed:
                        self.assertEqual(record, old)
                    else:
                        self.assertIn('source', record)
                        self.assertEqual(record['version'], self.selected[changed]['version'])
                if changed == 'sqlite':
                    self.assertEqual(manifest['notices'][0]['sha256'], before['notices'][0]['sha256'])
                # Restore the other selected identity for the next independent subcase.
                self.selected = copy.deepcopy(self.baseline)
                self.selected['sqliteVec'].update(version='0.1.10-alpha.1', archiveUrl='https://github.com/asg017/sqlite-vec/releases/download/v0.1.10-alpha.1/sqlite-vec-0.1.10-alpha.1-amalgamation.tar.gz', releaseUrl='https://github.com/asg017/sqlite-vec/releases/tag/v0.1.10-alpha.1')

    def test_invalid_notice_text_and_header_are_rejected(self):
        self.assertEqual(n.derive(b'text  \r\n\r\n'), b'text\r\n')
        for raw in [b'', b' \n\t\n', b'bad\0text', b'\xff']:
            with self.assertRaises(Exception): n.derive(raw)
        for raw in [b'const x = 1;', b'/* @preserve missing end', b'/* other */\n/* @preserve yes */']:
            with self.assertRaises(Exception): n.derive(raw, True)


if __name__ == '__main__':
    unittest.main()
