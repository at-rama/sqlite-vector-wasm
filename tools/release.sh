#!/bin/sh
set -eu
cd "$(git rev-parse --show-toplevel)"
exec node tools/release/cli.mjs "$@"
