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
  python check-translation-lengths.py            # validate all locales (human-readable)
  python check-translation-lengths.py --print     # print the budget table and exit
  python check-translation-lengths.py --json      # validate, JSON output (machine-readable)
  python check-translation-lengths.py --json --lang=hu,de  # validate only specific locales

Exit code: 0 if all OK, 1 if any item is outside the tolerance band.

JSON output schema (for AI agents like job-apply-orchestrator):

  {
    "summary": {
      "total": 11,           # total locales checked
      "passed": 8,           # locales with zero violations
      "failed": 3            # locales with at least one violation
    },
    "violations": [
      {
        "lang": "hu",               # language code (e.g. hu, de, fr)
        "langName": "Hungarian",     # human-readable language name
        "field": "summary",          # field identifier (summary or workplace:X)
        "fieldType": "hero",         # "hero" or "workplace"
        "status": "TOO_SHORT",       # "TOO_SHORT" or "TOO_LONG"
        "actual": 450,               # actual character count
        "budget": 500,               # budget character count
        "diff": -50,                 # actual - budget (negative=too short, positive=too long)
        "adjustBy": 25,              # chars to add (+) or remove (-) to reach nearest bound (min or max)
        "min": 475,                  # minimum allowed (budget * tolerance_min)
        "max": 510                   # maximum allowed (budget * tolerance_max)
      }
    ],
    "locales_checked": ["hu", "de", ...],
    "locales_ok": ["en", ...],
    "locales_with_issues": ["hu", ...],
    "has_violations": true
  }

The job-apply-orchestrator can parse violations[] to identify exactly which
language+field combinations need re-translation, and dispatch targeted fixes
instead of re-translating all locales.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
REFERENCE_FILE = ROOT / '.claude' / 'reference' / 'current-english-lengths.json'

# ── Language names for human-readable output ────────────────────────────
LANG_NAMES = {
    'hu': 'Hungarian', 'de': 'German', 'fr': 'French', 'es': 'Spanish',
    'it': 'Italian', 'asg': 'Asgardian', 'dot': 'Dothraki', 'kl': 'Klingon',
    'qu': 'Quenya', 'goa': "Goa'uld", 'ya': 'Yautja',
}

LOCALES = ['hu.js', 'de.js', 'fr.js', 'es.js', 'it.js',
           'asg.js', 'dot.js', 'kl.js', 'qu.js', 'goa.js', 'ya.js']


def load_reference():
    if not REFERENCE_FILE.exists():
        print(f"ERROR: {REFERENCE_FILE} not found")
        sys.exit(1)
    with open(REFERENCE_FILE, encoding='utf-8') as f:
        return json.load(f)


def get_tolerance(ref):
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
        if t[end] == '[':
            depth += 1
        elif t[end] == ']':
            depth -= 1
        end += 1
    content = t[arr_start:end - 1]
    bp = re.compile(r"(?P<q>['\"])(?P<v>(?:(?!\1)(?:\\.|[^\\]))*)\1", re.DOTALL)
    return sum(len(m.group('v')) for m in bp.finditer(content))


def extract_locale_data(filepath):
    """Extract: summary length + per-workplace totals from a locale file.
    Returns dict like {'summary': 450, 'aegex': 1800, ...} or None if content: null.
    """
    text = filepath.read_text('utf-8')

    cm = re.search(r'content\s*:\s*\{', text)
    if not cm:
        return None  # content: null
    cstart = cm.end()
    depth, cend = 1, cstart
    while depth > 0 and cend < len(text):
        if text[cend] == '{':
            depth += 1
        elif text[cend] == '}':
            depth -= 1
        cend += 1
    ct = text[cstart:cend - 1]

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
        bef = ct[max(0, pos - 200):pos]
        if 'projects' in bef and 'description' not in bef:
            continue
        chunk = ct[pos:pos + 3000]

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
                if chunk[pend] == '[':
                    pdepth += 1
                elif chunk[pend] == ']':
                    pdepth -= 1
                pend += 1
            pt = chunk[pstart:pend - 1]
            for pbm in re.finditer(r'bullets\s*:\s*\[', pt):
                total += sum_texts_in_array(pt, pbm.end())

        data[wid] = total

    return data


