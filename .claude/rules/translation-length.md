# Fordítási karakterlimit szabály (translation length budget)

## Referencia

A **referencia** a `.claude/reference/current-english-lengths.json` fájlban tárolt
**jelenlegi angol** mezőhosszak (hero summary + munkahelyenkénti összes karakter).

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
hero (summary):  EN_current_summary * 0.95  <=  translated_summary  <=  EN_current_summary * 1.02
munkahely:       EN_workplace_total * 0.95  <=  translated_total  <=  EN_workplace_total * 1.02
```

Ahol `munkahely_total` = az adott workExperience elem `description` + összes `bullets[]` + összes `projects[].bullets[]` hossza.

Példa a jelenlegi angol értékekkel:
| Elem | Angol (ch) | -5% (min) | +2% (max) |
|------|:----------:|:---------:|:---------:|
| hero (summary) | 793 | 753 | 808 |
| aegex | 1826 | 1734 | 1862 |
| telekom | 675 | 641 | 688 |
| scolia | 585 | 555 | 596 |
| cubicfox | 613 | 582 | 625 |
| cobotx | 727 | 690 | 741 |
| webforsol | 694 | 659 | 707 |

---

## Javítási útmutató

### Ha a fordítás TÚL RÖVID (translated < EN * 0.95)

Bővítsd a munkahely teljes szövegét (description + bullets együtt) természetes módon:
1. Használj teljesebb nyelvtani formákat
2. Adj hozzá a nyelvtanilag helyes mondathoz szükséges kötőszavakat
3. Fiktív nyelveknél használj hosszabb, díszítőbb kifejezéseket

### Ha a fordítás TÚL HOSSZÚ (translated > EN * 1.02)

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
