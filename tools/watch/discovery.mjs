import assert from 'node:assert/strict';
import { upstream, compareUpstream } from '../release/policy.mjs';
import { pages } from '../release/state.mjs';

export const baselines = Object.freeze({ sqlite: '3.53.4', sqliteVec: '0.1.9' });
export const fossilTags = 'https://sqlite.org/src/taglist';
const text = html => html.replace(/<[^>]*>/g, '').replace(/&nbsp;|&#160;/g, ' ').trim();

export function sqliteTags(html) {
  assert.equal(typeof html, 'string');
  assert.ok(/<title>SQLite: Tags<\/title>/.test(html) && /<\/html>\s*$/.test(html), 'Incomplete/unrecognized SQLite Fossil inventory');
  const table = html.match(/<h2>Non-propagating tags:<\/h2>\s*<table\b[^>]*>([\s\S]*?)<\/table>/);
  assert.ok(table && /<th>Tag Name<\/th>/.test(table[1]), 'Missing complete Fossil tag table');
  const found = [], seen = new Set();
  for (const row of table[1].matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)) {
    const cells = [...row[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/g)].map(m => text(m[1]));
    if (!cells[0]?.startsWith('version-')) continue;
    const version = cells[0].slice(8);
    // Historical two-part/SQLite 1.x tags cannot enter the designated inventory.
    const numeric = version.match(/^(\d+)\.(\d+)/);
    assert.ok(numeric, 'Ambiguous Fossil release identity');
    if (+numeric[1] < 3 || (+numeric[1] === 3 && +numeric[2] < 53)) continue;
    upstream(version, 'sqlite');
    if (compareUpstream(version, baselines.sqlite, 'sqlite') < 0) continue;
    assert.ok(/^3\.(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)(?:\.(?:0|[1-9][0-9]*))?$/.test(version),
      `Unresolved SQLite publication/source identity: ${version}; A-inputs dependency requires review`);
    assert.equal(cells.length, 3, 'Malformed Fossil publication row');
    assert.equal(cells[2], '1', 'Ambiguous Fossil version tag');
    assert.match(cells[1], /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
    assert.ok(!seen.has(version), 'Duplicate Fossil version identity'); seen.add(version);
    found.push({ version, fossil: fossilTags, date: cells[1].slice(0,10),
      timeline: `https://sqlite.org/src/timeline?t=${encodeURIComponent(cells[0])}`,
      release: `https://sqlite.org/releaselog/${version.replaceAll('.', '_')}.html` });
  }
  assert.ok(/version-3\./.test(table[1]), 'Empty/unrecognized Fossil release inventory');
  return found.sort((a,b) => compareUpstream(a.version,b.version,'sqlite'));
}

export function vecReleases(records) {
  assert.ok(Array.isArray(records));
  const found = [], seen = new Set();
  for (const r of records) {
    assert.equal(typeof r.draft, 'boolean'); assert.equal(typeof r.prerelease, 'boolean');
    if (r.draft || r.published_at === null) continue;
    assert.match(r.published_at || '', /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
    const version = r.tag_name?.replace(/^v/, '');
    upstream(version, 'sqliteVec');
    if (compareUpstream(version,baselines.sqliteVec,'sqliteVec') < 0) continue;
    assert.match(version, /^(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)(?:-(?:alpha|beta|rc)(?:\.(?:0|[1-9][0-9]*))?)?$/);
    assert.equal(r.prerelease, !!upstream(version).prerelease.length, 'Contradictory sqlite-vec maturity');
    assert.ok(!seen.has(version), 'Ambiguous sqlite-vec release'); seen.add(version);
    assert.equal(r.html_url, `https://github.com/asg017/sqlite-vec/releases/tag/v${version}`);
    assert.match(r.url || '', /^https:\/\/api\.github\.com\/repos\/asg017\/sqlite-vec\/releases\/[1-9][0-9]*$/);
    assert.ok(Array.isArray(r.assets), 'Missing sqlite-vec assets');
    const assets = r.assets.filter(a => a.name === `sqlite-vec-${version}-amalgamation.tar.gz`);
    assert.equal(assets.length,1, 'Missing/ambiguous official amalgamation');
    assert.equal(assets[0].state,'uploaded');
    assert.equal(assets[0].browser_download_url,`https://github.com/asg017/sqlite-vec/releases/download/v${version}/sqlite-vec-${version}-amalgamation.tar.gz`);
    assert.match(assets[0].digest || '', /^sha256:[0-9a-f]{64}$/, 'Missing official source-integrity metadata');
    found.push({version,release:r.html_url,metadata:r.url,archive:assets[0].browser_download_url,digest:assets[0].digest});
  }
  return found.sort((a,b) => compareUpstream(a.version,b.version,'sqliteVec'));
}

export async function discover({ get }) {
  const response = await get(fossilTags,{binary:true});
  assert.equal(response.status,200,'SQLite Fossil inventory unavailable');
  assert.ok(Buffer.isBuffer(response.data),'Invalid Fossil response');
  const sqlite = sqliteTags(response.data.toString('utf8'));
  for (const item of sqlite) {
    const log = await get(item.release,{binary:true});
    assert.equal(log.status,200,`SQLite release evidence unavailable: ${item.version}`);
    assert.ok(Buffer.isBuffer(log.data));
    const title = `<title>SQLite Release ${item.version} On ${item.date}</title>`;
    assert.ok(log.data.toString('utf8').includes(title),`Contradictory SQLite publication: ${item.version}`);
  }
  return {sqlite,sqliteVec:vecReleases(await pages('asg017/sqlite-vec','releases',get))};
}
