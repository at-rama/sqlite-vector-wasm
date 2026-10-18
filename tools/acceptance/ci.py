#!/usr/bin/env python3
"""Bounded CI composition selection and fail-closed required outcome."""
import json
import os

DEFAULT = "inputs/sources.lock.json"
VECTOR = "inputs/sqlite-vector.sources.lock.json"


def compositions(event, selected=DEFAULT):
    choices = {DEFAULT: "sqliteVec", VECTOR: "sqliteVector"}
    if selected not in choices:
        raise ValueError("Unsupported recorded acceptance lock")
    paths = [selected] if event == "workflow_dispatch" else list(choices)
    return {"include": [{"engine": choices[path], "lock": path} for path in paths]}


def complete(scope_result, required, composition_result):
    if scope_result != "success" or required not in ("true", "false"):
        raise ValueError("Acceptance scope unavailable")
    if required == "false":
        if composition_result != "skipped":
            raise ValueError("Unexpected site-only qualification outcome")
        return "Package acceptance not applicable: all changed paths are under site/. No package qualification was performed."
    if composition_result != "success":
        raise ValueError("A required composition or evidence upload did not succeed")
    return "Every selected composition completed production, browser acceptance and evidence upload."


if __name__ == "__main__":
    if os.environ.get("CI_ACTION") == "matrix":
        print("matrix=" + json.dumps(compositions(os.environ.get("EVENT_NAME"), os.environ.get("SOURCE_LOCK") or DEFAULT), separators=(",", ":")))
    elif os.environ.get("CI_ACTION") == "complete":
        print(complete(os.environ.get("SCOPE_RESULT"), os.environ.get("REQUIRED"), os.environ.get("COMPOSITION_RESULT")))
    else:
        raise ValueError("Unknown acceptance CI action")