def validate_locale(lf_path, lang, ref, tolerance_min, tolerance_max, violations, results):
    """Validate a single locale file. Appends violations to the violations list
    and results to the results dict."""
    tr = extract_locale_data(lf_path)

    if tr is None:
        results[lang] = {'status': 'skipped', 'reason': 'content: null'}
        return

    loc_violations = []

    # Check hero (summary)
    if 'summary' in ref and 'summary' in tr:
        en, tr_len = ref['summary'], tr['summary']
        mn, mx = int(en * tolerance_min), int(en * tolerance_max)
        if tr_len < mn:
            loc_violations.append({
                'lang': lang, 'langName': LANG_NAMES.get(lang, lang),
                'field': 'summary', 'fieldType': 'hero',
                'status': 'TOO_SHORT', 'actual': tr_len,
                'budget': en, 'diff': tr_len - en, 'adjustBy': mn - tr_len,
                'min': mn, 'max': mx,
            })
        elif tr_len > mx:
            loc_violations.append({
                'lang': lang, 'langName': LANG_NAMES.get(lang, lang),
                'field': 'summary', 'fieldType': 'hero',
                'status': 'TOO_LONG', 'actual': tr_len,
                'budget': en, 'diff': tr_len - en, 'adjustBy': mx - tr_len,
                'min': mn, 'max': mx,
            })

    # Check per-workplace totals
    for wid, en in budget_items(ref):
        if wid == 'summary':
            continue
        if wid not in tr:
            continue
        tr_len = tr[wid]
        mn, mx = int(en * tolerance_min), int(en * tolerance_max)
        if tr_len < mn:
            loc_violations.append({
                'lang': lang, 'langName': LANG_NAMES.get(lang, lang),
                'field': f'workplace:{wid}', 'fieldType': 'workplace',
                'status': 'TOO_SHORT', 'actual': tr_len,
                'budget': en, 'diff': tr_len - en, 'adjustBy': mn - tr_len,
                'min': mn, 'max': mx,
            })
        elif tr_len > mx:
            loc_violations.append({
                'lang': lang, 'langName': LANG_NAMES.get(lang, lang),
                'field': f'workplace:{wid}', 'fieldType': 'workplace',
                'status': 'TOO_LONG', 'actual': tr_len,
                'budget': en, 'diff': tr_len - en, 'adjustBy': mx - tr_len,
                'min': mn, 'max': mx,
            })

    violations.extend(loc_violations)

    if loc_violations:
        results[lang] = {
            'status': 'fail',
            'violations': len(loc_violations),
            'details': loc_violations,
        }
    else:
        results[lang] = {'status': 'pass', 'violations': 0}


# ── CLI argument parsing (manual, no argparse needed) ──────────────────
USE_JSON = '--json' in sys.argv
PRINT_TABLE = '--print' in sys.argv
FILTER_LANGS = None

for arg in sys.argv:
    if arg.startswith('--lang='):
        FILTER_LANGS = [l.strip() for l in arg.split('=', 1)[1].split(',') if l.strip()]
        break

# ── Load reference ──────────────────────────────────────────────────────
ref = load_reference()
TOLERANCE_MIN, TOLERANCE_MAX = get_tolerance(ref)

# ── --print mode ────────────────────────────────────────────────────────
if PRINT_TABLE:
    print("=== Forditasi hossz-budget (FIX, single source of truth) ===")
    print(f"Forras: {REFERENCE_FILE.relative_to(ROOT)}")
    print(f"Turesi sav: -{(1 - TOLERANCE_MIN) * 100:.0f}% / +{(TOLERANCE_MAX - 1) * 100:.0f}%")
    print()
    print(f"{'Elem':<16}{'Budget':>8}{'min':>8}{'max':>8}")
    print("-" * 40)
    for k, v in budget_items(ref):
        print(f"{k:<16}{v:>8}{int(v * TOLERANCE_MIN):>8}{int(v * TOLERANCE_MAX):>8}")
    sys.exit(0)

