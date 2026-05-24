/**
 * renderMap.js
 * Tile map rendering logic: 8-bit bitmask autotile with 256-entry lookup table.
 *
 * Architecture:
 *   BMP → terrain grid → 8-bit mask → lookup table → sprite frame → render
 *
 * The 8-bit mask encodes all 8 neighbors (N, NE, E, SE, S, SW, W, NW)
 * with effective diagonals (diagonal bit is 1 only when BOTH adjacent
 * cardinals are the same type). This mirrors the standard RPG Maker
 * 2000/2003 autotile algorithm.
 *
 * The 256-entry lookup table maps every possible mask to one of the
 * frames in the 3×6 tile sheet (48×96 px, 16×16 tiles):
 *
 *   Row 0: [cornerBR] [straightHT / bottom-edge] [cornerBL]
 *   Row 1: [straightVL / right-edge] [center] [straightVR / left-edge]
 *   Row 2: [cornerTR] [straightHB / top-edge] [cornerTL]
 *   Row 3: [innerBR] [innerBL] [—]
 *   Row 4: [innerTR] [innerTL] [—]
 *   Row 5: [deco]
 *
 * Inner corners (rows 3-4) are selected when a tile has all 4 cardinal
 * neighbors but exactly 1 effective diagonal is missing — this means
 * the tile is at a concave corner where grass intrudes into the path.
 */

import {SHEET_TILE_FRAMES} from "./map.js";

// ── Bitmask bit positions ──────────────────────────────────────────────
const B = {
  N:  1 << 0,  // 1
  NE: 1 << 1,  // 2
  E:  1 << 2,  // 4
  SE: 1 << 3,  // 8
  S:  1 << 4,  // 16
  SW: 1 << 5,  // 32
  W:  1 << 6,  // 64
  NW: 1 << 7,  // 128
};

// ── Build the 256-entry lookup table ONCE ──────────────────────────────
function buildLookupTable() {
  const table = new Array(256);
  const F = SHEET_TILE_FRAMES;

  for (let mask = 0; mask < 256; mask++) {
    const n  = (mask & B.N)  ? 1 : 0;
    const e  = (mask & B.E)  ? 1 : 0;
    const s  = (mask & B.S)  ? 1 : 0;
    const w  = (mask & B.W)  ? 1 : 0;
    const ne = (mask & B.NE) ? 1 : 0;
    const se = (mask & B.SE) ? 1 : 0;
    const sw = (mask & B.SW) ? 1 : 0;
    const nw = (mask & B.NW) ? 1 : 0;

    const cardCount = n + e + s + w;

    if (cardCount === 0) {
      // ── Isolated tile ────────────────────────────────────────────
      table[mask] = F.center;
    } else if (cardCount === 1) {
      // ── Dead ends ────────────────────────────────────────────────
      if (n) table[mask] = F.edgeN;
      else if (e) table[mask] = F.edgeE;
      else if (s) table[mask] = F.edgeS;
      else table[mask] = F.edgeW;
    } else if (cardCount === 2) {
      if (n && s) {
        // ── Straight vertical (1-tile-wide strip) ──────────────────
        // Use center (full path/water) — adjacent grass tiles provide the edges.
        table[mask] = F.center;
      } else if (e && w) {
        // ── Straight horizontal (1-tile-wide strip) ────────────────
        table[mask] = F.center;
      } else {
        // ── Outer corners (2 perpendicular cardinals) ──────────────
        if (n && e) table[mask] = F.cornerTR;  // N+E → grass at BL
        else if (n && w) table[mask] = F.cornerTL;  // N+W → grass at BR
        else if (s && e) table[mask] = F.cornerBR;  // S+E → grass at TL
        else table[mask] = F.cornerBL;  // S+W → grass at TR
      }
    } else if (cardCount === 3) {
      // ── T-junctions ──────────────────────────────────────────────
      if (!n) table[mask] = F.straightHT;  // missing N
      else if (!s) table[mask] = F.straightHB;  // missing S
      else if (!e) table[mask] = F.straightVR;  // missing E
      else table[mask] = F.straightVL;  // missing W
    } else {
      // ── 4 cardinals (cross intersection) ─────────────────────────
      const missingDiags = (!ne) + (!se) + (!sw) + (!nw);
      if (missingDiags === 1) {
        // Exactly one diagonal missing → inner corner (concave)
        if (!se) table[mask] = F.innerBR;  // grass at BR
        else if (!sw) table[mask] = F.innerBL;  // grass at BL
        else if (!ne) table[mask] = F.innerTR;  // grass at TR
        else table[mask] = F.innerTL;  // grass at TL
      } else {
        // 0 or 2+ missing diagonals → center
        table[mask] = F.center;
      }
    }
  }

  return table;
}

/** Pre-computed 256-entry lookup table (generated once at module load) */
const TILE_LOOKUP = buildLookupTable();

export class MapRenderer {
  constructor({fullMapGrid, tileTypes, tileImages, tileSize, sheetTileSize}) {
    this.fullMapGrid = fullMapGrid;
    this.tileTypes = tileTypes;
    this.tileImages = tileImages;
    this.tileSize = tileSize;
    this.sheetTileSize = sheetTileSize;

    // Phase 10: tile mask + frame cache (pre-computed on buildTileCache)
    this.tileMaskCache = null;
    this.tileFrameCache = null;
  }

  // ── Render loop ──────────────────────────────────────────────────────

