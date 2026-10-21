#!/usr/bin/env python3
"""Safely integrate Her Stories into the existing BLacked Final Fusion static site.
Run from the existing repository root:
    python Her-Stories-Hinglish-Integration/apply_her_stories.py
The script checks all anchors before writing and refuses to duplicate an install.
"""
from __future__ import annotations
import argparse
import re
import shutil
import sys
from html.parser import HTMLParser
from pathlib import Path

PACKAGE = Path(__file__).resolve().parent

class SiteParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.views: list[str] = []
        self.nav_targets: list[str] = []
        self.scripts: list[str] = []
        self.styles: list[str] = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get('id'):
            self.ids.append(str(a['id']))
        if a.get('id', '').startswith('view-'):
            self.views.append(a['id'][5:])
        if a.get('data-view'):
            self.nav_targets.append(str(a['data-view']))
        if tag == 'script' and a.get('src'):
            self.scripts.append(str(a['src']))
        if tag == 'link' and a.get('rel') == 'stylesheet' and a.get('href'):
            self.styles.append(str(a['href']))

def fail(message: str) -> None:
    print(f'ERROR: {message}', file=sys.stderr)
    raise SystemExit(1)

def replace_once(source: str, old: str, new: str, label: str) -> str:
    count = source.count(old)
    if count != 1:
        fail(f'{label} ke liye exact 1 anchor chahiye tha, mila {count}. Koi file nahi badli gayi.')
    return source.replace(old, new, 1)

