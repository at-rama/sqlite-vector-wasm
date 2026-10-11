import assert from 'node:assert/strict';
import { command } from '../acceptance/run.mjs';
import { repositoryName } from '../release/state.mjs';
import { commitPattern } from '../release/policy.mjs';

export function candidateServices({ repository, token, cwd, run = command, request = fetch }) {
  repositoryName(repository); assert.ok(token, 'Native GitHub token required');
  const api = `https://api.github.com/repos/${repository}`;
  const call = async (method, path, body) => {
    let response, value;
    try {
    response = await request(api + path, { method, signal: AbortSignal.timeout(120000),
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json',
        'User-Agent': 'sqlite-vector-wasm-candidate' }, body: body === undefined ? undefined : JSON.stringify(body) });
    value = await response.json();
    } catch { throw Error(`Candidate GitHub ${method} ${path} transport failed`); }
    // Never retain transport bodies, headers or credentials in diagnostic artifacts.
    assert.ok(response.ok, `Candidate GitHub ${method} ${path} failed (${response.status})`);
    return value;
  };
  return {
    async push(branch, commit) {
      assert.match(branch, /^candidate\/run-[1-9][0-9]*-[1-9][0-9]*$/); assert.match(commit, commitPattern);
      const url = `https://github.com/${repository}.git`, ref = `refs/heads/${branch}`;
      const authorization = Buffer.from(`x-access-token:${token}`).toString('base64');
      const env = { ...process.env, GIT_TERMINAL_PROMPT: '0', GIT_CONFIG_COUNT: '1',
        GIT_CONFIG_KEY_0: 'http.https://github.com/.extraheader', GIT_CONFIG_VALUE_0: `AUTHORIZATION: basic ${authorization}` };
      try {
        assert.equal(await run('git', ['ls-remote', '--heads', url, ref], { cwd, env }), '', 'Existing candidate branch');
        // Empty expected ref enforces creation only, including races. No existing ref can be overwritten.
        await run('git', ['push', `--force-with-lease=${ref}:`, url, `${commit}:${ref}`], { cwd, env });
      } catch { throw Error(`Candidate branch push failed: ${branch}; inspect remote branch state`); }
      const response = await call('GET', `/git/ref/heads/${branch}`);
      assert.equal(response.object?.sha, commit, 'Pushed candidate head mismatch');
      return { branch, head: commit };
    },
    async createPullRequest({ branch, commit, title, body }) {
      assert.match(branch, /^candidate\/run-[1-9][0-9]*-[1-9][0-9]*$/); assert.match(commit, commitPattern);
      const pr = await call('POST', '/pulls', { base: 'main', head: branch, title, body, draft: false });
      assert.equal(pr.base?.ref, 'main'); assert.equal(pr.head?.sha, commit, 'Candidate PR head mismatch');
      return { number: pr.number, url: pr.html_url, head: pr.head.sha };
    },
  };
}
