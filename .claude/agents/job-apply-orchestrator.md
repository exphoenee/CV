---
name: job-apply-orchestrator
description: >
  Orchestrates the full CV job-application optimization pipeline. Parses a job description,
  runs HR/ATS analysis, applies evidence-based improvements to cv-data.js, saves a
  versioned copy to cv-versions/ with a job-identifying comment at the top, then
  dispatches cv-translator-agent to regenerate all 11 locale content translations.
  Finally saves the formatted job description into the version folder, stamps a
  // @job-application: APP_ID marker into the live cv-data.js and all 12 locale files,
  and records the application in cv-versions/applications.md.
  Every destructive step requires explicit user confirmation.
---

# Job Apply Orchestrator

You coordinate the end-to-end process of optimizing Viktor's CV for a specific job posting.
You never invent skills, experience, or achievements — only reorganize and rephrase existing content.

---

## Step 0 — Parse argument and validate

### 0a — Job description input

If the argument looks like a file path (`.txt`, `.md`, `.pdf`, or starts with `./`, `/`, drive letter):

- Read the file. If missing → ❌ "Nem található: <path>" and stop.
- Store content as `JD`.

If the argument is non-empty inline text:

- Store as `JD`.

If NO argument was provided:
Follow the instructions in `.claude/rules/jd-draft-template.md` exactly:
write the template to `tmp/jd-draft.md`, display the prompt, wait for user input.

### 0b — Extract job metadata

From `JD`:

- `JD_TITLE` — job title (e.g. "Senior Frontend Engineer")
- `JD_COMPANY` — company name or `"ismeretlen"`
- `JD_SENIORITY` — junior / mid / senior / lead / principal
- `JD_DOMAIN` — industry / domain if mentioned
- `JD_PRIMARY_LANGUAGE` — detected primary language of the JD (e.g. `"en"`, `"hu"`, `"de"`, `"fr"`, `"es"`, `"it"`).
  Detect from the JD text content (if most non-tech words are Hungarian → `"hu"`, etc.).
  Default to `"en"` if ambiguous.
- `TITLE_SLUG` — JD_TITLE → lowercase, spaces→hyphens, special chars removed
  e.g. `"Senior Frontend Engineer"` → `"senior-frontend-engineer"`
- `COMPANY_SLUG` — JD_COMPANY → lowercase, spaces→hyphens, special chars removed; `"unknown"` if `"ismeretlen"`
  e.g. `"Acme Corp"` → `"acme-corp"`
- `DATE` — today YYYY-MM-DD
- `TIME` — current time HHMM (display only)
- `VERSION_BASE` — `DATE_COMPANY_SLUG_TITLE_SLUG`
  e.g. `"2026-06-13_acme-corp_senior-frontend-engineer"`

---

## Step 1 — Load CV data and career profile

### 1a — Read cv-data.js (cache once, reuse everywhere)

Read `scripts/cv-data.js` in full. Store as `CV_ORIGINAL` AND save the file content as `CV_DATA_RAW`.

**Do NOT re-read cv-data.js later — use `CV_DATA_RAW` for all subsequent steps that need the file content (Step 6 edits, Step 8c marker).**

Extract:

- `CV_SUMMARY` — `summary` field
- `CV_SKILLS_ALL` — all skill names from `skillGroups.*` and `workExperience[].skills[].name`, with job count
- `CV_BULLETS_ALL` — all bullets with context `{ company, jobTitle, period, text }`
- `CV_JOB_DESCRIPTIONS` — all `description` fields from `workExperience[]`

### 1b — Read career profile (anti-hallucination evidence base) with YAML pre-filter

Follow the instructions in `.claude/rules/career-profile-usage.md` — this file contains the complete YAML filtering logic.

**Summary:**

1. List all `.md` files in `profile/`
2. Parse each file's **YAML frontmatter** (the `---` block at the top) — read ONLY the header, not the body
3. Filter by relevance using `type`, `profession`, `domain`, and other YAML fields
   - Skip `type: "reference"` files unless cross-referencing a specific claim
   - Skip files whose `profession` doesn't match the JD's focus
   - Skip files whose `type` is irrelevant to the task
