# Refaktorálási terv: Egységes CV adatmodell + Template alapú renderelés

## Jelenlegi állapot (probléma)

A CV adatai **5 helyen** duplikálva, eltérő formátumban:

| Forrás | Adatmennyiség | Formátum |
|--------|---------------|----------|
| `cv-plain.html` | ~600 sor CV | Inline HTML (teljes DOM struktúrával) |
| `scripts/cv-json.js` | ~400+ sor a `L[]` tömbben | JS tömb, HTML escaped JSON sorok |
| `cv-swagger.html` | ~200KB egyetlen HTML-ben | Swagger stílusú HTML szekciók |
| `scripts/game/world/stations.js` | 8 CV állomás | Template literal stringek |
| `index.html` | Név, role, linkek | Inline HTML |

**Következmény:** Ha változik a CV (pl. új munkahely, új skill), mind az 5 fájlt kézzel kell szerkeszteni. Ez elkerülhetetlenül inkonzisztenciához vezet.

---

## Célarchitektúra

```
scripts/
  cv-data.js          ← ÚJ! Központi CV adat objektum
  cv-plain.js         ← Átírva: template-t használ, nincs benne adat
  cv-json.js          ← Átírva: template-t használ
  cv-swagger.js       ← Átírva: template-t használ
  game/world/stations.js  ← Átírva: CV_DATA-ból generál

styles/
  (változatlan)
```

---

## 1. lépés: `scripts/cv-data.js` — Központi adatobjektum

Egyetlen `CV_DATA` globális objektum, ami a teljes CV-t tartalmazza:

