# Biztonsági Átvizsgálás — CV Site

**Típus:** security-review
**Dátum:** 2026-06-16 07:08
**Összesítés:** 0 kritikus · 1 magas · 1 közepes · 1 alacsony
**Fókusz:** Spam / flood védelem — Hire Me + Booking + egyéb felületek

---

## Összefoglalás

Ez az átvizsgálás a `2026-06-16_0627_security-review.md` riport javításai **után** készült. A korábbi
megállapítások többségét bezárták: a **játék nézet Hire Me űrlapja** mostantól honeypotot,
tartalom-validációt (email regex + ≥20 karakter / ≥4 szó) és időzítés-ellenőrzést használ; a megosztott
Hire és Booking űrlapok időzítés-ellenőrzést és `maxlength`-et kaptak; a `showToast` `textContent`-re állt át.

A maradék kockázat a statikus oldal eredendő korlátaiból fakad:

1. 🟠 A **booking GAS végpont** továbbra is a kliens által küldött `start`/`end` időpontot fogadja el —
   a védelem szerver-oldali (Apps Script), nem ebben a repóban javítható.
2. 🟡 A **cooldownok** kizárólag `localStorage`-ra épülnek — tároló-törléssel / inkognitóval megkerülhetők.
3. 🟢 A **játék űrlap** — bár már validál — **nem** futtatja a DoH MX domain-ellenőrzést, amit a megosztott
   űrlapok igen (kisebb következetlenség).

| Súlyosság   | Darab |
| ----------- | ----- |
| 🔴 KRITIKUS | 0     |
| 🟠 MAGAS    | 1     |
| 🟡 KÖZEPES  | 1     |
| 🟢 ALACSONY | 1     |

---

## ✅ Állapot frissítés — 2026-06-16

> A riport óta elvégzett és **élesített** javítások:
>
> - 🟠 **MAGAS — GAS slot-trust:** ✅ **MEGOLDVA + DEPLOYOLVA.** A `Code.gs` `createBooking`-ja
>   most `isSlotAvailable()` slot-validációt, email-regexet, hossz-cap-eket és per-email napi limitet
>   (`enforceRateLimit`) futtat. A szerver csak stabil hibakódokat ad vissza (`SLOT_UNAVAILABLE` stb.),
>   a frontend i18n-nel fordít. Az Apps Script újradeployolva — **élesben működik.**
> - 🟢 **ALACSONY — játék MX-ellenőrzés:** ✅ **MEGOLDVA.** A `scripts/game/main.js` submit-handlere
>   `async`, és a `fetch` előtt `CHECK_EMAIL_DOMAIN` mellett `checkEmailDomain()` DoH MX-ellenőrzést
>   végez; hiba esetén lokalizált `errEmailNoMailServer` üzenet. A játék-űrlap most már a megosztott
>   űrlapokkal egyenértékű (honeypot + timing + validáció + MX).
> - 🟡 **KÖZEPES — localStorage cooldown:** 🟡 **RÉSZBEN.** A GAS-oldali napi email-limit kész és
>   deployolva (booking-út). **Nyitott:** Formspree dashboard spam/rate + domain-restrikció, és az
>   opcionális CAPTCHA (Turnstile/hCaptcha) a Hire + Booking űrlapon — ezek külső szolgáltatás-konfigurációk.
>
> **Egyetlen nyitott maradék:** a 🟡 KÖZEPES Formspree/CAPTCHA rész (repón kívüli konfiguráció).

---

## Kockázati mátrix

| Megállapítás                                  | Felület            | Súlyosság | Megkerülés nehézsége            | Javasolt javítás                       |
| --------------------------------------------- | ------------------ | --------- | ------------------------------- | -------------------------------------- |
| GAS végpont elfogadja a kliens-időpontot      | Booking            | 🟠 MAGAS  | Közepes (DevTools/curl)          | Slot szerver-oldali validáció a GAS-ban |
| Csak localStorage cooldown                    | Hire + Booking + game | 🟡 KÖZEPES | Könnyű (storage törlés/inkognitó) | Formspree/GAS limit vagy CAPTCHA       |
| Játék űrlap — nincs MX domain-ellenőrzés       | Hire Me (game)     | 🟢 ALACSONY | Triviális                       | `checkEmailDomain` bekötése a játékba   |

