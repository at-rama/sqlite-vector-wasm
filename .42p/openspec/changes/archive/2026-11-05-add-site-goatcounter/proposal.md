# Proposal

## Why

Measure direct loads of the stable project site with the maintainer's GoatCounter endpoint. Keep preview traffic outside that measurement.

## What Changes

- Add the supplied asynchronous GoatCounter snippet to the common stable head.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `site-shell` gains stable document-load measurement and retains its existing requirements and scenarios.

## Impact

Realizes the Site C-audience addition allocated to `A-site_shell`. The runtime diff is confined to `site/.vitepress/config.mts`. See [coverage](coverage.md) for the exact design inputs and retained obligations.
