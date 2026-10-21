import assert from 'node:assert/strict';
import { cp, mkdir, readFile, rm, writeFile, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { join, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { files, digest } from './prepare.mjs';
import { previewIdentity } from './options.mjs';
import { assertStableCurrent, sourceAt } from './eligibility.mjs';
import { httpReader } from '../release/state.mjs';

export function publicationContext({ eventName, event, ref, sha, repository, actor }) {
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository ?? '') || !/^[a-f0-9]{40}$/.test(sha ?? '')) throw Error('Invalid publication context.');
  if (eventName === 'pull_request') {
    const pr = event.pull_request;
    if (!pr || pr.head.repo.full_name !== repository || actor === 'dependabot[bot]') return null;
    if (pr.state !== 'open' || !Number.isSafeInteger(event.number) || event.number < 1) throw Error('PR is not open.');
    return { mode: 'preview', repository, pullRequest: event.number,
      preview: previewIdentity(pr.head.ref, pr.head.sha) };
  }
  if (!['push', 'workflow_dispatch', 'workflow_run'].includes(eventName) || ref !== 'refs/heads/main') return null;
  return { mode: 'stable', repository, mainCommit: sha, preview: null };
}

async function exists(path) {
  try { await access(path); return true; }
  catch (error) { if (error.code === 'ENOENT') return false; throw error; }
}

export async function hasSite(root) {
  const entries = ['site', 'tools/site.sh'];
  if (!(await Promise.all(entries.map(path => exists(join(root, path))))).some(Boolean)) return false;
  for (const path of ['site/index.md', 'site/.vitepress/config.mts', 'tools/site.sh', 'tools/site/package-lock.json']) {
    if (!await exists(join(root, path))) throw Error(`Incomplete stable site: ${path}`);
  }
  return true;
}

async function validatedOutput(root) {
  const output = join(root, '.work/site/dist');
  const inventory = await files(output);
  for (const page of ['index.html', 'usage/index.html', 'demo/index.html']) {
    if (!inventory.includes(page)) throw Error(`Missing built page: ${page}`);
  }
  if (inventory.some(path => path.startsWith('preview/'))) throw Error('Build contains reserved preview directory.');
  const record = JSON.parse(await readFile(join(root, '.work/site/build.json'), 'utf8'));
  for (const [path, hash] of Object.entries(record.runtime ?? {})) {
    if (digest(await readFile(join(output, path.replace(/^public\//, '')))) !== hash) throw Error('Runtime changed after build.');
  }
  return { output, record };
}

export async function assemble({ stableRoot, candidateRoot, output, context }) {
  for (const root of [stableRoot, candidateRoot].filter(Boolean)) {
    if (resolve(output) === resolve(root) || resolve(root).startsWith(resolve(output) + sep) ||
        resolve(output).startsWith(resolve(root, '.work/site/dist') + sep)) throw Error('Unsafe assembly output.');
  }
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  try {
    const stablePresent = await hasSite(stableRoot);
    if (context.mode === 'stable' && !stablePresent) throw Error('Main deployment requires a stable site.');
    if (stablePresent) {
      const stable = await validatedOutput(stableRoot);
      if (stable.record.preview) throw Error('Stable build contains preview metadata.');
      if (context.stablePlaceholder) {
        assert.deepEqual(stable.record.placeholder, {sourceCommit:context.mainCommit,sha256:context.stablePlaceholder.sha256}, 'Stable placeholder build identity mismatch');
        assert.equal(stable.record.runtime, null);
      }
      await cp(stable.output, output, { recursive: true });
    }
    if (context.mode === 'preview') {
      const candidate = await validatedOutput(candidateRoot);
      if (JSON.stringify(candidate.record.preview) !== JSON.stringify(context.preview)) throw Error('Candidate build identity mismatch.');
      await cp(candidate.output, join(output, 'preview'), { recursive: true });
    }
    const record = { ...context, stablePresent };
    await writeFile(join(output, 'site-publication.json'), JSON.stringify(record, null, 2) + '\n');
    return record;
  } catch (error) {
    await rm(output, { recursive: true, force: true });
    throw error;
  }
}

// Every request is read-only. Freshness is checked inside the shared workflow
// concurrency section immediately before handing the artifact to Pages.
export async function assertCurrent(record, get) {
  if (!/^[\w.-]+\/[\w.-]+$/.test(record.repository ?? '') || !/^[a-f0-9]{40}$/.test(record.mainCommit ?? '')) throw Error('Invalid publication record.');
  const currentMain = await get(`repos/${record.repository}/commits/main`);
  if (currentMain.sha !== record.mainCommit) throw Error('Stable baseline advanced; rerun Site with current main.');
  if (record.mode === 'preview') {
    const pr = await get(`repos/${record.repository}/pulls/${record.pullRequest}`);
    if (pr.state !== 'open' || pr.head.repo.full_name !== record.repository ||
        pr.head.sha !== record.preview.commit || pr.head.ref !== record.preview.branch) {
      throw Error('PR closed or head superseded; do not publish this preview.');
    }
  } else if (record.mode !== 'stable') throw Error('Invalid publication mode.');
}

const revision = root => execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (command === 'has-site' && args.length === 1) {
    console.log(await hasSite(args[0]) ? 'true' : 'false');
  } else if (command === 'assemble' && args.length === 3) {
    const [stableRoot, candidateRoot, output] = args;
    const env = process.env;
    const context = publicationContext({ eventName: env.GITHUB_EVENT_NAME,
      event: JSON.parse(await readFile(env.GITHUB_EVENT_PATH, 'utf8')), ref: env.GITHUB_REF,
      sha: env.GITHUB_SHA, repository: env.GITHUB_REPOSITORY, actor: env.GITHUB_ACTOR });
    if (!context) throw Error('Execution is not eligible for Pages publication.');
    const selection = JSON.parse(await readFile('.work/site/selection.json', 'utf8'));
    if (!selection.publish || selection.repository !== context.repository) throw Error('Ineligible documentation selection.');
    const mainCommit = selection.mainCommit;
    if (revision(stableRoot) !== (selection.stable?.sourceCommit ?? mainCommit)) throw Error('Stable checkout identity mismatch.');
    if (context.preview && revision(candidateRoot) !== context.preview.commit) throw Error('PR checkout identity mismatch.');
    console.log(JSON.stringify(await assemble({ stableRoot, candidateRoot, output, context: { ...context, mainCommit, stableDocumentation: selection.stable, ...(selection.stablePlaceholder?{stablePlaceholder:selection.stablePlaceholder}:{}) } })));
  } else if (command === 'guard' && args.length === 1) {
    const record = JSON.parse(await readFile(args[0], 'utf8'));
    await assertCurrent(record, async path => {
      const response = await fetch(`https://api.github.com/${path}`, { headers: {
        Authorization: `Bearer ${process.env.GH_TOKEN}`, Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      }, signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw Error(`Publication state unavailable: HTTP ${response.status}`);
      return response.json();
    });
    const get = httpReader(process.env.GH_TOKEN);
    const localCommit = revision('.');
    await assertStableCurrent(record, {get, directory: resolve('.work/site'),
      readAt: (commit,path,optional=false) => sourceAt({repository:record.repository,commit,path,optional,get,localCommit,directory:resolve('.')})});
    console.log(`Current Pages inputs: ${JSON.stringify(record)}`);
  } else throw Error('Usage: publication.mjs has-site ROOT | assemble STABLE CANDIDATE OUTPUT | guard RECORD');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(error => { console.error(`Site publication: ${error.message}`); process.exitCode = 1; });
}
