# HR Review — Általános átvizsgálás

**Típus:** hr-review
**Dátum:** 2026-06-17 06:58
**CV verzió:** 2026-06-15_manual — Manual Backup @ — (2026-06-15)
**Mód:** Általános

---

## Összefoglalás

A CV erős frontend tech lead profilt mutat, jól strukturált adatokkal és hatásorientált bullet-ekkel. A legfőbb erősség az Aegex szekció (részletes projektleírások, mérhető eredmények). Két konkrét javítási lehetőséget találtam: (1) a WebforSol pozíció címében a "Full Stack Developer" ellentmond a `profile/_basic.md` irányelvnek, (2) a tesztelési skill-ek (Jest, Vitest, Playwright) külön csoportban vannak, pedig tech lead pozícióknál primary-ba illenének.

---

## CV Minőségi megjegyzések

### 1. WebforSol pozíció cím — ellentmondás a profil irányelvvel

**Probléma:** A `cv-data.js`-ben a WebforSol pozíció címe: `"Freelancer Full Stack Developer"`. Ugyanakkor a `profile/_basic.md` explicit kimondja: *"Sose írd a CV-be, hogy Full-stack, vagy backend tapasztalatom van"*.

**Javaslat:** Változtass a címre: `"Freelance Frontend Developer"` vagy `"Freelance Web Developer"`. Ez összhangban van a `_basic.md` irányelvvel, és pontosabban tükrözi a tényleges fókuszt (a leírás és bullet-ek is frontend/React fókuszt mutatnak, a PHP/NestJS említés a bullet-ekben indokolt kontextusként).

| Jelenlegi | Javasolt |
|-----------|----------|
| `"Freelancer Full Stack Developer"` | `"Freelance Frontend Developer"` |

### 2. Tesztelési skill-ek elkülönítése

**Probléma:** A `skillGroups.testing` csoportban lévő `Jest`, `Vitest`, `Playwright` nincsenek a `primary` listában. Frontend tech lead pozícióknál a tesztelési eszköztár ismerete alapkövetelmény — ezeket érdemes a primary skillek között is szerepeltetni.

**Javaslat:** Add hozzá `"Jest"`-et és `"Vitest"`-et a `skillGroups.primary.list`-hez. A `Playwright` maradhat a `testing` csoportban (E2E specifikus skill).

**Indoklás:** Az Aegex szekció bullet-jei között szerepel: "I implemented a CI pipeline with automated quality gates and testing strategy from scratch" és "I established test coverage from zero" — ezek a mondatok a tesztelési kompetenciát erősítik, és ATS szempontból előnyös, ha a primary skillek között is megjelennek a teszkeretrendszerek.

### 3. Összefoglaló — apró optimalizálás

**Probléma:** A summary nem említi explicit a CI/CD és tesztelési szakértelmet, pedig ez az Aegex szekció egyik legerősebb pontja.

**Javaslat:** Az utolsó mondatba illeszthető egy rövid CI/CD és tesztelési utalás:

**Jelenlegi:** `"I lead and mentor engineers, focusing on evidence-driven refactoring, CI-quality standards, and sustainable, system-level frontend foundations."`

**Javasolt:** `"I lead and mentor engineers, focusing on evidence-driven refactoring, automated testing strategies, CI-quality standards, and sustainable, system-level frontend foundations."`

### 4. Karrierváltás explicitté tétele

**Megjegyzés (nem kritikus):** A CV nem mondja ki explicit, hogy Viktor gépészmérnökből váltott szoftverfejlesztésre. A CobotX pozíció (Engineering Manager, ipari robotika) ATS-ben zavart okozhat, mert nem illeszkedik a frontend tech lead narratívába. Az `education` szekcióban feltüntetett gépészmérnöki diplomák és a CobotX leírás közötti kapcsolat nem egyértelmű.

**Javaslat:** Ha van olyan kontextus, ahol ez releváns (pl. multidiszciplináris pozíciók), érdemes lehet a summary-ban vagy egy rövid megjegyzésben jelezni a sikeres karrierváltást. A GENERAL review szempontjából ez nem kritikus, de JD-alapú értékelésnél figyelembe veendő.

---

## További dimenziók — nincs érdemi probléma

### Summary minőség
A summary jól felépített, 4 mondat (ATS-optimális). Tartalmazza a senioritást, kulcstechnológiákat (TypeScript, Svelte, React, Node.js), és hatásmetrikákat. Nem találtam gyenge vagy generikus megfogalmazást.

### Skill lefedettség
Jó eloszlás: primary/reaktív frontend, backend, tesztelés, tooling, AI kategóriák. A `robotics` csoport egyedi húzás, de nem zavaró — "surprise!" komment jól kommunikálja a szándékot.

### Bullet minőség
Aegex bullet-ek kiemelkedőek: hatás-akció-eredmény minta, számszerűsített eredmények (havi→kétheti release, test coverage 0-ról). A többi pozíció bullet-jei szintén erősek, konzisztens "I ..." kezdéssel. Nincs érdemi redundancia a pozíciók között.

### Kronológiai konzisztencia
Nincs magyarázatlan rés > 3 hónap. A CobotX és WebforSol átfedése (2021-08 – 2022-08) indokolt (részmunkaidős freelance a mérnöki állás mellett). A rövidebb pozíciók (Cubicfox 5 hó, Scolia 7 hó, Telekom 5 hó) a karrierváltás korai szakaszába esnek, nem kirívóak.

### ATS strukturális szempontok
Szekció fejlécek szabványosak. Kulcsszó-sűrűség megfelelő (TypeScript, React, frontend gyakran előfordul). Nyelvezet világos, konzisztens, megfelelően formális.

---

_Generálta: /hr-review skill — Viktor Bozzay CV-je alapján_
_Forrás adat: scripts/cv-data.js — kizárólag meglévő adatok alapján_
