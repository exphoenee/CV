import { SFX_VOLUME_KEY as SFX_KEY } from '../../config.js';

const SOUND_DEFS = {
  footsteps_grass: { files: ['footsteps_grass_1.wav', 'footsteps_grass_2.wav', 'footsteps_grass_3.wav', 'footsteps_grass_4.wav'] },
  footsteps_road:  { files: ['footsteps_road_1.wav', 'footsteps_road_2.wav', 'footsteps_road_3.wav', 'footsteps_road_4.wav'] },
  punch:           { files: ['punch_1.wav', 'punch_2.wav', 'punch_3.wav'] },
  sword_swipe:     { files: ['sword_swipe.wav'] },
  skeleton_death:  { files: ['skeleton_death.wav'] },
  chest_collect:   { files: ['chest_collect.wav'] },
  door_open:       { files: ['door_long.wav', 'door_short.wav'] },
  door_close:      { files: ['door_close.wav'] },
  water_ambient:   { files: ['water_babbling_loop.wav'] },
};

class SfxManager {
  constructor() {
    this.pool = {};
    this.looping = {};
    this.volume = parseFloat(localStorage.getItem(SFX_KEY)) ?? 0.5;
  }

  preload() {
    for (const [name, def] of Object.entries(SOUND_DEFS)) {
      this.pool[name] = def.files.map(f => {
        const a = new Audio('./assets/sfx/' + f);
        a.preload = 'auto';
        return a;
      });
    }
  }

  play(name) {
    const pool = this.pool[name];
    if (!pool || pool.length === 0) return;
    const idx = Math.floor(Math.random() * pool.length);
    const clone = pool[idx].cloneNode();
    clone.volume = this.volume;
    clone.play().catch(() => {});
  }

  startLoop(name) {
    if (this.looping[name]) return;
    const pool = this.pool[name];
    if (!pool || pool.length === 0) return;
    const a = pool[0].cloneNode();
    a.loop = true;
    a.volume = this.volume;
    a.play().catch(() => {});
    this.looping[name] = a;
  }

  stopLoop(name) {
    const a = this.looping[name];
    if (a) {
      a.pause();
      a.currentTime = 0;
      delete this.looping[name];
    }
  }

  setVolume(v) {
    this.volume = v;
    localStorage.setItem(SFX_KEY, v);
    for (const a of Object.values(this.looping)) a.volume = v;
  }
}

export const sfx = new SfxManager();
