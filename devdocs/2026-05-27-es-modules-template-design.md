# Design: ES Modules + Template Literals alapú CV rendszer

**Dátum:** 2026-05-27  
**Állapot:** Tervezés

---

## Probléma

Az előző refaktoring (`devdocs/done/refactor-plan.md`) megoldotta az adatduplikációt — `cv-data.js` lett az egyetlen igazságforrás. A következő gond:

- `shared.js` (~1200 sor) keveri a shared utility-t és az összes CV renderelési logikát
- A renderelő függvények string-konkatenációval építik a HTML-t — nehezen olvasható, nehezen módosítható
- Nincs szétválasztás: ha pl. a plain CV templatejét akarod módosítani, az egész 1200 soros fájlban kell keresni

---

## Célarchitektúra

### Fájlstruktúra

```
scripts/
  cv-data.js                    ← adatok (export const CV_DATA)
  shared.js                     ← utility only: escHtml, skillChip, initModal, initTheme, stb.
  cv-music-player.js            ← refaktorálva: export function initMusicPlayer()
  cv-plain.js                   ← page bootstrap (import + render + eventek)
  cv-swagger.js                 ← page bootstrap
  cv-json.js                    ← page bootstrap
  cv-index.js                   ← page bootstrap
  game/ ...                     ← változatlan
  components/
    plain/
      header.js                 ← renderHeader(data)
      work-item.js              ← renderWorkItem(exp)
      education.js              ← renderEducation(data)
      languages.js              ← renderLanguages(data)
      programming-languages.js  ← renderProgrammingLanguages(data)
      community.js              ← renderCommunity(data)
      hobby-projects.js         ← renderHobbyProjects(data)
      index.js                  ← renderPlainCV(data) — összefogja a fentieket
    swagger/
      ui/
        summary-bar.js          ← swgSummary(method, path, desc)
        endpoint-block.js       ← swgGet, swgPost, swgPut, swgPatch, swgDelete
        tag-section.js          ← swgTagSection(name, html)
        params-table.js         ← swgParams(rows)
        responses.js            ← swgResponses(rows)
        stack-chips.js          ← swgStack(skills)
      sections/
        identity.js             ← renderIdentitySection(data)
        work-experience.js      ← renderWorkExperienceSection(data)
        education.js            ← renderEducationSection(data)
        skills.js               ← renderSkillsSection(data)
        community.js            ← renderCommunitySection(data)
        hobby-projects.js       ← renderHobbyProjectsSection(data)
        meta.js                 ← renderMetaSection(data)
      index.js                  ← renderSwaggerContent(data) — összefogja
    json/
      helpers.js                ← pushStr, pushBool, pushNum, pushNull, pushStringArray
      sections/
        identity.js             ← renderIdentity(data, push)
        work-experience.js      ← renderWorkExperience(data, push)
        education.js            ← renderEducation(data, push)
        skills.js               ← renderSkills(data, push)
        community.js            ← renderCommunity(data, push)
        hobby-projects.js       ← renderHobbyProjects(data, push)
      index.js                  ← renderJsonCV(data) — összefogja
```

### Modul határok

| Fájl / mappa | Felelőssége | Exportál |
|---|---|---|
| `cv-data.js` | CV adatok | `CV_DATA` |
| `shared.js` | Utility: escHtml, skillChip, initModal, initTheme, toast, formspree | named exportok |
| `cv-music-player.js` | Zenelejátszó logika | `initMusicPlayer` |
| `components/plain/index.js` | Plain CV teljes HTML | `renderPlainCV` |
| `components/plain/*.js` | Plain CV egy-egy szekciója | named render függvény |
| `components/swagger/ui/*.js` | Swagger UI építőkövek | named builder függvények |
| `components/swagger/sections/*.js` | Swagger tartalom szekciónként | named render függvény |
| `components/swagger/index.js` | Swagger CV teljes HTML | `renderSwaggerContent` |
| `components/json/helpers.js` | JSON viewer push helper-ek | named push függvények |
| `components/json/sections/*.js` | JSON tartalom szekciónként | named render függvény |
| `components/json/index.js` | JSON CV teljes HTML | `renderJsonCV` |
| `cv-plain.js` | Oldal bootstrap | — |
| `cv-swagger.js` | Oldal bootstrap | — |
| `cv-json.js` | Oldal bootstrap | — |

---

## Technikai döntések

### Miért ES modules (nem global namespace)

- GitHub Pages HTTP-n szolgálja — nincs CORS-probléma
- Live Server fejlesztésben HTTP-n fut — ott sem gond
- Natív browser támogatás, nincs bundler szükséges
- Az importok explicit dokumentálják a függőségeket
- Az egyes render fájlok önmagukban értelmezhetők

### Miért template literals (nem string-konkatenáció)

Az eddigi kód:

