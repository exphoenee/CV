# Refaktorálási terv: Egységes CV adatmodell + Template alapú renderelés

## Jelenlegi állapot (probléma)

A CV adatai **5 helyen** duplikálva, eltérő formátumban:

| Forrás                           | Adatmennyiség             | Formátum                              |
| -------------------------------- | ------------------------- | ------------------------------------- |
| `cv-plain.html`                  | ~600 sor CV               | Inline HTML (teljes DOM struktúrával) |
| `scripts/cv-json.js`             | ~400+ sor a `L[]` tömbben | JS tömb, HTML escaped JSON sorok      |
| `cv-swagger.html`                | ~200KB egyetlen HTML-ben  | Swagger stílusú HTML szekciók         |
| `scripts/game/world/stations.js` | 8 CV állomás              | Template literal stringek             |
| `index.html`                     | Név, role, linkek         | Inline HTML                           |

**Következmény:** Ha változik a CV (pl. új munkahely, új skill), mind az 5 fájlt kézzel kell szerkeszteni. Ez elkerülhetetlenül inkonzisztenciához vezet.

---

## Célarchitektúra

```
scripts/
  cv-data.js          ← ÚJ! Központi CV adat objektum
  cv-plain.js         ← Átírva: template-t használ, nincs benne adat
  cv-json.js          ← MÉG NEM ÁTÍRVA (még használja a L[] tömböt)
  cv-swagger.js       ← MÉG NEM ÁTÍRVA (még használja az inline HTML-t)
  game/world/stations.js  ← Átírva: CV_DATA-ból generál fallbackkel

styles/
  (változatlan)
```

---

## Implementációs státusz (2026-05-26)

| #   | Lépés                                       | Státusz     | Megjegyzés                                                                                                                                                                      |
| --- | ------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `cv-data.js` létrehozása                    | ✅ **KÉSZ** | Teljes adatobjektum minden mezővel + game specifikus pozíciókkal                                                                                                                |
| 2   | `shared.js` bővítése template-ekkel         | ✅ **KÉSZ** | CV.renderPlainCV + helper-ek (escHtml, skillChip, refLinks, renderBullets, renderWorkItem)                                                                                      |
| 3   | `cv-plain.html` + `cv-plain.js` átírása     | ✅ **KÉSZ** | HTML → cv-content div; JS → renderPlainCV(CV_DATA)                                                                                                                              |
| 4   | `cv-json.js` átírása (CV_DATA-ból)          | ✅ **KÉSZ** | L[] tömb kivéve, helyette `CV.renderJsonCV(CV_DATA)`. Minden fold/gutter/sync mechanizmus változatlan. Hire modal init null-check-kel.                                          |
| 5   | `cv-swagger.html` + `cv-swagger.js` átírása | ✅ **KÉSZ** | Dinamikus render CV_DATA-ból, ~8KB template + hire modal + music player statikus HTML. 8 szekció, 23 endpoint.                                                                  |
| 6   | `stations.js` átírása                       | ✅ **KÉSZ** | Generál CV_DATA-ból, fallback statikus adatra                                                                                                                                   |
| 7   | Közös elemek kiszervezése                   | ✅ **KÉSZ** | Music player + hire modal HTML deduplikáció: shared.js-be kiszervezve, auto-injection IIFE + page-specific fallback injection                                                   |
| 8   | Ellenőrzés                                  | ✅ **KÉSZ** | cv-plain.html, cv-json.html, cv-swagger.html működik; cv-game.html betölt hiba nélkül. cv-plain.js duplikáció eltávolítva — `CV.renderPlainCV(CV_DATA)`-t használ shared.js-ből |

### Ismert problémák

_(Nincs ismert problém)_

---

## 4. lépés: ✅ `cv-json.js` átírása (KÉSZ)

**Megvalósítás:**

- `CV.renderJsonCV(data)` a `shared.js`-ben — generálja a teljes `L[]` struktúrát a `CV_DATA`-ból, beleértve:
  - indent depth (0-6) minden sorhoz
  - Syntax highlighting HTML wrapper-ek
  - Szellemes kommentek (pl. "no runtime errors", "still actively maintained")
  - Hobby projects link-ek `CV_DATA`-ból
  - Work experience projektek/highlights generálása
  - Education, skills, community, meta szekciók
- `cv-json.js`: ~500 sor L[] tömb → 50 sor (CSAK a fold/gutter/sync mechanizmus + `const L = CV.renderJsonCV(CV_DATA)`)
- Null-check-ek a hire modal és formspree init előtt
- Cache-busting (`?v=100`) a script URL-eken

**Eredmény:** Fájlméret: ~28KB → ~2KB. Nincs JavaScript hiba, fold mechanizmus működik.

**Megjegyzés:** A `?v=100` cache-busting el lett távolítva minden script URL-ről, mert `file://` protokollal nem működik (a böngésző a `script.js?v=100`-t literal fájlnévként próbálja betölteni).

---

## 1. lépés: ✅ `scripts/cv-data.js` — Központi adatobjektum (KÉSZ)

Egyetlen `CV_DATA` globális objektum, ami a teljes CV-t tartalmazza. Tartalmazza:

