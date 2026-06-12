import { CV_DATA } from './cv-data.js';
import { locale } from './locale.js';
import {
  initHireModal, initFormspree, hireModalHTML,
  bookingModalHTML, initBookingModal,
  getSystemTheme, musicPlayerHTML, showToast,
} from './shared.js';
import { initMusicPlayer } from './cv-music-player.js';
import { THEME_KEY, THEME_DARK, THEME_LIGHT } from './config.js';
import { langDropdownHTML, initLangDropdown } from './components/lang-dropdown.js';

// ── Colors ────────────────────────────────────────────────────────────────────
const CARD_COLORS = {
  aegex:     '#ff7024',
  telekom:   '#e05aab',
  scolia:    '#22c55e',
  cubicfox:  '#f59e0b',
  cobotx:    '#6366f1',
  webforsol: '#8b5cf6',
  community: '#06b6d4',
};

// ── Community row ─────────────────────────────────────────────────────────────
const COMMUNITY_ROW = {
  id:          'community',
  company:     'Mátyás Király Primary School, Pécs',
  logo:        null,
  title:       'Pro Bono IT Mentor',
  period:      { from: '2026-02', to: null },
  periodLabel: 'Feb 2026 – Present',
  isCurrent:   true,
  description: CV_DATA.community,
  bullets: [
    'Founded free after-school IT and programming club (ongoing)',
    '1st place at 2026 "Hack and Code" competition (Radnóti SZKI)',
    '1st and 3rd place at 22nd Neumann János Programming Competition',
  ],
  skills: [],
  refs: [],
};

// ── Render helpers ────────────────────────────────────────────────────────────
function renderCard(job) {
  const color = CARD_COLORS[job.id] || '#8b949e';
  const logo  = job.logo
    ? `<img class="sb-card-logo" src="assets/images/${job.logo}" alt="" onerror="this.style.display='none'">`
    : `<span class="sb-card-initials" style="background:${color}18;color:${color};border-color:${color}30">${job.company.charAt(0)}</span>`;
  const chips = (job.skills || []).slice(0, 4)
    .map(s => `<span class="sb-chip">${s.name}</span>`).join('');

  return `<div class="sb-card" draggable="true" data-job="${job.id}">
    <div class="sb-card-accent" style="background:${color}"></div>
    <div class="sb-card-body">
      <div class="sb-card-head">
        ${logo}
        <div class="sb-card-id">
          <div class="sb-card-title">${job.title}</div>
          <div class="sb-card-company">${job.company}</div>
        </div>
      </div>
      <div class="sb-card-meta">
        <span class="sb-period">${job.periodLabel}</span>
        ${job.isCurrent ? '<span class="sb-live-badge">● Live</span>' : ''}
      </div>
      ${chips ? `<div class="sb-card-chips">${chips}</div>` : ''}
    </div>
  </div>`;
}

function renderSkeleton() {
  const t = locale.t.bind(locale);
  return `<div class="sb-card is-skeleton" draggable="true" data-job="skeleton"
       title="${t('sbSkeletonTooltip')}">
    <div class="sb-card-accent"></div>
    <div class="sb-card-body">
      <div class="sb-card-head">
        <span class="sk-block sk-avatar"></span>
        <div class="sb-card-id">
          <div class="sk-block sk-title"></div>
          <div class="sk-block sk-subtitle"></div>
        </div>
      </div>
      <div class="sb-card-meta">
        <div class="sk-block sk-badge"></div>
      </div>
      <div class="sb-card-chips">
        <div class="sk-block sk-chip"></div>
        <div class="sk-block sk-chip"></div>
        <div class="sk-block sk-chip"></div>
      </div>
      <div class="sb-skeleton-hint">
        <i class="fa-solid fa-grip-vertical"></i> ${t('sbDragHint')}
      </div>
    </div>
  </div>`;
}

