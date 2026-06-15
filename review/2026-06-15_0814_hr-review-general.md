# HR Review — Általános átvizsgálás
**Típus:** hr-review
**Dátum:** 2026-06-15 08:14
**Mód:** Általános

---

## Összefoglalás

A CV erős, jól strukturált és metrikákban gazdag — a munkatapasztalat-bullet-ok példásan követik az action–impact–result mintát (release ciklus havi→kétheti, 0-ról felépített tesztlefedettség, 4 fős csapat vezetése). A legnagyobb kiaknázatlan lehetőség az **összefoglaló (summary)**: ez az ATS által legmagasabb súllyal olvasott mező, mégsem tartalmaz konkrét technológia-kulcsszavakat (TypeScript, React, Svelte, Node.js), és nem hozza előre a **Tech Lead / vezetői** pozícionálást. Másodlagos teendő: a **CI/CD** és néhány beágyazott skill (WebSocket, REST API) hiányzik a `skillGroups`-ból, pedig a bullet-okban egyértelmű bizonyíték van rájuk.

---

## CV Minőségi megjegyzések

### ⚠️ 1. Összefoglaló — hiányzó technológia-kulcsszavak és vezetői pozícionálás (3f)

A jelenlegi summary:

> "Frontend Engineer specializing in frontend architecture, system design, and large-scale legacy modernization. I've led full rewrites and migrations of enterprise systems to modern stacks…"

Problémák:
- **Cím-inkonzisztencia:** a summary „Frontend **Engineer**"-ként nyit, miközben a `meta.role` és a jelenlegi pozíció (`workExperience[0].title`) egyaránt **„Frontend Tech Lead"**. Az ATS és a HR is a felső sorból olvassa ki a szintet.
- **Nincs konkrét tech-kulcsszó:** a TypeScript, Svelte, React, Node.js egyik sem szerepel a summary-ban — pedig ATS-szempontból ez a legnagyobb súlyú szövegmező. (Forrás: `skillGroups.primary`, `workExperience[].skills[]`.)
- **Nincs vezetői jelzés:** a CV-ben egyértelmű vezetői evidencia van (`aegex`: „mentoring and leading 1 mid-level engineer"; `cobotx`: „built and led a team of 4 engineers"), de a summary ezt nem hozza előre.

→ Lásd a *Javasolt összefoglaló* szekciót. Minden új elem meglévő, visszakövethető adatból származik.

### ⚠️ 2. CI/CD hiányzik explicit skillként (3g)

A `skillGroups` egyetlen csoportja sem tartalmazza a **CI/CD**-t, miközben a CI pipeline építése a CV egyik legerősebb, ismételten bizonyított kompetenciája:
- `aegex` bullet: „I implemented a CI pipeline with automated quality gates and testing strategy from scratch"
- `aegex` / FACTS: „I introduced a CI pipeline with automated quality gates…"
- `telekom`: „…continuous integration of frontend and backend systems"

Egy Tech Lead pozícióra szűrő ATS gyakran a „CI/CD" / „CI pipeline" kulcsszóra keres. Jelenleg ez csak bullet-szövegben van jelen, skillként nem — érdemes felvenni a `skillGroups.tooling` (vagy egy `devops`) csoportba. *Nem új adat — a meglévő bullet-okban dokumentált képesség kiemelése.*

### ⚠️ 3. Beágyazott, ki nem emelt skillek (3g)

A `skillGroups`-ból hiányzik néhány, az egyes állásoknál meglévő, de összesítve nem felszínre hozott készség:
- **WebSocket** — `scolia`: „I integrated WebSocket-based real-time data streams…" (real-time pozícióknál erős kulcsszó)
- **REST API** — `webforsol`: „I designed and implemented REST APIs and modular backend architectures"

Ezek valós, visszakövethető skillek; a `skillGroups`-ba emelésük javítja az ATS-lefedettséget anélkül, hogy bármi újat állítanánk.

### ⚠️ 4. Technológianév-konzisztencia (3j)

Apró, de ATS-normalizálást érintő eltérés:
- `skillGroups.backend` → **„Express.js"**, viszont `workExperience[0].skills` (aegex) → **„ExpressJS"**.

