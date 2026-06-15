# Version Snapshot Format

Each job application version is saved as a **folder** under `cv-versions/`.

## Folder naming

```
VERSION_BASE   = DATE_COMPANY_SLUG_TITLE_SLUG
VERSION_FOLDER = cv-versions/VERSION_BASE[-vN]
```

- `DATE` = today YYYY-MM-DD
- `COMPANY_SLUG` = JD_COMPANY → lowercase, spaces→hyphens, special chars removed; `"unknown"` if unknown
- `TITLE_SLUG` = JD_TITLE → lowercase, spaces→hyphens, special chars removed
- `-vN` suffix added only when a folder for the same base already exists (v2, v3, …)

Example: `cv-versions/2026-06-13_acme-corp_senior-frontend-engineer/`

## APP_ID — application identifier

`APP_ID` = the final `VERSION_FOLDER` basename (including any `-vN` suffix), e.g.
`2026-06-13_acme-corp_senior-frontend-engineer` or `..._senior-frontend-engineer-v2`.

This single id ties together, for one application:
- the snapshot folder `cv-versions/APP_ID/`
- the formatted job description `cv-versions/APP_ID/job-description.md`
- the `// @job-application: APP_ID` marker stamped into the live `scripts/cv-data.js` and every `scripts/locales/*.js`
- the row in `cv-versions/applications.md`

## VERSION_FOLDER contents

```
VERSION_FOLDER/
  cv-data.js           ← optimized CV data (see header format below)
  locale-content.json  ← 11 locale content snapshots (see format below)
  job-description.md    ← formatted job description this version was made for (job-apply mode only)
  cover-letter-en.md   ← English cover letter (optional, written by cover-letter-agent)
  cover-letter-hu.md   ← Hungarian cover letter (optional, written by cover-letter-agent)
```

---

## cv-data.js header comment block

Prepend this comment block to the full content of `scripts/cv-data.js`:

```js
/**
 * CV Data — Job Application Version
 * ============================================================
 * Optimized for: [JD_TITLE] @ [JD_COMPANY]
 * Seniority:     [JD_SENIORITY]
 * Domain:        [JD_DOMAIN]
 * Date:          YYYY-MM-DD HH:MM
 * ATS match:     OVERALL_SCORE% (REQUIRED_SCORE% required · PREFERRED_SCORE% preferred)
 * HR Review:     review/DATE_COMPANY_SLUG_hr-review.md (if written)
 * Changes:       N modifications (summary · skill order · N bullet rephrases)
 * Locale:        locale-content.json — paste content fields into scripts/locales/<lang>.js to restore
 * ============================================================
 * Point-in-time snapshot for the above position.
 * Do not import directly — use scripts/cv-data.js.
 */
```

---

## locale-content.json structure

Captures the `content` field from all 11 non-English locale files after translation.

```json
{
  "_meta": {
    "optimized_for": "JD_TITLE @ JD_COMPANY",
    "date": "YYYY-MM-DD HH:MM",
    "ats_match": "OVERALL_SCORE%",
    "source": "scripts/locales/",
    "restore": "Paste each language block back into scripts/locales/<lang>.js → content field."
  },
  "hu": { /* full content object from scripts/locales/hu.js */ },
  "de": { /* ... */ },
  "fr": { /* ... */ },
  "es": { /* ... */ },
  "it": { /* ... */ },
  "asg": { /* ... */ },
  "dot": { /* ... */ },
  "kl": { /* ... */ },
  "qu": { /* ... */ },
  "goa": { /* ... */ },
  "ya": { /* ... */ }
}
```

---

## job-description.md structure

The formatted job description this CV version was tailored for. Written into
`VERSION_FOLDER/job-description.md` in **job-apply mode only** (manual `/cv-backup` has no JD).

The raw JD text the user pasted is cleaned up into readable Markdown — do not invent or
omit requirements, only reformat what was given.

```markdown
---
app_id: "APP_ID"
title: "JD_TITLE"
company: "JD_COMPANY"
seniority: "JD_SENIORITY"
domain: "JD_DOMAIN"
date: "YYYY-MM-DD HH:MM"
ats_match: "OVERALL_SCORE%"
cv_version: "cv-versions/APP_ID/"
source: "user-provided"
---

# JD_TITLE — JD_COMPANY

## Kötelező követelmények
- …

## Előnyben részesített
- …

## Feladatok / felelősségek
- …

## Eredeti állásleírás
> [the full original JD text, blockquoted verbatim]
```

---

## applications.md — application log (index table)

A single running Markdown table at `cv-versions/applications.md` listing every job application.
Created on first job-apply if missing. **Newest row is inserted directly under the header row.**
One row per `APP_ID` — if a row with the same `APP_ID` already exists (e.g. a `-vN` re-run was
overwritten), update that row in place instead of adding a duplicate.

```markdown
# Pályázatok nyilvántartása

Minden sor egy optimalizált CV-verzióhoz tartozik. Az APP_ID egyben a `cv-versions/` mappa neve is.

| Dátum | Pozíció | Cég | Szint | ATS | APP_ID (mappa) | JD | Fordítások | Mot. levél |
|---|---|---|---|---|---|---|---|---|
| 2026-06-13 | Senior Frontend Engineer | Acme Corp | senior | 78% | [2026-06-13_acme-corp_senior-frontend-engineer](2026-06-13_acme-corp_senior-frontend-engineer/) | [JD](2026-06-13_acme-corp_senior-frontend-engineer/job-description.md) | 11/11 | igen |
```

