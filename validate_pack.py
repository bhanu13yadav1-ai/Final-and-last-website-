#!/usr/bin/env python3
"""No-network structural checks for the Her Stories integration pack."""
from __future__ import annotations
from html.parser import HTMLParser
from pathlib import Path
import re, shutil, subprocess, sys

ROOT = Path(__file__).resolve().parent
errors: list[str] = []
def check(ok: bool, message: str) -> None:
    print(('PASS ' if ok else 'FAIL ') + message)
    if not ok: errors.append(message)
class Parser(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids=[]; self.scripts=[]; self.styles=[]; self.img_without_alt=[]
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if a.get('id'): self.ids.append(a['id'])
        if tag=='script' and a.get('src'): self.scripts.append(a['src'])
        if tag=='link' and a.get('rel')=='stylesheet' and a.get('href'): self.styles.append(a['href'])
        if tag=='img' and 'alt' not in a: self.img_without_alt.append(a.get('src','(no src)'))

preview=(ROOT/'her-stories-preview.html').read_text(encoding='utf-8')
section=(ROOT/'her-stories-section.html').read_text(encoding='utf-8')
css=(ROOT/'her-stories.css').read_text(encoding='utf-8')
js=(ROOT/'her-stories.js').read_text(encoding='utf-8')
p=Parser(); p.feed(preview); p.close()
check(not {x for x in p.ids if p.ids.count(x)>1}, 'Preview HTML mein IDs unique hain')
check(not p.img_without_alt, 'Har image ke saath alt text hai')
check(all((ROOT/x).is_file() for x in p.scripts+p.styles), 'Preview ke local CSS/JS paths resolve hote hain')
check(css.count('{')==css.count('}'), f'CSS braces balanced ({css.count("{")} / {css.count("}")})')
check(section.count('id="view-herstories"')==1 and section.count('id="her-story-reader"')==1, 'Her Stories page aur reader dialog ka unique markup hai')
check(len(re.findall(r"^      id: '", js, re.M)) == 4, '4 story records included hain')
check(js.count("title: 'Chapter") == 8, 'Total 8 story chapters included hain')
check('data-her-ending' in js and 'saved.endings' in js, 'Choose-your-ending interaction data aur persistence se connected hai')
check('localStorage' in js and 'navigator.sendBeacon' not in js and 'fetch(' not in js, 'Story data device-local hai; server upload call nahi hai')
node=shutil.which('node')
if node:
    result=subprocess.run([node,'--check',str(ROOT/'her-stories.js')],capture_output=True,text=True)
    check(result.returncode==0, 'Node.js syntax check pass hota hai')
else: print('INFO Node.js nahi mila; syntax check skip hua')
check('class="page-view active her-stories-view"' in preview, 'Standalone preview visible state mein hai')
print(f'\nSummary: {len(errors)} FAIL, {10-len(errors)} PASS/INFO checks')
sys.exit(1 if errors else 0)
