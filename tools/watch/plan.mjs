import assert from 'node:assert/strict';
import { compareUpstream, upstream, channelFor, calculate, validateSnapshot, engineKey, componentReferences } from '../release/policy.mjs';
import { repositoryName } from '../release/state.mjs';
import { baselines } from './discovery.mjs';
import { pairKey } from './state.mjs';

const components=['sqlite','sqliteVector'];
const atLeast=(pair,references)=>components.every(k=>!references[k] || compareUpstream(pair[k],references[k].upstreams[k],k)>=0);
const progresses=(pair,references)=>atLeast(pair,references)&&components.some(k=>!references[k] || compareUpstream(pair[k],references[k].upstreams[k],k)>0);
const headReferences=head=>Object.fromEntries(components.map(k=>[k,head?.upstreams[k] === undefined ? null : head]));

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
  for(const sqlite of versions.sqlite)for(const sqliteVector of versions.sqliteVector) {
    const selection={sqlite,sqliteVector},channel=channelFor(selection);
    const stable=headReferences(publication.snapshot.heads.latest);
    const reference=componentReferences(selection,publication.snapshot);
    if(!progresses(selection,reference)||(channel==='next'&&!atLeast(selection,stable)))continue;
    if(excluded.has(`${channel}:${pairKey(selection)}`))continue;
    const identity=calculate({selection,snapshot:publication.snapshot,comment:''});
    entries.push({selection,identity,parameters:{sqlite_version:sqlite,sqlite_vector_version:sqliteVector,sqlite_comment:'',sqlite_vector_comment:'',misc_comment:''},
      candidates:candidates.filter(c=>pairKey(c.selection)===pairKey(selection))});
  }
  entries.sort((a,b)=>a.identity.channel.localeCompare(b.identity.channel)||compareUpstream(a.selection.sqlite,b.selection.sqlite,'sqlite')||compareUpstream(a.selection.sqliteVector,b.selection.sqliteVector,'sqliteVector'));
  return {schemaVersion:1,repository,outcome:entries.length?'nonempty':'empty',references:publication.snapshot.heads,
    partial:publication.partial||[],entries};
}

const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link=(label,url)=>{assert.match(url || '',/^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.\/-]+$/);return `[${escape(label)}](${url})`;};

export function renderPlan(plan) {
  const workflow=`https://github.com/${repositoryName(plan.repository)}/actions/workflows/updates.yml`;
  let result='# Upstream job plan\n\n';
  result+=plan.outcome==='empty'
    ? '## Normal empty plan\n\nComplete discovery and state reads produced no eligible unpublished pairs.\n\n'
    : `Complete plan: ${plan.entries.length} eligible ${plan.entries.length===1?'pair':'pairs'}.\n\n`;
  result+='Forecasts are independent and unreserved, based on the observed published state and recalculated at publication. Discovery is not build qualification or publication acceptance. Human selection and integration remain separate actions.\n\n';
  if(plan.outcome!=='empty') {
    result+=`Choose zero, one or several jobs in ${link('Updates',workflow)}. Use each entry's exact inputs below and leave \`sqlite_comment\`, \`sqlite_vector_comment\` and \`misc_comment\` empty unless you want release-note paragraphs; no channel or version override. Do not start duplicate preparation for entries with existing candidates.\n`;
    result+=`\nTo draft optional release comments from official upstream sources, invoke \`/release-comments\` with the selected pair using the ${link('release-comments skill',`https://github.com/${repositoryName(plan.repository)}/blob/main/.42p/.agents/skills/release-comments/SKILL.md`)}.\n`;
    result+='\n## Forecast\n\n';
    for(const channel of ['latest','next']) {
      const rows=plan.entries.filter(e=>e.identity.channel===channel);if(!rows.length)continue;
      const forecast=e=>`${escape(e.identity.version)} · ${escape(e.identity.signal)}`;
      if(rows.every(e=>forecast(e)===forecast(rows[0]))) {
        result+=`- ${channel}: ${forecast(rows[0])}\n`;
      } else {
        result+=`- ${channel}:\n`;
        const sqliteVersions=[...new Set(rows.map(e=>e.selection.sqlite))];
        for(const sqlite of sqliteVersions) {
          const matching=rows.filter(e=>e.selection.sqlite===sqlite);
          if(matching.every(e=>forecast(e)===forecast(matching[0]))) {
            result+=`  - SQLite ${escape(sqlite)}: ${forecast(matching[0])}\n`;
          } else {
            for(const e of matching)result+=`  - SQLite ${escape(sqlite)} × SQLite-Vector ${escape(e.selection.sqliteVector)}: ${forecast(e)}\n`;
          }
        }
      }
    }
  }
  for(const channel of ['latest','next']) {
    const rows=plan.entries.filter(e=>e.identity.channel===channel);if(!rows.length)continue;
    result+=`\n## ${channel}\n`;
    for(const e of rows) {
      result+=`\n### SQLite ${escape(e.selection.sqlite)} × SQLite-Vector ${escape(e.selection.sqliteVector)}\n\n`;
      result+=`- \`sqlite_version\`: \`${escape(e.parameters.sqlite_version)}\` · \`sqlite_vector_version\`: \`${escape(e.parameters.sqlite_vector_version)}\`\n`;
      if(e.candidates.length) {
        result+='\nExisting preparation; do not launch a duplicate:\n\n';
        for(const c of e.candidates){result+=`- ${link(c.kind==='pr'?`Candidate PR #${c.number}`:`Preparation ${c.runId}, attempt ${c.attempt}`,c.url)} (${escape(c.status)}).`;
          if(c.kind==='pr')result+=` ${link('Preparation',c.preparation)}; attempt ${c.attempt}; head ${escape(c.head)}.`;
          if(c.run)result+=` Active attempt ${c.run.attempt}: ${escape(c.run.status)}.`;
          result+='\n';}
      }
    }
  }
  result+='\n## Reference state\n\n';
  for(const channel of ['latest','next']) {
    const h=plan.references[channel], key=h && engineKey(h.upstreams), label=key==='sqliteVector'?'SQLite-Vector':'sqlite-vec';
    result+=h?`- ${channel}: ${escape(h.version)}; SQLite ${escape(h.upstreams.sqlite)}, ${label} ${escape(h.upstreams[key])}; revision ${escape(h.commit)}.\n`:`- ${channel}: no published HEAD.\n`;
  }
  if(plan.partial.length)result+=`\nPartial occupied identities (not completed publications): ${plan.partial.map(escape).join(', ')}.\n`;
  return result;
}

export function renderFailure(stage,diagnostic) {
  return `# Upstream planning failed\n\nStage: ${escape(stage)}.\n\n${escape(diagnostic)}\n\nThe execution did not complete successfully. This is not an empty-plan result.\n`;
}
