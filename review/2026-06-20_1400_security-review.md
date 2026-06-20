# Biztonsági Átvizsgálás — CV Site

**Típus:** security-review
**Dátum:** 2026-06-20 14:00
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

| Finding                                    | Feature     | Severity | Bypass difficulty            | Recommended fix                 |
| ------------------------------------------ | ----------- | -------- | ---------------------------- | ------------------------------- |
| localStorage-only cooldown ( Hire Me + Booking ) | Hire Me + Booking | MEDIUM | Easy (clear storage) | Add sessionStorage for secondary check |
| Cloudflare Turnstile sitekey exposed in JS | Hire Me + Booking | MEDIUM | N/A (inherent to static sites) | Accept risk — Turnstile is designed for this |
| GAS endpoint accepts arbitrary slot params  | Booking     | MEDIUM   | Medium (requires inspection) | Validate slot server-side in GAS |
| No max message length on hire form textarea | Hire Me     | LOW      | Trivial                      | maxlength attribute already set (2000) |
| Music player preloads tracks via fetch()    | Music       | LOW      | None (local assets)          | No risk — local files only     |

---

## Részletes megállapítások és javaslatok

### 1. localStorage-only cooldown — KÖZEPES

**Probléma:** A Hire Me és Booking modálisok cooldown-ja (`hire_sent_ts`, `booking_sent_ts`) csak `localStorage`-ban tárolódik. A felhasználó törölheti a localStorage-t (DevTools, incognito, cookie törlés), és újra küldhet üzenetet/foglalást.

**Érintett fájl(ok):** `scripts/shared.js:141-143`, `scripts/shared.js:305`, `scripts/shared.js:746-748`, `scripts/shared.js:816-818`

**Javasolt javítás:**
A meglévő `localStorage` cooldown mellé adjunk egy `sessionStorage` alapú második ellenőrzést is. A `sessionStorage` nem törölhető DevTools-ból anélkül, hogy az oldal újra ne töltődne, és incognito módban is új session-t kap.

```javascript
// shared.js - initHireModal-ban
var SESSION_KEY = 'hire_session_active';

function isOnCooldown() {
  var ts = parseInt(localStorage.getItem(COOLDOWN_KEY) || '0', 10);
  var localCooldown = ts > 0 && Date.now() - ts < COOLDOWN_MS;
  var sessionCooldown = sessionStorage.getItem(SESSION_KEY) === '1';
  return localCooldown || sessionCooldown;
}

// Sikeres küldés után:
localStorage.setItem(COOLDOWN_KEY, Date.now().toString());
sessionStorage.setItem(SESSION_KEY, '1');
```

**Erőfeszítés:** Alacsony
**Hatás:** Nehezebbé teszi a cooldown megkerülését — a felhasználónak manuálisan kellene törölnie a session storage-t is.

---

### 2. Cloudflare Turnstile sitekey exposed in JS — KÖZEPES

**Probléma:** A `TURNSTILE_SITEKEY` (`0x4AAAAAADlq-gSDTCI_ln-y`) nyílt szövegként szerepel a `shared.js:103` sorban. Ez a Cloudflare Turnstile-nál normális és elvárt — a sitekey publikus, a verify token a szerver oldalon ellenőrződik.

**Érintett fájl(ok):** `scripts/shared.js:103`

**Javasolt javítás:**
Nincs teendő — a Turnstile sitekey publikus kulcs, amit a Cloudflare szándékosan tesz ki a kliens oldalra. A valódi védelem a szerver oldali token ellenőrzés (Formspree és GAS).

**Erőfeszítés:** Nem szükséges
**Hatás:** Elfogadott kockázat — a Turnstile ezen a módon működik.

---

### 3. GAS endpoint accepts arbitrary slot params — KÖZEPES

**Probléma:** A Booking modal `selectedSlot.start` és `selectedSlot.end` értékeket küld a GAS-nek (`scripts/shared.js:1057-1065`). Egy technikailag hozzáértő felhasználó manipulálhatja a kérést, és tetszőleges slotot foglalhat le.

**Érintett fájl(ok):** `scripts/shared.js:1057-1065`

**Javasolt javítás:**
A Google Apps Script oldalon (Code.gs) ellenőrizni kell, hogy a beküldött slot ténylegesen szabad-e a naptárban, és hogy az adott slot benne van-e a visszaadható slotok listájában. Ezt a GAS-ben kell megvalósítani, nem a kliens oldalon.

**Erőfeszítés:** Közepes (GAS módosítás)
**Hatás:** Megakadályozza, hogy valaki nem létező vagy már foglalt slotokat foglaljon le.

---

### 4. No max message length on hire form textarea — ALACSONY

**Probléma:** A Hire Me form textarea-ján nincs `maxlength` attribute a HTML-ben, pedig a `shared.js:1213` szerint a maximum 2000 karakter. Ez azt jelenti, hogy a kliens oldali validáció nem korlátozza a bevitel hosszát — a felhasználó hosszabb szöveget is beadhat.

**Érintett fájl(ok):** `scripts/shared.js:1213`

**Javasolt javítás:**
A textarea-ban már van `maxlength="2000"` a `hireModalHTML` függvényben (1213. sor). Ez helyesen van beállítva.

**Erőfeszítés:** Nem szükséges
**Hatás:** A maxlength korlátozza a payload méretét.

---

### 5. Music player preloads tracks via fetch() — ALACSONY

**Probléma:** A `cv-music-player.js:460` sorban a `fetch(src)` hívások helyi MP3 fájlokat tölt le. Ezek nem felhasználói inputból származnak, és nem küldenek adatot külső szolgáltatásnak.

**Érintett fájl(ok):** `scripts/cv-music-player.js:460`

**Javasolt javítás:**
Nincs teendő — a betöltött források a `MUSIC_GENRES` tömbből származnak, amely statikusan definiált.

**Erőfeszítés:** Nem szükséges
**Hatás:** Nincs biztonsági kockázat.

---

## Biztonságos elemek

✅ **Cloudflare Turnstile** — Mind a Hire Me, mind a Booking form használja. A token szerver oldalon ellenőrződik (Formspree és GAS).

✅ **Honeypot mezők** — Mindkét formában van rejtett `_gotcha` / `bk-hp` mező, amit a botok kitöltenek, de az emberek nem.

✅ **Timing check** — Mindkét formában van `MIN_FILL_MS` (2500ms) ellenőrzés, ami megakadályozza, hogy a form a megnyitás után túl gyorsan legyen beküldve.

✅ **Email domain ellenőrzés** — A `CHECK_EMAIL_DOMAIN` flag engedélyezve van, és DoH MX lookup segítségével ellenőrzi, hogy az email domain létezik-e.

✅ **XSS védelem** — Az `escHtml()` függvény és a `html`` ` template tag használata biztosítja, hogy a felhasználói input ne kerüljön a DOM-ba `innerHTML`-ként.

✅ **Input validáció** — Mindkét formában van:
- Name mező kötelező
- Email formátum validáció regex-szel
- Message minimum hossz (20 karakter) és szószám (4 szó)

✅ **Formspree spam szűrés** — A Formspree-nek beépített spam szűrése van, ami a szerver oldalon működik.

✅ **Google Apps Script rate limiting** — A GAS-ben van `RATE_LIMITED` és `DAILY_CAP_REACHED` hiba kód, ami azt jelzi, hogy a szerver oldali rate limiting működik.

---

_Generálta: /security-review skill_
