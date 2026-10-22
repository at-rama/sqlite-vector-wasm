import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,cp} from 'node:fs/promises';
import {join} from 'node:path';
import {qualifyCandidate,fixtureSnapshot} from '../candidate.mjs';
import {qualify} from '../../release/run.mjs';
import {releaseFixture} from '../../release/tests/fixture.mjs';
import {candidateDocumentPaths} from '../../updates/documentation.mjs';
import {root} from '../../package/package.mjs';

async function prepared(t,failure){
 const f=await releaseFixture(t);
 for(const path of candidateDocumentPaths){await mkdir(join(f.repository,path,'..'),{recursive:true});await cp(join(root,path),join(f.repository,path));}
 const context={...f.context,preparation:{runId:17,url:'https://github.com/a/b/actions/runs/17'}};
 const calls=[];
 const run=async(cmd,args)=>{if(cmd==='sh'){assert.ok(['tools/check-repository.sh','tools/test-repository.sh'].includes(args[0]));return '';}assert.equal(cmd,'git');if(args[0]==='status')return failure==='dirty'?' M README.md':'';return failure==='checkout'?'b'.repeat(40):context.commit;};
 const qualification=async input=>{
  calls.push('qualify');if(failure==='producer')throw Error('browser prerequisite failed');
  const q=await qualify({...input,produce:async()=>({bundle:f.bundle})});
  const e=JSON.parse(await readFile(q.evidencePath));
  if(failure==='revision')e.commit='b'.repeat(40);
  if(failure==='archive')e.archive.sha256='0'.repeat(64);
  if(failure==='engine')e.engine.key='sqliteVec';
  if(failure==='sources')e.sourceLock.sqliteVector.version='9.9.9';
  if(failure==='lock-digest')e.sourceLockSha256='0'.repeat(64);
  if(failure==='repository')e.repository='other/repo';
  if(failure==='comment')e.invocation.comment='changed';
  if(failure==='preparation')e.invocation.preparation={runId:99};
  if(failure==='documents')await writeFile(join(f.repository,'README.md'),'changed');
  await writeFile(q.evidencePath,JSON.stringify(e));
  if(failure==='forecast')q.identity={...q.identity,version:'9.9.9'};
  return q;
 };
 const invoke=()=>qualifyCandidate({repository:f.repository,context,runId:25,attempt:2,
  pullRequest:{number:4,head:{sha:context.commit},base:{sha:'c'.repeat(40)}},readSnapshot:async()=>fixtureSnapshot(),qualification,run});
 return {...f,context,calls,invoke};
}
test('single PR producer binds exact commit/archive/forecast and does not execute the example or a publisher',async t=>{
 const f=await prepared(t),r=await f.invoke();assert.equal(r.status,'qualified-in-pr');assert.equal(r.commit,f.context.commit);
 assert.deepEqual(r.qualification,{runId:25,attempt:2});assert.equal(r.publicationCalls,0);assert.deepEqual(f.calls,['qualify']);
 assert.equal(r.documentation,undefined,'Site owns the one candidate example execution');
 assert.equal(r.archive.sha256,f.packaged.archive.sha256);assert.equal(r.policyContext,'candidate-publication-forecast');
});
for(const failure of ['dirty','checkout','producer','revision','archive','engine','sources','lock-digest','repository','comment','preparation','documents','forecast'])test('PR producer rejects '+failure+' and retains failed evidence',async t=>{
 const f=await prepared(t,failure);let path;
 await assert.rejects(f.invoke(),e=>{path=e.message.split('evidence: ')[1];
 const patterns={dirty:/Clean candidate/,checkout:/checkout mismatch/,producer:/browser prerequisite/,revision:/revision mismatch/,archive:/archive mismatch/,engine:/engine mismatch/,sources:/source mismatch/, 'lock-digest':/lock digest mismatch/,repository:/repository mismatch/,comment:/comment mismatch/,preparation:/preparation mismatch/,documents:/documents changed/,forecast:/forecast mismatch/};
 assert.match(e.cause?.message??'',patterns[failure]);return Boolean(path);});
 const result=JSON.parse(await readFile(path));assert.equal(result.status,'failed');assert.equal(result.publicationCalls,0);
 if(['dirty','checkout'].includes(failure))assert.deepEqual(f.calls,[]);
});

test('tooling PR qualification labels its explicit fixture policy without publication authority',async t=>{
 const f=await prepared(t);delete f.context.preparation;const r=await f.invoke();
 assert.equal(r.policyContext,'explicit-empty-state-fixture-not-publication-state');assert.equal(r.preparation,null);assert.equal(r.publicationCalls,0);
});
