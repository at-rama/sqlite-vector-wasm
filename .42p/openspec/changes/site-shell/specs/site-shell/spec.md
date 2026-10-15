# Spec Delta

## Purpose

Supply the common public static site envelope and GitHub Pages deployment so documentation and the published-runtime demonstration can integrate independently without documentation updates changing the selected runtime.

## ADDED Requirements

### Requirement: Common static construction

The site SHALL build a common static envelope for Presentation, Usage and Demo, hosted on GitHub Pages under its configured project prefix. Site construction SHALL remain separate from engine building and distribution publication.

#### Scenario: Fresh static construction
- **WHEN** a clean checkout has the documented site prerequisites and supplied integration inputs
- **THEN** the build produces the three destinations and common assets without compiling SQLite, publishing a package or requiring an earlier generated site

#### Scenario: Project-prefix hosting
- **WHEN** the output is hosted below the configured GitHub Pages project prefix
- **THEN** direct visits and common navigation/assets resolve within that prefix rather than assuming domain-root hosting

### Requirement: Common navigation and mobile presentation

Every site destination SHALL share English navigation for Presentation, Usage, Demo and a direct external GitHub repository link, with minimal mobile-adapted styling. The common envelope SHALL remain usable at mobile and desktop viewport sizes.

#### Scenario: Navigate among destinations
- **WHEN** a visitor opens any site destination and follows its common navigation
- **THEN** Presentation, Usage and Demo are reachable and GitHub links directly to https://github.com/at-rama/sqlite-vector-wasm

#### Scenario: Mobile viewport
- **WHEN** the site is opened at a narrow mobile viewport
- **THEN** navigation remains operable and common page content fits the viewport, with wide code content scrollable inside its own area

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

The site SHALL have a dedicated GitHub Pages deployment path for relevant integrated main-branch changes and explicit manual redeployment. Pull requests SHALL validate the proposed site without publishing it. Site deployment SHALL NOT trigger distribution publication or an implicit demo refresh.

#### Scenario: Pull request validation
- **WHEN** a pull request changes the site or its integration inputs
- **THEN** the proposed construction and applicable shell checks run without deploying public Pages content

#### Scenario: Integrated or manual deployment
- **WHEN** a relevant integrated main-branch change or manual main-branch redeployment is processed
- **THEN** the dedicated workflow builds and validates the site before deploying the resulting Pages artifact with the supplied demo selection preserved

### Requirement: Scoped shell verification

Shell checks SHALL cover common construction/navigation, mobile presentation, project-prefix hosting, independent integration and documentation-only runtime preservation. Navigation and common integration SHALL also be checked on GitHub Pages. These checks SHALL complement rather than replace documentation checks, vector-demo checks or distribution acceptance.

#### Scenario: Before a real demo exists
- **WHEN** shell verification uses representative documentation and demo fixtures
- **THEN** it exercises both independent integration paths and compares release identity and runtime asset digests across a documentation-only rebuild, without claiming real published-WASM or vector execution evidence

#### Scenario: Deployed integration check
- **WHEN** the shell is deployed on GitHub Pages
- **THEN** the public destinations, common assets and navigation are checked at their actual prefix, with observed outcomes and any missing deployment prerequisites reported explicitly
