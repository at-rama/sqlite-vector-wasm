## MODIFIED Requirements

### Requirement: Single-source public documentation
Presentation SHALL render the repository README and Usage SHALL render `docs/usage.md` in the common English mobile-adapted site envelope. Both documents SHALL remain directly readable on GitHub, with no separately maintained copy of their content. Usage SHALL provide getting-started instructions and a minimal selected-distribution example. Vector candidate documentation SHALL include current native SQL/version guidance without an extra sqlite-vec adaptation or migration guide; candidate preview SHALL explicitly identify its unpublished state. Generic authored installation and product descriptions SHALL avoid fixed release versions. Automatically sourced badges SHALL describe npm latest metadata, including bundled component versions from its runtime manifest, independently of the checked example. README footprint figures SHALL describe a measured loader/WASM pair and link to exact reproducibility information, distinguishing raw bytes, HTTP gzip transfer, package size and application data.

#### Scenario: Render both existing sources
- **WHEN** the site is built from a checkout
- **THEN** Presentation and Usage contain the corresponding source content, including headings, code, links and images, without the shell's unavailable documentation notices

#### Scenario: Edit one source
- **WHEN** README or Usage content changes without an engine release
- **THEN** the next site build reflects that source without editing another authored page or publishing a distribution

#### Scenario: Prepare Vector candidate sources
- **WHEN** a Vector distribution candidate is prepared
- **THEN** the same README/Usage sources provide its presentation and working native SQL example, identify exact candidate composition in preview and do not claim an unavailable npm version is installable

#### Scenario: Read durable installation outside the site
- **WHEN** a reader consults README or Usage on GitHub or in the installed package
- **THEN** ordinary installation uses `npm install @at-rama/sqlite-vector-wasm`, generic descriptions do not carry fixed release versions, and exact identities remain available through release records, manifests and reproducibility information

#### Scenario: Read automatically sourced latest badges
- **WHEN** the reader views npm and component badges
- **THEN** package version/license come from npm metadata and bundled SQLite/SQLite-Vector versions come from the runtime manifest of npm latest, with labels identifying that publication rather than claiming the checked example or demo uses it

#### Scenario: Read the practical download footprint
- **WHEN** the reader consults the README download-size paragraph
- **THEN** it gives rounded raw and actually served gzip sizes for the identified measured loader/WASM pair, links to the exact publication, hashes, endpoints, date and reproducible method, and states that application data and additional requested assets are extra and server compression affects transfer size

#### Scenario: Distinguish observed transfer from other size measurements
- **WHEN** footprint measurements are recorded or renewed
- **THEN** raw sizes and decoded hashes are verified against the identified published archive, HTTP content encoding and response-body byte counts are recorded, local compression estimates are distinguished from served gzip, and no package-size, whole-application or runtime-memory claim is inferred

### Requirement: Explicit published-version example

Usage SHALL announce the exact selected distribution version and composition against which its minimal example is checked. A release-candidate preview SHALL check the exact qualified candidate archive/revision/digest in a browser and identify its unpublished status. Stable public documentation SHALL check the matching actually published definitive runtime. Ordinary documentation-only builds SHALL preserve their explicit published selection without floating latest discovery or engine rebuild. The documentation example SHALL NOT refresh the demo. Exact example identity and its corresponding install recipe SHALL be presented as reproducibility information generated from the qualified selection, without depending on a preceding release literal in the authored source. Generic published-package installation SHALL remain distinct from that checked recipe. Informational latest badges SHALL NOT select or requalify either runtime.

#### Scenario: Execute the announced candidate example
- **WHEN** an identified release PR is previewed before publication
- **THEN** the existing real-browser example check consumes the exact qualified archive for that head and composition, records archive digest/version/observed results and exposes unpublished status without requiring npm availability

#### Scenario: Validate definitive published documentation
- **WHEN** the final identity differs from the preview forecast or stable documentation is promoted
- **THEN** mechanical identity/status rendering uses the matching definitive qualified/published composition and affected example/link/package checks are preserved or renewed; no substantive unreviewed documentation change is promoted

#### Scenario: Preserve ordinary published selection
- **WHEN** a documentation-only revision or a newer unrelated publication is processed
- **THEN** the explicit announced published selection and example stay fixed and the demo identity/assets remain unchanged

#### Scenario: Reject unavailable or mismatched runtime
- **WHEN** candidate/publication archive, qualified revision, digest, composition or example is missing, inconsistent, stale or fails
- **THEN** required checks fail or remain blocked, without a synthetic module, false successful result or invented publication

#### Scenario: Execute the announced example
- **WHEN** the documentation example check runs in ordinary published mode
- **THEN** it verifies the selected publication/archive identity, serves its unchanged runtime companions, executes the documented initialization and minimal SQL example, and records version, archive digest and observed results

#### Scenario: Newer publication is available
- **WHEN** documentation is rebuilt after another runtime version is published
- **THEN** the announced example and its check still use the explicitly selected version without a floating latest lookup or engine rebuild

#### Scenario: Unavailable runtime or failed example
- **WHEN** the pinned published archive is unavailable, inconsistent or the documented example fails
- **THEN** the required example check fails or is reported blocked, never replaced by a synthetic module or an unexecuted code snippet

#### Scenario: Render a published example from generic source
- **WHEN** generic authored installation is rendered with an explicitly qualified published selection
- **THEN** ordinary installation remains version-neutral and a separate generated reproducibility disclosure identifies the exact distribution/composition and matching pinned install recipe used by the existing browser example check

#### Scenario: Render an unpublished candidate from generic source
- **WHEN** the same generic source is rendered for an exact qualified release candidate
- **THEN** candidate installation uses the supplied local archive and the reproducibility disclosure identifies its exact unpublished identity, without suggesting npm latest or an unavailable candidate version supplies the checked runtime

#### Scenario: Latest metadata changes independently
- **WHEN** npm latest metadata or a badge response changes without an adopted example or demo update
- **THEN** the documentation example still consumes its explicit archive identity and the supplied demo selection and runtime digests remain unchanged, with no floating runtime lookup added to ordinary builds
