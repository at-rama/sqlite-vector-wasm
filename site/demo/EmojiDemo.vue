<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
const ready = ref(false), loading = ref(false), error = ref(''), copyMessage = ref('');
const catalogue = ref([]), matches = ref([]), limit = ref(24), text = ref(''), selected = ref(null), mode = ref('binary');
const identity = ref(null), result = ref(null), busy = ref(false), endToEndMs = ref(0);
let worker, sequence = 0, requestVersion = 0, textVersion = 0, disposed = false;
const pending = new Map();
const base = () => new URL(import.meta.env.BASE_URL, location.origin).href;
const visible = computed(() => matches.value.slice(0, limit.value).map(id => catalogue.value[id]));
const current = computed(() => selected.value === null ? null : catalogue.value[selected.value]);
const neighbors = computed(() => (result.value?.rows ?? []).map(row => ({ ...catalogue.value[row.id], distance: row.distance })));
const diagnostics = computed(() => result.value ? { ...result.value, endToEndMs: endToEndMs.value } : null);
function call(type, args = {}) {
  return new Promise((resolve, reject) => {
    const id = ++sequence; pending.set(id, { resolve, reject }); worker.postMessage({ id, type, args });
  });
}
async function disposeSession() {
  const previous = worker;
  if (!previous) return;
  try { await call('close'); } catch { /* The failed Worker already released its connection. */ }
  previous.terminate(); if (worker === previous) worker = undefined;
}
async function start() {
  loading.value = true; error.value = ''; ready.value = false;
  await disposeSession(); if (disposed) return;
  worker = new Worker(new URL('./demo-worker.mjs', import.meta.url), { type: 'module' });
  worker.onmessage = ({ data }) => {
    const promise = pending.get(data.id); if (!promise) return;
    pending.delete(data.id); data.error ? promise.reject(Error(data.error)) : promise.resolve(data.result);
  };
  worker.onerror = event => {
    for (const p of pending.values()) p.reject(Error(event.message || 'Worker failed'));
    pending.clear(); worker?.terminate(); worker = undefined;
  };
  try {
    const value = await call('init', { base: base() }); if (disposed) return;
    identity.value = value; catalogue.value = value.catalogue; matches.value = value.catalogue.map(row => row.id);
    mode.value = 'binary'; ready.value = true; await choose(0);
  } catch (e) { if (!disposed) error.value = e.message; }
  finally { loading.value = false; }
}
async function filter() {
  const version = ++textVersion; limit.value = 24;
  try { const ids = await call('text', { text: text.value }); if (version === textVersion && !disposed) matches.value = ids; }
  catch (e) { if (!disposed) error.value = e.message; }
}
async function choose(id, nextMode = mode.value) {
  selected.value = id; mode.value = nextMode; copyMessage.value = ''; error.value = ''; result.value = null;
  const version = ++requestVersion, start = performance.now(); busy.value = true;
  try {
    const value = await call('neighbors', { id, mode: nextMode });
    if (version === requestVersion && !disposed) { result.value = value; endToEndMs.value = +(performance.now() - start).toFixed(3); }
  } catch (e) { if (version === requestVersion && !disposed) error.value = e.message; }
  finally { if (version === requestVersion) busy.value = false; }
}
async function copy() {
  try { await navigator.clipboard.writeText(current.value.emoji); copyMessage.value = 'Copied'; }
  catch { copyMessage.value = 'Could not copy. Select and copy the emoji manually.'; }
}
onMounted(start);
onBeforeUnmount(() => { disposed = true; requestVersion++; textVersion++; void disposeSession(); });
</script>

