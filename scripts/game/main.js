import {
  TILE_TYPES,
  TILE_SIZE,
  TILE_SHEET_TILE_SIZE,
  MAP_IMAGE_SRC,
  loadMapGridFromImage,
} from "./map/map.js";
import {MapRenderer} from "./map/renderMap.js";
import {CV_STATIONS} from "./world/stations.js";
import {ENTITY_SPAWNS} from "./world/spawns.js";
import Player from "./entities/player/Player.js";
import Skeleton from "./entities/enemies/Skeleton.js";
import Chicken from "./entities/npcs/Chicken.js";
import Cow from "./entities/npcs/Cow.js";
import Pig from "./entities/npcs/Pig.js";
import Sheep from "./entities/npcs/Sheep.js";
import Tree from "./entities/obstacles/Tree.js";
import SmallTree from "./entities/obstacles/SmallTree.js";
import Chest from "./entities/obstacles/Chest.js";
import House from "./entities/obstacles/House.js";
import Flower from "./entities/decor/Flower.js";
import Mushroom from "./entities/decor/Mushroom.js";
import Log from "./entities/decor/Log.js";
import GoldOre from "./entities/decor/GoldOre.js";
import PickableOre from "./entities/decor/PickableOre.js";
import Hay from "./entities/decor/Hay.js";
import Carrot from "./entities/decor/Carrot.js";
import GoldBoulder from "./entities/decor/GoldBoulder.js";
import Boulder from "./entities/decor/Boulder.js";
import DecorStone from "./entities/decor/DecorStone.js";
import Stump from "./entities/decor/Stump.js";
import Basket from "./entities/decor/Basket.js";
import Sign from "./entities/decor/Sign.js";
import Plant from "./entities/decor/Plant.js";
import Leaf from "./entities/decor/Leaf.js";
import {initMobileInput} from "./mobile-input.js";

class GameEngine {
  constructor() {
    this.canvas = document.getElementById("game-canvas");
    this.ctx = this.canvas.getContext("2d");

    // Setup internal virtual resolution (640x360 for perfect pixel-art scale)
    this.virtualWidth = 640;
    this.virtualHeight = 360;
    this.zoom = 1;
    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());
    const onFSChange = () => {
      this.resizeCanvas();
      const btn = document.getElementById("btn-fullscreen");
      if (btn) {
        const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
        btn.textContent = fsEl ? "⛶ Exit Fullscreen" : "⛶ Fullscreen";
      }
    };
    document.addEventListener("fullscreenchange", onFSChange);
    document.addEventListener("webkitfullscreenchange", onFSChange);

    // Keyboard inputs
    this.keys = {};
    this.setupKeyboardListeners();

    // Game states
    this.isFrozen = true; // Start frozen until user clicks Start Game
    this.gameOverActive = false;
    this.gameStarted = false;
    this.debugMode = false;
    this.lastTime = 0;

    // World parameters (set after map image loads)
    this.cols = 0;
    this.rows = 0;
    this.width = 0;
    this.height = 0;
    this.fullMapGrid = null;

    // Camera
    this.camera = {x: 0, y: 0};

    // Lists
    this.obstacles = []; // House, Tree, Fence, Chest
    this.enemies = []; // Skeletons
    this.npcs = []; // Animals
    this.decorations = []; // Non-solid decor items
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

    // HUD heart image
    this.hearthImage = new Image();
    this.hearthImage.src = "./assets/sprites/Cute/Hearth/hearth.png";

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
    const maxGameUnits = 32 * 16; // 12 tiles × 16px per tile

    // The longer screen dimension shows exactly 12 tiles; the other follows aspect ratio
    if (w >= h) {
      this.virtualWidth = maxGameUnits;
      this.virtualHeight = Math.round((maxGameUnits * h) / w);
    } else {
      this.virtualHeight = maxGameUnits;
      this.virtualWidth = Math.round((maxGameUnits * w) / h);
    }

    this.zoom = w / this.virtualWidth;

    this.canvas.width = w;
    this.canvas.height = h;

    wrapper.style.width = `${w}px`;
    wrapper.style.height = `${h}px`;

