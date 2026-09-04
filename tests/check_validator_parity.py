#!/usr/bin/env python3
from __future__ import annotations

import copy
import importlib.util
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("profile_tool", ROOT / "tools" / "profile.py")
profile_tool = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
sys.modules[SPEC.name] = profile_tool
SPEC.loader.exec_module(profile_tool)
NODE = ROOT / "tests" / "validate_profile.js"
BASE = json.loads((ROOT / "profiles" / "presets" / "general.json").read_text(encoding="utf-8"))
def js_findings(profile: dict) -> list[dict]:
    result = subprocess.run(
        ["node", str(NODE)],
        input=json.dumps(profile, ensure_ascii=False).encode("utf-8"),
        capture_output=True,
        check=True,
    )
    return json.loads(result.stdout.decode("utf-8"))


def python_findings(profile: dict) -> list:
    return profile_tool._validate_structure(profile)


def signature(items) -> list[tuple[str, str]]:
    return sorted((item.level, item.code) if hasattr(item, "level") else (item["level"], item["code"]) for item in items)


def mutated(mutator):
    profile = copy.deepcopy(BASE)
    mutator(profile)
    return profile
CASES = {
    "unknown top-level field": mutated(lambda p: p.__setitem__("unexpected", True)),
    "unknown nested field": mutated(lambda p: p["product"].__setitem__("unexpected", True)),
    "missing required field": mutated(lambda p: p["identity"].pop("experience")),
    "invalid enum": mutated(lambda p: p["product"].__setitem__("personality", "Supreme")),
    "wrong boolean type": mutated(lambda p: p["product"]["memory"].__setitem__("saved_memories", "yes")),
    "duplicate array item": mutated(lambda p: p["instructions"].__setitem__("tone", ["calm", "calm"])),
    "name too long": mutated(lambda p: p.__setitem__("name", "x" * 81)),
    "description too long": mutated(lambda p: p.__setitem__("description", "x" * 241)),
    "occupation too long": mutated(lambda p: p["identity"].__setitem__("occupation", "x" * 501)),
    "empty list item": mutated(lambda p: p["instructions"].__setitem__("tone", [""])),
}


def main() -> int:
    for name, profile in CASES.items():
        expected = signature(python_findings(profile))
        actual = signature(js_findings(profile))
        if actual != expected:
            print(f"Validator mismatch: {name}", file=sys.stderr)
            print("Python:", expected, file=sys.stderr)
            print("Browser:", actual, file=sys.stderr)
            return 1
    for directory in ("presets", "maintainers", "operational"):
        for path in sorted((ROOT / "profiles" / directory).glob("*.json")):
            profile = json.loads(path.read_text(encoding="utf-8"))
            expected = signature(python_findings(profile))
            actual = signature(js_findings(profile))
            if actual != expected:
                print(f"Validator mismatch: {path.relative_to(ROOT)}", file=sys.stderr)
                print("Python:", expected, file=sys.stderr)
                print("Browser:", actual, file=sys.stderr)
                return 1

    print(f"Validator parity verified for {len(CASES)} invalid fixtures and tracked profiles.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
