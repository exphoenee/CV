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
argument-hint: "<hr-review/report-file.md>"
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

| Report section | What to extract |
|---|---|
| `## Javasolt összefoglaló` | The blockquote text — new summary content |
| `## Skill-ek ajánlott sorrendje` | The ordered list of skill names |
| `## Legfontosabb bullet-ok kiemelésre` | Which bullets to move up, with source company/period |
| `## Átfogalmazási javaslatok` | Current text → suggested text pairs |

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

## Step 4 — Apply changes

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

---

## Step 5 — Report results

```
✅ cv-data.js frissítve

Elvégzett változtatások (N db):
  • [SUMMARY] Összefoglaló átírva
  • [SKILL ORDER] skillGroups.primary átrendezve
  • [REPHRASE] 1 bullet átfogalmazva — Aegex Technologies

Kihagyott változtatások (K db):
  • [UNLOCATABLE] "..." — nem találtam meg cv-data.js-ben

Javaslatok:
  • Futtasd /locale-check — ha a summary változott, a hu.js content.summary is frissítendő lehet
  • Futtasd /cv-review — ellenőrizd az eredményt
```

---

## Hard Constraints

- ❌ Never add new skills, technologies, or achievements to cv-data.js
- ❌ Never apply changes without showing the full change plan first
- ❌ Never proceed without explicit user confirmation (step 3)
- ❌ Never silently skip an UNLOCATABLE change — always report it
- ✅ Only modify `summary`, `skillGroups` ordering, and `bullets` text — never touch `skills[]` name/icon, `period`, `company`, `title`, `contacts`, `education`
- ✅ Preserve exact formatting style of cv-data.js (indentation, comma placement, quotes)
- ✅ All user-facing output in Hungarian
