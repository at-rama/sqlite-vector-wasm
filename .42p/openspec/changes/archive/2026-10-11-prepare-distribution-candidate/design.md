# Design

## Context

See [proposal](proposal.md) for motivation and [candidate requirements](specs/distribution-candidates/spec.md) for behavior. Design is needed because this composition spans source resolution, clean Git state, real production qualification and authenticated PR writes.

At examined main `60f7decb1184b440b3421477f6aa954c05058c14`, `tools/inputs.sh resolve` accepts exact versions and a baseline lock; it rejects pin drift. `production()` in `tools/acceptance/run.mjs` builds and checks a clean committed checkout, using fresh tool/output state. `calculate()` and `readState()` in `tools/release/` own numbering and real publication state. `qualify()` composes calculation, production, retained-payload inspection and provenance without instantiating a publisher. `descriptor()` validates the existing release handoff; its preparation reference is structurally checked, not independently authenticated as a successful GitHub run by current A-release code.

The existing acceptance dispatch accepts arbitrary package metadata and a revision but does not prepare candidate inputs or open a PR. `release.sh exercise` uses an explicit empty publication fixture, so it is not the preparation entry point. `release.sh prepare` requires a merged-PR context, so it cannot be invoked as pre-merge candidate preparation. There is no dedicated candidates capability to modify.

## Goals / Non-Goals

**Goals:** make the inspected primitives a thin, deterministic preparation path, with evidence tied to a clean candidate commit and a compatible descriptor. Keep local injected tests distinct from real hosted qualification and publishing.

**Non-Goals:** redesign the release policy, add a separate build engine, strengthen unrelated A-release run authentication, provision npm, implement watch/email, auto-merge, or evolve the 42P canon. No harness or upstream source changes are planned.

## Decisions

### Compose existing primitives in a candidate-specific entry point

Add a small Node.js orchestrator and CLI under `tools/updates/`, with a shell entry point and `.github/workflows/updates.yml`. Use existing system Node.js to start; production uses the existing pinned harness. Reuse the Python resolver through its command boundary, import `readState`/`calculate` and the nonpublishing `qualify` helper, and validate the release descriptor with the existing validator.

A separate entry point avoids pretending a dispatch is a merged event or calling the fixed empty-state exercise. Extract a narrowly shared nonpublishing helper only if the actual implementation requires it; preserve A-release behavior and tests. Inject command/HTTP/Git/PR adapters for control tests rather than requiring external services for offline checks. No library or action dependency beyond the currently pinned actions is planned.

### Freeze the candidate before qualification

Start from an exact checkout of `main` selected at invocation; record its commit. Require a human dispatch on the intended main workflow context and reject another event/ref rather than selecting from an untrusted fork. Pass both versions explicitly to the resolver with the current source lock as baseline. Preserve an unchanged lock when selecting the same pair.

Read real publication state and obtain the shared forecast before expensive production. Write only `inputs/sources.lock.json` and `inputs/release.json` as candidate product input changes. The descriptor uses schema 1, selected versions, the exact comment, and `GITHUB_RUN_ID` with its repository run URL. Validate the metadata before committing; run ID refers to this actual preparation execution, while attempt is retained in evidence.

Create a local commit on a temporary branch named from the run ID and attempt. Commit records before production so cleanliness and revision checks are meaningful. Run the canonical repository check and registered tests on the candidate; then call `qualify` with candidate context and actual publication state to produce complete real-browser acceptance, retained archive inspection and provenance. Its resulting identity is the candidate forecast; if a fresh state read changes the earlier preflight forecast, retain both state observations and explain the difference rather than reserving a number. No tracked byte changes follow qualification.

### Keep candidate evidence distinct from published provenance

Retain the existing acceptance bundle and qualification provenance in ignored output directories. Add a candidate summary relating base commit, evaluated head, run ID/attempt/URL, exact selection/comment, shared calculation inputs/result, archive digests and control results. Name any retained proposed tag as a forecast; qualification's `publication.json` is preparation evidence here, not evidence that a tag/Release/npm version exists. The descriptor does not carry a forecast version or duplicated source digest fields.

