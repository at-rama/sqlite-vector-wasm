#!/bin/sh
set -eu
cd "$(git rev-parse --show-toplevel)"

test -f tools/gates/tests/test_change_gates.py
test -f tools/gates/tests/test_repository.py
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tools/gates/tests

# Register the A-inputs suite when its implementation enters this checkout.
if [ -f tools/inputs.py ]; then
    test -f tools/tests/test_inputs.py
    PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tools/tests
else
    echo 'Acquisition tests: not applicable (A-inputs implementation absent).'
fi

# Offline orchestration tests use Node's built-in runner and the system C compiler.
if [ -f tools/build/build.mjs ]; then
    test -f tools/build/tests/build.test.mjs
    node --test tools/build/tests/*.test.mjs
fi

# Packaging fixtures inspect final tarballs without downloading sources or SDK tools.
if [ -f tools/package/package.mjs ]; then
    test -f tools/package/tests/package.test.mjs
    node --test tools/package/tests/*.test.mjs
fi

# Acceptance control tests are offline; real production/browser evidence is separate.
if [ -f tools/acceptance/run.mjs ]; then
    test -f tools/acceptance/tests/acceptance.test.mjs
    node --test tools/acceptance/tests/*.test.mjs
fi

# Release policy and injected publication controls never perform real publication.
if [ -f tools/release/policy.mjs ]; then
    test -f tools/release/tests/release.test.mjs
    node --test tools/release/tests/*.test.mjs
fi
