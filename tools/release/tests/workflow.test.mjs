import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdtemp, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { root, execute } from '../../package/package.mjs';
import { descriptor } from '../context.mjs';
import { githubServices } from '../services.mjs';

test('documented candidate schema is executable and shared calculator CLI has no publication path',async t=>{
  const documentation=await readFile(join(root,'docs/publication.md'),'utf8');
  const example=JSON.parse(documentation.match(/```json\n([\s\S]*?)\n```/)[1]);
  descriptor(example,JSON.parse(await readFile(join(root,'inputs/sources.lock.json'))));
  const dir=await mkdtemp(join(tmpdir(),'release-cli-'));t.after(()=>rm(dir,{recursive:true,force:true}));
  const path=join(dir,'input.json');await writeFile(path,JSON.stringify({selection:{sqlite:example.sqlite,sqliteVec:example.sqliteVec},snapshot:{schemaVersion:1,tags:[],releaseTags:[],npmVersions:[],heads:{latest:null,next:null}}}));
  const output=JSON.parse(await execute('sh',['tools/release.sh','calculate',path],{cwd:root}));assert.equal(output.version,'0.1.0');
});

test('hosted workflow pins actions, separates read qualification/write publication and forbids recurring dispatch',async()=>{
  const workflow=await readFile(join(root,'.github/workflows/release.yml'),'utf8');
  const actions=[...workflow.matchAll(/uses: ([^\s]+)@([^\s]+)/g)];assert.ok(actions.length>=6);
  for(const [,action,ref] of actions){assert.match(ref,/^[0-9a-f]{40}$/);assert.ok(action.startsWith('actions/'));}
  assert.ok(!workflow.includes('workflow_dispatch:') && !workflow.includes('NODE_AUTH_TOKEN') && !workflow.includes('NPM_TOKEN'));
  assert.ok(workflow.includes('github.event.pull_request.merge_commit_sha'));
  const qualification=workflow.split('  qualify:')[1].split('  publish:')[0];assert.ok(!qualification.includes('write'));
  const publication=workflow.split('  publish:')[1];assert.ok(publication.includes('needs: qualify') && publication.includes('id-token: write') && publication.includes('attestations: write'));
  assert.ok(publication.includes('github.event.action == \'closed\' && github.event.pull_request.merged == true'));
  assert.ok(workflow.includes('sh tools/release.sh exercise') && workflow.includes('ref: ${{ github.event.pull_request.head.sha }}'));
});

test('mandatory release-suite registration fails when the test file is absent',async t=>{
  const script=await readFile(join(root,'tools/test-repository.sh'),'utf8');
  const block=script.slice(script.indexOf('# Release policy'));
  const dir=await mkdtemp(join(tmpdir(),'release-registration-'));t.after(()=>rm(dir,{recursive:true,force:true}));
  await mkdir(join(dir,'tools/release'),{recursive:true});await writeFile(join(dir,'tools/release/policy.mjs'),'// implementation\n');
  await assert.rejects(execute('sh',['-ec',block],{cwd:dir}),/failed/);
});

test('publisher prerequisites fail closed on missing hosted authorization and persistent npm credentials',async()=>{
  const env={GITHUB_ACTIONS:'true',RUNNER_ENVIRONMENT:'github-hosted',ACTIONS_ID_TOKEN_REQUEST_URL:'https://oidc.invalid',ACTIONS_ID_TOKEN_REQUEST_TOKEN:'test'};
  const service=environment=>githubServices({repository:'a/b',token:'test',get:async()=>{},directory:'/unused',environment,run:async(cmd,args)=>args.at(-1)==='--version' && args.at(-2)==='node'?'v24.19.0':'11.17.0'});
  await service(env).assertReady({bootstrap:false});
  await assert.rejects(service({...env,NPM_TOKEN:'persistent'}).assertReady({bootstrap:false}),/credentials/);
  await assert.rejects(service({...env,RUNNER_ENVIRONMENT:'self-hosted'}).assertReady({bootstrap:false}));
  await assert.rejects(service({...env,ACTIONS_ID_TOKEN_REQUEST_TOKEN:''}).assertReady({bootstrap:true}),/OIDC/);
});

test('HTTP/qualified npm adapters use non-forced identities, exact uploads and explicit trusted-publish arguments',async t=>{
  const directory=await mkdtemp(join(tmpdir(),'release-adapters-'));t.after(()=>rm(directory,{recursive:true,force:true}));
  const archive=join(directory,'payload.tgz');await writeFile(archive,'exact bytes');
  const requests=[],commands=[],original=globalThis.fetch;t.after(()=>{globalThis.fetch=original;});
  globalThis.fetch=async(url,options)=>{requests.push({url,options});return {ok:true,status:201,json:async()=>new URL(url).hostname === 'uploads.github.com'?{id:2,name:'payload.tgz',state:'uploaded'}:{id:1}};};
  const services=githubServices({repository:'a/b',token:'synthetic',directory,get:async()=>{},run:async(cmd,args,options)=>{commands.push({cmd,args,options});return '';},environment:{}});
  await services.createTag('dist/v0.1.0','a'.repeat(40));
  assert.deepEqual(JSON.parse(requests[0].options.body),{ref:'refs/tags/dist/v0.1.0',sha:'a'.repeat(40)});
  await services.createDraft({tag:'dist/v0.1.0',version:'0.1.0',channel:'latest'},'comment $(data)');
  const draft=JSON.parse(requests[1].options.body);assert.equal(draft.draft,true);assert.equal(draft.make_latest,'true');assert.equal(draft.body,'comment $(data)');
  await services.upload({upload_url:'https://uploads.github.com/repos/a/b/releases/1/assets{?name,label}',assets:[]},'payload.tgz',archive);
  assert.equal(requests[2].options.body.toString(),'exact bytes');
  await assert.rejects(services.upload({upload_url:'https://uploads.github.com.evil.invalid/repos/a/b/releases/1/assets{?name,label}',assets:[]},'payload.tgz',archive),/Unexpected publication endpoint/);
  assert.equal(requests.length,3);
  await assert.rejects(services.upload({assets:[{name:'payload.tgz'}]},'payload.tgz',archive),/overwritten/);
  await services.npmPublish(archive,'next');
  assert.deepEqual(commands[0].args,['tools/harness.sh','exec','npm','publish',archive,'--tag','next','--access','public','--ignore-scripts','--provenance']);
  assert.equal(commands[0].options.env.npm_config_registry,'https://registry.npmjs.org/');
  assert.equal(await readFile(commands[0].options.env.npm_config_userconfig,'utf8'),'\n');
});
