import DecorObject from '../base/DecorObject.js';

const SHEET = './assets/sprites/Cute/Outdoor decoration/Outdoor_Decor_Free.png';

// Row 0, columns 0-2 — 16×16 source, rendered 32×32
const VARIANTS = [
    { spriteX: 0,  spriteY: 0 }, // variant 0
    { spriteX: 16, spriteY: 0 }, // variant 1
    { spriteX: 32, spriteY: 0 }, // variant 2
];

/**
 * Leaf.js
 * Purely decorative leaf/foliage sprites. No hitbox, no collision.
 *
 * @param {number} variant  0..2
 */
export default class Leaf extends DecorObject {
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
            solid: false,
            collisionBox: { offsetX: 0, offsetY: 0, width: 0, height: 0 }
        });
    }
}
