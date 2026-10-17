# A-inputs Apply evidence

## Scope and environment

Execution on 2026-10-17, starting from `d11e39bc559342795f85fdc0a19f11c0053db6d6`. This account records source acquisition, not a SQLite-Vector build or browser acceptance. Linux x86_64, glibc 2.39, Python 3.12.14, Bash 5.2.21, curl 8.5.0; system Git, tar and unzip. OpenSpec uses the repository's pinned 1.14.0 installation. No new dependency or toolchain pin is introduced.

Raw metadata, archives, handoffs and test outputs are transient under ignored `.work/` or outside the checkout. They are not published evidence artifacts; the durable account below records their observed results. Fixture definitions and implementation share agentic authorship. Real downloads use official upstream transport independently of authored source fixtures but still use the repository's acquisition helper.

## Candidate preparation and first acquisition

Executed from the repository root:

```sh
mkdir -p .work/inputs
bash tools/inputs.sh resolve-vector --sqlite-version 3.54.0 --vector-version 1.1.2 --output .work/inputs/vector-candidate.lock.json
bash tools/inputs.sh validate inputs/sqlite-vector.sources.lock.json
git add inputs/sqlite-vector.sources.lock.json
bash tools/inputs.sh acquire --lock inputs/sqlite-vector.sources.lock.json
```

Reviewed the candidate, verified the SQLite pin equals the unchanged default pin, then recorded the candidate bytes in the separate lock before acquisition. Official release metadata identifies release `387102049`, published `2026-09-11T14:27:22Z`, stable/non-draft; tag `1.1.2` binds to commit `0c2223ada9dce1fa33248c8835a15f51d9a0f655`, also confirmed through the official commit endpoint. Origin metadata locators are retained in the [recorded candidate lock](../../../../../inputs/sqlite-vector.sources.lock.json).

Fresh candidate preparation and the subsequent acquisition each downloaded the commit-addressed archive. The independently repeated SHA-256 is `b44a759233bdc9a502bf2407972608d13dd6e60a31b4b03c2d4ae4b6b04f03c7`, 2,772,458 bytes, matching the planning observation. This is locally measured integrity, not an upstream-published source checksum or signature. The consumed lock SHA-256 is `f8d1fd0bd8660eb69f964101a5ca0a650ac297cfc222494b4acc777116dbd779`.

The first successful handoff has only `sqlite` and `sqliteVector` component entries. SQLite's SHA3-256 matches `a5c29342ca185abcda332448fbb27c536661245be27e20199b46c49099b0e15e`. The extension source view contains 18 regular files: 14 src files, three FP16 headers and the root license. The unrelated package symlinks and bundled SQLite are not materialized. The default source lock and release descriptor are unchanged.

## Offline controls

`python3 -m unittest discover -s tools/tests -p test_inputs.py` passed 47 tests (34 retained, 13 added), with subcases covering both fixed paths, independent version selection, stable/prerelease classification, official release/tag/commit binding, candidate-only hashing, established-pin drift, equal textual versions in distinct engine upstreams, unsafe archive paths/collisions/links/ancestors, required sources and header version, digest-before-use, clean failure/no alternative-engine fallback, exact handoff and Git-index matching. These authored fixtures establish exercised control behavior, not upstream build compatibility.

The complete registered suite `sh tools/test-repository.sh` passed 317 tests: repository gates 44, inputs 47, build 28, package 12, acceptance controls 15, release 39, update notices 6, update controls 27, Watch 51, OpenSpec tooling 11 and site 37. These are offline controls; they do not establish a newly built runtime.

## Isolated clean-checkout reproduction

At implementation commit `823172e719b3ecdffa779b256b96fb69a29e9dc6`, created two new detached Git worktrees, each clean with no `.work/`, SDK, tool installation, npm state or source outputs. No dependency installation was performed in either checkout. An empty per-checkout npm cache remained empty. Shared system tools, host/network and Git object store are common dependencies; source archives were freshly downloaded for every invocation, not copied from a sibling checkout.

In checkout A ran `bash tools/inputs.sh acquire --lock inputs/sources.lock.json`, then the same command with `--lock inputs/sqlite-vector.sources.lock.json`. In checkout B ran them in the opposite order. All four returned success with distinct new workspaces, exact consumed lock identities and only the requested engine component. Both Git worktrees remained clean.

For each invocation, a separate temporary Python script rehashed the downloaded archive bytes using `hashlib`, compared the digest with the recorded pin and handoff, and compared every source-view file byte-for-byte with its corresponding ZIP/TAR member using `zipfile`/`tarfile`. It used the same standard-library hash/archive implementations as the helper but a separate comparison path; it is not an independent archive-parser implementation.

Observed in both orders:

| Input | Downloaded archive bytes | Source files compared per invocation | Result |
| --- | ---: | ---: | --- |
| SQLite 3.54.0 | 14,881,448 | 2,284 | SHA3-256 matches unchanged pin; executable configure retained |
| sqlite-vec 0.1.9 | 53,872 | 2 | SHA-256 matches unchanged pin; unchanged amalgamation C/header |
| SQLite-Vector 1.1.2 | 2,772,458 | 18 | SHA-256 matches new pin; unchanged selected files; no bundled SQLite/packages/links in view |

The sqlite-vec lock SHA-256 is `29bd2007a91eecc7810814c76e911792c18507942b980f51b4280ff12afaeb8d`; the Vector lock SHA-256 remains `f8d1fd0bd8660eb69f964101a5ca0a650ac297cfc222494b4acc777116dbd779`. Source-view byte comparison covered 9,176 file comparisons across four pairs. This shows the two recorded compositions can be acquired in either order, not that every future upstream layout is supported.

## Boundary review

Compared against the planning baseline `d11e39bc559342795f85fdc0a19f11c0053db6d6`: default `inputs/sources.lock.json`, `inputs/release.json`, downstream build/package/acceptance/Watch/release/Updates code, workflows and synchronized OpenSpec specs are unchanged. The source helper, its tests, source documentation, separate candidate pin and Change evidence/task tracking are the only realization changes. No publication policy, engine registry or runtime selector is added.

`sh tools/check-repository.sh` and pinned `sh tools/openspec.sh exec validate --all --strict` passed (13 items, zero failed). The seven modified delta requirements preserve their full scenarios; length notices are informational and are not hidden or resolved by splitting existing requirements.
