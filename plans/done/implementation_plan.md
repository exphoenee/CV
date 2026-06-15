# Implementation Plan: 2.5D Top-Down HTML5 Canvas Game CV View

This plan outlines the design and implementation of a custom **2.5D Top-Down Action RPG style game** using HTML5 Canvas as an interactive CV view. The player will control Viktor's retro character in a detailed 2.5D environment where different houses represent Viktor's career stations, education, and hobbies.

The game is built using a custom-made modular game engine, leveraging clean ES6 Classes where **every Game Object type resides in its own class file and inherits from a shared base `GameObject` class**.

Asset pack credit to **Kenmi-art**'s **Cute Fantasy RPG** (https://kenmi-art.itch.io/cute-fantasy-rpg), using files located in `assets/sprites/Cute/`.

---

## User Review Required

> [!IMPORTANT]
> **Custom Canvas Game Engine:** Instead of heavy Phaser 3 frameworks, this implementation uses a lightweight, highly optimized, vanilla HTML5 Canvas engine based on ES6 Modules. This allows absolute precision in satisfying the architectural requirements (such as every Game Object having its own class and file inheriting from a single `GameObject` class).
>
> **2.5D Depth Rendering (Y-Sorting):** All game objects (player, NPCs, enemies, houses, trees) are rendered using a dynamic **y-sorting** mechanism. Objects are drawn from top to bottom based on their bottom-most Y coordinate, producing a beautiful 2.5D depth illusion where the player can walk in front of or behind obstacles.
>
> **CV Houses & Freeze State:** Inside the world, specific houses stand for Viktor's career stations. Stepping into the doorways of these houses launches an elegant HTML/CSS retro dialogue box. While the dialogue box is active, the game remains visible but all objects (Player, NPCs, Enemies) are frozen. The dialogue box features three retro buttons: **Scroll Up**, **Scroll Down**, and **Exit**.

---

## Open Questions

1. **Map Size and Bounds:** Do we want a single large open-world map with all houses placed in a structured village, or a horizontally oriented scrollable village? (Recommended: A beautifully designed medium-sized village map defined in `map.js` that fits all 8 CV houses, trees, decorative fences, wandering animals, and skeletons).
2. **Skeleton Spawning & Respawning:** Skeletons die in 3 hits. Once they die, should they respawn after some time or remain dead until the game is reloaded? (Recommended: Respawns after 15 seconds to keep the game active, spawning away from the player).
3. **Responsive Game Canvas:** Should the canvas dynamically resize to fill the browser window while keeping a fixed internal pixel-art aspect ratio (pixel-perfect scaling)? (Recommended: Yes, rendering onto a virtual canvas of e.g. 640x360 and scaling it using CSS `image-rendering: pixelated` to fill the window beautifully).

---

## Proposed Changes

### 1. Map Configuration (`map.js`)

We will create a structured `map.js` module that stores:

- **Tiles definition:** Grid map utilizing tiles like Grass, Path, Water, and Cliff.
- **Collisions:** A coordinate collision grid where static decorations (fences, trees) and house walls prevent player/NPC/Enemy crossing.
- **Spawn Coordinates:** Start coordinates for the Player, NPCs, Enemies, and Buildings.

### 2. Base Game Engine & Main Loop

- **`cv-game.html` [NEW]**: The HTML shell for the game view. Imports the stylesheet and the ES6 module `main.js`. It contains the HTML modal for the CV Dialogue with Scroll Up, Scroll Down, and Exit buttons. It also displays a small credits note referencing the Kenmi-art Cute Fantasy RPG pack.
- **`styles/cv-game.css` [NEW]**: Neon-retro game styles, CRT scanline screen effects, responsive centering, and custom retro dialogue modal styles.
- **`scripts/game/main.js` [NEW]**: Orchestrates the main loop (`requestAnimationFrame`), input managers (WASD, Space), camera tracking, and y-sorting rendering.

### 3. Object-Oriented Class Hierarchy (Individual Files)

All classes are placed in `scripts/game/` and export clean ES6 classes.

- **`GameObject.js` [NEW]**: Base class for all world objects.
  - Fields: `x`, `y`, `width`, `height`, `sprite`, `solid`, `visible`.
  - Methods: `update(dt)`, `draw(ctx, camera)`, `getBounds()`.
- **`Player.js` [NEW]**: Extends `GameObject`. Handles WASD movement, Space-bar attack animations and hitboxes, taking damage, and direction states (Idle/Walk/Attack).
- **`Skeleton.js` [NEW]**: Extends `GameObject` (Enemy). Follows patrol routes, detects player proximity, triggers chasing logic, attacks player, takes damage, and dies in 3 hits.
- **`Npc.js` [NEW]**: Parent class for passive animals or a base for wandering logic.
- **`Chicken.js` [NEW]**: Extends `Npc`. Random wandering, passive behaviour.
- **`Cow.js` [NEW]**: Extends `Npc`. Random wandering, passive behaviour.
- **`Pig.js` [NEW]**: Extends `Npc`. Random wandering, passive behaviour.
- **`Sheep.js` [NEW]**: Extends `Npc`. Random wandering, passive behaviour.
- **`House.js` [NEW]**: Extends `GameObject`. Represents CV stations. Stores CV metadata and doorway detection area.
- **`Tree.js` [NEW]**: Extends `GameObject`. Collidable trunk, y-sorted leaves.
- **`Fence.js` [NEW]**: Extends `GameObject`. Collidable boundaries.
- **`Chest.js` [NEW]**: Extends `GameObject`. Static decoration or interactable chest.

---

## Verification Plan

### Automated Tests

- Run browser-based developer console checks for class script exports and texture loadings.
- Check and log frame rates (targeting smooth 60fps) and AABB collision times.

### Manual Verification

- **WASD controls:** Walk in 4 directions, verifying correct speed and collision alignment.
- **Space bar attack:** Verify player swings sword, hitting skeletons, causing flashing damage overlays.
- **Combat:** Strike Skeletons 3 times. Verify they play a death animation or fade out and drop out of the world.
- **NPC Wandering:** Watch Chickens, Cows, Pigs, and Sheep walk randomly, ensuring they collide with houses/walls correctly.
- **Skeleton Aggro:** Stand far from a Skeleton (idle). Step closer (aggro range). Verify it starts pursuing and attacking the player.
- **CV Stations (Houses):** Walk into a house door. Verify the game pauses, a retro modal pops up with 3 buttons. Test Scroll Up, Scroll Down, and Exit button mechanics. Verify the screen remains fully frozen while in dialogue.
- **Credits:** Check that the Kenmi-art asset pack URL is clearly credited on the game screen or bottom footer.
