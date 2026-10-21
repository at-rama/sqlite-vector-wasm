# site-shell Specification

## Purpose

Supply the common public static site envelope and GitHub Pages deployment so documentation and the published-runtime demonstration can integrate independently without documentation updates changing the selected runtime.

## Requirements

### Requirement: Common static construction

The site SHALL build a common static envelope for Presentation, Usage and Demo, hosted on GitHub Pages under its configured project prefix. Site construction SHALL remain separate from engine building and distribution publication.

#### Scenario: Fresh static construction
- **WHEN** a clean checkout has the documented site prerequisites and supplied integration inputs
- **THEN** the build produces the three destinations and common assets without compiling SQLite, publishing a package or requiring an earlier generated site

#### Scenario: Project-prefix hosting
- **WHEN** the output is hosted below the configured GitHub Pages project prefix
- **THEN** direct visits and common navigation/assets resolve within that prefix rather than assuming domain-root hosting

### Requirement: Common navigation and mobile presentation

Every site destination SHALL share English navigation for Presentation, Usage, Demo, a direct external GitHub repository link and an adjacent `npm` link to `https://www.npmjs.com/package/@at-rama/sqlite-vector-wasm`, with minimal mobile-adapted styling. The common envelope SHALL remain usable at mobile and desktop viewport sizes.

#### Scenario: Navigate among destinations
- **WHEN** a visitor opens any site destination and follows its common navigation
- **THEN** Presentation, Usage and Demo are reachable and GitHub links directly to https://github.com/at-rama/sqlite-vector-wasm, and adjacent npm links directly to https://www.npmjs.com/package/@at-rama/sqlite-vector-wasm

#### Scenario: Mobile viewport
- **WHEN** the site is opened at a narrow mobile viewport
- **THEN** navigation remains operable, the mobile menu exposes npm beside GitHub with the same direct package destination, and common page content fits the viewport, with wide code content scrollable inside its own area

#### Scenario: Package link from stable and preview pages
- **WHEN** a visitor opens any stable or preview destination and inspects its desktop navigation or opens its mobile menu
- **THEN** the visible `npm` link is adjacent to GitHub and points to the exact external package URL without adding the site or preview prefix

### Requirement: Independent downstream integration

The shell SHALL support documentation and demo integration independently after the envelope exists. Documentation sources, rendering and example checks SHALL remain with A-site_docs; release selection/acquisition, demo assets, data, interactions and vector checks SHALL remain with A-site_demo. Unintegrated destinations SHALL be identified without claiming their functionality exists.

#### Scenario: Shell before downstream units
- **WHEN** neither documentation nor demo implementation has been integrated
- **THEN** the common destinations and navigation work with concise unavailable notices and without duplicated documentation or simulated vector behavior

#### Scenario: Integrate either downstream unit
- **WHEN** documentation or demo content is supplied while the other unit remains absent
- **THEN** the supplied destination uses the common envelope and can build and deploy without requiring the other unit's content or runtime

### Requirement: Documentation deployment preserves demo runtime

Documentation-only site updates SHALL preserve the demo's selected published release identity and runtime assets. The shell SHALL consume the explicit selection supplied by A-site_demo and SHALL NOT resolve a newer release during documentation updates. An absent demo SHALL NOT cause implicit runtime acquisition.

#### Scenario: Documentation changes after demo integration
- **WHEN** README or Usage changes and the site is rebuilt and deployed with an unchanged demo selection
- **THEN** the demo release identity and runtime asset digests remain identical even if a newer stable distribution exists

#### Scenario: Explicit demo refresh handoff
- **WHEN** A-site_demo supplies a new explicit stable-release selection and its corresponding assets
- **THEN** the shell deploys that selection without rebuilding the engine or independently substituting another release

#### Scenario: Missing supplied runtime assets
- **WHEN** an integrated demo declares a runtime selection whose required assets are absent or inconsistent
- **THEN** site construction fails rather than selecting latest, using a stale output or representing a different runtime as the declared selection

### Requirement: Bounded Pages deployment

