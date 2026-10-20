#!/usr/bin/env python3
"""Bounded CI composition selection and fail-closed required outcome."""
import json
import os

DEFAULT = "inputs/sqlite-vector.sources.lock.json"
VECTOR = "inputs/sqlite-vector.sources.lock.json"



def complete(scope_result, required, composition_result):
    if scope_result != "success" or required not in ("true", "false"):
        raise ValueError("Acceptance scope unavailable")
    if required == "false":
        if composition_result != "skipped":
            raise ValueError("Unexpected site-only qualification outcome")
        return "Package acceptance not applicable: all changed paths are under site/. No package qualification was performed."
    if composition_result != "success":
        raise ValueError("The required Vector qualification or evidence upload did not succeed")
    return "The Vector composition completed production, browser acceptance and evidence upload."


if __name__ == "__main__":
    if os.environ.get("CI_ACTION") == "complete":
        print(complete(os.environ.get("SCOPE_RESULT"), os.environ.get("REQUIRED"), os.environ.get("COMPOSITION_RESULT")))
    else:
        raise ValueError("Unknown acceptance CI action")
