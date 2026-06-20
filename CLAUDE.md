# CLAUDE.md — Viktor Bozzay CV Project

## What Is This Project?

A static, browser-rendered CV. **No backend, no bundler, no framework.**
Every page is plain HTML + Vanilla JS ES Modules (`type="module"`) + Vanilla CSS.
An HTTP server is required — the `file://` protocol breaks ES Module CORS.

## Single Source of Truth

**`cv/cv-data.js` → `CV_DATA`**

This is the only place for all CV content. Never duplicate data into other files.
Every view (plain, swagger, json, gantt, scrumboard, game) renders from this object in JavaScript.

## View Pages

| File                 | Target audience                        |
| -------------------- | -------------------------------------- |
| `index.html`         | Landing page (carousel)                |
| `cv-plain.html`      | Reader (traditional CV layout)         |
| `cv-gantt.html`      | Project manager (Gantt chart)          |
| `cv-scrumboard.html` | Scrum master (Kanban board)            |
| `cv-swagger.html`    | Frontend developer (Swagger-style)     |
| `cv-json.html`       | Backend developer (JSON/VS Code style) |
| `cv-game.html`       | Gamer (RPG pixel-art game)             |

## Localization — 12 Languages

Localization system: `scripts/locale.js` → `LocaleManager` → `locale.t('key')`

**Available languages and their files:**

| Code  | File                     | Note                  |
| ----- | ------------------------ | --------------------- |
| `en`  | `cv/locales/en.js`  | English (fallback)    |
| `hu`  | `cv/locales/hu.js`  | Hungarian             |
| `de`  | `cv/locales/de.js`  | German                |
| `fr`  | `cv/locales/fr.js`  | French                |
| `es`  | `cv/locales/es.js`  | Spanish               |
| `it`  | `cv/locales/it.js`  | Italian               |
| `asg` | `cv/locales/asg.js` | Asgardian (fictional) |
| `dot` | `cv/locales/dot.js` | Dothraki (fictional)  |
| `kl`  | `cv/locales/kl.js`  | Klingon (fictional)   |
| `qu`  | `cv/locales/qu.js`  | Quenya (fictional)    |
| `goa` | `cv/locales/goa.js` | Goa'uld (fictional)   |
| `ya`  | `cv/locales/ya.js`  | Yautja (fictional)    |

**Rule:** When adding a new `labels` key, it must go into all 12 files.
`en.js` is the reference — derive structure from it. For fictional languages, follow the style of neighboring keys.

The `content` field is for optional localized content overrides (summary, job description texts).

Detailed rules: [`.claude/rules/localization.md`](.claude/rules/localization.md)

## shared.js — Shared API

Every view imports from here. Full reference: [`.claude/rules/shared-api.md`](.claude/rules/shared-api.md)

**Main exports:**

- `html` / `raw` / `escHtml` — safe HTML template literal
- `skillChip(name, iconFile)` — skill badge HTML
- `refLinks(refs)` — reference link HTML
- `renderBullets(bullets, indent)` — bullet list HTML
- `initHireModal(prefix)` — initialize contact modal
- `hireModalHTML(prefix)` — generate contact modal HTML
- `initBookingModal(prefix)` — initialize calendar booking modal
- `bookingModalHTML(prefix)` — generate booking modal HTML
- `musicPlayerHTML()` — generate music player HTML
- `initThemeToggle(config)` — initialize theme toggle button
- `getSystemTheme()` — detect system light/dark preference
- `saveState` / `loadState` / `restoreCollapseStates` — UI state in localStorage
- `showToast(message)` — notification toast
- `initFormspree()` — stub (actual submission is inside `initHireModal`)
- `checkEmailDomain(email)` — DoH MX record check (async)
- `MUSIC_GENRES` — list of 19 tracks

## config.js — Configuration

`scripts/config.js` holds all global constants and feature flags.
Never hard-code a URL, localStorage key, or flag anywhere else.

