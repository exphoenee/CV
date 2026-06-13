---
name: arch-review
description: >
  Architecture review of the CV static site. Analyzes template duplication, data
  structure quality, locale system maintainability, CSS architecture, and light
  build tooling opportunities — while keeping the project as a static HTML+CSS+JS site.
  Dispatches arch-review-agent for deep analysis. Writes a report to ./review/.
version: 1.0.0
author: Viktor Bozzay
disable-model-invocation: false
argument-hint: "[--focus=localization|templating|data|css|tooling|all]"
---

# arch-review — Architecture Review

You are the entry point for the architecture review workflow.
Parse the argument, brief the user on what will be analyzed, then dispatch `arch-review-agent`.

---

## Step 0 — Parse argument

If argument contains `--focus=`:
- Extract the value: `localization`, `templating`, `data`, `css`, `tooling`, or `all`
- Set `FOCUS = <value>`

If no argument or `--focus=all` or unrecognized value:
- Set `FOCUS = all`

---

## Step 1 — Announce scope

Display:

```
🏗️ Architekturális átvizsgálás indul…

Hatókör: FOCUS
Elemzett területek:
  [If FOCUS = all or templating]  • Template duplikáció (cv-*.html fejléc és boilerplate)
  [If FOCUS = all or data]        • Adat struktúra (cv-data.js séma és bővíthetőség)
  [If FOCUS = all or localization] • Locale rendszer (12 fájl, kulcs-szinkron, content/labels split)
  [If FOCUS = all or css]         • CSS architektúra (változók, breakpointok, duplikáció)
  [If FOCUS = all or tooling]     • Tooling / DX (opcionális build script, validáció, lint)

Eredmény: arch-review/ könyvtárba kerülő riport
```

---

## Step 2 — Dispatch arch-review-agent

```
Agent: arch-review-agent
```

Pass:
- `FOCUS` — the selected focus area
- Today's date and current time

Wait for the agent to complete and collect:
- `REPORT_FILE` — path to the written report
- `PAIN_HIGH`, `PAIN_MED`, `PAIN_LOW` — lists of dimension names by severity
- `PROPOSAL_COUNTS` — `{ tier1, tier2, tier3, tier4 }` — number of proposals per tier
- `TOP_RECOMMENDATION` — the single highest-priority action item

---

## Step 3 — Show summary

Display:

```
📐 Architekturális átvizsgálás kész

Hatókör: FOCUS

Értékelési összefoglaló:
  🔴 Magas fájdalompont: [PAIN_HIGH joined by ", " or "—"]
  🟡 Közepes:            [PAIN_MED joined by ", " or "—"]
  🟢 Rendben:            [PAIN_LOW joined by ", " or "—"]

Javaslatok összesen: [tier1+tier2+tier3+tier4] db
  ⚡ Tier 1 — Gyors győzelem: tier1 db
  🔧 Tier 2 — Közepes:       tier2 db
  💪 Tier 3 — Stratégiai:    tier3 db
  [If tier4 > 0:]
  🏗️ Tier 4 — Tech evolúció: tier4 db

Riport: REPORT_FILE

Legfontosabb következő lépés:
  TOP_RECOMMENDATION
```

---

## Hard Constraints

- ❌ Never modify any project file — read-only entry point
- ✅ Always dispatch arch-review-agent with the resolved FOCUS value
- ✅ If arch-review-agent fails to return structured data, display the raw report path and a note
- ✅ All user-facing output in Hungarian