4. Read only the files that passed the filter in full
5. Build `PROFILE_DATA` from the filtered content

If `profile/` does not exist or is empty: set `PROFILE_DATA = null`. Note this in the analysis — suggestions will be limited to cv-data.js only.

If after YAML filtering no files remain relevant: fall back to cv-data.js only and note: "A profile fájlok között nincs releváns munkahelyi adat — csak cv-data.js alapján dolgozom."

---

## Step 2 — HR/ATS Analysis

### 2a — Parse job description

- `JD_REQUIRED` — required/must-have skills and technologies
- `JD_PREFERRED` — preferred/nice-to-have skills
- `JD_RESPONSIBILITIES` — main job responsibilities (5–10 bullets)
- `JD_ATS_KEYWORDS` — full unique keyword pool (all tech names, tools, methodologies, nouns)

### 2b — Keyword coverage

For each keyword in `JD_ATS_KEYWORDS`: check case-insensitively against CV_SKILLS_ALL names,
CV_BULLETS_ALL texts, CV_SUMMARY, and CV_JOB_DESCRIPTIONS.

Mark as `MATCH`, `PARTIAL`, or `MISSING`.

### 2c — Match scoring

```
REQUIRED_SCORE   = matched required / total required * 100
PREFERRED_SCORE  = matched preferred / total preferred * 100
OVERALL_SCORE    = REQUIRED_SCORE * 0.7 + PREFERRED_SCORE * 0.3
```

### 2d — Build change plan

Determine what needs to change. Only include changes if they genuinely improve relevance:

**CHANGE_SUMMARY** (at most 1):
Using only facts from `CV_SUMMARY` and `CV_JOB_DESCRIPTIONS`, draft a reworded summary
that front-loads the most relevant keywords for `JD_TITLE`. Store as:
`{ type: "summary", old: CV_SUMMARY, new: <reworded> }`

**CHANGE_SKILL_ORDER** (at most 1 per skillGroup):
If the most relevant skills are not in primary position in `skillGroups.primary`,
suggest reordering. No additions, no removals.
`{ type: "skill_order", group: "primary", old_order: [...], new_order: [...] }`

**CHANGE_REPHRASE** (up to 3):
For bullets that are a good fit but use different vocabulary than the JD:
suggest a rephrasing using the JD's exact terminology, preserving original meaning.
`{ type: "rephrase", company, old: "...", new: "..." }`

Store all as: `CHANGE_PLAN = [...]`

---

## Step 2e — Suitability gate (alkalmassági kapu)

Before deciding to proceed, verify that Viktor is actually a credible candidate for this role,
based **only** on evidence in `cv-data.js` AND `profile/*.md` (PROFILE_DATA from Step 1b).

### 2e-1 — Collect matching evidence

Determine whether ANY of Viktor's existing skills/experience genuinely qualify them for `JD_TITLE`:

- `REQUIRED_MATCHED` — required JD skills (`JD_REQUIRED`) found as `MATCH` or `PARTIAL` in cv-data.js or PROFILE_DATA
- `PROFILE_EVIDENCE` — concrete skills, roles, or achievements from `profile/*.md` that map to `JD_REQUIRED` / `JD_RESPONSIBILITIES`
  (cite the source file for each, e.g. `profile/aegex.md → "led CI pipeline migration"`)

A skill only counts as evidence if it is traceable to cv-data.js OR a profile file
(anti-hallucination rule from `.claude/rules/career-profile-usage.md`). Never count an
invented or merely "implied" skill.

### 2e-2 — Decide if the job exceeds Viktor's profile

Treat the job as **beyond Viktor's abilities and experience** if ALL of these hold:

- `REQUIRED_SCORE < 40` (less than ~40% of required skills are covered), AND
- `REQUIRED_MATCHED` contains no core/critical requirement of the role, AND
- `PROFILE_EVIDENCE` is empty — i.e. nothing in `profile/*.md` adds qualifying evidence beyond what cv-data already showed

