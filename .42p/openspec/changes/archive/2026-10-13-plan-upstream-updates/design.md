# Design

## Context

See [proposal](proposal.md) for motivation and source identity. This design is required because A-watch crosses upstream discovery, Git/npm reads, candidate observation, scheduling/manual invocation and native Actions presentation/notifications. The [delta spec](specs/upstream-watch/spec.md) defines the behavior; this document selects its realization.

At source commit `8e9de3c42334e12eb065440b4155aad06391ff27`, `tools/release/policy.mjs` exports upstream comparison, channel classification and the common calculation. `tools/release/state.mjs` supplies complete paginated GitHub reads, scoped npm interpretation, provenance validation and verified channel HEADs, but its snapshot exposes only HEAD compositions. `tools/release/context.mjs` validates candidate descriptors against their source locks. Updates creates `candidate/run-<runId>-<attempt>` and `inputs/release.json`; the workflow has no pair-bearing run name. Its API run record does not expose dispatch inputs.

Current source resolution in `tools/inputs.py` is not a complete discovery inventory: SQLite selection reads current download metadata and confirms stable release logs; sqlite-vec selection reads published Releases. A-watch must observe the full available release set without invoking acquisition, source resolution that writes traces, qualification or publishing.

## Goals / Non-Goals

**Goals:** Keep selection/forecasting pure over acquired snapshots; make incomplete reads explicit; expose every eligible job and current preparation; present the plan and failure outcomes directly through native Actions mechanisms.

**Non-Goals:** Reimplement numbering, extend source admissibility, demonstrate runtime compatibility, coordinate concurrent candidates, retain refusals/proposal history, change candidate preparation or publication semantics, or evolve 42P. A-watch's metadata reader is not a substitute for A-inputs integrity or A-acceptance.

## Decisions

### 1. Small tooling modules with no new runtime distribution

Use repository-style Node.js ES modules under `tools/watch/` for discovery adapters, state/candidate observation, pure selection and Markdown rendering, with a thin `tools/watch.sh` entry point. Native Actions summary/notification mechanisms need no mail adapter, account credentials, added dependency or alternative notification infrastructure. Node 18+ matches existing tooling prerequisites; log its actual version in nonsecret run evidence. No SDK/browser installation is needed for planning.

Keep read dependencies and summary output injectable for offline verification. No generic automation framework or shared policy service is introduced. Imported modules must be side-effect-free; the watch never calls `qualify`, `prepareCandidate` or publication services.

### 2. Release identity comes from official publication evidence

For SQLite, inspect `https://sqlite.org/src/taglist` for exact `version-...` identities and their associated Fossil publication/check-in context. The generic moving `release` tag alone is insufficient: its timeline includes check-ins without exact version tags. Read the complete relevant set, not an unqualified fixed-size newest page. Check stable release identities against their official release pages; retain recorded source evidence URLs with each observation. Chronology can corroborate stable publications but does not replace the designated Fossil source.

For sqlite-vec, use complete paginated non-draft published GitHub Releases from `asg017/sqlite-vec`, checking exact tag, maturity and the official amalgamation/source-integrity metadata against A-inputs criteria. Strip only the established `v` prefix and preserve prerelease suffixes. Use `compareUpstream` for bounds/order; do not order by release date or lexical version strings.

For each relevant published Release, validate a positive safe-integer resource ID and its agreement with the official API resource URL. Check uniqueness of resource identity across the relevant paginated inventory as well as the existing uniqueness of exact versions. A repeated resource identity, even with identical fields, makes that inventory unresolved: reject it rather than silently collapsing copies or selecting one version. An ID/URL mismatch or two versions attributed to one resource fails discovery. This conservative reader rule does not change source admissibility or planning baselines. Positive synthetic fixtures must give distinct Releases distinct, mutually consistent IDs and URLs, including the integrated planning fixture; retain captured records unchanged. Negative fixtures cover repeated identities, conflicting versions and ID/URL mismatch.

No SQLite alpha/beta publication identity was established by the exploration. Its official WASM prerelease snapshot page is not sufficient evidence of an admissible released full-source identity. The reader must discriminate published prereleases from development snapshots, with fixture cases for both. If an observed purported publication cannot be classified with sufficient official evidence, stop with its nonsecret source diagnostic rather than silently treating discovery as stable-only. If realizing an admissible source requires changing A-inputs' semantics or supported acquisition contract, escalate that dependency; this Change cannot repair it locally. Discovery does not download/extract source archives or record new pins.

### 3. Shared publication snapshot plus historical composition reads

