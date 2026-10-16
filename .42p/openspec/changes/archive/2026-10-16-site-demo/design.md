# Design

## Context

See [proposal.md](proposal.md) for motivation and allocation identity. The repository currently has VitePress 1.6.4, a Demo placeholder, a standard theme and a prepared-directory overlay. `tools/site/prepare.mjs` accepts `demo-runtime.json`, a SHA-256 sidecar and unchanged files below `public/demo-runtime/`; it copies them without rebundling and checks emitted hashes. `tools/site/example.mjs` already acquires and verifies an exact published archive for Usage, whose selection stays independent. The Site workflow independently builds main and the candidate before assembly, then observes identified Pages content. These are observed integration points, not evidence that the future demo works.

Design is necessary because the change combines published-asset acquisition, prepared data, browser execution and loading/lifecycle behavior. Existing site-shell and site-docs requirements are consumed unchanged.

## Goals / Non-Goals

**Goals:** small independently reproducible data preparation; unchanged published runtime assets; responsive exploration with observable real operations; simple independent vector checks. Keep release selection, data preparation and browser session lifetimes separate.

**Non-Goals:** a generic playground, arbitrary SQL editor, model inference, 2D embedding map, new component library, persistence, a second publisher or special runtime support in the distributed package. No latency threshold or relevance-quality criterion is introduced.

## Decisions

### 1. Freeze source identities and prepare once per data revision

Use `uclnlp/emoji2vec` revision `3f91c339df13b2a511d9e3a9f73efa7b61c54707`, observed upstream HEAD during exploration. Read `pre-trained/emoji2vec.bin`, `data/raw_training_data/emoji_joined.txt` and `LICENSE`. The upstream `.bin` is word2vec binary containing Float32 values, not sign-quantized data. A repository-authored preparation command extracts all vectors and groups descriptions per emoji without training or gensim/TensorFlow. Validate 1,661 unique vector keys, 300 finite components each, description coverage and stable identity mapping; handle Unicode variation-selector representation explicitly and reject ambiguous/unmatched mappings rather than silently reducing the corpus. Preserve original Unicode sequences and textual descriptions; the first source description can supply a display label without claiming a canonical Unicode name.

Track a small source lock/provenance record and transformation code under `tools/site/`; acquire source bytes and generate outputs in ignored `.work/` under the technical canon. This is a frozen data snapshot, not an actively maintained fork: a complete upstream GitHub fork is unnecessary. Builds may reproduce outputs from the same pin; they never retrain or follow upstream HEAD. Capture exact source SHA-256 values during Apply acquisition before relying on them; no unobserved digest is asserted here.

Emit a catalogue JSON, packed binary vectors (38 bytes per emoji) and little-endian Float32 vectors (1,200 bytes per emoji), plus a manifest of dimensions/counts/order/digests and an accessible verbatim MIT notice. Fixed IDs follow the vector-file record order. For component x use bit 1 when x > 0, otherwise 0; pack low bit first within each byte and leave the four unused high bits of the last byte zero. The same IDs and order govern both files. Do not normalize or otherwise alter original Float32 vectors. Preserve emoji2vec/UCL credit and the README's Unicode/iemoji.com description provenance. Load no image collection.

For 1,661 records, raw vector payloads are 63,118 and 1,993,200 bytes respectively; catalogue, manifest, runtime, SQLite overhead and HTTP compression are separate. These are arithmetic sizes, not measured transfer or memory results. A prebuilt SQLite database is unnecessary and would add a derived database artifact to maintain; runtime insertion demonstrates real feeding of the published engine.

### 2. Separate explicit stable selection from exact acquisition

Add a demo-specific runtime selection record. Initial preparation or an explicit refresh resolves the actually published stable distribution corresponding to npm `latest`, verifies consistency with its `dist/vX.Y.Z` release and publication record, and records exact identities/digests. Exploration observed 0.2.0 (SQLite 3.54.0 / sqlite-vec 0.1.9); Apply resolves the current eligible release rather than treating that observation as a permanent latest claim. `next` is excluded.

Ordinary builds acquire only the pinned publication/archive, checking publication/archive identities, archive size/digest and declared regular members, then per-file sizes/hashes. Reuse the bounded extraction/integrity pattern in `example.mjs` and `runtimeNames` without coupling the demo to `docs-example.json` or changing the guide version. Keep all eleven runtime companions together and retain distribution notices/licenses in the prepared site. Fail closed and clear stale output on missing or mismatched input. Supply the existing shell's runtime selection, sidecar and public-asset envelope; data have their own manifest rather than being mislabeled runtime files.

A documentation deployment can reacquire the exact archive but never resolve latest. Main and preview prepare from their own tracked selections. Browser requests use the current site base (including `/preview/`), not fixed domain-root paths. Runtime files bypass Vite transformations; only site-authored UI/Worker code is bundled. No browser download from a release URL or CDN is needed: verified assets are served with the site.

### 3. Own the in-memory connection in one page-local Worker

A local Vue component is imported by `site/demo/index.md`; browser initialization starts on mount, not in the global theme or server rendering. Create a dedicated module Worker that dynamically imports the published `sqlite3.mjs` from the base-aware public runtime URL and initializes SQLite's existing OO API. This avoids a new package wrapper and keeps parsing/insertion/search off the UI thread. A custom site Worker is preferable to many Worker1 per-row messages because it owns bulk insertion and the whole connection lifecycle in one place.

The Worker fetches catalogue and binary bytes, validates their manifest, creates a normal emoji text table and a `vec0` bit[304] table in `:memory:`, and inserts all rows within a transaction using bound prepared statements. Float32 selection lazily fetches and validates the float payload, creates a separate `vec0` float[300] table configured for cosine distance, and inserts it once within a transaction. No default L2 assumption is allowed. A failed optional transaction rolls back and remains retryable without destroying the working binary mode.

