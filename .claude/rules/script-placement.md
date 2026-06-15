# Script elhelyezési szabály (script placement rule)

A projektben **kétféle script** létezik, és ezeket **szigorúan elkülönített mappákban** kell tartani.

---

## `scripts/` — CV weboldal termék scriptjei

Ide **CSAK** a CV honlap működéséhez szükséges fájlok tartoznak:

| Mit | Példa |
|---|---|
| View-k JS logikája | `scripts/cv-plain.js`, `scripts/cv-swagger.js` |
| Komponensek | `scripts/components/` |
| Játékmotor | `scripts/game/main.js`, `scripts/game/entities/` |
| Adat | `scripts/cv-data.js` |
| Lokalizáció UI feliratok | `scripts/locales/hu.js`, `scripts/locales/en.js` (labels) |
| Konfiguráció | `scripts/config.js` |
| Közös API | `scripts/shared.js`, `scripts/locale.js` |
| CSS stílusok | `styles/cv-plain.css` |
| HTML oldalak | `index.html`, `cv-plain.html` |

Ebbe a mappába **TILOS** AI workflow-ok által használt scripteket elhelyezni.

---

## `.claude/` — AI workflow scriptjei

Ide tartoznak az AI által használt összes segédeszköz, például:

| Hely | Mit | Példa |
|---|---|---|
| `.claude/scripts/` | Globális AI segédscriptek (több agent/skill által használt) | `cv-ledger.py`, `check-translation-lengths.py` |
| `.claude/skills/<skill>/scripts/` | Skill-specifikus scriptek | `cv-backup/scripts/cv-backup.py` |
| `.claude/agents/<agent>/` | Agent-definíciók és azok scriptjei | `cv-backup-agent.md` |

**Szabály:** Ha egy scriptet AI agent vagy skill hív meg (pl. job-apply-orchestrator, cv-translator-agent), akkor annak **`.claude/`** alatt kell lennie — SOHA nem a `scripts/` mappában.

---

## Ellenőrző lista

Új script létrehozásakor:

1. **Mit csinál a script?**
   - CV weboldal funkció (view renderelés, adat, játék, zene) → `scripts/`
   - AI workflow támogatás (validáció, backup, fordítás, elemzés) → `.claude/`

2. **Ki hívja meg?**
   - Böngésző (HTML `<script>` tag) → `scripts/`
   - AI agent / skill / terminál parancs → `.claude/`

3. **Hova kerüljön `.claude/`-on belül?**
   - Egyetlen agent/skill használja → `.claude/skills/<skill>/scripts/` vagy `.claude/agents/<agent>/`
   - Több is használja → `.claude/scripts/`

---

## Kivételek

- `scripts/config.js` — bár a CV weboldal része, AI agentek is olvashatják (pl. security-review). Ez **megengedett**, mert maga a termék része.
- `scripts/cv-data.js` — a CV adatforrása, AI agentek is módosítják (pl. job-apply, cv-improver). Ez **megengedett**, mert maga a termék adata.
