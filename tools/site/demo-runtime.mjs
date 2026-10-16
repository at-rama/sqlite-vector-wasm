import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, rm, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { runtimeNames } from '../build/config.mjs';
import { download, pinnedFile, sha, prepareData } from './demo-data.mjs';
const repository = 'at-rama/sqlite-vector-wasm';
const releaseBase = `https://github.com/${repository}/releases/`;
export async function selectStable(get = fetch) {
  const latest = JSON.parse(await download('https://registry.npmjs.org/@at-rama%2fsqlite-vector-wasm/latest', get));
  assert.match(latest.version, /^\d+\.\d+\.\d+$/, 'latest must be stable');
  const release = JSON.parse(await download(`https://api.github.com/repos/${repository}/releases/tags/dist%2Fv${latest.version}`, get));
  assert.equal(release.tag_name, `dist/v${latest.version}`); assert.equal(release.draft, false); assert.equal(release.prerelease, false);
  const asset = name => {
    const matches = release.assets.filter(a => a.name === name);
    assert.equal(matches.length, 1, `Missing/duplicate ${name}`);
    assert.match(matches[0].digest, /^sha256:[a-f0-9]{64}$/);
    assert.equal(matches[0].browser_download_url, `${releaseBase}download/dist/v${latest.version}/${name}`);
    return matches[0];
  };
  const archive = asset('payload.tgz'), publication = asset('publication.json');
  const bytes = await download(publication.browser_download_url, get);
  assert.equal(sha(bytes), publication.digest.slice(7), 'Publication digest mismatch');
  const record = JSON.parse(bytes);
  assert.equal(record.version, latest.version); assert.equal(record.channel, 'latest');
  return { version: latest.version, releaseId: release.id, commit: record.commit,
    releaseUrl: `${releaseBase}tag/dist/v${latest.version}`, archiveUrl: archive.browser_download_url,
    archiveSha256: archive.digest.slice(7), publicationUrl: publication.browser_download_url, publicationSha256: publication.digest.slice(7) };
}
export function validateRuntime(selection, publication, archive) {
  assert.match(selection.version, /^\d+\.\d+\.\d+$/, 'Stable version required');
  assert.match(selection.commit, /^[a-f0-9]{40}$/);
  const prefix = `${releaseBase}download/dist/v${selection.version}/`;
  assert.equal(selection.archiveUrl, prefix + 'payload.tgz'); assert.equal(selection.publicationUrl, prefix + 'publication.json');
  assert.equal(publication.version, selection.version); assert.equal(publication.commit, selection.commit);
  assert.equal(publication.tag, `dist/v${selection.version}`); assert.equal(publication.channel, 'latest');
  for (const value of Object.values(publication.upstreams)) assert.match(value, /^\d+\.\d+\.\d+$/, 'Stable upstream required');
  assert.equal(sha(archive), selection.archiveSha256); assert.equal(publication.archive.sha256, selection.archiveSha256);
  assert.equal(publication.archive.size, archive.length);
  assert.deepEqual(publication.runtimeFiles.map(f => f.name).sort(), [...runtimeNames].sort());
}
export function extractRuntime(archive, destination) {
  execFileSync('python3', ['-c', `import tarfile,sys,pathlib,json
root=pathlib.Path(sys.argv[2]); names=json.loads(sys.argv[3])
with tarfile.open(sys.argv[1]) as t:
 members=t.getmembers()
 for name in names:
  found=[m for m in members if m.name=='package/'+name]
  assert len(found)==1 and found[0].isfile(), 'Invalid runtime member '+name
  (root/name).write_bytes(t.extractfile(found[0]).read())
 for m in members:
  name=m.name.removeprefix('package/')
  if name in ['LICENSE','NOTICE','runtime.json'] or name.startswith('licenses/'):
   assert m.name.startswith('package/') and not any(p in ['..',''] for p in name.split('/')), 'Invalid notice path'
   if m.isdir(): continue
   assert m.isfile(), 'Nonregular notice'
   target=root/name;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(t.extractfile(m).read())
 for name in ['LICENSE','NOTICE','runtime.json']:
  assert (root/name).is_file(), 'Missing notice/metadata '+name
`, archive, destination, JSON.stringify(runtimeNames)]);
}
async function inventory(root, prefix = '') {
  const paths = [];
  for (const e of await readdir(join(root, prefix), { withFileTypes: true })) {
    const path = prefix + e.name;
    assert.ok(e.isFile() || e.isDirectory(), 'Nonregular prepared asset');
    if (e.isDirectory()) paths.push(...await inventory(root, path + '/')); else paths.push(path);
  }
  return paths.sort();
}
export async function prepareDemo(root, destination, get = fetch) {
  const output = resolve(destination), work = join(root, '.work/demo-download');
  assert.ok(output.startsWith(resolve(root, '.work') + '/'), 'Prepared demo must be in ignored work');
  await rm(output, { recursive: true, force: true }); await mkdir(work, { recursive: true });
  try {
    const selection = JSON.parse(await readFile(join(root, 'tools/site/demo-runtime.json'), 'utf8'));
    const pub = await pinnedFile(selection.publicationUrl, selection.publicationSha256, join(work, `${selection.version}-publication.json`), get);
    const publication = JSON.parse(pub);
    const archivePath = join(work, `${selection.version}-payload.tgz`);
    const archive = await pinnedFile(selection.archiveUrl, selection.archiveSha256, archivePath, get);
    validateRuntime(selection, publication, archive);
    const runtime = join(output, 'public/demo-runtime'); await mkdir(runtime, { recursive: true });
    extractRuntime(archivePath, runtime);
    for (const file of publication.runtimeFiles) {
      const bytes = await readFile(join(runtime, file.name));
      assert.equal(bytes.length, file.size); assert.equal(sha(bytes), file.sha256, `Runtime digest mismatch: ${file.name}`);
    }
    await writeFile(join(output, 'demo-runtime.json'), JSON.stringify({ ...selection, upstreams: publication.upstreams }) + '\n');
    const paths = ['demo-runtime.json', ...(await inventory(runtime)).map(p => 'public/demo-runtime/' + p)];
    await writeFile(join(output, 'demo-runtime.sha256'), (await Promise.all(paths.map(async p => `${sha(await readFile(join(output, p)))}  ${p}`))).join('\n') + '\n');
    const data = await prepareData(root, join(output, 'public/demo-data'), get);
    return { selection, data };
  } catch (error) { await rm(output, { recursive: true, force: true }); throw error; }
}
