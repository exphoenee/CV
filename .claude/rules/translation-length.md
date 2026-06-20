# Translation Character Limit Rules (PAGE-BASED Length Budget)

## Reference

The **reference is a FIXED budget** — it is **NOT** calculated from the current `cv/cv-data.js`.
The budget has a **single source of truth**:

**`.claude/reference/current-english-lengths.json`** — contains the page budget numbers **and**
the tolerance range (`_tolerance`). This is what the Python checker (`check-translation-lengths.py`)
reads, and it is the only authoritative source. Query the script for current values:

```bash
python .claude/scripts/check-translation-lengths.py --print
```

> ⚠️ **Never regenerate the budget** from `cv-data.js` on each run. If the English content
> length changes (e.g. a `/job-apply` rewrites the summary), the budget **does not** change —
> the budget protects the fixed layout capacity, not the current English text length.
> Budget modification is a **deliberate, manual decision**: edit the JSON directly (and adjust
> tolerance there).

**Three page groups are checked:**

| Oldal | Tartalom |
|-------|---------|
| `page1` | summary + workExperience[0] + workExperience[1] |
| `page2` | workExperience[2] + workExperience[3] + workExperience[4] |
| `page3` | workExperience[5] + education + identity.languages (name+level) + community + programmingLanguages (name) + hobbyProjects (name) |

**Nem lokalizált mezők:** education, programmingLanguages, hobbyProjects — ezek csak a
`cv-data.js`-ben léteznek, minden nyelvnél azonos angol hosszal számolnak.

Rationale: views (especially `cv-plain`, `cv-gantt`, cards) display text in fixed-width/height
containers across logical pages. The sum of all text on each page must stay within bounds.

---

## The Rule

```
page1:  BUDGET_page1 * tolerance_min  <=  translated_page1_total  <=  BUDGET_page1 * tolerance_max
page2:  BUDGET_page2 * tolerance_min  <=  translated_page2_total  <=  BUDGET_page2 * tolerance_max
page3:  BUDGET_page3 * tolerance_min  <=  translated_page3_total  <=  BUDGET_page3 * tolerance_max
```

Where each page total = the sum of all text content on that page (as defined in the table above).

The concrete budget values (and tolerance range) live in `.claude/reference/current-english-lengths.json`
— this is the only authoritative source. To print the current table:

```bash
python .claude/scripts/check-translation-lengths.py --print
```

---

## Fix Guide

### If a page is TOO SHORT (total < BUDGET * tolerance_min)

Expand the page's total text naturally across one or more components:
1. Use fuller grammatical forms in any workplace description or bullets
2. Add grammatically necessary conjunctions
3. For fictional languages, use longer, more ornate expressions
4. For the summary: add clarifying connective phrases

### If a page is TOO LONG (total > BUDGET * tolerance_max)

Condense the page's total text across one or more components:
1. Remove filler words
2. Shorten redundant enumerations
3. Replace verbose phrasing with concise forms
4. For community text: tighten without losing key facts

### Priority for fixes

Prefer adjusting workplace components (description + bullets) over the summary,
since the summary is the most visible text. Within a workplace, you have freedom to
rebalance across description, bullets, and project bullets — only the page total matters.

---

## Automatic Verification

### Basic usage (human-readable)

```bash
python .claude/scripts/check-translation-lengths.py
```

### Machine-readable JSON output (for AI agents)

The `--json` flag produces structured output that agents can parse for targeted fixes.
Each violation identifies the exact language and page:

```bash
python .claude/scripts/check-translation-lengths.py --json
```

Filter to specific languages:

```bash
python .claude/scripts/check-translation-lengths.py --json --lang=hu,de,fr
```

The JSON output includes:
- `violations[]` — array of per-page violations with `lang`, `field` (e.g. `"page1"`), `status` (`TOO_SHORT` or `TOO_LONG`), and precise character counts
- `locales_with_issues[]` — list of language codes that have any violations
- `locales_ok[]` — list of language codes that passed all checks
- `has_violations` — boolean flag for pipeline logic

### Exit codes

- `0` — all translations are within the tolerance band
- `1` — at least one page in at least one language is outside the tolerance band

### What the script does

- Loads reference lengths (`.claude/reference/current-english-lengths.json`)
- Loads English `cv-data.js` for non-localized fields (education, programmingLanguages, hobbyProjects)
- For each locale file: extracts all text components, sums into page groups
- Compares each page total against the tolerance band
- Exits with 0 if everything is OK, 1 if anything is outside range
