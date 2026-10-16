# Site demo delta

## Purpose

Let visitors explore real emoji vector searches in the browser using an explicitly identified published sqlite-vector-wasm runtime and compare binary and Float32 representations of the same corpus.

## ADDED Requirements

### Requirement: Explicit published stable runtime

The demo SHALL consume unchanged JS/WASM from an actually published stable distribution corresponding to `latest`, selected on initial preparation or explicit demo refresh. Ordinary site rebuilds SHALL retain that selection. The demo SHALL NOT rebuild the engine or select experimental `next` publications.

#### Scenario: Prepare or refresh the demo
- **WHEN** initial demo preparation or an explicit runtime refresh occurs
- **THEN** preparation resolves the latest stable distribution, records its exact publication/archive identity and integrity metadata, and supplies the verified published runtime assets to the shell

#### Scenario: Rebuild without refresh
- **WHEN** documentation or the site is rebuilt with an unchanged demo selection after a newer release exists
- **THEN** the same selected release and runtime bytes are used without floating discovery, including separate stable and preview constructions

#### Scenario: Invalid published dependency
- **WHEN** a selected archive or required companion is unavailable, inconsistent, corrupted or not an eligible stable publication
- **THEN** preparation fails instead of rebuilding the engine, substituting another release or retaining stale generated output

### Requirement: Visible runtime identity

The demo SHALL display its selected sqlite-vector-wasm version and release link, plus SQLite and sqlite-vec versions read from the running connection. Runtime/data/UI artifacts SHALL remain site concerns without extending the distributed package API or creating another canonical runtime distribution.

#### Scenario: Inspect the loaded runtime
- **WHEN** initialization succeeds
- **THEN** the visible product version and release link identify the selection, and `sqlite_version()` and `vec_version()` observations agree with that publication's composition

### Requirement: Complete attributed emoji corpus

The demo SHALL use all 1,661 emoji2vec emojis with their original 300-component embeddings and English descriptions/associated words, frozen to an identified upstream revision. Both representations SHALL share identifiers. The prepared data SHALL preserve source credit and the MIT notice, and emojis SHALL render as system Unicode characters.

#### Scenario: Prepare both representations
- **WHEN** the pinned upstream vectors and enriched descriptions are prepared
- **THEN** every emoji has one stable identifier, searchable descriptions, 300 original Float32 components and a derived binary vector, with the revision, source files, transformation and integrity metadata recorded

#### Scenario: Inspect data attribution and limits
- **WHEN** a visitor inspects corpus information
- **THEN** emoji2vec and the source revision are credited, the MIT notice is accessible, the inherited Unicode/iemoji.com description attribution is retained, and the old corpus and English-label limits are stated without promising recent emojis or French labels

#### Scenario: Inconsistent corpus input
- **WHEN** inputs have invalid dimensions, non-finite components, duplicate vector identities or incomplete vector/description correspondence
- **THEN** preparation fails with a diagnostic rather than silently dropping emojis or mixing representations

### Requirement: Binary-first and deferred Float32 modes

The demo SHALL start in binary mode using sign-derived 304-bit vectors with four constant padding bits and Hamming distance. Float32 SHALL use the original 300-component vectors with cosine distance, loading on first selection and remaining in memory thereafter. Changing mode SHALL preserve the selected emoji and rerun its search.

#### Scenario: Enter the demo
- **WHEN** the visitor opens Demo
- **THEN** the catalogue and binary representation initialize without downloading Float32, and the four padding bits contribute nothing to Hamming distances

#### Scenario: First and subsequent Float32 selections
- **WHEN** the visitor selects Float32 for the first time and subsequently switches away and back
- **THEN** Float32 is acquired and inserted once for that session, searches use cosine distance, and later selections reuse it while preserving the selected emoji

#### Scenario: Optional mode cannot load
- **WHEN** Float32 acquisition or initialization fails
- **THEN** the UI reports the failure, does not label binary results as Float32 and permits continued binary exploration and a retry

