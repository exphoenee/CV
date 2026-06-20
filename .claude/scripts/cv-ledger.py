#!/usr/bin/env python3
"""
cv-ledger.py  —  CV traceability ledger

Single owner of the two CV-traceability mechanisms:

  1. The live-file marker block stamped at the top of cv/cv-data.js and the
     12 CV-content locale files (cv/locales/<lang>.js — NOT the *-page.js label files):

         // @job-application: APP_ID — TITLE @ COMPANY (DATE) · snapshot: cv-versions/APP_ID/
         // @cv-last-change: YYYY-MM-DD HHMM — OPERATION (ACTOR) · see cv-versions/history.md

  2. The append-only audit log cv-versions/history.md — one row per CV event
     (mutation / backup / review).

Every skill/agent that touches CV state calls this script instead of hand-rolling
the logic, so the format never drifts.

Usage
-----
Stamp / refresh the marker block on the live files:

    # job-apply / cv-restore — rewrite BOTH lines (new application identity):
    python .claude/scripts/cv-ledger.py mark \
        --set-application --app-id 2026-06-15_acme_senior-fe \
        --title "Senior Frontend Engineer" --company "Acme Corp" \
        --operation job-apply --actor job-apply-orchestrator

    # cv-improver — keep @job-application, refresh @cv-last-change only:
    python .claude/scripts/cv-ledger.py mark \
        --operation "hr-review edit" --actor cv-improver

Append an audit-log row:

    python .claude/scripts/cv-ledger.py log \
        --category mutation --operation job-apply --actor job-apply-orchestrator \
        --app-id 2026-06-15_acme_senior-fe \
        --what "summary + 2 bullets + skill order" \
        --artifact cv-versions/2026-06-15_acme_senior-fe/

Read the current marker (so a skill can show which version it is acting on):

    python .claude/scripts/cv-ledger.py current        # prints APP_ID + label, or "—"

Exit codes: 0 ok · 1 error
"""

import argparse
import os
import re
import sys
from datetime import datetime

# ── Encoding-safe console output (Windows cp1250) ─────────────────────
_ENCODING = os.environ.get("PYTHONIOENCODING", sys.stdout.encoding or "utf-8")


def _out(text):
    try:
        print(text)
    except UnicodeEncodeError:
        safe = text.encode(_ENCODING, errors="replace").decode(_ENCODING, errors="replace")
        print(safe)


OK = "[OK]"
WARN = "[!]"
FAIL = "[x]"

# ── Paths ──────────────────────────────────────────────────────────────
_SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__)) if "__file__" in dir() else os.getcwd()
# Script is at .claude/scripts/ — go up 2 levels to project root
_PROJECT_ROOT = os.path.abspath(os.path.join(_SCRIPT_DIR, "..", ".."))


def _project_path(*parts):
    return os.path.join(_PROJECT_ROOT, *parts)


# Shared CRLF normalizer (same directory) — single source of line-ending logic.
sys.path.insert(0, _SCRIPT_DIR)
from crlf_normalize import write_text_crlf

CV_DATA_PATH = _project_path("cv", "cv-data.js")
VERSIONS_DIR = _project_path("cv-versions")
HISTORY_PATH = _project_path("cv-versions", "history.md")

# CV content locale files — the 12 <lang>.js (NOT <lang>-page.js label files)
CONTENT_LANGS = ["en", "hu", "de", "fr", "es", "it",
                 "asg", "dot", "kl", "qu", "goa", "ya"]


def _marker_target_files():
    files = [CV_DATA_PATH]
    for lang in CONTENT_LANGS:
        files.append(_project_path("cv", "locales", f"{lang}.js"))
    return files


APP_PREFIX = "// @job-application:"
CHANGE_PREFIX = "// @cv-last-change:"

HISTORY_HEADER = (
    "# CV előzmények (audit napló)\n"
    "\n"
    "Append-only esemény-napló: minden CV-állapotot érintő művelet egy sor.\n"
    "Formátum: `.claude/rules/version-snapshot-format.md`. Generálja: `.claude/scripts/cv-ledger.py`.\n"
    "\n"
    "| Időpont | Kategória | Művelet | Aktor | CV-verzió (APP_ID) | Mi történt | Artefaktum |\n"
    "|---|---|---|---|---|---|---|\n"
)


def read_file(path):
    if not os.path.exists(path):
        return None
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def write_file(path, content):
    # CRLF-normalized write — shared logic in .claude/scripts/crlf_normalize.py
    write_text_crlf(path, content)


def _cell(value):
    """Make a value safe to drop into a Markdown table cell."""
    if value is None:
        value = ""
    value = str(value).replace("|", "/").replace("\r", " ").replace("\n", " ").strip()
    return value or "—"


