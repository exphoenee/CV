/**
 * renderMap.js
 * Tile map rendering logic: tile frame selection and draw loop.
 */
import {SHEET_TILE_FRAMES} from "./map.js";

export class MapRenderer {
  constructor({fullMapGrid, tileTypes, tileImages, tileSize, sheetTileSize}) {
    this.fullMapGrid = fullMapGrid;
    this.tileTypes = tileTypes;
    this.tileImages = tileImages;
    this.tileSize = tileSize;
    this.sheetTileSize = sheetTileSize;
  }

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

  getTileFrame(tileKey, row, col) {
    const tileType = this.tileTypes[tileKey];
    if (!tileType || !tileType.sheet) return null;

    if (tileType.type === "path") return this.getPathTileFrame(row, col);
    if (tileType.type === "water") return this.getWaterTileFrame(row, col);
    if (tileType.type === "cliff") return this.getCliffTileFrame(row, col);
    return null;
  }

  /**
   * 8-direction auto-tile frame selection.
   *
   * Pixel analysis of Path_Tile.png / Water_Tile.png (48×96, 3 col × 6 row
   * sheet of 16×16 tiles) confirms the standard RPG Maker 2000/2003 layout:
   *
   *   Row 0: [cornerBR] [straightHT / bottom-edge] [cornerBL]
   *   Row 1: [straightVL / right-edge] [center] [straightVR / left-edge]
   *   Row 2: [cornerTR] [straightHB / top-edge] [cornerTL]
   *   Row 3: [innerBR] [innerBL] [—]
   *   Row 4: [innerTR] [innerTL] [—]
   *   Row 5: [deco]
   *
   * Checks all 8 neighbors. Diagonal neighbors are considered "effective"
   * only when BOTH adjacent cardinals are also the same tile type.
   */
  _get8DirFrame(row, col, isTileFn) {
    const n  = isTileFn(row - 1, col);
    const s  = isTileFn(row + 1, col);
    const e  = isTileFn(row, col + 1);
    const w  = isTileFn(row, col - 1);
    const ne = isTileFn(row - 1, col + 1);
    const nw = isTileFn(row - 1, col - 1);
    const se = isTileFn(row + 1, col + 1);
    const sw = isTileFn(row + 1, col - 1);

    // Effective diagonal: adjacent cardinals must also be the same type
    const effNE = n && e && ne;
    const effNW = n && w && nw;
    const effSE = s && e && se;
    const effSW = s && w && sw;

    const cardCount = (n ? 1 : 0) + (s ? 1 : 0) + (e ? 1 : 0) + (w ? 1 : 0);

    const F = SHEET_TILE_FRAMES;

    // ── 0 cardinals (isolated tile) ────────────────────────────────
    if (cardCount === 0) return F.center;

    // ── 1 cardinal (dead end) ──────────────────────────────────────
    if (cardCount === 1) {
      if (n) return F.edgeN;
      if (e) return F.edgeE;
      if (s) return F.edgeS;
      if (w) return F.edgeW;
    }

    // ── 2 opposite cardinals (straight run) ────────────────────────
    // For N+S (vertical) use the appropriate side-edge frame.
    if (n && s && !e && !w) return F.straightV;
    // For E+W (horizontal) use the appropriate top/bottom-edge frame.
    if (e && w && !n && !s) return F.straightH;

    // ── 2 perpendicular cardinals (convex outer corners) ───────────
    // Map: grass-opposite-corner → frame
    //   N+E → grass at BL → cornerTR  (R2C0)
    //   N+W → grass at BR → cornerTL  (R2C2)
    //   S+E → grass at TL → cornerBR  (R0C0)
    //   S+W → grass at TR → cornerBL  (R0C2)
    if (n && e && !s && !w) return F.cornerTR;
    if (n && w && !s && !e) return F.cornerTL;
    if (s && e && !n && !w) return F.cornerBR;
    if (s && w && !n && !e) return F.cornerBL;

    // ── 3 cardinals (T-junction) ───────────────────────────────────
    // Missing N → grass is to the north: show bottom edge (straightHT)
    if (!n && e && s && w) return F.straightHT;
    // Missing S → grass to the south: show top edge (straightHB)
    if (!s && n && e && w) return F.straightHB;
    // Missing E → grass to the east: show left edge (straightVR)
    if (!e && n && s && w) return F.straightVR;
    // Missing W → grass to the west: show right edge (straightVL)
    if (!w && n && s && e) return F.straightVL;

    // ── 4 cardinals (cross intersection) ──────────────────────────
    return F.center;
  }

  getPathTileFrame(row, col) {
    return this._get8DirFrame(row, col, (r, c) => this.isPathTile(r, c));
  }

  getWaterTileFrame(row, col) {
    return this._get8DirFrame(row, col, (r, c) => this.isWaterTile(r, c));
  }

  getCliffTileFrame(row, col) {
    return this.getWaterTileFrame(row, col);
  }

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
