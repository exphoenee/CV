#!/usr/bin/env python3
"""
cv-backup.py  —  CV Snapshot Backup

Creates a versioned snapshot of cv/cv-data.js and all 11 locale
content fields into cv-versions/. Supports manual and job-apply modes.

Usage:
    python .claude/skills/cv-backup/scripts/cv-backup.py                           # manual, no label
    python .claude/skills/cv-backup/scripts/cv-backup.py --label pre-refactor      # manual, custom label
    python .claude/skills/cv-backup/scripts/cv-backup.py --company "Acme Corp" --title "FE"  # job-apply

Options:
    --label LABEL          Manual mode label
    --company NAME         Company (job-apply mode)
    --title TITLE          Job title (job-apply mode)
    --score N              ATS match score %
    --required-score N     Required match %
    --preferred-score N    Preferred match %
    --changes TEXT         Change summary
    --seniority TEXT       Seniority level
    --domain TEXT          Industry / domain
    --hr-review PATH       Path to hr-review report
    --yes                  Skip version-conflict confirmation

Exit codes:
    0  — backup created
    1  — cancelled or error
"""

import os
import re
import shutil
import subprocess
import sys
from datetime import datetime

# ── Encoding-safe output (Windows cp1250) ─────────────────────────────
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
# Script is at .claude/skills/cv-backup/scripts/ — go up 4 levels to project root
_PROJECT_ROOT = os.path.abspath(os.path.join(_SCRIPT_DIR, *([".."] * 4)))

def _project_path(*parts):
    return os.path.join(_PROJECT_ROOT, *parts)

CV_DATA_PATH    = _project_path("cv", "cv-data.js")
VERSIONS_DIR    = _project_path("cv-versions")
CV_LEDGER_SCRIPT = _project_path(".claude", "scripts", "cv-ledger.py")