Use simple parameterized SQL substring matching of normalized English descriptions/keywords; escape LIKE wildcards so user input is literal. FTS5 adds no necessary behavior for this corpus. Text search chooses a row; it never embeds text.

Neighbor search uses the selected table/vector with sqlite-vec, requesting seven nearest candidates, removing the selected ID if present and displaying six. Seven suffices even when the selected row participates in zero-distance ties; no extra tie sorting or relevance ranking is needed. Both modes use the same identity catalogue.

Serialize database work and tag responses with request/session identities, applying only the latest requested selection/mode. Retain one successful Float32-load promise/state per session; clear a failed load for retry. On page disposal explicitly close the connection, acknowledge disposal and terminate the Worker, ignoring stale responses. Float32 remains available until that disposal; a later Demo visit starts a fresh transient session. No OPFS, IndexedDB or service worker is introduced.

### 4. Use Vue and native controls with the existing theme

Keep a small responsive page: brief explanation; labelled search field and count; matching emoji buttons; selected emoji/description and Copy; a Binary/Float32 radio-style group; six neighbor buttons; and a collapsed technical panel. Use native inputs/buttons/details and VitePress CSS variables with page-local CSS. No third-party UI kit is needed. At mobile width stack the groups and keep technical code scrollable internally; provide visible focus, accessible names, selected/loading states and truthful copy success/failure. Keep active selection visibly distinct and avoid rendering a huge unbounded result grid when filtering is broad: a small displayed batch with a simple Show more control is sufficient, with all matches reachable.

Catalogue and engine/binary requests start only when Demo mounts. VitePress may prefetch page code, so checks assert that this does not initialize SQLite or fetch demo data from Presentation/Usage. First Float32 selection has an explicit loading state; binary remains usable if it fails. Initial failure exposes Retry without fabricating results. Query identity prevents older responses from replacing a newer click or mode.

### 5. Explain actual work with a small inspection panel

Show selected distribution/release link and versions read from SQL. The collapsible panel contains the actual executed search SQL and readable bound parameters (long vectors summarized honestly), representation/dimensions/metric, result distances and Worker-measured query execution time. Show actual acquisition/initialization/insertion stages and elapsed times where available, distinguishing query execution from end-to-end time. No simulated progress percentage, fake benchmark or common similarity percentage across metrics.

Explain the text-to-emoji-to-existing-vector path and that binary mode retains signs while Float32 retains original values. A tiny sign strip is optional only if it can remain simple and correctly label the four padding bits; it is not required for completion. Keep preparation and internal repository workflow details out of the visitor flow. No 2D projection is needed.

### 6. Independently check distances without a tie-order feature

For a few fixed emoji IDs, calculate Hamming by XOR/popcount and cosine by dot products/norms in a separate reference implementation that does not call sqlite-vec or reuse runtime query-result logic. Read original pinned vectors for reference quantization as well as comparing prepared payloads, so checking only the same erroneous generated file is avoided. Record shared source identity and common repository/agent authorship as remaining dependencies; separate formulas do not prove upstream semantic quality.

Compare six distinct non-self results, each reported distance, and nearest-neighbor membership: all strictly closer candidates must be present and any boundary-distance candidates can fill remaining slots. Use exact integer Hamming and a documented, justified Float32 tolerance for cosine. Do not require identical row order among equal distances. Include a tiny fixed tie example to exercise the reference assertion and at least one real-corpus tie query; no UI tie-breaker is introduced.

Use the existing qualified browser harness for real published-WASM loading, extension availability without manual registration, insertions, both mode searches, interaction/copy, loading/error paths, deferred network requests, retry/disposal, mobile/desktop and stable/preview asset paths. Extend the existing Site workflow checks/observations and retained evidence rather than create a parallel deployment. Observe the exact identified Pages preview and its release/corpus; unavailable hosted evidence stays incomplete. Preserve existing shell/docs/Usage-example checks and runtime-preservation scenarios.

Measure actual preparation/load/insertion/search durations, payload bytes and SQLite page volume (`page_count * page_size`, clearly distinguished from total WASM/Worker memory), initially binary and then Float32. Report environment, cache conditions and measurement scope; no hard performance target or extra readiness gate is added.

## Risks / Trade-offs

- Old corpus and varying system emoji glyphs → disclose corpus age and use accessible English labels; no relevance-quality acceptance test.
- Source-description Unicode mismatches → explicit identity reconciliation with full-coverage checks, never silently omit entries.
- Hamming ties and Float32 rounding → accept valid boundary ties and document numeric tolerance; avoid UI sorting machinery.
- Worker/public loader/base-path mistakes → real browser exercises on both prefixes, emitted runtime hashes and actual Pages observation.
- Initialization or optional-mode failure → atomic insertions, honest errors, explicit retry and retention of working binary state.
- Memory/network measurements vary → report observed stages and SQLite volume, without asserting total memory or universal latency.
- Shared acquisition helpers could couple Usage and Demo → distinct tracked selections and regression checks for independent guide/runtime identity.

## Migration Plan

Apply adds preparation records/tooling, replaces only the Demo placeholder and extends existing Site build/check integration. Prepare a clean exact-pinned input directory before the shell build, using the existing overlay or a bounded internal call to that same preparation path. Stable and candidate builds keep independent pins. Document preparation, explicit refresh and checks in `docs/site.md`; no engine build/publication step is added.

Deploy through the existing PR preview path, collect the identified hosted evidence, then perform post-Apply Verification and archive under repository rules before human integration. Rollback restores the reviewed demo source and selection through the same PR path, then redeploys; it never republishes the package. This proposal performs none of those implementation or lifecycle actions.
