# Email Domain Validation — DNS over HTTPS (statikus site)

## Context

A CV projekt statikus HTML/JS oldal, nincs backend. Bárki küldhet üzenetet vagy foglalhat időpontot — az email mező csak regex-szel volt ellenőrizve (formátum). Cél: valódi domain-ellenőrzés hozzáadása, anélkül hogy API-kulcs kellene. Megoldás: Cloudflare DNS-over-HTTPS (DoH) lekérdezés közvetlenül a böngészőből — CORS-barát, ingyenes, korlát nélküli.

## Érintett fájlok

- **`scripts/config.js`** — új boolean flag: `CHECK_EMAIL_DOMAIN`
- **`scripts/shared.js`** — az összes logika itt van, ide kerül az új helper, a módosított submitok és a honeypot ellenőrzés
- **`scripts/locales/*.js`** — mind a 12 locale fájl: en, hu, de, fr, es, it, dot, kl, qu, goa, asg, ya

---

## 0. lépés — Config flag (`scripts/config.js`)

A `config.js` végére egy sor kerül:

```js
export var CHECK_EMAIL_DOMAIN = true;
```

- `true` → a DoH ellenőrzés aktív (alapértelmezett)
- `false` → csak a regex fut, a domain check teljesen ki van kapcsolva

A `shared.js`-ben a `checkEmailDomain` hívása előtt mindig ellenőrizni kell:

```js
// blur listenerben:
if (!CHECK_EMAIL_DOMAIN) return;

// submit handlerben (fázis 2 elején):
var domainOk = CHECK_EMAIL_DOMAIN ? await checkEmailDomain(emailVal) : true;
```

Ha `CHECK_EMAIL_DOMAIN === false`, a `domainOk` azonnal `true` lesz, az `errEmailVerifying` üzenet soha nem jelenik meg, és az async fetch nem fut le.

---

## 1. lépés — Új locale kulcsok (mind a 12 fájlba)

Az `errEmailInvalid` kulcs után, az összes locale fájl `labels` objektumába:

```js
errEmailVerifying: "Checking mail server…",       // en
errEmailNoMailServer: "This domain does not accept email.",
```

| Fájl     | `errEmailVerifying`                 | `errEmailNoMailServer`                    |
| -------- | ----------------------------------- | ----------------------------------------- |
| `en.js`  | `"Checking mail server…"`           | `"This domain does not accept email."`    |
| `hu.js`  | `"Levelezőszerver ellenőrzése…"`    | `"Ez a domain nem fogad e-mailt."`        |
| `de.js`  | `"Mailserver wird geprüft…"`        | `"Diese Domain empfängt keine E-Mails."`  |
| `fr.js`  | `"Vérification du serveur mail…"`   | `"Ce domaine n'accepte pas les e-mails."` |
| `es.js`  | `"Verificando servidor de correo…"` | `"Este dominio no acepta correos."`       |
| `it.js`  | `"Verifica del server mail…"`       | `"Questo dominio non accetta email."`     |
| `dot.js` | `"Alegra chiori kash…"`             | `"Chiori vo nakhoe."`                     |
| `kl.js`  | `"jabbI'ID legh…"`                  | `"jabbI'ID Qapla' pagh."`                 |
| `qu.js`  | `"Centapoldo cendë…"`               | `"Ú-centapoldo sírë."`                    |
| `goa.js` | `"Joma rel kree…"`                  | `"Joma rel ú-chel."`                      |
| `asg.js` | `"Tölvupóstur er kannaður…"`        | `"Þetta lén tekur ekki við tölvupósti."`  |
| `ya.js`  | `"Del kainde tih…"`                 | `"Del kainde ú-gkei."`                    |

> **Megjegyzés:** A dot/kl/qu/goa/asg/ya locale-ok fantázia/kísérletező nyelvek — a fordításaik ellenőrzendők a meglévő stílus szerint.

---

## 2. lépés — `checkEmailDomain()` helper (`shared.js`)

Elhelyezés: az `initFormspree` stub után, a `MUSIC_GENRES` konstans előtt.

