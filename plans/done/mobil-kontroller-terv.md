# Mobil touch kontroller implementációs terv

## Áttekintés

A játék mobil eszközökön is játszhatóvá tétele on-screen touch kontrollerekkel. Meglévő Canvas 2D renderelés, nincs framework (nem Phaser).

## Felhasznált technológiák

- **NippleJS** (CDN) – virtuális joystick
  `https://cdn.jsdelivr.net/npm/nipplejs@1.0.3/dist/index.js`
- Saját eszközdetekció (touch support detection)
- Meglévő billentyűzet-input rendszer (`this.keys`)

---

## 1. Eszközdetekció

Fájl: `scripts/game/mobile-input.js`

```js
export function isTouchDevice() {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(hover: none) and (pointer: coarse)').matches
  );
}
```

A `cv-game.html` betöltésekor fut. Eldönti, hogy a mobil vagy desktop nézet jelenjen meg.

---

## 2. HTML változtatások

Fájl: `cv-game.html`

### Mobil touch kontrollerek

A `#game-wrapper`-on belül, a `</canvas>` után:

```html
<div id="mobile-controls" class="mobile-hidden">
  <div id="joystick-zone"></div>
  <button id="attack-btn">
    <img src="./assets/sprites/Cute/sword.png" alt="Attack">
  </button>
</div>
```

### Info gomb (mobil, jobb felső)

```html
<button id="info-btn" class="mobile-hidden" aria-label="Info">ⓘ</button>
```

### Credits modal (mobil, info gombra nyílik)

```html
<div id="credits-modal" class="mobile-hidden">
  <div class="credits-modal-backdrop"></div>
  <div class="credits-modal-box">
    <div class="credits-modal-header">
      <span>About this game</span>
      <button id="credits-close">✕</button>
    </div>
    <div class="credits-modal-body">
      <p>Assets by <a href="https://kenmi-art.itch.io/cute-fantasy-rpg" target="_blank">Kenmi-art</a> (Cute Fantasy RPG pack)</p>
      <p>Virtual joystick: <a href="https://yoannmoi.net/nipplejs/" target="_blank">NippleJS</a></p>
    </div>
  </div>
</div>
```

### Desktop tech dobozok

A `#game-wrapper`-on belül, a legend-panel mellett/mellett:

```html
<div class="tech-boxes desktop-only">
  <a href="https://yoannmoi.net/nipplejs/" target="_blank" class="tech-box">
    <span class="tech-label">NippleJS</span>
    <span class="tech-desc">Virtual Joystick</span>
  </a>
  <div class="tech-box">
    <span class="tech-label">Assets</span>
    <span class="tech-desc">Kenmi-art Cute RPG</span>
  </div>
</div>
```

A `desktop-only` osztályt a CSS és a JS együtt kezeli.

---

## 3. CSS

Fájl: `styles/cv-game.css`

```css
/* --- Mobile touch controls --- */
#mobile-controls {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 6;
}
#mobile-controls.mobile-visible {
  pointer-events: auto;
}
#joystick-zone {
  position: absolute;
  left: 5%;
  bottom: 5%;
  width: min(25vw, 40vh);
  aspect-ratio: 1;
}
#attack-btn {
  position: absolute;
  right: 8%;
  bottom: 8%;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: rgba(255, 112, 36, 0.2);
  border: 2px solid var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: none;
}
#attack-btn img {
  width: 60%;
  height: 60%;
  object-fit: contain;
  image-rendering: pixelated;
  pointer-events: none;
}
#attack-btn:active {
  transform: scale(0.9);
  background: rgba(255, 112, 36, 0.5);
}

/* --- Info button (mobile, top-right) --- */
#info-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  color: var(--accent);
  font-size: 18px;
  cursor: pointer;
  z-index: 7;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
}
#info-btn:active {
  transform: scale(0.9);
}

/* --- Credits modal (mobile) --- */
#credits-modal {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
}
#credits-modal.mobile-visible {
  opacity: 1;
  pointer-events: auto;
}
#credits-modal:not(.mobile-visible) {
  opacity: 0;
  pointer-events: none;
}
.credits-modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}
.credits-modal-box {
  position: relative;
  background: var(--glass-bg);
  border: 2px solid var(--accent);
  border-radius: 12px;
  padding: 24px;
  max-width: 320px;
  width: 85%;
  box-shadow: 0 0 30px var(--accent-glow);
  z-index: 41;
}
.credits-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-pixel);
  font-size: 10px;
  color: var(--accent);
  margin-bottom: 16px;
}
#credits-close {
  background: none;
  border: 1px solid var(--accent);
  color: var(--accent);
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.credits-modal-body {
  font-size: 13px;
  line-height: 1.8;
  color: #cbd5e1;
}
.credits-modal-body a {
  color: var(--accent);
  text-decoration: none;
  font-weight: 700;
}
.credits-modal-body a:hover {
  text-decoration: underline;
}
.credits-modal-body p {
  margin: 8px 0;
}

/* --- Desktop tech boxes --- */
.tech-boxes {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 5;
}
.tech-box {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(10px);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 10px;
  text-align: center;
  color: #94a3b8;
  text-decoration: none;
  transition: all 0.15s ease;
  cursor: default;
  pointer-events: auto;
}
.tech-box a,
.tech-box[href] {
  cursor: pointer;
}
.tech-box:hover {
  border-color: var(--accent);
  color: #fff;
}
.tech-label {
  display: block;
  font-family: var(--font-pixel);
  font-size: 8px;
  color: var(--accent);
  margin-bottom: 2px;
}
.tech-desc {
  display: block;
  font-size: 9px;
  color: #94a3b8;
}

/* --- Desktop/mobile visibility --- */
.desktop-only { display: none; }
.mobile-hidden { display: none; }

@media (hover: hover) and (pointer: fine) {
  .desktop-only { display: flex; }
  .mobile-hidden { display: none !important; }
}
@media (hover: none) and (pointer: coarse) {
  .desktop-only { display: none !important; }
  #mobile-controls.mobile-visible,
  #info-btn.mobile-visible,
  #credits-modal.mobile-visible { display: flex; }
}
```

