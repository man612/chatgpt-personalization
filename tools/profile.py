#!/usr/bin/env python3
"""Render and lint ChatGPT personalization profiles without dependencies."""

from __future__ import annotations

import argparse
import glob
import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable

SCHEMA_VERSION = "1.0"
DEFAULT_LONG_FIELD_LIMIT = 1500

SECRET_PATTERNS = {
    "OpenAI-style API key": re.compile(r"\bsk-[A-Za-z0-9_-]{20,}\b"),
    "GitHub token": re.compile(r"\bgh[pousr]_[A-Za-z0-9]{20,}\b"),
    "private key": re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    "AWS access key": re.compile(r"\bAKIA[0-9A-Z]{16}\b"),
}

BLOAT_PATTERNS = {
    "inflated expertise claim": re.compile(
        r"\b(world[- ]class|best in the world|top 1%|genius|unmatched expert)\b",
        re.IGNORECASE,
    ),
    "unverifiable guarantee": re.compile(
        r"\b(100% accurate|guaranteed accuracy|perfect answer|never make mistakes)\b",
        re.IGNORECASE,
    ),
    "hidden-process demand": re.compile(
        r"\b(chain of thought|private reasoning|hidden rubric|secret score)\b",
        re.IGNORECASE,
    ),
}

REQUIRED_TOP_LEVEL = {"schema_version", "name", "occupation", "about", "response"}
REQUIRED_ABOUT = {"background", "experience", "recurring_uses", "stable_preferences"}
REQUIRED_RESPONSE = {"language", "tone", "audience", "structure", "technical", "research", "avoid"}
REQUIRED_STRUCTURE = {"long_answers", "body", "lists", "tables"}


@dataclass(frozen=True)
class RenderedProfile:
    occupation: str
    more_about_you: str
    response_preferences: str


@dataclass(frozen=True)
class Finding:
    level: str
    code: str
    message: str

    def __str__(self) -> str:
        return f"{self.level.upper():7} {self.code}: {self.message}"


def load_profile(path: Path) -> dict[str, Any]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise ValueError(f"file not found: {path}") from exc
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON in {path}: {exc}") from exc

    if not isinstance(data, dict):
        raise ValueError("profile root must be a JSON object")
    return data


def _nonempty(values: Iterable[str]) -> list[str]:
    return [value.strip() for value in values if isinstance(value, str) and value.strip()]


def _sentences(values: Iterable[str]) -> str:
    cleaned = []
    for value in _nonempty(values):
        cleaned.append(value if value.endswith((".", "!", "?")) else value + ".")
    return " ".join(cleaned)


def _serial_list(values: list[str]) -> str:
    values = _nonempty(values)
    if not values:
        return ""
    if len(values) == 1:
        return values[0]
    if len(values) == 2:
        return f"{values[0]} and {values[1]}"
    return ", ".join(values[:-1]) + f", and {values[-1]}"


def render_profile(profile: dict[str, Any]) -> RenderedProfile:
    about = profile.get("about", {})
    response = profile.get("response", {})
    structure = response.get("structure", {})

    about_paragraphs = []
    background = _sentences(about.get("background", []))
    if background:
        about_paragraphs.append(background)

    experience = str(about.get("experience", "")).strip()
    if experience:
        about_paragraphs.append(experience if experience.endswith((".", "!", "?")) else experience + ".")

    uses = _serial_list(about.get("recurring_uses", []))
    if uses:
        about_paragraphs.append(f"Recurring uses include {uses}.")

    preferences = _sentences(about.get("stable_preferences", []))
    if preferences:
        about_paragraphs.append(preferences)

    response_paragraphs = []
    language = str(response.get("language", "")).strip()
    tone = _serial_list(response.get("tone", []))
    audience = str(response.get("audience", "")).strip()

    opening_parts = []
    if language:
        opening_parts.append(language if language.endswith((".", "!", "?")) else language + ".")
    if tone:
        opening_parts.append(f"Use a {tone} tone.")
    if audience:
        opening_parts.append(f"Write for {audience}.")
    if opening_parts:
        response_paragraphs.append(" ".join(opening_parts))

    structure_text = _sentences(
        [
            structure.get("long_answers", ""),
            structure.get("body", ""),
            structure.get("lists", ""),
            structure.get("tables", ""),
        ]
    )
    if structure_text:
        response_paragraphs.append(structure_text)

    technical = _sentences(response.get("technical", []))
    if technical:
        response_paragraphs.append(technical)

    research = _sentences(response.get("research", []))
    if research:
        response_paragraphs.append(research)

    avoid = _serial_list(response.get("avoid", []))
    if avoid:
        response_paragraphs.append(f"Avoid {avoid}.")

    return RenderedProfile(
        occupation=str(profile.get("occupation", "")).strip(),
        more_about_you="\n\n".join(about_paragraphs),
        response_preferences="\n\n".join(response_paragraphs),
    )


def _check_required_object(
    value: Any,
    required: set[str],
    location: str,
    findings: list[Finding],
) -> None:
    if not isinstance(value, dict):
        findings.append(Finding("error", "TYPE", f"{location} must be an object"))
        return
    missing = sorted(required - set(value))
    if missing:
        findings.append(
            Finding("error", "MISSING_FIELD", f"{location} is missing: {', '.join(missing)}")
        )


def _iter_strings(value: Any, path: str = "$") -> Iterable[tuple[str, str]]:
    if isinstance(value, str):
        yield path, value
    elif isinstance(value, dict):
        for key, child in value.items():
            yield from _iter_strings(child, f"{path}.{key}")
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from _iter_strings(child, f"{path}[{index}]")


