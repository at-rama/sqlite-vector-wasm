#!/usr/bin/env python3
"""Prepare controlled upstream notices; never write candidate tracked inputs."""
import argparse
import copy
import hashlib
import json
import os
from pathlib import Path
import re
import stat
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import inputs

FILES = {'SQLite-LICENSE.txt': ('sqlite', 'LICENSE.md'),
         'SQLite-WASM-NOTICE.txt': ('sqlite', 'ext/wasm/api/sqlite3-license-version-header.js'),
         'sqlite-vector-APACHE.txt': ('sqliteVector', 'LICENSE.md')}
NORMALIZATION = 'Trailing horizontal whitespace and blank EOF lines removed; notice wording preserved.'


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def regular(path):
    fd = os.open(path, os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK)
    with os.fdopen(fd, 'rb') as stream:
        inputs.require(stat.S_ISREG(os.fstat(stream.fileno()).st_mode), 'Nonregular notice source')
        data = stream.read()
    inputs.require(data, 'Empty notice source')
    return data


def derive(raw, header=False):
    text = raw.decode('utf-8', errors='strict')
    inputs.require('\x00' not in text, 'Unsupported notice text encoding')
    if header:
        match = re.match(r'\A/\* @preserve\b[\s\S]*?\*/', text)
        inputs.require(match is not None, 'Missing initial SQLite WASM preserve license block')
        text = match[0]
    # Preserve upstream CRLF line endings; only the permitted horizontal/EOF whitespace is removed.
    lines = [line[:-1].rstrip(' \t') + '\r' if line.endswith('\r') else line.rstrip(' \t')
             for line in text.split('\n')]
    while lines and not lines[-1].rstrip('\r'):
        lines.pop()
    inputs.require(any(line.strip() for line in lines), 'Empty notice text')
    return ('\n'.join(lines) + '\n').encode('utf-8')



