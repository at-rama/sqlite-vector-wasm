import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { sqliteTags, vectorReleases, discover, fossilTags, vectorAPI, baselines } from '../discovery.mjs';
const fixture = async name => JSON.parse(await readFile(new URL(`./fixtures/sqlite-vector-${name}.json`,import.meta.url)));
const captured=await fixture('release'),tag=await fixture('tag'),commit=await fixture('commit');
const html=await readFile(new URL('./fixtures/sqlite-taglist.html.txt',import.meta.url),'utf8');
const release=await readFile(new URL('./fixtures/sqlite-release.html.txt',import.meta.url));
export const record=(version,id=900001)=>({...captured,id,url:`${vectorAPI}/releases/${id}`,tag_name:version,prerelease:version.includes('-'),html_url:`https://github.com/sqliteai/sqlite-vector/releases/tag/${version}`});
test('captured Fossil retains exact releases and rejects truncation, unknown identities and nested markup',()=>{
  assert.deepEqual(sqliteTags(html).map(x=>x.version),['3.53.4','3.54.0']);
  for(const value of [html.slice(0,-40),html.replace('version-3.54.0','version-unknown'),html.replace('version-3.54.0','version-3.54.0-alpha.1'),
    html.replace('<span class="tagDsp">version-3.54.0</span>','<span class="tagDsp"><script>version-3.54.0</script></span>')])assert.throws(()=>sqliteTags(value));
});
test('captured Vector release and synthetic maturity/floor cases need no assets or checksum',()=>{
  const versions=['1.0.0','1.1.0-alpha.1','1.1.2','1.1.3-alpha.1','1.1.3-alpha.2','1.1.3-beta.1','1.1.3-rc.1','2.0.0'];
  const records=versions.map((v,i)=>record(v,100+i));
  assert.deepEqual(vectorReleases([captured,...records,{...captured,draft:true},{...captured,published_at:null}]).map(x=>x.version),['1.1.0',...versions.slice(2)]);
  assert.deepEqual(baselines,{sqlite:'3.53.4',sqliteVector:'1.1.0'});
  for(const r of [{...captured,prerelease:true},{...captured,tag_name:'v1.1.0'},{...captured,tag_name:'latest'},{...captured,tag_name:'1.1.2-dev'},{...captured,published_at:'today'},{...captured,id:0},{...captured,url:'https://example.com'},{...captured,html_url:'https://example.com'}])assert.throws(()=>vectorReleases([r]));
  assert.throws(()=>vectorReleases([captured,captured]),/repeated/);
  assert.throws(()=>vectorReleases([captured,record('1.1.0')]),/Ambiguous/);
});
function reader(records=[captured]) {
  const replies=new Map([[fossilTags,{status:200,data:Buffer.from(html)}],
    ['https://sqlite.org/releaselog/3_54_0.html',{status:200,data:release}],
    ['https://sqlite.org/releaselog/3_53_4.html',{status:200,data:Buffer.from('<title>SQLite Release 3.53.4 On 2026-07-24</title>')}],
    [`${vectorAPI}/releases?per_page=100`,{status:200,data:records,headers:{}}],
    [`${vectorAPI}/git/ref/tags/1.1.0`,{status:200,data:tag}],
    [tag.object.url,{status:200,data:commit}]]);
  const calls=[];
  const get=async url=>{calls.push(url);assert.ok(replies.has(url),`Unexpected read: ${url}`);return replies.get(url);};
  return {get,replies,calls};
}
test('complete paginated discovery binds captured official release/tag/commit without archive reads',async()=>{
  const f=reader();const result=await discover(f);
  assert.equal(result.sqliteVector[0].commit,commit.sha);assert.equal(result.sqliteVector[0].tag,'1.1.0');
  assert.ok(f.calls.every(u=>!u.includes('codeload')&&!u.includes('asg017')));
  const page=`${vectorAPI}/releases?page=2`;
  f.replies.set(`${vectorAPI}/releases?per_page=100`,{status:200,data:[],headers:{link:`<${page}>; rel="next"`}});
  f.replies.set(page,{status:200,data:[captured],headers:{}});
  assert.equal((await discover(f)).sqliteVector.length,1);
  f.replies.set(page,{status:503});await assert.rejects(()=>discover(f));
});
test('binding failures, annotated tags, unsafe origins and incomplete discovery fail',async()=>{
  for(const [url,value] of [[fossilTags,{status:503}],[tag.object.url,{status:200,data:{sha:'a'.repeat(40)}}],[`${vectorAPI}/git/ref/tags/1.1.0`,{status:200,data:{...tag,ref:'refs/tags/wrong'}}],['https://sqlite.org/releaselog/3_54_0.html',{status:200,data:Buffer.from('wrong identity')}]]) {
    const f=reader();f.replies.set(url,value);await assert.rejects(()=>discover(f));
  }
  const f=reader(),sha='a'.repeat(40),url=`${vectorAPI}/git/tags/${sha}`;
  f.replies.set(`${vectorAPI}/git/ref/tags/1.1.0`,{status:200,data:{...tag,object:{sha,type:'tag',url}}});
  f.replies.set(url,{status:200,data:{sha,object:tag.object}});
  assert.equal((await discover(f)).sqliteVector[0].commit,commit.sha);
  for(const object of [{...tag.object,type:'blob'},{...tag.object,url:'https://example.com'}, {sha,type:'tag',url}]) {
    const g=reader();g.replies.set(`${vectorAPI}/git/ref/tags/1.1.0`,{status:200,data:{...tag,object}});
    g.replies.set(url,{status:200,data:{sha,object}});await assert.rejects(()=>discover(g));
  }
});
