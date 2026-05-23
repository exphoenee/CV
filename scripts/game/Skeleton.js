import GameObject from './GameObject.js';

export default class Skeleton extends GameObject {
    constructor({ x, y }) {
        super({
            x,
            y,
            width: 48,
            height: 48,
            spriteWidth: 32,
            spriteHeight: 32,
            imageSrc: './assets/sprites/Cute/Enemies/Skeleton.png',
            solid: true,
            ySortOffset: 0,
            collisionBox: {
                offsetX: 12,
                offsetY: 28,
                width: 24,
                height: 20
            }
        });

        this.spawnX = x;
        this.spawnY = y;

        this.speed = 60; // Slightly slower than player
        this.dir = 'down';
        
        // Combat stats
        this.health = 3;
        this.isHit = false;
        this.hitTimer = 0;
        
        // AI States & attack animation variables
        this.detectionRadius = 140; // Proximity aggro range
        this.attackReach = 28;      // Distance at which skeleton attacks player/NPC
        this.attackCooldown = 0;
        this.isAttacking = false;
        this.attackTimer = 0;
        this.attackDuration = 0.3; // 0.3 seconds skeleton attack animation
        
        // Animation
        this.animFrame = 0;
        this.animTimer = 0;
        this.animSpeed = 0.15;
        this.isMoving = false;

        // Death tracking
        this.isDead = false;
        this.deathTimer = 0;
        this.deathAnimDone = false;

        // Patrol / wander within spawn radius
        this.wanderRadius = 120;
        this.wanderTimer = 0;
        this.wanderDuration = 0;
        this.wanderDir = { x: 0, y: 0 };
        this.isWandering = false;
        this._pickNewWander();
    }

    /**
     * Pick a new random wander direction and duration.
     */
    _pickNewWander() {
        this.wanderTimer = 0;
        const roll = Math.random();
        if (roll < 0.35) {
            // Idle for a while
            this.isWandering = false;
            this.wanderDuration = 1.5 + Math.random() * 2;
            this.wanderDir = { x: 0, y: 0 };
        } else {
            // Walk in a random direction
            this.isWandering = true;
            this.wanderDuration = 1.0 + Math.random() * 1.5;
            const angle = Math.random() * Math.PI * 2;
            this.wanderDir = { x: Math.cos(angle), y: Math.sin(angle) };
        }
    }

    /**
     * Find nearest target (player or NPC) within detection radius.
     * Returns { target, dist, cx, cy } or null.
     */
    _findNearestTarget(world) {
        const sBounds = this.getCollisionRect();
        const sx = sBounds.x + sBounds.width / 2;
        const sy = sBounds.y + sBounds.height / 2;

        let bestTarget = null;
        let bestDist = Infinity;
        let bestCx = 0;
        let bestCy = 0;

        // Check player
        const player = world.player;
        if (player && player.health > 0) {
            const pB = player.getCollisionRect();
            const px = pB.x + pB.width / 2;
            const py = pB.y + pB.height / 2;
            const d = Math.sqrt((px - sx) ** 2 + (py - sy) ** 2);
            if (d < bestDist) {
                bestTarget = player;
                bestDist = d;
                bestCx = px;
                bestCy = py;
            }
        }

        // Check NPCs (animals)
        if (world.npcs) {
            for (const npc of world.npcs) {
                const nB = npc.getCollisionRect();
                const nx = nB.x + nB.width / 2;
                const ny = nB.y + nB.height / 2;
                const d = Math.sqrt((nx - sx) ** 2 + (ny - sy) ** 2);
                if (d < bestDist) {
                    bestTarget = npc;
                    bestDist = d;
                    bestCx = nx;
                    bestCy = ny;
                }
            }
        }

        if (bestDist <= this.detectionRadius) {
            return { target: bestTarget, dist: bestDist, cx: bestCx, cy: bestCy };
        }
        return null;
    }

    /**
     * Skeleton AI Update Loop.
     */
    update(dt, world) {
        // --- Dead skeleton: play death anim then mark for removal ---
        if (this.isDead) {
            this.deathTimer -= dt;
            this.animFrame = Math.min(3, Math.floor(((1.0 - this.deathTimer) / 1.0) * 4));
            if (this.deathTimer <= 0) {
                this.deathAnimDone = true;
            }
            return;
        }

        // Damage visual timer
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
            this.animFrame = Math.min(3, Math.floor(((this.attackDuration - this.attackTimer) / this.attackDuration) * 4));
            if (this.attackTimer <= 0) {
                this.isAttacking = false;
            }
            return; // Pause movement during attack swing
        }

        // --- Find nearest target (player or NPC) ---
        const found = this._findNearestTarget(world);

