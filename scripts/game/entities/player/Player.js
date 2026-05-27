import GameObject from '../base/GameObject.js';
import { sfx } from '../../audio/sfx.js';

export default class Player extends GameObject {
    constructor({ x, y }) {
        super({
          x,
          y,
          width: 48,
          height: 48,
          spriteWidth: 32,
          spriteHeight: 32,
          imageSrc: "./assets/sprites/Cute/Player/Player.png",
          solid: true,
          ySortOffset: 0,
          collisionBox: {
            offsetX: 14,
            offsetY: 18,
            width: 18,
            height: 20,
          },
        });

        this.speed = 120; // Pixels per second
        this.dir = 'down'; // 'down', 'up', 'left', 'right'
        this.isMoving = false;

        // Animation variables
        this.animFrame = 0;
        this.animTimer = 0;
        this.animSpeed = 0.15; // Seconds per frame

        // Attack variables
        this.isAttacking = false;
        this.attackTimer = 0;
        this.attackDuration = 0.25; // 0.25 seconds attack swing
        this.attackCooldown = 0;
        this.attackRadius = 40; // Attack range

        // Combat stats
        this.health = 3;
        this.maxHealth = 3;
        this.isHit = false;
        this.hitTimer = 0;

        // Death state
        this.isDead = false;
        this.deathTimer = 0;
        this.deathAnimDone = false;
        this.respawnX = x;
        this.respawnY = y;

        // Footstep SFX
        this.stepTimer = 0;
        this.stepInterval = 0.35; // Seconds between footsteps
    }

    /**
     * Update Player logic.
     */
    update(dt, world) {
        // Handle player death state
        if (this.isDead) {
            this.deathTimer -= dt;
            // Play death animation (4 frames over 1.0s, then stay on frame 3)
            this.animFrame = Math.min(3, Math.floor(((2.0 - this.deathTimer) / 1.0) * 4));
            if (this.deathTimer <= 0) {
                this.deathAnimDone = true;
            }
            return; // Block actions during death
        }

        if (this.isHit) {
            this.hitTimer -= dt;
            if (this.hitTimer <= 0) {
                this.isHit = false;
            }
        }

        if (this.attackCooldown > 0) {
            this.attackCooldown -= dt;
        }

        if (this.isAttacking) {
            this.attackTimer -= dt;

            // Map attack frames precisely to attack timer (4 frames)
            this.animFrame = Math.min(3, Math.floor(((this.attackDuration - this.attackTimer) / this.attackDuration) * 4));

            if (this.attackTimer <= 0) {
                this.isAttacking = false;
            }
            return; // Freeze movement during attack
        }

        // 1. Gather movement inputs
        let dx = 0;
        let dy = 0;

        const keys = world.keys || {};
        if (keys['w'] || keys['W'] || keys['ArrowUp']) {
            dy = -1;
            this.dir = 'up';
        } else if (keys['s'] || keys['S'] || keys['ArrowDown']) {
            dy = 1;
            this.dir = 'down';
        }

        if (keys['a'] || keys['A'] || keys['ArrowLeft']) {
            dx = -1;
            this.dir = 'left';
        } else if (keys['d'] || keys['D'] || keys['ArrowRight']) {
            dx = 1;
            this.dir = 'right';
        }

        // Normalize vector for diagonal movement
        if (dx !== 0 && dy !== 0) {
            const len = Math.sqrt(dx * dx + dy * dy);
            dx /= len;
            dy /= len;
        }

        this.isMoving = (dx !== 0 || dy !== 0);

        // 2. Perform attack trigger
        if ((keys[' '] || keys['Spacebar']) && this.attackCooldown <= 0) {
            this.isAttacking = true;
            this.attackTimer = this.attackDuration;
            this.attackCooldown = 0.45; // Cooldown between swings
            this.animFrame = 0;
            this.isMoving = false;

            // Sword swipe SFX
            sfx.play('sword_swipe');

            // Perform attack collision check on enemies
            const hitAny = this.performAttack(world.enemies);
            if (hitAny) sfx.play('punch');
            return;
        }

        // 3. Move player and resolve collisions independently for X and Y axis
        if (this.isMoving) {
            // Update walk animation (6 frames)
            this.animTimer += dt;
            if (this.animTimer >= this.animSpeed) {
                this.animTimer = 0;
                this.animFrame = (this.animFrame + 1) % 6;
            }

            // Footstep SFX with timer
            this.stepTimer += dt;
            if (this.stepTimer >= this.stepInterval) {
                this.stepTimer = 0;
                const terrain = this.getTerrainAt(world.map);
                if (terrain === 'road') sfx.play('footsteps_road');
                else sfx.play('footsteps_grass');
            }

            // Move X
            const oldX = this.x;
            this.x += dx * this.speed * dt;
            if (this.checkCollisions(world.obstacles, world.map)) {
                this.x = oldX; // Block X movement
            }

            // Move Y
            const oldY = this.y;
            this.y += dy * this.speed * dt;
            if (this.checkCollisions(world.obstacles, world.map)) {
                this.y = oldY; // Block Y movement
            }

            // Keep within world boundaries
            this.x = Math.max(48, Math.min(this.x, world.width - 48 - this.width));
            this.y = Math.max(48, Math.min(this.y, world.height - 48 - this.height));
        } else {
            this.stepTimer = 0;
            // Idle animation (6 frames)
            this.animTimer += dt;
            if (this.animTimer >= this.animSpeed) {
                this.animTimer = 0;
                this.animFrame = (this.animFrame + 1) % 6;
            }
        }
    }

