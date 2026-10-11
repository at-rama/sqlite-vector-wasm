import assert from 'node:assert/strict';

const number = '(?:0|[1-9][0-9]*)';
const identifier = '(?:0|[1-9][0-9]*|[0-9]*[A-Za-z-][0-9A-Za-z-]*)';
const upstreamPattern = new RegExp(`^(${number})\\.(${number})\\.(${number})(?:\\.(${number}))?(?:-(${identifier}(?:\\.${identifier})*))?$`);
export const commitPattern = /^[0-9a-f]{40}$/;

export function upstream(version, component = 'sqliteVec') {
  assert.equal(typeof version, 'string', 'Exact upstream version required');
  const match = upstreamPattern.exec(version);
  assert.ok(match && (component === 'sqlite' || match[4] === undefined), `Unsupported ${component} version: ${version}`);
  const numeric = match.slice(1, 5).map(value => Number(value || 0));
  assert.ok(numeric.every(Number.isSafeInteger), 'Version component overflow');
  return { numeric, prerelease: match[5]?.split('.') || [] };
}

export function distribution(version) {
  assert.equal(typeof version, 'string');
  const match = new RegExp(`^(${number})\\.(${number})\\.(${number})(?:-alpha\\.([1-9][0-9]*))?$`).exec(version);
  assert.ok(match, `Unsupported distribution version: ${version}`);
  const numeric = match.slice(1, 4).map(Number);
  const alpha = match[4] ? Number(match[4]) : null;
  assert.ok([...numeric, ...(alpha === null ? [] : [alpha])].every(Number.isSafeInteger), 'Version overflow');
  return { numeric, alpha, base: numeric.join('.') };
}

export function compareNumeric(a, b) {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const delta = (a[i] || 0) - (b[i] || 0);
    if (delta) return Math.sign(delta);
  }
  return 0;
}

export function compareUpstream(a, b, component) {
  const left = upstream(a, component), right = upstream(b, component);
  const numeric = compareNumeric(left.numeric, right.numeric);
  if (numeric) return numeric;
  if (!left.prerelease.length || !right.prerelease.length)
    return left.prerelease.length ? -1 : right.prerelease.length ? 1 : 0;
  for (let i = 0; i < Math.max(left.prerelease.length, right.prerelease.length); i++) {
    const x = left.prerelease[i], y = right.prerelease[i];
    if (x === y) continue;
    if (x === undefined || y === undefined) return x === undefined ? -1 : 1;
    const xn = /^\d+$/.test(x), yn = /^\d+$/.test(y);
    if (xn && yn) return x.length === y.length ? (x < y ? -1 : 1) : Math.sign(x.length - y.length);
    if (xn !== yn) return xn ? -1 : 1;
    return x < y ? -1 : 1;
  }
  return 0;
}

export function compareDistribution(a, b) {
  const left = distribution(a), right = distribution(b);
  return compareNumeric(left.numeric, right.numeric) || (left.alpha === null
    ? right.alpha === null ? 0 : 1 : right.alpha === null ? -1 : Math.sign(left.alpha - right.alpha));
}

export function channelFor(selection) {
  assert.deepEqual(Object.keys(selection).sort(), ['sqlite', 'sqliteVec'], 'Only exact upstream selections are accepted; no channel/version override');
  return Object.entries(selection).some(([key, version]) => upstream(version, key).prerelease.length) ? 'next' : 'latest';
}

export function signalFor(selected, reference, component) {
  const a = upstream(selected, component).numeric, b = upstream(reference, component).numeric;
  if (compareNumeric(a, b) <= 0) return 0;
  const changed = a.findIndex((value, i) => value !== b[i]);
  return changed === 0 ? 3 : changed === 1 ? 2 : 1;
}

export function increment(version, signal) {
  const n = [...distribution(version).numeric];
  const index = 3 - signal;
  n[index]++;
  for (let i = index + 1; i < 3; i++) n[i] = 0;
  assert.ok(n.every(Number.isSafeInteger), 'Version overflow');
  return n.join('.');
}

