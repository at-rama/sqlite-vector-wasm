# Design

## Context

See `proposal.md`. The shared VitePress configuration already defines the three page links followed by GitHub. `tools/site/browser.mjs` checks the desktop menu and opened mobile menu on every destination, at stable and preview prefixes; `tools/site/tests/site.test.mjs` checks common navigation configuration. This small coordination across configuration and browser checks warrants a short design record.

## Goals / Non-Goals

**Goal:** Reuse that navigation and its checks for the adjacent package link.

**Non-goals:** No new component, page, dependency, registry query, installation flow or deployment change.

## Decisions

Append `{ text: 'npm', link: 'https://www.npmjs.com/package/@at-rama/sqlite-vector-wasm' }` after GitHub in the existing nav array. Use VitePress's existing external-link rendering and responsive menu; a custom icon or component adds no needed behavior. The URL is the package page already linked in README, without a version or site prefix.

Extend existing configuration/browser checks to assert the exact href, visible label and adjacency in both menu variants. Opening the mobile menu must expose the link while existing internal navigation and menu closure checks keep passing. Use the existing stable/preview exercise and deployed candidate checks; no new test harness or npm availability monitor is needed. Link control means the correct rendered external destination, not a provider-uptime gate.

## Risks / Trade-offs

An extra entry can affect narrow layouts → check the actual mobile menu and retain overflow/navigation checks. Historical evidence predates npm → verify the new candidate; leave the historical archive unchanged. Rollback is removal of this single nav entry and its current contract revision through normal review.
