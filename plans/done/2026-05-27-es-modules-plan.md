# ES Modules + Template Literals — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the CV codebase from global-namespace `defer` scripts to native ES modules, template literals replacing string concatenation, and render logic atomized into `scripts/components/` subdirectories.

**Architecture:** Each CV type (plain, swagger, json) gets a `scripts/components/<type>/` folder with one file per section and an `index.js` that assembles and exports the top-level render function. Page scripts (`cv-plain.js` etc.) become thin ES module bootstraps. `shared.js` becomes utility-only with named exports. The `CV.*` global namespace is removed entirely.

**Tech Stack:** Vanilla JS ES modules (no bundler), template literals, Live Server for local testing, GitHub Pages in production.

---

## File map

**Created:**
```
scripts/components/plain/header.js
scripts/components/plain/work-item.js
scripts/components/plain/education.js
scripts/components/plain/languages.js
scripts/components/plain/programming-languages.js
scripts/components/plain/community.js
scripts/components/plain/hobby-projects.js
scripts/components/plain/index.js
scripts/components/swagger/ui/icons.js
scripts/components/swagger/ui/summary-bar.js
scripts/components/swagger/ui/params-table.js
scripts/components/swagger/ui/responses.js
scripts/components/swagger/ui/endpoint-block.js
scripts/components/swagger/ui/tag-section.js
scripts/components/swagger/ui/stack-chips.js
scripts/components/swagger/sections/identity.js
scripts/components/swagger/sections/work-experience.js
scripts/components/swagger/sections/education.js
scripts/components/swagger/sections/skills.js
scripts/components/swagger/sections/community.js
scripts/components/swagger/sections/hobby-projects.js
scripts/components/swagger/sections/meta.js
scripts/components/swagger/index.js
scripts/components/json/helpers.js
scripts/components/json/sections/identity.js
scripts/components/json/sections/work-experience.js
scripts/components/json/sections/education.js
scripts/components/json/sections/skills.js
scripts/components/json/sections/community.js
scripts/components/json/sections/hobby-projects.js
scripts/components/json/sections/meta.js
scripts/components/json/index.js
```

**Modified:**
```
scripts/cv-data.js           — var → export const
scripts/shared.js            — CV.* namespace → named exports, remove render fns + auto-inject IIFE
scripts/cv-music-player.js   — IIFE → export function initMusicPlayer()
scripts/cv-plain.js          — rewrite as ES module
scripts/cv-swagger.js        — rewrite as ES module
scripts/cv-json.js           — rewrite as ES module
scripts/cv-index.js          — rewrite as ES module
cv-plain.html                — script tags → type="module"
cv-swagger.html              — script tags → type="module"
cv-json.html                 — script tags → type="module"
index.html                   — script tags → type="module"
```

---

> ⚠️ **Migration note:** Tasks 1–4 are non-breaking (create new files only). Tasks 5–7 break all existing pages simultaneously. Tasks 8–11 restore each page one by one. **Do not stop between Tasks 5 and 8** — the site will be broken until Task 8 completes.

---

## Task 1: Plain CV components

**Files:**
- Create: `scripts/components/plain/header.js`
- Create: `scripts/components/plain/work-item.js`
- Create: `scripts/components/plain/education.js`
- Create: `scripts/components/plain/languages.js`
- Create: `scripts/components/plain/programming-languages.js`
- Create: `scripts/components/plain/community.js`
- Create: `scripts/components/plain/hobby-projects.js`
- Create: `scripts/components/plain/index.js`

- [ ] **Step 1: Create `scripts/components/plain/header.js`**

```js
import { escHtml } from '../../shared.js';

export function renderHeader(data) {
  const contacts = data.identity.contacts.map(c =>
    c.url
      ? `<div><a target="_blank" href="${escHtml(c.url)}">${escHtml(c.label)}</a></div>`
      : `<div>${escHtml(c.label)}</div>`
  ).join('');

  return `
    <div class="header">
      <div class="name-container">
        <span class="name">${escHtml(data.identity.name)}</span>
        <div class="header-buttons">
          <button class="hire-btn-plain" id="hire-plain-btn">Hire Me</button>
          <button class="print-btn-plain" id="print-plain-btn" title="Print CV">🖨️ Print</button>
        </div>
      </div>
      <div class="deatils-container">
        <div class="roleContacts">
          <div class="role">${escHtml(data.identity.role)}</div>
          <div class="cv-plain-inline-1 contacts">${contacts}</div>
        </div>
        <div class="intro">${data.summary}</div>
      </div>
    </div>
  `;
}
```

- [ ] **Step 2: Create `scripts/components/plain/work-item.js`**

```js
import { escHtml, skillChip } from '../../shared.js';

function renderBullets(bullets) {
  if (!bullets?.length) return '';
  return bullets.map(b => `<div><i class="bullet-icon"></i>${b}</div>`).join('');
}

function renderRefs(exp) {
  if (!exp.refs?.length) return '';
  const cls = exp.refs.length > 1 ? 'cv-plain-inline-5' : 'cv-plain-inline-6';
  const links = exp.refs.map(r =>
    `<a href="${escHtml(r.url)}" target="_blank" rel="noopener noreferrer">${escHtml(r.label)}</a>`
  ).join('\n');
  return `
    <div class="cv-plain-inline-3">
      <div class="cv-plain-inline-4"><strong>Reference(s):</strong></div>
      <div class="${cls}">${links}</div>
    </div>
  `;
}

function renderDescription(exp) {
  if (exp.projects) {
    const projects = exp.projects.map(p => `
      <div>
        <div><strong>${escHtml(p.name)}</strong> - ${escHtml(p.subtitle)}</div>
        ${renderBullets(p.bullets)}
      </div>
    `).join('');
    return `<p>${exp.description}</p><div class="cv-plain-inline-2">${projects}</div>`;
  }
  if (Array.isArray(exp.bullets)) {
    return `<div>${exp.description}</div><div class="cv-plain-inline-2">${renderBullets(exp.bullets)}</div>`;
  }
  if (exp.bullets && typeof exp.bullets === 'object') {
    const sections = Object.entries(exp.bullets).map(([key, arr]) => {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
      return `<div><div><strong>${label}</strong></div>${renderBullets(arr)}</div>`;
    }).join('');
    return `${exp.description}<div class="cv-plain-inline-7">${sections}</div>`;
  }
  return exp.description || '';
}

export function renderWorkItem(exp) {
  const skills = exp.skills?.length
    ? `<div class="itemSkills">${exp.skills.map(s => skillChip(s, s.toLowerCase().replace(/[ .]/g, '') + '.svg')).join('')}</div>`
    : '';

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
        <div class="itemDescription">${renderDescription(exp)}</div>
        ${renderRefs(exp)}
        ${skills}
      </div>
    </div>
  `;
}
```

- [ ] **Step 3: Create `scripts/components/plain/education.js`**

```js
import { escHtml } from '../../shared.js';

export function renderEducation(data) {
  const degrees = data.education.degrees.map(deg => `
    <div><i class="bullet-icon"></i>${escHtml(deg.title)}</div>
    <div style="opacity:0.7;font-size:0.9em;text-align:right;white-space:nowrap;">${escHtml(deg.years)}</div>
  `).join('');

  return `
    <div class="blockTitle noBreakBeforeAfter cv-block-title"><span>Education</span></div>
    <div class="item noBreakInside educationItem cv-item">
      <div class="itemContent" style="display:flex;flex-direction:column;gap:8px;">
        <div class="itemTitle" style="width:100%;margin-bottom:0.5rem;">${escHtml(data.education.institution)}</div>
        <div style="width:100%;display:grid;grid-template-columns:1fr auto;gap:4px 16px;align-items:baseline;font-size:0.95em;">
          ${degrees}
        </div>
      </div>
    </div>
  `;
}
```

- [ ] **Step 4: Create `scripts/components/plain/languages.js`**

```js
import { escHtml } from '../../shared.js';

export function renderLanguages(data) {
  const items = data.identity.languages.map(lang =>
    `<div><strong>${escHtml(lang.name)}:</strong>&nbsp;${escHtml(lang.level)}</div>`
  ).join('');

  return `
    <div class="blockTitle noBreakBeforeAfter cv-block-title"><span>Languages</span></div>
    <div class="item noBreakInside cv-item">
      <div class="cv-plain-inline-8 itemDescription">${items}</div>
    </div>
  `;
}
```

- [ ] **Step 5: Create `scripts/components/plain/programming-languages.js`**

```js
import { escHtml, skillChip } from '../../shared.js';

export function renderProgrammingLanguages(data) {
  const chips = data.programmingLanguages.map(pl => skillChip(pl.name, pl.icon)).join('');
  return `
    <div class="blockTitle noBreakBeforeAfter cv-block-title"><span>Programming Languages</span></div>
    <div class="item noBreakInside cv-item">
      <div class="itemContent"><div class="itemSkills">${chips}</div></div>
    </div>
  `;
}
```

- [ ] **Step 6: Create `scripts/components/plain/community.js`**

```js
export function renderCommunity(data) {
  return `
    <div class="blockTitle noBreakBeforeAfter cv-block-title"><span>Community &amp; Mentorship</span></div>
    <div class="item noBreakInside cv-item">
      <div class="itemDescription">${data.community}</div>
    </div>
  `;
}
```

- [ ] **Step 7: Create `scripts/components/plain/hobby-projects.js`**

```js
import { escHtml } from '../../shared.js';

export function renderHobbyProjects(data) {
  const links = data.hobbyProjects.map((p, i) => {
    const comma = i < data.hobbyProjects.length - 1 ? ',' : '';
    return `<a href="${escHtml(p.url)}" target="_blank" rel="noopener noreferrer">${escHtml(p.name)}</a>${comma}`;
  }).join('\n          ');

  return `
    <div class="blockTitle noBreakBeforeAfter cv-block-title"><span>Hobby Projects</span></div>
    <div class="item noBreakInside cv-item">
      <div class="itemDescription"><div class="hobby-links">${links}</div></div>
    </div>
  `;
}
```

- [ ] **Step 8: Create `scripts/components/plain/index.js`**

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
          <span>Powered by</span>&nbsp;<img src="./assets/images/codersrank.svg" alt="codersrank" class="codersrank">
        </a>
      </div>
    </div>
  `;
}
```

- [ ] **Step 9: Commit**

```bash
git add scripts/components/
git commit -m "feat: add plain CV component files (ES modules, template literals)"
```

---

## Task 2: Swagger UI primitives

**Files:**
- Create: `scripts/components/swagger/ui/icons.js`
- Create: `scripts/components/swagger/ui/summary-bar.js`
- Create: `scripts/components/swagger/ui/params-table.js`
- Create: `scripts/components/swagger/ui/responses.js`
- Create: `scripts/components/swagger/ui/endpoint-block.js`
- Create: `scripts/components/swagger/ui/tag-section.js`
- Create: `scripts/components/swagger/ui/stack-chips.js`

- [ ] **Step 1: Create `scripts/components/swagger/ui/icons.js`**

```js
export const svgClipboard = '<svg viewBox="0 0 15 16" width="15" height="16" aria-hidden="true" focusable="false"><g transform="translate(2, -1)"><path fill="#7d8492" fill-rule="evenodd" d="M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2c-.02.28-.11.52-.3.7-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2 2-2 1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55 0-1-.45-1-1s-.45-1-1-1-1 .45-1 1-.45 1-1 1H3c-.55 0-1 .45-1 1z"></path></g></svg>';

