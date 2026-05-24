import GameObject from '../base/GameObject.js';

// Oak_Tree_Small.png: 96×48px → 3 trees, each 32×48px (no scaling needed, already 2× asset)
const VARIANTS = [
    { spriteX:  0 }, // variant 0 — left tree
    { spriteX: 32 }, // variant 1 — centre tree
    { spriteX: 64 }, // variant 2 — right tree
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
        super({
            x,
            y,
            width: 32,
            height: 48,
            imageSrc: './assets/sprites/Cute/Outdoor decoration/Oak_Tree_Small.png',
            solid: true,
            ySortOffset: 0,
            collisionBox: {
                offsetX: 10,
                offsetY: 36,
                width: 12,
                height: 10   // Only the trunk base blocks movement
            }
        });

        // Store which variant to draw
        this._spriteX = v.spriteX;
    }

    draw(ctx, camera) {
        if (!this.image || !this.isLoaded) {
            ctx.fillStyle = 'rgba(255,0,0,0.4)';
            ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
            return;
        }
        ctx.drawImage(
            this.image,
            this._spriteX, 0, 32, 48,
            this.x - camera.x, this.y - camera.y, this.width, this.height
        );
    }
}
