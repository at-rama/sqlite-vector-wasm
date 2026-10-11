# Bootstrap execution evidence

## State and evidence boundary

Examined on 2026-10-11. Initial publication is **complete**, supported by the maintainer's successful read-only destination check after the A-release correction in #36. Bootstrap as a whole remains **in progress**: trusted-publisher configuration and the normal repository disposition are not yet observed. The earlier preparation assessment and its pending observations below are historical; the subsequent operational record updates their dispositions without claiming an agent-authenticated npm session.

Follow [the bootstrap procedure](../../../../docs/bootstrap.md). Record dated observations, public identifiers and sanitized outputs here; retain raw non-secret reports/assets outside Git or in ignored `.work/`. Never include tokens, OTPs, npm configuration files, browser sessions or credentials.

## Dependency assessment — task 1.1

The source is PR #33 at `a402561dc0d644d87592ebcf6f0f2c0e9074d596`, incorporating main merge `d6d4fbccf7fa28e089b1d10d7b6c14887a8ac4c4` of [#34](https://github.com/at-rama/sqlite-vector-wasm/pull/34). All 189 tracked files were acquired through GitHub repository access and independently matched against their Git blob SHAs before local checks. Local Git history was reconstructed for checking; it is not the remote commit history. No real production qualification was run in this session.

The current [Allocation](../../../engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md) remains SHA-256 `0f92c88a4aac0d2a2ed317c0fc23b7b6a98be44485005d3678c1b4cc230c9c73`, unit `A-bootstrap`. Recomputed Capture fingerprints match its inputs:

| Input | SHA-256 |
| --- | --- |
| Distribution, edit-0.1 | `337273bf5a887939a8f25b9c0a2739c6ab85d705e9fbaeef57953215e8309e00` |
| Site, edit-0.1 | `4312d2c6f83bbfaae09cc9d23322d07f3d60f1e9203bc9588c4be5b24ba7b085` |
| Release/Watch, edit-0.1 | `91337974c24eefbf9031aa0a9bf866763cad5cbdba2a99d3739362010e15a944` |

No input bytes or product obligations changed. The pre-Apply derivation review confirmed both directions for the six requirements; [coverage](coverage.md) retains their detailed attribution. The older unscoped implementation observations in proposal/design/coverage are explicitly tied to their pre-#34 examination. They do not describe the present dependency state.

| Owning contribution inspected | Current finding |
| --- | --- |
| A-release calculation, `tools/release/policy.mjs` | Supplies `@at-rama/sqlite-vector-wasm` for stable and experimental identities. |
| Provenance and qualification, `tools/release/run.mjs` | Carries that supplied name and rejects mismatched package/acceptance identities. |
| Registry and provenance readers, `tools/release/state.mjs` | Queries `@at-rama%2fsqlite-vector-wasm`; validates top-level and version names and publication provenance. |
| Completion and normal verification, `run.mjs` / `services.mjs` | Consume the same scoped registry reader and compare channel, size and exact archive digest; completion is read-only. |
| A-updates, `tools/updates/run.mjs` | Imports A-release calculation and qualification; does not introduce an identity producer. |
| A-package contract and `tools/package/package.mjs` | Accept supplied valid identity; scoped packing/installation/subpath fixtures already exist. No migration is needed. |
| Synchronized distribution-release spec | Explicitly names the scoped identifier; product and repository spelling remain unchanged. |

The registered offline entry point `sh tools/test-repository.sh` was renewed on the reconstructed source snapshot with system Node.js `24.19.0`, npm `11.9.0`, Python, Bash, tar/unzip and a native C compiler. All **167 tests passed**, with no skipped Node tests: gates 43, acquisition 31, build 28, packaging 11, acceptance controls 9, release controls 26 and candidate controls 19. This includes scoped endpoint/identity rejection, exact-byte completion controls and offline scoped package installation/resolution. These fixtures establish mechanism checks, not live registry access or acceptance of a forthcoming integrated candidate.

At that preparation assessment, the identity dependency was satisfied and external execution remained pending. No protected canon, Capture, Allocation, synchronized spec, implementation or historical record was changed by that assessment.

## Operational observations — tasks 2–4

Setup observations below are attributed to their actual observer. The initial observations retain what was known at preparation; the completed operational stages follow them. Trusted access remains pending.

### Initial setup observations, 2026-10-11

