import assert from 'node:assert/strict';
import { readFile, appendFile } from 'node:fs/promises';
import { join } from 'node:path';
import { root, regularBytes } from '../package/package.mjs';
import { command } from '../acceptance/run.mjs';
import { candidateDescriptorChanged, integratedContext, documentationQualificationNeeded } from './context.mjs';
import { calculate } from './policy.mjs';
import { readState, httpReader, repositoryName } from './state.mjs';
import { qualify, acceptedPayload, provenance, publish, checkInitialCompletion } from './run.mjs';
import { githubServices } from './services.mjs';

const json = async path => JSON.parse(await regularBytes(path));
const env = process.env;
const get = httpReader(env.GH_TOKEN || env.GITHUB_TOKEN);
const readAt = async (commit,path) => {
  const response = await get(`https://api.github.com/repos/${repositoryName(env.GITHUB_REPOSITORY)}/contents/${path}?ref=${commit}`);
  assert.equal(response.status, 200, 'Reviewed source unavailable');
  const file = response.data; assert.equal(file.type, 'file'); assert.equal(file.path, path); assert.equal(file.encoding, 'base64');
  const bytes = Buffer.from(file.content, 'base64'); assert.equal(bytes.length, file.size, 'Incomplete reviewed source');
  return bytes.toString('utf8');
};
const context = async siteRunId => ({...await integratedContext({repository:repositoryName(env.GITHUB_REPOSITORY),event:await json(env.GITHUB_EVENT_PATH),get,readAt,siteRunId}), ...(env.RELEASE_SETUP === 'initial-manual-npm' ? {initialNpmException:true} : {})});

