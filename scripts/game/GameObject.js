/**
 * GameObject.js
 * Base class for all interactive and static entities in the 2.5D game world.
 */
export default class GameObject {
    constructor({
        x = 0,
        y = 0,
        width = 32,
        height = 32,
        spriteWidth = 32,
        spriteHeight = 32,
        imageSrc = '',
        solid = false,
        ySortOffset = 0,
        collisionBox = null
    } = {}) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;
        this.solid = solid;
        this.ySortOffset = ySortOffset; // Offset from bottom y for depth sorting
        
        // Define actual bounding box for physics collision
        this.collisionBox = collisionBox || {
            offsetX: 0,
            offsetY: 0,
            width: this.width,
            height: this.height
        };

        this.image = null;
        this.isLoaded = false;
        if (imageSrc) {
            this.image = new Image();
            this.image.src = imageSrc;
            this.image.onload = () => {
                this.isLoaded = true;
            };
        }
    }

    /**
     * Get the absolute AABB collision rectangle in world space.
     */
    getCollisionRect() {
        return {
            x: this.x + this.collisionBox.offsetX,
            y: this.y + this.collisionBox.offsetY,
            width: this.collisionBox.width,
            height: this.collisionBox.height
        };
    }

    /**
     * Update game object logic (called every frame).
     * @param {number} dt - Delta time in seconds.
     * @param {Object} world - Access to other world variables/entities.
     */
    update(dt, world) {
        // To be overridden by subclasses
    }

    /**
     * Draw the game object to the canvas.
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Object} camera 
     */
    draw(ctx, camera) {
        if (!this.image || !this.isLoaded) {
            // Draw placeholder box if image not loaded yet
            ctx.fillStyle = this.solid ? '#f00' : '#00f';
            ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
            return;
        }

        // Draw the full image by default
        ctx.drawImage(
            this.image,
            this.x - camera.x,
            this.y - camera.y,
            this.width,
            this.height
        );
        
        // Debug collision box (uncomment in dev if needed)
        /*
        const rect = this.getCollisionRect();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.strokeRect(rect.x - camera.x, rect.y - camera.y, rect.width, rect.height);
        */
    }

    /**
     * Checks if this object's collision box overlaps with another collision box.
     */
    collidesWith(other) {
        if (!this.solid || !other.solid) return false;
        const r1 = this.getCollisionRect();
        const r2 = other.getCollisionRect();
        return r1.x < r2.x + r2.width &&
               r1.x + r1.width > r2.x &&
               r1.y < r2.y + r2.height &&
               r1.y + r1.height > r2.y;
    }
}
