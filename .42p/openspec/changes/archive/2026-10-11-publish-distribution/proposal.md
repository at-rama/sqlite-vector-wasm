# Proposal

## Why

The browser package and final-package acceptance path exist, but no common distribution calculation or npm/GitHub publisher exists. A-release must turn an authorized integrated candidate into a uniquely identified publication of the exact qualified payload, and supply the same calculation to later watch and candidate workflows.

## What Changes

- Add deterministic distribution version/channel calculation and publication-state reading, shared by forecasts, preparation and final publication.
- Implement independent `latest`/`next` progression, numerical upstream increments, the maturity ceiling, alpha-series continuation/closure and collision failure.
- Add a post-integration publisher that establishes the authoritative revision, calculates the definitive version, runs existing clean production/acceptance with that identity and publishes the same archive to npm and GitHub Releases.
- Carry complete composition, source/build/output identities, channel and dispatch comment into publication provenance; use normal trusted publishing and supported attestations.
- Define the input boundary for an integrated A-updates candidate and the bounded A-bootstrap handoff without implementing either allocation unit.

## Capabilities

### New Capabilities

- `distribution-release`: shared distribution calculation, publication state, authorized post-integration qualification and matching npm/GitHub publication.

### Modified Capabilities

None. Existing `browser-package` and `browser-acceptance` already accept an explicit identity and expose exact payload/evidence handoffs; they are consumed without changing their requirements.

## Impact

Planned realization: `tools/release/`, a thin `tools/release.sh`, `.github/workflows/release.yml`, release tests registered in `tools/test-repository.sh`, and contributor publication documentation. Reuse `tools/acceptance/run.mjs`, `tools/acceptance/contracts.mjs` and the existing package/build handoffs. Release fixtures and generated evidence remain ignored or external.

This Change realizes exactly `A-release`. No watch/email, candidate-dispatch/PR preparation, registry/account bootstrap, site deployment, runtime/API change, source-pin migration or general 42p evolution. Implementing the publisher does not authorize a release. A-updates and A-bootstrap are operational dependencies; their absence is not permission to publish arbitrary main pushes or introduce a recurring manual path.

The first effective publication selected by the user is stable `0.1.0` on `latest`, with two stable upstreams. Experimental calculation/publication remains in scope for subsequent releases; prerelease cases are retained for future watch/candidate use. This is not authorization to publish an initial `0.1.0-alpha.1`, nor a general prohibition of officially released prereleases.

The authorized refinement calculates each experimental required base from current `latest` and its upstream composition, then continues or replaces an open alpha series by numerical base comparison. The bounded first-npm exception keeps tagging/GitHub publication automatic, reports npm pending and verifies exact-payload completion read-only after A-bootstrap's manual operation. Steady-state publication remains automatic.

## Allocation and Capture snapshot

Start: `A-release` in [the current Allocation](../../../../engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), reconciled from PR #31 commit `cba83e761f2e4d2d203076bab0598a059a474a8a` with the explicitly adopted release refinements, SHA-256 `0f92c88a4aac0d2a2ed317c0fc23b7b6a98be44485005d3678c1b4cc230c9c73`.

Qualified portions: Distribution `C-purpose`, `C-release`, `C-autonomy`, `C-failure`, `C-bootstrap`, `R-updates`; Release/Watch `C-determinism`, `C-version-identity`, `C-semver`, `C-channels`, `C-publication`, `C-provenance`, `R-frugality`. Read their complete selected obligations, exceptions and material relationships through the Allocation's qualified links. The neighboring units supply selection/integration context, package bytes and acceptance evidence; they do not own alternative numbering policies.

Exact current Capture snapshots:

| Capture | SHA-256 |
| --- | --- |
| [Distribution](../../../../engineering/2026-10-04_sqlite-vec-wasm_capture_edit-0.1.md) | `337273bf5a887939a8f25b9c0a2739c6ab85d705e9fbaeef57953215e8309e00` |
| [Release/Watch](../../../../engineering/2026-10-09_sqlite-vec-wasm_release-watch_capture_edit-0.1.md) | `91337974c24eefbf9031aa0a9bf866763cad5cbdba2a99d3739362010e15a944` |
| [Site](../../../../engineering/2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md), Allocation input only | `4312d2c6f83bbfaae09cc9d23322d07f3d60f1e9203bc9588c4be5b24ba7b085` |

Additional authority: in this project conversation on 2026-10-10 the user selected first effective stable `0.1.0` and explicitly validated “Proposition pour les séries alpha” and “Bootstrap npm” after the PR #31 derivation review. `S-release-refinement` in the two Captures records the adopted stable-reference required-base calculation and automatic initial GitHub publication with exact-payload manual npm handoff and read-only completion check. These scoped decisions resolve the earlier underdetermination and missing bootstrap path; no public conversation permalink is available. They authorize this planning reconciliation, not implementation or real publication. Original-source-to-Capture fidelity is not audited here. The Allocation-to-Change examination is recorded in [coverage](coverage.md).
