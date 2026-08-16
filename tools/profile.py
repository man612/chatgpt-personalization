#!/usr/bin/env python3
"""Render and lint ChatGPT personalization profiles without third-party dependencies."""

from __future__ import annotations

import argparse
import glob
import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable

SCHEMA_VERSION = "2.0"
DEFAULT_LONG_FIELD_LIMIT = 5000
RELATIVE_PREFERENCES = {"less", "slightly_less", "neutral", "slightly_more", "more"}
PERSONALITIES = {"Default", "Professional", "Friendly", "Candid", "Quirky", "Efficient", "Cynical"}

SECRET_PATTERNS = {
    "OpenAI-style API key": re.compile(r"\bsk-[A-Za-z0-9_-]{20,}\b"),
    "GitHub token": re.compile(r"\bgh[pousr]_[A-Za-z0-9]{20,}\b"),
    "private key": re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    "AWS access key": re.compile(r"\bAKIA[0-9A-Z]{16}\b"),
}

BLOAT_PATTERNS = {
    "inflated expertise claim": re.compile(r"\b(world[- ]class|best in the world|top 1%|genius|unmatched expert)\b", re.I),
    "unverifiable guarantee": re.compile(r"\b(100% accurate|guaranteed accuracy|perfect answer|never make mistakes)\b", re.I),
    "hidden-process demand": re.compile(r"\b(chain of thought|private reasoning|hidden rubric|secret score)\b", re.I),
}

TOP_LEVEL_FIELDS = {"$schema", "schema_version", "name", "description", "product", "identity", "instructions"}
REQUIRED_TOP_LEVEL = {"schema_version", "name", "product", "identity", "instructions"}
PRODUCT_FIELDS = {"personality", "characteristics", "memory"}
CHARACTERISTIC_FIELDS = {"warm", "enthusiastic", "headers_and_lists", "emojis"}
MEMORY_FIELDS = {"saved_memories", "reference_chat_history"}
IDENTITY_FIELDS = {"occupation", "background", "experience", "recurring_uses", "stable_preferences"}
INSTRUCTION_FIELDS = {"language", "tone", "audience", "explanation", "structure", "technical", "research", "ui_ux", "writing", "avoid"}
EXPLANATION_FIELDS = {"principle", "sequence", "terminology", "depth"}
STRUCTURE_FIELDS = {"default", "headings", "lists", "tables"}


@dataclass(frozen=True)
class RenderedProfile:
    settings: str
    occupation: str
    more_about_you: str
    custom_instructions: str


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
    cleaned = _nonempty_strings(values)
    if not cleaned:
        return ""
    return f"Use a {_serial_list(cleaned)} tone."


def _display_relative(value: str) -> str:
    return value.replace("_", " ")


def _on_off(value: bool) -> str:
    return "on" if value else "off"


def _unknown_fields(value: dict[str, Any], allowed: set[str], location: str) -> list[Finding]:
    return [Finding("error", "UNKNOWN_FIELD", f"{location} contains unsupported field: {key}") for key in sorted(set(value) - allowed)]


def _require_object(value: Any, location: str, findings: list[Finding]) -> dict[str, Any] | None:
    if not isinstance(value, dict):
        findings.append(Finding("error", "TYPE", f"{location} must be an object"))
        return None
    return value


def _require_string(value: Any, location: str, findings: list[Finding], *, minimum: int | None = None, maximum: int | None = None) -> str | None:
    if not isinstance(value, str):
        findings.append(Finding("error", "TYPE", f"{location} must be a string"))
        return None
    if minimum is not None and len(value) < minimum:
        findings.append(Finding("error", "MIN_LENGTH", f"{location} must contain at least {minimum} character(s)"))
    if maximum is not None and len(value) > maximum:
        findings.append(Finding("error", "MAX_LENGTH", f"{location} exceeds {maximum} characters"))
    return value


