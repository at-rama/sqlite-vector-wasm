## MODIFIED Requirements

### Requirement: Explicit published stable runtime

The demo SHALL consume unchanged JS/WASM from an actually published stable distribution corresponding to `latest`, selected on initial preparation or explicit demo refresh. The separately qualified return from the temporary placeholder SHALL explicitly select an actually published SQLite-Vector stable composition; historical sqlite-vec selections SHALL remain historical and SHALL NOT be reactivated. Ordinary site rebuilds SHALL retain that selection. Candidate documentation preview SHALL NOT permit an unpublished demo runtime. The demo SHALL NOT rebuild the engine or select experimental `next` publications.

#### Scenario: Prepare or refresh the demo
- **WHEN** initial demo preparation or an explicit runtime refresh occurs
- **THEN** preparation resolves the latest stable distribution, records its exact publication/archive identity and integrity metadata, and supplies the verified published runtime assets to the shell

#### Scenario: Rebuild without refresh
- **WHEN** documentation or the site is rebuilt with an unchanged demo selection after a newer release exists
- **THEN** the same selected release and runtime bytes are used without floating discovery, including separate stable and preview constructions

#### Scenario: Invalid published dependency
- **WHEN** a selected archive or required companion is unavailable, inconsistent, corrupted or not an eligible stable publication
- **THEN** preparation fails instead of rebuilding the engine, substituting another release or retaining stale generated output

#### Scenario: No eligible verified publication
- **WHEN** explicit preparation cannot establish an eligible published stable Vector archive and its matching verified companions/runtime bytes
- **THEN** runnable-demo preparation fails without a fabricated archive, candidate runtime or old-engine fallback, and the temporary public placeholder remains intact

### Requirement: Visible runtime identity

The demo SHALL display its selected sqlite-vector-wasm version and release link, plus SQLite and the selected engine identity and exact versions read from the running connection. Runtime/data/UI artifacts SHALL remain site concerns without extending the distributed package API or creating another canonical runtime distribution.

#### Scenario: Inspect the loaded runtime
- **WHEN** initialization succeeds
- **THEN** the visible product version and release link identify the selection, and `sqlite_version()` and the selected engine’s native version observation (`vector_version()` for SQLite-Vector) observations agree with that publication's composition

### Requirement: Textual discovery and vector exploration

The demo SHALL offer text search over English names and associated words, a matching emoji grid, six vector neighbors excluding the selected emoji, clickable neighbors, an emoji-copy control and Binary/Float32 selection. Data SHALL be imported into SQLite and neighbor searches SHALL actually execute through SQLite-Vector for the refreshed product demo using the selected emoji's existing embedding, without free-text embedding inference or an external embedding service. Text discovery SHALL match each query term at the beginning of a word across all descriptions and associated words without case sensitivity, require every term regardless of order and preserve the complete catalogue for an empty query. A new demo session SHALL explicitly select 🐱 and show its six binary-mode vector neighbors after initialization.

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

Demo checks SHALL exercise the published WASM, automatic selected-engine availability, insertions and a few searches in each mode against distances calculated independently of the selected extension. They SHALL cover UI/loading and identified Pages integration, complementing shell/docs checks and distribution acceptance. Missing browser or deployment prerequisites SHALL NOT count as success.

#### Scenario: Compare searches with a reference
- **WHEN** real-browser checks exercise selected emojis in both modes
- **THEN** returned distances and nearest-neighbor membership agree with an independent Hamming/cosine reference, using a documented Float32 tolerance and accepting any equally close boundary neighbors without requiring an identical tie order

#### Scenario: Observe loading and the deployed demo
- **WHEN** the candidate is checked locally and on its identified GitHub Pages preview
- **THEN** checks observe unchanged published runtime loading, binary-first/deferred-Float32 requests, actual interactions and diagnostics at stable/preview prefixes and mobile/desktop widths, with commit/release/corpus identities and observed outcomes recorded

#### Scenario: Bound the evidence
- **WHEN** checks or measurements are reported
- **THEN** local and Pages results are distinguished, absent prerequisites remain incomplete, and results do not claim OPFS, persistence, complete package acceptance, semantic quality or an unmeasured performance guarantee

#### Scenario: Verify native Vector behavior
- **WHEN** the selected published Vector archive is exercised in both representations
- **THEN** native Vector SQL inserts/query operations and observed engine identity agree with publication, and independent 304-bit Hamming and 300-component Float32 cosine oracles establish distances/membership without substituting custom search for extension execution

### Requirement: Temporary static demo placeholder
During the temporary refactoring phase adopted under S-demo-placeholder, the Démo destination SHALL show only a short notice that the demonstration is being refactored for SQLite-Vector and a working link to current Usage, without a delivery date or claim of working vector execution. Common navigation and mobile access SHALL remain usable. The placeholder SHALL NOT initialize, acquire, bundle or execute a demo runtime, Worker or emoji corpus, display simulated results or report runtime/version observations. Active Site preparation, build, deployment and checks SHALL NOT require the abandoned demo pin/assets, corpus preparation, a replacement published Vector archive or completion of PR #77. Existing shell/docs publication and check guarantees and product acceptance SHALL remain applicable.

For this temporary phase only, this requirement supersedes the runnable portions of Explicit published stable runtime, Visible runtime identity, Complete attributed emoji corpus, Binary-first and deferred Float32 modes, Textual discovery and vector exploration, Actual-operation inspection, Transient browser session and usable states, and Scoped real-runtime demo checks. Those requirements remain deferred for the separate future demo return, with native SQLite-Vector adaptation, actual published stable bytes and full independent qualification; placeholder checks SHALL NOT count as their successful execution. Neither the future demo nor its publication dependency SHALL block cleanup completion. This exception introduces no second runtime, compatibility layer or configurable demo mode.

The temporary exception SHALL end only for the separately qualified complete SQLite-Vector demo return and its authorized integration. Publication metadata, a stable package publication, placeholder checks or a documentation-only rebuild SHALL NOT reactivate the runnable demo or count as its qualification.

#### Scenario: Open the temporary demo destination
- **WHEN** a visitor opens Démo through common navigation on desktop or mobile
- **THEN** the static SQLite-Vector refactoring notice and Usage link are usable, without runtime identity, search controls, simulated results, demo runtime/Worker/corpus loading or a promised delivery date

#### Scenario: Construct and deploy without a replacement demo
- **WHEN** stable or preview Site construction, deployment or an independent documentation rebuild occurs during the placeholder phase
- **THEN** no old demo runtime/data preparation, archive acquisition or PR #77 completion is needed, the placeholder remains intact without reactivating old assets, and applicable shell/docs publication gates and checks remain enforced

#### Scenario: Verify the placeholder and retain future qualification
- **WHEN** local and identified Pages placeholder checks are recorded
- **THEN** they verify the notice, Usage link, common navigation/mobile access and absence of demo runtime/Worker/corpus dependencies and requests; runtime/vector checks remain explicitly deferred rather than passed, and the future complete demo still requires its separate published-stable/native-Vector qualification before return

#### Scenario: Qualify the complete return
- **WHEN** the separately prepared SQLite-Vector demo is proposed to replace the temporary page
- **THEN** the complete retained runtime/corpus/modes/UI/session contract is exercised with exact published stable bytes and fresh independent local/browser/identified Pages evidence before authorized integration ends the temporary exception; missing or failed qualification keeps the public placeholder and cannot block the already independent cleanup or product publication
