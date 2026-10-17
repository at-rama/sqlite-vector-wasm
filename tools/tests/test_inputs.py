"""Small authored fixtures; no upstream sources or network access."""
import copy
import argparse
import importlib.util
import hashlib
import io
import json
import os
import subprocess
import tarfile
import zipfile
from unittest.mock import patch
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('inputs', Path(__file__).resolve().parents[1] / 'inputs.py')
inputs = importlib.util.module_from_spec(spec)
spec.loader.exec_module(inputs)


def lock():
    return {'schemaVersion': 1, 'sqlite': {
        'version': '3.53.4', 'archiveUrl': 'https://sqlite.org/2026/sqlite-src-3530400.zip',
        'digest': {'algorithm': 'sha3-256', 'value': 'a' * 64},
        'releaseUrl': inputs.release_url('3.53.4'), 'digestUrl': inputs.SQLITE_DOWNLOAD},
        'sqliteVec': {'version': '0.1.9',
        'archiveUrl': 'https://github.com/asg017/sqlite-vec/releases/download/v0.1.9/sqlite-vec-0.1.9-amalgamation.tar.gz',
        'digest': {'algorithm': 'sha256', 'value': 'b' * 64},
        'releaseUrl': 'https://github.com/asg017/sqlite-vec/releases/tag/v0.1.9',
        'digestUrl': inputs.VEC_API + '/123'}}


class LockTests(unittest.TestCase):
    def test_complete_lock(self):
        self.assertEqual(inputs.validate_lock(lock()), lock())

    def test_invalid_locks(self):
        mutations = [lambda x: x.pop('sqlite'), lambda x: x.update(schemaVersion=True),
            lambda x: x['sqlite'].pop('digest'),
            lambda x: x['sqlite']['digest'].update(algorithm='sha256'),
            lambda x: x['sqliteVec']['digest'].update(value='invalid'),
            lambda x: x['sqlite'].update(version='3.53.3'),
            lambda x: x['sqlite'].update(archiveUrl='https://example.org/archive.zip'),
            lambda x: x['sqliteVec'].update(releaseUrl='https://github.com/other/project'),
            lambda x: x['sqliteVec'].update(version='0.1.9-alpha.1'),
            lambda x: x['sqliteVec'].update(digestUrl='https://example.org/digest')]
        for mutation in mutations:
            with self.subTest(mutation=mutation):
                candidate = copy.deepcopy(lock()); mutation(candidate)
                with self.assertRaises(inputs.InputError): inputs.validate_lock(candidate)

    def test_duplicate_json_fields(self):
        with tempfile.TemporaryDirectory() as d:
            path = Path(d) / 'lock.json'; path.write_text('{"schemaVersion":1,"schemaVersion":2}')
            with self.assertRaises(inputs.InputError): inputs.read_json(path)

    def test_exact_versions_only(self):
        for v in ('latest', '^0.1.9', '0.1.9-dev.1', '0.1.9-alpha.01', '0.1.9-rc1',
                  '0.1.9+build', '01.1.9', '٠.1.9', '', None):
            with self.subTest(v=v), self.assertRaises(inputs.InputError): inputs.version(v, 'sqliteVec')
        self.assertEqual(inputs.version('v0.1.9', 'sqliteVec'), '0.1.9')

    def test_prerelease_lock_preserves_exact_identity(self):
        for v in ('0.1.10-alpha.4', '0.2.0-beta.1', '1.0.0-rc.0', '1.0.0-rc'):
            with self.subTest(v=v):
                candidate = lock()
                pin = candidate['sqliteVec']
                for key in ('version', 'archiveUrl', 'releaseUrl'):
                    pin[key] = pin[key].replace('0.1.9', v)
                self.assertEqual(inputs.validate_lock(candidate), candidate)
                self.assertEqual(inputs.version('v' + v, 'sqliteVec'), v)
                pin['archiveUrl'] = lock()['sqliteVec']['archiveUrl']
                with self.assertRaises(inputs.InputError): inputs.validate_lock(candidate)



def metadata():
    sqlite = 'PRODUCT,3.53.4,2026/sqlite-src-3530400.zip,100,' + 'a' * 64
    releases = [{'tag_name': 'v0.1.9', 'draft': False, 'prerelease': False,
        'published_at': '2026-03-31T08:00:23Z',
        'html_url': lock()['sqliteVec']['releaseUrl'], 'url': inputs.VEC_API + '/123',
        'assets': [{'name': 'sqlite-vec-0.1.9-amalgamation.tar.gz', 'state': 'uploaded',
            'browser_download_url': lock()['sqliteVec']['archiveUrl'], 'digest': 'sha256:' + 'b' * 64}]}]
    return sqlite, releases


def release_page(url):
    v = url.rsplit('/', 1)[1].removesuffix('.html').replace('_', '.')
    return f'<title>SQLite Release {v} On 2026-01-01</title>'


def prerelease(v='0.1.10-alpha.4'):
    release = copy.deepcopy(metadata()[1][0])
    release['tag_name'] = 'v' + v
    release['prerelease'] = True
    release['html_url'] = release['html_url'].replace('0.1.9', v)
    release['url'] = inputs.VEC_API + '/124'
    for key in ('name', 'browser_download_url'):
        release['assets'][0][key] = release['assets'][0][key].replace('0.1.9', v)
    return release


