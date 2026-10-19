import copy
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import shutil
import tarfile
import tempfile
import unittest
import zipfile

ROOT = Path(__file__).resolve().parents[3]
spec = importlib.util.spec_from_file_location('update_notices', ROOT / 'tools/updates/notices.py')
n = importlib.util.module_from_spec(spec)
spec.loader.exec_module(n)


class NoticesTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.repo = Path(self.tmp.name) / 'repository'
        for name in ['inputs/sqlite-vector.sources.lock.json', 'tools/package/notices.json', 'LICENSE', 'tools/package/NOTICE-vector.txt']:
            out = self.repo / name
            out.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(ROOT / name, out)
        shutil.copytree(ROOT / 'tools/package/notices', self.repo / 'tools/package/notices')
        self.baseline = json.loads((ROOT / 'tools/release/tests/vector-lock.json').read_text())
        (self.repo / 'inputs/sqlite-vector.sources.lock.json').write_text(json.dumps(self.baseline))
        self.selected = copy.deepcopy(self.baseline)
        self.selected['sqlite'].update(version='3.55.0', archiveUrl='https://sqlite.org/2026/sqlite-src-3550000.zip', releaseUrl='https://sqlite.org/releaselog/3_55_0.html')
        self.selected['sqliteVector'].update(version='1.1.3-alpha.1', tag='1.1.3-alpha.1', releaseUrl='https://github.com/sqliteai/sqlite-vector/releases/tag/1.1.3-alpha.1')
        self.directory = self.repo / '.work/updates/run-test'
        self.directory.mkdir(parents=True)
        self.requests = []
        # Independent synthetic dependency bytes and expectations; not an upstream build.
        self.headers = {name: ('synthetic header ' + name + '\n').encode() for name in ['fp16.h', 'bitcasts.h', 'macros.h']}
        records = json.loads((self.repo / 'tools/package/notices.json').read_text())
        for record in records['notices']:
            if record['project'] in self.baseline:
                record['version'] = self.baseline[record['project']]['version']
        dependency = next(r for r in records['notices'] if r['project'] == 'fp16')
        dependency['incorporatedHeaders'] = {name: hashlib.sha1(b'blob ' + str(len(raw)).encode() + b'\0' + raw).hexdigest() for name, raw in self.headers.items()}
        (self.repo / 'tools/package/notices.json').write_text(json.dumps(records) + '\n')
        self.license = (self.repo / 'tools/package/notices/sqlite-vector-APACHE.txt').read_bytes()

    def archives(self, *, missing_sqlite=False, missing_vector=False, corrupt_header=False, unsafe=False, normalization=False, bad_version=False):
        self.selected['sqliteVector']['tagUrl'] = n.inputs.VECTOR_API + '/git/ref/tags/' + self.selected['sqliteVector']['version']
        sql = io.BytesIO()
        with zipfile.ZipFile(sql, 'w') as z:
            for name, data in [('configure', '#!/bin/sh\n'), ('Makefile.in', 'make\n'), ('src/sqlite.h.in', 'header\n'), ('ext/wasm/GNUmakefile', 'wasm\n'), ('LICENSE.md', 'SQLite wording  \n\n'), ('ext/wasm/api/sqlite3-license-version-header.js', '/* @preserve\n** WASM license  \n*/\nconst version = 1;\n')]:
                if missing_sqlite and name == 'LICENSE.md':
                    continue
                info = zipfile.ZipInfo('sqlite-src-' + n.inputs.sqlite_code(self.selected['sqlite']['version']) + '/' + name)
                info.external_attr = (0o100755 if name == 'configure' else 0o100644) << 16
                z.writestr(info, data)
            if unsafe:
                z.writestr('../escape', 'bad')
        vec = io.BytesIO()
        with tarfile.open(fileobj=vec, mode='w:gz') as t:
            version = '9.9.9' if bad_version else self.selected['sqliteVector']['version']
            files = {'src/sqlite-vector.c': b'C\n', 'src/sqlite-vector.h': f'#define SQLITE_VECTOR_VERSION "{version}"\n'.encode()}
            for cpu in ['cpu', 'avx2', 'avx512', 'neon', 'rvv', 'sse2']:
                for ext in ['c', 'h']:
                    files[f'src/distance-{cpu}.{ext}'] = b'fixture\n'
            files.update({'libs/fp16/' + name: raw for name, raw in self.headers.items()})
            if corrupt_header:
                files['libs/fp16/fp16.h'] = b'drift\n'
            if not missing_vector:
                files['LICENSE.md'] = self.license + (b'\n' if normalization else b'')
            for name, raw in files.items():
                info = tarfile.TarInfo('sqlite-vector-' + self.selected['sqliteVector']['commit'] + '/' + name)
                info.size = len(raw)
                t.addfile(info, io.BytesIO(raw))
        self.archives_by_url = {self.selected['sqlite']['archiveUrl']: sql.getvalue(), self.selected['sqliteVector']['archiveUrl']: vec.getvalue()}
        for project in ['sqlite', 'sqliteVector']:
            pin = self.selected[project]
            pin['digest']['value'] = hashlib.new(pin['digest']['algorithm'].replace('-', '_'), self.archives_by_url[pin['archiveUrl']]).hexdigest()

    def fetch(self, url, destination):
        self.requests.append(url)
        destination.write_bytes(self.archives_by_url[url])

    def reconcile(self):
        return n.reconcile(self.repo, self.selected, self.directory, fetch=self.fetch)

    def test_changed_sources_preserve_license_text_but_establish_selected_association(self):
        self.archives()
        before = (self.repo / 'tools/package/notices.json').read_bytes()
        result = self.reconcile()
        staged = Path(result['prepared'])
        records = json.loads((staged / 'tools/package/notices.json').read_text())['notices']
        vector = next(r for r in records if r['project'] == 'sqliteVector')
        self.assertEqual(vector['version'], '1.1.3-alpha.1')
        self.assertEqual(vector['sha256'], hashlib.sha256(self.license).hexdigest())
        self.assertEqual(vector['source']['archiveDigest'], self.selected['sqliteVector']['digest'])
        self.assertEqual(vector['source']['commit'], self.selected['sqliteVector']['commit'])
        self.assertEqual((staged / 'tools/package/notices/sqlite-vector-APACHE.txt').read_bytes(), self.license)
        self.assertEqual((staged / 'tools/package/notices/SQLite-LICENSE.txt').read_bytes(), b'SQLite wording\n')
        self.assertNotIn(b'const version', (staged / 'tools/package/notices/SQLite-WASM-NOTICE.txt').read_bytes())
        for record, old in zip(records, json.loads(before)['notices']):
            if record['project'] not in ['sqlite', 'sqliteVector']:
                self.assertEqual(record, old)
        self.assertTrue((staged / 'tools/package/NOTICE-vector.txt').is_file())
        self.assertEqual((self.repo / 'tools/package/notices.json').read_bytes(), before)
        self.assertEqual(len(self.requests), 2)

    def test_same_pair_preserves_bytes_and_reports_retained_proof(self):
        self.selected = copy.deepcopy(self.baseline)
        result = self.reconcile()
        self.assertEqual((Path(result['prepared']) / 'tools/package/notices.json').read_bytes(), (self.repo / 'tools/package/notices.json').read_bytes())
        report = json.loads(Path(result['reportPath']).read_text())
        self.assertTrue(all(r['disposition'] == 'retained' for r in report['notices']))
        self.assertEqual(self.requests, [])
        self.assertNotIn('acquisition', report)

    def test_sqlite_only_vector_only_and_rollback(self):
        original = copy.deepcopy(self.selected)
        for project in ['sqlite', 'sqliteVector']:
            for rollback in [False, True]:
                with self.subTest(project=project, rollback=rollback):
                    self.selected = copy.deepcopy(self.baseline)
                    self.selected[project] = copy.deepcopy(original[project])
                    if rollback and project == 'sqliteVector':
                        self.selected[project].update(version='1.1.1', tag='1.1.1', releaseUrl='https://github.com/sqliteai/sqlite-vector/releases/tag/1.1.1')
                    if rollback and project == 'sqlite':
                        self.selected[project].update(version='3.53.4', archiveUrl='https://sqlite.org/2026/sqlite-src-3530400.zip', releaseUrl='https://sqlite.org/releaselog/3_53_4.html')
                    self.directory = self.repo / '.work/updates' / (project + str(rollback))
                    self.archives()
                    result = self.reconcile()
                    report = json.loads(Path(result['reportPath']).read_text())
                    for record in report['notices']:
                        self.assertEqual(record['disposition'], 'refreshed' if record['project'] == project else 'retained')

    def test_required_source_dependency_encoding_and_integrity_fail_closed(self):
        for mode in ['missing_sqlite', 'missing_vector', 'corrupt_header', 'unsafe', 'normalization', 'bad_version', 'digest', 'transport']:
            with self.subTest(mode=mode):
                self.directory = self.repo / '.work/updates' / mode
                self.archives(**({mode: True} if mode not in ['digest', 'transport'] else {}))
                if mode == 'digest':
                    self.selected['sqliteVector']['digest']['value'] = '0' * 64
                before = (self.repo / 'tools/package/notices.json').read_bytes()
                fetch = (lambda *_: (_ for _ in ()).throw(OSError('offline'))) if mode == 'transport' else self.fetch
                with self.assertRaises(Exception):
                    n.reconcile(self.repo, self.selected, self.directory, fetch=fetch)
                self.assertEqual(json.loads((self.directory / 'notices.json').read_text())['status'], 'failed')
                self.assertEqual((self.repo / 'tools/package/notices.json').read_bytes(), before)
                self.assertFalse((self.repo / '.work/inputs').exists())

    def test_invalid_text_and_license_block(self):
        self.assertEqual(n.derive(b'text  \r\n\r\n'), b'text\r\n')
        for raw in [b'', b' \n\t\n', b'bad\0text', b'\xff']:
            with self.assertRaises(Exception):
                n.derive(raw)
        for raw in [b'const x = 1;', b'/* @preserve missing end', b'/* other */\n/* @preserve yes */']:
            with self.assertRaises(Exception):
                n.derive(raw, True)


if __name__ == '__main__':
    unittest.main()
