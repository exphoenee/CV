---
title: 'Frontend Tech Lead'
seniority: 'Senior'
period:
  from: '2023-11'
  to: null
profession: 'software'
type: 'work'
domain: 'enterprise SaaS, compliance'
leader: true
skills:
  [Svelte, React, TypeScript, Node.js, Express, MySQL, Python, CI/CD, Claude, Codex, Mentoring]
---

# Aegex Technologies — Frontend Tech Lead (Nov 2023 – jelen)

## Cégháttér

<!-- Mit csinál a cég? Iparág, termékkör, méret, tulajdonosi háttér -->

## Csapat és szerepem

<!-- Csapatstruktúra: hány ember, kinek tartozom be, ki tartozik nekem -->

Csapatméret: 2 fő (én + 1 mid-level engineer, akit mentorálok) + 1 .NET backend fejlesztő.

Felelősségi körök: end-to-end delivery of SafeSy and FACTS — system design, frontend architecture, backend integration.

### Ownership & soft skill (szerep-szintű, CV-ben felhasználható)

- Senior technical owner role — product strategy and platform architecture, beyond pure task execution
- Extreme ownership mindset — output- and deadline-driven, async working style focused on strategic objectives rather than hours
- Strategic adaptability: fully rewrote the system three times to keep it aligned with the company's evolving business strategy
- Reduced business risk: introduced code-quality standards and documentation where none existed, kept management with full visibility and control, and minimized the bus factor through transparency
- Cross-platform continuity through deep product/architecture/process knowledge, reducing onboarding and knowledge-transfer overhead

---

## SafeSy projekt — Belső gyártásirányítási rendszer

### Mit oldottunk meg

<!-- Mi volt az üzleti probléma? Miért kellett ez a rendszer? -->

“FACTS” stands for Feedstock and Compliance Tracking System. It is a comprehensive set of software solutions including the FACTS Portal that have been designed to streamline the process for companies that are required by the Environmental Protection Agency (“EPA”) under 40 CFR § 80.1454(j)(1) to have source (points of origin) records for separated yard waste, separated food waste, and biogenic waste oils/fats/greases.
The FACTS Portal serves as an online interface within the FACTS system, empowering users to easily upload and manage source data, including bills of lading and product transfer documents. This secure platform facilitates the confidential exchange of point-of-origin information between buyers and sellers.
Account Admin: Manage company users. Add/Edit or Enable/Disable users.
Acknowledge Alerts: Acknowledge receipt of notifications (“mark as read”). Notification messages include BOL Status and Auditor Assignment.
Auditor Manager: Receives company Auditor Assignment notifications. If “Acknowledge Alerts” is assigned it will allow a user to confirm Auditor Assignment on behalf of a non-Producer company user.
Query BOLs: View and Search Bills of Lading on the BOLs page.
Query Sources: View Sources uploaded to FACTS.
Register BOLs: Register Bills of Lading; transfer of oil details between buyers and sellers. Receive BOL Status notifications. If “Acknowledge Alerts” is assigned will allow a user to acknowledge the message.
Upload Sources: Upload Source (point of origin) data to FACTS.

### Amit építettem

- Cross-role enterprise platform: production, office, executives, partners — real-time workflow and inventory tracking
- Reusable internal Svelte component library used across the platform
- Subscribable daily email reporting system
- Express backend contribution: SQL query design and optimization

### Technológia kontextus

<!-- Svelte: hogyan használtam, milyen szinten, mit csináltam vele -->
<!-- Belső komponenskönyvtár: méret, struktúra, design rendszer -->
<!-- Express backend: milyen részek, SQL optimalizálás konkrétan -->

**Tech stack:** Svelte · TypeScript · Node.js · ExpressJS · MySQL · SCSS · Vite

### Eredmények

<!-- Mérőszámok, ha vannak: fejlesztési idő, hibák száma, felhasználói elégedettség -->

---

## FACTS projekt — Feedstock and Compliance Tracking System

**Link:** https://facts.aegex.com · https://driver.aegex.com

### Mit oldottunk meg

<!-- Mi volt a kiinduló állapot? Milyen problémák volt a régi rendszerrel? -->

### Amit építettem

- Release ciklus csökkentése: havontáról kéthetente (cél: heti) — AI-assisted development workflows (Claude-based tooling)
- CI pipeline bevezetése automated quality gate-ekkel; test coverage 0-ról felépítve, production issue-k jelentős csökkentése
- Architektúra migráció: PNPM monorepo; shared FACTS/Driver package kiemelése újrahasznosítható packageként — a shared library skálázhatóságra tervezve (egy tervezett harmadik termék már validálja)
- Belső CLI tooling: monorepo workflow automatizálás, fejlesztői produktivitás
- Engineering platform folyamatos fejlesztése: dev workflow-k, testing infrastructure, documentation practices — delivery speed, quality, long-term maintainability

### AI-alapú fejlesztési workflow

Claude-alapú tooling bevezetése.

<!-- Pontosan mit automatizáltam? Milyen mérőszámokkal mérhető az eredmény? -->

### Technológia kontextus

**Tech stack:** React · TypeScript · PNPM · Vitest · Playwright · Jest · Claude · Codex

<!-- React: milyen szintű architekturális döntések -->
<!-- Vitest + Playwright: tesztstratégia, lefedettség mértéke -->

### Eredmények

- Release ciklus: havonta → kéthetente (cél: heti)
- Test coverage: 0-ról felépítve
- Production hibák: jelentős csökkentés

<!-- Konkrét számok ha mérhetők -->

---

## Teljes skill-lista (Aegex)

Svelte, React, TypeScript, Node.js, ExpressJS, MySQL, Python, SCSS, Vite, PNPM, Jest, Vitest, Playwright, Claude, Codex

---

## Egyéb megjegyzések

Légkör: I led the architectural modernization of two enterprise legacy systems. Full rewrites and migrations to modern frontend stacks.

<!-- Amit nem írtam be a CV-be, de releváns lehet állásajánlatoknál -->
<!-- Domain tudás: EPA compliance, feedstock tracking, biogenic supply chain -->
<!-- Soft skill megfigyelések -->
