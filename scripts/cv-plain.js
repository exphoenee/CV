import { renderPlainCV } from './components/plain/index.js';
import {
  initHireModal,
  initFormspree,
  getSystemTheme,
  musicPlayerHTML,
  hireModalHTML,
  bookingModalHTML,
  initBookingModal,
  hideLoadingOverlay,
} from './shared.js';
import { initMusicPlayer } from './cv-music-player.js';
import { THEME_KEY, THEME_DARK, THEME_LIGHT, PLAIN_ONLY_THEMES, CURSOR_KEY } from './config.js';
import { locale } from './locale.js';
import { createLangDropdown, initLangDropdown } from './components/lang-dropdown.js';

document.body.insertAdjacentHTML('beforeend', musicPlayerHTML());

function render() {
  document.getElementById('cv-content').innerHTML = renderPlainCV(locale.getData());
  initDecors();
  const headerLd = document.querySelector('#cv-content .ld-select');
  if (headerLd)
    initLangDropdown(headerLd, {
      onChange(lang) {
        locale.setLang(lang);
        render();
        buildSettingsModal();
        window.dispatchEvent(new CustomEvent('localechange'));
      },
    });
}

render();

document.body.insertAdjacentHTML(
  'beforeend',
  hireModalHTML('hire-plain', {
    subject: 'Hire inquiry from CV - plain',
    p1Class: 'cv-plain-inline-11',
    p2Class: 'cv-plain-inline-12',
    errClass: 'cv-plain-inline-14',
  }),
);

initHireModal('hire-plain');

document.body.insertAdjacentHTML('beforeend', bookingModalHTML('plain'));
var bookingModal = initBookingModal('plain');

// --- Mobile settings gear ---

const gearBtn = document.createElement('button');
gearBtn.id = 'settings-gear-btn';
gearBtn.setAttribute('aria-label', 'Settings');
gearBtn.innerHTML = `<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
  <line x1="3" y1="5" x2="17" y2="5"/>
  <line x1="3" y1="10" x2="17" y2="10"/>
  <line x1="3" y1="15" x2="17" y2="15"/>
</svg>`;
document.body.appendChild(gearBtn);

const settingsBackdrop = document.createElement('div');
settingsBackdrop.id = 'settings-modal-backdrop';
settingsBackdrop.className = 'settings-modal-backdrop';
document.body.appendChild(settingsBackdrop);

function buildSettingsModal() {
  settingsBackdrop.setAttribute('role', 'dialog');
  settingsBackdrop.setAttribute('aria-modal', 'true');
  settingsBackdrop.setAttribute('aria-label', 'CV settings');
  settingsBackdrop.innerHTML = `
    <div class="settings-modal-box">
      <div class="settings-modal-header">
        <button id="settings-close-btn" class="settings-close-btn" aria-label="Close settings">✕</button>
      </div>
      <div class="settings-modal-body">
        <div id="modal-lang-slot"></div>
        <button class="settings-hire-btn" id="settings-hire-btn" aria-label="${locale.t('hireMe')} — open contact form">${locale.t('hireMe')}</button>
        <button class="settings-book-btn" id="settings-book-btn" aria-label="Book a meeting with Viktor"><i class="fa-regular fa-calendar-check" aria-hidden="true"></i> Book a Meeting</button>
        <button class="settings-print-btn" id="settings-print-btn" aria-label="${locale.t('print')} CV"><i class="fa-solid fa-print" aria-hidden="true"></i> ${locale.t('print')}</button>
        <button class="settings-close-drawer-btn" id="settings-close-btn" aria-label="Close settings">${locale.t('close')}</button>
      </div>
    </div>
  `;
  createLangDropdown(settingsBackdrop.querySelector('#modal-lang-slot'), {
    fullWidth: true,
    onChange(lang) {
      locale.setLang(lang);
      render();
      buildSettingsModal();
      window.dispatchEvent(new CustomEvent('localechange'));
    },
  });
}

buildSettingsModal();

function openSettings() {
  settingsBackdrop.classList.add('is-visible');
  requestAnimationFrame(() => settingsBackdrop.classList.add('is-open'));
}
function closeSettings() {
  settingsBackdrop.classList.remove('is-open');
  settingsBackdrop.addEventListener(
    'transitionend',
    () => {
      settingsBackdrop.classList.remove('is-visible');
    },
    { once: true },
  );
}
gearBtn.addEventListener('click', openSettings);

document.body.addEventListener('click', function (e) {
  if (e.target.matches('#print-plain-btn') || e.target.closest('#settings-print-btn')) {
    closeSettings();
    window.print();
    return;
  }
  if (e.target.closest('#settings-close-btn') || e.target === settingsBackdrop) {
    closeSettings();
    return;
  }
  if (e.target.closest('#settings-hire-btn')) {
    closeSettings();
    document.getElementById('hire-plain-btn')?.click();
    return;
  }
  if (e.target.closest('#settings-book-btn')) {
    closeSettings();
    bookingModal.openModal();
    return;
  }
});

window.showToast = function (message) {
  var container = document.getElementById('cv-toaster-container');
  if (!container) return;
  var toast = document.createElement('div');
  toast.className = 'cv-toast';
  toast.innerHTML =
    '<span>' + message + '</span><button class="cv-toast-close" aria-label="Close">×</button>';

  var closeBtn = toast.querySelector('.cv-toast-close');

  function removeToast() {
    toast.classList.add('hiding');
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }

  closeBtn.addEventListener('click', removeToast);
  setTimeout(removeToast, 3000);

  container.appendChild(toast);
};

