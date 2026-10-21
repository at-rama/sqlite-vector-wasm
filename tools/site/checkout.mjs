import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const git = (directory, ...args) => execFileSync('git', ['-C', directory, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const commit = value => { assert.match(value ?? '', /^[0-9a-f]{40}$/); return value; };

// No dynamic fetch: the PR head must already be the second parent of the
// GitHub event merge. Non-PR executions stay at their controller revision.
export function selectPreview({ directory, controller, eventName, head }) {
  assert.equal(git(directory, 'rev-parse', 'HEAD'), commit(controller), 'Event checkout changed');
  if (eventName !== 'pull_request') return controller;
  assert.equal(git(directory, 'rev-parse', 'HEAD^2'), commit(head), 'PR head is not the event merge parent');
  git(directory, 'checkout', '--detach', head);
  return git(directory, 'rev-parse', 'HEAD');
}

// Stable tooling may only come from the observed, independently fetched main
// history. A selected PR/unrelated revision cannot become stable executable code.
export function selectStable({ directory, main, selected }) {
  assert.equal(git(directory, 'rev-parse', 'HEAD'), commit(main), 'Main advanced since selection');
  commit(selected);
  git(directory, 'merge-base', '--is-ancestor', selected, main);
  git(directory, 'checkout', '--detach', selected);
  return git(directory, 'rev-parse', 'HEAD');
}

async function main() {
  const [mode, ...args] = process.argv.slice(2);
  assert.equal(args.length, 0);
  if (mode === 'preview') {
    const event = JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH, 'utf8'));
    selectPreview({ directory: '.', controller: process.env.GITHUB_SHA,
      eventName: process.env.GITHUB_EVENT_NAME, head: event.pull_request?.head?.sha });
  } else if (mode === 'stable') {
    const selection = JSON.parse(await readFile('.work/site/selection.json', 'utf8'));
    selectStable({ directory: '../stable', main: selection.mainCommit,
      selected: selection.stable?.sourceCommit ?? selection.mainCommit });
  } else throw Error('Usage: checkout.mjs preview | stable');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(error => { console.error(`Site checkout: ${error.message}`); process.exitCode = 1; });
}
