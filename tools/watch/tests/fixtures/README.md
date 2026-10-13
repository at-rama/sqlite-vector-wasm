# Discovery fixtures

SQLite tag-list and `3.54.0` release HTML are responses captured on 2026-10-13 from https://sqlite.org/src/taglist and https://sqlite.org/releaselog/3_54_0.html. Only trailing whitespace and trailing blank lines are normalized for repository checks. They exercise the actual Fossil presentation, including historical tags outside the discovery baseline. They are publication metadata, not vendored upstream sources.

The sqlite-vec JSON projects the selected release/classification and amalgamation fields from https://api.github.com/repos/asg017/sqlite-vec/releases/324084102, captured on 2026-10-13. Unrelated binary assets, authors and release notes are omitted. It preserves the official exact alpha identity and digest. Other releases and faulty responses built by the tests are synthetic, not newly observed publications or qualification evidence.
