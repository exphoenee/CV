export function escHtml(str) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

export function skillChip(name, iconFile) {
  return '<div class="skill"><span class="skillImage"><img src="./assets/images/' + iconFile + '" alt="' + escHtml(name) + '" title="' + escHtml(name) + '" /></span><span>' + escHtml(name) + '</span></div>';
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

  document.getElementById(prefix + "-btn").addEventListener("click", function () {
    openModal();
  });

  document.getElementById(prefix + "-close").addEventListener("click", closeModal);
  document.getElementById(prefix + "-backdrop").addEventListener("click", closeModal);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  document.getElementById(prefix + "-form").addEventListener("submit", function() {
    closeModal();
    if (window.showToast) window.showToast("Message sent successfully.");
  });

  return { openModal: openModal, closeModal: closeModal };
}

export function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function initThemeToggle(config) {
  config = config || {};
  var KEY = config.key || "cv-swagger-theme";
  var btn = document.getElementById(config.buttonId || "theme-toggle");

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(KEY, theme);
    if (config.onSet) config.onSet(theme, btn);
  }

  btn.addEventListener("click", function () {
    var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(next);
  });

  var saved = localStorage.getItem(KEY);
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
    '  <audio id="music-audio"></audio>' +
    '</div>';
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
  return [
    '<!-- HIRE MODAL (prefix: "' + prefix + '") -->',
    '<div id="' + prefix + '-modal" class="cv-modal-hidden">',
    '  <div class="hire-backdrop" id="' + prefix + '-backdrop"></div>',
    '  <div class="hire-dialog">',
    '    <div class="hire-dialog-header">',
    '      <h3>Contact Viktor</h3>',
    '      <button class="hire-close" id="' + prefix + '-close" type="button">&#x2715;</button>',
    '    </div>',
    '    <div data-fs-success class="' + successHidden + '">',
    '      <p' + p1Class + '>Thanks for reaching out!</p>',
    '      <p' + p2Class + '>Your message was sent successfully. I\'ll get back to you soon.</p>',
    '    </div>',
    '    <div data-fs-error class="' + errorHidden + '"></div>',
    '    <form id="' + prefix + '-form">',
    subjectField,
    '      <div class="hire-field">',
    '        <label for="' + prefix + '-name">Your name</label>',
    '        <input id="' + prefix + '-name" type="text" name="name" required placeholder="Jane Smith" data-fs-field />',
    '        <span data-fs-error="name"' + errClass + '></span>',
    '      </div>',
    '      <div class="hire-field">',
    '        <label for="' + prefix + '-email">Your email</label>',
    '        <input id="' + prefix + '-email" type="email" name="email" required placeholder="your@email.com" data-fs-field />',
    '        <span data-fs-error="email"' + errClass + '></span>',
    '      </div>',
    '      <div class="hire-field">',
    '        <label for="' + prefix + '-message">Message</label>',
    '        <textarea id="' + prefix + '-message" name="message" required rows="5" placeholder="Hi Viktor, we\'d like to..." data-fs-field></textarea>',
    '        <span data-fs-error="message"' + errClass + '></span>',
    '      </div>',
    '      <button type="submit" class="hire-submit" data-fs-submit-btn>Send</button>',
    '    </form>',
    '  </div>',
    '</div>'
  ].join('\n');
}
