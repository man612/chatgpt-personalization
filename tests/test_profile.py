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
            "schema_version": "1.0",
            "name": "Test",
            "occupation": "Analyst.",
            "about": {
                "background": ["Works with reports"],
                "experience": "Knows the basics",
                "recurring_uses": ["Research", "Writing"],
                "stable_preferences": ["Values clarity"],
            },
            "response": {
                "language": "Use English.",
                "tone": ["plainspoken", "direct", "patient without being patronizing"],
                "audience": "an intelligent beginner",
                "structure": {
                    "long_answers": "Use descriptive sections",
                    "body": "Use paragraphs",
                    "lists": "Use lists when useful",
                    "tables": "Use tables for comparison",
                },
                "technical": ["Explain causes"],
                "research": ["Verify current claims"],
                "avoid": ["generic openings"],
            },
        }

    def test_render_contains_all_layers(self):
        rendered = profile_tool.render_profile(self.profile)
        self.assertEqual(rendered.occupation, "Analyst.")
        self.assertIn("Works with reports.", rendered.more_about_you)
        self.assertIn("Common uses include Research and Writing.", rendered.more_about_you)
        self.assertIn("Use a plainspoken and direct tone.", rendered.response_preferences)
        self.assertIn("Patient without being patronizing.", rendered.response_preferences)
        self.assertIn("Write for an intelligent beginner.", rendered.response_preferences)

    def test_valid_profile_has_no_errors(self):
        findings = profile_tool.lint_profile(self.profile)
        self.assertFalse([item for item in findings if item.level == "error"])

    def test_field_limit_is_enforced(self):
        self.profile["about"]["background"] = ["x" * 200]
        findings = profile_tool.lint_profile(self.profile, long_field_limit=100)
        self.assertTrue(any(item.code == "FIELD_LIMIT" for item in findings))

    def test_secret_detection(self):
        self.profile["about"]["experience"] = "Token: sk-" + "A" * 24
        findings = profile_tool.lint_profile(self.profile)
        self.assertTrue(any(item.code == "POSSIBLE_SECRET" for item in findings))

    def test_prompt_bloat_warning(self):
        self.profile["response"]["technical"] = ["Act as a world-class genius"]
        findings = profile_tool.lint_profile(self.profile)
        self.assertTrue(any(item.code == "PROMPT_BLOAT" for item in findings))

    def test_wrong_nested_type_returns_finding_instead_of_crashing(self):
        self.profile["about"] = []
        findings = profile_tool.lint_profile(self.profile)
        self.assertTrue(any(item.code == "TYPE" and "about" in item.message for item in findings))

    def test_string_instead_of_tone_array_is_rejected(self):
        self.profile["response"]["tone"] = "calm"
        findings = profile_tool.lint_profile(self.profile)
        self.assertTrue(any(item.code == "TYPE" and "response.tone" in item.message for item in findings))

    def test_unknown_fields_are_rejected(self):
        self.profile["response"]["magic"] = True
        findings = profile_tool.lint_profile(self.profile)
        self.assertTrue(any(item.code == "UNKNOWN_FIELD" for item in findings))

    def test_duplicate_array_items_are_rejected(self):
        self.profile["response"]["tone"] = ["direct", "direct"]
        findings = profile_tool.lint_profile(self.profile)
        self.assertTrue(any(item.code == "DUPLICATE_ITEM" for item in findings))

    def test_schema_length_constraints_are_enforced(self):
        self.profile["name"] = "x" * 81
        findings = profile_tool.lint_profile(self.profile)
        self.assertTrue(any(item.code == "MAX_LENGTH" and "name" in item.message for item in findings))

    def test_write_rendered_files(self):
        rendered = profile_tool.render_profile(self.profile)
        with tempfile.TemporaryDirectory() as tmp:
            out = Path(tmp)
            profile_tool.write_rendered(rendered, out)
            self.assertEqual((out / "occupation.txt").read_text().strip(), "Analyst.")
            self.assertTrue((out / "more-about-you.txt").exists())
            self.assertTrue((out / "response-preferences.txt").exists())

    def test_cli_rejects_malformed_profile_cleanly(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "bad.json"
            path.write_text(json.dumps({**self.profile, "about": []}), encoding="utf-8")
            result = subprocess.run(
                [sys.executable, str(MODULE_PATH), "lint", str(path)],
                capture_output=True,
                text=True,
                check=False,
            )
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


if __name__ == "__main__":
    unittest.main()
