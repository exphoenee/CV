# Line-Ending Rule — CRLF

## Why this matters

This repository is committed with **CRLF** (`\r\n`) line endings, and `core.autocrlf`
is `false` (git stores bytes verbatim, no conversion). If a file is rewritten with
**LF** (`\n`) or **mixed** endings, every line differs from the committed version, so
git — and especially **GitHub Desktop** — shows the whole file as deleted + re-added
instead of a clean line-level diff.

This already happened once: `cv/cv-data.js` and the `cv/locales/*.js` content files were
rewritten with LF (a `shutil.copytree` binary restore copying LF snapshots), turning a
small content change into a whole-file diff.

## The Rule

**Every file written into the working tree MUST use CRLF line endings.**

### For editors

`.editorconfig` at the repo root enforces `end_of_line = crlf`. Keep the EditorConfig
extension enabled in VS Code (and any other editor). Do not override it per-file.

### For Python tooling (`.claude/` scripts)

- Never copy text files with a raw binary copy (`shutil.copy*`) without normalizing
  afterwards — binary copy preserves the **source's** endings (which may be LF).
- When writing a text file, normalize to CRLF. The pattern used in `cv-backup.py` /
  `cv-restore.py`:

  ```python
  content = content.replace("\r\n", "\n").replace("\r", "").replace("\n", "\r\n")
  with open(path, "w", encoding="utf-8", newline="") as f:
      f.write(content)
  ```

  For a directory of copied `.js` files, run `_normalize_dir_crlf(dir)` after the copy.
- `open(path, "w", encoding="utf-8")` in text mode already emits CRLF **on Windows**,
  but is OS-dependent; prefer the explicit normalization above for determinism.

### For agents / Claude edits

The `Edit` tool preserves a file's existing endings (safe). When **creating** a new file
or doing a bulk rewrite, ensure the result is CRLF.

## How to fix a file that drifted to LF

```bash
python - <<'PY'
import pathlib
p = pathlib.Path("cv/locales/de.js")        # the drifted file
d = p.read_bytes()
p.write_bytes(d.replace(b"\r\n", b"\n").replace(b"\r", b"").replace(b"\n", b"\r\n"))
PY
```

Then `git diff` shows only the real line changes again.

## Verifying

```bash
# Count CRLF vs total lines — they should be equal for a clean CRLF file:
grep -c $'\r$' <file>        # CRLF line count
```

A file with mixed endings (CRLF count < total line count) has drifted — normalize it.

## Optional stronger guarantee (not enabled by default)

A `.gitattributes` with `* text=auto eol=crlf` would make git normalize endings in the
index automatically, but enabling it requires a one-time `git add --renormalize .`
commit that rewrites the line endings of **every** tracked file. That mass commit is
intentionally avoided here; the `.editorconfig` + tooling normalization above keep all
write paths CRLF without it. Enable the `.gitattributes` route only as a deliberate,
separate change.
