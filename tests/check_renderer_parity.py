#!/usr/bin/env python3
"""Verify that the browser renderer matches the Python renderer exactly."""

from __future__ import annotations

import importlib.util
import json
import subprocess
import sys
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[1]
MODULE_PATH = REPO_ROOT / "tools" / "profile.py"
NODE_HELPER = REPO_ROOT / "tests" / "render_profile.js"

SPEC = importlib.util.spec_from_file_location("profile_tool", MODULE_PATH)
profile_tool = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
sys.modules[SPEC.name] = profile_tool
SPEC.loader.exec_module(profile_tool)


def render_with_node(profile: dict[str, Any]) -> dict[str, str]:
    result = subprocess.run(
        ["node", str(NODE_HELPER)],
        input=json.dumps(profile),
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or "Node renderer failed")
    return json.loads(result.stdout)


def render_with_python(profile: dict[str, Any]) -> dict[str, str]:
    rendered = profile_tool.render_profile(profile)
    return {
        "occupation": rendered.occupation,
        "more_about_you": rendered.more_about_you,
        "response_preferences": rendered.response_preferences,
    }


def fixtures() -> list[dict[str, Any]]:
    return [
        {
            "schema_version": "1.0",
            "name": "Parity fixture",
            "description": "Exercises every renderer section.",
            "occupation": "  Analyst and product generalist  ",
            "about": {
                "background": ["Works with reports", "Builds internal tools."],
                "experience": "Knows the basics",
                "recurring_uses": ["Research", "Writing", "Troubleshooting"],
                "stable_preferences": ["Values clarity", "Prefers practical examples."],
            },
            "response": {
                "language": "Use English",
                "tone": ["plainspoken", "direct", "patient without being patronizing"],
                "audience": "an intelligent beginner",
                "structure": {
                    "long_answers": "Use descriptive sections",
                    "body": "Use connected paragraphs.",
                    "lists": "Use lists when useful",
                    "tables": "Use tables for direct comparison",
                },
                "technical": ["Explain likely causes", "Show how to test the fix."],
                "research": ["Verify current claims", "Separate facts from assumptions."],
                "avoid": ["generic openings", "unrelated rewrites", "decorative complexity"],
            },
        },
        {
            "schema_version": "1.0",
            "name": "Sparse fixture",
            "occupation": "",
            "about": {
                "background": [],
                "experience": "",
                "recurring_uses": [],
                "stable_preferences": [],
            },
            "response": {
                "language": "",
                "tone": [],
                "audience": "",
                "structure": {
                    "long_answers": "",
                    "body": "",
                    "lists": "",
                    "tables": "",
                },
                "technical": [],
                "research": [],
                "avoid": [],
            },
        },
    ]


def main() -> int:
    profiles = fixtures()
    profiles_dir = REPO_ROOT / "profiles"
    if profiles_dir.exists():
        for path in sorted(profiles_dir.glob("*.json")):
            profiles.append(json.loads(path.read_text(encoding="utf-8")))

    for index, profile in enumerate(profiles, start=1):
        expected = render_with_python(profile)
        actual = render_with_node(profile)
        if actual != expected:
            print(f"Renderer mismatch in fixture or profile {index}", file=sys.stderr)
            print("Python:", json.dumps(expected, indent=2), file=sys.stderr)
            print("Browser:", json.dumps(actual, indent=2), file=sys.stderr)
            return 1
    print(f"Renderer parity verified for {len(profiles)} profiles and fixtures.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
