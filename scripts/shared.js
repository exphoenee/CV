import { THEME_KEY, THEME_DARK, THEME_LIGHT, PLAIN_ONLY_THEMES, BOOKING_SCRIPT_URL, CHECK_EMAIL_DOMAIN } from './config.js';
import { locale } from './locale.js';

export function showToast(message) {
  var container = document.getElementById('cv-toaster-container');
  if (!container) return;
  var toast = document.createElement('div');
  toast.className = 'cv-toast';
  toast.innerHTML = '<span>' + message + '</span><button class="cv-toast-close" aria-label="Close">\xD7</button>';
  var closeBtn = toast.querySelector('.cv-toast-close');
  function removeToast() {
    toast.classList.add('hiding');
    setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
  }
  closeBtn.addEventListener('click', removeToast);
  setTimeout(removeToast, 3000);
  container.appendChild(toast);
}

class RawHtml {
  constructor(s) { this.s = s; }
}

export function raw(s) {
  return new RawHtml(String(s ?? ''));
}

export function html(strings, ...values) {
  let out = '';
  for (let i = 0; i < strings.length; i++) {
    out += strings[i];
    if (i < values.length) {
      const v = values[i];
      out += v instanceof RawHtml ? v.s : escHtml(String(v ?? ''));
    }
  }
  return out;
}

export function escHtml(str) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

export function skillChip(name, iconFile) {
  return '<div class="skill"><span class="skillImage"><img src="./assets/images/' + iconFile + '" alt="' + escHtml(name) + '" title="' + escHtml(name) + '" onerror="this.style.visibility=\'hidden\'" /></span><span>' + escHtml(name) + '</span></div>';
}

export function refLinks(refs) {
  if (!refs || refs.length === 0) return "";
  return refs.map(function (r) {
    return '<a href="' + escHtml(r.url) + '" target="_blank" rel="noopener noreferrer">' + escHtml(r.label) + '</a>';
  }).join("\n              ");
}

export function renderBullets(bullets, indent) {
  if (!bullets || !bullets.length) return "";
  indent = indent || "";
  return bullets.map(function (b) {
    return indent + '<div><i class="bullet-icon"></i>' + b + "</div>";
  }).join("\n");
}