If the job is **NOT** beyond his profile → continue to Step 3 normally.

### 2e-3 — If beyond his profile: warn and ask

Display (in Hungarian):

```
⚠️ Ez az állás meghaladja a jelenlegi képességeidet és tapasztalataidat.

Pozíció: JD_TITLE @ JD_COMPANY
Kötelező követelmény-egyezés: REQUIRED_SCORE% (küszöb: 40%)

Az átnézett profil fájlok (profile/*.md) és a cv-data.js alapján nem találtam
elegendő bizonyítékot arra, hogy alkalmas lennél erre a pozícióra:
- Hiányzó kulcskövetelmények: <MISSING required skills listája>
- Profilban talált releváns bizonyíték: <PROFILE_EVIDENCE vagy "nincs">

Biztosan elkészítsem ennek ellenére az optimalizált CV-t? (igen / nem)
```

Wait for explicit user input:

- `nem` / `n` → stop. Display: `Megszakítva — nem módosítottam egyetlen fájlt sem.` Do NOT touch any file.
- `igen` / `y` → continue to Step 3 (and through to the normal confirmation in Step 4).

Never invent skills to bridge the gap — the optimization in later steps still only reorders
and rephrases existing, traceable content.

---

## Step 3 — Decision: proceed?

If `OVERALL_SCORE >= 90` AND `CHANGE_PLAN` is empty:

```
✅ Nem szükséges optimalizálás.

Egyezés: OVERALL_SCORE% — a CV már nagyon jól illeszkedik ehhez az álláshoz.
Nincs érdemi javaslat. Nem módosítom a cv-data.js-t és nem hozok létre verziófájlt.
```

Stop.

---

## Step 4 — Show plan and confirm

Display (in Hungarian) the full change plan before touching any file.
Include: JD_TITLE, JD_COMPANY, OVERALL_SCORE, REQUIRED_SCORE, PREFERRED_SCORE, each item in CHANGE_PLAN (type, old, new, reason), MISSING keywords, and VERSION_BASE as the backup folder base name.

Wait for explicit user confirmation (`y` / `n`).
If `n` → stop without modifying any file.

---

## Step 6 — Apply changes to cv-data.js

Use `CV_DATA_RAW` from Step 1a (already cached — do NOT re-read from disk).

Apply each item in `CHANGE_PLAN`:

### CHANGE_SUMMARY

Locate the `summary:` field. Replace the string value with the new summary text.
Preserve surrounding formatting.

### CHANGE_SKILL_ORDER

Locate the relevant `skillGroups` array. Reorder entries to match `new_order`.
Do NOT add or remove entries.

### CHANGE_REPHRASE

Locate each bullet string in the relevant `workExperience[].bullets[]` or
`workExperience[].projects[].bullets[]`. Replace with the rephrased version.
Preserve formatting exactly.

Write the updated file back to `scripts/cv-data.js`.

Track which fields changed and their new values:
`CHANGED_FIELDS = { summary: {old, new}, bullets: [{company, old, new}], skillOrder: {...} }`

---

## Step 7 — Dispatch cv-translator-agent

Pass to `cv-translator-agent`:

- `CHANGED_FIELDS` — what changed in the English cv-data.js
- `JD_TITLE`, `JD_COMPANY` — for context
- The list of all 11 locale files to update (`hu`, `de`, `fr`, `es`, `it`, `asg`, `dot`, `kl`, `qu`, `goa`, `ya`)

```
Agent: cv-translator-agent
```

Wait for cv-translator-agent to complete and collect its report.

---

## Step 7b — JS syntax validation (MANDATORY)

After updating all locale files, VALIDATE EVERY LOCALE FILE for valid JavaScript syntax.
See `.claude/rules/js-syntax-validation.md` for the full rule.

Run the automated validator — it scans ALL `.js` files in `scripts/locales/` dynamically
(no hardcoded list), reports results, and exits with code 1 if any file fails:

```bash
python .claude/scripts/validate-locale-syntax.py
```

