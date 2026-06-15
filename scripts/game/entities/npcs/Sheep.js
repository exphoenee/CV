import Npc from '../base/Npc.js';

export default class Sheep extends Npc {
  constructor({ x, y }) {
    super({
      x,
      y,
      width: 38,
      height: 38,
      spriteWidth: 32,
      spriteHeight: 32,
      imageSrc: './assets/sprites/Cute/Animals/Sheep/Sheep.png',
      speed: 18,
      collisionBox: { offsetX: 7, offsetY: 15, width: 22, height: 15 },
    });
  }

  /**
   * Draw sheep sprite using a 2‑row (idle / walk) sheet.
   * Row 0 = idle, Row 1 = walk. Two frames per row.
   * Flip horizontally when facing left.
   */
  draw(ctx, camera) {
    if (!this.image || !this.isLoaded) {
      super.draw(ctx, camera);
      return;
    }
    const row = this.isMoving ? 1 : 0; // 0 idle, 1 walk
    const frame = this.animFrame % 2; // two frames per row
    const sourceX = frame * this.spriteWidth;
    const sourceY = row * this.spriteHeight;
    const drawX = this.x - camera.x;
    const drawY = this.y - camera.y;
    ctx.save();
    if (this.dir === 'right') {
      ctx.translate(drawX + this.width / 2, 0);
      ctx.scale(-1, 1);
      ctx.translate(-(drawX + this.width / 2), 0);
    }
    ctx.drawImage(
      this.image,
      sourceX,
      sourceY,
      this.spriteWidth,
      this.spriteHeight,
      drawX,
      drawY,
      this.width,
      this.height,
    );
    ctx.restore();
  }
}
