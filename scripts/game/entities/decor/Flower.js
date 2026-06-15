import DecorObject from '../base/DecorObject.js';

const SHEET = './assets/sprites/Cute/Outdoor decoration/Outdoor_Decor_Free.png';

/**
 * Flower variant table.
 * Rows 8-11 (sy = 128..176), columns 0-3 (sx = 0..48).
 * 4 columns × 4 rows = 16 variants (0-indexed left→right, top→bottom).
 *
 *  variant 0-3  : row 8  (sy=128)
 *  variant 4-7  : row 9  (sy=144)
 *  variant 8-11 : row 10 (sy=160)
 *  variant 12-15: row 11 (sy=176)
 */
const VARIANTS = [];
for (let row = 0; row < 4; row++) {
  for (let col = 0; col < 4; col++) {
    VARIANTS.push({ spriteX: col * 16, spriteY: 128 + row * 16 });
  }
}

/**
 * Flower.js
 * Decorative flowers. No hitbox, no collision — purely visual.
 *
 * @param {number} variant  0..15
 */
export default class Flower extends DecorObject {
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
      collisionBox: { offsetX: 0, offsetY: 0, width: 0, height: 0 },
    });
  }
}
