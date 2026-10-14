import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { noticeInputs } from '../package/package.mjs';
import { command } from '../acceptance/run.mjs';

export const noticePaths = ['tools/package/notices.json', ...[
  'SQLite-LICENSE.txt', 'SQLite-WASM-NOTICE.txt', 'sqlite-vec-MIT.txt', 'sqlite-vec-APACHE.txt',
].map(name => `tools/package/notices/${name}`)];

export async function reconcileNotices({ repository, directory, lock, run = command }) {
  const reportPath = join(directory, 'notices.json');
  // Persist the boundary failure too: the Python helper must not repair corrupt baseline inputs.
  try {
    const baseline = JSON.parse(await readFile(join(repository, 'inputs/sources.lock.json'), 'utf8'));
    await noticeInputs({ inputs: baseline }, repository);
    const lockPath = join(directory, 'notice-sources.lock.json');
    await writeFile(lockPath, JSON.stringify(lock, null, 2) + '\n');
    const result = JSON.parse(await run('python3', [fileURLToPath(new URL('notices.py', import.meta.url)),
      '--repository', repository, '--lock', lockPath, '--directory', directory],
    { cwd: repository, log: join(directory, 'notices.log'), env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } }));
    assert.equal(result.prepared, join(directory, 'prepared'));
    assert.equal(result.reportPath, reportPath);
    await noticeInputs({ inputs: lock }, result.prepared);
    return result;
  } catch (error) {
    let report;
    try { report = JSON.parse(await readFile(reportPath, 'utf8')); }
    catch (readError) { if (readError.code !== 'ENOENT') throw readError;
      report = { schemaVersion: 1, selection: { sqlite: lock.sqlite.version, sqliteVec: lock.sqliteVec.version }, notices: [] }; }
    report.status = 'failed'; report.diagnostic = error.message;
    await writeFile(reportPath, JSON.stringify(report, null, 2) + '\n');
    throw error;
  }
}
