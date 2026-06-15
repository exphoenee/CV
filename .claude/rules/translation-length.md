# Fordítási karakterlimit szabály (translation length budget)

## Referencia

A **referencia egy FIX budget** — **NEM** a mindenkori `scripts/cv-data.js`-ből számolódik.
A budget **egyetlen helyen él** (single source of truth):

**`.claude/reference/current-english-lengths.json`** — itt vannak a budget-számok **és** a
tűrési sáv (`_tolerance`) is. Ezt olvassa a Python ellenőrző (`check-translation-lengths.py`),
és ez az egyetlen mérvadó forrás. Ez a szabály-fájl már **nem** tartalmaz kézzel karbantartott
számtáblázatot — a számokat a scriptből kérdezheted le:

```bash
python .claude/scripts/check-translation-lengths.py --print
```

> ⚠️ A budget-ot **soha ne generáld újra** a `cv-data.js`-ből egy-egy futáskor. Ha az angol
> tartalom hossza megváltozik (pl. egy `/job-apply` átírja a summary-t), attól a budget **nem**
> változik — a budget a fix layout-kapacitást védi, nem a pillanatnyi angol szöveg hosszát követi.
> A budget módosítása **tudatos, kézi döntés**: csak a JSON-t írd át (a tűrést is ott állítod).

**Csak két dolog van ellenőrizve:**
1. **hero** (summary) — a teljes összefoglaló karakterszáma
2. **munkahelyenkénti összes** — description + összes bullet + összes project bullet együttes hossza

**NINCS ellenőrizve:** community, education, hobbyProjects, programmingLanguages, skillGroups

Indok: a nézetek (különösen `cv-plain`, `cv-gantt`, kártyák) fix szélességű/magasságú
konténerekben jelenítik meg a szöveget. A +2% felső korlát biztosítja, hogy a fordítás
ne törje el a dokumentum tördelését. A -5% alsó korlát pedig engedi, hogy a fordítás
egy kicsit rövidebb legyen, de ne túlzottan.

---

## A szabály

```
hero (summary):  BUDGET_summary * 0.95  <=  translated_summary  <=  BUDGET_summary * 1.02
munkahely:       BUDGET_workplace * 0.95  <=  translated_total  <=  BUDGET_workplace * 1.02
```

Ahol `munkahely_total` = az adott workExperience elem `description` + összes `bullets[]` + összes `projects[].bullets[]` hossza.

A konkrét budget-értékek (és a tűrési sáv) a `.claude/reference/current-english-lengths.json`
fájlban élnek — ez az egyetlen mérvadó forrás. Az aktuális táblázat kiíratása:

```bash
python .claude/scripts/check-translation-lengths.py --print
```

---

## Javítási útmutató

### Ha a fordítás TÚL RÖVID (translated < BUDGET * 0.95)

Bővítsd a munkahely teljes szövegét (description + bullets együtt) természetes módon:
1. Használj teljesebb nyelvtani formákat
2. Adj hozzá a nyelvtanilag helyes mondathoz szükséges kötőszavakat
3. Fiktív nyelveknél használj hosszabb, díszítőbb kifejezéseket

### Ha a fordítás TÚL HOSSZÚ (translated > BUDGET * 1.02)

Tömörítsd a munkahely teljes szövegét:
1. Töltelékszavak elhagyása
2. Redundáns felsorolások rövidítése
3. Hosszabb körülírás → tömör forma

---

## Automatikus verifikáció

```bash
python .claude/scripts/check-translation-lengths.py
```

A script:
- Betölti a referencia hosszakat (`.claude/reference/current-english-lengths.json`)
- Kiszámolja a hero és a munkahelyenkénti összegeket
- Összehasonlítja a -5% / +2% sávval
- Kilép 0-val ha minden OK, 1-gyel ha bármi a sávon kívül van
