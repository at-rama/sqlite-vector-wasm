# Design

## Context

See [proposal](proposal.md) for motivation and source identity. This design is required because A-watch crosses upstream discovery, Git/npm reads, candidate observation, scheduling and private SMTP delivery. The [delta spec](specs/upstream-watch/spec.md) defines the behavior; this document selects its realization.

At source commit `8e9de3c42334e12eb065440b4155aad06391ff27`, `tools/release/policy.mjs` exports upstream comparison, channel classification and the common calculation. `tools/release/state.mjs` supplies complete paginated GitHub reads, scoped npm interpretation, provenance validation and verified channel HEADs, but its snapshot exposes only HEAD compositions. `tools/release/context.mjs` validates candidate descriptors against their source locks. Updates creates `candidate/run-<runId>-<attempt>` and `inputs/release.json`; the workflow has no pair-bearing run name. Its API run record does not expose dispatch inputs.

Current source resolution in `tools/inputs.py` is not a complete discovery inventory: SQLite selection reads current download metadata and confirms stable release logs; sqlite-vec selection reads published Releases. A-watch must observe the full available release set without invoking acquisition, source resolution that writes traces, qualification or publishing.

## Goals / Non-Goals

**Goals:** Keep selection/forecasting pure over acquired snapshots; make incomplete reads explicit; expose every eligible job and current preparation; deliver the conditional plan without disclosing private configuration.

**Non-Goals:** Reimplement numbering, extend source admissibility, demonstrate runtime compatibility, coordinate concurrent candidates, retain refusals/delivery history, change candidate preparation or publication semantics, or evolve 42P. A-watch's metadata reader is not a substitute for A-inputs integrity or A-acceptance.

## Decisions

### 1. Small tooling modules with no new runtime distribution

Use repository-style Node.js ES modules under `tools/watch/` for discovery adapters, state/candidate observation, pure selection and rendering, with a thin `tools/watch.sh` entry point. Use Python's standard-library `smtplib`, `ssl` and `email` only for the SMTP adapter, called with the message through stdin and secrets through its environment. This avoids adding an npm SMTP dependency or implementing SMTP/TLS in Node. Node 18+ and Python 3.9+ match existing tooling prerequisites; log actual versions in nonsecret run evidence. No SDK/browser installation is needed for planning.

Keep read dependencies and the mail adapter injectable for offline verification. No generic automation framework or shared policy service is introduced. Imported modules must be side-effect-free; the watch never calls `qualify`, `prepareCandidate` or publication services.

### 2. Release identity comes from official publication evidence

For SQLite, inspect `https://sqlite.org/src/taglist` for exact `version-...` identities and their associated Fossil publication/check-in context. The generic moving `release` tag alone is insufficient: its timeline includes check-ins without exact version tags. Read the complete relevant set, not an unqualified fixed-size newest page. Check stable release identities against their official release pages; retain recorded source evidence URLs with each observation. Chronology can corroborate stable publications but does not replace the designated Fossil source.

For sqlite-vec, use complete paginated non-draft published GitHub Releases from `asg017/sqlite-vec`, checking exact tag, maturity and the official amalgamation/source-integrity metadata against A-inputs criteria. Strip only the established `v` prefix and preserve prerelease suffixes. Use `compareUpstream` for bounds/order; do not order by release date or lexical version strings.

No SQLite alpha/beta publication identity was established by the exploration. Its official WASM prerelease snapshot page is not sufficient evidence of an admissible released full-source identity. The reader must discriminate published prereleases from development snapshots, with fixture cases for both. If an observed purported publication cannot be classified with sufficient official evidence, stop with its nonsecret source diagnostic rather than silently treating discovery as stable-only. If realizing an admissible source requires changing A-inputs' semantics or supported acquisition contract, escalate that dependency; this Change cannot repair it locally. Discovery does not download/extract source archives or record new pins.

### 3. Shared publication snapshot plus historical composition reads

