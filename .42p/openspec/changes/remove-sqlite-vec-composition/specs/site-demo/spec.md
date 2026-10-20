## MODIFIED Requirements

### Requirement: Explicit published stable runtime

The demo SHALL consume unchanged SQLite/SQLite-Vector JS/WASM from an actually published stable distribution corresponding to `latest`, selected on initial preparation or explicit demo refresh. Ordinary site rebuilds SHALL retain that selection. The demo SHALL NOT rebuild the engine or select experimental `next` publications.

#### Scenario: Prepare or refresh the demo
- **WHEN** initial demo preparation or an explicit runtime refresh occurs
- **THEN** preparation resolves the latest actually published stable SQLite-Vector distribution, records its exact publication/archive identity and integrity metadata, and supplies the verified published runtime assets to the shell

#### Scenario: Rebuild without refresh
- **WHEN** documentation or the site is rebuilt with an unchanged demo selection after a newer release exists
- **THEN** the same selected release and runtime bytes are used without floating discovery, including separate stable and preview constructions

#### Scenario: Invalid published dependency
- **WHEN** a selected archive or required companion is unavailable, inconsistent, corrupted or not an eligible stable publication
- **THEN** preparation fails instead of rebuilding the engine, substituting another release or retaining stale generated output

### Requirement: Visible runtime identity

The demo SHALL display its selected sqlite-vector-wasm version and release link, plus SQLite and SQLite-Vector identity and versions read from the running connection. Runtime/data/UI artifacts SHALL remain site concerns without extending the distributed package API or creating another canonical runtime distribution.

#### Scenario: Inspect the loaded runtime
- **WHEN** initialization succeeds
- **THEN** the visible product version and release link identify the selection, and `sqlite_version()` and `vector_version()` observations agree with that publication's composition

### Requirement: Textual discovery and vector exploration

The demo SHALL offer text search over English names and associated words, a matching emoji grid, six vector neighbors excluding the selected emoji, clickable neighbors, an emoji-copy control and Binary/Float32 selection. Data SHALL be imported into SQLite and neighbor searches SHALL actually execute through SQLite-Vector native SQL using the selected emoji's existing embedding, without free-text embedding inference or an external embedding service. Text discovery SHALL match each query term at the beginning of a word across all descriptions and associated words without case sensitivity, require every term regardless of order and preserve the complete catalogue for an empty query. A new demo session SHALL explicitly select 🐱 and show its six binary-mode vector neighbors after initialization.

#### Scenario: Find a starting emoji
- **WHEN** a visitor enters a name or associated word
- **THEN** the grid shows matching emojis, or an explicit empty result, and selecting one searches its precomputed vector rather than vectorizing the entered text

#### Scenario: Follow and copy an emoji
- **WHEN** a visitor selects an emoji or clicks a displayed neighbor
- **THEN** it becomes the current selection with six distinct nearest other emojis for the current mode, and Copy copies the selected Unicode emoji with truthful success or failure feedback

#### Scenario: Equal distances
- **WHEN** candidates have equal distance, including at the sixth-neighbor boundary
- **THEN** any valid six-neighbor result respecting closer distances is acceptable, without a special relevance order among ties

#### Scenario: Match word beginnings rather than internal substrings
- **WHEN** a visitor searches for `cat` or `CAT`
- **THEN** descriptions or associated words beginning with `cat`, including `cat` and `cats`, match equally regardless of case, 🐱 is included, and `indicator` alone does not match because its occurrence is internal to the word

#### Scenario: Discover while typing across descriptions
- **WHEN** a visitor enters `mus` before completing `music`
- **THEN** emojis with `music` or `musical` among any of their descriptions or associated words are discoverable even if their displayed title does not match, while an internal substring such as `sic` does not match `music` alone

#### Scenario: Combine words and separators
- **WHEN** a visitor searches for `cat fac`, `fac cat` or `  CAT, fac!  `
- **THEN** the same emojis containing word beginnings for both terms across their descriptions match regardless of term order, repetition or case, with spaces and punctuation separating query terms

#### Scenario: Empty and literal special-character queries
- **WHEN** a visitor submits an empty or whitespace-only query, an unknown word, or a nonempty query consisting only of punctuation such as `%`, `_` or a backslash
- **THEN** an empty or whitespace-only query exposes the complete catalogue with all matches reachable, an unknown or punctuation-only query shows an explicit empty result, and no input acts as a SQL wildcard or executable SQL

#### Scenario: Explicit cat starting point
- **WHEN** initialization, successful initialization retry or re-entry into Demo completes
- **THEN** 🐱 is selected by its Unicode identity rather than its corpus position, the search field is empty, all corpus entries remain reachable, and six real binary-mode vector neighbors of 🐱 are displayed without downloading Float32

### Requirement: Scoped real-runtime demo checks

Demo checks SHALL exercise the published WASM, automatic SQLite-Vector availability, insertions and a few searches in each mode against distances calculated independently of SQLite-Vector. They SHALL cover UI/loading and identified Pages integration, complementing shell/docs checks and distribution acceptance. Missing browser or deployment prerequisites SHALL NOT count as success.

#### Scenario: Compare searches with a reference
- **WHEN** real-browser checks exercise selected emojis in both modes
- **THEN** returned distances and nearest-neighbor membership agree with an independent Hamming/cosine reference, using a documented Float32 tolerance and accepting any equally close boundary neighbors without requiring an identical tie order

#### Scenario: Observe loading and the deployed demo
- **WHEN** the candidate is checked locally and on its identified GitHub Pages preview
- **THEN** checks observe unchanged published runtime loading, binary-first/deferred-Float32 requests, actual interactions and diagnostics at stable/preview prefixes and mobile/desktop widths, with commit/release/corpus identities and observed outcomes recorded

#### Scenario: Bound the evidence
- **WHEN** checks or measurements are reported
- **THEN** local and Pages results are distinguished, absent prerequisites remain incomplete, and results do not claim OPFS, persistence, complete package acceptance, semantic quality or an unmeasured performance guarantee

## ADDED Requirements

### Requirement: Qualified published-engine transition

The cleanup SHALL replace the historical demo pin only through an explicit refresh and qualification on real published stable SQLite-Vector bytes. Source adaptation or candidate example success SHALL NOT establish that qualification. Until the dependency exists, cleanup completion SHALL remain blocked without relabeling, disabling or rebuilding the demo.

#### Scenario: Published Vector archive is not available
- **WHEN** no eligible actually published stable Vector archive can be identified
- **THEN** the old pin remains truthful pending explicit refresh, no runtime is presented as Vector, and the cleanup cannot be declared complete; Vector product publication does not depend on that demo refresh

#### Scenario: Qualify the replacement runtime
- **WHEN** an explicit refresh selects a real published stable Vector archive
- **THEN** unchanged published bytes, source/release/archive digests and observed native identities are checked, and the existing complete corpus, mode, interaction, session and independent Hamming/cosine checks are renewed before the old demo engine path is removed
