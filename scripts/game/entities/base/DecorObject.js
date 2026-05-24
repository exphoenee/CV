import GameObject from './GameObject.js';

/**
 * DecorObject.js
 * Base class for decoration objects that are rendered as a single sprite
 * slice from a larger sprite sheet.
 *
 * @param {number} spriteX  - Source X pixel offset in the sheet.
 * @param {number} spriteY  - Source Y pixel offset in the sheet.
 * @param {number} spriteW  - Source width in pixels (default 16).
 * @param {number} spriteH  - Source height in pixels (default 16).
 * @param {number} drawWidth  - Rendered width on canvas (default 32 = 2× scale).
 * @param {number} drawHeight - Rendered height on canvas (default 32).
 */
export default class DecorObject extends GameObject {
    constructor({
        x = 0,
        y = 0,
        drawWidth = 32,
        drawHeight = 32,
        spriteX = 0,
        spriteY = 0,
        spriteW = 16,
        spriteH = 16,
        imageSrc = '',
        solid = false,
        collisionBox = null,
        ySortOffset = 0
    } = {}) {
        super({
            x,
            y,
            width: drawWidth,
            height: drawHeight,
            imageSrc,
            solid,
            collisionBox,
            ySortOffset
        });

        this.spriteX = spriteX;
        this.spriteY = spriteY;
        this.spriteW = spriteW;
        this.spriteH = spriteH;
    }

    draw(ctx, camera) {
        if (!this.image || !this.isLoaded) {
            ctx.fillStyle = this.solid ? 'rgba(255,0,0,0.4)' : 'rgba(0,160,255,0.3)';
            ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
            return;
        }
        ctx.drawImage(
            this.image,
            this.spriteX, this.spriteY, this.spriteW, this.spriteH,
            this.x - camera.x, this.y - camera.y, this.width, this.height
        );
    }
}
