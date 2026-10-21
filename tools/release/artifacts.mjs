import assert from 'node:assert/strict';
import { mkdir, mkdtemp, writeFile, readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { sha256, repositoryName, download } from './state.mjs';

// Read-only transport for the existing workflow handoffs, not a release ledger.
export async function runArtifact({ repository, run, name, get, directory }) {
  repositoryName(repository);
  assert.ok(Number.isSafeInteger(run.id) && run.id > 0);
  const api = `https://api.github.com/repos/${repository}`;
  const response = await get(`${api}/actions/runs/${run.id}/artifacts?per_page=100`);
  assert.equal(response.status, 200, 'Workflow artifacts unavailable');
  assert.equal(response.data.total_count, response.data.artifacts?.length, 'Truncated workflow artifacts');
  const matches = response.data.artifacts.filter(a => a.name === name && !a.expired);
  assert.equal(matches.length, 1, 'Missing or ambiguous workflow handoff');
  const artifact = matches[0];
  assert.match(artifact.digest || '', /^sha256:[a-f0-9]{64}$/);
  assert.equal(artifact.workflow_run?.id, run.id, 'Artifact run mismatch');
  assert.equal(artifact.workflow_run.head_sha, run.head_sha, 'Artifact source mismatch');
  assert.ok(Number.isSafeInteger(artifact.id) && artifact.id > 0);
  assert.ok(artifact.size_in_bytes > 0 && artifact.size_in_bytes <= 256 * 1024 * 1024, 'Oversized workflow handoff');
  const bytes = await download(`${api}/actions/artifacts/${artifact.id}/zip`, get);
  assert.equal(bytes.length, artifact.size_in_bytes, 'Artifact length mismatch');
  assert.equal(sha256(bytes), artifact.digest.slice(7), 'Artifact digest mismatch');
  await mkdir(directory, { recursive: true });
  const root = await mkdtemp(join(directory, 'artifact-'));
  const archive = join(root, 'input.zip'), output = join(root, 'files');
  await writeFile(archive, bytes);
  execFileSync('python3', ['-c', `import zipfile,sys,stat,re
from pathlib import PurePosixPath
with zipfile.ZipFile(sys.argv[1]) as z:
 seen=set(); total=0
 assert len(z.infolist())<=10000, 'Oversized workflow inventory'
 for i in z.infolist():
  p=PurePosixPath(i.filename); key='/'.join(p.parts)
  assert key and key==i.filename.rstrip('/') and not p.is_absolute() and '..' not in p.parts and re.fullmatch(r'[A-Za-z0-9_./-]+',i.filename), 'Unsafe workflow artifact path'
  assert key not in seen, 'Duplicate workflow artifact member'
  seen.add(key); mode=stat.S_IFMT(i.external_attr>>16)
  assert mode in (0,stat.S_IFREG,stat.S_IFDIR) and not stat.S_ISLNK(i.external_attr>>16), 'Unsafe workflow artifact type'
  total+=i.file_size
  assert total<=512*1024*1024, 'Oversized expanded handoff'
 z.extractall(sys.argv[2])`, archive, output]);
  return { directory: output, id: artifact.id, sha256: artifact.digest.slice(7), name };
}

export async function uniqueRecord(artifact, basename, predicate = () => true) {
  const found = [];
  async function walk(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) await walk(path);
      else {
        assert.ok(entry.isFile(), 'Nonregular handoff member');
        if (entry.name === basename) {
          const value = JSON.parse(await readFile(path, 'utf8'));
          if (predicate(value)) found.push(value);
        }
      }
    }
  }
  await walk(artifact.directory);
  assert.equal(found.length, 1, `Missing or ambiguous ${basename}`);
  return found[0];
}