Consume `readState` unchanged for the common calculation snapshot, retaining its scoped package name, placeholder rules, HEAD/provenance and exact-byte checks. In a watch-local historical reader, inspect corresponding public distribution Releases, Git tags and npm version presence, and validate each `publication.json` with the existing identity validator and matching version/channel/commit. Return a transient set keyed by channel/status and exact upstream pair. Partial identities remain occupied in shared calculation state; they are not invented as completed historical publications. Contradictory relevant provenance fails planning.

A current HEAD alone cannot exclude all already published pairs after rollback. Reading existing provenance fixes that selection gap without a new registry. Read each required provenance once per invocation; do not download every historical runtime archive merely to recover its composition. Existing HEAD byte verification remains intact. Observation is not an atomic snapshot across services: record nonsecret observation time and references, and retain the existing strict state failure behavior when a concurrent publication is inconsistent.

### 4. Observe candidates at exact identities

Read all relevant open candidate PRs targeting this repository's `main`, from its established temporary branch pattern. Confirm that the PR introduces/updates `inputs/release.json`, so an inherited descriptor in an unrelated PR cannot establish a candidate. Read descriptor and source lock at the PR's exact head commit, validate them through the existing descriptor contract, and check preparation URL/repository. Group all matching PRs by pair; do not pick a single winner or use editable free-text PR titles as authority.

For pre-PR preparation, read queued/active `workflow_dispatch` runs of `.github/workflows/updates.yml` on `main`. Add a fixed `run-name` format to that workflow: `candidate sqlite=<exact> sqlite-vec=<exact>` for dispatches, and a separate ordinary title for PR rehearsals. GitHub permits `inputs` expressions in `run-name`; the API exposes the resulting `display_title`. Validate both extracted versions using the existing grammar and bind them to the workflow/event/repository/run ID. This is claimed in-progress selection, not qualification evidence. Never put `release_comment`, email addresses or credentials into the run name.

Deduplicate a run and its PR through the descriptor's preparation ID while preserving genuinely distinct attempts/PRs. A relevant legacy active run without a readable pair is unresolved candidate state, not evidence of no preparation; fail with its run link. Completed failed runs and closed unmerged PRs do not become refusal records. The run-name addition implements A-watch's access to its A-updates dependency only; dispatch, controls, permissions, branch creation and publication handoff stay unchanged.

Before joining candidates, validate uniqueness of each active preparation observation keyed by `(runId, attempt)` within the bound repository/workflow. Repeated keys, including identical copies, fail candidate-state acquisition instead of hiding contradictory selections or choosing a winner. Distinct attempts remain distinct. Join an active run only to an actual `kind: 'pr'` record with the matching run and attempt, retaining the existing exact-selection agreement check; never treat a previously appended run as a PR. Keep every distinct PR and attach the run to the first matching PR only; a run without a matching PR remains a standalone candidate. Test the same-run/attempt contradiction without any PR, identical repeated observations, distinct attempts and multiple matching PRs.

### 5. Pure enumeration and independent forecasts

Normalize and sort exact upstream lists, filter against the two design baselines, and enumerate their Cartesian product. Classify channel through `channelFor`; apply the spec's componentwise strict progression and no-regression rules with `compareUpstream`; exclude historical corresponding-status publications. Join current candidate state to each remaining pair. Existing candidates remain entries with run/PR links, rather than becoming invisible work.

Call `calculate` once per retained pair against the same acquired snapshot. Never update the snapshot with forecasts to pretend the maintainer will integrate jobs sequentially. Equal predicted numbers are legitimate independent possibilities, explicitly labeled unreserved. Missing stable bootstrap state or a calculation collision is an explicit diagnostic under the shared policy, not grounds for inventing another numbering rule. Sort entries deterministically by channel then component versions; source response order is irrelevant. Proposed default `release_comment` is empty, since ordinary eligibility contains no implicit rollback; manual dispatch retains its existing free-text input.

### 6. Present each outcome in the execution summary

Render readable Markdown through `GITHUB_STEP_SUMMARY`, grouped by channel, with exact versions, increment, forecast version, reference state, exact Updates parameters and `https://github.com/<repository>/actions/workflows/updates.yml`. Existing-candidate entries carry run/PR links and no suggested duplicate dispatch. A safely quoted ready-to-copy `gh workflow run` command for entries without candidates remains optional; rendering it cannot execute it. Discovery/forecasting do not establish build compatibility.

A complete zero-entry plan produces an explicit normal empty summary. On discovery/state/calculation failure, write the failed stage and sanitized available diagnostic to the summary and preserve the failing exit status; do not label an incomplete result as a complete or empty plan. Keep only nonsecret invocation evidence/plan diagnostics under ignored `.work/watch/` or CI artifacts, never as selection state for future runs. Tests cover all three summary outcomes and do not invoke a live watch.

Exercise the Release and preparation identity counterexamples through the existing injectable orchestration, not just the readers. They must yield `outcome: 'failed'` at `discovery` and `candidate state` respectively, with readable failed-stage diagnostics and no successful or empty plan. The existing CLI failure-status behavior remains required; no alternate orchestration or notification path is introduced.

