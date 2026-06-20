#!/usr/bin/env python3
"""
cv-restore.py  —  CV Snapshot Restore

Restores cv-data.js and all 11 locale content fields from a cv-versions/ backup.
Shows preview before applying; requires user confirmation.

Usage:
    python .claude/skills/cv-restore/scripts/cv-restore.py <folder-name>
    python .claude/skills/cv-restore/scripts/cv-restore.py 2026-06-13_manual
    python .claude/skills/cv-restore/scripts/cv-restore.py --list              # list available backups
    python .claude/skills/cv-restore/scripts/cv-restore.py <folder> --yes      # skip confirmation

Exit codes:
    0  — restore completed
    1  — cancelled or error
"""

import json
import os
import re
import shutil
import subprocess
import sys

# ── Encoding-safe output ───────────────────────────────────────────────
_ENCODING = os.environ.get("PYTHONIOENCODING", sys.stdout.encoding or "utf-8")

def _out(text):
    try:
        print(text)
    except UnicodeEncodeError:
        safe = text.encode(_ENCODING, errors="replace").decode(_ENCODING, errors="replace")
        print(safe)

OK   = "[OK]"
WARN = "[!]"
FAIL = "[x]"

# ── Paths ──────────────────────────────────────────────────────────────
_SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__)) if "__file__" in dir() else os.getcwd()
# Script is at .claude/skills/cv-restore/scripts/ — go up 4 levels to project root
_PROJECT_ROOT = os.path.abspath(os.path.join(_SCRIPT_DIR, *([".."] * 4)))

def _project_path(*parts):
    return os.path.join(_PROJECT_ROOT, *parts)

CV_DATA_PATH  = _project_path("cv", "cv-data.js")
VERSIONS_DIR  = _project_path("cv-versions")

LOCALE_PATHS = {
    "hu":  _project_path("cv", "locales", "hu.js"),
    "de":  _project_path("cv", "locales", "de.js"),
    "fr":  _project_path("cv", "locales", "fr.js"),
    "es":  _project_path("cv", "locales", "es.js"),
    "it":  _project_path("cv", "locales", "it.js"),
    "asg": _project_path("cv", "locales", "asg.js"),
    "dot": _project_path("cv", "locales", "dot.js"),
    "kl":  _project_path("cv", "locales", "kl.js"),
    "qu":  _project_path("cv", "locales", "qu.js"),
    "goa": _project_path("cv", "locales", "goa.js"),
    "ya":  _project_path("cv", "locales", "ya.js"),
}
LOCALE_LANGS = sorted(LOCALE_PATHS.keys())


CV_BACKUP_SCRIPT = _project_path(".claude", "skills", "cv-backup", "scripts", "cv-backup.py")
CV_LEDGER_SCRIPT = _project_path(".claude", "scripts", "cv-ledger.py")


def _run_script(script_path, extra_args):
    """Run a sibling project python script. Returns (exit_code, combined_output)."""
    try:
        proc = subprocess.run(
            [sys.executable, script_path] + extra_args,
            capture_output=True, text=True, encoding="utf-8", errors="replace",
        )
        return proc.returncode, (proc.stdout or "") + (proc.stderr or "")
    except Exception as exc:  # noqa: BLE001
        return 1, str(exc)


def read_file(path):
    if not os.path.exists(path):
        return None
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


# ── Restore cv-data.js ─────────────────────────────────────────────────
def strip_header_comment(js):
    """Remove the /* ... */ header block from a snapshot cv-data.js."""
    m = re.match(r'^\s*/\*\*.*?\*/\s*\n?', js, re.DOTALL)
    return js[m.end():] if m else js


def restore_cv_data(backup_path, target_path):
    content = read_file(backup_path)
    if content is None:
        return False
    stripped = strip_header_comment(content)
    write_file(target_path, stripped)
    return True


# ── Restore locale content ─────────────────────────────────────────────
def restore_locales(backup_locales_dir, target_dir):
    """Copy all locale files from the backup's locales/ directory back to
    cv/locales/. This is a simple file copy — no parsing, no serialization,
    no JSON conversion. The files are restored exactly as they were backed up.
    """
    if not os.path.isdir(backup_locales_dir):
        return False
    shutil.copytree(backup_locales_dir, target_dir, dirs_exist_ok=True)
    return True


