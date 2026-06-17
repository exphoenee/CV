# Aria Label Rules

Every interactive element and semantic region must have an aria attribute.
Aria label texts are localized — set via `locale.t('ariaKey')` calls, not hard-coded strings.

---

## Basic Rules

### 1. Icon-only buttons — always need `aria-label`

If a button contains only an icon (Font Awesome `<i>`), `aria-label` is required:

```html
<!-- CORRECT -->
<button id="music-toggle" aria-label="Open music player">
  <i class="fas fa-music" aria-hidden="true"></i>
</button>

<!-- WRONG — screen reader only reads "button" -->
<button id="music-toggle">
  <i class="fas fa-music"></i>
</button>
```

### 2. Decorative icons — always `aria-hidden="true"`

If the icon has adjacent text, or is purely visual decoration, hide it:

```html
<button><i class="fas fa-chevron-left" aria-hidden="true"></i> Back</button>
<span class="arrow" aria-hidden="true">▼</span>
<div class="bk-spinner" aria-hidden="true"></div>
<div class="bk-confirm-check" aria-hidden="true"><i class="fa-solid fa-check"></i></div>
```

### 3. Buttons with meaningful text — `aria-label` is optional, but if present, be informative

```html
<!-- Has text → no aria-label needed -->
<button>Hire Me</button>

<!-- If button text alone isn't enough context, add one -->
<button aria-label="Back to CV hub page">← Hub</button>
```

---

## Element-specific Rules

### Modals / Dialogs

```html
<div role="dialog" aria-modal="true" aria-labelledby="[id-of-title-element]">
  <h3 id="[id-of-title-element]">Title</h3>
  <button aria-label="Close dialog">✕</button>
</div>
```

- `role="dialog"` + `aria-modal="true"` required
- `aria-labelledby` points to the title element's ID (instead of `aria-label` — the title is already visible text)
- For emergency dialogs (e.g. game over): `role="alertdialog"`
- Close buttons always get `aria-label`: `locale.t('ariaCloseDialog')` / `ariaCloseContactForm` / `ariaCloseBooking`

### Forms and Fields

```html
<form novalidate aria-label="Contact form">
  <label for="[prefix]-name">Your name <span aria-label="required">*</span></label>
  <input
    id="[prefix]-name"
    type="text"
    aria-required="true"
    aria-describedby="[prefix]-name-err"
    autocomplete="name"
  />
  <span id="[prefix]-name-err" role="alert" aria-live="polite"></span>
</form>
```