Use artifact upload on success and failure, with the existing pinned upload action, hidden files enabled and a documented 30-day retention. Persist the preparation result before pushing; update the result after branch/PR operations. The PR body links the actual run and named artifacts and states that publication recalculates on the resulting main revision. Retain one PR per preparation; include the branch/head and descriptor in current candidate state available to A-watch without a new registry or refusal-history store.

### Push and present only after qualification

Push the exact evaluated local commit with create-only, non-forced branch semantics. Create its PR targeting `main` only after all mandatory preparation controls succeed; confirm the resulting PR points to the evaluated head. Never silently update an existing candidate. A branch-name collision or ambiguous transport result is a failure with available identifiers; do not overwrite or automatically retry a different identity. A failed PR create can leave an explicitly reported branch; cleanup is a maintainer action.

The upstream behavior allows create or update; this realization selects create-only per execution to avoid invalidating another candidate's evidence. It introduces no blanket prohibition on later human edits. Any edited/rebased candidate needs fresh applicable controls before integration; old preparation evidence remains attached to its old revision.

### Use ephemeral GitHub authentication for preparation writes

Use `GITHUB_TOKEN` with `contents: write` and `pull-requests: write` for pushing the temporary branch and opening the PR. Disable persisted checkout credentials; scope any push credentials to the operation and do not retain tokens in artifacts/logs. No PAT, npm credential, publishing OIDC or external GitHub App is required by the selected design.

Repository settings must allow Actions to create PRs. Current GitHub documentation states that PRs created/updated with `GITHUB_TOKEN` trigger opened/synchronize/reopened workflows in an approval-required state: the maintainer approves those workflow runs, reviews results, then makes the merge decision. See [GitHub token behavior](https://docs.github.com/en/actions/concepts/security/github_token). This service constraint is a setup prerequisite to verify during Apply, not a product gate waiver. The human merge subsequently triggers the existing A-release closed-PR path. Do not enable automatic merge or use a privileged alternate token silently if native permissions are unavailable.

Pass dispatch values through environment variables/JSON and argument arrays, never interpolate comments/versions into executable shell text. Store only structured invocation data. Use the same full action commit pins and documented hosted prerequisites already used by acceptance/release. Add no application-level concurrency lock or version reservation.

## Risks / Trade-offs

- Candidate commit differs from GitHub's synthetic PR merge revision or final main revision → preparation evidence identifies its own head; ordinary PR controls and A-release's definitive qualification keep their existing roles.
- Publication state moves between preflight, preparation and integration → forecasts are informational, changes are explained by state inputs, and final A-release calculation/uniqueness checks remain mandatory.
- Two selected versions are valid separately but incompatible together → complete acceptance fails, diagnostics remain, and no eligible PR, patch or fallback pair is created.
- Native token lacks required repository permissions or triggered workflows await approval → fail explicitly or expose pending PR checks; document the required human action without another credential path.
- PR creation fails after a successful push → report partial branch state without a completed-candidate claim or destructive compensation.
- Qualification plus normal PR acceptance repeats expensive production → preserve existing checks initially; optimizing evidence reuse needs a demonstrated applicability argument, not a skipped gate.
- A-release currently validates run reference structure rather than querying run success → do not claim stronger assurance from the descriptor. This producer supplies a real reference and only presents fully qualified candidates; any future consumer hardening stays separately scoped.

## Migration Plan

Implement and test the orchestrator and workflow on the Change branch; perform 42P Verification and Archive before human integration. After integration, the dispatch workflow becomes available on main. Its implementation merge changes no release descriptor and is not a distribution candidate.

Verify native Actions PR permissions and the approval behavior without publishing. First real use can select the already locked stable pair; it creates the first descriptor, but its later integration/publication remains subject to A-bootstrap setup and all A-release gates. Hosted rehearsal evidence must distinguish injected controls from actual services and never use a distribution candidate merge to test permission plumbing. Revert or disable the preparation workflow if necessary; existing A-release policy remains independent, and any already created candidate branches/PRs remain reviewable rather than automatically deleted.