```js
export async function checkEmailDomain(email) {
  var domain = email.split('@')[1].toLowerCase();
  var cacheKey = 'mx_' + domain;

  var cached = sessionStorage.getItem(cacheKey);
  if (cached === '1') return true;
  if (cached === '0') return false;

  try {
    var url = 'https://1.1.1.1/dns-query?name=' + encodeURIComponent(domain) + '&type=MX';
    var res = await fetch(url, { headers: { Accept: 'application/dns-json' } });
    if (!res.ok) return true; // fail-open hálózati hibánál
    var data = await res.json();
    var valid = data.Status === 0 && Array.isArray(data.Answer) && data.Answer.length > 0;
    sessionStorage.setItem(cacheKey, valid ? '1' : '0');
    return valid;
  } catch (_) {
    return true; // CORS, offline, timeout → ne blokkoljuk a felhasználót
  }
}
```

**Kulcsdöntések:**

- `fail-open`: hálózati hiba esetén nem blokkol, átengedi a formot
- `sessionStorage` cache domain-enként (`mx_gmail.com = '1'`)
- `.toLowerCase()` a domainen: egységes cache kulcs, helyes DNS lookup
- Nem kell `import` — ugyanabban a `shared.js`-ben van, mint a hívói

---

## 3. lépés — Hire form submit handler módosítása (`shared.js` ~123–166. sor)

Az event handler `async function(e)` lesz. Három fázis:

1. **Szinkron validáció** — regex, name, message (meglévő logika, változatlan)
2. **Async domain check** — `submitBtn` disabled, `emailErr` = `errEmailVerifying`, `await checkEmailDomain()`
3. **Formspree POST** — csak ha a domain OK (meglévő logika, változatlan)

```js
document.getElementById(prefix + '-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  e.stopImmediatePropagation();

  var nameVal = document.getElementById(prefix + '-name').value.trim();
  var emailVal = document.getElementById(prefix + '-email').value.trim();
  var msgVal = document.getElementById(prefix + '-message').value.trim();
  var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
  var wordCount = msgVal.split(/\s+/).filter(Boolean).length;

  // Fázis 1 — szinkron (változatlan)
  document.getElementById(prefix + '-name-err').textContent = nameVal
    ? ''
    : locale.t('errFieldRequired');
  document.getElementById(prefix + '-email-err').textContent = emailOk
    ? ''
    : locale.t('errEmailInvalid');
  document.getElementById(prefix + '-msg-err').textContent =
    msgVal.length >= 20 && wordCount >= 4 ? '' : locale.t('errMessageTooShort');
  if (!nameVal || !emailOk || msgVal.length < 20 || wordCount < 4) return;

  // Fázis 2 — async domain check
  var form = this;
  var submitBtn = form.querySelector('[type="submit"]');
  var emailErr = document.getElementById(prefix + '-email-err');

  if (submitBtn) submitBtn.disabled = true;
  emailErr.textContent = locale.t('errEmailVerifying');

  var domainOk = await checkEmailDomain(emailVal);

  if (!domainOk) {
    emailErr.textContent = locale.t('errEmailNoMailServer');
    if (submitBtn) submitBtn.disabled = false;
    return;
  }
  emailErr.textContent = '';

  // Fázis 3 — Formspree POST (változatlan)
  var formData = new FormData(form);
  fetch('https://formspree.io/f/mrejlned', {
    method: 'POST',
    body: formData,
    headers: { Accept: 'application/json' },
  })
    .then(function (res) {
      if (res.ok) {
        localStorage.setItem(COOLDOWN_KEY, Date.now().toString());
        form.style.display = 'none';
        var hireCooldown = document.querySelector('#' + prefix + '-modal [data-hire-cooldown]');
        if (hireCooldown) hireCooldown.classList.add('cv-success-hidden');
        var fsSuccess = document.querySelector('#' + prefix + '-modal [data-fs-success]');
        if (fsSuccess) fsSuccess.classList.remove('cv-success-hidden');
      } else {
        if (submitBtn) submitBtn.disabled = false;
        var fsError = document.querySelector('#' + prefix + '-modal [data-fs-error]');
        if (fsError) {
          fsError.classList.remove('cv-error-hidden');
          fsError.textContent = locale.t('errSendFailed');
        }
      }
    })
    .catch(function () {
      if (submitBtn) submitBtn.disabled = false;
      var fsError = document.querySelector('#' + prefix + '-modal [data-fs-error]');
      if (fsError) {
        fsError.classList.remove('cv-error-hidden');
        fsError.textContent = locale.t('errSendFailed');
      }
    });
});
```

