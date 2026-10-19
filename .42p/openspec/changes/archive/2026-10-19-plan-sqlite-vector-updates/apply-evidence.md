# Apply evidence — A-watch

## Scope and reproducible checks

The implementation realizes the approved `plan-sqlite-vector-updates` Change on PR #74. Planning inputs remain the exact Allocation and three Captures recorded in [coverage](coverage.md). No requirement, delta or upstream design was revised during Apply.

`sh tools/test-repository.sh` passed on Node.js v24.19.0 with system Python 3, Bash, npm, tar/unzip and C compiler: 379 tests (270 Node tests across seven suites and 109 Python tests across four suites), zero failures or skips. The renewed Watch subset contains 60 passing tests. The raw local logs are ignored under `.work/watch-apply/`, not committed execution artifacts. This account records their observed success; test-definition links below are not links to raw execution logs.

`sh tools/check-repository.sh` passed. `OPENSPEC_TELEMETRY=0 sh tools/openspec.sh exec validate --all --strict` passed 13/13 items. OpenSpec 1.14.0 was installed from its unchanged lockfile and passed preflight. Telemetry was explicitly disabled after automatic review rejected a telemetry-enabled invocation; no bypass or tooling/canon edit was introduced.

## Final live read-only rehearsal

The complete `runWatch` path used the unchanged `httpReader` transport and cached reader with local Summary/JSON writers and no notifier. Context was explicitly `local-read-only-rehearsal`, not a hosted GitHub run or dispatch. Observation began **2026-10-19T13:55:11.034Z**; the final response ended **2026-10-19T13:56:33.385Z**. Node was v24.19.0. Staged tree identity was `2a159576156e8ccb0e327e729807b452c473e73a`; parent commit was `0c8e7179064edda6827e9d72dc34b6049102e6ba`. This tree identifies the execution inputs before the final task/evidence-only edits. Production module blob identities at that tree are:

- `tools/watch/discovery.mjs`: `93266681746b9dd6d49ed2d494812cc78804ccaf`.
- `tools/watch/state.mjs`: `5ba8c2629a9aa8cdbf6e996c48fcaf97193a3aa4`.
- `tools/watch/plan.mjs`: `b7c2062e705bb329474baeaf5046e5b9e22f847a`.
- `tools/watch/run.mjs`: `7e3713bf3cf6d2a21f9588ddbcec91a063b2ab13`.
- `tools/release/policy.mjs`: `0e9e542aa5c00e604695b49ee524a5e8f15bdb83`.
- `tools/release/state.mjs`: `37615096ad01a67d2bcc5244576e071d38ee626f`.

Result: **nonempty**, **4 eligible pairs**. 20 successful GET responses; no preparation source archive was acquired. The existing publication reader downloaded published package bytes to verify HEAD integrity; those are published-state evidence, not candidate acquisition. Public services were read at different times, not as an atomic remote snapshot.

- SQLite `3.54.0` × SQLite-Vector `1.1.0` → `latest`, `0.3.0`, `MINOR`; 0 current candidates.
- SQLite `3.54.0` × SQLite-Vector `1.1.2` → `latest`, `0.3.0`, `MINOR`; 0 current candidates.
- SQLite `3.54.1` × SQLite-Vector `1.1.0` → `latest`, `0.3.0`, `MINOR`; 0 current candidates.
- SQLite `3.54.1` × SQLite-Vector `1.1.2` → `latest`, `0.3.0`, `MINOR`; 0 current candidates.

Observed latest: `0.2.1`, commit `c84ec2f60cab61bd8e4752e8fb9d7eba671e21e1`, composition `{"sqlite": "3.54.0", "sqliteVec": "0.1.9"}`. Next: `None`. Completed history: 4 publications; partial identities: 0; current candidate observations: 0. The former engine remained labelled sqlite-vec. Both released Vector versions 1.1.0 and 1.1.2 were discovered; no published Vector prerelease was observed in this inventory. Synthetic prerelease tests do not assert one exists upstream.

Local result identities (SHA-256):

- `result.json`: `cf6ecbd9fd780b9e14bc33434fe954a251949a14d8e5057fe272cbffc4d4e9aa`.
- `summary.md`: `4c572726f90b91f870fced24522a1e994bf435d216658415f02694c22098a4fd`.
- `reads.json`: `bb450adeee1037d0611e05df97e6af9b7a1935b507aa30e6574e30fdc80a63fb`.

Raw responses and the URL/time/status/body-hash manifest remain only in ignored `.work/watch-live/`; they are available in the current checkout, not as durable GitHub artifacts. This durable account and its hashes cannot independently reconstruct unavailable future raw bytes. The Summary's four pair records and observed state are transcribed above; the report does not imply a link to primary output through this account.

## Evidence boundaries and final review

The read-only rehearsal establishes the observed public planning result on this code and state. Queued/open candidates, mixed references, prereleases, collisions, malformed data and write failures use separately constructed synthetic fixtures; captured official metadata is identified in the [fixture provenance](../../../../../tools/watch/tests/fixtures/README.md). Tests and implementation share repository authorship and policy/transport code; passing tests do not eliminate correlated interpretation errors.

Both triggers, recurring plans, all-existing-candidate plans, empty/failure and output failures were exercised through actual Vector producer records and the unchanged sender CLI with injected transport. No live Resend request, Gmail receipt, Android notification or hosted dispatch was exercised. Schedule/timezone and read-only permissions were checked from the unchanged workflow and invocation tests.

Semantic examples reviewed for the optional helper: an explicit legacy distribution reference yields a labelled first Vector transition with no numerical cross-engine changelog; a same-engine unchanged component stays empty unless an attributed reminder is requested; an experimental or rollback selection preserves suffix/direction and reports missing official-source evidence. These are guidance examinations, not autonomous generated-release-note accuracy tests.

Final diff against the approved planning commit is restricted to Watch readers/planning/tests/fixtures, Watch/candidate guidance, the repository-owned release-comments helper, task tracking and this evidence. Production pins, candidate descriptor, notices, shared release policy/state, Updates producer, notification implementation/configuration, hosted workflow, canon, synchronized specs and historical artifacts are byte-unchanged. No archive, merge, publication, candidate creation or email was performed.
