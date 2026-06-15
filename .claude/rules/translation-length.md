# Fordítási karakterlimit szabály (translation length budget)

A **`scripts/cv-data.js` angol szövege az igazságforrás**. Minden lefordított `content`
mező karakterszáma **NEM lépheti túl** a megfelelő angol forrásmező karakterszámát.

Indok: a nézetek (különösen `cv-plain`, `cv-gantt`, kártyák) fix szélességű/magasságú
konténerekben jelenítik meg a szöveget. Ha egy fordítás hosszabb az angolnál, eltörheti a
dokumentum tördelését. Az angol hossz a biztonságos felső korlát.

---

## Hatókör — érintett mezők

A szabály a `content` alábbi szöveges mezőire vonatkozik, mezőről mezőre, ugyanarra az
`id`-ra / bullet-pozícióra illesztve az angol forrással:

- `summary`
- `workExperience[].description`
- `workExperience[].bullets[]` — elemenként
- `workExperience[].projects[].bullets[]` — elemenként
- `community`

---

## A szabály

```
PER MEZŐ:  translated.length  <=  english_source.length
```

- Egyenlő hossz **megengedett**; hosszabb **tilos**.
- A mérés a JS `String.prototype.length` (UTF-16 code unit). Ékezetes/multibyte betűk
  általában 1-nek számítanak — a tényleges szöveget mérd, nem az escape-elt forrást.
- Az összevetés mindig az **adott mező** angol eredetijéhez történik (nem a teljes summary-hoz
  egy bulletet). A bulleteknél pozíció/jelentés szerint párosíts.

---

## Ha a fordítás túllépné a limitet

**Ne csonkolj mondat közben.** Tömöríts a jelentés és a kulcsszavak megtartásával:

1. Redundáns felsorolások rövidítése (hármas lista → kettő, vagy a leglényegesebb elem).
2. Töltelék- és kötőszavak elhagyása („jelentősen", „kiemelt hangsúlyt fektetve", stb.).
3. Egyszer már kimondott fogalom ismételt említésének elhagyása (pl. ha a „CI pipeline"
   szerepel, a „CI-minőségi szabványok" külön említése elhagyható).
4. Hosszabb körülírás → tömör forma.

**Mindig maradjon meg:** a fő tech-kulcsszavak (`TypeScript`, `React`, `Svelte`, `Node.js`,
`CI`, stb.) és a mező fő állítása/jelentése. A tömörítés nem ronthatja a nyelvi minőséget
és nem hagyhat ki igazolható tényt.

---

## content: null eset

Ha egy locale `content`-je vagy egy adott mezője `null`, az az angol alapszövegre esik
vissza (lásd `scripts/locale.js` → `_mergeContent`). Ilyenkor a limit automatikusan
teljesül (a megjelenített szöveg pont az angol), nincs teendő.

---

## Verifikáció

Minden **módosított** mezőre számold ki a hosszt és vesd össze az angol forrással. Ha
bármelyik túllép, tömörítsd és mérd újra, amíg `translated.length <= english.length`.

Példa mérő-snippet (Node, ideiglenes fájlból futtatva):

```js
const fs = require("fs");
function field(file, re){ const m = fs.readFileSync(file,"utf8").match(re); return m ? JSON.parse(m[1]) : null; }
const en = field("scripts/cv-data.js", /summary:\s*("(?:[^"\\]|\\.)*")/);
const tr = field("scripts/locales/hu.js", /summary:\s*("(?:[^"\\]|\\.)*")/);
console.log("EN", en.length, "| HU", tr.length, tr.length <= en.length ? "OK" : "OVER +" + (tr.length - en.length));
```