---

## Részletes megállapítások és javaslatok

### GAS booking végpont megbízik a kliens-időpontban — MAGAS

**Állapot:** ✅ **MEGOLDVA + DEPLOYOLVA (2026-06-16).** `Code.gs` szerver-oldali slot-validáció + napi limit; Apps Script újradeployolva, élesben működik.

**Probléma:** A foglaló kérés a kliensoldalon kiválasztott `selectedSlot.start` / `.end` értéket küldi
GET-paraméterként a Google Apps Script végpontra (`shared.js:879–888`). A `BOOKING_SCRIPT_URL` — mint
minden statikus oldalon — publikus. Ha a GAS nem ellenőrzi szerver-oldalon, hogy a beküldött időpont a
ténylegesen felkínált, szabad slotok között van-e, egy támadó közvetlen
`...exec?action=book&start=...&end=...` hívásokkal **tetszőleges időpontokra hamis foglalásokat** hozhat
létre (naptár-flood), megkerülve a kliensoldali cooldownt, honeypotot és időzítés-ellenőrzést.

> A GAS URL puszta kitettsége statikus oldalon eredendő, **nem** kritikus. A kockázat az, ha a szerver
> megbízik a kliens-inputban.

**Érintett fájl(ok):** `scripts/shared.js:828–910`, `scripts/config.js:1` (GAS URL), valamint a repón
**kívüli** Apps Script kód.

**Javasolt javítás (szerver-oldal, GAS-ban):**
1. A `book` művelet a beérkező `start`/`end`-et vesse össze a ténylegesen generált, szabad slotok
   listájával — ha nincs egyezés vagy a slot már foglalt, utasítsa el.
2. A GAS adjon ki rövid élettartamú slot-tokent a `loadSlots` válaszban, és a `book` csak érvényes
   tokennel fogadjon el foglalást.
3. A GAS oldalon vezess be egyszerű IP/email alapú napi limitet.

**Erőfeszítés:** Közepes (a GAS-szkript módosítása, nem ebben a repóban)
**Hatás:** Megakadályozza a közvetlen végpont-hívással történő naptár-floodot és a hamis foglalásokat.

---

### Csak localStorage alapú cooldown — KÖZEPES

**Állapot:** 🟡 **RÉSZBEN (2026-06-16).** GAS-oldali napi email-limit kész + deployolva. Nyitott: Formspree spam/rate + domain-restrikció és opcionális CAPTCHA.

**Probléma:** Mindhárom beküldési út (`hire_sent_ts` 24h — `shared.js:123`, `game/main.js`;
`booking_sent_ts` 48h — `shared.js:631`) kizárólag `localStorage`-ban tárolt időbélyegre épül. Ez
inkognitó-móddal, másik böngészővel vagy a tároló törlésével triviálisan megkerülhető — így nem valódi
rate-limit, csak véletlen dupla-küldés elleni védelem. (A honeypot és az új időzítés-ellenőrzés emeli a
bot-küszöböt, de a tároló-törléses megkerülést önmagukban nem zárják ki.)

**Érintett fájl(ok):** `scripts/shared.js:123–129, 631–657`, `scripts/game/main.js`

**Javasolt javítás:** Statikus oldalon szerver-oldali korlát nélkül ez nem zárható le teljesen.
Rétegezett enyhítés:
- A **Formspree** dashboardon kapcsold be a beépített spam-/rate-szűrést és a domain-restrikciót.
- A **GAS** oldalon vezess be email/IP alapú napi foglalási limitet (lásd fenti MAGAS pont).
- Megfontolható egy ingyenes, backend nélküli **CAPTCHA** (Cloudflare Turnstile / hCaptcha) a Hire és
  Booking űrlapokon — ez emeli a bot-küszöböt a tároló-törléses megkerülés ellen is.

