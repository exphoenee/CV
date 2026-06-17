# Career Profile — Usage Rules for Agents

## What Is the Profile Directory?

`profile/` contains Markdown files with detailed, truthful career information.
These files are the **extended evidence base** for AI agents — NOT part of the CV views.

Every file starts with a **YAML frontmatter header** that describes its content.
Agents MUST use the YAML header to **pre-filter** files before reading the full body.

---

## YAML Frontmatter Schema

Every `profile/*.md` file has the following header:

```yaml
---
title: 'Frontend Tech Lead' # job title / file title
seniority: 'Senior' # Junior | Mid | Senior | N/A
period:
  from: '2023-11' # YYYY-MM start (null if not applicable)
  to: null # YYYY-MM end (null = current)
profession: 'software' # software | mechanical | both
type: 'work' # work | education | community | reference
domain: 'enterprise SaaS, compliance' # industry / domain — for JD matching
---
```

### Field descriptions

| Field         | Possible values                            | Usage                                                                               |
| ------------- | ------------------------------------------ | ----------------------------------------------------------------------------------- |
| `title`       | free text                                  | Job title, or file type (e.g. "LinkedIn Profile")                                   |
| `seniority`   | `Junior`, `Mid`, `Senior`, `N/A`           | Seniority level in the position                                                     |
| `period.from` | `YYYY-MM` or `null`                        | Start date                                                                          |
| `period.to`   | `YYYY-MM` or `null`                        | End date (`null` = current)                                                         |
| `profession`  | `software`, `mechanical`, `both`           | Which profession it belongs to                                                      |
| `type`        | `work`, `education`, `community`, `reference` | File type — primary filter                                                      |
| `domain`      | free text                                  | Industry/domain — for JD matching                                                   |
| `leader`      | `true`, `false`                            | Whether Viktor had a leadership/management role in this position                    |
| `skills`      | `[string]`                                 | List of key skills — for quick relevance check without reading the full file        |

---

## How to Read the Profile — With YAML Pre-filtering

### Step 1 — List files

List all `.md` files in `profile/`.

### Step 2 — Parse YAML headers (pre-filter)

For each file, read ONLY the YAML frontmatter (the block between the first two `---` lines).
Do NOT read the full file body yet.

### Step 3 — Filter by relevance (relaxed)

Based on the YAML header, decide if this file is worth reading in full.

**IMPORTANT: Do NOT over-filter by `profession` or `title`.**

- A mechanical engineering role (e.g. CobotX, Hauni) may contain **leadership, project management, mentoring, or cross-functional skills** relevant to a software role
- A founder role (PCB2GTR) may contain **product ownership, business acumen, and end-to-end delivery skills**
- The `leader` field explicitly marks where Viktor led teams — this is relevant regardless of profession

**Skip entirely only if ALL of these apply:**

- `type: "reference"` — these are raw LinkedIn exports. They contain duplicate, potentially outdated data. Skip unless you need to cross-reference a specific LinkedIn claim.
- AND the task has no need for external reference data

**Otherwise, read the file if ANY of these are true:**

- `type: "work"` — always read, regardless of profession (leadership, soft skills, and cross-domain experience may be relevant)
- `type: "community"` AND the task involves mentoring, teaching, or soft skills
- `type: "education"` AND the task involves education, training, or certifications
- `leader: true` — Viktor had a leadership role here, always relevant
- Any overlap between `skills[]` and the task's required skills or keywords

**Exception:** If the task is strictly scoped (e.g. "find only React experience"), you may use `skills[]` to prioritize which files to read first — but still scan all `type: "work"` files for hidden relevance.

### Step 4 — Read filtered files in full

Read only the files that passed the filter. Build `PROFILE_DATA` from the combined content.

### Step 5 — Build structured knowledge base

```
PROFILE_DATA = {
  experience: {          // from type: "work" files
    [companyId]: {       // e.g. "aegex"
      title, seniority, period, profession, domain,
      body: "<full file content>"
    }
  },
  education: { ... },    // from type: "education" files
  community: { ... },    // from type: "community" files
  references: { ... }    // from type: "reference" files (if explicitly needed)
}
```

### Step 6 — No match fallback

If after filtering, NO files remain relevant (e.g., all are `type: "reference"` and the task needs factual work data):

- ❌ Fall back to `cv-data.js` only
- ✅ Note: "No relevant work data found in profile files — working from cv-data.js only."

---

## Anti-Hallucination Rule — CRITICAL

**Only suggest content that can be traced to `cv-data.js` OR `profile/*.md`.**

If a skill, achievement, metric, or claim is not present in either source:

- ❌ Do NOT suggest adding it to the CV
- ❌ Do NOT rephrase a bullet to imply it
- ❌ Do NOT use it as evidence of fit for a JD requirement

If the profile files do not exist or are empty → fall back to `cv-data.js` only and note this limitation.

---

## What the Profile Can Help With

| Task                  | How the profile helps                                                                     |
| --------------------- | ----------------------------------------------------------------------------------------- |
| Keyword matching      | Find hidden connections: JD mentions "monorepo" — profile details the PNPM migration work |
| Bullet rephrasing     | Use Viktor's own words from the profile instead of generic vocabulary                     |
| Gap assessment        | Distinguish true gaps from "not mentioned in CV but Viktor has experience"                |
| Metric grounding      | Use real numbers Viktor documented (%, time saved, team size, release frequency)          |
| Context for summaries | Build summaries from deeper context, not just the short CV bullets                        |

---

## Profile File Markdown Body Format

After the YAML header, the file body uses free-form Markdown.
Agents should extract information semantically — not parse rigid structure.

Common patterns to recognize:

- Section headers for each employer or skill
- Bullet lists of details, metrics, decisions
- Tables for skill depth or technology context
- Free prose describing context or rationale
- HTML comments (`<!-- ... -->`) contain prompts and reminders — read them for context, but do NOT treat them as CV content