function renderColumn(colId, label, color, cardsHtml) {
  return `<div class="sb-column" id="sb-col-${colId}">
    <div class="sb-col-header">
      <span class="sb-col-dot" style="background:${color}"></span>
      <span class="sb-col-title">${label}</span>
      <span class="sb-col-count">${cardsHtml.length}</span>
    </div>
    <div class="sb-col-body" data-col="${colId}">
      ${cardsHtml.join('\n')}
    </div>
  </div>`;
}

// ── Page render ───────────────────────────────────────────────────────────────
function renderPage() {
  const t = locale.t.bind(locale);

  const contacts = CV_DATA.identity.contacts
    .filter(c => c.url)
    .slice(0, 4)
    .map(c => `<a href="${c.url}" target="${c.url.startsWith('mailto') ? '_self' : '_blank'}" rel="noopener noreferrer">${c.label}</a>`)
    .join('');

  const allContactLinks = CV_DATA.identity.contacts
    .filter(c => c.url)
    .map(c => `<a href="${c.url}" target="${c.url.startsWith('mailto') ? '_self' : '_blank'}" rel="noopener noreferrer">${c.label}</a>`)
    .join('');

  const inProgressCards = [
    renderCard(CV_DATA.workExperience[0]),
    renderCard(COMMUNITY_ROW),
  ];
  const doneCards = CV_DATA.workExperience.slice(1).map(renderCard);

  const backlogCol    = renderColumn('todo',         t('sbTodo'),        '#f59e0b', [renderSkeleton()]);
  const inProgressCol = renderColumn('in-progress', t('sbInProgress'), '#22c55e', inProgressCards);
  const doneCol       = renderColumn('done',        t('sbDone'),       '#8b949e', doneCards);

  document.getElementById('board-root').innerHTML = `
  <div class="sb-page">
    <header class="sb-header">
      <a href="index.html" class="sb-back" title="Back">
        <i class="fa-solid fa-arrow-left"></i>
      </a>
      <div class="sb-header-id">
        <div class="sb-header-name">${CV_DATA.identity.name}</div>
        <div class="sb-header-role">${CV_DATA.meta.role}&nbsp;·&nbsp;<span>${t('sbBoardView')}</span></div>
      </div>
      <div class="sb-header-links">${contacts}</div>
      <div class="sb-header-actions">
        ${langDropdownHTML()}
        <button class="sb-icon-btn" id="theme-toggle" title="Toggle theme">
          <span class="theme-sq-icon"></span>
        </button>
        <button class="sb-icon-btn" id="sb-music-btn" title="Music player">
          <i class="fa-solid fa-music"></i>
        </button>
        <div class="sb-contacts-wrap">
          <button class="sb-icon-btn" id="sb-contacts-btn" title="${t('ganttContacts')}">
            <i class="fa-solid fa-address-card"></i>
          </button>
          <div class="sb-contacts-popup" id="sb-contacts-popup">
            <div class="sb-contacts-popup-heading">${t('ganttContactsHeading')}</div>
            ${allContactLinks}
          </div>
        </div>
        <button class="sb-btn sb-btn-hire" id="hire-scrumboard-btn">
          <i class="fa-solid fa-paper-plane"></i> ${t('hireMe')}
        </button>
        <button class="sb-btn sb-btn-book" id="scrumboard-booking-btn">
          <i class="fa-regular fa-calendar-check"></i> ${t('book')}
        </button>
      </div>
    </header>

    <div class="sb-board">
      ${backlogCol}
      ${inProgressCol}
      ${doneCol}
    </div>
  </div>`;
}

