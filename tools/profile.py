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

TOP_LEVEL_FIELDS = {
    "$schema",
    "schema_version",
    "name",
    "description",
    "occupation",
    "about",
    "response",
}
REQUIRED_TOP_LEVEL = {"schema_version", "name", "occupation", "about", "response"}
ABOUT_FIELDS = {"background", "experience", "recurring_uses", "stable_preferences"}
RESPONSE_FIELDS = {"language", "tone", "audience", "structure", "technical", "research", "avoid"}
STRUCTURE_FIELDS = {"long_answers", "body", "lists", "tables"}


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


def _nonempty_strings(values: Iterable[Any]) -> list[str]:
    return [value.strip() for value in values if isinstance(value, str) and value.strip()]


def _sentence(value: str) -> str:
    value = value.strip()
    if not value:
        return ""
    return value if value.endswith((".", "!", "?")) else value + "."


def _sentences(values: Iterable[Any]) -> str:
    return " ".join(_sentence(value) for value in _nonempty_strings(values))


def _serial_list(values: Iterable[Any]) -> str:
    cleaned = _nonempty_strings(values)
    if not cleaned:
        return ""
    if len(cleaned) == 1:
        return cleaned[0]
    if len(cleaned) == 2:
        return f"{cleaned[0]} and {cleaned[1]}"
    return ", ".join(cleaned[:-1]) + f", and {cleaned[-1]}"


def _tone_text(values: list[str]) -> str:
    simple: list[str] = []
    qualified: list[str] = []
    for value in _nonempty_strings(values):
        lowered = value.casefold()
        if len(value.split()) <= 2 and not any(word in lowered for word in (" without ", " when ", " but ")):
            simple.append(value)
        else:
            qualified.append(value)

    parts: list[str] = []
    if simple:
        parts.append(f"Use a {_serial_list(simple)} tone.")
    parts.extend(_sentence(item[0].upper() + item[1:]) for item in qualified)
    return " ".join(parts)


def _unknown_fields(value: dict[str, Any], allowed: set[str], location: str) -> list[Finding]:
    return [
        Finding("error", "UNKNOWN_FIELD", f"{location} contains unsupported field: {key}")
        for key in sorted(set(value) - allowed)
    ]


def _require_object(value: Any, location: str, findings: list[Finding]) -> dict[str, Any] | None:
    if not isinstance(value, dict):
        findings.append(Finding("error", "TYPE", f"{location} must be an object"))
        return None
    return value


def _require_string(
    value: Any,
    location: str,
    findings: list[Finding],
    *,
    minimum: int | None = None,
    maximum: int | None = None,
) -> str | None:
    if not isinstance(value, str):
        findings.append(Finding("error", "TYPE", f"{location} must be a string"))
        return None
    if minimum is not None and len(value) < minimum:
        findings.append(Finding("error", "MIN_LENGTH", f"{location} must contain at least {minimum} character(s)"))
    if maximum is not None and len(value) > maximum:
        findings.append(Finding("error", "MAX_LENGTH", f"{location} exceeds {maximum} characters"))
    return value


def _require_string_list(value: Any, location: str, findings: list[Finding]) -> list[str] | None:
    if not isinstance(value, list):
        findings.append(Finding("error", "TYPE", f"{location} must be an array of strings"))
        return None

    strings: list[str] = []
    seen: set[str] = set()
    for index, item in enumerate(value):
        item_location = f"{location}[{index}]"
        if not isinstance(item, str):
            findings.append(Finding("error", "TYPE", f"{item_location} must be a string"))
            continue
        if not item:
            findings.append(Finding("error", "MIN_LENGTH", f"{item_location} must not be empty"))
        if item in seen:
            findings.append(Finding("error", "DUPLICATE_ITEM", f"{location} contains duplicate value: {item!r}"))
        seen.add(item)
        strings.append(item)
    return strings


