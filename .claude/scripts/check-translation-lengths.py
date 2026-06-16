#!/usr/bin/env python3
"""
check-translation-lengths.py
Compares translated content lengths against a FIXED budget.

The budget is NOT derived from the current cv-data.js. It is the authoritative layout
budget. Its ONLY home is the JSON this script reads — both the budget numbers AND the
tolerance band live there. .claude/rules/translation-length.md only explains the rule and
points here; it no longer carries a hand-maintained copy of the numbers.

Rule: Only two things are validated:
  1. hero (summary) — individual field length
  2. per-workplace TOTAL — description + all bullets + all project bullets combined

Tolerance: read from the JSON's "_tolerance" block (default -5% to +2%).
Not validated: community, education, hobbyProjects, programmingLanguages, skillGroups.

Reference (single source of truth): .claude/reference/current-english-lengths.json

If translated.length < BUDGET * min -> TOO_SHORT
If translated.length > BUDGET * max -> TOO_LONG

Usage:
  python check-translation-lengths.py          # validate all locales
  python check-translation-lengths.py --print   # print the budget table and exit

Exit code: 0 if all OK, 1 if any item is outside the tolerance band.
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
REFERENCE_FILE = ROOT / '.claude' / 'reference' / 'current-english-lengths.json'

exit_code = 0
total_violations = 0

def load_reference():
    if not REFERENCE_FILE.exists():
        print(f"ERROR: {REFERENCE_FILE} not found")
        sys.exit(1)
    with open(REFERENCE_FILE, encoding='utf-8') as f:
        return json.load(f)

def get_tolerance(ref):
    """Read the tolerance band from the reference JSON (single source of truth)."""
    tol = ref.get('_tolerance', {})
    return float(tol.get('min', 0.95)), float(tol.get('max', 1.02))

def budget_items(ref):
    """Yield (key, budget) for real budget entries, skipping _-prefixed meta keys."""
    for k, v in ref.items():
        if k.startswith('_'):
            continue
        yield k, v

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
TOLERANCE_MIN, TOLERANCE_MAX = get_tolerance(ref)

# --print: show the budget table (single source of truth) and exit.
if '--print' in sys.argv:
    print("=== Forditasi hossz-budget (FIX, single source of truth) ===")
    print(f"Forras: {REFERENCE_FILE.relative_to(ROOT)}")
    print(f"Turesi sav: -{(1-TOLERANCE_MIN)*100:.0f}% / +{(TOLERANCE_MAX-1)*100:.0f}%")
    print()
    print(f"{'Elem':<16}{'Budget':>8}{'min':>8}{'max':>8}")
    print("-" * 40)
    for k, v in budget_items(ref):
        print(f"{k:<16}{v:>8}{int(v*TOLERANCE_MIN):>8}{int(v*TOLERANCE_MAX):>8}")
    sys.exit(0)

print("=== Forditasi hossz-ellenorzes (FIX budget, munkahelyenkenti osszeg) ===")
print(f"Referencia (fix budget): {REFERENCE_FILE.name}")
print(f"Szabaly: BUDGET * {TOLERANCE_MIN:.2f} <= forditott <= BUDGET * {TOLERANCE_MAX:.2f}")
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
    for wid, en in budget_items(ref):
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
