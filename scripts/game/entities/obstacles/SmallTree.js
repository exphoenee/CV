import GameObject from "../base/GameObject.js";

// Oak_Tree_Small.png: 96×48px → 3 trees, each 32×48px (asset is at 2× scale)
// Variant 0 is intentionally scaled up in-game (2.5×) to create a larger small-tree look.
const VARIANTS = [
  { spriteX: 0, scale: 2.5 }, // variant 0 — left tree (scaled 2.5×)
  { spriteX: 32, scale: 1 }, // variant 1 — centre tree
  { spriteX: 64, scale: 1 }, // variant 2 — right tree
];

/**
 * SmallTree.js
 * Small oak tree — solid obstacle like the large Oak_Tree, but shorter.
 * Sprite sheet: Oak_Tree_Small.png (96×48) — 3 variants side by side.
 * Each sprite is 32×48px (pre-scaled, drawn 1:1).
 *
 * @param {number} variant  0..2
 */
export default class SmallTree extends GameObject {
  constructor({ x, y, variant = 0 }) {
    const v = VARIANTS[variant] ?? VARIANTS[0];
    const BASE_W = 32;
    const BASE_H = 48;
    const scale = v.scale ?? 1;

    super({
      x,
      y,
      width: Math.round(BASE_W * scale),
      height: Math.round(BASE_H * scale),
      imageSrc: "./assets/sprites/Cute/Outdoor decoration/Oak_Tree_Small.png",
      solid: true,
      ySortOffset: 0,
      collisionBox: {
        offsetX: Math.round(10 * scale),
        offsetY: Math.round(36 * scale),
        width: Math.round(12 * scale),
        height: Math.round(10 * scale), // Only the trunk base blocks movement
      },
    });

    // Store which variant to draw and runtime scale
    this._spriteX = v.spriteX;
    this._scale = scale;
  }

  draw(ctx, camera) {
    if (!this.image || !this.isLoaded) {
      ctx.fillStyle = "rgba(255,0,0,0.4)";
      ctx.fillRect(
        this.x - camera.x,
        this.y - camera.y,
        this.width,
        this.height,
      );
      return;
    }
    ctx.drawImage(
      this.image,
      this._spriteX,
      0,
      32,
      48,
      this.x - camera.x,
      this.y - camera.y,
      this.width,
      this.height,
    );
  }
}