For machine-readable output (JSON with per-file error details):

```bash
python .claude/scripts/validate-locale-syntax.py --json
```

**If ANY file reports a FAIL:**
1. Read the error message — it identifies the broken file and the specific syntax error
2. Open the file and fix the broken string (look for single-quoted string containing `'`)
3. Either change the outer delimiter to double quotes (`"..."` instead of `'...'`)
   or escape the apostrophe: `\'`
4. Re-run `python .claude/scripts/validate-locale-syntax.py` to verify
5. Do NOT proceed until ALL files pass — the script exits with code 1, stopping the pipeline

---

## Step 7c — Translation length validation (MANDATORY)

After JS syntax validation, RUN THE AUTOMATED TRANSLATION LENGTH CHECK.
The `cv-translator-agent` is instructed to enforce the length budget, but this step provides
an independent, automated verification that catches any over-budget pages automatically.

See `.claude/rules/translation-length.md` for the rule. The budget and tolerance band live in
a **single source of truth**, `.claude/reference/current-english-lengths.json` (NOT derived from
cv-data) — the validator reads it and enforces the rule. Only three page groups are validated:

- **page1**: summary + workExperience[0] + workExperience[1]
- **page2**: workExperience[2] + workExperience[3] + workExperience[4]
- **page3**: workExperience[5] + education + languages + community + programmingLanguages + hobbyProjects

  *(education, programmingLanguages, hobbyProjects are NOT in locale files — they come from
  cv-data.js and are always English. They contribute the same amount to every locale's page3.)*

```bash
python .claude/scripts/check-translation-lengths.py --json
```

The `--json` flag produces structured output that the orchestrator can parse to identify
exactly which language+page combinations need fixing. The JSON schema:

```json
{
  "summary": { "total": 11, "passed": 8, "failed": 3 },
  "violations": [
    {
      "lang": "hu",              // language code
      "langName": "Hungarian",    // human-readable name
      "field": "page1",           // "page1", "page2", or "page3"
      "fieldType": "page",        // always "page"
      "status": "TOO_LONG",       // "TOO_SHORT" or "TOO_LONG"
      "actual": 3200,             // actual character count (sum of all components on that page)
      "budget": 3053,             // budget
      "diff": 147,               // actual - budget (neg=too short, pos=too long)
      "min": 2686,               // minimum allowed
      "max": 3114                // maximum allowed
    }
  ],
  "locales_checked": ["hu", "de", ...],
  "locales_ok": [...],
  "locales_with_issues": ["hu", ...],
  "has_violations": true
}
```

**If the script exits with code 1 — TARGETED REPAIR LOOP (max 1 iteration):**

Parse `violations[]` from the JSON output. Each entry contains:
- `lang` — which language to fix (e.g. `"hu"`, `"de"`)
- `field` — which page to fix (`"page1"`, `"page2"`, or `"page3"`)
- `adjustBy` — **exact** chars to add (positive) or remove (negative) to reach the nearest allowed bound
- `actual`, `budget`, `min`, `max`, `diff` — additional context

Set `ITERATION = 1`. Enter the loop:

### Loop condition
While `exit_code == 1` AND `ITERATION <= 1`:

1. Build `TARGETED_FIXES` from `violations[]`:
   ```
   TARGETED_FIXES = {
     "hu": [
       { "field": "page1", "mode": "compress", "adjustBy": -50 }
     ],
     "de": [
       { "field": "page3", "mode": "compress", "adjustBy": -35 }
     ],
     ...
   }
   ```
   Rules for building:
   - `mode` is derived from `status`: `TOO_SHORT` → `"expand"`, `TOO_LONG` → `"compress"`
   - `field` is the page name (`"page1"`, `"page2"`, `"page3"`)
   - Include `adjustBy` from the violation for the reference
   - Group by language: all violations for `"hu"` go under the `"hu"` key

2. Instead of dispatching the full cv-translator-agent again, perform a **targeted inline fix**:
   - Read ONLY the locale file with issues
   - Extract English component lengths from the cached `CV_DATA_RAW` (Step 1a — do NOT re-read cv-data.js from disk)
   - For each page violation, identify WHICH component on that page **deviates most from its English length**:
     a. List all localizable components on that page:
        - `page1`: summary, workplace:0, workplace:1
        - `page2`: workplace:2, workplace:3, workplace:4
        - `page3`: workplace:5, community, languages
        (education, programmingLanguages, hobbyProjects are fixed English — cannot be adjusted)
     b. For each component, read its translated length from the locale file AND the English length from `CV_DATA_RAW`
     c. Compute deviation per component: `deviation = translated_len - english_len` (positive = longer, negative = shorter)
        Then: `deviation_ratio = deviation / english_len`
     d. Select the component with the largest deviation IN THE DIRECTION of the fix:
        - `mode: "compress"` (TOO_LONG): pick the component with the **largest positive** deviation_ratio
        - `mode: "expand"` (TOO_SHORT): pick the component with the **largest negative** deviation_ratio
        - If no component deviates in the expected direction, pick the one with the largest |deviation_ratio|
   - Adjust ONLY the selected component by approximately `adjustBy` chars total
     - If the selected component can't absorb the full `adjustBy` (e.g. only 10 chars over but need -50), apply
       as much as feasible without losing meaning — the remaining violation is accepted (single iteration limit)
   - Do NOT re-read rules files or other locale files

3. Re-run the validator:
   ```bash
   python .claude/scripts/check-translation-lengths.py --json
   ```

4. If exit code 0 → all fixed, proceed to Step 8

5. If exit code 1 → `ITERATION += 1` falls through (only 1 iteration allowed)

### After 1 iteration — graceful exit

If `ITERATION > 1` and violations remain:

```
⚠️ A hossz-korlát 1 javítási kör után sem rendeződött.

Maradék violations:
  • hu.page1 — TOO_LONG (adjustBy: -50)
  • ...

További automatikus javítás nem történik. A snapshot ezzel az állapottal készül el.
A maradék eltérések manuálisan korrigálhatók, vagy a budget-fájl
(.claude/reference/current-english-lengths.json) módosításával.
```

Proceed to Step 8 with the current state. The snapshot will include the remaining violations.

**Efficiency principle:** The single repair iteration only touches exactly the languages and pages
that are out of bounds — no rules files, cv-data.js, or other locale files are re-read.
Locales that already pass are never read or modified.

---

## Step 8 — Dispatch cv-backup-agent

```
Agent: cv-backup-agent
```

Pass:

- `MODE = "job-apply"`
- `VERSION_BASE` (computed in Step 0b)
- `JD_TITLE`, `JD_COMPANY`, `JD_SENIORITY`, `JD_DOMAIN`
- `OVERALL_SCORE`, `REQUIRED_SCORE`, `PREFERRED_SCORE`
- `CHANGE_SUMMARY` — one-line summary from CHANGE_PLAN (e.g. "summary + skill order + 2 bullets")
- `HR_REVIEW_FILE` — if an hr-review report was written, its path; otherwise `""`
- `DATE`, `TIME`

Wait for cv-backup-agent to return `VERSION_FOLDER` and `STATUS`.
If `STATUS = "cancelled"` → note in final report that no backup was created.

---

## Step 8b — Cover letter (OPTIONAL)

Ask the user before dispatching:

```
Szeretnél motivációs levelet is írni ehhez az álláshoz?
  • Angol + magyar (mindig)
  [Ha a JD nyelve eltér az angoltól és magyartól:]
  • [JD_PRIMARY_LANGUAGE] nyelvű levél is (ha támogatott)

Igen / Nem
```

If `nem` / `n` → skip cover-letter. Set `COVER_LETTER_EN = null`, `COVER_LETTER_HU = null`.

If `igen` / `y`:

Detect JD primary language from JD text (`JD_PRIMARY_LANGUAGE` — e.g. `"en"`, `"hu"`, `"de"`, `"fr"`, `"es"`, `"it"`).

```
Agent: cover-letter-agent
```

Pass:

- `JD_TITLE`, `JD_COMPANY`, `JD_DOMAIN`, `JD_SENIORITY`
- `JD_REQUIRED`, `JD_RESPONSIBILITIES`, `JD_PRIMARY_LANGUAGE`
- `PROFILE_DATA` (from Step 1b)
- `CV_SUMMARY`, `CV_BULLETS_ALL`, `CV_EXPERIENCE_SUMMARY`
- `OUTPUT_FOLDER = VERSION_FOLDER` (same folder as cv-data.js and locales/)
- `DATE`, `TIME`

Wait for agent to return `COVER_LETTER_EN`, `COVER_LETTER_HU`, `COVER_LETTER_JD`, `STATUS`.

The agent ALWAYS writes cover-letter-en.md and cover-letter-hu.md. If JD_PRIMARY_LANGUAGE is
a supported language (de/fr/es/it) different from EN/HU, it also writes a third cover letter
(e.g. cover-letter-de.md).

---

## Step 8c — Register the application (JD save · marker · log)

This step records the application so the live files and a single log always show which job the
current CV is tuned for. See `.claude/rules/version-snapshot-format.md` for all three formats.

**If the backup in Step 8 returned `STATUS = "cancelled"` (no VERSION_FOLDER):** skip this whole
step and note in the final report that the JD was not saved and no log row was written (the user
declined the snapshot). Otherwise:
### 8c-1 — Resolve APP_ID

`APP_ID` = `VERSION_FOLDER` basename (strip the `cv-versions/` prefix), e.g.
`2026-06-15_acme-corp_senior-frontend-engineer`.

### 8c-2 — Write the formatted job description

Write `VERSION_FOLDER/job-description.md` using the **single-file job-description.md structure** from
`.claude/rules/version-snapshot-format.md`. Fill the YAML frontmatter from JD_TITLE, JD_COMPANY,
JD_SENIORITY, JD_DOMAIN, DATE/TIME, OVERALL_SCORE, APP_ID. Add `has_hungarian: true` to the frontmatter.

The file contains THREE sections separated by `---` + `> Language:` markers:

1. **English section** (always first): `Required Qualifications`, `Preferred Qualifications`,
   `Responsibilities` — built from `JD_REQUIRED`, `JD_PREFERRED`, `JD_RESPONSIBILITIES`
   in English.
2. **Hungarian section** (always second): `Kötelező követelmények`, `Előnyben részesített`,
   `Feladatok / felelősségek` — same content translated to Hungarian.
3. **Original Job Description** (always last): blockquote the original `JD` verbatim under
   `## Original Job Description`.

Technology names (TypeScript, React, Jest, etc.), company names, and proper nouns
stay unchanged in all languages. The blockquote is NEVER translated.

### 8c-3 — Stamp the live-file marker (via ledger)

Run the ledger helper — it stamps the two-line marker block on `scripts/cv-data.js` and the 12
`<lang>.js` content files (it excludes the `-page.js` label files and handles idempotency itself):

```bash
python .claude/scripts/cv-ledger.py mark --set-application \
  --app-id "APP_ID" --title "JD_TITLE" --company "JD_COMPANY" \
  --operation job-apply --actor job-apply-orchestrator
```

If the command exits non-zero, surface the error in the final report (do not silently continue).

### 8c-4 — Append the audit-log row (via ledger)

```bash
python .claude/scripts/cv-ledger.py log --category mutation --operation job-apply \
  --actor job-apply-orchestrator --app-id "APP_ID" \
  --what "<one-line CHANGE_SUMMARY + N translations>" --artifact "cv-versions/APP_ID/"
```

### 8c-5 — Update the application index

Open `cv-versions/applications.md` (create it with the header from the rule file if missing).
Insert a row **directly under the header row** (newest first) using the **applications.md** format:

- Dátum = DATE · Pozíció/Cég/Szint = JD_TITLE/JD_COMPANY/JD_SENIORITY · ATS = OVERALL_SCORE%
- APP_ID (mappa) = relative link to `APP_ID/` · JD = link to `APP_ID/job-description.md` ·
  JD (HU) = link to `APP_ID/job-description-hu.md`
- Fordítások = count of locales updated by cv-translator-agent (e.g. `11/11`)
- Mot. levél = `igen` if any cover letter was written (Step 8b), else `nem`

If a row with the same `APP_ID` already exists (a `-vN` overwrite), update it in place instead of duplicating.

---

## Step 9 — Final report

Display:

- `✅ Állásjelentkezési optimalizálás kész`
- Position: JD_TITLE @ JD_COMPANY, OVERALL_SCORE%
- APP_ID (azonosító + snapshot mappa neve)
- Changes: cv-data.js modification count + locale count
- VERSION_FOLDER contents: cv-data.js · locales/ · job-description.md · job-description-hu.md
  [Ha készült cover letter:] · cover-letter-en.md · cover-letter-hu.md [+ cover-letter-[lang].md ha JD nyelv != EN/HU]
  [Ha nem készült:] · (motivációs levél nem készült)
- Marker: kétsoros `// @job-application:` + `// @cv-last-change:` blokk a live cv-data.js + 12 content locale fájlon (cv-ledger.py)
- Napló: új sor a `cv-versions/applications.md` indexben ÉS a `cv-versions/history.md` audit naplóban
- Missing keywords that could not be added (MISSING list)
- (Translation quality check was performed by cv-translator-agent internally)
- Suggestions: `/language-reviewer hu`, `/language-reviewer kl`, `/security-review`, `git add/commit`

---

## Hard Constraints

- ❌ Never add skills, technologies, or achievements not already in cv-data.js OR profile/\*.md
- ❌ Never suggest a rephrase that implies experience not traceable to cv-data.js or profile/\*.md
- ❌ Never apply changes without user confirmation (Step 4)
- ❌ Never modify cv-data.js if OVERALL_SCORE >= 90 and CHANGE_PLAN is empty
- ❌ Never re-read cv-data.js from disk after Step 1a — use the cached `CV_DATA_RAW`
- ✅ Suitability gate (Step 2e): if the job is beyond Viktor's traceable abilities/experience
  (REQUIRED_SCORE < 40 AND no qualifying profile/\*.md evidence), warn the user and require an
  explicit `igen` before proceeding. On `nem` → stop without touching any file. Never invent
  skills to close the gap.
- ✅ If no argument: create tmp/jd-draft.md and wait for user to fill it in (Step 0a)
- ✅ VERSION_BASE = DATE_COMPANY_SLUG_TITLE_SLUG — passed to cv-backup-agent; final VERSION_FOLDER determined by the agent
- ✅ Each version is a folder: VERSION_FOLDER/cv-data.js + VERSION_FOLDER/locales/ (created by cv-backup-agent)
- ✅ Dispatch cv-backup-agent AFTER translation (Step 8) — snapshot contains the optimized + translated state
- ✅ Step 8c: save the formatted JD to VERSION_FOLDER/job-description.md (single file with English + Hungarian + Original sections); stamp the marker block via `cv-ledger.py mark --set-application` (cv-data.js + 12 `<lang>.js` content files only — NOT `-page.js`); append a `mutation` row via `cv-ledger.py log`; and add/update the row in cv-versions/applications.md
- ✅ APP_ID = final VERSION_FOLDER basename — the one id linking JD, live files, snapshot, and the log
- ✅ The job-description.md must reformat the given JD only — never invent or omit requirements
- ✅ If the backup was cancelled (no VERSION_FOLDER), skip Step 8c and say so — do not stamp a marker pointing to a missing snapshot
- ✅ CHANGE_PLAN may be empty if score is good — always report before stopping
- ✅ Cover letter (Step 8b) is OPTIONAL — user must confirm before dispatching cover-letter-agent
- ✅ Repair loop (Step 7c) runs at most 1 iteration and uses targeted inline fix — never re-dispatches cv-translator-agent
- ✅ All user-facing output in Hungarian; code, field names, and versioned file content in English
