# Spec Delta

## MODIFIED Requirements

### Requirement: Common navigation and mobile presentation

Every site destination SHALL share English navigation for Presentation, Usage, Demo, a direct external GitHub repository link and an adjacent `npm` link to `https://www.npmjs.com/package/@at-rama/sqlite-vector-wasm`, with minimal mobile-adapted styling. The common envelope SHALL remain usable at mobile and desktop viewport sizes.

#### Scenario: Navigate among destinations
- **WHEN** a visitor opens any site destination and follows its common navigation
- **THEN** Presentation, Usage and Demo are reachable and GitHub links directly to https://github.com/at-rama/sqlite-vector-wasm, and adjacent npm links directly to https://www.npmjs.com/package/@at-rama/sqlite-vector-wasm

#### Scenario: Mobile viewport
- **WHEN** the site is opened at a narrow mobile viewport
- **THEN** navigation remains operable, the mobile menu exposes npm beside GitHub with the same direct package destination, and common page content fits the viewport, with wide code content scrollable inside its own area

#### Scenario: Package link from stable and preview pages
- **WHEN** a visitor opens any stable or preview destination and inspects its desktop navigation or opens its mobile menu
- **THEN** the visible `npm` link is adjacent to GitHub and points to the exact external package URL without adding the site or preview prefix
