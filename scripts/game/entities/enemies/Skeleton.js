import GameObject from '../base/GameObject.js';
import { sfx } from '../../audio/sfx.js';

export default class Skeleton extends GameObject {
    constructor({ x, y }) {
        super({
          x,
          y,
          width: 48,
          height: 48,
          spriteWidth: 32,
          spriteHeight: 32,
          imageSrc: "./assets/sprites/Cute/Enemies/Skeleton.png",
          solid: true,
          ySortOffset: 0,
          collisionBox: {
            offsetX: 14,
            offsetY: 18,
            width: 18,
            height: 20,
          },
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
        this.attackReach = 26;      // Center-to-center reach. <1 tile (32px), so a real
                                    // 1-tile gap is safe; a fleeing player (2x faster)
                                    // still steps out during the 0.3s windup (see _resolveAttack).
        this.attackCooldown = 1.0;  // Initial cooldown so new skeletons can't attack instantly
        this.isAttacking = false;
        this.attackTimer = 0;
        this.attackDuration = 0.3; // 0.3 seconds skeleton attack animation
        this._attackTarget = null; // Damage is resolved on connect, not on windup start

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
     * Check if there's a clear line of sight to the target (no solid obstacles in between).
     * Uses a precise segment-vs-AABB (slab method) intersection so even small obstacle
     * collision boxes block the attack — point sampling could step over tiny boxes.
     */
    _hasLineOfSight(target, obstacles) {
        const sRect = this.getCollisionRect();
        const sx = sRect.x + sRect.width / 2;
        const sy = sRect.y + sRect.height / 2;
        const tRect = target.getCollisionRect();
        const tx = tRect.x + tRect.width / 2;
        const ty = tRect.y + tRect.height / 2;

        const dx = tx - sx;
        const dy = ty - sy;
        if (dx * dx + dy * dy < 1) return true;

        for (const obs of obstacles) {
            if (obs === this) continue;
            if (!obs.solid) continue;
            const oRect = obs.getCollisionRect();
            if (this._segmentIntersectsRect(sx, sy, dx, dy, oRect)) {
                return false; // Blocked by obstacle
            }
        }
        return true;
    }

    /**
     * Segment (origin + direction*[0,1]) vs axis-aligned rectangle intersection.
     * Slab method — returns true if the segment crosses the rect.
     */
    _segmentIntersectsRect(ox, oy, dx, dy, rect) {
        let tMin = 0;
        let tMax = 1;

        // X slab
        if (dx === 0) {
            if (ox < rect.x || ox > rect.x + rect.width) return false;
        } else {
            let t1 = (rect.x - ox) / dx;
            let t2 = (rect.x + rect.width - ox) / dx;
            if (t1 > t2) { const tmp = t1; t1 = t2; t2 = tmp; }
            tMin = Math.max(tMin, t1);
            tMax = Math.min(tMax, t2);
            if (tMin > tMax) return false;
        }

        // Y slab
        if (dy === 0) {
            if (oy < rect.y || oy > rect.y + rect.height) return false;
        } else {
            let t1 = (rect.y - oy) / dy;
            let t2 = (rect.y + rect.height - oy) / dy;
            if (t1 > t2) { const tmp = t1; t1 = t2; t2 = tmp; }
            tMin = Math.max(tMin, t1);
            tMax = Math.min(tMax, t2);
            if (tMin > tMax) return false;
        }

        return true;
    }

    /**
     * Resolve a swing at the end of the windup. Damage only lands if the target
     * is still within attackReach and in line of sight — otherwise the swing whiffs
     * (lets a fleeing player actually escape).
     */
    _resolveAttack(world) {
        const tgt = this._attackTarget;
        this._attackTarget = null;
        if (!tgt || !tgt.takeDamage || tgt.health <= 0) return;

        const sR = this.getCollisionRect();
        const sx = sR.x + sR.width / 2;
        const sy = sR.y + sR.height / 2;
        const tR = tgt.getCollisionRect();
        const tx = tR.x + tR.width / 2;
        const ty = tR.y + tR.height / 2;
        const dist = Math.sqrt((tx - sx) ** 2 + (ty - sy) ** 2);

        if (dist <= this.attackReach && this._hasLineOfSight(tgt, world.obstacles)) {
            tgt.takeDamage();
        }
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
                // Resolve damage on connect (end of windup): only if the target is
                // STILL in reach and visible. A fleeing target (player is faster)
                // can step out of range during the 0.3s swing and dodge the hit.
                this._resolveAttack(world);
            }
            return; // Pause movement during attack swing
        }

        // --- Find nearest target (player or NPC) ---
        const found = this._findNearestTarget(world);

        if (found && found.dist <= this.attackReach) {
            // Begin attack windup; damage lands on connect (see _resolveAttack).
            this.isMoving = false;
            if (this.attackCooldown <= 0) {
                // Check line of sight: can't attack through walls, fences, trees, etc.
                if (this._hasLineOfSight(found.target, world.obstacles)) {
                    this.isAttacking = true;
                    this.attackTimer = this.attackDuration;
                    this.attackCooldown = 1.2;
                    this._attackTarget = found.target;
                }
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
            this._attackTarget = null; // Cancel any in-progress swing
            sfx.play('skeleton_death');
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
