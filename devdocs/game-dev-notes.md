# Game developer notes

> 🌐 **Language:** 🇬🇧 English · [🇭🇺 Magyar](game-dev-notes-hu.md)

## Contents

- [Architecture overview](#architecture-overview)
- [Adding a new House (station)](#adding-a-new-house-station)
- [Adding a new entity](#adding-a-new-entity)
- [BMP → tilemap pipeline](#bmp--tilemap-pipeline)
- [Collision box system](#collision-box-system)
- [Entity spawn system](#entity-spawn-system)
- [Dialogue system](#dialogue-system)
- [Editing the map](#editing-the-map)

## Architecture overview

```
cv-game.html
  └── <script type="module" src="scripts/game/main.js">
        └── GameEngine class
              ├── map/map.js          — tile definitions, BMP loader
              ├── map/renderMap.js    — bitmask autotile renderer
              ├── world/stations.js   — CV stations (houses) generated from CV_DATA
              ├── world/spawns.js     — entity spawn positions
              ├── entities/base/GameObject.js  — base class
              ├── entities/base/Npc.js         — NPC base class
              ├── entities/base/DecorObject.js — decoration base class
              ├── entities/player/Player.js
              ├── entities/enemies/Skeleton.js
              ├── entities/npcs/ (Chicken, Cow, Pig, Sheep)
              ├── entities/obstacles/ (Tree, SmallTree, Chest, House)
              ├── entities/decor/ (Flower, Mushroom, Log, etc.)
              └── mobile-input.js     — touch input (nipple.js)
```

### GameEngine lifecycle

1. `init()` — load BMP → tile grid → asset preload
2. `buildWorld()` — instantiate entities (player, houses, NPCs, enemies, decorations)
3. Set up event listeners (dialogue, pause menu, hire modal, start screen, game over)
4. `loop(time)` — `requestAnimationFrame` cycle: input → update → collision → render
5. Render order: tilemap → decorations → entities (Y-based depth sort) → UI overlay

---

## Adding a new House (station)

A House in the game represents a CV job or section. Each House has a dialogue window with the CV content.

### 1. Extend CV_DATA

If the new job is not yet in CV_DATA, add it to the `workExperience[]` array. The `game` field is optional — if you omit it, it does not appear as a house in the game.

```js
{
  id: "newco",          // unique string identifier
  company: "New Co Ltd.",
  // ... other fields ...
  game: {
    x: 600,             // X position in pixels (game world coordinate)
    y: 500,             // Y position in pixels
    tech: "React · Node.js · PostgreSQL",
    description: "New Co Ltd. (2026)",
    highlights: [
      "First highlight bullet in the dialogue.",
      "Second highlight."
    ]
  }
}
```

### 2. Extend HOUSE_LABELS

In `scripts/game/entities/obstacles/House.js`, add to the `HOUSE_LABELS` map:

```js
const HOUSE_LABELS = {
  // ... existing ...
  newco: { shortLabel: 'New Co', period: '2026' },
};
```

The `shortLabel` appears in the nameplate floating above the house. The `period` is the date below it.

### 3. Check the position

The `(x, y)` coordinate is in pixels in the game world. The tilemap is made of 32×32-pixel tiles. Choose an area for a house where the tilemap is not solid (e.g. grass). Currently used positions:

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

## Adding a new entity

### 1. Create the class

Use a different base class depending on the entity type:

- **Interactive / physical object** → `GameObject` (`entities/base/GameObject.js`)
- **NPC (animal, character)** → `Npc` (`entities/base/Npc.js`)
- **Decoration** → `DecorObject` (`entities/base/DecorObject.js`)

Example of a simple new entity:

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

### 2. Register the entity

1. **Import** in `main.js`:

```js
import Pumpkin from './entities/obstacles/Pumpkin.js';
```

2. **Extend the DECOR_CLASSES** map in `buildWorld()`:

```js
const DECOR_CLASSES = {
  Tree,
  SmallTree,
  Chest,
  Flower,
  /* ... */ Pumpkin,
};
```

3. **Add a spawn** in `spawns.js`:

```js
decorations: [
  // ...
  { type: 'Pumpkin', x: 500, y: 300 },
];
```

---

## BMP → tilemap pipeline

### How it works

1. The `scripts/game/map/map.bmp` file is a color bitmap where each pixel represents a tile
2. `loadMapGridFromImage()` (`map.js:128`) loads the BMP using a Canvas
3. It maps each pixel's RGB value to a tile type:

| Color  | RGB       | Tile type          | Solid? |
| ------ | --------- | ------------------ | ------ |
| Green  | `#00FF00` | `G` — Grass        | no     |
| Yellow | `#FFFF00` | `P` — Path         | no     |
| Blue   | `#0000FF` | `W` — Water        | yes    |
| Red    | `#FF0000` | `C` — Cliff        | yes    |

4. The result is a `mapGrid[][]` two-dimensional array (of characters)
5. `MapRenderer` renders with bitmask autotiling: each tile examines its 8 neighbors and, based on a 256-entry lookup table, selects the appropriate sprite cell from the tile sheet

### Bitmask autotile

It follows the RPG Maker 2000/2003 algorithm. Each tile stores its neighbor relations in 8 bits:

```
Bit:   7   6   5   4   3   2   1   0
       NW  W   SW  S   SE  E   NE  N
```

The lookup table (`renderMap.js`) assigns the appropriate cell of the tile sheet to each of the 256 possible masks. The diagonal bits are only active if both adjacent cardinal bits are also active.

### Tile sheet format

The sprites are 16×16 pixels and are drawn at double scale (32×32). The sheet layout:

```
Row 0: [cornerBR] [straightHT / edgeS] [cornerBL]
Row 1: [straightVL / edgeE] [center] [straightVR / edgeW]
Row 2: [cornerTR] [straightHB / edgeN] [cornerTL]
Row 3: [innerBR] [innerBL] [—]
Row 4: [innerTR] [innerTL] [—]
Row 5: [deco]
```

### Editing the map

It can be edited in any pixel-graphics editor (Paint, GIMP, Aseprite). Important:

- The image's width and height determine the dimensions of the tile grid
- Use only the 4 colors above (the tile lookup checks for an exact RGB match with a small tolerance)
- 1 pixel in the BMP = 1 tile in the game (32×32 screen pixels)

---

## Collision box system

Every `GameObject` has a `collisionBox` that defines the physical collision area within the sprite.

```js
collisionBox: {
  offsetX: 15,   // offset from the sprite's top-left corner
  offsetY: 58,   // offset from the sprite's top-left corner
  width: 65,     // width in pixels
  height: 55,    // height in pixels
}
```

- If not specified, it uses the full sprite size (`width × height`)
- `solid: true` entities collide with the player and with each other
- Collision is AABB (axis-aligned bounding box) based
- Decorations (`solid: false`) do not block movement

### Tips for setting collisionBox

- For houses, it's worth keeping the part below the door solid, but not the roof
- For trees, the bottom 1/3 of the trunk is enough
- For NPCs, about 60% of the sprite height, centered

---

## Entity spawn system

`scripts/game/world/spawns.js` exports the `ENTITY_SPAWNS` object. It holds the starting position of every entity.

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

According to `buildWorld()` (`main.js:293`):

- `decorations` → instantiated based on the `DECOR_CLASSES` map (into `obstacles[]` if `solid`, otherwise `decorations[]`)
- `npcs` → switch by type (Chicken, Cow, Pig, Sheep) → `npcs[]`
- `enemies` → all `Skeleton` → `enemies[]`
- `CV_STATIONS` → `House` → `obstacles[]`

All entities are merged into the render list in `rebuildGameObjectList()`.

---

## Dialogue system

When the player steps up to a House's door (door trigger area), the game shows the CV content in a glassmorphic overlay window.

- The size and door coordinates of Houses are in `House.js:15-48`:
  - House: 96×128 pixels
  - Door trigger: `doorOffsetX: 36, doorOffsetY: 110, doorWidth: 24, doorHeight: 20`
  - The trigger area is at the bottom of the house, in front of the door
- `checkDoorTrigger(player)` is an AABB-based overlap check
- `setupDialogueListeners()` in `main.js` handles the E/Enter key
- The dialogue UI is in the `showStationContent()` and `hideStationContent()` methods of `scripts/game/main.js`
- The game freezes (`this.isFrozen = true`) while the dialogue is open

### Layout fields in the dialogue

The `generateExpContent()` function in `stations.js` produces the HTML content based on CV_DATA. The content can be:

- A list of projects (bullets)
- Skills
- Reference links
- Game-specific highlight bullets (exp.game.highlights)
