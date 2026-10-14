# Upstream planning

Watch discovers official upstream releases and presents eligible SQLite × sqlite-vec pairs for human selection. Discovery and forecasts do not establish build compatibility or publication acceptance.

## Official discovery

SQLite identities come from the complete [Fossil tag inventory](https://sqlite.org/src/taglist), with exact version-tag dates checked against their [official release pages](https://sqlite.org/chronology.html). The moving `release` tag is not a release version. sqlite-vec identities come from all pages of its [published GitHub Releases](https://github.com/asg017/sqlite-vec/releases), preserving alpha/beta/rc suffixes and checking the official amalgamation identity and published SHA-256 metadata. Drafts and unpublished snapshots supply no eligible release.

Ordinary discovery begins at SQLite `3.53.4` and sqlite-vec `0.1.9`, using the shared upstream comparator. Thus `0.1.9-alpha.1` is below the sqlite-vec bound, while `0.1.10-alpha.1` is above it. These limits do not restrict manual Updates selection or rollback.

Discovery reads metadata only; it never downloads sources, changes pins or qualifies a candidate. Unreadable, incomplete, ambiguous or contradictory publication evidence fails planning. A purported SQLite prerelease lacking an admissible full-source publication identity is an explicit A-inputs dependency diagnostic, rather than a fabricated stable-only inventory. Current acquisition may require an established SQLite pin when its historical digest has disappeared from current download metadata; discovery does not invent a digest or an acquisition fallback.

Captured official metadata and synthetic failure cases are described in the [discovery fixtures](../tools/watch/tests/fixtures/README.md). Their tests exercise readers; they are not production qualification evidence.

## Publications and existing candidates

Watch consumes the shared publication reader, including exact payload checks for channel HEADs. It also reads historical `publication.json` provenance, corresponding distribution tags and npm identities. An already published pair remains excluded in its corresponding channel after a rollback or packaging correction. Partial occupied identities are retained by the shared calculation but are not invented as completed publications. Contradictory provenance and unavailable required pages fail the plan.

Queued or active Updates runs expose exact selections in their run names. Watch checks workflow, event, repository, main branch, run identity and attempt. An active legacy run without a readable pair is an unresolved state with a run link, rather than evidence of no preparation.

Open candidate PRs are inspected at their exact head commit. Only a newly introduced or modified `inputs/release.json`, validated against that head's source-lock versions and preparation identity, establishes a candidate. An inherited descriptor in an unrelated PR does not. A matching run and PR are joined by preparation run and branch attempt; genuinely distinct PRs and attempts remain visible. Closed PRs and completed failed runs create no refusal history. A candidate's presence is observation, not qualification or a recommendation to merge.

## Reading a plan and choosing work

The Summary identifies the result first, then shows every eligible unpublished pair in short blocks grouped by `latest` and `next`. The final **Reference state** section retains the published channel versions, exact upstream compositions and revisions, any partial occupied identities, and the invocation/observation context. Stable pairs progress component by component from `latest`; experimental pairs progress from `next` (or `latest` when no `next` exists) and cannot fall behind `latest` on either component. A more advanced experimental HEAD does not block stable maintenance. All eligible alpha combinations remain visible; there is no newest-only selection.

Each entry contains exact upstream versions, forecast channel/increment/version, Updates parameters and current preparation/PR links. Forecasts call the same calculation as preparation against one publication snapshot, independently for each job. Several entries may predict the same number; none reserves it or assumes sequential adoption. Later publication recalculates under its own gates. Unselected eligible jobs recur naturally; reference progression can remove them without a refusal record. Missing stable bootstrap state or a calculation collision is an explicit failure.

The shared instructions above the entries link to the separate [Updates workflow](https://github.com/at-rama/sqlite-vector-wasm/actions/workflows/updates.yml). Choose zero, one or several jobs and open Updates only when you decide to prepare a pair. Each block gives the exact `sqlite_version` and `sqlite_vec_version` inputs and its forecast version, increment and channel. The common `release_comment = ""` instruction applies to every displayed job; there is no channel or distribution-version input. Existing candidates retain their individual run/PR links, states, attempts and preparation references, with no recommendation to start duplicates. A plan containing only existing candidates remains a complete nonempty plan. Manual Updates selection remains independent of Watch history; its existing rollback/comment rules still apply. See [candidate preparation](candidates.md).

## Schedule, manual planning and notifications

Watch is configured each Friday at 08:00 in `Europe/Paris`, including winter/summer time changes. GitHub may delay a scheduled execution. Open the [Watch workflow](https://github.com/at-rama/sqlite-vector-wasm/actions/workflows/watch.yml) and use **Run workflow** to recalculate a plan independently of the cron. Select the branch to inspect; there are no candidate-selection or version-override inputs. Manual Watch only reads, calculates and presents. Starting Updates is a subsequent, separate human action.

GitHub requires the Watch definition on the default branch before hosted manual dispatch is available. A development branch can then be selected under [GitHub's manual-run rules](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow). This condition does not authorize premature integration. PR checks run the offline suites; PR updates do not launch the live Watch.

Open an execution's **Summary** to read the Markdown plan without raw logs. A complete empty plan is a normal success. Discovery, publication/candidate state or calculation failures have an explicit failed-stage summary and an unsuccessful execution. Ignored `.work/watch/result.json` and the execution artifact retain available nonsecret diagnostics; neither becomes input to later selection.

The current implementation configures no dedicated sender or mail service. GitHub can emit completion notifications according to your [Actions notification preferences](https://docs.github.com/en/subscriptions-and-notifications/how-tos/managing-github-actions-notifications), including for empty plans or failed runs. That account-controlled behavior is outside the project's notification target below; this repository does not suppress it or guarantee delivery, mobile push or format.

GitHub can disable scheduled workflows after repository inactivity. Reactivate the workflow manually under its normal UI controls. Watch adds no keepalive, alternate scheduler or automatic reactivation. Disabling only its schedule leaves manual planning distinct; disabling the whole workflow disables both triggers.

## Notification target

The instituted target uses Resend → Gmail to send one short plan email for each successful planning execution with a complete nonempty plan. The message links to the run; the Summary and artifacts remain the reference for details and diagnostics.

| Planning result | Project email |
| --- | --- |
| Successful, complete nonempty plan | One plan email, including when all entries already have preparation or a PR |
| Successful empty plan | None |
| Failed or incomplete planning | None |

Scheduled and manual triggers use the same rule. There is no trigger-specific filter, notification deduplication or sent-plan history; recurring proposals can appear in successive plan emails. This does not change Watch's current-candidate awareness or its prevention of duplicate preparation.

This email target is not implemented. The compact Summary remains the reference result before sender integration. A-watch retains planning and reference restitution; A-notifications owns the notification condition, message and retained transport integration. The [Notifications Capture](../.42p/engineering/2026-10-14_sqlite-vector-wasm_workflow-notifications_capture_edit-0.1.md) and [Allocation](../.42p/engineering/2026-10-04_sqlite-vec-wasm_allocation_edit-0.1.md) record the current design and responsibility split. The [upstream-watch specification](../.42p/openspec/specs/upstream-watch/spec.md) explicitly identifies its older native-notification baseline; future realization work must reconcile the affected requirements while historical archives remain unchanged.

## Development checks

Run `node --test tools/watch/tests/*.test.mjs` for captured-source readers, synthetic publication/candidate fixtures, pure eligibility/forecasting, summary outcomes and event boundaries. `sh tools/test-repository.sh` registers these suites and fails if an implemented Watch lacks a mandatory suite. Tests use injected GET responses and temporary output destinations; they perform no live Watch dispatch, candidate preparation or publication.

The hosted entry point is `sh tools/watch.sh`, with the native read-only Actions token and execution summary destination supplied by the workflow. No dependency installation or mail configuration is needed. Actual manual execution remains separate from offline development checks and must respect GitHub's branch/dispatch availability rules.