// ── Header init (re-run on each render) ───────────────────────────────────────
function initHeader() {
  // Lang dropdown
  const ldEl = document.querySelector('#board-root .ld-select');
  if (ldEl) {
    initLangDropdown(ldEl, {
      onChange(lang) {
        const skeletonCol = document.querySelector('.sb-card.is-skeleton')
          ?.closest('.sb-col-body')?.dataset.col;
        locale.setLang(lang);
        renderPage();
        initHeader();
        // Restore skeleton column after re-render
        if (skeletonCol && skeletonCol !== 'todo') {
          const col      = document.querySelector(`.sb-col-body[data-col="${skeletonCol}"]`);
          const skeleton = document.querySelector('.sb-card.is-skeleton');
          if (col && skeleton) { col.appendChild(skeleton); updateCounts(); }
        }
        window.dispatchEvent(new CustomEvent('localechange'));
      },
    });
  }

  // Apply saved theme (idempotent)
  const saved = localStorage.getItem(THEME_KEY) || getSystemTheme();
  document.documentElement.setAttribute('data-theme', saved);
}

// ── Job form (new position modal) ────────────────────────────────────────────
let _pendingSkeleton = null;

function jobModalHTML() {
  return `<div class="sb-job-overlay" id="sb-job-overlay" style="display:none" role="dialog" aria-modal="true">
  <div class="sb-job-modal">
    <div class="sb-job-modal-title" id="sb-job-modal-title"></div>
    <label class="sb-job-label">
      <span id="sb-job-company-lbl"></span>
      <input class="sb-job-input" id="sb-job-company" type="text" autocomplete="off">
      <span class="sb-job-err" id="sb-job-company-err"></span>
    </label>
    <label class="sb-job-label">
      <span id="sb-job-role-lbl"></span>
      <input class="sb-job-input" id="sb-job-role" type="text" autocomplete="off">
      <span class="sb-job-err" id="sb-job-role-err"></span>
    </label>
    <label class="sb-job-label">
      <span id="sb-job-details-lbl"></span>
      <textarea class="sb-job-input sb-job-textarea" id="sb-job-details" rows="3" autocomplete="off"></textarea>
    </label>
    <div class="sb-job-modal-actions">
      <button class="sb-job-cancel-btn" id="sb-job-cancel"></button>
      <button class="sb-btn sb-btn-hire" id="sb-job-submit"></button>
    </div>
  </div>
</div>`;
}

function updateJobModalText() {
  const t = locale.t.bind(locale);
  const el = id => document.getElementById(id);
  if (!el('sb-job-overlay')) return;
  el('sb-job-modal-title').textContent  = t('sbNewPosition');
  el('sb-job-company-lbl').textContent  = t('sbJobCompany');
  el('sb-job-company').placeholder      = t('sbJobCompanyPh');
  el('sb-job-role-lbl').textContent     = t('sbJobRole');
  el('sb-job-role').placeholder         = t('sbJobRolePh');
  el('sb-job-details-lbl').textContent  = t('sbJobDetails');
  el('sb-job-details').placeholder      = t('sbJobDetailsPh');
  el('sb-job-cancel').textContent       = t('sbJobCancel');
  el('sb-job-submit').textContent       = t('sbJobAdd');
}

function showJobForm(skeletonCard) {
  _pendingSkeleton = skeletonCard;
  updateJobModalText();
  const overlay = document.getElementById('sb-job-overlay');
  overlay.style.display = 'flex';
  document.getElementById('sb-job-company').value = '';
  document.getElementById('sb-job-role').value    = '';
  document.getElementById('sb-job-details').value = '';
  document.getElementById('sb-job-company-err').textContent = '';
  document.getElementById('sb-job-role-err').textContent    = '';
  document.getElementById('sb-job-company').classList.remove('is-error');
  document.getElementById('sb-job-role').classList.remove('is-error');
  setTimeout(() => document.getElementById('sb-job-company').focus(), 50);
}

function closeJobForm() {
  document.getElementById('sb-job-overlay').style.display = 'none';
}

function cancelJobForm() {
  closeJobForm();
  if (!_pendingSkeleton) return;
  const todoCol = document.querySelector('.sb-col-body[data-col="todo"]');
  if (todoCol && !todoCol.contains(_pendingSkeleton)) {
    todoCol.appendChild(_pendingSkeleton);
    updateCounts();
  }
  _pendingSkeleton = null;
}

