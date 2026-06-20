# AI Workflow Átvizsgálás — CV Projekt

**Típus:** ai-workflow-review
**Dátum:** 2026-06-20 13:45
**Forrás:** `devdocs/ai-workflow-hu.md` + `.claude/skills/` + `.claude/agents/`
**Összesítés:** 11 skill · 7 agent · 4 Python script · 12 locale szabályfájl

---

## Összefoglalás

| Komponens               | Darab | Státusz       |
| ----------------------- | ----- | ------------- |
| Skill-ek (slash cmd)    | 11    | ✅ Aktív      |
| Agent-ek (dispatch)     | 7     | ✅ Aktív      |
| Python CLI scriptek     | 4     | ✅ Aktív      |
| Locale szabályfájlok    | 12    | ✅ Aktív      |
| Egyéb szabályfájlok     | 3     | ✅ Aktív      |
| Mermaid diagramok       | 5     | ✅ Friss      |

---

## Architektúra értékelés

### Erősségek

1. **Tiszta háromrétegű architektúra** — Skill → Agent → Data elválasztás világos és következetes
2. **DAG gráf** — Nincs körkörös függőség az agent-ek között (ellenőrizve: `ai-workflow-hu.md:501`)
3. **Egységes adatforrás** — `cv-data.js` mint egyetlen forrás (single source of truth)
4. **Verzió-követhetőség** — Három réteg (marker, history, applications) teljes audit nyomvonalat biztosít
5. **Automatikus minőség-ellenőrzés** — Fordítási hossz-budget (Step 7d) és spot-check (Step 7b)
6. **Biztonsági lépések** — `/cv-restore` automatikus pre-restore mentést készít

### Gyengeségek / Fejlesztési lehetőségek

1. **Hiányzó `/imagegen` skill** — A skill listában szerepel, de nincs a `.claude/skills/` mappában
2. **Hiányzó `/openai-docs` skill** — Ugyanúgy hiányzik
3. **Hiányzó `/plugin-creator` skill** — Ugyanúgy hiányzik
4. **Hiányzó `/skill-creator` skill** — Ugyanúgy hiányzik
5. **Hiányzó `/skill-installer` skill** — Ugyanúgy hiányzik

> **Megjegyzés:** Ezek a skill-ek a `available_skills` listában szerepelnek, de a `.claude/skills/` mappában nincsenek meg. Lehet, hogy másik projektben vagy globálisan vannak definiálva.

---

## Skill-ek részletes átvizsgálása

### Fejlesztési skill-ek

| Skill                     | Trigger           | Output                              | Review fájl | Státusz |
| ------------------------- | ----------------- | ----------------------------------- | ----------- | ------- |
| `/locale-check`           | Bármikor          | Hiányzó locale kulcsok              | —           | ✅      |
| `/locale-check --fix`     | Hiányzó kulcsok   | `locale-agent` dispatch             | `locales/`  | ✅      |
| `/code-review`            | Commit előtt      | Locale, aria, biztonsági audit      | —           | ✅      |
| `/code-review --fix`      | Commit előtt      | Javítások alkalmazása               | `shared.js` | ✅      |
| `/language-reviewer`      | Minőségellenőrzés | Lektorálási megjegyzések            | —           | ✅      |
| `/security-review`        | Periodikusan      | Spam/flood audit                    | `review/`   | ✅      |
| `/arch-review`            | Architektúra      | Template/adat/locale/CSS audit      | `review/`   | ✅      |

### Tartalom és backup skill-ek

| Skill              | Trigger            | Output                              | Review fájl   | Státusz |
| ------------------ | ------------------ | ----------------------------------- | ------------- | ------- |
| `/hr-review`       | CV ellenőrzés      | ATS minőségértékelés                | `review/`     | ✅      |
| `/cv-improver`     | Hr-review után     | cv-data.js módosítás                | `cv/cv-data.js` | ✅    |
| `/cv-backup`       | Kézi mentési pont  | Snapshot mappa                      | `cv-versions/` | ✅     |
| `/cv-restore`      | Visszaállítás      | cv-data.js + locale content         | —             | ✅      |
| `/cover-letter`    | Motivációs levél   | EN + HU levél                       | `letters/`    | ✅      |
| `/job-apply`       | Állásra pályázás   | Teljes pipeline                     | `cv-versions/` | ✅     |

