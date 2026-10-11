import assert from 'node:assert/strict';
import { readFile, appendFile } from 'node:fs/promises';
import { join } from 'node:path';
import { root, regularBytes } from '../package/package.mjs';
import { command } from '../acceptance/run.mjs';
import { integratedContext } from './context.mjs';
import { calculate } from './policy.mjs';
import { readState, httpReader, repositoryName } from './state.mjs';
import { qualify, acceptedPayload, provenance, publish, checkInitialCompletion } from './run.mjs';
import { githubServices } from './services.mjs';

const json = async path => JSON.parse(await regularBytes(path));
const empty = () => ({schemaVersion:1,tags:[],npmVersions:[],releaseTags:[],heads:{latest:null,next:null}});
const env = process.env;
const get = httpReader(env.GH_TOKEN || env.GITHUB_TOKEN);
const readAt = (commit,path) => command('git',['show',`${commit}:${path}`],{cwd:root});
const context = async () => integratedContext({repository:repositoryName(env.GITHUB_REPOSITORY),event:await json(env.GITHUB_EVENT_PATH),get,readAt});

try {
  const [mode,...args] = process.argv.slice(2);
  let result;
  if (mode === 'calculate') {
    assert.equal(args.length,1,'Usage: release.sh calculate INPUT.json'); result = calculate(await json(args[0]));
  } else if (mode === 'prepare') {
    assert.equal(args.length,0);
    result = await qualify({context:await context(),readSnapshot:()=>readState({repository:env.GITHUB_REPOSITORY,get})});
    if (env.GITHUB_OUTPUT) await appendFile(env.GITHUB_OUTPUT,`handoff=${result.path}\narchive=${result.archivePath}\n`);
    const report = await json(join(result.bundle,'acceptance.json'));
    if (env.GITHUB_ENV) await appendFile(env.GITHUB_ENV,`HARNESS_STATE=${report.toolsDirectory}\n`);
  } else if (mode === 'publish') {
    assert.equal(args.length,2,'Usage: release.sh publish HANDOFF.json ATTESTATION.json');
    const integrated = await context();
    const handoff = await json(args[0]); assert.deepEqual(handoff.context,integrated,'Publication context no longer agrees');
    assert.equal(await command('git',['rev-parse','HEAD'],{cwd:root}),integrated.commit);
    assert.equal(await command('git',['status','--porcelain','--untracked-files=all'],{cwd:root}),'','Dirty publication checkout');
    assert.ok(['trusted','initial-manual-npm'].includes(env.RELEASE_SETUP),'A-bootstrap must establish RELEASE_SETUP');
    result = await publish({handoff,readSnapshot:()=>readState({repository:env.GITHUB_REPOSITORY,get}),
      attestation:{bundle:await json(args[1])},services:githubServices({repository:env.GITHUB_REPOSITORY,token:env.GH_TOKEN,get,directory:handoff.directory,initialNpmException:env.RELEASE_SETUP === 'initial-manual-npm'})});
  } else if (mode === 'exercise') {
    assert.equal(args.length,0,'Usage: release.sh exercise (selected stable 0.1.0, no publishing adapter)');
    const lock = await json(join(root,'inputs/sources.lock.json'));
    const exercise = {commit:await command('git',['rev-parse','HEAD'],{cwd:root}),repository:'at-rama/sqlite-vector-wasm',selection:{sqlite:lock.sqlite.version,sqliteVec:lock.sqliteVec.version},comment:''};
    result = await qualify({context:exercise,readSnapshot:async()=>empty()});
    assert.equal(result.identity.version,'0.1.0'); assert.equal(result.identity.channel,'latest');
    const accepted = await acceptedPayload({bundle:result.bundle,identity:result.identity,commit:exercise.commit});
    assert.deepEqual(await json(result.evidencePath),provenance(exercise,result.identity,accepted).evidence);
    result = {...result,status:'qualified-without-publication',publicationCalls:0,publicationState:'explicit empty fixture, not live registry evidence'};
  } else if (mode === 'check-initial') {
    assert.equal(args.length,1,'Usage: release.sh check-initial PUBLICATION.json (read-only)');
    const evidence = await json(args[0]);
    const services = githubServices({repository:evidence.repository,token:env.GH_TOKEN,get});
    result = await checkInitialCompletion({evidence,get,verifyGitHub:async value=>{
      const response = await get(`https://api.github.com/repos/${repositoryName(value.repository)}/releases/tags/${value.tag}`);
      assert.equal(response.status,200); await services.verifyGitHub(response.data,value);
    }});
  } else throw Error('Usage: release.sh calculate|prepare|publish|exercise|check-initial');
  console.log(JSON.stringify(result));
  if (result.status === 'npm-pending') process.exitCode = 2;
} catch (error) { console.error(`Release failed: ${error.message}`); process.exitCode = 1; }
