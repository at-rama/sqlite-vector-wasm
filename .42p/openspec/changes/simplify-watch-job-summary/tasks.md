# Tasks

The 2026-10-14 authorized Update centralizes forecasts before the existing channel pair sections. Tasks 1.1–1.3, 2.2 and 3.1–3.2 are reopened for this delta; 2.1 retains its prior completion because execution outcomes and evidence writing are unchanged. Existing Apply correspondence and Verification report concern the earlier candidate and do not verify this revised presentation. Reconcile affected coverage before renewed Apply and renew 42P Verification afterwards; do not archive using the prior PASS.

## 1. Compact complete Summary

- [ ] 1.1 Refactor `renderPlan` in `tools/watch/plan.mjs` to centralize forecasts before `latest`/`next` pair sections per design decisions 1–2, preserving the current pair order and removing forecasts from pair blocks. Show one channel/version/increment line when common and explicit upstream associations when forecasts differ; retain shared caveats/Updates instructions once and reference context after the jobs. Verify every exact pair/channel/increment/version, candidate and published/partial identity remains directly recoverable.
- [ ] 1.2 Update `tools/watch/tests/plan.test.mjs` to compare centralized associations with the structured plan: common forecasts, heterogeneous forecasts within one channel, sufficient SQLite-only selectors and full-pair fallback, empty plans, unchanged pair ordering and no repeated per-pair forecast. Retain no-candidate, multiple-run/PR, joined-attempt, all-candidate, long-suffix, absent-next, exact-parameter/link and escaping cases. Verify selection and shared calculation remain intact.
- [ ] 1.3 Update `docs/watch.md` to explain `Forecast` then channel pair sections, independent alternatives, common/differing forecast associations and publication recalculation; verify the guide against generated output and retain shared input binding, repository links, the explicit unimplemented notification target and human preparation boundary.

## 2. Outcomes, reference handoff and A-watch invariants

- [x] 2.1 Exercise the existing scheduled/manual `runWatch` and CLI path with complete nonempty, all-candidate, empty and failed planning fixtures; add or adapt `tools/watch/tests/run.test.mjs` cases where needed and verify actual outcomes, failed-stage/redacted diagnostics, failed output writes, and unchanged structured evidence/artifact/run-reference availability. Reuse current failure handling; adjust existing context placement only if the layout requires it.
- [ ] 2.2 Run `node --test tools/watch/tests/*.test.mjs` and inspect the retained requirements/scenarios in coverage against discovery/state/planning/orchestration/workflow code; verify baselines, both eligibility dimensions, published-pair exclusion, candidate distinction, shared nonreserving calculation, recurrence, read-only boundaries and Friday/manual scheduling. Escalate any relevant A-inputs/A-release/A-updates dependency gap; do not replace policy locally or treat past archives as current proof.

## 3. Integrated candidate checks

- [ ] 3.1 Stage the implementation candidate and, from the repository root, run `sh tools/check-repository.sh` and `sh tools/test-repository.sh`; then, from `.42p`, run `openspec validate --all --strict`. Verify all applicable commands pass and record observed results/limits without declaring post-Apply Verification or release acceptance.
- [ ] 3.2 Re-read the current Allocation snapshots and re-evaluate every row in `coverage.md` against the committed candidate and artifacts; verify both directions remain 100% at documentary level, all required plan information is retained, and code/workflow changes remain within the authorized A-watch realization. Stop on required semantic revision or insufficient upstream authority.

## Workflow follow-up

- After Apply, invoke the repository-owned `42p-verify-change` workflow separately for the three post-Apply controls and committed `verification.md`; drafting and task completion do not substitute for it.
- After satisfactory Verification, invoke Archive under the existing canon. Its synchronization must reconcile the cumulative capability's obsolete notification status note with the A-watch producer boundary while identifying A-notifications as pending; preserve historical archives.
- Human integration remains separate. A-notifications' subsequent Change may consume the established results and run reference after Summary simplification; this Change implements no email rule or sender.
