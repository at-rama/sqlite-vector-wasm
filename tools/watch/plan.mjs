import assert from 'node:assert/strict';
import { compareUpstream, upstream, channelFor, calculate, validateSnapshot } from '../release/policy.mjs';
import { repositoryName } from '../release/state.mjs';
import { baselines } from './discovery.mjs';
import { pairKey } from './state.mjs';

const components=['sqlite','sqliteVec'];
const atLeast=(pair,reference)=>components.every(k=>compareUpstream(pair[k],reference[k],k)>=0);
const progresses=(pair,reference)=>atLeast(pair,reference)&&components.some(k=>compareUpstream(pair[k],reference[k],k)>0);

export function makePlan({repository,inventory,publication,candidates}) {
  repositoryName(repository);validateSnapshot(publication.snapshot);
  assert.ok(publication.snapshot.heads.latest,'Planning requires a stable published reference; complete bootstrap first');
  assert.ok(Array.isArray(publication.history)&&Array.isArray(candidates));
  const versions=Object.fromEntries(components.map(k=>{
    assert.ok(Array.isArray(inventory[k]),'Incomplete upstream inventory');
    const values=inventory[k].map(x=>x.version);for(const v of values)upstream(v,k);
    assert.equal(new Set(values).size,values.length,'Ambiguous upstream inventory');
    return [k,values.filter(v=>compareUpstream(v,baselines[k],k)>=0).sort((a,b)=>compareUpstream(a,b,k))];
  }));
  const excluded=new Set(publication.history.map(h=>`${h.channel}:${pairKey(h.selection)}`));
  const entries=[];
  for(const sqlite of versions.sqlite)for(const sqliteVec of versions.sqliteVec) {
    const selection={sqlite,sqliteVec},channel=channelFor(selection);
    const stable=publication.snapshot.heads.latest.upstreams;
    const reference=(publication.snapshot.heads[channel]||publication.snapshot.heads.latest).upstreams;
    if(!progresses(selection,reference)||(channel==='next'&&!atLeast(selection,stable)))continue;
    if(excluded.has(`${channel}:${pairKey(selection)}`))continue;
    const identity=calculate({selection,snapshot:publication.snapshot,comment:''});
    entries.push({selection,identity,parameters:{sqlite_version:sqlite,sqlite_vec_version:sqliteVec,release_comment:''},
      candidates:candidates.filter(c=>pairKey(c.selection)===pairKey(selection))});
  }
  entries.sort((a,b)=>a.identity.channel.localeCompare(b.identity.channel)||compareUpstream(a.selection.sqlite,b.selection.sqlite,'sqlite')||compareUpstream(a.selection.sqliteVec,b.selection.sqliteVec,'sqliteVec'));
  return {schemaVersion:1,repository,outcome:entries.length?'nonempty':'empty',references:publication.snapshot.heads,
    partial:publication.partial||[],entries};
}

const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link=(label,url)=>{assert.match(url || '',/^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.\/-]+$/);return `[${escape(label)}](${url})`;};

export function renderPlan(plan) {
  const workflow=`https://github.com/${repositoryName(plan.repository)}/actions/workflows/updates.yml`;
  let result='# Upstream job plan\n\n';
  result+='Forecasts are independent and unreserved. Discovery is not build qualification or publication acceptance. Human selection and integration remain separate actions.\n\n';
  result+='## Published references\n\n';
  for(const channel of ['latest','next']) {
    const h=plan.references[channel];
    result+=h?`- ${channel}: ${escape(h.version)}; SQLite ${escape(h.upstreams.sqlite)}, sqlite-vec ${escape(h.upstreams.sqliteVec)}; revision ${escape(h.commit)}.\n`:`- ${channel}: no published HEAD.\n`;
  }
  if(plan.partial.length)result+=`\nPartial occupied identities (not completed publications): ${plan.partial.map(escape).join(', ')}.\n`;
  if(plan.outcome==='empty')return result+'\n## Normal empty plan\n\nComplete discovery and state reads produced no eligible unpublished pairs.\n';
  for(const channel of ['latest','next']) {
    const rows=plan.entries.filter(e=>e.identity.channel===channel);if(!rows.length)continue;
    result+=`\n## ${channel}\n`;
    for(const e of rows) {
      result+=`\n### SQLite ${escape(e.selection.sqlite)} × sqlite-vec ${escape(e.selection.sqliteVec)}\n\n`;
      result+=`Forecast: ${escape(e.identity.version)}; increment ${escape(e.identity.signal)}; unreserved.\n\n`;
      if(e.candidates.length) {
        result+='Existing preparation; do not launch a duplicate:\n\n';
        for(const c of e.candidates){result+=`- ${link(c.kind==='pr'?`Candidate PR #${c.number}`:`Preparation ${c.runId}, attempt ${c.attempt}`,c.url)} (${escape(c.status)}).`;
          if(c.kind==='pr')result+=` ${link('Preparation',c.preparation)}; attempt ${c.attempt}; head ${escape(c.head)}.`;
          if(c.run)result+=` Active attempt ${c.run.attempt}: ${escape(c.run.status)}.`;
          result+='\n';}
        result+=`\n${link('Updates workflow',workflow)} (navigation only; the existing preparation is shown above).\n`;
      } else result+=`${link('Open Updates for a separate human preparation action',workflow)}.\n`;
      result+='\nExact Updates parameters (no channel or version override):\n\n';
      result+=`- sqlite_version: ${escape(e.parameters.sqlite_version)}\n- sqlite_vec_version: ${escape(e.parameters.sqlite_vec_version)}\n- release_comment: empty string\n`;
    }
  }
  return result;
}

export function renderFailure(stage,diagnostic) {
  return `# Upstream planning failed\n\nStage: ${escape(stage)}.\n\n${escape(diagnostic)}\n\nThe execution did not complete successfully. This is not an empty-plan result.\n`;
}