Consume `readState` unchanged for the common calculation snapshot, retaining its scoped package name, placeholder rules, HEAD/provenance and exact-byte checks. In a watch-local historical reader, inspect corresponding public distribution Releases, Git tags and npm version presence, and validate each `publication.json` with the existing identity validator and matching version/channel/commit. Return a transient set keyed by channel/status and exact upstream pair. Partial identities remain occupied in shared calculation state; they are not invented as completed historical publications. Contradictory relevant provenance fails planning.

A current HEAD alone cannot exclude all already published pairs after rollback. Reading existing provenance fixes that selection gap without a new registry. Read each required provenance once per invocation; do not download every historical runtime archive merely to recover its composition. Existing HEAD byte verification remains intact. Observation is not an atomic snapshot across services: record nonsecret observation time and references, and retain the existing strict state failure behavior when a concurrent publication is inconsistent.

### 4. Observe candidates at exact identities

Read all relevant open candidate PRs targeting this repository's `main`, from its established temporary branch pattern. Confirm that the PR introduces/updates `inputs/release.json`, so an inherited descriptor in an unrelated PR cannot establish a candidate. Read descriptor and source lock at the PR's exact head commit, validate them through the existing descriptor contract, and check preparation URL/repository. Group all matching PRs by pair; do not pick a single winner or use editable free-text PR titles as authority.

For pre-PR preparation, read queued/active `workflow_dispatch` runs of `.github/workflows/updates.yml` on `main`. Add a fixed `run-name` format to that workflow: `candidate sqlite=<exact> sqlite-vec=<exact>` for dispatches, and a separate ordinary title for PR rehearsals. GitHub permits `inputs` expressions in `run-name`; the API exposes the resulting `display_title`. Validate both extracted versions using the existing grammar and bind them to the workflow/event/repository/run ID. This is claimed in-progress selection, not qualification evidence. Never put `release_comment`, email addresses or credentials into the run name.

Deduplicate a run and its PR through the descriptor's preparation ID while preserving genuinely distinct attempts/PRs. A relevant legacy active run without a readable pair is unresolved candidate state, not evidence of no preparation; fail with its run link. Completed failed runs and closed unmerged PRs do not become refusal records. The run-name addition implements A-watch's access to its A-updates dependency only; dispatch, controls, permissions, branch creation and publication handoff stay unchanged.

### 5. Pure enumeration and independent forecasts

Normalize and sort exact upstream lists, filter against the two design baselines, and enumerate their Cartesian product. Classify channel through `channelFor`; apply the spec's componentwise strict progression and no-regression rules with `compareUpstream`; exclude historical corresponding-status publications. Join current candidate state to each remaining pair. Existing candidates remain entries with run/PR links, rather than becoming invisible work.

Call `calculate` once per retained pair against the same acquired snapshot. Never update the snapshot with forecasts to pretend the maintainer will integrate jobs sequentially. Equal predicted numbers are legitimate independent possibilities, explicitly labeled unreserved. Missing stable bootstrap state or a calculation collision is an explicit diagnostic under the shared policy, not grounds for inventing another numbering rule. Sort entries deterministically by channel then component versions; source response order is irrelevant. Proposed default `release_comment` is empty, since ordinary eligibility contains no implicit rollback; manual dispatch retains its existing free-text input.

### 6. Render once, send only after successful nonempty planning

Produce one readable plain-text email grouped by channel, with exact versions, increment, forecast version, reference state, exact Updates parameters and `https://github.com/<repository>/actions/workflows/updates.yml`. Existing-candidate entries carry run/PR links and no suggested duplicate dispatch. A safely quoted ready-to-copy `gh workflow run` command for entries without candidates is optional; its inclusion cannot execute anything. Discovery/forecasting do not establish build compatibility.

Before SMTP, finish every required read and calculation. A zero-entry successful plan records `empty` and makes no mail-adapter call or credential check. A nonempty plan reads `WATCH_MAIL_ADDRESS` and `WATCH_SMTP_APP_PASSWORD` from GitHub Actions secrets; the one address supplies sender, recipient and SMTP username. Use Gmail `smtp.gmail.com:465` with verified TLS, a finite timeout and a dedicated app password when the account permits it. Google requires 2-Step Verification for app passwords; actual availability/setup is a private deployment prerequisite, not established here. The ordinary account password is not accepted as setup.

