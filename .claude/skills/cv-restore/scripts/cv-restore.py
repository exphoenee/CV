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

CV_DATA_PATH  = _project_path("scripts", "cv-data.js")
VERSIONS_DIR  = _project_path("cv-versions")

LOCALE_PATHS = {
    "hu":  _project_path("scripts", "locales", "hu.js"),
    "de":  _project_path("scripts", "locales", "de.js"),
    "fr":  _project_path("scripts", "locales", "fr.js"),
    "es":  _project_path("scripts", "locales", "es.js"),
    "it":  _project_path("scripts", "locales", "it.js"),
    "asg": _project_path("scripts", "locales", "asg.js"),
    "dot": _project_path("scripts", "locales", "dot.js"),
    "kl":  _project_path("scripts", "locales", "kl.js"),
    "qu":  _project_path("scripts", "locales", "qu.js"),
    "goa": _project_path("scripts", "locales", "goa.js"),
    "ya":  _project_path("scripts", "locales", "ya.js"),
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
def _serialize_content(value, indent=2):
    """Return a JS-compatible string for the `content:` field value."""
    if value is None:
        return "null"
    return json.dumps(value, ensure_ascii=False, indent=indent)


def replace_content_in_js(locale_js, new_value_str):
    """Replace the entire `content:` field value in a locale JS file.

    Uses brace-depth tracking to find the exact range of the current value.
    Returns the modified JS string.
    """
    m = re.search(r'(?<!\w)(content\s*:)', locale_js)
    if not m:
        return None  # content: field not found

    if new_value_str == "null":
        # Simple: replace `content: <value>` with `content: null,`
        # Find the comma after the value
        after = locale_js[m.end():]
        # Skip whitespace
        rest = after.lstrip()
        consumed = len(after) - len(rest)
        if rest.startswith("null"):
            val_end = m.end() + consumed + 4
            # Find the comma closing this field (must be within 3 chars of null)
            comma = locale_js.find(",", val_end)
            if comma >= 0 and comma - val_end <= 3:
                # Trailing comma found — replace and preserve rest
                return locale_js[:m.start()] + "content: null," + locale_js[comma + 1:]
            else:
                # No comma or comma too far — preserve everything after null
                return locale_js[:m.start()] + "content: null" + locale_js[val_end:]
        else:
            # Not null — fall through to depth-based approach below
            pass

    # Depth-based tracking to find the value span
    after = locale_js[m.end():]
    rest = after.lstrip()
    consumed = len(after) - len(rest)

    if not rest.startswith("{"):
        return None  # shouldn't happen

    depth = 0
    i = 0
    while i < len(rest):
        ch = rest[i]
        if ch in ('"', "'", '`'):
            # Skip string
            i += 1
            quote = ch
            while i < len(rest):
                if rest[i] == '\\':
                    i += 2
                    continue
                if rest[i] == quote:
                    break
                i += 1
        elif ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                val_end_idx = m.end() + consumed + i + 1
                # Find next comma to keep or remove
                comma_pos = locale_js.find(",", val_end_idx)
                if comma_pos > 0 and comma_pos - val_end_idx < 5:
                    # Remove the comma too
                    cls_brace = locale_js[val_end_idx:comma_pos].strip()
                    if cls_brace == "" or cls_brace == "}":
                        val_end_idx = comma_pos + 1
                # Build new content with proper indentation
                # Detect the indentation of the original content: line
                line_start = locale_js.rfind("\n", 0, m.start())
                if line_start < 0:
                    line_start = 0
                else:
                    line_start += 1
                line_indent = locale_js[line_start:m.start()]

                # Indent the serialized value by the same amount
                indented_lines = []
                for line_num, l in enumerate(new_value_str.split("\n")):
                    if line_num == 0:
                        indented_lines.append(l)
                    else:
                        indented_lines.append("  " + l)
                new_block = "content: " + "\n".join(indented_lines) + ","

                return locale_js[:m.start()] + line_indent + new_block + locale_js[val_end_idx:]
        i += 1

    # Fallback: couldn't find end — should not happen
    return None


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
    loc_back  = os.path.join(vf, "locale-content.json")

    if not os.path.isdir(vf):
        _out(f"{FAIL} Nem talalhato: {vf}/")
        sys.exit(1)
    if not os.path.exists(cv_back):
        _out(f"{FAIL} Nem talalhato: {cv_back}")
        sys.exit(1)
    if not os.path.exists(loc_back):
        _out(f"{FAIL} Nem talalhato: {loc_back}")
        sys.exit(1)

    # Preview
    meta = get_backup_meta(vf)
    _out(f"\nBackup adatai:\n")
    _out(f"   Pozicio: {meta['optimized_for']}")
    _out(f"   Datum:   {meta['date']}")
    _out(f"   ATS:     {meta['ats_match']}")
    _out(f"   Modositasok: {meta['changes']}\n")

    _out(f"   Visszaallitando fajlok:")
    _out(f"     scripts/cv-data.js          <- felulirja a jelenlegit")
    for lang in LOCALE_LANGS:
        _out(f"     scripts/locales/{lang}.js       <- content mezo frissul")

    _out(f"\n   {WARN} A jelenlegi scripts/cv-data.js tartalma elvész.")
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
        _out(f"   {OK} scripts/cv-data.js")

    # Read locale-content.json
    locale_json = json.loads(read_file(loc_back))

    # Restore each locale
    for lang, lpath in LOCALE_PATHS.items():
        new_val = locale_json.get(lang)
        js = read_file(lpath)
        if js is None:
            _out(f"   {FAIL} scripts/locales/{lang}.js -- nem talalhato")
            continue

        new_str = _serialize_content(new_val)
        result = replace_content_in_js(js, new_str)
        if result is None:
            _out(f"   {FAIL} scripts/locales/{lang}.js -- nem sikerult frissiteni")
            continue

        write_file(lpath, result)
        status = f"{OK}" if new_val else f"{OK} (null)"
        _out(f"   {status} scripts/locales/{lang}.js")

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