```js
html += '      <div class="item noBreakInside workExperienceItem cv-item">';
html += '        <div class="itemHeaderWrapper">';
html += '          <div class="itemLogoAndTitle">';
// ... 50+ sor
```

Helyette template literal:

```js
function renderWorkItem(exp) {
  return `
    <div class="item noBreakInside workExperienceItem cv-item">
      <div class="itemHeaderWrapper">
        <div class="itemLogoAndTitle">
          <div class="itemLogo">
            <img alt="${escHtml(exp.company)}" src="./assets/images/${exp.logo}" />
          </div>
          <div class="itemTitle">${escHtml(exp.company)}</div>
        </div>
        <div class="itemDetails">${escHtml(exp.title)}</div>
        <div class="itemDate">${escHtml(exp.periodLabel)}</div>
      </div>
      ${renderDescription(exp)}
      ${renderRefs(exp)}
      ${renderSkills(exp)}
    </div>
  `;
}
```

Olvasható, szerkeszthető, a HTML struktúra látható a JS kódban.

---

## Példa: components/plain/work-item.js

```js
import { escHtml, skillChip } from '../../shared.js';

function renderBullets(bullets) {
  if (!bullets?.length) return '';
  return bullets.map(b => `<div><i class="bullet-icon"></i>${b}</div>`).join('');
}

function renderRefs(exp) {
  if (!exp.refs?.length) return '';
  const refClass = exp.refs.length > 1 ? 'cv-plain-inline-5' : 'cv-plain-inline-6';
  return `
    <div class="cv-plain-inline-3">
      <div class="cv-plain-inline-4"><strong>Reference(s):</strong></div>
      <div class="${refClass}">
        ${exp.refs.map(r => `<a href="${escHtml(r.url)}" target="_blank">${escHtml(r.label)}</a>`).join('\n')}
      </div>
    </div>
  `;
}

function renderDescription(exp) {
  if (exp.projects) {
    return `
      <p>${exp.description}</p>
      <div class="cv-plain-inline-2">
        ${exp.projects.map(p => `
          <div>
            <div><strong>${escHtml(p.name)}</strong> - ${escHtml(p.subtitle)}</div>
            ${renderBullets(p.bullets)}
          </div>
        `).join('')}
      </div>
    `;
  }
  if (Array.isArray(exp.bullets)) {
    return `<div>${exp.description}</div><div class="cv-plain-inline-2">${renderBullets(exp.bullets)}</div>`;
  }
  if (exp.bullets && typeof exp.bullets === 'object') {
    return `
      ${exp.description}
      <div class="cv-plain-inline-7">
        ${Object.entries(exp.bullets).map(([key, arr]) => `
          <div>
            <div><strong>${key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</strong></div>
            ${renderBullets(arr)}
          </div>
        `).join('')}
      </div>
    `;
  }
  return exp.description || '';
}

export function renderWorkItem(exp) {
  return `
    <div class="item noBreakInside workExperienceItem cv-item">
      <div class="itemHeaderWrapper">
        <div class="itemLogoAndTitle">
          <div class="itemLogo">
            <img alt="${escHtml(exp.company)}" title="${escHtml(exp.company)}" src="./assets/images/${exp.logo}" />
          </div>
          <div class="itemTitle">${escHtml(exp.company)}</div>
        </div>
        <div class="itemDetails itemDetailsWithDate">${escHtml(exp.title)}</div>
        <div class="itemDate">${escHtml(exp.periodLabel)}</div>
      </div>
      <div class="itemContentContainer">
        <div class="itemDescription">
          ${renderDescription(exp)}
        </div>
        ${renderRefs(exp)}
        ${exp.skills?.length ? `<div class="itemSkills">${exp.skills.map(s => skillChip(s)).join('')}</div>` : ''}
      </div>
    </div>
  `;
}
```

## Példa: components/plain/index.js

```js
import { renderHeader } from './header.js';
import { renderWorkItem } from './work-item.js';
import { renderEducation } from './education.js';
import { renderLanguages } from './languages.js';
import { renderProgrammingLanguages } from './programming-languages.js';
import { renderCommunity } from './community.js';
import { renderHobbyProjects } from './hobby-projects.js';

export function renderPlainCV(data) {
  return `
    <div class="cv-plain-inline-0 cvLayout base cv">
      ${renderHeader(data)}
      <div class="blockTitle noBreakBeforeAfter cv-block-title"><span>Work Experience</span></div>
      ${data.workExperience.map(renderWorkItem).join('')}
      ${renderEducation(data)}
      ${renderLanguages(data)}
      ${renderProgrammingLanguages(data)}
      ${renderCommunity(data)}
      ${renderHobbyProjects(data)}
      <div class="poweredBy">
        <a href="https://profile.codersrank.io/user/exphoenee/" target="_blank">
          <span>Powered by</span>&nbsp;
          <img src="./assets/images/codersrank.svg" alt="codersrank" class="codersrank">
        </a>
      </div>
    </div>
  `;
}
```