    /**
     * Checks if player overlaps with solid obstacles or background tiles (like water).
     */
    checkCollisions(obstacles, mapContext) {
        // 1. Obstacle collision
        for (const obs of obstacles) {
            if (obs.solid && this.collidesWith(obs)) {
                return true;
            }
        }

        // 2. Tile collision (water)
        if (mapContext) {
            const rect = this.getCollisionRect();
            const minCol = Math.floor(rect.x / mapContext.tileSize);
            const maxCol = Math.floor((rect.x + rect.width - 0.1) / mapContext.tileSize);
            const minRow = Math.floor(rect.y / mapContext.tileSize);
            const maxRow = Math.floor((rect.y + rect.height - 0.1) / mapContext.tileSize);

            for (let r = minRow; r <= maxRow; r++) {
                for (let c = minCol; c <= maxCol; c++) {
                    if (r < 0 || r >= mapContext.grid.length || c < 0 || c >= mapContext.grid[0].length) {
                        return true; // Out of bounds is solid
                    }
                    const tileKey = mapContext.grid[r][c];
                    if (mapContext.types[tileKey] && mapContext.types[tileKey].solid) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Returns the terrain type under the player's feet: 'grass', 'road', or 'water'.
     */
    getTerrainAt(mapContext) {
        if (!mapContext || !mapContext.grid) return 'grass';
        const feetX = this.x + this.width / 2;
        const feetY = this.y + this.height - 4;
        const col = Math.floor(feetX / mapContext.tileSize);
        const row = Math.floor(feetY / mapContext.tileSize);
        if (!mapContext.grid.length || row < 0 || row >= mapContext.grid.length || col < 0 || col >= mapContext.grid[0].length) return 'grass';
        const key = mapContext.grid[row][col];
        if (key === 'P') return 'road';
        if (key === 'W') return 'water';
        return 'grass';
    }

    /**
     * Attacking action: hits enemies within the directional hitbox.
     * Returns true if at least one enemy was hit.
     */
    performAttack(enemies) {
        // Calculate attack reach box
        const pBounds = this.getCollisionRect();
        const px = pBounds.x + pBounds.width / 2;
        const py = pBounds.y + pBounds.height / 2;

        let reachX = px;
        let reachY = py;

        if (this.dir === 'left') reachX -= this.attackRadius;
        if (this.dir === 'right') reachX += this.attackRadius;
        if (this.dir === 'up') reachY -= this.attackRadius;
        if (this.dir === 'down') reachY += this.attackRadius;

        let hitAny = false;
        for (const enemy of enemies) {
            if (enemy.health > 0) {
                const eBounds = enemy.getCollisionRect();
                const ex = eBounds.x + eBounds.width / 2;
                const ey = eBounds.y + eBounds.height / 2;

                const dist = Math.sqrt((reachX - ex) * (reachX - ex) + (reachY - ey) * (reachY - ey));
                if (dist <= this.attackRadius + 15) {
                    enemy.takeDamage();
                    hitAny = true;
                }
            }
        }
        return hitAny;
    }

    /**
     * Hit by enemy: reduces health and adds flashing feedback.
     */
    takeDamage() {
        if (this.isDead || this.isHit || this.debugMode) return;
        this.health = Math.max(0, this.health - 1);
        this.isHit = true;
        this.hitTimer = 0.5; // Red tint / invulnerability duration

        if (this.health <= 0) {
            this.isDead = true;
            this.deathTimer = 2.0; // Play death animation
            this.deathAnimDone = false;
            this.isMoving = false;
            this.isAttacking = false;
        }
    }

    /**
     * Respawns player
     */
    respawn() {
        this.x = this.respawnX;
        this.y = this.respawnY;
        this.health = this.maxHealth;
        this.isDead = false;
        this.isHit = false;
        this.dir = 'down';
        this.deathAnimDone = false;
        this.deathTimer = 0;
    }

    /**
     * Heal the player by 1 HP. Returns true if healed, false if already full.
     */
    heal() {
        if (this.health >= this.maxHealth) return false;
        this.health = Math.min(this.maxHealth, this.health + 1);
        return true;
    }

    /**
     * Draw Player with correct animation row.
     */
    draw(ctx, camera) {
        if (!this.image || !this.isLoaded) {
            super.draw(ctx, camera);
            return;
        }

        // Determine spritesheet row based on State & Direction
        let row = 0;
        let flipHorizontal = false;

        if (this.isDead) {
            row = 9; // Death animation
        } else if (this.isAttacking) {
            if (this.dir === 'down') row = 6;
            else if (this.dir === 'up') row = 8;
            else {
                row = 7; // Side attack (Right/Left)
                if (this.dir === 'left') flipHorizontal = true;
            }
        } else if (this.isMoving) {
            if (this.dir === 'down') row = 3;
            else if (this.dir === 'up') row = 5;
            else {
                row = 4; // Side walk (Right/Left)
                if (this.dir === 'left') flipHorizontal = true;
            }
        } else {
            // Idle rows
            if (this.dir === 'down') row = 0;
            else if (this.dir === 'up') row = 2;
            else {
                row = 1; // Side idle (Right/Left)
                if (this.dir === 'left') flipHorizontal = true;
            }
        }

        const sourceX = this.animFrame * this.spriteWidth;
        const sourceY = row * this.spriteHeight;

        ctx.save();

        // Red hit tint flash
        if (this.isHit) {
            ctx.filter = 'drop-shadow(0px 0px 5px rgba(255,0,0,0.8)) hue-rotate(-50deg)';
        }

        if (flipHorizontal) {
            const centerX = this.x - camera.x + this.width / 2;
            ctx.translate(centerX, 0);
            ctx.scale(-1, 1);
            ctx.translate(-centerX, 0);
        }

        ctx.drawImage(
            this.image,
            sourceX, sourceY,
            this.spriteWidth, this.spriteHeight,
            this.x - camera.x, this.y - camera.y,
            this.width, this.height
        );

        ctx.restore();

        // Draw Slash FX if attacking
        if (this.isAttacking) {
            this.drawAttackSlash(ctx, camera);
        }
    }

    /**
     * Draws a beautiful sword swing particle effect.
     */
    drawAttackSlash(ctx, camera) {
        const pBounds = this.getCollisionRect();
        const px = pBounds.x + pBounds.width / 2 - camera.x;
        const py = pBounds.y + pBounds.height / 2 - camera.y;

        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 112, 36, 0.35)';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';

        let startAngle = 0;
        let endAngle = 0;

        if (this.dir === 'left') {
            startAngle = Math.PI * 0.75;
            endAngle = Math.PI * 1.25;
        } else if (this.dir === 'right') {
            startAngle = -Math.PI * 0.25;
            endAngle = Math.PI * 0.25;
        } else if (this.dir === 'up') {
            startAngle = -Math.PI * 0.75;
            endAngle = -Math.PI * 0.25;
        } else if (this.dir === 'down') {
            startAngle = Math.PI * 0.25;
            endAngle = Math.PI * 0.75;
        }

        ctx.arc(px, py, this.attackRadius - 5, startAngle, endAngle);
        ctx.stroke();
    }
}
