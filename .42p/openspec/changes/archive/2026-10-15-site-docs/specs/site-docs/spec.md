# Spec Delta

## Purpose

Publish the project presentation and getting-started guide from their single Markdown sources, with working stable/preview links and a checked example of an explicitly identified published runtime.

## ADDED Requirements

### Requirement: Single-source public documentation

Presentation SHALL render the repository README and Usage SHALL render `docs/usage.md` in the common English mobile-adapted site envelope. Both documents SHALL remain directly readable on GitHub, with no separately maintained copy of their content. Usage SHALL provide getting-started instructions and a minimal published-distribution example.

#### Scenario: Render both existing sources
- **WHEN** the site is built from a checkout
- **THEN** Presentation and Usage contain the corresponding source content, including headings, code, links and images, without the shell's unavailable documentation notices

#### Scenario: Edit one source
- **WHEN** README or Usage content changes without an engine release
- **THEN** the next site build reflects that source without editing another authored page or publishing a distribution

### Requirement: Systematic documentation link resolution

Authored links to documentation published on this site SHALL prefer canonical stable site URLs. Rendered documentation SHALL resolve own-site URLs and mapped repository documents within the current stable or preview base, repository-only relative files to GitHub, and relative images to usable assets. External URLs and page-local anchors SHALL retain their destinations.

#### Scenario: Read documentation outside the site
- **WHEN** a reader follows a site-documentation link in the README or Usage on GitHub or in an installed package
- **THEN** it opens the canonical stable site page rather than its GitHub source

#### Scenario: Stay within the current build
- **WHEN** a stable or preview visitor follows an own-site URL or relative link to README or Usage
- **THEN** it reaches the mapped page under that build's base, retaining any query and fragment without falling through to the other deployment

#### Scenario: Resolve files and images from the authored location
- **WHEN** either source contains relative files, relative images, reference-style links, external URLs or local anchors
- **THEN** resolution uses that source's repository directory, repository-only files remain accessible on GitHub, images load, and external URLs and local anchors are preserved without rewriting code examples

#### Scenario: Reject broken internal targets
- **WHEN** a mapped site page, repository-relative file, image or internal fragment cannot be resolved
- **THEN** documentation checks fail with the source and target instead of publishing a known broken link

### Requirement: Explicit published-version example

Usage SHALL announce the exact published distribution version against which its minimal example is checked, initially `0.2.0`. The check SHALL load that actually published runtime and execute the documented example in a browser. Ordinary documentation builds SHALL preserve this version; selecting a different version SHALL require an explicit documentation revision.

#### Scenario: Execute the announced example
- **WHEN** the documentation example check runs
- **THEN** it verifies the selected publication/archive identity, serves its unchanged runtime companions, executes the documented initialization and minimal SQL example, and records version, archive digest and observed results

#### Scenario: Newer publication is available
- **WHEN** documentation is rebuilt after another runtime version is published
- **THEN** the announced example and its check still use the explicitly selected version without a floating latest lookup or engine rebuild

#### Scenario: Unavailable runtime or failed example
- **WHEN** the pinned published archive is unavailable, inconsistent or the documented example fails
- **THEN** the required example check fails or is reported blocked, never replaced by a synthetic module or an unexecuted code snippet

### Requirement: Independent documentation integration

Documentation SHALL build and deploy after shell integration without requiring the demo. Documentation-only changes SHALL preserve any supplied demo selection and runtime bytes. Documentation SHALL introduce no engine build, package API, distribution publication or additional canonical runtime distribution, and its checks SHALL complement downstream demo checks and product acceptance.

#### Scenario: Documentation before the demo
- **WHEN** documentation is integrated while the demo is absent
- **THEN** Presentation and Usage work through the common shell while Demo remains explicitly unavailable and no demo runtime is acquired

#### Scenario: Documentation with an existing demo
- **WHEN** only documentation changes with a supplied demo selection
- **THEN** the rebuilt/deployed site retains that selection and identical runtime asset digests, without adopting the documentation example's version as the demo selection

### Requirement: Scoped deployed documentation checks

Documentation checks SHALL verify source fidelity, rendered links/images/anchors and mobile presentation on the identified GitHub Pages candidate. Minimal-example execution SHALL be reported separately against its announced published runtime. Missing deployment or browser prerequisites SHALL remain explicit and SHALL NOT count as successful verification.

#### Scenario: Observe actual Pages documentation
- **WHEN** the candidate is deployed
- **THEN** browser checks identify the exact candidate and verify both documents, their navigation and links, images and anchors at desktop/mobile widths under the actual deployment prefix

#### Scenario: Local checks without a public deployment
- **WHEN** local rendering succeeds but the candidate cannot be observed on Pages
- **THEN** local results remain qualified as local and the required deployed documentation check remains incomplete
