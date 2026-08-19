import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"


class DocsAssetVersionTests(unittest.TestCase):
    def test_runtime_assets_use_current_build_version(self):
        version = json.loads((DOCS / "version.json").read_text(encoding="utf-8"))["build"]
        html = (DOCS / "index.html").read_text(encoding="utf-8")

        assets = [
            "favicon.svg",
            "styles.css",
            "experience.css",
            "motion.css",
            "mobile.css",
            "performance.css",
            "renderer.js",
            "app.js",
            "motion.js",
            "mobile.js",
        ]
        for asset in assets:
            with self.subTest(asset=asset):
                self.assertIn(f"{asset}?v={version}", html)

    def test_freshness_manifest_matches_inline_build(self):
        version = json.loads((DOCS / "version.json").read_text(encoding="utf-8"))["build"]
        html = (DOCS / "index.html").read_text(encoding="utf-8")
        match = re.search(r'const BUILD = "([^"]+)";', html)
        self.assertIsNotNone(match)
        self.assertEqual(version, match.group(1))
        self.assertIn('fetch(`version.json?_=${now}`, { cache: "reload" })', html)

    def test_performance_css_loads_before_runtime_scripts(self):
        html = (DOCS / "index.html").read_text(encoding="utf-8")
        self.assertLess(html.index("performance.css"), html.index("renderer.js"))
        motion = (DOCS / "motion.js").read_text(encoding="utf-8")
        self.assertNotIn('document.createElement("link")', motion)


if __name__ == "__main__":
    unittest.main()
