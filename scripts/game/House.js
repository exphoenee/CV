import GameObject from './GameObject.js';

export default class House extends GameObject {
    constructor({ x, y, stationId, cvTitle, cvContent, tech }) {
        super({
            x,
            y,
            width: 96,
            height: 128,
            spriteWidth: 96,
            spriteHeight: 128,
            imageSrc: './assets/sprites/Cute/Outdoor decoration/House_1_Wood_Base_Blue.png',
            solid: true,
            ySortOffset: 0,
            collisionBox: {
                offsetX: 6,
                offsetY: 80,
                width: 84,
                height: 48 // The lower house walls are solid
            }
        });

        this.stationId = stationId;
        this.cvTitle = cvTitle;
        this.cvContent = cvContent;
        this.tech = tech;

        // Custom Doorway Trigger Area in World Space
        this.doorOffsetX = 36;
        this.doorOffsetY = 110;
        this.doorWidth = 24;
        this.doorHeight = 20;
    }

    /**
     * Checks if a player has stepped into the doorway of this house.
     */
    checkDoorTrigger(player) {
        const pBounds = player.getCollisionRect();
        const doorX = this.x + this.doorOffsetX;
        const doorY = this.y + this.doorOffsetY;

        // AABB overlap check for player and door trigger area
        return pBounds.x < doorX + this.doorWidth &&
               pBounds.x + pBounds.width > doorX &&
               pBounds.y < doorY + this.doorHeight &&
               pBounds.y + pBounds.height > doorY;
    }

    /**
     * Debug: Draws door trigger box in addition to house image (optional).
     */
    draw(ctx, camera) {
        super.draw(ctx, camera);
        
        // Debug: Show door trigger area (uncomment for developer testing)
        /*
        ctx.fillStyle = 'rgba(0, 255, 0, 0.4)';
        ctx.fillRect(
            this.x + this.doorOffsetX - camera.x,
            this.y + this.doorOffsetY - camera.y,
            this.doorWidth,
            this.doorHeight
        );
        */
    }
}
