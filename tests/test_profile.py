import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

MODULE_PATH = Path(__file__).resolve().parents[1] / "tools" / "profile.py"
SPEC = importlib.util.spec_from_file_location("profile_tool", MODULE_PATH)
profile_tool = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
sys.modules[SPEC.name] = profile_tool
SPEC.loader.exec_module(profile_tool)


class ProfileToolTests(unittest.TestCase):
    def setUp(self):
        self.profile = {
            "schema_version": "2.0",
            "name": "Test",
            "product": {
                "personality": "Default",
                "characteristics": {"warm": "slightly_more", "enthusiastic": "less", "headers_and_lists": "less", "emojis": "less"},
                "memory": {"saved_memories": True, "reference_chat_history": True},
            },
            "identity": {
                "occupation": "Analyst.",
                "background": ["Works with reports"],
                "experience": "Knows the basics",
                "recurring_uses": ["Research", "Writing"],
                "stable_preferences": ["Values clarity"],
            },
            "instructions": {
                "language": "Use English.",
                "tone": ["plainspoken", "direct", "patient"],
                "audience": "an intelligent beginner",
                "explanation": {
                    "principle": "Prioritize understanding before terminology",
                    "sequence": ["explain the concept", "explain the problem", "introduce the technical term"],
                    "terminology": "Define unfamiliar terms",
                    "depth": "Keep important reasoning",
                },
                "structure": {
                    "default": "Use connected paragraphs",
                    "headings": "Use headings for genuine topic changes",
                    "lists": "Use lists when useful",
                    "tables": "Use tables for comparison",
                },
                "technical": ["Explain causes"],
                "research": ["Verify current claims"],
                "ui_ux": ["Explain user impact"],
                "writing": ["Preserve voice"],
                "avoid": ["generic openings"],
            },
        }

    def test_render_contains_all_layers(self):
        rendered = profile_tool.render_profile(self.profile)
        self.assertIn("Base personality: Default", rendered.settings)
        self.assertIn("Headers & Lists: less", rendered.settings)
        self.assertEqual(rendered.occupation, "Analyst.")
        self.assertIn("Works with reports.", rendered.more_about_you)
        self.assertIn("Prioritize understanding before terminology.", rendered.custom_instructions)
        self.assertIn("For unfamiliar topics, follow this order when useful", rendered.custom_instructions)

    def test_valid_profile_has_no_errors(self):
        findings = profile_tool.lint_profile(self.profile)
        self.assertFalse([item for item in findings if item.level == "error"])

    def test_v1_profile_has_migration_error(self):
        old = {"schema_version": "1.0", "name": "Old"}
        findings = profile_tool.lint_profile(old)
        self.assertTrue(any(item.code == "SCHEMA_VERSION" and "migration" in item.message for item in findings))

    def test_invalid_characteristic_is_rejected(self):
        self.profile["product"]["characteristics"]["warm"] = "maximum"
        findings = profile_tool.lint_profile(self.profile)
        self.assertTrue(any(item.code == "ENUM" and "warm" in item.message for item in findings))

    def test_field_limit_is_enforced(self):
        self.profile["instructions"]["research"] = ["x" * 500]
        findings = profile_tool.lint_profile(self.profile, long_field_limit=300)
        self.assertTrue(any(item.code == "FIELD_LIMIT" for item in findings))

    def test_secret_detection(self):
        self.profile["identity"]["experience"] = "Token: sk-" + "A" * 24
        findings = profile_tool.lint_profile(self.profile)
        self.assertTrue(any(item.code == "POSSIBLE_SECRET" for item in findings))

    def test_prompt_bloat_warning(self):
        self.profile["instructions"]["technical"] = ["Act as a world-class genius"]
        findings = profile_tool.lint_profile(self.profile)
        self.assertTrue(any(item.code == "PROMPT_BLOAT" for item in findings))

    def test_outline_bias_warning(self):
        self.profile["instructions"]["structure"]["headings"] = "Always use numbered sections"
        findings = profile_tool.lint_profile(self.profile)
        self.assertTrue(any(item.code == "OUTLINE_BIAS" for item in findings))

    def test_unknown_fields_are_rejected(self):
        self.profile["instructions"]["magic"] = True
        findings = profile_tool.lint_profile(self.profile)
        self.assertTrue(any(item.code == "UNKNOWN_FIELD" for item in findings))

    def test_duplicate_array_items_are_rejected(self):
        self.profile["instructions"]["tone"] = ["direct", "direct"]
        findings = profile_tool.lint_profile(self.profile)
        self.assertTrue(any(item.code == "DUPLICATE_ITEM" for item in findings))

    def test_write_rendered_files(self):
        rendered = profile_tool.render_profile(self.profile)
        with tempfile.TemporaryDirectory() as tmp:
            out = Path(tmp)
            profile_tool.write_rendered(rendered, out)
            self.assertTrue((out / "settings.md").exists())
            self.assertEqual((out / "occupation.txt").read_text().strip(), "Analyst.")
            self.assertTrue((out / "more-about-you.txt").exists())
            self.assertTrue((out / "custom-instructions.txt").exists())

    def test_cli_rejects_malformed_profile_cleanly(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "bad.json"
            bad = {**self.profile, "identity": []}
            path.write_text(json.dumps(bad), encoding="utf-8")
            result = subprocess.run([sys.executable, str(MODULE_PATH), "lint", str(path)], capture_output=True, text=True, check=False)
            self.assertEqual(result.returncode, 1)
            self.assertIn("TYPE", result.stdout)
            self.assertNotIn("Traceback", result.stdout + result.stderr)


class ExampleProfileTests(unittest.TestCase):
    def test_all_examples_load_and_lint(self):
        repo_root = Path(__file__).resolve().parents[1]
        profile_paths = sorted((repo_root / "profiles").glob("*.json"))
        self.assertGreater(len(profile_paths), 1)
        for path in profile_paths:
            with self.subTest(path=path.name):
                data = json.loads(path.read_text(encoding="utf-8"))
                errors = [finding for finding in profile_tool.lint_profile(data) if finding.level == "error"]
                self.assertEqual(errors, [])

    def test_yasman_profile_is_paragraph_first(self):
        repo_root = Path(__file__).resolve().parents[1]
        profile = json.loads((repo_root / "profiles" / "yasman.json").read_text(encoding="utf-8"))
        rendered = profile_tool.render_profile(profile)
        self.assertIn("connected explanatory paragraphs", rendered.custom_instructions)
        self.assertIn("Do not create numbered sections merely because an answer is long", rendered.custom_instructions)
        self.assertIn("Plain language must reduce linguistic complexity, not informational depth", rendered.custom_instructions)


if __name__ == "__main__":
    unittest.main()