LOCALE_FILES = {
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
LOCALE_LANGS = sorted(LOCALE_FILES.keys())


def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-')


def read_file(path):
    if not os.path.exists(path):
        return None
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    # Normalize to CRLF — the repo's line-ending convention. See .claude/rules/line-endings.md
    content = content.replace("\r\n", "\n").replace("\r", "").replace("\n", "\r\n")
    with open(path, "w", encoding="utf-8", newline="") as f:
        f.write(content)


def _normalize_dir_crlf(directory):
    """Rewrite every .js file in `directory` with CRLF endings (repo convention)."""
    for name in os.listdir(directory):
        p = os.path.join(directory, name)
        if not (os.path.isfile(p) and name.endswith(".js")):
            continue
        with open(p, "rb") as f:
            data = f.read()
        norm = data.replace(b"\r\n", b"\n").replace(b"\r", b"").replace(b"\n", b"\r\n")
        if norm != data:
            with open(p, "wb") as f:
                f.write(norm)


# ── Header generation ─────────────────────────────────────────────────
def generate_header(jd_title, jd_company, seniority, domain,
                    date_str, time_str,
                    overall_score, required_score, preferred_score,
                    hr_review_file, change_summary):
    score_line = f"{overall_score}% ({required_score}% required . {preferred_score}% preferred)"
    hr_line = hr_review_file if hr_review_file else "--"
    return (
        f"/**\n"
        f" * CV Data -- Job Application Version\n"
        f" * ============================================================\n"
        f" * Optimized for: {jd_title} @ {jd_company}\n"
        f" * Seniority:     {seniority}\n"
        f" * Domain:        {domain}\n"
        f" * Date:          {date_str} {time_str}\n"
        f" * ATS match:     {score_line}\n"
        f" * HR Review:     {hr_line}\n"
        f" * Changes:       {change_summary}\n"
        f" * Locale:        locales/ directory -- full locale files included\n"
        f" * ============================================================\n"
        f" * Point-in-time snapshot. Do not import directly.\n"
        f" */\n"
    )


# ── Version conflict resolution ───────────────────────────────────────
def get_existing_versions(base_name):
    if not os.path.isdir(VERSIONS_DIR):
        return []
    matches = []
    for entry in os.listdir(VERSIONS_DIR):
        ep = os.path.join(VERSIONS_DIR, entry)
        if os.path.isdir(ep) and entry.startswith(base_name):
            matches.append(ep)
    return sorted(matches, reverse=True)


def resolve_version_conflict(base_name, skip_confirm=False):
    existing = get_existing_versions(base_name)
    if not existing:
        return os.path.join(VERSIONS_DIR, base_name), "ok"

    if skip_confirm:
        suffixes = []
        for v in existing:
            m = re.search(r'-v(\d+)$', os.path.basename(v))
            if m:
                suffixes.append(int(m.group(1)))
        nv = max(suffixes) + 1 if suffixes else 2
        return os.path.join(VERSIONS_DIR, f"{base_name}-v{nv}"), "ok"

    _out(f"\n{WARN} Meglevo verziok '{base_name}'-hoz:")
    for i, v in enumerate(existing, 1):
        name = os.path.basename(v)
        meta_path = os.path.join(v, "cv-data.js")
        meta_info = ""
        if os.path.exists(meta_path):
            for line in read_file(meta_path).split("\n")[:15]:
                if "Optimized for:" in line:
                    meta_info = line.split("Optimized for:")[1].strip()
                    break
        _out(f"   {i}. {name}/  ({meta_info})")

    _out("\n   Mit szeretnel tenni?")
    _out(f"     [a] Uj verziot hoz letre (cv-versions/{base_name}-vN/)  <- ajanlott")
    _out(f"     [b] A legutobbi verziot felulirja")
    _out(f"     [n] Leall")

    choice = input("   Valasztas (a/b/n): ").strip().lower()
    if choice == "n":
        return None, "cancelled"
    if choice == "b":
        return existing[0], "ok"

    suffixes = []
    for v in sorted(existing):
        m = re.search(r'-v(\d+)$', os.path.basename(v))
        if m:
            suffixes.append(int(m.group(1)))
    nv = max(suffixes) + 1 if suffixes else 2
    return os.path.join(VERSIONS_DIR, f"{base_name}-v{nv}"), "ok"


# ── Main ───────────────────────────────────────────────────────────────
def main():
    import argparse
    parser = argparse.ArgumentParser(description="Create a versioned CV snapshot")
    parser.add_argument("--label", default="")
    parser.add_argument("--company", default="")
    parser.add_argument("--title", default="")
    parser.add_argument("--score", default="")
    parser.add_argument("--required-score", default="")
    parser.add_argument("--preferred-score", default="")
    parser.add_argument("--changes", default="Manual snapshot")
    parser.add_argument("--seniority", default="")
    parser.add_argument("--domain", default="")
    parser.add_argument("--hr-review", default="")
    parser.add_argument("--yes", action="store_true")
    args = parser.parse_args()

    now = datetime.now()
    date_str = now.strftime("%Y-%m-%d")
    time_str = now.strftime("%H%M")

    is_job = bool(args.company) or bool(args.title)

    time_slug = time_str  # HHMM — always included in folder name for uniqueness

    if is_job:
        cs = slugify(args.company) if args.company else "unknown"
        ts = slugify(args.title) if args.title else "position"
        base = f"{date_str}_{time_slug}_{cs}_{ts}"
        if args.label:
            base += f"_{slugify(args.label)}"
        jd_title   = args.title or "Unknown Position"
        jd_company = args.company or "--"
        seniority  = args.seniority or ""
        domain     = args.domain or ""
        o_score    = args.score or "--"
        r_score    = args.required_score or "--"
        p_score    = args.preferred_score or "--"
        summary    = args.changes
        hr_review  = args.hr_review or ""
    else:
        base = f"{date_str}_{time_slug}_manual"
        if args.label:
            base += f"_{slugify(args.label)}"
        jd_title   = "Manual Backup"
        jd_company = "--"
        seniority  = ""
        domain     = ""
        o_score    = "--"
        r_score    = "--"
        p_score    = "--"
        summary    = args.changes
        hr_review  = ""

    # Resolve folder
    vf, status = resolve_version_conflict(base, skip_confirm=args.yes)
    if status == "cancelled":
        _out(f"\n{FAIL} Backup megszakitva.")
        sys.exit(1)

    _out(f"\nSnapshot mentese: {vf}/")
    os.makedirs(vf, exist_ok=True)

    # Write cv-data.js with header
    cv_data = read_file(CV_DATA_PATH)
    if cv_data is None:
        _out(f"{FAIL} ERROR: {CV_DATA_PATH} not found!")
        sys.exit(1)
    header = generate_header(jd_title, jd_company, seniority, domain,
                             date_str, time_str,
                             o_score, r_score, p_score, hr_review, summary)
    write_file(os.path.join(vf, "cv-data.js"), header + cv_data)
    _out(f"   {OK} cv-data.js")

    # Copy entire locales/ directory
    locales_src = _project_path("cv", "locales")
    locales_dst = os.path.join(vf, "locales")
    if os.path.exists(locales_dst):
        shutil.rmtree(locales_dst)
    shutil.copytree(locales_src, locales_dst)
    _normalize_dir_crlf(locales_dst)  # keep snapshots CRLF for clean diffs on restore
    _out(f"   {OK} locales/ ({len(os.listdir(locales_dst))} files)")

    # Audit log — record the snapshot in cv-versions/history.md
    folder_name = os.path.basename(vf)
    op = "job-apply backup" if is_job else "cv-backup"
    try:
        subprocess.run(
            [sys.executable, CV_LEDGER_SCRIPT, "log",
             "--category=backup", f"--operation={op}", "--actor=cv-backup",
             f"--app-id={folder_name}", f"--what={summary}",
             f"--artifact=cv-versions/{folder_name}/"],
            capture_output=True, text=True, encoding="utf-8", errors="replace",
        )
    except Exception:  # noqa: BLE001 — logging must never break a successful backup
        _out(f"   {WARN} history.md naplozas kihagyva (cv-ledger.py nem futott)")

    # Summary
    _out(f"\n{OK} Backup kesz")
    _out(f"\n   Mappa: {vf}/")
    _out(f"     - cv-data.js")
    _out(f"     - locales/  ({len(os.listdir(locales_dst))} locale files)")
    _out(f"\n   Visszaallitashoz: python .claude/skills/cv-restore/scripts/cv-restore.py {folder_name}")


if __name__ == "__main__":
    main()
