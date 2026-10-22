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
