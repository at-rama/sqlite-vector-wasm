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

# Candidate preparation controls exercise qualified commits and create-only presentation.
if [ -f tools/updates/run.mjs ]; then
    test -f tools/updates/tests/updates.test.mjs
    node --test tools/updates/tests/*.test.mjs
fi

# Planning controls use captured metadata and injected read-only services offline.
if [ -f tools/watch/run.mjs ]; then
    test -f tools/watch/tests/discovery.test.mjs
    test -f tools/watch/tests/state.test.mjs
    test -f tools/watch/tests/plan.test.mjs
    test -f tools/watch/tests/run.test.mjs
    node --test tools/watch/tests/*.test.mjs
fi

# OpenSpec preflight controls use isolated fake CLI/dependency fixtures offline.
if [ -f tools/openspec/tooling.mjs ]; then
    test -f tools/openspec/tests/test_tooling.py
    PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tools/openspec/tests
fi