try {
  const [mode,...args] = process.argv.slice(2);
  let result;
  if (mode === 'calculate') {
    assert.equal(args.length,1,'Usage: release.sh calculate INPUT.json'); result = calculate(await json(args[0]));
  } else if (mode === 'exercise-needed') {
    assert.equal(args.length,0); assert.equal(env.GITHUB_EVENT_NAME,'pull_request');
    const event = await json(env.GITHUB_EVENT_PATH);
    assert.equal(event.repository?.full_name,repositoryName(env.GITHUB_REPOSITORY));
    result = { exercise: await documentationQualificationNeeded({ repository: env.GITHUB_REPOSITORY,
      pullRequest: event.pull_request, get, profile: await json(join(root,'tools/site/docs-example.json')),
      candidate: await json(join(root,'inputs/release.json')).catch(error=>{if(error.code==='ENOENT')return null;throw error;}) }) };
    if (env.GITHUB_OUTPUT) await appendFile(env.GITHUB_OUTPUT,`exercise=${result.exercise}\n`);
  } else if (mode === 'candidate') {
    assert.equal(args.length,0,'Usage: release.sh candidate');
    const repository = repositoryName(env.GITHUB_REPOSITORY);
    const event = await json(env.GITHUB_EVENT_PATH);
    assert.equal(event.action,'closed');
    assert.equal(event.repository?.full_name,repository);
    const pr = event.pull_request;
    assert.ok(pr?.merged && pr.base?.ref === 'main' && pr.base.repo?.full_name === repository, 'Not an integrated main PR');
    assert.ok(Number.isSafeInteger(pr.number) && pr.number > 0, 'Missing candidate PR number');
    const response = await get(`https://api.github.com/repos/${repository}/pulls/${pr.number}`);
    assert.equal(response.status,200,'Cannot establish candidate context');
    assert.ok(response.data?.merged && response.data.state === 'closed' && response.data.base?.ref === 'main' && response.data.base.repo.full_name === repository, 'Unmerged or unrelated PR');
    assert.equal(response.data.merge_commit_sha,pr.merge_commit_sha,'Integration revision changed');
    result = { candidate: await candidateDescriptorChanged({ repository, pullRequest: response.data, get }) };
    if (env.GITHUB_OUTPUT) await appendFile(env.GITHUB_OUTPUT,`candidate=${result.candidate}\n`);
  } else if (mode === 'prepare') {
    assert.equal(args.length,0);
    result = await qualify({context:await context(),readSnapshot:()=>readState({repository:env.GITHUB_REPOSITORY,get})});
    if (env.GITHUB_OUTPUT) await appendFile(env.GITHUB_OUTPUT,`handoff=${result.path}\narchive=${result.archivePath}\n`);
    const report = await json(join(result.bundle,'acceptance.json'));
    if (env.GITHUB_ENV) await appendFile(env.GITHUB_ENV,`HARNESS_STATE=${report.toolsDirectory}\n`);
  } else if (mode === 'publish') {
    assert.equal(args.length,2,'Usage: release.sh publish HANDOFF.json ATTESTATION.json');
    const handoff = await json(args[0]);
    const integrated = await context(handoff.context.documentation?.site?.runId);
    assert.deepEqual(handoff.context,integrated,'Publication context no longer agrees');
    assert.equal(await command('git',['rev-parse','HEAD'],{cwd:root}),integrated.commit);
    assert.equal(await command('git',['status','--porcelain','--untracked-files=all'],{cwd:root}),'','Dirty publication checkout');
    assert.ok(['trusted','initial-manual-npm'].includes(env.RELEASE_SETUP),'A-bootstrap must establish RELEASE_SETUP');
    result = await publish({handoff,readSnapshot:()=>readState({repository:env.GITHUB_REPOSITORY,get}),
      attestation:{bundle:await json(args[1])},services:githubServices({repository:env.GITHUB_REPOSITORY,token:env.GH_TOKEN,get,directory:handoff.directory,initialNpmException:env.RELEASE_SETUP === 'initial-manual-npm'})});
  } else if (mode === 'exercise') {
    assert.equal(args.length,0,'Usage: release.sh exercise (Vector transition fixture, no publishing adapter)');
    const lock = await json(join(root,'inputs/sqlite-vector.sources.lock.json'));
    const exercise = {commit:await command('git',['rev-parse','HEAD'],{cwd:root}),repository:'at-rama/sqlite-vector-wasm',selection:{sqlite:lock.sqlite.version,sqliteVector:lock.sqliteVector.version},comment:''};
    const snapshot = {schemaVersion:1,tags:['dist/v0.2.4'],releaseTags:['dist/v0.2.4'],npmVersions:['0.2.4'],
      heads:{latest:{version:'0.2.4',commit:'a'.repeat(40),upstreams:{sqlite:lock.sqlite.version,sqliteVec:'0.1.9'}},next:null}};
    result = await qualify({context:exercise,readSnapshot:async()=>snapshot});
    assert.equal(result.identity.version,'0.3.0'); assert.equal(result.identity.transition,true); assert.ok(result.notes.includes('BREAKING CHANGE:')); assert.equal(result.identity.channel,'latest');
    const accepted = await acceptedPayload({bundle:result.bundle,identity:result.identity,commit:exercise.commit});
    assert.deepEqual(await json(result.evidencePath),provenance(exercise,result.identity,accepted).evidence);
    result = {...result,status:'qualified-without-publication',publicationCalls:0,publicationState:'explicit historical 0.2.4 sqlite-vec fixture, not live registry evidence',snapshot};
    // Exercise the final-archive example without inventing an integrated PR or
    // waiting for Site (which consumes this qualification artifact).
    const { renewDocumentation } = await import('./documentation.mjs');
    result.documentationChecks = await renewDocumentation({ repository: root, qualified: result, directory: result.directory, run: command });
  } else if (mode === 'check-initial') {
    assert.equal(args.length,1,'Usage: release.sh check-initial PUBLICATION.json (read-only)');
    const evidence = await json(args[0]);
    const services = githubServices({repository:evidence.repository,token:env.GH_TOKEN,get});
    result = await checkInitialCompletion({evidence,get,verifyGitHub:async value=>{
      const response = await get(`https://api.github.com/repos/${repositoryName(value.repository)}/releases/tags/${value.tag}`);
      assert.equal(response.status,200); await services.verifyGitHub(response.data,value);
    }});
  } else throw Error('Usage: release.sh calculate|candidate|prepare|publish|exercise|check-initial');
  console.log(JSON.stringify(result));
  if (result.status === 'published-verification-pending') {
    const warning = 'npm publish succeeded and GitHub Release finalized, but npm visibility verification is pending: ' + result.verification.reason;
    console.warn('::warning title=Publication verification pending::' + warning);
    if (env.GITHUB_STEP_SUMMARY) await appendFile(env.GITHUB_STEP_SUMMARY,
      '### Publication completed; npm visibility verification pending\n\n' +
      'The package was published and the GitHub Release finalized. ' +
      'Check the npm version, dist-tag, archive and provenance later. Do not rerun publication.\n\n' +
      'Version: ' + result.identity.version + ' / ' + result.identity.channel + '\n\n' +
      'Pending: ' + result.verification.reason + '\n');
  }
  if (result.status === 'npm-pending') process.exitCode = 2;
} catch (error) { console.error(`Release failed: ${error.message}`); process.exitCode = 1; }