    this.ctx.imageSmoothingEnabled = false;
  }

  toggleFullscreen() {
    const container = document.getElementById("game-container");
    if (!container) return;
    const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
    if (!fsEl) {
      const req = container.requestFullscreen?.() || container.webkitRequestFullscreen?.();
      if (req) req.catch(() => {});
    } else {
      const exit = document.exitFullscreen?.() || document.webkitExitFullscreen?.();
      if (exit) exit.catch(() => {});
    }
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
  async init() {
    try {
      const mapData = await loadMapGridFromImage(MAP_IMAGE_SRC);
      this.fullMapGrid = mapData.fullMapGrid;
      this.cols = mapData.cols;
      this.rows = mapData.rows;
      this.width = this.cols * TILE_SIZE;
      this.height = this.rows * TILE_SIZE;
    } catch (err) {
      console.error("[Map] BMP load failed:", err);
      return;
    }

    await new Promise((resolve) => this.preloadAssets(resolve));

    this.buildWorld();
    this.setupDialogueListeners();
    this.setupPauseMenuListeners();
    this.initHireModal();
    this.setupStartScreenListeners();
    this.setupGameOverListeners();
    initMobileInput(this);
    requestAnimationFrame((time) => this.loop(time));
  }

  /**
   * Construct entities, houses, and obstacles.
   */
  buildWorld() {
    // 0. Build map renderer now that tile images are loaded
    this.mapRenderer = new MapRenderer({
      fullMapGrid: this.fullMapGrid,
      tileTypes: TILE_TYPES,
      tileImages: this.tileImages,
      tileSize: TILE_SIZE,
      sheetTileSize: TILE_SHEET_TILE_SIZE,
    });

    // 0b. Pre-compute tile bitmask + frame cache for fast rendering
    this.mapRenderer.buildTileCache(this.rows, this.cols);

    // 1. Spawn Player
    this.player = new Player(ENTITY_SPAWNS.player);
    this.player.debugMode = false;

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

    // 3. Spawn static obstacles and decorations
    const DECOR_CLASSES = {
      Tree, SmallTree, Chest, Flower, Mushroom, Log, GoldOre,
      PickableOre, Hay, Carrot, GoldBoulder, Boulder, DecorStone,
      Stump, Basket, Sign, Plant, Leaf,
    };
    ENTITY_SPAWNS.decorations.forEach((decor) => {
      const Klass = DECOR_CLASSES[decor.type];
      if (Klass) {
        const obj = new Klass(decor);
        if (obj.solid) this.obstacles.push(obj);
        else this.decorations.push(obj);
      }
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
      ...this.decorations,
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
      const tileKey = this.mapRenderer.getMapTileKey(row, col);
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
        const startScreen = document.getElementById("start-screen");
        const gameOverScreen = document.getElementById("game-over-screen");

        // Don't toggle pause if start screen or game over is showing
        if (
          (startScreen && startScreen.classList.contains("dialogue-visible")) ||
          (gameOverScreen && gameOverScreen.classList.contains("dialogue-visible"))
        ) {
          return;
        }

        const diagOverlay = document.getElementById("dialogue-overlay");
        if (diagOverlay && diagOverlay.classList.contains("dialogue-visible")) {
          this.closeDialogue();
          return;
        }

        this.togglePauseMenu();
      }

      // F3 to toggle debug mode
      if (e.key === "F3") {
        this.debugMode = !this.debugMode;
        this.player.debugMode = this.debugMode;
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

    const fullscreenBtn = document.getElementById("btn-fullscreen");
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener("click", () => this.toggleFullscreen());
    }

    if (resumeBtn) {
      resumeBtn.addEventListener("click", () => this.resumeGame());
    }
    if (backdrop) {
      backdrop.addEventListener("click", () => this.resumeGame());
    }

    // Music Player Setup
    const audio = document.getElementById("game-music-audio");
    const playPauseBtn = document.getElementById("game-music-playpause");
    const stopBtn = document.getElementById("game-music-stop");
    const prevBtn = document.getElementById("game-music-prev");
    const nextBtn = document.getElementById("game-music-next");
    const customSelect = document.getElementById("game-genre-select");
    const volumeSlider = document.getElementById("game-music-volume");

    if (!customSelect || !audio || !playPauseBtn) return;

    const trigger = customSelect.querySelector(".custom-select-trigger");
    const triggerText = trigger.querySelector("span");
    const options = customSelect.querySelectorAll(".custom-option");

    let isPlaying = false;
    let currentIndex = 0;
    let currentValue = options[0].getAttribute("data-value");
    let currentLabel = options[0].textContent;

    // Persist music state
    const saveState = () => {
      localStorage.setItem("cv-music-state", isPlaying ? "playing" : "paused");
      if (!isPlaying) localStorage.setItem("cv-music-time", audio.currentTime);
    };
    const saveTime = () => {
      localStorage.setItem("cv-music-time", audio.currentTime);
    };

    // Restore saved volume preference
    const savedVolume = localStorage.getItem("cv-music-volume");
    if (savedVolume !== null) {
      audio.volume = parseFloat(savedVolume);
      if (volumeSlider) volumeSlider.value = savedVolume;
    } else {
      audio.volume = 0.5;
      if (volumeSlider) volumeSlider.value = 0.5;
    }

    // Volume target — updated live when the slider changes
    let targetVolume = parseFloat(localStorage.getItem("cv-music-volume")) || 0.5;

    if (volumeSlider) {
      volumeSlider.addEventListener("input", (e) => {
        const vol = parseFloat(e.target.value);
        targetVolume = vol;
        audio.volume = vol;
        localStorage.setItem("cv-music-volume", vol);
      });
    }

    // Restore saved genre preference
    const savedGenre = localStorage.getItem("cv-music-genre");
    if (savedGenre) {
      for (let i = 0; i < options.length; i++) {
        if (options[i].getAttribute("data-value") === savedGenre) {
          currentIndex = i;
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

    const selectTrackByIndex = (index) => {
      currentIndex = index;
      currentValue = options[currentIndex].getAttribute("data-value");
      currentLabel = options[currentIndex].textContent;
      triggerText.textContent = currentLabel;
      localStorage.setItem("cv-music-genre", currentValue);
    };

    const updatePlayPause = () => {
      playPauseBtn.textContent = isPlaying ? "⏸" : "▶";
    };

    // Fade helpers
    let fadeInterval = null;
    const fadeDuration = 0.5; // seconds

    const stopFade = () => { if (fadeInterval) { clearInterval(fadeInterval); fadeInterval = null; } };

    const fadeTo = (target, onDone) => {
      stopFade();
      const startVol = audio.volume;
      const startTime = performance.now();
      fadeInterval = setInterval(() => {
        const elapsed = (performance.now() - startTime) / 1000;
        const t = Math.min(elapsed / fadeDuration, 1);
        audio.volume = startVol + (target - startVol) * t;
        if (t >= 1) {
          stopFade();
          if (onDone) onDone();
        }
      }, 16);
    };

    const fadeIn = () => {
      audio.volume = 0;
      audio.play().then(() => {
        isPlaying = true;
        updatePlayPause();
        fadeTo(targetVolume);
      }).catch(() => {});
    };

    const fadeOut = (onDone) => {
      fadeTo(0, () => {
        audio.pause();
        isPlaying = false;
        updatePlayPause();
        audio.volume = targetVolume;
        if (onDone) onDone();
      });
    };

    const fadeOutThen = (callback) => {
      if (isPlaying) {
        fadeTo(0, () => {
          audio.pause();
          isPlaying = false;
          updatePlayPause();
          audio.volume = targetVolume;
          if (callback) callback();
        });
      } else {
        if (callback) callback();
      }
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

    options.forEach((opt, i) => {
      opt.addEventListener("click", (e) => {
        selectTrackByIndex(i);
        customSelect.classList.remove("open");

        if (isPlaying) {
          fadeOutThen(() => {
            stopFade();
            loadTrack();
            fadeIn();
          });
        } else {
          stopFade();
          loadTrack();
        }
        updatePlayPause();
      });
    });

    // Play/Pause toggle
    playPauseBtn.addEventListener("click", () => {
      if (isPlaying) {
        fadeOut(() => saveState());
      } else {
        loadTrack();
        fadeIn();
      }
    });

    // Stop: fade out, pause and reset playback position to the beginning
    if (stopBtn) {
      stopBtn.addEventListener("click", () => {
        fadeOut(() => {
          audio.currentTime = 0;
          localStorage.setItem("cv-music-state", "stopped");
          localStorage.setItem("cv-music-time", 0);
        });
      });
    }

    // Prev: if > 10s into the track, restart from beginning.
    // Otherwise, jump to the previous track (wraps to last if at first).
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (audio.currentTime > 10) {
          audio.currentTime = 0;
          saveTime();
          return;
        }
        localStorage.setItem("cv-music-time", 0);
        const prevIndex = (currentIndex - 1 + options.length) % options.length;
        selectTrackByIndex(prevIndex);
        fadeOutThen(() => {
          stopFade();
          loadTrack();
          fadeIn();
        });
        updatePlayPause();
      });
    }

    // Next: jump to the next track (wraps to first if at last).
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        localStorage.setItem("cv-music-time", 0);
        const nextIndex = (currentIndex + 1) % options.length;
        selectTrackByIndex(nextIndex);
        fadeOutThen(() => {
          stopFade();
          loadTrack();
          fadeIn();
        });
        updatePlayPause();
      });
    }

    // Track seek elements
    const seekSlider = document.getElementById("track-seek");
    const trackTimeCurrent = document.getElementById("track-time-current");
    const trackTimeTotal = document.getElementById("track-time-total");

    const formatTime = (seconds) => {
      if (isNaN(seconds) || !isFinite(seconds)) return "00:00";
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    let userScrubbing = false;
    let lastSaveTime = 0;

    const updateTrackTime = () => {
      if (userScrubbing) return;
      if (trackTimeCurrent && trackTimeTotal) {
        trackTimeCurrent.textContent = formatTime(audio.currentTime);
        trackTimeTotal.textContent = formatTime(audio.duration);
      }
      if (seekSlider && audio.duration) {
        seekSlider.max = audio.duration;
        seekSlider.value = audio.currentTime;
      }
      // Auto-save every 3 seconds
      if (audio.currentTime - lastSaveTime >= 3) {
        saveTime();
        lastSaveTime = audio.currentTime;
      }
    };

    if (seekSlider) {
      seekSlider.addEventListener("input", () => {
        userScrubbing = true;
        audio.currentTime = parseFloat(seekSlider.value);
        if (trackTimeCurrent) {
          trackTimeCurrent.textContent = formatTime(audio.currentTime);
        }
      });
      seekSlider.addEventListener("change", () => {
        userScrubbing = false;
        audio.currentTime = parseFloat(seekSlider.value);
        saveTime();
      });
    }

    audio.addEventListener("loadedmetadata", () => {
      if (seekSlider && audio.duration) {
        seekSlider.max = audio.duration;
      }
      updateTrackTime();
    });
    audio.addEventListener("timeupdate", updateTrackTime);
    audio.addEventListener("ended", () => {
      isPlaying = false;
      localStorage.setItem("cv-music-state", "stopped");
      updatePlayPause();
    });

    // Initial update when audio is ready
    if (audio.readyState >= 1) {
      updateTrackTime();
    }

    // Restore saved time and state
    const savedTime = parseFloat(localStorage.getItem("cv-music-time"));
    const savedState = localStorage.getItem("cv-music-state");

    // Load track, restore time and playing state
    loadTrack();
    if (savedTime > 0 && savedState !== "stopped") {
      audio.currentTime = savedTime;
    }
    if (savedState === "playing") {
      audio.volume = 0;
      audio
        .play()
        .then(() => {
          isPlaying = true;
          updatePlayPause();
          fadeTo(targetVolume);
        })
        .catch(() => {
          // Autoplay was blocked: wait for first user interaction
          const startOnInteraction = () => {
            audio.currentTime = savedTime > 0 ? savedTime : 0;
            audio.volume = 0;
            audio.play().then(() => {
              isPlaying = true;
              updatePlayPause();
              fadeTo(targetVolume);
            }).catch(() => {});
            window.removeEventListener("click", startOnInteraction);
            window.removeEventListener("keydown", startOnInteraction);
          };
          window.addEventListener("click", startOnInteraction);
          window.addEventListener("keydown", startOnInteraction);
          updatePlayPause();
        });
    } else if (savedState === "paused") {
      isPlaying = false;
      updatePlayPause();
    } else {
      isPlaying = false;
      updatePlayPause();
    }

    // Unload event: save state
    window.addEventListener("beforeunload", saveState);
  }

  initHireModal() {
    const hireBtn = document.getElementById('hire-btn');
    const hireModal = document.getElementById('hire-modal');
    const hireClose = document.getElementById('hire-close');
    const hireBackdrop = document.getElementById('hire-backdrop');

    if (!hireModal) return;

    const openHire = () => {
      hireModal.classList.remove('dialogue-hidden');
      hireModal.classList.add('dialogue-visible');
      this.isFrozen = true;
    };
    const closeHire = () => {
      hireModal.classList.remove('dialogue-visible');
      hireModal.classList.add('dialogue-hidden');
      if (!this.gameOverActive) this.isFrozen = false;
    };

    hireBtn?.addEventListener('click', openHire);
    hireClose?.addEventListener('click', closeHire);
    hireBackdrop?.addEventListener('click', closeHire);

    if (window.formspree) {
      formspree('initForm', { formElement: '#hire-game-form', formId: 'mrejlned' });
    }
  }

  /**
   * Wire up Start Screen button events.
   */
  setupStartScreenListeners() {
    const startBtn = document.getElementById("btn-start-game");
    if (startBtn) {
      startBtn.addEventListener("click", () => this.startGame());
    }
    const fsBtn = document.getElementById("btn-start-fullscreen");
    if (fsBtn) {
      fsBtn.addEventListener("click", () => this.toggleFullscreen());
    }
  }

  /**
   * Begin the game — hide start screen, unfreeze loop.
   */
  startGame() {
    const startScreen = document.getElementById("start-screen");
    startScreen.classList.remove("dialogue-visible");
    startScreen.classList.add("dialogue-hidden");
    this.isFrozen = false;
    this.gameStarted = true;
    if (this._onGameStart) this._onGameStart();
  }

  /**
   * Wire up Game Over screen button events.
   */
  setupGameOverListeners() {
    const restartBtn = document.getElementById("btn-restart-game");
    if (restartBtn) {
      restartBtn.addEventListener("click", () => this.restartGame());
    }
  }

  /**
   * Show the Game Over overlay and freeze the game.
   */
  showGameOver() {
    this.gameOverActive = true;
    this.isFrozen = true;
    const gameOverScreen = document.getElementById("game-over-screen");
    gameOverScreen.classList.remove("dialogue-hidden");
    gameOverScreen.classList.add("dialogue-visible");
  }

  /**
   * Hide the Game Over overlay.
   */
  hideGameOver() {
    this.gameOverActive = false;
    const gameOverScreen = document.getElementById("game-over-screen");
    gameOverScreen.classList.remove("dialogue-visible");
    gameOverScreen.classList.add("dialogue-hidden");
  }

  /**
   * Respawn the player and hide the Game Over screen.
   */
  restartGame() {
    this.player.respawn();
    this.hideGameOver();
    this.isFrozen = false;

    // Re-populate enemies/NPCs to original state
    this.enemies = [];
    this.npcs = [];
    ENTITY_SPAWNS.enemies.forEach((enemySpawn) => {
      const skeleton = new Skeleton({x: enemySpawn.x, y: enemySpawn.y});
      this.enemies.push(skeleton);
    });
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
    this.rebuildGameObjectList();
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
        grid: this.fullMapGrid,
        types: TILE_TYPES,
        tileSize: TILE_SIZE,
      },
    };

    // 1. Update entities
    this.player.update(dt, worldContext);

    this.npcs.forEach((npc) => npc.update(dt, worldContext));
    this.enemies.forEach((enemy) => enemy.update(dt, worldContext));

    // 2. Check player death → game over
    if (this.player.deathAnimDone && !this.gameOverActive) {
      this.showGameOver();
      return;
    }

    // 3. Cleanup dead entities
    this.cleanupDead();

    // 4. Spawn new skeletons
    this.enemySpawnTimer += dt;
    if (
      this.enemySpawnTimer >= this.enemySpawnInterval &&
      this.enemies.length < this.maxEnemies
    ) {
      this.spawnSkeleton();
      this.enemySpawnTimer = 0;
      this.enemySpawnInterval = this._randomInterval(20, 50);
    }

    // 5. Spawn new NPCs
    this.npcSpawnTimer += dt;
    if (
      this.npcSpawnTimer >= this.npcSpawnInterval &&
      this.npcs.length < this.maxNpcs
    ) {
      this.spawnNpc();
      this.npcSpawnTimer = 0;
      this.npcSpawnInterval = this._randomInterval(30, 50);
    }

    // 6. Check door triggers for entering CV Stations
    for (const obs of this.obstacles) {
      if (obs instanceof House && obs.checkDoorTrigger(this.player)) {
        this.enterHouse(obs);
        break;
      }
    }

    // 7. Check chest healing triggers (using proximity check)
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

    // 8. Smooth Camera Tracking on Player
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
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    this.ctx.scale(this.zoom, this.zoom);

    // 1. Render Tilemap background layer
    this.mapRenderer.drawTiles(
      this.ctx, this.camera, this.rows, this.cols, this.virtualWidth, this.virtualHeight
    );

    // 2. Render all entities y-sorted for 2.5D depth ordering
    this.gameObjects.sort((a, b) => {
      const aBottom = a.y + a.height + a.ySortOffset;
      const bBottom = b.y + b.height + b.ySortOffset;
      return aBottom - bBottom;
    });

    // Expose player position for proximity checks in draw
    this.camera.playerX = this.player.x;
    this.camera.playerY = this.player.y;

    this.gameObjects.forEach((obj) => {
      obj.draw(this.ctx, this.camera);
    });

    this.ctx.restore();

    // 4. Draw Player HUD / Life Hearts (screen-space, not scaled)
    this.drawHUD();

    // 5. Debug overlay (screen-space)
    if (this.debugMode) {
      this.drawDebugOverlay();
    }
  }

  /**
   * Render a dynamic retro health bar HUD on top-left of the viewport.
   */
  drawHUD() {
    const x = 16;
    const y = 16;
    const heartSize = 20;

    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.beginPath();
    if (this.ctx.roundRect) {
      this.ctx.roundRect(x - 4, y - 4, this.player.maxHealth * (heartSize + 6) + 8, heartSize + 8, 6);
    } else {
      this.ctx.rect(x - 4, y - 4, this.player.maxHealth * (heartSize + 6) + 8, heartSize + 8);
    }
    this.ctx.fill();

    if (!this.hearthImage.complete) return;

    for (let i = 0; i < this.player.maxHealth; i++) {
      const isFull = i < this.player.health;
      const hx = x + i * (heartSize + 6);
      const hy = y;

      if (isFull) {
        this.ctx.drawImage(this.hearthImage, hx, hy, heartSize, heartSize);
      } else {
        this.ctx.globalAlpha = 0.3;
        this.ctx.drawImage(this.hearthImage, hx, hy, heartSize, heartSize);
        this.ctx.globalAlpha = 1.0;
      }
    }
  }

  /**
   * Draw collision boxes and info for all objects in debug mode.
   */
  drawDebugOverlay() {
    const {ctx, camera} = this;

    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(4, 4, 180, 56);
    ctx.fillStyle = "#0f0";
    ctx.font = "12px monospace";
    ctx.fillText("DEBUG MODE [F3]", 10, 20);
    ctx.fillStyle = "#aaa";
    ctx.fillText(`Objects: ${this.gameObjects.length}`, 10, 36);
    ctx.fillText(`Player: ${~~this.player.x},${~~this.player.y}`, 10, 52);

    // Collision boxes
    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 1;

    for (const obj of this.gameObjects) {
      const r = obj.getCollisionRect
        ? obj.getCollisionRect()
        : {x: obj.x, y: obj.y, width: obj.width, height: obj.height};

      ctx.strokeRect(
        r.x - camera.x,
        r.y - camera.y,
        r.width,
        r.height
      );
    }
  }
}

// Instantiate game engine when window loads
window.addEventListener("DOMContentLoaded", () => {
  window.Game = new GameEngine();
});
