import assert from 'node:assert/strict';
import { commitPattern, channelFor, upstream, distribution } from '../release/policy.mjs';
import { pages, repositoryName, readState, npmState, publicationIdentity, download } from '../release/state.mjs';
import { descriptor, candidateDescriptorChanged } from '../release/context.mjs';

export const pairKey = selection => JSON.stringify([selection.sqlite,selection.sqliteVec]);

// Cache read responses only within this invocation; never retain selection state.
export function cachedReader(get) {
  const cache = new Map();
  return (url,options={}) => {
    const key = `${options.binary === true ? 'binary' : 'json'}:${url}`;
    if (!cache.has(key)) cache.set(key,Promise.resolve().then(()=>get(url,options)));
    return cache.get(key);
  };
}

export async function publicationState({repository,get}) {
  repositoryName(repository);
  const snapshot = await readState({repository,get});
  const [tags,releases,npm] = await Promise.all([pages(repository,'tags',get),pages(repository,'releases',get),npmState(get)]);
  const history=[], partial=[];
  for (const release of releases.filter(r=>r.tag_name?.startsWith('dist/v') && !r.draft)) {
    const version=release.tag_name.slice(6), channel=distribution(version).alpha === null ? 'latest' : 'next';
    assert.equal(release.prerelease,channel === 'next','Historical release maturity mismatch');
    const assets=release.assets?.filter(a=>a.name === 'publication.json');
    assert.equal(assets?.length,1,'Missing/ambiguous historical provenance');
    assert.match(assets[0].url || '',new RegExp(`^https://api\\.github\\.com/repos/${repository.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}/releases/assets/[1-9][0-9]*$`));
    const evidence=publicationIdentity(JSON.parse((await download(assets[0].url,get)).toString('utf8')));
    assert.equal(evidence.version,version);assert.equal(evidence.channel,channel);
    const tag=tags.find(t=>t.name===release.tag_name);
    if(tag){assert.match(tag.commit?.sha || '',commitPattern);assert.equal(tag.commit.sha,evidence.commit,'Historical tag/provenance mismatch');}
    if(!tag || !npm.versions[version]) {partial.push(release.tag_name);continue;}
    history.push({channel,selection:evidence.upstreams,version,commit:evidence.commit});
  }
  return {snapshot,history,partial};
}

async function jsonAt(repository,sha,path,get) {
  assert.match(sha || '',commitPattern);
  const r=await get(`https://api.github.com/repos/${repository}/contents/${path}?ref=${sha}`);
  assert.equal(r.status,200,`Candidate ${path} unavailable`);
  assert.equal(r.data?.type,'file');assert.equal(r.data.encoding,'base64');
  assert.equal(r.data.path,path);assert.equal(typeof r.data.content,'string');
  const bytes=Buffer.from(r.data.content,'base64');
  assert.ok(bytes.length && bytes.length===r.data.size,'Incomplete candidate contents');
  return JSON.parse(bytes.toString('utf8'));
}

