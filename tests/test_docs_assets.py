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
            "i18n.css",
            "i18n.js",
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
        self.assertLess(html.index("performance.css"), html.index("i18n.js"))
        self.assertLess(html.index("i18n.js"), html.index("app.js"))
        motion = (DOCS / "motion.js").read_text(encoding="utf-8")
        self.assertNotIn('document.createElement("link")', motion)

    def test_idle_ui_avoids_persistent_compositor_work(self):
        motion = (DOCS / "motion.js").read_text(encoding="utf-8")
        motion_css = (DOCS / "motion.css").read_text(encoding="utf-8")
        performance = (DOCS / "performance.css").read_text(encoding="utf-8")
        self.assertNotIn("infinite", motion_css)
        self.assertNotIn("data-magnetic", motion)
        self.assertNotIn("pointermove", motion)
        self.assertNotIn("motion-particle", motion)
        self.assertIn(".profile-sheet.back-product,", performance)
        self.assertIn("animation: none !important", performance)
        self.assertIn("backdrop-filter: none !important", performance)
        self.assertIn(".select-menu { background: var(--panel-3) !important; }", performance)

    def test_builder_defaults_to_general_and_excludes_personal_examples(self):
        html = (DOCS / "index.html").read_text(encoding="utf-8")
        self.assertIn('value="presets/general.json"', html)
        self.assertRegex(html, r'value="presets/general\.json"[^>]*selected')
        self.assertIn('value="presets/blank.json"', html)
        self.assertNotIn('value="maintainers/yasman.json"', html)
        self.assertNotIn('value="operational/yasman.json"', html)

    def test_builder_has_first_class_english_and_indonesian_ui(self):
        html = (DOCS / "index.html").read_text(encoding="utf-8")
        i18n = (DOCS / "i18n.js").read_text(encoding="utf-8")
        app = (DOCS / "app.js").read_text(encoding="utf-8")
        mobile = (DOCS / "mobile.js").read_text(encoding="utf-8")
        self.assertIn('data-locale="en"', html)
        self.assertIn('data-locale="id"', html)
        self.assertIn('en: {', i18n)
        self.assertIn('id: {', i18n)
        self.assertIn('chatgpt-personalization:locale', i18n)
        self.assertIn('builder:localechange', i18n)
        self.assertIn('document.addEventListener("builder:localechange"', app)
        self.assertIn('document.addEventListener("builder:localechange"', mobile)
        self.assertNotIn('window.location.reload()', i18n)

    def test_locale_switch_flushes_focused_edit_before_rebuild(self):
        i18n = (DOCS / "i18n.js").read_text(encoding="utf-8")
        pointerdown = 'button.addEventListener("pointerdown"'
        locale_click = 'button.addEventListener("click", () => setLocale(button.dataset.locale))'
        self.assertIn(pointerdown, i18n)
        self.assertIn('active.blur()', i18n)
        self.assertIn(locale_click, i18n)
        self.assertLess(i18n.index(pointerdown), i18n.index(locale_click))

    def test_smart_selects_use_one_document_pointer_listener(self):
        app = (DOCS / "app.js").read_text(encoding="utf-8")
        self.assertEqual(app.count('document.addEventListener("pointerdown"'), 1)
        self.assertIn("contains: (target) => shell.contains(target)", app)
        self.assertIn("if (openSelect && !openSelect.contains(event.target)) openSelect.close()", app)

    def test_apply_to_chatgpt_guidance_is_visible(self):
        html = (DOCS / "index.html").read_text(encoding="utf-8")
        i18n = (DOCS / "i18n.js").read_text(encoding="utf-8")
        self.assertIn('data-i18n="apply_steps_title"', html)
        self.assertIn('ChatGPT → Settings → Personalization', i18n)
        self.assertIn('ChatGPT → Pengaturan → Personalisasi', i18n)
        self.assertIn('data-i18n="advanced_path"', html)

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