---

## 4. lépés — Booking form submit handler módosítása (`shared.js` ~547–588. sor)

Ugyanaz a minta. A `bookSending` szöveg a submit btnre **csak a domain check után** kerül — ne zavarjon össze két visszajelzési csatornát.

```js
document.getElementById(p + '-bk-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  var nameVal = document.getElementById(p + '-bk-name').value.trim();
  var emailVal = document.getElementById(p + '-bk-email').value.trim();
  var topicVal = document.getElementById(p + '-bk-topic').value.trim();
  var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
  var topicWordCount = topicVal.split(/\s+/).filter(Boolean).length;
  var topicOk = topicVal.length >= 20 && topicWordCount >= 4;

  // Fázis 1 — szinkron
  document.getElementById(p + '-bk-email-err').textContent = emailOk
    ? ''
    : locale.t('errEmailInvalid');
  document.getElementById(p + '-bk-topic-err').textContent = topicOk
    ? ''
    : locale.t('errMessageTooShort');
  if (!nameVal || !emailOk || !topicOk) return;

  // Fázis 2 — async domain check
  var submitBtn = document.getElementById(p + '-bk-submit');
  var emailErr = document.getElementById(p + '-bk-email-err');
  submitBtn.disabled = true;
  emailErr.textContent = locale.t('errEmailVerifying');

  var domainOk = await checkEmailDomain(emailVal);

  if (!domainOk) {
    emailErr.textContent = locale.t('errEmailNoMailServer');
    submitBtn.disabled = false;
    return;
  }
  emailErr.textContent = '';
  submitBtn.textContent = locale.t('bookSending');

  // Fázis 3 — Google Apps Script GET (változatlan)
  var params = new URLSearchParams({
    action: 'book',
    name: nameVal,
    email: emailVal,
    topic: topicVal,
    start: selectedSlot.start,
    end: selectedSlot.end,
  });
  fetch(BOOKING_SCRIPT_URL + '?' + params.toString())
    .then(function (res) {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(function (data) {
      if (data.success) {
        localStorage.setItem(BK_COOLDOWN_KEY, Date.now().toString());
        document.getElementById(p + '-bk-confirm-detail').textContent = formatSlot(
          new Date(selectedSlot.start),
          new Date(selectedSlot.end),
        );
        show(p + '-bk-step-confirm');
      } else {
        alert(locale.t('bookFailed'));
        submitBtn.disabled = false;
        submitBtn.textContent = locale.t('bookSubmit');
      }
    })
    .catch(function () {
      alert(locale.t('bookFailed'));
      submitBtn.disabled = false;
      submitBtn.textContent = locale.t('bookSubmit');
    });
});
```

---

## 5. lépés — Blur listenere az email mezőkre

Mindkét init függvényen belül, az első DOM event handler bekötése előtt. Pre-ellenőrzi a domaint amint a user elhagyja a mezőt — így submitnál már cache-ből tölt.

**Hire modálban** (`initHireModal` belsejébe, a `clearFieldErrors` definíció után):

```js
document.getElementById(prefix + '-email').addEventListener('blur', async function () {
  var emailVal = this.value.trim();
  var emailErr = document.getElementById(prefix + '-email-err');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) return;
  var domain = emailVal.split('@')[1].toLowerCase();
  if (sessionStorage.getItem('mx_' + domain) !== null) return; // már cachelt → nincs spinner
  emailErr.textContent = locale.t('errEmailVerifying');
  var ok = await checkEmailDomain(emailVal);
  // stale-value guard: ha közben változott a mező, ne írjuk felül
  if (document.getElementById(prefix + '-email').value.trim() === emailVal) {
    emailErr.textContent = ok ? '' : locale.t('errEmailNoMailServer');
  }
});
```

