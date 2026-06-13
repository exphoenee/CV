# Arch Review Report Format

## Filename

```
review/DATE_TIME_arch-review-FOCUS.md
```

e.g. `review/2026-06-13_1430_arch-review-all.md`

Create `review/` if it does not exist.

---

## Report structure

```markdown
# Architekturális Átvizsgálás
**Típus:** arch-review
**Dátum:** YYYY-MM-DD HH:MM
**Hatókör:** FOCUS
**Elemzett fájlok:** N
**Generálta:** arch-review-agent

---

## Összefoglalás

[3–5 mondat: jelenlegi állapot, legsúlyosabb fájdalompontok, legfontosabb javaslatok]

---

## Értékelési mátrix

| Dimenzió | Fájdalomszint | Javítási potenciál | Erőfeszítés |
|---|---|---|---|
| Template duplikáció | 🔴/🟡/🟢 | ⬆️/➡️/⬇️ | 💪/🔧/⚡ |
| Adat struktúra | ... | ... | ... |
| Locale rendszer | ... | ... | ... |
| CSS architektúra | ... | ... | ... |
| Tooling / DX | ... | ... | ... |

---

## Részletes elemzés

### Template Duplikáció
**Mérések:** HEAD_IDENTICAL_LINES%, SHARED_CSS_IMPORTS lista, stb.
**Megállapítások:** [konkrét megállapítások fájlhivatkozásokkal]

### Adat Struktúra
**Mérések:** TOP_LEVEL_KEYS, WORK_ENTRIES, TOTAL_BULLETS, SKILL_GROUPS, HAS_JSDOC
**Megállapítások:** [konkrét megállapítások]

### Locale Rendszer
**Mérések:** EN_KEY_COUNT, hiányzó kulcsok táblázata, content override-ok listája
**Megállapítások:** [konkrét megállapítások]

### CSS Architektúra
**Mérések:** VAR_COVERAGE_RATIO%, DUPLICATE_MEDIA_QUERIES száma
**Megállapítások:** [konkrét megállapítások]

### Tooling / DX

| Feladat | Manuális lépések | Hibalehetőség |
|---|---|---|
| Új nézet hozzáadása | N | Közepes |
| Új locale kulcs | 12 fájl | Magas |
| CV tartalom frissítése | 1 fájl | Alacsony |
| Locale ellenőrzés | /locale-check skill | Alacsony (automatizált) |

**Megállapítások:** [konkrét megállapítások]

---

## Javaslatok

### ⚡ Tier 1 — Gyors győzelmek (azonnali, kockázatmentes)

#### T1-N: [Javaslat neve]
**Probléma:** [mit old meg]  
**Megoldás:** [konkrét leírás]  
**Érintett fájlok:** [lista]  
**Várható előny:** [specifikus előny]  
**Erőfeszítés:** ~X perc/óra

### 🔧 Tier 2 — Közepes javítások (1–3 nap)

#### T2-N: [Javaslat neve]
**Probléma:** [mit old meg]  
**Megoldás:** [konkrét leírás, migrációs lépésekkel]  
**Érintett fájlok:** [lista]  
**Kockázat:** [mi törhet el, hogyan kezelhető]  
**Erőfeszítés:** ~X nap

### 💪 Tier 3 — Stratégiai változtatások

#### T3-N: [Javaslat neve]
**Probléma:** [fájdalompont]  
**Megoldás:** [teljes leírás]  
**Migrációs terv:** [lépések]  
**A site fut build lépés nélkül?:** Igen — [hogyan]  
**Kockázat:** [mi törhet el a migráció során]

### 🏗️ Tier 4 — Tech Stack Evolúció
[Csak akkor szerepel, ha az elemzés egyértelműen indokolja]

---

## Következő lépések (prioritás szerint)

1. [TOP_RECOMMENDATION]
2. [második prioritás]
3. [harmadik prioritás]

---

*Generálta: arch-review-agent*  
*Forrás: scripts/cv-data.js · scripts/shared.js · scripts/locales/ · styles/ · cv-*.html*  
*Constraint: A site marad statikus HTML+CSS+JS, build lépés nélkül futtatható.*
```
