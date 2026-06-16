# Lokalizáció szabályok

## A rendszer

`scripts/locale.js` exportálja a `LocaleManager` singleton példányát `locale` névvel.

```js
import { locale } from './locale.js';
locale.t('kulcsNev'); // fordítást ad vissza az aktuális nyelven
locale.getData(); // CV_DATA-t ad, opcionálisan locale-tartalom felülírásokkal
locale.setLang('hu'); // nyelvváltás
locale.lang; // aktuális nyelvkód
```

DOM-ban `data-i18n="kulcsNev"` attribútum jelzi az automatikusan frissítendő elemeket.
Nyelvváltáskor a `localechange` esemény sül el — a modálok erre reagálva frissítik magukat.

## A 12 fájl és helye

```
scripts/locales/
  en.js   → export const EN = { labels: {...}, content: null }
  hu.js   → export const HU = { labels: {...}, content: {...} }
  de.js   → export const DE = ...
  fr.js   → export const FR = ...
  es.js   → export const ES = ...
  it.js   → export const IT = ...
  asg.js  → export const ASG = ...   (Asgardian — fiktív)
  dot.js  → export const DOT = ...   (Dothraki — fiktív)
  kl.js   → export const KL  = ...   (Klingon — fiktív)
  qu.js   → export const QU  = ...   (Quenya — fiktív)
  goa.js  → export const GOA = ...   (Goa'uld — fiktív)
  ya.js   → export const YA  = ...   (Yautja — fiktív)
```

## Kötelező szabály: minden kulcs mind a 12 fájlba kerül

Ha új `labels` kulcsot adsz hozzá bármely okból, azt **mind a 12 fájlba** be kell írni.
Hiányzó kulcs esetén a `locale.t()` az `en.js`-re esik vissza — de ez elfedett hibát jelent.

### Sorrend

1. `en.js`-be írj referencia értéket
2. `hu.js`-be írj magyar fordítást
3. `de.js`, `fr.js`, `es.js`, `it.js` — valódi fordítás
4. `asg.js`, `dot.js`, `kl.js`, `qu.js`, `goa.js`, `ya.js` — fiktív, a meglévő stílust kövesd

## Fiktív nyelvek fordítási elve

A fiktív nyelveknél nem kell valódi fordítás, de tartsd meg a stílust:

- Klingon (`kl`): kemény mássalhangzók, aposztróf, pl. `"jabbI'ID legh…"`
- Quenya (`qu`): elvontabb, hosszabb szavak, pl. `"Centapoldo cendë…"`
- A többi saját belső logikával bír — nézd meg a szomszédos kulcsokat és kövesd a mintát

## ⚠️ KÖTELEZŐ: JS szintaxis validálás módosítás után

A locale fájlok ES modul JS fájlok — egy nem escape-elt aposztróf `'` egy single-quote `'...'` stringben
SyntaxErrort okoz, ami az egész alkalmazást letöri.

**Minden locale fájl módosítása után futtasd:**

```bash
node -c scripts/locales/<lang>.js
```

**Bővebben:** `.claude/rules/js-syntax-validation.md`

**Aranyszabály:** Francia, olasz, goa'uld és klingon stringekhez MINDIG dupla idézőjelet (`"..."`) használj —
soha ne `'...'`-t, mert ezek a nyelvek gyakran tartalmaznak aposztrófot.

---

## `content` mező (opcionális tartalom-felülírás)

Ha egy locale `content` mezőt tartalmaz (pl. `hu.js`), az felülírhatja a CV szöveges tartalmát:

- `content.summary` — bemutatkozó szöveg
- `content.community` — közösségi tevékenységek szövegei
- `content.workExperience[].description` / `.bullets` — munkatapasztalat szövegek

Ez opcionális — ha `null`, az `en` alap adat érvényesül.

## Intl.DateTimeFormat fiktív nyelveknél

A booking modálban dátumok megjelenítésekor:

```js
Intl.DateTimeFormat.supportedLocalesOf([locale.lang]).length > 0 ? locale.lang : 'en';
```

Fiktív nyelveknél (`kl`, `qu`, `goa`, `ya`, `asg`, `dot`) automatikusan `'en'` fallback lesz.
Nem kell külön kezelni — az `initBookingModal`-ban ez már implementálva van.
