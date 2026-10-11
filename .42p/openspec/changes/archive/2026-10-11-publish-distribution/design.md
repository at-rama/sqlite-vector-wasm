# Design

## Context

See [proposal](proposal.md) for motivation, exact source snapshots and the one-unit scope. The four synchronized capabilities cover acquisition, construction, packaging and acceptance; none owns distribution numbering or publication. The new [release specification](specs/distribution-release/spec.md) owns that boundary.

Observed implementation at `ccbe98f`:

- `tools/package/package.mjs` accepts explicit package name/version and supplies archive, runtime and build identities. Its notice records are version-associated; changed source pins require corresponding reviewed notice inputs before qualification can succeed.
- `tools/acceptance/run.mjs` performs fresh complete production for supplied metadata. It records the clean commit/tree, exact archive, source lock, tools, browser outcomes and a copied `payload.tgz`.
- `tools/acceptance/contracts.mjs` exports `assertApplicable` and rejects commit/payload mismatch or incomplete production/browser evidence.
- `.github/workflows/acceptance.yml` already runs on PRs/main, but ordinarily packages `sqlite-vector-wasm-acceptance-fixture@0.0.0-test`. Passing that job does not qualify the final release identity.
- Source acquisition/build now consume published sqlite-vec prereleases; this does not qualify every upstream pair. Existing notice/version and browser checks still apply.
- No release workflow, published distribution state or active Change existed when planning began. A-updates and A-bootstrap remain separate responsibilities.

## Goals / Non-Goals

**Goals:** make policy reusable without duplicating network/workflow behavior; qualify the final identity at the integrated commit; keep publication side effects behind authorization, integrity and applicability checks; expose useful exact diagnostics.

**Non-Goals:** a shared framework, version reservation service, application locking, automatic publication repair, publishing from every main push, or implementation of watch, candidate preparation, registry setup or site deployment. The repository's standards and 42p model are not changed.

## Decisions

### 1. Pure policy with small I/O adapters

Use plain JavaScript ES modules and native `node:test`, following the existing tooling. Proposed layout is `tools/release/{policy,state,context,run}.mjs`, tests under `tools/release/tests/`, and a thin `tools/release.sh`. This is a realization layout, not a new public consumer API.

The policy takes exact upstream versions and an explicit publication snapshot, returning channel, numerical signal, version/tag and reference explanation. It performs no network, writes or AI calls. State/context adapters handle Git, GitHub and npm; orchestration handles production and publication. Later A-watch/A-updates import or invoke this same calculation. Do not duplicate their discovery, pair-eligibility or PR-building behavior here.

Alternative: embed calculation in workflow expressions or three scripts. Rejected because identical-state behavior and alpha rules would drift between consumers. No npm dependency is assumed; if a SemVer dependency proves necessary, pin it and record integrity before use under the technical canon.

### 2. Published references and calculation cases

Read complete relevant Git tags, GitHub release metadata/provenance and npm versions/dist-tags, including pagination. Normalize them into one in-memory snapshot. Validate version syntax, exact channel classification and referenced commit/composition. A genuine absent initial package is different from authentication, transport, malformed-response or partial-history failure. Tags and versions from failed/partial attempts still occupy their identities; they are not successful channel references merely because they exist.

Use the current published stable version and composition as the numerical reference for stable increments and for an experimental selection's required base. Compare selected upstream numerical components independently of suffixes with that stable composition to classify the largest positive signal; absent positive progression, use PATCH. Increment the stable distribution version by that signal after applying the maturity ceiling. SQLite's official version may have a fourth maintenance component: progression confined to that component is a PATCH signal, without dropping its exact identity from provenance. Compare prerelease ordering separately from numerical signal classification. Cap MAJOR at MINOR while sqlite-vec remains `0.x`. Keep the target channel's composition for detecting explicit rollback/comment requirements and future watch eligibility; those references do not determine the experimental required base. With no publication, the selected stable initial case yields `0.1.0`; initial experimental fixtures establish no publication authority.

Preserve separate channel HEADs rather than choosing a global greatest distribution version. An experimental series remains open only while its numerical base is greater than the current stable version. If the stable-derived required base is less than or equal to that open base, retain the open base and increment its alpha counter; if greater, open the required base at `alpha.1`. With no open series, including a closed historical `next`, use the stable-derived required base at `alpha.1`. Fixtures at `latest=0.2.0` cover required `0.2.1` or `0.3.0` against open `0.3.0-alpha.2` (both yield `0.3.0-alpha.3`), and required `0.3.0` against open `0.2.1-alpha.2` (yields `0.3.0-alpha.1`). Implement the attributed examples directly; do not substitute npm default release tooling or an unconditional patch of the experimental base.

