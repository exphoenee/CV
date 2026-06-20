#!/usr/bin/env python3
"""
validate-locale-syntax.py

Validates ALL JS files in cv/locales/ using Node.js syntax checking (node -c).
Scans the directory dynamically — no hardcoded file lists — so it automatically
picks up any new locale files.

Output: JSON array of results, one per file, with:
  - file: relative path
  - status: "ok" | "fail"
  - error: error text (only on fail)

Exit code: 0 if ALL files pass, 1 if ANY file fails.

Usage:
  python .claude/scripts/validate-locale-syntax.py          # validate, human-readable
  python .claude/scripts/validate-locale-syntax.py --json    # validate, JSON output (for agents)
  python .claude/scripts/validate-locale-syntax.py --list    # just list the files that would be checked

Integration:
  Called by job-apply-orchestrator (Step 7c) and other pipeline steps that
  modify locale files. The --json flag produces machine-readable output that
  agents can parse to identify specific broken files and errors.

See also: .claude/rules/js-syntax-validation.md
"""

import json
import os
import subprocess
import sys
from pathlib import Path

# ── Paths ──────────────────────────────────────────────────────────────
_SCRIPT_DIR = Path(__file__).resolve().parent
_PROJECT_ROOT = _SCRIPT_DIR.parent.parent   # .claude/scripts/ -> .claude/ -> project root
LOCALES_DIR = _PROJECT_ROOT / "cv" / "locales"


def find_locale_files():
    """Return sorted list of all .js files in cv/locales/."""
    if not LOCALES_DIR.exists():
        print(f"ERROR: {LOCALES_DIR} does not exist", file=sys.stderr)
        sys.exit(1)
    return sorted(LOCALES_DIR.glob("*.js"))


def validate_file(filepath):
    """Syntax-check a single locale JS file in ES-module mode. Returns (status, error_msg).

    The locale files are ES modules (`export const ...`) and the browser loads them
    as modules. Plain `node -c file.js` parses `.js` as CommonJS and does NOT catch
    module-context errors such as an apostrophe prematurely terminating a single-quoted
    string (e.g. 'cha' yomme'). Feeding the source via stdin with
    `--input-type=module --check` forces ES-module parsing, matching the browser.
    """
    try:
        source = filepath.read_text(encoding="utf-8")
    except OSError as e:
        return ("fail", f"could not read file: {e}")
    try:
        # Pass the source as UTF-8 bytes (not text=) — on Windows, text-mode stdin
        # would be encoded with the console codepage (e.g. cp1250) and crash on
        # characters like 'ð' or '→', silently feeding node empty input → false OK.
        result = subprocess.run(
            ["node", "--check", "--input-type=module"],
            input=source.encode("utf-8"),
            capture_output=True,
            timeout=30,
        )
    except FileNotFoundError:
        return ("fail", "'node' not found in PATH — is Node.js installed?")
    except subprocess.TimeoutExpired:
        return ("fail", "node --check timed out after 30 seconds (file may be too large or corrupt)")

    if result.returncode == 0:
        return ("ok", None)

    # Extract meaningful error from stderr (node writes errors to stderr)
    error = result.stderr.decode("utf-8", "replace").strip()
    if not error:
        error = result.stdout.decode("utf-8", "replace").strip()
    if not error:
        error = f"node -c exited with code {result.returncode}"
    return ("fail", error)


def main():
    # ── --list mode ────────────────────────────────────────────────
    if "--list" in sys.argv:
        files = find_locale_files()
        print(f"Locale JS files ({len(files)} total):")
        for f in files:
            rel = f.relative_to(_PROJECT_ROOT)
            print(f"  {rel}")
        sys.exit(0)

    files = find_locale_files()
    results = []
    has_failure = False

    for filepath in files:
        rel = filepath.relative_to(_PROJECT_ROOT)
        status, error = validate_file(filepath)
        results.append({
            "file": str(rel).replace("\\", "/"),
            "status": status,
            "error": error,
        })
        if status == "fail":
            has_failure = True

    # ── --json mode (machine-readable, for AI agents) ──────────────
    if "--json" in sys.argv:
        output = {
            "total": len(results),
            "passed": sum(1 for r in results if r["status"] == "ok"),
            "failed": sum(1 for r in results if r["status"] == "fail"),
            "results": results,
        }
        print(json.dumps(output, indent=2))
        sys.exit(1 if has_failure else 0)

    # ── Human-readable output (default) ────────────────────────────
    print(f"=== JS Syntax Validation: {LOCALES_DIR} ===")
    print(f"Found {len(files)} locale file(s)")
    print()

    for r in results:
        if r["status"] == "ok":
            print(f"  OK  {r['file']}")
        else:
            print(f"  FAIL {r['file']}")
            # Indent the error message for readability
            for line in r["error"].split("\n"):
                print(f"       {line}")

    print()
    if has_failure:
        failed_count = sum(1 for r in results if r["status"] == "fail")
        print(f"FAIL: {failed_count} file(s) have syntax errors")
        print()
        print("Fix guide:")
        print("  1. Open each FAIL file and find the broken string")
        print("  2. Either change the outer delimiter to double quotes (\"...\")")
        print("     or escape the apostrophe (\\')")
        print("  3. Re-run this script to verify the fix")
        print("  4. See: .claude/rules/js-syntax-validation.md")
        sys.exit(1)
    else:
        print("ALL OK — every locale file has valid JavaScript syntax")
        sys.exit(0)


if __name__ == "__main__":
    main()