<template>
  <section class="emoji-demo" :data-demo-ready="ready" :aria-busy="loading">
    <p class="demo-intro">Explore 1,661 emoji embeddings with SQLite and sqlite-vec, running locally in your browser. Find an emoji by its English description, then follow its nearest vector neighbors.</p>
    <p v-if="loading" role="status">Loading SQLite, emoji descriptions and binary vectors…</p>
    <div v-if="error" class="demo-error" role="alert">
      <p>{{ error }}</p>
      <button v-if="!ready" @click="start">Retry initialization</button>
      <template v-else>
        <button @click="choose(selected)">Retry search</button>
        <button v-if="mode === 'float32'" @click="choose(selected, 'binary')">Continue in binary</button>
      </template>
    </div>
    <template v-if="ready">
      <div class="demo-controls">
        <label for="emoji-search">Find an emoji <span class="demo-muted">· English words</span></label>
        <input id="emoji-search" v-model="text" type="search" placeholder="Try heart, cat, music…" @input="filter">
        <p class="demo-muted" role="status">{{ matches.length }} matching emojis · {{ catalogue.length }} in the corpus</p>
      </div>
      <div class="emoji-grid" aria-label="Matching emojis">
        <button v-for="row in visible" :key="row.id" :data-emoji-id="row.id" :aria-label="row.label" :title="row.words.join(', ')" :aria-pressed="selected === row.id" @click="choose(row.id)">{{ row.emoji }}</button>
      </div>
      <p v-if="!matches.length">No matching emojis. Try another English word.</p>
      <button v-if="matches.length > limit" class="demo-more" @click="limit += 24">Show more ({{ matches.length - limit }} remaining)</button>
      <div v-if="current" class="demo-exploration">
        <div class="demo-selected">
          <span class="demo-large" aria-hidden="true">{{ current.emoji }}</span>
          <div><h2>{{ current.label }}</h2><p class="demo-muted">{{ current.words.join(' · ') }}</p>
          <button @click="copy">Copy emoji</button> <span role="status">{{ copyMessage }}</span></div>
        </div>
        <fieldset class="demo-modes"><legend>Vector representation</legend>
          <label><input type="radio" name="representation" value="binary" :checked="mode === 'binary'" @change="choose(selected, 'binary')"> Binary <small>Compact · 38 bytes / emoji</small></label>
          <label><input type="radio" name="representation" value="float32" :checked="mode === 'float32'" @change="choose(selected, 'float32')"> Float32 <small>Original values · 1,200 bytes / emoji</small></label>
        </fieldset>
        <p class="demo-muted">Binary uses about 1/32 of the Float32 vector data. Switch to Float32 to compare neighbors using the original values; it downloads on first use. This size comparison covers vectors only.</p>
        <h3>Nearest neighbors</h3>
        <p v-if="busy" role="status">{{ mode === 'float32' ? 'Loading or searching Float32 vectors…' : 'Searching binary vectors…' }}</p>
        <div class="neighbor-grid" aria-label="Vector neighbors">
          <button v-for="row in neighbors" :key="row.id" :data-emoji-id="row.id" @click="choose(row.id)"><span aria-hidden="true">{{ row.emoji }}</span><span>{{ row.label }}</span></button>
        </div>
        <details class="demo-technical"><summary>Under the hood · how this search works</summary>
          <p>Your text finds an emoji by its description. SQLite then uses that emoji’s existing vector to find six neighbors with sqlite-vec. No embedding model, remote search service or API key is needed.</p>
          <template v-if="result">
            <dl class="demo-facts">
              <div><dt>Representation</dt><dd>{{ result.mode === 'binary' ? 'Binary · 300 sign bits + 4 zero padding bits' : 'Float32 · 300 original components' }}</dd></div>
              <div><dt>Distance</dt><dd>{{ result.metric }} · smaller is closer</dd></div>
              <div><dt>SQL query</dt><dd>{{ result.queryMs }} ms in the Worker</dd></div>
              <div><dt>End to end</dt><dd>{{ endToEndMs }} ms, including messaging and any first-use loading</dd></div>
            </dl>
            <h4>These six neighbors</h4>
            <table class="demo-distances"><thead><tr><th scope="col">Emoji</th><th scope="col">Description</th><th scope="col">{{ result.metric }} distance</th></tr></thead>
              <tbody><tr v-for="row in neighbors" :key="row.id"><td>{{ row.emoji }}</td><td>{{ row.label }}</td><td>{{ result.mode === 'binary' ? row.distance : row.distance.toFixed(6) }}</td></tr></tbody>
            </table>
            <p class="demo-muted">Hamming counts differing bits; cosine compares the direction of the original vectors. Their distances use different scales, and equally distant neighbors have no special relevance order.</p>
            <h4>SQL executed</h4>
            <pre class="demo-sql">{{ result.sql }}</pre>
            <p class="demo-muted">Bound vector: {{ result.parameters.join('; ') }}. Seven candidates are requested so the selected emoji can be removed before showing six neighbors.</p>
          </template>
          <p class="demo-identity">Running <a :href="identity.runtime.releaseUrl">sqlite-vector-wasm {{ identity.runtime.version }}</a> · SQLite {{ identity.versions.sqlite }} · sqlite-vec {{ identity.versions.sqliteVec }}</p>
          <p class="demo-muted">The database stays in memory and closes when you leave Demo. Emoji glyphs use your system’s fonts.</p>
          <details class="demo-raw"><summary>Raw diagnostics · loading, database size and results</summary>
            <pre v-if="diagnostics" class="demo-diagnostics">{{ JSON.stringify(diagnostics, null, 2) }}</pre>
            <p>Query time covers SQLite execution in the Worker. End-to-end time also includes messaging and first-use loading. SQLite bytes are database page volume, not total browser or WASM memory.</p>
          </details>
        </details>
      </div>
      <p class="demo-attribution">{{ identity.corpus.credit }}. <a :href="'https://github.com/uclnlp/emoji2vec/tree/' + identity.corpus.revision">Source revision</a> · <a :href="base() + 'demo-data/LICENSE.txt'">MIT license</a>.<br> An older, English-only corpus; recent emojis are not included.</p>
    </template>
  </section>
