import DecorObject from '../base/DecorObject.js';

const SHEET = './assets/sprites/Cute/Outdoor decoration/Outdoor_Decor_Free.png';

// Row 2 (sy=32): col 1 (sx=16) and col 2 (sx=32) — purely decorative stones
const VARIANTS = [
  { spriteX: 16, spriteY: 32 }, // variant 0
  { spriteX: 32, spriteY: 32 }, // variant 1
];

/**
 * DecorStone.js
 * Small decorative stones. No hitbox, no collision — purely visual.
 *
 * @param {number} variant  0..1
 */
export default class DecorStone extends DecorObject {
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
