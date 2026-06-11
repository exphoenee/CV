import { THEME_KEY, THEME_DARK, THEME_LIGHT, PLAIN_ONLY_THEMES, BOOKING_SCRIPT_URL } from './config.js';
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

  function openModal(subject) {
    if (subjectEl && subject) subjectEl.value = subject;
    var form = document.getElementById(prefix + "-form");
    form.reset();
    var fsSuccess = document.querySelector("#" + prefix + "-modal [data-fs-success]");
    if (fsSuccess) fsSuccess.classList.add("cv-success-hidden");
    var fsError = document.querySelector("#" + prefix + "-modal [data-fs-error]");
    if (fsError) fsError.classList.add("cv-error-hidden");
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

  document.getElementById(prefix + "-form").addEventListener("submit", function() {
    closeModal();
    showToast(locale.t('messageSent'));
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

export function initFormspree(selector) {
  window.formspree = window.formspree || function () { (formspree.q = formspree.q || []).push(arguments); };
  formspree("initForm", { formElement: selector, formId: "mrejlned" });
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
  return '' +
    '<div id="music-player">' +
    '  <button id="music-toggle" aria-label="Toggle music player" title="Music Player"><i class="fas fa-music"></i></button>' +
    '  <div id="music-player-box" class="music-box-hidden">' +
    '    <button id="music-box-close" class="music-box-close-btn" aria-label="Close music player" title="Close">\u2715</button>' +
    '    <div class="music-player-content">' +
    '      <div class="music-cover">' +
    '        <img src="assets/music/cover-xs.jpg" alt="" class="cover-dark" />' +
    '        <img src="assets/music/cover-dl-xs.jpg" alt="" class="cover-light" />' +
    '      </div>' +
    '      <div class="controls-right">' +
    '        <div class="track-time-row">' +
    '          <span class="track-time-label" id="track-time-current">00:00</span>' +
    '          <input type="range" id="track-seek" min="0" max="100" value="0" step="0.1" class="track-seek-slider" />' +
    '          <span class="track-time-label" id="track-time-total">00:00</span>' +
    '        </div>' +
    '        <div class="custom-select" id="custom-genre-select">' +
    '          <div class="custom-select-trigger"><span>' + MUSIC_GENRES[0].label + '</span> <span class="arrow">\u25BC</span></div>' +
    '          <div class="custom-select-options">\n' + musicGenreOptionsHTML() + '\n' +
    '          </div>' +
    '        </div>' +
    '        <div class="transport-buttons">' +
    '          <button id="music-repeat" class="transport-btn" title="Repeat mode"><i class="fas fa-repeat"></i></button>' +
    '          <button id="music-prev" class="transport-btn" title="Previous"><i class="fas fa-backward-step"></i></button>' +
    '          <button id="music-playpause" class="transport-btn" title="Play/Pause"><i class="fas fa-play"></i></button>' +
    '          <button id="music-next" class="transport-btn" title="Next"><i class="fas fa-forward-step"></i></button>' +
    '          <button id="music-lyrics" class="transport-btn" aria-label="Show lyrics" title="Lyrics"><i class="fas fa-file-lines"></i></button>' +
    '        </div>' +
    '        <div class="volume-bottom-row">' +
    '          <span class="volume-label"><i class="fas fa-volume-high"></i></span>' +
    '          <input type="range" id="music-volume" min="0" max="1" step="0.05" value="0.5" class="volume-slider" />' +
    '        </div>' +
    '        <div id="music-lyrics-panel" class="music-lyrics-hidden">' +
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
    '<div id="' + p + '-booking-modal" class="cv-modal-hidden">',
    '  <div class="hire-backdrop" id="' + p + '-booking-backdrop"></div>',
    '  <div class="hire-dialog bk-dialog">',
    '    <div class="hire-dialog-header">',
    '      <h3 data-bk-i18n="bookTitle">' + t('bookTitle') + '</h3>',
    '      <button class="hire-close" id="' + p + '-bk-close" type="button">&#x2715;</button>',
    '    </div>',
    '    <div class="bk-body">',

    '      <div id="' + p + '-bk-loading" class="bk-state">',
    '        <div class="bk-spinner"></div>',
    '        <p data-bk-i18n="bookLoading">' + t('bookLoading') + '</p>',
    '      </div>',

    '      <div id="' + p + '-bk-error" class="bk-state bk-hidden">',
    '        <div class="bk-state-icon">!</div>',
    '        <p data-bk-i18n="bookError">' + t('bookError') + '</p>',
    '        <button class="bk-btn-secondary" id="' + p + '-bk-retry" data-bk-i18n="bookRetry">' + t('bookRetry') + '</button>',
    '      </div>',

    '      <div id="' + p + '-bk-empty" class="bk-state bk-hidden">',
    '        <div class="bk-state-icon"><i class="fa-regular fa-calendar-xmark"></i></div>',
    '        <p data-bk-i18n="bookEmpty">' + t('bookEmpty') + '</p>',
    '      </div>',

    '      <div id="' + p + '-bk-step-date" class="bk-step bk-hidden">',
    '        <p class="bk-step-label" data-bk-i18n="bookStep1">' + t('bookStep1') + '</p>',
    '        <div id="' + p + '-bk-dates" class="bk-dates-grid"></div>',
    '      </div>',

    '      <div id="' + p + '-bk-step-time" class="bk-step bk-hidden">',
    '        <button class="bk-back-btn" id="' + p + '-bk-back-date"><i class="fa-solid fa-arrow-left"></i> <span data-bk-i18n="bookBack">' + t('bookBack') + '</span></button>',
    '        <p class="bk-step-label" data-bk-i18n="bookStep2">' + t('bookStep2') + '</p>',
    '        <div id="' + p + '-bk-date-badge" class="bk-badge"></div>',
    '        <div id="' + p + '-bk-slots" class="bk-slots-grid"></div>',
    '      </div>',

    '      <div id="' + p + '-bk-step-form" class="bk-step bk-hidden">',
    '        <button class="bk-back-btn" id="' + p + '-bk-back-time"><i class="fa-solid fa-arrow-left"></i> <span data-bk-i18n="bookBack">' + t('bookBack') + '</span></button>',
    '        <p class="bk-step-label" data-bk-i18n="bookStep3">' + t('bookStep3') + '</p>',
    '        <div id="' + p + '-bk-slot-badge" class="bk-badge"></div>',
    '        <form id="' + p + '-bk-form" novalidate>',
    '          <div class="bk-field">',
    '            <label><span data-bk-i18n="bookYourName">' + t('bookYourName') + '</span> <span class="bk-required">*</span></label>',
    '            <input type="text" id="' + p + '-bk-name" required placeholder="Jane Smith">',
    '          </div>',
    '          <div class="bk-field">',
    '            <label><span data-bk-i18n="bookYourEmail">' + t('bookYourEmail') + '</span> <span class="bk-required">*</span></label>',
    '            <input type="email" id="' + p + '-bk-email" required placeholder="your@email.com">',
    '          </div>',
    '          <div class="bk-field">',
    '            <label data-bk-i18n="bookTopic">' + t('bookTopic') + '</label>',
    '            <input type="text" id="' + p + '-bk-topic" data-bk-i18n-placeholder="bookTopicPlaceholder" placeholder="' + t('bookTopicPlaceholder') + '">',
    '          </div>',
    '          <button type="submit" id="' + p + '-bk-submit" class="bk-btn-primary" data-bk-i18n="bookSubmit">' + t('bookSubmit') + '</button>',
    '        </form>',
    '      </div>',

    '      <div id="' + p + '-bk-step-confirm" class="bk-step bk-step-confirm bk-hidden">',
    '        <div class="bk-confirm-check"><i class="fa-solid fa-check"></i></div>',
    '        <p class="bk-confirm-title" data-bk-i18n="bookConfirmTitle">' + t('bookConfirmTitle') + '</p>',
    '        <p id="' + p + '-bk-confirm-detail" class="bk-confirm-detail"></p>',
    '        <p class="bk-confirm-note" data-bk-i18n="bookConfirmNote">' + t('bookConfirmNote') + '</p>',
    '        <button class="bk-btn-secondary" id="' + p + '-bk-new" data-bk-i18n="bookNewBooking">' + t('bookNewBooking') + '</button>',
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

  var SCREENS = [
    p + '-bk-loading', p + '-bk-error', p + '-bk-empty',
    p + '-bk-step-date', p + '-bk-step-time', p + '-bk-step-form', p + '-bk-step-confirm'
  ];

  function show(id) {
    SCREENS.forEach(function(sid) {
      var el = document.getElementById(sid);
      if (el) el.classList.toggle('bk-hidden', sid !== id);
    });
  }

  function openModal() {
    modal.classList.remove('cv-modal-hidden');
    loadSlots();
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
      var n = slots.length;
      btn.innerHTML =
        '<span class="bk-date-day">' + formatDay(date) + '</span>' +
        '<span class="bk-date-date">' + formatDate(date) + '</span>' +
        '<span class="bk-date-count">' + n + ' ' + locale.t(n === 1 ? 'bookSlot' : 'bookSlots') + '</span>';
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
      btn.textContent = formatTime(start) + ' – ' + formatTime(end);
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
    loadSlots();
  });

  document.getElementById(p + '-bk-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var nameVal = document.getElementById(p + '-bk-name').value.trim();
    var emailVal = document.getElementById(p + '-bk-email').value.trim();
    var topicVal = document.getElementById(p + '-bk-topic').value.trim();
    if (!nameVal || !emailVal) return;

    var submitBtn = document.getElementById(p + '-bk-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = locale.t('bookSending');

    var params = new URLSearchParams({
      action: 'book', name: nameVal, email: emailVal,
      topic: topicVal, start: selectedSlot.start, end: selectedSlot.end
    });

    fetch(BOOKING_SCRIPT_URL + '?' + params.toString())
      .then(function(res) { if (!res.ok) throw new Error(); return res.json(); })
      .then(function(data) {
        if (data.success) {
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
    '<div id="' + prefix + '-modal" class="cv-modal-hidden">',
    '  <div class="hire-backdrop" id="' + prefix + '-backdrop"></div>',
    '  <div class="hire-dialog">',
    '    <div class="hire-dialog-header">',
    '      <h3 data-hire-i18n="contactTitle">' + t('contactTitle') + '</h3>',
    '      <button class="hire-close" id="' + prefix + '-close" type="button">&#x2715;</button>',
    '    </div>',
    '    <div data-fs-success class="' + successHidden + '">',
    '      <p' + p1Class + ' data-hire-i18n="hireThanks">' + t('hireThanks') + '</p>',
    '      <p' + p2Class + ' data-hire-i18n="hireSentNote">' + t('hireSentNote') + '</p>',
    '    </div>',
    '    <div data-fs-error class="' + errorHidden + '"></div>',
    '    <form id="' + prefix + '-form">',
    subjectField,
    '      <div class="hire-field">',
    '        <label for="' + prefix + '-name" data-hire-i18n="yourName">' + t('yourName') + '</label>',
    '        <input id="' + prefix + '-name" type="text" name="name" required placeholder="' + t('namePlaceholder') + '" data-hire-i18n-placeholder="namePlaceholder" data-fs-field />',
    '        <span data-fs-error="name"' + errClass + '></span>',
    '      </div>',
    '      <div class="hire-field">',
    '        <label for="' + prefix + '-email" data-hire-i18n="yourEmail">' + t('yourEmail') + '</label>',
    '        <input id="' + prefix + '-email" type="email" name="email" required placeholder="' + t('emailPlaceholder') + '" data-hire-i18n-placeholder="emailPlaceholder" data-fs-field />',
    '        <span data-fs-error="email"' + errClass + '></span>',
    '      </div>',
    '      <div class="hire-field">',
    '        <label for="' + prefix + '-message" data-hire-i18n="message">' + t('message') + '</label>',
    '        <textarea id="' + prefix + '-message" name="message" required rows="5" placeholder="' + t('messagePlaceholder') + '" data-hire-i18n-placeholder="messagePlaceholder" data-fs-field></textarea>',
    '        <span data-fs-error="message"' + errClass + '></span>',
    '      </div>',
    '      <button type="submit" class="hire-submit" data-fs-submit-btn data-hire-i18n="send">' + t('send') + '</button>',
    '    </form>',
    '  </div>',
    '</div>'
  ].join('\n');
}
