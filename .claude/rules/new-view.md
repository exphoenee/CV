# New View Page Creation Checklist

## 1. Create Files

```
cv-[name].html          # entry point HTML
scripts/cv-[name].js    # ES Module entry point
styles/cv-[name].css    # view-specific styles
```

### Minimum HTML Template (`cv-[name].html`)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Viktor Bozzay — [View name]</title>
    <link rel="stylesheet" href="./styles/cv-index.css" />
    <link rel="stylesheet" href="./styles/cv-[name].css" />
    <link rel="stylesheet" href="./styles/lang-dropdown.css" />
    <link rel="stylesheet" href="./styles/cv-music-player.css" />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />
    <script type="module" src="./scripts/cv-[name].js"></script>
  </head>
  <body>
    <!-- content will be generated from JS -->
    <div id="cv-toaster-container" aria-live="polite" aria-label="Notifications"></div>
  </body>
</html>
```

### Minimum JS Entry Point (`scripts/cv-[name].js`)

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

// ... view-specific render logic

document.addEventListener('DOMContentLoaded', function() {
  // 1. Render page content from CV_DATA
  // 2. Inject modals and player
  document.body.insertAdjacentHTML('beforeend', hireModalHTML('[name]'));
  document.body.insertAdjacentHTML('beforeend', bookingModalHTML('[name]-bk'));
  document.body.insertAdjacentHTML('beforeend', musicPlayerHTML());
  // 3. Initialize
  initHireModal('[name]');
  initBookingModal('[name]-bk');
  initMusicPlayer();
  initThemeToggle({ key: THEME_KEY, ... });
  initLangDropdown();
});
```

## 2. Carousel Card in index.html

Add to the `#cv-carousel-stage` div in `index.html`:

```html
<div class="cv-slide cv-slide--[name]" data-idx="[next number]" role="listitem">
  <div class="cv-slide-icon" aria-hidden="true"><i class="fas fa-[icon]"></i></div>
  <span class="cv-slide-title" data-i18n="btn[Name]Label">I'm a [Target audience]</span>
  <span class="cv-slide-desc" data-i18n="btn[Name]Desc">[Description]</span>
  <a class="cv-slide-cta" href="cv-[name].html" aria-label="Open [name] view — [description]">
    <span data-i18n="btnCardOpen">Open this view →</span>
  </a>
</div>
```

The `data-idx` value depends on the number of existing slides (current max: 5, so 6 would be next).

## 3. Locale Keys (all 12 files)

At minimum, the new card requires:

```js
// in en.js:
btn[Name]Label: "I'm a [Target audience]",
btn[Name]Desc:  "[View description]",

// + all view-specific text keys
```

Every key must be added to all 12 locale files. See: [localization.md](localization.md)

## 4. Required Elements on the Page

Every view page must include:

- [ ] **Music player** — `musicPlayerHTML()` + `initMusicPlayer()`
- [ ] **Hire Me modal** — `hireModalHTML(prefix)` + `initHireModal(prefix)`
- [ ] **Meet / booking modal** — `bookingModalHTML(prefix)` + `initBookingModal(prefix)`
- [ ] **Hire Me button** — with `id="[prefix]-btn"` attribute somewhere on the page
- [ ] **Meet button** — with `id="[prefix]-bk-btn"` attribute somewhere on the page
- [ ] **Toast container** — `<div id="cv-toaster-container">` in the body
- [ ] **Responsive CSS** — the page must be fully usable on mobile

## 5. Music Player Placement Rule

**Player is in the header/menu bar:** Do NOT place a floating `#music-toggle` button in the bottom-left corner.
**No header:** `musicPlayerHTML()` generates a floating `#music-toggle` button — this stays.

These two solutions must **never** appear on the same page simultaneously.

## 6. Responsive CSS

See: [responsive.md](responsive.md)

Breakpoint direction: mobile-first. Minimum expectations:

- `max-width: 600px` — single-column, touch-friendly
- `max-width: 900px` — tablet intermediate state if needed
- `min-width: 901px` — desktop layout