```js
var CV_DATA = {
  meta: { name: "Viktor Bozzay", role: "Frontend Tech Lead", version: "4.2.0" },
  identity: {
    name: "Viktor Bozzay",
    role: "Frontend Tech Lead",
    location: "Pécs, Hungary",
    accentColor: "#ff7024",
    contact: {
      email: { value: "bozzay.viktor@gmail.com", label: "bozzay.viktor@gmail.com", url: "mailto:bozzay.viktor@gmail.com" },
      phone: { value: "+36306106608", label: "+36 30 610 6608", url: "tel:+36306106608" },
      github: { value: "github.com/exphoenee", url: "https://github.com/exphoenee" },
      linkedin: { value: "linkedin.com/in/viktorbozzay", url: "https://linkedin.com/in/viktorbozzay/" },
      website: { value: "bozzayviktor.hu", url: "https://www.bozzayviktor.hu" }
    },
    languages: [
      { name: "Hungarian", level: "native", comment: "no runtime errors" },
      { name: "German", level: "B2", comment: "can order Schnitzel and read stack traces" },
      { name: "English", level: "B2", comment: "you're reading this — proof it works" }
    ]
  },
  summary: {
    text: "Frontend developer who operates at the architecture level — not just building features, but evaluating whether the foundation they sit on is worth keeping. Led full rewrites of legacy systems, migrated codebases to modern stacks, and designed AI-assisted development workflows that measurably accelerate delivery. Refactors deliberately: only when evidence justifies it, always with a clear plan. Engineering background means thinking in systems, not just components.",
    wittyComment: "// translation: will rewrite your entire codebase if provoked (and the evidence justifies it)"
  },
  workExperience: [
    {
      company: "Aegex Technologies",
      logo: "aegex.png",
      title: "Frontend Tech Lead",
      current: true,
      period: { from: "2023-11", to: null },
      teamSize: 2,
      description: "Assessed two legacy systems and drove the architectural decisions for modernizing each. Took full ownership of both SafeSy and FACTS from design through delivery. Introduced AI-assisted workflows and a CI pipeline with automated quality checks; refactoring is ongoing and evidence-driven.",
      projects: {
        SafeSy: {
          type: "Internal manufacturing management system",
          scope: "Cross-role platform — production, office, executives, partners",
          highlights: [
            "Designed and built the internal Aegex Svelte component library used across the platform",
            "Manages workflows, inventory, and real-time data tracking across all user roles",
            "Built a subscribable daily email report system",
            "Contributed to Express backend including SQL query development"
          ],
          refs: []
        },
        FACTS: {
          type: "Feedstock and Compliance Tracking System",
          releaseCycleBeforeDays: 30,
          releaseCycleAfterDays: 14,
          highlights: [
            "CI pipeline with automated quality checks introduced from scratch",
            "Migrated to a monorepo, extracted shared FACTS/Driver code into a private package",
            "Built a CLI tool for monorepo workflow management",
            "Claude AI-assisted dev workflow cut release cycle 2× (targeting 4×)"
          ],
          refs: ["facts.aegex.com", "driver.aegex.com"]
        }
      },
      stack: ["Svelte", "React", "TypeScript", "Node.js", "ExpressJS", "MySQL", "Vite", "PNPM", "Jest", "Vitest", "Playwright", "SCSS", "Python", "Claude", "Codex"],
      refs: ["facts.aegex.com", "driver.aegex.com"]
    },
    {
      company: "Deutsche Telekom IT Solutions HU",
      logo: "telekom.png",
      title: "Developer",
      current: false,
      period: { from: "2023-07", to: "2023-11" },
      description: "Agile environment with continuous API integration between frontend and AI backend.",
      highlights: [
        "Built type-safe UI components integrated with AI-driven backend and real-time analysis display",
        "Created intuitive interfaces for managing and viewing automated test results",
        "Continuous frontend–AI backend integration in fast-paced Agile sprints"
      ],
      refs: ["mobiledevice.cloud/order/ai4test"],
      stack: ["React", "TypeScript", "Node.js", "NPM", "Jest", "Styled Components", "React Redux", "Webpack"]
    },
    {
      company: "Scolia Technologies Ltd.",
      logo: "scolia.png",
      title: "Frontend Developer",
      current: false,
      period: { from: "2023-01", to: "2023-07" },
      domain: "real-time automatic scorekeeping for steel-tip darts",
      description: "Frontend for a real-time darts scorekeeping platform — where milliseconds matter and the UI has to keep up with a flying dart.",
      highlights: [
        "Built responsive, dynamic UIs in close collaboration with the design team",
        "Created interactive visualizations for real-time progress tracking and performance insights",
        "WebSocket-driven live score updates — because darts is apparently a realtime sport"
      ],
      refs: ["scoliadarts.com"],
      stack: ["React", "Redux Saga", "WebSocket", "Jest", "MongoDB", "SCSS", "Webpack"]
    },
    {
      company: "Cubicfox",
      logo: "cubicfox.png",
      title: "Frontend Developer",
      current: false,
      period: { from: "2022-09", to: "2023-01" },
      description: "Contributed to establishing the team's code conventions and standards. Redesigned client requirements gathering — clearer specs, fewer revision cycles.",
      highlights: [
        "Responsive, cross-browser UI development with strict quality standards",
        "Established team code conventions — arrived, fixed things, left. classic.",
        "Strong communication, collaboration, and attention to detail",
        "Effective at gathering client requirements and adapting to change"
      ],
      refs: ["fundmypitch.com"],
      stack: ["React", "Next.js", "TypeScript", "Styled Components", "SCSS", "Jest", "Webpack"]
    },
    {
      company: "CobotX Technologies",
      logo: "cobotx.png",
      title: "Technical Project Manager",
      current: false,
      period: { from: "2021-08", to: "2022-08" },
      teamSize: 4,
      hasRobots: true,
      description: "Engineering Manager at a robotics integrator — built and led a team of 4 engineers, bridging mechanical engineering background with software delivery and people management.",
      highlights: [
        "Developed hardware/software specifications for PLC and robotics systems",
        "Created capacity and financial plans aligned with the Sales Forecast",
        "Built and led a team of 4 engineers — managed performance and project progress",
        "Set KPIs, improved documentation standards, reported quarterly to management"
      ],
      stack: ["Universal Robot", "OnRobot", "Machine Vision", "Python", "OnShape", "PLC", "Industrial Automation", "Mechanical Engineering"]
    },
    {
      company: "WebforSol",
      logo: "websol.png",
      title: "Freelance Full Stack Developer",
      current: false,
      period: { from: "2020-06", to: "2022-11" },
      parallelWith: "CobotX Technologies",
      description: "Freelance full-stack developer delivering custom web solutions. Focus on clean architecture, cost efficiency, and systems easy to extend and maintain.",
      highlights: [
        "Full-stack delivery with React, Next.js, Node.js, MongoDB, MySQL, and PHP/Laravel",
        "Agile methodology practitioner with strong collaboration and adaptability",
        "Effective communication for understanding and meeting evolving client needs"
      ],
      refs: ["szelacoaching.hu", "pecscoach.hu", "smartedu.hu"],
      stack: ["React", "Next.js", "NestJS", "Node.js", "PHP", "MySQL", "MongoDB", "jQuery"]
    }
  ],
  education: [
    { institution: "Faculty of Engineering and Information Technology, University of Pécs", degree: "Bachelor's — Quality Manager", years: "2003–2007" },
    { institution: "Faculty of Engineering and Information Technology, University of Pécs", degree: "Bachelor's — Machinery Technical Teacher Education", years: "2001–2004" },
    { institution: "Faculty of Engineering and Information Technology, University of Pécs", degree: "BEng — Mechanical Engineering", years: "2000–2004" }
  ],
  skills: {
    primary: ["TypeScript", "JavaScript", "Svelte", "React", "Node.js", "SCSS", "HTML", "CSS"],
    backend: ["Express.js", "NestJS", "Python", "PHP", "MySQL", "MongoDB"],
    testing: ["Jest", "Vitest", "Playwright"],
    tooling: ["Vite", "Webpack", "PNPM", "Next.js"],
    ai: ["Claude", "Codex"],
    robotics: ["Universal Robot", "OnRobot", "Machine Vision", "PLC"]
  },
  community: {
    role: "Pro bono after-school programming club mentor",
    school: "Mátyás Király Street Primary School, Pécs",
    since: "2026-02",
    curriculumDesignedBy: "Viktor (personally)",
    competitionResults: [
      { place: 1, competition: "Hack and Code 2026 (Radnóti SZKI)" },
      { place: 1, competition: "22nd Neumann János Programming Competition" },
      { place: 3, competition: "22nd Neumann János Programming Competition" }
    ]
  },
  hobbyProjects: [
    { name: "Real-time Space Travel", url: "https://github.com/exphoenee/realtime_space_travel" },
    { name: "Sudoku Solver API", url: "https://github.com/exphoenee/SudokuSolver-API" },
    { name: "Bullseyes", url: "https://github.com/exphoenee/bullseyes" },
    { name: "Space Dodge", url: "https://github.com/BZZYFMLY/Space-dodge" },
    { name: "Arrganizer", url: "https://github.com/ViktorBozzay/Arrganizer" },
    { name: "Space Game", url: "https://github.com/exphoenee/SpaceGame" },
    { name: "Rock Paper Scissors", url: "https://github.com/exphoenee/RockPaperScissors" },
    { name: "Auditorium", url: "https://github.com/exphoenee/auditorium" },
    { name: "BA Team", url: "https://exphoenee.github.io/ba-team-docs/#home" },
    { name: "domelemjs", url: "https://www.npmjs.com/package/domelemjs" },
    { name: "romannumbersjs", url: "https://www.npmjs.com/package/romannumbersjs" }
  ]
};
```

