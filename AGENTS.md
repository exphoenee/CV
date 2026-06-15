# AGENTS.md — Viktor Bozzay CV Project

Summary for AI agents (Claude Code and other assistants). Detailed rules live in `.claude/rules/`.

## Project Nature

- **Static HTML site** — no backend, no bundler, no framework
- **Data:** `scripts/cv-data.js` → `CV_DATA` — single source of truth for all CV content
- **JS:** Vanilla ES Modules (`type="module"`), import/export syntax
- **CSS:** Vanilla CSS, no preprocessor
- **Run:** `npx http-server -p 8080 -c-1` (`file://` protocol breaks ES Module CORS)

## Always Do

### When adding new UI text

Add the new `labels` key to all 12 locale files:
`scripts/locales/` → `en.js`, `hu.js`, `de.js`, `fr.js`, `es.js`, `it.js`, `asg.js`, `dot.js`, `kl.js`, `qu.js`, `goa.js`, `ya.js`

Details: [`.claude/rules/localization.md`](.claude/rules/localization.md)

### When creating a new view page

1. `cv-[name].html` + `scripts/cv-[name].js` + `styles/cv-[name].css`
2. Add a carousel card to `index.html` (`#cv-carousel-stage` div, as a `.cv-slide` element)
3. Add `data-i18n` keys to `en.js` and all 11 other locale files
4. Add responsive CSS

Details: [`.claude/rules/new-view.md`](.claude/rules/new-view.md)

### Required on every view page

- Music player (`musicPlayerHTML()` + `initMusicPlayer()`)
- Hire Me modal (`hireModalHTML(prefix)` + `initHireModal(prefix)`)
- Meet / booking modal (`bookingModalHTML(prefix)` + `initBookingModal(prefix)`)
- Responsive layout

### Music player button rule

If the music player is in the header/menu bar → do **NOT** also place a floating `#music-toggle` button in the bottom-left corner. The two must never appear on the same page simultaneously.

## Never Do

- Duplicate data outside of `cv-data.js`
- Add npm packages (`npm install`) — there is no build pipeline
- Import a framework (React, Vue, etc.)
- Inject user input with `.innerHTML` — always use `escHtml()` or the `html\`\`` tag
- Hard-code a URL, LocalStorage key, or feature flag outside of `config.js`
- ❌ Place AI workflow scripts in `scripts/` — they belong under `.claude/scripts/`, `.claude/skills/<name>/scripts/`, or `.claude/agents/`. The `scripts/` folder is **only** for the CV website product files.

### Accessibility

Every interactive element and semantic region must have an aria attribute.
Aria label texts are localized — set via `locale.t('ariaKey')`, not hard-coded strings.
New aria text → add an `aria`-prefixed key to all 12 locale files.

Details: [`.claude/rules/aria-labels.md`](.claude/rules/aria-labels.md)

## Project-Specific Skills and Agents

### Skills (slash commands)

| Skill                             | Description                                                                                                                                                                                                                      | Review file                                   |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `/locale-check [--fix]`           | Check all 12 locale files for missing keys vs. en.js. `--fix` dispatches locale-agent to add them.                                                                                                                               | —                                             |
| `/cv-review [--fix]`              | CV-specific code review: locale completeness, aria compliance, security, config hygiene, new view checklist.                                                                                                                     | —                                             |
| `/hr-review [job-description]`    | HR/ATS review. Without argument: general CV quality check. With argument (file or inline text): job-description-targeted optimization, surfaces only existing skills. Writes a report when actionable findings exist.            | `review/YYYY-MM-DD_HHMM_hr-review-SLUG.md`    |
| `/cv-improver <report>`           | Applies changes from an hr-review report to `cv-data.js`. Shows a full diff before writing. Never invents new content.                                                                                                           | —                                             |
| `/language-reviewer [lang\|all]`  | Language quality audit: checks `cv-data.js` content and locale files against `.claude/rules/locales/<lang>.md`. Reports only — never auto-fixes.                                                                                 | —                                             |
| `/security-review [--fix]`        | Spam/flood security audit: Hire Me form, booking modal, other interactive surfaces. Always writes a report. `--fix` applies client-side fixes after confirmation.                                                                | `review/YYYY-MM-DD_HHMM_security-review.md`   |
| `/cv-backup [label]`              | Creates a versioned snapshot of the current `cv-data.js` + 11 locale content fields into `cv-versions/`. Optional label is included in the folder name.                                                                          | —                                             |
| `/cv-restore <folder-name>`       | Restores `cv-data.js` and all 11 locale content fields from a `cv-versions/` backup folder. Shows a full preview before applying. Requires confirmation.                                                                         | —                                             |
| `/cover-letter [job-description]` | Writes English + Hungarian cover letters grounded in `profile/*.md` and `cv-data.js`. Without argument: opens `tmp/jd-draft.md` template. Saves to `letters/DATE_company_title/`.                                                | —                                             |
| `/job-apply [job-description]`    | Full job application pipeline: HR/ATS analysis → cv-data.js optimization → 11 locale translation + quality check → versioned snapshot → optional cover letter. Without argument: opens `tmp/jd-draft.md` template interactively. | —                                             |
| `/arch-review [--focus=...]`      | Architecture analysis: template duplication, data structure, locale system, CSS, tooling/DX. Always writes a report. Focus options: `localization\|templating\|data\|css\|tooling\|all` (default: `all`).                        | `review/YYYY-MM-DD_HHMM_arch-review-FOCUS.md` |

