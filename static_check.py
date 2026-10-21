#!/usr/bin/env python3
"""Reproducible no-network static checks for BLacked Final Fusion."""
from __future__ import annotations
import json, re, shutil, subprocess, sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML_PATH = ROOT / "index.html"
JS_PATH = ROOT / "app.js"
CSS_PATH = ROOT / "styles.css"
MANIFEST_PATH = ROOT / "assets" / "asset-manifest.json"
errors: list[str] = []
checks: list[str] = []


def ok(message: str) -> None:
    checks.append(message)
    print(f"PASS  {message}")


def fail(message: str) -> None:
    errors.append(message)
    print(f"FAIL  {message}")

class SiteParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.images_missing_alt: list[str] = []
        self.inline_handlers: list[str] = []
        self.data_views: list[str] = []
        self.image_srcs: list[str] = []
        self.labels_for: list[str] = []
        self.elements_with_id: list[tuple[str, str]] = []
        self.local_scripts: list[str] = []
        self.local_styles: list[str] = []
    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        a = dict(attrs)
        if a.get("id"):
            self.ids.append(str(a["id"]))
            self.elements_with_id.append((tag, str(a["id"])))
        if tag == "img":
            if "alt" not in a:
                self.images_missing_alt.append(str(a.get("src", "(no src)")))
            if a.get("src"):
                self.image_srcs.append(str(a["src"]))
        if tag == "label" and a.get("for"):
            self.labels_for.append(str(a["for"]))
        for k in a:
            if k.lower().startswith("on"):
                self.inline_handlers.append(f"{tag}[{k}]")
        if a.get("data-view"):
            self.data_views.append(str(a["data-view"]))
        if tag == "script" and a.get("src") and not str(a["src"]).startswith(("http://", "https://", "//")):
            self.local_scripts.append(str(a["src"]))
        if tag == "link" and a.get("rel") == "stylesheet" and a.get("href") and not str(a["href"]).startswith(("http://", "https://", "//")):
            self.local_styles.append(str(a["href"]))

if not all(p.exists() for p in (HTML_PATH, JS_PATH, CSS_PATH, MANIFEST_PATH)):
    fail("required shell files are present")
    sys.exit(1)

html = HTML_PATH.read_text(encoding="utf-8")
js = JS_PATH.read_text(encoding="utf-8")
css = CSS_PATH.read_text(encoding="utf-8")
parser = SiteParser()
try:
    parser.feed(html)
    parser.close()
    ok("HTML parses without parser errors")
except Exception as exc:
    fail(f"HTML parsing: {exc}")

ids = set(parser.ids)
dupes = sorted(i for i, c in Counter(parser.ids).items() if c > 1)
if dupes:
    fail(f"duplicate HTML IDs: {dupes}")
else:
    ok(f"{len(parser.ids)} HTML IDs are unique")

if parser.images_missing_alt:
    fail(f"static image elements missing alt: {parser.images_missing_alt}")
else:
    ok(f"all {len(parser.image_srcs)} static HTML image tags have an alt attribute")

if parser.inline_handlers:
    fail(f"inline event-handler attributes detected: {parser.inline_handlers}")
else:
    ok("no inline on* event-handler attributes")

page_views = set(re.findall(r'id="view-([a-z0-9-]+)"', html))
missing_views = sorted(set(parser.data_views) - page_views)
if missing_views:
    fail(f"data-view targets without page views: {missing_views}")
else:
    ok(f"all data-view navigation destinations match a page view ({len(page_views)} views)")

missing_files = []
for ref in parser.local_scripts + parser.local_styles:
    ref_path = (ROOT / ref.split("?", 1)[0].split("#", 1)[0]).resolve()
    if ROOT.resolve() not in ref_path.parents and ref_path != ROOT.resolve():
        missing_files.append(ref + " (path escapes project root)")
    elif not ref_path.exists():
        missing_files.append(ref)
if missing_files:
    fail(f"local script/stylesheet references missing: {missing_files}")
