/**
 * map.js
 * Map configuration and BMP-based grid loader.
 *
 * Térképkép szín-kódolás (RGB értékek Paint-ben):
 *   Fű  (Grass / G) = Zöld   #00FF00  R:0,   G:255, B:0
 *   Út  (Path  / P) = Sárga  #FFFF00  R:255, G:255, B:0
 *   Víz (Water / W) = Kék    #0000FF  R:0,   G:0,   B:255
 *   Domb(Hill  / C) = Piros  #FF0000  R:255, G:0,   B:0
 */

// ── PHASE 3: Terrain enum ────────────────────────────────────────────
// Numeric terrain types for fast bitmask operations and cache-friendly lookup.
export const Terrain = {
  GRASS: 0,
  WATER: 1,
  PATH: 2,
  CLIFF: 3,
};

/** Map tile-key characters to Terrain enum values */
export function tileKeyToTerrain(key) {
  switch (key) {
    case "G": return Terrain.GRASS;
    case "W": return Terrain.WATER;
    case "P": return Terrain.PATH;
    case "C": return Terrain.CLIFF;
    default: return Terrain.GRASS;
  }
}

/** Map Terrain enum back to tile key character */
export function terrainToTileKey(t) {
  switch (t) {
    case Terrain.GRASS: return "G";
    case Terrain.WATER: return "W";
    case Terrain.PATH: return "P";
    case Terrain.CLIFF: return "C";
    default: return "G";
  }
}

export const TILE_SHEET_TILE_SIZE = 16; // Source sprite tiles are 16x16
export const TILE_SIZE = 32; // Draw tiles at 32x32 (double pixel scale)

export const TILE_TYPES = {
  G: {
    src: "./assets/sprites/Cute/Tiles/Grass_Middle.png",
    solid: false,
    sheet: false,
  },
  P: {
    src: "./assets/sprites/Cute/Tiles/Path_Tile.png",
    solid: false,
    sheet: true,
    type: "path",
  },
  W: {
    src: "./assets/sprites/Cute/Tiles/Water_Tile.png",
    solid: true,
    sheet: true,
    type: "water",
  },
  C: {
    src: "./assets/sprites/Cute/Tiles/Cliff_Tile.png",
    solid: true,
    sheet: true,
    type: "cliff",
  },
};

export const SHEET_TILE_FRAMES = {
  // Primary connectors
  // Horizontal straights: top (HT) and bottom (HB)
  straightHT: {x: 16, y: 0}, // horizontal, top-row block
  straightHB: {x: 16, y: 32}, // horizontal, bottom-row block
  // Backwards-compatible aliases
  straightH: {x: 16, y: 0},

  // Vertical straights: left (VL) and right (VR)
  straightVL: {x: 0, y: 16}, // vertical, left col in middle block
  straightVR: {x: 32, y: 16}, // vertical, right col in middle block
  // Backwards-compatible alias
  straightV: {x: 0, y: 16},

  // Convex outer corners
  // The sheet arranges convex corners in a 3x3 block:
  // Row 0: [cornerBR] [straightHT / bottom-edge] [cornerBL]
  // Row 1: [straightVL / right-edge] [center] [straightVR / left-edge]
  // Row 2: [cornerTR] [straightHB / top-edge] [cornerTL]
  cornerBR: {x: 0, y: 0},      // R0C0 — path goes S+E (grass at TL)
  cornerBL: {x: 32, y: 0},     // R0C2 — path goes S+W (grass at TR) [WAS WRONG: {16,0}=straightHT]
  cornerTR: {x: 0, y: 32},     // R2C0 — path goes N+E (grass at BL)
  cornerTL: {x: 32, y: 32},    // R2C2 — path goes N+W (grass at BR)

  // Centers (middle of 3x3 block)
  center: {x: 16, y: 16},     // R1C1 — all 4 neighbors are same type

  // Concave / inner corners (rows 3-4 of the sheet)
  innerBR: {x: 0, y: 48},     // R3C0 — grass at bottom-right (path everywhere else)
  innerBL: {x: 16, y: 48},    // R3C1 — grass at bottom-left
  innerTR: {x: 0, y: 64},     // R4C0 — grass at top-right
  innerTL: {x: 16, y: 64},    // R4C1 — grass at top-left

  // Edges (single-direction dead-ends)
  // edgeN  → path goes NORTH  → shows path at TOP, grass at BOTTOM  = R2C1 = straightHB
  // edgeS  → path goes SOUTH  → shows path at BOTTOM, grass at TOP  = R0C1 = straightHT
  // edgeE  → path goes EAST   → shows path at RIGHT, grass at LEFT  = R1C0 = straightVL
  // edgeW  → path goes WEST   → shows path at LEFT,  grass at RIGHT = R1C2 = straightVR
  edgeN: {x: 16, y: 32},      // R2C1 = straightHB [WAS WRONG: {0,16}=straightVL/right-edge]
  edgeS: {x: 16, y: 0},       // R0C1 = straightHT [WAS WRONG: {32,16}=straightVR/left-edge]
  edgeE: {x: 0, y: 16},       // R1C0 = straightVL [WAS WRONG: {32,0}=cornerBL]
  edgeW: {x: 32, y: 16},      // R1C2 = straightVR [WAS WRONG: {16,32}=straightHB/top-edge]

  // Small decorative overlays (bottom row)
  deco1: {x: 0, y: 80},
  deco2: {x: 16, y: 80},
  deco3: {x: 32, y: 80},
};

export const MAP_IMAGE_SRC = "./scripts/game/map/map.bmp";

/**
 * Load and parse a map image into a tile grid.
 * Each pixel maps to one tile via its dominant color channel.
 * Returns an object with mapGrid, fullMapGrid and dimension info.
 */
export function loadMapGridFromImage(imageSrc) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const {data, width, height} = ctx.getImageData(0, 0, img.width, img.height);

      const mapGrid = [];
      for (let row = 0; row < height; row++) {
        const rowArr = [];
        for (let col = 0; col < width; col++) {
          const i = (row * width + col) * 4;
          rowArr.push(_pixelToTileKey(data[i], data[i + 1], data[i + 2]));
        }
        mapGrid.push(rowArr);
      }

      resolve({
        mapGrid,
        fullMapGrid: mapGrid,
        cols: width,
        rows: height,
      });
    };
    img.onerror = () => reject(new Error(`Nem sikerült betölteni a térképképet: ${imageSrc}`));
    img.src = imageSrc;
  });
}

function _pixelToTileKey(r, g, b) {
  if (g > 150 && r < 100 && b < 100) return "G"; // Zöld  = Fű
  if (r > 150 && g > 150 && b < 100) return "P"; // Sárga = Út
  if (b > 150 && r < 100 && g < 100) return "W"; // Kék   = Víz
  if (r > 150 && g < 100 && b < 100) return "C"; // Piros = Domb
  return "G"; // Alapértelmezett: Fű
}

