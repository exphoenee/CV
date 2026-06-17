# Script Placement Rule

The project has **two types of scripts**, and they must be kept in **strictly separated directories**.

---

## `scripts/` — CV Website Product Scripts

This directory contains **ONLY** files needed for the CV website to function:

| What | Example |
|---|---|
| View JS logic | `scripts/cv-plain.js`, `scripts/cv-swagger.js` |
| Components | `scripts/components/` |
| Game engine | `scripts/game/main.js`, `scripts/game/entities/` |
| Data | `scripts/cv-data.js` |
| Localization UI labels | `scripts/locales/hu.js`, `scripts/locales/en.js` (labels) |
| Configuration | `scripts/config.js` |
| Shared API | `scripts/shared.js`, `scripts/locale.js` |
| CSS styles | `styles/cv-plain.css` |
| HTML pages | `index.html`, `cv-plain.html` |

**It is FORBIDDEN** to place AI workflow scripts in this directory.

---

## `.claude/` — AI Workflow Scripts

This is where all AI helper tools belong, for example:

| Location | What | Example |
|---|---|---|
| `.claude/scripts/` | Global AI helper scripts (used by multiple agents/skills) | `cv-ledger.py`, `check-translation-lengths.py` |
| `.claude/skills/<skill>/scripts/` | Skill-specific scripts | `cv-backup/scripts/cv-backup.py` |
| `.claude/agents/<agent>/` | Agent definitions and their scripts | `cv-backup-agent.md` |

**Rule:** If a script is called by an AI agent or skill (e.g. job-apply-orchestrator, cv-translator-agent), it must be under **`.claude/`** — NEVER in the `scripts/` directory.

---

## Checklist

When creating a new script:

1. **What does the script do?**
   - CV website function (view rendering, data, game, music) → `scripts/`
   - AI workflow support (validation, backup, translation, analysis) → `.claude/`

2. **Who calls it?**
   - Browser (HTML `<script>` tag) → `scripts/`
   - AI agent / skill / terminal command → `.claude/`

3. **Where does it go inside `.claude/`?**
   - Used by a single agent/skill → `.claude/skills/<skill>/scripts/` or `.claude/agents/<agent>/`
   - Used by multiple → `.claude/scripts/`

---

## Exceptions

- `scripts/config.js` — although it's part of the CV website, AI agents may read it (e.g. security-review). This is **allowed**, because it's part of the product.
- `scripts/cv-data.js` — the CV data source, AI agents also modify it (e.g. job-apply, cv-improver). This is **allowed**, because it's the product's data.
