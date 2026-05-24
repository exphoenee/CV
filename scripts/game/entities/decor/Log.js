import DecorObject from '../base/DecorObject.js';

const SHEET = './assets/sprites/Cute/Outdoor decoration/Outdoor_Decor_Free.png';

// The log is a 1×2 sprite (16×32 source pixels) at row 7 (sy=112), col 0 (sx=0).
// Rendered at 2× → 32×64 on canvas.

/**
 * Log.js
 * Fallen log — takes up a 1×2 tile slot on the sheet (32 px tall source).
 * Solid obstacle that blocks movement at its base.
 */
export default class Log extends DecorObject {
    constructor({ x, y }) {
        super({
            x,
            y,
            drawWidth: 32,
            drawHeight: 64,      // 2 tiles tall
            spriteX: 0,
            spriteY: 112,
            spriteW: 16,
            spriteH: 32,         // captures both tile rows in one draw call
            imageSrc: SHEET,
            solid: true,
            ySortOffset: 64,
            collisionBox: { offsetX: 4, offsetY: 40, width: 24, height: 20 }
        });
    }
}
