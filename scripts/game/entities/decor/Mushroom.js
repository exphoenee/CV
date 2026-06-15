import DecorObject from '../base/DecorObject.js';

const SHEET = './assets/sprites/Cute/Outdoor decoration/Outdoor_Decor_Free.png';

// Row 7 (sy=112), column 2 (sx=32)

/**
 * Mushroom.js
 * Decorative mushroom. No hitbox, no collision — purely visual.
 */
export default class Mushroom extends DecorObject {
  constructor({ x, y }) {
    super({
      x,
      y,
      drawWidth: 32,
      drawHeight: 32,
      spriteX: 32,
      spriteY: 112,
      spriteW: 16,
      spriteH: 16,
      imageSrc: SHEET,
      solid: false,
      collisionBox: { offsetX: 0, offsetY: 0, width: 0, height: 0 },
    });
  }
}
