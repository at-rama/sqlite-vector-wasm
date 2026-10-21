# browser-package Specification

## Purpose

Assemble the canonical browser runtime from A-build into a consumer-ready distribution with working asset resolution, upstream notices and traceable final bytes. This capability realizes `A-package` and supplies A-acceptance and A-release.

## Requirements

### Requirement: Complete conservative runtime assembly
The distribution SHALL retain the complete pinned canonical browser runtime from the selected A-build composition, including all required loaders, Worker1/promiser variants, proxies and WASM assets. It SHALL preserve upstream names, bytes and relative layout, expose supplied bundler variants, include exactly one selected vector engine, and exclude demos, benchmarks, test applications, intermediate engines and optional experimental variants.

#### Scenario: All retained loading surfaces
- **WHEN** the final distribution is inspected
- **THEN** conventional JavaScript, ESM and supplied bundler-friendly loaders and their Worker1/promiser companions, the shared WASM and required proxies are accessible directly

#### Scenario: Unrelated build files
- **WHEN** upstream build directories contain demos, benchmarks, tests, sources or intermediates alongside the required runtime
- **THEN** the distribution contains only the defined runtime and its package metadata, notices and consumption documentation

#### Scenario: Selected-engine archive
- **WHEN** the recorded Vector composition is assembled
- **THEN** all eleven canonical runtime files retain their A-build bytes and filename subpaths, with no second engine or consumer wrapper

### Requirement: Consumer-ready distribution envelope
Packaging SHALL supply an npm-compatible archive usable for npm publication and GitHub Release download, with the same runtime payload for both channels and no consumer native/WASM compilation. It SHALL carry explicit supplied package identity and actual composition metadata without selecting A-release's version/revision/publication policy. Product documentation SHALL use the current root `README.md` and complete `docs/usage.md` shared with GitHub and the site, copied byte for byte to the same archive paths. Loading, Workers and storage guidance SHALL be integrated editorially into Usage, without separate common/engine guides or generated prose overlays. The supplied identity and selected upstreams SHALL remain traceable through package/runtime metadata and document records, without inventing registry publication or silently rewriting an authored example reference.

#### Scenario: Consumer installation and download
- **WHEN** the archive is installed locally as an npm package or extracted for static hosting
- **THEN** the complete browser assets are available without compiler tools, install-time builds or upstream acquisition

#### Scenario: Supplied identity
- **WHEN** packaging is invoked with a valid package name and project version
- **THEN** the generated package metadata carries those inputs and identifies the included upstream versions without claiming a tag, registry publication or accepted release

#### Scenario: Documentation follows composition
- **WHEN** an archive is assembled from a selected-engine handoff
- **THEN** its README and Usage are byte-identical to the canonical files from the same source revision, describe native SQLite-Vector usage, and preserve their complete authored content instead of selecting shorter package-specific guides

#### Scenario: Documentation source or link failure
- **WHEN** a required canonical document is missing, unsafe, duplicated or its authored source or final-archive links are broken
- **THEN** packaging checks fail rather than falling back to another engine’s document

#### Scenario: Honest example reference
- **WHEN** a guide identifies the archive or published composition used to check its examples
- **THEN** it retains the exact observed reference and does not claim publication of an unlisted fixture archive or silently follow latest

#### Scenario: Preserve canonical content for candidate and final archives
- **WHEN** a qualified candidate or definitive distribution archive is assembled
- **THEN** package/runtime metadata and document records identify that exact package/composition, the README and Usage retain their source bytes and truthful example references, and no second engine guide or separate browser guide is shipped

### Requirement: Preserved behavior and glue boundary

Packaging SHALL preserve the selected A-build composition's browser APIs, native SQL/vector semantics, default capabilities and storage limitations. Glue SHALL only initialize, locate or expose upstream functionality. It SHALL NOT add an application API, SQL abstraction, ORM, FluidJ behavior, runtime engine selector, simultaneous-engine payload, Node.js/native/WASI runtime, upstream patch or silent transient-storage substitution for requested persistence.

#### Scenario: Direct upstream use
- **WHEN** a consumer initializes the packaged runtime through its upstream loading surface
- **THEN** the same upstream initialization/API behavior and the statically integrated selected engine’s native functionality remain available without a new wrapper or consumer extension registration

#### Scenario: Unavailable requested persistence
- **WHEN** a requested persistent VFS lacks its required Worker, browser or hosting conditions
- **THEN** upstream failure or unavailability remains observable without silently opening transient storage

#### Scenario: Packaging requires a semantic change
- **WHEN** working packaging would require an upstream patch, altered behavior or omission of a retained capability
- **THEN** the incompatibility is escalated for an upstream authority revision rather than repaired by local reinterpretation

### Requirement: Traceable final package handoff
Successful packaging SHALL identify final runtime paths/sizes/SHA-256, archive identity/digest, notice/document/metadata contents, exact selected lock/engine/upstream origins/versions/digests and actual build environment/options/integration identities. The shipped manifest SHALL remain portable after removal of original build/source directories. Packaging SHALL supply the exact final assets to A-acceptance and verified payload identities to A-release, reject obsolete sqlite-vec/default-composition handoff conventions and assert neither full acceptance nor publication readiness.

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

