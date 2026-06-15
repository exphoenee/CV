# shared.js — API referencia

Minden export a `scripts/shared.js`-ből érhető el.

## HTML generálás

### `html\`\`` (tagged template literal)

Biztonságos HTML generálás. A `${...}` helyeken automatikusan escape-el, kivéve `raw()` csomagolt értékeket.

```js
import { html, raw, escHtml } from './shared.js';

const result = html`<div class="${cls}">${userInput}</div>`; // userInput escape-lve
const result = html`<div>${raw('<b>szándékosan HTML</b>')}</div>`; // raw nem escape-lődik
```

### `escHtml(str)`

Manuális HTML escape string-re. Használd, ha nem `html\`\`` template-et használsz.

### `skillChip(name, iconFile)`

Skill badge HTML-t generál.

```js
skillChip('TypeScript', 'typescript.svg');
// → '<div class="skill"><span class="skillImage"><img ...></span><span>TypeScript</span></div>'
```

### `refLinks(refs)`

Referencia linkek HTML-je. `refs` egy `{url, label}[]` tömb.

### `renderBullets(bullets, indent)`

Felsorolás HTML-je. `bullets` string tömb.

---

## Modálok

### `hireModalHTML(prefix)`

A kapcsolatfelvételi modál teljes HTML-jét adja vissza stringként.
Injectáld a `<body>` végére: `document.body.insertAdjacentHTML('beforeend', hireModalHTML('plain'))`.
A `prefix` (pl. `'plain'`, `'swagger'`) azonosítja az elemeket: `#plain-modal`, `#plain-btn`, stb.

### `initHireModal(prefix)`

A kapcsolatfelvételi modált inizializálja — event listenerek, form submit, lokalizáció frissítés.
Hívd a HTML inject után. Visszaad egy `{ openModal, closeModal }` objektumot.

**Megkövetel a DOM-ban:** `#[prefix]-modal`, `#[prefix]-btn`, `#[prefix]-form`, `#[prefix]-close`, `#[prefix]-backdrop`,
`#[prefix]-name`, `#[prefix]-email`, `#[prefix]-message`, `#[prefix]-subject`,
`#[prefix]-name-err`, `#[prefix]-email-err`, `#[prefix]-msg-err`

### `bookingModalHTML(prefix)`

A naptárfoglalás modál HTML-je. Prefix-elt azonosítókkal (pl. `'plain-bk'`).

### `initBookingModal(prefix)`

A naptárfoglalás modált inizializálja. Google Apps Script-ről tölti a szabad időpontokat.

---

## Zenelejátszó

### `musicPlayerHTML()`

A teljes zenelejátszó HTML-jét adja vissza (lebegő `#music-toggle` gomb + `#music-player-box` panel).
Injectáld a `<body>` végére.

### `MUSIC_GENRES`

19 zeneszám listája: `{ label: string, value: string }[]`. A `value` az MP3 relatív útvonala.

A lejátszó inicializálása a `cv-music-player.js`-ben van:

```js
import { initMusicPlayer } from './cv-music-player.js';
initMusicPlayer();
```

---

## Téma

### `initThemeToggle(config)`

```js
initThemeToggle({
  key: THEME_KEY, // localStorage kulcs
  validThemes: null, // null = bármely téma, vagy string[] az engedélyezetteknek
  buttonId: 'theme-toggle', // alapértelmezett
  onSet: (theme, btn) => {}, // callback témaváltáskor
});
```

### `getSystemTheme()`

`'dark'` vagy `'light'` — a rendszer prefers-color-scheme alapján.

---

## Állapot perzisztálás

### `saveState(key, id, value)`

Egy adott kulcs alá elmenti az `id` → `value` leképezést localStorage-ba.

### `loadState(key, id, defaultValue)`

Visszaolvassa. Ha nincs, `defaultValue`-t ad vissza.

### `restoreCollapseStates(key)`

Egy mentett állapot-objektumból visszaállítja az `is-open` CSS osztályokat a megfelelő elem ID-kra.

---

## Toast

### `showToast(message)`

Rövid értesítési üzenetet jelenít meg. 3 másodperc után eltűnik.
Megköveteli a DOM-ban: `<div id="cv-toaster-container">`.

---

## E-mail domain ellenőrzés

### `checkEmailDomain(email)` — async

Cloudflare DoH (1.1.1.1) MX rekord lekérdezés. Fail-open: hálózati hiba esetén `true`-t ad vissza.
Cache: `sessionStorage` → `'mx_' + domain` = `'1'` (van MX) vagy `'0'` (nincs MX).

Az `initHireModal` és `initBookingModal` automatikusan kezeli — nem kell külön hívni.
Bekapcsolva/kikapcsolva: `CHECK_EMAIL_DOMAIN` flag a `config.js`-ben.

---

## Formspree

### `initFormspree(selector)`

Stub — a tényleges Formspree POST az `initHireModal` submit handlerében van implementálva.
Megtartva visszafelé kompatibilitás miatt, de nem csinál semmit.