function submitJobForm() {
  const company = document.getElementById('sb-job-company').value.trim();
  const role    = document.getElementById('sb-job-role').value.trim();
  const details = document.getElementById('sb-job-details').value.trim();
  const minLen  = 3;
  let valid = true;

  const setErr = (inputId, errId, msg) => {
    document.getElementById(inputId).classList.add('is-error');
    document.getElementById(errId).textContent = msg;
    valid = false;
  };

  document.getElementById('sb-job-company').classList.remove('is-error');
  document.getElementById('sb-job-role').classList.remove('is-error');
  document.getElementById('sb-job-company-err').textContent = '';
  document.getElementById('sb-job-role-err').textContent    = '';

  if (!company)              setErr('sb-job-company', 'sb-job-company-err', locale.t('errFieldRequired'));
  else if (company.length < minLen) setErr('sb-job-company', 'sb-job-company-err', locale.t('sbJobMinLength'));
  if (!role)                 setErr('sb-job-role', 'sb-job-role-err', locale.t('errFieldRequired'));
  else if (role.length < minLen)    setErr('sb-job-role', 'sb-job-role-err', locale.t('sbJobMinLength'));
  if (!valid) return;

  closeJobForm();

  const color = '#a78bfa';
  const newCard = document.createElement('div');
  newCard.className = 'sb-card';
  newCard.setAttribute('draggable', 'true');
  newCard.dataset.job        = 'future';
  newCard.dataset.jobTitle   = role;
  newCard.dataset.jobCompany = company;
  newCard.dataset.jobPeriod  = '2026 – …';
  newCard.dataset.jobDesc    = details;
  newCard.innerHTML = `
    <div class="sb-card-accent" style="background:${color}"></div>
    <div class="sb-card-body">
      <div class="sb-card-head">
        <span class="sb-card-initials" style="background:${color}18;color:${color};border-color:${color}30">${company.charAt(0).toUpperCase()}</span>
        <div class="sb-card-id">
          <div class="sb-card-title">${role}</div>
          <div class="sb-card-company">${company}</div>
        </div>
      </div>
      <div class="sb-card-meta">
        <span class="sb-period">2026 – …</span>
        <span class="sb-live-badge">● New</span>
      </div>
    </div>`;
  _pendingSkeleton.replaceWith(newCard);
  _pendingSkeleton = null;
  updateCounts();

  const ipBody   = document.querySelector('.sb-col-body[data-col="in-progress"]');
  const doneBody = document.querySelector('.sb-col-body[data-col="done"]');
  const mover    = ipBody?.querySelector('.sb-card:not(.is-skeleton)');
  if (mover && doneBody) {
    mover.classList.add('sb-card--completing');
    mover.addEventListener('animationend', () => {
      mover.classList.remove('sb-card--completing');
      mover.classList.add('sb-card--arriving');
      mover.querySelector('.sb-live-badge')?.remove();
      doneBody.prepend(mover);
      mover.addEventListener('animationend', () => {
        mover.classList.remove('sb-card--arriving');
      }, { once: true });
      updateCounts();
    }, { once: true });
  }
}

function initJobModal() {
  document.addEventListener('click', e => {
    if (e.target.closest('#sb-job-cancel'))  { cancelJobForm(); return; }
    if (e.target.closest('#sb-job-submit'))  { submitJobForm(); return; }
    if (e.target.id === 'sb-job-overlay')    { cancelJobForm(); return; }
  });
  document.addEventListener('keydown', e => {
    if (document.getElementById('sb-job-overlay')?.style.display === 'none') return;
    if (e.key === 'Enter')  submitJobForm();
    if (e.key === 'Escape') cancelJobForm();
  });
  window.addEventListener('localechange', updateJobModalText);
}

// ── Detail panel ──────────────────────────────────────────────────────────────
let _lastDragEnd = 0;