**Előny:** Típusosan strukturált, könnyen bővíthető, minden adat egy helyen.

---

## 2. lépés: Template renderelő függvények

Minden nézet kap egy render függvényt, ami a `CV_DATA`-ból generálja a HTML-t.

| Template | Funkció | Kimenet |
|----------|---------|---------|
| `renderPlainCV(data)` | Teljes plain CV HTML | `string` → `.innerHTML` |
| `renderJsonLines(data)` | JSON nézet `L[]` tömbje | `Array<[number, string]>` |
| `renderSwaggerSections(data)` | Swagger endpoint HTML-ek | `string[]` → beszúrva |
| `renderGameStations(data)` | Game CV station objektumok | `Array<{id, x, y, title, tech, content}>` |

Minden template függvény a `CV` globális névtérbe kerül (`shared.js`-ben definiálva), pl.:
```js
CV.renderPlainWorkExperience = function(exp) { /* ... */ };
CV.renderPlainCV = function(data) { /* ... */ };
```

---

## 3. lépés: HTML skeleton-ok átalakítása

Minden HTML oldal a következőképp néz ki:

```html
<!doctype html>
<html lang="en">
<head>  <!-- meta, title, CSS linkek (változatlan) --> </head>
<body>
  <button id="theme-toggle">☀️</button>
  <div id="music-player">... <!-- közös music player HTML --></div>
  <div id="cv-content"></div>  <!-- ← IDE renderelődik a CV -->
  <div id="hire-modal">...</div>

  <script src="./scripts/shared.js"></script>
  <script src="./scripts/cv-data.js"></script>  <!-- ★ ÚJ! -->
  <script src="./scripts/cv-plain.js"></script>
</body>
</html>
```

A `cv-plain.js` pedig egyszerűen:

```js
document.getElementById("cv-content").innerHTML = CV.renderPlainCV(CV_DATA);
```

**Fontos:** A jelenlegi `cv-plain.html` inline class nevei (pl. `cv-plain-inline-0`, `cv-plain-inline-1` stb.) mind átkerülnek a template függvénybe. A CSS változatlan marad.

---

## 4. lépés: Specifikus nézet template-ek

