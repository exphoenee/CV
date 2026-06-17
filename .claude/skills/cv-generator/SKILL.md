---
name: cv-generator
description: >
  Generates a complete cv-data.js from scratch using profile/*.md files.
  Parses YAML frontmatter + markdown body from work, education, and community
  profile files, then produces a fully structured cv-data.js compatible with
  the CV_DATA schema. Also generates all 12 locale content files.
  Use when cv-data.js is missing, corrupted, or needs to be regenerated.
version: 1.0.0
author: Viktor Bozzay
disable-model-invocation: false
argument-hint: '[--dry-run]'
---

# cv-generator — Generate CV Data from Profile Files

You generate a complete `scripts/cv-data.js` from scratch by reading `profile/*.md`
files. Use when `scripts/cv-data.js` does not exist, is empty, or needs regeneration.

**You never invent content.** Every piece of data must be traceable to a profile file
or be a sensible default (e.g., meta information, game coordinates).

---

## Step 0 — Check existing cv-data.js

Check if `--dry-run` was passed as argument. If yes, skip Step 0 and jump to Step 11.

Otherwise, check if `scripts/cv-data.js` exists and has valid content.

### If exists and valid:

Show a summary:
```
📋 A scripts/cv-data.js már létezik (vVERSION — N munkahely, M skill csoport)
   Felülírjam?
```

Wait for user confirmation (`y` / `n`):
- If `n`: stop without modifying anything.
- If `y`:

  **Before overwriting, create a backup:**
  Create a manual backup via `cv-backup-agent` with label `manual_pre-generator`.
  Wait for the backup to complete. If it fails, abort:
  ```
  ❌ A biztonsági mentés nem sikerült — nem írom felül a cv-data.js-t.
  ```

  Then extract anything worth preserving from the old file:
  - `meta.version` → increment (e.g., 4.2.0 → 5.0.0)
  - `skillNote` if customized

  **Do NOT extract game coordinates** — those are hard-coded and must never change (see Step 3g).

### If not exists or empty:

Proceed with defaults (version: `5.0.0`).

---

## Step 1 — Collect all profile files

List all files in `profile/` matching `*.md`.

Read all of them. For each file, parse the YAML frontmatter (between the `---` delimiters)
and extract:

| Field       | Description                                              |
|-------------|----------------------------------------------------------|
| `title`     | Job title or role name                                   |
| `seniority` | Seniority level (Senior, Mid, Junior, N/A)               |
| `period`    | `{ from: string \| null, to: string \| null }`           |
| `profession`| `software`, `mechanical`, or `both`                      |
| `type`      | `work`, `community`, `education`, or `reference`         |
| `domain`    | Industry domain                                          |
| `leader`    | `true` or `false` — whether this was a leadership role   |
| `skills`    | Array of skill names                                     |

Also extract the markdown body (everything after the second `---`).

Categorize files by `type`:

- `type: work` — work experience entries
- `type: community` — community section
- `type: education` — education section
- `type: reference` — supplementary data (linkedin-* files, _basic.md, personal.md, bio.md)

**Handle files without YAML frontmatter:** If a file does not contain `---` delimiters
or cannot be parsed as YAML (e.g., `_basic.md` which is plain markdown notes), skip it
silently — it's a personal note, not structured data.

**Inclusion rules for `type: work`:**
- Include ALL `type: work` entries regardless of `profession` — the CV covers the full career from
  mechanical engineering to frontend development. This includes `pcb2gtr.md` (hardware founder) and
  `enforsol.md`, `general-automotive.md`, `hauni.md` (mechanical/automation roles).
- Exception: `_basic.md` is excluded (it's a personal note, not a job).

**Multi-role handling (e.g., Hauni):**
- `hauni.md` has 4 roles within the same company spanning 12+ years.
- Create **one** `workExperience` entry for the company.
- Use the **most senior title** as `title` (`"Senior R&D Mechanical Engineer"`).
- Merge `description` from the most significant role (Test & Measurement Systems).
- Merge all `bullets` from all roles into the single bullets array.
- Use the full period range (`2005-08` to `2018-01`).

---

## Step 2 — Extract identity information

Read `profile/personal.md` as the **primary source** for identity data:

- **meta** → name, role, version, accentColor, description
- **contacts** → email (bozzay.viktor@gmail.com), phone (+36306106608), github, linkedin, website, location
- **languages** → Hungarian: Native, German: Upper Intermediate (B2), English: Upper Intermediate (B2)

Also read `profile/linkedin-profile.md` for supplementary context:

- **role / headline** → from the `## Viktor Bozzay — LinkedIn Profile` summary (used if personal.md is unavailable)

If `personal.md` is unavailable (fall back to hardcoded defaults):

> 💡 **bio.md** also contains language context (`## Nyelvtudás` table with written/spoken/cert details) — useful for cover letter generation and HR context, but not directly needed for cv-data.js.

```js
meta: {
  name: "Viktor Bozzay",
  role: "Frontend Tech Lead",
  version: "5.0.0",
  accentColor: "#ff7024",
  description: "Curriculum Vitae",
},
identity: {
  name: "Viktor Bozzay",
  role: "Developer",
  location: "Pécs, Hungary",
  contacts: [
    { label: "Pécs, Hungary", url: null },
    { label: "github.com/exphoenee", url: "https://github.com/exphoenee" },
    { label: "linkedin.com/in/viktorbozzay", url: "https://linkedin.com/in/viktorbozzay/" },
    { label: "bozzayviktor.hu", url: "https://www.bozzayviktor.hu" },
    { label: "bozzay.viktor@gmail.com", url: "mailto:bozzay.viktor@gmail.com" },
    { label: "+36306106608", url: null },
  ],
  languages: [
    { name: "Hungarian", level: "Native", comment: null },
    { name: "German", level: "Upper Intermediate (B2)", comment: null },
    { name: "English", level: "Upper Intermediate (B2)", comment: null },
  ],
},
```

---

## Step 3 — Extract work experience entries

For each file with `type: work`, extract:

### 3a — Core metadata from YAML frontmatter

| cv-data.js field | Profile YAML source               |
|------------------|-----------------------------------|
| `id`             | Derive from company name: lowercase, no spaces. E.g. `"Aegex Technologies"` → `"aegex"` |
| `company`        | Company name from the markdown heading (`# COMPANY — Title`) |
| `logo`           | Use the logo filename mapping table below |
| `title`          | `title` field in YAML frontmatter |
| `period.from`    | `period.from`                     |
| `period.to`      | `period.to` — `null` if current   |
| `isCurrent`      | `true` if `period.to` is `null`   |
| `periodLabel`    | Format: `"Mon YYYY - Mon YYYY"` or `"Mon YYYY - Present"` if current. Use month abbreviations: Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec |

**Logo filename mapping:**

| Company                          | Logo filename       |
|----------------------------------|---------------------|
| Aegex Technologies               | `aegex.png`         |
| Deutsche Telekom IT Solutions HU | `telekom.png`       |
| Scolia Technologies Ltd.         | `scolia.png`        |
| Cubicfox                         | `cubicfox.png`      |
| CobotX Technologies              | `cobotx.png`        |
| WebforSol                        | `websol.png`        |
| EnforSol                         | — (no logo)         |
| General Automotive               | — (no logo)         |
| Hauni Hungaria Gépgyártó Kft.    | — (no logo)         |
| PCB2GTR                          | — (no logo)         |

If no logo file: omit the `logo` field or set to empty string.

### 3b — Description from markdown body

Look for the description paragraph — usually the first substantial paragraph after
the company heading, or under `## Amit építettem` / `### Amit építettem`.

Use the first substantial paragraph (skip lines starting with `<!--` comments).

### 3c — Bullets from markdown body

Look for bullet points (`- item`) under project sections or the main body.
Skip comment lines (`<!-- ... -->`).

### 3d — Projects from markdown body

If the file has multiple project subsections (e.g., `## SafeSy projekt`, `## FACTS projekt`)
with distinct project names, extract each as a `Project` object:

```js
{ name: "SafeSy", subtitle: "Project description", bullets: ["item1", "item2"] }
```

### 3e — Skills

Use the `skills` YAML array from frontmatter. Map each skill name to `{ name, icon }`:

| Skill                    | Icon file                       |
|--------------------------|---------------------------------|
| React, React.js          | `react.svg`                     |
| Svelte                   | `svelte.svg`                    |
| TypeScript               | `typescript.svg`                |
| JavaScript               | `javascript.svg`                |
| Node.js                  | `nodeJS.svg`                    |
| Express, ExpressJS       | `ExpressJS.svg`                 |
| MySQL                    | `mysql.svg`                     |
| Python                   | `python.svg`                    |
| SCSS                     | `scss.svg`                      |
| HTML                     | `html.svg`                      |
| CSS                      | `css.svg`                       |
| Vite                     | `vite.svg`                      |
| PNPM                     | `pnpm.svg`                      |
| Webpack                  | `webpack.svg`                   |
| NPM                      | `npm.svg`                       |
| Next.js                  | `nextjs.svg`                    |
| Jest                     | `jest.svg`                      |
| Vitest                   | `vitest.svg`                    |
| Playwright               | `playwright.svg`                |
| Claude                   | `claude.svg`                    |
| Codex                    | `codex.svg`                     |
| PHP                      | `php.svg`                       |
| Laravel                  | `Laravel.svg`                   |
| MongoDB                  | `mongodb.svg`                   |
| NestJS                   | `NestJS.svg`                    |
| jQuery                   | `jquery.svg`                    |
| React Redux, Redux       | `react_redux.svg`               |
| Redux Saga               | `redux_saga.svg`                |
| Styled Components        | `styled_components.svg`         |
| WebSocket                | `websocket.svg`                 |
| CI/CD                    | — (no icon)                     |
| Any robotics skill       | — (no icon)                     |
| Any unmatched skill      | — (no icon)                     |

For skills without an icon, omit the icon field.

### 3f — Refs from markdown body

Look for `**Link:**` or URLs in the body text.

### 3g — Game coordinates (FIXED — DO NOT MODIFY)

**The game station coordinates are HARD-CODED and must NEVER be changed.**
The game map has 8 fixed stations. Your job is to map each profile entry to the correct
station. Do NOT try to calculate, generate, or preserve coordinates from an old cv-data.js.

| Station id     | x    | y    | tech                                                            | description                                                  | Assigned to                                                  |
|----------------|------|------|-----------------------------------------------------------------|--------------------------------------------------------------|--------------------------------------------------------------|
| identity (HQ)  | 180  | 100  | `Frontend Tech Lead · Pécs, HU`                                 | Personal HQ & Contact Details                                | `identity.game` — always                                     |
| aegex          | 437  | 340  | `Svelte · React · TypeScript · Node.js · Express · MySQL · ...` | Aegex Technologies (Current)                                 | `workExperience` entry with `id: "aegex"`                   |
| telekom        | 183  | 342  | `React · TypeScript · Redux · Webpack · Agile`                  | Deutsche Telekom IT Solutions                                | `workExperience` entry with `id: "telekom"`                 |
| scolia         | 1142 | 100  | `React · Redux Saga · WebSocket · MongoDB · Webpack`            | Scolia Technologies                                          | `workExperience` entry with `id: "scolia"`                  |
| cubicfox       | 892  | 102  | `React · Next.js · TypeScript · SCSS · Jest · Webpack`          | Cubicfox Technologies                                        | `workExperience` entry with `id: "cubicfox"`                |
| cobotx         | 661  | 104  | `Universal Robots · PLC · Machine Vision · Python`              | CobotX Technologies                                          | `workExperience` entry with `id: "cobotx"`                  |
| webforsol      | 439  | 102  | `React · Next.js · NestJS · PHP · Laravel · MySQL · MongoDB`    | WebforSol (Freelance)                                        | `workExperience` entry with `id: "webforsol"`               |
| education      | 762  | 338  | `University of Pécs · Neumann János Awards · Hobby Arcade`     | Education, Community & Projects                              | `education.game` — always                                     |

**Rules:**
- These 8 stations are the ONLY stations on the game map. The coordinates NEVER change.
- Assign each station to the matching `workExperience` entry or `education`/`identity` section.
- Entries NOT in this table (e.g., mechanical roles like Hauni, EnforSol, General Automotive,
  PCB2GTR) do NOT have a game station — omit the `game` field entirely for those entries.
- **Never read, preserve, or copy game coordinates from an existing cv-data.js.**
  The table above is the single source of truth.

### 3h — hasDecor

Set `true` for software roles (`profession: software`), `false` for mechanical roles (`profession: mechanical`).

For roles where `profession` is `both` (e.g., founder/leadership roles): default to `true`.

---

## Step 4 — Extract summary

Read `profile/linkedin-profile.md`:

- The summary is in the `## Summary` section
- Use the second paragraph (skip the engineering leader intro → focus on frontend)
- If unavailable, use the existing cv-data.js summary (from Step 0 extraction)

**Fallback summary** (when both linkedin-profile.md AND existing cv-data.js are unavailable):

```
Frontend Tech Lead with 5+ years of frontend experience, specializing in frontend architecture,
system design, and large-scale legacy modernization with TypeScript, Svelte, React, and Node.js.
I've led full rewrites and migrations of enterprise systems to modern stacks, improving
maintainability and scalability of core platforms. I've introduced AI-assisted development
workflows and built CI pipelines with automated quality gates, significantly improving delivery
speed and release reliability. I lead and mentor engineers, focusing on evidence-driven
refactoring and sustainable, system-level frontend foundations.
```

---

## Step 5 — Extract education

Read `profile/education.md` or `profile/linkedin-education.md`:

- `institution` → `"Faculty of Engineering and Information Technology - University of Pécs"`
- `degrees` → array of `{ title, years }` from the degree entries (use the second heading level for degree names, year ranges from the text)
- `game` → default game coordinates for the education station (see Step 3g)

---

## Step 6 — Extract community & hobby projects

### Hobby Projects

Read `profile/personal.md` as the **primary source** (the `## Hobby Projects` section has the exact cv-data.js list with names and URLs).
Each row becomes a `{ name, url }` entry.

### Community

Read `profile/community.md`:

Use the text from the `## Mátyás Király utcai Általános Iskola` section.
Build a single string describing:
- Pro bono after-school IT and programming club
- Curriculum design
- Competition results (Hack and Code, Neumann János)

If community.md is unavailable: set community to empty string.

---

## Step 7 — Build skillGroups + programmingLanguages

Read `profile/linkedin-skills.md` for the categorized skills list.

Build these groups:

| Group      | Skills                                                        |
|------------|---------------------------------------------------------------|
| `primary`  | TypeScript, JavaScript, React, Svelte, HTML, CSS, SCSS        |
| `backend`  | Node.js, Express.js, NestJS, PHP, MySQL, MongoDB, REST API    |
| `testing`  | Jest, Vitest, Playwright, Cypress                             |
| `tooling`  | Vite, Webpack, PNPM, Next.js, Git, CI/CD                      |
| `ai`       | Claude, Codex, Anthropic Claude, Artificial Intelligence (AI) |
| `robotics` | Universal Robot, OnRobot, Machine Vision, PLC, LabVIEW, FANUC |

Each group: `{ list: [skill names], comment: null }`.
Exception: `testing.comment = "yes, all three"`.

Also add `skillNote`:
```js
skillNote: {
  key: "willRefactorYourEntireCodebaseIf",
  value: "evidence justifies it",
  comment: "(often)",
}
```

### programmingLanguages

Extract from the `## Programming Languages` section of linkedin-skills.md, plus detected from work.
Always include: TypeScript, JavaScript, CSS, SCSS, HTML, Python, PHP.
Map each to `{ name, icon }` using the icon table in Step 3e.

---

## Step 8 — Build meta

```js
meta: {
  name: "Viktor Bozzay",
  role: "Frontend Tech Lead",        // from profile/linkedin-profile.md headline
  version: version_from_step_0 || "5.0.0",
  accentColor: "#ff7024",
  description: "Curriculum Vitae",
},
```

---

## Step 9 — Write scripts/cv-data.js

Build the complete CV_DATA object and write to `scripts/cv-data.js`:

```js
/**
 * cv-data.js
 * Central CV data object — single source of truth for all CV views.
 * Load before any view-specific script.
 *
 * Auto-generated by cv-generator skill on YYYY-MM-DD.
 */
