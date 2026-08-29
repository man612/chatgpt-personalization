import importlib.util
import json
import sys
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
MODULE_PATH = REPO_ROOT / "tools" / "profile.py"
SPEC = importlib.util.spec_from_file_location("profile_tool_operational", MODULE_PATH)
profile_tool = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
sys.modules[SPEC.name] = profile_tool
SPEC.loader.exec_module(profile_tool)


class OperationalProfileTests(unittest.TestCase):
    def setUp(self):
        self.operational_path = REPO_ROOT / "profiles" / "operational" / "yasman.json"
        self.reference_path = REPO_ROOT / "profiles" / "maintainers" / "yasman.json"
        self.operational = json.loads(self.operational_path.read_text(encoding="utf-8"))

    def test_operational_profile_is_valid_and_renderable(self):
        errors = [
            finding
            for finding in profile_tool.lint_profile(self.operational, long_field_limit=5000)
            if finding.level == "error"
        ]
        self.assertEqual(errors, [])
        rendered = profile_tool.render_profile(self.operational)
        self.assertEqual(rendered.occupation, self.operational["identity"]["occupation"])
        self.assertTrue(rendered.more_about_you)
        self.assertTrue(rendered.custom_instructions)

    def test_operational_profile_schema_reference_resolves(self):
        expected = (REPO_ROOT / "spec" / "profile.schema.json").resolve()
        resolved = (self.operational_path.parent / self.operational["$schema"]).resolve()
        self.assertEqual(resolved, expected)
        self.assertTrue(resolved.exists())

    def test_operational_profile_keeps_useful_headroom(self):
        rendered = profile_tool.render_profile(self.operational)
        self.assertLessEqual(len(rendered.custom_instructions), 4500)
        findings = profile_tool.lint_profile(self.operational, long_field_limit=5000)
        self.assertFalse(
            [item for item in findings if item.code in {"FIELD_LIMIT", "FIELD_NEAR_LIMIT"}]
        )

    def test_operational_profile_matches_account_target_contract(self):
        rendered = profile_tool.render_profile(self.operational)
        self.assertIn("Base personality: Default", rendered.settings)
        self.assertIn("Warm: slightly more", rendered.settings)
        self.assertIn("Headers & Lists: less", rendered.settings)
        self.assertIn("vibe coding", rendered.more_about_you)
        self.assertIn("only when directly relevant", rendered.more_about_you)
        self.assertIn("domain vocabulary is unknown until established", rendered.custom_instructions)
        self.assertIn("evidence gathering rather than a quick lookup", rendered.custom_instructions)
        self.assertIn("current, changing, unfamiliar, or high-stakes topics", rendered.custom_instructions)
        self.assertIn("Depth comes from evidence and cross-checking", rendered.custom_instructions)
        self.assertIn("generic AI-template visuals", rendered.custom_instructions)
        self.assertIn("Sepia-derived pass", rendered.custom_instructions)
        self.assertIn("verified user samples outrank generic", rendered.custom_instructions)
        self.assertIn("copy-ready", rendered.custom_instructions)

    def test_operational_writing_layer_has_docs_and_attribution(self):
        writing_layer = REPO_ROOT / "docs" / "writing" / "sepia-yasman.md"
        indonesian_layer = REPO_ROOT / "docs" / "writing" / "indonesian-ai-tells.md"
        notices = REPO_ROOT / "THIRD_PARTY_NOTICES.md"
        self.assertTrue(writing_layer.exists())
        self.assertTrue(indonesian_layer.exists())
        self.assertTrue(notices.exists())
        self.assertIn("Sepia", writing_layer.read_text(encoding="utf-8"))
        notice_text = notices.read_text(encoding="utf-8")
        self.assertIn("Nanako Tsai", notice_text)
        self.assertIn("MIT License", notice_text)

    def test_reference_and_operational_profiles_are_distinct_roles(self):
        reference = json.loads(self.reference_path.read_text(encoding="utf-8"))
        self.assertNotEqual(reference["name"], self.operational["name"])
        self.assertNotEqual(reference["description"], self.operational["description"])
        self.assertIn("Operational", self.operational["name"])


if __name__ == "__main__":
    unittest.main()
