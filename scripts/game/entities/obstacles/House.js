import GameObject from '../base/GameObject.js';

const HOUSE_LABELS = {
    'welcome': { shortLabel: 'Personal HQ', period: 'Contact Info' },
    'webforsol': { shortLabel: 'WebforSol', period: '2020 - 2022' },
    'cobotx': { shortLabel: 'CobotX', period: '2021 - 2022' },
    'cubicfox': { shortLabel: 'Cubicfox', period: '2022 - 2023' },
    'scolia': { shortLabel: 'Scolia', period: '2023' },
    'telekom': { shortLabel: 'D. Telekom', period: '2023' },
    'aegex': { shortLabel: 'Aegex (Current)', period: '2023 - Present' },
    'education': { shortLabel: 'Education', period: 'Bio & Projects' }
};

export default class House extends GameObject {
    constructor({ x, y, stationId, cvTitle, cvContent, tech }) {
        super({
          x,
          y,
          width: 96,
          height: 128,
          spriteWidth: 96,
          spriteHeight: 128,
          imageSrc:
            "./assets/sprites/Cute/Outdoor decoration/House_1_Wood_Base_Blue.png",
          solid: true,
          ySortOffset: 0,
          collisionBox: {
            offsetX: 15,
            offsetY: 58,
            width: 65,
            height: 55, // The lower house walls are solid
          },
        });

        this.stationId = stationId;
        this.cvTitle = cvTitle;
        this.cvContent = cvContent;
        this.tech = tech;

        const labels = HOUSE_LABELS[stationId] || { shortLabel: cvTitle, period: '' };
        this.shortLabel = labels.shortLabel;
        this.period = labels.period;

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
     * Draws house sprite and floating nameplate label above.
     */
    draw(ctx, camera) {
        super.draw(ctx, camera);

        // Only show label when player is close
        const dx = this.x + this.width / 2 - camera.playerX;
        const dy = this.y + this.height / 2 - camera.playerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 160) return;

        // Draw floating nameplate above the house
        const screenX = this.x + this.width / 2 - camera.x;
        const screenY = this.y - camera.y; // Top of the house

        ctx.save();

        // Font setup - retro Press Start 2P at 6px is standard and sharp
        ctx.font = '6px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const titleText = this.shortLabel;
        const subText = this.period;

        // Measure text sizes
        const titleWidth = ctx.measureText(titleText).width;
        const subWidth = ctx.measureText(subText).width;
        const maxTextWidth = Math.max(titleWidth, subWidth);

        // Label dimensions
        const paddingX = 8;
        const paddingY = 6;
        const boxWidth = maxTextWidth + paddingX * 2;
        const boxHeight = subText ? 20 : 12;
        const boxX = screenX - boxWidth / 2;
        const boxY = screenY - boxHeight - 8; // Float 8px above the roof

        // Draw Glassmorphic/Retro dark container box
        ctx.fillStyle = 'rgba(10, 12, 16, 0.85)';
        ctx.strokeStyle = 'rgba(255, 112, 36, 0.8)'; // Orange accent border
        ctx.lineWidth = 1;

        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 4);
        } else {
            ctx.rect(boxX, boxY, boxWidth, boxHeight);
        }
        ctx.fill();
        ctx.stroke();

        // Draw Text
        if (subText) {
            // Two-line layout
            ctx.fillStyle = '#ffffff'; // White for workplace/title
            ctx.fillText(titleText, screenX, boxY + 6);

            ctx.fillStyle = '#ff7024'; // Orange for dates/period
            ctx.fillText(subText, screenX, boxY + 14);
        } else {
            // Single line layout
            ctx.fillStyle = '#ffffff';
            ctx.fillText(titleText, screenX, boxY + 6);
        }

        ctx.restore();
    }
}
