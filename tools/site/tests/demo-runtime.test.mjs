import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { validateRuntime, selectStable, extractRuntime, prepareDemo } from '../demo-runtime.mjs';
import { sha } from '../demo-data.mjs';
import { runtimeNames } from '../../build/config.mjs';
const version = '0.2.0', commit = 'a'.repeat(40), archive = Buffer.from('fixture');
const prefix = 'https://github.com/at-rama/sqlite-vector-wasm/releases/download/dist/v0.2.0/';
const selection = { version, commit, archiveUrl: prefix + 'payload.tgz', publicationUrl: prefix + 'publication.json', archiveSha256: sha(archive) };
const publication = { version, commit, tag: 'dist/v0.2.0', channel: 'latest', upstreams: { sqlite: '3.54.0', sqliteVec: '0.1.9' }, archive: { sha256: sha(archive), size: archive.length }, runtimeFiles: runtimeNames.map(name => ({ name })) };
test('exact runtime identity rejects next, mutated archives, versions and members', () => {
  validateRuntime(selection, publication, archive);
  for (const mutate of [p => p.channel = 'next', p => p.version = '9.0.0', p => p.commit = 'b'.repeat(40), p => p.runtimeFiles.pop(), p => p.upstreams.sqliteVec = '0.2.0-alpha.1']) {
    const p = structuredClone(publication); mutate(p); assert.throws(() => validateRuntime(selection, p, archive));
  }
  assert.throws(() => validateRuntime(selection, publication, Buffer.from('changed')));
});
test('only explicit selection discovers latest; reject prerelease and inconsistent release/publication', async () => {
  const pub = Buffer.from(JSON.stringify(publication));
  const release = { id: 1, tag_name: 'dist/v0.2.0', draft: false, prerelease: false,
    assets: ['payload.tgz', 'publication.json'].map(name => ({ name, browser_download_url: prefix + name, digest: 'sha256:' + sha(name === 'payload.tgz' ? archive : pub) })) };
  const get = (latest = '0.2.0', rel = release) => async url => ({ ok: true, arrayBuffer: async () => Buffer.from(url.includes('registry.npmjs') ? JSON.stringify({ version: latest }) : url.includes('api.github') ? JSON.stringify(rel) : pub) });
  const s = await selectStable(get()); assert.equal(s.version, '0.2.0'); assert.equal(s.publicationSha256, sha(pub));
  await assert.rejects(selectStable(get('0.3.0-alpha.1')), /stable/);
  await assert.rejects(selectStable(get('0.2.0', { ...release, prerelease: true })));
  await assert.rejects(selectStable(get('0.2.0', { ...release, tag_name: 'dist/v9.0.0' })));
});
test('bounded extraction rejects duplicate runtime members and preparation clears stale output', async () => {
  const root = await mkdtemp(join(tmpdir(), 'demo-runtime-'));
  try {
    const tar = join(root, 'bad.tgz');
    execFileSync('python3', ['-c', `import tarfile,io,sys
with tarfile.open(sys.argv[1],'w:gz') as t:
 for i in range(2):
  m=tarfile.TarInfo('package/sqlite3.js');m.size=1;t.addfile(m,io.BytesIO(b'x'))
`, tar]);
    assert.throws(() => extractRuntime(tar, root));
    const { mkdir } = await import('node:fs/promises');
    const out = join(root, '.work/prepared'); await mkdir(out, { recursive: true }); await writeFile(join(out, 'stale'), 'x');
    await assert.rejects(prepareDemo(root, out, () => { throw Error('Must not discover'); }));
    await assert.rejects(access(out));
  } finally { await rm(root, { recursive: true, force: true }); }
});
