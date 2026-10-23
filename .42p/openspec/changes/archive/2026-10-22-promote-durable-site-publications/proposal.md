# Proposal

## Why

Site currently depends on expiring release-outcome artifacts and the previously deployed public JSON to decide stable eligibility. Its public browser observer also repeats pre-deployment qualification and turns external availability into a blocking result.

## What Changes

- Realize exactly A-site_shell from Allocation `85585a833b4cd37959f8ad841109f7b2e4c45c1e`.
- Consume matching finalized Release manifests and durable receipts supplied by complete-platform-delivery; keep historical publication inspection explicitly separate and read-only.
- Preserve the last eligible stable documentation through bounded Git history lookup while a candidate publication is pending, without public Pages reads or another version registry.
- Retain exact assembled-artifact browser checks, completed official Pages deployment, source/freshness/concurrency guards, read-only builds and privileged deployment isolation; remove the automatic public observe job.
- Keep publication partiality, unknown evidence and failed Pages explicit. A manual Site redeployment uses the same published identity without rerunning Release.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `site-shell`: durable publication eligibility, prior-source selection and local artifact/deployment completion boundary.

## Impact

Site eligibility, workflow, existing tests and guide. No runtime, demo selection, Watch/notification, product publishing or general recovery engine. Depends on A-release receipt contract and A-site_docs assembled qualification. Subsequent A-acceptance/A-updates work shares the candidate archive and enforces the PR gate; it must recheck any modified evidence adapters.
