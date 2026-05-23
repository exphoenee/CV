import {
  TILE_TYPES,
  MAP_GRID,
  TILE_SIZE,
  TILE_SHEET_TILE_SIZE,
  SHEET_TILE_FRAMES,
  MAP_WIDTH,
  MAP_HEIGHT,
  MAP_OFFSET_COL,
  MAP_OFFSET_ROW,
  FULL_MAP_GRID,
} from "./map.js";
import {CV_STATIONS} from "./stations.js";
import {ENTITY_SPAWNS} from "./spawns.js";
import Player from "./Player.js";
import Skeleton from "./Skeleton.js";
import Chicken from "./Chicken.js";
import Cow from "./Cow.js";
import Pig from "./Pig.js";
import Sheep from "./Sheep.js";
import Tree from "./Tree.js";
import Fence from "./Fence.js";
import Chest from "./Chest.js";
import House from "./House.js";

class GameEngine {
  constructor() {
    this.canvas = document.getElementById("game-canvas");
    this.ctx = this.canvas.getContext("2d");

    // Setup internal virtual resolution (640x360 for perfect pixel-art scale)
    this.virtualWidth = 640;
    this.virtualHeight = 360;
    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());

    // Keyboard inputs
    this.keys = {};
    this.setupKeyboardListeners();

    // Game states
    this.isFrozen = false;
    this.lastTime = 0;

    // World parameters
    this.cols = MAP_WIDTH;
    this.rows = MAP_HEIGHT;
    this.width = this.cols * TILE_SIZE;
    this.height = this.rows * TILE_SIZE;

    // Camera
    this.camera = {x: 0, y: 0};

    // Lists
    this.obstacles = []; // House, Tree, Fence, Chest
    this.enemies = []; // Skeletons
    this.npcs = []; // Animals
    this.player = null;
    this.gameObjects = []; // All objects for y-sorting

    // Spawn system
    this.maxEnemies = 10;
    this.enemySpawnTimer = 0;
    this.enemySpawnInterval = this._randomInterval(20, 50);

    this.maxNpcs = 10;
    this.npcSpawnTimer = 0;
    this.npcSpawnInterval = this._randomInterval(30, 50);

    // Image resources cache
    this.tileImages = {};
    this.loadedCount = 0;
    this.totalAssets = 0;
    this.isAssetsReady = false;

