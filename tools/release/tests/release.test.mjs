import test from 'node:test';
import assert from 'node:assert/strict';
import { calculate, channelFor, upstream, signalFor, distribution, compareUpstream } from '../policy.mjs';
import { readState, pages, npmState, sha256 } from '../state.mjs';
import { descriptor, integratedContext } from '../context.mjs';

const commit = 'a'.repeat(40);
const pair = (sqliteVec = '0.1.9', sqlite = '3.53.4') => ({ sqlite, sqliteVec });
const empty = () => ({ schemaVersion: 1, tags: [], npmVersions: [], releaseTags: [], heads: { latest: null, next: null } });
function state(latest = '0.2.0', next = null, stablePair = pair(), nextPair = pair('0.2.0-alpha.1')) {
  const s = empty();
  for (const [channel, version, upstreams] of [['latest', latest, stablePair], ['next', next, nextPair]]) {
    if (!version) continue;
    s.heads[channel] = { version, commit, upstreams }; s.tags.push(`dist/v${version}`); s.releaseTags.push(`dist/v${version}`); s.npmVersions.push(version);
  }
  return s;
}
const calc = (selection, snapshot = empty(), comment = '') => calculate({ selection, snapshot, comment });

test('exact upstreams, four channels, numerical signals and suffix ordering', () => {
  for (const [sqlite, vec, channel] of [['3.53.4','0.1.9','latest'], ['3.53.4-alpha.1','0.1.9','next'], ['3.53.4','0.1.9-beta.2','next'], ['3.53.4-rc.1','0.1.9-alpha.1','next']])
    assert.equal(channelFor(pair(vec, sqlite)), channel);
  assert.equal(signalFor('0.1.10-alpha.1', '0.1.9', 'sqliteVec'), 1);
  assert.equal(signalFor('0.2.0-alpha.1', '0.1.10', 'sqliteVec'), 2);
  assert.equal(signalFor('4.0.0', '3.53.4', 'sqlite'), 3);
  assert.equal(signalFor('3.53.4.1', '3.53.4', 'sqlite'), 1);
  assert.equal(signalFor('0.2.0-alpha.2', '0.2.0-alpha.1', 'sqliteVec'), 0);
  assert.equal(compareUpstream('0.1.9-alpha.10', '0.1.9-alpha.2'), 1);
  assert.equal(compareUpstream('0.1.9', '0.1.9-rc.1'), 1);
  for (const bad of ['v0.1.9', '0.01.9', '0.1.9-alpha.01', '0.1.9.1', '0.1.9+build', '9007199254740992.0.0']) assert.throws(() => upstream(bad));
  for (const bad of ['0.1.0-alphaX1', '0.1.0-alpha.0', '0.1.0-beta.1']) assert.throws(() => distribution(bad));
  assert.throws(() => channelFor({ ...pair(), channel: 'next' }));
});

test('stable initial, default patch, simultaneous signals and maturity', () => {
  assert.equal(calc(pair()).version, '0.1.0');
  assert.throws(() => calc(pair('0.1.10-alpha.1')), /Initial experimental/);
  assert.equal(calc(pair(), state()).version, '0.2.1');
  assert.equal(calc(pair('0.2.0', '3.53.5'), state()).version, '0.3.0');
  assert.equal(calc(pair('0.1.9', '4.0.0'), state('0.4.2')).version, '0.5.0');
  assert.equal(calc(pair('1.0.0'), state('0.4.2')).version, '1.0.0');
  assert.throws(() => calc(pair('0.1.9'), state('1.0.0', null, pair('1.0.0')), 'reviewed rollback'), /Maturity ceiling/);
});

test('alpha required base less/equal/greater and closed/absent series', () => {
  const cases = [
    [state('0.2.0','0.3.0-alpha.2'), pair('0.1.10-alpha.9'), '0.3.0-alpha.3', '0.2.1'],
    [state('0.2.0','0.3.0-alpha.2'), pair('0.2.0-alpha.9'), '0.3.0-alpha.3', '0.3.0'],
    [state('0.2.0','0.2.1-alpha.2',pair(),pair('0.1.10-alpha.2')), pair('0.2.0-alpha.1'), '0.3.0-alpha.1','0.3.0'],
    [state('0.3.0','0.3.0-alpha.3',pair('0.2.0')), pair('0.2.1-alpha.1'), '0.3.1-alpha.1','0.3.1'],
    [state('0.3.1','0.3.0-alpha.3',pair('0.2.0')), pair('0.3.0-alpha.1'), '0.4.0-alpha.1','0.4.0'],
    [state('0.2.0'), pair('0.1.10-alpha.1'), '0.2.1-alpha.1','0.2.1'],
  ];
  for (const [snapshot, selection, expected, requiredBase] of cases) {
    const result = calc(selection, snapshot, 'explicit selection');
    assert.equal(result.version, expected); assert.equal(result.requiredBase, requiredBase);
  }
  assert.equal(calc(pair(), state('0.2.0','0.3.0-alpha.2')).version, '0.2.1');
});

