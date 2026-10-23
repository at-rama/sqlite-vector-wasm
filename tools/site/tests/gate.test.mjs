import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm,mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync,execFileSync} from 'node:child_process';
const script=new URL('../gate.py',import.meta.url).pathname;
const invoke=(action,env={},cwd)=>spawnSync('python3',[script,action],{cwd,env:{...process.env,...env},encoding:'utf8'});

test('required Site failure, cancellation, omission and unexpected skip cannot permit merge',()=>{
 for(const SITE_RESULT of ['failure','cancelled','skipped','','unknown']){
  const r=invoke('complete',{SITE_REQUIRED:'true',SITE_RESULT});assert.notEqual(r.status,0);assert.match(r.stderr,/merge remains blocked/);
 }
 assert.equal(invoke('complete',{SITE_REQUIRED:'true',SITE_RESULT:'success'}).status,0);
 assert.equal(invoke('complete',{SITE_REQUIRED:'false',SITE_RESULT:'skipped'}).status,0);
 for(const SITE_REQUIRED of ['', 'unknown'])assert.notEqual(invoke('complete',{SITE_REQUIRED,SITE_RESULT:'success'}).status,0);
 assert.notEqual(invoke('complete',{SITE_REQUIRED:'false',SITE_RESULT:'success'}).status,0);
});

test('Site scope follows the whole PR diff, including deletion and moves, and fails closed on unknown comparisons',async t=>{
 const cwd=await mkdtemp(join(tmpdir(),'site-scope-'));t.after(()=>rm(cwd,{recursive:true,force:true}));
 const git=(...args)=>execFileSync('git',args,{cwd,encoding:'utf8'}).trim();
 git('init','-q');git('config','user.name','Site test');git('config','user.email','site@example.invalid');
 await mkdir(join(cwd,'site'));await writeFile(join(cwd,'site/index.md'),'# site\n');await writeFile(join(cwd,'other.txt'),'x\n');git('add','.');git('commit','-qm','base');
 const base=git('rev-parse','HEAD');
 await writeFile(join(cwd,'other.txt'),'y\n');git('add','.');git('commit','-qm','unrelated');
 const scope=(overrides={})=>invoke('scope',{EVENT_NAME:'pull_request',BASE_SHA:base,HEAD_SHA:git('rev-parse','HEAD'),...overrides},cwd);
 assert.equal(scope().stdout,'required=false\n');
 await rm(join(cwd,'site/index.md'));git('add','-A');git('commit','-qm','delete site');
 assert.equal(scope().stdout,'required=true\n');
 for(const overrides of [{BASE_SHA:''},{HEAD_SHA:'bad'},{BASE_SHA:'f'.repeat(40)}])assert.equal(scope(overrides).stdout,'required=true\n');
 assert.equal(scope({EVENT_NAME:'push'}).stdout,'required=false\n');
 git('mv','other.txt','site/moved.md');git('commit','-qm','move');assert.equal(scope().stdout,'required=true\n');
});
