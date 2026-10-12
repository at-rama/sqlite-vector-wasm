#!/usr/bin/env bash
set -euo pipefail

# Technical harness identities only; no SQLite/sqlite-vec release selection.
root=$(cd "$(dirname "$0")/.." && pwd)
state=${HARNESS_STATE:-"$root/.work/harness"}
[[ "$state" == /* ]] || { echo 'HARNESS_STATE must be an absolute temporary path.' >&2; exit 1; }
sdk_commit=96c657fc60920d2a6a82318aa50e0abf82749604
sdk_build=aaa43392544d695232b70eda706d751f18980c2a
sdk_digest=5f1565fe45a1223cedf3b0300f5089c2c64954d2895b2aaedc85043c719be965
clang_digest=3963cbebea4c2d841e6a65442ed4f1e744a49c325f2fa60c6727be9c0d54691c
node_digest=14b342e71204f811bde6153be8e04b62aef63c236fef92b55f9c83154b409647
wabt_digest=84895407a6bbb80e918f33b16b2fb2206021c150b6bc9ff6f761263a745ab131
chrome_digest=a9da028861a0cf789ff25c2fed45f5f1aaf969ed9247835b6a7821a4f7af9d1d
chrome_member_digest=ded93a9c9a53a1ae040f08124badcca95c938e9d5015ff340c3b5538c41bf39e

fail() { echo "Harness: $*" >&2; exit 1; }
verify() { printf '%s  %s\n' "$2" "$1" | sha256sum --check --status || fail "Integrity mismatch: $1"; }
fetch() { curl --fail --location --retry 3 --output "$2" "$1"; verify "$2" "$3"; }
platform() {
    [[ $(uname -s) == Linux && $(uname -m) == x86_64 ]] || fail 'Qualified platform is Linux x86-64.'
}
environment() {
    [[ -f "$state/emsdk/emsdk_env.sh" ]] || fail 'Run: bash tools/harness.sh install'
    [[ $(git -C "$state/emsdk" rev-parse HEAD) == "$sdk_commit" ]] || fail 'Wrong emsdk installer commit.'
    git -C "$state/emsdk" diff --quiet HEAD -- || fail 'Modified emsdk installer.'
    unset EM_CONFIG EM_CACHE EMSDK_NODE
    # Upstream activation is necessary but did not reliably prioritize SDK Node.
    source "$state/emsdk/emsdk_env.sh" >/dev/null 2>&1
    export PATH="$state/emsdk/node/24.19.0_64bit/bin:$state/wabt-1.0.42/bin:$PATH"
    export HARNESS_BROWSER="$state/chrome-headless-shell-linux64/chrome-headless-shell"
    export HARNESS_JS="$root/.work/js"
    export npm_config_cache="$root/.work/npm-cache"
    export EM_CACHE="$state/emscripten-cache"
}
check() {
    platform
    verify "$state/emsdk/downloads/$sdk_build-wasm-binaries.tar.xz" "$sdk_digest"
    verify "$state/emsdk/downloads/node-v24.19.0-linux-x64.tar.xz" "$node_digest"
    verify "$state/emsdk/upstream/bin/clang-22" "$clang_digest"
    verify "$state/wabt.tar.gz" "$wabt_digest"
    verify "$state/chrome.zip" "$chrome_digest"
    [[ -x "$HARNESS_BROWSER" ]] || fail 'Browser extraction is not executable.'
    [[ $(stat -c %s "$HARNESS_BROWSER") == 197422408 ]] || fail 'Incomplete browser extraction.'
    verify "$HARNESS_BROWSER" "$chrome_member_digest"
    [[ $(command -v node) == "$state/emsdk/node/24.19.0_64bit/bin/node" ]] || fail 'SDK Node is not active.'
    [[ $(command -v npm) == "$state/emsdk/node/24.19.0_64bit/bin/npm" ]] || fail 'SDK npm is not active.'
    [[ $(node --version) == v24.19.0 ]] || fail 'Expected Node 24.19.0.'
    [[ $(npm --version) == 11.17.0 ]] || fail 'Expected npm 11.17.0.'
    emcc --version | head -n 1 | grep -F '4.0.23' >/dev/null || fail 'Expected Emscripten 4.0.23.'
    [[ $(wasm-strip --version) == 1.0.42 ]] || fail 'Expected WABT 1.0.42.'
    "$HARNESS_BROWSER" --version | grep -F '153.0.8010.12' >/dev/null || fail 'Expected Chrome 153.0.8010.12 (check system libraries).'
    echo 'Harness identities verified; product acceptance not evaluated.'
}
install() {
    platform
    for tool in git python3 curl tar xz unzip sha256sum make cc; do
        command -v "$tool" >/dev/null || fail "Missing system prerequisite: $tool"
    done
    if [[ -e "$state" ]]; then environment; check; return; fi
    mkdir -p "$root/.work" "$(dirname "$state")"
    staging=$(mktemp -d "$(dirname "$state")/harness-install.XXXXXX")
    trap 'rm -rf "$staging"' EXIT
    git init -q "$staging/emsdk"
    git -C "$staging/emsdk" fetch --depth 1 https://github.com/emscripten-core/emsdk.git "$sdk_commit"
    git -C "$staging/emsdk" checkout --detach FETCH_HEAD
    [[ $(git -C "$staging/emsdk" rev-parse HEAD) == "$sdk_commit" ]] || fail 'Installer identity mismatch.'
    mkdir -p "$staging/emsdk/downloads"
    # Seed the upstream installer with verified archives; KEEP_DOWNLOADS causes
    # it to use these files rather than obtain unverified replacements.
    fetch "https://storage.googleapis.com/webassembly/emscripten-releases-builds/linux/$sdk_build/wasm-binaries.tar.xz" \
        "$staging/emsdk/downloads/$sdk_build-wasm-binaries.tar.xz" "$sdk_digest"
    fetch 'https://storage.googleapis.com/webassembly/emscripten-releases-builds/deps/node-v24.19.0-linux-x64.tar.xz' \
        "$staging/emsdk/downloads/node-v24.19.0-linux-x64.tar.xz" "$node_digest"
    (cd "$staging/emsdk"; EMSDK_KEEP_DOWNLOADS=1 TAR_OPTIONS=--no-same-owner python3 emsdk.py install 4.0.23)
    fetch 'https://github.com/WebAssembly/wabt/releases/download/1.0.42/wabt-1.0.42-linux-x64.tar.gz' "$staging/wabt.tar.gz" "$wabt_digest"
    tar --no-same-owner -xzf "$staging/wabt.tar.gz" -C "$staging"
    fetch 'https://storage.googleapis.com/chrome-for-testing-public/153.0.8010.12/linux64/chrome-headless-shell-linux64.zip' "$staging/chrome.zip" "$chrome_digest"
    unzip -q "$staging/chrome.zip" -d "$staging"
    verify "$staging/chrome-headless-shell-linux64/chrome-headless-shell" "$chrome_member_digest"
    # Activation records absolute paths, so perform it at the final location.
    mv "$staging" "$state"
    trap - EXIT
    (cd "$state/emsdk"; python3 emsdk.py activate 4.0.23)
    environment
    check
}

case "${1:-}" in
    install) [[ $# == 1 ]] || fail 'install takes no arguments'; install ;;
    check) [[ $# == 1 ]] || fail 'check takes no arguments'; environment; check ;;
    deps)
        [[ $# == 1 ]] || fail 'deps takes no arguments'
        environment; check
        mkdir -p "$HARNESS_JS"
        cp "$root/tools/harness/package.json" "$root/tools/harness/package-lock.json" "$HARNESS_JS/"
        npm ci --prefix "$HARNESS_JS" --include=dev --ignore-scripts --no-audit --no-fund
        ;;
    smoke)
        [[ $# == 1 ]] || fail 'smoke takes no arguments'
        environment; check
        node --test "$root/tools/harness/smoke.test.mjs"
        ;;
    exec)
        shift
        [[ $# -gt 0 ]] || fail 'exec requires a command'
        # Verification diagnostics must not contaminate the command's stdout.
        environment; check >&2
        exec "$@"
        ;;
    *) fail 'Usage: bash tools/harness.sh {install|check|deps|smoke|exec COMMAND [ARG ...]}' ;;
esac
