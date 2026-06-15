/**
 * renderFences.js
 * Fence layer renderer — analogous to MapRenderer in renderMap.js.
 *
 * Fences.png layout (64×64px, 4 cols × 4 rows, each tile 16×16px):
 *
 *         Col 0       Col 1       Col 2       Col 3
 *  Row 0  vert-str    horiz-str   horiz-T-N   convex-TR
 *  Row 1  vert-str    convex-TL   convex-TR'  convex-TL'
 *  Row 2  vert-str    convex-BL   cross(+)    convex-BR
 *  Row 3  vert-str    convex-BR'  horiz-T-S   end-cap
 *
 * (Col 0 all rows are the same vertical-bar piece)
 *
 * Sprite source coordinates (sx = col*16, sy = row*16):
 *   V   — vertical bar         sx=0,  sy=0   (any row of col 0)
 *   H   — horizontal bar       sx=16, sy=0
 *   TL  — corner top-left      sx=16, sy=16
 *   TR  — corner top-right     sx=32, sy=0  (row 0 col 2 = horiz+branch-N ≈ TR)
 *   BL  — corner bottom-left   sx=16, sy=32
 *   BR  — corner bottom-right  sx=16, sy=48
 *   TT  — T-junction top       sx=32, sy=0
 *   TB  — T-junction bottom    sx=32, sy=48
 *   TR_ — T-junction right     sx=48, sy=0
 *   TL_ — T-junction left      sx=48, sy=16  (mirrored)
 *   X   — cross junction       sx=32, sy=32
 *
 * Collision: every non-empty fence cell is solid (impassable).
 */

const SHEET_SRC = './assets/sprites/Cute/Outdoor decoration/Fences.png';
const SRC_TILE = 16; // source pixels per tile

/**
 * Map of fence key → { sx, sy } source coordinates in Fences.png.
 * All coordinates in source pixels (pre-scale).
 */
export const FENCE_FRAMES = {
  V: { sx: 0, sy: 0 }, // vertical bar      (col 0, any row)
  H: { sx: 16, sy: 0 }, // horizontal bar    (col 1, row 0)
  TL: { sx: 16, sy: 16 }, // corner top-left   (col 1, row 1)
  TR: { sx: 32, sy: 16 }, // corner top-right  (col 2, row 1)
  BL: { sx: 16, sy: 32 }, // corner bot-left   (col 1, row 2)
  BR: { sx: 16, sy: 48 }, // corner bot-right  (col 1, row 3)
  TT: { sx: 32, sy: 0 }, // T open top        (col 2, row 0)
  TB: { sx: 32, sy: 48 }, // T open bottom     (col 2, row 3)
  TR_: { sx: 48, sy: 0 }, // T open right      (col 3, row 0)
  TL_: { sx: 48, sy: 16 }, // T open left       (col 3, row 1)
  X: { sx: 32, sy: 32 }, // cross junction    (col 2, row 2)
};

export class FenceRenderer {
  /**
   * @param {Object} fenceCells   — sparse map { "row,col": key }
   * @param {number} tileSize     — rendered tile size in px (default 32)
   */
  constructor({ fenceCells, tileSize = 32 }) {
    this.fenceCells = fenceCells;
    this.tileSize = tileSize;

    // Load the shared sprite sheet once
    this.image = new Image();
    this.isLoaded = false;
    this.image.onload = () => {
      this.isLoaded = true;
    };
    this.image.src = SHEET_SRC;

    // Build a fast collision set (Set of "row,col" strings)
    this._solidSet = new Set(Object.keys(fenceCells));
  }

  // ─── Public API ──────────────────────────────────────────────────────────

  /**
   * Draw all visible fence tiles.
   * Call this AFTER drawing the ground map and BEFORE drawing game objects
   * (or incorporate it into the y-sort pass as a flat layer).
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {{ x: number, y: number }} camera
   * @param {number} virtualWidth   — viewport width in px
   * @param {number} virtualHeight  — viewport height in px
   */
  draw(ctx, camera, virtualWidth, virtualHeight) {
    if (!this.isLoaded) return;

    const { tileSize } = this;
    const floorCamX = Math.floor(camera.x);
    const floorCamY = Math.floor(camera.y);
    const startCol = Math.floor(camera.x / tileSize);
    const endCol = Math.ceil((camera.x + virtualWidth) / tileSize);
    const startRow = Math.floor(camera.y / tileSize);
    const endRow = Math.ceil((camera.y + virtualHeight) / tileSize);

    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const key = this.fenceCells[`${r},${c}`];
        if (!key) continue;

        const frame = FENCE_FRAMES[key];
        if (!frame) continue;

        ctx.drawImage(
          this.image,
          frame.sx,
          frame.sy,
          SRC_TILE,
          SRC_TILE,
          c * tileSize - floorCamX - 1,
          r * tileSize - floorCamY - 1,
          tileSize + 2,
          tileSize + 2,
        );
      }
    }
  }

  /**
   * Returns true if the given world-pixel rectangle overlaps any solid fence cell.
   * Use this in the physics/collision step instead of per-object solid checks.
   *
   * @param {{ x, y, width, height }} rect  — world-space AABB
   */
  collidesWithRect(rect) {
    const { tileSize } = this;
    const left = Math.floor(rect.x / tileSize);
    const right = Math.floor((rect.x + rect.width - 1) / tileSize);
    const top = Math.floor(rect.y / tileSize);
    const bottom = Math.floor((rect.y + rect.height - 1) / tileSize);

    for (let r = top; r <= bottom; r++) {
      for (let c = left; c <= right; c++) {
        if (this._solidSet.has(`${r},${c}`)) return true;
      }
    }
    return false;
  }

  /**
   * Dynamically add or remove a fence cell at runtime.
   * Keeps the collision set in sync automatically.
   *
   * @param {number} row
   * @param {number} col
   * @param {string|null} key  — fence type key, or null to remove
   */
  setCell(row, col, key) {
    const cellKey = `${row},${col}`;
    if (key === null || key === undefined || key === ' ') {
      delete this.fenceCells[cellKey];
      this._solidSet.delete(cellKey);
    } else {
      this.fenceCells[cellKey] = key;
      this._solidSet.add(cellKey);
    }
  }

  /**
   * Helper: place a rectangular fence enclosure.
   * Automatically assigns correct corner / edge / T / cross keys.
   *
   * @param {number} topRow
   * @param {number} leftCol
   * @param {number} bottomRow
   * @param {number} rightCol
   */
  placeEnclosure(topRow, leftCol, bottomRow, rightCol) {
    for (let r = topRow; r <= bottomRow; r++) {
      for (let c = leftCol; c <= rightCol; c++) {
        const top = r === topRow;
        const bottom = r === bottomRow;
        const left = c === leftCol;
        const right = c === rightCol;

        let key = null;

        if (top && left) key = 'TL';
        else if (top && right) key = 'TR';
        else if (bottom && left) key = 'BL';
        else if (bottom && right) key = 'BR';
        else if (top || bottom) key = 'H';
        else if (left || right) key = 'V';
        // interior cells are left empty (no fence inside the enclosure)

        if (key) this.setCell(r, c, key);
      }
    }
  }
}
