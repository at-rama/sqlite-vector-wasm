---
schema_version: 1
change: enable-production-sitemap
allocation_unit: A-site_shell
checked_commit: af81e0e0bd7bf13ed57e9eb9cf2686f9bd543b69
verdict: passed
coverage:
  allocation_to_change: 100
  change_to_allocation: 100
openspec_verify: passed
repository_checks: passed
applicable_tests: passed
---

# Verification: production sitemap

## Institutional view

**Situated conclusion.** The bounded sitemap revision of A-site_shell passes local 42P Verification at committed candidate `af81e0e0bd7bf13ed57e9eb9cf2686f9bd543b69`. Actual VitePress/XML/assembly execution was renewed on that clean candidate. The full offline suite and documentation checks were executed on the same implementation bytes during Apply and reused as described in the [execution account](#execution-record). This verdict establishes the scoped realization and examined preservation of existing behavior, not fresh browser/product qualification, hosted delivery, search-engine indexing or permission to merge. Local raw logs are temporary; the durable record below is an account, not a hosted copy of those logs.

**Command provenance.** The maintainer's explicit 2026-11-02 adoption is recorded as Site S-site-sitemap/C-sitemap in the [design snapshot](https://github.com/at-rama/sqlite-vector-wasm/blob/84c44b303bb8d646002ea4c5f5feeca7ee8a28cd/.42p/engineering/2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md), sections “C-sitemap” and “S-site-sitemap”. The [Allocation snapshot](https://github.com/at-rama/sqlite-vector-wasm/blob/84c44b303bb8d646002ea4c5f5feeca7ee8a28cd/.42p/engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), A-site_shell and the final reconciliation section, attributes this addition to the existing unit. The semantic correspondence examined here is captured in [the coverage mapping](https://github.com/at-rama/sqlite-vector-wasm/blob/af81e0e0bd7bf13ed57e9eb9cf2686f9bd543b69/.42p/openspec/changes/enable-production-sitemap/coverage.md). It does not renew a full historical-source audit.

**Production discovery and preview isolation — passed by renewed execution.** The compiler emitted valid namespaced XML containing the root, Usage, Demo and an additional `extra.html` page at their expected stable URLs. The preview emitted no sitemap. All four preview HTML pages retained noindex, while the corresponding stable pages did not acquire it. Three assembly modes preserved production sitemap bytes or correctly omitted both sitemaps for preview-only bootstrap. The [exercise definition](https://github.com/at-rama/sqlite-vector-wasm/blob/af81e0e0bd7bf13ed57e9eb9cf2686f9bd543b69/tools/site/exercise.mjs#L150) is implemented by `exerciseSitemap`; its observed results are in the [execution account](#execution-record).

**Static construction, prefix and independent integration — passed for the examined revision.** The two real shell-only builds required no runtime or publication lookup, and every sitemap destination resolved to an emitted HTML file. Existing preparation/runtime suites also passed. The [config change](https://github.com/at-rama/sqlite-vector-wasm/blob/af81e0e0bd7bf13ed57e9eb9cf2686f9bd543b69/site/.vitepress/config.mts#L13) adds only native sitemap options; documentation sources, demo inputs, package code and dependency records are unchanged.

**Navigation, mobile styling and runtime preservation — retained by source examination and regression tests.** The three-line config diff leaves head, footer, navigation and page transforms byte-identical. Theme, mobile/browser checks and runtime acquisition/selection code are unchanged. Existing site tests, including the runtime preservation and adjacent GitHub/npm cases, passed as recorded below. No new browser visual run is claimed locally; the unchanged Site compiler/browser CI remains an integration gate. This is preservation evidence for this additive build artifact, not a new qualification of all historical UI or runtime behavior.

**Bounded publication and assembled qualification — passed within local evidence.** Existing checkout, eligibility, publication, gate and workflow tests passed; assembly was additionally executed in stable-plus-preview, stable-only and preview-only modes. The deployment workflow and production freshness/eligibility controls are unchanged. Official Pages deployment completion remains a separate CI result and is not asserted by this report.

**Contributor documentation — passed by inspection and execution.** The [Sitemap section of the guide](https://github.com/at-rama/sqlite-vector-wasm/blob/af81e0e0bd7bf13ed57e9eb9cf2686f9bd543b69/docs/site.md#sitemap) gives the production URL, automatic page inclusion, preview policy and the exact scoped command executed below. Existing public content and metadata are unchanged.

**Dependencies and remaining limits.** Generation uses locked VitePress 1.6.4; XML parsing uses Python ElementTree rather than VitePress's generator. The expected URLs are written independently of buildOptions, but both paths still share the repository-authored build and assembly harness and this agent authored the addition and review. Fixture compilation tests selected finite cases, not every possible future route or publication. No upstream-source qualification or distribution release was needed. Local tests do not replace the PR's required CI checks.

**Conclusion for institution.** The adopted production sitemap is implemented and the scoped local controls passed. Human review and the existing CI integration/publication results remain required before deployment can be treated as complete.

## Detailed record

### Allocation coverage

Both semantic directions are 100% for A-site_shell, including the unchanged unit obligations explicitly retained by proposal.md and the cumulative site-shell contract. See the identity-bound coverage mapping above for every contribution and task. Both added requirements derive from Site C-sitemap; no obligation is introduced for another allocation unit. Hashes identify the inputs examined, not independent evidence of their authority or completeness.

### OpenSpec verify

The current repository-owned openspec-verify-change skill was read and followed. Project resolution returned this checkout's `.42p`; status and apply instructions resolved the four planning artifacts and four completed tasks. The seven checks were evaluated:

| Dimension | Finding |
| --- | --- |
| Completeness | Task Completion: 4/4; Spec Coverage: both added requirements implemented |
| Correctness | Requirement Implementation Mapping: config, exercise and guide match the delta; Scenario Coverage: all six added scenarios covered by compiler/assembly execution or guide inspection |
| Coherence | Design Adherence and Code Pattern Consistency: native conditional config, existing exercise entry point, standard-library XML parser, isolated temporary fixtures and cleanup match the design and adjacent exercise patterns |

No critical issues, warnings, suggestions or skipped delta checks were found. This agentic assessment is distinct from executable test results and does not by itself establish the other two 42P controls.

### Execution record

Environment: Node.js 24.22.1, Python 3.12.14; locked VitePress 1.6.4 installed with `sh tools/site.sh install`. Locked OpenSpec 1.14.0 installed and checked through the repository launcher. CI retains its own configured Node version; no dependency or environment pins were edited.

- `sh tools/check-repository.sh`: passed on the clean checked commit; protected canon, Capture/Allocation identities and source-lock checks passed.
- `sh tools/test-repository.sh`: passed during Apply; seven Node test groups passed 43, 20, 39, 115, 33, 60 and 82 tests (392 total, zero failures), and four Python groups passed 44, 36, 7 and 11 tests (98 total). Its source/test inputs are unchanged in the checked tree `00eb2c726df3071106a8ef011acd921ca97ea5e3`. Only planning references and completion metadata were finalized after that run. Raw temporary account: `.work/sitemap-repository-tests.log`.
- `node --test tools/site/checks/*.test.mjs`: 4/4 passed during Apply on the same implementation and test bytes; no documentation source changed afterward. Raw temporary account: `.work/sitemap-doc-checks.log`.
- `OPENSPEC_TELEMETRY=0 sh tools/openspec.sh exec validate --all --strict`: 13 items passed, zero failed, during Apply. Existing informational long-requirement notices are outside this delta and were not rewritten. The selected Change was validated again on the clean checked commit.
- The documented focused `exerciseSitemap` command: passed during Apply and again on the clean checked commit. Raw renewed output: `.work/sitemap-verified-exercise.log`; temporary build fixtures were removed by the exercise after success.

The renewed observation returned `name: production-sitemap`, `xml: parsed`, `automaticPage: extra.html`, `previewSitemap: absent`, `previewNoindex: retained` and successful `stable-and-preview`, `stable-only`, `preview-only` assembly checks. The exact stable URL set was:

```text
https://at-rama.github.io/sqlite-vector-wasm/
https://at-rama.github.io/sqlite-vector-wasm/demo/
https://at-rama.github.io/sqlite-vector-wasm/extra.html
https://at-rama.github.io/sqlite-vector-wasm/usage/
```

The same exercise is called by the unchanged existing CI exercise command and contributes its observation to exercise.json. This report does not claim that the full browser exercise or official deployment has completed in the present PR. The temporary raw outputs above are not hosted evidence links; this section is their durable execution account. The repository's mandatory local checks and applicable sitemap tests passed, while CI remains independently required for integration.