export const svgLockUnlocked = '<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false"><path fill="#7d8492" d="M15.8 8H14V5.6C14 2.703 12.665 1 10 1 7.334 1 6 2.703 6 5.6V6h2v-.801C8 3.754 8.797 3 10 3c1.203 0 2 .754 2 2.199V8H4c-.553 0-1 .646-1 1.199V17c0 .549.428 1.139.951 1.307l1.197.387C5.672 18.861 6.55 19 7.1 19h5.8c.549 0 1.428-.139 1.951-.307l1.196-.387c.524-.167.953-.757.953-1.306V9.199C17 8.646 16.352 8 15.8 8z"></path></svg>';

export const svgArrowUp = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="arrow" width="20" height="20" aria-hidden="true"><path d="M17.418 6.109c.272-.268.709-.268.979 0s.271.701 0 .969l-7.908 7.83c-.27.268-.707.268-.979 0l-7.908-7.83c-.27-.268-.27-.701 0-.969.271-.268.709-.268.979 0L10 13.25l7.418-7.141z"/></svg>';

export const svgArrowDown = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="arrow" width="20" height="20" aria-hidden="true"><path d="M17.418 14.908C17.69 15.176 18.127 15.176 18.397 14.908c.27-.268.271-.701 0-.969L10.489 6.109c-.27-.268-.707-.268-.979 0L1.602 13.939c-.27.268-.27.701 0 .969.271.268.708.268.979 0L10 7.767l7.418 7.141z"/></svg>';
```

- [ ] **Step 2: Create `scripts/components/swagger/ui/summary-bar.js`**

```js
import { escHtml } from '../../../shared.js';
import { svgClipboard, svgLockUnlocked, svgArrowUp } from './icons.js';

export function swgSummary(method, path, desc, extraBadge) {
  const cls = method.toLowerCase();
  const badge = extraBadge ? ` ${extraBadge}` : '';
  return `<div class="opblock-summary opblock-summary-${cls}"><button class="opblock-summary-control"><span class="opblock-summary-method">${method}</span><div class="opblock-summary-path-description-wrapper"><span class="opblock-summary-path"><a class="nostyle"><span>${escHtml(path)}</span></a></span><div class="opblock-summary-description">${desc}${badge}</div></div></button><div class="view-line-link copy-to-clipboard" title="Copy to clipboard">${svgClipboard}</div><button class="authorization__btn unlocked" aria-label="authorization button unlocked">${svgLockUnlocked}</button><button class="opblock-control-arrow">${svgArrowUp}</button></div>`;
}
```

- [ ] **Step 3: Create `scripts/components/swagger/ui/params-table.js`**

```js
import { escHtml } from '../../../shared.js';

export function swgParams(rows) {
  if (!rows || rows.length === 0) {
    return '<div class="parameters-container"><div class="opblock-description-wrapper"><p>No parameters</p></div></div>';
  }
  const rowsHtml = rows.map(p => `
    <tr>
      <td class="parameters-col_name">
        <div class="parameter__name">${escHtml(p.name)}</div>
        <div class="parameter__type">${escHtml(p.type)}</div>
        <div class="parameter__in">${escHtml(p.loc || 'metadata')}</div>
      </td>
      <td class="parameters-col_description"><div class="renderedMarkdown">${p.descHtml}</div></td>
    </tr>
  `).join('');
  return `<div class="parameters-container"><div class="table-container"><table class="parameters"><thead><tr><th class="col_header parameters-col_name">Name</th><th class="col_header parameters-col_description">Description</th></tr></thead><tbody>${rowsHtml}</tbody></table></div></div>`;
}
```

- [ ] **Step 4: Create `scripts/components/swagger/ui/responses.js`**

```js
export function swgResponses(rows) {
  const rowsHtml = rows.map(row => `
    <tr class="response">
      <td class="response-col_status">${row.code}</td>
      <td class="response-col_description">
        <div class="renderedMarkdown">${row.bodyHtml}</div>
        <section class="response-controls"><div class="response-control-media-type response-control-media-type--accept-controller"><small class="response-control-media-type__title">Media type</small><div class="content-type-wrapper"><select aria-label="Media Type" class="content-type"><option value="application/json">application/json</option></select></div><small class="response-control-media-type__accept-message">Controls <code>Accept</code>header.</small></div></section>
      </td>
      <td class="response-col_links">${row.linksHtml || 'No links'}</td>
    </tr>
  `).join('');
  return `<div class="responses-wrapper"><div class="opblock-section-header"><h4>Responses</h4></div><div class="responses-inner"><table class="responses-table" aria-live="polite" role="region"><thead><tr class="responses-header"><td class="col_header response-col_status">Code</td><td class="col_header response-col_description">Description</td><td class="col_header response-col_links">Links</td></tr></thead><tbody>${rowsHtml}</tbody></table></div></div>`;
}
```

- [ ] **Step 5: Create `scripts/components/swagger/ui/endpoint-block.js`**

```js
import { swgSummary } from './summary-bar.js';
import { swgParams } from './params-table.js';
import { swgResponses } from './responses.js';

function swgDesc(html) {
  return `<div class="opblock-description-wrapper"><div class="opblock-description"><div class="renderedMarkdown">${html}</div></div></div>`;
}

function swgBody(tag, id, method, path, desc, descHtml, paramRows, responseRows, extraBadge) {
  const cls = method.toLowerCase();
  return `<div class="opblock opblock-${cls}" id="operations-${tag}-${id}">${swgSummary(method, path, desc, extraBadge)}<div class="opblock-body">${swgDesc(descHtml)}<div class="opblock-section"><div class="opblock-section-header"><div class="tab-header"><div class="tab-item active"><h4 class="opblock-title"><span>Parameters</span></h4></div></div><div class="try-out"><button class="try-out__btn hire-trigger">Hire me</button></div></div>${swgParams(paramRows)}</div>${swgResponses(responseRows)}</div></div>`;
}

export const swgGet    = (tag, id, path, desc, descHtml, params, responses) => swgBody(tag, id, 'GET',    path, desc, descHtml, params, responses);
export const swgPost   = (tag, id, path, desc, descHtml, params, responses) => swgBody(tag, id, 'POST',   path, desc, descHtml, params, responses);
export const swgPut    = (tag, id, path, desc, descHtml, params, responses) => swgBody(tag, id, 'PUT',    path, desc, descHtml, params, responses);
export const swgPatch  = (tag, id, path, desc, descHtml, params, responses) => swgBody(tag, id, 'PATCH',  path, desc, descHtml, params, responses);
export const swgDelete = (tag, id, path, desc, descHtml, params, responses) => swgBody(tag, id, 'DELETE', path, desc, descHtml, params, responses);
```

- [ ] **Step 6: Create `scripts/components/swagger/ui/tag-section.js`**

```js
import { svgArrowDown } from './icons.js';

export function swgTagSection(tagName, endpointsHtml) {
  return `<div class="opblock-tag-section is-open" id="operations-tag-${tagName}"><h3 class="opblock-tag no-desc"><span>${tagName}</span><small></small><button class="expand-operation" title="Collapse operation">${svgArrowDown}</button></h3><div class="no-margin"><div class="operation-tag-content">${endpointsHtml}</div></div></div>`;
}
```

- [ ] **Step 7: Create `scripts/components/swagger/ui/stack-chips.js`**

```js
import { escHtml } from '../../../shared.js';

export function swgStack(skills) {
  if (!skills?.length) return '';
  const items = skills.map(s => `<span class="cv-stack-item">${escHtml(s)}</span>`).join('');
  return `<div class="cv-stack">${items}</div>`;
}
```

- [ ] **Step 8: Commit**

```bash
git add scripts/components/swagger/ui/
git commit -m "feat: add swagger UI primitive components"
```

---

## Task 3: Swagger section components + index

**Files:**
- Create: `scripts/components/swagger/sections/identity.js`
- Create: `scripts/components/swagger/sections/work-experience.js`
- Create: `scripts/components/swagger/sections/education.js`
- Create: `scripts/components/swagger/sections/skills.js`
- Create: `scripts/components/swagger/sections/community.js`
- Create: `scripts/components/swagger/sections/hobby-projects.js`
- Create: `scripts/components/swagger/sections/meta.js`
- Create: `scripts/components/swagger/index.js`

- [ ] **Step 1: Create `scripts/components/swagger/sections/identity.js`**

```js
import { escHtml } from '../../../shared.js';
import { swgGet } from '../ui/endpoint-block.js';
import { swgTagSection } from '../ui/tag-section.js';