class ResolutionTests(unittest.TestCase):
    def resolve(self, sql=None, releases=None, **kwargs):
        base_sql, base_releases = metadata()
        return inputs.resolve_pair(sql if sql is not None else base_sql,
            releases if releases is not None else base_releases, fetch=release_page, **kwargs)

    def test_latest_and_independent_overrides(self):
        self.assertEqual(self.resolve(), lock())
        older_sql = 'PRODUCT,3.52.0,2026/sqlite-src-3520000.zip,100,' + 'c' * 64
        sql, releases = metadata()
        older = copy.deepcopy(releases[0]); older['tag_name'] = 'v0.1.8'
        older['html_url'] = older['html_url'].replace('0.1.9', '0.1.8')
        older['url'] = inputs.VEC_API + '/122'
        older['assets'][0]['name'] = older['assets'][0]['name'].replace('0.1.9', '0.1.8')
        older['assets'][0]['browser_download_url'] = older['assets'][0]['browser_download_url'].replace('0.1.9', '0.1.8')
        releases = [older, *releases]
        for sv, vv, expected_s, expected_v in [(None,None,'3.53.4','0.1.9'),
                ('3.52.0',None,'3.52.0','0.1.9'),(None,'v0.1.8','3.53.4','0.1.8'),
                ('3.52.0','0.1.8','3.52.0','0.1.8')]:
            with self.subTest(sv=sv,vv=vv):
                result=self.resolve(sql=older_sql+'\n'+sql,releases=releases,sqlite_version=sv,vec_version=vv)
                self.assertEqual((result['sqlite']['version'],result['sqliteVec']['version']),(expected_s,expected_v))

    def test_draft_prerelease_development_absent_and_missing_digest(self):
        for mutation in [lambda r:r.update(draft=True),lambda r:r.update(prerelease=True),
                lambda r:r.update(published_at=None),lambda r:r.update(tag_name='v0.2.0-alpha.1'),
                lambda r:r['assets'][0].update(digest=None),lambda r:r.update(assets=[]),
                lambda r:r['assets'][0].update(digest='sha256:bad')]:
            sql,releases=metadata();mutation(releases[0])
            with self.subTest(mutation=mutation),self.assertRaises(inputs.InputError): self.resolve(releases=releases)
        for kwargs in [{'vec_version':'0.1.8'},{'sqlite_version':'3.52.0'},{'sqlite_version':'3.53.4-rc1'}, {'vec_version':'latest'}]:
            with self.subTest(kwargs=kwargs),self.assertRaises(inputs.InputError):self.resolve(**kwargs)
        with self.assertRaises(inputs.InputError):self.resolve(sql=metadata()[0].replace('a'*64,''))

    def test_latest_does_not_fallback_on_missing_digest(self):
        sql, releases=metadata();new=copy.deepcopy(releases[0]);new['tag_name']='v0.2.0';new['assets']=[]
        with self.assertRaises(inputs.InputError):self.resolve(releases=[*releases,new])

    def test_explicit_published_prereleases_and_stable_default(self):
        for v in ('0.1.10-alpha.4', '0.2.0-beta.1', '1.0.0-rc.1'):
            with self.subTest(v=v):
                releases = [prerelease(v), *metadata()[1]]
                self.assertEqual(self.resolve(releases=releases), lock())
                selected = self.resolve(releases=releases, vec_version='v' + v)
                self.assertEqual(selected['sqlite'], lock()['sqlite'])
                self.assertEqual(selected['sqliteVec']['version'], v)
                self.assertEqual(selected['sqliteVec']['archiveUrl'], releases[0]['assets'][0]['browser_download_url'])
                self.assertEqual(set(selected), {'schemaVersion', 'sqlite', 'sqliteVec'})

    def test_prerelease_failures_never_substitute_a_stable_release(self):
        for mutate in (lambda r:r.update(draft=True), lambda r:r.update(published_at=None),
                       lambda r:r.update(published_at='invalid'), lambda r:r.update(prerelease=False),
                       lambda r:r.update(prerelease='true'), lambda r:r.update(assets=[]),
                       lambda r:r['assets'][0].update(digest=None),
                       lambda r:r['assets'][0].update(digest='sha256:bad'),
                       lambda r:r['assets'][0].update(browser_download_url=lock()['sqliteVec']['archiveUrl'])):
            r = prerelease(); mutate(r)
            with self.subTest(mutate=mutate), self.assertRaises(inputs.InputError):
                self.resolve(releases=[r, *metadata()[1]], vec_version='0.1.10-alpha.4')
        r = prerelease()
        with self.assertRaises(inputs.InputError):
            self.resolve(releases=[r, r], vec_version='0.1.10-alpha.4')
        with self.assertRaises(inputs.InputError):
            self.resolve(releases=[r], vec_version='0.1.10-alpha.3')
        with self.assertRaises(inputs.InputError): self.resolve(releases=[r])

    def test_sqlite_snapshot_is_not_a_released_source(self):
        snapshot = 'PRODUCT,3.54.0,2026/sqlite-snapshot-202607312245.tar.gz,100,' + 'c' * 64
        self.assertEqual(self.resolve(sql=snapshot + '\n' + metadata()[0]), lock())
        with self.assertRaises(inputs.InputError): self.resolve(sql=snapshot)
        for v in ('snapshot', 'trunk', '3.54.0-alpha.1'):
            with self.subTest(v=v), self.assertRaises(inputs.InputError):
                self.resolve(sqlite_version=v)

    def test_malformed_latest_metadata_never_selects_an_older_release(self):
        sql,releases=metadata()
        with self.assertRaises(inputs.InputError):self.resolve(sql=sql+'\nPRODUCT,3.54.0,2026/sqlite-src-3540000.zip,100')
        new=copy.deepcopy(releases[0]);new['tag_name']='v0.2.0';new['published_at']='invalid'
        with self.assertRaises(inputs.InputError):self.resolve(releases=[*releases,new])
        releases[0]['assets']=None
        with self.assertRaises(inputs.InputError):self.resolve(releases=releases)

    def test_ambiguous_or_wrong_origin_metadata(self):
        sql,releases=metadata()
        with self.assertRaises(inputs.InputError):self.resolve(sql=sql+'\n'+sql)
        with self.assertRaises(inputs.InputError):self.resolve(releases=releases+releases)
        releases[0]['assets'][0]['browser_download_url']='https://example.org/fake.tar.gz'
        with self.assertRaises(inputs.InputError):self.resolve(releases=releases)
        with self.assertRaises(inputs.InputError): inputs.resolve_pair(sql,metadata()[1],fetch=lambda url:'not a release')