else:
    ok("local script and stylesheet references resolve to existing files")

# Check literal selectors used by the simple DOM helper; one compare tray is created on demand.
selector_ids = set(re.findall(r"\$\('#([A-Za-z][\w-]*)'\)", js))
dynamic_ids = {"compare-tray"}
missing_selector_ids = sorted(selector_ids - ids - dynamic_ids)
if missing_selector_ids:
    fail(f"literal JS selector IDs missing from markup: {missing_selector_ids}")
else:
    ok(f"all {len(selector_ids)} literal JS ID selectors resolve (plus documented dynamic compare tray)")

# Three existing wheel locations and the new Dirty/Wild wheel.
wheel_groups = {
    "Dildo comfort wheel": ["dildo-wheel-card", "dildo-wheel-disc", "dildo-result", "dildo-preference", "spin-dildo"],
    "Plug safety wheel": ["plug-wheel-card", "plug-wheel-disc", "plug-result", "plug-preference", "spin-plug"],
    "Boyfriend/Couples wheel": ["boy-wheel-disc", "boy-result", "boy-preference", "spin-boy"],
    "New Dirty/Wild wheel": ["wild-wheel-section", "wild-wheel-disc", "wild-category", "wild-result-copy", "spin-wild", "skip-wild", "reset-wild", "wild-consent"],
}
for name, required in wheel_groups.items():
    missing = sorted(set(required) - ids)
    if missing:
        fail(f"{name} missing IDs: {missing}")
        continue
    if name == "Dildo comfort wheel":
        bound = "$('#spin-dildo').addEventListener('click',()=>spinOriginal('dildo'))" in js and "dildo:{comfort:" in js
    elif name == "Plug safety wheel":
        bound = "$('#spin-plug').addEventListener('click',()=>spinOriginal('plug'))" in js and "plug:{base:" in js
    elif name == "Boyfriend/Couples wheel":
        bound = "$('#spin-boy').addEventListener('click',()=>spinOriginal('boy'))" in js and "boy:{soft:" in js
    else:
        bound = "$('#spin-wild').addEventListener('click',()=>requireAdult(spinWild))" in js and "function spinWild" in js
    if bound:
        ok(f"{name}: markup and click/data logic are present")
    else:
        fail(f"{name}: expected event binding or prompt data is missing")

if html.index('id="view-couples"') < html.index('id="boy-wheel-disc"') < html.index('<!-- AFTER DARK -->'):
    ok("Boyfriend/Couples wheel is inside the Couples view")
else:
    fail("Boyfriend/Couples wheel is not in the expected Couples section")
wellness_start = html.index('<!-- WELLNESS -->')
wellness_end = html.index('<!-- SANSKARI -->')
wellness_html = html[wellness_start:wellness_end]
if all(x in wellness_html for x in ['id="dildo-wheel-card"', 'id="plug-wheel-card"']):
    ok("Dildo and plug wheel cards are inside Wellness")
else:
    fail("Dildo or plug wheel card is outside the Wellness section")
if 'data-scroll-to="dildo-wheel-card"' in html and 'data-scroll-to="plug-wheel-card"' in html and 'dataset.scrollTo' in js:
    ok("Wellness wheel shortcuts target the exact wheel cards")
else:
    fail("Wellness wheel shortcut navigation targets are incomplete")

wild = re.search(r'<select[^>]*id="wild-category"[^>]*>(.*?)</select>', html, re.S)
category_count = len(re.findall(r'<option\b', wild.group(1))) if wild else 0
if category_count == 10:
    ok("Dirty/Wild wheel offers all 10 categories")
else:
    fail(f"Dirty/Wild wheel category count is {category_count}, expected 10")

if all(x in html for x in ["Virginity is not a medical diagnosis", "hymen's appearance cannot reliably prove sexual history", "ACOG's guide", "NHS guidance"]):
    ok("wellness education includes core evidence-based anatomy/virginity statements and source links")
else:
    fail("wellness education key accuracy statements or citations are missing")

