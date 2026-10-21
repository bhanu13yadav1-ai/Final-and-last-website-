#!/usr/bin/env python3
"""Download this package's existing P2 GitHub images, rewrite them to local paths, and create an offline-ready ZIP.

Run from anywhere with Python 3 and internet access:
  python tools-download-assets.py
This transforms the working extracted folder. Make a copy first if you want to preserve the remote-image variant.
"""
from __future__ import annotations
import json, re, shutil, sys, time, zipfile
from io import BytesIO
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parent
MANIFEST = ROOT / 'assets' / 'asset-manifest.json'
USER_AGENT = 'BLacked-Final-Fusion-Asset-Bundler/1.0'


def verify_image(path: Path) -> tuple[int | None, int | None]:
    """Validate file signature; if Pillow is available, also verify image decoding."""
    data = path.read_bytes()
    suffix = path.suffix.lower()
    if suffix == '.webp':
        valid_signature = len(data) >= 12 and data[:4] == b'RIFF' and data[8:12] == b'WEBP'
    elif suffix in ('.jpg', '.jpeg'):
        valid_signature = len(data) >= 3 and data[:3] == b'\xff\xd8\xff'
    elif suffix == '.png':
        valid_signature = data.startswith(b'\x89PNG\r\n\x1a\n')
    elif suffix == '.gif':
        valid_signature = data.startswith((b'GIF87a', b'GIF89a'))
    else:
        raise RuntimeError(f'Unsupported image extension for validation: {suffix}')
    if not valid_signature:
        raise RuntimeError(f'Image signature does not match extension {suffix}')
    try:
        from PIL import Image  # type: ignore[import-not-found]
    except ImportError:
        return None, None
    with Image.open(BytesIO(data)) as image:
        image.verify()
    with Image.open(BytesIO(data)) as image:
        return int(image.width), int(image.height)


