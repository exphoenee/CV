# Game fejlesztői jegyzetek

> 🌐 **Nyelv:** [🇬🇧 English](game-dev-notes.md) · 🇭🇺 Magyar

## Tartalom

- [Architektúra áttekintés](#architekt%C3%BAra-%C3%A1ttekint%C3%A9s)
- [Új House (station) hozzáadása](#%C3%BAj-house-station-hozz%C3%A1ad%C3%A1sa)
- [Új entitás hozzáadása](#%C3%BAj-entit%C3%A1s-hozz%C3%A1ad%C3%A1sa)
- [BMP → tilemap pipeline](#bmp--tilemap-pipeline)
- [Collision box rendszer](#collision-box-rendszer)
- [Entitás spawn rendszer](#entit%C3%A1s-spawn-rendszer)
- [Dialogue rendszer](#dialogue-rendszer)
- [Térkép szerkesztése](#t%C3%A9rk%C3%A9p-szerkeszt%C3%A9se)

## Architektúra áttekintés

```
cv-game.html
  └── <script type="module" src="scripts/game/main.js">
        └── GameEngine osztály
              ├── map/map.js          — tile definíciók, BMP betöltő
              ├── map/renderMap.js    — bitmaszkos autotile renderelő
              ├── world/stations.js   — CV station-ök (házak) generálása CV_DATA-ból
              ├── world/spawns.js     — entitás spawn pozíciók
              ├── entities/base/GameObject.js  — ősosztály
              ├── entities/base/Npc.js         — NPC ősosztály
              ├── entities/base/DecorObject.js — dekoráció ősosztály
              ├── entities/player/Player.js
              ├── entities/enemies/Skeleton.js
              ├── entities/npcs/ (Chicken, Cow, Pig, Sheep)
              ├── entities/obstacles/ (Tree, SmallTree, Chest, House)
              ├── entities/decor/ (Flower, Mushroom, Log, stb.)
              └── mobile-input.js     — touch input (nipple.js)
```

### GameEngine életciklus

1. `init()` — BMP betöltése → tile grid → asset preload
2. `buildWorld()` — entitások példányosítása (player, house-ok, NPC-k, ellenségek, dekorációk)
3. Eseményfigyelők beállítása (dialogue, pause menü, hire modal, start screen, game over)
4. `loop(time)` — `requestAnimationFrame` ciklus: input → update → collision → render
5. Renderelési sorrend: tilemap → dekorációk → entitások (Y-alapú depth sort) → UI overlay

---

## Új House (station) hozzáadása

Egy House a játékban egy CV munkahelyet vagy szekciót képvisel. Minden House-hoz tartozik egy dialogue ablak a CV tartalommal.

### 1. CV_DATA bővítése

Ha az új munkahely még nincs a CV_DATA-ban, add hozzá a `workExperience[]` tömbhöz. A `game` mező opcionális — ha kihagyod, nem jelenik meg házként a játékban.

```js
{
  id: "ujceg",          // egyedi string azonosító
  company: "Új Cég Kft.",
  // ... többi mező ...
  game: {
    x: 600,             // X pozíció pixelben (játék világkoordináta)
    y: 500,             // Y pozíció pixelben
    tech: "React · Node.js · PostgreSQL",
    description: "Új Cég Kft. (2026)",
    highlights: [
      "Első highlight bullet a dialogue-ban.",
      "Második highlight."
    ]
  }
}
```

### 2. HOUSE_LABELS bővítése

A `scripts/game/entities/obstacles/House.js` fájlban add hozzá a `HOUSE_LABELS` maphez:

```js
const HOUSE_LABELS = {
  // ... meglévők ...
  ujceg: { shortLabel: 'Új Cég', period: '2026' },
};
```

A `shortLabel` jelenik meg a ház fölött lebegő névjegyben. A `period` az alatta lévő dátum.

### 3. Pozíció ellenőrzése

A `(x, y)` koordináta a játék világában pixelben értendő. A tilemap 32×32 pixeles tile-okból áll. Háznak olyan területet válassz, ahol a tilemap nem solid (pl. fű). Jelenleg használt pozíciók:

| Station               | X    | Y   |
| --------------------- | ---- | --- |
| welcome (Personal HQ) | 180  | 100 |
| webforsol             | 420  | 100 |
| cobotx                | 660  | 100 |
| cubicfox              | 900  | 100 |
| scolia                | 1140 | 100 |
| telekom               | 180  | 340 |
| aegex                 | 420  | 340 |
| education             | 780  | 340 |

---

## Új entitás hozzáadása

### 1. Osztály létrehozása

Entitás típusonként más ősosztályt használj:

- **Interaktív / fizikai objektum** → `GameObject` (`entities/base/GameObject.js`)
- **NPC (állat, karakter)** → `Npc` (`entities/base/Npc.js`)
- **Dekoráció** → `DecorObject` (`entities/base/DecorObject.js`)

Példa egy egyszerű új entitásra:

```js
// scripts/game/entities/obstacles/Pumpkin.js
import GameObject from '../base/GameObject.js';

export default class Pumpkin extends GameObject {
  constructor({ x, y }) {
    super({
      x,
      y,
      width: 32,
      height: 32,
      spriteWidth: 32,
      spriteHeight: 32,
      imageSrc: './assets/sprites/Cute/Outdoor decoration/Pumpkin.png',
      solid: true,
      collisionBox: {
        offsetX: 4,
        offsetY: 20,
        width: 24,
        height: 12,
      },
    });
  }
}
```

### 2. Entitás regisztrálása

1. **Import** a `main.js` fájlban:

```js
import Pumpkin from './entities/obstacles/Pumpkin.js';
```

2. **DECOR_CLASSES** map bővítése a `buildWorld()`-ban:

```js
const DECOR_CLASSES = {
  Tree,
  SmallTree,
  Chest,
  Flower,
  /* ... */ Pumpkin,
};
```

3. **Spawn** hozzáadása a `spawns.js`-ban:

```js
decorations: [
  // ...
  { type: 'Pumpkin', x: 500, y: 300 },
];
```

---

## BMP → tilemap pipeline

### Hogyan működik

1. A `scripts/game/map/map.bmp` fájl egy színes bitmap, ahol minden pixel egy tile-t reprezentál
2. `loadMapGridFromImage()` (`map.js:128`) betölti a BMP-t egy Canvas segítségével
3. Minden pixel RGB értékét egy tile típusra képezi le:

| Szín  | RGB       | Tile típus         | Solid? |
| ----- | --------- | ------------------ | ------ |
| Zöld  | `#00FF00` | `G` — Grass (fű)   | nem    |
| Sárga | `#FFFF00` | `P` — Path (út)    | nem    |
| Kék   | `#0000FF` | `W` — Water (víz)  | igen   |
| Piros | `#FF0000` | `C` — Cliff (domb) | igen   |

4. Az eredmény egy `mapGrid[][]` kétdimenziós tömb (karakterekkel)
5. `MapRenderer` bitmaszkos autotile-lal rendereli: minden tile megvizsgálja a 8 szomszédját, és egy 256-bejegyzésű lookup tábla alapján kiválasztja a megfelelő sprite kockát a tile sheet-ből

### Bitmaszk autotile

Az RPG Maker 2000/2003 algoritmust követi. Minden tile 8 bitben tárolja a szomszédviszonyokat:

```
Bit:   7   6   5   4   3   2   1   0
       NW  W   SW  S   SE  E   NE  N
```

A lookup tábla (`renderMap.js`) mind a 256 lehetséges maszkhoz hozzárendeli a tile sheet megfelelő kockáját. A diagonális bitek csak akkor aktívak, ha mindkét szomszédos kardinális bit is aktív.

### Tile sheet formátum

A sprite-ok 16×16 pixelesek, dupla skálán (32×32) rajzolódnak ki. A sheet elrendezése:

```
Sor 0: [cornerBR] [straightHT / edgeS] [cornerBL]
Sor 1: [straightVL / edgeE] [center] [straightVR / edgeW]
Sor 2: [cornerTR] [straightHB / edgeN] [cornerTL]
Sor 3: [innerBR] [innerBL] [—]
Sor 4: [innerTR] [innerTL] [—]
Sor 5: [deco]
```

### Térkép szerkesztése

Bármely pixelgrafikus szerkesztőben (Paint, GIMP, Aseprite) szerkeszthető. Fontos:

- A kép szélessége és magassága határozza meg a tile grid dimenzióit
- Csak a fenti 4 színt használd (a tilekeresés pontos RGB egyezést ellenőriz kis tűréssel)
- 1 pixel a BMP-ben = 1 tile a játékban (32×32 képernyőpixel)

---

## Collision box rendszer

Minden `GameObject` rendelkezik egy `collisionBox`-szal, amely a sprite-on belül definiálja a fizikai ütközési területet.

```js
collisionBox: {
  offsetX: 15,   // eltolás a sprite bal felső sarkától
  offsetY: 58,   // eltolás a sprite bal felső sarkától
  width: 65,     // szélesség pixelben
  height: 55,    // magasság pixelben
}
```

- Ha nincs megadva, a teljes sprite méretet használja (`width × height`)
- A `solid: true` entitások ütköznek a playerrel és egymással
- Az ütközés AABB (tengelyirányú téglalap) alapú
- Dekorációk (`solid: false`) nem blokkolják a mozgást

### Tippek collisionBox beállításhoz

- Házaknál az ajtó alatti részt érdemes solid-nak hagyni, a tetőt nem
- Fák esetén a törzs alsó 1/3-a elég
- NPC-knél a sprite magasság ~60%-a, középre igazítva

---

## Entitás spawn rendszer

A `scripts/game/world/spawns.js` exportálja az `ENTITY_SPAWNS` objektumot. Ez tartalmazza az összes entitás kezdőpozícióját.

```js
export const ENTITY_SPAWNS = {
  player: { x: 100, y: 240 },
  npcs: [
    { type: 'Chicken', x: 260, y: 250 },
    // ...
  ],
  enemies: [
    { type: 'Skeleton', x: 600, y: 250 },
    // ...
  ],
  decorations: [
    { type: 'Tree', x: 70, y: 100 },
    { type: 'Chest', x: 130, y: 210 },
    // ...
  ],
};
```

A `buildWorld()` (`main.js:293`) szerint:

- `decorations` → `DECOR_CLASSES` map alapján példányosítva (`solid` esetén `obstacles[]`, különben `decorations[]`)
- `npcs` → típus szerinti switch (Chicken, Cow, Pig, Sheep) → `npcs[]`
- `enemies` → mind `Skeleton` → `enemies[]`
- `CV_STATIONS` → `House` → `obstacles[]`

Az összes entitás a `rebuildGameObjectList()`-ben kerül egyesítésre a render listába.

---

## Dialogue rendszer

Amikor a player a House ajtajához lép (door trigger terület), a játék megjeleníti a CV tartalmat egy glassmorphic overlay ablakban.

- House-k méretének és ajtajának koordinátái a `House.js:15-48`-ban:
  - House: 96×128 pixel
  - Door trigger: `doorOffsetX: 36, doorOffsetY: 110, doorWidth: 24, doorHeight: 20`
  - A trigger terület a ház aljánál, az ajtó előtt van
- `checkDoorTrigger(player)` AABB alapú overlapping vizsgálat
- `setupDialogueListeners()` a `main.js`-ben kezeli az E/Enter billentyűt
- A dialogue UI a `scripts/game/main.js` `showStationContent()` és `hideStationContent()` metódusaiban
- A játék lefagy (`this.isFrozen = true`) amíg a dialogue nyitva van

### Layout mezők a dialogue-ban

A `stations.js` `generateExpContent()` függvény állítja elő a HTML tartalmat a CV_DATA alapján. A tartalom lehet:

- Projektek listája (bullets)
- Készségek
- Referencia linkek
- Game-specifikus highlight bullet-ok (exp.game.highlights)
