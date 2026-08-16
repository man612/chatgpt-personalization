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
    result = subprocess.run(["node", str(NODE_HELPER)], input=json.dumps(profile), capture_output=True, text=True, check=False)
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or "Node renderer failed")
    return json.loads(result.stdout)


def render_with_python(profile: dict[str, Any]) -> dict[str, str]:
    rendered = profile_tool.render_profile(profile)
    return {
        "settings": rendered.settings,
        "occupation": rendered.occupation,
        "more_about_you": rendered.more_about_you,
        "custom_instructions": rendered.custom_instructions,
    }


def fixture() -> dict[str, Any]:
    return {
        "schema_version": "2.0",
        "name": "Parity fixture",
        "product": {
            "personality": "Default",
            "characteristics": {"warm": "slightly_more", "enthusiastic": "less", "headers_and_lists": "less", "emojis": "less"},
            "memory": {"saved_memories": True, "reference_chat_history": True},
        },
        "identity": {
            "occupation": " Analyst and product generalist ",
            "background": ["Works with reports", "Builds internal tools."],
            "experience": "Knows the basics",
            "recurring_uses": ["Research", "Writing", "Troubleshooting"],
            "stable_preferences": ["Values clarity", "Prefers practical examples."],
        },
        "instructions": {
            "language": "Use English",
            "tone": ["plainspoken", "direct", "patient"],
            "audience": "an intelligent beginner",
            "explanation": {
                "principle": "Prioritize understanding before terminology",
                "sequence": ["explain the concept", "show why it matters", "introduce the term"],
                "terminology": "Define unfamiliar terms",
                "depth": "Keep important reasoning",
            },
            "structure": {
                "default": "Use connected paragraphs",
                "headings": "Use headings for genuine topic changes",
                "lists": "Use lists when scanning helps",
                "tables": "Use tables for direct comparisons",
            },
            "technical": ["Explain likely causes", "Show how to test the fix."],
            "research": ["Verify current claims", "Separate facts from assumptions."],
            "ui_ux": ["Explain user impact"],
            "writing": ["Preserve voice"],
            "avoid": ["generic openings", "decorative complexity"],
        },
    }


def main() -> int:
    profiles = [fixture()]
    for path in sorted((REPO_ROOT / "profiles").glob("*.json")):
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
