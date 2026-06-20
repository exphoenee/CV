#!/usr/bin/env python3
"""
locale-check.py  —  Locale Completeness Audit

Compares all 12 locale page files in cv/locales/ against en-page.js
as the source of truth. Reports any missing `labels` keys per file.

Usage:
    python .claude/skills/locale-check/scripts/locale-check.py                        # check only
    python .claude/skills/locale-check/scripts/locale-check.py --fix                  # reserved (AI agent still needed)
    python .claude/skills/locale-check/scripts/locale-check.py --json                 # JSON output for tools

Exit codes:
    0  — all keys present in all files
    1  — missing keys found
"""

import json
import os
import re
import sys

# ── Encoding-safe output (Windows cp1250-safe) ────────────────────────
_ENCODING = os.environ.get("PYTHONIOENCODING", sys.stdout.encoding or "utf-8")

def _out(text):
    try:
        print(text)
    except UnicodeEncodeError:
        safe = text.encode(_ENCODING, errors="replace").decode(_ENCODING, errors="replace")
        print(safe)

OK    = "[OK]"
WARN  = "[!]"
FAIL  = "[x]"

# ── Paths ──────────────────────────────────────────────────────────────
_SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__)) if "__file__" in dir() else os.getcwd()
# Script is at .claude/skills/locale-check/scripts/ — go up 4 levels to project root
_PROJECT_ROOT = os.path.abspath(os.path.join(_SCRIPT_DIR, *([".."] * 4)))

LOCALES_DIR = os.path.join(_PROJECT_ROOT, "cv", "locales")
EN_FILE = "en-page.js"
PAGE_FILES = [
    "hu-page.js", "de-page.js", "fr-page.js", "es-page.js", "it-page.js",
    "asg-page.js", "dot-page.js", "kl-page.js", "qu-page.js", "goa-page.js",
    "ya-page.js",
]
LANG_NAMES = {
    "hu": "Magyar", "de": "Deutsch", "fr": "Francais", "es": "Espanol",
    "it": "Italiano", "asg": "Asgardian", "dot": "Dothraki", "kl": "Klingon",
    "qu": "Quenya", "goa": "Goa'uld", "ya": "Yautja",
}


def extract_labels_keys(filepath):
    """Extract all keys from the `labels: { ... }` object in a JS locale file."""
    if not os.path.exists(filepath):
        return None

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    keys = []
    in_labels = False
    brace_depth = 0
    labels_started = False

    for line in content.split("\n"):
        stripped = line.strip()

        if re.match(r'^\s*labels\s*:', stripped):
            in_labels = True
            if "{" in stripped:
                brace_depth = stripped.count("{") - stripped.count("}")
                labels_started = True
            continue

        if in_labels:
            brace_depth += stripped.count("{") - stripped.count("}")

            if not labels_started and "{" in stripped:
                labels_started = True
            if not labels_started:
                continue

            # Match top-level key: "value" pairs
            m = re.match(r'^\s*([\w]+)\s*:', stripped)
            if m and brace_depth >= 0:
                key = m.group(1)
                if key not in ("labels", "content") and not stripped.startswith("//"):
                    keys.append(key)

            # End of labels object — closing brace at depth 0
            if stripped in ("},", "}", "};") and brace_depth <= 0 and labels_started:
                break
            if brace_depth < 0:
                break

    return keys


def get_lang_code(filename):
    m = re.match(r'^([a-z]+)-page\.js$', filename)
    return m.group(1) if m else None


def main():
    show_json = "--json" in sys.argv

    en_path = os.path.join(LOCALES_DIR, EN_FILE)
    en_keys = extract_labels_keys(en_path)

    if en_keys is None:
        msg = f"{FAIL} ERROR: {EN_FILE} not found in {LOCALES_DIR}/"
        if show_json:
            print(json.dumps({"error": msg}))
        else:
            _out(msg)
        sys.exit(1)

    results = {}
    all_ok = True

    for page_file in PAGE_FILES:
        lang = get_lang_code(page_file)
        if not lang:
            continue

        filepath = os.path.join(LOCALES_DIR, page_file)
        lang_keys = extract_labels_keys(filepath)

        if lang_keys is None:
            results[lang] = {"status": "error", "message": "file not found", "missing": []}
            all_ok = False
            continue

        missing = [k for k in en_keys if k not in set(lang_keys)]
        if missing:
            all_ok = False
            results[lang] = {"status": "missing", "count": len(missing), "missing": missing}
        else:
            results[lang] = {"status": "ok", "count": 0, "missing": []}

    # ── Output ──────────────────────────────────────────────────────────
    if show_json:
        output = {
            "reference": EN_FILE,
            "reference_key_count": len(en_keys),
            "total_files_checked": len(PAGE_FILES),
            "results": results,
            "all_ok": all_ok,
        }
        print(json.dumps(output, ensure_ascii=False, indent=2))
    else:
        summary_missing = sum(1 for r in results.values() if r["status"] == "missing")
        total_missing = sum(r["count"] for r in results.values())

        if all_ok:
            _out(f"{OK} Locale ellenorzes kesz -- minden kulcs megvan mind a 12 fajlban.")
            _out(f"   Ellenorzott kulcsok: {len(en_keys)}")
        else:
            _out(f"{WARN} Hianyzo locale kulcsok:\n")
            for lang, data in results.items():
                name = LANG_NAMES.get(lang, lang)
                if data["status"] == "ok":
                    _out(f"   {lang} ({name}) -- rendben {OK}")
                elif data["status"] == "error":
                    _out(f"   {lang} ({name}) -- {FAIL} {data['message']}")
                else:
                    _out(f"   {lang} ({name}) -- {data['count']} hianyzo:")
                    for key in data["missing"]:
                        _out(f'     * "{key}"')
                    _out("")

            _out(f"   Osszesen: {total_missing} hianyzo kulcs, {summary_missing} fajlban erintett.")
            _out("\n   Javitas: hasznald az /locale-check --fix skill-t az AI assistantban.")

        sym = OK if all_ok else WARN
        _out(f"\n{sym} STATUS: {'OK' if all_ok else f'{total_missing} key(s) missing in {summary_missing} file(s)'}")

    sys.exit(0 if all_ok else 1)


if __name__ == "__main__":
    main()