def reconcile(repository, selected, directory, acquire=inputs.acquire_lock, fetch=inputs.fetch_file):
    repository, directory = Path(repository), Path(directory)
    directory.mkdir(parents=True, exist_ok=True)
    report_path = directory / 'notices.json'
    report = {'schemaVersion': 1, 'status': 'in-progress', 'selection': {}, 'notices': []}

    def save():
        report_path.write_text(json.dumps(report, indent=2) + '\n')

    save()
    current_name = None
    current_project = None
    try:
        baseline = inputs.read_json(repository / 'inputs/sqlite-vector.sources.lock.json')
        selected = inputs.validate_lock(selected)
        report['selection'] = {key: selected[key]['version'] for key in ('sqlite', 'sqliteVector')}
        manifest_raw = regular(repository / 'tools/package/notices.json')
        manifest = json.loads(manifest_raw, object_pairs_hook=inputs.unique_object)
        changed = {key for key in ('sqlite', 'sqliteVector') if selected[key]['version'] != baseline[key]['version']}
        handoff = None
        if changed:
            report['acquisition'] = {'status': 'in-progress', 'inputs': selected}
            save()
            def acquisition_fetch(url, destination):
                nonlocal current_project
                current_project = next(key for key in ('sqlite', 'sqliteVector') if selected[key]['archiveUrl'] == url)
                report['acquisition']['currentProject'] = current_project
                save()
                return fetch(url, destination)

            handoff = acquire((json.dumps(selected, indent=2) + '\n').encode(), directory / 'notice-inputs', fetch=acquisition_fetch)
            report['acquisition']['status'] = 'passed'
        if handoff:
            dependency = next(record for record in manifest['notices'] if record['project'] == 'fp16')
            headers = {}
            for name in dependency['incorporatedHeaders']:
                raw = regular(Path(handoff['sqliteVector']['sourcePath']) / 'libs/fp16' / name)
                headers[name] = hashlib.sha1(b'blob ' + str(len(raw)).encode() + b'\0' + raw).hexdigest()
            inputs.require(headers == dependency['incorporatedHeaders'], 'Pinned FP16 incorporated headers drift')
            report['dependency'] = {'project': 'fp16', 'commit': dependency['version'],
                                    'incorporatedHeaders': headers, 'status': 'passed'}
        staged = directory / 'prepared'
        staged.mkdir()  # Run-local and create-only: stale prepared inputs cannot be reused.
        texts = {}
        for record in manifest['notices']:
            current_name, current_project = record['name'], record['project']
            inputs.require(re.fullmatch(r'[A-Za-z0-9-]+\.txt', current_name), 'Invalid notice filename')
            old = regular(repository / 'tools/package/notices' / current_name)
            inputs.require(sha256(old) == record['sha256'], f'{current_name}: recorded digest mismatch')
            if current_name not in FILES or current_project not in changed:
                texts[current_name] = old
                if current_name in FILES:
                    inputs.require(current_project == FILES[current_name][0] and record['version'] == selected[current_project]['version'], 'Retained notice association mismatch')
                    report['notices'].append({'name': current_name, 'project': current_project, 'disposition': 'retained',
                        'record': copy.deepcopy(record), 'recordedSha256': sha256(old), 'validation': 'passed',
                        'rawSource': record.get('source', 'not-established')})
                continue
            project, member = FILES[current_name]
            inputs.require(current_project == project, 'Notice project mismatch')
            report['notices'].append({'name': current_name, 'project': project, 'disposition': 'refreshed', 'status': 'in-progress'})
            save()
            source_root = Path(handoff[project]['sourcePath'])
            source = source_root / member
            raw = regular(source)
            relative = source.relative_to(Path(handoff['workspace']) / project).as_posix()
            pin = selected[project]
            origin = {'kind': 'archive', 'archiveUrl': pin['archiveUrl'], 'archiveDigest': pin['digest'],
                      'path': relative, 'sha256': sha256(raw)}
            url = pin['archiveUrl'] + '#' + relative
            if project == 'sqliteVector':
                # Package validation binds the shipped raw Apache text to the selected commit.
                inputs.require(derive(raw) == raw, 'Unsupported Vector license normalization')
                origin.update(commit=pin['commit'])
                url = f'https://github.com/sqliteai/sqlite-vector/blob/{pin["commit"]}/LICENSE.md'
            header = current_name == 'SQLite-WASM-NOTICE.txt'
            data = derive(raw, header)
            record.update(version=selected[project]['version'], origin=url, sha256=sha256(data), source=origin)
            record.pop('normalization', None)
            record.pop('extraction', None)
            if data != raw:
                record['normalization'] = NORMALIZATION
            if header:
                record['extraction'] = 'Initial /* @preserve license block through first */; subsequent version/template code excluded.'
            texts[current_name] = data
            report['notices'][-1].update(status='passed', record=copy.deepcopy(record))
            save()
        for name, data in texts.items():
            output = staged / 'tools/package/notices' / name
            output.parent.mkdir(parents=True, exist_ok=True)
            output.write_bytes(data)
        (staged / 'tools/package/notices.json').write_bytes(
            (json.dumps(manifest, indent=2) + '\n').encode() if changed else manifest_raw)
        for name in ('LICENSE', 'tools/package/NOTICE-vector.txt'):
            output = staged / name
            output.parent.mkdir(parents=True, exist_ok=True)
            output.write_bytes(regular(repository / name))
        report['status'] = 'prepared'
        report['prepared'] = str(staged.resolve())
        save()
        return {'prepared': str(staged.resolve()), 'reportPath': str(report_path.resolve())}
    except Exception as error:
        report['status'] = 'failed'
        report['failure'] = {'name': current_name, 'project': current_project,
                             'notices': [name for name, (project, _) in FILES.items() if project == current_project],
                             'diagnostic': str(error)}
        if report.get('acquisition', {}).get('status') == 'in-progress':
            report['acquisition']['status'] = 'failed'
        save()
        raise


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repository', required=True)
    parser.add_argument('--lock', required=True)
    parser.add_argument('--directory', required=True)
    args = parser.parse_args()
    result = reconcile(args.repository, inputs.read_json(args.lock), args.directory)
    print(json.dumps(result))


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print(f'Notice reconciliation failed: {error}', file=sys.stderr)
        sys.exit(1)
