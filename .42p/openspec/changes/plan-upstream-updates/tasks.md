# Tasks

## 1. Official upstream inventory

- [ ] 1.1 Implement read-only SQLite Fossil and paginated sqlite-vec discovery under `tools/watch/`, preserving exact published identities and A-inputs criteria; verify captured official-source fixtures cover stable/prerelease distinction, drafts/development snapshots, ambiguous identities and incomplete reads.
- [ ] 1.2 Apply componentwise discovery baselines through shared comparison and document source evidence/limitations in `docs/watch.md`; verify baseline/suffix-order fixtures and all documentation links, with no source acquisition or pin mutation.

## 2. Published and candidate state

- [ ] 2.1 Consume A-release's common state and implement watch-local historical composition reads using existing provenance validation; verify multi-page history, rollback exclusion, multiple versions carrying one pair, placeholder handling, inconsistent evidence and occupied partial identities without weakening existing HEAD checks.
- [ ] 2.2 Add only the pair-bearing dispatch `run-name` to Updates and implement queued/active run inspection; verify workflow/event/repository binding, separate rehearsal titles, malformed/legacy active-run failure, no exposed comment and unchanged dispatch/preparation behavior through existing Updates tests.
- [ ] 2.3 Inspect open candidate PRs, changed descriptors and locks at exact heads, joining runs by preparation identity; verify unrelated inherited descriptors, changed heads, multiple candidates/attempts, bad repository references and unavailable reads with fixture tests.
- [ ] 2.4 Document publication/candidate observations and failure outcomes in `docs/watch.md`; verify documented states agree with reader fixtures and contain no claim of runtime qualification or refusal memory.

## 3. Selection, forecasts and human plan

- [ ] 3.1 Implement pure Cartesian-product eligibility and corresponding-status published exclusions; verify stable maintenance alongside next, component regression, next-behind-latest, absent next, multiple alpha pairs, no-new-individual-version pairs and repeated unselected work with independent expected outcomes.
- [ ] 3.2 Join candidate state and call the existing calculation against one unchanged snapshot; verify equal pair/state forecasts match preparation policy, independent jobs can predict the same number, alpha-series/maturity rules remain shared and collisions fail without renumbering.
- [ ] 3.3 Render a deterministic readable plan with exact selections, channel/increment/version, Updates parameters/link and candidate run/PR links; verify a complete expected-plan fixture, arbitrary source response ordering and omission of duplicate-launch suggestions for existing candidates.
- [ ] 3.4 Document plan consumption, nonreservation and unchanged manual initiation in `docs/watch.md`; verify example commands/parameters against Updates and keep examples free of private values and channel/version overrides.

## 4. Conditional private email and schedule

- [ ] 4.1 Implement the injected Gmail SMTP adapter using standard-library TLS/SMTP, one private address for sender/recipient and dedicated app-password configuration; verify mocked SMTP acceptance, finite timeout, rejected authentication/recipient, uncertain transport outcome and no automatic resend, without connecting to Gmail.
- [ ] 4.2 Implement orchestration, the thin entry point and sanitized ignored evidence; verify empty plans make zero SMTP/credential-adapter calls, required-read failures cannot become empty success, nonempty delivery errors fail and synthetic addresses/passwords occur in none of the retained outputs.
- [ ] 4.3 Add Friday `08:00` `Europe/Paris` scheduling in `.github/workflows/watch.yml`, read-only GitHub permissions, pinned actions and schedule-only sending; verify cron/timezone configuration for summer/winter, PR checks receive no SMTP secrets and injected authorization tests permit no candidate/publishing mutation.
- [ ] 4.4 Document the two secret names, Gmail app-password prerequisites, manual inactivity reactivation and diagnostic limits in `docs/watch.md`; verify only secret names occur publicly and explicitly distinguish setup prerequisites, mocked acceptance and any later authorized live delivery evidence.
- [ ] 4.5 Register the implemented watch suites in `tools/test-repository.sh`; verify the registered command executes the mandatory Node/Python tests offline and fails if an implemented watch suite is missing, preserving existing suite registration.

## 5. Integrated realization checks

- [ ] 5.1 Run a read-only complete discovery/state/plan exercise from a clean checkout with no SMTP adapter or write-capable GitHub services; verify exact pair/reference identities and retain sanitized evidence, distinguishing live observations from fixture checks and from actual delivery.
- [ ] 5.2 Recheck every spec scenario and both directions of `coverage.md` against the committed implementation, then run `sh tools/check-repository.sh`, `sh tools/test-repository.sh` and strict OpenSpec validation from `.42p`; completion requires passing applicable commands and no unresolved allocated obligation.

Apply ends before post-Apply Verification. The subsequent explicitly invoked `42p-verify-change` workflow owns the report and verdict; archive/synchronization, secret setup, live email and human integration are separate actions, not checked-off implementation substitutes.
