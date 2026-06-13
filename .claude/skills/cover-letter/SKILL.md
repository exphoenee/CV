---
name: cover-letter
description: >
  Writes personalized English and Hungarian cover letters for a job application.
  Grounded in cv-data.js and profile/*.md — never invents experience.
  Without argument: opens tmp/jd-draft.md template. With argument (file or inline JD):
  parses the JD and dispatches cover-letter-agent.
  Saves cover-letter-en.md and cover-letter-hu.md to letters/.
version: 1.0.0
author: Viktor Bozzay
disable-model-invocation: true
argument-hint: "[job-description-file | \"inline job description text\"]"
---

# cover-letter — Motivációs Levél Generáló

Önállóan is triggerelhető motivációs levél writer.
A `/job-apply` pipeline automatikusan hívja, de közvetlenül is használható.

## Step 1 — Parse argument

If argument provided:
- File path → read file. Missing → ❌ stop.
- Inline text → use directly.
- Store as `JD`.

If no argument → follow instructions in `.claude/rules/jd-draft-template.md` (write template to `tmp/jd-draft.md`, wait for `kész`).

## Step 2 — Extract JD metadata

From `JD`:
- `JD_TITLE` — job title
- `JD_COMPANY` — company name or `"ismeretlen"`
- `JD_SENIORITY` — junior / mid / senior / lead / principal
- `JD_DOMAIN` — industry / domain
- `JD_REQUIRED` — required skills/keywords
- `JD_RESPONSIBILITIES` — main responsibilities (5–10 bullets)
- `JD_PRIMARY_LANGUAGE` — detect: `"en"` or `"hu"` based on JD text language
- `COMPANY_SLUG` — JD_COMPANY → lowercase, spaces→hyphens, special chars removed
- `TITLE_SLUG` — JD_TITLE → same
- `DATE` — today YYYY-MM-DD, `TIME` — current HHMM

## Step 3 — Load CV data and career profile

Read `scripts/cv-data.js`. Extract:
- `CV_SUMMARY`, `CV_BULLETS_ALL` (all bullets with company/period context), `CV_EXPERIENCE_SUMMARY`

Follow the instructions in `.claude/rules/career-profile-usage.md` — parse YAML headers first, filter by relevance, then read only relevant files in full. Build `PROFILE_DATA`.

If `profile/` empty or missing → `PROFILE_DATA = null`, note limitation.
If after YAML filtering no files remain relevant → fall back to cv-data.js only.

## Step 4 — Determine output folder

`OUTPUT_FOLDER = letters/DATE_COMPANY_SLUG_TITLE_SLUG`

Create `letters/` if it does not exist.
Create `OUTPUT_FOLDER/` directory.

If `OUTPUT_FOLDER` already exists:
```
Már létezik: OUTPUT_FOLDER/
  [a] Felülírja  [b] Új mappa (-v2)  [n] Leáll
```
Wait for user input.

## Step 5 — Dispatch cover-letter-agent

```
Agent: cover-letter-agent
```

Pass: JD_TITLE, JD_COMPANY, JD_DOMAIN, JD_SENIORITY, JD_REQUIRED, JD_RESPONSIBILITIES,
JD_PRIMARY_LANGUAGE, PROFILE_DATA, CV_SUMMARY, CV_BULLETS_ALL, CV_EXPERIENCE_SUMMARY,
OUTPUT_FOLDER, DATE, TIME.

## Step 6 — Report

```
✅ Motivációs levelek kész

Pozíció: JD_TITLE @ JD_COMPANY
Mappa:   OUTPUT_FOLDER/
  📄 cover-letter-en.md   ← angol verzió
  📄 cover-letter-hu.md   ← magyar verzió

Küldés előtt ellenőrizd és szerkeszd a leveleket.
```