---

## Példa: cv-plain.js (page script)

```js
import { CV_DATA } from './cv-data.js';
import { renderPlainCV } from './cv-render-plain.js';
import { initHireModal, injectMusicPlayer, initThemeToggle, initFormspree } from './shared.js';
import { initMusicPlayer } from './cv-music-player.js';
// cv-music-player.js átírásra kerül: IIFE helyett export function initMusicPlayer()
// shared.js injectMusicPlayer() injektálja a DOM-ba a lejátszót, MAJD initMusicPlayer() inicializálja

injectMusicPlayer(); // DOM-ba szúrja a music player HTML-t
document.getElementById('cv-content').innerHTML = renderPlainCV(CV_DATA);

initHireModal('hire-plain');
initThemeToggle({ key: 'cv-plain-theme', buttonId: 'theme-toggle' });
initFormspree('#hire-plain-form');
initMusicPlayer(); // inicializálja az eseménykezelőket

document.getElementById('print-plain-btn')?.addEventListener('click', () => window.print());
```

---

## Példa: HTML módosítás

```html
<!-- cv-plain.html — ELŐTTE -->
<script defer src="./scripts/shared.js"></script>
<script defer src="./scripts/cv-data.js"></script>
<script defer src="./scripts/cv-music-player.js"></script>
<script defer src="./scripts/cv-plain.js"></script>

<!-- cv-plain.html — UTÁNA -->
<script type="module" src="./scripts/cv-plain.js"></script>
```

A `type="module"` automatikusan deferred és strict mode-ban fut. A többi script tag törlődik — az importok kezelik a függőségeket.

---

## cv-data.js módosítás

```js
// ELŐTTE
var CV_DATA = { ... };

// UTÁNA
export const CV_DATA = { ... };
```

Ez az egyetlen változás az adatfájlban.

---

## shared.js

A jelenlegi shared.js-ből kikerül:
- `CV.renderPlainCV` → `cv-render-plain.js`
- `CV.renderSwaggerContent` → `cv-render-swagger.js`  
- `CV.renderJsonCV` → `cv-render-json.js`
- Swagger helper függvények (`_swgGet`, `_swgPost`, stb.) → `cv-render-swagger.js`-be

Marad a `shared.js`-ben:
- `escHtml`
- `skillChip`, `refLinks`, `renderBullets` (megosztott helperek, ha több render is használja)
- `initHireModal`, `hireModalHTML`
- `initThemeToggle`, `getSystemTheme`
- `saveState`, `loadState`, `restoreCollapseStates`
- `initFormspree`
- `musicPlayerHTML`, auto-inject logika

---

## Hatókör — mi NEM változik

- `cv-data.js` tartalma (csak `export` kulcsszó kerül elé)
- CSS fájlok — érintetlenek
- HTML fájlok tartalma (csak a script tagek)
- Game CV (`cv-game.html`, `scripts/game/`) — külön scope, nem érinti ez a refaktoring
- A renderelt HTML kimenete — vizuálisan semmi sem változik

---

## Kockázatok

| Kockázat | Valószínűség | Kezelés |
|----------|--------------|---------|
| Valamelyik helper hiányzik az importból | Közepes | Oldalanként tesztelni a refaktoring után |
| `cv-music-player.js` IIFE-ként fut, nem exportál | Biztos — kezelendő | Átírni: IIFE → `export function initMusicPlayer()`, a HTML inject marad `shared.js`-ben |
| `shared.js` auto-inject IIFE-je konfliktust okoz | Közepes | Az auto-inject IIFE-t eltávolítani, explicit hívásokra cserélni az oldal scriptjeiben |
| Formspree szkript (külső CDN) konfliktusa | Alacsony | A `<script src="formspree">` tag marad a HTML-ben, az `initFormspree` hívás a module scriptből |

---

## Implementációs sorrend

1. `cv-data.js` — `export const` hozzáadása
2. `shared.js` — render függvények kivágása, named exportok hozzáadása, auto-inject IIFE eltávolítása
3. `cv-music-player.js` — IIFE → `export function initMusicPlayer()`
4. `components/plain/*.js` — minden szekció saját fájlban, template literalokkal
5. `components/swagger/ui/*.js` — Swagger UI építőkövek
6. `components/swagger/sections/*.js` — Swagger tartalom szekciónként
7. `components/json/helpers.js` + `components/json/sections/*.js`
8. `components/plain/index.js`, `components/swagger/index.js`, `components/json/index.js` — összefogó index fájlok
9. `cv-plain.js`, `cv-swagger.js`, `cv-json.js`, `cv-index.js` — átírás modulra
10. HTML fájlok — script tagek frissítése (`type="module"`)
11. Tesztelés oldalanként Live Serveren
