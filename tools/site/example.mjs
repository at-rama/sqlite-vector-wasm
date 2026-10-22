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
import { acceptedPayload } from '../release/run.mjs';
import { channelFor } from '../release/policy.mjs';
import { sourceCommit, documentationHashes, dirtyDocumentation, renderPublicDocument, documentationSelection } from './documentation.mjs';

const sha = bytes => createHash('sha256').update(bytes).digest('hex');
// Read the actual guide sections; generated reproducibility fences must not
// change which authored copy recipe and SQL snippets the browser exercises.
export function exampleSnippets(tokens) {
  function section(title, language, predicate = () => true) {
    const starts = tokens.flatMap((token, i) => token.type === 'heading_open'
      && tokens[i + 1]?.content === title ? [i] : []);
    assert.equal(starts.length, 1, `Missing/ambiguous documented section: ${title}`);
    const start = starts[0], level = Number(tokens[start].tag.slice(1));
    let end = tokens.findIndex((token, i) => i > start && token.type === 'heading_open'
      && Number(token.tag.slice(1)) <= level);
    if (end === -1) end = tokens.length;
    const matches = tokens.slice(start, end).filter(token => token.type === 'fence'
      && token.info.trim() === language && token.content.trim() && predicate(token.content));
    assert.equal(matches.length, 1, `Missing/ambiguous ${language} example in ${title}`);
    return matches[0].content;
  }
  return {
    recipe: section('Host and initialize', 'sh', code => /^mkdir -p public\/sqlite\s*$/m.test(code)),
    snippets: [section('Host and initialize', 'js'), section('Float32 nearest neighbors', 'js')],
  };
}
export function validateExample(selection, guide, publication, archive) {
  assert.match(guide, new RegExp(`(?:published version|Published distribution) \\*\\*${selection.version.replaceAll('.', '\\.')}\\*\\*`), 'Announced guide version mismatch');
  assert.ok(guide.includes(`npm install @at-rama/sqlite-vector-wasm@${selection.version}`), 'Install version mismatch');
  assert.equal(sha(archive), selection.archiveSha256, 'Published archive digest mismatch');
  assert.equal(publication.version, selection.version);
  assert.equal(publication.commit, selection.commit);
  assert.equal(publication.tag, `dist/v${selection.version}`);
  assert.ok(['latest', 'next'].includes(publication.channel), 'Invalid published channel');
  if (publication.upstreams) assert.equal(publication.channel, channelFor(publication.upstreams), 'Published channel/composition mismatch');
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
export async function candidateExample({ bundle, root = repository, commit, engine = 'sqliteVector' }) {
  const report = JSON.parse(await regularBytes(join(bundle, 'acceptance.json')));
  assert.equal(report.package.name, '@at-rama/sqlite-vector-wasm', 'Wrong candidate package');
  const accepted = await acceptedPayload({ bundle, identity: report.package, commit, repository: root });
  assert.equal(accepted.packaged.engine.key, engine, 'Wrong candidate documentation engine');
  assert.equal(engine, 'sqliteVector', 'Product documentation requires Vector');
  return accepted;
}

export async function example(root = repository, options = {}) {
  const work = join(root, '.work/docs-example');
  await mkdir(work, { recursive: true });
  const selected = options.selection ?? await documentationSelection(root);
  const rawGuide = options.guide ?? await readFile(join(root, 'docs/usage.md'), 'utf8');
  const commit = sourceCommit(root), expectedCommit = options.expectedCommit ?? commit;
  const replayOnly = Boolean(options.guide || options.selection || expectedCommit !== commit);
  await rm(join(work, replayOnly ? 'replay.json' : 'result.json'), { force: true });
  const sourceHashes = await documentationHashes(root), sourceDirty = dirtyDocumentation(root);
  let selection, publication, archive, context;
  if (selected.mode === 'candidate') {
    const bundle = options.candidateBundle ?? process.env.SITE_CANDIDATE_BUNDLE;
    assert.ok(bundle, 'Candidate documentation requires an explicit qualified archive bundle');
    const accepted = await candidateExample({ bundle, root, commit: expectedCommit, engine: selected.engine });
    assert.equal(selected.sourceLockPath, accepted.build.sourceLockPath, 'Wrong documentation source lock');
    archive = await readFile(accepted.archivePath);
    selection = { version: accepted.packaged.package.version, commit: expectedCommit, archiveSha256: accepted.archive.sha256 };
    publication = { upstreams: Object.fromEntries(['sqlite', 'sqliteVector'].map(k => [k, accepted.sourceLock[k].version])), runtimeFiles: accepted.packaged.runtimeFiles };
    context = { mode: 'candidate', engine: 'sqliteVector', version: selection.version, commit, qualifiedCommit: expectedCommit,
      archive: accepted.archive, sourceLockPath: accepted.build.sourceLockPath, sourceLockSha256: accepted.report.sourceLockSha256, upstreams: publication.upstreams, sourceHashes, sourceDirty };
  } else {
    selection = selected;
    ({ publication, archive } = await downloadExample(selection));
    assert.ok(publication.upstreams?.sqliteVector && !publication.upstreams?.sqliteVec, 'Current documentation requires SQLite-Vector');
    const engine = 'sqliteVector';
    context = { mode: 'published', engine, version: selection.version, commit, publicationCommit: publication.commit,
      archive: { size: archive.length, sha256: sha(archive) }, upstreams: publication.upstreams, sourceHashes, sourceDirty };
  }
  const guide = selected.mode ? renderPublicDocument(rawGuide, context) : rawGuide;
  if (context.mode === 'published') validateExample(selection, guide, publication, archive);
  if (context.mode === 'candidate') {
    assert.match(guide, /Unpublished release candidate/);
    assert.ok(!guide.includes(`npm install @at-rama/sqlite-vector-wasm@${selection.version}`), 'Candidate cannot claim npm availability');
  }
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
  const { recipe, snippets } = exampleSnippets(tokens);
  execFileSync('sh', ['-c', recipe], { cwd: directory, stdio: 'pipe' });
  const publicRoot = join(directory, 'public'), runtime = join(publicRoot, 'sqlite');
  assert.deepEqual((await readdir(runtime)).sort(), [...runtimeNames].sort(), 'Copied runtime inventory mismatch');
  for (const file of publication.runtimeFiles) {
    const bytes = await regularBytes(join(runtime, file.name));
    assert.equal(bytes.length, file.size); assert.equal(sha(bytes), file.sha256);
  }
  const exampleCode = snippets.join('\n') + `
const sqliteVersion = db.selectValue('SELECT sqlite_version()');
const engineVersion = db.selectValue('SELECT vector_version()');
db.close();
const result = { neighbors, sqliteVersion, engineVersion };
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
    assert.equal(result.engineVersion.replace(/^v/, ''), publication.upstreams[context.engine]);
    for (const file of publication.runtimeFiles) assert.equal(sha(await regularBytes(join(runtime, file.name))), file.sha256);
    assert.deepEqual(await documentationHashes(root), sourceHashes, 'Documentation changed during example execution');
    const evidence = { context, replayOnly, selection, guideSha256: sha(guide), snippetsSha256: sha(snippets.join('\n')),
      assetCopy: { recipeSha256: sha(recipe), installedFromVerifiedArchive: true, files: publication.runtimeFiles },
      browser: browser.version(), result, workerResult, unchangedRuntime: true };
    await writeFile(join(work, replayOnly ? 'replay.json' : 'result.json'), JSON.stringify(evidence, null, 2) + '\n');
    console.log(JSON.stringify(evidence));
    return evidence;
  } finally { await browser.close(); await server.close(); }
}