def lint_profile(
    profile: dict[str, Any],
    long_field_limit: int = DEFAULT_LONG_FIELD_LIMIT,
) -> list[Finding]:
    findings: list[Finding] = []

    missing = sorted(REQUIRED_TOP_LEVEL - set(profile))
    if missing:
        findings.append(
            Finding("error", "MISSING_FIELD", f"profile is missing: {', '.join(missing)}")
        )

    if profile.get("schema_version") != SCHEMA_VERSION:
        findings.append(
            Finding(
                "error",
                "SCHEMA_VERSION",
                f"schema_version must be {SCHEMA_VERSION!r}",
            )
        )

    _check_required_object(profile.get("about"), REQUIRED_ABOUT, "about", findings)
    _check_required_object(profile.get("response"), REQUIRED_RESPONSE, "response", findings)

    response = profile.get("response")
    if isinstance(response, dict):
        _check_required_object(
            response.get("structure"),
            REQUIRED_STRUCTURE,
            "response.structure",
            findings,
        )

    for path, text in _iter_strings(profile):
        for label, pattern in SECRET_PATTERNS.items():
            if pattern.search(text):
                findings.append(
                    Finding("error", "POSSIBLE_SECRET", f"{label} detected at {path}")
                )
        for label, pattern in BLOAT_PATTERNS.items():
            if pattern.search(text):
                findings.append(
                    Finding("warning", "PROMPT_BLOAT", f"{label} at {path}")
                )

    rendered = render_profile(profile)
    fields = {
        "occupation": rendered.occupation,
        "more-about-you": rendered.more_about_you,
        "response-preferences": rendered.response_preferences,
    }

    if not rendered.occupation:
        findings.append(Finding("warning", "EMPTY_FIELD", "occupation is empty"))

    for name in ("more-about-you", "response-preferences"):
        length = len(fields[name])
        if length > long_field_limit:
            findings.append(
                Finding(
                    "error",
                    "FIELD_LIMIT",
                    f"{name} is {length} characters; configured limit is {long_field_limit}",
                )
            )
        elif length > int(long_field_limit * 0.9):
            findings.append(
                Finding(
                    "warning",
                    "FIELD_NEAR_LIMIT",
                    f"{name} is {length} characters; configured limit is {long_field_limit}",
                )
            )

    normalized: dict[str, list[str]] = {}
    for path, text in _iter_strings(profile):
        if path == "$.$schema":
            continue
        key = re.sub(r"\s+", " ", text.strip().casefold())
        if len(key) >= 24:
            normalized.setdefault(key, []).append(path)

    for paths in normalized.values():
        if len(paths) > 1:
            findings.append(
                Finding(
                    "warning",
                    "DUPLICATE_TEXT",
                    f"same text appears at {', '.join(paths)}",
                )
            )

    absolute_count = sum(
        len(re.findall(r"\b(always|never|must)\b", text, flags=re.IGNORECASE))
        for _, text in _iter_strings(profile)
    )
    if absolute_count >= 8:
        findings.append(
            Finding(
                "warning",
                "OVERCONSTRAINED",
                f"profile uses {absolute_count} absolute terms such as always, never, or must",
            )
        )

    return findings


def write_rendered(rendered: RenderedProfile, out_dir: Path) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    mapping = {
        "occupation.txt": rendered.occupation,
        "more-about-you.txt": rendered.more_about_you,
        "response-preferences.txt": rendered.response_preferences,
    }
    for filename, content in mapping.items():
        (out_dir / filename).write_text(content.rstrip() + "\n", encoding="utf-8")


def resolve_paths(raw_paths: list[str]) -> list[Path]:
    resolved: list[Path] = []
    for raw in raw_paths:
        matches = [Path(item) for item in glob.glob(raw)]
        resolved.extend(matches or [Path(raw)])
    return resolved


def command_lint(args: argparse.Namespace) -> int:
    failed = False
    for path in resolve_paths(args.profiles):
        try:
            profile = load_profile(path)
            findings = lint_profile(profile, args.limit)
        except ValueError as exc:
            print(f"{path}: ERROR   LOAD: {exc}")
            failed = True
            continue

        print(f"{path}:")
        if not findings:
            print("  OK")
            continue

        for finding in findings:
            print(f"  {finding}")
            if finding.level == "error":
                failed = True
    return 1 if failed else 0


def command_render(args: argparse.Namespace) -> int:
    try:
        profile = load_profile(Path(args.profile))
    except ValueError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1

    findings = lint_profile(profile, args.limit)
    errors = [finding for finding in findings if finding.level == "error"]
    if errors and not args.force:
        for finding in findings:
            print(finding, file=sys.stderr)
        print("Rendering stopped because the profile has errors. Use --force to override.", file=sys.stderr)
        return 1

    rendered = render_profile(profile)
    write_rendered(rendered, Path(args.out))

    for finding in findings:
        print(finding, file=sys.stderr)
    print(f"Rendered profile to {args.out}")
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Render and lint structured ChatGPT personalization profiles."
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    lint_parser = subparsers.add_parser("lint", help="check one or more profile files")
    lint_parser.add_argument("profiles", nargs="+", help="profile paths or glob patterns")
    lint_parser.add_argument(
        "--limit",
        type=int,
        default=DEFAULT_LONG_FIELD_LIMIT,
        help="character limit for long-form fields",
    )
    lint_parser.set_defaults(func=command_lint)

    render_parser = subparsers.add_parser("render", help="render a profile to text files")
    render_parser.add_argument("profile", help="profile JSON file")
    render_parser.add_argument("--out", required=True, help="output directory")
    render_parser.add_argument(
        "--limit",
        type=int,
        default=DEFAULT_LONG_FIELD_LIMIT,
        help="character limit for long-form fields",
    )
    render_parser.add_argument(
        "--force",
        action="store_true",
        help="render even when lint errors are present",
    )
    render_parser.set_defaults(func=command_render)

    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
