# Design

## Context

See [proposal](proposal.md) for scope and authoritative inputs. Design is required because registry authentication, external access configuration and the initial-publication transition cross trust boundaries.

At examined main revision `32f62b8547801f8f3a21eeaed0fd41ac4c3a5abe`, `docs/candidates.md` explains native-token candidate preparation; `docs/publication.md`, `release.yml` and `tools/release/{cli,run,services,state}.mjs` already implement qualification, explicit `RELEASE_SETUP`, signed archive attestation, automatic initial GitHub publication with `npm-pending` (exit 2), and read-only `check-initial`. No active bootstrap Change or GitHub Release exists. `inputs/release.json` is absent until a real preparation creates it. Registry package absence and npm organization membership are user-reported.

The scoped package decision is authoritative user input but still conflicts with D/C-release, the synchronized Single distribution identity requirement, and hard-coded package/registry identities. This planning Change records a dependency, not a successful reconciliation. A-package/A-release own the affected product mechanisms.

## Goals / Non-Goals

**Goals:** make the existing bounded handoff executable by the maintainer, preserve exact bytes and evidence, and establish the normal secretless access disposition.

**Non-Goals:** a second publisher, a package-name migration inside A-bootstrap, candidate selection or merge automation, numbering overrides, general recovery, a token-based steady state, a new acceptance gateway or a new 42P mechanism.

## Decisions

### Reuse existing mechanisms through an operational procedure

Add `docs/bootstrap.md` and short links from publication/candidate contributor documentation. Use the existing release commands and service checks. A new script or workflow would duplicate A-release's responsibilities without a demonstrated need; authenticated settings and the one manual operation remain explicit maintainer actions.

Retain a Change-local `execution-evidence.md` containing dates, public identifiers/run links, exact source commit/version/channel, archive SHA-256, setup outcomes and completion output. Do not invent successful outcomes in advance or store credentials, OTPs, local npm configuration or browser session data. Reuse Release assets for durable payload/provenance retrieval; CI evidence has a 30-day retention period.

### Treat scoped identity as a prerequisite

The package will be public `@at-rama/sqlite-vector-wasm`; repository/project spelling remains sqlite-vector-wasm and the tag family remains `dist/v...`. Before operational Apply, reconcile the scope decision into current Capture/Allocation and affected realization contracts, then realize and verify package and registry identity changes under their owning units. Re-read those results and refresh this Change's snapshots/coverage. Do not change historical archives or publish an unscoped intermediate package. Planning file existence and strict validation cannot remove this blocker.

### Establish the initial disposition before integrating a real candidate

Inspect Actions settings and any organization restrictions before enabling native-token PR creation. The existing Updates workflow declares `contents: write` and `pull-requests: write`; Release declares publishing/OIDC/attestation permissions. Verify live settings instead of treating YAML declarations as account authorization. Set repository variable `RELEASE_SETUP=initial-manual-npm` only for the confirmed unavoidable first npm case. Required-check protection and human integration remain intact.

The maintainer selects two exact stable inputs through Updates, examines the qualified PR and chooses integration. Existing source pins are SQLite `3.53.4` / sqlite-vec `0.1.9`; these are repository facts, not a new availability check or a selection made by this proposal. The shared initial rule supplies `0.1.0` on `latest`.

### Publish only the downloaded accepted tarball

After the merged-candidate run automatically publishes GitHub, retrieve `payload.tgz`, `publication.json`, `attestation.json` and applicable retained evidence. Verify the signed archive using GitHub's supported attestation tooling and compare the archive digest/identity to the retained record. Authenticate interactively as the maintainer with npm in an isolated working directory; satisfy registry authentication/2FA requirements without placing a publishing credential in GitHub.

The intended first operation is:

```sh
npm publish /absolute/path/to/payload.tgz --registry=https://registry.npmjs.org/ --access=public --tag=latest --ignore-scripts
```

No `npm pack`, directory publish, rebuild, manual version assignment, provenance override or separate dist-tag mutation is part of this operation. Use the repository's qualified Node/npm pair for reproducibility. Local publication lacks hosted OIDC provenance; the explicit fallback is the existing signed GitHub archive and complete production records, not synthetic npm provenance.

Then invoke `sh tools/release.sh check-initial /absolute/path/to/publication.json` from the identity-reconciled checkout, using authorized GitHub read access. Record its result verbatim with exit status: npm absence remains pending, inconsistencies fail, matching destinations complete the first publication. It does not create tags or repair partial failures. Never rerun `publish` to complete the initial npm handoff.

### Configure direct trusted publication and qualify its status honestly

For the created package, configure GitHub Actions trusted publishing with organization `at-rama`, repository `sqlite-vector-wasm`, workflow filename `release.yml`, and no environment name because the current publishing job declares none. Explicitly allow direct `npm publish`; stage-only publication would introduce another recurring human approval and change the selected lifecycle. There is no separate dist-tag operation requiring an additional permission.

Current npm documentation requires the new trusted publisher to succeed within two days or expire. Coordinate creation with a forthcoming normal authorized publication; if that cannot occur in time, report expiration and recreate the configuration before that publication. Do not manufacture a release, republish `0.1.0`, or add a keepalive merely to validate access. Settings-only evidence does not prove live OIDC authorization.

After the initial completion and usable configuration, set `RELEASE_SETUP=trusted`. Record separate states: initial publication complete; trusted access configured with validation deadline; trusted access demonstrated by a later normal run. The later run remains A-release's responsibility and does not become a recurring bootstrap workflow. A full operational handoff claim requires evidence of usable setup; a demonstration claim requires an actual successful hosted publication.

Reference: [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/), inspected 2026-10-11. External requirements may change and must be rechecked at execution. The binding, direct-publish permission and expiry are execution constraints, not new product policy.

## Risks / Trade-offs

- Scoped identity divergence → block operational Apply until upstream projection and owning-unit realization are reconciled; repeat coverage on fresh inputs.
- Incorrect permissions or trusted-publisher fields → inspect live account/repository settings and record explicit failure; do not introduce credential fallbacks.
- npm receives different archive bytes → compare the exact retained SHA-256 before the operation and consume existing read-only destination checks afterward.
- A publication succeeds before a later failure → retain the partial state; no deletion, overwrite or general resume is available.
- Initial workflow exits 2 despite a valid GitHub Release → interpret the retained `npm-pending` outcome as the bounded handoff, not permission to rerun publication.
- Trusted configuration expires before validation → coordinate with the next normal release or recreate it; distinguish configuration from proof.

## Migration Plan

Complete scoped identity reconciliation first. Then establish repository access/disposition, run the normal candidate lifecycle, consume the automatic initial GitHub handoff, perform the one npm operation, check completion, and establish the trusted disposition with its validity evidence. Repository documentation changes use a PR; external operations require a separately authorized execution stage. Failed setup can be corrected before publication; successful public package versions/tags are never rolled back by deletion or overwrite. No runtime migration or permanent bootstrap service is introduced.