### a) Plain CV (`renderPlainCV`)
- Header: név, role, contact, intro → `CV_DATA.identity` + `CV_DATA.summary`
- Work Experience: ciklus `CV_DATA.workExperience` felett → `renderWorkItem(exp)`
  - Logo kép, title, date, description bulletök, skill chipek, ref linkek
- Education: ciklus `CV_DATA.education`
- Languages: `CV_DATA.identity.languages`
- Skills: `CV_DATA.skills.primary` → skill boxok (a többi kategória nem kell a plainbe)
- Community: `CV_DATA.community`
- Hobby Projects: `CV_DATA.hobbyProjects`

### b) JSON CV (`renderJsonLines`)
- A jelenlegi `L[]` tömb generálása a `CV_DATA`-ból
- Összetettebb: indentálás, syntax highlighting HTML wrapper-ek
- A fold mechanizmus változatlan marad

### c) Swagger CV (`renderSwaggerSections`)
- `/identity/profile`, `/identity/contact`, `/identity/languages`, `/summary` GET endpointok
- `/experience/aegex`, `/experience/telekom` stb. POST/PUT endpointok
- Minden endpoint leíró + parameter + response struktúra
- A jelenlegi hardcoded HTML-ek helyett generálás adatból

### d) Game Stations (`renderGameStations`)
- `CV_STATIONS` tömb generálása `CV_DATA`-ból
- Minden station egy work experience + education

---

## 5. lépés: Közös elemek kiszervezése

**Music Player HTML** (jelenleg 3x duplikálva: cv-plain, cv-json, cv-swagger):
→ Betölthető egy `CV.injectMusicPlayer()` függvénnyel, ami beszúrja a DOM-ba

**Hire Modal** (jelenleg 4x duplikálva):
→ Már van `CV.initHireModal()`, de a HTML is duplikált → kiszervezhető `CV.injectHireModal()`-ba

---

## 6. lépés: A game oldal

A `cv-game.html` és a játék engine változatlan marad, **csak** a `scripts/game/world/stations.js` kap egy importot a `CV_DATA`-hoz (vagy egy inline script a HTML-ben):

```js
// stations.js
import { CV_DATA } from '../../cv-data.js';

function renderStations(data) {
  return data.workExperience.map(exp => ({
    id: exp.id,
    x: /* koordináta marad */,
    y: /* koordináta marad */,
    title: exp.company + (exp.current ? " (Current)" : ""),
    tech: exp.stack.slice(0, 5).join(" · "),
    content: renderGameContent(exp)
  }));
}

export const CV_STATIONS = renderStations(CV_DATA);
```

---

## Végrehajtási sorrend

| # | Lépés | Mit érint | Becsült méret |
|---|-------|-----------|---------------|
| 1 | `cv-data.js` létrehozása | Új fájl | ~200 sor |
| 2 | `shared.js` bővítése template függvényekkel | 1 fájl módosítva | ~400 sor új kód |
| 3 | `cv-plain.html` + `cv-plain.js` átírása | 2 fájl | HTML ~90%-a kikerül |
| 4 | `cv-json.js` átírása (generálás `cv-data.js`-ből) | 1 fájl | L[] eltűnik, ~50 sor marad |
| 5 | `cv-swagger.html` + `cv-swagger.js` átírása | 2 fájl | HTML ~95%-a kikerül |
| 6 | `stations.js` átírása | 1 fájl | ~100 sor adat eltűnik |
| 7 | Közös elemek kiszervezése (music player, hire modal) | 4+ fájl | További dedupl. |
| 8 | Ellenőrzés: minden oldal ugyanazt rendereli-e | Minden oldal | Vizuális összehasonlítás |

---

## Kockázatok és megjegyzések

1. **A `cv-swagger.html` ~200KB** — a legnagyobb fájl, legtöbb ott a duplikáció. A refaktor itt hozza a legnagyobb megtakarítást.

2. **A `cv-json.js` `L[]` tömbje** nem csak adatot tartalmaz, hanem formatálást is (indent depth, HTML wrapper-ek). A template-nek reprodukálnia kell a pontos indentálást és fold logikát.

3. **A CSS class neveket** (`cv-plain-inline-0` stb.) nem szabad megváltoztatni — a template függvények ugyanazokat a class-okat generálják.

4. **Nincs build rendszer** — minden marad sima HTML+JS (no bundler, no framework). A `cv-data.js` egy globális változót definiál, amit a többi script használ.

5. **Tesztelés** — manuálisan kell ellenőrizni az összes oldalt, hogy ugyanúgy néz ki, mintha nem lenne refaktorálva. Javasolt az összehasonlítás előtte/utána screenshot-okkal.