export async function candidateState({repository,get}) {
  repositoryName(repository);
  const origin=`https://api.github.com/repos/${repository}/`, items=[];
  let total;
  const runs=await pages(repository,'actions/workflows/updates.yml/runs?branch=main&event=workflow_dispatch',async(url)=>{
    const r=await get(url);
    assert.equal(r.status,200,'Preparation runs unavailable');
    assert.ok(Number.isSafeInteger(r.data?.total_count) && r.data.total_count>=0,'Incomplete workflow inventory');
    if(total===undefined)total=r.data.total_count;
    assert.equal(r.data.total_count,total,'Preparation inventory changed during pagination');
    assert.ok(Array.isArray(r.data.workflow_runs));
    return {...r,data:r.data.workflow_runs};
  });
  assert.equal(runs.length,total,'Truncated preparation inventory');
  const active=new Set(['queued','in_progress','waiting','pending','requested']), seenRuns=new Set();
  for(const run of runs) {
    if(run.status==='completed')continue;
    assert.ok(active.has(run.status),'Unknown preparation state');
    assert.equal(run.event,'workflow_dispatch');assert.equal(run.head_branch,'main');
    assert.equal(run.path?.split('@')[0],'.github/workflows/updates.yml');
    assert.equal(run.repository?.full_name,repository);assert.match(run.head_sha || '',commitPattern);
    assert.ok(Number.isSafeInteger(run.id) && run.id>0);
    assert.ok(Number.isSafeInteger(run.run_attempt) && run.run_attempt>0);
    assert.equal(run.html_url,`https://github.com/${repository}/actions/runs/${run.id}`);
    const identity=JSON.stringify([run.id,run.run_attempt]);
    assert.ok(!seenRuns.has(identity),`Repeated active preparation observation: ${run.html_url} attempt ${run.run_attempt}`);
    seenRuns.add(identity);
    const selected=/^candidate sqlite=(\S+) sqlite-vec=(\S+)$/.exec(run.display_title || '');
    assert.ok(selected,`Unresolved active preparation: ${run.html_url}`);
    const selection={sqlite:selected[1],sqliteVec:selected[2]};
    upstream(selection.sqlite,'sqlite');upstream(selection.sqliteVec,'sqliteVec');channelFor(selection);
    items.push({kind:'run',selection,runId:run.id,attempt:run.run_attempt,status:run.status,url:run.html_url});
  }
  const seenPR=new Set();
  for(const listed of await pages(repository,'pulls?state=open&base=main',get)) {
    if(!/^candidate\/run-[1-9][0-9]*-[1-9][0-9]*$/.test(listed.head?.ref || ''))continue;
    assert.ok(!seenPR.has(listed.number),'Duplicate candidate PR');seenPR.add(listed.number);
    const response=await get(`${origin}pulls/${listed.number}`);assert.equal(response.status,200,'Candidate PR unavailable');
    const pr=response.data;
    assert.equal(pr.number,listed.number);assert.equal(pr.state,'open');assert.equal(pr.base?.ref,'main');
    assert.equal(pr.base?.repo?.full_name,repository);assert.equal(pr.head?.repo?.full_name,repository);
    assert.equal(pr.head?.sha,listed.head.sha,'Candidate head changed during observation');
    assert.equal(pr.head?.ref,listed.head.ref,'Candidate branch changed during observation');
    assert.equal(pr.html_url,`https://github.com/${repository}/pull/${pr.number}`);
    if(!await candidateDescriptorChanged({repository,pullRequest:pr,get}))continue;
    const [value,lock]=await Promise.all([jsonAt(repository,pr.head.sha,'inputs/release.json',get),jsonAt(repository,pr.head.sha,'inputs/sources.lock.json',get)]);
    const selected=descriptor(value,lock);
    assert.equal(selected.preparation.url,`https://github.com/${repository}/actions/runs/${selected.preparation.runId}`);
    assert.ok(pr.head.ref.startsWith(`candidate/run-${selected.preparation.runId}-`),'Candidate branch/preparation mismatch');
    const attempt=Number(pr.head.ref.match(/-([1-9][0-9]*)$/)[1]);
    assert.ok(Number.isSafeInteger(attempt),'Invalid candidate attempt');
    for(const run of items.filter(x=>x.runId===selected.preparation.runId && x.attempt===attempt))assert.equal(pairKey(run.selection),pairKey(selected.selection),'Run/candidate selection mismatch');
    items.push({kind:'pr',selection:selected.selection,runId:selected.preparation.runId,attempt,number:pr.number,status:'open',url:pr.html_url,head:pr.head.sha,preparation:selected.preparation.url});
  }
  // Preserve every distinct PR. Join each active run to the first corresponding PR only.
  const result=items.filter(x=>x.kind==='pr').map(x=>({...x}));
  for(const run of items.filter(x=>x.kind==='run')) {
    const pr=result.find(x=>x.kind==='pr' && x.runId===run.runId && x.attempt===run.attempt);
    if(pr)pr.run=run;else result.push(run);
  }
  return result.sort((a,b)=>pairKey(a.selection).localeCompare(pairKey(b.selection)) || a.runId-b.runId || (a.number||0)-(b.number||0));
}