Relevant internal PRs SHALL deploy one shared preview beside a stable root from an eligible public documentation revision. Relevant main-branch pushes and manual main-branch redeployments SHALL publish only an eligible stable site. Candidate documentation SHALL become eligible only after matching complete distribution publication; an ordinary documentation-only revision remains eligible when its announced version is already published. All deployment paths SHALL preserve the previous public documentation during failed, pending or partial candidate publication, including stable roots assembled for other PR previews. Unknown eligibility SHALL stop deployment without changing Pages. Fork PRs SHALL build and check without deployment. Publication SHALL prevent obsolete runs from restoring an older stable root and SHALL NOT publish distributions or implicitly refresh the demo.

#### Scenario: Internal pull request preview
- **WHEN** an internal pull request changes the site or its integration inputs and `main` contains the site
- **THEN** the proposed construction and applicable shell checks run, a separate checkout of the eligible public revision builds the stable root, and one complete Pages artifact publishes that root beside the candidate at `/preview/` relative to the project prefix

#### Scenario: Preview identity and navigation
- **WHEN** a visitor opens a preview destination
- **THEN** the candidate branch and exact commit are visible, that page declares robots `noindex`, and its common navigation and assets resolve within the preview prefix without applying preview identity or `noindex` to the stable root

#### Scenario: Fork validation
- **WHEN** a pull request comes from a fork
- **THEN** its proposed build and applicable shell checks run without deploying Pages or receiving publication credentials

#### Scenario: Preview-only bootstrap
- **WHEN** a relevant internal PR introduces the site's first implementation and `main` does not yet contain the site
- **THEN** the artifact publishes only the candidate under `/preview/`, without inventing a stable root or treating an existing stable site's build failure as absence

#### Scenario: Integrated or manual deployment
- **WHEN** a relevant integrated main-branch change or manual main-branch redeployment is processed
- **THEN** the dedicated workflow selects an eligible revision, builds and validates it before deploying a complete stable-only Pages artifact with its supplied demo selection preserved and no preview

#### Scenario: Shared preview replacement and unmerged closure
- **WHEN** another eligible candidate is deployed or an internal PR closes without merging
- **THEN** a new candidate replaces the single shared preview, while closure alone performs no cleanup or deployment and leaves existing content until the next deployment

#### Scenario: Concurrent publication
- **WHEN** eligible main and PR executions overlap or a prepared artifact's stable revision becomes obsolete
- **THEN** publication is serialized, an obsolete artifact cannot restore an older stable root, and the published stable and candidate revisions can be identified

#### Scenario: Relevant input filtering
- **WHEN** site sources, site tooling/dependency records, the site workflow, README, Usage or integrated demo preparation inputs change
- **THEN** the site workflow is triggered, while unrelated source edits alone do not trigger automatic site deployment

#### Scenario: Merged candidate awaits publication
- **WHEN** main contains candidate documents but release is pending or failed and a main push, manual redeployment or another PR preview is processed
- **THEN** unpublished documentation cannot replace the stable root; the previous eligible public source is retained, or deployment stops leaving current Pages unchanged if it cannot be established

#### Scenario: Matching publication completion
- **WHEN** a release completion signal requests stable promotion
- **THEN** repository/run/revision/archive/publication and document-check identities are verified, both destinations are complete, and only the matching eligible site is deployed under final freshness/concurrency guards

#### Scenario: Stale or unrelated completion
- **WHEN** a completion event or artifact is stale, from another repository/run/revision or only nominally successful
- **THEN** no stable promotion occurs and no unsafe artifact or unpublished main content is trusted

### Requirement: Scoped shell verification

Shell checks SHALL cover construction/navigation, mobile presentation, stable/preview prefixes, independent integration, runtime preservation and bounded deployment scenarios. Navigation and common integration SHALL also be checked on GitHub Pages against the identified candidate. These checks SHALL complement rather than replace documentation checks, vector-demo checks or distribution acceptance.

#### Scenario: Before a real demo exists
- **WHEN** shell verification uses representative documentation and demo fixtures
- **THEN** it exercises both independent integration paths and compares release identity and runtime asset digests across a documentation-only rebuild, without claiming real published-WASM or vector execution evidence

#### Scenario: Deployed integration check
- **WHEN** a candidate preview of the shell is deployed on GitHub Pages
- **THEN** the candidate's destinations, common assets and navigation are checked at their actual preview prefix and identified commit, with stable-root separation checked when present and observed outcomes and missing deployment prerequisites reported explicitly
