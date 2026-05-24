# Mobil touch kontroller implementációs terv

## Áttekintés

A játék mobil eszközökön is játszhatóvá tétele on-screen touch kontrollerekkel. Meglévő Canvas 2D renderelés, nincs framework (nem Phaser).

## Felhasznált technológiák

- **NippleJS** (CDN) – virtuális joystick
  `https://cdn.jsdelivr.net/npm/nipplejs@1.0.1`
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

A `cv-game.html` betöltésekor fut. Eldönti, hogy megjelenjenek-e a touch kontrollerek.

---

## 2. HTML változtatások

Fájl: `cv-game.html`

A `#game-wrapper`-on belül, a `</canvas>` után:

```html
<div id="mobile-controls" class="mobile-hidden">
  <div id="joystick-zone"></div>
  <button id="attack-btn">
    <img src="./assets/sprites/Cute/sword.png" alt="Attack">
  </button>
</div>
```

A `mobile-hidden` alapértelmezett, a JS `isTouchDevice()` alapján cseréli `mobile-visible`-re.

---

## 3. CSS

Fájl: `styles/cv-game.css`

```css
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
  width: 25%;
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
}
#attack-btn:active {
  transform: scale(0.9);
  background: rgba(255, 112, 36, 0.5);
}

@media (hover: hover) and (pointer: fine) {
  #mobile-controls { display: none; }
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
import nipplejs from 'https://cdn.jsdelivr.net/npm/nipplejs@1.0.1';

export function initMobileInput(game) {
  if (!isTouchDevice()) return;

  document.getElementById('mobile-controls').classList.add('mobile-visible');

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
    const dir = angleToDir(data.angle);
    Object.entries(dir).forEach(([key, val]) => { game.keys[key] = val; });
  });

  joystick.on('end', () => {
    ['w','a','s','d'].forEach(k => { game.keys[k] = false; });
  });

  const btn = document.getElementById('attack-btn');
  btn.addEventListener('touchstart', e => { e.preventDefault(); game.keys[' '] = true; });
  btn.addEventListener('touchend',   e => { e.preventDefault(); game.keys[' '] = false; });
  btn.addEventListener('touchcancel', e => { game.keys[' '] = false; });
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

// Legend panel elrejtése touch eszközön:
if (this.isTouch) {
  document.querySelector('.legend-panel')?.classList.add('mobile-hidden');
}
```

---

## 7. sword.png

A támadógomb ikonja. Útvonal: `./assets/sprites/Cute/sword.png`
A képfájlt a felhasználó később adja meg.

---

## Változtatandó fájlok összefoglaló

| Fájl | Művelet |
|---|---|
| `cv-game.html` | `#mobile-controls` réteg hozzáadása |
| `styles/cv-game.css` | Mobil kontrollerek CSS, media query |
| `scripts/game/mobile-input.js` | **Új fájl** |
| `scripts/game/main.js` | Import + integráció |
