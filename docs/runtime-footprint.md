# Compacted browser runtime footprint

With the same JavaScript compaction and local gzip settings, sqlite-vector-wasm's selected loader and WASM total **517 kB gzip**: **11.3% smaller than SQLite.ai's selected pair**, and **6.9% larger than the official SQLite Wasm npm pair** in this observation. Units are decimal: 1 kB = 1,000 bytes.

These are normalized file-size measurements, not observed HTTP downloads or the sizes of newly published compacted packages. All three distributions receive the same treatment. The recorded selection uses each package's latest npm release available on **2026-11-02**, resolved and measured between **02:51:47 and 02:51:54 UTC**. It does not align SQLite versions.

## Protocol and scope

1. Resolve each npm `latest` record once and freeze its version, archive URL and SHA-512 integrity value for that run. The recorded replay additionally pins each archive's SHA-256.
2. Download the published archives and verify integrity before reading their files. Extract one direct browser ESM initializer and its WASM from each archive. Missing or duplicate members fail the run; packages are neither rebuilt nor executed.
3. Process every loader with **Terser 5.44.1**, using `module: true`, `ecma: 2022`, `compress: false`, `mangle: false`, and `beautify: false`. This compacts formatting and ordinary comments without enabling dead-code elimination, identifier/property renaming or semantic optimization. Retain comments matching the same legal-notice rule for all three inputs: `@preserve`, `@license`, `@cc_on`, `copyright`, `license`, `author disclaims`, `public.domain` or `blessing`, case-insensitively.
4. Parse each compacted module again to check syntax. Leave every WASM byte unchanged and validate its file header. These checks do not establish runtime equivalence or browser compatibility.
5. Gzip each compacted loader and each unchanged WASM **separately**, using the same Node.js/zlib implementation with level 9, windowBits 15, memLevel 8 and the default strategy. Check decompression against the measured bytes. Sum the two file sizes; do not compress their concatenation.
6. Record source, compacted and gzip SHA-256 identities, byte counts, tool identities and selection timestamps. Emit a successful JSON report only when every distribution completes. Generated archives, transformed files and evidence stay in a fresh directory under `.work/footprint/`.

The common unit is **direct ESM initializer + WASM**, without an application or Worker harness. Both Vector distributions use their explicit `bundler-friendly` initializer. The official npm package provides its initializer through `dist/index.mjs`, which also contains its promiser export. SQLite.ai's package-root wrapper and separately imported promiser are excluded. The exact entry points and residual packaging differences are disclosed below rather than treated as equivalent APIs.

Additional Worker/OPFS companions, application code/data, npm documentation, source maps, HTTP headers, transport overhead, cache behavior and runtime memory are outside this metric. No Pages response, CDN compression result or Vite application build is mixed into these totals. This protocol applies equal post-processing to published files; it does not undo their upstream transformations or recreate identical build configurations.

## Recorded distributions

| Distribution | npm release | Selected loader | Selected WASM |
| --- | --- | --- | --- |
| SQLite Wasm | `3.54.1-build1` | `dist/index.mjs` | `dist/sqlite3.wasm` |
| SQLite.ai | `3.50.4-wasm.1.0.0-sync.1.2.0-vector.1.2.0-memory.1.3.6` | `sqlite-wasm/jswasm/sqlite3-bundler-friendly.mjs` | `sqlite-wasm/jswasm/sqlite3.wasm` |
| sqlite-vector-wasm | `0.3.2` | `sqlite3-bundler-friendly.mjs` | `sqlite3.wasm` |

SQLite.ai's browser distribution includes SQLite **3.50.4**, Vector **1.2.0**, Sync **1.2.0** and Memory **1.3.6**, according to its package release identity. Our distribution records SQLite **3.54.1** and Vector **1.1.2** in `runtime.json`; the official npm release identifies SQLite **3.54.1**. This is a comparison of available distributions with different versions and capabilities, not a measurement of the isolated cost of Vector, Sync or Memory.

## Results

All values are bytes. “Compacted total” means compacted JavaScript plus unchanged WASM; gzip columns use the common local compression protocol above.

| Distribution | Compacted JS | Unchanged WASM | Compacted total | JS gzip | WASM gzip | Total gzip |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| SQLite Wasm | 298,386 | 879,084 | 1,177,470 | 76,533 | 407,291 | **483,824** |
| SQLite.ai | 281,113 | 1,137,181 | 1,418,294 | 70,436 | 513,180 | **583,616** |
| sqlite-vector-wasm | 325,647 | 943,296 | 1,268,943 | 83,107 | 434,297 | **517,404** |

For this release selection and this protocol, our smaller WASM more than offsets our larger compacted JavaScript relative to SQLite.ai. The result supports a smaller **normalized loader/WASM pair** here; it does not establish a smaller unmodified package download, lower memory usage, equal functionality, a future release guarantee or a size advantage caused solely by omitting extensions. Relative differences use the compared distribution's total gzip size as denominator.

