---
name: cv-backup
description: >
  Creates a versioned snapshot of the current cv-data.js and all 11 locale content fields.
  Independent of any job application — backs up the current state as-is.
  Optional label argument is included in the folder name for identification.
version: 1.0.0
author: Viktor Bozzay
disable-model-invocation: true
argument-hint: '[label]'
---

# cv-backup — Manual CV Snapshot

Creates a point-in-time backup of the current `cv/cv-data.js` and all 11 locale content
fields into `cv-versions/`. Useful before manual edits, experiments, or refactoring.

## Step 1 — Parse argument

If an argument was provided:

- `LABEL_SLUG` = argument → lowercase, spaces→hyphens, special chars removed
- `VERSION_BASE = DATE_TIME_manual_LABEL_SLUG` (e.g. `"2026-06-15_0915_manual_pre-refactor"`)

If no argument:

- `VERSION_BASE = DATE_TIME_manual` (e.g. `"2026-06-15_0915_manual"`)

`DATE` = today YYYY-MM-DD, `TIME` = current time HHMM.

## Step 2 — Dispatch backup agent

```
Agent: cv-backup-agent
```

Pass:

- `MODE = "manual"`
- `VERSION_BASE` (computed above)
- `JD_TITLE = "Manual Backup"`
- `JD_COMPANY = "—"`
- `JD_SENIORITY = ""`
- `JD_DOMAIN = ""`
- `OVERALL_SCORE = ""`
- `REQUIRED_SCORE = ""`
- `PREFERRED_SCORE = ""`
- `CHANGE_SUMMARY = "Manual snapshot"`
- `HR_REVIEW_FILE = ""`
- `DATE`, `TIME`

## Step 3 — Report result

If agent returned `STATUS = "cancelled"` → display: `❌ Backup megszakítva.`

If `STATUS = "ok"`:

```
✅ Backup kész

Mappa: VERSION_FOLDER/
  - cv-data.js           ← CV adat snapshot
  - locales/             ← 11 locale fájl (eredeti JS formátumban)

Visszaállításhoz: /cv-restore VERSION_FOLDER_NAME
```