</template>

<style scoped>
.emoji-demo { color: var(--vp-c-text-1); }
.demo-intro { font-size: 1.1rem; max-width: 46rem; }
.demo-muted, .demo-attribution { color: var(--vp-c-text-2); font-size: .9rem; }
.demo-controls { margin: 1.5rem 0 .7rem; }
.demo-controls label { display: block; font-weight: 600; margin-bottom: .5rem; }
#emoji-search { display: block; box-sizing: border-box; width: 100%; border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: .7rem .9rem; background: var(--vp-c-bg-soft); color: inherit; font: inherit; }
.emoji-demo button { border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: .4rem .7rem; background: var(--vp-c-bg-soft); color: inherit; cursor: pointer; }
.emoji-demo button:hover { border-color: var(--vp-c-brand-1); background: var(--vp-c-bg-alt); }
.emoji-demo :focus-visible { outline: 3px solid var(--vp-c-brand-1); outline-offset: 3px; }
.emoji-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(48px, 1fr)); gap: 6px; }
.emoji-grid button { min-height: 48px; padding: 4px; font-size: 1.7rem; }
.emoji-grid button[aria-pressed="true"] { border: 2px solid var(--vp-c-brand-1); background: var(--vp-c-brand-soft); }
.demo-more { margin-top: .7rem; }
.demo-exploration { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--vp-c-divider); }
.demo-selected { display: flex; gap: 1rem; align-items: center; overflow-wrap: anywhere; }
.demo-selected h2 { margin: 0; border: 0; padding: 0; }
.demo-large { font-size: 4rem; flex: 0 0 auto; }
.demo-modes { display: flex; flex-wrap: wrap; gap: .7rem; border: 0; padding: 0; margin: 1rem 0; }
.demo-modes legend { font-weight: 600; margin-bottom: .5rem; }
.demo-modes label { padding: .6rem .8rem; border: 1px solid var(--vp-c-divider); border-radius: 8px; cursor: pointer; }
.demo-modes small { color: var(--vp-c-text-2); }
.demo-modes input { appearance: auto; margin-right: .3rem; }
.neighbor-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .6rem; }
.neighbor-grid button { display: flex; align-items: center; flex-direction: column; gap: .5rem; min-height: 100px; overflow-wrap: anywhere; font-size: .9rem; }
.neighbor-grid button > span:first-child { font-size: 2.1rem; }
.demo-technical { margin: 1.5rem 0; padding: .8rem 1rem; border: 1px solid var(--vp-c-divider); border-radius: 8px; }
.demo-technical summary { cursor: pointer; font-weight: 600; }
.demo-facts { display: grid; gap: .6rem; margin: 1rem 0; }
.demo-facts > div { display: grid; grid-template-columns: 8rem minmax(0, 1fr); gap: .6rem; }
.demo-facts dt { font-weight: 600; }
.demo-facts dd { margin: 0; overflow-wrap: anywhere; }
.demo-distances { display: table; width: 100%; table-layout: fixed; font-size: .85rem; }
.demo-distances th, .demo-distances td { overflow-wrap: anywhere; padding: .4rem; }
.demo-distances th:first-child { width: 18%; }
.demo-sql { white-space: pre; overflow-x: auto; padding: .8rem; background: var(--vp-c-bg-soft); font-size: .8rem; }
.demo-raw { margin-top: 1rem; }
.demo-diagnostics { white-space: pre; overflow-x: auto; font-size: .8rem; padding: .8rem; background: var(--vp-c-bg-soft); max-height: 32rem; }
.demo-identity { font-size: .85rem; margin-top: 2rem; }
.demo-error { border-left: 3px solid var(--vp-c-danger-1); padding: .4rem 1rem; margin: 1rem 0; }
.demo-error button + button { margin-left: .5rem; }
@media (max-width: 480px) { .neighbor-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .demo-selected { align-items: flex-start; } .demo-facts > div { grid-template-columns: 1fr; gap: .1rem; } .demo-large { font-size: 3rem; } }
</style>