export function initHireModal(prefix) {
  var modal = document.getElementById(prefix + "-modal");
  var subjectEl = document.getElementById(prefix + "-subject");

  function clearFieldErrors() {
    ['name-err', 'email-err', 'msg-err'].forEach(function(id) {
      var el = document.getElementById(prefix + '-' + id);
      if (el) el.textContent = '';
    });
  }

  if (CHECK_EMAIL_DOMAIN) {
    document.getElementById(prefix + '-email').addEventListener('blur', async function() {
      var emailVal = this.value.trim();
      var emailErr = document.getElementById(prefix + '-email-err');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) return;
      var domain = emailVal.split('@')[1].toLowerCase();
      if (sessionStorage.getItem('mx_' + domain) !== null) return;
      emailErr.textContent = locale.t('errEmailVerifying');
      var ok = await checkEmailDomain(emailVal);
      if (document.getElementById(prefix + '-email').value.trim() === emailVal) {
        emailErr.textContent = ok ? '' : locale.t('errEmailNoMailServer');
      }
    });
  }

  var COOLDOWN_KEY = 'hire_sent_ts';
  var COOLDOWN_MS  = 24 * 60 * 60 * 1000;

  function isOnCooldown() {
    var ts = parseInt(localStorage.getItem(COOLDOWN_KEY) || '0', 10);
    return ts > 0 && (Date.now() - ts < COOLDOWN_MS);
  }

  function openModal(subject) {
    var form = document.getElementById(prefix + "-form");
    var fsSuccess  = document.querySelector("#" + prefix + "-modal [data-fs-success]");
    var hireCooldown = document.querySelector("#" + prefix + "-modal [data-hire-cooldown]");
    var fsError    = document.querySelector("#" + prefix + "-modal [data-fs-error]");

    if (fsSuccess)    fsSuccess.classList.add("cv-success-hidden");
    if (fsError)      { fsError.classList.add("cv-error-hidden"); fsError.textContent = ''; }

    if (isOnCooldown()) {
      form.style.display = 'none';
      if (hireCooldown) hireCooldown.classList.remove("cv-success-hidden");
    } else {
      if (hireCooldown) hireCooldown.classList.add("cv-success-hidden");
      form.style.display = '';
      if (subjectEl && subject) subjectEl.value = subject;
      form.reset();
      clearFieldErrors();
      var submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = locale.t('send'); }
    }

    modal.classList.remove("cv-modal-hidden");
  }

  function closeModal() {
    modal.classList.add("cv-modal-hidden");
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest("#" + prefix + "-btn")) openModal();
  });

  document.getElementById(prefix + "-close").addEventListener("click", closeModal);
  document.getElementById(prefix + "-backdrop").addEventListener("click", closeModal);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  document.getElementById(prefix + "-form").addEventListener("submit", async function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    var nameVal = document.getElementById(prefix + '-name').value.trim();
    var emailVal = document.getElementById(prefix + '-email').value.trim();
    var msgVal = document.getElementById(prefix + '-message').value.trim();
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
    var wordCount = msgVal.split(/\s+/).filter(Boolean).length;

    document.getElementById(prefix + '-name-err').textContent = nameVal ? '' : locale.t('errFieldRequired');
    document.getElementById(prefix + '-email-err').textContent = emailOk ? '' : locale.t('errEmailInvalid');
    document.getElementById(prefix + '-msg-err').textContent = (msgVal.length >= 20 && wordCount >= 4) ? '' : locale.t('errMessageTooShort');

    if (!nameVal || !emailOk || msgVal.length < 20 || wordCount < 4) return;

    var form = this;
    var submitBtn = form.querySelector('[type="submit"]');
    var emailErr = document.getElementById(prefix + '-email-err');

    if (submitBtn) submitBtn.disabled = true;

    if (CHECK_EMAIL_DOMAIN) {
      emailErr.textContent = locale.t('errEmailVerifying');
      var domainOk = await checkEmailDomain(emailVal);
      if (!domainOk) {
        emailErr.textContent = locale.t('errEmailNoMailServer');
        if (submitBtn) submitBtn.disabled = false;
        return;
      }
      emailErr.textContent = '';
    }

    var formData = new FormData(form);
    fetch('https://formspree.io/f/mrejlned', {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    }).then(function(res) {
      if (res.ok) {
        localStorage.setItem(COOLDOWN_KEY, Date.now().toString());
        form.style.display = 'none';
        var hireCooldown = document.querySelector('#' + prefix + '-modal [data-hire-cooldown]');
        if (hireCooldown) hireCooldown.classList.add('cv-success-hidden');
        var fsSuccess = document.querySelector('#' + prefix + '-modal [data-fs-success]');
        if (fsSuccess) fsSuccess.classList.remove('cv-success-hidden');
      } else {
        if (submitBtn) submitBtn.disabled = false;
        var fsError = document.querySelector('#' + prefix + '-modal [data-fs-error]');
        if (fsError) { fsError.classList.remove('cv-error-hidden'); fsError.textContent = locale.t('errSendFailed') || 'Failed to send. Please try again.'; }
      }
    }).catch(function() {
      if (submitBtn) submitBtn.disabled = false;
      var fsError = document.querySelector('#' + prefix + '-modal [data-fs-error]');
      if (fsError) { fsError.classList.remove('cv-error-hidden'); fsError.textContent = locale.t('errSendFailed') || 'Failed to send. Please try again.'; }
    });
  });

  function updateText() {
    modal.querySelectorAll('[data-hire-i18n]').forEach(function(el) {
      el.textContent = locale.t(el.dataset.hireI18n);
    });
    modal.querySelectorAll('[data-hire-i18n-placeholder]').forEach(function(el) {
      el.placeholder = locale.t(el.dataset.hireI18nPlaceholder);
    });
  }
  window.addEventListener('localechange', updateText);

  return { openModal: openModal, closeModal: closeModal };
}

export function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function initThemeToggle(config) {
  config = config || {};
  var KEY = config.key || THEME_KEY;
  var validThemes = config.validThemes || null;
  var btn = document.getElementById(config.buttonId || "theme-toggle");

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(KEY, theme);
    if (config.onSet) config.onSet(theme, btn);
  }

  btn.addEventListener("click", function () {
    var next = document.documentElement.getAttribute("data-theme") === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    setTheme(next);
  });

  var saved = localStorage.getItem(KEY);
  if (saved && validThemes && validThemes.indexOf(saved) === -1) saved = null;
  if (saved) setTheme(saved);
  else setTheme(getSystemTheme());
}

export function saveState(key, id, value) {
  var state = JSON.parse(localStorage.getItem(key) || "{}");
  state[id] = value;
  localStorage.setItem(key, JSON.stringify(state));
}

export function loadState(key, id, defaultValue) {
  var state = JSON.parse(localStorage.getItem(key) || "{}");
  if (state[id] === undefined) return defaultValue;
  return state[id];
}

export function restoreCollapseStates(key) {
  var state = JSON.parse(localStorage.getItem(key) || "{}");
  Object.keys(state).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      if (state[id]) {
        el.classList.add("is-open");
      } else {
        el.classList.remove("is-open");
      }
    }
  });
}