# ── Old-format restore (locale-content.json) — backward compat ─────────
def _js_parse_value(val):
    """Simple recursive converter from JSON-deserialized Python value to
    JS source code with single-quoted strings. Only used for backward
    compatibility with old backup folders that have locale-content.json
    instead of locales/ directory.
    """
    if val is None:
        return 'null'
    if isinstance(val, bool):
        return 'true' if val else 'false'
    if isinstance(val, (int, float)):
        return str(val)
    if isinstance(val, str):
        escaped = val.replace('\\', '\\\\').replace("'", "\\'")
        escaped = escaped.replace('\n', '\\n').replace('\r', '\\r').replace('\t', '\\t')
        return f"'{escaped}'"
    if isinstance(val, (list, tuple)):
        if not val:
            return '[]'
        items = ', '.join(_js_parse_value(v) for v in val)
        return f'[{items}]'
    if isinstance(val, dict):
        if not val:
            return '{}'
        entries = ', '.join(
            f"{k}: {_js_parse_value(v)}" if isinstance(k, str) and k.isidentifier()
            else f"'{k}': {_js_parse_value(v)}"
            for k, v in val.items()
        )
        return f'{{{entries}}}'
    return str(val)


def rebuild_locale_from_json(locale_js, new_value, lang_code):
    """Rebuild a locale JS file using content from locale-content.json.
    Preserves marker lines. Only used for backward compatibility.
    """
    marker_lines = []
    for line in locale_js.split('\n'):
        stripped = line.strip()
        if stripped.startswith('// @job-application:') or stripped.startswith('// @cv-last-change:'):
            marker_lines.append(line.rstrip())
        else:
            break
    lang_upper = 'EN' if lang_code == 'en' else lang_code.upper()
    content_js = 'null' if new_value is None else _js_parse_value(new_value)
    new_js_lines = list(marker_lines)
    new_js_lines.append(f'export const {lang_upper} = {{\n  content: {content_js},\n}};\n')
    return '\n'.join(new_js_lines)


def restore_locales_old_format(json_path, target_dir):
    """Restore locale content from old-format locale-content.json.
    Handles the 11 language content fields individually.
    """
    data = json.loads(read_file(json_path))
    count = 0
    for lang, path in LOCALE_PATHS.items():
        new_val = data.get(lang)
        js = read_file(path)
        if js is None:
            continue
        result = rebuild_locale_from_json(js, new_val, lang)
        if result is None:
            continue
        write_file(path, result)
        count += 1
    return count


# ── List & metadata ────────────────────────────────────────────────────
def get_backup_meta(version_folder):
    info = {"optimized_for": "--", "date": "--", "ats_match": "--", "changes": "--"}
    cv_path = os.path.join(version_folder, "cv-data.js")
    c = read_file(cv_path)
    if c:
        for line in c.split("\n")[:20]:
            s = line.strip()
            if s.startswith("* Optimized for:"):
                info["optimized_for"] = s.split("* Optimized for:")[1].strip()
            elif s.startswith("* Date:") and "ATS" not in s:
                info["date"] = s.split("* Date:")[1].strip()
            elif s.startswith("* ATS match:"):
                info["ats_match"] = s.split("* ATS match:")[1].strip()
            elif s.startswith("* Changes:") and "=" not in s:
                info["changes"] = s.split("* Changes:")[1].strip()
    return info


def list_backups():
    if not os.path.isdir(VERSIONS_DIR):
        _out(f"{FAIL} A cv-versions/ mappa nem talalhato.")
        sys.exit(1)
    dirs = sorted([d for d in os.listdir(VERSIONS_DIR)
                   if os.path.isdir(os.path.join(VERSIONS_DIR, d))], reverse=True)
    if not dirs:
        _out(f"{FAIL} Nincsenek backupok a cv-versions/ mappaban.")
        sys.exit(1)

    _out(f"Elerheto backupok:\n")
    for d in dirs:
        meta = get_backup_meta(os.path.join(VERSIONS_DIR, d))
        _out(f"   {d}/")
        _out(f"      Pozicio: {meta['optimized_for']}")
        _out(f"      Datum:   {meta['date']}")
        _out(f"      ATS:     {meta['ats_match']}")
        _out(f"      Modositasok: {meta['changes']}")
        _out("")
    _out(f"Hasznalat: python .claude/skills/cv-restore/scripts/cv-restore.py <mappa-neve>")


