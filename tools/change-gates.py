#!/usr/bin/env python3
"""Validate declared OpenSpec Changes between a PR's merge base and head."""

import argparse
from datetime import date
import math
import re
import subprocess
import sys


ROOT = '.42p/openspec/changes/'
NAME = re.compile(r'[a-z0-9]+(?:-[a-z0-9]+)*\Z')
SHA = re.compile(r'[0-9a-f]{40}\Z')
FIELDS = {
    'schema_version', 'change', 'allocation_unit', 'checked_commit', 'verdict',
    'coverage', 'openspec_verify', 'repository_checks', 'applicable_tests',
}
COVERAGE = {'allocation_to_change', 'change_to_allocation'}


class GateError(Exception):
    pass


def git(*args):
    result = subprocess.run(['git', *args], stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE, check=False)
    if result.returncode:
        raise GateError(result.stderr.decode('utf-8', errors='replace').strip())
    return result.stdout


def inventory(commit):
    entries = {}
    for item in git('ls-tree', '-r', '-z', commit, '--', ROOT).split(b'\0'):
        if item:
            info, path = item.split(b'\t', 1)
            mode, kind, oid = info.decode().split()
            entries[path.decode('utf-8')] = (mode, kind, oid)
    return entries


def change_location(path):
    parts = path[len(ROOT):].split('/')
    if parts[0] == 'archive':
        if len(parts) < 3:
            raise GateError(f'Invalid archive path: {path}')
        match = re.fullmatch(r'(\d{4}-\d{2}-\d{2})-(.+)', parts[1])
        if not match:
            raise GateError(f'Expected dated archive directory: {path}')
        try:
            date.fromisoformat(match[1])
        except ValueError as error:
            raise GateError(f'Invalid archive date: {path}') from error
        name = match[2]
        location = ROOT + 'archive/' + parts[1]
        archived = True
    else:
        if len(parts) < 2:
            raise GateError(f'Expected a file inside a Change directory: {path}')
        name = parts[0]
        location = ROOT + name
        archived = False
    if not NAME.fullmatch(name):
        raise GateError(f'Invalid Change name: {path}')
    return name, location, archived


def affected_changes(base, head):
    for commit in (base, head):
        if not SHA.fullmatch(commit):
            raise GateError('Base and head must be full 40-character Git commit SHAs.')
        git('cat-file', '-e', commit + '^{commit}')
    merge_base = git('merge-base', base, head).decode().strip()
    changed = git('diff', '--no-renames', '--name-only', '-z', merge_base, head,
                  '--', ROOT).decode('utf-8').split('\0')
    names = {change_location(path)[0] for path in changed if path}
    entries = inventory(head)
    locations = {name: set() for name in names}
    for path in entries:
        # Unchanged unrelated Changes do not enter this gate.
        parts = path[len(ROOT):].split('/')
        candidate = parts[1][11:] if parts[0] == 'archive' and len(parts) > 1 else parts[0]
        if candidate in names:
            name, location, archived = change_location(path)
            locations[name].add((location, archived))
    changes = []
    for name in sorted(names):
        found = locations[name]
        if not found:
            raise GateError(f'{name}: deleted without a corresponding archive.')
        if len(found) != 1:
            raise GateError(f'{name}: multiple locations (active/archive or duplicate archives).')
        location, archived = next(iter(found))
        read_file(entries, location + '/.openspec.yaml')
        changes.append((name, location, archived))
    return changes, entries


def read_file(entries, path):
    if path not in entries:
        raise GateError(f'Missing required artifact: {path}')
    mode, kind, oid = entries[path]
    if mode not in ('100644', '100755') or kind != 'blob':
        raise GateError(f'Artifact must be a regular Git file: {path}')
    try:
        return git('cat-file', 'blob', oid).decode('utf-8')
    except UnicodeDecodeError as error:
        raise GateError(f'Artifact must be UTF-8: {path}') from error