- At 13:50 Europe/Paris, the maintainer reported npm username `jpbourgeon`, Owner of organization `at-rama`, Owner of its default Developers team, package absence and enabled 2FA using a passkey. These are maintainer browser observations, not an agent-authenticated npm session. Interactive CLI authentication and the actual publication authorization remain unobserved.
- At 14:17 Europe/Paris, following correction of the earlier settings transcription and the organization/repository setup steps, the maintainer confirmed Actions PR creation enabled and repository variable `RELEASE_SETUP=initial-manual-npm`. The corrected default token setting was read-only contents/packages; workflow jobs declare their required elevated scopes explicitly. The connector does not support the Actions permissions endpoint, so no independent API settings read-back is claimed.
- At `2026-10-11T12:18:30.254Z`, an independent public GET of `https://registry.npmjs.org/@at-rama%2fsqlite-vector-wasm` returned HTTP `404`, body `{"error":"Not found"}`. This establishes public package absence at that instant, not authenticated publication rights.
- Repository API reads identified public repository visibility and protected `main` at `d6d4fbccf7fa28e089b1d10d7b6c14887a8ac4c4`. No branch protection or ruleset was modified. This read does not independently establish every required-check setting.
- Inspected `updates.yml` declares native-token `contents: write` and `pull-requests: write` for preparation on hosted `ubuntu-24.04`; `release.yml` declares publishing `contents: write`, `id-token: write` and `attestations: write`. Live PR creation and hosted release/attestation authorization remain to be demonstrated by the applicable runs. No permanent npm publishing token was added by this Apply work.

At that initial assessment, tasks 2.1–2.2 remained pending and the next stage was Updates preparation. The subsequent runs and authenticated publication below supply their execution outcomes. Integration and publication retain their distinct human authority boundaries.

| Stage | Required non-secret observations |
| --- | --- |
| Initial npm access, 2.1 | Authorization reference/date; authenticated username; organization role and creation/publication rights; applicable 2FA prerequisites; exact scoped registry HTTP status/body and observation time. |
| GitHub setup, 2.2 | Authorization reference/date; organization/repository native-token PR policy; protected-main controls; hosted publication/OIDC/attestation permissions; saved `RELEASE_SETUP=initial-manual-npm` read-back. |
| Integrated initial handoff, 3.1 | Selected stable upstreams; actual preparation run ID/URL and candidate PR/head; human integration reference; authoritative 40-character commit; qualification/publication run ID, attempt and URL; complete mandatory control results; tag/Release identifiers; `outcome.json` status and operations. |
| Exact accepted archive, 3.2 | Asset retrieval time/URLs; package name/version/channel; archive size and SHA-256; qualification/source/build/browser record references; GitHub CLI version; signer/source policy; signature verification output and exit status; metadata/digest comparison outcome. |
| Manual npm operation, 3.3 | Separate publication authorization reference/date; verified qualified Node/npm versions; exact archive digest immediately before publication; non-secret command/result/exit status; registry version/channel observation; explicit absence of local hosted npm OIDC provenance and use of signed GitHub archive/qualification fallback. |
| Read-only completion, 3.4 | Invocation time, retained `publication.json` reference; sanitized output and exit status; matching GitHub/npm identities and archive; disposition `complete`, `npm-pending` or failed; no publication side effects. |
| Trusted access, 4.1 | Configuration time/read-back; package, `at-rama` / `sqlite-vector-wasm` / `release.yml`, empty environment and direct-publish action; current npm expiry rule and validation deadline; usable/expired disposition; recreation requirement if applicable. |
| Normal disposition, 4.2 | First-publication completion reference; usable trusted-setup reference; `RELEASE_SETUP=trusted` read-back/date; absence of steady-state npm publishing token/manual path; any later actual hosted-publication run and outcome, or explicit demonstration pending. |

First npm publication: **complete**; see the dated operational record below. Trusted access: **configuration not observed**. Hosted trusted publication: **not demonstrated**. Pending trusted fields supply no settings or OIDC authorization proof.

### Completed initial operation, 2026-10-11 — tasks 2.1–3.4

The maintainer authorized and performed the external stages interactively in the conversation: initial account/settings setup, ordinary candidate integration and the one exact-archive npm operation. Evidence here distinguishes maintainer terminal/browser observations from connector metadata and the agent's public registry read. Credentials and login configuration are excluded.