# ── Validate ────────────────────────────────────────────────────────────
violations = []
results = {}
has_violations = False

for lf_name in LOCALES:
    lang = lf_name.replace('.js', '')

    # Apply language filter if --lang= was specified
    if FILTER_LANGS and lang not in FILTER_LANGS:
        continue

    fp = ROOT / 'scripts' / 'locales' / lf_name
    if not fp.exists():
        results[lang] = {'status': 'error', 'reason': 'file not found'}
        continue

    validate_locale(fp, lang, ref, TOLERANCE_MIN, TOLERANCE_MAX, violations, results)

if violations:
    has_violations = True

locales_with_issues = sorted(set(v['lang'] for v in violations))
locales_ok = sorted([
    lang for lang in results
    if results[lang].get('status') in ('pass', 'skipped')
])

# ── JSON output ─────────────────────────────────────────────────────────
if USE_JSON:
    output = {
        'summary': {
            'total': len(results),
            'passed': len([r for r in results.values() if r.get('status') in ('pass', 'skipped')]),
            'failed': len([r for r in results.values() if r.get('status') == 'fail']),
        },
        'violations': violations,
        'locales_checked': sorted(results.keys()),
        'locales_ok': locales_ok,
        'locales_with_issues': locales_with_issues,
        'has_violations': has_violations,
        'budget_source': str(REFERENCE_FILE.relative_to(ROOT)),
    }
    print(json.dumps(output, indent=2, ensure_ascii=False))
    sys.exit(1 if has_violations else 0)

# ── Human-readable output (default) ─────────────────────────────────────
print("=== Forditasi hossz-ellenorzes (FIX budget, munkahelyenkenti osszeg) ===")
print(f"Referencia (fix budget): {REFERENCE_FILE.name}")
print(f"Szabaly: BUDGET * {TOLERANCE_MIN:.2f} <= forditott <= BUDGET * {TOLERANCE_MAX:.2f}")
print()
print("Ellenorzott elemek:")
print("  hero (summary) + munkahelyenkenti osszes (description+bullets+project bullets)")
print("  NEM ellenorizve: community, education, hobbyProjects, programmingLanguages")
print()

for lf_name in LOCALES:
    lang_code = lf_name.replace('.js', '')
    lang_upper = lang_code.upper()
    locale_result = results.get(lang_code, {})
    status = locale_result.get('status', 'unchecked')

    if status == 'error':
        print(f"{lang_upper}: FILE NOT FOUND")
        continue
    if status == 'skipped':
        print(f"{lang_upper}: content: null - OK")
        continue
    if status not in ('pass', 'fail'):
        # Language was filtered out by --lang= or not processed
        if FILTER_LANGS and lang_code not in FILTER_LANGS:
            continue
        print(f"{lang_upper}: not checked")
        continue

    # Get violations for this locale from the shared violations list
    locale_violations = [v for v in violations if v['lang'] == lang_code]

    if not locale_violations:
        print(f"  OK  {lang_upper}: minden a savon belul")
        continue

    # Print each violation in human-readable format
    for v in locale_violations:
        if v['field'] == 'summary':
            label = f"{lang_upper}.hero(summary)"
        else:
            # field is "workplace:{id}" -> extract {id}
            wid = v['field'].split(':', 1)[1] if ':' in v['field'] else v['field']
            label = f"{lang_upper}.workplace[{wid}]"
        diff = v['diff']
        diff_str = f"{abs(diff)}ch-sel rövidebb" if diff < 0 else f"{abs(diff)}ch-sel hosszabb"
        print(f"  FAIL {label}: EN={v['budget']}ch -> {v['actual']}ch {v['status']} ({diff_str}, min {v['min']} max {v['max']})")

print()
if not has_violations:
    print("ALL OK")
else:
    print(f"FAIL: {len(violations)} elem a savon kivul")
    print()
    print("Javitas menete:")
    print("  TOO_SHORT: bovitsd a munkahely teljes szoveget (description+bullets)")
    print("  TOO_LONG:  tomoritsd a munkahely teljes szoveget")
    print("  LASD: .claude/rules/translation-length.md")

sys.exit(1 if has_violations else 0)
