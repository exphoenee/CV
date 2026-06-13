# Aria label szabályok

Minden interaktív elem és szemantikus régió aria attribútummal rendelkezik.
Az aria label szövegek lokalizáltak — `locale.t('ariaKulcs')` hívással állítódnak be, nem hard-coded stringek.

---

## Alapszabályok

### 1. Icon-only gombok — mindig kell `aria-label`

Ha egy gomb csak ikont tartalmaz (Font Awesome `<i>`), kötelező az `aria-label`:

```html
<!-- HELYES -->
<button id="music-toggle" aria-label="Open music player">
  <i class="fas fa-music" aria-hidden="true"></i>
</button>

<!-- HIBÁS — screen reader csak "button"-t olvas -->
<button id="music-toggle">
  <i class="fas fa-music"></i>
</button>
```

### 2. Dekoratív ikonok — mindig `aria-hidden="true"`

Ha az ikon mellett van szöveg, vagy az ikon csak vizuális dekoráció, el kell rejteni:

```html
<button><i class="fas fa-chevron-left" aria-hidden="true"></i> Back</button>
<span class="arrow" aria-hidden="true">▼</span>
<div class="bk-spinner" aria-hidden="true"></div>
<div class="bk-confirm-check" aria-hidden="true"><i class="fa-solid fa-check"></i></div>
```

### 3. Értelmes szövegű gombok — `aria-label` opcionális, de ha van, legyen informatív

```html
<!-- Van szöveg → nem kell aria-label -->
<button>Hire Me</button>

<!-- Ha a gomb szövege nem elég önmagában a kontextushoz, adj hozzá -->
<button aria-label="Back to CV hub page">← Hub</button>
```

---

## Elemtípusonkénti szabályok

### Modálok / dialógusok

```html
<div role="dialog" aria-modal="true" aria-labelledby="[id-of-title-element]">
  <h3 id="[id-of-title-element]">Cím</h3>
  <button aria-label="Close dialog">✕</button>
</div>
```

- `role="dialog"` + `aria-modal="true"` kötelező
- `aria-labelledby` a cím elem ID-jára mutat (`aria-label` helyett — a cím már látható szöveg)
- Vészhelyzet dialógnál (pl. game over): `role="alertdialog"`
- A bezáró gomb mindig kap `aria-label`-t: `locale.t('ariaCloseDialog')` / `ariaCloseContactForm` / `ariaCloseBooking`

### Űrlapok és mezők

```html
<form novalidate aria-label="Contact form">
  <label for="[prefix]-name">Your name <span aria-label="required">*</span></label>
  <input id="[prefix]-name" type="text"
         aria-required="true"
         aria-describedby="[prefix]-name-err"
         autocomplete="name" />
  <span id="[prefix]-name-err" role="alert" aria-live="polite"></span>
</form>
```

- `<form>` kap `aria-label`-t
- `<label for="...">` kötelező minden inputhoz (ne `placeholder`-t használj label helyett)
- Kötelező mezőknél: `aria-required="true"` az inputon, a `*` jel `aria-label="required"`-dal
- Hibaüzenet span: `role="alert"` + `aria-live="polite"` (kritikus hibánál `aria-live="assertive"`)
- `aria-describedby` az inputon a hibaüzenet span ID-jára mutat

### Range inputok (csúszkák)

```html
<input type="range" id="music-volume" min="0" max="1" step="0.05"
       aria-label="Music volume" />
<input type="range" id="track-seek" min="0" max="100"
       aria-label="Track position" />
```

- Minden range input kap `aria-label`-t (a `<label for>` kevéssé olvasóbarát csúszkáknál)

### Progressbar

```html
<div role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"
     aria-label="Loading progress">
</div>
```

- `role="progressbar"` + `aria-valuemin` + `aria-valuemax` + `aria-valuenow` kötelező

### Lista jellegű konténerek

```html
<div role="list" aria-label="Available dates">
  <button role="listitem" aria-label="Monday, 16 June — 3 free slots">...</button>
</div>

<div class="cv-carousel-stage" role="list" aria-label="CV views">
  <div class="cv-slide" role="listitem">...</div>
</div>
```

- Vizuális listák (nem `<ul>/<li>`) kapnak `role="list"` + `aria-label`-t
- Az elemek `role="listitem"`-et kapnak

### Navigáció és régiók

```html
<header role="banner">
  <nav aria-label="Menu bar">...</nav>
</header>
<main aria-label="CV content">...</main>
<section aria-label="CV view selector">...</section>
<div role="region" aria-label="Music player">...</div>
<div role="group" aria-label="Playback controls">...</div>
```