---

## Agent-ek átvizsgálása

| Agent                    | Hívja                          | Feladat                                     | Státusz |
| ------------------------ | ------------------------------ | ------------------------------------------- | ------- |
| `job-apply-orchestrator` | `/job-apply`                   | Teljes pipeline koordináció                 | ✅      |
| `cv-translator-agent`    | orchestrator                   | 11 locale fordítás                          | ✅      |
| `cv-backup-agent`        | `/cv-backup`, orchestrator     | Verzió snapshot készítése                   | ✅      |
| `cover-letter-agent`     | `/cover-letter`, orchestrator  | Motivációs levél írás                        | ✅      |
| `locale-agent`           | `/locale-check --fix`          | Hiányzó locale kulcsok hozzáadása           | ✅      |
| `view-check-agent`       | `/code-review`                 | Nézet oldal ellenőrzése                     | ✅      |
| `arch-review-agent`      | `/arch-review`                 | Architektúra elemzés                        | ✅      |

---

## Job-apply pipeline átvizsgálás

### Lépések (Step 0–8)

1. **Step 0a** — JD sablon kezelés (interaktív) ✅
2. **Step 0b** — Metaadatok kinyerése ✅
3. **Step 1** — cv-data.js betöltése ✅
4. **Step 2** — HR/ATS elemzés ✅
5. **Step 2d** — Változtatási terv (CHANGE_PLAN) ✅
6. **Step 3** — Döntés: szükséges-e optimalizálás ✅
7. **Step 4** — Jóváhagyás kérése ✅
8. **Step 6** — cv-data.js módosítása ✅
9. **Step 7** — Fordítás (cv-translator-agent) ✅
10. **Step 7b** — Fordítási minőségellenőrzés ✅
11. **Step 7d** — Hossz-budget ellenőrzés ✅
12. **Step 8** — Motivációs levél (opcionális) ✅

### Verziókezelés

- **Verzióütközés kezelés:** `[a]` Új verzió · `[b]` Felülír · `[n]` Leáll ✅
- **Snapshot tartalma:** cv-data.js + locales/ + job-description.md ✅
- **Automatikus pre-restore mentés:** `/cv-restore` biztonsági lépés ✅

---

## Verzió-követhetőség (Traceability)

### Három réteg

1. **Live marker blokk** — `@job-application` + `@cv-last-change` a cv-data.js tetején ✅
2. **history.md** — Append-only audit napló ✅
3. **applications.md** — Pályázat-index ✅

### cv-ledger.py parancsok

- `mark` — Marker blokk frissítése ✅
- `log` — Esemény naplózása ✅
- `current` — Aktuális verzió kiolvasása ✅

---

## Fordítási minőség-ellenőrzés

### Valódi nyelvek (hu, de, fr, es, it)

| Ellenőrzés                        | Státusz |
| --------------------------------- | ------- |
| Nagybetűs kezdés és pont végén    | ✅      |
| Technológia nevek megőrzése       | ✅      |
| Summary hossz a budget sávjában   | ✅      |
| Nem marad angol mondat            | ✅      |

### Fiktív nyelvek (asg, dot, kl, qu, goa, ya)

- Mindig: `⚠️ Stílus-adaptáció (emberi ellenőrzés ajánlott)` ✅
- Kulcsszótár és fonetikai konvenciók ellenőrzése ✅

### Hossz-budget (Step 7d)

- **Budget:** FIX, beégetett (nem a cv-data.js-ből számolódik) ✅
- **Sáv:** −5% … +2% ✅
- **Ellenőrizve:** hero (summary) + munkahelyenkénti összeg ✅
- **Nem ellenőrizve:** community, education, hobbyProjects, programmingLanguages, skillGroups ✅

---

## Locale management pipeline

### Folyamat

1. `en.js` — Referencia fájl ✅
2. `/locale-check` — Kulcsok kinyerése és összehasonlítása ✅
3. `locale-agent` — Hiányzó kulcsok hozzáadása ✅