function getJobData(jobId, card) {
  if (jobId === 'community') return { ...COMMUNITY_ROW, description: locale.getData().community };
  const found = locale.getData().workExperience.find(j => j.id === jobId);
  if (found) return found;
  if (jobId === 'future' && card) {
    return {
      id: 'future',
      title: card.dataset.jobTitle   || '',
      company: card.dataset.jobCompany || '',
      periodLabel: card.dataset.jobPeriod  || '2026 – …',
      description: card.dataset.jobDesc    || '',
      isCurrent: true,
      bullets: [],
      skills: [],
    };
  }
  return null;
}

function renderDetailContent(job) {
  const color = CARD_COLORS[job.id] || '#a78bfa';
  const chips = (job.skills || []).map(s => `<span class="sb-chip">${s.name}</span>`).join('');
  const lis   = (job.bullets || []).map(b => `<li>${b}</li>`).join('');
  return `
    <div class="sb-detail-accent" style="background:${color}"></div>
    <div class="sb-detail-title" style="color:${color}">${job.title}</div>
    <div class="sb-detail-company">${job.company}</div>
    <div class="sb-detail-meta">
      <span class="sb-period">${job.periodLabel}</span>
      ${job.isCurrent ? '<span class="sb-live-badge">● Live</span>' : ''}
    </div>
    ${job.description ? `<p class="sb-detail-desc">${job.description}</p>` : ''}
    ${lis ? `<ul class="sb-detail-bullets">${lis}</ul>` : ''}
    ${chips ? `<div class="sb-detail-chips">${chips}</div>` : ''}
    <button class="sb-detail-close-btn" id="sb-detail-close">${locale.t('sbDetailClose')}</button>`;
}

function openDetailPanel(job) {
  const panel = document.getElementById('sb-detail-panel');
  if (!panel) return;
  panel.querySelector('.sb-detail-inner').innerHTML = renderDetailContent(job);
  panel.classList.add('open');
}

function closeDetailPanel() {
  document.getElementById('sb-detail-panel')?.classList.remove('open');
}