#### Scenario: Trace canonical document copies
- **WHEN** canonical authored documents are copied into an archive
- **THEN** the handoff identifies equal source/final document hashes and the supplied package/composition identity; changed source bytes invalidate prior package evidence, while a changed package version still requires a fresh archive and applicable renewed checks

### Requirement: Generated outputs remain uncommitted
Generated SQLite JavaScript/WASM, package assemblies, archives and execution reports SHALL remain temporary and uncommitted. Only repository-controlled packaging inputs, code, tests, documentation and notice records SHALL enter source control; the SQLite/SQLite-Vector distribution SHALL remain constructible without unpublished files or necessary pre-existing package outputs. Sources of documentation and notices SHALL be explicit and reproducible from repository inputs.

#### Scenario: Clean checkout packaging
- **WHEN** documented prerequisites and a fresh successful A-build handoff are available from a clean checkout
- **THEN** packaging can construct the defined contents from repository-recorded inputs without an earlier package or required cache

#### Scenario: Repository exclusion
- **WHEN** packaging completes or fails
- **THEN** its generated files remain in ignored or external temporary storage and are not committed as implementation inputs

### Requirement: Vector-only validated build input
Packaging SHALL consume an explicit successful A-build handoff for the SQLite/SQLite-Vector composition only and verify its selected repository-recorded lock, exact engine/component identities, origins, versions/digests, actual build-input identities and complete runtime inventory against the repository state being packaged. Each consumed file SHALL match its declared size and SHA-256. Missing, altered, unsupported, stale or ambiguous input SHALL fail packaging without fallback, recompilation or earlier outputs.

#### Scenario: Matching constructed runtime
- **WHEN** the handoff identifies the recorded source pair and every expected runtime file matches its declared size and digest
- **THEN** packaging consumes those exact files without acquiring a different engine or compiling another runtime

#### Scenario: Invalid handoff or changed bytes
- **WHEN** the handoff is incomplete, unsupported, inconsistent with recorded inputs, or declares missing, duplicate, unsafe, nonregular, empty or altered runtime files
- **THEN** packaging fails without a successful package result or substitution of previous output

#### Scenario: Current composition only
- **WHEN** packaging receives a valid recorded SQLite-Vector build handoff
- **THEN** it consumes only that exact composition; sqlite-vec, mixed-engine or legacy-only handoffs fail without conversion or fallback

#### Scenario: Conflicting composition or stale integration input
- **WHEN** selected lock bytes, engine metadata, exact origins/versions/digests or used template/integration identities disagree
- **THEN** packaging fails before assembly without substituting the default lock or accepting another engine

### Requirement: Vector-only independent packaged asset resolution
Final packaged loaders, workers, promisers and proxies SHALL resolve their companion assets under the pinned upstream's supported browser/hosting conditions from the documented package layout for SQLite-Vector. Resolution SHALL work independently of temporary build/source directories. Supplied bundler variants SHALL remain accessible without promising compatibility with every bundler.

#### Scenario: Relocated extracted distribution
- **WHEN** the final archive is extracted separately and hosted at a non-root URL prefix using the documented upstream loading mechanisms
- **THEN** each retained loader, Worker1/promiser variant and applicable OPFS proxy resolves its packaged companions without fetching files from the build tree

#### Scenario: Missing companion
- **WHEN** a required WASM, Worker or proxy companion is removed from an extracted test copy
- **THEN** the affected requested capability does not initialize successfully and the packaging check reports failure

#### Scenario: Native SQL transports
- **WHEN** the Vector composition’s extracted archive is tested through conventional, ESM and bundler loading, direct C/OO1 connections, Workers, Worker1 and promiser
- **THEN** exact engine identity and native deterministic queries work without consumer extension registration and every runtime request resolves packaged assets

### Requirement: Vector-only complete licensing material
The distribution SHALL include the required licensing notices for its actual SQLite, selected engine, incorporated dependencies and generated runtime/glue, and retain embedded notices. Notice material SHALL have traceable recorded source/version-or-revision associations and validated digests. Repository-authored licensing material SHALL distinguish its own license from included upstream terms. Missing, unestablished, mismatched or altered required notices SHALL prevent a successful package result.

#### Scenario: Upstream archive lacks license files
- **WHEN** a verified source archive omits license texts required for binary redistribution
- **THEN** the package includes version-associated, repository-recorded upstream notice material with traceable origins rather than relying on that archive's contents alone

#### Scenario: Extracted license inventory
- **WHEN** the final archive is extracted
- **THEN** its required SQLite, selected engine, incorporated dependency and included generated-glue licensing material is present alongside repository-authored license information

#### Scenario: Incorporated dependency attribution
- **WHEN** the selected extension incorporates third-party code whose required notice is not supplied in its released source view
- **THEN** version-associated immutable provenance and required notice material are established and recorded before successful packaging; an unresolved association fails

#### Scenario: Applicable Vector notices only
- **WHEN** the current Vector payload is packaged and its notice inputs are checked or refreshed
- **THEN** it includes the verified SQLite, Vector, FP16 and toolchain/generated-glue notices actually required by its bytes; obsolete sqlite-vec-only notice inputs and helper conventions are removed without weakening provenance checks