export const CV_DATA = {
  meta: { ... },
  identity: { ... },
  summary: "...",
  workExperience: [ ... ],
  education: { ... },
  skillGroups: { ... },
  skillNote: { ... },
  programmingLanguages: [ ... ],
  community: "...",
  hobbyProjects: [ ... ],
};
```

Use the exact same JS syntax style as existing cv-data.js:
- Single quotes for strings
- Trailing commas on the last item in objects/arrays
- 2-space indentation for object nesting
- Consistent comma placement (comma before newline at end of each line except last)

---

## Step 10 — Generate locale content files

### English (scripts/locales/en.js)

```js
export const EN = {
  content: null,  // English uses CV_DATA directly
};
```

### Non-English locales

For each of the 11 translated languages (`hu`, `de`, `fr`, `es`, `it`, `asg`, `dot`, `kl`, `qu`, `goa`, `ya`):

Read the existing file first. If it exists and has a `content` field with data, **preserve it unchanged**.

If the file does not exist or has no `content` data, write:

```js
export const XX = {
  content: null,  // Falls back to English
};
```

For `hu` and `de`: if the existing file has translations, keep them. If generating fresh,
set `content: null` (safe fallback to English).

For fictional languages (`asg`, `dot`, `kl`, `qu`, `goa`, `ya`): always `content: null`.

**Do NOT touch the `-page.js` files** — those hold UI labels, not CV content.

---

## Step 11 — (If --dry-run) Show preview without writing

If `--dry-run` was passed as argument:

```
📋 CV generálás előnézet (--dry-run):

