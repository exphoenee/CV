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

⚠️  A jelenlegi scripts/cv-data.js tartalma elvész (nem menthető vissza automatikusan).
    Javasolt: /cv-backup most — mielőtt visszaállítasz.

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

## Step 5 — Report

```
✅ Visszaállítás kész

Forrás: cv-versions/FOLDER_NAME/
Visszaállítva:
  ✓ scripts/cv-data.js
  ✓ scripts/locales/hu.js  (content: [null | restored])
  ✓ scripts/locales/de.js
  ... (all 11)

Javaslat: Ellenőrizd a változásokat git diff-fel, majd indítsd el a szervert.
```

## Hard Constraints

- ❌ Never restore without explicit `y` confirmation from the user
- ❌ Never modify any file in `cv-versions/` — only read from there
- ✅ Always offer `/cv-backup` suggestion before overwriting (shown in Step 2 warning)
- ✅ Strip the header comment exactly — the restored cv-data.js must be valid JS
- ✅ If a locale JSON value is `null`, write `content: null` (not `content: {}`)
- ✅ All user-facing output in Hungarian
