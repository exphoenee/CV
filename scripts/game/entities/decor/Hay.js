import Pickable from './Pickable.js';

const SHEET = './assets/sprites/Cute/Outdoor decoration/Outdoor_Decor_Free.png';

// Row 3 (sy=48), column 6 (sx=96)

/**
 * Hay.js
 * Pickable hay / straw bale. Has a collision box but does not block movement.
 */
export default class Hay extends Pickable {
    constructor({ x, y }) {
        super({
            x,
            y,
            drawWidth: 32,
            drawHeight: 32,
            spriteX: 96,
            spriteY: 48,
            spriteW: 16,
            spriteH: 16,
            imageSrc: SHEET,
            collisionBox: { offsetX: 6, offsetY: 10, width: 20, height: 18 }
        });
    }
}