Required table fixtures include suffix-only changes, numerical PATCH/MINOR changes into prereleases, simultaneous signals, code/rebuild PATCH, rollback plus a progressing other component, the `0.4.2` maturity example, transition to vector `1.x`, stable maintenance below an advanced `next`, higher-base alpha replacement, and closure at or above a series base. The initial effective publication is the selected stable `0.1.0`; no initial experimental publication is scheduled or authorized by this Change.

Calculation validates all resulting monotonicity/series/uniqueness constraints. On a conflicting state or policy case that cannot be resolved from the attributed rules, fail explicitly and escalate rather than inventing a new increment convention. There is no persistent forecast registry, refused-pair history or secondary code version.

### 3. Integration context as a handoff, not a publication button

Use a `pull_request: closed` workflow scoped to human-merged candidates targeting `main`. The event's `merge_commit_sha` supplies the resulting authoritative revision, not the PR head, current moving main tip or event workflow checkout by default. Confirm the repository/base/merged state and expected candidate handoff through the GitHub API before any release side effect. Treat event and candidate prose as untrusted strings passed through structured arguments, never interpolated shell code.

Proposed A-updates handoff is a small candidate descriptor at `inputs/release.json`, containing a format version, exact selected upstream pair, free-text comment and preparation-run identity/link. A-updates will produce/update it from manual dispatch; A-release defines and validates its consumption only. Selected versions must match `inputs/sources.lock.json` at the integrated commit. The merged candidate must introduce or update the descriptor; its mere continuing presence cannot make unrelated PRs publish. A label or an arbitrary passing main build alone is insufficient.

This descriptor records invocation context; it contains no definitive/forecast version reservation or second source of truth for source digests. Historical candidate descriptors do not become a publication registry. Interface fixtures can exercise its reader before A-updates exists. Until a real authorized candidate supplies the handoff and A-bootstrap establishes either normal trusted setup or the bounded initial exception disposition, the workflow has no publishable integration context. Do not add a recurring release `workflow_dispatch` to compensate.

Alternative: release every `push` to main or accept a free-form workflow version/channel. Rejected because preparation/integration authority and derived channel policy would be bypassed. Choosing the candidate handoff path is a proposed technical integration interface, not a claim that A-updates is implemented.

### 4. Reproduce and accept the definitive package

Resolve state and definitive identity after integration, then run existing `tools/acceptance.sh --name sqlite-vector-wasm --version <definitive>` in a fresh clean checkout of the integrated commit. Reuse its documented system prerequisites and pinned harness. Keep the context/state adapter outside the evaluated checkout or in ignored generated state so the source remains clean. Run the applicable repository controls as well.

The orchestrator consumes the returned bundle and package handoff, verifies their identities and calls the existing applicability control with the exact commit/archive. Inspect the tarball's embedded package name/version, retained notices, runtime inventory and digests against the accepted handoff. Reject fixtures, different commits, incomplete results and changed bytes. PR artifacts are not reused as release evidence.

Refresh required publication state immediately before side effects. If the definitive calculation has changed, fail this attempt with a stale-state diagnostic; do not mutate/repack an accepted archive or retry with a different number in the same attempt. A new attempt recalculates and renews qualification. This freshness check is not a reservation or lock; Git/npm constraints remain authoritative for a race after checking.

Alternative: reuse PR-head artifacts and prove applicability across a squash merge and metadata replacement. Rejected for this first implementation because existing acceptance already supports a simpler exact-commit reconstruction. The price is another clean build/browser run after integration. This coordinates existing units without rewriting their contracts or their acceptance matrix.

### 5. One payload, complete provenance, bounded side effects

Generate concise Release notes and machine-readable publication evidence from the accepted source lock, build/package/acceptance records and integration descriptor. Include code commit, tag/version/channel, exact official origins/digests and upstream suffixes, actual tools/options/environment, archive/runtime digests and any comment. Preserve rollback explanation in Release notes. Reuse the package metadata/runtime manifest and generated release records; do not maintain a manually synchronized version file. Generated publication evidence lives under ignored `.work/release/` and as CI/Release evidence, never as committed binaries or a second numbering registry.

After all checks and supported artifact attestation generation succeed, create the new tag at the verified commit without force. Create a draft GitHub Release and upload the exact accepted archive and generated evidence without clobbering assets. In steady state, publish that archive to npm with its calculated dist-tag, then publish the GitHub draft. In the explicitly established unavoidable first-npm exception, publish the GitHub draft automatically without attempting unavailable trusted npm publication, hand the same archive/evidence to A-bootstrap and return an explicit `npm-pending` outcome. Missing GitHub authorization or mandatory qualification/attestation still fails; missing steady-state npm setup never selects this exception. Mark experimental GitHub Releases as prereleases and keep stable latest presentation coherent with the stable channel. Both destinations consume the same accepted archive; neither packs its own runtime. Fetch/inspect destination metadata and bytes before reporting complete success.

