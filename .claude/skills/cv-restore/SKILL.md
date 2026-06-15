---
name: cv-restore
description: >
  Restores cv-data.js and all 11 locale content fields from a cv-versions/ backup folder.
  Shows a full preview of what will be overwritten before applying any changes.
  Requires explicit user confirmation.
version: 1.0.0
author: Viktor Bozzay
disable-model-invocation: true
argument-hint: "<folder-name>"
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
Check that `cv-versions/FOLDER_NAME/locale-content.json` exists.

If any check fails → ❌ "Nem található: cv-versions/FOLDER_NAME/ — ellenőrizd a mappa nevét." and stop.

## Step 2 — Show backup metadata

Read first 15 lines of `cv-versions/FOLDER_NAME/cv-data.js` to extract the header comment.
Read `_meta` from `cv-versions/FOLDER_NAME/locale-content.json`.

Display:

```
📦 Backup adatai

Pozíció: [Optimized for]
Dátum:   [Date from header]
ATS:     [ATS match from header]
Módosítások: [Changes from header]

Visszaállítandó fájlok:
  scripts/cv-data.js          ← felülírja a jelenlegit
  scripts/locales/hu.js       ← content mező frissül
  scripts/locales/de.js       ← content mező frissül
  scripts/locales/fr.js       ← content mező frissül
  scripts/locales/es.js       ← content mező frissül
  scripts/locales/it.js       ← content mező frissül
  scripts/locales/asg.js      ← content mező frissül
  scripts/locales/dot.js      ← content mező frissül
  scripts/locales/kl.js       ← content mező frissül
  scripts/locales/qu.js       ← content mező frissül
  scripts/locales/goa.js      ← content mező frissül
  scripts/locales/ya.js       ← content mező frissül

⚠️  A jelenlegi scripts/cv-data.js tartalma felülíródik.
    A megerősítés után automatikusan készül egy pre-restore biztonsági mentés
    (cv-versions/DATE_manual_pre-restore/), mielőtt bármit felülírnánk.

Folytatod? (y / n)
```

Wait for user confirmation. If `n` → stop.

## Step 3 — Restore cv-data.js

Read `cv-versions/FOLDER_NAME/cv-data.js` in full.

Strip the header comment block: remove everything from the first `/**` up to and including the closing `*/` and any immediately following blank line.

Write the stripped content to `scripts/cv-data.js`.

## Step 4 — Restore locale content fields

Read `cv-versions/FOLDER_NAME/locale-content.json`.

For each language key in the JSON (hu, de, fr, es, it, asg, dot, kl, qu, goa, ya):

1. Read `scripts/locales/<lang>.js` in full.
2. The content value from the JSON may be `null` or a nested object.
3. Locate the `content:` property in the locale file (it is always the last top-level key before the closing `}`).
4. Replace the entire `content:` value — from `content:` through its closing brace or `null` — with the restored value.
   - If the JSON value is `null` → write `content: null`
   - If the JSON value is an object → write `content: ` followed by the JSON-serialized object (2-space indent, matching the file's existing style)
5. Write the updated file back.

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
  ✓ scripts/cv-data.js
  ✓ scripts/locales/hu.js  (content: [null | restored])
  ✓ scripts/locales/de.js
  ... (all 11)
🧾 Marker a visszaállított verzióra állítva + sor a history.md-ben

Javaslat: Ellenőrizd a változásokat git diff-fel, majd indítsd el a szervert.
```

## Hard Constraints

- ❌ Never restore without explicit `y` confirmation from the user
- ❌ Never modify any file in `cv-versions/` — only read from there (a NEW pre-restore backup folder is created, never an edit of an existing one)
- ✅ Always create the automatic pre-restore backup before overwriting (aborts the restore if the backup fails); only skip with `--no-backup`
- ✅ After restoring, stamp the marker to the restored APP_ID and append a `mutation` row to history.md (Step 4b) — done automatically by cv-restore.py
- ✅ Strip the header comment exactly — the restored cv-data.js must be valid JS
- ✅ If a locale JSON value is `null`, write `content: null` (not `content: {}`)
- ✅ All user-facing output in Hungarian
