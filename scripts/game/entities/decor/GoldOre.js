import Pickable from './Pickable.js';

const SHEET = './assets/sprites/Cute/Outdoor decoration/Outdoor_Decor_Free.png';

// Row 6 (sy=96): columns 0-2
const VARIANTS = [
  { spriteX: 0, spriteY: 96 }, // variant 0
  { spriteX: 16, spriteY: 96 }, // variant 1
  { spriteX: 32, spriteY: 96 }, // variant 2
];

/**
 * GoldOre.js
 * Pickable gold ore nuggets. Have a collision box, do not block movement.
 *
 * @param {number} variant  0..2
 */
export default class GoldOre extends Pickable {
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
      collisionBox: { offsetX: 8, offsetY: 8, width: 16, height: 16 },
    });
  }
}
