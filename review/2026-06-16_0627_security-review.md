# Biztonsági Átvizsgálás — CV Site

**Típus:** security-review
**Dátum:** 2026-06-16 06:27
**Összesítés:** 0 kritikus · 2 magas · 2 közepes · 2 alacsony
**Fókusz:** Spam / flood védelem — Hire Me + Booking + egyéb felületek

---

## Összefoglalás

A site védelmi rétegei a **megosztott** `initHireModal` és `initBookingModal` (shared.js) függvényekben
erősek: honeypot, hossz- és szóellenőrzés, email regex, DoH MX-ellenőrzés, dupla-küldés tiltás és
localStorage cooldown. A **legnagyobb kockázat** két helyen jelentkezik:

1. A **játék nézet külön Hire Me űrlapja** (`scripts/game/main.js`) ugyanazt a Formspree
   végpontot használja, de **megkerüli** a megosztott védelmet — nincs honeypot, nincs minimum
   üzenethossz/szószám, nincs MX-ellenőrzés. Egy bot ezt a kódutat célozva spam-eket küldhet.
2. A **booking GAS végpont** a kliens által küldött `start`/`end` időpontot fogadja el — ha a
   Google Apps Script szerver-oldalon nem ellenőrzi, hogy a slot valóban szabad, közvetlen
   hívással hamis foglalások hozhatók létre (naptár-flood).

A többi felület (téma, nyelvválasztó, zenelejátszó) tisztán kliensoldali és biztonságos.

| Súlyosság   | Darab |
| ----------- | ----- |
| 🔴 KRITIKUS | 0     |
| 🟠 MAGAS    | 2     |
| 🟡 KÖZEPES  | 2     |
| 🟢 ALACSONY | 2     |

---

## Kockázati mátrix

| Megállapítás                                          | Felület            | Súlyosság | Megkerülés nehézsége        | Javasolt javítás                         |
| ----------------------------------------------------- | ------------------ | --------- | --------------------------- | ---------------------------------------- |
| Játék Hire űrlap — nincs honeypot + tartalomellenőrzés | Hire Me (game)     | 🟠 MAGAS  | Könnyű (bot a végpontra)     | Honeypot + hossz/szó validáció átemelése  |
| GAS végpont elfogadja a kliens-időpontot              | Booking            | 🟠 MAGAS  | Közepes (DevTools/curl)      | Slot szerver-oldali validáció a GAS-ban   |
| Csak localStorage cooldown                            | Hire + Booking + game | 🟡 KÖZEPES | Könnyű (storage törlés/inkognitó) | Időbélyeg-token / Formspree+GAS limit |
| Nincs time-on-page / küldési időzítés-ellenőrzés       | Hire + Booking     | 🟡 KÖZEPES | Könnyű (azonnali POST)        | Min. 2-3 mp betöltés-utáni küszöb         |
| Nincs maximum üzenethossz                             | Hire + Booking     | 🟢 ALACSONY | Triviális                   | `maxlength` attribútum + JS-ellenőrzés    |
| `showToast` `innerHTML`-t használ                     | Toast              | 🟢 ALACSONY | Nehéz (nincs user-input ma) | `textContent` használata                  |

---

## Részletes megállapítások és javaslatok

### Játék Hire Me űrlap megkerüli a megosztott védelmet — MAGAS

**Probléma:** A `scripts/game/main.js` (`initHireModal`-tól független, saját submit handler,
`scripts/game/main.js:1130`) ugyanazt a Formspree űrlapot (`mrejlned`) POST-olja, mint a többi
nézet, de **hiányoznak belőle** a shared.js védelmek:

- **Nincs `_gotcha` honeypot mező** a `cv-game.html` űrlapjában (`#hire-game-form`, ~`cv-game.html:482`) —
  a megosztott űrlap rendelkezik vele (`shared.js:963`). Honeypot nélkül a Formspree honeypot-szűrője
  nem aktiválódik erre az útra.