## Reproduce or renew

The manual measurement script is [tools/footprint/measure.mjs](../tools/footprint/measure.mjs); its exact dependency manifest and npm lock are adjacent. It is separate from the product build and release pipeline. Use **Node.js 24.22.1**, npm and system `tar`. From the repository root:

```sh
mkdir -p .work/footprint-tools
cp tools/footprint/package.json tools/footprint/package-lock.json .work/footprint-tools/
npm ci --prefix .work/footprint-tools --ignore-scripts --no-audit --no-fund
node tools/footprint/measure.mjs
```

The default command reproduces the recorded versions and rejects changed archive bytes. Its stdout identifies a fresh JSON report and the totals. Reports include all input/output hashes and material tool settings. To renew the **latest available** selection, run:

```sh
node tools/footprint/measure.mjs --latest
```

A future release may move its entry points; a missing recorded member fails instead of silently selecting another file or shrinking the scope. Review the paths and capability boundaries before renewing the table and the script's recorded version/archive pins together.

To replay an existing generated report and require identical source/output hashes, byte counts, protocol and tool identities:

```sh
node tools/footprint/measure.mjs --snapshot .work/footprint/run-REPLACE/report.json
```

Do not compare gzip bytes from different zlib builds as one run. The recorded execution used:

- Node.js `v24.22.1`, Terser `5.44.1`, zlib `1.3.2.1-motley-285e94b`.
- Tooling lock SHA-256: `eb01c7a363799189da4e2bc729cea156f13d36b2fc41d514278a3ab59da98331`.
- Measurement script SHA-256: `2d4cdc77003cb8ead65c69154a97602bd1212535b56dbf1d3d3b5e12c496d285`.

## Input and measured-file identities

These archive pins identify the original published inputs; compacted outputs are measurements, not published replacements.

- [@sqlite.org/sqlite-wasm 3.54.1-build1](https://registry.npmjs.org/@sqlite.org/sqlite-wasm/-/sqlite-wasm-3.54.1-build1.tgz) — archive SHA-256 `06aaad2dd0b58a46631000a31a4469afff4abeffbc383f37372b6590396d9bbd`.

- [@sqliteai/sqlite-wasm 3.50.4-wasm.1.0.0-sync.1.2.0-vector.1.2.0-memory.1.3.6](https://registry.npmjs.org/@sqliteai/sqlite-wasm/-/sqlite-wasm-3.50.4-wasm.1.0.0-sync.1.2.0-vector.1.2.0-memory.1.3.6.tgz) — archive SHA-256 `bd86fee5f3e463a86fca4eb594df0a0bc9ce5d718c08a8dc5844fddc181bb381`.

- [@at-rama/sqlite-vector-wasm 0.3.2](https://registry.npmjs.org/@at-rama/sqlite-vector-wasm/-/sqlite-vector-wasm-0.3.2.tgz) — archive SHA-256 `4288ed496f4298cb11c3e6effda6b4a06f9a34e7f755fc225b6ae347d059316d`.

| Distribution / file | Published input SHA-256 | Measured compacted SHA-256 |
| --- | --- | --- |
| SQLite Wasm / loader | `0dcdd860e6ec672623b13b8b8e41bb6c78be7a5df80ec553fc4f69160161c8af` | `8598d7e9905559e8056008df79b24b9c75e8c90247ab0065764a2466f04b8ee4` |
| SQLite Wasm / wasm | `b8a92a19f441a90ff2339fe988fbe317c4adf3ed844096f12aee04aa72d58257` | `b8a92a19f441a90ff2339fe988fbe317c4adf3ed844096f12aee04aa72d58257` |
| SQLite.ai / loader | `e20e0d492eca7f298dcd795eaa55708f0b93d9535a70011a8d968e1a498de5e9` | `9570a881eea748ffa99cc4ef603a54b0130ef16a75589ef4b20e8c35d8a10caf` |
| SQLite.ai / wasm | `d9f7d8ec69dabbdfb670a61859bd32ceb005ff88ae3e821f34b077a680c3d7bd` | `d9f7d8ec69dabbdfb670a61859bd32ceb005ff88ae3e821f34b077a680c3d7bd` |
| sqlite-vector-wasm / loader | `a21df2c6b577db54ba8bde7cff68026910679988f0155e285389aec661889a58` | `4294d3f4c7cc6b55628a72051ab99234000b216eef59d3c2ba7b7a42f51adf08` |
| sqlite-vector-wasm / wasm | `3f29c0dc036f711dda273052bbc4540f1426fef4c40e43008d12361a61aa3db6` | `3f29c0dc036f711dda273052bbc4540f1426fef4c40e43008d12361a61aa3db6` |

WASM input and measured hashes are identical by construction. This is a manually renewed size observation, with no size threshold or publication gate.
