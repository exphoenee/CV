# Career Profile — Usage Rules for Agents

## What Is the Profile Directory?

`profile/` contains one or more Markdown files authored by Viktor Bozzay with detailed,
truthful career information. These files are the **extended evidence base** for AI agents.

They are NOT part of the CV views — they are read-only AI context material.

Viktor may organize the content across as many files as he likes (e.g., one per employer,
or a single combined file). The agents must read all of them.

---

## When to Read the Profile

**Always read all `profile/*.md` files** when performing any of these tasks:
- Optimizing the CV for a job application (`/job-apply`, `job-apply-orchestrator`)
- Reviewing the CV's quality or fit for a role (`/hr-review`)
- Suggesting rephrases, emphasis changes, or skill reordering

Read the profile files **before** running any analysis — they form the factual foundation.

---

## How to Read the Profile

1. List all `.md` files in `profile/`
2. Read each one in full
3. Build `PROFILE_DATA` — a combined knowledge base covering:
   - `PROFILE_EXPERIENCE`: per-employer context, project details, actual metrics
   - `PROFILE_SKILLS`: skill depth, evidence, years of usage
   - `PROFILE_EDUCATION`: education background details
   - `PROFILE_COMMUNITY`: community activities details
   - `PROFILE_EXTRA`: anything else Viktor included

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

| Task | How the profile helps |
|---|---|
| Keyword matching | Find hidden connections: JD mentions "monorepo" — profile details the PNPM migration work |
| Bullet rephrasing | Use Viktor's own words from the profile instead of generic vocabulary |
| Gap assessment | Distinguish true gaps from "not mentioned in CV but Viktor has experience" |
| Metric grounding | Use real numbers Viktor documented (%, time saved, team size, release frequency) |
| Context for summaries | Build summaries from deeper context, not just the short CV bullets |

---

## Profile File Format

Viktor can use any format he finds comfortable. There is no enforced schema.
Agents should extract information semantically — not parse rigid structure.

Common patterns to recognize:
- Section headers for each employer or skill
- Bullet lists of details, metrics, decisions
- Tables for skill depth or technology context
- Free prose describing context or rationale
