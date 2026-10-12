import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { regularBytes } from '../package/package.mjs';
import { command } from '../acceptance/run.mjs';
import { repositoryName, download, npmState, sha256 } from './state.mjs';

export function githubServices({ repository, token, get, directory, initialNpmException = false, environment = process.env, run = command }) {
  repositoryName(repository);
  const api = `https://api.github.com/repos/${repository}/`;
  const request = async (method, path, body, binary = false) => {
    const url = path.startsWith('https://') ? path : api + path;
    assert.ok(url.startsWith(api) || url.startsWith(`https://uploads.github.com/repos/${repository}/`), 'Unexpected publication endpoint');
    const response = await fetch(url, { method, signal:AbortSignal.timeout(120000), headers:{
      Authorization:`Bearer ${token}`, Accept:'application/vnd.github+json', 'User-Agent':'sqlite-vector-wasm-release',
      'Content-Type':binary ? 'application/octet-stream' : 'application/json',
    }, body:body === undefined ? undefined : binary ? body : JSON.stringify(body) });
    const value = await response.json();
    assert.ok(response.ok, `${method} ${new URL(url).pathname} failed (${response.status}): ${value.message || 'service error'}`);
    return value;
  };
  const verifyGitHub = async (release, evidence) => {
    const response = await get(`${api}releases/${release.id}`);
    assert.equal(response.status,200); const value = response.data;
    assert.equal(value.tag_name,evidence.tag); assert.equal(value.draft,false);
    assert.equal(value.prerelease,evidence.channel === 'next');
    const ref = await get(`${api}git/ref/tags/${evidence.tag}`);
    assert.equal(ref.status,200); assert.equal(ref.data.object?.type,'commit'); assert.equal(ref.data.object.sha,evidence.commit);
    for (const [name, expected] of [['payload.tgz',evidence.archive.sha256], ['publication.json',null]]) {
      const assets = value.assets.filter(asset=>asset.name === name); assert.equal(assets.length,1);
      const bytes = await download(assets[0].url,get);
      if (expected) { assert.equal(sha256(bytes),expected); assert.equal(bytes.length,evidence.archive.size); }
      else assert.deepEqual(JSON.parse(bytes.toString('utf8')),evidence);
    }
    return { id:value.id,url:value.html_url };
  };
  const verifyNpm = async evidence => {
    // Successful publishing need not imply immediately consistent registry reads.
    const pending = (reason, observed = null) => ({ status:'verification-pending',
      version:evidence.version, channel:evidence.channel, reason, observed });
    const url = 'https://registry.npmjs.org/' + evidence.name.replaceAll('/', '%2f');
    let response;
    try { response = await get(url); }
    catch { return pending('npm registry metadata is not yet readable'); }
    if (response.status !== 200) return pending('npm registry metadata is not yet readable');
    // Invalid registry metadata is not propagation lag.
    const npm = await npmState(async () => response,{allowAbsent:false});
    const version = npm.versions[evidence.version];
    if (!version) return pending('published npm version is not yet visible');
    let archive;
    try { archive = await get(version.dist.tarball,{binary:true}); }
    catch { return pending('npm archive is not yet readable'); }
    if (archive.status !== 200) return pending('npm archive is not yet readable');
    assert.ok(Buffer.isBuffer(archive.data) && archive.data.length, 'Invalid npm archive response');
    assert.equal(archive.data.length,evidence.archive.size,'Published npm archive size mismatch');
    assert.equal(sha256(archive.data),evidence.archive.sha256,'Published npm archive digest mismatch');
    assert.ok(version.dist.attestations?.provenance,'Missing supported npm provenance');
    const observed = npm['dist-tags'][evidence.channel];
    if (observed !== evidence.version) return pending('npm channel has not yet converged',observed || null);
    return { status:'verified',version:evidence.version,sha256:sha256(archive.data) };
  };
  return {
    initialNpmException,
    async assertReady({bootstrap}) {
      assert.ok(token,'Missing GitHub publication authorization');
      assert.equal(environment.GITHUB_ACTIONS,'true'); assert.equal(environment.RUNNER_ENVIRONMENT,'github-hosted');
      assert.ok(environment.ACTIONS_ID_TOKEN_REQUEST_URL && environment.ACTIONS_ID_TOKEN_REQUEST_TOKEN,'Missing supported OIDC/attestation authorization');
      assert.ok(!Object.entries(environment).some(([key,value])=>value && /^(NODE_AUTH_TOKEN|NPM_TOKEN|NPM_CONFIG_.*AUTH.*|npm_config_.*auth.*)$/i.test(key)), 'Persistent npm credentials are not permitted');
      assert.ok(!environment.NPM_CONFIG_PROVENANCE_FILE && !environment.npm_config_provenance_file, 'External provenance override is not permitted');
      // The harness checks the pinned SDK paths, versions and digests itself.
      if (!bootstrap) await run('bash',['tools/harness.sh','check'],{env:environment});
    },
    createTag: (tag,commit) => request('POST','git/refs',{ref:`refs/tags/${tag}`,sha:commit}),
    createDraft: (identity,notes) => request('POST','releases',{tag_name:identity.tag,target_commitish:undefined,name:`sqlite-vector-wasm ${identity.version}`,body:notes,draft:true,prerelease:identity.channel === 'next',make_latest:identity.channel === 'latest' ? 'true':'false'}),
    async upload(release,name,path) {
      assert.ok(!release.assets?.some(asset=>asset.name===name), 'Existing asset cannot be overwritten');
      const url = release.upload_url.replace(/\{.*$/, '') + `?name=${encodeURIComponent(name)}`;
      const result = await request('POST',url,await regularBytes(path),true);
      assert.equal(result.name,name); assert.equal(result.state,'uploaded'); return {id:result.id,name:result.name};
    },
    async npmPublish(archive,channel) {
      // npm rejects one file loaded twice as both user and global configuration.
      const userConfig = join(directory,'empty-user.npmrc'), globalConfig = join(directory,'empty-global.npmrc');
      await Promise.all([writeFile(userConfig,'\n',{flag:'wx'}),writeFile(globalConfig,'\n',{flag:'wx'})]);
      await run('bash',['tools/harness.sh','exec','npm','publish',archive,'--tag',channel,'--access','public','--ignore-scripts','--provenance'],
        {env:{...environment,npm_config_userconfig:userConfig,npm_config_globalconfig:globalConfig,npm_config_registry:'https://registry.npmjs.org/'}});
      return {channel};
    },
    finalize: release => request('PATCH',`releases/${release.id}`,{draft:false}),
    verifyGitHub, verifyNpm,
  };
}