  drawTiles(ctx, camera, rows, cols, virtualWidth, virtualHeight) {
    const {tileSize, sheetTileSize} = this;
    const startCol = Math.floor(camera.x / tileSize);
    const endCol = Math.ceil((camera.x + virtualWidth) / tileSize);
    const startRow = Math.floor(camera.y / tileSize);
    const endRow = Math.ceil((camera.y + virtualHeight) / tileSize);

    for (let r = Math.max(0, startRow); r < Math.min(rows, endRow); r++) {
      for (let c = Math.max(0, startCol); c < Math.min(cols, endCol); c++) {
        const tileKey = this.getMapTileKey(r, c);
        const img = this.tileImages[tileKey];
        if (!img) continue;

        const frame = this.getTileFrame(tileKey, r, c);
        if (frame) {
          ctx.drawImage(
            img,
            frame.x,
            frame.y,
            sheetTileSize,
            sheetTileSize,
            c * tileSize - camera.x,
            r * tileSize - camera.y,
            tileSize,
            tileSize,
          );
        } else {
          ctx.drawImage(
            img,
            c * tileSize - camera.x,
            r * tileSize - camera.y,
            tileSize,
            tileSize,
          );
        }
      }
    }
  }

  // ── PHASE 1,4: 8-bit mask computation ────────────────────────────────

  /**
   * Compute an 8-bit mask for a tile position.
   * Bits: 0=N, 1=NE, 2=E, 3=SE, 4=S, 5=SW, 6=W, 7=NW
   * Diagonal bits are only set when BOTH adjacent cardinal neighbors
   * are also the same type (effective diagonals).
   */
  computeBitmask(row, col, isSame) {
    if (!isSame) return 0;

    const N  = isSame(row - 1, col);
    const E  = isSame(row, col + 1);
    const S  = isSame(row + 1, col);
    const W  = isSame(row, col - 1);

    // Effective diagonals: both adjacent cardinals must be set
    const NE = N && E && isSame(row - 1, col + 1);
    const SE = S && E && isSame(row + 1, col + 1);
    const SW = S && W && isSame(row + 1, col - 1);
    const NW = N && W && isSame(row - 1, col - 1);

    return (
      (N  ? B.N  : 0) |
      (NE ? B.NE : 0) |
      (E  ? B.E  : 0) |
      (SE ? B.SE : 0) |
      (S  ? B.S  : 0) |
      (SW ? B.SW : 0) |
      (W  ? B.W  : 0) |
      (NW ? B.NW : 0)
    );
  }

  // ── PHASE 2: Unified autotile engine ─────────────────────────────────

  /**
   * Unified autotile frame selection for any terrain type.
   * Uses the pre-computed 256-entry lookup table for O(1) selection.
   */
  getAutoTileFrame(row, col, terrainType) {
    const isFn = terrainType === "cliff"
      ? (r, c) => this.isWaterTile(r, c)
      : (r, c) => this.getMapTileKey(r, c) === this._terrainKeyFor(terrainType);

    return this.maskToFrame(this.computeBitmask(row, col, isFn));
  }

  /** Convert a terrain type string to the grid key it matches */
  _terrainKeyFor(type) {
    if (type === "path") return "P";
    if (type === "water" || type === "cliff") return "W";
    return "G";
  }

  /** O(1) lookup: 8-bit mask → {x, y} frame position */
  maskToFrame(mask) {
    return TILE_LOOKUP[mask] || SHEET_TILE_FRAMES.center;
  }

  // ── PHASE 10: Tile cache ─────────────────────────────────────────────

  /**
   * Pre-compute mask + frame for every tile in the map grid.
   * Call once after map load, before the game loop starts.
   */
  buildTileCache(rows, cols) {
    this.tileMaskCache = new Array(rows);
    this.tileFrameCache = new Array(rows);

    for (let r = 0; r < rows; r++) {
      this.tileMaskCache[r] = new Array(cols);
      this.tileFrameCache[r] = new Array(cols);

      for (let c = 0; c < cols; c++) {
        const tileKey = this.getMapTileKey(r, c);
        const tileType = this.tileTypes[tileKey];

        if (tileType && tileType.sheet) {
          const isFn = this._getMatcher(tileKey);
          const mask = this.computeBitmask(r, c, isFn);
          this.tileMaskCache[r][c] = mask;
          this.tileFrameCache[r][c] = this.maskToFrame(mask);
        } else {
          this.tileMaskCache[r][c] = null;
          this.tileFrameCache[r][c] = null;
        }
      }
    }
  }

  /** Return a matching function for a given tile key */
  _getMatcher(tileKey) {
    if (tileKey === "P") return (r, c) => this.isPathTile(r, c);
    if (tileKey === "W") return (r, c) => this.isWaterTile(r, c);
    if (tileKey === "C") return (r, c) => this.isWaterTile(r, c);
    return () => false;
  }

  // ── Frame resolution (cache-aware) ───────────────────────────────────

  /**
   * Get the tile frame for a position.
   * Returns from cache if available, otherwise computes on the fly.
   * Returns null for non-sheet tiles (e.g., grass).
   */
  getTileFrame(tileKey, row, col) {
    // Use cache if available
    if (this.tileFrameCache && this.tileFrameCache[row]) {
      const cached = this.tileFrameCache[row][col];
      if (cached !== null && cached !== undefined) return cached;
    }

    // Fallback: compute on the fly
    const tileType = this.tileTypes[tileKey];
    if (!tileType || !tileType.sheet) return null;

    return this.getAutoTileFrame(row, col, tileType.type);
  }

  // ── Map grid helpers ─────────────────────────────────────────────────

  getMapTileKey(row, col) {
    if (!this.fullMapGrid || row < 0 || col < 0) return "G";
    if (row >= this.fullMapGrid.length) return "G";
    const rowData = this.fullMapGrid[row];
    if (!rowData) return "G";
    return rowData[col] || "G";
  }

  isPathTile(row, col) {
    return this.getMapTileKey(row, col) === "P";
  }

  isWaterTile(row, col) {
    return this.getMapTileKey(row, col) === "W";
  }
}
