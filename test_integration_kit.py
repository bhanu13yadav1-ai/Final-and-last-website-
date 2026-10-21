#!/usr/bin/env python3
"""Offline static checks for the Final Fusion integration kit; no internet required."""
from __future__ import annotations
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

KIT = Path(__file__).resolve().parents[1]
ADDON_JS = KIT / "addons" / "app-addon.js"
ADDON_CSS = KIT / "addons" / "app-addon.css"
INSTALLER = KIT / "apply_integration.py"


class IntegrationKitChecks(unittest.TestCase):
    def test_eight_original_innerwear_frames_are_present_in_order(self):
        js = ADDON_JS.read_text(encoding="utf-8")
        expected = [
            "360-demo-01-front.webp", "360-demo-02-front-three-quarter.webp",
            "360-demo-03-side-quarter.webp", "360-demo-04-rear-three-quarter.webp",
            "360-demo-05-rear.webp", "360-demo-06-rear-opposite.webp",
            "360-demo-07-side-opposite.webp", "360-demo-08-front-opposite.webp",
        ]
        positions = [js.find(f"'{name}'") for name in expected]
        self.assertTrue(all(position >= 0 for position in positions), "one or more original frame names are absent")
        self.assertEqual(positions, sorted(positions), "frame order must not be shuffled")

    def test_local_favourites_gallery_privacy_and_cutout_picker_exist(self):
        js = ADDON_JS.read_text(encoding="utf-8")
        for required in [
            "innerwear-360-save", "toggleSaved(integrationId)", "data-gallery-save",
            "function saveLibraryItem", "blackedFusionFitNotesV1", "ff-comfort-form",
            "ff-use-cutout", "mountAfterDarkGallery", "renderAfterDarkCards",
        ]:
            self.assertIn(required, js)

    def test_no_inline_html_event_attributes_in_templates(self):
        js = ADDON_JS.read_text(encoding="utf-8")
        self.assertIsNone(re.search(r"\son(?:click|error|load|change)\s*=", js, re.I))

    def test_css_braces_balance(self):
        css = ADDON_CSS.read_text(encoding="utf-8")
        self.assertEqual(css.count("{"), css.count("}"))
        self.assertGreater(css.count("{"), 25)

    def test_javascript_syntax_when_node_is_available(self):
        node = shutil.which("node")
        if not node:
            self.skipTest("Node.js is not installed; syntax test can be run with node --check app.js after applying")
        result = subprocess.run([node, "--check", str(ADDON_JS)], capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_installer_python_compiles(self):
        result = subprocess.run([sys.executable, "-m", "py_compile", str(INSTALLER)], capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_installer_is_idempotent_on_a_fixture(self):
        with tempfile.TemporaryDirectory(prefix="final-fusion-kit-test-") as temp:
            root = Path(temp)
            (root / "index.html").write_text('<!doctype html><html><body><section id="view-intimates"><div class="fit-cta"></div></section><section id="view-wellness"><div class="education-section"></div></section><section id="view-afterdark"><div class="wild-wheel-section"></div></section><section id="view-fitstudio"><div class="fit-upload-panel"><div class="upload-box"></div></div></section></body></html>', encoding="utf-8")
            (root / "app.js").write_text("const products=[]; const state={saved:new Set(),bag:{},fit:{},view:'home'}; function getProduct(id){return null} function getStory(id){return null} function allConceptById(id){return getProduct(id)||getStory(id)} function renderSavedDrawer(){} function renderSavedCount(){} function renderCatalog(){} function saveState(){} function asset(repo,name){return name} function toggleSaved(){} function renderSanskari(){} function renderBagDrawer(){} function makeDateIdea(){} function renderViewer(){} function fallbackImages(){} function updateFitPreview(){} function toast(){}\n", encoding="utf-8")
            (root / "styles.css").write_text("body { margin: 0; }\n", encoding="utf-8")
            (root / "app-icon.svg").write_text('<svg xmlns="http://www.w3.org/2000/svg"/>', encoding="utf-8")
            (root / "sw.js").write_text("const CACHE_NAME = 'test'; const CORE = ['./', './index.html', './styles.css', './app.js', './manifest.webmanifest', './assets/app-icon.svg'];", encoding="utf-8")
            (root / "tools-download-assets.py").write_text("MANIFEST = ROOT / 'assets' / 'asset-manifest.json'\n", encoding="utf-8")
            (root / "static_check.py").write_text('MANIFEST_PATH = ROOT / "assets" / "asset-manifest.json"\n', encoding="utf-8")
            (root / "asset-manifest.json").write_text(json.dumps({"manifestVersion": 1, "assets": []}), encoding="utf-8")
            (root / "innerwear-image-library.json").write_text(json.dumps([{"id":"img-001","source_repo":"Brand-website-3","filename":"360-demo-01-front.webp","category":"8-frame concept viewer","title":"Front frame","src":"https://raw.githubusercontent.com/bhanu13yadav1-ai/Brand-website-3/main/360-demo-01-front.webp","notes":"Concept only"}]), encoding="utf-8")
            command = [sys.executable, str(INSTALLER), str(root), "--no-download"]
            first = subprocess.run(command, capture_output=True, text=True)
            self.assertEqual(first.returncode, 0, first.stdout + first.stderr)
            app_once = (root / "app.js").read_text(encoding="utf-8")
            css_once = (root / "styles.css").read_text(encoding="utf-8")
            self.assertIn("librarySaved:{}", app_once)
            self.assertIn("ff-private-fit-notes", app_once)
            self.assertTrue((root / "assets" / "app-icon.svg").exists())
            self.assertIn('MANIFEST = ROOT / \'asset-manifest.json\'', (root / "tools-download-assets.py").read_text(encoding="utf-8"))
            second = subprocess.run(command, capture_output=True, text=True)
            self.assertEqual(second.returncode, 0, second.stdout + second.stderr)
            self.assertEqual((root / "app.js").read_text(encoding="utf-8").count("BEGIN FINAL FUSION INTEGRATION KIT"), 1)
            self.assertEqual((root / "styles.css").read_text(encoding="utf-8").count("BEGIN FINAL FUSION INTEGRATION KIT"), 1)
            manifest = json.loads((root / "asset-manifest.json").read_text(encoding="utf-8"))
            self.assertEqual(len(manifest["assets"]), manifest["uniqueReferencedAssets"])
            self.assertEqual(len({item["url"] for item in manifest["assets"]}), len(manifest["assets"]))


if __name__ == "__main__":
    unittest.main(verbosity=2)