- `meta` — név, role, verzió
- `identity` — név, role, lokáció, kontaktok, nyelvek
- `summary` — szakmai összefoglaló
- `workExperience` — 6 munkahely teljes adatokkal + game pozíciókkal
- `education` — intézmény + 3 diploma
- `programmingLanguages` — 7 programozási nyelv
- `community` — közösségi munka leírása
- `hobbyProjects` — 11 projekt

---

## 2. lépés: ✅ `shared.js` bővítése template-ekkel (KÉSZ)

- `CV.escHtml(str)` — HTML entity escape
- `CV.skillChip(name, iconFile)` — skill chip HTML
- `CV.refLinks(refs)` — referencia linkek
- `CV.renderBullets(bullets)` — bullet list
- `CV.renderWorkItem(exp)` — teljes work experience item
- `CV.renderPlainCV(data)` — teljes plain CV HTML

---

## 3. lépés: ✅ `cv-plain.html` + `cv-plain.js` átírása (KÉSZ)

- **`cv-plain.html`**: A beégetett ~600 soros CV HTML helyett `<div id="cv-content">` + script sorrend: `shared.js` → `cv-data.js` → `cv-music-player.js` → `cv-plain.js`
- **`cv-plain.js`**: Meghívja a `renderPlainCV(CV_DATA)` függvényt, plusz theme toggle, decor hozzáadás, hire modal init, formspree init

---

## 4. lépés: ⏳ `cv-json.js` átírása (FÜGGŐBEN)

**Terv:**

- A jelenlegi `L[]` tömb generálása a `CV_DATA`-ból
- Meg kell tartani: indent depth (0-6), syntax highlighting HTML wrapper-ek (`<span class="k">`, `<span class="s">`, `<span class="c">` stb.), szellemes kommentek
- A fold mechanizmus változatlan marad
- A `cv-json.js` fájl kb. 50 sorra csökkenne

**Kihívás:** A szellemes kommentek és a formázás reprodukálása adatvezérelten.

---

## 5. lépés: ✅ `cv-swagger.html` + `cv-swagger.js` átírása (KÉSZ)

**Megvalósítás:**

- `CV.renderSwaggerContent(data)` a `shared.js`-ben — generálja a teljes Swagger UI HTML-t
- 8 tag section: identity (3 GET), summary (1 GET), workExperience (4 POST + 2 PUT), education (3 GET), skills (4 GET + 1 PATCH + 1 DELETE), community (1 POST), hobbyProjects (1 GET), meta (1 GET) = 23 endpoint
- `cv-swagger.html`: hire modal + music player statikus HTML, üres `#swagger-ui` div, scriptek: shared.js → cv-data.js → cv-music-player.js → cv-swagger.js + formspree
- `cv-swagger.js`: IIFE try-catch-el, render + expand/collapse event listenerek + theme/hire/formspree init + toast notification
- Cache-busting elhagyva (`?v=100` nem kompatibilis `file://` protokollal)

**Eredmény:** Fájlméret: 226KB → ~8KB. Dinamikus renderelés CV_DATA-ból.

---

## 6. lépés: ✅ `stations.js` átírása (KÉSZ)

- Generálja a `CV_STATIONS` tömböt a `CV_DATA`-ból
- Welcome station (identity + languages + summary)
- 6 work experience station (game koordinátákkal)
- Education station (education + community + hobby projects)
- Fallback statikus adatra, ha `CV_DATA` nem elérhető

---

## 7. lépés: ✅ Közös elemek kiszervezése (KÉSZ)

**Változtatások:**

- `shared.js`:
  - `CV.musicPlayerHTML()` — visszaadja a music player HTML stringet (helyettesíti a 3x duplikált ~70 sort)
  - `CV.hireModalHTML(prefix, opts)` — visszaadja a hire modal HTML-t konfigurálható paraméterekkel (helyettesíti a 4x duplikált ~40 sort)
  - Auto-injection IIFE: Font Awesome link detektálása → music player injektálása; `hire-*-btn` elemek keresése → hire modal injektálása
- Minden 4 HTML oldalból kivéve a duplikált HTML: **~370 sor eltávolítva**
- Minden 4 oldalspecifikus JS fájl kapott fallback injection-t:
  - `cv-plain.js`: injection `CV.initHireModal("hire-plain")` előtt (dinamikusan renderelt gomb miatt)
  - `cv-swagger.js`: injection a null-check előtt (dinamikusan renderelt gomb miatt)
  - `cv-json.js`: fallback injection a null-check előtt
  - `cv-index.js`: fallback injection `CV.initHireModal("hire-index")` előtt
- Duplikáció elleni védelem: minden injection előtt `!document.getElementById(prefix + "-modal")` check

---

## Megjegyzések

1. **Nincs build rendszer** — minden marad sima HTML+JS (no bundler, no framework).
2. **CSS class nevek** (`cv-plain-inline-0` stb.) változatlanok maradnak — a template függvények ugyanazokat generálják.
3. **Tesztelés** — manuálisan kell ellenőrizni az összes oldalt. Böngésző tesztek: `cv-plain.html` → ✅ működik, nincs hiba.