class PinTests(unittest.TestCase):
    resolve = ResolutionTests.resolve
    def test_preserve_and_fail_on_drift(self):
        baseline=lock();before=copy.deepcopy(baseline)
        self.assertEqual(self.resolve(baseline=baseline),baseline)
        sql,releases=metadata()
        for changes in [(sql.replace('a'*64,'c'*64),releases),
                (sql.replace('/2026/','/2025/').replace('2026/sqlite','2025/sqlite'),releases)]:
            with self.assertRaises(inputs.InputError): self.resolve(sql=changes[0],releases=changes[1],baseline=baseline)
        releases[0]['assets'][0]['digest']='sha256:'+'c'*64
        with self.assertRaises(inputs.InputError):self.resolve(releases=releases,baseline=baseline)
        releases=metadata()[1];releases[0]['assets'][0]['browser_download_url']='https://example.org/replaced.tar.gz'
        with self.assertRaises(inputs.InputError):self.resolve(releases=releases,baseline=baseline)
        self.assertEqual(baseline,before)

    def test_retained_official_digest_when_metadata_is_missing(self):
        sql,releases=metadata();releases[0]['assets'][0]['digest']=None
        self.assertEqual(self.resolve(releases=releases,baseline=lock()),lock())
        self.assertEqual(self.resolve(sql='',sqlite_version='3.53.4',baseline=lock()),lock())

    def test_atomic_complete_output(self):
        from unittest.mock import patch
        with tempfile.TemporaryDirectory() as d:
            path=Path(d)/'lock.json';path.write_text('previous')
            bad=lock();bad['sqliteVec']['digest']['value']='invalid'
            with self.assertRaises(inputs.InputError):inputs.write_lock(path,bad)
            self.assertEqual(path.read_text(),'previous')
            with patch.object(inputs.os,'replace',side_effect=OSError('interrupted')):
                with self.assertRaises(OSError):inputs.write_lock(path,lock())
            self.assertEqual(path.read_text(),'previous');self.assertEqual(list(Path(d).iterdir()),[path])
            inputs.write_lock(path,lock());self.assertEqual(inputs.read_json(path),lock())

    def test_prerelease_pin_is_retained_without_digest_refresh(self):
        releases = [prerelease()]
        baseline = self.resolve(releases=releases, vec_version='0.1.10-alpha.4')
        before = copy.deepcopy(baseline)
        releases[0]['assets'][0]['digest'] = None
        self.assertEqual(self.resolve(releases=releases, vec_version='0.1.10-alpha.4', baseline=baseline), baseline)
        releases[0]['assets'][0]['digest'] = 'sha256:' + 'c' * 64
        with self.assertRaises(inputs.InputError):
            self.resolve(releases=releases, vec_version='0.1.10-alpha.4', baseline=baseline)
        self.assertEqual(baseline, before)


def archives(directory):
    sql=directory/'authored.zip';vec=directory/'authored.tar.gz'
    with zipfile.ZipFile(sql,'w') as archive:
        for name in ('configure','Makefile.in','src/sqlite.h.in','ext/wasm/GNUmakefile'):
            entry=zipfile.ZipInfo('sqlite-src-3530400/'+name)
            entry.external_attr=(0o100755 if name=='configure' else 0o100644)<<16
            archive.writestr(entry,'authored test fixture\n')
    with tarfile.open(vec,'w:gz') as archive:
        for name in ('sqlite-vec.c','sqlite-vec.h'):
            entry=tarfile.TarInfo(name);data=b'authored test fixture\n';entry.size=len(data);entry.mode=0o644
            archive.addfile(entry,io.BytesIO(data))
    candidate=lock()
    candidate['sqlite']['digest']['value']=hashlib.sha3_256(sql.read_bytes()).hexdigest()
    candidate['sqliteVec']['digest']['value']=hashlib.sha256(vec.read_bytes()).hexdigest()
    return candidate,sql,vec


class AcquisitionTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory();self.addCleanup(self.temp.cleanup)
        self.directory=Path(self.temp.name);self.candidate,self.sql,self.vec=archives(self.directory)
        self.raw=json.dumps(self.candidate).encode();self.parent=self.directory/'work'
        self.parent.mkdir();self.older=self.parent/'older';self.older.mkdir();(self.older/'keep').write_text('keep')
        self.calls=[]

    def fetch(self,url,dest):
        self.calls.append(url)
        source={self.candidate['sqlite']['archiveUrl']:self.sql,
                self.candidate['sqliteVec']['archiveUrl']:self.vec}[url]
        dest.write_bytes(source.read_bytes())

    def acquire(self,fetch=None,extract=None):
        kwargs={'fetch':fetch or self.fetch}
        if extract:kwargs['extract']=extract
        return inputs.acquire_lock(self.raw,self.parent,**kwargs)

    def assert_clean_failure(self,fetch=None,extract=None):
        with self.assertRaises((inputs.InputError, OSError, subprocess.CalledProcessError, zipfile.BadZipFile, tarfile.TarError)):
            self.acquire(fetch,extract)
        self.assertEqual(list(self.parent.iterdir()),[self.older])
        self.assertEqual((self.older/'keep').read_text(),'keep')

    def test_fresh_downloads_frozen_pair_and_handoff(self):
        one=self.acquire();two=self.acquire()
        self.assertNotEqual(one['workspace'],two['workspace']);self.assertEqual(len(self.calls),4)
        self.assertEqual(self.calls,[self.candidate['sqlite']['archiveUrl'],self.candidate['sqliteVec']['archiveUrl']]*2)
        for handoff in (one,two):
            self.assertEqual(handoff['lockDigest']['value'],hashlib.sha256(self.raw).hexdigest())
            self.assertEqual(inputs.read_json(Path(handoff['workspace'])/'handoff.json'),handoff)
            self.assertTrue((Path(handoff['sqlite']['sourcePath'])/'configure').stat().st_mode & 0o111)
            self.assertTrue((Path(handoff['sqliteVec']['sourcePath'])/'sqlite-vec.h').is_file())
        self.assertEqual(self.raw,json.dumps(self.candidate).encode())

    def test_prerelease_acquisition_preserves_pair_digest_and_failures(self):
        pin = self.candidate['sqliteVec']
        for key in ('version', 'archiveUrl', 'releaseUrl'):
            pin[key] = pin[key].replace('0.1.9', '0.1.10-alpha.4')
        self.raw = json.dumps(self.candidate).encode()
        one = self.acquire(); two = self.acquire()
        self.assertNotEqual(one['workspace'], two['workspace'])
        for handoff in (one, two):
            self.assertEqual(handoff['sqliteVec']['version'], '0.1.10-alpha.4')
            self.assertEqual(handoff['sqliteVec']['digest'], pin['digest'])
            self.assertEqual(handoff['lockDigest']['value'], hashlib.sha256(self.raw).hexdigest())
            inputs.shutil.rmtree(handoff['workspace'])
        def corrupt_vec(url, dest):
            self.fetch(url, dest)
            if url == pin['archiveUrl']: dest.write_bytes(b'changed prerelease')
        with patch.object(inputs, 'extract_file', wraps=inputs.extract_file) as extract:
            self.assert_clean_failure(corrupt_vec, extract)
            self.assertEqual(extract.call_count, 1)  # SQLite only; never corrupt sqlite-vec.
        path = self.directory / 'sources.lock.json'; path.write_bytes(self.raw)
        with patch.object(inputs, 'ROOT', self.directory):
            with patch.object(inputs.subprocess, 'run', return_value=subprocess.CompletedProcess([], 0, b'other', b'')):
                with self.assertRaises(inputs.InputError): inputs.recorded_lock(path)
            with patch.object(inputs.subprocess, 'run', return_value=subprocess.CompletedProcess([], 0, self.raw, b'')):
                self.assertEqual(inputs.recorded_lock(path), self.raw)

    def test_fixture_transport_rejects_unexpected_urls(self):
        destination=self.directory/'unexpected-download'
        for url in ('https://example.org/sqlite.org/archive.zip',
                    'https://example.org/github.com/archive.tar.gz',
                    self.candidate['sqlite']['archiveUrl']+'?unexpected=1'):
            with self.subTest(url=url),self.assertRaises(KeyError):self.fetch(url,destination)
            self.assertFalse(destination.exists())

    def test_altered_and_truncated_archives_fail_before_extraction(self):
        for data in (b'changed',self.sql.read_bytes()[:10]):
            def changed(url,dest):dest.write_bytes(data)
            with patch.object(inputs,'archive_members') as inspect:
                self.assert_clean_failure(changed)
                inspect.assert_not_called()

    def test_http_failure_and_second_source_failure(self):
        for second in (False,True):
            def failure(url,dest):
                if second and url==self.candidate['sqlite']['archiveUrl']:self.fetch(url,dest)
                else:raise subprocess.CalledProcessError(22,['curl'])
            self.assert_clean_failure(failure)
        def corrupt_second(url,dest):
            self.fetch(url,dest)
            if url==self.candidate['sqliteVec']['archiveUrl']:dest.write_bytes(b'changed')
        self.assert_clean_failure(corrupt_second)

    def test_incomplete_lock_fails_before_download(self):
        self.raw=b'{}'
        with self.assertRaises(inputs.InputError):self.acquire()
        self.assertEqual(self.calls,[])

    def test_extraction_error(self):
        def fail(*args):raise subprocess.CalledProcessError(2,['unzip'])
        self.assert_clean_failure(extract=fail)

    def test_missing_content_unusable_archive_and_vendored_sqlite(self):
        for contents in [('unrelated.txt',),('sqlite-vec.c',),('sqlite-vec.c','sqlite-vec.h','sqlite3.c')]:
            with tarfile.open(self.vec,'w:gz') as archive:
                for name in contents:
                    e=tarfile.TarInfo(name);e.size=1;archive.addfile(e,io.BytesIO(b'x'))
            self.candidate['sqliteVec']['digest']['value']=hashlib.sha256(self.vec.read_bytes()).hexdigest()
            self.raw=json.dumps(self.candidate).encode();self.assert_clean_failure()
        self.sql.write_bytes(b'not zip')
        self.candidate['sqlite']['digest']['value']=hashlib.sha3_256(self.sql.read_bytes()).hexdigest()
        self.raw=json.dumps(self.candidate).encode();self.assert_clean_failure()

    def test_unsafe_tar_paths_and_links(self):
        for name,kind in [('../escape',tarfile.REGTYPE),('/escape',tarfile.REGTYPE),
                ('link',tarfile.SYMTYPE),('link',tarfile.LNKTYPE),('fifo',tarfile.FIFOTYPE)]:
            with tarfile.open(self.vec,'w:gz') as archive:
                e=tarfile.TarInfo(name);e.type=kind;e.linkname='../escape';e.size=0;archive.addfile(e,io.BytesIO(b''))
            self.candidate['sqliteVec']['digest']['value']=hashlib.sha256(self.vec.read_bytes()).hexdigest()
            self.raw=json.dumps(self.candidate).encode();self.assert_clean_failure()
        self.assertFalse((self.directory/'escape').exists())

    def test_unsafe_zip_paths_and_links(self):
        for name,mode in [('../escape',0o100644),('/escape',0o100644),('link',0o120777)]:
            with zipfile.ZipFile(self.sql,'w') as archive:
                e=zipfile.ZipInfo(name);e.external_attr=mode<<16;archive.writestr(e,'../escape')
            self.candidate['sqlite']['digest']['value']=hashlib.sha3_256(self.sql.read_bytes()).hexdigest()
            self.raw=json.dumps(self.candidate).encode();self.assert_clean_failure()
        self.assertFalse((self.directory/'escape').exists())

    def test_missing_sqlite_content_and_executable_mode(self):
        for mode in (0o100755,0o100644):
            with zipfile.ZipFile(self.sql,'w') as archive:
                names=('configure',) if mode==0o100755 else ('configure','Makefile.in','src/sqlite.h.in','ext/wasm/GNUmakefile')
                for name in names:
                    e=zipfile.ZipInfo('sqlite-src-3530400/'+name);e.external_attr=mode<<16;archive.writestr(e,'fixture')
            self.candidate['sqlite']['digest']['value']=hashlib.sha3_256(self.sql.read_bytes()).hexdigest()
            self.raw=json.dumps(self.candidate).encode();self.assert_clean_failure()

    def test_production_lock_requires_recorded_unchanged_candidate(self):
        path=self.directory/'sources.lock.json';path.write_bytes(self.raw)
        with patch.object(inputs,'ROOT',self.directory):
            with patch.object(inputs.subprocess,'run',return_value=subprocess.CompletedProcess([],1,b'',b'')):
                with self.assertRaises(inputs.InputError):inputs.recorded_lock(path)
            with patch.object(inputs.subprocess,'run',return_value=subprocess.CompletedProcess([],0,b'other',b'')):
                with self.assertRaises(inputs.InputError):inputs.recorded_lock(path)
            with patch.object(inputs.subprocess,'run',return_value=subprocess.CompletedProcess([],0,self.raw,b'')):
                self.assertEqual(inputs.recorded_lock(path),self.raw)


