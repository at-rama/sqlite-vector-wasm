# Design

## Context

See proposal.md and the companion A-acceptance design. Source resolution, notice reconciliation, source/descriptor commit and create-only PR services already exist; the qualifier currently runs between commit and push. Candidate presentation currently claims a qualified archive/example.

## Goals / Non-Goals

Make the preparer accurately stop before product qualification while preserving policy/source/notice/document checks, deduplication and human authority. Qualification production is the companion unit's concern.

## Decisions

- Keep source acquisition/integrity, notice reconciliation, shared forecast, document source preparation and clean commit/repository check before the create-only push/PR. The registered full repository suites remain CI checks; dispatch need not rerun all product-orchestration fixtures before opening a PR.
- Consume the Acceptance producer's relocated boundary and present candidate-awaiting-qualification with exact sources/head, unreserved forecast, preview/check/run links and no claimed archive/example pass.
- Retain source preparation rehearsal only as explicitly prepared-without-pr; actual full production/browser rehearsal is the PR Acceptance path. Remove obsolete qualifier/example imports, injected dispatch-qualification API and pre-PR browser setup.
- Document precise partial push/PR failure and the bounded native workflow approval/required acceptance/human merge sequence. No autoapproval, publication, overwrite or general retry.

## Risks / Trade-offs

A preparation-passing PR can subsequently fail qualification; this is the intended visible in-PR feedback, not delivery success. Qualification/preview evidence must match the current head and archive. Existing native-token workflow approval is still required and may delay execution until the maintainer approves it.
