"""Independent scalar reference: no sqlite-vec or production preparation imports."""
import json, math, pathlib, struct, sys

def read_vectors(path):
    data = pathlib.Path(path).read_bytes()
    header, data = data.split(b'\n', 1)
    count, dims = map(int, header.split())
    offset, vectors = 0, []
    for _ in range(count):
        while data[offset:offset+1] in (b'\n', b' '):
            offset += 1
        end = data.index(b' ', offset)
        emoji = data[offset:end].decode('utf8')
        offset = end + 1
        values = struct.unpack_from('<' + 'f' * dims, data, offset)
        offset += dims * 4
        vectors.append((emoji, values))
    return vectors

def reference(path, ids):
    vectors = read_vectors(path)
    norms = [math.sqrt(sum(x*x for x in values)) for _, values in vectors]
    result = []
    for idx in ids:
        _, query = vectors[idx]
        binary, cosine = [], []
        for other, (_, values) in enumerate(vectors):
            binary.append(sum((x > 0) != (y > 0) for x, y in zip(query, values)))
            cosine.append(1 - sum(x*y for x, y in zip(query, values)) / (norms[idx]*norms[other]))
        result.append(dict(id=idx, emoji=vectors[idx][0], binary=binary, float32=cosine))
    return result

if __name__ == '__main__':
    print(json.dumps(reference(sys.argv[1], [int(x) for x in sys.argv[2:]])))
