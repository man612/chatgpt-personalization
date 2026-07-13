import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

MODULE_PATH = Path(__file__).resolve().parents[1] / "tools" / "profile.py"
SPEC = importlib.util.spec_from_file_location("profile_tool", MODULE_PATH)
profile_tool = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
import sys
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
                "tone": ["plainspoken", "direct"],
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
        self.assertIn("Recurring uses include Research and Writing.", rendered.more_about_you)
        self.assertIn("Write for an intelligent beginner.", rendered.response_preferences)
        self.assertIn("Avoid generic openings.", rendered.response_preferences)

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

    def test_write_rendered_files(self):
        rendered = profile_tool.render_profile(self.profile)
        with tempfile.TemporaryDirectory() as tmp:
            out = Path(tmp)
            profile_tool.write_rendered(rendered, out)
            self.assertEqual((out / "occupation.txt").read_text().strip(), "Analyst.")
            self.assertTrue((out / "more-about-you.txt").exists())
            self.assertTrue((out / "response-preferences.txt").exists())


class ExampleProfileTests(unittest.TestCase):
    def test_all_examples_load_and_lint(self):
        repo_root = Path(__file__).resolve().parents[1]
        profile_paths = sorted((repo_root / "profiles").glob("*.json"))
        self.assertGreater(len(profile_paths), 1)
        for path in profile_paths:
            with self.subTest(path=path.name):
                data = json.loads(path.read_text(encoding="utf-8"))
                errors = [
                    finding
                    for finding in profile_tool.lint_profile(data)
                    if finding.level == "error"
                ]
                self.assertEqual(errors, [])


if __name__ == "__main__":
    unittest.main()
