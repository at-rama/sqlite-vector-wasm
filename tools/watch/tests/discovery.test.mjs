import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { sqliteTags, vecReleases, discover, fossilTags } from '../discovery.mjs';

const html = await readFile(new URL('./fixtures/sqlite-taglist.html.txt',import.meta.url),'utf8');
const release = await readFile(new URL('./fixtures/sqlite-release.html.txt',import.meta.url));
// The captured subset omits id; complete the test observation without editing it.
const vec = {...JSON.parse(await readFile(new URL('./fixtures/sqlite-vec-release.json',import.meta.url))),id:324084102};
const record = (version,id=900001) => ({...structuredClone(vec),id,url:`https://api.github.com/repos/asg017/sqlite-vec/releases/${id}`,tag_name:`v${version}`,prerelease:version.includes('-'),
  html_url:`https://github.com/asg017/sqlite-vec/releases/tag/v${version}`,
  assets: [{name:`sqlite-vec-${version}-amalgamation.tar.gz`,state:'uploaded',digest:'sha256:'+'1'.repeat(64),
    browser_download_url:`https://github.com/asg017/sqlite-vec/releases/download/v${version}/sqlite-vec-${version}-amalgamation.tar.gz`}]});

test('captured Fossil inventory retains all eligible exact releases, not the moving release tag',()=>{
  assert.deepEqual(sqliteTags(html).map(x=>x.version),['3.53.4','3.54.0']);
  assert.equal(sqliteTags(html)[1].date,'2026-10-09');
  assert.throws(()=>sqliteTags(html.slice(0,-40)),/Incomplete/);
  assert.throws(()=>sqliteTags(html.replace('version-3.54.0','version-3.54.0-alpha.1')),/Unresolved/);
  assert.throws(()=>sqliteTags(html.replace('version-3.54.0','version-unknown')),/Ambiguous/);
});
test('captured sqlite-vec prerelease metadata, baselines and nonrelease exclusion',()=>{
  const draft={...vec,draft:true},snapshot={...vec,published_at:null};
  assert.deepEqual(vecReleases([draft,snapshot,vec,record('0.1.9'),record('0.1.9-alpha.1')]).map(x=>x.version),['0.1.9','0.1.10-alpha.4']);
  for(const r of [{...vec,prerelease:false},{...vec,assets:[]},{...vec,assets:[{...vec.assets[0],digest:null}]}])
    assert.throws(()=>vecReleases([r]));
  assert.throws(()=>vecReleases([vec,vec]),/Ambiguous/);
});

test('Fossil cells reject nested, incomplete and unexpected markup without stripping it',()=>{
  const cell='<span class="tagDsp">version-3.54.0</span>';
  for(const bad of ['<span class="tagDsp"><script>version-3.54.0</script></span>',
    '<span class="tagDsp"><SCRIPT>version-3.54.0</SCRIPT></span>',
    '<span class="tagDsp">version-3.54.0<script</span>',
    '<a>version-3.54.0</a>'])
    assert.throws(()=>sqliteTags(html.replace(cell,bad)),/Unrecognized Fossil cell markup/);
});
test('complete paginated discovery verifies official release logs and fails incomplete reads',async()=>{
  const requests=[];
  const get=async(url)=>{requests.push(url);
    if(url===fossilTags)return {status:200,data:Buffer.from(html)};
    if(url.includes('/releaselog/3_54_0'))return {status:200,data:release};
    if(url.includes('/releaselog/3_53_4'))return {status:200,data:Buffer.from('<title>SQLite Release 3.53.4 On 2026-07-24</title>')};
    if(url.includes('page=2'))return {status:200,data:[vec],headers:{}};
    return {status:200,data:[record('0.1.9')],headers:{link:'<https://api.github.com/repos/asg017/sqlite-vec/releases?page=2>; rel="next"'}};
  };
  const observed=await discover({get}); assert.equal(observed.sqlite.length,2);assert.equal(observed.sqliteVec.length,2);
  assert.ok(requests.some(x=>x.includes('page=2')));
  await assert.rejects(()=>discover({get:async()=>({status:503})}),/unavailable/);
  await assert.rejects(()=>discover({get:async(url)=>url.includes('/releaselog/')?{status:200,data:Buffer.from('wrong identity')}:get(url)}),/Contradictory/);
  await assert.rejects(()=>discover({get:async(url)=>url.includes('page=2')?{status:200,data:[record('0.1.10-alpha.4')],headers:{}}:get(url)}),/repeated sqlite-vec Release resource/);
});

test('Release resource identities reject contradictory versions, copies and ID/URL mismatches',()=>{
  const stable=record('0.1.9',vec.id);
  assert.throws(()=>vecReleases([stable,vec]),/repeated sqlite-vec Release resource/);
  assert.throws(()=>vecReleases([vec,structuredClone(vec)]),/repeated sqlite-vec Release resource/);
  for(const id of [undefined,0,-1,'900001',Number.MAX_SAFE_INTEGER+1])
    assert.throws(()=>vecReleases([{...record('0.1.9'),id}]),/resource ID/);
  assert.throws(()=>vecReleases([{...record('0.1.9'),url:vec.url}]),/ID\/URL mismatch/);
  assert.throws(()=>vecReleases([record('0.1.9'),record('0.1.9',900002)]),/Ambiguous sqlite-vec release/);
});