### Requirement: Textual discovery and vector exploration

The demo SHALL offer text search over English names and associated words, a matching emoji grid, six vector neighbors excluding the selected emoji, clickable neighbors, an emoji-copy control and Binary/Float32 selection. Data SHALL be imported into SQLite and neighbor searches SHALL actually execute through sqlite-vec using the selected emoji's existing embedding, without free-text embedding inference or an external embedding service.

#### Scenario: Find a starting emoji
- **WHEN** a visitor enters a name or associated word
- **THEN** the grid shows matching emojis, or an explicit empty result, and selecting one searches its precomputed vector rather than vectorizing the entered text

#### Scenario: Follow and copy an emoji
- **WHEN** a visitor selects an emoji or clicks a displayed neighbor
- **THEN** it becomes the current selection with six distinct nearest other emojis for the current mode, and Copy copies the selected Unicode emoji with truthful success or failure feedback

#### Scenario: Equal distances
- **WHEN** candidates have equal distance, including at the sixth-neighbor boundary
- **THEN** any valid six-neighbor result respecting closer distances is acceptable, without a special relevance order among ties

### Requirement: Actual-operation inspection

The demo SHALL expose distances and technical information in a collapsible panel, including the executed search SQL, readable parameters, representation/metric and measured operation information. It SHALL explain textual discovery versus existing-vector search and SHALL NOT present Hamming and cosine distances as a common similarity percentage or promise semantic relevance.

#### Scenario: Inspect a completed search
- **WHEN** the visitor opens the panel after a search
- **THEN** it describes that actual operation, including observed distances and query timing, and distinguishes binary Hamming from Float32 cosine without fabricated progress or measurements

### Requirement: Transient browser session and usable states

The demo SHALL use only an in-memory database with explicit connection closure on session disposal. It SHALL remain usable in the common mobile-adapted envelope with keyboard-operable controls and clear loading/error states. Presentation and Usage SHALL NOT start the demo runtime or acquire its corpus unless the visitor enters Demo.

#### Scenario: Navigate into and away from Demo
- **WHEN** the visitor enters Demo from another page and later leaves it
- **THEN** initialization occurs only for Demo and disposal closes the connection and releases its execution context without OPFS, authentication or local database cleanup

#### Scenario: Operate during loading or a failure
- **WHEN** initial loading, optional-mode loading, an initialization failure or a rapid selection change occurs
- **THEN** controls communicate availability and errors, allow an appropriate retry, and do not show an obsolete response as the latest selection/mode

#### Scenario: Narrow viewport and keyboard
- **WHEN** the demo is used at mobile width or by keyboard
- **THEN** search, selection, modes, copy and the technical panel remain operable with visible focus and readable content, without page-wide overflow

### Requirement: Scoped real-runtime demo checks

Demo checks SHALL exercise the published WASM, automatic sqlite-vec availability, insertions and a few searches in each mode against distances calculated independently of sqlite-vec. They SHALL cover UI/loading and identified Pages integration, complementing shell/docs checks and distribution acceptance. Missing browser or deployment prerequisites SHALL NOT count as success.

#### Scenario: Compare searches with a reference
- **WHEN** real-browser checks exercise selected emojis in both modes
- **THEN** returned distances and nearest-neighbor membership agree with an independent Hamming/cosine reference, using a documented Float32 tolerance and accepting any equally close boundary neighbors without requiring an identical tie order

#### Scenario: Observe loading and the deployed demo
- **WHEN** the candidate is checked locally and on its identified GitHub Pages preview
- **THEN** checks observe unchanged published runtime loading, binary-first/deferred-Float32 requests, actual interactions and diagnostics at stable/preview prefixes and mobile/desktop widths, with commit/release/corpus identities and observed outcomes recorded

#### Scenario: Bound the evidence
- **WHEN** checks or measurements are reported
- **THEN** local and Pages results are distinguished, absent prerequisites remain incomplete, and results do not claim OPFS, persistence, complete package acceptance, semantic quality or an unmeasured performance guarantee