export function initFormspree(_selector) {
  // Submission is handled directly in initHireModal via fetch — no external SDK needed.
}

export async function checkEmailDomain(email) {
  var domain = email.split('@')[1].toLowerCase();
  var cacheKey = 'mx_' + domain;
  var cached = sessionStorage.getItem(cacheKey);
  if (cached === '1') return true;
  if (cached === '0') return false;
  try {
    var url = 'https://1.1.1.1/dns-query?name=' + encodeURIComponent(domain) + '&type=MX';
    var res = await fetch(url, { headers: { 'Accept': 'application/dns-json' } });
    if (!res.ok) return true;
    var data = await res.json();
    var valid = data.Status === 0 && Array.isArray(data.Answer) && data.Answer.length > 0;
    sessionStorage.setItem(cacheKey, valid ? '1' : '0');
    return valid;
  } catch (_) {
    return true;
  }
}

export const MUSIC_GENRES = [
  { label: '\uD83D\uDC7E 8bit',          value: 'assets/music/8bit.mp3' },
  { label: '\uD83C\uDFB8 Blues',         value: 'assets/music/blues.mp3' },
  { label: '\uD83C\uDFBB Classic',       value: 'assets/music/classic.mp3' },
  { label: '\uD83C\uDFB5 Chanzon',       value: 'assets/music/chanzon.mp3' },
  { label: '\uD83E\uDD20 Country',       value: 'assets/music/country.mp3' },
  { label: '\uD83D\uDD7A Disco',         value: 'assets/music/disco.mp3' },
  { label: '\uD83D\uDC83 Flamenco',      value: 'assets/music/flamenco.mp3' },
  { label: '\uD83D\uDE8C Funk',          value: 'assets/music/funk.mp3' },
  { label: '\uD83E\uDD18 Heavy Metal',   value: 'assets/music/heavy_metal.mp3' },
  { label: '\uD83C\uDFB7 Jazz',           value: 'assets/music/jazz.mp3' },
  { label: '\uD83E\uDD18 Metalcore',     value: 'assets/music/metalcore.mp3' },
  { label: '\uD83C\uDFBB N\u00F3ta',    value: 'assets/music/hungarian_nota.mp3' },
  { label: '\uD83C\uDFAD Opera',         value: 'assets/music/opera.mp3' },
  { label: '\uD83E\uDE97 Polka-Schramli', value: 'assets/music/polka-schramli.mp3' },
  { label: '\uD83C\uDFA4 Pop',           value: 'assets/music/pop.mp3' },
  { label: '\uD83D\uDDE3\uFE0F Rap',    value: 'assets/music/rap.mp3' },
  { label: '\uD83C\uDF34 Reggae',        value: 'assets/music/reggae.mp3' },
  { label: '\uD83D\uDE2D Hire Me Song',  value: 'assets/music/hire_me_song.mp3' },
  { label: '\uD83D\uDE2D Vegy\u00E9l Fel!!!', value: 'assets/music/vegyel_fel.mp3' },
];

function musicGenreOptionsHTML() {
  return MUSIC_GENRES.map(function (g) {
    return '            <div class="custom-option" data-value="' + g.value + '">' + g.label + '</div>';
  }).join('\n');
}

