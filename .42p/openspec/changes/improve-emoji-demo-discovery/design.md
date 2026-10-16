# Design

## Context

See [proposal.md](proposal.md) for motivation, approved scope and source identities. The merged base has a complete demo in `site/demo/EmojiDemo.vue` and `demo-worker.mjs`, published-runtime/data locks, independent scalar reference and existing local/Pages exercises. No new demo architecture is needed. The delta refines two existing requirement blocks; the six others and every retained scenario remain binding through [coverage.md](coverage.md).

Observed implementation: `start()` populates the full catalogue then calls `choose(0)`; the Worker's text branch executes escaped `%query%` SQL over lowercased joined descriptions. `tools/site/demo-check.mjs` assumes initial ID zero on entry, retry and re-entry, and uses four fixed reference IDs for real vector checks. `EmojiDemo.vue` renders the matching grid before the exploration, uses local VitePress variables/native controls, and already has actual-operation and raw-diagnostics disclosure panels. The latter must stay usable when their placement changes. Site has an existing qualified harness and Pages observer, so this work extends those checks rather than introducing a second runner.

## Goals / Non-Goals

**Goals:** deterministic, small text matching over the existing in-memory SQLite catalogue; an explicit Unicode starting identity; local visual grouping that makes the selected emoji and results prominent; full-unit regression evidence.

**Non-Goals:** FTS5, stemming, fuzzy matching, arbitrary internal-substring matching, relevance ranking, another corpus, a new UI framework, global theme/navigation work, new runtime selection, database persistence or a generic search service. Preserve scalar vector-reference independence and publication boundaries.

## Decisions

### 1. Use bounded word-prefix SQL matching across all descriptions

Use a small pure text-policy helper local to the demo, imported by the Worker and tested offline. Lowercase and tokenize runs of Unicode letters/numbers; spaces and punctuation separate words. Apply the same tokenization to every entry in the catalogue’s `words` array, not just `label` (which is only the first source description), and to queries. Deduplicate query terms, require each to prefix at least one description word in any order and retain stable catalogue-ID ordering. `cat` matches `cat` and `cats`, but not the interior of `indicator`; `mus` matches `music` and `musical`; `cat fac`, `fac cat` and `CAT, fac!` are equivalent. No language inference, stemming or accent-removal policy is introduced.

Insert a space-delimited normalized word set with a leading space into the existing in-memory text column. Use bound `instr(words, ?) > 0` predicates, one per distinct query term, binding a leading space followed by the term without a trailing delimiter. This enforces the beginning of a word while allowing an unfinished suffix. An equally small parameterized word-prefix equivalent is acceptable. Query evaluation remains SQLite work in the dedicated Worker; vector SQL is untouched. Distinguish empty/whitespace input (all catalogue IDs) from a nonempty input with no word tokens (no matches). `%`, `_`, backslashes, quotes and SQL-looking strings never become SQL syntax or wildcard patterns. Ordinary punctuation in a mixed query separates words rather than making the query fail.

The approved revision replaces strict whole-word matching because filtering occurs on every input event: partial typing must already find candidates. Word beginnings avoid the observed internal-substring noise without adding an index or text engine; FTS5 is unnecessary for 1,661 short entries. No internal-substring fallback is added, and prefix matching remains lexical rather than semantic or morphological. Fixed fixtures must give literal expected memberships instead of deriving expectations with the production tokenizer.

### 2. Resolve the approved initial emoji by Unicode identity

Find exactly one catalogue row whose `emoji` is `🐱` (U+1F431), then pass its existing ID to `choose` in binary mode. The pinned prepared catalogue currently identifies this row as ID 773, label `kitty`, with `kitty`, `kitten` and `cat face` descriptions; that observation is not the implementation contract. Do not hard-code 773, choose the first search result, or reorder the corpus. The empty search field and full catalogue remain available; the initial selection does not impose a `cat` filter.

Reset the query, batch limit and match list consistently on a fresh successful initialization/retry. Entry, retry and re-entry share the same initialization policy. If the designated emoji is absent or duplicated, report an initialization error with the existing retry path rather than silently selecting another row. Mode changes and neighbor clicks retain their existing behavior. A small policy fixture with a reordered catalogue proves position independence; the real browser proves the pinned corpus actually provides the designated row and six real vector results.

### 3. Refine the local layout without increasing the visitor's workload

