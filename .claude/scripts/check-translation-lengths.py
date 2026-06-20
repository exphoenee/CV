#!/usr/bin/env python3
"""
check-translation-lengths.py
Compares translated content lengths against a PAGE-BASED budget.

Previously: per-workplace total validation.
Now:         per-logical-page group validation.

The budget is a FIXED value in .claude/reference/current-english-lengths.json.
It is NOT derived from cv-data.js. The tolerance band is also in that JSON.

Three page groups (defined by the budget JSON keys page1, page2, page3):

  Page 1: summary + workExperience[0] + workExperience[1]
  Page 2: workExperience[2] + workExperience[3] + workExperience[4]
  Page 3: workExperience[5] + education + languages + community + programmingLanguages + hobbyProjects

  education, programmingLanguages, and hobbyProjects are NOT in locale content —
  they come from cv-data.js (always English). The validator reads them from cv-data.js
  and adds their (same) length to every locale's Page 3 total.

Usage:
  python check-translation-lengths.py            # validate all locales (human-readable)
  python check-translation-lengths.py --print     # print the budget table and exit
  python check-translation-lengths.py --json      # validate, JSON output (machine-readable)
  python check-translation-lengths.py --json --lang=hu,de  # validate only specific locales

Exit code: 0 if all OK, 1 if any page is outside the tolerance band.

JSON output schema:

  {
    "summary": { "total": 11, "passed": 8, "failed": 3 },
    "violations": [
      {
        "lang": "hu",
        "langName": "Hungarian",
        "field": "page1",        // "page1", "page2", "page3"
        "fieldType": "page",     // always "page"
        "status": "TOO_SHORT",
        "actual": 2800,
        "budget": 3053,
        "diff": -253,
        "adjustBy": 12,          // chars to add (+) or remove (-) to reach nearest bound
        "min": 2687,
        "max": 3114
      }
    ],
    "locales_checked": ["hu", "de", ...],
    "locales_ok": [...],
    "locales_with_issues": ["hu", ...],
    "has_violations": true
  }
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
REFERENCE_FILE = ROOT / '.claude' / 'reference' / 'current-english-lengths.json'
CV_DATA_FILE = ROOT / 'cv' / 'cv-data.js'
LOCALES_DIR = ROOT / 'cv' / 'locales'

LANG_NAMES = {
    'hu': 'Hungarian', 'de': 'German', 'fr': 'French', 'es': 'Spanish',
    'it': 'Italian', 'asg': 'Asgardian', 'dot': 'Dothraki', 'kl': 'Klingon',
    'qu': 'Quenya', 'goa': "Goa'uld", 'ya': 'Yautja',
}

LOCALES = ['hu.js', 'de.js', 'fr.js', 'es.js', 'it.js',
           'asg.js', 'dot.js', 'kl.js', 'qu.js', 'goa.js', 'ya.js']

# ── Page group definitions (which components go into which page) ─────────
PAGE_GROUP = {
    'page1': ['summary', 'workplace:0', 'workplace:1'],
    'page2': ['workplace:2', 'workplace:3', 'workplace:4'],
    'page3': ['workplace:5', 'education', 'languages', 'community', 'programmingLanguages', 'hobbyProjects'],
}

# Non-localized fields — always read from cv-data.js (always English)
NON_LOCALIZED_FIELDS = {'education', 'programmingLanguages', 'hobbyProjects'}

# ── Helpers ──────────────────────────────────────────────────────────────


def load_reference():
    if not REFERENCE_FILE.exists():
        print(f"ERROR: {REFERENCE_FILE} not found")
        sys.exit(1)
    with open(REFERENCE_FILE, encoding='utf-8') as f:
        return json.load(f)


def get_tolerance(ref):
    tol = ref.get('_tolerance', {})
    return float(tol.get('min', 0.88)), float(tol.get('max', 1.02))


def extract_string_value(t, field):
    pat = re.compile(
        rf'{re.escape(field)}\s*:\s*'
        r"(?P<q>['\"])(?P<v>(?:(?!\1)(?:\\.|[^\\]))*)\1",
        re.DOTALL
    )
    m = pat.search(t)
    return m.group('v') if m else None


def sum_texts_in_array(t, arr_start):
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


def sum_name_strings_in_array(t, arr_start):
    """Sum only the 'name' field strings in an array of objects."""
    depth, end = 1, arr_start
    while depth > 0 and end < len(t):
        if t[end] == '[':
            depth += 1
        elif t[end] == ']':
            depth -= 1
        end += 1
    content = t[arr_start:end - 1]
    total = 0
    for m in re.finditer(r"name\s*:\s*(?P<q>['\"])(?P<v>(?:(?!\1)(?:\\.|[^\\]))*)\1", content):
        total += len(m.group('v'))
    return total


def get_workplace_total(chunk):
    """Total length of description + bullets + project bullets for a workplace entry."""
    total = 0
    d = extract_string_value(chunk, 'description')
    if d:
        total += len(d)
    bm = re.search(r'bullets\s*:\s*\[', chunk)
    if bm:
        total += sum_texts_in_array(chunk, bm.end())
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
    return total


# ── Cached CV data extraction (for non-localized fields) ────────────────

_CV_DATA_CACHE = None


def get_cv_data_text():
    """Read and cache cv-data.js. Returns extracted English content values."""
    global _CV_DATA_CACHE
    if _CV_DATA_CACHE is not None:
        return _CV_DATA_CACHE

    if not CV_DATA_FILE.exists():
        _CV_DATA_CACHE = {}
        return _CV_DATA_CACHE

    text = CV_DATA_FILE.read_text('utf-8')

    # Find main CV_DATA object
    cm = re.search(r'export const CV_DATA = \{', text)
    if not cm:
        _CV_DATA_CACHE = {}
        return _CV_DATA_CACHE

    cstart = cm.end()
    depth, cend = 1, cstart
    while depth > 0 and cend < len(text):
        if text[cend] == '{':
            depth += 1
        elif text[cend] == '}':
            depth -= 1
        cend += 1
    ct = text[cstart:cend - 1]

    result = {}

    # Summary
    s = extract_string_value(ct, 'summary')
    if s:
        result['summary'] = len(s)

    # Workplaces — per-workplace totals, indexed by position in array
    wp_index = 0
    for idm in re.finditer(r'id:\s*[\"\'](\w+)[\"\']', ct):
        wid = idm.group(1)
        pos = idm.start()
        bef = ct[max(0, pos - 200):pos]
        if 'projects' in bef and 'description' not in bef:
            continue
        chunk = ct[pos:pos + 3000]
        result[f'workplace:{wp_index}'] = get_workplace_total(chunk)
        wp_index += 1

    # Education: institution + degree titles
    edu_match = re.search(r'education\s*:\s*\{', ct)
    if edu_match:
        edu_start = edu_match.start()
        edu_depth, edu_end = 1, edu_start + 1
        while edu_depth > 0 and edu_end < len(ct):
            if ct[edu_end] == '{':
                edu_depth += 1
            elif ct[edu_end] == '}':
                edu_depth -= 1
            edu_end += 1
        edu_text = ct[edu_start:edu_end]

        inst = extract_string_value(edu_text, 'institution')
        inst_len = len(inst) if inst else 0

        deg_match = re.search(r'degrees\s*:\s*\[', edu_text)
        deg_total = 0
        if deg_match:
            deg_start = deg_match.end()
            deg_depth, deg_end2 = 1, deg_start
            while deg_depth > 0 and deg_end2 < len(edu_text):
                if edu_text[deg_end2] == '[':
                    deg_depth += 1
                elif edu_text[deg_end2] == ']':
                    deg_depth -= 1
                deg_end2 += 1
            deg_content = edu_text[deg_start:deg_end2 - 1]
            for dm in re.finditer(r"title\s*:\s*(?P<q>['\"])(?P<v>(?:(?!\1)(?:\\.|[^\\]))*)\1", deg_content):
                deg_total += len(dm.group('v'))

        result['education'] = inst_len + deg_total

    # Languages (name + level only) from identity.languages
    lang_entry = re.search(r'languages\s*:\s*\[', ct)
    if lang_entry:
        lang_start = lang_entry.end()
        ldepth, lend = 1, lang_start
        while ldepth > 0 and lend < len(ct):
            if ct[lend] == '[':
                ldepth += 1
            elif ct[lend] == ']':
                ldepth -= 1
            lend += 1
        lang_content = ct[lang_start:lend - 1]
        lang_total = 0
        for lm in re.finditer(r"(?:name|level)\s*:\s*(?P<q>['\"])(?P<v>(?:(?!\1)(?:\\.|[^\\]))*)\1", lang_content):
            lang_total += len(lm.group('v'))
        result['languages'] = lang_total

    # Community
    comm = extract_string_value(ct, 'community')
    if comm:
        result['community'] = len(comm)

    # programmingLanguages (name only)
    pl_entry = re.search(r'programmingLanguages\s*:\s*\[', ct)
    if pl_entry:
        result['programmingLanguages'] = sum_name_strings_in_array(ct, pl_entry.end())

    # hobbyProjects (name only)
    hp_entry = re.search(r'hobbyProjects\s*:\s*\[', ct)
    if hp_entry:
        result['hobbyProjects'] = sum_name_strings_in_array(ct, hp_entry.end())

    _CV_DATA_CACHE = result
    return result


# ── Locale extraction ───────────────────────────────────────────────────

def extract_locale_components(filepath, cv_en):
    """
    Extract all page-group components from a locale file.
    For localized fields: read from locale file.
    For non-localized fields (education, programmingLanguages, hobbyProjects):
    use the English cv-data.js values (same for all locales).

    Returns dict like:
      { 'summary': 637, 'workplace:0': 1781, ..., 'education': 214, 'languages': 74, ... }
    or None if content: null.
    """
    if not filepath.exists():
        return None

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

    # Workplaces — indexed by position
    wp_index = 0
    for idm in re.finditer(r'id:\s*[\"\'](\w+)[\"\']', ct):
        wid = idm.group(1)
        pos = idm.start()
        bef = ct[max(0, pos - 200):pos]
        if 'projects' in bef and 'description' not in bef:
            continue
        chunk = ct[pos:pos + 3000]
        data[f'workplace:{wp_index}'] = get_workplace_total(chunk)
        wp_index += 1

    # Community
    comm = extract_string_value(ct, 'community')
    if comm:
        data['community'] = len(comm)

    # Languages (name + level) from identity.languages
    lang_entry = re.search(r'identity\s*:\s*\{', ct)
    if lang_entry:
        ident_chunk = ct[lang_entry.start():lang_entry.start() + 2000]
        llang_entry = re.search(r'languages\s*:\s*\[', ident_chunk)
        if llang_entry:
            lang_start = llang_entry.end() + (lang_entry.start() - lang_entry.start())  # relative offset
            # Simple approach: search in ident_chunk directly
            lang_start_rel = llang_entry.end()
            ldepth, lend = 1, lang_start_rel
            while ldepth > 0 and lend < len(ident_chunk):
                if ident_chunk[lend] == '[':
                    ldepth += 1
                elif ident_chunk[lend] == ']':
                    ldepth -= 1
                lend += 1
            lang_content = ident_chunk[lang_start_rel:lend - 1]
            lang_total = 0
            for lm in re.finditer(r"(?:name|level)\s*:\s*(?P<q>['\"])(?P<v>(?:(?!\1)(?:\\.|[^\\]))*)\1", lang_content):
                lang_total += len(lm.group('v'))
            if lang_total > 0:
                data['languages'] = lang_total

    # Non-localized fields: always from English cv-data
    for nlf in NON_LOCALIZED_FIELDS:
        if nlf in cv_en:
            data[nlf] = cv_en[nlf]

    return data


# ── Validation ──────────────────────────────────────────────────────────

def compute_page_totals(components, cv_en):
    """Compute page1, page2, page3 from extracted components + English fallback."""
    totals = {}
    for page_key, fields in PAGE_GROUP.items():
        total = 0
        for f in fields:
            # Try locale component first, then English cv-data
            val = components.get(f)
            if val is None:
                val = cv_en.get(f, 0)
            total += val
        totals[page_key] = total
    return totals


def validate_locale(lf_path, lang, cv_en, budgets, tolerance_min, tolerance_max, violations, results):
    """Validate a single locale file. Appends violations to the violations list."""
    components = extract_locale_components(lf_path, cv_en)

    if components is None:
        results[lang] = {'status': 'skipped', 'reason': 'content: null'}
        return

    page_totals = compute_page_totals(components, cv_en)

    loc_violations = []

    for page_key, budget in budgets.items():
        if page_key.startswith('_'):
            continue
        total = page_totals.get(page_key, 0)
        bn, mx = int(budget * tolerance_min), int(budget * tolerance_max)
        if total < bn:
            loc_violations.append({
                'lang': lang, 'langName': LANG_NAMES.get(lang, lang),
                'field': page_key, 'fieldType': 'page',
                'status': 'TOO_SHORT', 'actual': total,
                'budget': budget, 'diff': total - budget, 'adjustBy': bn - total,
                'min': bn, 'max': mx,
            })
        elif total > mx:
            loc_violations.append({
                'lang': lang, 'langName': LANG_NAMES.get(lang, lang),
                'field': page_key, 'fieldType': 'page',
                'status': 'TOO_LONG', 'actual': total,
                'budget': budget, 'diff': total - budget, 'adjustBy': mx - total,
                'min': bn, 'max': mx,
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


# ── CLI argument parsing ────────────────────────────────────────────────
USE_JSON = '--json' in sys.argv
PRINT_TABLE = '--print' in sys.argv
FILTER_LANGS = None

for arg in sys.argv:
    if arg.startswith('--lang='):
        FILTER_LANGS = [l.strip() for l in arg.split('=', 1)[1].split(',') if l.strip()]
        break

# ── Load reference and CV data ─────────────────────────────────────────
ref = load_reference()
TOLERANCE_MIN, TOLERANCE_MAX = get_tolerance(ref)

# Budget: only page1, page2, page3 (skip _prefixed keys)
budgets = {k: v for k, v in ref.items() if not k.startswith('_')}

# Load English cv-data for non-localized field fallback
cv_en = get_cv_data_text()

# ── --print mode ────────────────────────────────────────────────────────
if PRINT_TABLE:
    print("=== Forditasi hossz-budget (OLDALCSOPORT, FIX) ===")
    print(f"Forras: {REFERENCE_FILE.relative_to(ROOT)}")
    print(f"Angol forras: {CV_DATA_FILE.relative_to(ROOT)}")
    print(f"Turesi sav: -{(1 - TOLERANCE_MIN) * 100:.0f}% / +{(TOLERANCE_MAX - 1) * 100:.0f}%")
    print()
    print(f"{'Oldal':<16}{'Budget':>8}{'min':>8}{'max':>8}{'  Oesszetevok':<30}")
    print("-" * 62)
    for k, v in sorted(budgets.items()):
        comps = ', '.join(PAGE_GROUP.get(k, []))
        print(f"{k:<16}{v:>8}{int(v * TOLERANCE_MIN):>8}{int(v * TOLERANCE_MAX):>8}  {comps}")
    print()
    print("Alkatreszek (angol):")
    for fname, flen in sorted(cv_en.items()):
        group = ''
        for pk, fields in PAGE_GROUP.items():
            if fname in fields:
                group = f'  [{pk}]'
                break
        # Map workplace:X to readable workExperience[N]
        display_name = fname
        if fname.startswith('workplace:'):
            idx = fname.split(':')[1]
            display_name = f'workExperience[{idx}]'
        print(f"  {display_name:<25}{flen:>6} chars{group}")
    sys.exit(0)

# ── Validate ────────────────────────────────────────────────────────────
violations = []
results = {}
has_violations = False

for lf_name in LOCALES:
    lang = lf_name.replace('.js', '')

    if FILTER_LANGS and lang not in FILTER_LANGS:
        continue

    fp = ROOT / 'cv' / 'locales' / lf_name
    if not fp.exists():
        results[lang] = {'status': 'error', 'reason': 'file not found'}
        continue

    validate_locale(fp, lang, cv_en, budgets, TOLERANCE_MIN, TOLERANCE_MAX, violations, results)

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
print("=== Forditasi hossz-ellenorzes (OLDALCSOPORT, FIX budget) ===")
print(f"Referencia (fix budget): {REFERENCE_FILE.name}")
print(f"Szabaly: BUDGET * {TOLERANCE_MIN:.2f} <= oldal-osszes <= BUDGET * {TOLERANCE_MAX:.2f}")
print()
print("Ellenorzott elemek:")
print("  1. oldal: summary + workExperience[0] + workExperience[1]")
print("  2. oldal: workExperience[2] + workExperience[3] + workExperience[4]")
print("  3. oldal: workExperience[5] + education + languages + community + proglang + hobby")
print("  (education, programmingLanguages, hobbyProjects az angol cv-data.js-bol)")
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
        if FILTER_LANGS and lang_code not in FILTER_LANGS:
            continue
        print(f"{lang_upper}: not checked")
        continue

    locale_violations = [v for v in violations if v['lang'] == lang_code]

    if not locale_violations:
        print(f"  OK  {lang_upper}: minden oldal a savon belul")
        continue

    for v in locale_violations:
        diff = v['diff']
        diff_str = f"{abs(diff)}ch-sel rovidebb" if diff < 0 else f"{abs(diff)}ch-sel hosszabb"
        print(f"  FAIL {lang_upper}.{v['field']}: EN={v['budget']}ch -> {v['actual']}ch {v['status']} ({diff_str}, min {v['min']} max {v['max']})")

print()
if not has_violations:
    print("ALL OK")
else:
    print(f"FAIL: {len(violations)} oldalcsoport a savon kivul")
    print()
    print("Javitas menete:")
    print("  TOO_SHORT: bovitsd az oldalcsoport teljes szoveget (osszetevok aranyos novelese)")
    print("  TOO_LONG:  tomoritsd az oldalcsoport teljes szoveget")
    print("  LASD: .claude/rules/translation-length.md")

sys.exit(1 if has_violations else 0)