export function validateSnapshot(snapshot) {
  assert.equal(snapshot?.schemaVersion, 1, 'Unsupported publication snapshot');
  for (const key of ['tags', 'npmVersions', 'releaseTags']) {
    assert.ok(Array.isArray(snapshot[key]), `Incomplete publication state: ${key}`);
    assert.equal(new Set(snapshot[key]).size, snapshot[key].length, `Duplicate ${key}`);
    for (const value of snapshot[key]) distribution(key === 'npmVersions' ? value : value.replace(/^dist\/v/, ''));
    if (key !== 'npmVersions') assert.ok(snapshot[key].every(value => value.startsWith('dist/v')), 'Invalid distribution tag');
  }
  assert.deepEqual(Object.keys(snapshot.heads).sort(), ['latest', 'next']);
  for (const channel of ['latest', 'next']) {
    const head = snapshot.heads[channel];
    if (head === null) continue;
    assert.ok(head && commitPattern.test(head.commit), 'Invalid published revision');
    const parsed = distribution(head.version);
    assert.equal(parsed.alpha === null ? 'latest' : 'next', channel, 'Wrong channel version');
    assert.equal(channelFor(head.upstreams), channel, 'Wrong published composition/channel');
    assert.ok(snapshot.npmVersions.includes(head.version) && snapshot.tags.includes(`dist/v${head.version}`)
      && snapshot.releaseTags.includes(`dist/v${head.version}`), 'Incomplete published HEAD');
  }
  assert.ok(!snapshot.heads.next || snapshot.heads.latest, 'Experimental HEAD without initial stable publication');
  return snapshot;
}

export function calculate({ selection, snapshot, comment = '' }) {
  const channel = channelFor(selection);
  validateSnapshot(snapshot);
  assert.equal(typeof comment, 'string', 'Release comment must be data');
  const stable = snapshot.heads.latest, reference = snapshot.heads[channel] || stable;
  const rollback = !!reference && Object.entries(selection).some(([key, version]) => compareUpstream(version, reference.upstreams[key], key) < 0);
  assert.ok(!rollback || comment.trim(), 'Explicit rollback requires a release comment');
  let signal = 0, requiredBase = '0.1.0', version = requiredBase;
  if (!stable) {
    assert.equal(channel, 'latest', 'Initial experimental publication is not authorized');
  } else {
    signal = Math.max(1, ...Object.entries(selection).map(([key, version]) => signalFor(version, stable.upstreams[key], key)));
    if (upstream(selection.sqliteVec).numeric[0] === 0) signal = Math.min(signal, 2);
    requiredBase = increment(stable.version, signal);
    version = requiredBase;
    if (channel === 'next') {
      const next = snapshot.heads.next, series = next && distribution(next.version);
      const open = series && compareDistribution(series.base, stable.version) > 0;
      const continuing = open && compareDistribution(requiredBase, series.base) <= 0;
      const alpha = continuing ? series.alpha + 1 : 1;
      assert.ok(Number.isSafeInteger(alpha), 'Alpha counter overflow');
      version = `${continuing ? series.base : requiredBase}-alpha.${alpha}`;
    }
  }
  if (reference) assert.ok(compareDistribution(version, reference.version) > 0, 'Channel must progress monotonically');
  assert.ok(upstream(selection.sqliteVec).numeric[0] !== 0 || distribution(version).numeric[0] === 0, 'Maturity ceiling conflicts with channel progression');
  const tag = `dist/v${version}`;
  assert.ok(!snapshot.tags.includes(tag) && !snapshot.releaseTags.includes(tag) && !snapshot.npmVersions.includes(version), `Publication collision: ${version}`);
  return { name: 'sqlite-vector-wasm', version, tag, channel, signal: signal ? ['PATCH','MINOR','MAJOR'][signal - 1] : 'INITIAL',
    requiredBase, initial: !stable, rollback, stableReference: stable?.version || null, channelReference: reference?.version || null };
}
