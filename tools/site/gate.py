#!/usr/bin/env python3
"""Select relevant PR Site checks and compose their existing required result."""
import os
import re
import subprocess
import sys


def scope():
    if os.environ.get('EVENT_NAME') != 'pull_request':
        return False
    refs = [os.environ.get(key, '') for key in ('BASE_SHA', 'HEAD_SHA')]
    if any(not re.fullmatch('[0-9a-f]{40}', ref) or ref == '0' * 40 for ref in refs):
        return True
    try:
        paths = subprocess.check_output(['git', 'diff', '--no-ext-diff', '--no-textconv',
            '--no-renames', '--name-only', '-z', *refs, '--']).split(b'\0')
    except (OSError, subprocess.CalledProcessError):
        return True
    # Unknown comparisons require checks; moves include both endpoints.
    if not paths or paths[-1] != b'' or paths == [b'']:
        return True
    pattern = rb'^(site/|tools/(site|harness|acceptance|release|updates|build|package)(/|\.sh$)|tools/test-repository\.sh$|README\.md$|docs/(usage\.md$|site\.md$|sqlite-vector/|common/browser\.md$)|inputs/|\.github/workflows/(site|acceptance|release|updates)\.yml$)'
    return any(re.match(pattern, path) for path in paths[:-1])


def complete(required, result):
    if required not in ('true', 'false'):
        raise ValueError('Site scope unavailable')
    expected = 'success' if required == 'true' else 'skipped'
    if result != expected:
        raise ValueError('Applicable Site qualification/deployment did not complete; merge remains blocked')
    return 'Site qualification/deployment completed.' if required == 'true' else 'Site checks not applicable to this PR diff.'


if __name__ == '__main__':
    if sys.argv[1:] == ['scope']:
        print('required=' + str(scope()).lower())
    elif sys.argv[1:] == ['complete']:
        print(complete(os.environ.get('SITE_REQUIRED'), os.environ.get('SITE_RESULT')))
    else:
        raise ValueError('Usage: gate.py scope|complete')