# ── Marker handling ────────────────────────────────────────────────────
def _strip_existing_markers(text):
    """Remove leading @job-application / @cv-last-change comment lines.

    Returns (existing_app_line, remainder_text). existing_app_line is the old
    @job-application line (without trailing newline) if present, else None.
    """
    lines = text.split("\n")
    existing_app_line = None
    i = 0
    while i < len(lines):
        stripped = lines[i].lstrip()
        if stripped.startswith(APP_PREFIX):
            existing_app_line = lines[i].rstrip()
            i += 1
            continue
        if stripped.startswith(CHANGE_PREFIX):
            i += 1
            continue
        break
    remainder = "\n".join(lines[i:])
    return existing_app_line, remainder


def _build_app_line(app_id, title, company, date_str):
    return (f"{APP_PREFIX} {app_id} — {title} @ {company} ({date_str})"
            f" · snapshot: cv-versions/{app_id}/")


def _build_change_line(date_str, time_str, operation, actor):
    return (f"{CHANGE_PREFIX} {date_str} {time_str} — {operation} ({actor})"
            f" · see cv-versions/history.md")


def cmd_mark(args):
    now = datetime.now()
    date_str = args.date or now.strftime("%Y-%m-%d")
    time_str = args.time or now.strftime("%H%M")

    change_line = _build_change_line(date_str, time_str, args.operation, args.actor)

    targets = _marker_target_files()
    stamped = 0
    missing = 0
    for path in targets:
        text = read_file(path)
        if text is None:
            missing += 1
            _out(f"   {WARN} {os.path.relpath(path, _PROJECT_ROOT)} — nincs ilyen fájl")
            continue

        existing_app_line, remainder = _strip_existing_markers(text)

        if args.set_application:
            if not args.app_id:
                _out(f"{FAIL} --set-application megadva, de --app-id hiányzik.")
                sys.exit(1)
            app_line = _build_app_line(args.app_id, args.title or "—",
                                       args.company or "—", date_str)
        else:
            # keep the previous application identity if there was one
            app_line = existing_app_line

        block_lines = []
        if app_line:
            block_lines.append(app_line)
        block_lines.append(change_line)
        new_text = "\n".join(block_lines) + "\n" + remainder
        write_file(path, new_text)
        stamped += 1
        _out(f"   {OK} {os.path.relpath(path, _PROJECT_ROOT)}")

    _out(f"\n{OK} Marker frissítve {stamped} fájlban"
         + (f" ({missing} hiányzott)" if missing else ""))


def cmd_current(args):
    text = read_file(CV_DATA_PATH)
    if text is None:
        _out("—")
        return
    app_line, _ = _strip_existing_markers(text)
    if not app_line:
        _out("—")
        return
    # // @job-application: APP_ID — rest...
    body = app_line[len(APP_PREFIX):].strip()
    m = re.match(r"^(\S+)\s+—\s+(.*?)(?:\s+·\s+snapshot:.*)?$", body)
    if m:
        app_id, label = m.group(1), m.group(2)
        _out(f"{app_id} — {label}")
    else:
        _out(body)


def cmd_log(args):
    now = datetime.now()
    date_str = args.date or now.strftime("%Y-%m-%d")
    time_str = args.time or now.strftime("%H%M")

    if not os.path.exists(HISTORY_PATH):
        write_file(HISTORY_PATH, HISTORY_HEADER)

    row = "| {ts} | {cat} | {op} | {actor} | {app} | {what} | {art} |\n".format(
        ts=_cell(f"{date_str} {time_str}"),
        cat=_cell(args.category),
        op=_cell(args.operation),
        actor=_cell(args.actor),
        app=_cell(args.app_id),
        what=_cell(args.what),
        art=_cell(args.artifact),
    )
    with open(HISTORY_PATH, "a", encoding="utf-8") as f:
        f.write(row)

    _out(f"{OK} history.md bővítve: {_cell(args.operation)} — {_cell(args.app_id)}")


def main():
    parser = argparse.ArgumentParser(description="CV traceability ledger")
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_mark = sub.add_parser("mark", help="Stamp/refresh the live-file marker block")
    p_mark.add_argument("--set-application", action="store_true",
                        help="Rewrite the @job-application line (new identity)")
    p_mark.add_argument("--app-id", default="")
    p_mark.add_argument("--title", default="")
    p_mark.add_argument("--company", default="")
    p_mark.add_argument("--operation", required=True)
    p_mark.add_argument("--actor", required=True)
    p_mark.add_argument("--date", default="")
    p_mark.add_argument("--time", default="")
    p_mark.set_defaults(func=cmd_mark)

    p_log = sub.add_parser("log", help="Append an audit-log row to history.md")
    p_log.add_argument("--category", required=True,
                       choices=["mutation", "backup", "review"])
    p_log.add_argument("--operation", required=True)
    p_log.add_argument("--actor", required=True)
    p_log.add_argument("--app-id", default="")
    p_log.add_argument("--what", default="")
    p_log.add_argument("--artifact", default="")
    p_log.add_argument("--date", default="")
    p_log.add_argument("--time", default="")
    p_log.set_defaults(func=cmd_log)

    p_cur = sub.add_parser("current", help="Print the current @job-application marker")
    p_cur.set_defaults(func=cmd_current)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()