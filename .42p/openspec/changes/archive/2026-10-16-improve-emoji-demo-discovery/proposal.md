# Proposal

## Why

The demo currently opens on corpus row zero, a Slovenian flag unrelated to the intended introduction, and substring filtering makes `cat` match `indicator`. Improve first-use discovery and visual hierarchy while retaining the complete, actually published-runtime demonstration owned by `A-site_demo`.

## What Changes

- Match word beginnings across all English descriptions/keywords without case sensitivity (`mus` finds `music`/`musical`; `cat` finds `cat`/`cats`, but not the interior of `indicator`); require all query terms regardless of order, preserve the complete catalogue for an empty query, and treat punctuation as word separators rather than SQL wildcards.
- Explicitly select 🐱 on initialization and re-entry, resolved by its Unicode identity rather than a corpus position, and display its six real binary-mode vector neighbors.
- Make search, the selected emoji, mode comparison and neighbors a clear visual journey on desktop and mobile. Keep explanations brief, actual-operation details collapsed by default, and runtime/corpus provenance readily discoverable.
- Extend existing policy, real-browser and identified Pages checks for the new behavior, while preserving every existing `site-demo` requirement and its failure cases. Full allocation coverage includes unchanged runtime acquisition, corpus, both modes, lifetime and independent vector checks; it does not require rewriting them.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `site-demo`: refine Textual discovery and vector exploration with word-prefix matching over all descriptions and the explicit cat starting point, and Transient browser session and usable states with a clear local interaction hierarchy. All existing scenarios in those blocks and the other six baseline requirements remain binding.

## Impact

Exactly one allocation unit: `A-site_demo`, from [the current Allocation](../../../engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), SHA-256 `c607b1e9b1903249b644a8d818d176ce82918c73eac760b244bf1b7d5129c74b`, qualified by [Site Capture](../../../engineering/2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md), SHA-256 `7e520ad3573cc84fb787229bf33ee195c19bcb6deb92998d7a63d7457c61777c`. Preparation starts from merged main `0d7bbdd29bd5dee65ce809c82c5b3db74c394124` (PR #61). [coverage.md](coverage.md) maps the full unit in both directions.

The user's 2026-10-16 approval of the consolidated complete-demo plan and subsequent 🐱 choice supplies the bounded realization choices: a meaningful initial emoji and local visual hierarchy. The subsequent approved text-policy revision replaces strict whole-word matching with word-prefix matching across all descriptions/keywords, retaining all-term AND semantics and explicitly avoiding FTS5. These refine Site C-search/C-interaction/Q-realization, without revising Capture or Allocation. No public conversation permalink is available; this record identifies the decision, not independent corroboration.

Expected implementation surfaces are `site/demo/EmojiDemo.vue`, `site/demo/demo-worker.mjs`, a small local text-policy helper if needed, `tools/site/demo-check.mjs`, nearby tests and the demo section of `docs/site.md`. Existing `tools/site/demo-exercise.mjs`, Pages observation and the independent reference remain the validation path. No dependency, global theme/navigation, README/Usage content, corpus revision, selected runtime, package API or publication change is intended. The existing in-memory Worker and published assets are retained. No FTS5, fuzzy search, embeddings inference, persistence, semantic-relevance or performance threshold is added.

This PR prepares planning artifacts only. Apply, post-Apply 42P Verification and archive remain subsequent operations; no implementation or acceptance is claimed.