export function musicPlayerHTML() {
  var t = locale.t.bind(locale);
  return '' +
    '<div id="music-player" role="region" aria-label="Music player">' +
    '  <button id="music-toggle" aria-label="' + t('ariaOpenMusicPlayer') + '" title="Music Player"><i class="fas fa-music" aria-hidden="true"></i></button>' +
    '  <div id="music-player-box" class="music-box-hidden" role="dialog" aria-modal="false" aria-label="Music player controls">' +
    '    <button id="music-box-close" class="music-box-close-btn" aria-label="' + t('ariaCloseMusicPlayer') + '" title="Close">\u2715</button>' +
    '    <div class="music-player-content">' +
    '      <div class="music-cover" aria-hidden="true">' +
    '        <img src="assets/music/cover-xs.jpg" alt="" class="cover-dark" />' +
    '        <img src="assets/music/cover-dl-xs.jpg" alt="" class="cover-light" />' +
    '      </div>' +
    '      <div class="controls-right">' +
    '        <div class="track-time-row">' +
    '          <span class="track-time-label" id="track-time-current" aria-label="Current time">00:00</span>' +
    '          <input type="range" id="track-seek" min="0" max="100" value="0" step="0.1" class="track-seek-slider" aria-label="' + t('ariaTrackPosition') + '" />' +
    '          <span class="track-time-label" id="track-time-total" aria-label="Total duration">00:00</span>' +
    '        </div>' +
    '        <div class="custom-select" id="custom-genre-select" role="combobox" aria-label="' + t('ariaGenreSelect') + '" aria-haspopup="listbox" aria-expanded="false">' +
    '          <div class="custom-select-trigger" role="button" tabindex="0" aria-label="' + t('ariaGenreSelect') + '"><span>' + MUSIC_GENRES[0].label + '</span> <span class="arrow" aria-hidden="true">\u25BC</span></div>' +
    '          <div class="custom-select-options" role="listbox" aria-label="Genre options">\n' + musicGenreOptionsHTML() + '\n' +
    '          </div>' +
    '        </div>' +
    '        <div class="transport-buttons" role="group" aria-label="Playback controls">' +
    '          <button id="music-repeat" class="transport-btn" title="Repeat mode" aria-label="' + t('ariaToggleRepeat') + '" aria-pressed="false"><i class="fas fa-repeat" aria-hidden="true"></i></button>' +
    '          <button id="music-prev" class="transport-btn" title="Previous" aria-label="' + t('ariaPrevTrack') + '"><i class="fas fa-backward-step" aria-hidden="true"></i></button>' +
    '          <button id="music-playpause" class="transport-btn" title="Play/Pause" aria-label="' + t('ariaPlayMusic') + '"><i class="fas fa-play" aria-hidden="true"></i></button>' +
    '          <button id="music-next" class="transport-btn" title="Next" aria-label="' + t('ariaNextTrack') + '"><i class="fas fa-forward-step" aria-hidden="true"></i></button>' +
    '          <button id="music-lyrics" class="transport-btn" aria-label="' + t('ariaShowLyrics') + '" title="Lyrics"><i class="fas fa-file-lines" aria-hidden="true"></i></button>' +
    '        </div>' +
    '        <div class="volume-bottom-row">' +
    '          <span class="volume-label" aria-hidden="true"><i class="fas fa-volume-high"></i></span>' +
    '          <input type="range" id="music-volume" min="0" max="1" step="0.05" value="0.5" class="volume-slider" aria-label="' + t('ariaMusicVolume') + '" />' +
    '        </div>' +
    '        <div id="music-lyrics-panel" class="music-lyrics-hidden" role="region" aria-label="Lyrics" aria-live="polite">' +
    '          <pre id="lyrics-text"></pre>' +
    '        </div>' +
    '      </div>' +
    '    </div>' +
    '  </div>' +
    '  <audio id="music-audio" preload="auto"></audio>' +
    '</div>';
}

