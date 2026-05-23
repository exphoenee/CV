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

  getPathTileFrame(row, col) {
    const north = this.isPathTile(row - 1, col);
    const south = this.isPathTile(row + 1, col);
    const west = this.isPathTile(row, col - 1);
    const east = this.isPathTile(row, col + 1);

    const mask =
      (north ? 8 : 0) | (east ? 4 : 0) | (south ? 2 : 0) | (west ? 1 : 0);

    // Horizontal strip (both east and west neighbors present):
    // render top edge, bottom edge, or interior based on north/south presence.
    if (east && west) {
      if (!north && south) return SHEET_TILE_FRAMES.straightHT; // top edge
      if (north && !south) return SHEET_TILE_FRAMES.straightHB; // bottom edge
      if (north && south) return SHEET_TILE_FRAMES.center;      // interior (3+ wide)
      return SHEET_TILE_FRAMES.straightH;                       // single-row horizontal
    }

    // Vertical strip (both north and south neighbors present):
    // render left edge, right edge, or interior based on west/east presence.
    if (north && south) {
      if (!west && east) return SHEET_TILE_FRAMES.straightVL;   // left edge
      if (west && !east) return SHEET_TILE_FRAMES.straightVR;   // right edge
      if (west && east) return SHEET_TILE_FRAMES.center;        // interior (3+ wide)
      return SHEET_TILE_FRAMES.straightV;                       // single-column vertical
    }

    switch (mask) {
      case 0: return SHEET_TILE_FRAMES.straightH;
      case 1: return SHEET_TILE_FRAMES.edgeW;
      case 2: return SHEET_TILE_FRAMES.edgeS;
      case 3: return SHEET_TILE_FRAMES.cornerBL;
      case 4: return SHEET_TILE_FRAMES.edgeE;
      case 5: return SHEET_TILE_FRAMES.straightH;
      case 6: return SHEET_TILE_FRAMES.cornerBR;
      case 7: return SHEET_TILE_FRAMES.innerBR;
      case 8: return SHEET_TILE_FRAMES.edgeN;
      case 9: return SHEET_TILE_FRAMES.cornerTL;
      case 10: return SHEET_TILE_FRAMES.straightV;
      case 11: return SHEET_TILE_FRAMES.innerBL;
      case 12: return SHEET_TILE_FRAMES.cornerTR;
      case 13: return SHEET_TILE_FRAMES.innerTL;
      case 14: return SHEET_TILE_FRAMES.innerTR;
      case 15: return SHEET_TILE_FRAMES.deco1;
      default: return SHEET_TILE_FRAMES.straightH;
    }
  }

  getWaterTileFrame(row, col) {
    const north = this.isWaterTile(row - 1, col);
    const south = this.isWaterTile(row + 1, col);
    const west = this.isWaterTile(row, col - 1);
    const east = this.isWaterTile(row, col + 1);

    const mask =
      (north ? 8 : 0) | (east ? 4 : 0) | (south ? 2 : 0) | (west ? 1 : 0);

    // Horizontal strip: render top edge, bottom edge, or interior.
    if (east && west) {
      if (!north && south) return SHEET_TILE_FRAMES.straightHT;
      if (north && !south) return SHEET_TILE_FRAMES.straightHB;
      if (north && south) return SHEET_TILE_FRAMES.center;
      return SHEET_TILE_FRAMES.straightH;
    }

    // Vertical strip: render left edge, right edge, or interior.
    if (north && south) {
      if (!west && east) return SHEET_TILE_FRAMES.straightVL;
      if (west && !east) return SHEET_TILE_FRAMES.straightVR;
      if (west && east) return SHEET_TILE_FRAMES.center;
      return SHEET_TILE_FRAMES.straightV;
    }

    switch (mask) {
      case 0: return SHEET_TILE_FRAMES.straightH;
      case 1: return SHEET_TILE_FRAMES.edgeW;
      case 2: return SHEET_TILE_FRAMES.edgeS;
      case 3: return SHEET_TILE_FRAMES.cornerBL;
      case 4: return SHEET_TILE_FRAMES.edgeE;
      case 5: return SHEET_TILE_FRAMES.straightH;
      case 6: return SHEET_TILE_FRAMES.cornerBR;
      case 7: return SHEET_TILE_FRAMES.innerBR;
      case 8: return SHEET_TILE_FRAMES.edgeN;
      case 9: return SHEET_TILE_FRAMES.cornerTL;
      case 10: return SHEET_TILE_FRAMES.straightV;
      case 11: return SHEET_TILE_FRAMES.innerBL;
      case 12: return SHEET_TILE_FRAMES.cornerTR;
      case 13: return SHEET_TILE_FRAMES.innerTL;
      case 14: return SHEET_TILE_FRAMES.innerTR;
      case 15: return SHEET_TILE_FRAMES.deco2;
      default: return SHEET_TILE_FRAMES.straightH;
    }
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