**Erőfeszítés:** Közepes
**Hatás:** A megkerülés érdemi védelmet kap a kliensoldali cooldown látszat-védelme helyett.

---

### Játék Hire Me űrlap — nincs MX domain-ellenőrzés — ALACSONY

**Állapot:** ✅ **MEGOLDVA (2026-06-16).** `game/main.js` submit-handler `async`, `checkEmailDomain()` DoH MX-ellenőrzés a `fetch` előtt, lokalizált `errEmailNoMailServer` hibával.

**Probléma:** A játék űrlap submit-handlere (`scripts/game/main.js:1133`) a javítás után már elvégzi a
honeypot-, időzítés- és tartalom-validációt, de — a megosztott űrlapoktól eltérően — **nem** hívja a DoH
MX domain-ellenőrzést (`checkEmailDomain`). Így nem létező levelezési domainű email is átmehet ezen az úton.
Kis hatású, mert a Formspree úgyis kézbesít, és a regex+hossz validáció már szűr.

**Érintett fájl(ok):** `scripts/game/main.js:1143–1160`

**Javasolt javítás:** Importáld a `checkEmailDomain`-t és a `CHECK_EMAIL_DOMAIN` flag-et a `shared.js`-ből,
és a `fetch` előtt — a többi űrlaphoz hasonlóan — végezd el az aszinkron MX-ellenőrzést:
```js
if (CHECK_EMAIL_DOMAIN && !(await checkEmailDomain(emailVal))) {
  if (fsError) { fsError.classList.remove('cv-error-hidden'); fsError.textContent = 'Email domain has no mail server.'; }
  if (submitBtn) submitBtn.disabled = false;
  return;
}
```
*(A submit handlert `async`-ká kell tenni.)* Hosszabb távon a legtisztább, ha a játék is a megosztott
`initHireModal`-t használná, megszüntetve a duplikált kódutat.

**Erőfeszítés:** Alacsony
**Hatás:** Egységes email-validáció minden Hire Me úton.

---

## Biztonságos elemek

- ✅ **Megosztott Hire Me** (`initHireModal`): `_gotcha` honeypot, név/email/üzenet validáció (≥20 karakter,
  ≥4 szó), email regex, DoH MX-ellenőrzés, **időzítés-ellenőrzés (2,5s)**, `maxlength="2000"`, dupla-küldés
  tiltás, hibák `textContent`-tel.
- ✅ **Booking modál** (`initBookingModal`): `bk-hp` honeypot **ténylegesen ellenőrizve** (`shared.js:835`),
  azonos szintű validáció, MX-ellenőrzés, **időzítés-ellenőrzés (2,5s)**, `maxlength="2000"`, submit-tiltás.
- ✅ **Játék Hire Me** (`game/main.js`): `_gotcha` honeypot, regex + hossz/szó validáció,
  időzítés-ellenőrzés (2,5s), `maxlength="2000"`, **DoH MX-ellenőrzés** — a megosztott űrlapokkal egyenértékű.
- ✅ **`showToast`** (`shared.js:11`): `textContent`-tel épül fel, nincs `innerHTML` a toast-úton — XSS-mentes.
- ✅ **XSS-védelem a render-úton:** `escHtml()` és a `html\`\`` tag biztonságos; a szerver (Formspree/GAS)
  válaszait nem renderelik HTML-ként; a mezőhibák `textContent`-tel íródnak.
- ✅ **Zenelejátszó:** a `fetch(src)` csak a hardkódolt `MUSIC_GENRES` útvonalakat tölti — nem user-kontrollált.
- ✅ **`checkEmailDomain`:** a domaint `encodeURIComponent`-tel illeszti a DoH URL-be — injekció-mentes.
- ✅ **Téma-váltó és nyelvválasztó:** tisztán kliensoldali, külső kérés nélkül — biztonságos.

---

_Generálta: /security-review skill_
