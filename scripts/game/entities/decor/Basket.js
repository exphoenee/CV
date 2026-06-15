import DecorObject from '../base/DecorObject.js';

const SHEET = './assets/sprites/Cute/Outdoor decoration/Outdoor_Decor_Free.png';

// Row 0: col 4 = carrot basket, col 6 = potato basket
const TYPES = {
  carrot: { spriteX: 64, spriteY: 0 },
  potato: { spriteX: 96, spriteY: 0 },
};

/**
 * Basket.js
 * Harvest baskets (carrot / potato). Solid obstacle.
 *
 * @param {'carrot'|'potato'} type
 */
export default class Basket extends DecorObject {
  constructor({ x, y, type = 'carrot' }) {
    const t = TYPES[type] ?? TYPES.carrot;
    super({
      x,
      y,
      drawWidth: 32,
      drawHeight: 32,
      spriteX: t.spriteX,
      spriteY: t.spriteY,
      spriteW: 16,
      spriteH: 16,
      imageSrc: SHEET,
      solid: true,
      ySortOffset: 32,
      collisionBox: { offsetX: 4, offsetY: 12, width: 24, height: 18 },
    });
  }
}