export function renderIdentitySection(data) {
  const E = escHtml;
  const endpoints = [];

  // /identity/profile
  const profileResp = `<p class="cv-kv"><code>name</code>${E(data.identity.name)}</p><p class="cv-kv"><code>role</code>${E(data.identity.role)} <em>// "Developer" is an understatement</em></p><p class="cv-kv"><code>location</code>${E(data.identity.location)}</p><p class="cv-kv"><code>accentColor</code>${E(data.meta.accentColor)} <span class="cv-color-dot"></span></p><p class="cv-kv"><code>deprecated</code>false <em>// still actively maintained</em></p>`;
  endpoints.push(swgGet('identity', 'get_identity_profile', '/identity/profile', 'Name, role, location', '<p>Returns the developer\'s core identity fields.</p>', null, [{ code: '200', bodyHtml: profileResp, linksHtml: 'No links' }]));

  // /identity/contact
  const contactMap = {};
  data.identity.contacts.forEach(c => {
    if (c.label.indexOf('@') > -1) contactMap.email = c;
    else if (c.label.indexOf('+36') > -1) contactMap.phone = c;
    else if (c.label.indexOf('github') > -1) contactMap.github = c;
    else if (c.label.indexOf('linkedin') > -1) contactMap.linkedin = c;
    else if (c.label.indexOf('bozzayviktor') > -1) contactMap.website = c;
  });
  const contactComments = { github: "// phoenix, with extra e's" };
  let contactResp = '';
  ['email', 'phone', 'github', 'linkedin', 'website'].forEach(key => {
    const c = contactMap[key];
    if (c?.url) {
      const href = key === 'email' ? `mailto:${c.label}` : (key === 'phone' ? `tel:${c.label}` : c.url);
      const comment = contactComments[key] ? ` <em>${contactComments[key]}</em>` : '';
      contactResp += `<p class="cv-kv"><code>${key}</code><a href="${href}">${E(c.label)}</a>${comment}</p>`;
    }
  });
  endpoints.push(swgGet('identity', 'get_identity_contact', '/identity/contact', 'All contact channels', '<p>Returns all available contact channels.</p>', null, [{ code: '200', bodyHtml: contactResp, linksHtml: 'No links' }]));

  // /identity/languages
  const langComments = { Hungarian: 'no runtime errors', German: 'can order Schnitzel and read stack traces', English: "you're reading this - proof it works" };
  let langResp = '';
  data.identity.languages.forEach(l => {
    const comment = langComments[l.name] ? ` <em>// ${langComments[l.name]}</em>` : '';
    langResp += `<p class="cv-kv"><code>${E(l.name)}</code>${E(l.level.toLowerCase())}${comment}</p>`;
  });
  endpoints.push(swgGet('identity', 'get_identity_languages', '/identity/languages', 'Spoken language proficiencies', '<p>Returns spoken language proficiencies.</p>', null, [{ code: '200', bodyHtml: langResp, linksHtml: 'No links' }]));

  return swgTagSection('identity', endpoints.join(''));
}
```

- [ ] **Step 2: Create `scripts/components/swagger/sections/work-experience.js`**

```js
import { escHtml } from '../../../shared.js';
import { swgPost, swgPut } from '../ui/endpoint-block.js';
import { swgTagSection } from '../ui/tag-section.js';
import { swgStack } from '../ui/stack-chips.js';

