import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class DocsSnapshotTests(unittest.TestCase):
    def test_public_preset_snapshots_match_canonical_profiles(self):
        source = ROOT / "profiles" / "presets"
        deployed = ROOT / "docs" / "profiles" / "presets"
        self.assertEqual(
            sorted(path.name for path in source.glob("*.json")),
            sorted(path.name for path in deployed.glob("*.json")),
        )
        for path in source.glob("*.json"):
            with self.subTest(path=path.name):
                self.assertEqual(path.read_bytes(), (deployed / path.name).read_bytes())
    def test_deployed_schema_matches_canonical_schema(self):
        source = ROOT / "spec" / "profile.schema.json"
        deployed = ROOT / "docs" / "schema" / "v2" / "profile.schema.json"
        self.assertEqual(source.read_bytes(), deployed.read_bytes())
        schema = json.loads(source.read_text(encoding="utf-8-sig"))
        self.assertEqual(
            schema["$id"],
            "https://man612.github.io/chatgpt-personalization/schema/v2/profile.schema.json",
        )

    def test_builder_loads_same_deployment_preset_snapshot(self):
        app = (ROOT / "docs" / "app.js").read_text(encoding="utf-8-sig")
        self.assertIn('fetch(`profiles/${filename}`', app)
        self.assertNotIn("raw.githubusercontent.com", app)


if __name__ == "__main__":
    unittest.main()
