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

  // Convex corners
  cornerBR: {x: 0, y: 0},
  cornerBL: {x: 16, y: 0},
  cornerTR: {x: 0, y: 32},
  cornerTL: {x: 32, y: 32},

  // Centers (middle of 3x3 block)
  // The sheet arranges tiles in 3x3 blocks: [corner, edge, corner] / [edge, center, edge] / [corner, edge, corner]
  center: {x: 16, y: 16},

  // Concave / inner corners
  innerBR: {x: 0, y: 48},
  innerBL: {x: 16, y: 48},
  innerTR: {x: 0, y: 64},
  innerTL: {x: 16, y: 64},

  // Edges (single-direction ends)
  edgeN: {x: 0, y: 16},
  edgeS: {x: 32, y: 16},
  edgeE: {x: 32, y: 0},
  edgeW: {x: 16, y: 32},

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

      const paddingX = Math.floor(width / 2);
      const paddingY = Math.floor(height / 2);
      const mapWidth = width + paddingX * 2;
      const mapHeight = height + paddingY * 2;

      resolve({
        mapGrid,
        fullMapGrid: _buildFullGrid(mapGrid, mapWidth, mapHeight, paddingY, paddingX),
        cols: mapWidth,
        rows: mapHeight,
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

function _buildFullGrid(mapGrid, fullWidth, fullHeight, offsetRow, offsetCol) {
  const full = [];
  for (let r = 0; r < fullHeight; r++) {
    full.push(new Array(fullWidth).fill("G"));
  }
  for (let r = 0; r < mapGrid.length; r++) {
    for (let c = 0; c < mapGrid[0].length; c++) {
      full[r + offsetRow][c + offsetCol] = mapGrid[r][c];
    }
  }
  return full;
}
