import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,mkdir,writeFile,access,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {mainDemo,buildStableDemo} from '../current-demo.mjs';
import {siteSelection,assertStableCurrent} from '../eligibility.mjs';
import {candidateProfile} from '../../updates/documentation.mjs';

const repository='at-rama/sqlite-vector-wasm',main='a'.repeat(40),head='c'.repeat(40);
const paths=['site/demo/index.md','site/demo/EmojiDemo.vue','site/demo/demo-worker.mjs','site/demo/discovery.mjs','tools/site/demo-runtime.json','tools/site/demo-data.json'];
const sources=Object.fromEntries(await Promise.all(paths.map(async path=>[path,await readFile(new URL('../../../'+path,import.meta.url),'utf8')])));
const readAt=async(commit,path)=>path==='tools/site/docs-example.json'?JSON.stringify(candidateProfile):path==='inputs/release.json'?null:sources[path]??null;
const stable={sourceCommit:'b'.repeat(40),selection:{version:'0.3.0'},publication:{version:'0.3.0'}};
const get=async()=>({status:200,data:{sha:main}});
test('only current main supplies the returned stable demo, independently of preview and documentation revisions',async()=>{
 const result=await siteSelection({repository,eventName:'pull_request',ref:'refs/pull/77/merge',sha:head,actor:'maintainer',directory:'.',get,
  event:{number:77,pull_request:{state:'open',head:{sha:head,ref:'demo',repo:{full_name:repository}}}},
  readAt:async(commit,path)=>commit===head&&path==='tools/site/demo-runtime.json'?null:readAt(commit,path),
  selectStable:async()=>stable,resolveSource:async()=>{throw Error('Unpublished documentation')}});
 assert.equal(result.stable.sourceCommit,stable.sourceCommit);
 assert.equal(result.stableDemo.sourceCommit,main);
 assert.equal(result.stableDemo.selection.engine,'sqliteVector');
 assert.equal(result.preview.commit,head);
 await assertStableCurrent({repository,mainCommit:main,stableDocumentation:stable,stableDemo:result.stableDemo},{get,readAt,selectStable:async()=>stable});
 const changed=async(commit,path)=>path==='site/demo/EmojiDemo.vue'?sources[path]+'\nchanged':readAt(commit,path);
 await assert.rejects(assertStableCurrent({repository,mainCommit:main,stableDocumentation:stable,stableDemo:result.stableDemo},{get,readAt:changed,selectStable:async()=>stable}),/Stable demo source changed/);
});
test('no pin leaves the temporary phase independent; invalid or missing native return sources fail closed',async()=>{
 assert.equal(await mainDemo(async()=>null,main),null);
 for(const path of ['site/demo/index.md','site/demo/demo-worker.mjs'])await assert.rejects(mainDemo(async(c,p)=>p===path?'':readAt(c,p),main),/Missing/);
 await assert.rejects(mainDemo(async(c,p)=>p==='tools/site/demo-runtime.json'?JSON.stringify({engine:'sqliteVec',version:'0.2.0'}):readAt(c,p),main),/native Vector/);
});
test('failed trusted-source validation clears old generated stable output before any runtime acquisition',async t=>{
 const root=await mkdtemp(join(tmpdir(),'demo-phase-'));t.after(()=>rm(root,{recursive:true,force:true}));
 await mkdir(join(root,'.work/site/dist'),{recursive:true});await writeFile(join(root,'.work/site/dist/index.html'),'stale');
 await writeFile(join(root,'.work/site/build.json'),'{}');
 const demo=await mainDemo(readAt,main);demo.sourceHashes['site/demo/EmojiDemo.vue']='0'.repeat(64);
 await assert.rejects(buildStableDemo({root,demo,readAt,get:()=>assert.fail('No acquisition before identity check')}),/source identity changed/);
 await assert.rejects(access(join(root,'.work/site/dist')));
 await assert.rejects(access(join(root,'.work/site/build.json')));
});

test('stable demo CLI fails normally rather than deadlocking on circular top-level imports',async t=>{
 const root=await mkdtemp(join(tmpdir(),'demo-cli-'));t.after(()=>rm(root,{recursive:true,force:true}));
 const record=join(root,'selection.json');
 await writeFile(record,JSON.stringify({repository:'%',mainCommit:main,stableDemo:{sourceCommit:main}}));
 const result=spawnSync(process.execPath,[new URL('../current-demo.mjs',import.meta.url).pathname,root,record],{encoding:'utf8',timeout:10000,env:{...process.env,GH_TOKEN:''}});
 assert.equal(result.error,undefined);
 assert.equal(result.status,1,`Unexpected CLI status ${result.status}: ${result.stderr}`);
 assert.doesNotMatch(result.stderr,/unsettled top-level await/);
});