# ── Main ───────────────────────────────────────────────────────────────
def main():
    import argparse
    parser = argparse.ArgumentParser(description="Restore CV from backup")
    parser.add_argument("folder", nargs="?", help="Backup folder name")
    parser.add_argument("--list", action="store_true", help="List available backups")
    parser.add_argument("--yes", action="store_true", help="Skip confirmation")
    parser.add_argument("--no-backup", action="store_true",
                        help="Skip the automatic pre-restore safety backup")
    args = parser.parse_args()

    if args.list:
        list_backups()
        return

    if not args.folder:
        list_backups()
        return

    # Normalise folder path
    folder = args.folder.strip().strip("/\\")
    folder = re.sub(r'^cv-versions[\\/]', '', folder)
    vf = os.path.join(VERSIONS_DIR, folder)

    # Validate
    cv_back   = os.path.join(vf, "cv-data.js")
    loc_dir   = os.path.join(vf, "locales")
    loc_json  = os.path.join(vf, "locale-content.json")

    if not os.path.isdir(vf):
        _out(f"{FAIL} Nem talalhato: {vf}/")
        sys.exit(1)
    if not os.path.exists(cv_back):
        _out(f"{FAIL} Nem talalhato: {cv_back}")
        sys.exit(1)

    # Support both old format (locale-content.json) and new format (locales/ directory)
    old_format = os.path.exists(loc_json) and not os.path.isdir(loc_dir)
    new_format = os.path.isdir(loc_dir)
    if not old_format and not new_format:
        _out(f"{FAIL} Nem talalhato: {vf}/locales/ vagy {vf}/locale-content.json")
        _out(f"       A backup mappaban nincs locale adat.")
        sys.exit(1)

    # Preview
    meta = get_backup_meta(vf)
    _out(f"\nBackup adatai:\n")
    _out(f"   Pozicio: {meta['optimized_for']}")
    _out(f"   Datum:   {meta['date']}")
    _out(f"   ATS:     {meta['ats_match']}")
    _out(f"   Modositasok: {meta['changes']}\n")

    _out(f"   Visszaallitando fajlok:")
    _out(f"     cv/cv-data.js          <- felulirja a jelenlegit")
    for lang in LOCALE_LANGS:
        _out(f"     cv/locales/{lang}.js       <- content mezo frissul")

    _out(f"\n   {WARN} A jelenlegi cv/cv-data.js tartalma elvész.")
    _out(f"       Javasolt: elozoleg python .claude/skills/cv-backup/scripts/cv-backup.py --label pre-restore\n")

    if not args.yes:
        confirm = input("   Folytatod? (y / n): ").strip().lower()
        if confirm != "y":
            _out(f"\n{FAIL} Visszaallitas megszakitva.")
            sys.exit(1)

    # ── Automatic safety backup of the CURRENT state before overwriting ──
    if not args.no_backup:
        _out(f"\n   Biztonsagi mentes a jelenlegi allapotrol (pre-restore)...")
        rc, out = _run_script(CV_BACKUP_SCRIPT, ["--label", "pre-restore", "--yes"])
        if rc != 0:
            _out(f"   {FAIL} A pre-restore backup nem sikerult — megszakitom a visszaallitast.")
            _out(out.strip())
            sys.exit(1)
        _out(f"   {OK} pre-restore backup kesz")

    # Restore cv-data.js
    _out(f"\n   Visszaallitas folyamatban...")
    if restore_cv_data(cv_back, CV_DATA_PATH):
        _out(f"   {OK} cv/cv-data.js")

    # Restore locale files — new format (locales/ directory) or old format (locale-content.json)
    locales_target = _project_path("cv", "locales")
    if new_format:
        if restore_locales(loc_dir, locales_target):
            count = len([f for f in os.listdir(loc_dir) if f.endswith('.js')])
            _out(f"   {OK} cv/locales/  ({count} locale files restored)")
    else:
        count = restore_locales_old_format(loc_json, locales_target)
        _out(f"   {WARN} Regi formatumu backup (locale-content.json) — {count} locale frissitve")
        _out(f"       Ajanlott: keszits uj backupot a /cv-backup paranccsal,")
        _out(f"       hogy a locales/ konyvtar is elmentodjon.")
    # ── Traceability: stamp the live-file marker to the restored version + log ──
    def _clean(val):
        val = (val or "").strip()
        return "—" if val in ("", "--") else val

    opt = meta.get("optimized_for", "--")
    r_title_raw, _sep, r_company_raw = opt.partition(" @ ")
    r_title = _clean(r_title_raw)
    r_company = _clean(r_company_raw)

    # Use --opt=value form so values starting with "-" (or the "--" placeholder)
    # are never mistaken for argparse option terminators.
    rc, out = _run_script(CV_LEDGER_SCRIPT, [
        "mark", "--set-application", f"--app-id={folder}",
        f"--title={r_title}", f"--company={r_company}",
        "--operation=cv-restore", "--actor=cv-restore",
    ])
    if rc != 0:
        _out(f"   {WARN} Marker frissites sikertelen (a visszaallitas megtortent):")
        _out(out.strip())
    else:
        _out(f"   {OK} marker frissitve a visszaallitott verziora")

    _run_script(CV_LEDGER_SCRIPT, [
        "log", "--category=mutation", "--operation=cv-restore",
        "--actor=cv-restore", f"--app-id={folder}",
        f"--what=restored from {folder}", f"--artifact=cv-versions/{folder}/",
    ])

    _out(f"\n{OK} Visszaallitas kesz")
    _out(f"\n   Forras: cv-versions/{folder}/")
    _out(f"\n   Ellenorizd a valtozasokat git diff-fel, majd inditsd el a szervert.")


if __name__ == "__main__":
    main()