(function () {
  var btn = document.getElementById('theme-toggle');
  var overlay = null;
  var isTouch = window.matchMedia('(pointer: coarse)').matches;
  var states = isTouch
    ? [THEME_LIGHT, THEME_DARK]
    : [THEME_LIGHT, THEME_DARK].concat(PLAIN_ONLY_THEMES);
  var icons = isTouch
    ? ['assets/images/sun.webp', 'assets/images/moon.webp']
    : [
        'assets/images/sun.webp',
        'assets/images/moon.webp',
        'assets/images/flashlight.webp',
        'assets/images/nightvision.webp',
        'assets/images/predator.webp',
      ];
  var savedTheme = localStorage.getItem(THEME_KEY);
  var current = savedTheme && states.indexOf(savedTheme) !== -1 ? savedTheme : getSystemTheme();
  if (states.indexOf(current) === -1) current = THEME_LIGHT;
  var wordsWrapped = false;

  function updateOverlay(x, y) {
    if (!overlay) return;
    overlay.style.background =
      'radial-gradient(circle 250px at ' +
      x +
      'px ' +
      y +
      'px, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 12%, transparent 25%, transparent 52%, rgba(0,0,0,0.15) 65%, rgba(0,0,0,0.5) 78%, rgba(0,0,0,0.8) 88%, rgba(0,0,0,0.9) 94%, rgba(0,0,0,0.92) 100%)';
  }

  function onMouseMove(e) {
    var x = e.clientX,
      y = e.clientY;
    updateOverlay(x, y);
    localStorage.setItem(CURSOR_KEY, x + ',' + y);
  }

  function wrapWords(element) {
    if (element.nodeType === Node.TEXT_NODE) {
      if (!element.textContent.trim()) return;
      const words = element.textContent.split(/(\s+)/);
      const fragments = document.createDocumentFragment();
      words.forEach((word) => {
        if (word.trim()) {
          const span = document.createElement('span');
          span.className = 'nv-word';
          span.textContent = word;
          span.style.setProperty('--nv-fs', (0.96 + Math.random() * 0.09).toFixed(3) + 'em');
          var g = Math.floor(160 + Math.random() * 95);
          var r = Math.floor(20 + Math.random() * 100);
          span.style.setProperty('--nv-c', 'rgb(' + r + ',' + g + ',' + r + ')');
          fragments.appendChild(span);
        } else {
          fragments.appendChild(document.createTextNode(word));
        }
      });
      element.replaceWith(fragments);
    } else if (
      element.nodeType === Node.ELEMENT_NODE &&
      element.tagName !== 'SCRIPT' &&
      element.tagName !== 'STYLE' &&
      element.tagName !== 'SVG' &&
      !element.classList.contains('blockTitle')
    ) {
      const children = Array.from(element.childNodes);
      children.forEach((child) => wrapWords(child));
    }
  }

  function apply(state) {
    document.documentElement.setAttribute('data-theme', state);
    localStorage.setItem(THEME_KEY, state);
    current = state;

    var icon = icons[states.indexOf(state)];
    if (icon.endsWith('.webp')) {
      btn.innerHTML = '<img src="' + icon + '" class="theme-icon-img" alt="theme icon">';
    } else {
      btn.textContent = icon;
    }

    if (state === 'superdark') {
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9998';
        document.body.appendChild(overlay);
      }
      overlay.style.display = '';
      document.documentElement.style.cursor = 'none';
      var saved = localStorage.getItem(CURSOR_KEY);
      if (saved) {
        var parts = saved.split(',');
        updateOverlay(parseInt(parts[0]), parseInt(parts[1]));
      }
      document.addEventListener('mousemove', onMouseMove);
    } else {
      document.documentElement.style.cursor = '';
      if (overlay) overlay.style.display = 'none';
      document.removeEventListener('mousemove', onMouseMove);
    }

    if (state === 'nightvision' && !wordsWrapped) {
      wrapWords(document.querySelector('.cvLayout.base.cv'));
      wordsWrapped = true;
    }
  }

  btn.addEventListener('click', function () {
    var idx = states.indexOf(current);
    var nextState = states[(idx + 1) % states.length];
    apply(nextState);
    if (window.showToast) window.showToast(locale.t('themeChanged') + ' ' + nextState);
  });

  apply(current);
})();

function initDecors() {
  var decors = ['decor1.svg', 'decor2.svg', 'decor3.svg', 'decor4.svg', 'decor5.svg', 'decor6.svg'];
  var items = document.querySelectorAll('.workExperienceItem');
  if (items.length > 0) items[items.length - 1].classList.add('no-decor');
  for (var t = 0; t < items.length; t++) {
    var title = items[t].querySelector('.itemTitle')?.textContent.trim();
    if (title === 'Deutsche Telekom IT Solutions HU' || title === 'CobotX Technologies') {
      items[t].classList.add('no-decor');
    }
  }

  for (var i = decors.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = decors[i];
    decors[i] = decors[j];
    decors[j] = tmp;
  }

  for (var k = 0; k < items.length - 1; k++) {
    var img = document.createElement('img');
    img.src = './assets/images/' + decors[k % decors.length];
    img.alt = '';
    img.className = 'work-decor';
    img.style.cssText =
      'display:block;width:400px;max-width:80%;height:30px;object-fit:contain;margin:3mm auto 3mm';
    items[k].parentNode.insertBefore(img, items[k].nextSibling);
  }
}

initFormspree('#hire-plain-form');
initMusicPlayer();
hideLoadingOverlay();
