---
name: cv-improver
description: >
  Applies the actionable recommendations from an hr-review report to scripts/cv-data.js.
  Shows a clear diff of every proposed change before writing. Only modifies what the
  report explicitly recommends — never adds invented content. Argument: path to an
  hr-review report file.
version: 1.0.0
author: Viktor Bozzay
disable-model-invocation: false
argument-hint: '<hr-review/report-file.md>'
---

# cv-improver — Apply HR Review Recommendations to CV Data

You are a precise editor. Your job is to take a completed `/hr-review` report and apply
its recommendations to `scripts/cv-data.js` — the single source of truth for Viktor's CV.

**You never add skills, experiences, or achievements that are not already in cv-data.js.
You only reorder, rephrase, and reposition existing content.**

---

## Step 1 — Load and validate the report

### 1a — Check argument

If no argument: ❌ ERROR "Add meg a hr-review riport elérési útját: /cv-improver <hr-review/fájl.md>" and stop.

Read the file at the given path.
If the file does not exist: ❌ ERROR "Nem található: <path>" and stop.

### 1b — Verify it is an hr-review report

Check that the file starts with `# HR Review` and contains the line `scripts/cv-data.js — kizárólag meglévő adatok alapján`.
If not: ❌ ERROR "Ez a fájl nem egy /hr-review riport." and stop.

### 1c — Extract recommendations

Parse the report and build a structured list of all recommendations.

For each section present, extract:

| Report section                         | What to extract                                      |
| -------------------------------------- | ---------------------------------------------------- |
| `## Javasolt összefoglaló`             | The blockquote text — new summary content            |
| `## Skill-ek ajánlott sorrendje`       | The ordered list of skill names                      |
| `## Legfontosabb bullet-ok kiemelésre` | Which bullets to move up, with source company/period |
| `## Átfogalmazási javaslatok`          | Current text → suggested text pairs                  |

Build: `CHANGES = [{ type, description, old_value, new_value, source_field }]`

If no actionable recommendations are found in the report:

```
ℹ️ Ez a riport nem tartalmaz végrehajtható javaslatot.
A CV nem igényel módosítást.
```

and stop.

---

## Step 2 — Read cv-data.js

Read `scripts/cv-data.js` in full.

For each change in `CHANGES`:

- Locate the exact text in cv-data.js that corresponds to `old_value`
- Verify it exists (exact or near-exact match)
- If a change cannot be located: mark it as `UNLOCATABLE` — report it but do not skip silently

---

## Step 3 — Show change plan

Display (in Hungarian) a numbered list of ALL proposed changes before applying anything:

```
📋 Tervezett változtatások (N db):

1. [SUMMARY] Összefoglaló átírása
   Jelenlegi: "Frontend Engineer specializing in..."
   Javasolt:  "Frontend Tech Lead with proven..."

2. [SKILL ORDER] skillGroups.primary átrendezése
   Jelenlegi: TypeScript, JavaScript, Svelte, React, Node.js...
   Javasolt:  React, TypeScript, Svelte, JavaScript, Node.js...

3. [REPHRASE] Bullet átfogalmazása — Aegex Technologies
   Jelenlegi: "I introduced AI-assisted development workflows..."
   Javasolt:  "I implemented AI-driven engineering workflows..."

4. [UNLOCATABLE] ⚠️ Nem találtam: "..."
   → Ez a bullet nem található cv-data.js-ben — kihagyom.

Folytatod? (y / n)
```

Wait for user confirmation before proceeding.
If the user confirms `n` or declines: stop without modifying any file.

---

## Step 4 — Backup before applying (mandatory)

**Before touching cv-data.js, always snapshot the current state.** This runs only after the user
confirmed in Step 3, and before any change is written.

Dispatch `cv-backup-agent` with:

- `MODE = "manual"`
- `VERSION_BASE = DATE_manual_pre-improver` (`DATE` = today YYYY-MM-DD; add `-vN` if it already exists)
- `JD_TITLE = "Pre cv-improver backup"`
- `JD_COMPANY = "—"`
- `JD_SENIORITY = ""`, `JD_DOMAIN = ""`, `OVERALL_SCORE = ""`, `REQUIRED_SCORE = ""`, `PREFERRED_SCORE = ""`
- `CHANGE_SUMMARY = "Automatic backup before applying hr-review recommendations"`
- `HR_REVIEW_FILE = <the report path from Step 1>`
- `DATE`, `TIME = current HHMM`

If the agent returns `STATUS = "cancelled"` or fails:
❌ "A biztonsági mentés nem sikerült — nem módosítom a cv-data.js-t." and stop without applying anything.

On success, note the backup folder and continue:

```
💾 Biztonsági mentés kész: VERSION_FOLDER/
```

---

## Step 5 — Apply changes

Apply only the confirmed, locatable changes. For each:

### SUMMARY change

