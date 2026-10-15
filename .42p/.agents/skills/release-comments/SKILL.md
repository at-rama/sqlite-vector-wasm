---
name: release-comments
description: Draft the optional sqlite_comment, sqlite_vec_comment and misc_comment fields for a selected sqlite-vector-wasm upstream pair from official sources and a verified published baseline. Use when preparing release comments, including after a Watch plan or when comparing with a named distribution release.
---

# Release comments

Read `AGENTS.md`, the editorial standard and [candidate preparation](../../../../docs/candidates.md). Use the GitHub plugin for repository reads. Keep this an on-demand drafting aid; do not edit files, dispatch Updates or publish anything.

Accept exact `sqlite_version` and `sqlite_vec_version` values and an optional distribution reference. Example: `/release-comments sqlite_version: 3.54.0 sqlite_vec_version: 0.1.9`.

1. Resolve the published baseline and both embedded upstream versions from publication provenance. Honor an explicit distribution reference; otherwise use the selected pair's channel HEAD (`latest` for stable pairs, `next` for experimental pairs, falling back to `latest` when no `next` exists). Follow the current publication reader and records rather than assuming tag names or versions. Do not treat repository pins, a Watch forecast or an unpublished candidate as a published baseline. State the reference and component transitions. If the baseline cannot be established, report that limit rather than inventing a comparison.
2. Read official upstream release notes for the selected versions and relevant intervening releases: SQLite's release logs and sqlite-vec's published GitHub Releases, supplemented by exact-tag history or linked upstream fixes when needed. Summarize the cumulative difference from the baseline; distinguish prereleases and rollbacks. Report missing or ambiguous evidence without guessing.
3. Draft one concise English line per nonempty field, prioritizing user-visible changes relevant to the distributed library. Preserve important compatibility restrictions and conditions. Exclude CLI-only, platform-only or optional-extension changes unless their applicability to this distribution is established. Do not turn an upstream benchmark into a performance claim for this WebAssembly build or imply qualification from release notes.
4. Leave an unchanged component's field empty by default. Allow a useful contextual reminder, particularly for a first release with detailed comments or an explicit request, but say that the version is unchanged and attribute the behavior to that version. Never present an already included fix as newly delivered. Leave `misc_comment` empty unless a separate, evidenced distribution change warrants it; upstream sources alone do not establish local changes.
5. Return `sqlite_comment`, `sqlite_vec_comment` and `misc_comment`, explicitly marking empty fields as empty. Put each nonempty line in a separate copyable block without the field label or source citations inside it. Give official source links and any material evidence limits outside the comments. Keep the comments optional and ready for human review; drafting does not initiate preparation or authorize publication.
