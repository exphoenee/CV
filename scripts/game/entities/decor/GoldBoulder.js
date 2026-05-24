import DecorObject from '../base/DecorObject.js';

const SHEET = './assets/sprites/Cute/Outdoor decoration/Outdoor_Decor_Free.png';

// Row 5 (sy=80): columns 0-3 — gold ore embedded in rock, solid
const VARIANTS = [
    { spriteX:  0, spriteY: 80 }, // variant 0
    { spriteX: 16, spriteY: 80 }, // variant 1
    { spriteX: 32, spriteY: 80 }, // variant 2
    { spriteX: 48, spriteY: 80 }, // variant 3
];

/**
 * GoldBoulder.js
 * Gold-ore rock formations. Solid — blocks player movement.
 *
 * @param {number} variant  0..3
 */
export default class GoldBoulder extends DecorObject {
    constructor({ x, y, variant = 0 }) {
        const v = VARIANTS[variant] ?? VARIANTS[0];
        super({
            x,
            y,
            drawWidth: 32,
            drawHeight: 32,
            spriteX: v.spriteX,
            spriteY: v.spriteY,
            spriteW: 16,
            spriteH: 16,
            imageSrc: SHEET,
            solid: true,
            ySortOffset: 32,
            collisionBox: { offsetX: 4, offsetY: 12, width: 24, height: 18 }
        });
    }
}
