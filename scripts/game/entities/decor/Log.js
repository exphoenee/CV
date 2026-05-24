import DecorObject from '../base/DecorObject.js';

const SHEET = './assets/sprites/Cute/Outdoor decoration/Outdoor_Decor_Free.png';

// The log spans 2 tiles horizontally (row 7, cols 0-1).
// Rendered as a wide obstacle.

/**
 * Log.js
 * Fallen log — solid obstacle that blocks movement.
 */
export default class Log extends DecorObject {
    constructor({ x, y }) {
        super({
            x,
            y,
            drawWidth: 64,
            drawHeight: 32,
            spriteX: 0,
            spriteY: 112,
            spriteW: 32,
            spriteH: 16,
            imageSrc: SHEET,
            solid: true,
            ySortOffset: 32,
            collisionBox: { offsetX: 4, offsetY: 8, width: 56, height: 18 }
        });
    }
}
