import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { channelFor, distribution, commitPattern, validateSnapshot } from './policy.mjs';

export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
export function repositoryName(value) {
  assert.match(value || '', /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/, 'Expected owner/repository');
  return value;
}

export function httpReader(token = '') {
  return async (url, { binary = false } = {}) => {
    const target = new URL(url);
    assert.equal(target.protocol, 'https:', 'Publication state requires HTTPS');
    const headers = { 'User-Agent': 'sqlite-vector-wasm-release', Accept: binary ? 'application/octet-stream' : 'application/vnd.github+json' };
    if (target.hostname === 'api.github.com' && token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(target, { headers, signal: AbortSignal.timeout(120000) });
    const bytes = Buffer.from(await response.arrayBuffer());
    const data = binary ? bytes : JSON.parse(bytes.toString('utf8'));
    return { status: response.status, headers: Object.fromEntries(response.headers), data };
  };
}

export async function pages(repository, path, get) {
  const origin = `https://api.github.com/repos/${repositoryName(repository)}/`;
  let url = `${origin}${path}${path.includes('?') ? '&' : '?'}per_page=100`;
  const result = [], seen = new Set();
  while (url) {
    assert.ok(!seen.has(url) && seen.size < 10000, 'Cyclic/truncated pagination'); seen.add(url);
    const response = await get(url);
    assert.equal(response.status, 200, `GitHub state unavailable: ${path} (${response.status})`);
    assert.ok(Array.isArray(response.data), 'Malformed GitHub page'); result.push(...response.data);
    const link = response.headers?.link;
    const next = link?.match(/<([^>]+)>;\s*rel="next"/);
    if (link?.includes('rel="next"')) assert.ok(next, 'Malformed pagination link');
    url = next?.[1] || null;
    if (url) assert.ok(url.startsWith(origin) && new URL(url).searchParams.has('page'), 'Unsafe pagination reference');
  }
  return result;
}

export async function npmState(get, { allowAbsent = true } = {}) {
  const response = await get('https://registry.npmjs.org/sqlite-vector-wasm');
  if (response.status === 404 && allowAbsent) {
    assert.ok(response.data?.error === 'Not found', 'Unrecognized npm absence');
    return { name: 'sqlite-vector-wasm', versions: {}, 'dist-tags': {} };
  }
  assert.equal(response.status, 200, `npm state unavailable (${response.status})`);
  assert.equal(response.data?.name, 'sqlite-vector-wasm', 'Unexpected npm package');
  assert.ok(response.data.versions && typeof response.data.versions === 'object' && !Array.isArray(response.data.versions));
  assert.ok(response.data['dist-tags'] && typeof response.data['dist-tags'] === 'object');
  for (const [version, metadata] of Object.entries(response.data.versions)) {
    distribution(version);
    assert.equal(metadata.name, 'sqlite-vector-wasm'); assert.equal(metadata.version, version);
    assert.ok(typeof metadata.dist?.tarball === 'string', 'Missing npm archive');
  }
  return response.data;
}

export async function download(url, get) {
  const response = await get(url, { binary: true });
  assert.equal(response.status, 200, `Archive/evidence unavailable (${response.status})`);
  assert.ok(Buffer.isBuffer(response.data) && response.data.length, 'Empty/nonbinary download');
  return response.data;
}

export function publicationIdentity(evidence) {
  assert.equal(evidence?.schemaVersion, 1, 'Unsupported publication provenance');
  assert.equal(evidence.name, 'sqlite-vector-wasm');
  const parsed = distribution(evidence.version);
  assert.equal(evidence.tag, `dist/v${evidence.version}`);
  assert.equal(evidence.channel, parsed.alpha === null ? 'latest' : 'next');
  assert.equal(channelFor(evidence.upstreams), evidence.channel);
  assert.match(evidence.commit, commitPattern);
  assert.match(evidence.archive?.sha256 || '', /^[0-9a-f]{64}$/);
  assert.ok(Number.isSafeInteger(evidence.archive.size) && evidence.archive.size > 0);
  for (const key of ['sqlite', 'sqliteVec']) {
    assert.equal(evidence.sourceLock?.[key]?.version, evidence.upstreams[key]);
    assert.ok(/^https:\/\//.test(evidence.sourceLock[key].archiveUrl || ''), 'Missing source origin');
    const digest = evidence.sourceLock[key].digest;
    assert.ok(['sha256', 'sha3-256'].includes(digest?.algorithm) && /^[0-9a-f]{64}$/.test(digest?.value || ''), 'Missing source digest');
  }
  assert.ok(evidence.build?.tools && evidence.acceptance?.verdict === 'passed', 'Incomplete qualification provenance');
  return evidence;
}

export async function readState({ repository, get = httpReader() }) {
  repositoryName(repository);
  const [gitTags, releases, npm] = await Promise.all([
    pages(repository, 'tags', get), pages(repository, 'releases', get), npmState(get),
  ]);
  const tags = gitTags.filter(tag => tag.name?.startsWith('dist/v'));
  const relevant = releases.filter(release => release.tag_name?.startsWith('dist/v'));
  const snapshot = { schemaVersion: 1, tags: tags.map(tag => tag.name), npmVersions: Object.keys(npm.versions),
    releaseTags: relevant.map(release => release.tag_name), heads: { latest: null, next: null } };
  for (const channel of ['latest', 'next']) {
    const version = npm['dist-tags'][channel];
    if (version === undefined) continue;
    assert.equal(typeof version, 'string');
    const tag = tags.find(value => value.name === `dist/v${version}`);
    const release = relevant.find(value => value.tag_name === `dist/v${version}` && !value.draft);
    assert.ok(tag && release && npm.versions[version], 'npm HEAD lacks corresponding tag/published Release');
    assert.match(tag.commit?.sha || '', commitPattern);
    assert.equal(release.prerelease, channel === 'next', 'GitHub release maturity mismatch');
    const evidenceAssets = release.assets?.filter(asset => asset.name === 'publication.json');
    assert.equal(evidenceAssets?.length, 1, 'Missing/ambiguous Release provenance asset');
    const evidence = publicationIdentity(JSON.parse((await download(evidenceAssets[0].url, get)).toString('utf8')));
    assert.equal(evidence.version, version); assert.equal(evidence.channel, channel); assert.equal(evidence.commit, tag.commit.sha);
    const archives = release.assets.filter(asset => asset.name === 'payload.tgz');
    assert.equal(archives.length, 1, 'Missing/ambiguous Release archive');
    for (const url of [archives[0].url, npm.versions[version].dist.tarball]) {
      const bytes = await download(url, get);
      assert.equal(bytes.length, evidence.archive.size); assert.equal(sha256(bytes), evidence.archive.sha256, 'Published destination bytes differ');
    }
    snapshot.heads[channel] = { version, commit: evidence.commit, upstreams: evidence.upstreams };
  }
  if (snapshot.npmVersions.length) assert.ok(snapshot.heads.latest, 'Published npm history without stable HEAD');
  return validateSnapshot(snapshot);
}
