# Új nézet oldal létrehozásának checklistje

## 1. Fájlok létrehozása

```
cv-[name].html          # belépési pont HTML
scripts/cv-[name].js    # ES Module belépési pont
styles/cv-[name].css    # nézet-specifikus stílusok
```

### HTML template minimuma (`cv-[name].html`)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Viktor Bozzay — [Nézet neve]</title>
    <link rel="stylesheet" href="./styles/cv-index.css" />
    <link rel="stylesheet" href="./styles/cv-[name].css" />
    <link rel="stylesheet" href="./styles/lang-dropdown.css" />
    <link rel="stylesheet" href="./styles/cv-music-player.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossorigin="anonymous" referrerpolicy="no-referrer" />
    <script type="module" src="./scripts/cv-[name].js"></script>
  </head>
  <body>
    <!-- itt lesz generálva a tartalom JS-ből -->
    <div id="cv-toaster-container" aria-live="polite" aria-label="Notifications"></div>
  </body>
</html>
```

### JS belépési pont minimuma (`scripts/cv-[name].js`)

```js
import { CV_DATA } from './cv-data.js';
import { locale } from './locale.js';
import {
  initHireModal, hireModalHTML,
  initBookingModal, bookingModalHTML,
  musicPlayerHTML, getSystemTheme, initThemeToggle,
} from './shared.js';
import { initMusicPlayer } from './cv-music-player.js';
import { THEME_KEY, THEME_DARK, THEME_LIGHT } from './config.js';
import { langDropdownHTML, initLangDropdown } from './components/lang-dropdown.js';

// ... nézet-specifikus render logika

document.addEventListener('DOMContentLoaded', function() {
  // 1. Render az oldal tartalmát CV_DATA-ból
  // 2. Inject modálokat és playert
  document.body.insertAdjacentHTML('beforeend', hireModalHTML('[name]'));
  document.body.insertAdjacentHTML('beforeend', bookingModalHTML('[name]-bk'));
  document.body.insertAdjacentHTML('beforeend', musicPlayerHTML());
  // 3. Inicializálás
  initHireModal('[name]');
  initBookingModal('[name]-bk');
  initMusicPlayer();
  initThemeToggle({ key: THEME_KEY, ... });
  initLangDropdown();
});
```

## 2. Karuszel kártya az index.html-be

Az `index.html` `#cv-carousel-stage` div-jébe add hozzá:

```html
<div class="cv-slide cv-slide--[name]" data-idx="[következő szám]" role="listitem">
  <div class="cv-slide-icon" aria-hidden="true"><i class="fas fa-[ikon]"></i></div>
  <span class="cv-slide-title" data-i18n="btn[Name]Label">I'm a [Célközönség]</span>
  <span class="cv-slide-desc" data-i18n="btn[Name]Desc">[Leírás]</span>
  <a class="cv-slide-cta" href="cv-[name].html" aria-label="Open [name] view — [leírás]">
    <span data-i18n="btnCardOpen">Open this view →</span>
  </a>
</div>
```

A `data-idx` értéke a meglévő slidok számától függ (jelenlegi maximum: 5, tehát 6 lesz a következő).

## 3. Locale kulcsok (mind a 12 fájlba)

Legalább ezek szükségesek az új kártyához:

```js
// en.js-ben:
btn[Name]Label: "I'm a [Célközönség]",
btn[Name]Desc:  "[Nézet leírása]",

// + minden nézet-specifikus szöveg kulcsa
```

Minden kulcsot be kell írni mind a 12 locale fájlba. Lásd: [localization.md](localization.md)

## 4. Kötelező elemek az oldalon

Minden nézet oldalnak tartalmaznia kell:

- [ ] **Zenelejátszó** — `musicPlayerHTML()` + `initMusicPlayer()`
- [ ] **Hire Me modál** — `hireModalHTML(prefix)` + `initHireModal(prefix)`
- [ ] **Meet / naptárfoglalás modál** — `bookingModalHTML(prefix)` + `initBookingModal(prefix)`
- [ ] **Hire Me gomb** — `id="[prefix]-btn"` attribútummal az oldalon valahol
- [ ] **Meet gomb** — `id="[prefix]-bk-btn"` attribútummal az oldalon valahol
- [ ] **Toast container** — `<div id="cv-toaster-container">` a body-ban
- [ ] **Reszponzív CSS** — az oldal mobilon is teljes értékűen használható

## 5. Zenelejátszó elhelyezési szabály

**Headerben/menüsorban van a lejátszó:** NEM kell lebegő `#music-toggle` gomb a bal alsó sarokba.
**Nincs header:** a `musicPlayerHTML()` generál egy lebegő `#music-toggle` gombot — ez marad.

A két megoldás egyszerre **nem** szerepelhet egy oldalon.

## 6. Reszponzív CSS

Lásd: [responsive.md](responsive.md)

Töréspontok iránya: mobile-first. Minimális elvárás:
- `max-width: 600px` — single-column, touch-friendly
- `max-width: 900px` — tablet köztes állapot ha szükséges
- `min-width: 901px` — desktop layout
