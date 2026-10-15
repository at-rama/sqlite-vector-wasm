#!/usr/bin/env bash
set -euo pipefail

root=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)

# Internal transport and extraction operations called after Python validation.
case "${1:-}" in
    _fetch)
        [[ $# == 3 ]] || exit 2
        headers="$3.http-headers"
        authorization=()
        # Never send the Actions token to SQLite, release assets or lookalike hosts.
        case "$2" in
            https://api.github.com/*)
                if [[ -n "${GH_TOKEN:-}" ]]; then
                    authorization=(--header "Authorization: Bearer $GH_TOKEN")
                fi
                ;;
        esac
        # curl strips Authorization on cross-host redirects; do not use --location-trusted.
        if curl --fail-with-body --silent --show-error --location --proto '=https' \
            --proto-redir '=https' --connect-timeout 20 --max-time 180 \
            --retry 2 --retry-delay 1 --retry-max-time 400 \
            --header 'Accept: application/vnd.github+json' \
            "${authorization[@]}" --dump-header "$headers" --output "$3" "$2"; then
            rm -f -- "$headers"
        else
            status=$?
            printf 'Source fetch failed: %s (curl exit %s)\n' "$2" "$status" >&2
            if [[ -f "$headers" ]]; then
                awk 'tolower($0) ~ /^(http\/|x-ratelimit-|retry-after:|x-github-request-id:)/' "$headers" >&2
            fi
            printf 'HTTP evidence: %s and %s\n' "$3" "$headers" >&2
            exit "$status"
        fi
        exit 0
        ;;
    _extract)
        [[ $# == 4 ]] || exit 2
        case "$2" in
            zip) exec unzip -q "$3" -d "$4" ;;
            tar) exec tar --no-same-owner --no-same-permissions -xzf "$3" -C "$4" ;;
            *) exit 2 ;;
        esac
        ;;
esac

export PYTHONDONTWRITEBYTECODE=1
exec python3 "$root/tools/inputs.py" "$@"
