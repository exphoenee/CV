import DecorObject from '../base/DecorObject.js';

const SHEET = './assets/sprites/Cute/Outdoor decoration/Outdoor_Decor_Free.png';

/**
 * Plant variant table.
 * Row 1 (sy=16): columns 0-6 → 7 plants (variants 0-6)
 * Row 2 (sy=32): columns 3-6  → 4 extra plants (variants 7-10)
 */
const VARIANTS = [
    { spriteX:  0, spriteY: 16 }, // 0
    { spriteX: 16, spriteY: 16 }, // 1
    { spriteX: 32, spriteY: 16 }, // 2
    { spriteX: 48, spriteY: 16 }, // 3
    { spriteX: 64, spriteY: 16 }, // 4
    { spriteX: 80, spriteY: 16 }, // 5
    { spriteX: 96, spriteY: 16 }, // 6
    { spriteX: 48, spriteY: 32 }, // 7  (row 2, col 3)
    { spriteX: 64, spriteY: 32 }, // 8  (row 2, col 4)
    { spriteX: 80, spriteY: 32 }, // 9  (row 2, col 5)
    { spriteX: 96, spriteY: 32 }, // 10 (row 2, col 6)
];

/**
 * Plant.js
 * Purely decorative plant/bush sprites. No hitbox, no collision.
 *
 * @param {number} variant  0..10
 */
export default class Plant extends DecorObject {
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
