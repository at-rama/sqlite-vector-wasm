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
  assert.match(rendered,/3.54.1 × sqlite-vec 0.1.9/);assert.match(rendered,/Forecast: 0.1.1; increment PATCH/);
  assert.match(rendered,/Existing preparation; do not launch a duplicate/);assert.match(rendered,/actions\/runs\/17/);
  assert.match(rendered,/sqlite_vec_version: 0.1.10-alpha.2/);assert.match(rendered,/release_comment: empty string/);
  assert.match(rendered,/actions\/workflows\/updates.yml/);
  for(const k of ['sqlite','sqliteVec'])c.inventory[k].reverse();assert.equal(renderPlan(makePlan(c)),rendered);
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