export function renderWorkExperienceSection(data) {
  const E = escHtml;
  const methods = ['POST', 'POST', 'POST', 'POST', 'PUT', 'PUT'];

  const endpoints = data.workExperience.map((exp, i) => {
    const path = `/experience/${exp.id}`;
    const desc = exp.isCurrent
      ? `${exp.title} - ${exp.company} <span class="cv-badge">current</span>`
      : `${exp.title} - ${exp.company}`;
    const descHtml = `<p>${exp.description.split('<br>')[0]}</p>`;

    const paramRows = [];
    const periodStr = `${exp.period.from} → ${exp.period.to || 'null'}`;
    const periodComment = exp.isCurrent ? 'null=still here' : (exp.id === 'telekom' ? '4 months - short but intense' : null);
    paramRows.push({ name: 'period', type: 'string', loc: '(metadata)', descHtml: `<p>${periodStr}${periodComment ? ` <em>// ${periodComment}</em>` : ''}</p>` });

    if (exp.teamSize) {
      const teamComment = exp.id === 'aegex' ? 'self + 1 mid-level colleague, handled with care' : (exp.id === 'cobotx' ? 'engineers, built and led personally' : null);
      paramRows.push({ name: 'teamSize', type: 'integer', loc: '(metadata)', descHtml: `<p>${exp.teamSize}${teamComment ? ` <em>// ${teamComment}</em>` : ''}</p>` });
    }

    paramRows.push({ name: 'stack', type: 'array', loc: '(metadata)', descHtml: swgStack(exp.skills) });

    if (exp.id === 'cobotx') {
      paramRows.push({ name: 'robots', type: 'integer', loc: '(metadata)', descHtml: '<p>Literal robots. Universal Robots. not metaphorical. <em>// Collaborative robots, not the other kind</em></p>' });
    }

    let respBody = '';
    if (exp.projects) {
      exp.projects.forEach(proj => {
        respBody += `<p><strong>${E(proj.name)}</strong>- ${E(proj.subtitle)}</p><ul>${proj.bullets.map(b => `<li>${b}</li>`).join('')}</ul>`;
      });
      if (exp.id === 'aegex') respBody += '<p><em>releaseCycle: 30d → 14d (targeting 7) · testCoverage before: 0 // yes, zero. it was not fine.</em></p>';
    } else if (Array.isArray(exp.bullets)) {
      respBody = `<ul>${exp.bullets.map(b => `<li>${b}</li>`).join('')}`;
      if (exp.id === 'telekom') respBody += '<li>Continuous frontend–AI backend integration in fast-paced Agile sprints</li>';
      if (exp.id === 'scolia') respBody += '<li>WebSocket-driven live score updates - because darts is apparently a realtime sport</li>';
      respBody += '</ul>';
    } else if (exp.bullets && typeof exp.bullets === 'object') {
      respBody = '<ul>' + Object.values(exp.bullets).flat().map(b => `<li>${b}</li>`).join('');
      if (exp.id === 'cubicfox') respBody += '<li>Established team code conventions - arrived, fixed things, left. classic.</li>';
      respBody += '</ul>';
    }

    const linksHtml = exp.refs?.length
      ? exp.refs.map(r => `<a href="${E(r.url)}" target="_blank">${E(r.label)}</a>`).join('<br />')
      : 'No links';

    const fn = methods[i] === 'POST' ? swgPost : swgPut;
    return fn('workExperience', `experience_${exp.id}`, path, desc, descHtml, paramRows, [{ code: '200', bodyHtml: respBody, linksHtml }]);
  });

  return swgTagSection('workExperience', endpoints.join(''));
}
```

- [ ] **Step 3: Create `scripts/components/swagger/sections/education.js`**

```js
import { escHtml } from '../../../shared.js';
import { swgGet } from '../ui/endpoint-block.js';
import { swgTagSection } from '../ui/tag-section.js';

const EDU_PATHS = ['/education/quality-manager', '/education/teacher', '/education/mechanical'];
const EDU_IDS   = ['get_quality-manager', 'get_teacher', 'get_mechanical'];
const EDU_DESCS = [
  "Bachelor's - Quality Manager, 2003–2007",
  "Bachelor's - Machinery Technical Teacher Education, 2001–2004",
  'Bachelor of Engineering (BEng), Mechanical Engineering, 2000–2004',
];

export function renderEducationSection(data) {
  const E = escHtml;
  const endpoints = data.education.degrees.map((deg, i) => {
    const resp = `<p class="cv-kv"><code>institution</code>${E(data.education.institution)}</p><p class="cv-kv"><code>degree</code>${E(deg.title)}</p><p class="cv-kv"><code>years</code>${E(deg.years)}</p>`;
    return swgGet('education', EDU_IDS[i], EDU_PATHS[i], EDU_DESCS[i], '<p>Returns education details.</p>', null, [{ code: '200', bodyHtml: resp, linksHtml: 'No links' }]);
  });
  return swgTagSection('education', endpoints.join(''));
}
```

- [ ] **Step 4: Create `scripts/components/swagger/sections/skills.js`**

```js
import { escHtml } from '../../../shared.js';
import { swgGet, swgPatch, swgDelete } from '../ui/endpoint-block.js';
import { swgTagSection } from '../ui/tag-section.js';
import { swgParams } from '../ui/params-table.js';
import { swgResponses } from '../ui/responses.js';
import { swgStack } from '../ui/stack-chips.js';

export function renderSkillsSection(data) {
  const E = escHtml;
  const endpoints = [];

  const primarySkills = data.programmingLanguages.filter(p => ['TypeScript', 'JavaScript', 'CSS', 'SCSS', 'HTML'].includes(p.name));
  let primaryResp = primarySkills.map(p => `<p class="cv-kv"><code>${E(p.name.toLowerCase())}</code>experto</p>`).join('');
  primaryResp += '<p><em>// These are not "frameworks". These are the actual technologies.</em></p>';
  endpoints.push(swgGet('skills', 'get_skills_primary', '/skills/primary', 'Core frontend stack', '<p>Returns core frontend technology proficiencies.</p>', null, [{ code: '200', bodyHtml: primaryResp, linksHtml: 'No links' }]));

  let backendResp = data.programmingLanguages.filter(p => ['Python', 'PHP'].includes(p.name)).map(p => `<p class="cv-kv"><code>${E(p.name.toLowerCase())}</code>proficient</p>`).join('');
  backendResp += '<p class="cv-kv"><code>express.js</code>proficient</p><p class="cv-kv"><code>nestjs</code>proficient</p><p class="cv-kv"><code>mysql</code>proficient</p><p class="cv-kv"><code>mongodb</code>proficient</p>';
  endpoints.push(swgGet('skills', 'get_skills_backend', '/skills/backend', 'Backend & databases', '<p>Returns backend and database proficiencies.</p>', null, [{ code: '200', bodyHtml: backendResp, linksHtml: 'No links' }]));

  endpoints.push(swgPatch('skills', 'patch_skills_testing', '/skills/testing', 'Testing & quality (improving daily)', '<p>Testing stack and methodologies. Coverage is improving daily.</p>', null, [{ code: '200', bodyHtml: '<p><code>jest</code>proficient</p><p><code>vitest</code>proficient</p><p><code>playwright</code>proficient</p><p class="cv-kv"><code>coverage</code><em>before: 0 // yes, zero. after: yes.</em></p>', linksHtml: 'No links' }]));

  endpoints.push(swgGet('skills', 'get_skills_tooling', '/skills/tooling', 'Tools & build', '<p>Returns build tools and dev tooling proficiencies.</p>', null, [{ code: '200', bodyHtml: '<p class="cv-kv"><code>vite</code>experto</p><p class="cv-kv"><code>webpack</code>experto</p><p class="cv-kv"><code>pnpm</code>experto</p><p class="cv-kv"><code>npm</code>experto</p><p class="cv-kv"><code>git</code>experto</p><p><em>// Know the difference between pnpm and npm. One of them respects disk space.</em></p>', linksHtml: 'No links' }]));

  endpoints.push(swgGet('skills', 'get_skills_ai', '/skills/ai', 'AI & automation', '<p>Returns AI tooling and automation proficiencies.</p>', null, [{ code: '200', bodyHtml: '<p class="cv-kv"><code>claude</code>architect-level</p><p class="cv-kv"><code>codex</code>architect-level</p><p class="cv-kv"><code>chatgpt</code>advanced</p><p class="cv-kv"><code>copilot</code>advanced</p><p><em>// AI is not replacing developers. Developers who use AI are replacing those who don\'t.</em></p>', linksHtml: 'No links' }]));

  endpoints.push(swgGet('skills', 'get_skills_robotics', '/skills/robotics', 'Robotics & hardware', '<p>Returns robotics and hardware proficiencies.</p>', null, [{ code: '200', bodyHtml: '<p class="cv-kv"><code>universal-robots</code>proficient</p><p class="cv-kv"><code>plc-programming</code>proficient</p><p class="cv-kv"><code>machine-vision</code>proficient</p><p class="cv-kv"><code>onrobot</code>proficient</p><p class="cv-kv"><code>onshape</code>proficient</p><p><em>// Yes, actual robots. Not the framework kind. The moving-metal kind.</em></p>', linksHtml: 'No links' }]));

  endpoints.push(swgDelete('skills', 'delete_skills_delete', '/skills/legacy-code', 'Delete legacy code (use with caution)', '<p>Deletes legacy code. All of it. Use with extreme caution. <em>// You called the DELETE endpoint on production. Your funeral.</em></p>', [{ name: 'justification', type: 'string', loc: '(metadata)', descHtml: '<p>Why are you deleting this? <em>// "it was legacy" is not a valid justification</em></p>' }], [{ code: '200', bodyHtml: '<p>Legacy code deleted successfully.</p><p><em>// You have 24 hours to regret this decision.</em></p>', linksHtml: 'No links' }, { code: '418', bodyHtml: "<p>I'm a teapot.</p><p><em>// Short and stout. Here is my handle. Here is my spout.</em></p>", linksHtml: 'No links' }]));

  return swgTagSection('skills', endpoints.join(''));
}
```

- [ ] **Step 5: Create `scripts/components/swagger/sections/community.js`**

```js
import { swgPost } from '../ui/endpoint-block.js';
import { swgTagSection } from '../ui/tag-section.js';

export function renderCommunitySection() {
  const communityResp = '<p class="cv-kv"><code>school</code>Mátyás Király Street Primary School, Pécs</p><p class="cv-kv"><code>since</code>2026-02</p><p class="cv-kv"><code>curriculumDesignedBy</code>Viktor</p><p class="cv-kv"><code>paid</code>false <em>// some things matter more than money</em></p><p><strong>Competition results:</strong></p><ul><li>1st place at Hack and Code 2026 (Radnóti SZKI)</li><li>1st and 3rd place at the 22nd Neumann János Programming Competition</li></ul>';
  return swgTagSection('community', swgPost('community', 'post_mentoring', '/community/mentoring', 'Mentoring & community work', '<p>Launched and lead a pro bono after-school IT and programming club. Designed the full curriculum.</p>', null, [{ code: '200', bodyHtml: communityResp, linksHtml: 'No links' }]));
}
```

- [ ] **Step 6: Create `scripts/components/swagger/sections/hobby-projects.js`**

```js
import { escHtml } from '../../../shared.js';
import { swgGet } from '../ui/endpoint-block.js';
import { swgTagSection } from '../ui/tag-section.js';

export function renderHobbyProjectsSection(data) {
  const hobbyResp = data.hobbyProjects.map(p =>
    `<p class="cv-kv"><code>${escHtml(p.name.replace(/[\s-]/g, '').toLowerCase())}</code><a href="${escHtml(p.url)}" target="_blank">${escHtml(p.name)}</a></p>`
  ).join('');
  return swgTagSection('hobbyProjects', swgGet('hobbyProjects', 'get_hobbyProjects', '/hobbyProjects', 'Side projects & open-source work', '<p>Returns hobby projects and open-source contributions.</p>', null, [{ code: '200', bodyHtml: hobbyResp, linksHtml: 'No links' }]));
}
```

- [ ] **Step 7: Create `scripts/components/swagger/sections/meta.js`**

```js
import { escHtml } from '../../../shared.js';
import { swgGet } from '../ui/endpoint-block.js';
import { swgTagSection } from '../ui/tag-section.js';

export function renderMetaSection(data) {
  const E = escHtml;
  const metaResp = `<p class="cv-kv"><code>name</code>${E(data.meta.name)}</p><p class="cv-kv"><code>role</code>${E(data.identity.role)}</p><p class="cv-kv"><code>version</code>${E(data.meta.version)}</p><p class="cv-kv"><code>generatedBy</code>CV_DATA v${E(data.meta.version)} <em>// yes, this CV generates itself</em></p><p class="cv-kv"><code>codingPhilosophy</code>refactor deliberately <em>// only when evidence justifies it</em></p><p class="cv-kv"><code>engineeringBackground</code>mechanical <em>// before there was code, there was CAD</em></p><p class="cv-kv"><code>openToWork</code>true <em>// spoiler: hire me button works</em></p>`;
  return swgTagSection('meta', swgGet('meta', 'get_meta', '/meta', 'Version metadata', '<p>Returns API metadata and CV version information.</p>', null, [{ code: '200', bodyHtml: metaResp, linksHtml: 'No links' }]));
}
```

- [ ] **Step 8: Create `scripts/components/swagger/index.js`**

```js
import { escHtml } from '../../shared.js';
import { renderIdentitySection } from './sections/identity.js';
import { renderWorkExperienceSection } from './sections/work-experience.js';
import { renderEducationSection } from './sections/education.js';
import { renderSkillsSection } from './sections/skills.js';
import { renderCommunitySection } from './sections/community.js';
import { renderHobbyProjectsSection } from './sections/hobby-projects.js';
import { renderMetaSection } from './sections/meta.js';

export function renderSwaggerContent(data) {
  const E = escHtml;
  const parts = [];

  parts.push('<section class="swagger-ui swagger-container">');

  // Topbar
  parts.push(`<div class="topbar"><div class="topbar-wrapper"><a class="cv-inline-0 link"><img src="assets/images/swagger.svg" height="36" alt="Swagger" /><span class="cv-inline-1"><span class="cv-inline-2">viktor</span><span class="cv-inline-3">bozzay</span></span></a><button class="theme-toggle" id="theme-toggle" title="Toggle dark mode"><svg class="light-icon" viewBox="0 0 24 24" height="22"><path d="M12 2C9.76 2 7.78 3.05 6.5 4.68l9.81 9.82C17.94 13.21 19 11.24 19 9a7 7 0 0 0-7-7M3.28 4 2 5.27 5.04 8.3C5 8.53 5 8.76 5 9c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h5.73l4 4L20 20.72zM9 20v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1z"/></svg><svg class="dark-icon" viewBox="0 0 24 24" height="22"><path d="M12 2C9.76 2 7.78 3.05 6.5 4.68l9.81 9.82C17.94 13.21 19 11.24 19 9a7 7 0 0 0-7-7M3.28 4 2 5.27 5.04 8.3C5 8.53 5 8.76 5 9c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h5.73l4 4L20 20.72zM9 20v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1z"/></svg></button><form class="cv-inline-4 download-url-wrapper"><label class="cv-inline-5 select-label"><span>Endpoint</span><div class="cv-inline-5 servers"><label class="cv-inline-5"><select class="cv-inline-5"><option>https://bozzayviktor.hu/cv/api - Viktor Bozzay CV API v${E(data.meta.version)}</option></select></label></div></label></form></div></div>`);

  // Info
  let contactLinks = '';
  data.identity.contacts.forEach((c, i) => {
    if (i > 0) contactLinks += '&nbsp;·&nbsp; ';
    if (c.url) {
      const tag = c.url.startsWith('mailto:') ? `<a href="${E(c.url)}">${E(c.label)}</a>` : `<a href="${E(c.url)}" target="_blank">${E(c.label)}</a>`;
      contactLinks += tag;
    } else {
      contactLinks += E(c.label);
    }
  });
  parts.push(`<div class="information-container wrapper"><section class="block col-12"><div><div class="info"><hgroup class="main"><h1 class="title">${E(data.identity.name)} - Curriculum Vitae API<span><small><pre class="version">${E(data.meta.version)} </pre></small><small class="version-stamp"><pre class="version">REST</pre></small></span></h1></hgroup><div class="description"><div class="renderedMarkdown"><p>${data.summary}</p><p>${contactLinks}</p></div></div></div></div></section></div>`);

  // Scheme container
  parts.push(`<div class="scheme-container"><section class="schemes wrapper block col-12"><div class="schemes-server-container"><div><span class="servers-title">Location</span><div class="servers"><label><select><option>${E(data.identity.location)} - open to remote / hybrid</option></select></label></div></div></div><div class="auth-wrapper"><button class="btn authorize locked" id="hire-btn"><span>Hire</span><svg class="lock-icon" viewBox="0 0 20 20" width="20" height="20"><path d="M15.8 8H4c-.553 0-1 .646-1 1.199V17c0 .549.428 1.139.951 1.307l1.197.387C5.672 18.861 6.55 19 7.1 19h5.8c.549 0 1.428-.139 1.951-.307l1.196-.387c.524-.167.953-.757.953-1.306V9.199C17 8.646 16.352 8 15.8 8z"/><path class="lock-shackle" d="M14 8V5.6C14 2.703 12.665 1 10 1 7.334 1 6 2.703 6 5.6V6h2v-.801C8 3.754 8.797 3 10 3c1.203 0 2 .754 2 2.199V8h2z"/></svg></button></div></section></div>`);

  // Content
  parts.push('<div class="wrapper"><section class="block col-12 block-desktop col-12-desktop"><div>');
  parts.push(renderIdentitySection(data));

  const summaryResp = `<p>${data.summary}</p><p><em>// translation: will rewrite your entire codebase if provoked (and the evidence justifies it)</em></p>`;
  parts.push(`<div class="opblock-tag-section is-open" id="operations-tag-summary"><h3 class="opblock-tag no-desc"><span>summary</span><small></small></h3><div class="no-margin"><div class="operation-tag-content"></div></div></div>`);

  parts.push(renderWorkExperienceSection(data));
  parts.push(renderEducationSection(data));
  parts.push(renderSkillsSection(data));
  parts.push(renderCommunitySection());
  parts.push(renderHobbyProjectsSection(data));
  parts.push(renderMetaSection(data));

  parts.push('</div></section></div>');
  parts.push('</section>');

  return parts.join('\n');
}
```

> **Note:** The summary section tag in the original was a full endpoint. If you want to preserve it exactly, compare with `CV.renderSwaggerContent` in the current `shared.js` around line 660 and replicate the `swgGet` call for `/summary` inside a `swgTagSection('summary', ...)`.

- [ ] **Step 9: Commit**

```bash
git add scripts/components/swagger/
git commit -m "feat: add swagger CV section components"
```

---

## Task 4: JSON helpers + sections + index

**Files:**
- Create: `scripts/components/json/helpers.js`
- Create: `scripts/components/json/sections/identity.js`
- Create: `scripts/components/json/sections/work-experience.js`
- Create: `scripts/components/json/sections/education.js`
- Create: `scripts/components/json/sections/skills.js`
- Create: `scripts/components/json/sections/community.js`
- Create: `scripts/components/json/sections/hobby-projects.js`
- Create: `scripts/components/json/sections/meta.js`
- Create: `scripts/components/json/index.js`

Each section returns an array of `[depth, htmlString]` tuples. The index concatenates them.

- [ ] **Step 1: Create `scripts/components/json/helpers.js`**

```js
export function escHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

export function jesc(str) {
  return String(str).replace(/"/g, '\\"');
}

export function line(depth, html) { return [depth, html]; }

export function pushStr(depth, key, value, comma = true, comment = null) {
  let h = `<span class="k">"${key}"</span><span class="p">: </span><span class="s">"${jesc(value)}"</span>`;
  if (comma) h += '<span class="p">,</span>';
  if (comment) h += `  <span class="c">// ${comment}</span>`;
  return [depth, h];
}

export function pushBool(depth, key, value, comma = true, comment = null) {
  let h = `<span class="k">"${key}"</span><span class="p">: </span><span class="b">${value ? 'true' : 'false'}</span>`;
  if (comma) h += '<span class="p">,</span>';
  if (comment) h += `  <span class="c">// ${comment}</span>`;
  return [depth, h];
}

export function pushNum(depth, key, value, comma = true, comment = null) {
  let h = `<span class="k">"${key}"</span><span class="p">: </span><span class="n">${value}</span>`;
  if (comma) h += '<span class="p">,</span>';
  if (comment) h += `  <span class="c">// ${comment}</span>`;
  return [depth, h];
}

export function pushNull(depth, key, comma = true, comment = null) {
  let h = `<span class="k">"${key}"</span><span class="p">: </span><span class="nl">null</span>`;
  if (comma) h += '<span class="p">,</span>';
  if (comment) h += `  <span class="c">// ${comment}</span>`;
  return [depth, h];
}

export function pushStringArray(depth, items, comma = true) {
  const lines = [[depth, '<span class="p">[</span>']];
  items.forEach((item, idx) => {
    let l = `<span class="s">"${jesc(item)}"</span>`;
    if (idx < items.length - 1) l += '<span class="p">,</span>';
    lines.push([depth + 1, l]);
  });
  lines.push([depth, `<span class="p">]${comma ? ',' : ''}</span>`]);
  return lines;
}
```

- [ ] **Step 2: Create `scripts/components/json/sections/identity.js`**

```js
import { pushStr, pushBool, line, jesc, escHtml } from '../helpers.js';

export function renderIdentity(data) {
  const E = escHtml;
  const contactMap = {};
  data.identity.contacts.forEach(c => {
    if (c.label.includes('@')) contactMap.email = c;
    else if (c.label.includes('+36')) contactMap.phone = c;
    else if (c.label.includes('github')) contactMap.github = c;
    else if (c.label.includes('linkedin')) contactMap.linkedin = c;
    else if (c.label.includes('bozzayviktor')) contactMap.website = c;
  });

  const langComments = { Hungarian: 'no runtime errors', German: 'can order Schnitzel and read stack traces', English: "you're reading this - proof it works" };
  const contactKeys = ['email', 'phone', 'github', 'linkedin', 'website'];
  const lastContactKey = contactKeys.filter(k => contactMap[k]?.url).slice(-1)[0];

  const contactLines = contactKeys.flatMap(k => {
    const c = contactMap[k];
    if (!c?.url) return [];
    const href = k === 'email' ? `mailto:${c.label}` : (k === 'phone' ? `tel:${c.label}` : c.url);
    const comma = k !== lastContactKey;
    const comment = k === 'github' ? "phoenix, with extra e's" : null;
    let h = `<span class="k">"${k}"</span><span class="p">: </span><span class="s">"<a href="${E(href)}">${jesc(c.label)}</a>"</span>`;
    if (comma) h += '<span class="p">,</span>';
    if (comment) h += `  <span class="c">// ${comment}</span>`;
    return [[3, h]];
  });

  const langLines = data.identity.languages.flatMap((lang, li) => {
    const comma = li < data.identity.languages.length - 1;
    let h = `<span class="k">"${E(lang.name)}"</span><span class="p">: </span><span class="s">"${E(lang.level.toLowerCase())}"</span>`;
    if (comma) h += '<span class="p">,</span>';
    const comment = langComments[lang.name];
    if (comment) h += `  <span class="c">// ${comment}</span>`;
    return [[3, h]];
  });

  return [
    line(1, '<span class="k">"identity"</span><span class="p">: {</span>'),
    pushStr(2, 'name', data.identity.name),
    pushStr(2, 'role', data.identity.role, true, '"Developer" is an understatement'),
    pushStr(2, 'location', data.identity.location),
    pushStr(2, 'accentColor', data.meta.accentColor, true, 'hardcoded in the original HTML - yes, I looked'),
    line(2, '<span class="k">"contact"</span><span class="p">: {</span>'),
    ...contactLines,
    line(2, '<span class="p">},</span>'),
    line(2, '<span class="k">"languages"</span><span class="p">: {</span>'),
    ...langLines,
    line(2, '<span class="p">}</span>'),
    line(1, '<span class="p">},</span>'),
    line(0, ''),
  ];
}
```

- [ ] **Step 3: Create `scripts/components/json/sections/work-experience.js`**

```js
import { pushStr, pushBool, pushNum, pushStringArray, line, jesc, escHtml } from '../helpers.js';

export function renderWorkExperience(data) {
  const E = escHtml;
  const result = [
    line(1, '<span class="k">"workExperience"</span><span class="p">: [</span>'),
    line(0, ''),
  ];

  const companyNames = ['Aegex Technologies', 'Deutsche Telekom IT Solutions HU', 'Scolia Technologies Ltd.', 'Cubicfox', 'CobotX Technologies', 'WebforSol (Freelance)'];

  data.workExperience.forEach((exp, ei) => {
    const alias = companyNames[ei] || exp.company;
    const dashes = '─'.repeat(Math.max(55 - alias.length, 5));
    result.push(line(2, `<span class="c">// [${ei}] ${E(alias)} ${dashes}</span>`));
    result.push(line(2, '<span class="p">{</span>'));
    result.push(pushStr(3, 'company', exp.company));
    result.push(pushStr(3, 'title', exp.title));

    let periodLine = `<span class="k">"period"</span><span class="p">: { </span><span class="k">"from"</span><span class="p">: </span><span class="s">"${exp.period.from}"</span><span class="p">, </span><span class="k">"to"</span><span class="p">: </span>`;
    periodLine += exp.period.to ? `<span class="s">"${exp.period.to}"</span>` : '<span class="nl">null</span>';
    periodLine += '<span class="p"> },</span>';
    if (exp.isCurrent) periodLine += '  <span class="c">// null = still here</span>';
    else if (exp.id === 'telekom') periodLine += '  <span class="c">// 4 months - short but intense</span>';
    result.push(line(3, periodLine));

    if (exp.id === 'aegex') result.push(pushNum(3, 'teamSize', 2, true, 'self + 1 mid-level colleague, handled with care'));
    if (exp.id === 'cobotx') result.push(pushNum(3, 'teamSize', 4, true, 'engineers, built and led personally'));

    result.push(pushStr(3, 'description', exp.description));

    if (exp.id === 'cobotx') result.push(pushBool(3, 'robots', true, true, 'literal robots. Universal Robots. not metaphorical.'));
    if (exp.id === 'webforsol') result.push(pushBool(3, 'parallel_with_cobotx', true, true, '24h is enough for two jobs, apparently'));

    if (exp.projects) {
      result.push(line(3, '<span class="k">"projects"</span><span class="p">: {</span>'));
      exp.projects.forEach((proj, pi) => {
        const comma = pi < exp.projects.length - 1;
        result.push(line(4, `<span class="k">"${E(proj.name)}"</span><span class="p">: {</span>`));
        result.push(pushStr(5, 'type', proj.subtitle));
        if (proj.name === 'FACTS') {
          result.push(pushNum(5, 'releaseCycle_before_days', 30));
          result.push(pushNum(5, 'releaseCycle_after_days', 14, true, 'targeting 7 - AI-assisted workflow'));
          result.push(pushNum(5, 'testCoverage_before', 0, true, 'yes, zero. it was fine. (it was not fine.)'));
          result.push(line(5, '<span class="k">"qualityIssues_after"</span><span class="p">: </span><span class="s">"near eliminated"</span><span class="p">,</span>'));
        }
        result.push(...pushStringArray(5, proj.bullets, true));
        if (proj.name !== 'FACTS') {
          result.push(line(5, '<span class="k">"ref"</span><span class="p">: [</span>'));
          result.push(line(6, '<span class="s">"Not public"</span>'));
          result.push(line(5, '<span class="p">]</span>'));
        } else if (exp.refs) {
          result.push(line(5, '<span class="k">"ref"</span><span class="p">: [</span>'));
          exp.refs.forEach((r, ri) => {
            let l = `<span class="s">"<a href="${E(r.url)}" target="_blank">${jesc(r.label)}</a>"</span>`;
            if (ri < exp.refs.length - 1) l += '<span class="p">,</span>';
            result.push(line(6, l));
          });
          result.push(line(5, '<span class="p">],</span>'));
        }
        result.push(line(4, `<span class="p">}</span>${comma ? '<span class="p">,</span>' : ''}`));
      });
      result.push(line(3, '<span class="p">},</span>'));
    } else if (Array.isArray(exp.bullets)) {
      result.push(...pushStringArray(3, exp.bullets, true));
    } else if (exp.bullets && typeof exp.bullets === 'object') {
      const all = Object.values(exp.bullets).flat();
      if (exp.id === 'cubicfox') all.push('Established team code conventions - arrived, fixed things, left. classic.');
      result.push(line(3, '<span class="k">"highlights"</span><span class="p">: [</span>'));
      all.forEach((b, bi) => {
        let l = `<span class="s">"${jesc(b)}"</span>`;
        if (bi < all.length - 1) l += '<span class="p">,</span>';
        result.push(line(4, l));
      });
      result.push(line(3, '<span class="p">],</span>'));
    }

    if (!exp.projects && exp.refs?.length) {
      if (exp.refs.length === 1) {
        result.push(line(3, `<span class="k">"ref"</span><span class="p">: </span><span class="s">"<a href="${E(exp.refs[0].url)}" target="_blank">${jesc(exp.refs[0].label)}</a>"</span><span class="p">,</span>`));
      } else {
        result.push(line(3, '<span class="k">"refs"</span><span class="p">: [</span>'));
        exp.refs.forEach((r, ri) => {
          let l = `<span class="s">"<a href="${E(r.url)}" target="_blank">${jesc(r.label)}</a>"</span>`;
          if (ri < exp.refs.length - 1) l += '<span class="p">,</span>';
          result.push(line(4, l));
        });
        result.push(line(3, '<span class="p">],</span>'));
      }
    }

    if (exp.skills?.length) {
      result.push(...pushStringArray(3, exp.skills, false));
    } else {
      result.push(line(3, '<span class="k">"stack"</span><span class="p">: []</span>'));
    }

    result.push(line(2, '<span class="p">}</span>'));
    result.push(line(0, ''));
  });

  result.push(line(1, '<span class="p">],</span>'));
  result.push(line(0, ''));
  return result;
}
```

- [ ] **Step 4: Create `scripts/components/json/sections/education.js`**

```js
import { pushStr, line, jesc } from '../helpers.js';

export function renderEducation(data) {
  const result = [
    line(1, '<span class="k">"education"</span><span class="p">: [</span>'),
    line(2, '<span class="c">// all three degrees from the same university - he really liked it there</span>'),
  ];
  data.education.degrees.forEach((deg, di) => {
    result.push(line(2, '<span class="p">{</span>'));
    result.push(pushStr(3, 'institution', data.education.institution));
    result.push(pushStr(3, 'degree', deg.title));
    result.push(line(3, `<span class="k">"years"</span><span class="p">: </span><span class="s">"${jesc(deg.years)}"</span>`));
    const close = di < data.education.degrees.length - 1 ? '<span class="p">},</span>' : '<span class="p">}</span>';
    result.push(line(2, close));
  });
  result.push(line(1, '<span class="p">],</span>'));
  result.push(line(1, '<span class="c">// none of them are frontend. this is fine. (this is fine.)</span>'));
  result.push(line(0, ''));
  return result;
}
```

- [ ] **Step 5: Create `scripts/components/json/sections/skills.js`**

```js
import { line } from '../helpers.js';

export function renderSkills() {
  return [
    line(1, '<span class="k">"skills"</span><span class="p">: {</span>'),
    line(2, '<span class="k">"primary"</span><span class="p">: [</span><span class="s">"TypeScript"</span><span class="p">, </span><span class="s">"JavaScript"</span><span class="p">, </span><span class="s">"Svelte"</span><span class="p">, </span><span class="s">"React"</span><span class="p">, </span><span class="s">"Node.js"</span><span class="p">, </span><span class="s">"SCSS"</span><span class="p">, </span><span class="s">"HTML"</span><span class="p">, </span><span class="s">"CSS"</span><span class="p">],</span>'),
    line(2, '<span class="k">"backend"</span><span class="p">: [</span><span class="s">"Express.js"</span><span class="p">, </span><span class="s">"NestJS"</span><span class="p">, </span><span class="s">"Python"</span><span class="p">, </span><span class="s">"PHP"</span><span class="p">, </span><span class="s">"MySQL"</span><span class="p">, </span><span class="s">"MongoDB"</span><span class="p">],</span>'),
    line(2, '<span class="k">"testing"</span><span class="p">: [</span><span class="s">"Jest"</span><span class="p">, </span><span class="s">"Vitest"</span><span class="p">, </span><span class="s">"Playwright"</span><span class="p">],</span>  <span class="c">// yes, all three</span>'),
    line(2, '<span class="k">"tooling"</span><span class="p">: [</span><span class="s">"Vite"</span><span class="p">, </span><span class="s">"Webpack"</span><span class="p">, </span><span class="s">"PNPM"</span><span class="p">, </span><span class="s">"Next.js"</span><span class="p">],</span>'),
    line(2, '<span class="k">"ai"</span><span class="p">: [</span><span class="s">"Claude"</span><span class="p">, </span><span class="s">"Codex"</span><span class="p">],</span>  <span class="c">// meta: this CV was probably reviewed by one of these</span>'),
    line(2, '<span class="k">"robotics"</span><span class="p">: [</span><span class="s">"Universal Robot"</span><span class="p">, </span><span class="s">"OnRobot"</span><span class="p">, </span><span class="s">"Machine Vision"</span><span class="p">, </span><span class="s">"PLC"</span><span class="p">],</span>  <span class="c">// surprise!</span>'),
    line(2, '<span class="k">"willRefactorYourEntireCodebaseIf"</span><span class="p">: </span><span class="s">"evidence justifies it"</span>  <span class="c">// (often)</span>'),
    line(1, '<span class="p">},</span>'),
    line(0, ''),
  ];
}
```

- [ ] **Step 6: Create `scripts/components/json/sections/community.js`**

```js
import { pushBool, line } from '../helpers.js';

export function renderCommunity() {
  return [
    line(1, '<span class="k">"community"</span><span class="p">: {</span>'),
    line(2, '<span class="k">"role"</span><span class="p">: </span><span class="s">"Pro bono after-school programming club mentor"</span><span class="p">,</span>'),
    line(2, '<span class="k">"school"</span><span class="p">: </span><span class="s">"Mátyás Király Street Primary School, Pécs"</span><span class="p">,</span>'),
    line(2, '<span class="k">"since"</span><span class="p">: </span><span class="s">"2026-02"</span><span class="p">,</span>'),
    line(2, '<span class="k">"curriculumDesignedBy"</span><span class="p">: </span><span class="s">"Viktor (personally)"</span><span class="p">,</span>'),
    pushBool(2, 'paidFor', false, true, 'legend'),
    line(2, '<span class="k">"competitionResults"</span><span class="p">: [</span>'),
    line(3, '<span class="p">{ </span><span class="k">"place"</span><span class="p">: </span><span class="n">1</span><span class="p">, </span><span class="k">"competition"</span><span class="p">: </span><span class="s">"Hack and Code 2026 (Radnóti SZKI)"</span><span class="p"> },</span>'),
    line(3, '<span class="p">{ </span><span class="k">"place"</span><span class="p">: </span><span class="n">1</span><span class="p">, </span><span class="k">"competition"</span><span class="p">: </span><span class="s">"22nd Neumann János Programming Competition"</span><span class="p"> },</span>'),
    line(3, '<span class="p">{ </span><span class="k">"place"</span><span class="p">: </span><span class="n">3</span><span class="p">, </span><span class="k">"competition"</span><span class="p">: </span><span class="s">"22nd Neumann János Programming Competition"</span><span class="p"> }</span>'),
    line(2, '<span class="p">]</span>'),
    line(1, '<span class="p">},</span>'),
    line(0, ''),
  ];
}
```

- [ ] **Step 7: Create `scripts/components/json/sections/hobby-projects.js`**

```js
import { line, jesc, escHtml } from '../helpers.js';

export function renderHobbyProjects(data) {
  const E = escHtml;
  const result = [line(1, '<span class="k">"hobbyProjects"</span><span class="p">: [</span>')];
  data.hobbyProjects.forEach((proj, hi) => {
    const comma = hi < data.hobbyProjects.length - 1;
    let l = `<span class="p">{ </span><span class="k">"name"</span><span class="p">: </span><span class="s">"${jesc(proj.name)}"</span><span class="p">, </span><span class="k">"url"</span><span class="p">: </span><span class="s">"<a href="${E(proj.url)}" target="_blank">${jesc(proj.name)}</a>"</span><span class="p"> }</span>`;
    if (comma) l += '<span class="p">,</span>';
    result.push(line(2, l));
  });
  result.push(line(1, '<span class="p">],</span>'));
  result.push(line(0, ''));
  return result;
}
```

- [ ] **Step 8: Create `scripts/components/json/sections/meta.js`**

```js
import { pushBool, line } from '../helpers.js';

export function renderMeta() {
  return [
    line(1, '<span class="k">"meta"</span><span class="p">: {</span>'),
    line(2, '<span class="k">"generatedBy"</span><span class="p">: </span><span class="s">"human effort + CodersRank + Claude (probably)"</span><span class="p">,</span>'),
    line(2, '<span class="k">"codingPhilosophy"</span><span class="p">: </span><span class="s">"deliberate, evidence-driven, system-level thinking"</span><span class="p">,</span>'),
    pushBool(2, 'engineeringBackground', true, true, '3× BEng - thinks in systems, not just components'),
    line(2, '<span class="k">"openToWork"</span><span class="p">: </span><span class="nl">true</span>  <span class="c">// ask directly: bozzay.viktor@gmail.com</span>'),
    line(1, '<span class="p">}</span>'),
    line(0, ''),
    line(0, '<span class="p">}</span>'),
  ];
}
```

- [ ] **Step 9: Create `scripts/components/json/index.js`**

```js
import { escHtml, jesc, line } from './helpers.js';
import { renderIdentity } from './sections/identity.js';
import { renderWorkExperience } from './sections/work-experience.js';
import { renderEducation } from './sections/education.js';
import { renderSkills } from './sections/skills.js';
import { renderCommunity } from './sections/community.js';
import { renderHobbyProjects } from './sections/hobby-projects.js';
import { renderMeta } from './sections/meta.js';

export function renderJsonCV(data) {
  const E = escHtml;
  return [
    line(0, '<span class="p">{</span>'),
    line(0, ''),
    line(1, `<span class="c">// Viktor Bozzay - curriculum_vitae.json - v${E(data.meta.version)}</span>`),
    line(1, '<span class="c">// Last commit: 2026-05-07 · still actively maintained</span>'),
    line(0, ''),
    line(1, `<span class="k">"$schema"</span><span class="p">: </span><span class="s">"https://bozzayviktor.hu/schemas/human/developer/v${E(data.meta.version)}.json"</span><span class="p">,</span>`),
    line(1, '<span class="k">"deprecated"</span><span class="p">: </span><span class="b">false</span><span class="p">,</span>  <span class="c">// still actively maintained</span>'),
    line(1, '<span class="k">"license"</span><span class="p">: </span><span class="s">"proprietary"</span><span class="p">,</span>  <span class="c">// not open source (yet)</span>'),
    line(0, ''),
    ...renderIdentity(data),
    line(1, `<span class="k">"summary"</span><span class="p">: </span><span class="s">"${jesc(data.summary)}"</span><span class="p">,</span>`),
    line(1, '<span class="c">// translation: will rewrite your entire codebase if provoked (and the evidence justifies it)</span>'),
    line(0, ''),
    ...renderWorkExperience(data),
    ...renderEducation(data),
    ...renderSkills(),
    ...renderCommunity(),
    ...renderHobbyProjects(data),
    ...renderMeta(),
  ];
}
```

- [ ] **Step 10: Commit**

```bash
git add scripts/components/json/
git commit -m "feat: add JSON CV component files"
```

---

## Task 5: Update cv-data.js

**Files:**
- Modify: `scripts/cv-data.js`

> ⚠️ After this step, all four HTML pages will be broken until Task 8 is complete. Complete Tasks 5–8 without stopping to test.

- [ ] **Step 1: Replace `var CV_DATA` with `export const CV_DATA`**

Open `scripts/cv-data.js`. Change line 6 from:

```js
var CV_DATA = {
```

to:

```js
export const CV_DATA = {
```

The closing `};` on the last line is unchanged.

- [ ] **Step 2: Commit**

```bash
git add scripts/cv-data.js
git commit -m "refactor: export CV_DATA as ES module"
```

---

## Task 6: Refactor shared.js to named exports

**Files:**
- Modify: `scripts/shared.js`

Replace the entire file with the following. The `musicPlayerHTML` and `hireModalHTML` function bodies are identical to the current file — copy them verbatim. The `initHireModal`, `initThemeToggle`, `getSystemTheme`, `saveState`, `loadState`, `restoreCollapseStates`, `initFormspree` function bodies are also identical to the current `CV.*` versions.

- [ ] **Step 1: Replace `scripts/shared.js` with the new module version**

```js
// shared.js — utility exports only. No CV namespace. No auto-inject.

export function escHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

export function skillChip(name, iconFile) {
  return `<div class="skill"><span class="skillImage"><img src="./assets/images/${iconFile}" alt="${escHtml(name)}" title="${escHtml(name)}" /></span><span>${escHtml(name)}</span></div>`;
}

export function refLinks(refs) {
  if (!refs || refs.length === 0) return '';
  return refs.map(r =>
    `<a href="${escHtml(r.url)}" target="_blank" rel="noopener noreferrer">${escHtml(r.label)}</a>`
  ).join('\n');
}

export function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function initThemeToggle(config) {
  config = config || {};
  const KEY = config.key || 'cv-swagger-theme';
  const btn = document.getElementById(config.buttonId || 'theme-toggle');

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
    if (config.onSet) config.onSet(theme, btn);
  }

  btn.addEventListener('click', function () {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next);
  });

  const saved = localStorage.getItem(KEY);
  setTheme(saved || getSystemTheme());
}

export function saveState(key, id, value) {
  const state = JSON.parse(localStorage.getItem(key) || '{}');
  state[id] = value;
  localStorage.setItem(key, JSON.stringify(state));
}

export function loadState(key, id, defaultValue) {
  const state = JSON.parse(localStorage.getItem(key) || '{}');
  return state[id] === undefined ? defaultValue : state[id];
}

export function restoreCollapseStates(key) {
  const state = JSON.parse(localStorage.getItem(key) || '{}');
  Object.keys(state).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('is-open', !!state[id]);
  });
}

export function initFormspree(selector) {
  window.formspree = window.formspree || function () { (formspree.q = formspree.q || []).push(arguments); };
  formspree('initForm', { formElement: selector, formId: 'mrejlned' });
}

// ── musicPlayerHTML — body identical to old CV.musicPlayerHTML() ──
function musicPlayerHTML() {
  // Copy the full return value from the current shared.js CV.musicPlayerHTML function (lines 100–159).
  // It is a string starting with '<div id="music-player">' and ending with '</div>'.
}

// ── hireModalHTML — body identical to old CV.hireModalHTML() ──
export function hireModalHTML(prefix, opts) {
  // Copy the full function body from current shared.js CV.hireModalHTML (lines 161–210).
}

export function injectMusicPlayer() {
  if (!document.getElementById('music-player')) {
    document.body.insertAdjacentHTML('beforeend', musicPlayerHTML());
  }
}

export function injectHireModal(prefix, opts) {
  if (!document.getElementById(prefix + '-modal')) {
    document.body.insertAdjacentHTML('beforeend', hireModalHTML(prefix, opts));
  }
}

export function initHireModal(prefix) {
  // Copy the full function body from current shared.js CV.initHireModal (lines 3–38).
  // Change all CV.escHtml references to escHtml.
}
```

> **Copy instructions:** Open the current `scripts/shared.js` and copy:
> - `CV.musicPlayerHTML` body (lines 101–158) → into `musicPlayerHTML()`
> - `CV.hireModalHTML` body (lines 162–209) → into `hireModalHTML()`
> - `CV.initHireModal` body (lines 4–37) → into `initHireModal()`
> - Change any `CV.escHtml(` references to `escHtml(`

- [ ] **Step 2: Commit**

```bash
git add scripts/shared.js
git commit -m "refactor: shared.js to named ES module exports, remove auto-inject IIFE"
```

---

## Task 7: Refactor cv-music-player.js

**Files:**
- Modify: `scripts/cv-music-player.js`

- [ ] **Step 1: Wrap the IIFE in an exported function**

Replace the entire file with:

```js
// cv-music-player.js — call initMusicPlayer() after injectMusicPlayer() has run
export function initMusicPlayer() {
  try {
    // Paste the entire IIFE body from the current file here (lines 5–483).
    // Remove the outer try { (function () { ... })(); } catch wrapper.
    // The content starting at `var audio = document.getElementById("music-audio");`
    // through `updatePlayPause();` becomes the function body directly.
  } catch (e) {
    console.warn('Music player init error:', e);
  }
}
```

The `LYRICS_MAP` object, all `var` declarations, all event listeners — everything from the current IIFE body stays exactly as-is, just inside `export function initMusicPlayer()`.

- [ ] **Step 2: Commit**

```bash
git add scripts/cv-music-player.js
git commit -m "refactor: cv-music-player.js exports initMusicPlayer()"
```

---

## Task 8: Migrate cv-plain.js + cv-plain.html

**Files:**
- Modify: `scripts/cv-plain.js`
- Modify: `cv-plain.html`

- [ ] **Step 1: Replace `scripts/cv-plain.js`**

```js
import { CV_DATA } from './cv-data.js';
import { renderPlainCV } from './components/plain/index.js';
import { injectMusicPlayer, injectHireModal, initHireModal, initFormspree, getSystemTheme } from './shared.js';
import { initMusicPlayer } from './cv-music-player.js';

injectMusicPlayer();
injectHireModal('hire-plain', {
  subject: 'Hire inquiry from CV - plain',
  p1Class: 'cv-plain-inline-11',
  p2Class: 'cv-plain-inline-12',
  errClass: 'cv-plain-inline-14',
});

document.getElementById('cv-content').innerHTML = renderPlainCV(CV_DATA);

initHireModal('hire-plain');
initMusicPlayer();
initFormspree('#hire-plain-form');

document.getElementById('print-plain-btn')?.addEventListener('click', () => window.print());

window.showToast = function (message) {
  const container = document.getElementById('cv-toaster-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'cv-toast';
  toast.innerHTML = `<span>${message}</span><button class="cv-toast-close" aria-label="Close">×</button>`;
  toast.querySelector('.cv-toast-close').addEventListener('click', removeToast);
  function removeToast() {
    toast.classList.add('hiding');
    setTimeout(() => toast.parentNode?.removeChild(toast), 300);
  }
  setTimeout(removeToast, 3000);
  container.appendChild(toast);
};

// ── Theme toggle (plain has custom multi-state themes) ──
(function () {
  const btn = document.getElementById('theme-toggle');
  let overlay = null;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const states = isTouch ? ['light', 'dark'] : ['light', 'dark', 'superdark', 'nightvision', 'predator'];
  const icons = isTouch
    ? ['assets/images/sun.webp', 'assets/images/moon.webp']
    : ['assets/images/sun.webp', 'assets/images/moon.webp', 'assets/images/flashlight.webp', 'assets/images/nightvision.webp', 'assets/images/predator.webp'];
  const savedTheme = localStorage.getItem('cv-swagger-theme');
  let current = (savedTheme && states.includes(savedTheme)) ? savedTheme : getSystemTheme();
  if (!states.includes(current)) current = 'light';

  const CURSOR_KEY = 'cv-superdark-cursor';
  let wordsWrapped = false;

  function updateOverlay(x, y) {
    if (!overlay) return;
    overlay.style.background = `radial-gradient(circle 250px at ${x}px ${y}px, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 12%, transparent 25%, transparent 52%, rgba(0,0,0,0.15) 65%, rgba(0,0,0,0.5) 78%, rgba(0,0,0,0.8) 88%, rgba(0,0,0,0.9) 94%, rgba(0,0,0,0.92) 100%)`;
  }
  function onMouseMove(e) {
    updateOverlay(e.clientX, e.clientY);
    localStorage.setItem(CURSOR_KEY, `${e.clientX},${e.clientY}`);
  }
  function wrapWords(element) {
    if (element.nodeType === Node.TEXT_NODE) {
      if (!element.textContent.trim()) return;
      const words = element.textContent.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      words.forEach(word => {
        if (word.trim()) {
          const span = document.createElement('span');
          span.className = 'nv-word';
          span.textContent = word;
          span.style.setProperty('--nv-fs', (0.96 + Math.random() * 0.09).toFixed(3) + 'em');
          const g = Math.floor(160 + Math.random() * 95);
          const r = Math.floor(20 + Math.random() * 100);
          span.style.setProperty('--nv-c', `rgb(${r},${g},${r})`);
          frag.appendChild(span);
        } else {
          frag.appendChild(document.createTextNode(word));
        }
      });
      element.replaceWith(frag);
    } else if (element.nodeType === Node.ELEMENT_NODE &&
               !['SCRIPT', 'STYLE', 'SVG'].includes(element.tagName) &&
               !element.classList.contains('blockTitle')) {
      Array.from(element.childNodes).forEach(wrapWords);
    }
  }
  function apply(state) {
    document.documentElement.setAttribute('data-theme', state);
    localStorage.setItem('cv-swagger-theme', state);
    current = state;
    const icon = icons[states.indexOf(state)];
    btn.innerHTML = icon.endsWith('.webp') ? `<img src="${icon}" class="theme-icon-img" alt="theme icon">` : icon;

    if (state === 'superdark') {
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9998';
        document.body.appendChild(overlay);
      }
      overlay.style.display = '';
      document.documentElement.style.cursor = 'none';
      const saved = localStorage.getItem(CURSOR_KEY);
      if (saved) { const [x, y] = saved.split(','); updateOverlay(+x, +y); }
      document.addEventListener('mousemove', onMouseMove);
    } else {
      document.documentElement.style.cursor = '';
      if (overlay) overlay.style.display = 'none';
      document.removeEventListener('mousemove', onMouseMove);
    }
    if (state === 'nightvision' && !wordsWrapped) {
      wrapWords(document.querySelector('.cvLayout.base.cv'));
      wordsWrapped = true;
    }
  }
  btn.addEventListener('click', () => {
    const next = states[(states.indexOf(current) + 1) % states.length];
    apply(next);
    if (window.showToast) window.showToast(`Theme changed to ${next}`);
  });
  apply(current);
})();

// ── Decorative dividers between work items ──
(function () {
  const decors = ['decor1.svg', 'decor2.svg', 'decor3.svg', 'decor4.svg', 'decor5.svg', 'decor6.svg'];
  const items = document.querySelectorAll('.workExperienceItem');
  if (items.length > 0) items[items.length - 1].classList.add('no-decor');
  items.forEach(item => {
    const title = item.querySelector('.itemTitle')?.textContent.trim();
    if (title === 'Deutsche Telekom IT Solutions HU' || title === 'CobotX Technologies') {
      item.classList.add('no-decor');
    }
  });
  for (let i = decors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [decors[i], decors[j]] = [decors[j], decors[i]];
  }
  items.forEach((item, k) => {
    if (k >= items.length - 1) return;
    const img = document.createElement('img');
    img.src = `./assets/images/${decors[k % decors.length]}`;
    img.alt = '';
    img.className = 'work-decor';
    img.style.cssText = 'display:block;width:400px;max-width:80%;height:30px;object-fit:contain;margin:3mm auto 3mm';
    item.parentNode.insertBefore(img, item.nextSibling);
  });
})();
```

- [ ] **Step 2: Update `cv-plain.html` — replace all script tags**

Remove these lines from `cv-plain.html`:

```html
<script defer src="./scripts/shared.js"></script>
<script defer src="./scripts/cv-data.js"></script>
<script defer src="./scripts/cv-music-player.js"></script>
<script defer src="./scripts/cv-plain.js"></script>
<script src="https://unpkg.com/@formspree/ajax@1" defer></script>
```

Replace with:

```html
<script src="https://unpkg.com/@formspree/ajax@1" defer></script>
<script type="module" src="./scripts/cv-plain.js"></script>
```

- [ ] **Step 3: Test cv-plain.html in Live Server**

Open `cv-plain.html` in Live Server. Verify:
- CV renders with correct content
- Theme toggle cycles through all states (light → dark → superdark → nightvision → predator)
- Decorative dividers appear between work items
- Music player opens and plays
- "Hire Me" modal opens and closes
- Print button triggers print dialog
- No console errors

- [ ] **Step 4: Commit**

```bash
git add scripts/cv-plain.js cv-plain.html
git commit -m "feat: migrate cv-plain to ES module"
```

---

## Task 9: Migrate cv-swagger.js + cv-swagger.html

**Files:**
- Modify: `scripts/cv-swagger.js`
- Modify: `cv-swagger.html`

- [ ] **Step 1: Replace `scripts/cv-swagger.js`**

```js
import { CV_DATA } from './cv-data.js';
import { renderSwaggerContent } from './components/swagger/index.js';
import { svgArrowDown, svgArrowUp } from './components/swagger/ui/icons.js';
import { injectMusicPlayer, injectHireModal, initHireModal, initThemeToggle, initFormspree } from './shared.js';
import { initMusicPlayer } from './cv-music-player.js';

injectMusicPlayer();
injectHireModal('hire', { dynamicSubject: true });

const swaggerEl = document.getElementById('swagger-ui');
swaggerEl.innerHTML = renderSwaggerContent(CV_DATA);

// Collapse/expand tag sections
document.querySelectorAll('.opblock-tag-section').forEach(section => {
  section.querySelector('.opblock-tag')?.addEventListener('click', e => {
    e.stopPropagation();
    section.classList.toggle('is-open');
    const arrow = section.querySelector('.expand-operation');
    if (arrow) arrow.innerHTML = section.classList.contains('is-open') ? svgArrowDown : svgArrowUp;
  });
});

// Collapse/expand individual endpoints
document.querySelectorAll('.opblock-summary-control').forEach(ctrl => {
  ctrl.addEventListener('click', () => {
    const opblock = ctrl.closest('.opblock');
    if (!opblock) return;
    opblock.classList.toggle('is-open');
    const arrow = opblock.querySelector('.opblock-control-arrow');
    if (arrow) arrow.innerHTML = opblock.classList.contains('is-open') ? svgArrowDown : svgArrowUp;
  });
});

initThemeToggle();
initHireModal('hire');
initFormspree('#hire-form');
initMusicPlayer();

window.showToast = function (msg) {
  const container = document.getElementById('cv-toaster-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'cv-toast';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('cv-toast-fade');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
};
```

- [ ] **Step 2: Update `cv-swagger.html` — replace script tags**

Remove:

```html
<script defer src="./scripts/shared.js"></script>
<script defer src="./scripts/cv-data.js"></script>
<script defer src="./scripts/cv-music-player.js"></script>
<script defer src="./scripts/cv-swagger.js"></script>
<script src="https://unpkg.com/@formspree/ajax@1" defer></script>
```

Replace with:

```html
<script src="https://unpkg.com/@formspree/ajax@1" defer></script>
<script type="module" src="./scripts/cv-swagger.js"></script>
```

- [ ] **Step 3: Test cv-swagger.html in Live Server**

Verify:
- All sections render (identity, workExperience, education, skills, community, hobbyProjects, meta)
- Tag sections collapse/expand on header click
- Individual endpoints collapse/expand on row click
- Theme toggle works (light/dark)
- "Hire" button opens modal
- Music player works
- No console errors

- [ ] **Step 4: Commit**

```bash
git add scripts/cv-swagger.js cv-swagger.html
git commit -m "feat: migrate cv-swagger to ES module"
```

---

## Task 10: Migrate cv-json.js + cv-json.html

**Files:**
- Modify: `scripts/cv-json.js`
- Modify: `cv-json.html`

- [ ] **Step 1: Update the top of `scripts/cv-json.js`**

Replace the first line:

```js
const L = CV.renderJsonCV(CV_DATA);
```

with:

```js
import { CV_DATA } from './cv-data.js';
import { renderJsonCV } from './components/json/index.js';
import { injectMusicPlayer, injectHireModal, initHireModal, initFormspree } from './shared.js';
import { initMusicPlayer } from './cv-music-player.js';

injectMusicPlayer();
injectHireModal('hire-json', {
  subject: 'Hire inquiry from CV - json',
  p1Class: 'cv-json-inline-5',
  p2Class: 'cv-json-inline-6',
  errClass: 'cv-json-inline-8',
});

const L = renderJsonCV(CV_DATA);
```

Then at the bottom of `cv-json.js`, replace the old hire modal block (lines 136–164):

```js
// Remove the old CV.hireModalHTML / CV.initHireModal block entirely.
// Replace with:
initHireModal('hire-json');
initFormspree('#hire-json-form');
initMusicPlayer();
```

Everything between the new imports and the old hire block (the fold logic, DOM rendering, syncGutterHeights, toggleFold, event listeners) stays **unchanged**.

- [ ] **Step 2: Update `cv-json.html` — replace script tags**

Find and remove all `<script defer src="./scripts/...">` tags. Replace with:

```html
<script src="https://unpkg.com/@formspree/ajax@1" defer></script>
<script type="module" src="./scripts/cv-json.js"></script>
```

Keep the Google Fonts link and all CSS links unchanged.

- [ ] **Step 3: Test cv-json.html in Live Server**

Verify:
- JSON viewer renders with correct content and syntax highlighting
- Fold/unfold arrows work
- Line numbers sync with code area height
- Music player works (via Music menu button)
- Hire modal opens
- No console errors

- [ ] **Step 4: Commit**

```bash
git add scripts/cv-json.js cv-json.html
git commit -m "feat: migrate cv-json to ES module"
```

---

## Task 11: Migrate cv-index.js + index.html

**Files:**
- Modify: `scripts/cv-index.js`
- Modify: `index.html`

- [ ] **Step 1: Replace `scripts/cv-index.js`**

```js
import { injectHireModal, initHireModal, initThemeToggle, initFormspree } from './shared.js';

injectHireModal('hire-index', {
  subject: 'Hire inquiry from index',
  simple: true,
  p1Class: 'fs-success-title',
  p2Class: 'fs-success-msg',
  errClass: 'fs-error-msg',
});

initHireModal('hire-index');

initThemeToggle({
  onSet(theme, btn) {
    btn.textContent = theme === 'light' ? '🌙' : '☀️';
  },
});

initFormspree('#hire-index-form');
```

- [ ] **Step 2: Update `index.html` — replace script tags**

Remove:

```html
<script defer src="./scripts/shared.js"></script>
<script defer src="./scripts/cv-index.js"></script>
<script src="https://unpkg.com/@formspree/ajax@1" defer></script>
```

Replace with:

```html
<script src="https://unpkg.com/@formspree/ajax@1" defer></script>
<script type="module" src="./scripts/cv-index.js"></script>
```

- [ ] **Step 3: Test index.html in Live Server**

Verify:
- All four CV links render
- Theme toggle switches light/dark
- "Hire Me" button opens modal
- No console errors

- [ ] **Step 4: Commit**

```bash
git add scripts/cv-index.js index.html
git commit -m "feat: migrate cv-index to ES module"
```

---

## Self-review notes

**Spec coverage check:**
- ✅ cv-data.js export — Task 5
- ✅ shared.js utility-only with named exports — Task 6
- ✅ cv-music-player.js → export function — Task 7
- ✅ components/plain/* — Task 1
- ✅ components/swagger/ui/* — Task 2
- ✅ components/swagger/sections/* + index — Task 3
- ✅ components/json/* — Task 4
- ✅ All 4 page scripts migrated — Tasks 8–11
- ✅ All 4 HTML files updated — Tasks 8–11

**Known gap:** The summary section in swagger (`/summary` GET endpoint) is simplified in Task 3 Step 8 compared to the original. If exact parity is needed, replicate the `swgGet` call from `shared.js` line ~660 in `components/swagger/index.js`.

**Type consistency check:**
- `pushStringArray` returns `[depth, html][]` — consumed with spread in Task 4 sections ✅
- `renderJsonCV` returns `[depth, html][]` — consumed by existing `cv-json.js` as `const L` ✅
- `renderSwaggerContent` returns a string — consumed by `swaggerEl.innerHTML` ✅
- `renderPlainCV` returns a string — consumed by `cv-content.innerHTML` ✅
