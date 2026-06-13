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

## VERSION_FOLDER contents

```
VERSION_FOLDER/
  cv-data.js           ← optimized CV data (see header format below)
  locale-content.json  ← 11 locale content snapshots (see format below)
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
