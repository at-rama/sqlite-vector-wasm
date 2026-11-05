## ADDED Requirements

### Requirement: Stable document-load measurement

The stable site SHALL include the supplied asynchronous GoatCounter script for document loads, with script source `//gc.zgo.at/count.js` and collector `https://at-rama.goatcounter.com/count`. Preview pages SHALL omit the script and retain robots `noindex`.

#### Scenario: Load a stable page

- **WHEN** a browser loads a stable public page as a document
- **THEN** its HTML head contains exactly one asynchronous script with the configured source and collector

#### Scenario: Load a preview page

- **WHEN** a browser loads the preview of a public page
- **THEN** its HTML omits the GoatCounter script and retains robots `noindex`
