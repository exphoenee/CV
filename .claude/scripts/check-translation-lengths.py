#!/usr/bin/env python3
"""
check-translation-lengths.py
Compares translated content field lengths against the CURRENT English source.

Rule: Only two things are validated:
  1. hero (summary) — individual field length
  2. per-workplace TOTAL — description + all bullets + all project bullets combined

Tolerance: -5% to +2% of the CURRENT English length.
Not validated: community, education, hobbyProjects, programmingLanguages, skillGroups.

Reference: .claude/reference/current-english-lengths.json

If translated.length < EN * 0.95 -> TOO_SHORT
If translated.length > EN * 1.02 -> TOO_LONG

Exit code: 0 if all OK, 1 if any field is outside the tolerance band.
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
TOLERANCE_MIN = 0.95
TOLERANCE_MAX = 1.02
REFERENCE_FILE = ROOT / '.claude' / 'reference' / 'current-english-lengths.json'

exit_code = 0
total_violations = 0

def load_reference():
    if not REFERENCE_FILE.exists():
        print(f"ERROR: {REFERENCE_FILE} not found")
        sys.exit(1)
    with open(REFERENCE_FILE) as f:
        return json.load(f)

def extract_string_value(t, field):
    pat = re.compile(
        rf'{re.escape(field)}\s*:\s*'
        r"(?P<q>['\"])(?P<v>(?:(?!\1)(?:\\.|[^\\]))*)\1",
        re.DOTALL
    )
    m = pat.search(t)
    return m.group('v') if m else None

def sum_texts_in_array(t, arr_start):
    """Find a [...] array starting at arr_start and sum all string lengths."""
    depth, end = 1, arr_start
    while depth > 0 and end < len(t):
        if t[end] == '[': depth += 1
        elif t[end] == ']': depth -= 1
        end += 1
    content = t[arr_start:end-1]
    bp = re.compile(r"(?P<q>['\"])(?P<v>(?:(?!\1)(?:\\.|[^\\]))*)\1", re.DOTALL)
    return sum(len(m.group('v')) for m in bp.finditer(content))

def extract_locale_data(filepath):
    """Extract: summary length + per-workplace totals from a locale file."""
    text = filepath.read_text('utf-8')
    
    # Find content block
    cm = re.search(r'content\s*:\s*\{', text)
    if not cm:
        return None  # content: null
    cstart = cm.end()
    depth, cend = 1, cstart
    while depth > 0 and cend < len(text):
        if text[cend] == '{': depth += 1
        elif text[cend] == '}': depth -= 1
        cend += 1
    ct = text[cstart:cend-1]
    
    data = {}
    
    # Summary
    s = extract_string_value(ct, 'summary')
    if s:
        data['summary'] = len(s)
    
    # Workplaces — find each id field
    for idm in re.finditer(r'id:\s*[\'"](\w+)[\'"]', ct):
        wid = idm.group(1)
        pos = idm.start()
        # Skip if this id is inside a projects array
        bef = ct[max(0,pos-200):pos]
        if 'projects' in bef and 'description' not in bef:
            continue
        chunk = ct[pos:pos+3000]
        
        total = 0
        
        d = extract_string_value(chunk, 'description')
        if d:
            total += len(d)
        
        # Main bullets
        bm = re.search(r'bullets\s*:\s*\[', chunk)
        if bm:
            total += sum_texts_in_array(chunk, bm.end())
        
        # Project bullets
        pm = re.search(r'projects\s*:\s*\[', chunk)
        if pm:
            pstart = pm.end()
            pdepth, pend = 1, pstart
            while pdepth > 0 and pend < len(chunk):
                if chunk[pend] == '[': pdepth += 1
                elif chunk[pend] == ']': pdepth -= 1
                pend += 1
            pt = chunk[pstart:pend-1]
            for pbm in re.finditer(r'bullets\s*:\s*\[', pt):
                total += sum_texts_in_array(pt, pbm.end())
        
        data[wid] = total
    
    return data

# --- Main ---
ref = load_reference()

print("=== Forditasi hossz-ellenorzes (JELENLEGI angol, munkahelyenkenti osszeg) ===")
print(f"Referencia: {REFERENCE_FILE.name}")
print(f"Szabaly: EN_jelenlegi * {TOLERANCE_MIN:.2f} <= forditott <= EN_jelenlegi * {TOLERANCE_MAX:.2f}")
print()
print("Ellenorzott elemek:")
print("  hero (summary) + munkahelyenkenti osszes (description+bullets+project bullets)")
print("  NEM ellenorizve: community, education, hobbyProjects, programmingLanguages")
print()

LOCALES = ['hu.js','de.js','fr.js','es.js','it.js','asg.js','dot.js','kl.js','qu.js','goa.js','ya.js']

for lf in LOCALES:
    lang = lf.replace('.js','').upper()
    fp = ROOT / 'scripts' / 'locales' / lf
    if not fp.exists():
        print(f"{lang}: FILE NOT FOUND"); continue
    
    tr = extract_locale_data(fp)
    if tr is None:
        print(f"{lang}: content: null - OK"); continue
    
    loc_fail = 0
    
    # Check hero (summary)
    if 'summary' in ref and 'summary' in tr:
        en, tr_len = ref['summary'], tr['summary']
        mn, mx = int(en*TOLERANCE_MIN), int(en*TOLERANCE_MAX)
        if tr_len < mn:
            print(f"  FAIL {lang}.hero(summary): EN={en}ch -> {tr_len}ch TOO_SHORT (min {mn})"); loc_fail+=1; total_violations+=1; exit_code=1
        elif tr_len > mx:
            print(f"  FAIL {lang}.hero(summary): EN={en}ch -> {tr_len}ch TOO_LONG (max {mx})"); loc_fail+=1; total_violations+=1; exit_code=1
        else:
            print(f"  OK  {lang}.hero(summary): {tr_len}ch (sav {mn}-{mx})")
    
    # Check per-workplace totals
    for wid, en in ref.items():
        if wid == 'summary': continue
        if wid not in tr: continue
        tr_len = tr[wid]
        mn, mx = int(en*TOLERANCE_MIN), int(en*TOLERANCE_MAX)
        if tr_len < mn:
            print(f"  FAIL {lang}.workplace[{wid}]: EN={en}ch -> {tr_len}ch TOO_SHORT (min {mn})"); loc_fail+=1; total_violations+=1; exit_code=1
        elif tr_len > mx:
            print(f"  FAIL {lang}.workplace[{wid}]: EN={en}ch -> {tr_len}ch TOO_LONG (max {mx})"); loc_fail+=1; total_violations+=1; exit_code=1
        else:
            print(f"  OK  {lang}.workplace[{wid}]: {tr_len}ch (sav {mn}-{mx})")
    
    if loc_fail == 0:
        print(f"  OK  {lang}: minden a savon belul")

print()
if exit_code == 0:
    print("ALL OK")
else:
    print(f"FAIL: {total_violations} elem a savon kivul")
    print()
    print("Javitas menete:")
    print("  TOO_SHORT: bovitsd a munkahely teljes szoveget (description+bullets)")
    print("  TOO_LONG:  tomoritsd a munkahely teljes szoveget")
    print("  LASD: .claude/rules/translation-length.md")

sys.exit(exit_code)
