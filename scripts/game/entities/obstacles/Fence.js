import GameObject from '../base/GameObject.js';

export default class Fence extends GameObject {
    constructor({ x, y }) {
        super({
            x,
            y,
            width: 48,
            height: 48,
            spriteWidth: 16,
            spriteHeight: 16,
            imageSrc: './assets/sprites/Cute/Outdoor decoration/Fences.png',
            solid: true,
            ySortOffset: 0,
            collisionBox: {
                offsetX: 0,
                offsetY: 16,
                width: 48,
                height: 32 // Fences block the path horizontally/vertically
            }
        });
    }

    /**
     * Draw a single fence piece extracted from the grid.
     */
    draw(ctx, camera) {
        if (!this.image || !this.isLoaded) {
            super.draw(ctx, camera);
            return;
        }

        // Draw top-left fence chunk (16x16 pixels)
        ctx.drawImage(
            this.image,
            0, 16, // Grab row 1, col 0 which is a very clean fence post
            16, 16,
            this.x - camera.x, this.y - camera.y,
            this.width, this.height
        );
    }
}
