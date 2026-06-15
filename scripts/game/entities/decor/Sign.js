import DecorObject from '../base/DecorObject.js';

const SHEET = './assets/sprites/Cute/Outdoor decoration/Outdoor_Decor_Free.png';

// Row 0: col 3 = carrot sign, col 5 = potato sign
const TYPES = {
  carrot: { spriteX: 48, spriteY: 0 },
  potato: { spriteX: 80, spriteY: 0 },
};

/**
 * Sign.js
 * Decorative signs (carrot / potato). Solid obstacle.
 *
 * @param {'carrot'|'potato'} type
 */
export default class Sign extends DecorObject {
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
      collisionBox: { offsetX: 6, offsetY: 14, width: 20, height: 16 },
    });
  }
}
