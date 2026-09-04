#!/usr/bin/env python3
"""Keep GitHub Pages data snapshots aligned with canonical repository sources."""

from __future__ import annotations

import argparse
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE_PRESETS = ROOT / "profiles" / "presets"
DOCS_PRESETS = ROOT / "docs" / "profiles" / "presets"
SOURCE_SCHEMA = ROOT / "spec" / "profile.schema.json"
DOCS_SCHEMA = ROOT / "docs" / "schema" / "v2" / "profile.schema.json"


def expected_pairs() -> list[tuple[Path, Path]]:
    pairs = [(path, DOCS_PRESETS / path.name) for path in sorted(SOURCE_PRESETS.glob("*.json"))]
    pairs.append((SOURCE_SCHEMA, DOCS_SCHEMA))
    return pairs
def sync() -> None:
    DOCS_PRESETS.mkdir(parents=True, exist_ok=True)
    DOCS_SCHEMA.parent.mkdir(parents=True, exist_ok=True)
    expected_names = {source.name for source in SOURCE_PRESETS.glob("*.json")}
    for stale in DOCS_PRESETS.glob("*.json"):
        if stale.name not in expected_names:
            stale.unlink()
    for source, destination in expected_pairs():
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, destination)


def check() -> int:
    failures: list[str] = []
    for source, destination in expected_pairs():
        if not destination.exists():
            failures.append(f"missing snapshot: {destination.relative_to(ROOT)}")
        elif source.read_bytes() != destination.read_bytes():
            failures.append(f"stale snapshot: {destination.relative_to(ROOT)}")
    expected_names = {source.name for source in SOURCE_PRESETS.glob("*.json")}
    if DOCS_PRESETS.exists():
        for extra in sorted(DOCS_PRESETS.glob("*.json")):
            if extra.name not in expected_names:
                failures.append(f"unexpected snapshot: {extra.relative_to(ROOT)}")
    for failure in failures:
        print(f"ERROR: {failure}")
    return 1 if failures else 0
def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="fail if committed Pages snapshots are stale")
    args = parser.parse_args()
    if args.check:
        return check()
    sync()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
