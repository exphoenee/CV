# Translation Character Limit Rules (Translation Length Budget)

## Reference

The **reference is a FIXED budget** — it is **NOT** calculated from the current `scripts/cv-data.js`.
The budget has a **single source of truth**:

**`.claude/reference/current-english-lengths.json`** — contains the budget numbers **and**
the tolerance range (`_tolerance`). This is what the Python checker (`check-translation-lengths.py`)
reads, and it is the only authoritative source. This rule file no longer contains a manually
maintained number table — you can query the script for current values:

```bash
python .claude/scripts/check-translation-lengths.py --print
```

> ⚠️ **Never regenerate the budget** from `cv-data.js` on each run. If the English content
> length changes (e.g. a `/job-apply` rewrites the summary), the budget **does not** change —
> the budget protects the fixed layout capacity, not the current English text length.
> Budget modification is a **deliberate, manual decision**: edit the JSON directly (and adjust
> tolerance there).

**Only two things are checked:**
1. **hero** (summary) — total character count of the summary
2. **per-workplace total** — combined length of description + all bullets + all project bullets

**NOT checked:** community, education, hobbyProjects, programmingLanguages, skillGroups

Rationale: views (especially `cv-plain`, `cv-gantt`, cards) display text in fixed-width/height
containers. The +2% upper limit ensures translations don't break layout. The -5% lower limit
allows translations to be slightly shorter, but not excessively so.

---

## The Rule

```
hero (summary):  BUDGET_summary * 0.95  <=  translated_summary  <=  BUDGET_summary * 1.02
workplace:       BUDGET_workplace * 0.95  <=  translated_total  <=  BUDGET_workplace * 1.02
```

Where `workplace_total` = length of the workExperience item's `description` + all `bullets[]` + all `projects[].bullets[]`.

The concrete budget values (and tolerance range) live in `.claude/reference/current-english-lengths.json`
— this is the only authoritative source. To print the current table:

```bash
python .claude/scripts/check-translation-lengths.py --print
```

---

## Fix Guide

### If the translation is TOO SHORT (translated < BUDGET * 0.95)

Expand the workplace's total text (description + bullets combined) naturally:
1. Use fuller grammatical forms
2. Add grammatically necessary conjunctions
3. For fictional languages, use longer, more ornate expressions

### If the translation is TOO LONG (translated > BUDGET * 1.02)

Condense the workplace's total text:
1. Remove filler words
2. Shorten redundant enumerations
3. Replace verbose phrasing with concise forms

---

## Automatic Verification

### Basic usage (human-readable)

```bash
python .claude/scripts/check-translation-lengths.py
```

### Machine-readable JSON output (for AI agents)

The `--json` flag produces structured output that agents can parse for targeted fixes.
Each violation identifies the exact language and field:

```bash
python .claude/scripts/check-translation-lengths.py --json
```

Filter to specific languages:

```bash
python .claude/scripts/check-translation-lengths.py --json --lang=hu,de,fr
```

The JSON output includes:
- `violations[]` — array of per-field violations with `lang`, `field` (e.g. `"summary"` or `"workplace:aegex"`), `status` (`TOO_SHORT` or `TOO_LONG`), and precise character counts
- `locales_with_issues[]` — list of language codes that have any violations
- `locales_ok[]` — list of language codes that passed all checks
- `has_violations` — boolean flag for pipeline logic

### Exit codes

- `0` — all translations are within the tolerance band
- `1` — at least one field in at least one language is outside the tolerance band

### What the script does

- Loads reference lengths (`.claude/reference/current-english-lengths.json`)
- Calculates hero and per-workplace totals
- Compares against the -5% / +2% range
- Exits with 0 if everything is OK, 1 if anything is outside range
