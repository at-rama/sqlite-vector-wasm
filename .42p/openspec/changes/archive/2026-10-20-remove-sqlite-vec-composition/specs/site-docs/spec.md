## MODIFIED Requirements

### Requirement: Single-source public documentation

Presentation SHALL render the repository README and Usage SHALL render `docs/usage.md` in the common English mobile-adapted site envelope. Both documents SHALL remain directly readable on GitHub, with no separately maintained copy of their content. Usage SHALL provide getting-started instructions and a minimal selected-distribution example. Vector candidate documentation SHALL include current native SQL/version guidance without an extra sqlite-vec adaptation or migration guide; candidate preview SHALL explicitly identify its unpublished state.

#### Scenario: Render both existing sources
- **WHEN** the site is built from a checkout
- **THEN** Presentation and Usage contain the corresponding source content, including headings, code, links and images, without the shell's unavailable documentation notices

#### Scenario: Edit one source
- **WHEN** README or Usage content changes without an engine release
- **THEN** the next site build reflects that source without editing another authored page or publishing a distribution

#### Scenario: Prepare Vector candidate sources
- **WHEN** a Vector distribution candidate is prepared
- **THEN** the same README/Usage sources provide its presentation and working native SQL example, identify exact candidate composition in preview and do not claim an unavailable npm version is installable
