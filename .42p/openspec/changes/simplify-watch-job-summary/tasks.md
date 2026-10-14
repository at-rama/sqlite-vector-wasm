# Tasks

## 1. Compact complete Summary

- [ ] 1.1 Refactor `renderPlan` in `tools/watch/plan.mjs` to the vertical layout in design decisions 1–2, with shared caveats/Updates instructions once and reference context after the jobs; verify representative generated Markdown preserves every plan entry and exact pair/channel/increment/version, partial identities and published references while reducing repeated boilerplate.
- [ ] 1.2 Update `tools/watch/tests/plan.test.mjs` presentation assertions to compare Summary facts with the supplied structured plan, covering no candidate, multiple runs/PRs, joined active attempts, all-candidate plans, long prerelease suffixes, a missing `next` HEAD and shared exact parameters/link; verify the planner suite passes and ordering, escaping, selection and forecast expectations remain intact.
- [ ] 1.3 Update `docs/watch.md` to explain the resulting Summary and shared input binding; verify documentation against representative generated output, resolve repository links and retain the explicit unimplemented notification target and human preparation boundary.

## 2. Outcomes, reference handoff and A-watch invariants

- [ ] 2.1 Exercise the existing scheduled/manual `runWatch` and CLI path with complete nonempty, all-candidate, empty and failed planning fixtures; add or adapt `tools/watch/tests/run.test.mjs` cases where needed and verify actual outcomes, failed-stage/redacted diagnostics, failed output writes, and unchanged structured evidence/artifact/run-reference availability. Reuse current failure handling; adjust existing context placement only if the layout requires it.
- [ ] 2.2 Run `node --test tools/watch/tests/*.test.mjs` and inspect the retained requirements/scenarios in coverage against discovery/state/planning/orchestration/workflow code; verify baselines, both eligibility dimensions, published-pair exclusion, candidate distinction, shared nonreserving calculation, recurrence, read-only boundaries and Friday/manual scheduling. Escalate any relevant A-inputs/A-release/A-updates dependency gap; do not replace policy locally or treat past archives as current proof.

## 3. Integrated candidate checks

- [ ] 3.1 Stage the implementation candidate and run `sh tools/check-repository.sh`, `sh tools/test-repository.sh`, and `openspec validate --all --strict` from `.42p`; verify all applicable commands pass and record observed results/limits without declaring post-Apply Verification or release acceptance.
- [ ] 3.2 Re-read the current Allocation snapshots and re-evaluate every row in `coverage.md` against the committed candidate and artifacts; verify both directions remain 100% at documentary level, all required plan information is retained, and code/workflow changes remain within the authorized A-watch realization. Stop on required semantic revision or insufficient upstream authority.

## Workflow follow-up

- After Apply, invoke the repository-owned `42p-verify-change` workflow separately for the three post-Apply controls and committed `verification.md`; drafting and task completion do not substitute for it.
- After satisfactory Verification, invoke Archive under the existing canon. Its synchronization must reconcile the cumulative capability's obsolete notification status note with the A-watch producer boundary while identifying A-notifications as pending; preserve historical archives.
- Human integration remains separate. A-notifications' subsequent Change may consume the established results and run reference after Summary simplification; this Change implements no email rule or sender.