try:
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    assets = manifest.get("assets", [])
    urls = [a.get("url") for a in assets]
    local_paths = [a.get("localPath") for a in assets]
    if not assets:
        fail("asset manifest has no assets")
    elif len(urls) != len(set(urls)) or len(local_paths) != len(set(local_paths)):
        fail("asset manifest contains duplicate URL or local-path records")
    elif not all(a.get("url", "").startswith("https://raw.githubusercontent.com/bhanu13yadav1-ai/") for a in assets):
        fail("one or more source assets do not point to the approved P2 account")
    else:
        ok(f"asset manifest parses with {len(assets)} unique source-image records")
    source_files = set(re.findall(r"https://raw\.githubusercontent\.com/[^\s\"'`<>\)]+", html + "\n" + js))
    source_files.discard("https://raw.githubusercontent.com/bhanu13yadav1-ai")
    missing_urls = sorted(source_files - set(urls))
    if missing_urls:
        fail(f"literal image URLs absent from asset manifest: {missing_urls}")
    else:
        ok("all literal source-image URLs used by the app are recorded in the manifest")
    # Verify exact helper references map to manifest items.
    pairs = {(a.get("repository"), a.get("path")) for a in assets}
    missing_pairs = sorted(set(re.findall(r"asset\('([^']+)','([^']+)'\)", js)) - pairs)
    if missing_pairs:
        fail(f"dynamic source-image calls absent from manifest: {missing_pairs}")
    else:
        ok("literal dynamic asset() references are covered by the image manifest")
except Exception as exc:
    fail(f"asset manifest validation: {exc}")

if "const REPO =" in js and "raw.githubusercontent.com/bhanu13yadav1-ai" in js:
    ok("remote image origin is the expected P2 GitHub account (online mode)")

if js.count("navigator.serviceWorker.register") == 1:
    ok("service worker registers once")
else:
    fail(f"expected one service-worker registration, found {js.count('navigator.serviceWorker.register')}")
if js.count("$('#age-dialog').addEventListener('cancel'") == 1:
    ok("age-dialog cancel listener is not duplicated")
else:
    fail(f"expected one age-dialog cancel listener, found {js.count("$('#age-dialog').addEventListener('cancel'")}")
if "if(img.complete&&img.naturalWidth===0)failImage()" in js and "img.img-unavailable{display:none!important}" in css and ".image-placeholder" in css:
    ok("image fallback covers already-failed images and a no-broken-icon placeholder state")
else:
    fail("image fallback race/placeholder handling is incomplete")
if css.count("{") == css.count("}"):
    ok(f"CSS brace count balanced ({css.count('{')} opening / {css.count('}')} closing)")
else:
    fail(f"CSS brace mismatch ({css.count('{')} opening / {css.count('}')} closing)")
if "@media(max-width:" in css or "@media (max-width:" in css:
    ok("responsive viewport breakpoints exist in the stylesheet")
else:
    fail("no responsive viewport breakpoints found")
try:
    webmanifest = json.loads((ROOT / "manifest.webmanifest").read_text(encoding="utf-8"))
    icon_paths = [item.get("src", "") for item in webmanifest.get("icons", [])]
    if icon_paths and all((ROOT / icon).exists() for icon in icon_paths):
        ok("web app manifest is valid JSON and its icon paths resolve")
    else:
        fail("web app manifest icon paths are missing or not configured")
except Exception as exc:
    fail(f"web app manifest validation: {exc}")

for filename in ("app.js", "sw.js"):
    if not shutil.which("node"):
        print("INFO  Node.js is not installed; JS syntax checks skipped.")
        break
    result = subprocess.run(["node", "--check", str(ROOT / filename)], capture_output=True, text=True)
    if result.returncode:
        fail(f"node --check {filename}: {result.stderr.strip()}")
    else:
        ok(f"node --check {filename}")

print(f"\nSummary: {len(checks)} PASS, {len(errors)} FAIL")
if errors:
    sys.exit(1)
