import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { npmPackageName } from '../../release/policy.mjs';
import { fossilTags } from '../discovery.mjs';

export async function planningFixture({empty=false}={}) {
  const repository='at-rama/sqlite-vector-wasm',api=`https://api.github.com/repos/${repository}/`;
  const html=await readFile(new URL('./fixtures/sqlite-taglist.html',import.meta.url));
  const release=await readFile(new URL('./fixtures/sqlite-release.html',import.meta.url));
  const vec=JSON.parse(await readFile(new URL('./fixtures/sqlite-vec-release.json',import.meta.url)));
  const bytes=Buffer.from('synthetic publication payload'),commit='a'.repeat(40);
  const selection={sqlite:empty?'3.54.0':'3.53.4',sqliteVec:'0.1.9'};
  const evidence={schemaVersion:1,name:npmPackageName,version:'0.1.0',tag:'dist/v0.1.0',channel:'latest',commit,upstreams:selection,
    archive:{sha256:createHash('sha256').update(bytes).digest('hex'),size:bytes.length},
    sourceLock:Object.fromEntries(Object.entries(selection).map(([k,version])=>[k,{version,archiveUrl:'https://example.invalid/synthetic-source',digest:{algorithm:'sha256',value:'b'.repeat(64)}}])),build:{tools:{}},acceptance:{verdict:'passed'}};
  const stable={...vec,tag_name:'v0.1.9',prerelease:false,url:'https://api.github.com/repos/asg017/sqlite-vec/releases/900001',html_url:'https://github.com/asg017/sqlite-vec/releases/tag/v0.1.9',assets:[{name:'sqlite-vec-0.1.9-amalgamation.tar.gz',state:'uploaded',digest:'sha256:'+'c'.repeat(64),browser_download_url:'https://github.com/asg017/sqlite-vec/releases/download/v0.1.9/sqlite-vec-0.1.9-amalgamation.tar.gz'}]};
  const replies=new Map([
    [fossilTags,{status:200,data:html}],
    ['https://sqlite.org/releaselog/3_54_0.html',{status:200,data:release}],
    ['https://sqlite.org/releaselog/3_53_4.html',{status:200,data:Buffer.from('<title>SQLite Release 3.53.4 On 2026-07-24</title>')}],
    ['https://api.github.com/repos/asg017/sqlite-vec/releases?per_page=100',{status:200,data:empty?[stable]:[stable,vec],headers:{}}],
    [api+'tags?per_page=100',{status:200,data:[{name:'dist/v0.1.0',commit:{sha:commit}}],headers:{}}],
    [api+'releases?per_page=100',{status:200,data:[{tag_name:'dist/v0.1.0',draft:false,prerelease:false,assets:[{name:'publication.json',url:api+'releases/assets/1'},{name:'payload.tgz',url:api+'releases/assets/2'}]}],headers:{}}],
    [api+'releases/assets/1',{status:200,data:Buffer.from(JSON.stringify(evidence))}],
    [api+'releases/assets/2',{status:200,data:bytes}],
    ['https://registry.npmjs.org/@at-rama%2fsqlite-vector-wasm',{status:200,data:{name:npmPackageName,versions:{'0.1.0':{name:npmPackageName,version:'0.1.0',dist:{tarball:'https://registry.npmjs.org/synthetic-payload'}}},'dist-tags':{latest:'0.1.0'}}}],
    ['https://registry.npmjs.org/synthetic-payload',{status:200,data:bytes}],
    [api+'actions/workflows/updates.yml/runs?branch=main&event=workflow_dispatch&per_page=100',{status:200,data:{total_count:0,workflow_runs:[]},headers:{}}],
    [api+'pulls?state=open&base=main&per_page=100',{status:200,data:[],headers:{}}],
  ]);
  const calls=[];
  const get=async(url)=>{calls.push(url);if(!replies.has(url))throw Error('Unexpected read: '+url);return structuredClone(replies.get(url));};
  // structuredClone turns Buffer into Uint8Array; retain the reader's binary contract.
  const reader=async(url,options)=>{const response=await get(url,options);if(options?.binary)response.data=Buffer.from(response.data);return response;};
  return {repository,get:reader,calls,replies,context:{repository,event:'workflow_dispatch',revision:commit,node:process.version}};
}
