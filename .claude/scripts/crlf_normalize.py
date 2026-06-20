#!/usr/bin/env python3
"""
crlf_normalize.py — shared CRLF line-ending normalizer.

The repository is committed with CRLF line endings (see .claude/rules/line-endings.md).
This module is the SINGLE source of CRLF-normalization logic: imported by the CV tooling
(cv-backup, cv-restore, cv-ledger) and runnable as a CLI to normalize whole trees.

API
---
    to_crlf(text) -> str                 normalize a string to CRLF (no doubling)
    normalize_bytes(data) -> bytes       normalize raw bytes to CRLF
    write_text_crlf(path, content)       write a string to a file as UTF-8 + CRLF
    normalize_file(path) -> bool         rewrite one file as CRLF; True if it changed
    normalize_dir(dir, exts, recursive)  normalize text files in a directory
    normalize_paths(paths, ...)          normalize a mix of files/dirs

CLI
---
    python .claude/scripts/crlf_normalize.py <path> [<path>...] [--no-recursive] [--ext .js,.md]
    python .claude/scripts/crlf_normalize.py cv cv-versions          # normalize both trees
"""

import argparse
import sys
from pathlib import Path

# Text-file extensions that must use CRLF in this repo.
TEXT_EXTS = {
    ".js", ".mjs", ".cjs", ".ts", ".css", ".html", ".htm", ".json",
    ".md", ".txt", ".py", ".svg", ".xml", ".yml", ".yaml", ".csv",
}


def to_crlf(text: str) -> str:
    """Normalize all line endings in a string to CRLF, without doubling existing CRLF."""
    return text.replace("\r\n", "\n").replace("\r", "").replace("\n", "\r\n")


def normalize_bytes(data: bytes) -> bytes:
    """Normalize all line endings in raw bytes to CRLF."""
    return data.replace(b"\r\n", b"\n").replace(b"\r", b"").replace(b"\n", b"\r\n")


def write_text_crlf(path, content: str) -> None:
    """Write `content` to `path` as UTF-8 with CRLF endings, creating parent dirs."""
    p = Path(path)
    if p.parent and not p.parent.exists():
        p.parent.mkdir(parents=True, exist_ok=True)
    with open(p, "w", encoding="utf-8", newline="") as f:
        f.write(to_crlf(content))


def _looks_binary(data: bytes) -> bool:
    return b"\x00" in data


def normalize_file(path) -> bool:
    """Rewrite a single file with CRLF endings. Returns True if the file changed.
    Skips files that look binary (contain a NUL byte)."""
    p = Path(path)
    data = p.read_bytes()
    if _looks_binary(data):
        return False
    norm = normalize_bytes(data)
    if norm != data:
        p.write_bytes(norm)
        return True
    return False


def normalize_dir(directory, exts=None, recursive=True) -> dict:
    """Normalize text files in `directory`.

    exts: iterable of extensions (with leading dot) or None for the default TEXT_EXTS.
    Returns {'changed': [Path, ...], 'scanned': int}.
    """
    d = Path(directory)
    allow = {e.lower() for e in (exts or TEXT_EXTS)}
    it = d.rglob("*") if recursive else d.glob("*")
    changed, scanned = [], 0
    for f in it:
        if not f.is_file() or f.suffix.lower() not in allow:
            continue
        scanned += 1
        if normalize_file(f):
            changed.append(f)
    return {"changed": changed, "scanned": scanned}


def normalize_paths(paths, recursive=True, exts=None) -> dict:
    """Normalize a mix of file and directory paths. Returns {'changed', 'scanned'}."""
    changed, scanned = [], 0
    for raw in paths:
        p = Path(raw)
        if p.is_dir():
            r = normalize_dir(p, exts=exts, recursive=recursive)
            changed += r["changed"]
            scanned += r["scanned"]
        elif p.is_file():
            scanned += 1
            if normalize_file(p):
                changed.append(p)
        else:
            print(f"  (skip, not found: {raw})", file=sys.stderr)
    return {"changed": changed, "scanned": scanned}


def main(argv=None):
    ap = argparse.ArgumentParser(
        description="Normalize text files to CRLF (the repo's line-ending convention)."
    )
    ap.add_argument("paths", nargs="+", help="files or directories to normalize")
    ap.add_argument("--no-recursive", dest="recursive", action="store_false",
                    help="do not recurse into directories")
    ap.add_argument("--ext", help="comma-separated extension allowlist, e.g. .js,.md "
                                   "(default: common text extensions)")
    args = ap.parse_args(argv)

    exts = None
    if args.ext:
        exts = [e if e.startswith(".") else "." + e for e in args.ext.split(",")]

    res = normalize_paths(args.paths, recursive=args.recursive, exts=exts)
    for f in res["changed"]:
        print(f"  CRLF: {f}")
    print(f"--- normalized {len(res['changed'])} of {res['scanned']} text file(s) ---")
    return 0


if __name__ == "__main__":
    sys.exit(main())
