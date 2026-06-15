import { CV_DATA } from './cv-data.js';
import { renderJsonCV } from './components/json/index.js';
import {
  initHireModal,
  initFormspree,
  musicPlayerHTML,
  hireModalHTML,
  bookingModalHTML,
  initBookingModal,
  hideLoadingOverlay,
} from './shared.js';
import { initMusicPlayer } from './cv-music-player.js';
import { THEME_KEY, THEME_DARK, THEME_LIGHT, PLAIN_ONLY_THEMES } from './config.js';

document.body.insertAdjacentHTML('beforeend', musicPlayerHTML());

const L = renderJsonCV(CV_DATA);

const G = document.getElementById('G');
const C = document.getElementById('C');
const lnEl = document.getElementById('ln');

function computeFolds() {
  const folds = {};
  const stack = [];
  L.forEach(([depth, html], idx) => {
    const text = html.replace(/<[^>]*>/g, '').trim();
    if (!text) return;
    const firstChar = text[0];
    const lastMeaningful = text.replace(/[,\s]+$/, '').slice(-1);
    if (firstChar === '}' || firstChar === ']') {
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].depth === depth) {
          folds[stack[i].idx] = idx;
          stack.splice(i, 1);
          break;
        }
      }
    }
    if (lastMeaningful === '{' || lastMeaningful === '[') {
      stack.push({ idx, depth });
    }
  });
  return folds;
}

const FOLDS = computeFolds();
const foldState = {};
Object.keys(FOLDS).forEach((k) => (foldState[k] = 'open'));

let gHTML = '';
let cHTML = '';

function guideDepth(idx) {
  const [depth, content] = L[idx];
  if (content !== '') return depth;
  let prev = 0,
    next = 0;
  for (let i = idx - 1; i >= 0; i--) {
    if (L[i][1] !== '') {
      prev = L[i][0];
      break;
    }
  }
  for (let i = idx + 1; i < L.length; i++) {
    if (L[i][1] !== '') {
      next = L[i][0];
      break;
    }
  }
  return prev > 0 && next > 0 ? Math.min(prev, next) : Math.max(prev, next);
}

L.forEach(([depth, content], idx) => {
  const num = idx + 1;
  const gd = guideDepth(idx);
  let indents = '';
  for (let d = 0; d < gd; d++) indents += '<span class="i"></span>';

  const isFoldable = FOLDS[idx] !== undefined;
  const foldBtn = isFoldable
    ? '<span class="fold-icon foldable" data-open="' +
      idx +
      '" role="button" tabindex="0" aria-label="Collapse section" aria-expanded="true">▾</span>'
    : '<span class="fold-icon" aria-hidden="true"></span>';
  const foldHint = isFoldable
    ? '<span class="fold-hint" data-open="' + idx + '" aria-label="Collapsed section">…</span>'
    : '';

  gHTML += '<div data-n="' + num + '" data-gi="' + idx + '">' + foldBtn + num + '</div>';
  cHTML +=
    '<div class="l" data-n="' +
    num +
    '" data-li="' +
    idx +
    '">' +
    indents +
    '<span class="t">' +
    content +
    foldHint +
    '</span></div>';
});

G.innerHTML = gHTML;
C.innerHTML = cHTML;

function syncGutterHeights() {
  const codeLines = C.querySelectorAll('.l');
  const gutterLines = G.querySelectorAll('div');
  codeLines.forEach((line, i) => {
    gutterLines[i].style.height = line.offsetHeight + 'px';
  });
}

syncGutterHeights();
new ResizeObserver(syncGutterHeights).observe(C);

function toggleFold(openIdx) {
  const closeIdx = FOLDS[openIdx];
  const collapsing = foldState[openIdx] === 'open';
  for (let i = openIdx + 1; i < closeIdx; i++) {
    const cl = C.querySelector('[data-li="' + i + '"]');
    const gl = G.querySelector('[data-gi="' + i + '"]');
    const d = collapsing ? 'none' : '';
    if (cl) cl.style.display = d;
    if (gl) gl.style.display = d;
  }
  const icon = G.querySelector('.fold-icon[data-open="' + openIdx + '"]');
  const hint = C.querySelector('.fold-hint[data-open="' + openIdx + '"]');
  if (collapsing) {
    foldState[openIdx] = 'closed';
    if (icon) {
      icon.textContent = '▸';
      icon.classList.add('collapsed');
      icon.setAttribute('aria-expanded', 'false');
      icon.setAttribute('aria-label', 'Expand section');
    }
    if (hint) hint.style.display = '';
  } else {
    foldState[openIdx] = 'open';
    if (icon) {
      icon.textContent = '▾';
      icon.classList.remove('collapsed');
      icon.setAttribute('aria-expanded', 'true');
      icon.setAttribute('aria-label', 'Collapse section');
    }
    if (hint) hint.style.display = 'none';
  }
  syncGutterHeights();
}

G.addEventListener('click', (e) => {
  const btn = e.target.closest('.fold-icon.foldable');
  if (btn) toggleFold(parseInt(btn.dataset.open));
});

G.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    const btn = e.target.closest('.fold-icon.foldable');
    if (btn) {
      e.preventDefault();
      toggleFold(parseInt(btn.dataset.open));
    }
  }
});

C.addEventListener('click', (e) => {
  const hint = e.target.closest('.fold-hint');
  if (hint) toggleFold(parseInt(hint.dataset.open));
});

C.addEventListener('mousemove', (e) => {
  const row = e.target.closest('.l');
  if (row) lnEl.textContent = row.dataset.n;
});

document.body.insertAdjacentHTML('beforeend', bookingModalHTML('json'));
var bookingModal = initBookingModal('json');

document.getElementById('meet-menu-btn')?.addEventListener('click', function () {
  bookingModal.openModal();
});

if (!document.getElementById('hire-json-modal')) {
  document.body.insertAdjacentHTML(
    'beforeend',
    hireModalHTML('hire-json', {
      subject: 'Hire inquiry from CV - json',
      p1Class: 'cv-json-inline-5',
      p2Class: 'cv-json-inline-6',
      errClass: 'cv-json-inline-8',
    }),
  );
}

var hireBtn = document.getElementById('hire-json-btn');
var hireForm = document.getElementById('hire-json-form');
if (hireBtn && hireForm) {
  initHireModal('hire-json');
  initFormspree('#hire-json-form');
}

initMusicPlayer();
hideLoadingOverlay();

document.getElementById('wc-close-btn')?.addEventListener('click', function () {
  window.location.href = 'index.html';
});

(function () {
  var saved = localStorage.getItem(THEME_KEY);
  if (PLAIN_ONLY_THEMES.indexOf(saved) !== -1) saved = THEME_DARK;
  document.documentElement.setAttribute('data-theme', saved || THEME_DARK);

  document.getElementById('view-menu-btn')?.addEventListener('click', function () {
    var next =
      document.documentElement.getAttribute('data-theme') === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
  });
})();
