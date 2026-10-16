# Tasks

## 1. Pinned corpus and published-runtime preparation

- [x] 1.1 Implement the pinned emoji2vec source record and reproducible parser/preparer, including exact source digests, 1,661 stable IDs, complete descriptions, original 300-component Float32 vectors, sign-packed bit[304] data, manifest and notices; verify deterministic output and reject malformed dimensions, non-finite values, ambiguous Unicode mappings and digest/coverage mismatches in offline fixtures.
- [x] 1.2 Implement demo-specific initial/explicit-refresh stable selection and exact pinned archive acquisition using existing bounded extraction/integrity patterns, preserving all runtime companions and notices; verify initial latest selection, exclusion of next, pinned reacquisition, archive/member/hash rejection and stale-output cleanup with fixture tests.
- [x] 1.3 Document corpus provenance, generated-input locations and preparation/refresh commands in docs/site.md; verify the documented preparation works from empty ignored work state and emits a shell-compatible runtime inventory plus separately attributed data without compiling the engine or changing the Usage selection.

## 2. Worker session and actual SQLite searches

- [x] 2.1 Add the demo-local Worker with base-aware unchanged-loader initialization, in-memory connection, transactional catalogue/binary insertion and bound text/vec0 searches; verify with the real published runtime that vec_version is available without registration, all 1,661 IDs load, text discovery works and six distinct non-self neighbors return through sqlite-vec.
- [x] 2.2 Add first-use Float32 acquisition/insertion with explicit cosine configuration, single-session reuse, rollback/retry and preserved selection; verify network requests and database rows prove Float32 is absent initially and loaded once successfully, with binary exploration surviving an injected optional-load failure.
- [x] 2.3 Add request/session correlation and explicit connection-close/Worker-disposal handling; verify rapid selection/mode changes never replace current results with stale responses and navigating away/back closes the old session and starts a fresh one.
- [x] 2.4 Document page-only startup, memory lifetime and the actual SQL/loading path in docs/site.md; verify the documented browser exercise initializes no demo engine/data from Presentation or Usage and needs neither OPFS nor authentication.

## 3. Small usable explorer and actual-operation inspection

- [x] 3.1 Replace the Demo placeholder with the local Vue explorer, native text/grid/selection/neighbor/copy/mode controls and theme-based responsive CSS; verify searching, empty results, six-neighbor navigation, literal emoji copying, complete reachability of matches, keyboard/focus and mobile layout in browser checks with screenshots.
- [x] 3.2 Add loading, retry, optional-mode error and copy-result states; verify initial failure/retry and optional failure report the real outcome without fabricated results, wrong mode labels or stale selections.
- [x] 3.3 Add the collapsible actual-operation panel, observed SQLite/sqlite-vec versions, product/release identity, distances, real SQL/parameter summaries and measured query time; verify these correspond to the latest executed operation and distinguish Hamming/cosine and query/end-to-end timings without a common similarity percentage.
- [x] 3.4 Add concise visitor explanations and source/license access for original-vs-sign vectors, textual starting point, English/old corpus and local execution; verify visible wording and working attribution/release links without leaking repository workflow details into the interaction.

## 4. Independent reference and integrated site checks

- [x] 4.1 Implement a small independent Hamming/cosine reference over pinned originals, including independent sign conversion, justified cosine tolerance and tie-tolerant six-neighbor assertions; verify a tiny known tie example and a few real-corpus queries in each mode, including a real Hamming boundary tie, against actual browser results without requiring identical tie order.
- [x] 4.2 Integrate exact-pinned demo preparation into the existing clean site build and independent stable/preview construction, extend Site workflow browser/hosted observations and evidence retention, and register applicable offline tests; verify current shell/docs/Usage-example checks still pass and documentation-only rebuilding preserves the real demo runtime selection and emitted hashes even when a newer release exists.
- [x] 4.3 Run integrated real-browser checks at stable/preview prefixes and desktop/mobile widths, recording actual payload sizes, load/insertion/search timings and SQLite page volume before/after Float32; verify lazy requests, interactions, lifecycle, unchanged runtime bytes and the independent query comparisons, with environment/cache conditions and measurement limits recorded.
- [x] 4.4 Observe the exact candidate on the existing GitHub Pages preview, checking release/corpus identity, actual searches, assets/navigation and mobile behavior; retain accessible run-linked results and screenshots, distinguish local evidence and leave unavailable hosted checks incomplete.
- [x] 4.5 Re-examine the full A-site_demo correspondence and run sh tools/check-repository.sh, sh tools/test-repository.sh, applicable site/browser commands and strict OpenSpec validation; verify recorded outcomes apply to the final candidate and summarize Apply evidence and unresolved limits without claiming post-Apply Verification, package acceptance or integration authority.
