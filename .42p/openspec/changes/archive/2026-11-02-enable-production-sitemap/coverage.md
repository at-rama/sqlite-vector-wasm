# Allocation / Change coverage

## Input identities and scope

Realizes exactly `A-site_shell`. The instituted 2026-11-02 `S-site-sitemap` decision adds `C-sitemap` to the current Site Capture. The current unit and all its qualified references were read, including the unchanged shell/docs/demo boundaries. This is an incremental realization: existing site-shell requirements remain the retained contract, not newly implemented functionality.

- `.42p/engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md` at design commit `84c44b303bb8d646002ea4c5f5feeca7ee8a28cd`: SHA-256 `bbbd6ce60ab718dc703a38146fffb6ac560ec5f55c6aa6319a4218a6df6b77ad`.
- `.42p/engineering/2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md` at design commit `84c44b303bb8d646002ea4c5f5feeca7ee8a28cd`: SHA-256 `1632a3ed7eb3b62e576da930d29c1abfcf7c4236496ef2ab1c6ea5d0841d0df0`.

## Bidirectional correspondence

| Allocation obligation and source | Change contract and scenarios | Tasks / verification disposition |
| --- | --- | --- |
| Static construction, project-prefix hosting and package separation (S/C-site) | Retained site-shell: Common static construction, both scenarios; proposal retained contract | 1.1–2.1; actual native compiler builds; no package input changes |
| Shared five-entry navigation and mobile styling (S/C-site/C-demo-checks) | Retained Common navigation and mobile presentation, all scenarios | 1.1 preserves config; 3.2 offline shell tests; unchanged browser checks remain in CI |
| Independent docs/demo integration, source ownership and supplied integration inputs (S/C-readme/C-demo-release) | Retained Independent downstream integration, all scenarios | 2.1 shell-only fixtures; 3.2 existing runtime/preparation tests |
| Documentation updates preserve supplied demo selection and bytes (S/C-readme/C-demo-release) | Retained Documentation deployment preserves demo runtime, all scenarios | 1.1 no runtime changes; 3.2 existing runtime/publication suites |
| Bounded preview/stable deployment, identities, publication eligibility, freshness and required integration result (D/C-delivery/C-release-review; S/C-readme/C-demo-checks) | Retained Bounded Pages deployment, all scenarios | 2.1 all assembly modes; 3.2 existing checkout/eligibility/publication/workflow tests; actual hosted deployment remains CI/human scope |
| Scoped shell and assembled-artifact qualification (S/C-demo-checks) | Retained Scoped shell verification, all scenarios; added Sitemap output qualification and documentation | 2.1–3.2; XML/output observations supplement existing checks without changing their gates |
| Production sitemap, future pages, stable URL prefix, no preview sitemap, retained noindex, assembled preservation, unchanged behavior (S/C-sitemap) | Added Production-only sitemap, all four scenarios | 1.1–2.1 actual compiler/XML/assembly checks |
| Brief contributor documentation (S/C-sitemap) | Added Sitemap output qualification and documentation, Contributor guidance | 3.1 guide review |

Allocation → Change: 100% within A-site_shell, with retained obligations explicitly incorporated by proposal.md and the existing site-shell specification. Change → Allocation: 100%; both added requirements derive only from Site C-sitemap, and retained requirements retain the unit's existing qualified references. Tasks realize or check those requirements, not new product scope.

This mapping establishes examined semantic correspondence, not successful execution, current delivery, renewed upstream historical fidelity or human integration. Existing scenario coverage is retained in its original suites; finite fixture executions do not prove all possible publications. No other unit is realized or repartitioned.
