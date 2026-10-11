# Proposal

## Why

The qualified candidate and release paths exist, but account setup and the unavoidable first npm operation have not been realized. A-bootstrap must complete that initial handoff and establish access for subsequent automatic publication without weakening qualification or human integration.

## What Changes

- Realize exactly `A-bootstrap` through a bounded operational procedure, setup checks and identity-bound execution evidence.
- Establish GitHub preparation/publication prerequisites and the explicit initial `RELEASE_SETUP=initial-manual-npm` disposition.
- Consume A-release's automatic initial GitHub publication and publish its exact accepted archive manually to npm; invoke the existing read-only completion check.
- Configure the npm trusted publisher for this repository's `release.yml`, permit direct `npm publish`, then establish `RELEASE_SETUP=trusted`. Distinguish configured access from access demonstrated by a subsequent normal release.
- Use the user's selected public npm identity `@at-rama/sqlite-vector-wasm` after its separate upstream and implementation reconciliation. Do not publish a placeholder or an intermediate unscoped package.

## Capabilities

### New Capabilities

- `publication-bootstrap`: minimum setup, exact first-npm handoff and transition to normal trusted publication.

### Modified Capabilities

None in this Change. Existing `distribution-release` and `distribution-candidates` behavior is consumed unchanged. A-release must supply and inspect the selected scoped npm identity before this procedure can execute; affected identity consumers require assessment under their owning responsibilities, not a presumed migration of every capability.

## Impact

Planned repository outputs are `docs/bootstrap.md`, links from the existing contributor publication/candidate documentation and a Change-local execution record. External operations affect GitHub Actions settings/repository variables and npm package access/trusted-publisher settings. No new runtime dependency, publisher, numbering policy, repair mechanism or recurring manual release workflow is proposed.

Allocation input: [current global Allocation](../../../../engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), SHA-256 `0f92c88a4aac0d2a2ed317c0fc23b7b6a98be44485005d3678c1b4cc230c9c73`, resolved at `main` commit `32f62b8547801f8f3a21eeaed0fd41ac4c3a5abe`; stable handle `A-bootstrap`.

The user selected the scoped package in the 2026-10-11 exploration: “Non non je veux qu'il y ait le préfixe”. Account, organization `@at-rama`, Developers membership and package absence are user-reported, not authenticated access evidence. This request authorizes planning only, not external setup, candidate dispatch, merge or publication.

**Operational prerequisite:** the product remains sqlite-vector-wasm; its selected public npm identifier is `@at-rama/sqlite-vector-wasm`. D/C-release does not prescribe an unscoped npm name, and this decision does not rename the product. A-release currently supplies `sqlite-vector-wasm` and reads/checks that registry identity; correct those mechanisms and assess their actual consumers under the owning allocation units before executing bootstrap. A-package already accepts a supplied valid scoped name; reassess applicability without presuming a code or contract change there. Record the distinct identities and the explicit user decision, preserving historical evidence. Re-read current inputs and repeat coverage for any material revision; update fingerprints only when their source bytes change. This Change neither implements the A-release correction nor claims the operational prerequisite has been satisfied.