function initDetailPanel() {
  document.addEventListener('click', e => {
    if (e.target.closest('#sb-detail-close')) { closeDetailPanel(); return; }
    if (e.target.closest('.sb-detail-overlay')) { closeDetailPanel(); return; }

    if (Date.now() - _lastDragEnd < 120) return;

    const card = e.target.closest('.sb-card:not(.is-skeleton)');
    if (card) {
      const job = getJobData(card.dataset.job, card);
      if (job) openDetailPanel(job);
      return;
    }
    const skeleton = e.target.closest('.sb-card.is-skeleton');
    if (skeleton) {
      showJobForm(skeleton);
      return;
    }
    // Close panel if clicking outside
    const panel = document.getElementById('sb-detail-panel');
    if (panel?.classList.contains('open') && !panel.contains(e.target)) {
      closeDetailPanel();
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeDetailPanel();
  });
}

// ── Global event delegation (set up once) ─────────────────────────────────────
function initGlobalHandlers() {
  document.addEventListener('click', e => {
    // Theme toggle
    if (e.target.closest('#theme-toggle')) {
      const next = document.documentElement.getAttribute('data-theme') === THEME_DARK
        ? THEME_LIGHT : THEME_DARK;
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(THEME_KEY, next);
      return;
    }

    // Music button
    if (e.target.closest('#sb-music-btn')) {
      document.getElementById('music-toggle')?.click();
      return;
    }

    // Contacts button toggle
    if (e.target.closest('#sb-contacts-btn')) {
      const popup = document.getElementById('sb-contacts-popup');
      if (popup) {
        e.stopPropagation();
        const rect = e.target.closest('#sb-contacts-btn').getBoundingClientRect();
        const btnCenter = rect.left + rect.width / 2;
        popup.style.right = btnCenter > window.innerWidth / 2 ? '0' : 'auto';
        popup.style.left  = btnCenter > window.innerWidth / 2 ? 'auto' : '0';
        popup.classList.toggle('open');
      }
      return;
    }

    // Close contacts popup on outside click
    const popup = document.getElementById('sb-contacts-popup');
    if (popup?.classList.contains('open') && !popup.contains(e.target)) {
      popup.classList.remove('open');
    }
  });
}

// ── Drag & drop ───────────────────────────────────────────────────────────────
function getDragAfterElement(container, y) {
  const cards = [...container.querySelectorAll('.sb-card:not(.dragging)')];
  return cards.reduce((closest, child) => {
    const box    = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) return { offset, element: child };
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function initDragDrop() {
  let draggedCard      = null;
  let _dragOriginCol   = null;
  let _dragOriginNextSib = null;

  document.addEventListener('dragstart', e => {
    const card = e.target.closest('.sb-card');
    if (!card) return;
    draggedCard        = card;
    _dragOriginCol     = card.closest('.sb-col-body');
    _dragOriginNextSib = card.nextElementSibling;
    card.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  });

  document.addEventListener('dragend', () => {
    _lastDragEnd = Date.now();
    if (draggedCard) draggedCard.classList.remove('dragging');
    document.querySelectorAll('.sb-col-body.drag-over').forEach(el => el.classList.remove('drag-over'));
    draggedCard = _dragOriginCol = _dragOriginNextSib = null;
  });

  document.addEventListener('dragover', e => {
    if (!draggedCard) return;
    const col = e.target.closest('.sb-col-body');
    if (!col) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    document.querySelectorAll('.sb-col-body.drag-over').forEach(el => el.classList.remove('drag-over'));
    col.classList.add('drag-over');
  });

  document.addEventListener('dragleave', e => {
    const col = e.target.closest('.sb-col-body');
    if (col && !col.contains(e.relatedTarget)) col.classList.remove('drag-over');
  });

  document.addEventListener('drop', e => {
    if (!draggedCard) return;
    const col = e.target.closest('.sb-col-body');
    if (!col) return;
    e.preventDefault();
    col.classList.remove('drag-over');

    const isSkeleton = draggedCard.classList.contains('is-skeleton');
    const sameCol    = col === _dragOriginCol;

    if (sameCol) {
      const afterEl = getDragAfterElement(col, e.clientY);
      if (afterEl) col.insertBefore(draggedCard, afterEl);
      else          col.appendChild(draggedCard);
    } else if (isSkeleton) {
      col.appendChild(draggedCard);
      updateCounts();
      showJobForm(draggedCard);
    } else {
      showToast(locale.t('sbCannotChangePast'));
      if (_dragOriginNextSib) _dragOriginCol.insertBefore(draggedCard, _dragOriginNextSib);
      else                    _dragOriginCol.appendChild(draggedCard);
    }
  });
}

function updateCounts() {
  document.querySelectorAll('.sb-column').forEach(col => {
    col.querySelector('.sb-col-count').textContent =
      col.querySelector('.sb-col-body').children.length;
  });
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────
renderPage();
initHeader();
initGlobalHandlers();
initDragDrop();
initJobModal();
initDetailPanel();

document.body.insertAdjacentHTML('beforeend', jobModalHTML());
document.body.insertAdjacentHTML('beforeend', `<aside class="sb-detail-panel" id="sb-detail-panel"><div class="sb-detail-inner"></div></aside><div class="sb-detail-overlay" id="sb-detail-overlay"></div>`);

document.body.insertAdjacentHTML('beforeend', musicPlayerHTML());
initMusicPlayer();

document.body.insertAdjacentHTML('beforeend', hireModalHTML('hire-scrumboard', { subject: 'Hire inquiry from CV - Scrum Board' }));
initHireModal('hire-scrumboard');
initFormspree('#hire-scrumboard-form');

document.body.insertAdjacentHTML('beforeend', bookingModalHTML('scrumboard'));
initBookingModal('scrumboard');
