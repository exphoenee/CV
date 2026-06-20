# Biztonsági Átvizsgálás — CV Site

**Típus:** security-review
**Dátum:** 2026-06-20 13:34
**Összesítés:** 0 kritikus · 0 magas · 3 közepes · 2 alacsony
**Fókusz:** Spam / flood védelem — Hire Me + Booking + egyéb felületek

---

## Összefoglalás

| Súlyosság   | Darab |
| ----------- | ----- |
| 🔴 KRITIKUS | 0     |
| 🟠 MAGAS    | 0     |
| 🟡 KÖZEPES  | 3     |
| 🟢 ALACSONY | 2     |

---

## Kockázati mátrix

| Megállapítás                                          | Felület                  | Súlyosság | Kikerülés nehézsége | Javasolt javítás                                      |
| ----------------------------------------------------- | ------------------------ | --------- | ------------------- | ----------------------------------------------------- |
| localStorage-only cooldown ( Hire Me )                | Hire Me                  | 🟡 KÖZEPES | Könnyű              | Kiegészítő token-mező a Formspree-hez                 |
| localStorage-only cooldown ( Booking )                | Booking                  | 🟡 KÖZEPES | Könnyű              | GAS oldali cooldown megerősítése                      |
| Nincs name mező min hossz                             | Hire Me + Booking        | 🟡 KÖZEPES | Könnyű              | Min 2 karakter hozzáadása                             |
| Formspree endpoint URL expozíció                      | Hire Me                  | 🟢 ALACSONY | —                   | Beépített static site kockázat                        |
| GAS endpoint URL expozíció                            | Booking                  | 🟢 ALACSONY | —                   | Beépített static site kockázat                        |

---

## Részletes megállapítások és javaslatok

### 1. localStorage-only cooldown (Hire Me + Booking) — 🟡 KÖZEPES

**Probléma:** A cooldown (24h illetve 48h) localStorage-ben tárolódik. A felhasználó törölheti a böngésző tárhelyét, incognitó módot használhat, vagy DevTools-ból kitörölheti a kulcsot, és azonnal újra küldhet üzenetet / foglalhat időpontot.

**Érintett fájl(ok):** `scripts/shared.js:141-142, 305, 746-747, 1074`

**Javasolt javítás:**
- Hire Me: A Formspree `_subject` mezőbe rejtett `data-` attribútummal küldhető egy client-side generált token, amely a localStorage-ben tárolódik és a következő küldésnél ellenőrzésre kerül. Ez nem teljesen biztonságos, de nehezíti a bypass-t.
- Booking: A GAS endpoint már implementál `RATE_LIMITED` és `DAILY_CAP_REACHED` hibakódokat (shared.js:722-723), ami azt jelenti, hogy szerver-oldali rate limiting létezik. Ez a fő védelem. A localStorage cooldown kiegészítő védelemként működik.

**Erőfeszítés:** Alacsony
**Hatás:** További réteg a spam ellen — nem egyedüli védelem, de kiegészítő

---

### 2. Nincs name mező min hossz (Hire Me + Booking) — 🟡 KÖZEPES

**Probléma:** A név mező csak `required` jelöléssel rendelkezik, de nincs minimális hossz ellenőrzés. Egy üres szóköz vagy egyetlen karakter átmegy a validáción.

**Érintett fájl(ok):** `scripts/shared.js:251, 257-259, 1017-1029`

**Javasolt javítás:**
```javascript
// shared.js:257 — Hire Me form
document.getElementById(prefix + '-name-err').textContent =
  nameVal.length >= 2 ? '' : locale.t('errFieldRequired');

// shared.js:1029 — Booking form
if (nameVal.length < 2 || !emailOk || !topicOk) return;
```
Az `errFieldRequired` kulcs már létezik — a name mező hossz-ellenőrzése ugyanazt az üzenetet használhatja.

**Erőfeszítés:** Alacsony
**Hatás:** Megakadályozza a minimális spam üzeneteket (pl. "a" névvel)

---

### 3. Formspree endpoint URL expozíció — 🟢 ALACSONY

**Probléma:** A Formspree endpoint URL (`https://formspree.io/f/mrejlned`) látható a JavaScript forráskódban. Bárki közvetlenül hívhatja meg a formot.

**Érintett fájl(ok):** `scripts/shared.js:298`

