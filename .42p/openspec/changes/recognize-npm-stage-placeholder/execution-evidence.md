# Apply evidence — 2026-10-11

## Candidate and scope

Apply consumes PR [#36](https://github.com/at-rama/sqlite-vector-wasm/pull/36), planning head `61a3cc993a7c1838d5cccf57d454afd5bd760e06`, rooted in main `ef202b77e120332703ebeba67501ea91bfab667e`. The local test checkout reconstructs the tracked GitHub tree, not its original commit history: baseline tree `2c2d9a924bd52b82415187146fcf780a37362c11`; planning tree `53daea6f1e33482e92bdd72083f2dffad98a4fc8`. Tests execute the staged implementation snapshot. The ensuing PR commit is the tool revision; it is not the revision of the existing published distribution.

Changed implementation files: [shared reader](../../../../tools/release/state.mjs), [registered placeholder tests](../../../../tools/release/tests/registry-placeholder.test.mjs), [renewed scoped identity/publisher tests](../../../../tools/release/tests/scoped-identity.test.mjs), and [publication explanation](../../../../docs/publication.md). Change-local task tracking, this record and coverage are updated. Proposal, design, delta, synchronized specs, Captures, Allocation, operational canon, workflow, package and release inputs remain unchanged.

| Executed implementation input | SHA-256 |
| --- | --- |
| Shared reader | `4c0f865f9a2b8b3f105bf9315fb1f4e57f9943e3c05bd181c8aaed7b815dd5aa` |
| Placeholder tests | `288f0ef42411cb6273cd364a9feb41d6e5835e8d6d9462d91b9a247d4110dfad` |
| Scoped identity tests | `365f6122590526b46c29de206f93d2002fc751e283d2f4ce49273f17e3262cca` |

## Executed controls

Environment: Linux, Node.js `24.19.0`, system npm `11.9.0`, Python 3.12, Git, native C compiler, shell/tar/unzip. These are offline control-test prerequisites, not the qualified publishing harness. OpenSpec CLI `1.14.0` runs from `.42p`, with `OPENSPEC_TELEMETRY=0`.

| Command | Observed result |
| --- | --- |
| `node --test tools/release/tests/registry-placeholder.test.mjs` | Exit 0; 6 passed, no skips |
| `node --test tools/release/tests/*.test.mjs` | Exit 0; 32 passed, no skips |
| `sh tools/check-repository.sh` | Exit 0; repository, canon and Capture/Allocation byte identities passed |
| `sh tools/test-repository.sh` | Exit 0; 173 passed: gates 43, acquisition 31, build 28, package 11, acceptance controls 9, release 32, updates 19; no skipped mandatory suite |
| `openspec validate --all --strict` | Exit 0; 7 items passed, 0 failed; informational long-requirement notices retained |

The independently constructed registry/tag/Release fixtures exercise raw observation retention, exact placeholder recognition and identity/shape/marker rejection, genuine HTTP 404 versus auth/transport failure, stable/experimental projections, placeholder-only/channel failures, deterministic forecasts, alpha progression, rollback and collisions. Real-reference failures include missing/draft/maturity/provenance assets, authoritative revision mismatch, size mismatch and equal-size changed bytes. Completion fixtures use the real `githubServices.verifyGitHub` read adapter and an allowlisted injected reader; no write, repack or repair adapter is invoked. Normal verification retains supported npm provenance checks; existing publisher tests retain exact `npm publish` arguments and credential/OIDC failure controls.

Inspection confirms A-updates imports `readState` in `tools/updates/cli.mjs` and calls the same `calculate` for preflight and refreshed qualification in `tools/updates/run.mjs`. No interface adjustment is required. The release context and workflow retain the human-merged candidate and changed `inputs/release.json` trigger; this correction supplies no candidate input. Ordinary hosted OIDC publication, signed GitHub attestation generation, production/browser acceptance and trusted-publisher setup are unchanged and are not rerun by this state-reader correction. Passing synthetic controls does not establish a new live trusted release, independent cryptographic verification or product requalification. Test fixtures and implementation share repository authorship; fixed fixture observations are independent of production state construction, but validators/calculation and existing adapters are shared mechanisms.

## Existing publication: partial read-only observations; task 3.2 blocked

At `2026-10-11T15:36:36.306Z`, a Node.js invocation of the corrected `npmState(httpReader())`, followed by `download`/`sha256` on the real `0.1.0` registry archive, exited 0 and returned this sanitized observation:

```json
{"name":"@at-rama/sqlite-vector-wasm","versions":["0.0.0-stage","0.1.0"],"placeholderStub":true,"latest":"0.1.0","archiveSize":1147792,"archiveSha256":"f730ffe041730f8f98306004e488fe97dd64bf08646c380d1a7a30f033a80ff9"}
```

GitHub connector GETs independently observed published stable Release `409659401`, `dist/v0.1.0`, and a commit-type tag pointing to `ef202b77e120332703ebeba67501ea91bfab667e`. Its `payload.tgz` asset `630720854` advertises size `1147792` and that SHA-256. Its `publication.json` asset `630720882` advertises size `6648`, SHA-256 `9df4c03ed6aa087f7a10c675c5d1af02630f544442512b68850bd2c8816f834d`. Metadata is not a substitute for downloading and comparing Release bytes.

The available GitHub `fetch` capability returns UTF-8/JSON and explicitly excludes binary downloads. GET attempts through that connector at the published browser asset URLs returned `NOT_FOUND` / GitHub API 404; the API asset endpoint returned metadata, not archive octets. Workflow artifact ZIP downloading is available but does not establish the current Release asset bytes. Preserve the requested GitHub access boundary rather than substitute another remote repository client or treat artifact/registry bytes as Release bytes.

Consequently the actual corrected command `sh tools/release.sh check-initial PUBLICATION.json` has **not executed against both destinations** here: invocation/output/exit status are unavailable, rather than a fabricated complete result. Task 3.2 remains unchecked. The npm-only invocation is evidence of the repaired registry reader, not canonical completion. No publisher, tag, deletion, dist-tag or destination repair operation was invoked.

For the distinct A-bootstrap handoff (#33), the remaining action is to execute `check-initial` in the maintainer's Codespace using corrected #36 tooling and the retained original `publication.json`, then record invocation time, tool commit, output and exit status. Its published source must remain `ef202b77e120332703ebeba67501ea91bfab667e`; require the original accepted size/digest above and exit 0 with `status=complete`. Pending/failure remains non-success. No publication retry is indicated.

Post-Apply 42P Verification and native Archive have not been invoked. Apply is 5/6 tasks complete with the live completion task blocked; these checks do not authorize integration or publication.