def _validate_structure(profile: dict[str, Any]) -> list[Finding]:
    findings: list[Finding] = []
    findings.extend(_unknown_fields(profile, TOP_LEVEL_FIELDS, "profile"))

    missing = sorted(REQUIRED_TOP_LEVEL - set(profile))
    if missing:
        findings.append(Finding("error", "MISSING_FIELD", f"profile is missing: {', '.join(missing)}"))

    if profile.get("schema_version") != SCHEMA_VERSION:
        findings.append(Finding("error", "SCHEMA_VERSION", f"schema_version must be {SCHEMA_VERSION!r}"))

    _require_string(profile.get("name"), "name", findings, minimum=1, maximum=80)
    if "description" in profile:
        _require_string(profile.get("description"), "description", findings, maximum=240)
    _require_string(profile.get("occupation"), "occupation", findings, maximum=500)

    about = _require_object(profile.get("about"), "about", findings)
    if about is not None:
        findings.extend(_unknown_fields(about, ABOUT_FIELDS, "about"))
        missing_about = sorted(ABOUT_FIELDS - set(about))
        if missing_about:
            findings.append(Finding("error", "MISSING_FIELD", f"about is missing: {', '.join(missing_about)}"))
        _require_string_list(about.get("background"), "about.background", findings)
        _require_string(about.get("experience"), "about.experience", findings)
        _require_string_list(about.get("recurring_uses"), "about.recurring_uses", findings)
        _require_string_list(about.get("stable_preferences"), "about.stable_preferences", findings)

    response = _require_object(profile.get("response"), "response", findings)
    if response is not None:
        findings.extend(_unknown_fields(response, RESPONSE_FIELDS, "response"))
        missing_response = sorted(RESPONSE_FIELDS - set(response))
        if missing_response:
            findings.append(Finding("error", "MISSING_FIELD", f"response is missing: {', '.join(missing_response)}"))
        _require_string(response.get("language"), "response.language", findings)
        _require_string_list(response.get("tone"), "response.tone", findings)
        _require_string(response.get("audience"), "response.audience", findings)
        _require_string_list(response.get("technical"), "response.technical", findings)
        _require_string_list(response.get("research"), "response.research", findings)
        _require_string_list(response.get("avoid"), "response.avoid", findings)

        structure = _require_object(response.get("structure"), "response.structure", findings)
        if structure is not None:
            findings.extend(_unknown_fields(structure, STRUCTURE_FIELDS, "response.structure"))
            missing_structure = sorted(STRUCTURE_FIELDS - set(structure))
            if missing_structure:
                findings.append(
                    Finding("error", "MISSING_FIELD", f"response.structure is missing: {', '.join(missing_structure)}")
                )
            for key in sorted(STRUCTURE_FIELDS):
                _require_string(structure.get(key), f"response.structure.{key}", findings)

    return findings


def _iter_strings(value: Any, path: str = "$") -> Iterable[tuple[str, str]]:
    if isinstance(value, str):
        yield path, value
    elif isinstance(value, dict):
        for key, child in value.items():
            yield from _iter_strings(child, f"{path}.{key}")
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from _iter_strings(child, f"{path}[{index}]")


def render_profile(profile: dict[str, Any]) -> RenderedProfile:
    structural_errors = [item for item in _validate_structure(profile) if item.level == "error"]
    if structural_errors:
        raise ValueError(structural_errors[0].message)

    about = profile["about"]
    response = profile["response"]
    structure = response["structure"]

    about_paragraphs: list[str] = []
    background = _sentences(about["background"])
    if background:
        about_paragraphs.append(background)

    experience = _sentence(about["experience"])
    if experience:
        about_paragraphs.append(experience)

    uses = _serial_list(about["recurring_uses"])
    if uses:
        about_paragraphs.append(f"Common uses include {uses}.")

    preferences = _sentences(about["stable_preferences"])
    if preferences:
        about_paragraphs.append(preferences)

    response_paragraphs: list[str] = []
    opening_parts: list[str] = []
    language = _sentence(response["language"])
    if language:
        opening_parts.append(language)
    tone = _tone_text(response["tone"])
    if tone:
        opening_parts.append(tone)
    audience = response["audience"].strip()
    if audience:
        opening_parts.append(f"Write for {audience}.")
    if opening_parts:
        response_paragraphs.append(" ".join(opening_parts))

    structure_text = _sentences(
        [
            structure["long_answers"],
            structure["body"],
            structure["lists"],
            structure["tables"],
        ]
    )
    if structure_text:
        response_paragraphs.append(structure_text)

    technical = _sentences(response["technical"])
    if technical:
        response_paragraphs.append(technical)

    research = _sentences(response["research"])
    if research:
        response_paragraphs.append(research)

    avoid = _serial_list(response["avoid"])
    if avoid:
        response_paragraphs.append(f"Avoid {avoid}.")

    return RenderedProfile(
        occupation=profile["occupation"].strip(),
        more_about_you="\n\n".join(about_paragraphs),
        response_preferences="\n\n".join(response_paragraphs),
    )


