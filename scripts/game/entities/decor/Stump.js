import DecorObject from '../base/DecorObject.js';

const SHEET = './assets/sprites/Cute/Outdoor decoration/Outdoor_Decor_Free.png';

// Row 2 (sy=32), column 0 (sx=0)

/**
 * Stump.js
 * Tree stump. Solid obstacle — blocks player movement.
 */
export default class Stump extends DecorObject {
    constructor({ x, y }) {
        super({
            x,
            y,
            drawWidth: 32,
            drawHeight: 32,
            spriteX: 0,
            spriteY: 32,
            spriteW: 16,
            spriteH: 16,
            imageSrc: SHEET,
            solid: true,
            ySortOffset: 32,
            collisionBox: { offsetX: 6, offsetY: 14, width: 20, height: 16 }
        });
    }
}