class CommandTests(unittest.TestCase):
    def test_resolver_uses_recorded_baseline_and_preserves_output_on_failure(self):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d);(root/'inputs').mkdir();baseline=root/'inputs/sources.lock.json'
            baseline.write_text(json.dumps(lock()));output=root/'candidate.json';output.write_text('previous')
            args=argparse.Namespace(sqlite_version=None,sqlite_vec_version=None,baseline_lock=None,output=str(output))
            sql,releases=metadata();releases[0]['assets'][0]['digest']='sha256:'+'c'*64
            def metadata_fetch(url):
                if url==inputs.SQLITE_DOWNLOAD:return sql
                if url.startswith(inputs.VEC_API):return json.dumps(releases)
                return release_page(url)
            with patch.object(inputs,'ROOT',root),patch.object(inputs,'MetadataFetch',return_value=metadata_fetch):
                with self.assertRaises(inputs.InputError):inputs.resolve_command(args)
            self.assertEqual(output.read_text(),'previous');self.assertEqual(json.loads(baseline.read_text()),lock())

    def test_cli_transport_failure_emits_no_handoff(self):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d);bin_dir=root/'bin';bin_dir.mkdir()
            fake=bin_dir/'curl';fake.write_text('#!/bin/sh\nexit 22\n');fake.chmod(0o755)
            import os
            env=dict(os.environ,PATH=str(bin_dir)+':/usr/bin:/bin')
            result=subprocess.run(['bash',str(inputs.ROOT/'tools/inputs.sh'),'_fetch',
                'https://sqlite.org/2026/sqlite-src-3530400.zip',str(root/'download')],env=env,capture_output=True)
            self.assertEqual(result.returncode,22);self.assertEqual(result.stdout,b'')

class TransportTests(unittest.TestCase):
    def fetch(self, url, token='fixture-token', status=0):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        root = Path(directory.name)
        fake = root / 'curl'
        fake.write_text('''#!/usr/bin/env python3
import json, os, sys
from pathlib import Path
args = sys.argv[1:]
Path(os.environ['CURL_ARGUMENTS']).write_text(json.dumps(args))
Path(args[args.index('--output') + 1]).write_text('{"message":"API rate limit exceeded"}')
Path(args[args.index('--dump-header') + 1]).write_text(
    'HTTP/2 403\\nX-RateLimit-Remaining: 0\\nX-RateLimit-Reset: 1792015200\\n'
    'Retry-After: 60\\nX-GitHub-Request-Id: fixture-request\\nSet-Cookie: private-response\\n')
sys.exit(int(os.environ['CURL_STATUS']))
''')
        fake.chmod(0o755)
        destination = root / 'metadata.txt'
        env = dict(os.environ, PATH=str(root) + ':/usr/bin:/bin',
                   CURL_ARGUMENTS=str(root / 'arguments.json'), CURL_STATUS=str(status))
        env.pop('GH_TOKEN', None)
        if token is not None:
            env['GH_TOKEN'] = token
        result = subprocess.run(['bash', str(inputs.ROOT / 'tools/inputs.sh'),
                                 '_fetch', url, str(destination)], env=env, capture_output=True)
        arguments = json.loads((root / 'arguments.json').read_text())
        return result, arguments, destination

    def test_token_is_scoped_to_github_api(self):
        for url, authenticated in [
            (inputs.VEC_API + '/tags/v0.1.9', True),
            ('https://sqlite.org/download.html', False),
            ('https://github.com/asg017/sqlite-vec/releases/download/v0.1.9/asset', False),
            ('https://api.github.com.example.org/releases', False),
            ('https://api.github.com@elsewhere.example/releases', False),
        ]:
            with self.subTest(url=url):
                result, arguments, destination = self.fetch(url)
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertEqual('Authorization: Bearer fixture-token' in arguments, authenticated)
                self.assertEqual(result.stdout, b'')
                self.assertNotIn(b'fixture-token', result.stderr)
                self.assertNotIn('--location-trusted', arguments)
                self.assertTrue(destination.is_file())
                self.assertFalse(Path(str(destination) + '.http-headers').exists())

    def test_public_api_still_works_without_token(self):
        for token in (None, ''):
            with self.subTest(token=token):
                result, arguments, _ = self.fetch(inputs.VEC_API, token=token)
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertFalse(any('Authorization:' in argument for argument in arguments))

    def test_http_failure_preserves_evidence_and_safe_diagnostic(self):
        result, arguments, destination = self.fetch(inputs.VEC_API, status=22)
        self.assertEqual(result.returncode, 22)
        self.assertEqual(result.stdout, b'')
        self.assertIn('--fail-with-body', arguments)
        self.assertIn('API rate limit exceeded', destination.read_text())
        self.assertIn('HTTP/2 403', result.stderr.decode())
        self.assertIn('X-RateLimit-Remaining: 0', result.stderr.decode())
        self.assertIn('X-RateLimit-Reset: 1792015200', result.stderr.decode())
        self.assertIn('Retry-After: 60', result.stderr.decode())
        self.assertIn('X-GitHub-Request-Id: fixture-request', result.stderr.decode())
        self.assertTrue(Path(str(destination) + '.http-headers').is_file())
        self.assertNotIn(b'private-response', result.stderr)
        self.assertNotIn(b'fixture-token', result.stderr)