Keep native controls and the existing theme variables/page-local styles. Give textual discovery and vector exploration explicit visual groups. Place the selected emoji, Copy, mode controls and six-neighbor result together; keep the mode selector adjacent to the result it affects. Ensure the batch of matching emojis does not bury the selected result on narrow screens. Use normal document flow and headings; avoid a CSS-only visual reordering that conflicts with keyboard reading order. Preserve the small batch/Show more behavior so every text match remains reachable.

Use brief English copy consistent with the site's existing language: description words find an emoji, then its precomputed vector finds neighbors. Keep the binary-versus-Float32 explanation short and qualify the vector-size comparison. Leave distances, executed SQL, bound-vector description and actual timings inside a default-closed technical panel; raw diagnostics remain a second closed disclosure. Keep a compact runtime/release identity and corpus credit/license discoverable without requiring the visitor to read raw JSON. No fabricated similarity percentages, progress, latency promise or semantic-quality claim is introduced.

Exact spacing and grouping are Apply choices within these constraints. Review desktop/mobile screenshots and keyboard traversal, not only DOM selectors or the absence of overflow. This is local composition of existing controls, not a global site redesign.

### 4. Extend actual-operation checks and retain the full baseline

Add offline fixtures for case, word beginnings (`cat` matching `cat`/`cats` but not `indicator`, `mus` matching `music`/`musical`), matching descriptions whose displayed title does not match, multiword AND/order, repeated words, separators, empty/whitespace input, punctuation-only input and injection-like text, plus explicit default-identity lookup. Check exact memberships, not an incidental count of `cat` results from the old corpus.

In `tools/site/demo-check.mjs`, resolve the expected initial ID independently from the fetched catalogue's literal 🐱 value, assert its visible selection and first six binary results, and include that query in the independent Python reference comparison. Retain the existing fixed-ID queries and real Hamming boundary-tie exercise. Replace only the entry/retry/re-entry assumptions about ID zero; ID zero can remain an ordinary oracle query. Observe the empty search/all-match state and absence of Float32 requests before first mode selection. Verify real text results against literal expected cases, not merely the presence of a search control. Add word-prefix cases using the running SQLite Worker so a helper-only test cannot mask incorrect SQL integration.

Keep current stable/preview-prefix, desktop/mobile, copy success/failure, initial/optional-load failure, retry, selection races, mode preservation, one-time Float32 loading, disposal and non-demo no-load checks. Preserve published runtime inventory/composition and corpus validation, exact Hamming and cosine tolerance `2e-6`, accepting valid boundary ties. Extend the same Pages observer through its existing shared checker; record candidate/runtime/corpus identities and distinguish local from hosted results. Missing hosted prerequisites remain incomplete. Shared repository/agent authorship and shared corpus inputs remain evidence limitations; the reference must not reuse the production matching or vector-calculation logic as its expectation.

Measure/report the existing stage durations and SQLite page volume where those checks already do so. Do not turn old size estimates into thresholds or total-WASM-memory claims. Full-unit coverage means inspecting retained behavior and executing suitable regressions, not copying the old Change's passing verdict.

## Risks / Trade-offs

- Word-prefix matching intentionally permits suffixes such as `cats` → keep the search hint truthful, check incremental/multiple-term cases and word boundaries, and avoid an internal-substring fallback or a semantic-relevance promise.
- Default identity and old browser assertions disagree → update entry, retry and re-entry together and independently locate 🐱 in the real corpus.
- Layout changes obscure provenance, diagnostics or keyboard flow → retain accessible labels/focus, disclosure states and source/license links; review both screenshots and actual keyboard traversal.
- Policy tests and UI share a helper → use literal expected fixtures and real SQLite/browser observations, retaining the separate scalar vector reference.
- External badges, fonts and system glyphs vary → qualify environmental observations; retain English accessible descriptions and avoid image assets or visual identity assumptions for glyph rendering.

## Migration Plan

Apply changes the local Worker text policy, initialization, component layout/copy and existing checks. It retains `tools/site/demo-runtime.json` (currently 0.2.0), `demo-data.json`, all original source/vector bytes, shell deployment and the independent Usage example pin. Update only applicable demo contributor guidance in `docs/site.md`.

Run the commands in tasks, then use the existing PR preview/Pages observation before post-Apply 42P Verification. Only after satisfactory Verification may native synchronization/archive occur. Rollback restores the reviewed demo sources through the same PR/deployment path without rebuilding or publishing the package. There is no stored-data migration and no unresolved material planning question.
