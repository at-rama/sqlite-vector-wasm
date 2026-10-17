#!/usr/bin/env bash
set -euo pipefail

[[ $# == 0 || ( $# == 2 && $1 == --lock && -n $2 && $2 != -* ) ]] || {
    echo 'Usage: bash tools/build.sh [--lock PATH]' >&2; exit 2;
}
root=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
# Harness progress goes to stderr; only the orchestrator writes result JSON.
# Preserve the original stdout across SDK activation and its integrity checks.
exec bash "$root/tools/harness.sh" exec bash -c 'script=$1; shift; exec node "$script" "$@" >&3' \
    build "$root/tools/build/build.mjs" "$@" 3>&1 1>&2