- **Nincs minimum üzenethossz / szószám ellenőrzés.** A shared űrlap megköveteli a
  `msgVal.length >= 20 && wordCount >= 4` feltételt (`shared.js:195`); a játék űrlap bármilyen
  rövid tartalmat (pl. „hi") továbbít.
- **Nincs MX domain-ellenőrzés** (`checkEmailDomain` nincs meghívva).

A natív `required` attribútumok ugyan kötelezik a mezők kitöltését és az email-formátumot, de ez
nem véd a rövid spam-tartalom és a botok ellen. Mivel a végpont és a payload-mezők publikusak,
a támadó kifejezetten ezt a gyengébb kódutat célozhatja.

**Érintett fájl(ok):** `scripts/game/main.js:1130–1161`, `cv-game.html` (`#hire-game-form`, ~482–520)

**Javasolt javítás:**
1. Adj `_gotcha` honeypot mezőt a játék űrlaphoz (a shared.js-szel megegyezően):
```html
<input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off">
```
2. A submit handlerben — a `fetch` előtt — vedd át a shared.js validációt:
```js
const nameVal = form.querySelector('#hire-game-name').value.trim();
const emailVal = form.querySelector('#hire-game-email').value.trim();
const msgVal = form.querySelector('#hire-game-message').value.trim();
const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
const wordCount = msgVal.split(/\s+/).filter(Boolean).length;
if (!nameVal || !emailOk || msgVal.length < 20 || wordCount < 4) {
  if (submitBtn) submitBtn.disabled = false;
  return; // jelezz hibát a felhasználónak
}
```
   *(Hosszabb távon a legtisztább, ha a játék is a megosztott `initHireModal`-t használná egy
   prefix-szel, megszüntetve a duplikált, eltérő védelmű kódutat.)*

**Erőfeszítés:** Alacsony–Közepes
**Hatás:** Megszünteti a leggyengébb, könnyen célozható spam-bemenetet; egységes védelem minden Hire Me úton.

---

### GAS booking végpont megbízik a kliens-időpontban — MAGAS

**Probléma:** A foglalás a kliensoldalon kiválasztott `selectedSlot.start` / `.end` értéket
küldi GET-paraméterként a Google Apps Script végpontra (`shared.js:864–873`). A `BOOKING_SCRIPT_URL`
— mint minden statikus oldalon — publikus. Ha a GAS **nem** ellenőrzi szerver-oldalon, hogy a
beküldött időpont valóban a felkínált, szabad slotok között van-e, egy támadó közvetlen
`...exec?action=book&start=...&end=...&name=...&email=...` hívásokkal **tetszőleges időpontokra
hamis foglalásokat** hozhat létre (naptár-flood), megkerülve a kliensoldali cooldownt és honeypotot.

> Megjegyzés: A GAS URL puszta kitettsége statikus oldalon eredendő, **nem** kritikus. A kockázat
> az, ha a szerver megbízik a kliens-inputban.

**Érintett fájl(ok):** `scripts/shared.js:828–896`, `scripts/config.js:1` (GAS URL), valamint a
repón **kívüli** Apps Script kód.

**Javasolt javítás (szerver-oldal, GAS-ban):**
1. A `book` művelet a beérkező `start`/`end`-et vesse össze a ténylegesen generált, szabad
   slotok listájával — ha nincs egyezés vagy a slot már foglalt, utasítsa el.
2. A GAS adjon ki rövid élettartamú slot-tokent a `loadSlots` válaszban, és a `book` csak érvényes
   tokennel fogadjon el foglalást.
3. A GAS oldalon vezess be egyszerű IP/email alapú napi limitet.

**Erőfeszítés:** Közepes (a GAS-szkript módosítása, nem ebben a repóban)
**Hatás:** Megakadályozza a közvetlen végpont-hívással történő naptár-floodot és a hamis foglalásokat.

---

### Csak localStorage alapú cooldown — KÖZEPES

**Probléma:** Mindhárom beküldési út (`hire_sent_ts` 24h — `shared.js:123`, `game/main.js:1086`;
`booking_sent_ts` 48h — `shared.js:629`) kizárólag `localStorage`-ban tárolt időbélyegre épül.
Ez inkognitó-móddal, másik böngészővel vagy a tároló törlésével triviálisan megkerülhető — így
nem valódi rate-limit, csak véletlen dupla-küldés elleni védelem.

**Érintett fájl(ok):** `scripts/shared.js:123–129, 629–650`, `scripts/game/main.js:1086–1091`

**Javasolt javítás:** Statikus oldalon szerver-oldali korlát nélkül ez nem zárható le teljesen.
Rétegezett enyhítés:
- A **Formspree** dashboardon kapcsold be a beépített spam-/rate-szűrést és a domain-restrikciót.
- A **GAS** oldalon vezess be email/IP alapú napi foglalási limitet (lásd fenti MAGAS pont).
- Megfontolható egy ingyenes, backend nélküli **CAPTCHA** (Cloudflare Turnstile / hCaptcha) a
  Hire és Booking űrlapokon — ez emeli a bot-küszöböt a tároló-törléses megkerülés ellen is.

**Erőfeszítés:** Közepes
**Hatás:** A megkerülés érdemi védelmet kap a kliensoldali cooldown önmagában nyújtott látszat-védelme helyett.

---

### Nincs time-on-page / küldési időzítés-ellenőrzés — KÖZEPES

**Probléma:** Egyik űrlap sem ellenőrzi, hogy mennyi idő telt el a betöltés és a beküldés között.
A botok az oldal betöltése után azonnal POST-olhatnak — egy egyszerű időzítés-küszöb (pl. < 2-3 mp
= gyanús) olcsó, hatékony bot-szűrő lenne.

**Érintett fájl(ok):** `scripts/shared.js` (mindkét submit handler), `scripts/game/main.js:1130`

**Javasolt javítás:** A modál megnyitásakor / oldal betöltésekor ments el egy `Date.now()` bélyeget,
és a submitnél utasítsd el (vagy jelölj gyanúsnak) a túl gyors beküldést:
```js
const openedAt = Date.now();
// submitnél:
if (Date.now() - openedAt < 2500) return; // valószínűleg bot
```

**Erőfeszítés:** Alacsony
**Hatás:** Kiszűri a triviális, azonnal-POST-oló botokat, kiegészítve a honeypotot.

---

### Nincs maximum üzenethossz — ALACSONY

**Probléma:** Sem a Hire Me üzenet, sem a booking topic mező nem korlátozott felülről — egy
támadó nagyon nagy payload-ot küldhet (inbox-/log-bloat, Formspree kvóta-merítés).

**Érintett fájl(ok):** `scripts/shared.js:192–195, 833–845`, HTML textarea-k

**Javasolt javítás:** Adj `maxlength="2000"` attribútumot a textarea-khoz, és ellenőrizd JS-ben is
(`msgVal.length <= 2000`).

**Erőfeszítés:** Alacsony
**Hatás:** Megakadályozza a túlméretes payload-okkal való visszaélést.

---

### `showToast` `innerHTML`-t használ — ALACSONY

**Probléma:** A `showToast` a `message`-et `innerHTML`-lel szúrja be (`shared.js:16`). Jelenleg
csak lokalizációs stringekkel hívják (nem felhasználói input), így ma nem kihasználható — de
ha valaha user-eredetű szöveggel hívják, XSS-vektor lesz.

**Érintett fájl(ok):** `scripts/shared.js:11–28` (és a `cv-plain.js:142`, `cv-index.js:22` toast-ok)

**Javasolt javítás:** A szöveget `textContent`-tel állítsd be, a bezáró gombot külön elemként hozd
létre — így a beszúrás eleve XSS-mentes marad bármilyen forrás esetén.

**Erőfeszítés:** Alacsony
**Hatás:** Megelőző jellegű — kizárja a jövőbeli XSS-regressziót a toast-úton.

---

## Biztonságos elemek

- ✅ **Megosztott Hire Me** (`initHireModal`): `_gotcha` honeypot, név/email/üzenet validáció
  (≥20 karakter, ≥4 szó), email regex, DoH MX-ellenőrzés, dupla-küldés tiltás, hibák `textContent`-tel.
- ✅ **Booking modál** (`initBookingModal`): `bk-hp` honeypot **ténylegesen ellenőrizve**
  (`shared.js:831`), azonos szintű validáció és MX-ellenőrzés, submit-tiltás.
- ✅ **XSS-védelem a render-úton:** `escHtml()` és a `html\`\`` tag biztonságos; a szerver
  (Formspree/GAS) válaszait nem renderelik HTML-ként; a mezőhibák `textContent`-tel íródnak.
- ✅ **Zenelejátszó:** a `fetch(src)` (`cv-music-player.js:460`) csak a hardkódolt `MUSIC_GENRES`
  útvonalakat tölti — nem user-kontrollált.
- ✅ **`checkEmailDomain`:** a domaint `encodeURIComponent`-tel illeszti a DoH URL-be — injekció-mentes.
- ✅ **Téma-váltó és nyelvválasztó:** tisztán kliensoldali, külső kérés nélkül — biztonságos.

---

_Generálta: /security-review skill_
