import assert from 'node:assert/strict';
import { upstream, compareUpstream } from '../release/policy.mjs';
import { pages } from '../release/state.mjs';

export const baselines = Object.freeze({ sqlite: '3.53.4', sqliteVector: '1.1.0' });
export const fossilTags = 'https://sqlite.org/src/taglist';
// Extract the observed Fossil cell form; do not sanitize arbitrary HTML.
const text = cell => {
  const span = /^\s*<span class="tagDsp">([^<>]*)<\/span>\s*$/.exec(cell);
  const value = (span ? span[1] : cell).replace(/&nbsp;|&#160;/g, ' ').trim();
  assert.ok(!/[<>]/.test(value), 'Unrecognized Fossil cell markup');
  return value;
};

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

export const vectorAPI = 'https://api.github.com/repos/sqliteai/sqlite-vector';

export function vectorReleases(records) {
  assert.ok(Array.isArray(records));
  const found = [], seen = new Set(), resources = new Set();
  for (const r of records) {
    assert.equal(typeof r?.draft, 'boolean'); assert.equal(typeof r.prerelease, 'boolean');
    if (r.draft || r.published_at === null) continue;
    assert.match(r.published_at || '', /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
    const version = r.tag_name;
    // Same exact published-tag vocabulary as A-inputs; aliases are not releases.
    assert.match(version || '', /^(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)(?:-(?:alpha|beta|rc)(?:\.(?:0|[1-9][0-9]*))?)?$/);
    upstream(version, 'sqliteVector');
    assert.equal(r.prerelease, !!upstream(version, 'sqliteVector').prerelease.length, 'Contradictory Vector maturity');
    if (compareUpstream(version, baselines.sqliteVector, 'sqliteVector') < 0) continue;
    assert.ok(Number.isSafeInteger(r.id) && r.id > 0, 'Invalid Vector Release resource ID');
    assert.equal(r.url, `${vectorAPI}/releases/${r.id}`, 'Vector Release ID/URL mismatch');
    assert.ok(!resources.has(r.id), 'Ambiguous repeated Vector Release resource'); resources.add(r.id);
    assert.ok(!seen.has(version), 'Ambiguous Vector release'); seen.add(version);
    assert.equal(r.html_url, `https://github.com/sqliteai/sqlite-vector/releases/tag/${version}`);
    found.push({version, release:r.html_url, metadata:r.url, releaseId:r.id});
  }
  return found.sort((a,b) => compareUpstream(a.version,b.version,'sqliteVector'));
}

async function vectorBinding(item, get) {
  const tagUrl = `${vectorAPI}/git/ref/tags/${item.version}`;
  const response = await get(tagUrl);
  assert.equal(response.status, 200, 'Vector tag unavailable');
  assert.equal(response.data?.ref, `refs/tags/${item.version}`, 'Inconsistent Vector tag binding');
  let object = response.data.object;
  const seen = new Set();
  for (let depth = 0; depth < 5; depth++) {
    assert.match(object?.sha || '', /^[0-9a-f]{40}$/, 'Invalid Vector tag object');
    assert.ok(['tag','commit'].includes(object.type), 'Vector tag does not identify a commit');
    assert.ok(!seen.has(object.sha), 'Cyclic Vector tag binding'); seen.add(object.sha);
    const url = `${vectorAPI}/git/${object.type === 'tag' ? 'tags' : 'commits'}/${object.sha}`;
    assert.equal(object.url, url, 'Unofficial Vector tag/commit origin');
    const record = await get(url);
    assert.equal(record.status, 200, 'Vector tag/commit unavailable');
    assert.equal(record.data?.sha, object.sha, 'Inconsistent Vector tag/commit metadata');
    if (object.type === 'commit') return {...item, tag:item.version, tagUrl, commit:object.sha, commitUrl:url,
      archive:`https://codeload.github.com/sqliteai/sqlite-vector/tar.gz/${object.sha}`};
    object = record.data.object;
  }
  throw Error('Excessive Vector tag indirection');
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
  const releases = vectorReleases(await pages('sqliteai/sqlite-vector','releases',get));
  const sqliteVector = [];
  for (const item of releases) sqliteVector.push(await vectorBinding(item,get));
  return {sqlite,sqliteVector};
}
