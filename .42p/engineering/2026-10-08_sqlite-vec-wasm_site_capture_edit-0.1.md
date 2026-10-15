# Site Capture

## Purpose, scope, and authority

Retain the reconciled design of A-Site, the public web surface of sqlite-vector-wasm: presentation, usage, browser demonstration and GitHub access. This Capture projects instituted user decisions from S-site-design, S-site-exploration and S-site-mission, with the bounded Usage-page addition from S-site-usage, scoped identity/composition consequences from S-product-design and the publication references reconciled under S-capture-reconciliation; it does not institute them or prove implementation. It is distinct from the [Distribution Capture](2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md) and [Release/Watch Capture](2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md), which retain product obligations and the expressly revised versioning/watch design. These related projections are not independent sources or corroboration.

S-site-mission replaces S-site-design's proposed integration into a living root specification with two Captures and one global Allocation, and originally instituted one `A-site` unit. S-site-split replaces that allocation choice with `A-site_shell`, `A-site_docs` and `A-site_demo`; A-site remains a descriptive grouping without its own realization Change. Realization is deferred to the respective OpenSpec Changes. This design migration implements neither the site nor its build or deployment. Source design requirements below retain their force; permissions, reported observations, unselected alternatives and unresolved choices are identified separately.

## Material criteria and boundaries

### C-site — Public surface and navigation

Source: S-site-design, “Objet”; S-site-mission; S-site-usage, bounded page/navigation addition.

