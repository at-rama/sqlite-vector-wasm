# Bootstrap execution evidence

## State and evidence boundary

Examined on 2026-10-11. The procedure and pending execution record are delivered; documentation checks are recorded below. Live bootstrap is **pending**, not complete: no account-rights verification, settings write, candidate dispatch/integration, release retrieval, npm publication or completion check was performed in this Apply session. The account, npm organization/Developers membership and package absence previously reported by the maintainer are not authenticated evidence.

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

The identity dependency is satisfied for procedure preparation. External access and publication evidence remain pending. No protected canon, Capture, Allocation, synchronized spec, implementation or historical record was changed by this assessment.

## Operational observations — tasks 2–4

Every field below is **pending / not observed**. Replace it with a dated actual result only after the applicable authorized operation; preserve unsuccessful and unexecuted states.

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

First npm publication: **pending**. Trusted access: **not configured or observed in this session**. Hosted trusted publication: **not demonstrated**. No run, digest, account check, setting read-back or successful publication is inferred from these fields.

## Scenario dispositions — task 5.1

All operational scenarios are explicitly pending; their documented response is not an executed result. A failure scenario was not forced against live services.

| Requirement / scenario | Current evidence disposition |
| --- | --- |
| Explicit minimum publication setup / Package does not yet exist | Pending authenticated access and scoped registry observation, 2.1–2.2. |
| Explicit minimum publication setup / Setup is unavailable | Pending live prerequisite assessment; procedure stops on unavailable access/attestation, without credential fallback. |
| Preserve human integration and complete qualification / Authorized initial stable candidate | Pending human-authorized integrated candidate and complete applicable qualification, 3.1. |
| Preserve human integration and complete qualification / Candidate is unmerged or qualification failed | Pending actual lifecycle evidence; procedure forbids treating candidate checks or human approval as missing qualification. |
| Exact bounded first npm operation / Initial GitHub publication is npm pending | Pending actual `npm-pending` outcome, signed accepted archive and manual operation, 3.1–3.3. |
| Exact bounded first npm operation / Handoff is missing or inconsistent | Pending actual handoff checks; procedure stops on mismatched identity, evidence or bytes, 3.2. |
| Consume read-only completion evidence / Destinations match | Pending actual matching output and exit status, 3.4. Offline exact-byte controls passed but are not publication evidence. |
| Consume read-only completion evidence / npm is absent or inconsistent | Pending live completion evidence; procedure preserves pending/failure, without rerunning the publisher. |
| Supported publication evidence remains explicit / Local first npm publication | Pending signed live archive and retained qualification/manual-operation records, 3.2–3.3; documented local provenance fallback only. |
| Transition to normal trusted publication / First publication completed and trusted access configured | Pending initial completion, saved usable binding, deadline and normal-disposition read-back, 4.1–4.2. |
| Transition to normal trusted publication / Trusted access expires or lacks the required action | Pending actual settings/deadline assessment; procedure reports unready setup and correction without a forced release. |

## Documentation checks

Official npm publish, scoped public package, login, configuration and trusted-publisher documentation, and GitHub CLI attestation verification documentation were read on 2026-10-11; exact links are in [the procedure](../../../../docs/bootstrap.md). Tarball publication/access/channel/script flags, signer/source verification, binding fields, direct-publish permission and the two-day initial validation deadline agree with those references and inspected repository commands. Recheck moving requirements at operational execution.

All local links resolve; seven shell blocks pass Bash syntax checking, and the embedded JavaScript and Python pass syntax checks. `sh tools/check-repository.sh` passed on the staged procedure/evidence snapshot, including operational-canon byte identities and Capture/Allocation input fingerprints. OpenSpec CLI `1.14.0`, installed outside the checkout, returned **7 passed, 0 failed**, exit 0, for `OPENSPEC_TELEMETRY=0 openspec validate --all --strict` from this checkout's `.42p`. A prior validation displayed the same results but its process wait was rejected by automatic approval review because of telemetry to `edge.openspec.dev`; the completed rerun used the CLI's verified environment opt-out, which also suppresses its version-check network request. Its project-root check, status and Apply instructions resolved the same local project and `spec-driven` Change; no Store or generated skill refresh was used. Informational notices about existing long requirement text do not change that structural result.

Task 5.1 is complete for checking the delivered procedure and explicitly pending scenario evidence; it does not close tasks 2–4. Apply progress is **4/12**, with tasks 1.1–1.3 and 5.1 complete. The next task, 2.1, explicitly requires a separately authorized operational stage and authenticated npm account/organization evidence. Repository access used here supplies neither that evidence nor npm setup/publication access. No procedure-mirroring test or new gateway was introduced. These checks do not establish operational success, a satisfactory post-Apply Verification or Archive eligibility.