VECTOR_COMMIT = '0' * 40


def vector_lock(v='1.1.2'):
    return {'schemaVersion': 2, 'sqlite': lock()['sqlite'], 'sqliteVector': {
        'version': v, 'releaseId': 456, 'tag': v, 'commit': VECTOR_COMMIT,
        'archiveUrl': 'https://codeload.github.com/sqliteai/sqlite-vector/tar.gz/' + VECTOR_COMMIT,
        'digest': {'algorithm': 'sha256', 'value': 'd' * 64},
        'releaseUrl': 'https://github.com/sqliteai/sqlite-vector/releases/tag/' + v,
        'digestUrl': inputs.VECTOR_API + '/releases/456',
        'tagUrl': inputs.VECTOR_API + '/git/ref/tags/' + v,
        'commitUrl': inputs.VECTOR_API + '/git/commits/' + VECTOR_COMMIT}}


def vector_release(v='1.1.2'):
    pin = vector_lock(v)['sqliteVector']
    return {'id': 456, 'tag_name': v, 'draft': False, 'prerelease': '-' in v,
            'published_at': '2026-09-11T14:27:22Z', 'url': pin['digestUrl'], 'html_url': pin['releaseUrl']}


def vector_metadata(url):
    if '/git/ref/tags/' in url:
        tag = url.rsplit('/', 1)[1]
        return json.dumps({'ref': 'refs/tags/' + tag, 'object': {
            'type': 'commit', 'sha': VECTOR_COMMIT, 'url': vector_lock()['sqliteVector']['commitUrl']}})
    if '/git/commits/' in url:
        return json.dumps({'sha': VECTOR_COMMIT})
    return release_page(url)


