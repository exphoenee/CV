import Pickable from './Pickable.js';

const SHEET = './assets/sprites/Cute/Outdoor decoration/Outdoor_Decor_Free.png';

// Row 3 (sy=48), column 4 (sx=64)

/**
 * Carrot.js
 * Pickable carrot item. Has a collision box but does not block movement.
 */
export default class Carrot extends Pickable {
    constructor({ x, y }) {
        super({
            x,
            y,
            drawWidth: 32,
            drawHeight: 32,
            spriteX: 64,
            spriteY: 48,
            spriteW: 16,
            spriteH: 16,
            imageSrc: SHEET,
            collisionBox: { offsetX: 8, offsetY: 8, width: 16, height: 16 }
        });
    }
}
