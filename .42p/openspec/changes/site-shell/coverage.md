# Pre-Apply Allocation ↔ Change coverage

## Examined identity and limits

Selected unit: **A-site_shell**, exactly one unit of [the global Allocation](../../../engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md), snapshot SHA-256 `6c590de92b1eb9cab123081ddf7b35fd6cb44521a053d79dac6ba42adf3e358a`, read at base commit `f59a1ddd083641ec7471e4fa89f48455dcedaf2c`. The complete unit, qualified references, boundary/dependencies and reverse Site correspondence were examined together.

The full selected passages are Site `C-site`, `C-readme`, `C-demo-release`, `C-demo-checks` and `Q-realization` in [the Site Capture](../../../engineering/2026-10-08_sqlite-vec-wasm_site_capture_edit-0.1.md), SHA-256 `27740a7cad7bca33e9ba48d8d54fc6a688a8b15321cf450c4e47f0ed15deb10f`. Only their shell contributions are realized here. The source handles S-site-design, S-site-usage and S-site-split ground the common surface, scoped checks and independence; the 2026-10-15 user validation recorded in `proposal.md` chooses the previously open VitePress/English/explicit-refresh realization. No separate public conversation permalink is available. Captures are derived projections, not independent corroboration of those decisions.

Reviewed artifacts: `proposal.md`, `specs/site-shell/spec.md`, `design.md` and `tasks.md`. Existing capability inventory has no Site capability. Browser-package was inspected in full for its runtime/distribution boundaries; no existing requirement is modified. The present record establishes documentary semantic coverage, not implementation or upstream-source fidelity.

## Bidirectional semantic mapping

Each row states a complete shell obligation or boundary and its Change correspondence. Read in reverse, the rows account for all six requirements of the sole new capability.

| Allocated obligation and qualified passage | Change requirements | Scenarios and tasks |
| --- | --- | --- |
| Static construction and GitHub Pages hosting, common three-page/four-entry surface (C-site, Q-realization) | Common static construction; Common navigation and mobile presentation; Bounded Pages deployment | Fresh static construction; Project-prefix hosting; Navigate among destinations; Pull request validation; Integrated or manual deployment. Tasks 1.1–1.2, 2.1–2.2. Prefix, PR validation and workflow choices realize hosting without creating another product surface. |
| Shared minimal mobile styling (C-site) | Common navigation and mobile presentation | Mobile viewport and navigation cases. Tasks 1.2, 1.5. Standard-theme selection and English labels are adopted realization choices; no custom visual identity or localization obligation is added. |
| Documentation-only deployment preserves the demo's selected published runtime; shell does not select a new release (scoped C-readme, C-demo-release, unit boundary) | Documentation deployment preserves demo runtime; Bounded Pages deployment | Documentation changes after demo integration; Explicit demo refresh handoff; Missing supplied runtime assets. Tasks 1.3–1.4, 2.1. Identity and digest comparison exercise preservation, not release selection. Fail-closed preparation prevents silent substitution and stale output. |
| Shell precedes downstream integration; docs/demo independent thereafter; docs owns sources/rendering/content/example checks, demo owns stable acquisition/data/UI/vector checks (Q-realization, unit boundaries and scoped C-readme/C-demo-release) | Independent downstream integration; Documentation deployment preserves demo runtime | Shell before downstream units; Integrate either downstream unit; Explicit demo refresh handoff. Tasks 1.3–1.5. Temporary notices do not duplicate README or claim either downstream implementation. No production demo required to qualify shell preservation. |
| Own common navigation/deployed integration checks and documentation-only identity check (scoped C-demo-checks, Q-realization) | Scoped shell verification | Before a real demo exists; Deployed integration check, plus prefix/mobile/preservation scenarios. Tasks 1.2–1.4, 2.2, 3.1–3.2. Actual Pages evidence remains required; fixtures are explicitly limited to shell behavior. |
| Site separate from package: no engine rebuild, publication, package API, third canonical distribution or replacement of A-acceptance (unit boundary, scoped C-demo-release/C-demo-checks) | Common static construction; Independent downstream integration; Bounded Pages deployment; Scoped shell verification | Fresh static construction; Integrate either downstream unit; Pull request validation; Integrated or manual deployment; Before a real demo exists. Tasks 1.1, 1.3–1.5, 2.1–2.2, 3.1–3.2. Existing publication/acceptance requirements stay intact. |

All tasks realize these rows or perform their integrated checks. The exact dependency/lock, temporary build tree, standard theme, ordinary page slots, main/manual deployment conditions and preservation fixtures are bounded engineering choices under Q-realization. No generic plugin mechanism, automatic release-selection service, localization, documentation search or extra passage condition is introduced. The latest-stable selection on explicit demo refresh remains A-site_demo context, not a shell requirement to implement.

## Gate result

**A-site_shell → Change = 100%.** Every scoped production/check contribution, modality, exclusion and dependency of the complete selected unit is represented above.

**Change → A-site_shell = 100%.** Each of the six requirements, its scenarios and proposed tasks realizes the unit's qualified scope; no documentation or demo obligation is transferred into the shell.

This is a pre-Apply semantic examination, not a post-Apply Verification verdict, browser result, published-site observation or integration/publication authorization. No upstream semantic contradiction or missing allocation was identified in this bounded examination. Initial Pages deployment access is an operational evidence prerequisite and cannot be passed by local tests; any resulting block must be recorded. A semantic revision during Apply invalidates affected coverage until re-examined under the repository rules.