test('rollback channel reference, deterministic immutable input, changed state and collisions', () => {
  const snapshot = state('0.2.0','0.3.0-alpha.2');
  assert.throws(() => calc(pair('0.1.10-alpha.1'), snapshot), /rollback/);
  assert.equal(calc(pair('0.1.8'), snapshot, 'SQLite regression').version, '0.2.1');
  assert.equal(calc(pair('0.1.8','3.54.0'), snapshot,'reviewed rollback').signal, 'MINOR');
  const input = { selection: pair('0.2.0-alpha.2'), snapshot, comment: '' };
  const before = structuredClone(input); Object.freeze(input.selection); Object.freeze(input.snapshot);
  assert.deepEqual(calculate(input), calculate(input)); assert.deepEqual(input, before);
  assert.notEqual(calc(pair(), state()).version, calc(pair(), state('0.2.1')).version);
  for (const key of ['tags','npmVersions','releaseTags']) {
    const occupied = empty(); occupied[key].push(key === 'npmVersions' ? '0.1.0' : 'dist/v0.1.0');
    assert.throws(() => calc(pair(), occupied), /collision/);
  }
  const invalid = state(); invalid.heads.latest.commit = 'bad'; assert.throws(() => calc(pair(), invalid));
});

const ok = data => ({ status: 200, headers: {}, data });
test('state distinguishes genuine bootstrap, complete pagination, errors and partial identities', async () => {
  const get = async url => new URL(url).hostname === 'registry.npmjs.org' ? { status: 404, data: { error: 'Not found' } } : ok([]);
  assert.deepEqual(await readState({ repository: 'at-rama/sqlite-vector-wasm', get }), empty());
  const partial = await readState({ repository: 'at-rama/sqlite-vector-wasm', get: async url => url.includes('/tags?') ? ok([{ name:'dist/v0.1.0',commit:{sha:commit} }]) : get(url) });
  assert.throws(() => calc(pair(), partial), /collision/);
  let count = 0;
  assert.deepEqual(await pages('a/b','tags', async () => ++count === 1 ? { ...ok([1]), headers: { link:'<https://api.github.com/repos/a/b/tags?per_page=100&page=2>; rel="next"' } } : ok([2])), [1,2]);
  for (const status of [401,403,500]) await assert.rejects(npmState(async () => ({ status, data: {} })), /unavailable/);
  await assert.rejects(npmState(async () => ({ status:404,data:{} })), /absence/);
  await assert.rejects(pages('a/b','tags', async () => ({ ...ok([]),headers:{link:'garbage; rel="next"'} })), /pagination/);
  await assert.rejects(pages('a/b','tags', async () => ({ ...ok([]),headers:{link:'<https://evil.invalid/?page=2>; rel="next"'} })), /pagination/);
  await assert.rejects(readState({ repository:'a/b',get:async () => { throw Error('transport'); } }), /transport/);
});

const candidate = () => ({ schemaVersion:1,...pair(),releaseComment:'reviewed; $(data)',preparation:{runId:17,url:'https://github.com/a/b/actions/runs/17'} });
const lock = () => ({ sqlite:{version:'3.53.4'},sqliteVec:{version:'0.1.9'} });
test('descriptor validates exact handoff and treats comments as data', () => {
  assert.equal(descriptor(candidate(),lock()).comment,'reviewed; $(data)');
  assert.throws(() => descriptor({...candidate(),channel:'latest'},lock()));
  assert.throws(() => descriptor({...candidate(),sqliteVec:'0.1.8'},lock()));
  assert.throws(() => descriptor({...candidate(),preparation:{runId:18,url:'https://github.com/a/b/actions/runs/17'}},lock()));
});

test('integrated context requires human merge, exact revision and changed descriptor', async () => {
  const pr = {number:1,merged:true,state:'closed',merged_by:{type:'User'},base:{ref:'main',repo:{full_name:'a/b'}},merge_commit_sha:commit,changed_files:1};
  const event = {action:'closed',repository:{full_name:'a/b'},pull_request:pr};
  const invoke = (changes={}) => integratedContext({repository:'a/b',event,get:async url=>ok(url.includes('/files?') ? changes.files || [{filename:'inputs/release.json',status:'added'}] : {...pr,...changes.pr}),readAt:async (revision,path)=> {assert.equal(revision,commit);return JSON.stringify(path.endsWith('sources.lock.json') ? lock() : candidate());}});
  assert.equal((await invoke()).commit,commit);
  for (const changes of [{pr:{merged:false}},{pr:{merge_commit_sha:'b'.repeat(40)}},{pr:{merged_by:{type:'Bot'}}},{files:[]},{files:[{filename:'README.md',status:'modified'}]},{pr:{changed_files:3001}}]) await assert.rejects(invoke(changes));
});
