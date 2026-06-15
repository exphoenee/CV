import GameObject from './GameObject.js';

export default class Npc extends GameObject {
  constructor({
    x,
    y,
    width,
    height,
    spriteWidth,
    spriteHeight,
    imageSrc,
    speed = 30,
    collisionBox,
  }) {
    super({
      x,
      y,
      width,
      height,
      spriteWidth,
      spriteHeight,
      imageSrc,
      solid: true,
      collisionBox,
    });

    this.speed = speed;
    this.dir = 'down'; // 'down', 'up', 'left', 'right'
    this.isMoving = false;

    // Wandering timers
    this.stateTimer = 0;
    this.stateDuration = 0;

    // Animation
    this.animFrame = 0;
    this.animTimer = 0;
    this.animSpeed = 0.2; // Wandering animation is slower

    // Health & damage
    this.health = 5;
    this.maxHealth = 5;
    this.isHit = false;
    this.hitTimer = 0;
    this.isDead = false;
    this.deathTimer = 0;
    this.deathAnimDone = false;
  }

  /**
   * Update NPC wander logic.
   */
  update(dt, world) {
    // Dead NPC: just count down death anim
    if (this.isDead) {
      this.deathTimer -= dt;
      if (this.deathTimer <= 0) {
        this.deathAnimDone = true;
      }
      return;
    }

    // Hit flash timer
    if (this.isHit) {
      this.hitTimer -= dt;
      if (this.hitTimer <= 0) this.isHit = false;
    }

    this.stateTimer += dt;

    // If state duration completed, choose a new wandering state
    if (this.stateTimer >= this.stateDuration) {
      this.stateTimer = 0;
      this.stateDuration = 1.5 + Math.random() * 2; // Random 1.5 - 3.5 seconds

      const roll = Math.random();
      if (roll < 0.4) {
        // Stand Idle
        this.isMoving = false;
      } else {
        // Move in a random direction
        this.isMoving = true;
        const dirRoll = Math.random();
        if (dirRoll < 0.25) this.dir = 'down';
        else if (dirRoll < 0.5) this.dir = 'up';
        else if (dirRoll < 0.75) this.dir = 'left';
        else this.dir = 'right';
      }
    }

    // Animate
    this.animTimer += dt;
    if (this.animTimer >= this.animSpeed) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % 4; // Animals typically have 4 frames
    }

    // Handle wandering movement with obstacle collisions
    if (this.isMoving) {
      let dx = 0;
      let dy = 0;
      if (this.dir === 'down') dy = 1;
      if (this.dir === 'up') dy = -1;
      if (this.dir === 'left') dx = -1;
      if (this.dir === 'right') dx = 1;

      const oldX = this.x;
      const oldY = this.y;

      this.x += dx * this.speed * dt;
      this.y += dy * this.speed * dt;

      // Simple boundary limit and obstacle collision check
      let collided = false;

      // Boundary collision
      if (
        this.x < 48 ||
        this.x > world.width - 48 - this.width ||
        this.y < 48 ||
        this.y > world.height - 48 - this.height
      ) {
        collided = true;
      }

      // Obstacle collision
      if (!collided) {
        for (const obs of world.obstacles) {
          if (obs.solid && this.collidesWith(obs)) {
            collided = true;
            break;
          }
        }
      }

      // Water tile collision
      if (!collided && world.map) {
        const rect = this.getCollisionRect();
        const minCol = Math.floor(rect.x / world.map.tileSize);
        const maxCol = Math.floor((rect.x + rect.width - 0.1) / world.map.tileSize);
        const minRow = Math.floor(rect.y / world.map.tileSize);
        const maxRow = Math.floor((rect.y + rect.height - 0.1) / world.map.tileSize);

        for (let r = minRow; r <= maxRow; r++) {
          for (let c = minCol; c <= maxCol; c++) {
            if (r < 0 || r >= world.map.grid.length || c < 0 || c >= world.map.grid[0].length) {
              collided = true;
              break;
            }
            const tileKey = world.map.grid[r][c];
            if (world.map.types[tileKey] && world.map.types[tileKey].solid) {
              collided = true;
              break;
            }
          }
          if (collided) break;
        }
      }

      if (collided) {
        this.x = oldX;
        this.y = oldY;
        // Instantly force state recalculation on collision so NPC doesn't get stuck
        this.stateTimer = this.stateDuration;
      }
    }
  }

  /**
   * Take 1 damage. Dies after health reaches 0.
   */
  takeDamage() {
    if (this.isDead || this.isHit) return;
    this.health = Math.max(0, this.health - 1);
    this.isHit = true;
    this.hitTimer = 0.25;

    if (this.health <= 0) {
      this.isDead = true;
      this.deathTimer = 0.8;
      this.solid = false;
      this.isMoving = false;
    }
  }

  /**
   * Draw animal spritesheet using 2‑row layout (idle / walk) with horizontal flip.
   * Row 0 = idle, Row 1 = walk. Two frames per row.
   * Flip horizontally when facing left.
   */
  draw(ctx, camera) {
    // Don't render if death animation is done
    if (this.isDead && this.deathAnimDone) return;

    if (!this.image || !this.isLoaded) {
      super.draw(ctx, camera);
      return;
    }

    const row = this.isMoving ? 1 : 0; // 0 idle, 1 walk
    const frame = this.animFrame % 2; // two frames per row
    const sourceX = frame * this.spriteWidth;
    const sourceY = row * this.spriteHeight;
    const drawX = this.x - camera.x;
    const drawY = this.y - camera.y;

    ctx.save();

    // Red flash when hit
    if (this.isHit) {
      ctx.filter = 'drop-shadow(0px 0px 6px rgba(255, 0, 0, 0.9))';
    }

    // Fade out during death
    if (this.isDead) {
      ctx.globalAlpha = Math.max(0, this.deathTimer / 0.8);
    }

    if (this.dir === 'right') {
      ctx.translate(drawX + this.width / 2, 0);
      ctx.scale(-1, 1);
      ctx.translate(-(drawX + this.width / 2), 0);
    }
    ctx.drawImage(
      this.image,
      sourceX,
      sourceY,
      this.spriteWidth,
      this.spriteHeight,
      drawX,
      drawY,
      this.width,
      this.height,
    );
    ctx.restore();
  }
}