export function bookingModalHTML(prefix) {
  var t = locale.t.bind(locale);
  var p = prefix;
  return [
    '<div id="' + p + '-booking-modal" class="cv-modal-hidden" role="dialog" aria-modal="true" aria-labelledby="' + p + '-bk-title">',
    '  <div class="hire-backdrop" id="' + p + '-booking-backdrop"></div>',
    '  <div class="hire-dialog bk-dialog">',
    '    <div class="hire-dialog-header">',
    '      <h3 id="' + p + '-bk-title" data-bk-i18n="bookTitle">' + t('bookTitle') + '</h3>',
    '      <button class="hire-close" id="' + p + '-bk-close" type="button" aria-label="' + t('ariaCloseBooking') + '">&#x2715;</button>',
    '    </div>',
    '    <div class="bk-body">',

    '      <div id="' + p + '-bk-loading" class="bk-state" role="status" aria-live="polite">',
    '        <div class="bk-spinner" aria-hidden="true"></div>',
    '        <p data-bk-i18n="bookLoading">' + t('bookLoading') + '</p>',
    '      </div>',

    '      <div id="' + p + '-bk-error" class="bk-state bk-hidden" role="alert" aria-live="assertive">',
    '        <div class="bk-state-icon" aria-hidden="true">!</div>',
    '        <p data-bk-i18n="bookError">' + t('bookError') + '</p>',
    '        <button class="bk-btn-secondary" id="' + p + '-bk-retry" data-bk-i18n="bookRetry">' + t('bookRetry') + '</button>',
    '      </div>',

    '      <div id="' + p + '-bk-empty" class="bk-state bk-hidden" role="status">',
    '        <div class="bk-state-icon"><i class="fa-regular fa-calendar-xmark" aria-hidden="true"></i></div>',
    '        <p data-bk-i18n="bookEmpty">' + t('bookEmpty') + '</p>',
    '      </div>',

    '      <div id="' + p + '-bk-step-date" class="bk-step bk-hidden" role="region" aria-label="Step 1: Choose a date">',
    '        <p class="bk-step-label" data-bk-i18n="bookStep1">' + t('bookStep1') + '</p>',
    '        <div id="' + p + '-bk-dates" class="bk-dates-grid" role="list" aria-label="Available dates"></div>',
    '      </div>',

    '      <div id="' + p + '-bk-step-time" class="bk-step bk-hidden" role="region" aria-label="Step 2: Choose a time slot">',
    '        <button class="bk-back-btn" id="' + p + '-bk-back-date" aria-label="Back to date selection"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> <span data-bk-i18n="bookBack">' + t('bookBack') + '</span></button>',
    '        <p class="bk-step-label" data-bk-i18n="bookStep2">' + t('bookStep2') + '</p>',
    '        <div id="' + p + '-bk-date-badge" class="bk-badge" aria-live="polite"></div>',
    '        <div id="' + p + '-bk-slots" class="bk-slots-grid" role="list" aria-label="Available time slots"></div>',
    '      </div>',

    '      <div id="' + p + '-bk-step-form" class="bk-step bk-hidden" role="region" aria-label="Step 3: Your details">',
    '        <button class="bk-back-btn" id="' + p + '-bk-back-time" aria-label="Back to time slot selection"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> <span data-bk-i18n="bookBack">' + t('bookBack') + '</span></button>',
    '        <p class="bk-step-label" data-bk-i18n="bookStep3">' + t('bookStep3') + '</p>',
    '        <div id="' + p + '-bk-slot-badge" class="bk-badge" aria-live="polite"></div>',
    '        <form id="' + p + '-bk-form" novalidate aria-label="Meeting booking form">',
    '          <input type="text" id="' + p + '-bk-hp" name="bk-hp" style="display:none" tabindex="-1" autocomplete="off">',
    '          <div class="bk-field">',
    '            <label for="' + p + '-bk-name"><span data-bk-i18n="bookYourName">' + t('bookYourName') + '</span> <span class="bk-required" aria-label="required">*</span></label>',
    '            <input type="text" id="' + p + '-bk-name" name="bk-name" required placeholder="Jane Smith" aria-required="true" autocomplete="name">',
    '          </div>',
    '          <div class="bk-field">',
    '            <label for="' + p + '-bk-email"><span data-bk-i18n="bookYourEmail">' + t('bookYourEmail') + '</span> <span class="bk-required" aria-label="required">*</span></label>',
    '            <input type="email" id="' + p + '-bk-email" name="bk-email" required placeholder="your@email.com" aria-required="true" aria-describedby="' + p + '-bk-email-err" autocomplete="email">',
    '            <span class="bk-field-error" id="' + p + '-bk-email-err" role="alert" aria-live="polite"></span>',
    '          </div>',
    '          <div class="bk-field">',
    '            <label for="' + p + '-bk-topic"><span data-bk-i18n="bookTopic">' + t('bookTopic') + '</span> <span class="bk-required" aria-label="required">*</span></label>',
    '            <textarea id="' + p + '-bk-topic" name="bk-topic" rows="4" required data-bk-i18n-placeholder="bookTopicPlaceholder" placeholder="' + t('bookTopicPlaceholder') + '" aria-required="true" aria-describedby="' + p + '-bk-topic-err"></textarea>',
    '            <span class="bk-field-error" id="' + p + '-bk-topic-err" role="alert" aria-live="polite"></span>',
    '          </div>',
    '          <button type="submit" id="' + p + '-bk-submit" class="bk-btn-primary" data-bk-i18n="bookSubmit">' + t('bookSubmit') + '</button>',
    '        </form>',
    '      </div>',

    '      <div id="' + p + '-bk-step-confirm" class="bk-step bk-step-confirm bk-hidden" role="status" aria-live="polite">',
    '        <div class="bk-confirm-check" aria-hidden="true"><i class="fa-solid fa-check"></i></div>',
    '        <p class="bk-confirm-title" data-bk-i18n="bookConfirmTitle">' + t('bookConfirmTitle') + '</p>',
    '        <p id="' + p + '-bk-confirm-detail" class="bk-confirm-detail"></p>',
    '        <p class="bk-confirm-note" data-bk-i18n="bookConfirmNote">' + t('bookConfirmNote') + '</p>',
    '        <button class="bk-btn-secondary" id="' + p + '-bk-new" data-bk-i18n="bookNewBooking">' + t('bookNewBooking') + '</button>',
    '      </div>',

    '      <div id="' + p + '-bk-cooldown" class="bk-state bk-hidden" role="status" aria-live="polite">',
    '        <div class="bk-state-icon" aria-hidden="true"><i class="fa-regular fa-calendar-check"></i></div>',
    '        <p class="bk-confirm-title" data-bk-i18n="bookCooldownTitle">' + t('bookCooldownTitle') + '</p>',
    '        <p class="bk-confirm-note" data-bk-i18n="bookCooldownNote">' + t('bookCooldownNote') + '</p>',
    '      </div>',

    '    </div>',
    '  </div>',
    '</div>'
  ].join('\n');
}

