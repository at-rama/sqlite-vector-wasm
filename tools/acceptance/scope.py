#!/usr/bin/env python3
"""Select complete package acceptance unless the entire automatic diff is site-only."""
import json
from pathlib import Path
import os
import re
import subprocess
import sys


def required():
    if os.environ.get("EVENT_NAME") not in ("pull_request", "push"):
        return True, "manual or unknown event"
    base = os.environ.get("BASE_SHA", "")
    head = os.environ.get("HEAD_SHA", "")
    if any(not re.fullmatch(r"[0-9a-f]{40}", ref) or ref == "0" * 40 for ref in (base, head)):
        return True, "missing or invalid comparison revision"
    try:
        for ref in (base, head):
            subprocess.run(
                ["git", "cat-file", "-e", ref + "^{commit}"],
                check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
            )
        # Include both endpoints of moves, even when Git would detect a rename.
        diff = subprocess.run(
            ["git", "diff", "--no-ext-diff", "--no-textconv", "--ignore-submodules=none",
             "--no-renames", "--name-only", "-z", base, head, "--"],
            check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
        ).stdout
    except (OSError, subprocess.CalledProcessError):
        return True, "comparison unavailable"
    paths = diff.split(b"\0")
    if paths[-1] != b"":
        return True, "invalid diff output"
    paths.pop()
    if not paths or any(not path.startswith(b"site/") for path in paths):
        return True, "empty diff or changes outside site/"
    profile = Path("tools/site/docs-example.json")
    if profile.exists():
        try:
            if json.loads(profile.read_text())["mode"] == "candidate":
                return True, "site checks require the exact unpublished candidate archive"
        except (OSError, ValueError, KeyError):
            return True, "documentation selection unavailable"
    return False, "site-only changes"


if __name__ == "__main__":
    value, reason = required()
    print("required=" + str(value).lower())
    print("Acceptance scope: " + reason, file=sys.stderr)
