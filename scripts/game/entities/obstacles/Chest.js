import GameObject from '../base/GameObject.js';
import { sfx } from '../../audio/sfx.js';

export default class Chest extends GameObject {
  constructor({ x, y }) {
    super({
      x,
      y,
      width: 32,
      height: 32,
      spriteWidth: 16,
      spriteHeight: 16,
      imageSrc: './assets/sprites/Cute/Outdoor decoration/Chest.png',
      solid: true,
      ySortOffset: 0,
      collisionBox: {
        offsetX: 0,
        offsetY: 9,
        width: 32,
        height: 16,
      },
    });

    this.isUsed = false;
  }

  /**
   * Try to heal the player. If player is full HP, do nothing.
   * If healed, mark chest as used and make it disappear.
   * Returns true if the chest was consumed.
   */
  tryHeal(player) {
    if (this.isUsed) return false;
    if (!player || player.isDead) return false;

    const healed = player.heal();
    if (healed) {
      this.isUsed = true;
      this.solid = false;
      sfx.play('chest_collect');
      return true;
    }
    return false;
  }

  /**
   * Don't render if used.
   */
  draw(ctx, camera) {
    if (this.isUsed) return;
    super.draw(ctx, camera);
  }
}