        if (found && found.dist <= this.attackReach) {
            // Attack target
            this.isMoving = false;
            if (this.attackCooldown <= 0) {
                if (found.target.takeDamage) found.target.takeDamage();
                this.isAttacking = true;
                this.attackTimer = this.attackDuration;
                this.attackCooldown = 1.2;
            }
        } else if (found) {
            // Chase target
            this.isMoving = true;
            const sBounds = this.getCollisionRect();
            const sx = sBounds.x + sBounds.width / 2;
            const sy = sBounds.y + sBounds.height / 2;
            let dx = found.cx - sx;
            let dy = found.cy - sy;
            const len = Math.sqrt(dx * dx + dy * dy);
            dx /= len;
            dy /= len;

            if (Math.abs(dx) > Math.abs(dy)) {
                this.dir = dx < 0 ? 'left' : 'right';
            } else {
                this.dir = dy < 0 ? 'up' : 'down';
            }

            const oldX = this.x;
            this.x += dx * this.speed * dt;
            if (this.checkCollisions(world.obstacles, world.map)) this.x = oldX;

            const oldY = this.y;
            this.y += dy * this.speed * dt;
            if (this.checkCollisions(world.obstacles, world.map)) this.y = oldY;
        } else {
            // --- Patrol / wander near spawn point ---
            this.wanderTimer += dt;
            if (this.wanderTimer >= this.wanderDuration) {
                this._pickNewWander();
            }

            if (this.isWandering) {
                this.isMoving = true;

                // Check distance from spawn, if too far turn back
                const distFromSpawn = Math.sqrt((this.x - this.spawnX) ** 2 + (this.y - this.spawnY) ** 2);
                if (distFromSpawn > this.wanderRadius) {
                    // Head back towards spawn
                    const backX = this.spawnX - this.x;
                    const backY = this.spawnY - this.y;
                    const backLen = Math.sqrt(backX * backX + backY * backY);
                    this.wanderDir = { x: backX / backLen, y: backY / backLen };
                }

                if (Math.abs(this.wanderDir.x) > Math.abs(this.wanderDir.y)) {
                    this.dir = this.wanderDir.x < 0 ? 'left' : 'right';
                } else {
                    this.dir = this.wanderDir.y < 0 ? 'up' : 'down';
                }

                const oldX = this.x;
                this.x += this.wanderDir.x * this.speed * 0.4 * dt;
                if (this.checkCollisions(world.obstacles, world.map)) {
                    this.x = oldX;
                    this._pickNewWander();
                }

                const oldY = this.y;
                this.y += this.wanderDir.y * this.speed * 0.4 * dt;
                if (this.checkCollisions(world.obstacles, world.map)) {
                    this.y = oldY;
                    this._pickNewWander();
                }
            } else {
                this.isMoving = false;
            }
        }

        // Update animation frames (6 frames for walk/idle)
        this.animTimer += dt;
        if (this.animTimer >= this.animSpeed) {
            this.animTimer = 0;
            this.animFrame = (this.animFrame + 1) % 6;
        }
    }

    /**
     * Take 1 damage. Dies after 3 hits.
     */
    takeDamage() {
        if (this.isDead || this.isHit) return;
        this.health = Math.max(0, this.health - 1);
        this.isHit = true;
        this.hitTimer = 0.25;

        if (this.health <= 0) {
            this.isDead = true;
            this.deathTimer = 1.0;
            this.solid = false;
            this.isMoving = false;
            this.isAttacking = false;
        }
    }

    /**
     * Obstacle and boundary checking (including solid water tiles).
     */
    checkCollisions(obstacles, mapContext) {
        for (const obs of obstacles) {
            // Don't collide with self
            if (obs === this) continue;
            if (obs.solid && this.collidesWith(obs)) {
                return true;
            }
        }

        // Water tile collision
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
     * Draws the Skeleton with correct sprite frames.
     */
    draw(ctx, camera) {
        if (this.isDead && this.deathTimer <= 0) {
            // Fully dead and animation completed, do not render anymore
            return; 
        }

        if (!this.image || !this.isLoaded) {
            super.draw(ctx, camera);
            return;
        }

        // Row mapping:
        // Idle: Down=0, Side=1, Up=2
        // Walk: Down=3, Side=4, Up=5
        // Death: Row 6
        // Attack: Down=7, Side=8, Up=9
        let row = 0;
        let flipHorizontal = false;

        if (this.isDead) {
            row = 6;
        } else if (this.isAttacking) {
            if (this.dir === 'down') row = 7;
            else if (this.dir === 'up') row = 9;
            else {
                row = 8; // Side attack
                if (this.dir === 'left') flipHorizontal = true;
            }
        } else if (this.isMoving) {
            if (this.dir === 'down') row = 3;
            else if (this.dir === 'up') row = 5;
            else {
                row = 4; // Side walk
                if (this.dir === 'left') flipHorizontal = true;
            }
        } else {
            if (this.dir === 'down') row = 0;
            else if (this.dir === 'up') row = 2;
            else {
                row = 1; // Side idle
                if (this.dir === 'left') flipHorizontal = true;
            }
        }

        const sourceX = this.animFrame * this.spriteWidth;
        const sourceY = row * this.spriteHeight;

        ctx.save();
        
        // Red flashing visual feedback when hit
        if (this.isHit) {
            ctx.filter = 'drop-shadow(0px 0px 6px rgba(255, 0, 0, 0.9))';
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
    }
}
