export function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
    window.innerWidth < 600
  );
}

function checkOrientation(game) {
  const isPortrait = window.matchMedia('(orientation: portrait)').matches;
  const overlay = document.getElementById('rotate-overlay');

  if (isPortrait && isTouchDevice() && game.gameStarted) {
    overlay?.classList.add('mobile-visible');
    game.isFrozen = true;
  } else {
    overlay?.classList.remove('mobile-visible');
    if (game.gameStarted && !game.gameOverActive) {
      game.isFrozen = false;
    }
  }
}

export function initMobileInput(game) {
  if (!isTouchDevice()) return;

  document.getElementById('mobile-controls')?.classList.add('mobile-visible');
  document.getElementById('pause-btn')?.classList.add('mobile-visible');
  document.getElementById('info-btn')?.classList.add('mobile-visible');

  // Orientation lock
  const orientQuery = window.matchMedia('(orientation: portrait)');
  orientQuery.addEventListener('change', () => checkOrientation(game));

  // Expose a method the game can call when it starts
  game._onGameStart = () => {
    checkOrientation(game);
  };

  const zone = document.getElementById('joystick-zone');
  if (!zone) return;
  const size = Math.min(zone.offsetWidth, zone.offsetHeight);

  const joystick = nipplejs.create({
    zone,
    mode: 'static',
    position: { left: '50%', top: '50%' },
    color: 'rgba(255, 112, 36, 0.6)',
    size,
    numberOfDirections: 8,
    lockY: false,
    priority: ['pointer', 'touch', 'mouse'],
  });

  const DIR_MAP = {
    0: {w: false, a: false, s: false, d: true},
    45: {w: true, a: false, s: false, d: true},
    90: {w: true, a: false, s: false, d: false},
    135: {w: true, a: true, s: false, d: false},
    180: {w: false, a: true, s: false, d: false},
    225: {w: false, a: true, s: true, d: false},
    270: {w: false, a: false, s: true, d: false},
    315: {w: false, a: false, s: true, d: true},
    360: {w: false, a: false, s: false, d: true},
  };

  const angleToDir = (angle) => {
    const deg = angle.degree;
    const snapped = Math.round(deg / 45) * 45;
    return DIR_MAP[snapped] || DIR_MAP[0];
  };

  joystick.on('move', (evt) => {
    const d = evt?.data || evt;
    if (!d || !d.angle) return;
    const dir = angleToDir(d.angle);
    Object.entries(dir).forEach(([key, val]) => { game.keys[key] = val; });
  });

  joystick.on('end', () => {
    ['w','a','s','d'].forEach(k => { game.keys[k] = false; });
  });

  const btn = document.getElementById('attack-btn');
  if (btn) {
    btn.addEventListener('touchstart', e => { e.preventDefault(); game.keys[' '] = true; });
    btn.addEventListener('touchend',   e => { e.preventDefault(); game.keys[' '] = false; });
    btn.addEventListener('touchcancel', e => { game.keys[' '] = false; });
  }

  const infoBtn = document.getElementById('info-btn');
  const modal = document.getElementById('credits-modal');
  const closeBtn = document.getElementById('credits-close');
  const backdrop = modal?.querySelector('.credits-modal-backdrop');

  const openModal = () => modal?.classList.add('mobile-visible');
  const closeModal = () => modal?.classList.remove('mobile-visible');

  infoBtn?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);

  const pauseBtn = document.getElementById('pause-btn');
  pauseBtn?.addEventListener('click', () => game.togglePauseMenu());
}