Add a basic static site hosted on GitHub Pages, presenting the project and demonstrating the latest stable release in a browser. Three pages share minimal mobile-adapted styling and navigation with four entries: **Présentation**, a clean rendering of the README; **Usage**, getting started with the published distribution; **Démo**, textual and vector emoji search; and **GitHub ↗**, a direct link to [the repository](https://github.com/at-rama/sqlite-vector-wasm). A CMS or application framework is unnecessary; this statement establishes no framework selection or new prohibition on a justified realization choice.

### C-readme — One public presentation source

Source: S-site-design, “Présentation” and “Intégration au projet”; S-site-usage, distinct documentation sources and preserved demo identity.

The README remains the sole presentation source, converted to HTML at deployment without maintaining another copy of its content. Relative links and images must remain usable from the site. The presentation may follow the README on `main` independently of engine releases; a documentation change needs no new sqlite-vector-wasm publication. A documentation-only site update preserves the release identity used by the demo.

The Usage page has one dedicated Markdown source, rendered on the site and directly consultable in GitHub, without a separately maintained copy of the instructions. It provides getting-started instructions and a minimal example for the published distribution. The README-only rule continues to govern Présentation; it does not exclude this distinct usage source. Documentation-only Usage updates likewise need no new product publication and preserve the demo's runtime identity. The source path and rendering mechanism remain realization choices.

### C-demo-release — Published runtime consumption

Source: S-site-design, “Distribution utilisée par la démo” and “Intégration au projet”.

Consume JS/WASM extracted from the actually published archive, without rebuilding the engine. Resolve the latest stable release when deploying the demo, then use that precise version until the next demo update. Display the independent sqlite-vector-wasm product version, `sqlite_version()` and the selected engine identity/version (currently sqlite-vec via `vec_version()`), with a link to the release used. S-product-design changes this presentation identity, not the published-archive consumption rule or the real vector behavior. C-readme permits independent documentation updates; these must not silently change the demo's runtime.

S-capture-reconciliation aligns these references with the distribution-only `dist/vX.Y.Z` identity and npm `latest`/`next` policy retained in Release/Watch. The demo continues to consume an actually published stable distribution corresponding to `latest`; experimental publication on `next` introduces no automatic experimental demo deployment. The revised increment policy changes neither dataset, modes, checks nor runtime lifetime.

The site and demo data remain separate from the distributed package. The demo consumes A-release's published distribution; it introduces no package API, runtime capability, publishing responsibility or third canonical runtime distribution. Its UI behavior belongs to the site, not the product integration glue.

### C-emoji — Corpus identity and limits

Source: S-site-design, “Corpus”.

Use the complete scientific [uclnlp/emoji2vec corpus](https://github.com/uclnlp/emoji2vec): 1,661 emojis with precomputed 300-dimensional embeddings. Its enriched descriptions supply English names and associated words across the corpus. Render Unicode characters through the visitor's system; no image collection is needed. Freeze the data to an identified upstream revision and retain its MIT notice and source credit. The corpus is old and lacks recent emojis; French labels are outside the initial scope. The specific upstream revision and prepared-data file formats are not selected here.

### C-vector-modes — Default binary and optional Float32

Source: S-site-design, “Deux modes vectoriels”; S-site-exploration.

Binary is the default: one bit per component according to its sign, padded from 300 to 304 dimensions, using Hamming distance and loaded at startup. The four padding dimensions are identical across vectors and do not contribute to distances. Float32 uses the original 300-dimensional vectors and cosine distance, loaded on first mode selection and retained in memory thereafter. Both modes use the same emojis and identifiers. Switching mode preserves the selected emoji and reruns its search. Quantization can materially change the neighbors; semantic relevance is not an acceptance criterion.

### C-interaction — Small exploratory interface

Source: S-site-design, “Interface de démonstration”.

Provide a text-search field for names and associated words, a grid of matching emojis, selection of an emoji to show its six vector neighbors excluding itself, clickable neighbors for continued exploration, an emoji-copy button and a **Binaire / Float32** selector. Distances and technical control information are accessible in a collapsible panel. This defines behavior without choosing an interface library or internal component structure.

### C-search — Text starting point and actual vector execution

Source: S-site-design, “Interface de démonstration” and “Stockage et durée de vie”.

Text search finds a starting emoji; vector search uses its existing embedding. Data are imported into SQLite, and vector searches are executed by sqlite-vec. No free-form sentence is vectorized, and no model, remote embedding service or API key is necessary. The internal textual-search mechanism is not selected.

### C-memory — Transient connection lifetime

Source: S-site-design, “Stockage et durée de vie”; S-site-exploration.

The database is exclusively in memory; explicit connection closure destroys it. No authentication, local persistence or OPFS file cleanup is needed. This reconciles the early “Flush à la déconnexion” intention with the designated in-memory design without inventing a login/logout flow or persistence test.

### C-demo-checks — Scoped deterministic verification

Source: S-site-design, “Vérification et limites”; S-site-usage, Usage rendering/links/example checks.

Compare a few searches in each mode deterministically with expected results calculated independently of sqlite-vec. On the exercised paths, verify loading of the published WASM, automatic extension availability, vector insertion and searches. Surprising neighborhoods alone do not prove vector execution. Also verify navigation, README rendering and links from GitHub Pages. Verify Usage rendering and links, and that its minimal example works with the published distribution version it announces.

The demo complements product acceptance; it establishes neither OPFS, persistence nor the complete distributed API/capability surface. Distribution acceptance remains allocated separately, with no weakened gate. This PR supplies no browser-demo result or independent oracle execution.

## Rationale, alternatives and open choices

### R-demo — Small web-friendly demonstration

Source: S-site-exploration; S-site-design, “Taille et faisabilité”.

Emoji name search addresses a familiar web problem; vector neighbors make an easy exploratory interaction. The user prioritizes demonstrating that sqlite-vec and the published WASM function, rather than optimizing semantic relevance. Binary-first loading keeps the initial data small; optional Float32 lets visitors observe representation differences. Imperfect neighbors are acceptable, but C-demo-checks supplies the actual verification basis.

Reported exploratory sizes, excluding JS/WASM and UI, are approximately 133 kB for compact emoji/name/word JSON, 63 kB for binary vectors, 196 kB combined initially or 94 kB with gzip, and 2 MB for optional Float32 vectors. These are the source's reported upstream-file/reference-calculation observations, not renewed measurements, transfer guarantees or browser/SQLite results. JSON here describes the measured representation, not a prescribed demo-data format. The source reports no verification of the future browser page.

### O-corpus — Earlier miniature corpus alternative

Source: S-site-exploration; superseding selection in S-site-design, “Corpus”.

An approximately hundred-item miniature dataset was initially sought; the full emoji2vec corpus is now selected because the binary representation remains small and offers the desired emoji exploration. A miniature subset is unselected, not technically refuted. The user rejected a commercially branded unrelated source to avoid promotion; the academic source is the adopted orientation. No alternative dataset becomes a second demo obligation.

### Q-volume — Final SQLite size

Source: S-site-design, “Taille et faisabilité”.

The final database volume with `vec0` remains to be measured. Existing file-size/reference experiments do not settle it. No size threshold or readiness blocker has been instituted.

### Q-realization — OpenSpec realization choices

Source: S-site-mission, Capture Site and Allocation instructions; S-site-split, adopted responsibility boundaries and dependencies.

Framework, repository file organization, build/deployment pipeline, interface library, prepared-data formats, selected upstream revision, internal text/vector-search mechanisms and deterministic fixture details remain realization choices for the respective Changes and Apply, constrained by the behaviors above. The adopted units are `A-site_shell` (static construction/deployment, common navigation/mobile styling), `A-site_docs` (README presentation and Usage), and `A-site_demo` (the complete published-runtime demonstration, including data, both representations, interactions and independent vector checks). Each owns its scoped checks; shell also verifies that documentation-only updates preserve the demo runtime identity. Shell precedes integration of docs and demo, which can then be realized independently; neither requires the other's content or runtime. A-site is only their descriptive grouping, with no residual realization responsibility or Change. No further data/UI/search subdivision or new passage condition is instituted merely because realization choices remain open.

## Material sources

**S-site-split** — Primary user instruction in this project conversation on 2026-10-15: “Validé / Fais évoluer l'allocation pour remplacer A-site par ces nouvelles unités d'allocation sans perte.” It explicitly adopts the immediately preceding three-unit proposal: A-site_shell for static construction/deployment, common navigation/mobile styling; A-site_docs for README presentation and single-source Usage with the minimal published-version example; A-site_demo for the complete actual-runtime demo. Each unit owns its checks; shell also checks preservation of demo identity during documentation-only updates. Shell precedes integration of docs/demo, which are then independent. A-site remains a grouping without its own Change. This bounded revision supersedes S-site-mission's single-unit choice and Q-realization's former no-subdivision statement, without changing the product/demo requirements or general 42p rules. The adopted assistant proposal is not independent corroboration. No public conversation permalink is available; this authorizes documentary reconciliation, not implementation, merge or publication.

**S-site-usage** — Primary user decision in this project conversation on 2026-10-15: “Petit ajustement, je pense que la page "usage" serait aussi la bienvenue / Faut il faire évoluer capture / allocation”, followed by explicit adoption and execution instruction, “Ok realise l'ajustement capture / allocation / Vérifie la dérivation et l'absence de perte matérielle”. The adopted intervening proposal adds Présentation / Usage / Démo / GitHub navigation, a dedicated Markdown usage source rendered on the site and consultable in GitHub, getting-started instructions and a minimal published-distribution example, with rendering/link/example checks. It preserves README-only presentation and allocates the addition within the existing A-site boundary. This bounded revision supersedes only the two-page/three-entry surface and extends the documentation/check portions above; it changes neither demo behavior nor Distribution responsibilities. The assistant proposal is source material only through this explicit adoption, not independent corroboration. No public conversation permalink is available. This instruction authorizes Capture/Allocation reconciliation and its review, not site implementation, merge or publication.

**S-capture-reconciliation** — The same primary user instruction of 2026-10-10 recorded in Distribution and Release/Watch: explicit adoption of the three-Capture comparison at PR #26 revision `df13642956586dea1cc858edec1dee0f5a019dca` and authorization to apply only its listed corrections. Only minimal provenance/version/publication references propagate here. Distribution and Release/Watch retain the locators of the revised design sources; their projections do not supply independent authority. Site behavior and open realization choices remain unchanged. That mission deferred Allocation reconciliation; the current global Allocation now carries the Site responsibility and its qualified references. No public conversation permalink is available.

**S-product-design** — The same primary 2026-10-09 user instruction identified in the Distribution Capture, D1–D6. Only product presentation and independent version/composition consequences propagate here. The selected engine remains sqlite-vec. Dataset, modes, actual execution, independent checks, memory lifetime and site/publication separation are unaffected. This related source and the Distribution projection are not independent corroboration.

**S-site-design** — User-supplied edited text on 2026-10-08 in this sqlite-vec-wasm project conversation, titled “Spécification — Site public et démonstration sqlite-vec-wasm”, from “Ajouter au dépôt un site statique basique publié sur GitHub Pages” through “sur le WASM réellement distribué”. The user provided both the edited writing block and the full text after the source-access diagnostic. This explicitly designates the consolidated exploration as design input; its earlier assistant origin does not make it independent evidence. The supplied text grounds the behavioral decisions and reports exploratory observations. Its proposed SPEC integration is replaced by S-site-mission, not erased from provenance. No public conversation permalink or raw experiment output is available in this checkout.

**S-site-exploration** — Preceding user messages in the same conversation: initial latest-release GitHub Pages demonstration with precomputed data, textual names followed by “recherche familiarité”, “Flush à la déconnexion”, the request for a tiny approximately hundred-item corpus, rejection of an unrelated commercial source, and “on met le fichier binaire par défaut et un sélecteur pour aller sur le fichier complet de 2 méga”. The user then expanded the site to three entries, “Affichage propre du readme / Page demo / Lien GitHub”, and asked to update the proposal. These messages establish intent, rationale and earlier alternatives. S-site-design supplies the designated full consolidation; absent intermediate assistant replies are not reconstructed or counted as additional sources. User continuation alone is not adoption of an unseen proposal.

**S-site-mission** — User instruction of 2026-10-08, “Mission Work — Réconcilier le design 42p et intégrer A-Site”, in the same conversation, especially Objectif and steps 2–4. It institutes the two-Capture/global-Allocation migration, exactly one new `A-site` unit, preservation of Distribution boundaries, deletion of the live SPEC and deferred site realization. It supersedes only the consolidation's integration representation and proposed-unit status, not its site behavior. It authorizes this design/canon PR, not implementation or publication. This Capture and assistant receipts are never independent corroboration.