Érdemes egységesíteni (ajánlott a hivatalos alak: **„Express"** / „Express.js"), hogy az ATS ugyanannak a kulcsszónak számolja.

### ✅ 5. Bullet-minőség és metrikák — rendben (3h)

A bullet-ok többsége kvantifikált és hatásorientált. Egyetlen apró megjegyzés: a
„I collaborated with design and backend teams to deliver…" kezdetű mondat majdnem
szó szerint ismétlődik `scolia` és `cubicfox` alatt. Nem hiba, de az egyik átfogalmazásával
csökkenthető a redundancia (lásd átfogalmazási javaslat).

### ✅ 6. Kronológiai konzisztencia — rendben (3i)

Az időszakok hézagmentesek és teljesek. A `webforsol` (2020-06 – 2022-11) átfedése a
`cobotx`-szel (2021-08 – 2022-08) a freelance jelleggel magyarázott — nincs indokolatlan,
3 hónapnál hosszabb hiány.

---

## Javasolt összefoglaló

> Frontend Tech Lead with 5+ years of frontend and full-stack experience, specializing in frontend architecture, system design, and large-scale legacy modernization with TypeScript, Svelte, React, and Node.js. I've led full rewrites and migrations of enterprise systems to modern stacks, improving maintainability and scalability of core platforms. I've introduced AI-assisted development workflows and built CI pipelines with automated quality gates, significantly increasing delivery speed, engineering consistency, and release reliability. I lead and mentor engineers, focusing on evidence-driven refactoring, CI-quality standards, and sustainable, system-level frontend foundations.

Mit változott és miért (minden visszakövethető):
- **„Frontend Tech Lead"** nyitás — forrás: `meta.role`, `workExperience[0].title`.
- **„5+ years"** — a legkorábbi szoftverfejlesztői szerep (`webforsol`, 2020-06) és a jelen (2026) közti időtartamból levezethető.
- **TypeScript, Svelte, React, Node.js** beemelése — forrás: `skillGroups.primary`.
- **CI pipelines / automated quality gates** — forrás: `aegex` bullet-ok.
- **„I lead and mentor engineers"** — forrás: `aegex` („mentoring and leading 1 mid-level engineer"), `cobotx` („built and led a team of 4 engineers").

*Csak átrendezés és átfogalmazás — semmi új adat nem lett hozzáadva.*

---

## Skill-ek ajánlott módosítása (általánosan)

1. **CI/CD** felvétele a `skillGroups.tooling` csoportba (vagy új `devops` csoport) — *erős, ismételten dokumentált kompetencia, jelenleg csak bullet-szövegben.*
2. **WebSocket** felvétele — *`scolia` real-time munkából, jelenleg csak job-szinten látszik.*
3. **REST API** felvétele a `backend` csoportba — *`webforsol`-ból, jelenleg nincs összesítve.*
4. **„Express.js" ↔ „ExpressJS"** egységesítése egyetlen alakra.

*Csak meglévő, visszakövethető skillek kiemelése — semmi új nem kerül be.*

---

## Átfogalmazási javaslatok

### 1.
**Jelenlegi (`scolia`):** "I collaborated with design and backend teams to deliver responsive, high-performance UI systems"
**Javasolt:** "I partnered with design and backend teams to ship low-latency, high-throughput real-time UI under live data load"
**Miért:** Megszünteti a `cubicfox`-szal való majdnem szó szerinti ismétlést, és előhozza a `scolia` valódi megkülönböztetőjét (real-time, low-latency), amely a job leírásában már szerepel.

### 2.
**Jelenlegi (`summary` zárás):** "building sustainable, system-level frontend foundations"
**Javasolt:** "building sustainable, system-level frontend foundations with CI-driven quality standards"
**Miért:** A „CI" kulcsszó ATS-súlyának növelése a legmagasabb súlyú mezőben, meglévő tény (CI pipeline) alapján.

---

*Generálta: /hr-review skill — Viktor Bozzay CV-je alapján*
*Forrás adat: scripts/cv-data.js — kizárólag meglévő adatok alapján*