- `BOOKING_SCRIPT_URL` — Google Apps Script endpoint
- `CHECK_EMAIL_DOMAIN` — DoH email domain validation on/off
- `THEME_KEY`, `THEME_DARK`, `THEME_LIGHT`, `PLAIN_ONLY_THEMES`
- `MUSIC_STATE_KEY`, `MUSIC_TIME_KEY`, `MUSIC_VOLUME_KEY`, `MUSIC_GENRE_KEY`, `MUSIC_REPEAT_KEY`
- `SFX_VOLUME_KEY`, `CURSOR_KEY`

## Required Elements on Every View Page

Every `cv-*.html` page must include:

1. **Music player** — `musicPlayerHTML()` + `initMusicPlayer()`
2. **Hire Me (contact)** — `hireModalHTML(prefix)` + `initHireModal(prefix)`
3. **Meet (booking)** — `bookingModalHTML(prefix)` + `initBookingModal(prefix)`
4. **Responsive CSS** — usable on mobile, tablet, and desktop

**Music player button rule:**
If the page has a header/menu bar that already contains the music player or its toggle button,
do **NOT** also add the floating bottom-left `#music-toggle` button.
The `#music-player` placement varies per page — either in the header or the bottom-left corner —
but only one location may be used at a time.

## Adding a New View — Required Steps

Detailed checklist: [`.claude/rules/new-view.md`](.claude/rules/new-view.md)

**Short summary:**

1. Create `cv-[name].html`, `scripts/cv-[name].js`, and `styles/cv-[name].css`
2. Add a `.cv-slide` card to `#cv-carousel-stage` in `index.html`
3. Add the new view's label keys to all 12 locale files under `cv/locales/`
4. Ensure responsive CSS at all breakpoints

## Accessibility — Aria Labels

Every interactive element and semantic region has an aria attribute:

- Icon-only button → `aria-label` + `aria-hidden="true"` on the icon
- Decorative icon → `aria-hidden="true"`
- Modal → `role="dialog"` + `aria-modal="true"` + `aria-labelledby`
- Form → fields have `aria-required` + `aria-describedby` (pointing to error span)
- Error span → `role="alert"` + `aria-live`
- Toggle button → `aria-pressed`
- List container → `role="list"` + `aria-label`
- Live region → `role="status"/"alert"` + `aria-live`

**Aria label texts are localized** — set via `locale.t('ariaKey')`, never hard-coded strings.
`aria`-prefixed keys are at the end of `en.js` and must be added to all 12 locale files.

Detailed rules and full key table: [`.claude/rules/aria-labels.md`](.claude/rules/aria-labels.md)

## Responsiveness

Every page must be fully usable on mobile and desktop.
Detailed rules: [`.claude/rules/responsive.md`](.claude/rules/responsive.md)

## AI Workflow — Skills and Agents

Claude Code skills and agents are built into this project to automate development and job-application workflows.

**Available slash commands:**

