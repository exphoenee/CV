#!/usr/bin/env python3
"""
gen-english-reference.py
Generates .claude/reference/original-english-lengths.json

Extracts all translatable content field lengths from the ORIGINAL English cv-data.js
(2026-06-10 backup, before any job-apply optimizations).

Run whenever the reference backup is updated.
"""
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent

with open(ROOT / 'cv-versions' / '2026-06-10_1000_original' / 'cv-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

def get_str(t, field):
    pat = re.compile(
        rf'{re.escape(field)}\s*:\s*'
        r"(?P<q>['\"])(?P<v>(?:(?!\1)(?:\\.|[^\\]))*)\1",
        re.DOTALL
    )
    m = pat.search(t)
    return m.group('v') if m else None

fields = {}

# Summary
s = get_str(text, 'summary')
if s:
    fields['summary'] = len(s)

# Work experience items
for id_match in re.finditer(r'id:\s*[\'"](\w+)[\'"]', text):
    wid = id_match.group(1)
    pos = id_match.start()
    bef = text[max(0,pos-400):pos]
    if 'projects' in bef and 'description' not in bef:
        continue
    
    # Use a much larger chunk to cover all nested content
    chunk = text[pos:pos+3000]
    
    d = get_str(chunk, 'description')
    if d:
        fields[f'description_{wid}'] = len(d)
    
    bm = re.search(r'bullets\s*:\s*\[', chunk)
    if bm:
        start = bm.end()
        depth = 1
        end = start
        while depth > 0 and end < len(chunk):
            if chunk[end] == '[':
                depth += 1
            elif chunk[end] == ']':
                depth -= 1
            end += 1
        bt = chunk[start:end-1]
        bp = re.compile(r"(?P<q>['\"])(?P<v>(?:(?!\1)(?:\\.|[^\\]))*)\1", re.DOTALL)
        for i, bm2 in enumerate(bp.finditer(bt)):
            fields[f'bullet_{wid}_{i}'] = len(bm2.group('v'))
    
    pm = re.search(r'projects\s*:\s*\[', chunk)
    if pm:
        pstart = pm.end()
        pdepth = 1
        pend = pstart
        while pdepth > 0 and pend < len(chunk):
            if chunk[pend] == '[':
                pdepth += 1
            elif chunk[pend] == ']':
                pdepth -= 1
            pend += 1
        pt = chunk[pstart:pend-1]
        for pi, pbm in enumerate(re.finditer(r'bullets\s*:\s*\[', pt)):
            bstart = pbm.end()
            bdepth = 1
            bend = bstart
            while bdepth > 0 and bend < len(pt):
                if pt[bend] == '[':
                    bdepth += 1
                elif pt[bend] == ']':
                    bdepth -= 1
                bend += 1
            pbt = pt[bstart:bend-1]
            bp2 = re.compile(r"(?P<q>['\"])(?P<v>(?:(?!\1)(?:\\.|[^\\]))*)\1", re.DOTALL)
            for bi, bm3 in enumerate(bp2.finditer(pbt)):
                fields[f'proj_bullet_{wid}_{pi}_{bi}'] = len(bm3.group('v'))

# Community
c = get_str(text, 'community')
if c:
    fields['community'] = len(c)

# Write JSON
ref_dir = ROOT / '.claude' / 'reference'
ref_dir.mkdir(parents=True, exist_ok=True)
out = ref_dir / 'original-english-lengths.json'
with open(out, 'w', encoding='utf-8') as f:
    json.dump(fields, f, indent=2, ensure_ascii=False)

print(f"Written: {out}")
print(f"Total fields: {len(fields)}")
for k, v in sorted(fields.items()):
    min_v = int(v * 0.95)
    max_v = int(v * 1.02)
    print(f"  {k}: {v}ch (sav: {min_v}-{max_v})")