**Booking modálban** ugyanez `p + '-bk-email'` és `p + '-bk-email-err'` ID-kkel, a cooldown konstansok deklarációja után.

---

---

## 6. lépés — Honeypot mező

A honeypot egy rejtett input, amit az ember sosem lát/tölt ki, de az automatizált botok kitöltik (mert minden mezőt feldolgoznak). Ha ki van töltve → bot → eldobjuk a kérést.

### Hire form (`hireModalHTML` — `shared.js` ~645. sor)

A Formspree natívan támogatja a `_gotcha` nevű honeypot mezőt — ha ki van töltve, a Formspree **szerver oldalon** dobja el a beküldést, tehát ez az egyetlen ellenőrzés ami bypass-elhatatlan kliensoldalról.

A form `<form>` tagjén belül, az első `<div class="hire-field">` elé:

```html
<input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off" />
```

**JS változás nem szükséges** — a `FormData` automatikusan belerakja a `_gotcha` mezőt, a Formspree kezeli.

### Booking form (`bookingModalHTML` — `shared.js` ~358. sor)

A Google Apps Script nem támogatja natívan a honeypotot, ezért kliens oldalon kell ellenőrizni a submit handler fázis 1-ben, mielőtt bármi más fut.

A form `<form id="PREFIX-bk-form">` tagjén belül, az első `<div class="bk-field">` elé:

```html
<input
  type="text"
  id="PREFIX-bk-hp"
  name="bk-hp"
  style="display:none"
  tabindex="-1"
  autocomplete="off"
/>
```

A booking submit handler fázis 1 **legelejére** (az összes többi validáció előtt):

```js
// Honeypot: ha ki van töltve → bot
if (document.getElementById(p + '-bk-hp').value) return;
```

### Miért `display:none` és nem más CSS?

- `display:none` az ember számára teljesen láthatatlan és nem fókuszálható
- A Formspree `_gotcha` dokumentációja ezt javasolja
- A fejlettebb botok egy része kihagyja a `display:none` mezőket — ez elfogadható kompromisszum, a fő védelmi réteg a Formspree szerver oldali ellenőrzése

---

## Végrehajtási sorrend

1. `CHECK_EMAIL_DOMAIN = true` a `config.js`-be — kockázatmentes
2. Locale kulcsok hozzáadása (12 fájl) — kockázatmentes
3. `checkEmailDomain()` a `shared.js`-be
4. Honeypot mező a hire form HTML-be (`_gotcha`) — JS változás nem kell
5. Honeypot mező a booking form HTML-be + ellenőrzés a submit handler elejére
6. Hire form submit handler async-ra cserélése (DoH fázis)
7. Booking form submit handler async-ra cserélése (DoH fázis)
8. Blur listener a hire modálban
9. Blur listener a booking modálban

---

## Ellenőrzés

| Eset                                    | Elvárt viselkedés                                                |
| --------------------------------------- | ---------------------------------------------------------------- |
| `test@gmail.com`, tab el                | Network: DoH kérés látható; span: "Checking…" → törlődik         |
| `test@nemletezodomain12345.com`, tab el | Span: "Ez a domain nem fogad e-mailt."                           |
| Második blur ugyanarra a domainre       | Nincs második hálózati kérés (sessionStorage cache)              |
| Submit érvénytelen domainnel            | Nem küld, error message marad                                    |
| Offline mód (DevTools)                  | Fail-open: form elküldődik (Formspree/GAS fog majd hibát adni)   |
| Magyar nyelv                            | `errEmailVerifying`/`errEmailNoMailServer` magyarul jelenik meg  |
| Honeypot kitöltve (hire)                | Formspree szerver oldala eldobja, success üzenet NEM jelenik meg |
| Honeypot kitöltve (booking)             | Submit handler azonnal visszatér, GAS fetch nem fut le           |
| `_gotcha` mező látható-e?               | DevTools Elements-ben ott van, de a UI-on nem jelenik meg        |