def download(url: str, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    req = Request(url, headers={'User-Agent': USER_AGENT})
    last_error = None
    for attempt in range(3):
        try:
            with urlopen(req, timeout=35) as response:
                content_type = response.headers.get('Content-Type', '').lower()
                data = response.read()
                if response.status != 200 or not data:
                    raise RuntimeError(f'HTTP {response.status} or empty file')
                if 'text/html' in content_type or (content_type and not content_type.startswith('image/')):
                    raise RuntimeError(f'Expected image but received {content_type}')
                destination.write_bytes(data)
                verify_image(destination)
                return
        except Exception as exc:  # noqa: BLE001 - collect the final download failure for the user
            try:
                destination.unlink(missing_ok=True)
            except OSError:
                pass
            last_error = exc
            time.sleep(1 + attempt)
    raise RuntimeError(f'Could not download/verify {url}: {last_error}')


def main() -> int:
    if not MANIFEST.exists():
        print(f'Missing asset manifest: {MANIFEST}', file=sys.stderr)
        return 2
    manifest = json.loads(MANIFEST.read_text(encoding='utf-8'))
    items = manifest.get('assets', [])
    failed = []
    for index, item in enumerate(items, 1):
        local_path = ROOT / item['localPath']
        try:
            if not local_path.exists() or local_path.stat().st_size == 0:
                download(item['url'], local_path)
            width, height = verify_image(local_path)
            item['bundledLocally'] = True
            item['bytes'] = local_path.stat().st_size
            if width and height:
                item['dimensions'] = {'width': width, 'height': height}
            print(f'[{index:02d}/{len(items):02d}] OK {item["repository"]}/{item["path"]} ({item["bytes"]:,} bytes' + (f', {width}x{height}' if width and height else '') + ')')
        except Exception as exc:  # noqa: BLE001
            failed.append({'url': item['url'], 'error': str(exc)})
            print(f'[{index:02d}/{len(items):02d}] FAIL {item["url"]}: {exc}', file=sys.stderr)
    if failed:
        (ROOT / 'ASSET-DOWNLOAD-FAILURES.json').write_text(json.dumps(failed, indent=2), encoding='utf-8')
        print(f'Asset download incomplete: {len(failed)} of {len(items)} failed. No offline ZIP created.', file=sys.stderr)
        return 1

    # Rewrite literal raw GitHub image URLs in HTML/JS to local files.
    url_map = {item['url']: item['localPath'] for item in items}
    for rel in ('index.html', 'app.js'):
        path = ROOT / rel
        text = path.read_text(encoding='utf-8')
        for old, new in url_map.items():
            text = text.replace(old, new)
        if rel == 'app.js':
            # asset(repo, file) constructs the same asset paths; switch that helper to local files.
            text = re.sub(
                r"const REPO = 'https://raw\.githubusercontent\.com/bhanu13yadav1-ai';\s*\nconst asset = \(repo, name\) => `\$\{REPO\}/\$\{repo\}/main/\$\{name\}`;",
                "const asset = (repo, name) => `assets/images/${repo}/${name}`;",
                text,
                count=1,
            )
            if 'const REPO =' in text:
                raise RuntimeError('Could not rewrite the asset helper; aborting to avoid a partially bundled build.')
        path.write_text(text, encoding='utf-8')

    # Precache the locally bundled artwork on HTTPS/localhost so the offline shell has its media too.
    sw_path = ROOT / 'sw.js'
    sw = sw_path.read_text(encoding='utf-8')
    core = ['./', './index.html', './styles.css', './app.js', './manifest.webmanifest', './assets/app-icon.svg'] + ['./' + item['localPath'] for item in items]
    sw = re.sub(r"const CACHE_NAME = '[^']+';", "const CACHE_NAME = 'blacked-final-fusion-v1-offline';", sw)
    sw = re.sub(r"const CORE = \[.*?\];", 'const CORE = ' + json.dumps(core, ensure_ascii=False) + ';', sw, flags=re.S)
    sw_path.write_text(sw, encoding='utf-8')

    # Make the generated offline package's documentation accurately describe its new asset state.
    readme_path = ROOT / 'README.md'
    readme = readme_path.read_text(encoding='utf-8')
    readme = re.sub(
        r"## Important asset note\n\n.*?\n\n## Run / publish",
        "## Important asset note\n\nThis build bundles the selected source image binaries under `assets/images/` and rewrites app references to local paths. Image signatures are validated by the helper; full decode dimensions are recorded when Pillow is installed. The bundled media can work offline after the service worker has cached its shell and images. Review rights and visual matching before commercial release.\n\n## Run / publish",
        readme, flags=re.S)
    readme_path.write_text(readme, encoding='utf-8')
    report_path = ROOT / 'QA-REPORT.md'
    report = report_path.read_text(encoding='utf-8')
    report = re.sub(
        r"## Important asset status\n\n.*?\n\n## Known limitations",
        "## Important asset status\n\nThis is the bundled image variant. All 60 image files in the manifest were downloaded and passed extension/signature verification; pixel dimensions and full image decode were verified where Pillow was available. Live Android, GitHub Pages, visual-suitability and commercial-rights checks remain outstanding.\n\n## Known limitations",
        report, flags=re.S)
    report_path.write_text(report, encoding='utf-8')

    manifest['assetPolicy'] = 'All referenced image binaries downloaded into assets/images, signature-checked, and referenced locally.'
    for item in items:
        item['bundledLocally'] = True
    MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    (ROOT / 'OFFLINE-ASSETS-READY.txt').write_text(
        f'All {len(items)} referenced source images were downloaded and local references rewritten.\n'
        'Review image use permissions and QA-REPORT.md before public/commercial deployment.\n', encoding='utf-8')

    output = ROOT.parent / 'BLacked-Final-Fusion-Offline.zip'
    excluded_parts = {'qa-fixtures', '__pycache__'}
    with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED, compresslevel=7) as archive:
        for path in ROOT.rglob('*'):
            if not path.is_file() or any(part in excluded_parts for part in path.parts):
                continue
            if path.name == output.name or path.name == 'ASSET-DOWNLOAD-FAILURES.json':
                continue
            archive.write(path, path.relative_to(ROOT.parent))
    print(f'Created offline-ready ZIP: {output} ({output.stat().st_size:,} bytes)')
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
