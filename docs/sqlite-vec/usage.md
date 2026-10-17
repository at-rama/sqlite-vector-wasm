# Using sqlite-vec

The published usage reference is `@at-rama/sqlite-vector-wasm@0.2.0` (sqlite-vec 0.1.9). This selected source is also exercised through nonpublished package fixtures.

Initialize the official runtime as described in the [browser guide](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/common/browser.md), then execute the following SQL through `db.exec()` on an OO1 database. The example creates an in-memory Float32 dataset and returns rowids 1 then 2, at distances 0 and approximately 1.414214.

```sql
CREATE VIRTUAL TABLE documents USING vec0(embedding float[2]);
INSERT INTO documents(rowid, embedding) VALUES (1, '[1,0]'), (2, '[0,1]');
SELECT rowid, distance FROM documents
WHERE embedding MATCH '[1,0]' AND k = 2 ORDER BY distance;
```

The native version function is `vec_version()`; expect `v0.1.9` for this composition. SQL APIs belong to the selected extension. Switching the packaged extension changes its SQL API; existing databases and queries require explicit compatibility assessment.

sqlite-vec also provides binary vectors and Hamming distance through its native SQL API; see the [upstream reference](https://alexgarcia.xyz/sqlite-vec/api-reference.html).

Storage and Worker prerequisites are shared across compositions. These examples do not establish full vector acceptance or restart persistence; the [packaging guide](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/packaging.md) identifies the tested conditions.
