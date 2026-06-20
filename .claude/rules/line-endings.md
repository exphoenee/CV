# Line-Ending Rule — CRLF

## Why this matters

This repository is committed with **CRLF** (`\r\n`) line endings, and `core.autocrlf`
is `false` (git stores bytes verbatim). If a file is rewritten with **LF** (`\n`) or
**mixed** endings, every line differs from the committed version, so git — and especially
**GitHub Desktop** — shows the whole file as deleted + re-added instead of a clean
line-level diff.

This already happened: `.prettierrc` had `"endOfLine": "lf"` (so `npm run format` rewrote
files as LF) and `cv-restore` copied LF snapshots verbatim, turning small content changes
into whole-file diffs.

## The Rule

**Every file written into the working tree MUST use CRLF line endings.**

This is enforced by four layers — keep all of them intact:

| Layer | File / mechanism | Covers |
| ----- | ---------------- | ------ |
| Editors | `.editorconfig` (`end_of_line = crlf`) | VS Code & any EditorConfig-aware editor |
| Formatter | `.prettierrc` (`"endOfLine": "crlf"`) | `npm run format` / Prettier on save |
| Python tooling | `.claude/scripts/crlf_normalize.py` | cv-backup / cv-restore / cv-ledger writes |
| People & AI | this rule | manual edits, agent file edits |

## ⚠️ AI Rule — MUST follow when editing files

When you (Claude / any agent) **create or rewrite** a file in this repo:

1. The result MUST have **CRLF** line endings. Never write LF or mixed endings.
2. The `Edit` tool preserves a file's existing endings — safe for in-place edits.
3. When you **create a new file**, do a **bulk rewrite**, or write files from a Python
   script, normalize to CRLF afterwards:
   ```bash
   python .claude/scripts/crlf_normalize.py <path> [<path>...]
   ```
4. Never copy text files with a raw binary copy (`shutil.copy*`) without normalizing
   afterwards — binary copy preserves the **source's** endings (which may be LF).
5. After any task that wrote/moved many files, run the normalizer on the touched
   directories (e.g. `python .claude/scripts/crlf_normalize.py cv cv-versions`) and
   confirm `git diff` shows line-level changes, not whole-file delete+add.

## Shared normalizer — `.claude/scripts/crlf_normalize.py`

Single source of CRLF logic. Importable **and** runnable.

Python API (import it — do not re-implement):

```python
import sys
sys.path.insert(0, "<project>/.claude/scripts")
from crlf_normalize import to_crlf, write_text_crlf, normalize_file, normalize_dir

write_text_crlf(path, content)              # write a string as UTF-8 + CRLF
normalize_file(path)                         # rewrite one file as CRLF (skips binary)
normalize_dir(dir, exts=[".js"], recursive=False)
```

CLI:

```bash
python .claude/scripts/crlf_normalize.py cv cv-versions            # normalize both trees
python .claude/scripts/crlf_normalize.py path/to/file.js           # one file
python .claude/scripts/crlf_normalize.py styles --ext .css         # only .css under styles/
python .claude/scripts/crlf_normalize.py cv --no-recursive         # top level only
```

It skips binary files (NUL byte) and only touches a text-extension allowlist, so it is
safe to point at whole directories.

## Verifying

```bash
# CRLF line count should equal total line count for a clean CRLF file:
grep -c $'\r$' <file>        # CRLF line count
grep -c ''     <file>        # total line count
```

A file with mixed endings (CRLF count < total) has drifted — run the normalizer on it.

## Optional stronger guarantee (not enabled by default)

A `.gitattributes` with `* text=auto eol=crlf` would make git normalize endings in the
index automatically, but enabling it requires a one-time `git add --renormalize .` commit
that rewrites the line endings of **every** tracked file. That mass commit is intentionally
avoided; the four layers above keep all write paths CRLF without it. Enable the
`.gitattributes` route only as a deliberate, separate change.