**Initial access, 2.1–2.2.** The maintainer's account/organization/2FA and saved variable observations above are supplemented by verified-harness `npm whoami --registry=https://registry.npmjs.org/` returning `jpbourgeon`, and the successful public scoped publication below. These demonstrate actual creation/publication access for this package. The earlier scoped HTTP 404 records absence before creation; it is not a current absence claim. Native-token preparation created candidate #35, and the hosted release produced its tag, Release and signed archive attestation. These actual operations corroborate the permissions exercised by the declared jobs. The Actions settings endpoint is unavailable to the connector; the saved settings read-back remains attributed to the maintainer, not an independent administration API audit. No protection change or persistent npm publishing token was introduced by this work.

**Integrated handoff, 3.1.** The maintainer selected SQLite `3.53.4` / sqlite-vec `0.1.9`, confirmed preparation green and integrated [candidate #35](https://github.com/at-rama/sqlite-vector-wasm/pull/35). [Preparation run 38139256624](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38139256624) produced candidate head `b577506d67c5f1ee750cacda84ad4a48587bc3cb`. The authoritative integration is `ef202b77e120332703ebeba67501ea91bfab667e`, source tree `2c2d9a924bd52b82415187146fcf780a37362c11`. [Release run 38139932466, attempt 1](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/38139932466) qualified that integrated source and reported the bounded `npm-pending` outcome, exit 2. The maintainer confirmed all GitHub operations succeeded; the red publishing step therefore records the initial exception, not a failed qualification or permission bypass.

The maintainer printed the validated published `publication.json`: scoped name `@at-rama/sqlite-vector-wasm`, `0.1.0`, `latest`, `dist/v0.1.0`, signal `INITIAL`, initial true and the authoritative commit above. All nine acceptance stages (`checkout`, `install`, `tools`, `deps`, `smoke`, `build`, `package`, `browser`, `bundle`) passed with a clean source. Acceptance report SHA-256 is `d8a3f8c3d4460ca06eeebb0208f8e159510a12126c89ebcc7ba803096d00f410`; source-lock SHA-256 is `4dfa30a7af5cee2e09d7021a48f904de8f3d295367ccc80db95f9c448ebec1c8`. The record retains source archive URLs/digests, build tools/options, runtime inventory and Chrome `153.0.8010.12` with secure context/cross-origin isolation, COOP `same-origin` and COEP `require-corp`. This is the real published qualification record supplied by the maintainer, not a new agent production/browser rerun.

The resumed connector read confirms #35's merge commit and Release assets. The release run API reports workflow head `b577506d67c5f1ee750cacda84ad4a48587bc3cb`, distinct from the authoritative integration selected and qualified by the release context; the published provenance and canonical completion bind the distribution to `ef202b77…`. Its overall conclusion is `failure` because the initial publishing disposition exits 2; no overall green release-run conclusion is claimed.

Connector observations identify [published Release 409659401](https://github.com/at-rama/sqlite-vector-wasm/releases/tag/dist/v0.1.0) and its commit-type tag at the authoritative commit. Release assets: `payload.tgz` (630720854), `publication.json` (630720882) and `attestation.json` (630720906). Workflow artifacts are `release-qualified-38139932466-1` (11701454890) and `release-outcome-38139932466-1` (11703360270); their temporary availability must not be inferred indefinitely from these identifiers. Durable Release assets and the sanitized observations recorded here remain the handoff references.

**Accepted bytes and signed evidence, 3.2.** In the Codespace, the maintainer downloaded the three Release assets into an external temporary directory and validated `publicationIdentity` against the independently identified commit. `gh` version was `2.100.0 (2026-09-03)`. Archive attestation verification reported `Verification succeeded`, one matching attestation: SLSA provenance v1, repository `at-rama/sqlite-vector-wasm`, source digest `ef202b77e120332703ebeba67501ea91bfab667e`, signer/build workflow `.github/workflows/release.yml@refs/heads/main`, GitHub Actions OIDC issuer and GitHub-hosted runner policy. The SHA-256 check reported `payload.tgz: OK`; package metadata, size, digest and repository identity checks reported success.

The accepted archive is exactly **1,147,792 bytes**, SHA-256 `f730ffe041730f8f98306004e488fe97dd64bf08646c380d1a7a30f033a80ff9`. No rebuild or repack was used. The signed check's terminal output is maintainer-supplied; the agent did not independently execute its cryptographic verification. The connector only reads Release asset metadata, not binary bytes. The later successful canonical check below compares actual bytes from both destinations.

**One manual npm operation, 3.3.** The maintainer installed and checked the qualified Node.js `24.19.0` / npm `11.17.0` harness. Missing Chrome system libraries were resolved before the final identity check succeeded; harness identity checking is distinct from the already retained product acceptance. Interactive authentication returned `jpbourgeon`. The supplied command published the downloaded tarball through the verified harness with `--registry=https://registry.npmjs.org/ --access=public --tag=latest --ignore-scripts`. The maintainer reported:

```text
npm notice Your package is being processed and may take a few minutes to become available.
+ @at-rama/sqlite-vector-wasm@0.1.0
Code de sortie : 0
```

The transcript supplies the outcome correlated with the instructed command; it does not supply a separately captured shell invocation log. Local publication supplies no hosted npm OIDC provenance. Its explicit fallback is the verified GitHub signed archive and retained complete source/build/acceptance record. The registry-created `0.0.0-stage` placeholder was not another maintainer publication and was not removed or republished. No ordinary publisher rerun, version override or dist-tag repair was used.

**Read-only completion, 3.4.** The first check returned `npm-pending`, exit 2; a subsequent check failed on `Unsupported distribution version: 0.0.0-stage`, exit 1. These unsuccessful outcomes were retained, and the reader defect was corrected separately in A-release [#36](https://github.com/at-rama/sqlite-vector-wasm/pull/36). An intervening attempt failed on an unset asset-directory variable (`/publication.json`, ENOENT), which was input acquisition failure, not a destination result.

The maintainer then retrieved the original published `publication.json` into a fresh directory and ran corrected `sh tools/release.sh check-initial "$bootstrap_assets/publication.json"`. At `2026-10-11T17:41:40+02:00`, the reported output was:

```text
{"status":"complete","version":"0.1.0"}
Code de sortie : 0
```

The [archived correction execution account](../archive/2026-10-11-recognize-npm-stage-placeholder/execution-evidence.md), section “Maintainer Codespace execution: task 3.2 completed”, retains the exact retrieval/check command, earlier failure, output and evidence limits. The checkout/up-to-date messages and independently observed branch head correlate execution with corrected tool commit `f19514f999189b653b5a38fd14e1c88ae7902c3d`; no separate maintainer `git rev-parse` output or process-start timestamp was supplied. That tool revision is distinct from the original published commit. Shared reader SHA-256 is `4c0f865f9a2b8b3f105bf9315fb1f4e57f9943e3c05bd181c8aaed7b815dd5aa`.

The actual successful canonical check establishes matching authoritative tag/Release/provenance, real npm version/channel and exact archive size/SHA-256 across GitHub/npm. It invokes no publication, tag creation, repacking or repair. The agent's earlier independent registry-byte observation at `2026-10-11T15:36:36.306Z` also found `latest=0.1.0` and the accepted archive size/digest; it is corroborating partial evidence, not a substitute for the canonical check.

### Resume after #36 integration — tasks 4.1–4.2 pending

The maintainer integrated #36 into main `5dfe31075d0089fec59250b1212dae8c75f6dbe5` and updated #33 to `6adc1c4053dd59442ad1d081f71bdb9999a9f036`. The reconstructed local tracked snapshot matches that remote tree exactly, `fc215a72bd8cf1fcc571bbb7e674509be924261c`; its synthetic Git history is only for checks. The correction and its archived evidence are present; Allocation/Capture inputs and A-bootstrap requirements remain unchanged.

The npm trusted publisher's saved binding/action/configuration time has not been supplied, and `RELEASE_SETUP=trusted` read-back is not observed. Both tasks remain open. Official [npm trusted publishing documentation](https://docs.npmjs.com/trusted-publishers/) was rechecked at this resumed stage: bind `at-rama` / `sqlite-vector-wasm` / `release.yml`, leave environment empty for the current job and explicitly permit direct `npm publish`. A newly created connection must first publish successfully within **2 days**, or expires; record its actual configuration time/deadline and recreate an expired connection before a normal release. No release is forced to demonstrate access. Configured/usable access and demonstrated hosted OIDC publication remain distinct dispositions.

## Scenario dispositions — task 5.1

Initial success scenarios are supported by the operational record above. Negative-path dispositions distinguish actually observed failures from controls examined in code/offline tests; no account failure or bad-payload publication was forced against live services. Trusted-transition scenarios remain pending.

| Requirement / scenario | Current evidence disposition |
| --- | --- |
| Explicit minimum publication setup / Package does not yet exist | Prior HTTP 404, maintainer settings read-back, actual native-token candidate and hosted signed handoff, authenticated scoped publication; 2.1–2.2 supported. |
| Explicit minimum publication setup / Setup is unavailable | Stop behavior examined in the procedure and supplying controls; unavailable account/attestation permission was not forced live. No recurring credential fallback was introduced. |
| Preserve human integration and complete qualification / Authorized initial stable candidate | Human-integrated #35 and release qualification at `ef202b77…`, all nine retained acceptance stages passed; 3.1 supported. |
| Preserve human integration and complete qualification / Candidate is unmerged or qualification failed | Procedure and supplying lifecycle controls prohibit publication; real publication consumed the integrated qualified handoff. No unmerged/failed candidate was published as an experiment. |
| Exact bounded first npm operation / Initial GitHub publication is npm pending | Actual initial exit 2, successful GitHub operations, signed accepted bytes and one manual npm success; 3.1–3.3 supported. |
| Exact bounded first npm operation / Handoff is missing or inconsistent | Actual identity/signature/digest checks succeeded. Stop behavior examined in procedure and supplying exact-byte failure tests; a corrupt handoff was not submitted live. |
| Consume read-only completion evidence / Destinations match | Actual corrected `complete` output, exit 0, original `0.1.0`/`latest` authoritative identity and exact bytes; 3.4 supported. |
| Consume read-only completion evidence / npm is absent or inconsistent | Actual `npm-pending` exit 2 and reader/input failures were retained; no publisher repair was invoked. #36 resolved the placeholder defect before canonical completion. |
| Supported publication evidence remains explicit / Local first npm publication | Maintainer signature verification and retained complete qualification support the explicit local fallback; npm hosted OIDC provenance is not claimed. |
| Transition to normal trusted publication / First publication completed and trusted access configured | Initial completion established; saved usable binding, deadline and normal-disposition read-back pending, 4.1–4.2. |
| Transition to normal trusted publication / Trusted access expires or lacks the required action | Pending actual settings/deadline assessment; procedure reports unready setup and correction without a forced release. |

## Documentation checks

Official npm publish, scoped public package, login, configuration and trusted-publisher documentation, and GitHub CLI attestation verification documentation were read on 2026-10-11; exact links are in [the procedure](../../../../docs/bootstrap.md). Tarball publication/access/channel/script flags, signer/source verification, binding fields, direct-publish permission and the two-day initial validation deadline agree with those references and inspected repository commands. Recheck moving requirements at operational execution.

All local links resolve; seven shell blocks pass Bash syntax checking, and the embedded JavaScript and Python pass syntax checks. `sh tools/check-repository.sh` passed on the staged procedure/evidence snapshot, including operational-canon byte identities and Capture/Allocation input fingerprints. OpenSpec CLI `1.14.0`, installed outside the checkout, returned **7 passed, 0 failed**, exit 0, for `OPENSPEC_TELEMETRY=0 openspec validate --all --strict` from this checkout's `.42p`. A prior validation displayed the same results but its process wait was rejected by automatic approval review because of telemetry to `edge.openspec.dev`; the completed rerun used the CLI's verified environment opt-out, which also suppresses its version-check network request. Its project-root check, status and Apply instructions resolved the same local project and `spec-driven` Change; no Store or generated skill refresh was used. Informational notices about existing long requirement text do not change that structural result.

Task 5.1 remains complete for documentation checks and explicit scenario dispositions. Resumed Apply progress is **10/12**: tasks 1.1–1.3, 2.1–2.2, 3.1–3.4 and 5.1 complete; 4.1–4.2 pending. Canonical repository checking and strict OpenSpec validation are renewed for this evidence-only update below. No procedure-mirroring test or new gateway is introduced. Initial completion does not supply trusted settings, a satisfactory post-Apply Verification or Archive eligibility.

Resumed evidence-only checks: `sh tools/check-repository.sh` passed, exit 0; `OPENSPEC_TELEMETRY=0 openspec validate --all --strict` from `.42p` passed all 7 items, exit 0; edited-file local links resolve and `git diff --check` is clean. No implementation, workflow, procedure command, requirement or input bytes changed. The supplying mechanism tests were already renewed for #36 (173 passed); they were not rerun merely to edit the operational account. Tasks 4.1–4.2 require external saved settings and are not completed by documentary checks. Separate 42P Verification and Archive for A-bootstrap have not been invoked.