### Joystick méretezés

- **Képernyő szélesség 20-25%-a**
- **Képernyő magasság 35-40%-a**
- `aspect-ratio: 1` biztosítja a kör alakot
- Attack gomb: 70px fix, jobb alsó sarok

---

## 4. JavaScript – NippleJS joystick

Fájl: `scripts/game/mobile-input.js`

```js
import nipplejs from 'https://cdn.jsdelivr.net/npm/nipplejs@1.0.3';

export function isTouchDevice() {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(hover: none) and (pointer: coarse)').matches
  );
}

export function initMobileInput(game) {
  if (!isTouchDevice()) return;

  // Mobil UI elemek megjelenítése
  document.getElementById('mobile-controls')?.classList.add('mobile-visible');
  document.getElementById('info-btn')?.classList.add('mobile-visible');

  // Joystick
  const zone = document.getElementById('joystick-zone');
  const size = Math.min(zone.offsetWidth, zone.offsetHeight);

  const joystick = nipplejs.create({
    zone,
    mode: 'static',
    position: { left: '50%', top: '50%' },
    color: 'rgba(255, 112, 36, 0.6)',
    size,
    numberOfDirections: 8,
    lockY: false,
  });

  const DIR_MAP = {
    0:   { w: false, a: false, s: false, d: false },
    45:  { w: true,  a: false, s: false, d: true  },
    90:  { w: true,  a: false, s: false, d: false },
    135: { w: true,  a: true,  s: false, d: false },
    180: { w: false, a: true,  s: false, d: false },
    225: { w: false, a: true,  s: true,  d: false },
    270: { w: false, a: false, s: true,  d: false },
    315: { w: false, a: false, s: true,  d: true  },
  };

  const angleToDir = (angle) => {
    const deg = angle.degree;
    const snapped = Math.round(deg / 45) * 45;
    return DIR_MAP[snapped] || DIR_MAP[0];
  };

  joystick.on('move', (evt, data) => {
    if (!data.angle) return;
    const dir = angleToDir(data.angle);
    Object.entries(dir).forEach(([key, val]) => { game.keys[key] = val; });
  });

  joystick.on('end', () => {
    ['w','a','s','d'].forEach(k => { game.keys[k] = false; });
  });

  // Attack gomb
  const btn = document.getElementById('attack-btn');
  if (btn) {
    btn.addEventListener('touchstart', e => { e.preventDefault(); game.keys[' '] = true; });
    btn.addEventListener('touchend',   e => { e.preventDefault(); game.keys[' '] = false; });
    btn.addEventListener('touchcancel', e => { game.keys[' '] = false; });
  }

  // Info gomb → credits modal
  const infoBtn = document.getElementById('info-btn');
  const modal = document.getElementById('credits-modal');
  const closeBtn = document.getElementById('credits-close');
  const backdrop = modal?.querySelector('.credits-modal-backdrop');

  const openModal = () => modal?.classList.add('mobile-visible');
  const closeModal = () => modal?.classList.remove('mobile-visible');

  infoBtn?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);
}
```

---

## 5. Input flow

```
Touch joystick mozgatás
  → NippleJS 'move' event (8 irány)
  → angleToDir() → irány kvantálás 45°-ként
  → game.keys['w/a/s/d'] beállítva
  → Player.update() meglévő billentyűzet logika

Attack gomb érintés
  → touchstart → game.keys[' '] = true
  → touchend   → game.keys[' '] = false
  → Player.update() Space-t detektál → performAttack()
```

---

## 6. Integráció

Fájl: `scripts/game/main.js`

```js
import { initMobileInput, isTouchDevice } from './mobile-input.js';

// A konstruktor végén:
this.isTouch = isTouchDevice();

// Az init() végén, a loop indítása után:
initMobileInput(this);
```

A Controls legend panel mobilon CSS-sel rejtve (`@media (hover: none)`).

---

## 7. sword.png

A támadógomb ikonja. Útvonal: `./assets/sprites/Cute/sword.png`
A képfájlt a felhasználó később adja meg.

---

## Változtatandó fájlok összefoglaló

| Fájl | Művelet |
|---|---|
| `cv-game.html` | `#mobile-controls`, `#info-btn`, `#credits-modal`, `.tech-boxes` hozzáadása |
| `styles/cv-game.css` | Mobil kontrollerek, info gomb, credits modal, tech boxes CSS |
| `scripts/game/mobile-input.js` | **Új fájl** – NippleJS, eszközdetekció, touch események |
| `scripts/game/main.js` | Import + `initMobileInput()` hívás |