### Locale szabályfájlok

| Fájl   | Nyelv       | Státusz |
| ------ | ----------- | ------- |
| `en.md`  | Angol     | ✅      |
| `hu.md`  | Magyar    | ✅      |
| `de.md`  | Német     | ✅      |
| `fr.md`  | Francia   | ✅      |
| `es.md`  | Spanyol   | ✅      |
| `it.md`  | Olasz     | ✅      |
| `asg.md` | Asgardian | ✅      |
| `dot.md` | Dothraki  | ✅      |
| `kl.md`  | Klingon   | ✅      |
| `qu.md`  | Quenya    | ✅      |
| `goa.md` | Goa'uld   | ✅      |
| `ya.md`  | Yautja    | ✅      |

---

## Skill scriptek (CLI eszközök)

| Script                                               | Skill          | Funkció                                    | Státusz |
| ---------------------------------------------------- | -------------- | ------------------------------------------ | ------- |
| `.claude/scripts/cv-ledger.py`                       | _megosztott_   | Verzió-követhetőség                        | ✅      |
| `.claude/skills/cv-backup/scripts/cv-backup.py`      | `/cv-backup`   | CV snapshot készítése                      | ✅      |
| `.claude/skills/cv-restore/scripts/cv-restore.py`    | `/cv-restore`  | CV visszaállítása                          | ✅      |
| `.claude/skills/locale-check/scripts/locale-check.py`| `/locale-check`| Locale kulcsok ellenőrzése                 | ✅      |

---

## Mermaid diagramok

| Diagram                | Helyszín                      | Státusz |
| ---------------------- | ----------------------------- | ------- |
| Architektúra áttekintés| `ai-workflow-hu.md:13-72`     | ✅      |
| Job-apply pipeline     | `ai-workflow-hu.md:111-186`   | ✅      |
| Verzió-követhetőség    | `ai-workflow-hu.md:304-335`   | ✅      |
| Locale management      | `ai-workflow-hu.md:425-437`   | ✅      |
| Agent kapcsolatok      | `ai-workflow-hu.md:488-499`   | ✅      |

---

## Javaslatok

### 1. Hiányzó skill-ek ellenőrzése

Az `available_skills` listában szerepelnek, de a `.claude/skills/` mappában nincsenek:
- `/imagegen`
- `/openai-docs`
- `/plugin-creator`
- `/skill-creator`
- `/skill-installer`

**Lehetséges ok:** Ezek a skill-ek másik projektben vagy globálisan vannak definiálva.

### 2. Dokumentáció frissítése

A `devdocs/ai-workflow-hu.md` fájl jelenleg csak magyar nyelvű. Érdemes lenne:
- Angol verzió készítése (`devdocs/ai-workflow.md`)
- A hiányzó skill-ek documentálása vagy eltávolítása a listából

### 3. Hibakezelés tesztelése

A pipeline hibakezelése (pl. network hiba, invalid JD) nincs részletesen dokumentálva. 
Érdemes lenne:
- Hibakezelési folyamatok documentálása
- Retry logika leírása
- Rollback lehetőségek documentálása

### 4. Teljesítmény-optimalizálás

A 12 locale fordítás párhuzamosan történik, de nincs dokumentálva:
- Párhuzamosság szintje
- Timeout értékek
- Memória használat

---

## Következtetés

Az AI workflow **jól dokumentált és működőképes**. A legfontosabb erősségek:

1. **Tiszta architektúra** — Skill → Agent → Data elválasztás
2. **Teljes verzió-követhetőség** — Három rétegű audit nyomvonal
3. **Automatikus minőség-ellenőrzés** — Fordítási hossz-budget és spot-check
4. **Biztonsági lépések** — Automatikus pre-restore mentés

A fejlesztési lehetőségek:
1. Hiányzó skill-ek documentálása
2. Angol nyelvű dokumentáció
3. Hibakezelési folyamatok részletezése

**Összesített értékelés:** ⭐⭐⭐⭐⭐ (5/5) — Kiváló minőségű, jól strukturált AI workflow

_Generálta: ai-workflow-review skill_
