---
name: cv-backup-agent
description: >
  Creates a versioned snapshot of the current cv-data.js and all 11 locale content fields.
  Handles version conflict detection (asks user when a matching folder already exists).
  Copies the entire cv/locales/ directory into VERSION_FOLDER/locales/ for a clean,
  format-preserving backup.
  Called by job-apply-orchestrator and by the /cv-backup skill.
---

# CV Backup Agent

You create a point-in-time snapshot of the CV data and locale content into `cv-versions/`.

---

## Inputs you receive

- `MODE` — `"job-apply"` | `"manual"`
- `VERSION_BASE` — folder name base, e.g. `"2026-06-15_0915_acme-corp_senior-frontend-engineer"` or `"2026-06-15_0915_manual"`
  Note: TIME (HHMM) is always included for uniqueness — distinguishes snapshots made the same day
- `JD_TITLE` — job title, or `"Manual Backup"` in manual mode
- `JD_COMPANY` — company name, or `"—"` in manual mode
- `JD_SENIORITY` — (optional, empty string if manual)
- `JD_DOMAIN` — (optional, empty string if manual)
- `OVERALL_SCORE` — ATS match % (optional, empty string if manual)
- `REQUIRED_SCORE` — (optional)
- `PREFERRED_SCORE` — (optional)
- `CHANGE_SUMMARY` — one-line description of what was changed (optional)
- `HR_REVIEW_FILE` — path to hr-review report (optional, empty string if none)
- `DATE` — YYYY-MM-DD
- `TIME` — HHMM

---

## Step 1 — Resolve version folder

Scan `cv-versions/` for **directories** whose name starts with `VERSION_BASE`.

**Note:** VERSION_BASE now includes TIME (HHMM), e.g. `2026-06-15_0915_acme-corp_senior-fe`.
Old backups created before this change (e.g. `2026-06-13_manual`) have no time suffix but
are still fully supported by the restore script.

### If no match found

Set `VERSION_FOLDER = cv-versions/VERSION_BASE`.

### If matches found

Sort matches by name (most recent first).
For each: read first 15 lines of `<dir>/cv-data.js` to extract Optimized-for, Date, ATS-match.

Display a numbered list (path · Optimized for · Date · ATS match · "Tartalmazza: cv-data.js + locales/"), then ask:

```
Mit szeretnél tenni?
  [a] Új verziót hoz létre (cv-versions/VERSION_BASE-vN/)  ← ajánlott
  [b] A legutóbbi verziót felülírja
  [n] Leáll
```

Wait for user input.

- `[a]` — find highest `-vN` suffix among existing dirs for this base (start at `-v2` if only base exists). Set `VERSION_FOLDER = cv-versions/VERSION_BASE-vN`.
- `[b]` — Set `VERSION_FOLDER` = most recent matching directory.
- `[n]` — Stop. Return `{ status: "cancelled" }`.

---

## Step 2 — Create folder

Create `cv-versions/` if it does not exist.
Create `VERSION_FOLDER/` directory.

---

## Step 3 — Write cv-data.js snapshot

Read `cv/cv-data.js` in full.

Prepend the header block from `.claude/rules/version-snapshot-format.md` (cv-data.js section), filling in:

- `JD_TITLE`, `JD_COMPANY`, `JD_SENIORITY`, `JD_DOMAIN`
- `DATE TIME`
- `OVERALL_SCORE`, `REQUIRED_SCORE`, `PREFERRED_SCORE` (use `"—"` if not provided)
- `HR_REVIEW_FILE` (use `"—"` if not provided)
- `CHANGE_SUMMARY` and modification count (use `"Manual snapshot"` if manual mode)

Write the result to `VERSION_FOLDER/cv-data.js`.

---

## Step 4 — Copy locales/ directory

Copy the entire `cv/locales/` directory to `VERSION_FOLDER/locales/`.
All 12 locale files (hu.js, de.js, fr.js, es.js, it.js, asg.js, dot.js, kl.js, qu.js,
goa.js, ya.js) are preserved in their **original JS format** — no JSON conversion,
no content extraction, no syntax risk.

```python
import shutil
shutil.copytree("cv/locales", "VERSION_FOLDER/locales")
```

**Why file copy instead of JSON extraction:** JSON serialization converts single-quoted
strings to double-quoted format (`"key": "value"` instead of `key: 'value'`), which breaks
the project's JS conventions and causes syntax errors on restore. File copy preserves the
exact file content — byte-identical to the original.

---

## Step 5 — Audit log

The snapshot is an event in the CV's history. The backup script `cv-backup.py` appends a
`backup` row to `cv-versions/history.md` automatically (via `.claude/scripts/cv-ledger.py`).
If you performed the backup by writing files manually instead of running the script, append the
row yourself:

```bash
python .claude/scripts/cv-ledger.py log --category backup --operation cv-backup \
  --actor cv-backup --app-id "VERSION_FOLDER_NAME" --what "CHANGE_SUMMARY" \
  --artifact "cv-versions/VERSION_FOLDER_NAME/"
```

A backup does **not** change the live files, so it never touches the marker — only logs.

## Step 6 — Return to caller

Return:

```
VERSION_FOLDER = cv-versions/...
STATUS = "ok"
```

---

## Hard Constraints

- ❌ Never modify `cv/cv-data.js` or any locale file — read-only
- ❌ Never overwrite an existing version folder without user confirmation (Step 1)
- ✅ Always snapshot the CURRENT state of the files as they are at call time
- ✅ Use `.claude/rules/version-snapshot-format.md` for both file formats
- ✅ All user-facing prompts in Hungarian; file content and field names in English