Never emit SMTP debug traces or raw exception bodies; use sanitized error classes/statuses. Keep addresses/passwords out of command arguments, plan files, summaries and archived diagnostics. Mask secret values before operations that could emit them and ensure child-process capture cannot persist private output. Successful return records `smtp-accepted`, not confirmed inbox receipt. If acceptance is uncertain after a transport failure, record unsuccessful/uncertain outcome without automatic resend. There is no delivery registry or fallback issue.

Store only nonsecret invocation evidence and the plan under ignored `.work/watch/` or CI artifacts; record `empty`, `smtp-accepted` or failed stage, references and counts. These are diagnostics for this invocation, never state inputs for future selection. Privacy fixtures must inspect all retained output paths, including error paths, for synthetic address/password leakage.

### 7. One timezone-aware schedule, read-only GitHub authorization

Use native GitHub Actions schedule `cron: '0 8 * * 5'` with `timezone: Europe/Paris`. Current GitHub workflow documentation supports IANA timezone schedules; dual UTC crons plus a local-time filter are unnecessary. The schedule is a requested execution time, not a guarantee against hosted queue delays. Run from the default branch with read permissions for contents, pull requests and actions, native token for authenticated reads, and no GitHub write or publishing OIDC authorization. Pin checkout/artifact actions to full commits using existing repository conventions.

PR validation invokes offline suites without SMTP credentials or external delivery; the sending job is schedule-only. No manual preparation input, automatic keepalive, repository write or external scheduler is added. Inactivity deactivation and manual reactivation are documented rather than prevented.

## Risks / Trade-offs

- Official HTML/Fossil presentation changes -> validate complete identities and use captured source fixtures; unknown/contradictory publication evidence stops rather than narrows the inventory.
- Historical SQLite archive digests can disappear from current download metadata -> distinguish discovery from later exact-source resolution; expose insufficient source evidence and escalate A-inputs dependencies without acquiring a fallback or rewriting pins.
- Concurrent publications or candidate transitions -> tie reads to exact identities and report inconsistent state; forecasts remain snapshots, not locks or reservations.
- Several alpha releases produce a longer plan -> retain all eligible pairs as allocated; grouping and deterministic ordering aid reading without an unauthorized newest-only filter.
- SMTP failure after possible acceptance -> explicit uncertain failure without automatic retry; later weekly planning recomputes from source state and does not pretend exactly-once delivery.
- Gmail app passwords may be unavailable or revoked -> private setup/rotation prerequisite; fail explicitly for nonempty plans rather than switch transport silently.
- Public CI evidence can leak private values -> pass secrets separately, sanitize before output and test retained summaries/artifacts with synthetic credentials.

## Migration Plan

Implement on this Change's branch after authorization, including the bounded Updates metadata addition and meaningful offline suites registered in `tools/test-repository.sh`. Renew coverage after any semantic revision, complete post-Apply Verification and archive under existing repository rules before human integration. Do not rewrite historical records or change merge gates to integrate an unimplemented plan.

The maintainer configures the two secrets privately before enabling operational delivery. No credentials are requested in chat or committed. No email test is authorized by this Proposition; a later explicitly authorized live exercise must distinguish SMTP acceptance from inbox receipt and retain sanitized evidence. Removing/disabling the watch schedule stops future planning without changing preparation/publication or creating rollback state.

## Mechanism references

- [GitHub schedule timezone syntax and run names](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax), read 2026-10-13.
- [GitHub workflow-run API](https://docs.github.com/en/rest/actions/workflow-runs) and [Actions secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets).
- [Google app passwords](https://support.google.com/accounts/answer/185833) and [Python SMTP client](https://docs.python.org/3/library/smtplib.html).
- [SQLite Fossil tags](https://sqlite.org/src/taglist), [release timeline](https://sqlite.org/src/timeline?t=release) and [SQLite download metadata](https://sqlite.org/download.html).

These sources explain mechanisms, not product authority or implementation evidence. Official-source and live-service observations from exploration are not proof of this Change's realization.