class VectorResolutionTests(unittest.TestCase):
    def resolve(self, releases=None, fetch=vector_metadata, **kwargs):
        return inputs.resolve_vector_pair(metadata()[0], releases if releases is not None else [vector_release()],
            fetch=fetch, archive_digest=lambda url: 'd' * 64, **kwargs)

    def test_fixed_schema_and_independent_selection(self):
        self.assertEqual(self.resolve(), vector_lock())
        for sv, vv in ((None, None), ('3.53.4', None), (None, '1.1.2'), ('3.53.4', '1.1.2')):
            self.assertEqual(self.resolve(sqlite_version=sv, vector_version=vv), vector_lock())
        self.assertEqual(self.resolve(baseline=lock()), vector_lock())
        self.assertEqual(inputs.resolve_pair(*metadata(), baseline=vector_lock(), fetch=release_page), lock())
        for mutate in (lambda p:p.update(commit='bad'), lambda p:p.update(tag='1.1.1'),
                       lambda p:p.update(archiveUrl='https://example.org/source'),
                       lambda p:p.update(releaseId=True), lambda p:p.update(commitUrl=inputs.VECTOR_API+'/git/commits/'+'a'*40),
                       lambda p:p.update(tagUrl='https://example.org/tag'), lambda p:p.pop('digest'),
                       lambda p:p.update(releaseUrl='https://github.com/sqliteai/sqlite-wasm/releases/tag/1.1.2')):
            candidate = vector_lock(); mutate(candidate['sqliteVector'])
            with self.subTest(mutate=mutate), self.assertRaises(inputs.InputError): inputs.validate_lock(candidate)
        mixed = vector_lock(); mixed['sqliteVec'] = lock()['sqliteVec']
        with self.assertRaises(inputs.InputError): inputs.validate_lock(mixed)

    def test_explicit_prereleases_and_stable_default(self):
        for v in ('1.2.0-alpha.1', '1.2.0-beta.1', '1.2.0-rc.1'):
            records = [vector_release(v), vector_release()]
            self.assertEqual(self.resolve(releases=records), vector_lock())
            self.assertEqual(self.resolve(releases=records, vector_version=v), vector_lock(v))
        for v in ('latest', 'main', '1.2.0-dev.1', '^1.1.2', '1.1.02'):
            with self.subTest(v=v), self.assertRaises(inputs.InputError): self.resolve(vector_version=v)

    def test_invalid_release_and_no_latest_fallback(self):
        for mutate in (lambda r:r.update(draft=True), lambda r:r.update(published_at=None),
                       lambda r:r.update(published_at='invalid'), lambda r:r.update(prerelease=True),
                       lambda r:r.update(prerelease='false'), lambda r:r.update(id=True),
                       lambda r:r.update(url='https://example.org/release'), lambda r:r.update(html_url='bad')):
            r = vector_release(); mutate(r)
            with self.subTest(mutate=mutate), self.assertRaises(inputs.InputError): self.resolve(releases=[r], vector_version='1.1.2')
        with self.assertRaises(inputs.InputError): self.resolve(releases=[vector_release()] * 2)
        with self.assertRaises(inputs.InputError): self.resolve(vector_version='1.1.1')
        r = vector_release('1.1.3'); r['id'] = None
        with self.assertRaises(inputs.InputError): self.resolve(releases=[vector_release(), r])
        r = vector_release('1.2.0-alpha.1'); r['draft'] = True
        with self.assertRaises(inputs.InputError): self.resolve(releases=[r, vector_release()], vector_version='1.2.0-alpha.1')

    def test_bindings_and_archive_drift_fail(self):
        for response in ({}, {'ref': 'refs/tags/other'}, {'ref': 'refs/tags/1.1.2', 'object': {'type':'tree','sha':VECTOR_COMMIT}}):
            with self.subTest(response=response), self.assertRaises(inputs.InputError):
                self.resolve(fetch=lambda url:json.dumps(response) if '/git/' in url else release_page(url))
        def moved(url):
            return vector_metadata(url).replace(VECTOR_COMMIT, 'a' * 40)
        with self.assertRaises(inputs.InputError): self.resolve(baseline=vector_lock(), fetch=moved)
        baseline = vector_lock(); baseline['sqliteVector']['digest']['value'] = 'e' * 64
        before = copy.deepcopy(baseline)
        with self.assertRaises(inputs.InputError): self.resolve(baseline=baseline)
        self.assertEqual(baseline, before)
        self.assertEqual(self.resolve(baseline=vector_lock()), vector_lock())

    def test_same_version_other_upstream_cannot_supply_pin(self):
        baseline = lock(); pin = baseline['sqliteVec']
        for key in ('version', 'archiveUrl', 'releaseUrl'):
            pin[key] = pin[key].replace('0.1.9', '1.1.2')
        self.assertEqual(self.resolve(baseline=baseline)['sqliteVector']['digest']['value'], 'd' * 64)
        self.assertEqual(baseline['sqliteVec']['digest']['value'], 'b' * 64)
        sql, releases = metadata()
        for key in ('tag_name',): releases[0][key] = 'v1.1.2'
        for key in ('html_url',): releases[0][key] = releases[0][key].replace('0.1.9','1.1.2')
        for key in ('name','browser_download_url'): releases[0]['assets'][0][key] = releases[0]['assets'][0][key].replace('0.1.9','1.1.2')
        result = inputs.resolve_pair(sql, releases, baseline=vector_lock(), fetch=release_page)
        self.assertEqual(result['sqliteVec']['digest']['value'], 'b' * 64)

    def test_annotated_tag_and_unbound_commit(self):
        def annotated(url):
            if '/git/ref/' in url:
                return json.dumps({'ref':'refs/tags/1.1.2','object':{'sha':'a'*40,'type':'tag','url':inputs.VECTOR_API+'/git/tags/'+'a'*40}})
            if '/git/tags/' in url:
                return json.dumps({'sha':'a'*40,'object':{'sha':VECTOR_COMMIT,'type':'commit','url':vector_lock()['sqliteVector']['commitUrl']}})
            return vector_metadata(url)
        self.assertEqual(self.resolve(fetch=annotated), vector_lock())
        def unbound(url):
            return json.dumps({'sha':'a'*40}) if '/git/commits/' in url else vector_metadata(url)
        with self.assertRaises(inputs.InputError): self.resolve(fetch=unbound)

    def test_sqlite_digest_policy_is_unchanged(self):
        with self.assertRaises(inputs.InputError):
            inputs.resolve_vector_pair(metadata()[0].replace('a'*64,''), [vector_release()], fetch=vector_metadata, archive_digest=lambda url:'d'*64)

    def test_command_candidate_is_atomic_and_not_adopted(self):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d); (root/'inputs').mkdir(); baseline=root/'inputs/sources.lock.json'
            baseline.write_text(json.dumps(lock())); output=root/'candidate.json'; output.write_text('previous')
            args=argparse.Namespace(sqlite_version=None,vector_version='1.1.2',baseline_lock=None,output=str(output))
            def fetch(url):
                if url==inputs.SQLITE_DOWNLOAD:return metadata()[0]
                if '/releases/tags/' in url:return json.dumps(vector_release())
                return vector_metadata(url)
            def archive(url,path):path.write_bytes(b'candidate bytes')
            with patch.object(inputs,'ROOT',root), patch.object(inputs,'MetadataFetch',return_value=fetch), patch.object(inputs,'fetch_file',side_effect=archive):
                with patch('sys.stdout',new=io.StringIO()):inputs.resolve_vector_command(args)
                candidate=inputs.read_json(output)
                self.assertEqual(candidate['sqliteVector']['digest']['value'],hashlib.sha256(b'candidate bytes').hexdigest())
                self.assertEqual(inputs.read_json(baseline),lock())
                self.assertFalse(list((root/'.work/inputs').glob('acquire-*')))
                with patch.object(inputs,'fetch_file',side_effect=OSError('transport')):
                    with self.assertRaises(OSError):inputs.resolve_vector_command(args)
                self.assertEqual(inputs.read_json(output),candidate)


def vector_archive(path, v='1.1.2', change=None):
    root='sqlite-vector-'+VECTOR_COMMIT
    files={f'src/distance-{cpu}.{ext}':b'fixture\n' for cpu in ('cpu','avx2','avx512','neon','rvv','sse2') for ext in ('c','h')}
    files.update({'src/sqlite-vector.c':b'fixture\n','src/sqlite-vector.h':f'#define SQLITE_VECTOR_VERSION "{v}"\n'.encode(),
        'LICENSE.md':b'fixture license\n', **{f'libs/fp16/{n}.h':b'fixture\n' for n in ('fp16','bitcasts','macros')},
        'libs/sqlite3.c':b'excluded','packages/unrelated':b'excluded'})
    with tarfile.open(path,'w:gz') as archive:
        for name,data in files.items():
            if change and change[0]=='omit' and name==change[1]:continue
            entry=tarfile.TarInfo(root+'/'+name);entry.size=len(data);entry.mode=0o644
            archive.addfile(entry,io.BytesIO(data))
        entry=tarfile.TarInfo(root+'/packages/node/LICENSE.md');entry.type=tarfile.SYMTYPE;entry.linkname='../../../LICENSE.md';archive.addfile(entry)
        if change and change[0]!='omit':
            name,kind=change; entry=tarfile.TarInfo(root+'/'+name if not name.startswith('/') else name)
            entry.type=kind; entry.linkname='../../outside';archive.addfile(entry)


class VectorAcquisitionTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory(); self.addCleanup(self.temp.cleanup);self.directory=Path(self.temp.name)
        self.legacy,self.sql,self.vec=archives(self.directory)
        self.path=self.directory/'vector.tar.gz';vector_archive(self.path)
        self.candidate=vector_lock();self.candidate['sqlite']=self.legacy['sqlite'];self.freeze()
        self.parent=self.directory/'work';self.parent.mkdir();self.older=self.parent/'older';self.older.mkdir();(self.older/'keep').write_text('keep')
        self.calls=[]

    def freeze(self):
        self.candidate['sqliteVector']['digest']['value']=hashlib.sha256(self.path.read_bytes()).hexdigest()
        self.raw=json.dumps(self.candidate).encode()

    def fetch(self,url,destination):
        self.calls.append(url)
        sources={self.candidate['sqlite']['archiveUrl']:self.sql,self.candidate['sqliteVector']['archiveUrl']:self.path,self.legacy['sqliteVec']['archiveUrl']:self.vec}
        destination.write_bytes(sources[url].read_bytes())

    def acquire(self):return inputs.acquire_lock(self.raw,self.parent,fetch=self.fetch)

    def test_selected_bytes_exclusions_handoff_and_both_orders(self):
        for raw in (self.raw,json.dumps(self.legacy).encode(),json.dumps(self.legacy).encode(),self.raw):
            before=len(self.calls);h=inputs.acquire_lock(raw,self.parent,fetch=self.fetch)
            engine='sqliteVector' if 'sqliteVector' in h else 'sqliteVec';pin=json.loads(raw)[engine]
            self.assertEqual(set(h),{'workspace','lockDigest','sqlite',engine})
            self.assertEqual(len(self.calls)-before,2)
            self.assertEqual(h[engine]['archiveUrl'],pin['archiveUrl']);self.assertEqual(h[engine]['digest'],pin['digest'])
            self.assertEqual(h['lockDigest']['value'],hashlib.sha256(raw).hexdigest())
            source=Path(h[engine]['sourcePath'])
            self.assertTrue((Path(h['sqlite']['sourcePath'])/'configure').stat().st_mode & 0o111)
            if engine=='sqliteVector':
                self.assertEqual(h[engine]['commit'],VECTOR_COMMIT)
                self.assertFalse((source/'libs/sqlite3.c').exists());self.assertFalse((source/'packages').exists())
                self.assertFalse(any(p.is_symlink() for p in source.rglob('*')))
                with tarfile.open(self.path,'r:gz') as archive:
                    for p in source.rglob('*'):
                        if p.is_file():self.assertEqual(p.read_bytes(),archive.extractfile('sqlite-vector-'+VECTOR_COMMIT+'/'+p.relative_to(source).as_posix()).read())
            self.assertEqual(inputs.read_json(Path(h['workspace'])/'handoff.json'),h)
        self.assertEqual(len(list(self.parent.glob('acquire-*'))),4)
        self.assertEqual((self.older/'keep').read_text(),'keep')

    def test_unsafe_paths_selected_links_and_collisions(self):
        for change in (('../escape',tarfile.REGTYPE),('/escape',tarfile.REGTYPE),('src/escape\\file',tarfile.REGTYPE),
                       ('src/sqlite-vector.c',tarfile.REGTYPE),('src/new',tarfile.SYMTYPE),('src/new',tarfile.LNKTYPE),
                       ('src/new',tarfile.FIFOTYPE),('src',tarfile.SYMTYPE),('libs',tarfile.SYMTYPE),
                       ('src/distance-cpu.c/child',tarfile.REGTYPE)):
            vector_archive(self.path,change=change);self.freeze()
            with self.subTest(change=change),self.assertRaises(inputs.InputError):self.acquire()
            self.assertEqual(list(self.parent.iterdir()),[self.older])
        self.assertFalse((self.directory/'escape').exists())

    def test_content_and_version_required(self):
        for missing in ('src/sqlite-vector.c','libs/fp16/fp16.h','src/distance-rvv.h','LICENSE.md'):
            vector_archive(self.path,change=('omit',missing));self.freeze()
            with self.subTest(missing=missing),self.assertRaises(inputs.InputError):self.acquire()
        vector_archive(self.path,v='1.1.1');self.freeze()
        with self.assertRaises(inputs.InputError):self.acquire()
        self.assertEqual(list(self.parent.iterdir()),[self.older])

    def test_failures_clean_only_own_workspace_without_other_engine(self):
        for fail_index in (0,1):
            calls=[]
            def fail(url,dest):
                calls.append(url)
                if len(calls)==fail_index+1:raise OSError('download failed')
                self.fetch(url,dest)
            with self.assertRaises(OSError):inputs.acquire_lock(self.raw,self.parent,fetch=fail)
            self.assertNotIn(self.legacy['sqliteVec']['archiveUrl'],calls)
            self.assertEqual(list(self.parent.iterdir()),[self.older])
        def corrupt(url,dest):
            self.fetch(url,dest)
            if url==self.candidate['sqliteVector']['archiveUrl']:dest.write_bytes(b'changed')
        with patch.object(inputs,'extract_vector',wraps=inputs.extract_vector) as extract:
            with self.assertRaises(inputs.InputError):inputs.acquire_lock(self.raw,self.parent,fetch=corrupt)
            extract.assert_not_called()
        self.assertEqual(list(self.parent.iterdir()),[self.older])

    def test_prerelease_handoff_and_git_index_boundary(self):
        v='1.2.0-rc.1';vector_archive(self.path,v=v)
        self.candidate['sqliteVector']=vector_lock(v)['sqliteVector'];self.freeze()
        h=self.acquire();self.assertEqual(h['sqliteVector']['version'],v)
        path=self.directory/'lock.json';path.write_bytes(self.raw)
        with patch.object(inputs,'ROOT',self.directory):
            for raw,ok in ((b'',False),(self.raw,True)):
                with patch.object(inputs.subprocess,'run',return_value=subprocess.CompletedProcess([],0,raw,b'')):
                    if ok:self.assertEqual(inputs.recorded_lock(path),self.raw)
                    else:
                        with self.assertRaises(inputs.InputError):inputs.recorded_lock(path)


if __name__ == '__main__':
    unittest.main()
