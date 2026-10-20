# Using SQLite-Vector

Use the SQLite-Vector runtime enclosed in this archive. `package.json` identifies its package version and `runtime.json` records the exact SQLite and extension versions. A local prepared archive does not establish an npm publication.

Initialize the official runtime as described in the [browser guide](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/common/browser.md), then execute the following SQL through `db.exec()` on an OO1 database. The example creates an in-memory Float32 dataset and returns rowids 1 then 2, at distances 0 and approximately 1.414214.

```sql
CREATE TABLE documents(embedding BLOB);
INSERT INTO documents(rowid, embedding)
VALUES (1, vector_as_f32('[1,0]')), (2, vector_as_f32('[0,1]'));
SELECT vector_init('documents', 'embedding', 'type=FLOAT32,dimension=2,distance=L2');
SELECT rowid, distance FROM vector_full_scan('documents', 'embedding', '[1,0]', 2)
ORDER BY distance;
```

The native version function is `vector_version()`; its result must match the SQLite-Vector version recorded in `runtime.json`. SQL APIs belong to the selected extension. SQLite-Vector uses ordinary tables and BLOB columns with native `vector_*` functions. Existing sqlite-vec `vec0` tables and `vec_*` queries require adaptation and explicit compatibility assessment; there is no automatic migration of old vector structures.

Quantization is optional. This example uses exact full-scan Float32 search and does not create a quantized representation. See the [upstream reference](https://github.com/sqliteai/sqlite-vector) before selecting binary or quantized workflows and their refresh requirements.

Storage and Worker prerequisites are shared across compositions. These examples do not establish full vector acceptance or restart persistence; the [packaging guide](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/packaging.md) identifies the tested conditions.
