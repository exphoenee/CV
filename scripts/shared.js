var CV = window.CV || {};

CV.initHireModal = function (prefix) {
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
};

CV.getSystemTheme = function () {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

CV.initThemeToggle = function (config) {
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
  else setTheme(CV.getSystemTheme());
};

CV.saveState = function (key, id, value) {
  var state = JSON.parse(localStorage.getItem(key) || "{}");
  state[id] = value;
  localStorage.setItem(key, JSON.stringify(state));
};

CV.loadState = function (key, id, defaultValue) {
  var state = JSON.parse(localStorage.getItem(key) || "{}");
  if (state[id] === undefined) return defaultValue;
  return state[id];
};

CV.restoreCollapseStates = function (key) {
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
};

CV.initFormspree = function (selector) {
  window.formspree = window.formspree || function () { (formspree.q = formspree.q || []).push(arguments); };
  formspree("initForm", { formElement: selector, formId: "mrejlned" });
};

// ──────────────────────────────────────────────
// Injectable HTML templates (to reduce duplication across pages)
// ──────────────────────────────────────────────

CV.musicPlayerHTML = function () {
  return '' +
    '<div id="music-player">' +
    '  <button id="music-toggle" aria-label="Toggle music player" title="Music Player"><i class="fas fa-music"></i></button>' +
    '  <div id="music-player-box" class="music-box-hidden">' +
    '    <button id="music-box-close" class="music-box-close-btn" aria-label="Close music player" title="Close">\u2715</button>' +
    '    <div class="music-player-content">' +
    '      <div class="music-cover">' +
    '        <img src="assets/music/cover-xs.jpg" alt="Cover" />' +
    '      </div>' +
    '      <div class="controls-right">' +
    '        <div class="track-time-row">' +
    '          <span class="track-time-label" id="track-time-current">00:00</span>' +
    '          <input type="range" id="track-seek" min="0" max="100" value="0" step="0.1" class="track-seek-slider" />' +
    '          <span class="track-time-label" id="track-time-total">00:00</span>' +
    '        </div>' +
    '        <div class="custom-select" id="custom-genre-select">' +
    '          <div class="custom-select-trigger"><span>\uD83D\uDC7E 8bit</span> <span class="arrow">\u25BC</span></div>' +
    '          <div class="custom-select-options">' +
    '            <div class="custom-option" data-value="assets/music/8bit.mp3">\uD83D\uDC7E 8bit</div>' +
    '            <div class="custom-option" data-value="assets/music/blues.mp3">\uD83C\uDFB8 Blues</div>' +
    '            <div class="custom-option" data-value="assets/music/classic.mp3">\uD83C\uDFBB Classic</div>' +
    '            <div class="custom-option" data-value="assets/music/chanzon.mp3">\uD83C\uDFB5 Chanzon</div>' +
    '            <div class="custom-option" data-value="assets/music/country.mp3">\uD83E\uDD20 Country</div>' +
    '            <div class="custom-option" data-value="assets/music/disco.mp3">\uD83D\uDD7A Disco</div>' +
    '            <div class="custom-option" data-value="assets/music/flamenco.mp3">\uD83D\uDC83 Flamenco</div>' +
    '            <div class="custom-option" data-value="assets/music/funk.mp3">\uD83D\uDE8C Funk</div>' +
    '            <div class="custom-option" data-value="assets/music/heavy_metal.mp3">\uD83E\uDD18 Heavy Metal</div>' +
    '            <div class="custom-option" data-value="assets/music/jazz.mp3">\uD83C\uDFB7 Jazz</div>' +
    '            <div class="custom-option" data-value="assets/music/metalcore.mp3">\uD83E\uDD18 Metalcore</div>' +
    '            <div class="custom-option" data-value="assets/music/hungarian_nota.mp3">\uD83C\uDFBB N\u00F3ta</div>' +
    '            <div class="custom-option" data-value="assets/music/polka-schramli.mp3">\uD83E\uDE97 Polka-Schramli</div>' +
    '            <div class="custom-option" data-value="assets/music/pop.mp3">\uD83C\uDFA4 Pop</div>' +
    '            <div class="custom-option" data-value="assets/music/rap.mp3">\uD83D\uDDE3\uFE0F Rap</div>' +
    '            <div class="custom-option" data-value="assets/music/reggae.mp3">\uD83C\uDF34 Reggae</div>' +
    '            <div class="custom-option" data-value="assets/music/hire_me_song.mp3">\uD83D\uDE2D Hire Me Song</div>' +
    '            <div class="custom-option" data-value="assets/music/vegyel_fel.mp3">\uD83D\uDE2D Vegy\u00E9l Fel!!!</div>' +
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
};

CV.hireModalHTML = function (prefix, opts) {
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
};

// ── Auto-inject shared UI components based on page detection ──
(function () {
  // Inject music player if the page uses Font Awesome (indicator of music player support)
  var hasFA = false;
  var links = document.querySelectorAll('link[rel="stylesheet"]');
  for (var i = 0; i < links.length; i++) {
    if (links[i].href && links[i].href.indexOf('font-awesome') > -1) {
      hasFA = true;
      break;
    }
  }
  if (hasFA && !document.getElementById('music-player')) {
    document.body.insertAdjacentHTML('beforeend', CV.musicPlayerHTML());
  }

  // Inject hire modal for each hire-*-btn element missing its modal
  var allButtons = document.querySelectorAll('[id$="-btn"]');
  for (var j = 0; j < allButtons.length; j++) {
    var id = allButtons[j].id;
    if (id.indexOf('hire-') === 0 && id.lastIndexOf('-btn') === id.length - 4) {
      var prefix = id.substring(0, id.length - 4);
      if (!document.getElementById(prefix + '-modal')) {
        var opts = {};
        if (prefix === 'hire-index') {
          opts.subject = 'Hire inquiry from index';
          opts.simple = true;
          opts.p1Class = 'fs-success-title';
          opts.p2Class = 'fs-success-msg';
          opts.errClass = 'fs-error-msg';
        } else if (prefix === 'hire-plain') {
          opts.subject = 'Hire inquiry from CV - plain';
          opts.p1Class = 'cv-plain-inline-11';
          opts.p2Class = 'cv-plain-inline-12';
          opts.errClass = 'cv-plain-inline-14';
        } else if (prefix === 'hire-json') {
          opts.subject = 'Hire inquiry from CV - json';
          opts.p1Class = 'cv-json-inline-5';
          opts.p2Class = 'cv-json-inline-6';
          opts.errClass = 'cv-json-inline-8';
        } else if (prefix === 'hire') {
          opts.dynamicSubject = true;
        }
        document.body.insertAdjacentHTML('beforeend', CV.hireModalHTML(prefix, opts));
      }
    }
  }
})();

// ──────────────────────────────────────────────
// Template rendering: CV from CV_DATA
// ──────────────────────────────────────────────

// Helper: escape HTML entities
CV.escHtml = function (str) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// Helper: render skill chip (image + label)
CV.skillChip = function (name, iconFile) {
  return '<div class="skill"><span class="skillImage"><img src="./assets/images/' + iconFile + '" alt="' + CV.escHtml(name) + '" title="' + CV.escHtml(name) + '" /></span><span>' + CV.escHtml(name) + '</span></div>';
};

// Helper: write ref links list (comma separated)
CV.refLinks = function (refs) {
  if (!refs || refs.length === 0) return "";
  return refs.map(function (r) {
    return '<a href="' + CV.escHtml(r.url) + '" target="_blank" rel="noopener noreferrer">' + CV.escHtml(r.label) + '</a>';
  }).join("\n              ");
};

// Helper: render bullet items from an array of strings
CV.renderBullets = function (bullets, indent) {
  if (!bullets || !bullets.length) return "";
  indent = indent || "";
  return bullets.map(function (b) {
    return indent + '<div><i class="bullet-icon"></i>' + b + "</div>";
  }).join("\n");
};

// Render a single work experience item for plain CV
CV.renderWorkItem = function (exp) {
  var html = '';
  html += '      <div class="item noBreakInside workExperienceItem cv-item">';
  html += '        <div class="itemHeaderWrapper">';
  html += '          <div class="itemLogoAndTitle">';
  html += '            <div class="itemLogo">';
  html += '              <img alt="' + CV.escHtml(exp.company) + '" title="' + CV.escHtml(exp.company) + '" src="./assets/images/' + exp.logo + '" />';
  html += '              </div>';
  html += '            <div class="itemTitle">' + CV.escHtml(exp.company) + '</div>';
  html += '          </div>';
  html += '          <div class="itemDetails itemDetailsWithDate">' + CV.escHtml(exp.title) + '</div>';
  html += '          <div class="itemDate">' + CV.escHtml(exp.periodLabel) + '</div>';
  html += '          </div>';
  html += '          <div class="itemContentContainer">';
  html += '          <div class="itemDescription">';

  if (exp.projects) {
    // Aegex-style: has sub-projects with bullets
    html += '            <p>' + exp.description + '</p>';
    html += '            <div class="cv-plain-inline-2">';
    exp.projects.forEach(function (proj, pi) {
      html += '              <div>';
      html += '                <div><strong>' + CV.escHtml(proj.name) + '</strong> - ' + CV.escHtml(proj.subtitle) + '</div>';
      html += CV.renderBullets(proj.bullets, "                ");
      html += '              </div>';
    });
    html += '            </div>';
  } else if (Array.isArray(exp.bullets)) {
    // Simple bullet list (Telekom, Scolia)
    html += '            <div>' + exp.description + '</div>';
    html += '            <div class="cv-plain-inline-2">';
    html += CV.renderBullets(exp.bullets, "              ");
    html += '            </div>';
  } else if (exp.bullets && typeof exp.bullets === "object") {
    // Structured bullets (Cubicfox, CobotX, WebforSol)
    html += '            ' + exp.description;
    html += '            <div class="cv-plain-inline-7">';
    var keys = Object.keys(exp.bullets);
    keys.forEach(function (key) {
      var label = key.replace(/([A-Z])/g, " $1").replace(/^./, function (s) { return s.toUpperCase(); });
      html += '              <div>';
      html += '                <div><strong>' + label + '</strong></div>';
      html += CV.renderBullets(exp.bullets[key], "                ");
      html += '              </div>';
    });
    html += '            </div>';
  } else {
    html += '            ' + (exp.description || "");
  }

  html += '          </div>';

  // References
  if (exp.refs && exp.refs.length > 0) {
    html += '          <div class="cv-plain-inline-3">';
    html += '            <div class="cv-plain-inline-4"><strong>Reference(s):</strong></div>';
    var refClass = exp.refs.length > 1 ? 'cv-plain-inline-5' : 'cv-plain-inline-6';
    html += '            <div class="' + refClass + '">';
    html += '              ' + CV.refLinks(exp.refs);
    html += '            </div>';
    html += '          </div>';
  }

  // Skills
  if (exp.skills && exp.skills.length > 0) {
    html += '          <div class="itemSkills">';
    exp.skills.forEach(function (skill) {
      var iconFile = skill.toLowerCase().replace(/[ .]/g, "") + ".svg";
      html += '            ' + CV.skillChip(skill, iconFile);
    });
    html += '            </div>';
  }

  html += '        </div>';
  html += '      </div>';
  return html;
};

// Render full plain CV HTML from CV_DATA
CV.renderPlainCV = function (data) {
  var h = '';

  h += '    <div class="cv-plain-inline-0 cvLayout base cv">';

  // ── Header ──
  h += '      <div class="header">';
  h += '        <div class="name-container">';
  h += '          <span class="name">' + CV.escHtml(data.identity.name) + '</span>';
  h += '          <div class="header-buttons">';
  h += '            <button class="hire-btn-plain" id="hire-plain-btn">Hire Me</button>';
  h += '            <button class="print-btn-plain" id="print-plain-btn" title="Print CV">\uD83D\uDDB8\uFE0F Print</button>';
  h += '          </div>';
  h += '          </div>';
  h += '          <div class="deatils-container">';
  h += '            <div class="roleContacts">';
  h += '              <div class="role">' + CV.escHtml(data.identity.role) + '</div>';
  h += '            <div class="cv-plain-inline-1 contacts">';

  data.identity.contacts.forEach(function (c) {
    if (c.url) {
      h += '              <div><a target="_blank" href="' + CV.escHtml(c.url) + '">' + CV.escHtml(c.label) + '</a></div>';
    } else {
      h += '              <div>' + CV.escHtml(c.label) + '</div>';
    }
  });

  h += '              </div>';
  h += '              </div>';
  h += '              <div class="intro">';
  h += '                ' + data.summary;
  h += '              </div>';
  h += '        </div>';
  h += '      </div>';

  // ── Work Experience ──
  h += '<div class="blockTitle noBreakBeforeAfter cv-block-title"><span>Work Experience</span></div>';

  data.workExperience.forEach(function (exp) {
    h += CV.renderWorkItem(exp);
  });

  // ── Education ──
  h += '<div class="blockTitle noBreakBeforeAfter cv-block-title"><span>Education</span></div>';
  h += '      <div class="item noBreakInside educationItem cv-item">';
  h += '        <div class="itemContent" style="display: flex; flex-direction: column; gap: 8px;">';
  h += '          <div class="itemTitle" style="width: 100%; margin-bottom: 0.5rem;">';
  h += '            ' + CV.escHtml(data.education.institution);
  h += '          </div>';
  h += '          <div style="width: 100%; display: grid; grid-template-columns: 1fr auto; gap: 4px 16px; align-items: baseline; font-size: 0.95em;">';

  data.education.degrees.forEach(function (deg) {
    h += '            <div><i class="bullet-icon"></i>' + CV.escHtml(deg.title) + '</div>';
    h += '            <div style="opacity: 0.7; font-size: 0.9em; text-align: right; white-space: nowrap;">' + CV.escHtml(deg.years) + '</div>';
  });

  h += '          </div>';
  h += '        </div>';
  h += '      </div>';

  // ── Languages ──
  h += '<div class="blockTitle noBreakBeforeAfter cv-block-title"><span>Languages</span></div>';
  h += '      <div class="item noBreakInside cv-item">';
  h += '        <div class="cv-plain-inline-8 itemDescription">';

  data.identity.languages.forEach(function (lang) {
    h += '          <div><strong>' + CV.escHtml(lang.name) + ':</strong>&nbsp;' + CV.escHtml(lang.level) + '</div>';
  });

  h += '        </div>';
  h += '      </div>';

  // ── Programming Languages ──
  h += '<div class="blockTitle noBreakBeforeAfter cv-block-title"><span>Programming Languages</span></div>';
  h += '      <div class="item noBreakInside cv-item">';
  h += '        <div class="itemContent">';
  h += '          <div class="itemSkills">';

  data.programmingLanguages.forEach(function (pl) {
    h += '            ' + CV.skillChip(pl.name, pl.icon);
  });

  h += '          </div>';
  h += '        </div>';
  h += '      </div>';

  // ── Community & Mentorship ──
  h += '<div class="blockTitle noBreakBeforeAfter cv-block-title"><span>Community &amp; Mentorship</span></div>';
  h += '      <div class="item noBreakInside cv-item">';
  h += '        <div class="itemDescription">';
  h += '          ' + data.community;
  h += '        </div>';
  h += '      </div>';

  // ── Hobby Projects ──
  h += '<div class="blockTitle noBreakBeforeAfter cv-block-title"><span>Hobby Projects</span></div>';
  h += '      <div class="item noBreakInside cv-item">';
  h += '        <div class="itemDescription">';
  h += '          <div class="hobby-links">';

  data.hobbyProjects.forEach(function (proj, idx) {
    h += '            <a href="' + CV.escHtml(proj.url) + '" target="_blank" rel="noopener noreferrer">' + CV.escHtml(proj.name) + '</a>';
    if (idx < data.hobbyProjects.length - 1) {
      h += ',';
    }
    h += "\n";
  });

  h += '          </div>';
  h += '        </div>';
  h += '      </div>';

  // ── Powered by ──
  h += '      <div class="poweredBy">';
  h += '        <a href="https://profile.codersrank.io/user/exphoenee/" target="_blank"><span>Powered by</span>&nbsp;';
  h += '          <img src="./assets/images/codersrank.svg" alt="codersrank" class="codersrank">';
  h += '        </a>';
  h += '      </div>';
  h += '    </div>';

  return h;
};

// ──────────────────────────────────────────────
// Swagger UI template rendering helpers
// ──────────────────────────────────────────────

// Shared SVG icons
CV._svgClipboard = '<svg viewBox="0 0 15 16" width="15" height="16" aria-hidden="true" focusable="false"><g transform="translate(2, -1)"><path fill="#7d8492" fill-rule="evenodd" d="M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2c-.02.28-.11.52-.3.7-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2 2-2 1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55 0-1-.45-1-1s-.45-1-1-1-1 .45-1 1-.45 1-1 1H3c-.55 0-1 .45-1 1z"></path></g></svg>';

CV._svgLockUnlocked = '<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false"><path fill="#7d8492" d="M15.8 8H14V5.6C14 2.703 12.665 1 10 1 7.334 1 6 2.703 6 5.6V6h2v-.801C8 3.754 8.797 3 10 3c1.203 0 2 .754 2 2.199V8H4c-.553 0-1 .646-1 1.199V17c0 .549.428 1.139.951 1.307l1.197.387C5.672 18.861 6.55 19 7.1 19h5.8c.549 0 1.428-.139 1.951-.307l1.196-.387c.524-.167.953-.757.953-1.306V9.199C17 8.646 16.352 8 15.8 8z"></path></svg>';

CV._svgArrowUp = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="arrow" width="20" height="20" aria-hidden="true"><path d="M17.418 6.109c.272-.268.709-.268.979 0s.271.701 0 .969l-7.908 7.83c-.27.268-.707.268-.979 0l-7.908-7.83c-.27-.268-.27-.701 0-.969.271-.268.709-.268.979 0L10 13.25l7.418-7.141z"/></svg>';

CV._svgArrowDown = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="arrow" width="20" height="20" aria-hidden="true"><path d="M17.418 14.908C17.69 15.176 18.127 15.176 18.397 14.908c.27-.268.271-.701 0-.969L10.489 6.109c-.27-.268-.707-.268-.979 0L1.602 13.939c-.27.268-.27.701 0 .969.271.268.708.268.979 0L10 7.767l7.418 7.141z"/></svg>';

// Build an endpoint summary bar (shared by all methods)
CV._swgSummary = function (method, path, desc, extraBadge) {
  var cls = method.toLowerCase();
  var badge = extraBadge ? ' ' + extraBadge : '';
  return '<div class="opblock-summary opblock-summary-' + cls + '"><button class="opblock-summary-control"><span class="opblock-summary-method">' + method + '</span><div class="opblock-summary-path-description-wrapper"><span class="opblock-summary-path"><a class="nostyle"><span>' + CV.escHtml(path) + '</span></a></span><div class="opblock-summary-description">' + desc + badge + '</div></div></button><div class="view-line-link copy-to-clipboard" title="Copy to clipboard">' + CV._svgClipboard + '</div><button class="authorization__btn unlocked" aria-label="authorization button unlocked">' + CV._svgLockUnlocked + '</button><button class="opblock-control-arrow">' + CV._svgArrowUp + '</button></div>';
};

// Build description wrapper
CV._swgDesc = function (html) {
  return '<div class="opblock-description-wrapper"><div class="opblock-description"><div class="renderedMarkdown">' + html + '</div></div></div>';
};

// Build parameter table from rows array [{name, type, loc, descHtml}]
CV._swgParams = function (rows) {
  if (!rows || rows.length === 0) return '<div class="parameters-container"><div class="opblock-description-wrapper"><p>No parameters</p></div></div>';
  var r = '<div class="parameters-container"><div class="table-container"><table class="parameters"><thead><tr><th class="col_header parameters-col_name">Name</th><th class="col_header parameters-col_description">Description</th></tr></thead><tbody>';
  rows.forEach(function (p) {
    r += '<tr><td class="parameters-col_name"><div class="parameter__name">' + CV.escHtml(p.name) + '</div><div class="parameter__type">' + CV.escHtml(p.type) + '</div><div class="parameter__in">' + CV.escHtml(p.loc || "metadata") + '</div></td><td class="parameters-col_description"><div class="renderedMarkdown">' + p.descHtml + '</div></td></tr>';
  });
  r += '</tbody></table></div></div>';
  return r;
};

// Build responses section
CV._swgResponses = function (rows) {
  var r = '<div class="responses-wrapper"><div class="opblock-section-header"><h4>Responses</h4></div><div class="responses-inner"><table class="responses-table" aria-live="polite" role="region"><thead><tr class="responses-header"><td class="col_header response-col_status">Code</td><td class="col_header response-col_description">Description</td><td class="col_header response-col_links">Links</td></tr></thead><tbody>';
  rows.forEach(function (row) {
    r += '<tr class="response"><td class="response-col_status">' + row.code + '</td><td class="response-col_description"><div class="renderedMarkdown">' + row.bodyHtml + '</div><section class="response-controls"><div class="response-control-media-type response-control-media-type--accept-controller"><small class="response-control-media-type__title">Media type</small><div class="content-type-wrapper"><select aria-label="Media Type" class="content-type"><option value="application/json">application/json</option></select></div><small class="response-control-media-type__accept-message">Controls <code>Accept</code>header.</small></div></section></td><td class="response-col_links">' + (row.linksHtml || 'No links') + '</td></tr>';
  });
  r += '</tbody></table></div></div>';
  return r;
};

// Build complete GET endpoint block
CV._swgGet = function (tag, id, path, desc, descHtml, paramRows, responseRows) {
  return '<div class="opblock opblock-get" id="operations-' + tag + '-' + id + '">' + CV._swgSummary('GET', path, desc) + '<div class="opblock-body">' + CV._swgDesc(descHtml) + '<div class="opblock-section"><div class="opblock-section-header"><div class="tab-header"><div class="tab-item active"><h4 class="opblock-title"><span>Parameters</span></h4></div></div><div class="try-out"><button class="try-out__btn hire-trigger">Hire me</button></div></div>' + CV._swgParams(paramRows) + '</div>' + CV._swgResponses(responseRows) + '</div></div>';
};

// Build complete POST endpoint block
CV._swgPost = function (tag, id, path, desc, descHtml, paramRows, responseRows) {
  return '<div class="opblock opblock-post" id="operations-' + tag + '-' + id + '">' + CV._swgSummary('POST', path, desc) + '<div class="opblock-body">' + CV._swgDesc(descHtml) + '<div class="opblock-section"><div class="opblock-section-header"><div class="tab-header"><div class="tab-item active"><h4 class="opblock-title"><span>Parameters</span></h4></div></div><div class="try-out"><button class="try-out__btn hire-trigger">Hire me</button></div></div>' + CV._swgParams(paramRows) + '</div>' + CV._swgResponses(responseRows) + '</div></div>';
};

// Build complete PUT endpoint block
CV._swgPut = function (tag, id, path, desc, descHtml, paramRows, responseRows) {
  return '<div class="opblock opblock-put" id="operations-' + tag + '-' + id + '">' + CV._swgSummary('PUT', path, desc) + '<div class="opblock-body">' + CV._swgDesc(descHtml) + '<div class="opblock-section"><div class="opblock-section-header"><div class="tab-header"><div class="tab-item active"><h4 class="opblock-title"><span>Parameters</span></h4></div></div><div class="try-out"><button class="try-out__btn hire-trigger">Hire me</button></div></div>' + CV._swgParams(paramRows) + '</div>' + CV._swgResponses(responseRows) + '</div></div>';
};

// Build a tag section wrapper
CV._swgTagSection = function (tagName, endpointsHtml) {
  return '<div class="opblock-tag-section is-open" id="operations-tag-' + tagName + '"><h3 class="opblock-tag no-desc"><span>' + tagName + '</span><small></small><button class="expand-operation" title="Collapse operation">' + CV._svgArrowDown + '</button></h3><div class="no-margin"><div class="operation-tag-content">' + endpointsHtml + '</div></div></div>';
};

// Stack chips for a skills array
CV._swgStack = function (skills) {
  if (!skills || skills.length === 0) return '';
  var items = skills.map(function (s) { return '<span class="cv-stack-item">' + CV.escHtml(s) + '</span>'; }).join('');
  return '<div class="cv-stack">' + items + '</div>';
};

// ──────────────────────────────────────────────
// CV.renderSwaggerContent(data) — Main render function
// ──────────────────────────────────────────────
CV.renderSwaggerContent = function (data) {
  var E = CV.escHtml;
  var parts = [];

  // ── 1. Topbar ──
  parts.push('<section class="swagger-ui swagger-container">');
  parts.push('<div class="topbar"><div class="topbar-wrapper"><a class="cv-inline-0 link"><img src="assets/images/swagger.svg" height="36" alt="Swagger" /><span class="cv-inline-1"><span class="cv-inline-2">viktor</span><span class="cv-inline-3">bozzay</span></span></a><button class="theme-toggle" id="theme-toggle" title="Toggle dark mode"><svg class="light-icon" viewBox="0 0 24 24" height="22"><path d="M12 2C9.76 2 7.78 3.05 6.5 4.68l9.81 9.82C17.94 13.21 19 11.24 19 9a7 7 0 0 0-7-7M3.28 4 2 5.27 5.04 8.3C5 8.53 5 8.76 5 9c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h5.73l4 4L20 20.72zM9 20v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1z"/></svg><svg class="dark-icon" viewBox="0 0 24 24" height="22"><path d="M12 2C9.76 2 7.78 3.05 6.5 4.68l9.81 9.82C17.94 13.21 19 11.24 19 9a7 7 0 0 0-7-7M3.28 4 2 5.27 5.04 8.3C5 8.53 5 8.76 5 9c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h5.73l4 4L20 20.72zM9 20v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1z"/></svg></button><form class="cv-inline-4 download-url-wrapper"><label class="cv-inline-5 select-label"><span>Endpoint</span><div class="cv-inline-5 servers"><label class="cv-inline-5"><select class="cv-inline-5"><option>https://bozzayviktor.hu/cv/api - Viktor Bozzay CV API v' + E(data.meta.version) + '</option></select></label></div></label></form></div></div>');

  // ── 2. Info section ──
  parts.push('<div class="information-container wrapper"><section class="block col-12"><div><div class="info"><hgroup class="main"><h1 class="title">' + E(data.identity.name) + ' - Curriculum Vitae API<span><small><pre class="version">' + E(data.meta.version) + ' </pre></small><small class="version-stamp"><pre class="version">REST</pre></small></span></h1></hgroup><div class="description"><div class="renderedMarkdown"><p>' + data.summary + '</p><p>');

  // Contact links
  data.identity.contacts.forEach(function (c, i) {
    if (i > 0) parts.push('&nbsp;·&nbsp; ');
    if (c.url) {
      if (c.url.indexOf('mailto:') === 0) {
        parts.push('<a href="' + E(c.url) + '">' + E(c.label) + '</a>');
      } else {
        parts.push('<a href="' + E(c.url) + '" target="_blank">' + E(c.label) + '</a>');
      }
    } else {
      parts.push(E(c.label));
    }
  });

  parts.push('</p></div></div></div></div></section></div>');

  // ── 3. Scheme container ──
  parts.push('<div class="scheme-container"><section class="schemes wrapper block col-12"><div class="schemes-server-container"><div><span class="servers-title">Location</span><div class="servers"><label><select><option>' + E(data.identity.location) + ' - open to remote / hybrid</option></select></label></div></div></div><div class="auth-wrapper"><button class="btn authorize locked" id="hire-btn"><span>Hire</span><svg class="lock-icon" viewBox="0 0 20 20" width="20" height="20"><path d="M15.8 8H4c-.553 0-1 .646-1 1.199V17c0 .549.428 1.139.951 1.307l1.197.387C5.672 18.861 6.55 19 7.1 19h5.8c.549 0 1.428-.139 1.951-.307l1.196-.387c.524-.167.953-.757.953-1.306V9.199C17 8.646 16.352 8 15.8 8z"/><path class="lock-shackle" d="M14 8V5.6C14 2.703 12.665 1 10 1 7.334 1 6 2.703 6 5.6V6h2v-.801C8 3.754 8.797 3 10 3c1.203 0 2 .754 2 2.199V8h2z"/></svg></button></div></section></div>');

  // ── 4. Content wrapper ──
  parts.push('<div class="wrapper"><section class="block col-12 block-desktop col-12-desktop"><div>');

  // ════════════════════════════════════════════
  // Identity section (3 GET endpoints)
  // ════════════════════════════════════════════
  var identityEndpoints = [];

  // /identity/profile
  var profileResp = '<p class="cv-kv"><code>name</code>' + E(data.identity.name) + '</p><p class="cv-kv"><code>role</code>' + E(data.identity.role) + ' <em>// "Developer" is an understatement</em></p><p class="cv-kv"><code>location</code>' + E(data.identity.location) + '</p><p class="cv-kv"><code>accentColor</code>' + E(data.meta.accentColor) + ' <span class="cv-color-dot"></span></p><p class="cv-kv"><code>deprecated</code>false <em>// still actively maintained</em></p>';
  identityEndpoints.push(CV._swgGet('identity', 'get_identity_profile', '/identity/profile', 'Name, role, location', '<p>Returns the developer\'s core identity fields.</p>', null, [{code: '200', bodyHtml: profileResp, linksHtml: 'No links'}]));

  // /identity/contact
  var contactResp = '';
  var contactMap = {email: null, phone: null, github: null, linkedin: null, website: null};
  data.identity.contacts.forEach(function (c) {
    var label = c.label;
    if (label.indexOf('@') > -1) contactMap.email = c;
    else if (label.indexOf('+36') > -1) contactMap.phone = c;
    else if (label.indexOf('github') > -1) contactMap.github = c;
    else if (label.indexOf('linkedin') > -1) contactMap.linkedin = c;
    else if (label.indexOf('bozzayviktor') > -1) contactMap.website = c;
  });
  var contactEntries = [
    {key: 'email', comment: null},
    {key: 'phone', comment: null},
    {key: 'github', comment: '// phoenix, with extra e\'s'},
    {key: 'linkedin', comment: null},
    {key: 'website', comment: null}
  ];
  contactEntries.forEach(function (entry) {
    var c = contactMap[entry.key];
    if (c && c.url) {
      var tag = entry.key === 'phone' ? 'a' : (entry.key === 'email' ? 'a' : 'a');
      var href = entry.key === 'email' ? 'mailto:' + c.label : (entry.key === 'phone' ? 'tel:' + c.label : c.url);
      var comment = entry.comment ? ' <em>' + entry.comment + '</em>' : '';
      contactResp += '<p class="cv-kv"><code>' + entry.key + '</code><a href="' + href + '">' + E(c.label) + '</a>' + comment + '</p>';
    }
  });
  identityEndpoints.push(CV._swgGet('identity', 'get_identity_contact', '/identity/contact', 'All contact channels', '<p>Returns all available contact channels.</p>', null, [{code: '200', bodyHtml: contactResp, linksHtml: 'No links'}]));

  // /identity/languages
  var langResp = '';
  var langComments = {
    'Hungarian': 'no runtime errors',
    'German': 'can order Schnitzel and read stack traces',
    'English': 'you\'re reading this - proof it works'
  };
  data.identity.languages.forEach(function (l) {
    var comment = langComments[l.name] ? ' <em>// ' + langComments[l.name] + '</em>' : '';
    langResp += '<p class="cv-kv"><code>' + E(l.name) + '</code>' + E(l.level.toLowerCase()) + comment + '</p>';
  });
  identityEndpoints.push(CV._swgGet('identity', 'get_identity_languages', '/identity/languages', 'Spoken language proficiencies', '<p>Returns spoken language proficiencies.</p>', null, [{code: '200', bodyHtml: langResp, linksHtml: 'No links'}]));

  parts.push(CV._swgTagSection('identity', identityEndpoints.join('')));

  // ════════════════════════════════════════════
  // Summary section (1 GET endpoint)
  // ════════════════════════════════════════════
  var summaryResp = '<p>' + data.summary + '</p><p><em>// translation: will rewrite your entire codebase if provoked (and the evidence justifies it)</em></p>';
  parts.push(CV._swgTagSection('summary', CV._swgGet('summary', 'get_summary', '/summary', 'Professional overview', '<p>Returns the professional summary.</p>', null, [{code: '200', bodyHtml: summaryResp, linksHtml: 'No links'}])));

  // ════════════════════════════════════════════
  // Work Experience section (6 endpoints: 4 POST + 2 PUT)
  // ════════════════════════════════════════════
  var workEndpoints = [];
  var expMethods = ['post', 'post', 'post', 'post', 'put', 'put'];
  var expMethodsUpper = ['POST', 'POST', 'POST', 'POST', 'PUT', 'PUT'];

  data.workExperience.forEach(function (exp, i) {
    var id = 'experience_' + exp.id;
    var path = '/experience/' + exp.id;
    var desc = exp.title + ' - ' + exp.company;
    if (exp.isCurrent) desc += ' <span class="cv-badge">current</span>';

    // Description HTML
    var descHtml = '<p>' + exp.description.split('<br>')[0] + '</p>';

    // Build parameter rows
    var paramRows = [];
    // period
    var periodComment = exp.isCurrent ? 'null=still here' : '';
    var periodStr = exp.period.from + ' \u2192 ' + (exp.period.to || 'null');
    if (exp.id === 'telekom') periodComment = '4 months - short but intense';
    else if (exp.id === 'aegex') periodComment = 'null=still here';
    else if (exp.id === 'cobotx') periodComment = null;
    var periodHtml = '<p>' + periodStr + (periodComment ? ' <em>// ' + periodComment + '</em>' : '') + '</p>';
    paramRows.push({name: 'period', type: 'string', loc: '(metadata)', descHtml: periodHtml});

    // teamSize (only for aegex and cobotx)
    if (exp.teamSize && exp.id !== 'webforsol') {
      var teamComment = exp.id === 'aegex' ? 'self + 1 mid-level colleague, handled with care' : (exp.id === 'cobotx' ? 'engineers, built and led personally' : '');
      var teamHtml = '<p>' + exp.teamSize + (teamComment ? ' <em>// ' + teamComment + '</em>' : '') + '</p>';
      paramRows.push({name: 'teamSize', type: 'integer', loc: '(metadata)', descHtml: teamHtml});
    }

    // stack
    var stackHtml = CV._swgStack(exp.skills);
    paramRows.push({name: 'stack', type: 'array', loc: '(metadata)', descHtml: '<div class="cv-stack">' + stackHtml.replace('<div class="cv-stack">', '').replace('</div>', '') || stackHtml});

    // robots (only for cobotx)
    if (exp.id === 'cobotx') {
      paramRows.push({name: 'robots', type: 'integer', loc: '(metadata)', descHtml: '<p>' + exp.game.highlights[1].replace('!', '') + ' <em>// Collaborative robots, not the other kind</em></p>'});
    }

    // Build response body
    var respBody = '';
    if (exp.projects) {
      exp.projects.forEach(function (proj) {
        respBody += '<p><strong>' + E(proj.name) + '</strong>- ' + E(proj.subtitle) + '</p><ul>';
        proj.bullets.forEach(function (b) { respBody += '<li>' + b + '</li>'; });
        respBody += '</ul>';
      });
      // Aegex special footer
      if (exp.id === 'aegex') {
        respBody += '<p><em>releaseCycle: 30d \u2192 14d (targeting 7) \u00B7 testCoverage before: 0 // yes, zero. it was not fine.</em></p>';
      }
    } else if (Array.isArray(exp.bullets)) {
      respBody += '<ul>';
      exp.bullets.forEach(function (b) { respBody += '<li>' + b + '</li>'; });
      // Special additions per company
      if (exp.id === 'telekom') respBody += '<li>Continuous frontend\u2013AI backend integration in fast-paced Agile sprints</li>';
      if (exp.id === 'scolia') respBody += '<li>WebSocket-driven live score updates - because darts is apparently a realtime sport</li>';
      respBody += '</ul>';
    } else if (exp.bullets && typeof exp.bullets === 'object') {
      respBody += '<ul>';
      Object.keys(exp.bullets).forEach(function (key) {
        var arr = exp.bullets[key];
        if (Array.isArray(arr)) arr.forEach(function (b) { respBody += '<li>' + b + '</li>'; });
      });
      if (exp.id === 'cubicfox') {
        respBody += '<li>Established team code conventions - arrived, fixed things, left. classic.</li>';
      }
      respBody += '</ul>';
    }

    // Links
    var linksHtml = 'No links';
    if (exp.refs && exp.refs.length > 0) {
      linksHtml = exp.refs.map(function (r) {
        return '<a href="' + E(r.url) + '" target="_blank">' + E(r.label) + '</a>';
      }).join('<br />');
    }

    var ep;
    if (expMethodsUpper[i] === 'POST') {
      ep = CV._swgPost('workExperience', id, path, desc, descHtml, paramRows, [{code: '200', bodyHtml: respBody, linksHtml: linksHtml}]);
    } else {
      ep = CV._swgPut('workExperience', id, path, desc, descHtml, paramRows, [{code: '200', bodyHtml: respBody, linksHtml: linksHtml}]);
    }
    workEndpoints.push(ep);
  });

  parts.push(CV._swgTagSection('workExperience', workEndpoints.join('')));

  // ════════════════════════════════════════════
  // Education section (3 GET endpoints)
  // ════════════════════════════════════════════
  var eduEndpoints = [];
  var eduPaths = ['/education/quality-manager', '/education/teacher', '/education/mechanical'];
  var eduIds = ['get_quality-manager', 'get_teacher', 'get_mechanical'];
  var eduDescs = [
    'Bachelor\'s - Quality Manager, 2003\u20132007',
    'Bachelor\'s - Machinery Technical Teacher Education, 2001\u20132004',
    'Bachelor of Engineering (BEng), Mechanical Engineering, 2000\u20132004'
  ];

  data.education.degrees.forEach(function (deg, i) {
    var resp = '<p class="cv-kv"><code>institution</code>' + E(data.education.institution) + '</p><p class="cv-kv"><code>degree</code>' + E(deg.title) + '</p><p class="cv-kv"><code>years</code>' + E(deg.years) + '</p>';
    eduEndpoints.push(CV._swgGet('education', eduIds[i], eduPaths[i], eduDescs[i], '<p>Returns education details.</p>', null, [{code: '200', bodyHtml: resp, linksHtml: 'No links'}]));
  });

  parts.push(CV._swgTagSection('education', eduEndpoints.join('')));

  // ════════════════════════════════════════════
  // Skills section (generated from programmingLanguages)
  // ════════════════════════════════════════════
  var skillEndpoints = [];

  // Primary frontend stack
  var primarySkills = data.programmingLanguages.filter(function (p) { return ['TypeScript', 'JavaScript', 'CSS', 'SCSS', 'HTML'].indexOf(p.name) > -1; });
  var primaryResp = '';
  primarySkills.forEach(function (p) { primaryResp += '<p class="cv-kv"><code>' + E(p.name.toLowerCase()) + '</code>experto</p>'; });
  primaryResp += '<p><em>// These are not \"frameworks\". These are the actual technologies.</em></p>';
  skillEndpoints.push(CV._swgGet('skills', 'get_skills_primary', '/skills/primary', 'Core frontend stack', '<p>Returns core frontend technology proficiencies.</p>', null, [{code: '200', bodyHtml: primaryResp, linksHtml: 'No links'}]));

  // Backend & databases
  var backendSkills = data.programmingLanguages.filter(function (p) { return ['Python', 'PHP'].indexOf(p.name) > -1; });
  var backendResp = '';
  backendSkills.forEach(function (p) { backendResp += '<p class="cv-kv"><code>' + E(p.name.toLowerCase()) + '</code>proficient</p>'; });
  backendResp += '<p class="cv-kv"><code>express.js</code>proficient</p><p class="cv-kv"><code>nestjs</code>proficient</p><p class="cv-kv"><code>mysql</code>proficient</p><p class="cv-kv"><code>mongodb</code>proficient</p>';
  skillEndpoints.push(CV._swgGet('skills', 'get_skills_backend', '/skills/backend', 'Backend & databases', '<p>Returns backend and database proficiencies.</p>', null, [{code: '200', bodyHtml: backendResp, linksHtml: 'No links'}]));

  // Testing (PATCH - static content)
  var testingBody = '<p><code>jest</code>proficient</p><p><code>vitest</code>proficient</p><p><code>playwright</code>proficient</p><p class="cv-kv"><code>coverage</code><em>before: 0 // yes, zero. after: yes.</em></p>';
  // Build PATCH manually since there's no CV._swgPatch helper
  var patchBlock = '<div class="opblock opblock-patch" id="operations-skills-patch_skills_testing"><div class="opblock-summary opblock-summary-patch"><button class="opblock-summary-control"><span class="opblock-summary-method">PATCH</span><div class="opblock-summary-path-description-wrapper"><span class="opblock-summary-path"><a class="nostyle"><span>/skills/testing</span></a></span><div class="opblock-summary-description">Testing &amp; quality (improving daily)</div></div></button><div class="view-line-link copy-to-clipboard" title="Copy to clipboard">' + CV._svgClipboard + '</div><button class="authorization__btn unlocked" aria-label="authorization button unlocked">' + CV._svgLockUnlocked + '</button><button class="opblock-control-arrow">' + CV._svgArrowUp + '</button></div><div class="opblock-body">' + CV._swgDesc('<p>Testing stack and methodologies. Coverage is improving daily.</p>') + '<div class="opblock-section"><div class="opblock-section-header"><div class="tab-header"><div class="tab-item active"><h4 class="opblock-title"><span>Parameters</span></h4></div></div><div class="try-out"><button class="try-out__btn hire-trigger">Hire me</button></div></div>' + CV._swgParams(null) + '</div>' + CV._swgResponses([{code: '200', bodyHtml: testingBody, linksHtml: 'No links'}]) + '</div></div>';
  skillEndpoints.push(patchBlock);

  // Tooling
  var toolingResp = '<p class="cv-kv"><code>vite</code>experto</p><p class="cv-kv"><code>webpack</code>experto</p><p class="cv-kv"><code>pnpm</code>experto</p><p class="cv-kv"><code>npm</code>experto</p><p class="cv-kv"><code>git</code>experto</p><p><em>// Know the difference between pnpm and npm. One of them respects disk space.</em></p>';
  skillEndpoints.push(CV._swgGet('skills', 'get_skills_tooling', '/skills/tooling', 'Tools & build', '<p>Returns build tools and dev tooling proficiencies.</p>', null, [{code: '200', bodyHtml: toolingResp, linksHtml: 'No links'}]));

  // AI & automation
  var aiResp = '<p class="cv-kv"><code>claude</code>architect-level</p><p class="cv-kv"><code>codex</code>architect-level</p><p class="cv-kv"><code>chatgpt</code>advanced</p><p class="cv-kv"><code>copilot</code>advanced</p><p><em>// AI is not replacing developers. Developers who use AI are replacing those who don\'t.</em></p>';
  skillEndpoints.push(CV._swgGet('skills', 'get_skills_ai', '/skills/ai', 'AI & automation', '<p>Returns AI tooling and automation proficiencies.</p>', null, [{code: '200', bodyHtml: aiResp, linksHtml: 'No links'}]));

  // Robotics & hardware
  var roboticsResp = '<p class="cv-kv"><code>universal-robots</code>proficient</p><p class="cv-kv"><code>plc-programming</code>proficient</p><p class="cv-kv"><code>machine-vision</code>proficient</p><p class="cv-kv"><code>onrobot</code>proficient</p><p class="cv-kv"><code>onshape</code>proficient</p><p><em>// Yes, actual robots. Not the framework kind. The moving-metal kind.</em></p>';
  skillEndpoints.push(CV._swgGet('skills', 'get_skills_robotics', '/skills/robotics', 'Robotics & hardware', '<p>Returns robotics and hardware proficiencies.</p>', null, [{code: '200', bodyHtml: roboticsResp, linksHtml: 'No links'}]));

  // DELETE (static content - humor endpoint)
  var deleteBlock = '<div class="opblock opblock-delete" id="operations-skills-delete_skills_delete"><div class="opblock-summary opblock-summary-delete"><button class="opblock-summary-control"><span class="opblock-summary-method">DELETE</span><div class="opblock-summary-path-description-wrapper"><span class="opblock-summary-path"><a class="nostyle"><span>/skills/legacy-code</span></a></span><div class="opblock-summary-description">Delete legacy code (use with caution)</div></div></button><div class="view-line-link copy-to-clipboard" title="Copy to clipboard">' + CV._svgClipboard + '</div><button class="authorization__btn unlocked" aria-label="authorization button unlocked">' + CV._svgLockUnlocked + '</button><button class="opblock-control-arrow">' + CV._svgArrowUp + '</button></div><div class="opblock-body">' + CV._swgDesc('<p>Deletes legacy code. All of it. Use with extreme caution. <em>// You called the DELETE endpoint on production. Your funeral.</em></p>') + '<div class="opblock-section"><div class="opblock-section-header"><div class="tab-header"><div class="tab-item active"><h4 class="opblock-title"><span>Parameters</span></h4></div></div><div class="try-out"><button class="try-out__btn hire-trigger">Hire me</button></div></div>' + CV._swgParams([{name: 'justification', type: 'string', loc: '(metadata)', descHtml: '<p>Why are you deleting this? <em>// \"it was legacy\" is not a valid justification</em></p>'}]) + '</div>' + CV._swgResponses([{code: '200', bodyHtml: '<p>Legacy code deleted successfully.</p><p><em>// You have 24 hours to regret this decision.</em></p>', linksHtml: 'No links'}, {code: '418', bodyHtml: '<p>I\'m a teapot.</p><p><em>// Short and stout. Here is my handle. Here is my spout.</em></p>', linksHtml: 'No links'}]) + '</div></div>';
  skillEndpoints.push(deleteBlock);

  parts.push(CV._swgTagSection('skills', skillEndpoints.join('')));

  // ════════════════════════════════════════════
  // Community section (1 POST endpoint)
  // ════════════════════════════════════════════
  var communityResp = '<p class="cv-kv"><code>school</code>M\u00E1ty\u00E1s Kir\u00E1ly Street Primary School, P\u00E9cs</p><p class="cv-kv"><code>since</code>2026-02</p><p class="cv-kv"><code>curriculumDesignedBy</code>Viktor</p><p class="cv-kv"><code>paid</code>false <em>// some things matter more than money</em></p><p><strong>Competition results:</strong></p><ul><li>1st place at Hack and Code 2026 (Radn\u00F3ti SZKI)</li><li>1st and 3rd place at the 22nd Neumann J\u00E1nos Programming Competition</li></ul>';
  parts.push(CV._swgTagSection('community', CV._swgPost('community', 'post_mentoring', '/community/mentoring', 'Mentoring \u0026 community work', '<p>Launched and lead a pro bono after-school IT and programming club. Designed the full curriculum.</p>', null, [{code: '200', bodyHtml: communityResp, linksHtml: 'No links'}])));

  // ════════════════════════════════════════════
  // Hobby Projects section (1 GET endpoint)
  // ════════════════════════════════════════════
  var hobbyResp = '';
  data.hobbyProjects.forEach(function (p) {
    hobbyResp += '<p class="cv-kv"><code>' + E(p.name.replace(/[\s-]/g, '').toLowerCase()) + '</code><a href="' + E(p.url) + '" target="_blank">' + E(p.name) + '</a></p>';
  });
  parts.push(CV._swgTagSection('hobbyProjects', CV._swgGet('hobbyProjects', 'get_hobbyProjects', '/hobbyProjects', 'Side projects \u0026 open-source work', '<p>Returns hobby projects and open-source contributions.</p>', null, [{code: '200', bodyHtml: hobbyResp, linksHtml: 'No links'}])));

  // ════════════════════════════════════════════
  // Meta section (1 GET endpoint)
  // ════════════════════════════════════════════
  var metaResp = '<p class="cv-kv"><code>name</code>' + E(data.meta.name) + '</p><p class="cv-kv"><code>role</code>' + E(data.identity.role) + '</p><p class="cv-kv"><code>version</code>' + E(data.meta.version) + '</p><p class="cv-kv"><code>generatedBy</code>CV_DATA v' + E(data.meta.version) + ' <em>// yes, this CV generates itself</em></p><p class="cv-kv"><code>codingPhilosophy</code>refactor deliberately <em>// only when evidence justifies it</em></p><p class="cv-kv"><code>engineeringBackground</code>mechanical <em>// before there was code, there was CAD</em></p><p class="cv-kv"><code>openToWork</code>true <em>// spoiler: hire me button works</em></p>';
  parts.push(CV._swgTagSection('meta', CV._swgGet('meta', 'get_meta', '/meta', 'Version metadata', '<p>Returns API metadata and CV version information.</p>', null, [{code: '200', bodyHtml: metaResp, linksHtml: 'No links'}])));

  // ── Close wrappers ──
  parts.push('</div></section></div>');
  parts.push('</section>');

  return parts.join('\n');
};

// ──────────────────────────────────────────────
// CV.renderJsonCV(data) — Generate JSON viewer L[] array from CV_DATA
// ──────────────────────────────────────────────
CV.renderJsonCV = function (data) {
  var E = CV.escHtml;
  var L = [];

  function push(depth, html) {
    L.push([depth, html]);
  }

  function jesc(str) {
    return String(str).replace(/"/g, '\\"');
  }

  // Helper: string key-value line
  function pushStr(depth, key, value, comma, comment) {
    var h = '<span class="k">"' + key + '"</span><span class="p">: </span><span class="s">"' + jesc(value) + '"</span>';
    if (comma !== false) h += '<span class="p">,</span>';
    if (comment) h += '  <span class="c">// ' + comment + '</span>';
    push(depth, h);
  }

  // Helper: bool key-value line
  function pushBool(depth, key, value, comma, comment) {
    var v = value ? 'true' : 'false';
    var h = '<span class="k">"' + key + '"</span><span class="p">: </span><span class="b">' + v + '</span>';
    if (comma !== false) h += '<span class="p">,</span>';
    if (comment) h += '  <span class="c">// ' + comment + '</span>';
    push(depth, h);
  }

  // Helper: number key-value line
  function pushNum(depth, key, value, comma, comment) {
    var h = '<span class="k">"' + key + '"</span><span class="p">: </span><span class="n">' + value + '</span>';
    if (comma !== false) h += '<span class="p">,</span>';
    if (comment) h += '  <span class="c">// ' + comment + '</span>';
    push(depth, h);
  }

  // Helper: null key-value line
  function pushNull(depth, key, comma, comment) {
    var h = '<span class="k">"' + key + '"</span><span class="p">: </span><span class="nl">null</span>';
    if (comma !== false) h += '<span class="p">,</span>';
    if (comment) h += '  <span class="c">// ' + comment + '</span>';
    push(depth, h);
  }

  // Helper: render a JSON string array as HTML lines
  function pushStringArray(depth, items, lastComma) {
    push(depth, '<span class="p">[</span>');
    items.forEach(function (item, idx) {
      var line = '<span class="s">"' + jesc(item) + '"</span>';
      if (idx < items.length - 1) line += '<span class="p">,</span>';
      push(depth + 1, line);
    });
    if (lastComma !== false) {
      push(depth, '<span class="p">],</span>');
    } else {
      push(depth, '<span class="p">]</span>');
    }
  }

  // ── Root ──
  push(0, '<span class="p">{</span>');
  push(0, '');

  // ── Header comments & schema fields ──
  push(1, '<span class="c">// Viktor Bozzay - curriculum_vitae.json - v' + E(data.meta.version) + '</span>');
  push(1, '<span class="c">// Last commit: 2026-05-07 \u00b7 still actively maintained</span>');
  push(0, '');
  push(1, '<span class="k">"$schema"</span><span class="p">: </span><span class="s">"https://bozzayviktor.hu/schemas/human/developer/v' + E(data.meta.version) + '.json"</span><span class="p">,</span>');
  pushBool(1, 'deprecated', false, true, 'still actively maintained');
  push(1, '<span class="k">"license"</span><span class="p">: </span><span class="s">"proprietary"</span><span class="p">,</span>  <span class="c">// not open source (yet)</span>');
  push(0, '');

  // ── identity ──
  push(1, '<span class="k">"identity"</span><span class="p">: {</span>');
  pushStr(2, 'name', data.identity.name);
  pushStr(2, 'role', data.identity.role, true, '"Developer" is an understatement');
  pushStr(2, 'location', data.identity.location);
  pushStr(2, 'accentColor', data.meta.accentColor, true, 'hardcoded in the original HTML - yes, I looked');

  // -- contact sub-object --
  push(2, '<span class="k">"contact"</span><span class="p">: {</span>');
  var contactMap = {};
  data.identity.contacts.forEach(function (c) {
    if (c.label.indexOf('@') > -1) contactMap.email = c;
    else if (c.label.indexOf('+36') > -1) contactMap.phone = c;
    else if (c.label.indexOf('github') > -1) contactMap.github = c;
    else if (c.label.indexOf('linkedin') > -1) contactMap.linkedin = c;
    else if (c.label.indexOf('bozzayviktor') > -1) contactMap.website = c;
  });

  var contactKeys = ['email', 'phone', 'github', 'linkedin', 'website'];
  contactKeys.forEach(function (k, ki) {
    var c = contactMap[k];
    if (c && c.url) {
      var href = k === 'email' ? 'mailto:' + c.label : (k === 'phone' ? 'tel:' + c.label : c.url);
      var comma = ki < contactKeys.length - 1;
      var comment = k === 'github' ? 'phoenix, with extra e\'s' : null;
      var h = '<span class="k">"' + k + '"</span><span class="p">: </span><span class="s">"<a href="' + E(href) + '">' + jesc(c.label) + '</a>"</span>';
      if (comma) h += '<span class="p">,</span>';
      if (comment) h += '  <span class="c">// ' + comment + '</span>';
      push(3, h);
    }
  });
  push(2, '<span class="p">},</span>');

  // -- languages sub-object --
  push(2, '<span class="k">"languages"</span><span class="p">: {</span>');
  var langComments = {
    Hungarian: 'no runtime errors',
    German: 'can order Schnitzel and read stack traces',
    English: 'you\'re reading this - proof it works'
  };
  data.identity.languages.forEach(function (lang, li) {
    var comma = li < data.identity.languages.length - 1;
    var h = '<span class="k">"' + E(lang.name) + '"</span><span class="p">: </span><span class="s">"' + E(lang.level.toLowerCase()) + '"</span>';
    if (comma) h += '<span class="p">,</span>';
    var comment = langComments[lang.name];
    if (comment) h += '  <span class="c">// ' + comment + '</span>';
    push(3, h);
  });
  push(2, '<span class="p">}</span>');

  push(1, '<span class="p">},</span>');
  push(0, '');

  // ── summary ──
  pushStr(1, 'summary', data.summary);
  push(1, '<span class="c">// translation: will rewrite your entire codebase if provoked (and the evidence justifies it)</span>');
  push(0, '');

  // ── workExperience ──
  push(1, '<span class="k">"workExperience"</span><span class="p">: [</span>');
  push(0, '');

  data.workExperience.forEach(function (exp, ei) {
    // section comment
    var companyNames = ['Aegex Technologies', 'Deutsche Telekom IT Solutions HU', 'Scolia Technologies Ltd.', 'Cubicfox', 'CobotX Technologies', 'WebforSol (Freelance)'];
    var alias = companyNames[ei] || exp.company;
    var dashLen = Math.max(55 - alias.length, 5);
    var dashes = '';
    for (var d = 0; d < dashLen; d++) dashes += '\u2500';
    push(2, '<span class="c">// [' + ei + '] ' + E(alias) + ' ' + dashes + '</span>');

    push(2, '<span class="p">{</span>');
    pushStr(3, 'company', exp.company);
    pushStr(3, 'title', exp.title);

    // period
    var periodLine = '<span class="k">"period"</span><span class="p">: { </span><span class="k">"from"</span><span class="p">: </span><span class="s">"' + exp.period.from + '"</span><span class="p">, </span><span class="k">"to"</span><span class="p">: </span>';
    if (exp.period.to) {
      periodLine += '<span class="s">"' + exp.period.to + '"</span>';
    } else {
      periodLine += '<span class="nl">null</span>';
    }
    periodLine += '<span class="p"> }</span><span class="p">,</span>';
    if (exp.isCurrent) periodLine += '  <span class="c">// null = still here</span>';
    else if (exp.id === 'telekom') periodLine += '  <span class="c">// 4 months - short but intense</span>';
    push(3, periodLine);

    // teamSize (aegex, cobotx)
    if (exp.id === 'aegex') {
      pushNum(3, 'teamSize', 2, true, 'self + 1 mid-level colleague, handled with care');
    } else if (exp.id === 'cobotx') {
      pushNum(3, 'teamSize', 4, true, 'engineers, built and led personally');
    }

    // description
    pushStr(3, 'description', exp.description);

    // special extra fields for cobotx
    if (exp.id === 'cobotx') {
      pushBool(3, 'robots', true, true, 'literal robots. Universal Robots. not metaphorical.');
    }
    if (exp.id === 'webforsol') {
      pushBool(3, 'parallel_with_cobotx', true, true, '24h is enough for two jobs, apparently');
      // webforsol has refs as an array, not a single ref
    }

    // Projects or highlights
    if (exp.projects) {
      // Aegex-style: has projects sub-object
      push(3, '<span class="k">"projects"</span><span class="p">: {</span>');
      exp.projects.forEach(function (proj, pi) {
        var comma = pi < exp.projects.length - 1;
        push(4, '<span class="k">"' + E(proj.name) + '"</span><span class="p">: {</span>');
        pushStr(5, 'type', proj.subtitle);
        if (proj.name === 'FACTS') {
          pushNum(5, 'releaseCycle_before_days', 30);
          pushNum(5, 'releaseCycle_after_days', 14, true, 'targeting 7 - AI-assisted workflow');
          pushNum(5, 'testCoverage_before', 0, true, 'yes, zero. it was fine. (it was not fine.)');
          push(5, '<span class="k">"qualityIssues_after"</span><span class="p">: </span><span class="s">"near eliminated"</span><span class="p">,</span>');
        }
        pushStringArray(5, proj.bullets, true);
        if (proj.name !== 'FACTS') {
          push(5, '<span class="k">"ref"</span><span class="p">: [</span>');
          push(6, '<span class="s">"Not public"</span>');
          push(5, '<span class="p">]</span>');
        }
        if (proj.name === 'FACTS' && exp.refs) {
          push(5, '<span class="k">"ref"</span><span class="p">: [</span>');
          exp.refs.forEach(function (r, ri) {
            var comma2 = ri < exp.refs.length - 1;
            var line = '<span class="s">"<a href="' + E(r.url) + '" target="_blank">' + jesc(r.label) + '</a>"</span>';
            if (comma2) line += '<span class="p">,</span>';
            push(6, line);
          });
          push(5, '<span class="p">],</span>');
        }
        push(4, '<span class="p">}</span>' + (comma ? '<span class="p">,</span>' : ''));
      });
      push(3, '<span class="p">},</span>');
    } else if (Array.isArray(exp.bullets)) {
      // Simple bullets (Telekom, Scolia)
      pushStringArray(3, exp.bullets, true);
    } else if (exp.bullets && typeof exp.bullets === 'object') {
      // Structured bullets - push as flat array merging all
      var allBullets = [];
      Object.keys(exp.bullets).forEach(function (key) {
        var arr = exp.bullets[key];
        if (Array.isArray(arr)) {
          arr.forEach(function (b) { allBullets.push(b); });
        }
      });
      if (exp.id === 'cubicfox') {
        allBullets.push('Established team code conventions - arrived, fixed things, left. classic.');
      }
      push(3, '<span class="k">"highlights"</span><span class="p">: [</span>');
      allBullets.forEach(function (b, bi) {
        var comma = bi < allBullets.length - 1;
        var line = '<span class="s">"' + jesc(b) + '"</span>';
        if (comma) line += '<span class="p">,</span>';
        push(4, line);
      });
      push(3, '<span class="p">],</span>');
    }

    // refs (for non-Aegex companies)
    if (!exp.projects && exp.refs && exp.refs.length > 0) {
      if (exp.refs.length === 1) {
        push(3, '<span class="k">"ref"</span><span class="p">: </span><span class="s">"<a href="' + E(exp.refs[0].url) + '" target="_blank">' + jesc(exp.refs[0].label) + '</a>"</span><span class="p">,</span>');
      } else {
        push(3, '<span class="k">"refs"</span><span class="p">: [</span>');
        exp.refs.forEach(function (r, ri) {
          var comma = ri < exp.refs.length - 1;
          var line = '<span class="s">"<a href="' + E(r.url) + '" target="_blank">' + jesc(r.label) + '</a>"</span>';
          if (comma) line += '<span class="p">,</span>';
          push(4, line);
        });
        push(3, '<span class="p">],</span>');
      }
    }

    // stack
    if (exp.skills && exp.skills.length > 0) {
      pushStringArray(3, exp.skills, false);
    } else {
      push(3, '<span class="k">"stack"</span><span class="p">: [</span>');
      push(3, '<span class="p">]</span>');
    }

    push(2, '<span class="p">}</span>');
    push(0, '');
  });

  push(1, '<span class="p">],</span>');
  push(0, '');

  // ── education ──
  push(1, '<span class="k">"education"</span><span class="p">: [</span>');
  push(2, '<span class="c">// all three degrees from the same university - he really liked it there</span>');
  data.education.degrees.forEach(function (deg, di) {
    push(2, '<span class="p">{</span>');
    pushStr(3, 'institution', data.education.institution);
    pushStr(3, 'degree', deg.title);
    push(3, '<span class="k">"years"</span><span class="p">: </span><span class="s">"' + jesc(deg.years) + '"</span>');
    if (di < data.education.degrees.length - 1) {
      push(2, '<span class="p">},</span>');
    } else {
      push(2, '<span class="p">}</span>');
    }
  });
  push(1, '<span class="p">],</span>');
  push(1, '<span class="c">// none of them are frontend. this is fine. (this is fine.)</span>');
  push(0, '');

  // ── skills ──
  push(1, '<span class="k">"skills"</span><span class="p">: {</span>');

  // primary frontend
  push(2, '<span class="k">"primary"</span><span class="p">: [</span><span class="s">"TypeScript"</span><span class="p">, </span><span class="s">"JavaScript"</span><span class="p">, </span><span class="s">"Svelte"</span><span class="p">, </span><span class="s">"React"</span><span class="p">, </span><span class="s">"Node.js"</span><span class="p">, </span><span class="s">"SCSS"</span><span class="p">, </span><span class="s">"HTML"</span><span class="p">, </span><span class="s">"CSS"</span><span class="p">],</span>');
  // backend
  push(2, '<span class="k">"backend"</span><span class="p">: [</span><span class="s">"Express.js"</span><span class="p">, </span><span class="s">"NestJS"</span><span class="p">, </span><span class="s">"Python"</span><span class="p">, </span><span class="s">"PHP"</span><span class="p">, </span><span class="s">"MySQL"</span><span class="p">, </span><span class="s">"MongoDB"</span><span class="p">],</span>');
  // testing
  push(2, '<span class="k">"testing"</span><span class="p">: [</span><span class="s">"Jest"</span><span class="p">, </span><span class="s">"Vitest"</span><span class="p">, </span><span class="s">"Playwright"</span><span class="p">],</span>  <span class="c">// yes, all three</span>');
  // tooling
  push(2, '<span class="k">"tooling"</span><span class="p">: [</span><span class="s">"Vite"</span><span class="p">, </span><span class="s">"Webpack"</span><span class="p">, </span><span class="s">"PNPM"</span><span class="p">, </span><span class="s">"Next.js"</span><span class="p">],</span>');
  // ai
  push(2, '<span class="k">"ai"</span><span class="p">: [</span><span class="s">"Claude"</span><span class="p">, </span><span class="s">"Codex"</span><span class="p">],</span>  <span class="c">// meta: this CV was probably reviewed by one of these</span>');
  // robotics
  push(2, '<span class="k">"robotics"</span><span class="p">: [</span><span class="s">"Universal Robot"</span><span class="p">, </span><span class="s">"OnRobot"</span><span class="p">, </span><span class="s">"Machine Vision"</span><span class="p">, </span><span class="s">"PLC"</span><span class="p">],</span>  <span class="c">// surprise!</span>');
  // extra
  push(2, '<span class="k">"willRefactorYourEntireCodebaseIf"</span><span class="p">: </span><span class="s">"evidence justifies it"</span>  <span class="c">// (often)</span>');

  push(1, '<span class="p">},</span>');
  push(0, '');

  // ── community ──
  push(1, '<span class="k">"community"</span><span class="p">: {</span>');
  push(2, '<span class="k">"role"</span><span class="p">: </span><span class="s">"Pro bono after-school programming club mentor"</span><span class="p">,</span>');
  push(2, '<span class="k">"school"</span><span class="p">: </span><span class="s">"M\u00e1ty\u00e1s Kir\u00e1ly Street Primary School, P\u00e9cs"</span><span class="p">,</span>');
  push(2, '<span class="k">"since"</span><span class="p">: </span><span class="s">"2026-02"</span><span class="p">,</span>');
  push(2, '<span class="k">"curriculumDesignedBy"</span><span class="p">: </span><span class="s">"Viktor (personally)"</span><span class="p">,</span>');
  pushBool(2, 'paidFor', false, true, 'legend');
  push(2, '<span class="k">"competitionResults"</span><span class="p">: [</span>');
  push(3, '<span class="p">{ </span><span class="k">"place"</span><span class="p">: </span><span class="n">1</span><span class="p">, </span><span class="k">"competition"</span><span class="p">: </span><span class="s">"Hack and Code 2026 (Radn\u00f3ti SZKI)"</span><span class="p"> },</span>');
  push(3, '<span class="p">{ </span><span class="k">"place"</span><span class="p">: </span><span class="n">1</span><span class="p">, </span><span class="k">"competition"</span><span class="p">: </span><span class="s">"22nd Neumann J\u00e1nos Programming Competition"</span><span class="p"> },</span>');
  push(3, '<span class="p">{ </span><span class="k">"place"</span><span class="p">: </span><span class="n">3</span><span class="p">, </span><span class="k">"competition"</span><span class="p">: </span><span class="s">"22nd Neumann J\u00e1nos Programming Competition"</span><span class="p"> }</span>');
  push(2, '<span class="p">]</span>');
  push(1, '<span class="p">},</span>');
  push(0, '');

  // ── hobbyProjects ──
  push(1, '<span class="k">"hobbyProjects"</span><span class="p">: [</span>');
  data.hobbyProjects.forEach(function (proj, hi) {
    var comma = hi < data.hobbyProjects.length - 1;
    var line = '<span class="p">{ </span><span class="k">"name"</span><span class="p">: </span><span class="s">"' + jesc(proj.name) + '"</span><span class="p">, </span><span class="k">"url"</span><span class="p">: </span><span class="s">"<a href="' + E(proj.url) + '" target="_blank">' + jesc(proj.name) + '</a>"</span><span class="p"> }</span>';
    if (comma) line += '<span class="p">,</span>';
    push(2, line);
  });
  push(1, '<span class="p">],</span>');
  push(0, '');

  // ── meta ──
  push(1, '<span class="k">"meta"</span><span class="p">: {</span>');
  push(2, '<span class="k">"generatedBy"</span><span class="p">: </span><span class="s">"human effort + CodersRank + Claude (probably)"</span><span class="p">,</span>');
  push(2, '<span class="k">"codingPhilosophy"</span><span class="p">: </span><span class="s">"deliberate, evidence-driven, system-level thinking"</span><span class="p">,</span>');
  pushBool(2, 'engineeringBackground', true, true, '3\u00d7 BEng - thinks in systems, not just components');
  push(2, '<span class="k">"openToWork"</span><span class="p">: </span><span class="nl">true</span>  <span class="c">// ask directly: bozzay.viktor@gmail.com</span>');

  push(1, '<span class="p">}</span>');
  push(0, '');
  push(0, '<span class="p">}</span>');

  return L;
};
