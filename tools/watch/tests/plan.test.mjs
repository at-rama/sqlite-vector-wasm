import test from 'node:test';
import assert from 'node:assert/strict';
import { makePlan, renderPlan, renderFailure } from '../plan.mjs';
import { calculate } from '../../release/policy.mjs';

const repository='at-rama/sqlite-vector-wasm';
const published=(version,sqlite,sqliteVec)=>({version,commit:'a'.repeat(40),upstreams:{sqlite,sqliteVec}});
const inventory=(sqlite,sqliteVec)=>({sqlite:sqlite.map(version=>({version})),sqliteVec:sqliteVec.map(version=>({version}))});
function context(){
  const latest=published('0.1.0','3.54.0','0.1.9'),next=published('0.2.0-alpha.1','3.53.5','0.1.10-alpha.1');
  return {repository,inventory:inventory(['3.53.4','3.53.6','3.54.0','3.54.1'],['0.1.9','0.1.10-alpha.1','0.1.10-alpha.2']),
    publication:{snapshot:{schemaVersion:1,tags:['dist/v0.1.0','dist/v0.2.0-alpha.1'],releaseTags:['dist/v0.1.0','dist/v0.2.0-alpha.1'],npmVersions:['0.1.0','0.2.0-alpha.1'],heads:{latest,next}},history:[],partial:[]},candidates:[]};
}
const pairs=plan=>plan.entries.map(e=>`${e.identity.channel}:${e.selection.sqlite}/${e.selection.sqliteVec}`);
test('Cartesian eligibility keeps stable maintenance, all alpha pairs and existing-version combinations',()=>{
  const c=context();
  assert.deepEqual(pairs(makePlan(c)),['latest:3.54.1/0.1.9','next:3.54.0/0.1.10-alpha.1','next:3.54.0/0.1.10-alpha.2','next:3.54.1/0.1.10-alpha.1','next:3.54.1/0.1.10-alpha.2']);
  assert.deepEqual(pairs(makePlan(c)),pairs(makePlan(c)),'unselected jobs recur without refusal memory');
  c.publication.snapshot.heads.latest.upstreams.sqlite='3.54.1';
  assert.ok(!pairs(makePlan(c)).some(p=>p.startsWith('latest:')),'reference progression removes superseded pairs');
});
test('without next, latest is the experimental reference; suffix ordering and both floors remain',()=>{
  const c=context();c.publication.snapshot.heads.next=null;
  c.inventory.sqliteVec.push({version:'0.1.9-alpha.1'});
  const plan=makePlan(c);assert.ok(plan.entries.some(e=>e.selection.sqliteVec==='0.1.10-alpha.1'));
  assert.ok(!plan.entries.some(e=>e.selection.sqlite==='3.53.6'||e.selection.sqliteVec==='0.1.9-alpha.1'));
});
test('history excludes corresponding-status compositions after rollback and packaging corrections',()=>{
  const c=context();c.publication.history=[{channel:'latest',selection:{sqlite:'3.54.1',sqliteVec:'0.1.9'},version:'0.2.0'},
    {channel:'latest',selection:{sqlite:'3.54.1',sqliteVec:'0.1.9'},version:'0.2.1'},
    {channel:'next',selection:{sqlite:'3.54.0',sqliteVec:'0.1.10-alpha.1'},version:'0.2.0-alpha.3'}];
  assert.deepEqual(pairs(makePlan(c)),['next:3.54.0/0.1.10-alpha.2','next:3.54.1/0.1.10-alpha.1','next:3.54.1/0.1.10-alpha.2']);
});
test('forecasts use the unchanged common snapshot and fail collisions without renumbering',()=>{
  const c=context(),before=JSON.stringify(c),plan=makePlan(c);
  for(const e of plan.entries)assert.deepEqual(e.identity,calculate({selection:e.selection,snapshot:c.publication.snapshot}));
  assert.equal(JSON.stringify(c),before);
  assert.equal(plan.entries[1].identity.version,plan.entries[2].identity.version);
  c.publication.snapshot.tags.push('dist/v0.1.1');assert.throws(()=>makePlan(c),/collision/);
  c.publication.snapshot.heads.latest=null;c.publication.snapshot.heads.next=null;assert.throws(()=>makePlan(c),/stable published/);
});
test('shared alpha-series policy responds to changed publication state',()=>{
  const c=context();let plan=makePlan(c);assert.equal(plan.entries[1].identity.version,'0.2.0-alpha.2');
  c.publication.snapshot.heads.next.version='0.2.0-alpha.3';c.publication.snapshot.tags.push('dist/v0.2.0-alpha.3');c.publication.snapshot.releaseTags.push('dist/v0.2.0-alpha.3');c.publication.snapshot.npmVersions.push('0.2.0-alpha.3');
  plan=makePlan(c);assert.equal(plan.entries[1].identity.version,'0.2.0-alpha.4');
});
test('complete summary is deterministic, actionable and preserves candidate links without duplicate advice',()=>{
  const c=context();c.candidates=[{kind:'run',selection:{sqlite:'3.54.1',sqliteVec:'0.1.9'},runId:17,attempt:1,status:'queued',url:`https://github.com/${repository}/actions/runs/17`}];
  const rendered=renderPlan(makePlan(c));
  assert.match(rendered,/3.54.1 × sqlite-vec 0.1.9/);assert.match(rendered,/- latest: 0.1.1 · PATCH/);
  assert.match(rendered,/Existing preparation; do not launch a duplicate/);assert.match(rendered,/actions\/runs\/17/);
  assert.match(rendered,/`sqlite_vec_version`: `0.1.10-alpha.2`/);
  for(const key of ['sqlite_comment','sqlite_vec_comment','misc_comment'])assert.ok(rendered.includes(`\`${key}\``));
  assert.match(rendered,/actions\/workflows\/updates.yml/);assert.doesNotMatch(rendered,/Preparation: none/);
  for(const k of ['sqlite','sqliteVec'])c.inventory[k].reverse();assert.equal(renderPlan(makePlan(c)),rendered);
});
test('compact entries preserve every plan fact while sharing instructions and retaining all candidates',()=>{
  const c=context(),selection={sqlite:'3.54.1',sqliteVec:'0.1.9'};
  c.publication.partial=['0.8.0-alpha.7'];
  c.candidates=[
    {kind:'run',selection,runId:17,attempt:2,status:'queued',url:`https://github.com/${repository}/actions/runs/17`},
    {kind:'pr',selection,number:42,status:'open',url:`https://github.com/${repository}/pull/42`,
      preparation:`https://github.com/${repository}/actions/runs/18`,attempt:3,head:'b'.repeat(40),run:{attempt:3,status:'in_progress'}},
    {kind:'pr',selection,number:43,status:'open',url:`https://github.com/${repository}/pull/43`,
      preparation:`https://github.com/${repository}/actions/runs/19`,attempt:1,head:'c'.repeat(40)}];
  const plan=makePlan(c),before=JSON.stringify(plan),rendered=renderPlan(plan);
  assert.match(rendered,/Complete plan: 5 eligible pairs/);
  assert.equal((rendered.match(/actions\/workflows\/updates.yml/g)||[]).length,1);
  for(const key of ['sqlite_comment','sqlite_vec_comment','misc_comment'])assert.equal(rendered.split(`\`${key}\``).length-1,1);
  assert.match(rendered,/no channel or version override/);
  assert.equal((rendered.match(/^### SQLite /gm)||[]).length,plan.entries.length);
  for(const e of plan.entries) {
    const heading=`### SQLite ${e.selection.sqlite} × sqlite-vec ${e.selection.sqliteVec}\n`;
    const block=rendered.split(heading)[1].split(/\n##(?:#)? /)[0];
    assert.ok(block.includes(`\`sqlite_version\`: \`${e.parameters.sqlite_version}\``));
    assert.ok(block.includes(`\`sqlite_vec_version\`: \`${e.parameters.sqlite_vec_version}\``));
    assert.doesNotMatch(block,/Forecast:/);
    assert.ok(rendered.split("## Forecast\n")[1].split("\n## latest")[0].includes(`${e.identity.version} · ${e.identity.signal}`));
    assert.equal(e.parameters.sqlite_comment,'');assert.equal(e.parameters.sqlite_vec_comment,'');assert.equal(e.parameters.misc_comment,'');
    for(const candidate of e.candidates)assert.ok(block.includes(candidate.url));
  }
  assert.match(rendered,/Preparation 17, attempt 2.*\(queued\)/);
  for(const number of [42,43])assert.match(rendered,new RegExp(`Candidate PR #${number}`));
  assert.match(rendered,/actions\/runs\/18.*attempt 3; head b{40}/);
  assert.match(rendered,/actions\/runs\/19.*attempt 1; head c{40}/);
  assert.match(rendered,/Active attempt 3: in_progress/);
  assert.ok(rendered.indexOf('## Reference state')>rendered.lastIndexOf('### SQLite'));
  for(const [channel,h] of Object.entries(plan.references)) {
    assert.ok(rendered.includes(`${channel}: ${h.version}; SQLite ${h.upstreams.sqlite}, sqlite-vec ${h.upstreams.sqliteVec}; revision ${h.commit}`));
  }
  assert.match(rendered,/Partial occupied identities \(not completed publications\): 0.8.0-alpha.7/);
  assert.equal(JSON.stringify(plan),before,'presentation cannot mutate the result handed to a consumer');
});
test('all-candidate plans remain complete nonempty results without per-entry launch advice',()=>{
  const c=context();c.candidates=makePlan(c).entries.map((e,i)=>({kind:'run',selection:e.selection,runId:20+i,attempt:1,status:'queued',url:`https://github.com/${repository}/actions/runs/${20+i}`}));
  const plan=makePlan(c),rendered=renderPlan(plan);
  assert.equal(plan.outcome,'nonempty');assert.equal(plan.entries.length,5);
  assert.equal((rendered.match(/Existing preparation; do not launch a duplicate/g)||[]).length,5);
  assert.doesNotMatch(rendered,/Normal empty plan|Preparation: none/);
  for(const candidate of c.candidates)assert.ok(rendered.includes(candidate.url));
});
test('long suffixes and absent next remain visible; unsafe links are rejected',()=>{
  const c=context();c.publication.snapshot.heads.next=null;
  c.inventory.sqliteVec.push({version:'0.1.10-alpha.123456'});
  const rendered=renderPlan(makePlan(c));
  assert.match(rendered,/`sqlite_vec_version`: `0.1.10-alpha.123456`/);
  assert.match(rendered,/next: no published HEAD/);
  c.candidates=[{kind:'run',selection:{sqlite:'3.54.1',sqliteVec:'0.1.9'},runId:17,attempt:1,status:'queued',url:'javascript:alert(1)'}];
  assert.throws(()=>renderPlan(makePlan(c)));
});
test('normal empty and failed outcomes stay distinct; diagnostics cannot inject summary HTML',()=>{
  const c=context();c.inventory=inventory(['3.54.0'],['0.1.9']);assert.match(renderPlan(makePlan(c)),/Normal empty plan/);
  for(const tag of ['script','SCRIPT']) {
    const failed=renderFailure('discovery',`<${tag}>unavailable</${tag}>`);assert.match(failed,/planning failed/);
    assert.match(failed,/not an empty-plan/);
    assert.ok(failed.includes(`&lt;${tag}&gt;unavailable&lt;/${tag}&gt;`));
    assert.ok(!failed.includes('<') && !failed.includes('>'));
  }
});

test('central forecasts summarize homogeneous channels once before unchanged pair sections',()=>{
  const c=context(),plan=makePlan(c),before=JSON.stringify(plan),rendered=renderPlan(plan);
  const section=rendered.split('## Forecast\n')[1].split('\n## latest')[0];
  assert.equal(section.trim(),'- latest: 0.1.1 · PATCH\n- next: 0.2.0-alpha.2 · PATCH');
  assert.ok(rendered.indexOf('## Forecast')<rendered.indexOf('## latest'));
  assert.deepEqual([...rendered.matchAll(/^### SQLite (.+) × sqlite-vec (.+)$/gm)].map(m=>[m[1],m[2]]),plan.entries.map(e=>[e.selection.sqlite,e.selection.sqliteVec]));
  assert.doesNotMatch(rendered,/Forecast:/);
  assert.match(rendered,/observed published state and recalculated at publication/);
  assert.equal(JSON.stringify(plan),before);
});
test('different forecasts within next are mapped by sufficient SQLite selectors',()=>{
  const c=context();c.publication.snapshot.heads.latest=published('0.1.1','3.53.4','0.1.9');
  c.publication.snapshot.heads.next=null;c.publication.snapshot.tags=['dist/v0.1.1'];
  c.publication.snapshot.releaseTags=['dist/v0.1.1'];c.publication.snapshot.npmVersions=['0.1.1'];
  c.inventory=inventory(['3.53.4','3.54.0'],['0.1.9','0.1.10-alpha.1','0.1.10-alpha.2']);
  const plan=makePlan(c),rendered=renderPlan(plan),section=rendered.split('## Forecast\n')[1].split('\n## latest')[0];
  assert.equal(section.trim(),'- latest: 0.2.0 · MINOR\n- next:\n  - SQLite 3.53.4: 0.1.2-alpha.1 · PATCH\n  - SQLite 3.54.0: 0.2.0-alpha.1 · MINOR');
  assert.deepEqual([...rendered.matchAll(/^### SQLite (.+) × sqlite-vec (.+)$/gm)].map(m=>[m[1],m[2]]),plan.entries.map(e=>[e.selection.sqlite,e.selection.sqliteVec]));
});
test('SQLite selector falls back to exact pairs when sqlite-vec changes the forecast',()=>{
  const c=context();c.publication.snapshot.heads.next=null;
  for(const key of ['tags','releaseTags'])c.publication.snapshot[key]=['dist/v0.1.0'];
  c.publication.snapshot.npmVersions=['0.1.0'];
  c.inventory=inventory(['3.54.0'],['0.1.10-alpha.1','0.2.0-alpha.1']);
  const plan=makePlan(c),rendered=renderPlan(plan),section=rendered.split('## Forecast\n')[1].split('\n## next')[0];
  assert.equal(section.trim(),'- next:\n  - SQLite 3.54.0 × sqlite-vec 0.1.10-alpha.1: 0.1.1-alpha.1 · PATCH\n  - SQLite 3.54.0 × sqlite-vec 0.2.0-alpha.1: 0.2.0-alpha.1 · MINOR');
  assert.doesNotMatch(section,/- latest:/);
  assert.doesNotMatch(section,/SQLite 3.54.0:/);
});
test('empty plan has no invented forecast or channel pair section',()=>{
  const c=context();c.inventory=inventory(['3.54.0'],['0.1.9']);
  const rendered=renderPlan(makePlan(c));
  assert.match(rendered,/Normal empty plan/);
  assert.doesNotMatch(rendered,/## Forecast|## latest|## next/);
  assert.match(rendered,/## Reference state/);
});
