# Browser runtime download footprint

The ES module loader and WASM binary together transfer about **672 kB with gzip**, or **1.77 MB without compression**, in the measured deployment. Units are decimal: 1 kB = 1,000 bytes and 1 MB = 1,000,000 bytes.

This is a dated observation for these two files. Application data and additional requested Worker/OPFS companions are extra. The npm archive includes alternative entry points and documentation, so its compressed size is a different measurement. Server compression and caching affect actual downloads; file sizes do not measure runtime memory consumption.

## Measured publication and deployment

Observed on **2026-10-22 at 05:47 UTC**. GitHub Pages served the demo runtime from **0.3.0**, from site source commit `af5ddc9e8636cc0088948a846aad92fb569515de`. The decoded files were byte-identical to the corresponding entries in the published **0.3.1** npm archive. This does not mean the demo selected 0.3.1 or establish a size guarantee for every release.

- [Published release 0.3.1](https://github.com/at-rama/sqlite-vector-wasm/releases/tag/dist/v0.3.1)
- [Exact npm archive](https://registry.npmjs.org/@at-rama/sqlite-vector-wasm/-/sqlite-vector-wasm-0.3.1.tgz)
- [Deployment identity](https://at-rama.github.io/sqlite-vector-wasm/site-publication.json) — a current record which can change after deployment.

Archive SHA-256: `753ead2e894f8b502b75d2328f1b991bcf83fb5bedb9351591309fe7a3f77adb`.

| File | Raw bytes | HTTP gzip body bytes |
| --- | ---: | ---: |
| [sqlite3.mjs](https://at-rama.github.io/sqlite-vector-wasm/demo-runtime/sqlite3.mjs) | 829,068 | 233,688 |
| [sqlite3.wasm](https://at-rama.github.io/sqlite-vector-wasm/demo-runtime/sqlite3.wasm) | 943,296 | 438,112 |
| Total | 1,772,364 | 671,800 |

Decoded SHA-256 identities:

```text
8bbd6d8674d86ab645d0dabe0b590e328d6a7e7d90c4426bec8865f404a91e93  sqlite3.mjs
3f29c0dc036f711dda273052bbc4540f1426fef4c40e43008d12361a61aa3db6  sqlite3.wasm
```

## Reproduce the measurement

Use Python 3 and its standard library. The command verifies the exact npm archive digest, downloads each Pages file with `Accept-Encoding: identity` and then `Accept-Encoding: gzip`, counts response-body bytes before decompression, and compares the decoded bytes with the package entries. The gzip requests must actually return `Content-Encoding: gzip`. Counts exclude HTTP headers and transport overhead; they are not local recompression estimates. A changed serving selection fails byte comparison instead of silently measuring another publication.

```sh
python3 - <<'PY'
import gzip, hashlib, io, tarfile, urllib.request

archive_url = 'https://registry.npmjs.org/@at-rama/sqlite-vector-wasm/-/sqlite-vector-wasm-0.3.1.tgz'
archive_sha256 = '753ead2e894f8b502b75d2328f1b991bcf83fb5bedb9351591309fe7a3f77adb'
base = 'https://at-rama.github.io/sqlite-vector-wasm/demo-runtime/'

def download(url, encoding):
    request = urllib.request.Request(url, headers={'Accept-Encoding': encoding})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read(), response.headers.get('Content-Encoding')

archive, _ = download(archive_url, 'identity')
assert hashlib.sha256(archive).hexdigest() == archive_sha256
totals = {'identity': 0, 'gzip': 0}
with tarfile.open(fileobj=io.BytesIO(archive), mode='r:gz') as package:
    for name in ['sqlite3.mjs', 'sqlite3.wasm']:
        expected = package.extractfile('package/' + name).read()
        for encoding in ['identity', 'gzip']:
            body, actual_encoding = download(base + name, encoding)
            if encoding == 'gzip':
                assert actual_encoding == 'gzip', actual_encoding
            else:
                assert actual_encoding in [None, 'identity'], actual_encoding
            raw = gzip.decompress(body) if actual_encoding == 'gzip' else body
            assert raw == expected, 'Different published bytes: ' + name
            totals[encoding] += len(body)
            print(name, encoding, 'body', len(body), 'raw', len(raw),
                  'sha256', hashlib.sha256(raw).hexdigest())
print('Total response-body bytes:', totals)
PY
```

Keep the README summary rounded and link it to this record. Renew this note when a newly measured publication or hosting configuration changes the observation; ordinary documentation builds do not select another runtime or benchmark every release.

## Latest available releases: shared-CDN observation

Observed on **2026-11-02**, from **02:18:14 to 02:18:34 UTC**. Each version was selected from its package's npm `latest` metadata during this session, then pinned before measuring. This is a latest-available distribution snapshot, not a same-SQLite-version experiment. SQLite Wasm here means the official npm subproject `@sqlite.org/sqlite-wasm`; SQLite-Vector's published browser distribution is `@sqliteai/sqlite-wasm`, which also includes SQLite-Sync and SQLite-Memory. It does not represent the Vector extension alone.

All three loader/WASM pairs were fetched from **jsDelivr**, using exact version URLs and the same `identity` / `gzip` requests as the Pages observation. The npm archives were checked against registry SHA-512 integrity and the pinned SHA-256 identities below. All twelve file responses passed encoding and decoded-byte equality checks. The earlier Pages observation remains historical; its gzip values should not be mixed with this CDN series.

| Distribution | Selected npm version | Raw bytes | HTTP gzip body bytes |
| --- | --- | ---: | ---: |
| @sqlite.org/sqlite-wasm | `3.54.1-build1` | 1,535,956 | 586,211 |
| @sqliteai/sqlite-wasm | `3.50.4-wasm.1.0.0-sync.1.2.0-vector.1.2.0-memory.1.3.6` | 1,575,454 | 595,662 |
| @at-rama/sqlite-vector-wasm | `0.3.2` | 1,772,364 | 663,047 |

The selected files are an ESM loader and its WASM binary, as in the historical measurement. The official npm loader is `dist/index.mjs` and includes its promiser export. SQLite.ai is measured through its direct `sqlite3.mjs` loader, excluding its optional package-root wrapper and promiser module; this is not the full dependency graph of importing that package root. Our loader remains `sqlite3.mjs`. Packaging, JavaScript transformations, SQLite versions and extension sets differ. These results describe published file pairs, not equivalent capabilities or isolated extension overhead; no browser startup or compatibility test was performed here.

Our WASM is smaller than SQLite.ai's, but our JavaScript loader is larger and the measured pair transfers more bytes overall. This observation does not support a claim that our published runtime downloads less than SQLite.ai's. Neither the size difference nor its cause can be attributed solely to the presence or absence of extensions.

Repeated gzip requests in this session returned slightly different compressed lengths for identical decoded bytes. A common CDN reduces the hosting difference but does not fix compression settings or edge selection. The table records one completed run, not an invariant gzip size. Application data, additional Worker/OPFS companions, headers, transport overhead, caching savings and runtime memory remain outside the measurement.

### @sqlite.org/sqlite-wasm 3.54.1-build1

[Exact package metadata](https://registry.npmjs.org/@sqlite.org/sqlite-wasm/3.54.1-build1) · [Exact npm archive](https://registry.npmjs.org/@sqlite.org/sqlite-wasm/-/sqlite-wasm-3.54.1-build1.tgz)

Archive SHA-256: `06aaad2dd0b58a46631000a31a4469afff4abeffbc383f37372b6590396d9bbd`.

| File | Raw bytes | HTTP gzip body bytes |
| --- | ---: | ---: |
| [dist/index.mjs](https://cdn.jsdelivr.net/npm/@sqlite.org/sqlite-wasm@3.54.1-build1/dist/index.mjs) | 656,872 | 178,756 |
| [dist/sqlite3.wasm](https://cdn.jsdelivr.net/npm/@sqlite.org/sqlite-wasm@3.54.1-build1/dist/sqlite3.wasm) | 879,084 | 407,455 |

Decoded SHA-256 identities:

```text
0dcdd860e6ec672623b13b8b8e41bb6c78be7a5df80ec553fc4f69160161c8af  dist/index.mjs
b8a92a19f441a90ff2339fe988fbe317c4adf3ed844096f12aee04aa72d58257  dist/sqlite3.wasm
```

### @sqliteai/sqlite-wasm 3.50.4-wasm.1.0.0-sync.1.2.0-vector.1.2.0-memory.1.3.6

[Exact package metadata](https://registry.npmjs.org/@sqliteai/sqlite-wasm/3.50.4-wasm.1.0.0-sync.1.2.0-vector.1.2.0-memory.1.3.6) · [Exact npm archive](https://registry.npmjs.org/@sqliteai/sqlite-wasm/-/sqlite-wasm-3.50.4-wasm.1.0.0-sync.1.2.0-vector.1.2.0-memory.1.3.6.tgz)

Archive SHA-256: `bd86fee5f3e463a86fca4eb594df0a0bc9ce5d718c08a8dc5844fddc181bb381`.

| File | Raw bytes | HTTP gzip body bytes |
| --- | ---: | ---: |
| [sqlite-wasm/jswasm/sqlite3.mjs](https://cdn.jsdelivr.net/npm/@sqliteai/sqlite-wasm@3.50.4-wasm.1.0.0-sync.1.2.0-vector.1.2.0-memory.1.3.6/sqlite-wasm/jswasm/sqlite3.mjs) | 438,273 | 84,342 |
| [sqlite-wasm/jswasm/sqlite3.wasm](https://cdn.jsdelivr.net/npm/@sqliteai/sqlite-wasm@3.50.4-wasm.1.0.0-sync.1.2.0-vector.1.2.0-memory.1.3.6/sqlite-wasm/jswasm/sqlite3.wasm) | 1,137,181 | 511,320 |

Decoded SHA-256 identities:

```text
e1b20ed394b23ed6cf747c12e2e4f39ab79987933ff18fffa23071ecee8862d0  sqlite-wasm/jswasm/sqlite3.mjs
d9f7d8ec69dabbdfb670a61859bd32ceb005ff88ae3e821f34b077a680c3d7bd  sqlite-wasm/jswasm/sqlite3.wasm
```

### @at-rama/sqlite-vector-wasm 0.3.2

[Exact package metadata](https://registry.npmjs.org/@at-rama/sqlite-vector-wasm/0.3.2) · [Exact npm archive](https://registry.npmjs.org/@at-rama/sqlite-vector-wasm/-/sqlite-vector-wasm-0.3.2.tgz)

Archive SHA-256: `4288ed496f4298cb11c3e6effda6b4a06f9a34e7f755fc225b6ae347d059316d`.

| File | Raw bytes | HTTP gzip body bytes |
| --- | ---: | ---: |
| [sqlite3.mjs](https://cdn.jsdelivr.net/npm/@at-rama/sqlite-vector-wasm@0.3.2/sqlite3.mjs) | 829,068 | 229,966 |
| [sqlite3.wasm](https://cdn.jsdelivr.net/npm/@at-rama/sqlite-vector-wasm@0.3.2/sqlite3.wasm) | 943,296 | 433,081 |

Decoded SHA-256 identities:

```text
8bbd6d8674d86ab645d0dabe0b590e328d6a7e7d90c4426bec8865f404a91e93  sqlite3.mjs
3f29c0dc036f711dda273052bbc4540f1426fef4c40e43008d12361a61aa3db6  sqlite3.wasm
```

### Reproduce this latest-release snapshot

Use Python 3 and its standard library, without `-O` (the checks use assertions). This is the exact script executed for the recorded run. It prints per-file raw/gzip body sizes and decoded SHA-256 identities, archive identities, totals and timestamps as JSON. Failure produces no successful output. Version and archive pins reproduce this snapshot even after `latest` changes; gzip lengths can change while all identity checks still pass.

```sh
python3 - <<'PY'
import base64, concurrent.futures, datetime, gzip, hashlib, io, json, tarfile, urllib.request

# These versions were resolved from npm's latest tags on the observation date.
selections = [
    ('@sqlite.org/sqlite-wasm', '3.54.1-build1', ['dist/index.mjs', 'dist/sqlite3.wasm']),
    ('@sqliteai/sqlite-wasm', '3.50.4-wasm.1.0.0-sync.1.2.0-vector.1.2.0-memory.1.3.6',
     ['sqlite-wasm/jswasm/sqlite3.mjs', 'sqlite-wasm/jswasm/sqlite3.wasm']),
    ('@at-rama/sqlite-vector-wasm', '0.3.2', ['sqlite3.mjs', 'sqlite3.wasm']),
]

archive_digests = {
    '@sqlite.org/sqlite-wasm': '06aaad2dd0b58a46631000a31a4469afff4abeffbc383f37372b6590396d9bbd',
    '@sqliteai/sqlite-wasm': 'bd86fee5f3e463a86fca4eb594df0a0bc9ce5d718c08a8dc5844fddc181bb381',
    '@at-rama/sqlite-vector-wasm': '4288ed496f4298cb11c3e6effda6b4a06f9a34e7f755fc225b6ae347d059316d',
}

def download(url, encoding):
    request = urllib.request.Request(url, headers={'Accept-Encoding': encoding})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read(), response.headers.get('Content-Encoding'), response.geturl()

def measure(selection):
    name, version, paths = selection
    metadata_url = 'https://registry.npmjs.org/' + name + '/' + version
    metadata = json.loads(download(metadata_url, 'identity')[0])
    assert metadata['name'] == name and metadata['version'] == version
    archive_url = metadata['dist']['tarball']
    archive, encoding, _ = download(archive_url, 'identity')
    assert encoding in [None, 'identity'], encoding
    assert hashlib.sha256(archive).hexdigest() == archive_digests[name]
    algorithm, digest = metadata['dist']['integrity'].split('-', 1)
    assert algorithm == 'sha512', algorithm
    assert base64.b64encode(hashlib.sha512(archive).digest()).decode() == digest
    result = dict(package=name, version=version, metadata=metadata_url,
                  archive=archive_url, archiveSha256=hashlib.sha256(archive).hexdigest(),
                  archiveIntegrity=metadata['dist']['integrity'], files=[])
    with tarfile.open(fileobj=io.BytesIO(archive), mode='r:gz') as package:
        for path in paths:
            expected = package.extractfile('package/' + path).read()
            url = 'https://cdn.jsdelivr.net/npm/' + name + '@' + version + '/' + path
            item = dict(path=path, url=url, sha256=hashlib.sha256(expected).hexdigest())
            for requested in ['identity', 'gzip']:
                body, actual, final_url = download(url, requested)
                assert final_url == url, final_url
                assert actual == 'gzip' if requested == 'gzip' else actual in [None, 'identity'], actual
                raw = gzip.decompress(body) if actual == 'gzip' else body
                assert raw == expected, 'Different published bytes: ' + url
                item[requested + 'Bytes'] = len(body)
            result['files'].append(item)
    result['totals'] = {key: sum(item[key] for item in result['files'])
                        for key in ['identityBytes', 'gzipBytes']}
    return result

started = datetime.datetime.now(datetime.timezone.utc).isoformat()
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
    results = list(pool.map(measure, selections))
print(json.dumps(dict(started=started, finished=datetime.datetime.now(datetime.timezone.utc).isoformat(),
                      distributions=results), indent=2))
PY
```

For a future latest-available observation, first query `https://registry.npmjs.org/<package>/latest` for each of the three package names, select the actual published loader/WASM paths, and record the resolution date. Renew the pinned versions, archive digests and measured tables together. The frozen reproduction command intentionally does not silently switch versions. This remains a manually renewed measurement record, with no release gate or size threshold.