Use GitHub Actions' native execution-completion notification behavior, determined by supported account capabilities/preferences. Empty-plan notifications are acceptable; the watch does not suppress them through a dedicated sender. Do not configure mail addresses, Gmail secrets or a transport, create notification issues, claim confirmed delivery, promise mobile push or require a particular native notification format. Documentation points the maintainer to the execution summary and ordinary account notification preferences; configuring those preferences remains outside this Change's automation.

### 7. Weekly and independent manual planning, read-only GitHub authorization

Use native GitHub Actions schedule `cron: '0 8 * * 5'` with `timezone: Europe/Paris`. Current GitHub workflow documentation supports IANA timezone schedules; dual UTC crons plus a local-time filter are unnecessary. The schedule is a requested execution time, not a guarantee against hosted queue delays. Scheduled execution uses the default branch with read permissions for contents, pull requests and actions, native token for authenticated reads, and no GitHub write or publishing OIDC authorization. Pin checkout/artifact actions to full commits using existing repository conventions.

Add A-watch `workflow_dispatch` independently of the Friday schedule, with no candidate-selection, channel or distribution-version override inputs. Scheduled and manual events call the same read/compute/render path; event identity and executed revision are recorded for diagnostics, without changing the planner's policy. Dispatching Watch never calls or dispatches Updates; a preparation link is navigation for a subsequent separate human action. Manual branch selection can support development checks under GitHub's supported dispatch rules; its workflow definition must be available on the default branch before hosted manual invocation. This does not authorize integration merely to enable a test.

PR validation invokes the offline suites; it does not automatically run the live watch. No preparation input, automatic keepalive, repository write or external scheduler is added. Inactivity deactivation and manual reactivation are documented rather than prevented.

## Risks / Trade-offs

- Official HTML/Fossil presentation changes -> validate complete identities and use captured source fixtures; unknown/contradictory publication evidence stops rather than narrows the inventory.
- Historical SQLite archive digests can disappear from current download metadata -> distinguish discovery from later exact-source resolution; expose insufficient source evidence and escalate A-inputs dependencies without acquiring a fallback or rewriting pins.
- Concurrent publications or candidate transitions -> tie reads to exact identities and report inconsistent state; forecasts remain snapshots, not locks or reservations.
- Several alpha releases produce a longer plan -> retain all eligible pairs as allocated; grouping and deterministic ordering aid reading without an unauthorized newest-only filter.
- Native notifications depend on GitHub/account preferences -> expose the result directly in the execution summary without claiming delivery or building a fallback transport.
- Failed summary output or incomplete reads -> preserve a failed execution and available diagnostics, never an artificial empty-plan success.

## Migration Plan

Implement on this Change's branch after authorization, including the bounded Updates metadata addition and meaningful offline suites registered in `tools/test-repository.sh`. Renew coverage after any semantic revision, complete post-Apply Verification and archive under existing repository rules before human integration. Do not rewrite historical records or change merge gates to integrate an unimplemented plan.

The post-Apply [Verification report](verification.md) failed at `c5ee5c313948bb8b23de5815f07ba9bace9c1dc1` on F1/F2. This documentary refinement, based on PR head `a02e3dd738a1915d776aac95843b7f84697c452a`, makes their local reader/join corrections explicit without changing the delta requirements. Reopened tasks track the unimplemented corrections and renewed checks. Keep the failed report as evidence for its checked candidate; a later authorized corrective Apply and distinct Verification must establish any new realization verdict. This update does not authorize either operation, live Watch dispatch or integration.

No mail configuration or notification settings are changed by this documentary revision. After implementation is separately authorized and the workflow is available under GitHub's dispatch rules, manual Watch invocation can exercise calculation/presentation independently of the cron without initiating Updates. No such execution is authorized by the present mission. Disabling the schedule stops scheduled planning; manual planning remains a distinct trigger until the workflow itself is disabled or removed. Candidate preparation/publication and refusal state are unaffected.

## Mechanism references

- [GitHub schedule timezone syntax and run names](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax), read 2026-10-13.
- [GitHub workflow-run API](https://docs.github.com/en/rest/actions/workflow-runs), [job summaries](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands#adding-a-job-summary) and [Actions notifications](https://docs.github.com/en/subscriptions-and-notifications/how-tos/managing-github-actions-notifications).
- [SQLite Fossil tags](https://sqlite.org/src/taglist), [release timeline](https://sqlite.org/src/timeline?t=release) and [SQLite download metadata](https://sqlite.org/download.html).

These sources explain mechanisms, not product authority or implementation evidence. Official-source and live-service observations from exploration are not proof of this Change's realization.
