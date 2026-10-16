import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, rm, mkdtemp, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { runtimeNames } from '../build/config.mjs';
import { regularBytes } from '../package/package.mjs';
import { launchBrowser } from '../harness/browser.mjs';
import { serveSite } from './server.mjs';
import { renderer } from './docs.mjs';
import { repository } from './build.mjs';

const sha = bytes => createHash('sha256').update(bytes).digest('hex');
export function validateExample(selection, guide, publication, archive) {
  assert.match(guide, new RegExp(`published version \\*\\*${selection.version.replaceAll('.', '\\.')}\\*\\*`), 'Announced guide version mismatch');
  assert.ok(guide.includes(`npm install @at-rama/sqlite-vector-wasm@${selection.version}`), 'Install version mismatch');
  assert.equal(sha(archive), selection.archiveSha256, 'Published archive digest mismatch');
  assert.equal(publication.version, selection.version);
  assert.equal(publication.commit, selection.commit);
  assert.equal(publication.tag, `dist/v${selection.version}`);
  assert.equal(publication.channel, 'latest');
  assert.equal(publication.archive.sha256, selection.archiveSha256);
  assert.equal(publication.archive.size, archive.length);
  assert.deepEqual(publication.runtimeFiles.map(file => file.name).sort(), [...runtimeNames].sort());
}
export async function downloadExample(selection, get = fetch) {
  const bytes = async url => {
    const response = await get(url, { signal: AbortSignal.timeout(60000) });
    assert.ok(response.ok, `Published dependency unavailable: ${url} (${response.status})`);
    return Buffer.from(await response.arrayBuffer());
  };
  const publicationBytes = await bytes(selection.publicationUrl);
  assert.equal(sha(publicationBytes), selection.publicationSha256, 'Publication digest mismatch');
  return { publication: JSON.parse(publicationBytes), archive: await bytes(selection.archiveUrl) };
}
export async function example(root = repository) {
  const work = join(root, '.work/docs-example');
  await mkdir(work, { recursive: true });
  await rm(join(work, 'result.json'), { force: true });
  const selection = JSON.parse(await readFile(join(root, 'tools/site/docs-example.json'), 'utf8'));
  const guide = await readFile(join(root, 'docs/usage.md'), 'utf8');
  const { publication, archive } = await downloadExample(selection);
  validateExample(selection, guide, publication, archive);
  await writeFile(join(work, 'payload.tgz'), archive);
  const directory = await mkdtemp(join(work, 'run-'));
  // Install the verified local archive, without registry resolution or scripts,
  // then execute the copy commands authored in Usage in this consumer root.
  execFileSync('npm', ['install', '--offline', '--ignore-scripts', '--no-audit', '--no-fund', join(work, 'payload.tgz')],
    { cwd: directory, stdio: 'pipe' });
  const installed = join(directory, 'node_modules/@at-rama/sqlite-vector-wasm');
  const metadata = JSON.parse(await readFile(join(installed, 'package.json'), 'utf8'));
  assert.equal(metadata.name, '@at-rama/sqlite-vector-wasm');
  assert.equal(metadata.version, selection.version);
  for (const file of publication.runtimeFiles) {
    const bytes = await regularBytes(join(installed, file.name));
    assert.equal(bytes.length, file.size); assert.equal(sha(bytes), file.sha256);
  }
  const tokens = (await renderer(root)).parse(guide, {});
  const recipe = tokens.filter(token => token.type === 'fence' && token.info.trim() === 'sh')[1]?.content;
  assert.ok(recipe, 'Missing documented asset-copy commands');
  execFileSync('sh', ['-c', recipe], { cwd: directory, stdio: 'pipe' });
  const publicRoot = join(directory, 'public'), runtime = join(publicRoot, 'sqlite');
  assert.deepEqual((await readdir(runtime)).sort(), [...runtimeNames].sort(), 'Copied runtime inventory mismatch');
  for (const file of publication.runtimeFiles) {
    const bytes = await regularBytes(join(runtime, file.name));
    assert.equal(bytes.length, file.size); assert.equal(sha(bytes), file.sha256);
  }
  const snippets = tokens.filter(token => token.type === 'fence' && token.info.trim() === 'js').slice(0, 2).map(token => token.content);
  assert.equal(snippets.length, 2, 'Missing actual initialization/minimal SQL snippets');
  const exampleCode = snippets.join('\n') + `
const sqliteVersion = db.selectValue('SELECT sqlite_version()');
const vecVersion = db.selectValue('SELECT vec_version()');
db.close();
const result = { neighbors, sqliteVersion, vecVersion };
`;
  await writeFile(join(publicRoot, 'example.mjs'), exampleCode + 'window.exampleResult = result;\n');
  await writeFile(join(publicRoot, 'worker.mjs'), exampleCode + 'self.postMessage(result);\n');
  await writeFile(join(publicRoot, 'index.html'), '<!doctype html><script type="module" src="/example.mjs"></script>');
  const server = await serveSite(publicRoot, '/');
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage(); const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(server.url);
    await page.waitForFunction(() => window.exampleResult, { timeout: 30000 });
    const result = await page.evaluate(() => window.exampleResult);
    const workerResult = await page.evaluate(() => new Promise((resolve, reject) => {
      const worker = new Worker('/worker.mjs', { type: 'module' });
      worker.onmessage = ({ data }) => { worker.terminate(); resolve(data); };
      worker.onerror = event => { worker.terminate(); reject(Error(event.message)); };
    }));
    assert.deepEqual(workerResult, result, 'Documented initialization/SQL must also work in a dedicated module Worker');
    assert.deepEqual(errors, []);
    assert.deepEqual(result.neighbors.map(row => row[0]), [1, 2]);
    assert.equal(result.neighbors[0][1], 0);
    assert.ok(Math.abs(result.neighbors[1][1] - Math.SQRT2) < 1e-6);
    assert.equal(result.sqliteVersion, publication.upstreams.sqlite);
    assert.equal(result.vecVersion.replace(/^v/, ''), publication.upstreams.sqliteVec);
    for (const file of publication.runtimeFiles) assert.equal(sha(await regularBytes(join(runtime, file.name))), file.sha256);
    const evidence = { selection, guideSha256: sha(guide), snippetsSha256: sha(snippets.join('\n')),
      assetCopy: { recipeSha256: sha(recipe), installedFromVerifiedArchive: true, files: publication.runtimeFiles },
      browser: browser.version(), result, workerResult, unchangedRuntime: true };
    await writeFile(join(work, 'result.json'), JSON.stringify(evidence, null, 2) + '\n');
    console.log(JSON.stringify(evidence));
    return evidence;
  } finally { await browser.close(); await server.close(); }
}
