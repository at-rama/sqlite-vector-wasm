#!/bin/sh
set -eu

cd "$(git rev-parse --show-toplevel)"

if [ -n "$(git ls-files -- ':(icase)SPEC.md')" ]; then
    echo 'Root SPEC.md is retired; retain immutable historical provenance instead.' >&2
    exit 1
fi
# OpenSpec is a derived realization canon, never a second root contract.
if [ -e openspec ] || [ -L openspec ]; then
    echo 'OpenSpec project root must be .42p; root-level openspec is forbidden.' >&2
    exit 1
fi
# Check canon byte identities and the concrete Capture/Allocation input
# convention, not editorial meaning, authority or semantic coverage.
PYTHONDONTWRITEBYTECODE=1 python3 - <<'PY'
import hashlib
from pathlib import Path
import re
import subprocess

if any(p.name.casefold() == 'spec.md' for p in Path('.').iterdir()):
    raise SystemExit('Root SPEC.md is retired, including untracked/case variants.')

entries = {}
for entry in subprocess.check_output(['git', 'ls-files', '--stage', '-z']).split(b'\0'):
    if entry:
        info, path = entry.split(b'\t', 1)
        mode, oid, stage = info.decode().split()
        if stage != '0':
            raise SystemExit('Unresolved Git index entries are not a candidate snapshot.')
        entries[path.decode()] = mode

def tracked_regular(name):
    path = Path(name)
    return (entries.get(name) in {'100644', '100755'} and path.is_file()
            and not any(parent.is_symlink() for parent in [path, *path.parents]))

for name in ('README.md', '.gitignore'):
    if not tracked_regular(name):
        raise SystemExit(f'Missing repository authority or integrity configuration: {name}')

manifest = '.42p/standards/canon.sha256'
if not tracked_regular(manifest):
    raise SystemExit(f'Canon manifest must be a tracked regular file: {manifest}')
try:
    lines = Path(manifest).read_text(encoding='utf-8').splitlines()
except (OSError, UnicodeError) as error:
    raise SystemExit(f'Cannot read canon manifest: {error}')
if not lines:
    raise SystemExit('Empty canon manifest.')
seen = set()
for number, line in enumerate(lines, 1):
    match = re.fullmatch(r'([0-9a-f]{64})  ([A-Za-z0-9_.-]+(?:/[A-Za-z0-9_.-]+)*)', line)
    if not match:
        raise SystemExit(f'Invalid canon manifest entry at line {number}.')
    digest, name = match.groups()
    if any(part in {'.', '..'} for part in name.split('/')) or name == manifest:
        raise SystemExit(f'Invalid canon manifest path: {name}')
    if name in seen:
        raise SystemExit(f'Duplicate canon manifest entry: {name}')
    seen.add(name)
    if not tracked_regular(name):
        raise SystemExit(f'Canon file must be a tracked regular file: {name}')
    if hashlib.sha256(Path(name).read_bytes()).hexdigest() != digest:
        raise SystemExit(f'Canon SHA-256 mismatch: {name}')
if [line.split('  ', 1)[1] for line in lines] != sorted(seen):
    raise SystemExit('Canon manifest entries must be sorted by path.')
print('Canon byte identities passed (human authorization not evaluated).')

captures = {p for p in entries if re.fullmatch(
    r'\.42p/engineering/[^/]+_capture_edit-[^/]+\.md', p)}
allocations = [p for p in entries if re.fullmatch(
    r'\.42p/engineering/[^/]+_allocation_edit-[^/]+\.md', p)]
if not captures or len(allocations) != 1:
    raise SystemExit('Expected tracked Captures and one global Allocation.')
for name in captures | set(allocations):
    path = Path(name)
    if not tracked_regular(name):
        raise SystemExit(f'Design input must be a tracked regular file: {name}')
    if not path.read_text(encoding='utf-8').strip():
        raise SystemExit(f'Empty design input: {name}')

allocation = Path(allocations[0])
inputs = allocation.read_text(encoding='utf-8').split('## Allocation units', 1)[0]
references = re.findall(
    r'^- \[[^\n]+\]\(([^/()]+_capture_edit-[^/()]+\.md)\), '
    r'snapshot SHA-256 `([0-9a-f]{64})`\.$', inputs, re.M)
resolved = [(str(allocation.parent / name), digest) for name, digest in references]
if len(resolved) != len(captures) or {p for p, _ in resolved} != captures:
    raise SystemExit('Global Allocation inputs must name every tracked Capture exactly once.')
for name, digest in resolved:
    if hashlib.sha256(Path(name).read_bytes()).hexdigest() != digest:
        raise SystemExit(f'Stale Allocation Capture snapshot: {name}')
print('Capture/Allocation input identities passed (semantic coverage not evaluated).')
PY

ignored=$(git ls-files -ci --exclude-per-directory=.gitignore)
if [ -n "$ignored" ]; then
    echo 'Tracked files violate repository ignore rules:' >&2
    printf '%s\n' "$ignored" >&2
    exit 1
fi

# Compare the whole tracked working snapshot, not only the latest commit's diff.
empty_tree=$(git hash-object -t tree /dev/null)
git -c core.whitespace=blank-at-eol,blank-at-eof,space-before-tab diff --check "$empty_tree" --
# Source-lock integrity is offline; automated suites run in test-repository.sh.
PYTHONDONTWRITEBYTECODE=1 python3 tools/inputs.py validate inputs/sqlite-vector.sources.lock.json
echo 'Repository checks passed (product acceptance not evaluated).'