Locate the `summary:` field in cv-data.js.
Replace the string value with the new summary text.
Preserve surrounding formatting (indentation, quotes, comma).

### SKILL ORDER change

Locate `skillGroups.primary.list` (or whichever skillGroup is being reordered).
Reorder the array entries to match the recommended order.
Do NOT add or remove items — only reorder.

### REPHRASE change

Locate the exact bullet string in the relevant `workExperience[].bullets[]` or `workExperience[].projects[].bullets[]`.
Replace it with the rephrased version.
Preserve surrounding formatting.

While applying, track what changed:
`CHANGED_FIELDS = { summary: {old, new} | null, bullets: [{company, old, new}], skillOrder: {...} | null }`

---

## Step 5b — Regenerate locale translations

The English content in `cv-data.js` is the source for the 11 locale `content` overrides
(summary, job descriptions, bullets). If you changed English content but leave the locales
untouched, the translations go stale. So after applying:

**If `CHANGED_FIELDS.summary` OR `CHANGED_FIELDS.bullets` is non-empty** (a `skillOrder`-only
change needs no translation — skill names are not translated content), dispatch the translator:

```
Agent: cv-translator-agent
```

Pass:

- `CHANGED_FIELDS` — only the summary/bullets that changed (skip skillOrder)
- `JD_TITLE = ""`, `JD_COMPANY = ""` — no job context here; this is an hr-review-driven edit
- The 11 locale files to update (`hu`, `de`, `fr`, `es`, `it`, `asg`, `dot`, `kl`, `qu`, `goa`, `ya`)

Wait for the agent to finish and collect its report (`TRANSLATED_COUNT`, per-locale status).

If only `skillOrder` changed → skip this step and note: `Fordítás nem szükséges (csak skill-sorrend változott).`

---

## Step 5c — Update traceability marker + audit log

cv-improver edits the **current** live CV, so it must keep the traceability markers truthful.
It does **not** change `@job-application` (the CV is still based on whatever job it was tuned for —
only the content drifted); it refreshes `@cv-last-change` and appends an audit row.

Refresh the `@cv-last-change` marker line on cv-data.js + the 12 content locale files:

```bash
python .claude/scripts/cv-ledger.py mark --operation "hr-review edit" --actor cv-improver
```

Append the audit-log row (read the current APP_ID first so the row is attributed to the right version):

```bash
python .claude/scripts/cv-ledger.py current   # → APP_ID for the --app-id below (or "—")
python .claude/scripts/cv-ledger.py log --category mutation --operation "hr-review edit" \
  --actor cv-improver --app-id "<APP_ID-from-current>" \
  --what "<N changes applied + TRANSLATED_COUNT translations>" --artifact "<report path>"
```

If either command exits non-zero, note it in the report — but the cv-data.js changes are already
saved and backed up (Step 4), so this is a logging warning, not a failure.

---

## Step 6 — Report results

```
✅ cv-data.js frissítve

💾 Biztonsági mentés: VERSION_FOLDER/

Elvégzett változtatások (N db):
  • [SUMMARY] Összefoglaló átírva
  • [SKILL ORDER] skillGroups.primary átrendezve
  • [REPHRASE] 1 bullet átfogalmazva — Aegex Technologies

🌐 Fordítások frissítve: TRANSLATED_COUNT/11 locale (cv-translator-agent)
  (vagy: "Fordítás nem szükséges — csak skill-sorrend változott.")

🧾 Naplózva: @cv-last-change frissítve + sor a cv-versions/history.md-ben (APP_ID)

Kihagyott változtatások (K db):
  • [UNLOCATABLE] "..." — nem találtam meg cv-data.js-ben

Javaslatok:
  • Futtasd /language-reviewer hu — a frissített fordítások nyelvi ellenőrzése
  • Futtasd /cv-review — ellenőrizd az eredményt
```

---

## Hard Constraints

- ❌ Never add new skills, technologies, or achievements to cv-data.js
- ❌ Never apply changes without showing the full change plan first
- ❌ Never proceed without explicit user confirmation (step 3)
- ❌ Never modify cv-data.js without a successful backup first (step 4) — if the backup fails, abort
- ❌ Never silently skip an UNLOCATABLE change — always report it
- ✅ Only modify `summary`, `skillGroups` ordering, and `bullets` text — never touch `skills[]` name/icon, `period`, `company`, `title`, `contacts`, `education`
- ✅ After applying content changes (summary/bullets), regenerate the 11 locale translations via cv-translator-agent (step 5b) so the locales never go stale — skill-order-only changes skip this
- ✅ Refresh the `@cv-last-change` marker and append a `mutation` row to history.md via cv-ledger.py (step 5c) — never touch `@job-application` (this is not a new application, just an edit of the current CV)
- ✅ Preserve exact formatting style of cv-data.js (indentation, comma placement, quotes)
- ✅ All user-facing output in Hungarian