- `<header>` → `role="banner"` (vagy implicit)
- `<nav>` → mindig `aria-label` (ha több nav van az oldalon)
- Névtelen `<div>` régiókhoz: `role="region"` + `aria-label`
- Kapcsolódó gombok csoportja: `role="group"` + `aria-label`

### Combobox (egyedi legördülő)

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

- `aria-expanded` JS-sel frissül nyitás/záráskor (`'true'` / `'false'`)
- Az opciók `role="option"`-t kapnak

### Toggle gombok

```html
<button id="music-repeat" aria-label="Toggle repeat" aria-pressed="false">
  <i class="fas fa-repeat" aria-hidden="true"></i>
</button>
```

- `aria-pressed` JS-sel frissül állapotváltáskor (`'true'` / `'false'`)

### Live régiók

```html
<!-- Állapot frissítések (nem sürgős) -->
<div role="status" aria-live="polite">Loading…</div>

<!-- Hibaüzenetek (azonnali felolvasás) -->
<div role="alert" aria-live="assertive">Error!</div>

<!-- Toast értesítések -->
<div id="cv-toaster-container" aria-live="polite" aria-label="Notifications"></div>

<!-- Lyrics panel -->
<div role="region" aria-label="Lyrics" aria-live="polite"></div>
```

---

## Lokalizáció: aria label kulcsok

Az aria labelek **lokalizáltak** — minden `aria-label` értéke `locale.t('ariaKulcs')`.

### Meglévő aria kulcsok (`scripts/locales/en.js`)

| Kulcs | Érték (EN) |
|-------|-----------|
| `ariaToggleTheme` | `"Toggle light/dark theme"` |
| `ariaOpenMusicPlayer` | `"Open music player"` |
| `ariaCloseMusicPlayer` | `"Close music player"` |
| `ariaBackToHub` | `"Back to CV hub"` |
| `ariaCloseDialog` | `"Close dialog"` |
| `ariaHireForm` | `"open contact form"` |
| `ariaCloseContactForm` | `"Close contact form"` |
| `ariaCloseBooking` | `"Close booking dialog"` |
| `ariaTrackPosition` | `"Track position"` |
| `ariaMusicVolume` | `"Music volume"` |
| `ariaPlayMusic` | `"Play music"` |
| `ariaPauseMusic` | `"Pause music"` |
| `ariaNextTrack` | `"Next track"` |
| `ariaPrevTrack` | `"Previous track"` |
| `ariaToggleRepeat` | `"Toggle repeat"` |
| `ariaShowLyrics` | `"Show lyrics"` |
| `ariaGenreSelect` | `"Music genre"` |
| `ariaBookSlot` | `"Book time slot"` |
| `ariaContactsPopup` | `"Contacts"` |
| `ariaSendMessage` | `"Send message"` |

### Új aria kulcs hozzáadásakor

1. Az `en.js`-be add hozzá az `aria` prefixű kulcsot a többi aria kulcs mellé
2. Add hozzá mind a 12 locale fájlba (lásd: [localization.md](localization.md))
3. A kódban `locale.t('ariaUjKulcs')` hívással használd

### JS-ben generált HTML esetén (shared.js stílusban)

```js
// NEM HELYES — hard-coded string, nem lokalizált
'<button aria-label="Open music player">'

// HELYES — locale-ból jön
'<button aria-label="' + locale.t('ariaOpenMusicPlayer') + '">'
```

### HTML fájlban (`data-i18n` nem működik aria-labelen)

```html
<!-- NEM MŰKÖDIK — data-i18n csak textContent-et frissít -->
<button data-i18n="ariaOpenMusicPlayer" aria-label="Open music player">

<!-- Helyes megoldás: JS-sel frissíteni localechange eseményen, vagy JS-ből injektálni -->
```

Ha egy HTML fájlban van aria-label és a szövege változhat nyelvváltáskor,
azt JS-ből kell frissíteni a `localechange` eseményre reagálva.

---

## Checklist új elem hozzáadásakor

- [ ] Icon-only gomb → `aria-label` + `aria-hidden="true"` az ikonon
- [ ] Dekoratív ikon → `aria-hidden="true"`
- [ ] Modál → `role="dialog"` + `aria-modal="true"` + `aria-labelledby`
- [ ] Form → `aria-label` + mezőknél `aria-required` + `aria-describedby` (hibára)
- [ ] Hibaüzenet span → `role="alert"` + `aria-live`
- [ ] Range input → `aria-label`
- [ ] Toggle gomb → `aria-pressed`
- [ ] Combobox → `role="combobox"` + `aria-haspopup` + `aria-expanded`
- [ ] Lista konténer → `role="list"` + `aria-label`
- [ ] Live régió → `role="status"/"alert"` + `aria-live`
- [ ] Új aria szöveg → lokalizált kulcs mind a 12 locale fájlban
