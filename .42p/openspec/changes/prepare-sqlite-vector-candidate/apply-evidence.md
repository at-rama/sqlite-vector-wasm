# Apply evidence — A-updates

Implementation snapshot: `f01d56b20d89fa902e96794c3eb631e9454b8cc7`; source main: `17d42d1976b8f3235c59fb499613a8cff89f7fc1`. This is an execution account, not post-Apply Verification or publication authority.

## Real preparation evidence

[Updates rehearsal 39210323082](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39210323082), job [rehearsal](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39210323082/job/117922019637), succeeded on 2026-10-19. It executed `sh tools/updates.sh rehearsal` in a fresh hosted checkout with fresh production/tool state, actual repository/run/attempt and actual read-only Git/npm history. No publication-state fixture was used.

- PR head: `f01d56b20d89fa902e96794c3eb631e9454b8cc7`; synthetic merge checkout: `6fd0a66c4f1304a9330cae724d8ebd6be7b958b9`.
- Local candidate commit: `2eb1837715a8160ff7c8c0ef74cbca863f28e0d9`; status `qualified-without-pr`, zero publication calls, no remote write adapter.
- Exact selection: SQLite 3.54.0 / SQLite-Vector 1.1.2, lock SHA-256 `f8d1fd0bd8660eb69f964101a5ca0a650ac297cfc222494b4acc777116dbd779`.
- Actual historical latest 0.2.1 contains sqlite-vec 0.1.9; shared policy calculated first-transition MINOR forecast 0.3.0/latest, not reserved or published. Vector has no fabricated numerical reference to sqlite-vec.
- Candidate descriptor SHA-256 `fee29f410f63ddf06e5425744947be1c9f1f010edd267693b0a50fc853afe5d5`; schema 2, exact selection, comment `Nonpublishing preparation rehearsal` and actual preparation run 39210323082.
- Payload: 1164711 bytes, SHA-256 `30d806bb5e5f826ab6401cd95726afa20a60c12b3b5d2edf1f0828e2990303e1`.
- Nine production stages passed: checkout, install, tools, deps, smoke, build, package, browser, bundle.
- Chromium 153.0.8010.12: all 22 required cases passed, including 12 main/Worker/Worker1/promiser transports, SQLite baseline, FTS5, Float32, Hamming, SQL negatives, three OPFS restart cases, persistence negative and final hashes.
- Recorded toolchain: Emscripten 4.0.23, Node v24.19.0, npm 11.17.0, wasm-strip 1.0.42, wasm-opt 125; Ubuntu runner with GCC 13.3.0 and Make 4.3. Exact options/platform/tool output remain in acceptance/build records.

## Accessible primary results

[Artifact 12167532286](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39210323082/artifacts/12167532286), `updates-39210323082-1`, was downloaded and its ZIP SHA-256 checked: `83a00982c50d9a011f89ab4ec077d99db734fdb12bb0548a2110de8b48a79da4`. Retention expires 2026-11-18; availability after that date is not established.

Explicit archive locators:

- `updates/run-0p4Psd/candidate.json`: invocation, actual states/forecasts, operations, base/candidate, payload and zero-publisher result.
- `updates/run-0p4Psd/release.json`: retained exact committed descriptor bytes.
- `updates/run-0p4Psd/sqlite-vector.sources.lock.json`: resolved source record; `prepared/tools/package/` under that run retains the complete notice snapshot. Same-pair notices are reported retained, not freshly acquired.
- `updates/run-0p4Psd/tests.log`: complete registered offline execution; `repository.log`: canonical check.
- `acceptance/run-IisRdW/acceptance.json`: clean candidate/engine/lock/package identity, nine stages, complete 22-case browser observations.
- `acceptance/run-IisRdW/payload.tgz`, `build.json` and `package.json`: qualified archive and consumed records; browser observations are embedded in acceptance.json.
- `release/run-LS1vmL/publication.json` and `release/run-LS1vmL/handoff.json`: qualification identity, invocation, source/tool/artifact provenance; not a published distribution.

Downloaded payload size/digest matched candidate/acceptance records. `acceptedPayload` and `bindSelection(..., {product:true})` rechecked this downloaded bundle successfully against the unchanged selected repository sources/docs/notices. These are reused repository validators, not an independently authored implementation. The real candidate is a temporary local commit, not a public remote commit link.

## Repository and synthetic controls

[Repository run 39210323156](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39210323156), [tests job](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39210323156/job/117922020906), passed the registered `sh tools/test-repository.sh`: 371 tests, 262 JavaScript and 109 Python, no skips. Node suite counts: 44/19/24/50/36/52/37; Python counts: 44/47/7/11. The same job installed pinned OpenSpec 1.14.0 and passed strict validation, 13/13. Canonical check passed in its separate job and locally.

Local commands also passed: `sh tools/test-repository.sh`, the 36-test Updates suite after descriptor retention, seven Updates Python tests, and `sh tools/openspec.sh exec validate --all --strict` (13/13). Local raw outputs are temporary; this paragraph is their retained account, not direct primary access.

A separate temporary checkout changed only synthetic pin/notice metadata to SQLite 3.55.0 and Vector 1.1.3 with commit `ffffffffffffffffffffffffffffffffffffffff`, keeping fixtures explicitly synthetic. Seven Python tests and `node --test tools/release/tests/*.test.mjs tools/updates/tests/*.test.mjs` (86 tests) passed. No acquisition, real qualification, branch dispatch or publication of this fabricated identity was attempted. This exercise exposed and corrected mutable-pin coupling in legacy/current release and preparation fixtures; production validators remain strict.

Synthetic official-release tests cover stable/older and published alpha/beta/rc identities; unpublished/draft/branch/alias, binding/digest drift and integrity failures remain rejected. They do not prove an actual upstream alpha exists or builds. Injected services test creation-only leases, races, wrong heads, failures and partial outcomes; native GitHub candidate-write permissions were not exercised.

## Failure disposition and scope

[Earlier run 39209573929](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39209573929), [failure artifact 12167366215](https://github.com/at-rama/sqlite-vector-wasm/actions/runs/39209573929/artifacts/12167366215), failed before qualification because a Watch test still required the old Updates title. The updated producer assertion and explicit unadapted-Watch rejection test corrected that integration expectation without changing Watch production. The successful intermediate run 39209752370 proved real qualification; artifact inspection then led to retaining the exact descriptor. The final run above renews the complete proof after that correction.

Review confirmed that current source locks, inputs/release.json, notice inputs, Capture/Allocation, synchronized specs, shared release policy, runtime/public API and other units' producers are unchanged in this tooling PR. The Watch consumer remains separate allocated work. No multi-engine interface, dependency-upgrade framework, upstream source patch, archive, merge, candidate dispatch or publication was added to this invocation.

Temporary local execution log apply73-full2.log SHA-256 `22ef6c9086878b3a4553ec16cc4232773dc4b36dd230bc8840ab630b7b72a1e1` (account only; no durable primary URL).

Temporary local execution log apply73-changed-pins2.log SHA-256 `2a2d51d37a2a59c3d96aa0e7f7b860d4c5cee20b921c4834935f02b976d6d8ed` (account only; no durable primary URL).

Temporary local execution log apply73-retained-descriptor.log SHA-256 `bc3a7b9c5f76c6f31ccb276c4e6b719acec5e87dd74f3b729548e035e332648a` (account only; no durable primary URL).