**Javasolt javítás:**
Ez a static site-ek beépített kockázata. A Formspree saját spam szűréssel rendelkezik, és a `cf-turnstile-response` mező segítségével a szerver oldalán ellenőrzi a CAPTCHA tokent. A jelenlegi védelem elegendő:
- Honeypot (`_gotcha` mező)
- Cloudflare Turnstile CAPTCHA
- Input validálás (min 20 karakter, min 4 szó)
- Formspree beépített spam szűrés

**Erőfeszítés:** —
**Hatás:** A jelenlegi réteges védelem elegendő static site esetén

---

### 4. GAS endpoint URL expozíció — 🟢 ALACSONY

**Probléma:** A Google Apps Script URL (`BOOKING_SCRIPT_URL`) látható a `config.js` fájlban. Bárki közvetlenül hívhatja meg a foglalási endpointot.

**Érintett fájl(ok):** `scripts/config.js:1-2, scripts/shared.js:894, 1067`

**Javasolt javítás:**
Ez a static site-ek beépített kockázata. A GAS endpoint már tartalmaz:
- `RATE_LIMITED` hibakód (szerver-oldali rate limiting)
- `DAILY_CAP_REACHED` hibakód (napi limit)
- `CAPTCHA_FAILED` hibakód (Turnstile ellenőrzés)
- `SLOT_UNAVAILABLE` hibakód (slot validálás)

A jelenlegi védelem elegendő.

**Erőfeszítés:** —
**Hatás:** A GAS endpoint már rendelkezik szerver-oldali védelemmel

---

## Biztonságos elemek

| Elem                         | Státusz | Megjegyzés                                          |
| ---------------------------- | ------- | --------------------------------------------------- |
| Honeypot (Hire Me)           | ✅ Biztonságos | `_gotcha` mező — Formspree beépített támogatás     |
| Honeypot (Booking)           | ✅ Biztonságos | `bk-hp` mező — ellenőrizve a shared.js:1012-ben    |
| Cloudflare Turnstile (Hire)  | ✅ Biztonságos | Token kötelező a submit-hoz (shared.js:286-294)     |
| Cloudflare Turnstile (Booking)| ✅ Biztonságos | Token kötelező a submit-hoz (shared.js:1047-1053)   |
| Timing check (Hire Me)       | ✅ Biztonságos | Min 2500ms kitöltési idő (shared.js:249)            |
| Timing check (Booking)       | ✅ Biztonságos | Min 2500ms kitöltési idő (shared.js:1015)           |
| Email validálás              | ✅ Biztonságos | Regex + DoH MX lookup (CHECK_EMAIL_DOMAIN=true)     |
| Üzenet min hossz             | ✅ Biztonságos | Min 20 karakter + 4 szó (shared.js:264-266, 1022)  |
| Max hossz limit              | ✅ Biztonságos | maxlength="2000" mindkét form-on                    |
| XSS védelem                  | ✅ Biztonságos | textContent használata, nem innerHTML                |
| Dupla submit védelem         | ✅ Biztonságos | Gomb letiltása submit után (shared.js:272, 1033)    |
| Music player                 | ✅ Biztonságos | Helyi MP3 fájlok betöltése, nincs külső kérés       |
| Theme toggle                 | ✅ Biztonságos | Pure client-side                                     |
| Language selector            | ✅ Biztonságos | Pure client-side                                     |
| Email domain validálás       | ✅ Biztonságos | Cloudflare DoH MX lookup (shared.js:412-429)        |

---

## Összefoglalás

A CV site biztonsági védelme **megfelelő**. A legfontosabb védelmi rétegek működnek:

1. **Cloudflare Turnstile CAPTCHA** — kötelező token a formok elküldéséhez
2. **Honeypot mezők** — alapvető bot védelem
3. **Timing checks** — min 2500ms kitöltési idő
4. **Input validálás** — min hossz, szószám, email formátum
5. **Server-side rate limiting (GAS)** — `RATE_LIMITED` és `DAILY_CAP_REACHED` hibakódok
6. **Formspree spam szűrés** — beépített védelem

A `localStorage` cooldown bypass kockázata közepes, de nem kritikus, mert:
- A GAS endpointnak már van szerver-oldali rate limitingje
- A Formspree-nek beépített spam szűrése van
- A Turnstile CAPTCHA nehezíti az automatizált támadásokat

**Legfontosabb teendők:**
1. A name mező minimális hosszának beállítása (2 karakter) — egyszerű és hatékony
2. A localStorage cooldown megerősítése — opcionális, de ajánlott

_Generálta: /security-review skill_