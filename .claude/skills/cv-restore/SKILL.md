---
name: cv-restore
description: >
  Restores cv-data.js and all 11 locale content fields from a cv-versions/ backup folder.
  Shows a full preview of what will be overwritten before applying any changes.
  Requires explicit user confirmation.
version: 1.0.0
author: Viktor Bozzay
disable-model-invocation: true
argument-hint: '<folder-name>'
---

# cv-restore — Restore CV from Backup

Restores the CV to a previously snapshotted state from `cv-versions/`.

## Step 1 — Validate argument

If no argument → ❌ "Add meg a mappa nevét. Elérhető backupok: `cv-versions/`" and stop.

Normalize the argument:

- Strip leading `cv-versions/` prefix if present
- Strip trailing `/`
- `FOLDER_NAME` = remaining string, e.g. `"2026-06-13_acme-corp_senior-frontend-engineer"`

Check that `cv-versions/FOLDER_NAME/` exists.
Check that `cv-versions/FOLDER_NAME/cv-data.js` exists.
Check that `cv-versions/FOLDER_NAME/locales/` (directory) exists.

If any check fails → ❌ "Nem található: cv-versions/FOLDER_NAME/ — ellenőrizd a mappa nevét." and stop.

## Step 2 — Show backup metadata

Read first 15 lines of `cv-versions/FOLDER_NAME/cv-data.js` to extract the header comment.
List the files in `cv-versions/FOLDER_NAME/locales/`.

Display:

```
📦 Backup adatai

Pozíció: [Optimized for]
Dátum:   [Date from header]
ATS:     [ATS match from header]
Módosítások: [Changes from header]

Visszaállítandó fájlok:
  cv/cv-data.js          ← felülírja a jelenlegit
  cv/locales/*.js        ← felülírva a backupból (11-12 fájl)

⚠️  A jelenlegi cv/cv-data.js és cv/locales/ tartalma felülíródik.
    A megerősítés után automatikusan készül egy pre-restore biztonsági mentés
    (cv-versions/DATE_manual_pre-restore/), mielőtt bármit felülírnánk.

Folytatod? (y / n)
```

Wait for user confirmation. If `n` → stop.

## Step 3 — Restore cv-data.js

Read `cv-versions/FOLDER_NAME/cv-data.js` in full.

Strip the header comment block: remove everything from the first `/**` up to and including the closing `*/` and any immediately following blank line.

Write the stripped content to `cv/cv-data.js`.

## Step 4 — Restore locale files

Copy the entire `cv-versions/FOLDER_NAME/locales/` directory over `cv/locales/`.
This restores all 12 locale files (hu, de, fr, es, it, asg, dot, kl, qu, goa, ya) in their
**original JS format** — no parsing, no serialization, no JSON conversion.

```python
import shutil
shutil.copytree("cv-versions/FOLDER_NAME/locales", "cv/locales", dirs_exist_ok=True)
```

**Why this is better than the old approach:**

- No fragile regex-based content extraction during backup
- No JSON serialization that converts single quotes to double quotes
- No complex JS re-serialization during restore
- The files are byte-identical to the original — marker lines, comments, formatting all preserved
- If a new locale file is added to `cv/locales/`, it gets automatically backed up and restored

## Step 4b — Traceability marker + audit log (automatic)

The restored `cv-data.js` comes from a snapshot with its header stripped, so it carries no marker.
After restoring, the script (`cv-restore.py`) stamps the live-file marker block to the **restored**
version's identity and logs the event — via `.claude/scripts/cv-ledger.py`:

- `@job-application` is set to `FOLDER_NAME` (the restored APP_ID), title/company taken from the
  snapshot header's `Optimized for:` line; `@cv-last-change` records the restore.
- A `mutation` row (`operation: cv-restore`, `what: restored from FOLDER_NAME`) is appended to
  `cv-versions/history.md`.

This is automatic — no manual step. If marker stamping fails, the restore still succeeded; the
script reports it as a warning.

## Step 5 — Report

```
✅ Visszaállítás kész

Pre-restore mentés: cv-versions/DATE_manual_pre-restore/
Forrás: cv-versions/FOLDER_NAME/
Visszaállítva:
  ✓ cv/cv-data.js (header stripped)
  ✓ cv/locales/   (N fájl visszamásolva)
🧾 Marker a visszaállított verzióra állítva + sor a history.md-ben

Javaslat: Ellenőrizd a változásokat git diff-fel, majd indítsd el a szervert.
```

## Hard Constraints

- ❌ Never restore without explicit `y` confirmation from the user
- ❌ Never modify any file in `cv-versions/` — only read from there (a NEW pre-restore backup folder is created, never an edit of an existing one)
- ✅ Always create the automatic pre-restore backup before overwriting (aborts the restore if the backup fails); only skip with `--no-backup`
- ✅ After restoring, stamp the marker to the restored APP_ID and append a `mutation` row to history.md (Step 4b) — done automatically by cv-restore.py
- ✅ Strip the header comment exactly — the restored cv-data.js must be valid JS
- ✅ All user-facing output in Hungarian
