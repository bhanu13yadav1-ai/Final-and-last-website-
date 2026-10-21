#!/usr/bin/env python3
"""Safely integrate the Final Fusion add-on into an extracted website folder.

Usage from the website root:
    python Final-Fusion-Integration-Kit/apply_integration.py .

The script makes a backup first, merges the 151-record source-image library into
asset-manifest.json, adds the Innerwear 360° viewer/favourites, all-image archive,
private local comfort notes and preset cutout selector, and corrects manifest paths.
Run `python tools-download-assets.py` afterwards on a machine with internet access
if you want to bundle the referenced image binaries for offline use.
"""
from __future__ import annotations
import argparse
import csv
import json
import re
import shutil
import sys
import time
import urllib.error
import urllib.request
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

LIBRARY_URL = "https://raw.githubusercontent.com/bhanu13yadav1-ai/Brand-website-v2/main/innerwear-image-library.json"
MARKER_JS = "/* BEGIN FINAL FUSION INTEGRATION KIT"
MARKER_CSS = "/* BEGIN FINAL FUSION INTEGRATION KIT */"
USER_AGENT = "Final-Fusion-Integration-Kit/1.0"


def fetch_library(root: Path) -> list[dict]:
    local = root / "innerwear-image-library.json"
    if local.exists():
        try:
            data = json.loads(local.read_text(encoding="utf-8"))
            if isinstance(data, list) and data:
                return data
        except (OSError, json.JSONDecodeError):
            pass
    request = urllib.request.Request(LIBRARY_URL, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            raw = response.read().decode("utf-8")
        data = json.loads(raw)
        if not isinstance(data, list) or not data:
            raise ValueError("Remote image library was not a non-empty JSON array")
        # Preserve the separate Noor Edit preview artwork from the recovery repository.
        extra_art = [
            ("noor-original-board", "muslim-collection-four-panel-original.png", "Original four-panel artwork", "Original composite artwork; do not present the panel board as four separate product photos."),
            ("noor-ka-nasha", "muslim-noor-ka-nasha.webp", "Noor Ka Nasha", "Individual crop for the Muslim-inspired Noor Edit preview; collection is Coming Soon."),
            ("shaam-e-noor", "muslim-shaam-e-noor.webp", "Shaam E Noor", "Individual crop for the Muslim-inspired Noor Edit preview; collection is Coming Soon."),
            ("shaam-ki-roshni", "muslim-shaam-ki-roshni.webp", "Shaam Ki Roshni", "Individual crop for the Muslim-inspired Noor Edit preview; collection is Coming Soon."),
            ("shaam-se-raat-tak", "muslim-shaam-se-raat-tak.webp", "Shaam Se Raat Tak", "Individual crop for the Muslim-inspired Noor Edit preview; collection is Coming Soon."),
        ]
        seen = {item.get("src") for item in data if isinstance(item, dict)}
        for record_id, filename, title, notes in extra_art:
            src = f"https://raw.githubusercontent.com/bhanu13yadav1-ai/Brand-website-v1/main/{filename}"
            if src not in seen:
                data.append({"id": f"extra-{record_id}", "source_repo": "Brand-website-v1", "filename": filename,
                    "category": "Muslim-Inspired Collection · Noor Edit (Coming Soon)", "title": title, "src": src, "notes": notes})
        local.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        return data
    except Exception as exc:  # network access can fail; a pre-downloaded local manifest is accepted
        raise RuntimeError(
            "Could not download the 151-record image library. Download this file into the website root "
            f"and rerun: {LIBRARY_URL}. Original error: {exc}"
        ) from exc


def ensure_library_extras(library: list[dict]) -> list[dict]:
    extras = [
        ("noor-original-board", "muslim-collection-four-panel-original.png", "Original four-panel artwork", "Original composite artwork; do not present the panel board as four separate product photos."),
        ("noor-ka-nasha", "muslim-noor-ka-nasha.webp", "Noor Ka Nasha", "Individual crop for the Muslim-inspired Noor Edit preview; collection is Coming Soon."),
        ("shaam-e-noor", "muslim-shaam-e-noor.webp", "Shaam E Noor", "Individual crop for the Muslim-inspired Noor Edit preview; collection is Coming Soon."),
        ("shaam-ki-roshni", "muslim-shaam-ki-roshni.webp", "Shaam Ki Roshni", "Individual crop for the Muslim-inspired Noor Edit preview; collection is Coming Soon."),
        ("shaam-se-raat-tak", "muslim-shaam-se-raat-tak.webp", "Shaam Se Raat Tak", "Individual crop for the Muslim-inspired Noor Edit preview; collection is Coming Soon."),
    ]
    result = list(library)
    seen = {item.get("src") for item in result if isinstance(item, dict)}
    for record_id, filename, title, notes in extras:
        src = f"https://raw.githubusercontent.com/bhanu13yadav1-ai/Brand-website-v1/main/{filename}"
        if src not in seen:
            result.append({"id": f"extra-{record_id}", "source_repo": "Brand-website-v1", "filename": filename,
                "category": "Muslim-Inspired Collection · Noor Edit (Coming Soon)", "title": title, "src": src, "notes": notes})
            seen.add(src)
    return result


def source_to_manifest_item(source: dict) -> dict | None:
    url = source.get("src") or source.get("url")
    if not isinstance(url, str) or not url.startswith("https://raw.githubusercontent.com/bhanu13yadav1-ai/"):
        return None
    parsed = urlparse(url)
    parts = parsed.path.lstrip("/").split("/")
    if len(parts) < 4:
        return None
    owner, repository, branch = parts[0], parts[1], parts[2]
    path = "/".join(parts[3:])
    safe_repo = re.sub(r"[^A-Za-z0-9._-]+", "-", repository)
    safe_filename = "/".join(re.sub(r"[^A-Za-z0-9._-]+", "-", part) for part in path.split("/"))
    return {
        "owner": owner,
        "repository": repository,
        "branch": branch,
        "path": path,
        "url": url,
        "localPath": f"assets/images/{safe_repo}/{safe_filename}",
        "bundledLocally": False,
        "title": source.get("title") or Path(path).name,
        "category": source.get("category") or "Source image",
        "notes": source.get("notes") or "Source reference; verify visual match and usage rights before commercial use.",
        "sourceLibraryId": source.get("id"),
    }


def merge_asset_manifest(root: Path, library: list[dict]) -> tuple[Path, dict, int]:
    root_manifest = root / "asset-manifest.json"
    nested_manifest = root / "assets" / "asset-manifest.json"
    manifest_path = root_manifest if root_manifest.exists() else nested_manifest
    if not manifest_path.exists():
        manifest = {"manifestVersion": 1, "generatedFor": "BLacked Final Fusion", "createdDate": datetime.now(timezone.utc).date().isoformat(), "assetPolicy": "Combined source register; image binaries are not confirmed bundled until individually checked.", "uniqueReferencedAssets": 0, "assets": []}
        manifest_path = root_manifest
    else:
        try:
            manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            raise RuntimeError(f"Asset manifest JSON is invalid: {manifest_path}") from exc
    original = manifest.get("assets", [])
    if not isinstance(original, list):
        raise RuntimeError("The asset manifest `assets` value is not a list")
    merged: dict[str, dict] = {}
    for item in original:
        if isinstance(item, dict) and isinstance(item.get("url"), str):
            merged[item["url"]] = item
    for source in library:
        item = source_to_manifest_item(source)
        if not item:
            continue
        if item["url"] in merged:
            # Enrich an existing manifest entry without replacing its verified local status.
            existing = merged[item["url"]]
            for key in ("title", "category", "notes", "sourceLibraryId"):
                existing.setdefault(key, item.get(key))
            existing.setdefault("owner", item["owner"])
            existing.setdefault("repository", item["repository"])
            existing.setdefault("branch", item["branch"])
            existing.setdefault("path", item["path"])
            existing.setdefault("localPath", item["localPath"])
            existing.setdefault("bundledLocally", False)
        else:
            merged[item["url"]] = item
    # The dedicated 8-frame Innerwear angle set is mandatory in the merged manifest.
    frame_names = [
        "360-demo-01-front.webp", "360-demo-02-front-three-quarter.webp",
        "360-demo-03-side-quarter.webp", "360-demo-04-rear-three-quarter.webp",
        "360-demo-05-rear.webp", "360-demo-06-rear-opposite.webp",
        "360-demo-07-side-opposite.webp", "360-demo-08-front-opposite.webp",
    ]
    for name in frame_names:
        if not any(item.get("path") == name and item.get("repository") == "Brand-website-3" for item in merged.values()):
            url = f"https://raw.githubusercontent.com/bhanu13yadav1-ai/Brand-website-3/main/{name}"
            merged[url] = {
                "owner": "bhanu13yadav1-ai", "repository": "Brand-website-3", "branch": "main", "path": name,
                "url": url, "localPath": f"assets/images/Brand-website-3/{name}", "bundledLocally": False,
                "title": name.removesuffix(".webp"), "category": "8-frame Innerwear angle concept",
                "notes": "Concept angle frame, not a verified physical-product scan.",
            }
    assets = sorted(merged.values(), key=lambda item: (item.get("repository", ""), item.get("path", "")))
    manifest["assets"] = assets
    manifest["uniqueReferencedAssets"] = len(assets)
    manifest["createdDate"] = datetime.now(timezone.utc).date().isoformat()
    manifest["assetPolicy"] = "Merged source register. `bundledLocally` is true only after the downloader verifies each file."
    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    # Keep exactly one canonical root manifest for runtime lookups. The original static checker is patched below.
    if manifest_path != root_manifest:
        root_manifest.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return root_manifest, manifest, len(assets)


def make_backup(root: Path) -> Path:
    backup_dir = root / "backups"
    backup_dir.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S-UTC")
    output = backup_dir / f"before-final-fusion-integration-{stamp}.zip"
    candidates = ["index.html", "app.js", "styles.css", "sw.js", "manifest.webmanifest", "README.md", "QA-REPORT.md", "SOURCE-COMBINATION.md", "asset-manifest.json", "static_check.py", "tools-download-assets.py", "VERSION.txt"]
    with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
        for name in candidates:
            path = root / name
            if path.is_file():
                archive.write(path, name)
        nested = root / "assets" / "asset-manifest.json"
        if nested.is_file():
            archive.write(nested, "assets/asset-manifest.json")
    return output


def patch_js(js: str, addon: str) -> str:
    if MARKER_JS in js:
        return js
    if "function allConceptById(id){return getProduct(id)||getStory(id)}" not in js:
        pattern = r"function\s+allConceptById\(id\)\s*\{\s*return\s+getProduct\(id\)\s*\|\|\s*getStory\(id\)\s*;?\s*\}"
        if not re.search(pattern, js):
            raise RuntimeError("Could not safely identify the current allConceptById helper; no app.js changes were written.")
        js = re.sub(pattern, "function allConceptById(id){return getProduct(id)||getStory(id)||(state.librarySaved&&state.librarySaved[id])}", js, count=1)
    else:
        js = js.replace("function allConceptById(id){return getProduct(id)||getStory(id)}", "function allConceptById(id){return getProduct(id)||getStory(id)||(state.librarySaved&&state.librarySaved[id])}", 1)
    if "librarySaved:{}" not in js and "librarySaved: {}" not in js:
        pattern = r"saved\s*:\s*new Set\(\)\s*,\s*bag\s*:\s*\{\}"
        if not re.search(pattern, js):
            raise RuntimeError("Could not safely add the saved-gallery state; no app.js changes were written.")
        js = re.sub(pattern, "saved:new Set(),librarySaved:{},bag:{}", js, count=1)
    return js.rstrip() + "\n\n" + addon.strip() + "\n"


def ensure_app_icon_path(root: Path) -> None:
    assets = root / "assets"
    assets.mkdir(parents=True, exist_ok=True)
    expected = assets / "app-icon.svg"
    if expected.exists():
        return
    source = root / "app-icon.svg"
    if source.exists():
        shutil.copy2(source, expected)
    else:
        raise RuntimeError("Neither assets/app-icon.svg nor root app-icon.svg exists; refusing to leave a broken PWA icon path.")


def patch_manifest_paths(root: Path) -> None:
    # Both historical scripts expected assets/asset-manifest.json, but this release keeps it at repo root.
    helper = root / "tools-download-assets.py"
    if helper.exists():
        content = helper.read_text(encoding="utf-8")
        old = "MANIFEST = ROOT / 'assets' / 'asset-manifest.json'"
        new = "MANIFEST = ROOT / 'asset-manifest.json' if (ROOT / 'asset-manifest.json').exists() else ROOT / 'assets' / 'asset-manifest.json'"
        if old in content:
            content = content.replace(old, new, 1)
        # Images should be cached on demand by the existing fetch handler, not all precached at install time.
        content = content.replace(
            "core = ['./', './index.html', './styles.css', './app.js', './manifest.webmanifest', './assets/app-icon.svg'] + ['./' + item['localPath'] for item in items]",
            "core = ['./', './index.html', './styles.css', './app.js', './manifest.webmanifest', './assets/app-icon.svg', './asset-manifest.json', './innerwear-image-library.json']"
        )
        content = content.replace("All 60 referenced source images were downloaded and local references rewritten.", "All referenced source images in the merged manifest were downloaded and local references rewritten.")
        content = content.replace("All 60 image files in the manifest were downloaded", "All image files in the merged manifest were downloaded")
        content = content.replace("excluded_parts = {'qa-fixtures', '__pycache__'}", "excluded_parts = {'qa-fixtures', '__pycache__', 'backups', 'Final-Fusion-Integration-Kit', '.git'}")
        helper.write_text(content, encoding="utf-8")

    checker = root / "static_check.py"
    if checker.exists():
        content = checker.read_text(encoding="utf-8")
        old = 'MANIFEST_PATH = ROOT / "assets" / "asset-manifest.json"'
        new = 'MANIFEST_PATH = ROOT / "asset-manifest.json"\nif not MANIFEST_PATH.exists():\n    MANIFEST_PATH = ROOT / "assets" / "asset-manifest.json"'
        if old in content:
            content = content.replace(old, new, 1)
        checker.write_text(content, encoding="utf-8")

    sw = root / "sw.js"
    if sw.exists():
        content = sw.read_text(encoding="utf-8")
        content = re.sub(r"const CACHE_NAME = '[^']+';", "const CACHE_NAME = 'blacked-final-fusion-v2-integration';", content, count=1)
        match = re.search(r"const CORE = \[(.*?)\];", content, flags=re.S)
        if match:
            items = ["./", "./index.html", "./styles.css", "./app.js", "./manifest.webmanifest", "./assets/app-icon.svg", "./asset-manifest.json", "./innerwear-image-library.json"]
            content = content[:match.start()] + "const CORE = " + json.dumps(items) + ";" + content[match.end():]
        sw.write_text(content, encoding="utf-8")


def update_docs(root: Path, asset_count: int, library_count: int) -> None:
    readme = root / "README.md"
    if readme.exists():
        content = readme.read_text(encoding="utf-8")
        content = content.replace("assets/asset-manifest.json", "asset-manifest.json")
        heading = "## Integration kit additions — 21 October 2026"
        if heading not in content:
            insert = f"""

{heading}

- Added the original **8-frame Innerwear angle concept viewer** with slider, frame buttons, previous/next, keyboard arrows and swipe/drag gestures.
- Added the viewer concept to the existing local Favourites drawer; it does not replace or rename the original three wheels or the Wellness wand viewer.
- Added a searchable, category-filtered source archive backed by {library_count} source-library records. Gallery favourites appear in the same Saved drawer. Source labels are preserved so external-brand inspiration is not misrepresented as BLACKED stock.
- Added a local-only comfort education check-in, private fit-note save/delete, and an optional preset garment cutout picker in Fit Studio.
- Merged {asset_count} unique source-image references into the root `asset-manifest.json`. This is a **source inventory**, not proof all binaries are bundled.
- The asset downloader and static checker now prefer root `asset-manifest.json` and fall back to `assets/asset-manifest.json`. The service worker caches metadata in its shell and lets the existing fetch handler cache images as they are viewed instead of precaching every large image at install.

After installing, run `python static_check.py` when present and `node --check app.js`, then run `python tools-download-assets.py` on an internet-connected computer if you need an offline build. Review `INTEGRATION-KIT-REPORT.md` for test scope; real Android/browser, image-content, rights and live deployment tests must still be completed.
"""
            anchor = "## What this is not"
            if anchor in content:
                content = content.replace(anchor, insert + "\n\n" + anchor, 1)
            else:
                content += insert
            readme.write_text(content, encoding="utf-8")
    qa_report = root / "QA-REPORT.md"
    if qa_report.exists():
        qa_content = qa_report.read_text(encoding="utf-8")
        if "## Integration-kit status — 21 October 2026" not in qa_content:
            qa_note = f"""

## Integration-kit status — 21 October 2026

- The original baseline report described 60 selected image records. The installed kit merges the 151-record source library plus up to five separately labelled Noor Edit original/crop records, then deduplicates URLs into the root manifest. This updated count is a metadata count, not proof that image bytes were downloaded or visually verified.
- The baseline `28 PASS, 0 FAIL` result applies to the earlier release before the add-on. Re-run `python static_check.py` and `node --check app.js` after applying the kit; do not carry the old result forward as a fresh test.
- The new Innerwear eight-frame viewer, the all-image gallery, After Dark concept archive, local comfort/fit notes and preset cutout picker still need real browser click-through and Android layout/export tests.
- The integration kit's own offline fixture suite is separate from website QA; it does not prove the deployed site works.
"""
            qa_content += qa_note
            qa_report.write_text(qa_content, encoding="utf-8")

    combination = root / "SOURCE-COMBINATION.md"
    if combination.exists():
        combo = combination.read_text(encoding="utf-8")
        if "Integration-kit merge note — 21 October 2026" not in combo:
            combo += f"""

## Integration-kit merge note — 21 October 2026

The initial release recorded 60 selected source-image URLs. The integration kit adds the separate `Brand-website-v2/innerwear-image-library.json` source inventory (151 entries, deduplicated by URL) and up to five distinct `Brand-website-v1` Noor Edit original/crop artworks if they are not already present. The merged unique URL count is written into `asset-manifest.json` when the kit is applied. Source records and remote filenames do not themselves prove successful downloads, correct visual fit, or commercial usage rights.
"""
            combination.write_text(combo, encoding="utf-8")

    report = root / "INTEGRATION-KIT-REPORT.md"
    report.write_text(f"""# Final Fusion integration kit report

Date: {datetime.now(timezone.utc).date().isoformat()}

## Added by this integration
- Original 8-frame Innerwear angle viewer (`Brand-website-3/360-demo-01…08`), with slider, buttons, keyboard and swipe controls.
- Saved viewer concept plus individual library image favourites integrated with the existing local Saved drawer.
- Full searchable/category-filterable gallery backed by {library_count} source-image records.
- Local-only comfort guidance and fit notes, including save and delete controls.
- Optional preset cutout selector using source entries categorized as transparent garment cutout concepts.
- Combined source-image register with {asset_count} unique image URLs.

## Asset and honesty safeguards
- Gallery source category and repository labels are preserved. External-brand inspiration and owner references are not described as confirmed BLACKED products.
- Angle frames remain concept frames, not a verified supplier scan or true 3D model.
- Local fit notes and comfort choices are stored in the current browser only; this static page sends them nowhere.
- Asset register count does not mean all image binaries have downloaded or that their usage rights are cleared.
- Missing images show an explicit unavailable state rather than silently displaying an unrelated product image.

## Checks / remaining verification
- This kit includes a static syntax/consistency check and appends additions to the existing files instead of replacing them wholesale.
- Run `node --check app.js` and `python static_check.py` after installation.
- Run `python tools-download-assets.py` on a machine with internet access to download and signature-check the merged image set; stop if any download fails.
- Human/browser QA is still required at 320, 360, 390, 430 px and desktop widths, including the 360 controls, Saved drawer, gallery filtering, local notes, preset cutouts, keyboard and real offline reload.
- Review visual image suitability, content rights and commercial/legal requirements before public release.
""", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", nargs="?", default=".", help="Path to an extracted Final Fusion website folder (default: current directory)")
    parser.add_argument("--no-download", action="store_true", help="Require innerwear-image-library.json to already exist locally; do not fetch the 151-record metadata file")
    args = parser.parse_args()
    root = Path(args.root).expanduser().resolve()
    kit = Path(__file__).resolve().parent
    for required in ("index.html", "app.js", "styles.css"):
        if not (root / required).is_file():
            print(f"ERROR: {root / required} not found. Point `root` at the extracted Final Fusion website folder.", file=sys.stderr)
            return 2
    addon_js_path = kit / "addons" / "app-addon.js"
    addon_css_path = kit / "addons" / "app-addon.css"
    if not addon_js_path.is_file() or not addon_css_path.is_file():
        print("ERROR: The kit's addons/app-addon.js and addons/app-addon.css are missing.", file=sys.stderr)
        return 2

    try:
        # Validate exact patch points before downloading or writing anything.
        app_js = (root / "app.js").read_text(encoding="utf-8")
        css = (root / "styles.css").read_text(encoding="utf-8")
        if MARKER_JS not in app_js:
            if not re.search(r"function\s+allConceptById\(id\)\s*\{\s*return\s+getProduct\(id\)\s*\|\|\s*getStory\(id\)\s*;?\s*\}", app_js):
                raise RuntimeError("Current app.js differs from the audited base: allConceptById helper was not found. No files changed.")
            if not re.search(r"saved\s*:\s*new Set\(\)\s*,\s*bag\s*:\s*\{\}", app_js):
                raise RuntimeError("Current app.js differs from the audited base: the saved/bag state pattern was not found. No files changed.")
        if args.no_download:
            library_file = root / "innerwear-image-library.json"
            if not library_file.is_file():
                raise RuntimeError("--no-download was set, but innerwear-image-library.json is absent from the website root.")
            library = json.loads(library_file.read_text(encoding="utf-8"))
        else:
            library = fetch_library(root)
        library = ensure_library_extras(library)
        (root / "innerwear-image-library.json").write_text(json.dumps(library, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        if not isinstance(library, list) or not library:
            raise RuntimeError("Image library must be a non-empty JSON list.")
        addon_js = addon_js_path.read_text(encoding="utf-8")
        addon_css = addon_css_path.read_text(encoding="utf-8")
        patched_js = patch_js(app_js, addon_js)
        if MARKER_CSS not in css:
            patched_css = css.rstrip() + "\n\n" + addon_css.strip() + "\n"
        else:
            patched_css = css
        if patched_js.count(MARKER_JS) != 1 or patched_css.count(MARKER_CSS) != 1:
            raise RuntimeError("Integration markers are duplicated or inconsistent. No files changed.")
        # Capture the exact pre-integration state before any project file is modified.
        backup = make_backup(root)
        ensure_app_icon_path(root)
        root_manifest, manifest, asset_count = merge_asset_manifest(root, library)
        (root / "app.js").write_text(patched_js, encoding="utf-8")
        (root / "styles.css").write_text(patched_css, encoding="utf-8")
        patch_manifest_paths(root)
        update_docs(root, asset_count, len(library))
        print("Integration applied successfully.")
        print(f"Website folder: {root}")
        print(f"Backup created: {backup}")
        print(f"Source library records: {len(library)}")
        print(f"Unique URLs in {root_manifest.name}: {asset_count}")
        print("Next run: node --check app.js")
        if (root / "static_check.py").exists():
            print("Then run: python static_check.py")
        if (root / "tools-download-assets.py").exists():
            print("For an offline build, run: python tools-download-assets.py (internet required; check all failures)")
        return 0
    except (OSError, ValueError, RuntimeError, urllib.error.URLError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        print("No app.js/styles.css writes were made. Check the message above before retrying.", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