| Skill                            | Purpose                                                                                                                                                                                         | Review file                                   |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `/locale-check [--fix]`          | Check all 12 locale files for missing keys vs. en.js; `--fix` dispatches locale-agent                                                                                                           | —                                             |
| `/code-review`                     | Locale, aria, security, config, and new-view audit before committing                                                                                                                            | —                                             |
| `/hr-review [JD]`                | CV quality check or job-description-targeted ATS optimization → `review/`                                                                                                                       | `review/YYYY-MM-DD_HHMM_hr-review-SLUG.md`    |
| `/cv-improver <report>`          | Applies hr-review report changes to `cv-data.js`, after confirmation                                                                                                                            | —                                             |
| `/language-reviewer [lang\|all]` | Language quality audit against `.claude/rules/locales/<lang>.md` rules                                                                                                                          | —                                             |
| `/security-review [--fix]`       | Spam/flood audit: Hire Me form, booking → always writes a report to `review/`                                                                                                                   | `review/YYYY-MM-DD_HHMM_security-review.md`   |
| `/cv-backup [label]`             | Snapshot current `cv-data.js` + 11 locale content fields → `cv-versions/DATE_[label]/`                                                                                                          | —                                             |
| `/cv-restore <folder>`           | Restore `cv-data.js` and 11 locale content fields from a `cv-versions/` backup folder                                                                                                           | —                                             |
| `/cover-letter [JD]`             | Write English + Hungarian cover letters grounded in `profile/*.md` → `letters/DATE_company_title/`                                                                                              | —                                             |
| `/job-apply [JD]`                | Full pipeline: ATS analysis → cv-data.js optimization → 11 locale translations → versioned backup → JD save (single file: English + Hungarian + Original) + log → optional cover letter. No argument: interactive `tmp/jd-draft.md` template. | —                                             |
| `/arch-review [--focus=...]`     | Architecture analysis: template duplication, data structure, locale, CSS, tooling → `review/`                                                                                                   | `review/YYYY-MM-DD_HHMM_arch-review-FOCUS.md` |

**Review files:** Every skill that produces a report saves it to `./review/`, in `YYYY-MM-DD_HHMM_<type>[-focus].md` format.

### CV version traceability

Every CV version is identified by an `APP_ID` = its snapshot folder name (`DATE_company_title`).
Three layers — kept in sync by one helper, [`.claude/scripts/cv-ledger.py`](.claude/scripts/cv-ledger.py) — make it traceable **when, which version, what happened**:

1. **Live-file marker block** — a two-line comment at the top of `cv/cv-data.js` and the 12 CV-content locale files (`cv/locales/<lang>.js` — **not** the `-page.js` label files):
   - `// @job-application:` — which version the live CV is based on (set by `/job-apply`, reset by `/cv-restore`).
   - `// @cv-last-change:` — the most recent mutation (set by `/job-apply`, `/cv-improver`, `/cv-restore`).
2. **`cv-versions/history.md`** — append-only audit log, one row per CV event. **Mutations** (job-apply, cv-improver, cv-restore), **backups**, and read-only **reviews** (hr-review, language-reviewer, code-review) all append a row.
3. **`cv-versions/applications.md`** — curated index of job applications (one row per APP_ID: job → CV version + translations + cover letter); the formatted JD lives at `cv-versions/APP_ID/job-description.md` (single file: English + Hungarian + Original).

Skills/agents never hand-edit the marker or the logs — they call `cv-ledger.py` (`mark` / `log` / `current`). Read-only reviews call `cv-ledger.py current` to tag their report with the version they examined. Formats: [`.claude/rules/version-snapshot-format.md`](.claude/rules/version-snapshot-format.md).

Detailed documentation (with Mermaid diagrams): [`devdocs/ai-workflow.md`](devdocs/ai-workflow.md)

## Technology Constraints

- **No npm build / bundler** — do not add webpack, vite, rollup
- **No framework** — React, Vue, Angular are prohibited
- **No backend** — everything is static; Formspree and Google Apps Script are the only exceptions
- **ES Modules** — every JS file uses `type="module"` with relative import paths
- **No `innerHTML` with user input** — always use `escHtml()` or the `html\`\`` tag
- **CRLF line endings** — the repo is committed with CRLF; every file written MUST stay CRLF (enforced by `.editorconfig`). Full rule: [`.claude/rules/line-endings.md`](.claude/rules/line-endings.md)

## Script Placement

- `scripts/` — CV website product files (views, components, game, styles, HTML)
- `cv/` — CV data: `cv/cv-data.js` (single source of truth) + `cv/locales/` (24 locale files)
- `.claude/` — AI workflow scripts (validation, backup, translation, pipeline tools)

Full rule: [`.claude/rules/script-placement.md`](.claude/rules/script-placement.md)
