import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { root } from '../package/package.mjs';
import { httpReader, readState } from '../release/state.mjs';
import { invocation } from './context.mjs';
import { prepareCandidate } from './run.mjs';
import { candidateServices } from './services.mjs';

try {
  const [mode, ...extra] = process.argv.slice(2);
  assert.ok(['prepare', 'rehearsal'].includes(mode) && !extra.length, 'Usage: updates.sh prepare|rehearsal');
  const env = process.env, rehearsal = mode === 'rehearsal';
  const event = JSON.parse(await readFile(env.GITHUB_EVENT_PATH, 'utf8'));
  if (rehearsal) {
    const lock = JSON.parse(await readFile(join(root, 'inputs/sqlite-vector.sources.lock.json'), 'utf8'));
    event.inputs = { sqlite_version: lock.sqlite.version, sqlite_vector_version: lock.sqliteVector.version, misc_comment: 'Nonpublishing preparation rehearsal' };
  }
  const context = invocation({ event, environment: env, rehearsal });
  const get = httpReader(env.GH_TOKEN);
  const result = await prepareCandidate({ context, readSnapshot: () => readState({ repository: context.repository, get }),
    services: rehearsal ? undefined : candidateServices({ repository: context.repository, token: env.GH_TOKEN, cwd: root }) });
  console.log(JSON.stringify(result));
} catch (error) {
  console.error(error.message); process.exitCode = 1;
}
