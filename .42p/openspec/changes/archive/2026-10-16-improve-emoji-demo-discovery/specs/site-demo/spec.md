# Spec Delta

## MODIFIED Requirements

### Requirement: Textual discovery and vector exploration

The demo SHALL offer text search over English names and associated words, a matching emoji grid, six vector neighbors excluding the selected emoji, clickable neighbors, an emoji-copy control and Binary/Float32 selection. Data SHALL be imported into SQLite and neighbor searches SHALL actually execute through sqlite-vec using the selected emoji's existing embedding, without free-text embedding inference or an external embedding service. Text discovery SHALL match each query term at the beginning of a word across all descriptions and associated words without case sensitivity, require every term regardless of order and preserve the complete catalogue for an empty query. A new demo session SHALL explicitly select 🐱 and show its six binary-mode vector neighbors after initialization.

#### Scenario: Find a starting emoji
- **WHEN** a visitor enters a name or associated word
- **THEN** the grid shows matching emojis, or an explicit empty result, and selecting one searches its precomputed vector rather than vectorizing the entered text

#### Scenario: Follow and copy an emoji
- **WHEN** a visitor selects an emoji or clicks a displayed neighbor
- **THEN** it becomes the current selection with six distinct nearest other emojis for the current mode, and Copy copies the selected Unicode emoji with truthful success or failure feedback

#### Scenario: Equal distances
- **WHEN** candidates have equal distance, including at the sixth-neighbor boundary
- **THEN** any valid six-neighbor result respecting closer distances is acceptable, without a special relevance order among ties

#### Scenario: Match word beginnings rather than internal substrings
- **WHEN** a visitor searches for `cat` or `CAT`
- **THEN** descriptions or associated words beginning with `cat`, including `cat` and `cats`, match equally regardless of case, 🐱 is included, and `indicator` alone does not match because its occurrence is internal to the word

#### Scenario: Discover while typing across descriptions
- **WHEN** a visitor enters `mus` before completing `music`
- **THEN** emojis with `music` or `musical` among any of their descriptions or associated words are discoverable even if their displayed title does not match, while an internal substring such as `sic` does not match `music` alone

#### Scenario: Combine words and separators
- **WHEN** a visitor searches for `cat fac`, `fac cat` or `  CAT, fac!  `
- **THEN** the same emojis containing word beginnings for both terms across their descriptions match regardless of term order, repetition or case, with spaces and punctuation separating query terms

#### Scenario: Empty and literal special-character queries
- **WHEN** a visitor submits an empty or whitespace-only query, an unknown word, or a nonempty query consisting only of punctuation such as `%`, `_` or a backslash
- **THEN** an empty or whitespace-only query exposes the complete catalogue with all matches reachable, an unknown or punctuation-only query shows an explicit empty result, and no input acts as a SQL wildcard or executable SQL

#### Scenario: Explicit cat starting point
- **WHEN** initialization, successful initialization retry or re-entry into Demo completes
- **THEN** 🐱 is selected by its Unicode identity rather than its corpus position, the search field is empty, all corpus entries remain reachable, and six real binary-mode vector neighbors of 🐱 are displayed without downloading Float32

### Requirement: Transient browser session and usable states

The demo SHALL use only an in-memory database with explicit connection closure on session disposal. It SHALL remain usable in the common mobile-adapted envelope with keyboard-operable controls and clear loading/error states. Presentation and Usage SHALL NOT start the demo runtime or acquire its corpus unless the visitor enters Demo. The page SHALL make textual discovery, the current selection, representation choice and six neighbors a clear visual sequence, with brief explanations and actual-operation details collapsed by default.

#### Scenario: Navigate into and away from Demo
- **WHEN** the visitor enters Demo from another page and later leaves it
- **THEN** initialization occurs only for Demo and disposal closes the connection and releases its execution context without OPFS, authentication or local database cleanup

#### Scenario: Operate during loading or a failure
- **WHEN** initial loading, optional-mode loading, an initialization failure or a rapid selection change occurs
- **THEN** controls communicate availability and errors, allow an appropriate retry, and do not show an obsolete response as the latest selection/mode

#### Scenario: Narrow viewport and keyboard
- **WHEN** the demo is used at mobile width or by keyboard
- **THEN** search, selection, modes, copy and the technical panel remain operable with visible focus and readable content, without page-wide overflow

#### Scenario: Understand and inspect the exploration
- **WHEN** a visitor opens Demo on desktop or mobile
- **THEN** the search, selected emoji, nearby Binary/Float32 choice and six-neighbor result have clear labels and visual grouping, the distinction between text discovery and existing-vector search is briefly explained, and technical details start collapsed while runtime identity, corpus attribution and their links remain easy to find