- `<form>` gets `aria-label`
- `<label for="...">` is required for every input (don't use `placeholder` as a label)
- Required fields: `aria-required="true"` on the input, `*` marked with `aria-label="required"`
- Error span: `role="alert"` + `aria-live="polite"` (for critical errors: `aria-live="assertive"`)
- `aria-describedby` on the input points to the error span's ID

### Range Inputs (sliders)

```html
<input type="range" id="music-volume" min="0" max="1" step="0.05" aria-label="Music volume" />
<input type="range" id="track-seek" min="0" max="100" aria-label="Track position" />
```

- Every range input gets `aria-label` (`<label for>` is less screen-reader-friendly for sliders)

### Progressbar

```html
<div
  role="progressbar"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-valuenow="0"
  aria-label="Loading progress"
></div>
```

- `role="progressbar"` + `aria-valuemin` + `aria-valuemax` + `aria-valuenow` required

### List-like Containers

```html
<div role="list" aria-label="Available dates">
  <button role="listitem" aria-label="Monday, 16 June — 3 free slots">...</button>
</div>

<div class="cv-carousel-stage" role="list" aria-label="CV views">
  <div class="cv-slide" role="listitem">...</div>
</div>
```

- Visual lists (not `<ul>/<li>`) get `role="list"` + `aria-label`
- Items get `role="listitem"`

### Navigation and Regions

```html
<header role="banner">
  <nav aria-label="Menu bar">...</nav>
</header>
<main aria-label="CV content">...</main>
<section aria-label="CV view selector">...</section>
<div role="region" aria-label="Music player">...</div>
<div role="group" aria-label="Playback controls">...</div>
```

- `<header>` → `role="banner"` (or implicit)
- `<nav>` → always `aria-label` (if there are multiple navs on the page)
- Anonymous `<div>` regions: `role="region"` + `aria-label`
- Related button groups: `role="group"` + `aria-label`

### Combobox (Custom Dropdown)

```html
<div role="combobox" aria-label="Music genre" aria-haspopup="listbox" aria-expanded="false">
  <div role="button" tabindex="0" aria-label="Music genre">
    <span>🎵 Jazz</span>
    <span class="arrow" aria-hidden="true">▼</span>
  </div>
  <div role="listbox" aria-label="Genre options">
    <div class="custom-option" role="option">🎵 Jazz</div>
  </div>
</div>
```

- `aria-expanded` is updated by JS on open/close (`'true'` / `'false'`)
- Options get `role="option"`

### Toggle Buttons

```html
<button id="music-repeat" aria-label="Toggle repeat" aria-pressed="false">
  <i class="fas fa-repeat" aria-hidden="true"></i>
</button>
```

- `aria-pressed` is updated by JS on state change (`'true'` / `'false'`)

### Live Regions

```html
<!-- Status updates (non-urgent) -->
<div role="status" aria-live="polite">Loading…</div>

<!-- Error messages (immediate announcement) -->
<div role="alert" aria-live="assertive">Error!</div>

<!-- Toast notifications -->
<div id="cv-toaster-container" aria-live="polite" aria-label="Notifications"></div>

<!-- Lyrics panel -->
<div role="region" aria-label="Lyrics" aria-live="polite"></div>
```

---

## Localization: Aria Label Keys

Aria labels are **localized** — every `aria-label` value uses `locale.t('ariaKey')`.

### Existing Aria Keys (`scripts/locales/en.js`)

| Key                   | Value (EN)                   |
| --------------------- | ---------------------------- |
| `ariaToggleTheme`     | `"Toggle light/dark theme"`  |
| `ariaOpenMusicPlayer` | `"Open music player"`        |
| `ariaCloseMusicPlayer`| `"Close music player"`       |
| `ariaBackToHub`       | `"Back to CV hub"`           |
| `ariaCloseDialog`     | `"Close dialog"`             |
| `ariaHireForm`        | `"Open contact form"`        |
| `ariaCloseContactForm`| `"Close contact form"`       |
| `ariaCloseBooking`    | `"Close booking dialog"`     |
| `ariaTrackPosition`   | `"Track position"`           |
| `ariaMusicVolume`     | `"Music volume"`             |
| `ariaPlayMusic`       | `"Play music"`               |
| `ariaPauseMusic`      | `"Pause music"`              |
| `ariaNextTrack`       | `"Next track"`               |
| `ariaPrevTrack`       | `"Previous track"`           |
| `ariaToggleRepeat`    | `"Toggle repeat"`            |
| `ariaShowLyrics`      | `"Show lyrics"`              |
| `ariaGenreSelect`     | `"Music genre"`              |
| `ariaBookSlot`        | `"Book time slot"`           |
| `ariaContactsPopup`   | `"Contacts"`                 |
| `ariaSendMessage`     | `"Send message"`             |

### When Adding a New Aria Key

1. Add the `aria`-prefixed key to `en.js` alongside the other aria keys
2. Add it to all 12 locale files (see: [localization.md](localization.md))
3. Use `locale.t('ariaNewKey')` in code

### For JS-generated HTML (shared.js style)

```js
// NOT CORRECT — hard-coded string, not localized
'<button aria-label="Open music player">';

// CORRECT — comes from locale
'<button aria-label="' + locale.t('ariaOpenMusicPlayer') + '">';
```

### For HTML files (`data-i18n` does NOT work on aria-label)

```html
<!-- DOES NOT WORK — data-i18n only updates textContent -->
<button data-i18n="ariaOpenMusicPlayer" aria-label="Open music player">
  <!-- Correct approach: update via JS on localechange event, or inject from JS -->
</button>
```

If an HTML file has an aria-label whose text changes on language switch,
it must be updated from JS by reacting to the `localechange` event.

---

## Checklist for Adding a New Element

- [ ] Icon-only button → `aria-label` + `aria-hidden="true"` on the icon
- [ ] Decorative icon → `aria-hidden="true"`
- [ ] Modal → `role="dialog"` + `aria-modal="true"` + `aria-labelledby`
- [ ] Form → `aria-label` + fields with `aria-required` + `aria-describedby` (for errors)
- [ ] Error span → `role="alert"` + `aria-live`
- [ ] Range input → `aria-label`
- [ ] Toggle button → `aria-pressed`
- [ ] Combobox → `role="combobox"` + `aria-haspopup` + `aria-expanded`
- [ ] List container → `role="list"` + `aria-label`
- [ ] Live region → `role="status"/"alert"` + `aria-live`
- [ ] New aria text → localized key in all 12 locale files
