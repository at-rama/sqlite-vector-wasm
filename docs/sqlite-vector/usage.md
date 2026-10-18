# Using SQLite-Vector

This composition has no published npm release. Examples are exercised through the nonpublished local fixture `sqlite-vector-wasm-fixture@0.0.0-vector` (SQLite 3.54.0, SQLite-Vector 1.1.2); do not install an invented registry version. See the [packaging guide](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/packaging.md) for fixture assembly and verification.

Initialize the official runtime as described in the [browser guide](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/common/browser.md), then execute the following SQL through `db.exec()` on an OO1 database. The example creates an in-memory Float32 dataset and returns rowids 1 then 2, at distances 0 and approximately 1.414214.

```sql
CREATE TABLE documents(embedding BLOB);
INSERT INTO documents(rowid, embedding)
VALUES (1, vector_as_f32('[1,0]')), (2, vector_as_f32('[0,1]'));
SELECT vector_init('documents', 'embedding', 'type=FLOAT32,dimension=2,distance=L2');
SELECT rowid, distance FROM vector_full_scan('documents', 'embedding', '[1,0]', 2)
ORDER BY distance;
```

The native version function is `vector_version()`; expect `1.1.2` for this composition. SQL APIs belong to the selected extension. Switching the packaged extension changes its SQL API; existing databases and queries require explicit compatibility assessment.

Quantization is optional. This example uses exact full-scan Float32 search and does not create a quantized representation. See the [upstream reference](https://github.com/sqliteai/sqlite-vector/tree/0c2223ada9dce1fa33248c8835a15f51d9a0f655) before selecting binary or quantized workflows and their refresh requirements.

Storage and Worker prerequisites are shared across compositions. These examples do not establish full vector acceptance or restart persistence; the [packaging guide](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/packaging.md) identifies the tested conditions.