def _require_bool(value: Any, location: str, findings: list[Finding]) -> bool | None:
    if not isinstance(value, bool):
        findings.append(Finding("error", "TYPE", f"{location} must be a boolean"))
        return None
    return value


def _require_enum(value: Any, allowed: set[str], location: str, findings: list[Finding]) -> str | None:
    text = _require_string(value, location, findings)
    if text is not None and text not in allowed:
        findings.append(Finding("error", "ENUM", f"{location} must be one of: {', '.join(sorted(allowed))}"))
    return text


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

    version = profile.get("schema_version")
    if version != SCHEMA_VERSION:
        if version == "1.0":
            findings.append(Finding("error", "SCHEMA_VERSION", "schema_version 1.0 is no longer supported; migrate the profile using docs/migration-v2.md"))
        else:
            findings.append(Finding("error", "SCHEMA_VERSION", f"schema_version must be {SCHEMA_VERSION!r}"))

    _require_string(profile.get("name"), "name", findings, minimum=1, maximum=80)
    if "description" in profile:
        _require_string(profile.get("description"), "description", findings, maximum=240)

    product = _require_object(profile.get("product"), "product", findings)
    if product is not None:
        findings.extend(_unknown_fields(product, PRODUCT_FIELDS, "product"))
        missing_product = sorted(PRODUCT_FIELDS - set(product))
        if missing_product:
            findings.append(Finding("error", "MISSING_FIELD", f"product is missing: {', '.join(missing_product)}"))
        _require_enum(product.get("personality"), PERSONALITIES, "product.personality", findings)

        characteristics = _require_object(product.get("characteristics"), "product.characteristics", findings)
        if characteristics is not None:
            findings.extend(_unknown_fields(characteristics, CHARACTERISTIC_FIELDS, "product.characteristics"))
            missing_characteristics = sorted(CHARACTERISTIC_FIELDS - set(characteristics))
            if missing_characteristics:
                findings.append(Finding("error", "MISSING_FIELD", f"product.characteristics is missing: {', '.join(missing_characteristics)}"))
            for key in sorted(CHARACTERISTIC_FIELDS):
                _require_enum(characteristics.get(key), RELATIVE_PREFERENCES, f"product.characteristics.{key}", findings)

        memory = _require_object(product.get("memory"), "product.memory", findings)
        if memory is not None:
            findings.extend(_unknown_fields(memory, MEMORY_FIELDS, "product.memory"))
            missing_memory = sorted(MEMORY_FIELDS - set(memory))
            if missing_memory:
                findings.append(Finding("error", "MISSING_FIELD", f"product.memory is missing: {', '.join(missing_memory)}"))
            for key in sorted(MEMORY_FIELDS):
                _require_bool(memory.get(key), f"product.memory.{key}", findings)

    identity = _require_object(profile.get("identity"), "identity", findings)
    if identity is not None:
        findings.extend(_unknown_fields(identity, IDENTITY_FIELDS, "identity"))
        missing_identity = sorted(IDENTITY_FIELDS - set(identity))
        if missing_identity:
            findings.append(Finding("error", "MISSING_FIELD", f"identity is missing: {', '.join(missing_identity)}"))
        _require_string(identity.get("occupation"), "identity.occupation", findings, maximum=500)
        _require_string_list(identity.get("background"), "identity.background", findings)
        _require_string(identity.get("experience"), "identity.experience", findings)
        _require_string_list(identity.get("recurring_uses"), "identity.recurring_uses", findings)
        _require_string_list(identity.get("stable_preferences"), "identity.stable_preferences", findings)

    instructions = _require_object(profile.get("instructions"), "instructions", findings)
    if instructions is not None:
        findings.extend(_unknown_fields(instructions, INSTRUCTION_FIELDS, "instructions"))
        missing_instructions = sorted(INSTRUCTION_FIELDS - set(instructions))
        if missing_instructions:
            findings.append(Finding("error", "MISSING_FIELD", f"instructions is missing: {', '.join(missing_instructions)}"))
        _require_string(instructions.get("language"), "instructions.language", findings)
        _require_string_list(instructions.get("tone"), "instructions.tone", findings)
        _require_string(instructions.get("audience"), "instructions.audience", findings)
        for key in ("technical", "research", "ui_ux", "writing", "avoid"):
            _require_string_list(instructions.get(key), f"instructions.{key}", findings)

        explanation = _require_object(instructions.get("explanation"), "instructions.explanation", findings)
        if explanation is not None:
            findings.extend(_unknown_fields(explanation, EXPLANATION_FIELDS, "instructions.explanation"))
            missing_explanation = sorted(EXPLANATION_FIELDS - set(explanation))
            if missing_explanation:
                findings.append(Finding("error", "MISSING_FIELD", f"instructions.explanation is missing: {', '.join(missing_explanation)}"))
            _require_string(explanation.get("principle"), "instructions.explanation.principle", findings)
            _require_string_list(explanation.get("sequence"), "instructions.explanation.sequence", findings)
            _require_string(explanation.get("terminology"), "instructions.explanation.terminology", findings)
            _require_string(explanation.get("depth"), "instructions.explanation.depth", findings)

        structure = _require_object(instructions.get("structure"), "instructions.structure", findings)
        if structure is not None:
            findings.extend(_unknown_fields(structure, STRUCTURE_FIELDS, "instructions.structure"))
            missing_structure = sorted(STRUCTURE_FIELDS - set(structure))
            if missing_structure:
                findings.append(Finding("error", "MISSING_FIELD", f"instructions.structure is missing: {', '.join(missing_structure)}"))
            for key in sorted(STRUCTURE_FIELDS):
                _require_string(structure.get(key), f"instructions.structure.{key}", findings)

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

    product = profile["product"]
    characteristics = product["characteristics"]
    memory = product["memory"]
    settings_lines = [
        f"Base personality: {product['personality']}",
        "Characteristics:",
        f"- Warm: {_display_relative(characteristics['warm'])}",
        f"- Enthusiastic: {_display_relative(characteristics['enthusiastic'])}",
        f"- Headers & Lists: {_display_relative(characteristics['headers_and_lists'])}",
        f"- Emojis: {_display_relative(characteristics['emojis'])}",
        "Memory:",
        f"- Saved memories: {_on_off(memory['saved_memories'])}",
        f"- Reference chat history: {_on_off(memory['reference_chat_history'])}",
    ]

    identity = profile["identity"]
    about_paragraphs: list[str] = []
    background = _sentences(identity["background"])
    if background:
        about_paragraphs.append(background)
    experience = _sentence(identity["experience"])
    if experience:
        about_paragraphs.append(experience)
    uses = _serial_list(identity["recurring_uses"])
    if uses:
        about_paragraphs.append(f"Common uses include {uses}.")
    preferences = _sentences(identity["stable_preferences"])
    if preferences:
        about_paragraphs.append(preferences)

    instructions = profile["instructions"]
    explanation = instructions["explanation"]
    structure = instructions["structure"]
    instruction_paragraphs: list[str] = []

    opening: list[str] = []
    if instructions["language"].strip():
        opening.append(_sentence(instructions["language"]))
    tone = _tone_text(instructions["tone"])
    if tone:
        opening.append(tone)
    if instructions["audience"].strip():
        opening.append(_sentence(f"Write for {instructions['audience']}"))
    if opening:
        instruction_paragraphs.append(" ".join(opening))

    explanation_parts = [_sentence(explanation["principle"])] if explanation["principle"].strip() else []
    sequence = _serial_list(explanation["sequence"])
    if sequence:
        explanation_parts.append(_sentence(f"For unfamiliar topics, follow this order when useful: {sequence}"))
    if explanation["terminology"].strip():
        explanation_parts.append(_sentence(explanation["terminology"]))
    if explanation["depth"].strip():
        explanation_parts.append(_sentence(explanation["depth"]))
    if explanation_parts:
        instruction_paragraphs.append(" ".join(explanation_parts))

    structure_text = _sentences([structure["default"], structure["headings"], structure["lists"], structure["tables"]])
    if structure_text:
        instruction_paragraphs.append(structure_text)

    for key in ("technical", "research", "ui_ux", "writing"):
        text = _sentences(instructions[key])
        if text:
            instruction_paragraphs.append(text)

    avoid = _serial_list(instructions["avoid"])
    if avoid:
        instruction_paragraphs.append(_sentence(f"Avoid {avoid}"))

    return RenderedProfile(
        settings="\n".join(settings_lines),
        occupation=identity["occupation"].strip(),
        more_about_you="\n\n".join(about_paragraphs),
        custom_instructions="\n\n".join(instruction_paragraphs),
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

    absolute_count = sum(len(re.findall(r"\b(always|never|must)\b", text, flags=re.I)) for _, text in _iter_strings(profile))
    if absolute_count >= 8:
        findings.append(Finding("warning", "OVERCONSTRAINED", f"profile uses {absolute_count} absolute terms such as always, never, or must"))

    positive_outline = re.compile(r"\b(always|prefer|use|create|format|organize)\b.{0,40}\bnumbered (?:sections?|headings?)\b", re.I)
    for path, text in _iter_strings(profile):
        for sentence_text in re.split(r"(?<=[.!?])\s+", text):
            lowered = sentence_text.casefold()
            negated = any(phrase in lowered for phrase in ("do not", "don't", "avoid", "without", "not use", "not create"))
            if not negated and positive_outline.search(sentence_text):
                findings.append(Finding("warning", "OUTLINE_BIAS", f"formatting rule at {path} may force outline-style answers"))
                break

    structural_errors = [item for item in findings if item.level == "error" and item.code != "POSSIBLE_SECRET"]
    if not structural_errors:
        rendered = render_profile(profile)
        fields = {
            "more-about-you": rendered.more_about_you,
            "custom-instructions": rendered.custom_instructions,
        }
        identity = profile["identity"]
        has_identity_context = bool(_nonempty_strings(identity["background"]) or identity["experience"].strip() or _nonempty_strings(identity["recurring_uses"]) or _nonempty_strings(identity["stable_preferences"]))
        if not rendered.occupation and has_identity_context:
            findings.append(Finding("warning", "EMPTY_FIELD", "occupation is empty while other identity context is present"))
        for name, content in fields.items():
            length = len(content)
            if length > long_field_limit:
                findings.append(Finding("error", "FIELD_LIMIT", f"{name} is {length} characters; configured limit is {long_field_limit}"))
            elif length > int(long_field_limit * 0.9):
                findings.append(Finding("warning", "FIELD_NEAR_LIMIT", f"{name} is {length} characters; configured limit is {long_field_limit}"))

    return findings


def write_rendered(rendered: RenderedProfile, out_dir: Path) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    mapping = {
        "settings.md": rendered.settings,
        "occupation.txt": rendered.occupation,
        "more-about-you.txt": rendered.more_about_you,
        "custom-instructions.txt": rendered.custom_instructions,
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
    lint_parser.add_argument("--limit", type=int, default=DEFAULT_LONG_FIELD_LIMIT, help="character limit for rendered long-form fields")
    lint_parser.set_defaults(func=command_lint)

    render_parser = subparsers.add_parser("render", help="render a profile to product settings and copy-ready text files")
    render_parser.add_argument("profile", help="profile JSON file")
    render_parser.add_argument("--out", required=True, help="output directory")
    render_parser.add_argument("--limit", type=int, default=DEFAULT_LONG_FIELD_LIMIT, help="character limit for rendered long-form fields")
    render_parser.add_argument("--force", action="store_true", help="render even when lint errors are present")
    render_parser.set_defaults(func=command_render)
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