Provide a bounded read-only initial-completion check that consumes the accepted handoff and published GitHub identity, then fetches npm metadata/archive to verify version, `latest`, composition/provenance and accepted archive digest. It reports complete success only for matching destinations; absent npm stays pending, and inaccessible/inconsistent evidence produces an explicit non-success diagnostic. It creates no tag, Release, asset or npm publication and keeps evidence outside Git. This checks the expected publication after the permitted manual operation, not uniqueness for a new publication attempt. Ordinary reruns still fail on occupied identities; no general resume/repair mechanism or recurring manual publication workflow is introduced.

Proposed partial-failure handling: return failure with per-operation outcomes, identifiers and diagnostics; retain successful immutable/public side effects and evidence. Do not delete, overwrite, silently republish, skip an existing identity as success or claim cross-service atomicity. A rerun encountering an occupied identity follows collision failure. Recovery of a real partial publication requires an explicit maintainer disposition outside this Change's automatic path. This is the bounded implementation of existing failure/no-overwrite obligations, not a previously adopted automatic recovery policy.

Alternatives: destructive compensation or a resume/repair registry. Rejected for added policy/coordination and conflict with preserved published identities. GitHub and npm are distinct services; a complete-success guarantee cannot remove transport/service failures between them.

### 6. Hosted trust and initial setup boundary

Run publication on a GitHub-hosted runner with the pinned qualified Node/npm environment. Use npm trusted publishing bound to this repository and the release workflow, `id-token: write`, and no steady-state npm publishing secret. Generate supported GitHub build/asset attestations for the actual archive before publication and retain their verification references. Pin external actions to complete commits and record any additional material command versions before implementation uses them.

Primary technical references: [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/), [npm provenance](https://docs.npmjs.com/generating-provenance-statements/), and [GitHub artifact attestations](https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations). Recheck supported environment/options during Apply; these moving documents explain mechanisms and cannot change product obligations. Explicitly document any unsupported mechanism/fallback rather than assuming support or dropping attestations.

A-bootstrap configures the registry/account/trust relationship and establishes whether the unavoidable first-npm exception applies before release side effects. A-release consumes that explicit initial setup disposition together with the genuinely empty initial distribution state; an authentication error alone is insufficient. For the selected initial stable publication it supplies the accepted payload/evidence through the automatic GitHub path and implements the read-only completion check described above; it does not perform the manual npm operation or provide a permanent token/manual-publish escape hatch. Document supported initial attestation mechanisms and any unsupported npm provenance mechanism/fallback explicitly; no mandatory supported evidence is waived. No credentials, account setup or real publication are performed as part of this proposal. Least privilege separates read/qualification steps from publication credentials.

## Risks / Trade-offs

- Publication state changes during qualification → refresh state, fail on stale identity and rely on Git/npm collision failures; no application lock or silent renumbering.
- npm/GitHub fail independently → expose exact partial outcomes, preserve records and require explicit disposition rather than destructive cleanup.
- Candidate interface producer is not implemented → test its validated handoff contract locally; no unrelated integration becomes a release trigger.
- Changed upstream versions do not match existing licensing associations → existing packaging checks fail until the candidate includes reviewed notice inputs; never weaken the checks inside A-release.
- Rebuilding on the integrated commit costs CI time → it directly establishes final revision/payload applicability using the existing production path.
- Fixture tests cannot demonstrate live OIDC/publication authorization → combine offline injected-service tests, hosted nonpublishing qualification and explicit setup diagnostics; record the real-publish capability as unexercised until authorized execution.

## Migration Plan

Implement the shared policy/adapters, publisher and offline fixtures; register tests and add truthful contributor documentation. Validate production using a nonpublishing release exercise at an exact commit and explicit final identity. Keep real side effects dependent on merged candidate context and publishing setup.

After implementation, perform the normal 42p Verification and Archive before proposing integration. A-updates later supplies the defined handoff; A-bootstrap establishes initial publishing prerequisites. Their operational readiness enables the separately authorized selected stable `0.1.0` publication. Merging planning or publisher implementation alone publishes nothing.

Rollback does not roll back a published version number: select the older upstream explicitly with its required comment, produce/qualify a new advancing distribution and integrate its candidate normally. This Change never deletes a published release to restore an earlier state.
