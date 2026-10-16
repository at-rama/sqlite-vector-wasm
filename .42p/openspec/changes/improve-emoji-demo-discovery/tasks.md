# Tasks

## 1. Whole-word discovery

- [ ] 1.1 Implement the bounded text policy and parameterized whole-word SQLite filtering in the existing demo Worker; verify literal-membership offline fixtures for `cat` versus `indicator`/`cats`, case, multiword AND/order, punctuation/repetition, whitespace, punctuation-only and injection-like inputs with `node --test tools/site/tests/demo-*.test.mjs`.
- [ ] 1.2 Extend the shared real-browser checker with actual catalogue/SQLite search assertions for those behaviors and update the demo text-search guidance in `docs/site.md`; verify them with `bash tools/harness.sh exec sh tools/site.sh demo` without changing vector SQL, corpus or runtime selection.

## 2. Explicit initial selection

- [ ] 2.1 Resolve 🐱 by its literal Unicode identity, reset fresh-session search/batch state, and reject missing/duplicate defaults through the existing initialization-error path; verify reordered/missing/duplicate catalogue fixtures and keep the empty-query full catalogue reachable.
- [ ] 2.2 Replace entry/retry/re-entry ID-zero assumptions in the browser checker, assert visible 🐱 selection with six real binary neighbors and no initial Float32 request, and add its query to the independent scalar-reference checks; verify fresh entry, retry and re-entry in `sh tools/site.sh demo` through the qualified harness, retaining the existing fixed-ID and boundary-tie queries.

## 3. Local interaction hierarchy

- [ ] 3.1 Refine `EmojiDemo.vue` grouping and concise English guidance so search, selection, nearby representation controls and six neighbors are clear; keep technical/raw details initially closed and runtime/corpus links discoverable. Update applicable demo guidance and verify desktop/mobile screenshots, all-match Show more access, actual keyboard traversal and visible focus in the existing browser exercise.
- [ ] 3.2 Adapt the existing interaction checks to the reviewed layout while preserving copy success/failure, mode selection retention, one-time Float32 loading, optional-load recovery, latest-request behavior, connection/Worker disposal, accessible labels and no page overflow; verify both site prefixes and keep measurements, metrics and provenance truthful without changes to global navigation/theme.

## 4. Complete demo integration evidence

- [ ] 4.1 Run `sh tools/check-repository.sh`, `sh tools/test-repository.sh`, `node --test tools/site/tests/*.test.mjs tools/site/checks/*.test.mjs`, `sh tools/openspec.sh exec validate --all --strict`, and the qualified `sh tools/site.sh exercise`, `example` and `demo` commands sequentially. Record command outcomes, full-unit retained-scenario dispositions, independent Hamming/cosine comparisons, fixed corpus/runtime inventories, documentation-only preservation and material execution/measurement limits in an Apply receipt; missing mandatory prerequisites remain incomplete.
- [ ] 4.2 Use the existing Site workflow and observer to check the identified actual Pages candidate on desktop/mobile with both local prefix results retained; record commit/release/corpus identities, initial 🐱/text/interaction outcomes, runtime digest comparisons and immutable primary evidence links. Distinguish local/hosted results and leave the task incomplete on failed or missing deployment evidence; prepare the clean committed implementation for subsequent 42P Verification without claiming verification, archive, merge or publication.