export function initBookingModal(prefix) {
  var p = prefix;
  var modal = document.getElementById(p + '-booking-modal');
  var allSlots = [];
  var selectedSlot = null;

  function intlLang() {
    try {
      return Intl.DateTimeFormat.supportedLocalesOf([locale.lang]).length > 0 ? locale.lang : 'en';
    } catch(e) { return 'en'; }
  }

  var BK_COOLDOWN_KEY = 'booking_sent_ts';
  var BK_COOLDOWN_MS  = 48 * 60 * 60 * 1000;

  if (CHECK_EMAIL_DOMAIN) {
    document.getElementById(p + '-bk-email').addEventListener('blur', async function() {
      var emailVal = this.value.trim();
      var emailErr = document.getElementById(p + '-bk-email-err');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) return;
      var domain = emailVal.split('@')[1].toLowerCase();
      if (sessionStorage.getItem('mx_' + domain) !== null) return;
      emailErr.textContent = locale.t('errEmailVerifying');
      var ok = await checkEmailDomain(emailVal);
      if (document.getElementById(p + '-bk-email').value.trim() === emailVal) {
        emailErr.textContent = ok ? '' : locale.t('errEmailNoMailServer');
      }
    });
  }

  function bkIsOnCooldown() {
    var ts = parseInt(localStorage.getItem(BK_COOLDOWN_KEY) || '0', 10);
    return ts > 0 && (Date.now() - ts < BK_COOLDOWN_MS);
  }

  var SCREENS = [
    p + '-bk-loading', p + '-bk-error', p + '-bk-empty',
    p + '-bk-step-date', p + '-bk-step-time', p + '-bk-step-form',
    p + '-bk-step-confirm', p + '-bk-cooldown'
  ];

  function show(id) {
    SCREENS.forEach(function(sid) {
      var el = document.getElementById(sid);
      if (el) el.classList.toggle('bk-hidden', sid !== id);
    });
  }

  function openModal() {
    modal.classList.remove('cv-modal-hidden');
    if (bkIsOnCooldown()) {
      show(p + '-bk-cooldown');
    } else {
      loadSlots();
    }
  }

  function closeModal() {
    modal.classList.add('cv-modal-hidden');
  }

  function formatDay(date) {
    return new Intl.DateTimeFormat(intlLang(), { weekday: 'long' }).format(date);
  }
  function formatDate(date) {
    return new Intl.DateTimeFormat(intlLang(), { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  }
  function formatTime(date) {
    return String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0');
  }
  function formatSlot(start, end) {
    return formatDay(start) + ', ' + formatDate(start) + '  |  ' + formatTime(start) + ' – ' + formatTime(end);
  }

  function groupByDate(slots) {
    var map = {};
    slots.forEach(function(slot) {
      var key = slot.start.slice(0, 10);
      if (!map[key]) map[key] = [];
      map[key].push(slot);
    });
    return map;
  }

  function loadSlots() {
    show(p + '-bk-loading');
    fetch(BOOKING_SCRIPT_URL)
      .then(function(res) { if (!res.ok) throw new Error(); return res.json(); })
      .then(function(data) {
        allSlots = data.slots || [];
        if (allSlots.length === 0) { show(p + '-bk-empty'); return; }
        renderDates();
        show(p + '-bk-step-date');
      })
      .catch(function() { show(p + '-bk-error'); });
  }

  function renderDates() {
    var grouped = groupByDate(allSlots);
    var grid = document.getElementById(p + '-bk-dates');
    grid.innerHTML = '';
    Object.keys(grouped).forEach(function(dateKey) {
      var slots = grouped[dateKey];
      var date = new Date(slots[0].start);
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'bk-date-btn';
      btn.setAttribute('role', 'listitem');
      var n = slots.length;
      var slotWord = locale.t(n === 1 ? 'bookSlot' : 'bookSlots');
      btn.setAttribute('aria-label', formatDay(date) + ', ' + formatDate(date) + ' — ' + n + ' ' + slotWord);
      btn.innerHTML =
        '<span class="bk-date-day">' + formatDay(date) + '</span>' +
        '<span class="bk-date-date">' + formatDate(date) + '</span>' +
        '<span class="bk-date-count" aria-hidden="true">' + n + ' ' + slotWord + '</span>';
      btn.addEventListener('click', function() {
        document.getElementById(p + '-bk-date-badge').textContent = formatDay(date) + ', ' + formatDate(date);
        renderSlots(slots);
        show(p + '-bk-step-time');
      });
      grid.appendChild(btn);
    });
  }

  function renderSlots(slots) {
    var grid = document.getElementById(p + '-bk-slots');
    grid.innerHTML = '';
    slots.forEach(function(slot) {
      var start = new Date(slot.start);
      var end = new Date(slot.end);
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'bk-slot-btn';
      btn.setAttribute('role', 'listitem');
      var timeLabel = formatTime(start) + ' – ' + formatTime(end);
      btn.textContent = timeLabel;
      btn.setAttribute('aria-label', locale.t('ariaBookSlot') + ': ' + timeLabel);
      btn.addEventListener('click', function() {
        selectedSlot = slot;
        document.getElementById(p + '-bk-slot-badge').textContent = formatSlot(start, end);
        show(p + '-bk-step-form');
      });
      grid.appendChild(btn);
    });
  }

  // Event delegation for the trigger button (survives re-renders)
  document.body.addEventListener('click', function(e) {
    if (e.target.closest('#' + p + '-booking-btn')) openModal();
  });

  document.getElementById(p + '-bk-close').addEventListener('click', closeModal);
  document.getElementById(p + '-booking-backdrop').addEventListener('click', closeModal);
  document.getElementById(p + '-bk-retry').addEventListener('click', loadSlots);
  document.getElementById(p + '-bk-back-date').addEventListener('click', function() { show(p + '-bk-step-date'); });
  document.getElementById(p + '-bk-back-time').addEventListener('click', function() { show(p + '-bk-step-time'); });
  document.getElementById(p + '-bk-new').addEventListener('click', function() {
    selectedSlot = null;
    document.getElementById(p + '-bk-form').reset();
    document.getElementById(p + '-bk-email-err').textContent = '';
    document.getElementById(p + '-bk-topic-err').textContent = '';
    if (bkIsOnCooldown()) {
      show(p + '-bk-cooldown');
    } else {
      loadSlots();
    }
  });

  document.getElementById(p + '-bk-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    if (document.getElementById(p + '-bk-hp').value) return;

    var nameVal = document.getElementById(p + '-bk-name').value.trim();
    var emailVal = document.getElementById(p + '-bk-email').value.trim();
    var topicVal = document.getElementById(p + '-bk-topic').value.trim();
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
    var topicWordCount = topicVal.split(/\s+/).filter(Boolean).length;
    var topicOk = topicVal.length >= 20 && topicWordCount >= 4;
    document.getElementById(p + '-bk-email-err').textContent = emailOk ? '' : locale.t('errEmailInvalid');
    document.getElementById(p + '-bk-topic-err').textContent = topicOk ? '' : locale.t('errMessageTooShort');
    if (!nameVal || !emailOk || !topicOk) return;

    var submitBtn = document.getElementById(p + '-bk-submit');
    var emailErr = document.getElementById(p + '-bk-email-err');
    submitBtn.disabled = true;

    if (CHECK_EMAIL_DOMAIN) {
      emailErr.textContent = locale.t('errEmailVerifying');
      var domainOk = await checkEmailDomain(emailVal);
      if (!domainOk) {
        emailErr.textContent = locale.t('errEmailNoMailServer');
        submitBtn.disabled = false;
        return;
      }
      emailErr.textContent = '';
    }

    submitBtn.textContent = locale.t('bookSending');

    var params = new URLSearchParams({
      action: 'book', name: nameVal, email: emailVal,
      topic: topicVal, start: selectedSlot.start, end: selectedSlot.end
    });

    fetch(BOOKING_SCRIPT_URL + '?' + params.toString())
      .then(function(res) { if (!res.ok) throw new Error(); return res.json(); })
      .then(function(data) {
        if (data.success) {
          localStorage.setItem(BK_COOLDOWN_KEY, Date.now().toString());
          var start = new Date(selectedSlot.start);
          var end = new Date(selectedSlot.end);
          document.getElementById(p + '-bk-confirm-detail').textContent = formatSlot(start, end);
          show(p + '-bk-step-confirm');
        } else {
          alert(locale.t('bookFailed'));
          submitBtn.disabled = false;
          submitBtn.textContent = locale.t('bookSubmit');
        }
      })
      .catch(function() {
        alert(locale.t('bookFailed'));
        submitBtn.disabled = false;
        submitBtn.textContent = locale.t('bookSubmit');
      });
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });

  function updateText() {
    modal.querySelectorAll('[data-bk-i18n]').forEach(function(el) {
      if (!el.disabled) el.textContent = locale.t(el.dataset.bkI18n);
    });
    modal.querySelectorAll('[data-bk-i18n-placeholder]').forEach(function(el) {
      el.placeholder = locale.t(el.dataset.bkI18nPlaceholder);
    });
    if (allSlots.length > 0) renderDates();
  }

  window.addEventListener('localechange', updateText);

  return { openModal: openModal, closeModal: closeModal, updateText: updateText };
}