Forrás fájlok: profile/*.md (N darab)
Munkahelyek: N
Skill csoportok: M
Közösség: van/nincs
Hobby projektek: N

Nem írtam fájlokat a --dry-run miatt.
```

---

## Step 12 — Report results

```markdown
✅ CV generálva a profile/*.md fájlokból

📄 scripts/cv-data.js — létrehozva (N munkahely, M skill csoport)
🌐 12 locale fájl — ellenőrizve (en: content:null, 11 fordítás: megtartva)
📁 Forrás: profile/*.md (N fájl feldolgozva)

Munkahelyek:
  • aegex — Frontend Tech Lead @ Aegex Technologies (Nov 2023 – Present)
  • telekom — Developer @ Deutsche Telekom IT Solutions HU (Jul 2023 – Nov 2023)
  • scolia — Frontend Developer @ Scolia Technologies (Jan 2023 – Jul 2023)
  • cubicfox — Frontend Developer @ Cubicfox (Sep 2022 – Jan 2023)
  • cobotx — Engineering Manager @ CobotX Technologies (Aug 2021 – Aug 2022)
  • webforsol — Freelancer Full Stack Developer @ WebforSol (Jun 2020 – Nov 2022)
  • enforsol — Mechanical Engineer & Industrial Automation Specialist (Jan 2018 – Aug 2021)
  • general-automotive — Robotics and Integrated Intelligence Expert (Jan 2018 – Aug 2021)
  • hauni — Senior R&D Mechanical Engineer (Aug 2005 – Jan 2018)
  • pcb2gtr — Founder @ PCB2GTR (Jun 2015 – Present)

Javaslatok:
  • Ellenőrizd a summary szövegét — lehet finomhangolni
  • Futtasd /locale-check a locale fájlok ellenőrzéséhez
  • Futtasd /code-review a teljes ellenőrzéshez
```

---

## Hard Constraints

- ❌ Never invent content — every bullet, skill, and project must be traceable to profile/*.md or linkedin-*.md
- ❌ Never modify `profile/*.md` — read-only
- ❌ Never modify `-page.js` files (those are UI labels, not CV content)
- ✅ Preserve existing locale `content` fields — only overwrite if missing
- ✅ Preserve the exact JS syntax style (single quotes, trailing commas, 2-space indent)
- ✅ If cv-data.js already exists with valid content, create a backup and ask before overwriting
- ✅ All user-facing output in English
- 🔒 Game station coordinates are FIXED (Step 3g) — never read, preserve, or modify them from any source