def lint_profile(profile: dict[str, Any], long_field_limit: int = DEFAULT_LONG_FIELD_LIMIT) -> list[Finding]:
    findings = _validate_structure(profile)

    for path, text in _iter_strings(profile):
        for label, pattern in SECRET_PATTERNS.items():
            if pattern.search(text):
                findings.append(Finding("error", "POSSIBLE_SECRET", f"{label} detected at {path}"))
        for label, pattern in BLOAT_PATTERNS.items():
            if pattern.search(text):
                findings.append(Finding("warning", "PROMPT_BLOAT", f"{label} at {path}"))

    normalized: dict[str, list[str]] = {}
    for path, text in _iter_strings(profile):
        if path == "$.$schema":
            continue
        key = re.sub(r"\s+", " ", text.strip().casefold())
        if len(key) >= 24:
            normalized.setdefault(key, []).append(path)
    for paths in normalized.values():
        if len(paths) > 1:
            findings.append(Finding("warning", "DUPLICATE_TEXT", f"same text appears at {', '.join(paths)}"))

    absolute_count = sum(
        len(re.findall(r"\b(always|never|must)\b", text, flags=re.IGNORECASE))
        for _, text in _iter_strings(profile)
    )
    if absolute_count >= 8:
        findings.append(
            Finding("warning", "OVERCONSTRAINED", f"profile uses {absolute_count} absolute terms such as always, never, or must")
        )

    structural_errors = [
        item for item in findings if item.level == "error" and item.code != "POSSIBLE_SECRET"
    ]
    if not structural_errors:
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
                    Finding("error", "FIELD_LIMIT", f"{name} is {length} characters; configured limit is {long_field_limit}")
                )
            elif length > int(long_field_limit * 0.9):
                findings.append(
                    Finding("warning", "FIELD_NEAR_LIMIT", f"{name} is {length} characters; configured limit is {long_field_limit}")
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

    try:
        rendered = render_profile(profile)
    except ValueError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1

    write_rendered(rendered, Path(args.out))
    for finding in findings:
        print(finding, file=sys.stderr)
    print(f"Rendered profile to {args.out}")
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Render and lint structured ChatGPT personalization profiles.")
    subparsers = parser.add_subparsers(dest="command", required=True)

    lint_parser = subparsers.add_parser("lint", help="check one or more profile files")
    lint_parser.add_argument("profiles", nargs="+", help="profile paths or glob patterns")
    lint_parser.add_argument("--limit", type=int, default=DEFAULT_LONG_FIELD_LIMIT, help="character limit for long-form fields")
    lint_parser.set_defaults(func=command_lint)

    render_parser = subparsers.add_parser("render", help="render a profile to text files")
    render_parser.add_argument("profile", help="profile JSON file")
    render_parser.add_argument("--out", required=True, help="output directory")
    render_parser.add_argument("--limit", type=int, default=DEFAULT_LONG_FIELD_LIMIT, help="character limit for long-form fields")
    render_parser.add_argument("--force", action="store_true", help="render even when non-structural lint errors are present")
    render_parser.set_defaults(func=command_render)
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
