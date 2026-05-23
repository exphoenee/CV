/**
 * fences.js
 * Fence layer data: a sparse grid of fence cell keys.
 *
 * The fence layer is rendered ON TOP of the tile map but BELOW game objects
 * (y-sorted). Fences are NOT GameObjects — they are purely a render+collision
 * data layer, processed by FenceRenderer.
 *
 * Key legend (matches FenceRenderer.FENCE_FRAMES):
 *   " "  = no fence (empty / passable)
 *
 *   Straights
 *   "V"  = vertical bar
 *   "H"  = horizontal bar
 *
 *   Convex corners (open inside faces toward the cross center)
 *   "TL" = top-left corner
 *   "TR" = top-right corner
 *   "BL" = bottom-left corner
 *   "BR" = bottom-right corner
 *
 *   Junctions (T-shapes, opening faces the inside/cross)
 *   "TT" = T-junction open toward top    (horizontal bar with branch up)
 *   "TB" = T-junction open toward bottom (horizontal bar with branch down)
 *   "TL_" = T-junction open toward left  (vertical bar with branch left)
 *   "TR_" = T-junction open toward right (vertical bar with branch right)
 *
 *   "X"  = cross / all-directions junction
 *
 * Grid dimensions must match the FULL_MAP_GRID (MAP_WIDTH × MAP_HEIGHT).
 * Use a sparse object { "row,col": key } for memory efficiency — any cell
 * not present is treated as " " (empty).
 *
 * Example:
 *   import { FENCE_CELLS } from './fences.js';
 *   FENCE_CELLS["5,3"] = "H";
 */
export const FENCE_CELLS = {
    // Add fence placements here as "row,col": key entries.
    // Example row of horizontal fence:
    // "4,2": "TL", "4,3": "H", "4,4": "H", "4,5": "TR",
    // "5,2": "V",                            "5,5": "V",
    // "6,2": "BL", "6,3": "H", "6,4": "H", "6,5": "BR",
};