**Review files location:** `./review/` — unified directory for all reports.
Filename format: `YYYY-MM-DD_HHMM_<type>[-focus].md`
File header contains: review type, date/time, and the most important metadata for that review.

### CLI Utility Scripts (skill scripts)

Some skills have standalone Python utility scripts in their `scripts/` subdirectory.
These can be run directly from the project root:

| Script                                                | Skill           | Usage                                                                                             |
| ----------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------- |
| `.claude/skills/cv-backup/scripts/cv-backup.py`       | `/cv-backup`    | `python .claude/skills/cv-backup/scripts/cv-backup.py [--label ... \| --company ... --title ...]` |
| `.claude/skills/cv-restore/scripts/cv-restore.py`     | `/cv-restore`   | `python .claude/skills/cv-restore/scripts/cv-restore.py <folder-name> [--list \| --yes]`          |
| `.claude/skills/locale-check/scripts/locale-check.py` | `/locale-check` | `python .claude/skills/locale-check/scripts/locale-check.py [--json]`                             |
| `.claude/scripts/check-translation-lengths.py`               | — (pipeline)    | `python .claude/scripts/check-translation-lengths.py`                                            |


### Agents (invoked via Agent tool)

| Agent                    | Description                                                                                                                                                                                                           | Called by                                  |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `locale-agent`           | Adds new locale key(s) to all 12 locale files, with accurate translations for real languages and style-consistent adaptations for fictional ones.                                                                     | `/locale-check --fix`                      |
| `view-check-agent`       | Validates a view page against the required-elements checklist (music player, modals, toast, aria, responsive CSS, carousel registration, locale keys).                                                                | `/cv-review` (when a new view is detected) |
| `job-apply-orchestrator` | Orchestrates the full job application pipeline: JD parsing, ATS scoring, cv-data.js modification, translation dispatch, backup dispatch. Version conflict resolution is delegated to cv-backup-agent.                 | `/job-apply`                               |
| `cv-translator-agent`    | Translates/adapts changed `cv-data.js` fields into all 11 non-English locale `content` fields. Loads per-language style rules from `.claude/rules/locales/<lang>.md`.                                                 | `job-apply-orchestrator`                   |
| `cv-backup-agent`        | Creates a versioned snapshot folder in `cv-versions/`: writes `cv-data.js` (with metadata header) and copies `scripts/locales/` into `locales/` (12 JS files in original format). Handles version conflict detection. | `/cv-backup`, `job-apply-orchestrator`     |
| `cover-letter-agent`     | Writes English + Hungarian cover letters grounded in `profile/*.md` and `cv-data.js`. Detects JD language for tone calibration. Saves `cover-letter-en.md` + `cover-letter-hu.md` to the target folder.               | `/cover-letter`, `job-apply-orchestrator`  |
| `arch-review-agent`      | Full codebase architecture analysis: template duplication, data structure quality, locale system, CSS, tooling/DX. Produces a scored matrix and tiered proposals.                                                     | `/arch-review`                             |

Skill files: `.claude/skills/`
Agent files: `.claude/agents/`
Skill scripts: `.claude/skills/{skillName}/scripts/` — standalone utility scripts (Python)

- `cv-backup` → `.claude/skills/cv-backup/scripts/cv-backup.py`
- `cv-restore` → `.claude/skills/cv-restore/scripts/cv-restore.py`
- `locale-check` → `.claude/skills/locale-check/scripts/locale-check.py`
  Review reports: `./review/` (unified directory, date-timestamped filenames)
  Cover letters: `letters/DATE_company_title/cover-letter-en.md` + `cover-letter-hu.md` (standalone `/cover-letter` output)
  Version folder: `cv-versions/DATE_company_title/` — contains `cv-data.js`, `locales/` directory (12 JS files), and optionally `cover-letter-en.md` + `cover-letter-hu.md`
  Career profile: `profile/*.md` — Viktor's extended career details used as evidence base by hr-review and job-apply agents
  Temporary files: `tmp/jd-draft.md` (created by `/job-apply` or `/cover-letter` with no argument — safe to delete after use)

## Useful References

- [`CLAUDE.md`](CLAUDE.md) — full project documentation
- [`devdocs/ai-workflow.md`](devdocs/ai-workflow.md) — AI workflow system, Mermaid diagrams, skill/agent descriptions
- [`.claude/rules/localization.md`](.claude/rules/localization.md) — 12 languages, key structure, locale system
- [`.claude/rules/new-view.md`](.claude/rules/new-view.md) — new view page checklist
- [`.claude/rules/shared-api.md`](.claude/rules/shared-api.md) — shared.js exports reference
- [`.claude/rules/aria-labels.md`](.claude/rules/aria-labels.md) — aria label rules and key table
- [`.claude/rules/responsive.md`](.claude/rules/responsive.md) — responsive CSS rules and breakpoints
- [`.claude/rules/script-placement.md`](.claude/rules/script-placement.md) — script folder separation: `scripts/` for product vs `.claude/` for AI tools

