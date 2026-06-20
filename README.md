# CV — Viktor Bozzay

> 🌐 **Language:** 🇬🇧 English · [🇭🇺 Magyar](README-hu.md)

A multi-view, interactive CV in the browser. Six different presentations and an RPG game are built from a single source of truth (CV_DATA). The landing page welcomes visitors with carousel navigation, 12 languages, and theme switching.

## Contents

- [CV — Viktor Bozzay](#cv--viktor-bozzay)
  - [Contents](#contents)
  - [Views](#views)
  - [Architecture](#architecture)
    - [Data layer](#data-layer)
    - [Presentation layer](#presentation-layer)
    - [Shared layer](#shared-layer)
    - [Configuration](#configuration)
  - [Technology stack](#technology-stack)
  - [Directory structure](#directory-structure)
  - [Localization](#localization)
  - [Game engine](#game-engine)
  - [Music player](#music-player)
  - [Theme system](#theme-system)
  - [Email domain validation](#email-domain-validation)
  - [Contact](#contact)
  - [Calendar booking](#calendar-booking)
    - [Backend — Google Apps Script (Code.gs)](#backend--google-apps-script-codegs)
    - [Frontend — Booking Modal](#frontend--booking-modal)
  - [AI workflow](#ai-workflow)
    - [Capability overview](#capability-overview)
    - [Detailed documentation](#detailed-documentation)
  - [Running](#running)

## Views

| Path                 | Target audience    | Description                                                                                                                |
| -------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `index.html`         | —                  | Landing page — carousel navigation toward the six CV views                                                                 |
| `cv-plain.html`      | Reader             | Traditional, printable CV with theme switching (light/dark/superdark/nightvision/predator) and decorative effects         |
| `cv-gantt.html`      | Project manager    | Project timeline in Gantt-chart format (2020–2027), broken down by company and project                                     |
| `cv-scrumboard.html` | Scrum Master       | Kanban/Scrum board — career cards arranged into columns per employer, without drag-and-drop                                |
| `cv-swagger.html`    | Frontend developer | API-documentation-style CV — OpenAPI-like UI with collapsible sections and endpoint blocks (GET/POST/PUT/PATCH/DELETE)     |
| `cv-json.html`       | Backend developer  | JSON / VS Code-style CV — with syntax highlighting, collapsible regions ("folding"), and line numbering                    |
| `cv-game.html`       | Gamer              | RPG game CV — explore the CV in a pixel-art world by visiting houses (stations)                                            |

## Architecture

```
CV_DATA (cv-data.js)
    │
    ├── components/plain/       → cv-plain.js     → cv-plain.html
    ├── components/swagger/     → cv-swagger.js   → cv-swagger.html
    ├── components/json/        → cv-json.js      → cv-json.html
    ├── cv-gantt.js             →                 → cv-gantt.html
    ├── cv-scrumboard.js        →                 → cv-scrumboard.html
    ├── game/world/stations.js  → game/main.js    → cv-game.html
    │
    ├── locale.js  ─── LocaleManager (12 languages)
    ├── config.js  ─── global constants, feature flags
    ├── shared.js  ─── shared helper functions
    └── cv-music-player.js ─── music player
```

Every view uses its own CSS and a dedicated JavaScript entry point (`type="module"`). The render components are separated per view in the `scripts/components/` directory.

### Data layer

`cv/cv-data.js` exports the `CV_DATA` constant object, which holds the entire CV data:

- `meta`, `identity` (name, role, location, contacts, languages)
- `summary` (short introduction)
- `workExperience[]` (jobs with projects, stacks, references)
- `education[]` (studies)
- `skills[]` (technical skills grouped into categories)
- `community[]` (community activities)
- `hobbyProjects[]` (side projects)

The complete field-level schema (types, required/optional fields, examples) is documented in [devdocs/cv-data-schema.md](devdocs/cv-data-schema.md).

### Presentation layer

Each view renders the data with its own set of components:

- **Plain** — HTML sections built with template literals (`header`, `work-item`, `education`, `languages`, `programming-languages`, `community`, `hobby-projects`)
- **Gantt** — Canvas-based timeline chart, with bars colored per company and project, scrollable
- **Scrumboard** — Kanban-style cards arranged into columns per employer, with stack chips
- **Swagger** — OpenAPI-style UI components (`endpoint-block`, `tag-section`, `summary-bar`, `params-table`, `responses`, `stack-chips`, `_icons`)
- **JSON** — Recursively built, syntax-highlighted JSON rendering with foldable regions and numbered lines

### Shared layer

`scripts/shared.js` holds the helper functions used by every view:

- `escHtml` / `skillChip` / `refLinks` / `renderBullets`
- `initHireModal` / `hireModalHTML` — contact form modal (localized)
- `initBookingModal` / `bookingModalHTML` — calendar booking modal (localized)
- `musicPlayerHTML` — music player HTML generation
- `MUSIC_GENRES` — shared music list (18 genres)
- `initFormspree` — Formspree form binding
- `initThemeToggle` / `getSystemTheme` — theme switching
- `saveState` / `loadState` / `restoreCollapseStates` — UI state persistence
- `showToast` — notification toast display

### Configuration

`scripts/config.js` exports the global constants and feature flags:

- `BOOKING_SCRIPT_URL` — Google Apps Script endpoint URL
- `THEME_KEY`, `THEME_DARK`, `THEME_LIGHT`, `PLAIN_ONLY_THEMES` — theme handling
- `MUSIC_STATE_KEY`, `MUSIC_TIME_KEY`, etc. — music player LocalStorage keys
- `SFX_VOLUME_KEY`, `CURSOR_KEY` — game settings

## Technology stack

| Technology              | Usage                                                                                               |
| ----------------------- | --------------------------------------------------------------------------------------------------- |
| Vanilla JS (ES Modules) | No framework, no bundler — pure modular JS                                                           |
| CSS (vanilla)           | Per-view separated CSS files, without a preprocessor                                                 |
| Canvas 2D API           | Game engine rendering and the Gantt chart                                                            |
| BMP → tilemap           | The game map is built from the pixel data of a BMP image, with bitmask autotiling (RPG Maker 2000/2003 style) |
| Intl.DateTimeFormat     | Localized dates in the booking modal (English fallback for fictional languages)                      |
| Formspree               | Sending the contact form                                                                             |
| NippleJS                | Mobile virtual joystick                                                                              |
| LocalStorage            | Persisting UI state, music settings, theme, and language                                            |
| SessionStorage          | Caching email domain checks (MX lookup)                                                              |
| Font Awesome            | Icons                                                                                                |
| Press Start 2P          | Pixel-art retro font (game view)                                                                     |

## Directory structure

```
CV/
├── index.html              # Landing page (carousel)
├── cv-plain.html           # Traditional CV
├── cv-gantt.html           # Gantt-chart CV
├── cv-scrumboard.html      # Scrumboard/Kanban CV
├── cv-swagger.html         # Swagger-style CV
├── cv-json.html            # JSON CV
├── cv-game.html            # RPG game CV
│
├── scripts/
│   ├── cv-data.js          # CV data (single source of truth)
│   ├── shared.js           # Shared helper functions
│   ├── locale.js           # LocaleManager — handles 12 languages
│   ├── config.js           # Global constants, feature flags
│   ├── cv-music-player.js  # Music player
│   ├── cv-plain.js         # Plain entry point
│   ├── cv-swagger.js       # Swagger entry point
│   ├── cv-json.js          # JSON entry point
│   ├── cv-gantt.js         # Gantt entry point
│   ├── cv-scrumboard.js    # Scrumboard entry point
│   ├── cv-index.js         # Index entry point
│   │
│   ├── locales/            # Translation files
│   │   ├── en.js           # English
│   │   ├── hu.js           # Hungarian
│   │   ├── de.js           # German
│   │   ├── fr.js           # French
│   │   ├── es.js           # Spanish
│   │   ├── it.js           # Italian
│   │   ├── asg.js          # Asgardian (fictional)
│   │   ├── dot.js          # Dothraki (fictional)
│   │   ├── kl.js           # Klingon (fictional)
│   │   ├── qu.js           # Quenya (fictional)
│   │   ├── goa.js          # Goa'uld (fictional)
│   │   └── ya.js           # Yautja (fictional)
│   │
│   ├── components/
│   │   ├── lang-dropdown.js  # Language selector dropdown component
│   │   ├── plain/            # Plain CV components
│   │   ├── swagger/          # Swagger UI components
│   │   └── json/             # JSON viewer components
│   │
│   └── game/
│       ├── main.js         # GameEngine class
│       ├── mobile-input.js # Mobile handling
│       ├── audio/          # Sound effect handling
│       ├── map/            # Tilemap + autotile
│       ├── world/          # Stations, spawns
│       └── entities/       # In-game entities
│           ├── base/       # GameObject, Npc, DecorObject
│           ├── player/
│           ├── enemies/    # Skeleton
│           ├── npcs/       # Chicken, Cow, Pig, Sheep
│           ├── obstacles/  # Tree, House, Chest, etc.
│           └── decor/      # Flower, mushroom, rock, etc.
│
├── styles/
│   ├── cv-index.css        # Theme variables, modal + toast styles (shared base)
│   ├── cv-plain.css
│   ├── cv-gantt.css
│   ├── cv-scrumboard.css
│   ├── cv-swagger.css
│   ├── cv-json.css
│   ├── cv-game.css
│   ├── lang-dropdown.css   # Language selector dropdown
│   └── cv-music-player.css
│
├── assets/
│   ├── music/       # 18 MP3s, cover art, Python tools
│   ├── sfx/         # 18 WAV sound effects
│   ├── sprites/     # Pixel-art sprite pack
│   └── images/      # Logos, skill icons, theme icons
│
├── .claude/
│   ├── rules/            # Project conventions, AI rules
│   │   └── translation-length.md   # Translation length budget (fixed, hard-coded)
│   ├── reference/
│   │   └── current-english-lengths.json  # Fixed length-budget JSON (manually maintained)
│   ├── scripts/          # Global AI helper scripts
│   │   ├── cv-ledger.py                   # Marker + history.md handler
│   │   └── check-translation-lengths.py  # Translation length-budget checker
│   ├── agents/           # AI agent definitions
│   └── skills/
│       ├── cv-backup/
│       │   └── scripts/
│       │       └── cv-backup.py     # CV snapshot backup
│       ├── cv-restore/
│       │   └── scripts/
│       │       └── cv-restore.py    # CV restore
│       ├── locale-check/
│       │   └── scripts/
│       │       └── locale-check.py  # Locale key check
│       └── ... (further skill definitions)
│
└── devdocs/                 # Design documents
    ├── ai-workflow.md       # AI skill/agent workflows
    ├── cv-data-schema.md    # CV_DATA field-level schema
    ├── game-dev-notes.md    # Game engine developer notes
    └── skills-and-agents-guide.md  # Full skills & agents reference
```

## Localization

The entire interface is available in 12 languages, through the `LocaleManager` class in `scripts/locale.js`:

| Code  | Language  |
| ----- | --------- |
| `en`  | English   |
| `hu`  | Hungarian |
| `de`  | German    |
| `fr`  | French    |
| `es`  | Spanish   |
| `it`  | Italian   |
| `asg` | Asgardian |
| `dot` | Dothraki  |
| `kl`  | Klingon   |
| `qu`  | Quenya    |
| `goa` | Goa'uld   |
| `ya`  | Yautja    |

The selected language is kept in `localStorage` and persists across page navigations. The browser's default language is detected automatically. For fictional languages (`kl`, `qu`, `goa`, `ya`, `asg`, `dot`), `Intl.DateTimeFormat` falls back to English.

DOM elements marked with the `data-i18n` attribute update automatically when the user switches language — including the text of any open modals.

## Game engine

The RPG engine under `scripts/game/` is built on Canvas 2D:

- **Game loop** — `requestAnimationFrame`-based, with fixed-time-step physics
- **Entity system** — `GameObject` base class → specialized entities (Player, Skeleton, NPCs, Houses, decorations)
- **Tilemap** — map loaded from BMP, with 32×32-pixel tiles and bitmask autotiling (256 variations per tile)
- **Collision detection** — AABB-based, collisionBox system
- **Dialogue system** — stepping up to a House's door shows CV content in an NPC-like window
- **Combat** — Skeleton enemies, attacking (space), health system
- **Pause menu** — pause the game with music controls
- **Mobile support** — NippleJS joystick, responsive UI, orientation awareness

The detailed developer documentation of the engine (adding a new station/entity, the BMP → tilemap pipeline, the collision system, the dialogue system, editing the map) can be read in [devdocs/game-dev-notes.md](devdocs/game-dev-notes.md).

## Music player

18 tracks across 6 genres with their own lyrics (Hungarian and German lyrics). Features:

- Genre selector with a custom dropdown menu
- Play/pause, next/previous, stop
- Repeat modes: none / all / one
- Volume control
- Seek slider
- Lyrics panel
- Fade-in/fade-out transitions
- State persistence in localStorage

## Theme system

The plain view supports multiple themes through CSS variables:

- `light` / `dark` / `superdark` / `nightvision` / `predator`
- The `data-theme` attribute drives the value of the CSS variables
- The choice is kept in localStorage

## Email domain validation

On the contact and booking forms, the email field has real domain validation, without a backend or API key.

- **Method**: Cloudflare DNS-over-HTTPS (`1.1.1.1`) MX record lookup directly from the browser — CORS-friendly, free, unlimited
- **Implementation**: the `checkEmailDomain()` helper in `shared.js`, the `CHECK_EMAIL_DOMAIN` boolean flag in `config.js`
- **Blur listener**: leaving the email field runs the check ahead of time — at submit it loads from the sessionStorage cache
- **Fail-open**: on network error, offline mode, or timeout, the check lets the form through (Formspree/GAS will report an error)
- **Cache**: stored per domain in `sessionStorage` (`mx_gmail.com = '1'`) — no repeat network request for the same domain
- **Localized**: the `errEmailVerifying` and `errEmailNoMailServer` keys in all 12 locale files

| Case                                | Behavior                                |
| ----------------------------------- | --------------------------------------- |
| Valid domain (e.g. `gmail.com`)     | Check passes, form can be submitted     |
| Non-existent domain                 | Error message below the email field     |
| Offline / network error            | Fail-open — the form is let through      |
| Same domain a second time           | No new network request (cache)          |

## Contact

Every view contains a **Hire me** button that opens a modal contact form.

- The message is sent through the [Formspree](https://formspree.io) service
- The modal's texts (title, field labels, placeholders, success confirmation) are fully localized — available in 12 languages
- On language switch, the texts of an open modal update immediately (it reacts to the `localechange` event)
- In the game view, opening the modal freezes the game engine (`isFrozen = true`); it resumes when closed

## Calendar booking

Every view contains a **Meet** button that opens online appointment booking.

### Backend — Google Apps Script (Code.gs)

The booking system uses a [Google Apps Script](https://script.google.com) backend built on the Google Calendar API. The GAS project lives in a separate repository:

> 📁 [GAS](https://github.com/exphoenee/GoogleCalendarAPI) — `Code.gs`, `index.html`, `app.js`, `config.js`, `style.css`

**Architecture:**

```
Browser (scripts/shared.js — initBookingModal)
    │
    ▼ HTTPS GET (query params)
Code.gs (Google Apps Script — doGet)
    │
    ├── Google Calendar API (calendar check + event creation + invite)
    └── ScriptProperties (persisting booking data)
```

**Endpoints:**

| `action` parameter | Operation |
|--------------------|-----------|
| `slots` (default) | List of free slots from the calendar, taking working hours and rate limit into account |
| `debug` | Detailed per-day breakdown for debugging |
| `book` + `name`, `email`, `start`, `end`, `topic` | Create a booking — validation, rate-limit check, calendar event + invite |

**Rate limiting (3 levels):**

1. **Per-email 24-hour block** — only one booking per email address every 24 hours (`RATE_LIMITED` error)
2. **Global daily limit** — a maximum of 5 bookings per day in total (`DAILY_CAP_REACHED` error)
3. **Interview-date tracking** — if a day already has a booking, the whole day disappears from the selector

The frontend translates the error codes into localized messages (the `bookErrRateLimited`, `bookErrDailyCap` locale keys in all 12 languages).

**Configuration (top of Code.gs):**

| Variable | Default | Description |
|----------|---------|-------------|
| `SLOT_MINUTES` | 30 | Length of one slot in minutes |
| `BUFFER_MINUTES` | 30 | Break after each meeting |
| `DAYS_AHEAD` | 21 | How many days ahead to show slots for |
| `GLOBAL_DAILY_MAX` | 5 | Maximum number of bookings per day |
| `WORKING_HOURS` | 8-17 (Mon–Fri) | Working-hour intervals per day |

### Frontend — Booking Modal

On the CV page, the booking UI is implemented with the `initBookingModal()` / `bookingModalHTML()` functions in `scripts/shared.js`:

1. **Date selection** — day cards appear based on the free slots received from GAS
2. **Time selection** — the free slots of the selected day
3. **Entering details** — name, email, topic + Cloudflare Turnstile CAPTCHA
4. **Confirmation** — on a successful booking

Localization:
- Dates and day names are formatted with the `Intl.DateTimeFormat` API in the selected language
- English fallback for fictional languages (`kl`, `qu`, `goa`, `ya`, `asg`, `dot`)
- On language switch, the date cards re-render immediately
- Errors appear in the modal (not via `alert()`); error messages are re-translated on language switch

Security:
- Turnstile CAPTCHA is required to send a booking (submit button disabled until accepted)
- Email domain validation via DNS-over-HTTPS (Cloudflare 1.1.1.1, MX record)
- In the game view, the modal freezes the engine (`isFrozen = true`); a MutationObserver watches for the close

## AI workflow

Claude Code skills (slash commands) and agents have been built for this project to automate development, content-maintenance, and job-application workflows.

### Capability overview

| Area | Capability | Description |
|------|------------|-------------|
| **Translations** | `/locale-check` | Verify that the 12 locale files are in sync with the English reference. `--fix` automatically fills in the missing keys. |
| **Code quality** | `/code-review` | CV-specific code review: locale completeness, aria compatibility, security, config integrity. |
| **Translation proofreading** | `/language-reviewer` | Quality audit of 12 languages based on the language-specific rule files. Reports only — does not auto-fix. |
| **Security** | `/security-review` | Spam/flood audit of the Hire Me and booking modals (Turnstile, cooldown, rate limiting). |
| **Architecture** | `/arch-review` | Full codebase analysis: template duplication, data structure, locale system, CSS, tooling. |
| **HR/ATS optimization** | `/hr-review` | General or job-description-specific ATS quality assessment. Highlights only existing skills — never invents new ones. |
| **CV improvement** | `/cv-improver` | Modifies `cv-data.js` based on an HR-review report. Shows a diff preview before writing. |
| **Cover letter** | `/cover-letter` | Generates English + Hungarian cover letters from `profile/*.md` and `cv-data.js`. |
| **Full job application** | `/job-apply` | Full pipeline: ATS analysis → CV optimization → 11-language translation → version snapshot (`job-description.md` English + Hungarian + original) → optional cover letter. |
| **Version control** | `/cv-backup` / `/cv-restore` | Create and restore versioned snapshots of the CV data in the `cv-versions/` directory. |

### Detailed documentation

The step-by-step description of the skills, agents, their data flows, and the full job-apply pipeline (with Mermaid diagrams) is documented in [devdocs/ai-workflow.md](devdocs/ai-workflow.md). The complete reference guide to the skills and agents can be read in [devdocs/skills-and-agents-guide.md](devdocs/skills-and-agents-guide.md).

## Running

```bash
npx http-server -p 8080 -c-1
```

Because of the modular JS (`type="module"`), an HTTP server is required — the `file://` protocol throws a CORS error.