    this.init();
  }

  /**
   * Fit virtual canvas on screen, maintaining crisp pixel scaling.
   */
  resizeCanvas() {
    const container = document.getElementById("canvas-container");
    const wrapper = document.getElementById("game-wrapper");
    if (!container || !wrapper) return;

    const w = container.clientWidth;
    const h = container.clientHeight;

    // Find best aspect-ratio-fit scaling multiplier
    const scaleX = w / this.virtualWidth;
    const scaleY = h / this.virtualHeight;
    const scale = Math.min(scaleX, scaleY);

    // Apply crisp scale
    this.canvas.width = this.virtualWidth;
    this.canvas.height = this.virtualHeight;

    // Scale the wrapper wrapper to center and keep relative overlays perfect
    wrapper.style.width = `${this.virtualWidth * scale}px`;
    wrapper.style.height = `${this.virtualHeight * scale}px`;

    // Enable crisp rendering
    this.ctx.imageSmoothingEnabled = false;
  }

  /**
   * Preload tile and static decoration texture assets.
   */
  preloadAssets(callback) {
    const tilesToLoad = Object.keys(TILE_TYPES);
    this.totalAssets = tilesToLoad.length;

    if (this.totalAssets === 0) {
      this.isAssetsReady = true;
      callback();
      return;
    }

    tilesToLoad.forEach((tileKey) => {
      const img = new Image();
      img.src = TILE_TYPES[tileKey].src;
      img.onload = () => {
        this.tileImages[tileKey] = img;
        this.loadedCount++;
        if (this.loadedCount >= this.totalAssets) {
          this.isAssetsReady = true;
          callback();
        }
      };
    });
  }

  /**
   * Start loading and build game assets.
   */
  init() {
    this.preloadAssets(() => {
      this.buildWorld();
      this.setupDialogueListeners();
      this.setupPauseMenuListeners();
      // Start main loops
      requestAnimationFrame((time) => this.loop(time));
    });
  }

  /**
   * Construct entities, houses, and obstacles.
   */
  buildWorld() {
    // 1. Spawn Player
    this.player = new Player(ENTITY_SPAWNS.player);

    // 2. Spawn CV Stations (Houses)
    CV_STATIONS.forEach((station) => {
      const house = new House({
        x: station.x,
        y: station.y,
        stationId: station.id,
        cvTitle: station.title,
        cvContent: station.content,
        tech: station.tech,
      });
      this.obstacles.push(house);
    });

    // 3. Spawn static obstacles (Trees, Fences, Chests)
    ENTITY_SPAWNS.decorations.forEach((decor) => {
      let obj = null;
      if (decor.type === "Tree") obj = new Tree({x: decor.x, y: decor.y});
      else if (decor.type === "Fence")
        obj = new Fence({x: decor.x, y: decor.y});
      else if (decor.type === "Chest")
        obj = new Chest({x: decor.x, y: decor.y});

      if (obj) this.obstacles.push(obj);
    });

    // 4. Spawn NPCs (Chicken, Cow, Pig, Sheep)
    ENTITY_SPAWNS.npcs.forEach((npcSpawn) => {
      let animal = null;
      if (npcSpawn.type === "Chicken")
        animal = new Chicken({x: npcSpawn.x, y: npcSpawn.y});
      else if (npcSpawn.type === "Cow")
        animal = new Cow({x: npcSpawn.x, y: npcSpawn.y});
      else if (npcSpawn.type === "Pig")
        animal = new Pig({x: npcSpawn.x, y: npcSpawn.y});
      else if (npcSpawn.type === "Sheep")
        animal = new Sheep({x: npcSpawn.x, y: npcSpawn.y});

      if (animal) this.npcs.push(animal);
    });

    // 5. Spawn Enemies (Skeletons)
    ENTITY_SPAWNS.enemies.forEach((enemySpawn) => {
      const skeleton = new Skeleton({x: enemySpawn.x, y: enemySpawn.y});
      this.enemies.push(skeleton);
    });

    // 6. Concatenate everything to render list
    this.rebuildGameObjectList();
  }

  /**
   * Consolidate game objects for rendering sorting.
   */
  rebuildGameObjectList() {
    this.gameObjects = [
      this.player,
      ...this.obstacles,
      ...this.npcs,
      ...this.enemies,
    ];
  }

  /**
   * Generate a random interval between min and max seconds.
   */
  _randomInterval(min, max) {
    return min + Math.random() * (max - min);
  }

  /**
   * Find a random walkable (non-solid) tile position on the map.
   */
  _findRandomSpawnPos() {
    const maxAttempts = 50;
    for (let i = 0; i < maxAttempts; i++) {
      const col = 1 + Math.floor(Math.random() * (this.cols - 2));
      const row = 1 + Math.floor(Math.random() * (this.rows - 2));
      const tileKey = this.getMapTileKey(row, col);
      if (TILE_TYPES[tileKey] && !TILE_TYPES[tileKey].solid) {
        return {x: col * TILE_SIZE, y: row * TILE_SIZE};
      }
    }
    return {x: 200, y: 200}; // Fallback
  }

  /**
   * Spawn a new skeleton at a random valid position.
   */
  spawnSkeleton() {
    const pos = this._findRandomSpawnPos();
    const skeleton = new Skeleton({x: pos.x, y: pos.y});
    this.enemies.push(skeleton);
    this.rebuildGameObjectList();
  }

  /**
   * Spawn a random NPC animal at a random valid position.
   */
  spawnNpc() {
    const pos = this._findRandomSpawnPos();
    const types = [Chicken, Cow, Pig, Sheep];
    const AnimalClass = types[Math.floor(Math.random() * types.length)];
    const animal = new AnimalClass({x: pos.x, y: pos.y});
    this.npcs.push(animal);
    this.rebuildGameObjectList();
  }

  /**
   * Remove dead entities whose death animations are finished.
   */
  cleanupDead() {
    const enemiesBefore = this.enemies.length;
    const npcsBefore = this.npcs.length;

    this.enemies = this.enemies.filter((e) => !e.deathAnimDone);
    this.npcs = this.npcs.filter((n) => !n.deathAnimDone);

    if (
      this.enemies.length !== enemiesBefore ||
      this.npcs.length !== npcsBefore
    ) {
      this.rebuildGameObjectList();
    }
  }

  /**
   * Map keyboard arrow keys and prevent page scrolling.
   */
  setupKeyboardListeners() {
    window.addEventListener("keydown", (e) => {
      this.keys[e.key] = true;

      // Prevent scroll on Space/Arrows
      if (
        [" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        e.preventDefault();
      }

      // ESC listener to toggle pause menu
      if (e.key === "Escape") {
        const diagOverlay = document.getElementById("dialogue-overlay");
        if (diagOverlay && diagOverlay.classList.contains("dialogue-visible")) {
          this.closeDialogue();
          return;
        }

        this.togglePauseMenu();
      }
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.key] = false;
    });
  }

  /**
   * Wire up dialogue interface triggers and scrolling.
   */
  setupDialogueListeners() {
    const upBtn = document.getElementById("btn-scroll-up");
    const downBtn = document.getElementById("btn-scroll-down");
    const exitBtn = document.getElementById("btn-scroll-exit");
    const textBox = document.getElementById("dialogue-text");

    if (upBtn && textBox) {
      upBtn.addEventListener("click", () => {
        textBox.scrollBy({top: -60, behavior: "smooth"});
      });
    }

    if (downBtn && textBox) {
      downBtn.addEventListener("click", () => {
        textBox.scrollBy({top: 60, behavior: "smooth"});
      });
    }

    if (exitBtn) {
      exitBtn.addEventListener("click", () => {
        this.closeDialogue();
      });
    }
  }

  /**
   * Pause / Resume Game Menus
   */
  togglePauseMenu() {
    const pauseMenu = document.getElementById("pause-menu");
    if (!pauseMenu) return;

    const isPaused = pauseMenu.classList.contains("dialogue-visible");
    if (isPaused) {
      this.resumeGame();
    } else {
      this.pauseGame();
    }
  }

  pauseGame() {
    const pauseMenu = document.getElementById("pause-menu");
    if (!pauseMenu) return;

    this.isFrozen = true;
    pauseMenu.classList.remove("dialogue-hidden");
    pauseMenu.classList.add("dialogue-visible");
  }

  resumeGame() {
    const pauseMenu = document.getElementById("pause-menu");
    if (!pauseMenu) return;

    pauseMenu.classList.remove("dialogue-visible");
    pauseMenu.classList.add("dialogue-hidden");

    // Close dropdown
    const customSelect = document.getElementById("game-genre-select");
    if (customSelect) customSelect.classList.remove("open");

    this.isFrozen = false;
  }

  /**
   * Wire up Pause Menu resume/backdrop elements and music player events.
   */
  setupPauseMenuListeners() {
    const resumeBtn = document.getElementById("btn-resume-game");
    const backdrop = document.getElementById("pause-backdrop");

    if (resumeBtn) {
      resumeBtn.addEventListener("click", () => this.resumeGame());
    }
    if (backdrop) {
      backdrop.addEventListener("click", () => this.resumeGame());
    }

    // Music Player Setup
    const audio = document.getElementById("game-music-audio");
    const playPauseBtn = document.getElementById("game-music-playpause");
    const customSelect = document.getElementById("game-genre-select");
    const volumeSlider = document.getElementById("game-music-volume");

    if (!customSelect || !audio || !playPauseBtn) return;

    const trigger = customSelect.querySelector(".custom-select-trigger");
    const triggerText = trigger.querySelector("span");
    const options = customSelect.querySelectorAll(".custom-option");

    let isPlaying = false;
    let currentValue = options[0].getAttribute("data-value");
    let currentLabel = options[0].textContent;

    // Restore saved volume preference
    const savedVolume = localStorage.getItem("cv-music-volume");
    if (savedVolume !== null) {
      audio.volume = parseFloat(savedVolume);
      if (volumeSlider) volumeSlider.value = savedVolume;
    } else {
      audio.volume = 0.5;
      if (volumeSlider) volumeSlider.value = 0.5;
    }

    if (volumeSlider) {
      volumeSlider.addEventListener("input", (e) => {
        const vol = parseFloat(e.target.value);
        audio.volume = vol;
        localStorage.setItem("cv-music-volume", vol);
      });
    }

    // Restore saved preference
    const savedGenre = localStorage.getItem("cv-music-genre");
    if (savedGenre) {
      for (let i = 0; i < options.length; i++) {
        if (options[i].getAttribute("data-value") === savedGenre) {
          currentValue = savedGenre;
          currentLabel = options[i].textContent;
          break;
        }
      }
    }
    triggerText.textContent = currentLabel;

    const loadTrack = () => {
      if (!audio.src || !audio.src.endsWith(currentValue)) {
        audio.src = currentValue;
        audio.load();
      }
    };

    const updatePlayPause = () => {
      playPauseBtn.textContent = isPlaying ? "⏸ Pause" : "▶ Play";
    };

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      customSelect.classList.toggle("open");
    });

    document.addEventListener("click", (e) => {
      if (!customSelect.contains(e.target)) {
        customSelect.classList.remove("open");
      }
    });

    options.forEach((opt) => {
      opt.addEventListener("click", (e) => {
        currentValue = e.target.getAttribute("data-value");
        currentLabel = e.target.textContent;
        triggerText.textContent = currentLabel;
        customSelect.classList.remove("open");

        localStorage.setItem("cv-music-genre", currentValue);
        const wasPlaying = isPlaying;

        audio.pause();
        isPlaying = false;
        loadTrack();

        if (wasPlaying) {
          audio
            .play()
            .then(() => {
              isPlaying = true;
              updatePlayPause();
            })
            .catch(() => {});
        }
        updatePlayPause();
      });
    });

    playPauseBtn.addEventListener("click", () => {
      if (isPlaying) {
        audio.pause();
        isPlaying = false;
      } else {
        loadTrack();
        audio
          .play()
          .then(() => {
            isPlaying = true;
            updatePlayPause();
          })
          .catch(() => {});
      }
      updatePlayPause();
    });

    audio.addEventListener("ended", () => {
      isPlaying = false;
      updatePlayPause();
    });

    // Try autoplaying default/saved music, with fallback for browser interaction policy
    loadTrack();
    audio
      .play()
      .then(() => {
        isPlaying = true;
        updatePlayPause();
      })
      .catch(() => {
        // Autoplay was blocked: wait for first user interaction (click/keydown) to play
        const startOnInteraction = () => {
          loadTrack();
          audio
            .play()
            .then(() => {
              isPlaying = true;
              updatePlayPause();
            })
            .catch(() => {});
          window.removeEventListener("click", startOnInteraction);
          window.removeEventListener("keydown", startOnInteraction);
        };
        window.addEventListener("click", startOnInteraction);
        window.addEventListener("keydown", startOnInteraction);
        updatePlayPause();
      });
  }

  /**
   * Lock game loop and trigger a glassmorphic CV station popup.
   */
  enterHouse(house) {
    this.isFrozen = true;

    // Populate dialogue elements
    document.getElementById("dialogue-title").innerText = house.cvTitle;
    document.getElementById("dialogue-tech").innerText = house.tech;

    const textBox = document.getElementById("dialogue-text");
    textBox.innerHTML = house.cvContent;
    textBox.scrollTop = 0; // Reset scroll position

    // Show Overlay
    const overlay = document.getElementById("dialogue-overlay");
    overlay.classList.remove("dialogue-hidden");
    overlay.classList.add("dialogue-visible");
  }

  /**
   * Unfreeze game and displace player downwards away from the doorway.
   */
  closeDialogue() {
    const overlay = document.getElementById("dialogue-overlay");
    overlay.classList.remove("dialogue-visible");
    overlay.classList.add("dialogue-hidden");

    this.isFrozen = false;

    // Displace player slightly down to prevent immediately re-triggering doorway overlap
    this.player.y += 18;
  }

  /**
   * Main Animation Game Loop.
   */
  loop(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;
    let dt = (timestamp - this.lastTime) / 1000;

    // Cap dt to prevent massive jumps when switching tabs
    if (dt > 0.1) dt = 0.1;
    this.lastTime = timestamp;

    if (!this.isFrozen) {
      this.update(dt);
    }
    this.draw();

    requestAnimationFrame((time) => this.loop(time));
  }

  /**
   * Update active positions, boundaries, and door hits.
   */
  update(dt) {
    const worldContext = {
      width: this.width,
      height: this.height,
      obstacles: this.obstacles,
      enemies: this.enemies,
      npcs: this.npcs,
      player: this.player,
      keys: this.keys,
      map: {
        grid: FULL_MAP_GRID,
        types: TILE_TYPES,
        tileSize: TILE_SIZE,
      },
    };

    // 1. Update entities
    this.player.update(dt, worldContext);

    this.npcs.forEach((npc) => npc.update(dt, worldContext));
    this.enemies.forEach((enemy) => enemy.update(dt, worldContext));

    // 2. Cleanup dead entities
    this.cleanupDead();

    // 3. Spawn new skeletons
    this.enemySpawnTimer += dt;
    if (
      this.enemySpawnTimer >= this.enemySpawnInterval &&
      this.enemies.length < this.maxEnemies
    ) {
      this.spawnSkeleton();
      this.enemySpawnTimer = 0;
      this.enemySpawnInterval = this._randomInterval(20, 50);
    }

    // 4. Spawn new NPCs
    this.npcSpawnTimer += dt;
    if (
      this.npcSpawnTimer >= this.npcSpawnInterval &&
      this.npcs.length < this.maxNpcs
    ) {
      this.spawnNpc();
      this.npcSpawnTimer = 0;
      this.npcSpawnInterval = this._randomInterval(30, 50);
    }

    // 5. Check door triggers for entering CV Stations
    for (const obs of this.obstacles) {
      if (obs instanceof House && obs.checkDoorTrigger(this.player)) {
        this.enterHouse(obs);
        break;
      }
    }

    // 6. Check chest healing triggers (using proximity check)
    for (const obs of this.obstacles) {
      if (obs instanceof Chest && !obs.isUsed) {
        const pRect = this.player.getCollisionRect();
        const oRect = obs.getCollisionRect();
        const pCenterX = pRect.x + pRect.width / 2;
        const pCenterY = pRect.y + pRect.height / 2;
        const oCenterX = oRect.x + oRect.width / 2;
        const oCenterY = oRect.y + oRect.height / 2;

        const dist = Math.hypot(pCenterX - oCenterX, pCenterY - oCenterY);
        if (dist < 36) {
          obs.tryHeal(this.player);
        }
      }
    }

    // 3. Smooth Camera Tracking on Player
    const targetCamX =
      this.player.x + this.player.width / 2 - this.virtualWidth / 2;
    const targetCamY =
      this.player.y + this.player.height / 2 - this.virtualHeight / 2;

    this.camera.x += (targetCamX - this.camera.x) * 0.1;
    this.camera.y += (targetCamY - this.camera.y) * 0.1;

    // Bind camera to world edges
    this.camera.x = Math.max(
      0,
      Math.min(this.camera.x, this.width - this.virtualWidth),
    );
    this.camera.y = Math.max(
      0,
      Math.min(this.camera.y, this.height - this.virtualHeight),
    );
  }

  /**
   * Render the visual layers.
   */
  draw() {
    this.ctx.clearRect(0, 0, this.virtualWidth, this.virtualHeight);

    // 1. Render Tilemap background layer
    this.drawTiles();

    // 2. Render all entities y-sorted for 2.5D depth ordering
    // Sort objects based on the bottom line of their AABB collision box (depth height)
    this.gameObjects.sort((a, b) => {
      const aBottom = a.y + a.height + a.ySortOffset;
      const bBottom = b.y + b.height + b.ySortOffset;
      return aBottom - bBottom;
    });

    this.gameObjects.forEach((obj) => {
      obj.draw(this.ctx, this.camera);
    });

    // 3. Draw Player HUD / Life Hearts
    this.drawHUD();
  }

  /**
   * Render repeating tile grids.
   */
  drawTiles() {
    const startCol = Math.floor(this.camera.x / TILE_SIZE);
    const endCol = Math.ceil((this.camera.x + this.virtualWidth) / TILE_SIZE);
    const startRow = Math.floor(this.camera.y / TILE_SIZE);
    const endRow = Math.ceil((this.camera.y + this.virtualHeight) / TILE_SIZE);

    for (let r = Math.max(0, startRow); r < Math.min(this.rows, endRow); r++) {
      for (
        let c = Math.max(0, startCol);
        c < Math.min(this.cols, endCol);
        c++
      ) {
        let tileKey = this.getMapTileKey(r, c);
        const img = this.tileImages[tileKey];
        if (!img) continue;

        const frame = this.getTileFrame(tileKey, r, c);
        if (frame) {
          this.ctx.drawImage(
            img,
            frame.x,
            frame.y,
            TILE_SHEET_TILE_SIZE,
            TILE_SHEET_TILE_SIZE,
            c * TILE_SIZE - this.camera.x,
            r * TILE_SIZE - this.camera.y,
            TILE_SIZE,
            TILE_SIZE,
          );
        } else {
          this.ctx.drawImage(
            img,
            c * TILE_SIZE - this.camera.x,
            r * TILE_SIZE - this.camera.y,
            TILE_SIZE,
            TILE_SIZE,
          );
        }
      }
    }
  }

  getTileFrame(tileKey, row, col) {
    const tileType = TILE_TYPES[tileKey];
    if (!tileType || !tileType.sheet) return null;

    if (tileType.type === "path") {
      return this.getPathTileFrame(row, col);
    }
    if (tileType.type === "water") {
      return this.getWaterTileFrame(row, col);
    }
    if (tileType.type === "cliff") {
      return this.getCliffTileFrame(row, col);
    }

    return null;
  }

  getPathTileFrame(row, col) {
    const north = this.isPathTile(row - 1, col);
    const south = this.isPathTile(row + 1, col);
    const west = this.isPathTile(row, col - 1);
    const east = this.isPathTile(row, col + 1);

    const mask =
      (north ? 8 : 0) | (east ? 4 : 0) | (south ? 2 : 0) | (west ? 1 : 0);

    switch (mask) {
      case 0:
        return SHEET_TILE_FRAMES.straightH; // isolated
      case 1: // W
        return SHEET_TILE_FRAMES.edgeW;
      case 2: // S
        return SHEET_TILE_FRAMES.edgeS;
      case 3: // S+W
        return SHEET_TILE_FRAMES.cornerBL;
      case 4: // E
        return SHEET_TILE_FRAMES.edgeE;
      case 5: // E+W
        return SHEET_TILE_FRAMES.straightH;
      case 6: // S+E
        return SHEET_TILE_FRAMES.cornerBR;
      case 7: // S+E+W
        return SHEET_TILE_FRAMES.innerBR;
      case 8: // N
        return SHEET_TILE_FRAMES.edgeN;
      case 9: // N+W
        return SHEET_TILE_FRAMES.cornerTL;
      case 10: // N+S
        return SHEET_TILE_FRAMES.straightV;
      case 11: // N+S+W or N+E+W depending
        return SHEET_TILE_FRAMES.innerBL;
      case 12: // N+E
        return SHEET_TILE_FRAMES.cornerTR;
      case 13: // N+E+W
        return SHEET_TILE_FRAMES.innerTL;
      case 14: // N+E+S
        return SHEET_TILE_FRAMES.innerTR;
      case 15: // All neighbors
        return SHEET_TILE_FRAMES.deco1;
      default:
        return SHEET_TILE_FRAMES.straightH;
    }
  }

  getWaterTileFrame(row, col) {
    const north = this.isWaterTile(row - 1, col);
    const south = this.isWaterTile(row + 1, col);
    const west = this.isWaterTile(row, col - 1);
    const east = this.isWaterTile(row, col + 1);

    const mask =
      (north ? 8 : 0) | (east ? 4 : 0) | (south ? 2 : 0) | (west ? 1 : 0);

    switch (mask) {
      case 0:
        return SHEET_TILE_FRAMES.straightH;
      case 1:
        return SHEET_TILE_FRAMES.edgeW;
      case 2:
        return SHEET_TILE_FRAMES.edgeS;
      case 3:
        return SHEET_TILE_FRAMES.cornerBL;
      case 4:
        return SHEET_TILE_FRAMES.edgeE;
      case 5:
        return SHEET_TILE_FRAMES.straightH;
      case 6:
        return SHEET_TILE_FRAMES.cornerBR;
      case 7:
        return SHEET_TILE_FRAMES.innerBR;
      case 8:
        return SHEET_TILE_FRAMES.edgeN;
      case 9:
        return SHEET_TILE_FRAMES.cornerTL;
      case 10:
        return SHEET_TILE_FRAMES.straightV;
      case 11:
        return SHEET_TILE_FRAMES.innerBL;
      case 12:
        return SHEET_TILE_FRAMES.cornerTR;
      case 13:
        return SHEET_TILE_FRAMES.innerTL;
      case 14:
        return SHEET_TILE_FRAMES.innerTR;
      case 15:
        return SHEET_TILE_FRAMES.deco2;
      default:
        return SHEET_TILE_FRAMES.straightH;
    }
  }

  getCliffTileFrame(row, col) {
    // Use the same path/water layout for cliff edges until a dedicated cliff shape is added.
    return this.getWaterTileFrame(row, col);
  }

  getMapTileKey(row, col) {
    if (!FULL_MAP_GRID || row < 0 || col < 0) return "G";
    if (row >= FULL_MAP_GRID.length) return "G";
    const rowData = FULL_MAP_GRID[row];
    if (!rowData) return "G";
    return rowData[col] || "G";
  }

  isPathTile(row, col) {
    return this.getMapTileKey(row, col) === "P";
  }

  isWaterTile(row, col) {
    return this.getMapTileKey(row, col) === "W";
  }

  /**
   * Render a dynamic retro health bar HUD on top-left of the viewport.
   */
  drawHUD() {
    const x = 16;
    const y = 16;

    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.fillRect(x - 4, y - 4, 112, 28);

    // Draw Heart icons on screen
    for (let i = 0; i < this.player.maxHealth; i++) {
      const isFull = i < this.player.health;
      this.ctx.fillStyle = isFull ? "#ff2a2a" : "#555555";

      // Draw a neat 8-bit style heart
      const hx = x + i * 36;
      const hy = y;

      if (isFull) {
        // Draw heart shape
        this.ctx.fillRect(hx + 8, hy + 4, 8, 16);
        this.ctx.fillRect(hx + 4, hy + 8, 16, 8);
        this.ctx.fillRect(hx, hy + 6, 8, 6);
        this.ctx.fillRect(hx + 16, hy + 6, 8, 6);
      } else {
        // Empty heart box
        this.ctx.fillRect(hx + 4, hy + 4, 16, 16);
      }
    }
  }
}

// Instantiate game engine when window loads
window.addEventListener("DOMContentLoaded", () => {
  window.Game = new GameEngine();
});
