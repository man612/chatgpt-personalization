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
        self.assertIn('window.location.replace(url.toString())', html)

    def test_freshness_never_auto_reloads_over_unsaved_edits(self):
        html = (DOCS / "index.html").read_text(encoding="utf-8")
        self.assertIn("window.__BUILDER_DIRTY__ = false", html)
        self.assertIn("if (window.__BUILDER_DIRTY__)", html)
        self.assertIn("showUpdateNotice(latest.build)", html)
        self.assertIn("Your current edits are untouched", html)

    def test_performance_css_loads_before_runtime_scripts(self):
        html = (DOCS / "index.html").read_text(encoding="utf-8")
        self.assertLess(html.index("performance.css"), html.index("renderer.js"))
        motion = (DOCS / "motion.js").read_text(encoding="utf-8")
        self.assertNotIn('document.createElement("link")', motion)

    def test_mobile_steps_are_direct_navigation_not_decorative_progress(self):
        mobile = (DOCS / "mobile.js").read_text(encoding="utf-8")
        css = (DOCS / "mobile.css").read_text(encoding="utf-8")
        self.assertIn('class="mobile-step-tab" data-step-index=', mobile)
        self.assertIn('button.addEventListener("click", () => setStep(Number(button.dataset.stepIndex)))', mobile)
        self.assertIn('button.setAttribute("aria-current", "step")', mobile)
        self.assertIn(".mobile-step-indicator", css)

    def test_mobile_selected_states_have_motion_and_reduced_motion_fallback(self):
        mobile = (DOCS / "mobile.js").read_text(encoding="utf-8")
        css = (DOCS / "mobile.css").read_text(encoding="utf-8")
        self.assertIn("mobile-segment-indicator", mobile)
        self.assertIn("dialog.animate([", mobile)
        self.assertIn("animateStepSurface", mobile)
        self.assertIn("@media (prefers-reduced-motion: reduce)", css)

    def test_mobile_does_not_restore_the_old_fixed_bottom_dock(self):
        mobile = (DOCS / "mobile.js").read_text(encoding="utf-8")
        css = (DOCS / "mobile.css").read_text(encoding="utf-8")
        self.assertNotIn("builder-mobile-dock", mobile)
        self.assertNotIn("builder-mobile-dock", css)


if __name__ == "__main__":
    unittest.main()
