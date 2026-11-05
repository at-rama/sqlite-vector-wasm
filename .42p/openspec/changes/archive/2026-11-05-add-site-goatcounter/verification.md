---
schema_version: 1
change: add-site-goatcounter
allocation_unit: A-site_shell
checked_commit: 23b080406c220c0ef99f67a4a07a64fb2270aaa5
verdict: passed
coverage:
  allocation_to_change: 100
  change_to_allocation: 100
openspec_verify: passed
repository_checks: passed
applicable_tests: passed
---

# Verification of stable site audience measurement

## Institutional view

**Situated conclusion.** The scoped local verification of `add-site-goatcounter` under `A-site_shell` passed for `23b080406c220c0ef99f67a4a07a64fb2270aaa5`. The real compiler emitted the intended HTML for stable and preview routes. This establishes script placement and exclusion. Live collector ingestion and Pages delivery are outside these local observations. The execution account below records the temporary outputs.

**Command provenance.** The maintainer's “Applique” adopted the bounded addition recorded as S-site-goatcounter. Site C-audience defines the behavior and the Allocation maps it to A-site_shell. This review checks that scoped derivation and the retained shell contract. [Site decision and behavior](https://github.com/at-rama/sqlite-vector-wasm/blob/615b752fd1fe50f503178f85526d924bfb34b26d/.42p/engineering/2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md) · [Allocation at A-site_shell](https://github.com/at-rama/sqlite-vector-wasm/blob/615b752fd1fe50f503178f85526d924bfb34b26d/.42p/engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md#a-site_shell--static-site-envelope-and-deployment)

**Stable measurement and preview exclusion passed by compiler execution.** Stable Presentation, Usage and Demo fixture pages each emitted one async script in the head with the exact source and collector. Their preview counterparts emitted zero matching scripts and retained robots `noindex`. The diff leaves the router untouched, consistent with document-load scope. [Config diff](https://github.com/at-rama/sqlite-vector-wasm/commit/23b080406c220c0ef99f67a4a07a64fb2270aaa5) · [Execution account](#execution-account)

**Static construction, navigation and downstream integration are supported by compilation, regression tests and source review.** Both fixture builds succeeded under the existing prefix handling. The config diff leaves navigation, mobile presentation, content inputs, package separation, documentation and demo integration, and demo runtime selection intact. Existing site and runtime preparation tests passed. The local fixture did not run browser navigation or the demo runtime. [Retained contract and coverage mapping](https://github.com/at-rama/sqlite-vector-wasm/blob/23b080406c220c0ef99f67a4a07a64fb2270aaa5/.42p/openspec/changes/add-site-goatcounter/coverage.md) · [Execution account](#execution-account)

**Bounded deployment and assembled qualification are supported by local regressions.** Existing eligibility, assembly and workflow tests passed. The workflow source retains its candidate identity, publication eligibility, freshness and acceptance conditions. Official deployment and assembled browser qualification remain results of the existing PR checks. [Unchanged Site workflow](https://github.com/at-rama/sqlite-vector-wasm/blob/23b080406c220c0ef99f67a4a07a64fb2270aaa5/.github/workflows/site.yml) · [Execution account](#execution-account)

**Discovery is supported by compiler and assembly execution.** The existing sitemap exercise produced the expected stable XML and kept previews unindexed, with its three assembly modes passing. The contributor guide still describes those rules. [Execution account](#execution-account) · [Sitemap guide](https://github.com/at-rama/sqlite-vector-wasm/blob/23b080406c220c0ef99f67a4a07a64fb2270aaa5/docs/site.md#sitemap)

**Dependencies and remaining limits.** The HTML parser examined compiler output independently of VitePress rendering, while compilation used the repository harness. The same agent authored the change and ran the probe. The fixture tested the three public routes without loading the remote script or submitting traffic.

**Conclusion for institution.** The local controls support the bounded head change. The PR workflow supplies the separate integration and deployment evidence.

## Detailed record

### Allocation coverage and OpenSpec assessment

Both semantic directions cover 100% of A-site_shell. The cumulative spec retains each prior requirement and scenario, and the added requirement maps to C-audience. OpenSpec status resolved all planning artifacts and Apply reported 1/1 tasks complete. The stable and preview scenarios both matched compiler output. The conditional head follows the existing config pattern and the recorded design. No blocking discrepancy was found in the examined delta. [Coverage mapping](https://github.com/at-rama/sqlite-vector-wasm/blob/23b080406c220c0ef99f67a4a07a64fb2270aaa5/.42p/openspec/changes/add-site-goatcounter/coverage.md) · [Delta specification](https://github.com/at-rama/sqlite-vector-wasm/blob/23b080406c220c0ef99f67a4a07a64fb2270aaa5/.42p/openspec/changes/add-site-goatcounter/specs/site-shell/spec.md)

### Execution account

- `sh tools/check-repository.sh` passed on the clean checked commit.
- `sh tools/test-repository.sh` and `node --test tools/site/checks/*.test.mjs` passed on the same implementation and test bytes. The local commit used for those runs and the checked commit have identical trees.
- Strict OpenSpec validation passed 13 items, including the selected Change, with existing long-requirement notices.
- The temporary `.work/verify-goatcounter.mjs` probe used locked VitePress 1.6.4 and Python's `HTMLParser`. It reported `stable passed on all three pages` and `preview passed on all three pages` for the three public route fixtures.
- The existing [sitemap exercise](https://github.com/at-rama/sqlite-vector-wasm/blob/23b080406c220c0ef99f67a4a07a64fb2270aaa5/tools/site/exercise.mjs#L150) passed. It observed the stable sitemap, the extra fixture route, preview `noindex`, and stable-plus-preview, stable-only and preview-only assembly.

The raw outputs are temporary local logs. This section is the durable account of those runs.
