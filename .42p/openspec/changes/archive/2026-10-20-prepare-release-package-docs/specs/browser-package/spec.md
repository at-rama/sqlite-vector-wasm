## MODIFIED Requirements

### Requirement: Consumer-ready distribution envelope

Packaging SHALL supply an npm-compatible archive usable for npm publication and GitHub Release download, with the same runtime payload for both channels and no consumer native/WASM compilation. It SHALL carry explicit supplied package identity and actual composition metadata without selecting A-release's version/revision/publication policy. Composition-dependent documentation SHALL follow the selected engine from explicit per-engine sources and common material, with stable consumer paths and honest verification/publication references. Candidate/final documentation SHALL describe the enclosed supplied identity and selected upstreams, without fixed fixture-only claims or invented existing npm publication. Identity-dependent rendering SHALL be deterministic from the supplied package identity and build handoff, preserving both isolated engine document paths.

#### Scenario: Consumer installation and download
- **WHEN** the archive is installed locally as an npm package or extracted for static hosting
- **THEN** the complete browser assets are available without compiler tools, install-time builds or upstream acquisition

#### Scenario: Supplied identity
- **WHEN** packaging is invoked with a valid package name and project version
- **THEN** the generated package metadata carries those inputs and identifies the included upstream versions without claiming a tag, registry publication or accepted release

#### Scenario: Documentation follows composition
- **WHEN** an archive is assembled from a selected-engine handoff
- **THEN** its presentation, usage, descriptions and other composition-dependent documents come from that engine’s explicit directory plus declared shared sources, using stable archive paths without merging prose or shipping another engine’s guide as its own

#### Scenario: Documentation source or link failure
- **WHEN** a required selected/common document is missing, unsafe, duplicated or its authored source or final-archive links are broken
- **THEN** packaging checks fail rather than falling back to another engine’s document

#### Scenario: Honest example reference
- **WHEN** a guide identifies the archive or published composition used to check its examples
- **THEN** it retains the exact observed reference and does not claim publication of an unlisted fixture archive or silently follow latest

#### Scenario: Render the enclosed candidate or final identity
- **WHEN** a qualified candidate or definitive distribution archive is assembled
- **THEN** documents identify that exact package/composition; preparation references are explicitly unpublished, native SQL adaptation is explained, and neither another engine guide nor fixed fixture version is shipped as the released composition

### Requirement: Traceable final package handoff

Successful packaging SHALL identify final runtime paths/sizes/SHA-256, archive identity/digest, notice/document/metadata contents, exact selected lock/engine/upstream origins/versions/digests and actual build environment/options/integration identities. The shipped manifest SHALL remain portable after removal of original build/source directories. Packaging SHALL supply the exact final assets to A-acceptance and verified payload identities to A-release, retain required default-composition handoff conventions and assert neither full acceptance nor publication readiness.

#### Scenario: Successful downstream handoff
- **WHEN** assembly and final-archive content/integrity checks succeed
- **THEN** one complete success result identifies the final bytes and their build inputs for downstream testing and publication

#### Scenario: Assembly or archive failure
- **WHEN** copying, notice inclusion, packing or final-byte checks fail
- **THEN** packaging returns failure without a success handoff, partial distribution represented as complete, or reuse of an earlier package

#### Scenario: Portable extension provenance
- **WHEN** a Vector package manifest records separate compilation/link commands
- **THEN** flags, input roles and hashes remain traceable without absolute invocation paths or reliance on the original source/object/Make-include directories

#### Scenario: New supplied distribution number
- **WHEN** the caller supplies a different package name or version
- **THEN** a fresh archive and final-file identities reflect that supplied identity and remain available for renewed downstream checks rather than relabeling previously qualified bytes

#### Scenario: Trace document rendering
- **WHEN** selected authored documents are rendered into an archive
- **THEN** the handoff identifies source document hashes, supplied identity and final document hashes, and a changed version requires fresh archive identities and applicable renewed checks
