# Design

## Context

The stable and preview builds share a VitePress config. The existing `preview` build value selects the preview head, including robots `noindex`.

## Goals / Non-Goals

Use the supplied hosted script for stable document loads. Client-side navigation is outside this measurement scope.

## Decisions

Place the script in the stable branch of the existing global `head` setting. Keep the preview branch as the boundary for unmeasured pages. The asynchronous attribute lets document parsing continue independently of the hosted script.

## Risks / Trade-offs

Delivery depends on the hosted script, the visitor's browser and the collector. Verify the emitted HTML for both build modes without sending visits to the collector.

## Migration Plan

The normal Site workflow picks up the config on the next eligible stable deployment. A revert through the same workflow removes the script.