export function hireModalHTML(prefix, opts) {
  opts = opts || {};
  var subjectField = '';
  if (opts.subject) {
    subjectField = '<input type="hidden" name="_subject" value="' + opts.subject + '" />';
  } else if (opts.dynamicSubject) {
    subjectField = '<input type="hidden" id="' + prefix + '-subject" name="_subject" value="" />';
  }
  var successHidden = opts.simple ? '' : ' cv-success-hidden';
  var errorHidden = opts.simple ? '' : ' cv-error-hidden';
  var p1Class = opts.p1Class ? ' class="' + opts.p1Class + '"' : '';
  var p2Class = opts.p2Class ? ' class="' + opts.p2Class + '"' : '';
  var errClass = opts.errClass ? ' class="' + opts.errClass + '"' : '';
  var t = locale.t.bind(locale);
  return [
    '<!-- HIRE MODAL (prefix: "' + prefix + '") -->',
    '<div id="' + prefix + '-modal" class="cv-modal-hidden" role="dialog" aria-modal="true" aria-labelledby="' + prefix + '-dialog-title">',
    '  <div class="hire-backdrop" id="' + prefix + '-backdrop"></div>',
    '  <div class="hire-dialog">',
    '    <div class="hire-dialog-header">',
    '      <h3 id="' + prefix + '-dialog-title" data-hire-i18n="contactTitle">' + t('contactTitle') + '</h3>',
    '      <button class="hire-close" id="' + prefix + '-close" type="button" aria-label="' + t('ariaCloseContactForm') + '">&#x2715;</button>',
    '    </div>',
    '    <div data-fs-success class="' + successHidden + '" role="status" aria-live="polite">',
    '      <p' + p1Class + ' data-hire-i18n="hireThanks">' + t('hireThanks') + '</p>',
    '      <p' + p2Class + ' data-hire-i18n="hireSentNote">' + t('hireSentNote') + '</p>',
    '    </div>',
    '    <div data-hire-cooldown class="' + successHidden + '" role="status" aria-live="polite">',
    '      <p' + p1Class + ' data-hire-i18n="hireCooldownTitle">' + t('hireCooldownTitle') + '</p>',
    '      <p' + p2Class + ' data-hire-i18n="hireCooldownNote">' + t('hireCooldownNote') + '</p>',
    '    </div>',
    '    <div data-fs-error class="' + errorHidden + '" role="alert" aria-live="assertive"></div>',
    '    <form id="' + prefix + '-form" novalidate aria-label="Contact form">',
    subjectField,
    '      <input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off">',
    '      <div class="hire-field">',
    '        <label for="' + prefix + '-name" data-hire-i18n="yourName">' + t('yourName') + '</label>',
    '        <input id="' + prefix + '-name" type="text" name="name" required placeholder="' + t('namePlaceholder') + '" data-hire-i18n-placeholder="namePlaceholder" data-fs-field aria-required="true" aria-describedby="' + prefix + '-name-err" autocomplete="name" />',
    '        <span data-fs-error="name"' + errClass + '></span>',
    '        <span class="hire-field-error" id="' + prefix + '-name-err" role="alert" aria-live="polite"></span>',
    '      </div>',
    '      <div class="hire-field">',
    '        <label for="' + prefix + '-email" data-hire-i18n="yourEmail">' + t('yourEmail') + '</label>',
    '        <input id="' + prefix + '-email" type="email" name="email" required placeholder="' + t('emailPlaceholder') + '" data-hire-i18n-placeholder="emailPlaceholder" data-fs-field aria-required="true" aria-describedby="' + prefix + '-email-err" autocomplete="email" />',
    '        <span data-fs-error="email"' + errClass + '></span>',
    '        <span class="hire-field-error" id="' + prefix + '-email-err" role="alert" aria-live="polite"></span>',
    '      </div>',
    '      <div class="hire-field">',
    '        <label for="' + prefix + '-message" data-hire-i18n="message">' + t('message') + '</label>',
    '        <textarea id="' + prefix + '-message" name="message" required rows="5" placeholder="' + t('messagePlaceholder') + '" data-hire-i18n-placeholder="messagePlaceholder" data-fs-field aria-required="true" aria-describedby="' + prefix + '-msg-err"></textarea>',
    '        <span data-fs-error="message"' + errClass + '></span>',
    '        <span class="hire-field-error" id="' + prefix + '-msg-err" role="alert" aria-live="polite"></span>',
    '      </div>',
    '      <button type="submit" class="hire-submit" data-fs-submit-btn data-hire-i18n="send" aria-label="' + t('ariaSendMessage') + '">' + t('send') + '</button>',
    '    </form>',
    '  </div>',
    '</div>'
  ].join('\n');
}