def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', default='.', help='Existing repo root (default: current directory)')
    args = parser.parse_args()
    root = Path(args.root).resolve()
    required = ['index.html', 'app.js', 'styles.css', 'sw.js']
    missing = [f for f in required if not (root / f).is_file()]
    if missing:
        fail(f'Repo root mein ye files nahi milin: {missing}. --root ke saath sahi folder dein.')

    index = (root / 'index.html').read_text(encoding='utf-8')
    app = (root / 'app.js').read_text(encoding='utf-8')
    sw = (root / 'sw.js').read_text(encoding='utf-8')
    downloader_path = root / 'tools-download-assets.py'
    downloader = downloader_path.read_text(encoding='utf-8') if downloader_path.is_file() else None
    css_addition = (PACKAGE / 'her-stories.css').read_text(encoding='utf-8')
    js_addition = (PACKAGE / 'her-stories.js').read_text(encoding='utf-8')
    section = (PACKAGE / 'her-stories-section.html').read_text(encoding='utf-8').strip()

    if 'id="view-herstories"' in index or 'her-stories.js' in index or 'her-story-reader' in index:
        fail('Her Stories pehle se integrate hota dikh raha hai. Duplicate install rok diya; files manually compare karein.')
    if 'function switchView(view)' not in app or "if(view==='afterdark'&&!state.adult)" not in app:
        fail('app.js ka navigation/18+ gate anchor current version se match nahi karta. Manual review zaroori hai; files nahi badli gayi.')
    if "const CACHE_NAME = 'blacked-final-fusion-v1-shell';" not in sw or "'./app.js'" not in sw:
        fail('sw.js ka cache anchor expected version se match nahi karta. Manual review zaroori hai; files nahi badli gayi.')
    if not re.search(r'<link[^>]+href=["\']styles\.css(?:\?[^"\']*)?["\']', index):
        fail('index.html mein styles.css ka link nahi mila.')
    if index.count('<!-- AFTER DARK -->') != 1:
        fail('AFTER DARK section ka unique insertion anchor nahi mila.')

    # Desktop navigation.
    desktop = '<button class="nav-link" data-view="couples">Boyfriend & Couples</button>'
    index = replace_once(index, desktop, desktop + '\n      <button class="nav-link" data-view="herstories">Her Stories <span class="age-pill">18+</span></button>', 'desktop nav')
    # Mobile navigation.
    mobile = '<button data-view="couples">Boyfriend & Couples</button>'
    index = replace_once(index, mobile, mobile + '<button data-view="herstories">Her Stories <span class="age-pill">18+</span></button>', 'mobile nav')

    # New shortcut card on Home, inserted directly after the existing Couples card.
    lines = index.splitlines()
    matches = [i for i, line in enumerate(lines) if 'class="space-card" data-view="couples"' in line]
    if len(matches) != 1:
        fail(f'Home Couples card ka unique anchor nahi mila (count={len(matches)}). Koi file nahi badli gayi.')
    new_card = '          <button class="space-card her-home-story-card" data-view="herstories"><img src="https://raw.githubusercontent.com/bhanu13yadav1-ai/Brand-website-full-finally-/main/boyfriend-cafe-02.webp" alt="Her Stories ke liye romantic cafe artwork" loading="lazy" data-fallback="https://raw.githubusercontent.com/bhanu13yadav1-ai/Brand-website-full-finally-/main/boyfriend-cafe-01.webp"><span class="space-overlay"></span><span class="space-content"><small>03 / SIRF ADULTS KE LIYE</small><strong>Her Stories <span class="age-pill">18+</span></strong><span>Romance, secrets aur original Hinglish fiction ↗</span></span></button>'
    lines.insert(matches[0] + 1, new_card)
    index = '\n'.join(lines) + ('\n' if (root / 'index.html').read_text(encoding='utf-8').endswith('\n') else '')

    # Renumber following Home cards after inserting Her Stories as slot 03.
    for old, new in [
        ('03 / FOR CONSENTING ADULTS', '04 / FOR CONSENTING ADULTS'),
        ('04 / KNOW YOURSELF', '05 / KNOW YOURSELF'),
        ('05 / TRADITION MEETS MOOD', '06 / TRADITION MEETS MOOD'),
        ('06 / FUTURE COLLECTIONS', '07 / FUTURE COLLECTIONS')
    ]:
        index = replace_once(index, old, new, f'Home card numbering {old}')

    # Section, CSS link and script tags.
    index = replace_once(index, '<!-- AFTER DARK -->', section + '\n\n    <!-- AFTER DARK -->', 'Her Stories section insertion')
    css_link = '<link rel="stylesheet" href="styles.css">'
    # A query string or changed formatting is okay; insert beside the matching tag.
    css_match = re.search(r'<link[^>]+href=["\']styles\.css(?:\?[^"\']*)?["\'][^>]*>', index)
    if not css_match:
        fail('Stylesheet link anchor lost ho gaya.')
    style_tag = '<link rel="stylesheet" href="her-stories.css">'
    index = index[:css_match.end()] + '\n  ' + style_tag + index[css_match.end():]
    script_tag = '<script src="app.js" defer></script>'
    index = replace_once(index, script_tag, script_tag + '\n  <script src="her-stories.js" defer></script>', 'Her Stories script')

    # Reuse the site's existing self-attestation gate for both adults-only destinations.
    old_gate = "if(view==='afterdark'&&!state.adult){state.pendingAction=()=>switchView('afterdark');showAgeGate();return}"
    new_gate = "if((view==='afterdark'||view==='herstories')&&!state.adult){state.pendingAction=()=>switchView(view);showAgeGate();return}"
    app = replace_once(app, old_gate, new_gate, 'existing 18+ navigation gate')

    # Update the offline shell cache key and include the two new local files.
    sw = replace_once(sw, "const CACHE_NAME = 'blacked-final-fusion-v1-shell';", "const CACHE_NAME = 'blacked-final-fusion-v2-her-stories';", 'service-worker cache version')
    core_old = "const CORE = ['./', './index.html', './styles.css', './app.js', './manifest.webmanifest', './assets/app-icon.svg'];"
    core_new = "const CORE = ['./', './index.html', './styles.css', './app.js', './her-stories.css', './her-stories.js', './manifest.webmanifest', './assets/app-icon.svg'];"
    sw = replace_once(sw, core_old, core_new, 'service-worker core assets')

    # Keep the optional image-bundling helper aware of new story image URLs too.
    if downloader is not None:
        downloader = replace_once(downloader, "for rel in ('index.html', 'app.js'):", "for rel in ('index.html', 'app.js', 'her-stories.js'):", 'offline image downloader file list')
        downloader = replace_once(downloader, "core = ['./', './index.html', './styles.css', './app.js', './manifest.webmanifest', './assets/app-icon.svg'] + ['./' + item['localPath'] for item in items]", "core = ['./', './index.html', './styles.css', './app.js', './her-stories.css', './her-stories.js', './manifest.webmanifest', './assets/app-icon.svg'] + ['./' + item['localPath'] for item in items]", 'offline image downloader core cache')

    # Basic validation before writing any project files.
    html_parser = SiteParser()
    try:
        html_parser.feed(index)
        html_parser.close()
    except Exception as exc:
        fail(f'Patched HTML parse nahi hua: {exc}')
    duplicates = sorted({item for item in html_parser.ids if html_parser.ids.count(item) > 1})
    if duplicates:
        fail(f'Patched HTML mein duplicate IDs aa gaye: {duplicates}. Koi file nahi badli gayi.')
    missing_views = sorted(set(html_parser.nav_targets) - set(html_parser.views))
    if missing_views:
        fail(f'Navigation ke page-view targets missing hain: {missing_views}. Koi file nahi badli gayi.')
    if 'id="her-story-reader"' not in index or "view==='herstories'" not in app or "'./her-stories.js'" not in sw:
        fail('Her Stories integration checks fail hue. Koi file nahi badli gayi.')

    # Only after all checks pass, write the intended project files.
    (root / 'her-stories.css').write_text(css_addition, encoding='utf-8')
    (root / 'her-stories.js').write_text(js_addition, encoding='utf-8')
    (root / 'index.html').write_text(index, encoding='utf-8')
    (root / 'app.js').write_text(app, encoding='utf-8')
    (root / 'sw.js').write_text(sw, encoding='utf-8')
    if downloader is not None:
        downloader_path.write_text(downloader, encoding='utf-8')

    print('DONE: Her Stories integrate ho gaya.')
    changed = 'index.html, app.js, sw.js, tools-download-assets.py; added: her-stories.css, her-stories.js' if downloader is not None else 'index.html, app.js, sw.js; added: her-stories.css, her-stories.js'
    print('Changed: ' + changed)
    print(f'HTML IDs unique: {len(html_parser.ids)}; nav targets valid: {len(html_parser.nav_targets)}')
    print('Next checks: node --check app.js && node --check her-stories.js && node --check sw.js')
    print('Reminder: live GitHub Pages + Android Chrome QA zaroor karein; age gate self-attestation hi hai.')
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