Column meaning:
- **Dátum** — `DATE`
- **Pozíció / Cég / Szint** — `JD_TITLE` / `JD_COMPANY` / `JD_SENIORITY`
- **ATS** — `OVERALL_SCORE%` (`—` if no optimization was needed)
- **APP_ID (mappa)** — relative link to the snapshot folder
- **JD** — relative link to `job-description.md`
- **Fordítások** — how many of the 11 locales were updated, e.g. `11/11`
- **Mot. levél** — `igen` if cover letters were written, else `nem`

---

## Live-file marker block — `// @job-application:` + `// @cv-last-change:`

So that anyone reading the **live working files** can tell which application the current CV is
tuned for **and when it last changed**, a two-line marker block is stamped at the **top** of:
- `scripts/cv-data.js`
- the **12 CV-content** locale files `scripts/locales/<lang>.js` (`en` + the 11 translated)
- **NOT** the `scripts/locales/<lang>-page.js` label files — those hold page UI labels, not
  job-specific CV content, so they never carry the marker.

```js
// @job-application: APP_ID — JD_TITLE @ JD_COMPANY (YYYY-MM-DD) · snapshot: cv-versions/APP_ID/
// @cv-last-change: YYYY-MM-DD HHMM — OPERATION (ACTOR) · see cv-versions/history.md
```

- `@job-application` — which version the live CV is based on. Set by **job-apply** (new APP_ID)
  and rewritten by **cv-restore** (to the restored APP_ID). **cv-improver does NOT change it** —
  the CV is still based on that application, only its content drifted.
- `@cv-last-change` — the most recent mutation of any kind. Updated by **job-apply, cv-improver,
  and cv-restore**.

Rules:
- **Do not hand-edit the marker.** All stamping goes through the ledger helper (see below), which
  is idempotent: it strips any existing `@job-application` / `@cv-last-change` lines at the top and
  rewrites them — exactly one block per file, never accumulating.
- The marker is plain `//` line comments — valid at the top of an ES module, harmless to runtime.
- Snapshots in `cv-versions/` do **not** carry the marker (their `cv-data.js` header, the
  `applications.md` row, and `history.md` already identify the job); only the live files carry it.

---

## history.md — append-only audit log

`cv-versions/history.md` is the chronological event log answering *when did what happen to which
CV version*. **Every** CV event appends one row — mutations, backups, **and** read-only reviews
(full audit trail). Created on first event if missing. Append at the bottom; never rewrite past rows.

```markdown
# CV előzmények (audit napló)

Append-only esemény-napló: minden CV-állapotot érintő művelet egy sor.
Formátum: `.claude/rules/version-snapshot-format.md`. Generálja: `.claude/scripts/cv-ledger.py`.

| Időpont | Kategória | Művelet | Aktor | CV-verzió (APP_ID) | Mi történt | Artefaktum |
|---|---|---|---|---|---|---|
| 2026-06-15 0900 | mutation | job-apply | job-apply-orchestrator | 2026-06-15_acme_senior-fe | summary + 2 bullet + skill order | cv-versions/2026-06-15_acme_senior-fe/ |
| 2026-06-15 1015 | mutation | hr-review edit | cv-improver | 2026-06-15_acme_senior-fe | summary átírva + 11 fordítás | review/2026-06-15_0905_hr-review-...md |
| 2026-06-15 1130 | review | cv-review | cv-review | 2026-06-15_acme_senior-fe | 0 hiba · 1 figyelmeztetés | — |
| 2026-06-15 1200 | backup | cv-backup | cv-backup | 2026-06-15_manual_pre-x | manuális snapshot | cv-versions/2026-06-15_manual_pre-x/ |
```

- **Kategória** — `mutation` (cv-data/locales changed), `backup` (a snapshot was created), or `review` (read-only analysis).
- **Aktor** — the skill/agent name that performed it.
- **CV-verzió (APP_ID)** — the application identity the event acted on (`—` if no marker yet).
- **Artefaktum** — folder/report path produced, or `—`.

---

## Ledger helper — `.claude/scripts/cv-ledger.py`

The single owner of the marker block and `history.md`. Skills/agents call it instead of hand-rolling
the format. Pipe `2>&1` and check the exit code; on failure, report it (do not silently continue).

```bash
# Set a new application identity (job-apply, cv-restore) — rewrites BOTH marker lines:
python .claude/scripts/cv-ledger.py mark --set-application \
  --app-id APP_ID --title "JD_TITLE" --company "JD_COMPANY" \
  --operation job-apply --actor job-apply-orchestrator

# Refresh only @cv-last-change (cv-improver) — keeps the existing @job-application line:
python .claude/scripts/cv-ledger.py mark --operation "hr-review edit" --actor cv-improver

# Append an audit-log row:
python .claude/scripts/cv-ledger.py log --category mutation --operation job-apply \
  --actor job-apply-orchestrator --app-id APP_ID \
  --what "summary + 2 bullets + skill order" --artifact cv-versions/APP_ID/

# Read the current marker (e.g. for a review report header) — prints "APP_ID — label" or "—":
python .claude/scripts/cv-ledger.py current
```

Notes:
- `mark` stamps `scripts/cv-data.js` + the 12 `<lang>.js` content files automatically — callers
  never list the files themselves.
- Table cells are sanitized (`|` → `/`, newlines → spaces) by the helper.
- The helper writes files as UTF-8; the `—`/`·` characters render correctly in the files even if a
  Windows console shows them garbled.