def frontmatter(text):
    """Read the version-1 YAML profile: mappings and plain scalar values only."""
    lines = text.splitlines()
    if not lines or lines[0] != '---':
        raise GateError('Report must start with YAML frontmatter delimited by ---.')
    try:
        end = lines.index('---', 1)
    except ValueError as error:
        raise GateError('Unclosed YAML frontmatter.') from error
    values = {}
    coverage = {}
    nested = False
    for line in lines[1:end]:
        if not line.strip() or line.lstrip().startswith('#'):
            continue
        match = re.fullmatch(r'( {0}| {2})([a-z_]+):(?: (\S+))?', line)
        if not match:
            raise GateError(f'Unsupported or malformed version-1 YAML line: {line!r}')
        indent, key, scalar = match.groups()
        if indent:
            if not nested or key not in COVERAGE:
                raise GateError(f'Unexpected nested field: {key}')
            target = coverage
        else:
            nested = key == 'coverage'
            if key not in FIELDS:
                raise GateError(f'Unknown field: {key}')
            target = values
        if key in target:
            raise GateError(f'Duplicate field: {key}')
        if key == 'coverage' and not indent:
            if scalar is not None:
                raise GateError('coverage must be a nested mapping.')
            target[key] = coverage
        elif scalar is None:
            raise GateError(f'Missing scalar value: {key}')
        else:
            target[key] = scalar
    if set(values) != FIELDS or set(coverage) != COVERAGE:
        raise GateError('Missing required frontmatter fields.')
    if not '\n'.join(lines[end + 1:]).strip():
        raise GateError('Report must contain a readable evidence body.')
    return values


def validate_report(text, name, allocation_handles):
    report = frontmatter(text)
    if report['schema_version'] != '1':
        raise GateError('schema_version must be the integer 1.')
    if report['change'] != name:
        raise GateError(f'change must match directory identity {name}.')
    if report['allocation_unit'] not in allocation_handles:
        raise GateError('allocation_unit must identify a unit in the repository Allocation.')
    if not SHA.fullmatch(report['checked_commit']):
        raise GateError('checked_commit must be a full Git commit SHA.')
    for key in ('verdict', 'openspec_verify', 'repository_checks', 'applicable_tests'):
        if report[key] not in {'passed', 'failed', 'blocked'}:
            raise GateError(f'{key}: expected passed, failed or blocked.')
        if report[key] != 'passed':
            raise GateError(f'{key}: {report[key]} prevents merge.')
    for key, value in report['coverage'].items():
        if not re.fullmatch(r'(?:0|[1-9][0-9]*)(?:\.[0-9]+)?', value):
            raise GateError(f'coverage.{key}: expected a numeric percentage equal to 100.')
        number = float(value)
        if not math.isfinite(number) or number != 100:
            raise GateError(f'coverage.{key}: {value} is not 100%.')


def allocation_units(head):
    handles = set()
    for item in git('ls-tree', '-r', '-z', head, '--', '.42p/engineering/').split(b'\0'):
        if item:
            info, raw_path = item.split(b'\t', 1)
            path = raw_path.decode('utf-8')
            if re.search(r'_allocation_edit-[^/]+\.md\Z', path):
                mode, kind, oid = info.decode().split()
                content = read_file({path: (mode, kind, oid)}, path)
                handles.update(re.findall(r'^### (A-[A-Za-z0-9_-]+)\s', content, re.M))
    return handles


def check(gate, base, head):
    changes, entries = affected_changes(base, head)
    if not changes:
        print(f'{gate}: not applicable (no changed OpenSpec Change).')
        return
    handles = allocation_units(head) if gate == 'verification' else set()
    errors = []
    for name, location, archived in changes:
        try:
            report = read_file(entries, location + '/verification.md')
            if gate == 'verification':
                validate_report(report, name, handles)
            elif not archived:
                raise GateError('Change is still active; archive it before merge.')
            print(f'{gate}: passed for {name}.')
        except GateError as error:
            errors.append(f'{name}: {error}')
    if errors:
        raise GateError('\n'.join(errors))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('gate', choices=('verification', 'archive'))
    parser.add_argument('--base', required=True)
    parser.add_argument('--head', required=True)
    args = parser.parse_args()
    try:
        check(args.gate, args.base, args.head)
    except (GateError, UnicodeDecodeError) as error:
        print(f'{args.gate}: FAILED: {error}', file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
