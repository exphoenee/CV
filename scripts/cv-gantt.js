import { CV_DATA } from './cv-data.js';
import { locale } from './locale.js';
import { initHireModal, initFormspree, hireModalHTML, bookingModalHTML, initBookingModal, getSystemTheme, musicPlayerHTML } from './shared.js';
import { initMusicPlayer } from './cv-music-player.js';
import { THEME_KEY, THEME_DARK, THEME_LIGHT } from './config.js';
import { createLangDropdown } from './components/lang-dropdown.js';

// ── Chart config ──────────────────────────────────────────────────────────────
const START_YEAR  = 2020;
const START_MONTH = 0;      // Jan
const END_YEAR    = 2027;
const END_MONTH   = 0;      // Jan
const MONTH_W     = 20;     // px per month
const SIDEBAR_W   = 230;    // px
const ROW_H       = 54;     // px
const BAR_H       = 32;     // px
const GRP_H       = 28;     // group header height
const HDR_H       = 44;     // time axis header height

const TOTAL_MONTHS = (END_YEAR - START_YEAR) * 12 + (END_MONTH - START_MONTH); // 84
const CHART_W      = TOTAL_MONTHS * MONTH_W;                                    // 1680px

// ── Colors ────────────────────────────────────────────────────────────────────
const BAR_COLORS = {
  aegex:     '#ff7024',
  telekom:   '#e05aab',
  scolia:    '#22c55e',
  cubicfox:  '#f59e0b',
  cobotx:    '#6366f1',
  webforsol: '#8b5cf6',
  community: '#06b6d4',
};

// ── Milestones ────────────────────────────────────────────────────────────────
const MILESTONES = {
  aegex: [
    { month: '2024-01', label: 'SafeSy Architecture' },
    { month: '2024-04', label: 'FACTS CI/CD Pipeline' },
    { month: '2024-07', label: 'PNPM Monorepo Migration' },
    { month: '2025-01', label: 'Release Cycle ÷2 (30d→14d)' },
    { month: '2025-06', label: 'AI-assisted Dev Workflows' },
    { month: '2026-02', label: 'School Mentoring Program' },
  ],
  community: [
    { month: '2026-04', label: '1st — Hack and Code 2026' },
    { month: '2026-05', label: '1st & 3rd — Neumann János' },
  ],
  cobotx: [
    { month: '2022-01', label: 'Team of 4 engineers built' },
    { month: '2022-06', label: 'KPI & reporting system' },
  ],
};

// ── Extra row: Community ──────────────────────────────────────────────────────
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

// ── Date helpers ──────────────────────────────────────────────────────────────
function monthOffset(yyyyMM) {
  const [y, m] = yyyyMM.split('-').map(Number);
  return (y - START_YEAR) * 12 + (m - 1 - START_MONTH);
}

// Returns fractional pixel offset for an exact Date (day-accurate)
function dateToPx(date) {
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const fraction    = (date.getDate() - 1) / daysInMonth;
  const months      = (date.getFullYear() - START_YEAR) * 12 + (date.getMonth() - START_MONTH) + fraction;
  return Math.min(CHART_W, Math.max(0, months * MONTH_W));
}

function todayPx() {
  return dateToPx(new Date());
}

function barGeometry(from, to) {
  const startPx = Math.max(0, monthOffset(from) * MONTH_W);
  const endPx   = to
    ? Math.min(CHART_W, (monthOffset(to) + 1) * MONTH_W)
    : dateToPx(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  return { left: startPx, width: Math.max(8, endPx - startPx) };
}

// ── Render: time axis ─────────────────────────────────────────────────────────
function renderTimeAxis() {
  let years = '', quarters = '';
  for (let y = START_YEAR; y < END_YEAR; y++) {
    years += `<div class="gt-year" style="width:${12 * MONTH_W}px">${y}</div>`;
    for (let q = 0; q < 4; q++) {
      quarters += `<div class="gt-quarter" style="width:${3 * MONTH_W}px">Q${q + 1}</div>`;
    }
  }
  return `<div class="gt-years">${years}</div><div class="gt-quarters">${quarters}</div>`;
}

// ── Render: milestones ────────────────────────────────────────────────────────
function renderMilestones(jobId, barLeft) {
  return (MILESTONES[jobId] || []).map(({ month, label }) => {
    const x = monthOffset(month) * MONTH_W - barLeft;
    return `<span class="gt-ms" style="left:${x}px" title="${label}">
      <span class="gt-ms-dot"></span>
      <span class="gt-ms-tip">${label}</span>
    </span>`;
  }).join('');
}

// ── Render: bar ───────────────────────────────────────────────────────────────
function renderBar(job) {
  const color = BAR_COLORS[job.id] || '#8b949e';
  const { left, width } = barGeometry(job.period.from, job.period.to);
  return `<div class="gt-bar${job.isCurrent ? ' is-current' : ''}"
    style="left:${left}px;width:${width}px;background:${color}"
    data-job="${job.id}"
    role="button"
    tabindex="0"
    aria-label="${job.title} at ${job.company}, ${job.periodLabel}${job.isCurrent ? ' (current)' : ''}">
    <span class="gt-bar-label">${job.title} · ${job.company}</span>
    ${renderMilestones(job.id, left)}
  </div>`;
}

// ── Render: sidebar row label ─────────────────────────────────────────────────
function renderLabel(job, draggable = false) {
  return `<div class="gt-row-label${draggable ? ' gt-row-draggable' : ''}" draggable="${draggable}" data-job="${job.id}" style="height:${ROW_H}px" role="listitem" tabindex="0" aria-label="${job.title} at ${job.company}, ${job.periodLabel}">
    <div class="gt-job-title">${job.title}</div>
    <div class="gt-job-company">${job.company}</div>
    <div class="gt-job-period">${job.periodLabel}</div>
  </div>`;
}

// ── Render: track row ─────────────────────────────────────────────────────────
function renderTrack(job, idx) {
  const shade = idx % 2 === 1 ? ' gt-alt' : '';
  return `<div class="gt-row-track${shade}" data-job="${job.id}" style="height:${ROW_H}px">
    ${renderBar(job)}
  </div>`;
}

// ── Render: group divider ─────────────────────────────────────────────────────
function renderGroupDivider(label) {
  return {
    label: `<div class="gt-group-label" style="height:${GRP_H}px">${label}</div>`,
    track: `<div class="gt-group-track" style="height:${GRP_H}px"></div>`,
  };
}

// ── Render: skills section ────────────────────────────────────────────────────
const SKILL_NAMES = { primary: 'Frontend Core', backend: 'Backend', testing: 'Testing',
                      tooling: 'Tooling', ai: 'AI Tools', robotics: 'Robotics / Hardware' };

function renderSkills() {
  return Object.entries(CV_DATA.skillGroups).map(([k, g]) => `
    <div class="gt-skill-group" draggable="true" data-skill-key="${k}">
      <div class="gt-skill-group-name">${SKILL_NAMES[k] || k}</div>
      <div class="gt-skill-chips">
        ${g.list.map(s => `<span class="gt-chip">${s}</span>`).join('')}
        ${g.comment ? `<span class="gt-chip gt-chip-note">${g.comment}</span>` : ''}
      </div>
    </div>`).join('');
}

// ── Row drag & drop (Career Timeline only) ────────────────────────────────────
function initRowsDragDrop() {
  const sidebar = document.getElementById('gt-sidebar');
  const tracks  = document.getElementById('gt-tracks');
  if (!sidebar || !tracks) return;

  let dragged = null;

  function syncClass(jobId, cls, add) {
    [`#gt-sidebar .gt-row-label[data-job="${jobId}"]`,
     `#gt-tracks .gt-row-track[data-job="${jobId}"]`].forEach(sel => {
      const el = document.querySelector(sel);
      if (el) el.classList[add ? 'add' : 'remove'](cls);
    });
  }

  function clearDragOver() {
    document.querySelectorAll('.gt-row-label.gt-drag-over, .gt-row-track.gt-drag-over')
      .forEach(el => el.classList.remove('gt-drag-over'));
  }

  function careerLabels() {
    return [...sidebar.querySelectorAll('.gt-row-draggable')];
  }

  sidebar.addEventListener('dragstart', e => {
    const label = e.target.closest('.gt-row-draggable');
    if (!label) return;
    dragged = label.dataset.job;
    syncClass(dragged, 'gt-drag-active', true);
    e.dataTransfer.effectAllowed = 'move';
  });

  sidebar.addEventListener('dragend', () => {
    if (dragged) syncClass(dragged, 'gt-drag-active', false);
    clearDragOver();
    dragged = null;
  });

  sidebar.addEventListener('dragover', e => {
    e.preventDefault();
    const target = e.target.closest('.gt-row-draggable');
    if (!target || target.dataset.job === dragged) return;
    clearDragOver();
    syncClass(target.dataset.job, 'gt-drag-over', true);
  });

  sidebar.addEventListener('dragleave', e => {
    if (!e.relatedTarget || !sidebar.contains(e.relatedTarget)) clearDragOver();
  });

  sidebar.addEventListener('drop', e => {
    e.preventDefault();
    const target = e.target.closest('.gt-row-draggable');
    if (!target || !dragged || target.dataset.job === dragged) return;
    clearDragOver();

    const labels      = careerLabels();
    const draggedLabel = sidebar.querySelector(`.gt-row-label[data-job="${dragged}"]`);
    const draggedTrack = tracks.querySelector(`.gt-row-track[data-job="${dragged}"]`);
    const targetTrack  = tracks.querySelector(`.gt-row-track[data-job="${target.dataset.job}"]`);

    const fromIdx = labels.indexOf(draggedLabel);
    const toIdx   = labels.indexOf(target);

    if (fromIdx < toIdx) {
      target.after(draggedLabel);
      if (targetTrack && draggedTrack) targetTrack.after(draggedTrack);
    } else {
      target.before(draggedLabel);
      if (targetTrack && draggedTrack) targetTrack.before(draggedTrack);
    }
  });
}

function initSkillsDragDrop() {
  const grid = document.querySelector('.gt-skill-groups');
  if (!grid) return;
  let dragged = null;

  grid.addEventListener('dragstart', e => {
    dragged = e.target.closest('.gt-skill-group');
    if (!dragged) return;
    dragged.classList.add('gt-drag-active');
    e.dataTransfer.effectAllowed = 'move';
  });

  grid.addEventListener('dragend', () => {
    if (dragged) dragged.classList.remove('gt-drag-active');
    grid.querySelectorAll('.gt-drag-over').forEach(el => el.classList.remove('gt-drag-over'));
    dragged = null;
  });

  grid.addEventListener('dragover', e => {
    e.preventDefault();
    const target = e.target.closest('.gt-skill-group');
    if (!target || target === dragged) return;
    grid.querySelectorAll('.gt-drag-over').forEach(el => el.classList.remove('gt-drag-over'));
    target.classList.add('gt-drag-over');
  });

  grid.addEventListener('dragleave', e => {
    const target = e.target.closest('.gt-skill-group');
    if (target) target.classList.remove('gt-drag-over');
  });

  grid.addEventListener('drop', e => {
    e.preventDefault();
    const target = e.target.closest('.gt-skill-group');
    if (!target || target === dragged || !dragged) return;
    target.classList.remove('gt-drag-over');
    const allCards = [...grid.querySelectorAll('.gt-skill-group')];
    const fromIdx = allCards.indexOf(dragged);
    const toIdx   = allCards.indexOf(target);
    if (fromIdx < toIdx) target.after(dragged);
    else target.before(dragged);
  });
}

// ── Render: legend ────────────────────────────────────────────────────────────
function renderLegend(communityRow = COMMUNITY_ROW) {
  const all = [...CV_DATA.workExperience, communityRow];
  return all.map(j => `
    <div class="gt-legend-item">
      <span class="gt-legend-dot" style="background:${BAR_COLORS[j.id] || '#8b949e'}"></span>
      ${j.company}
    </div>`).join('');
}

// ── Render: detail panel ──────────────────────────────────────────────────────
function renderDetail(job) {
  const color  = BAR_COLORS[job.id] || '#8b949e';
  const logo   = job.logo ? `<img class="gt-detail-logo" src="assets/images/${job.logo}" alt="${job.company} logo" onerror="this.style.display='none'">` : '';
  const chips  = (job.skills || []).map(s => `<span class="gt-chip">${s.name}</span>`).join('');
  const lis    = (job.bullets || []).map(b => `<li>${b}</li>`).join('');
  const refs   = (job.refs || []).map(r => `<a href="${r.url}" target="_blank" rel="noopener noreferrer">${r.label}</a>`).join('');
  return `<div class="gt-detail-inner" role="article" aria-label="${job.title} at ${job.company}">
    <div class="gt-detail-head">
      ${logo}
      <div class="gt-detail-meta">
        <div class="gt-detail-title" style="color:${color}">${job.title}</div>
        <div class="gt-detail-company">${job.company}</div>
        <div class="gt-detail-badges">
          <span class="gt-period-badge">${job.periodLabel}</span>
          ${job.isCurrent ? '<span class="gt-live-badge" aria-label="Currently active">● Live</span>' : ''}
        </div>
      </div>
      <button class="gt-close-btn" id="gt-close" aria-label="${locale.t('ariaCloseDialog')}">✕</button>
    </div>
    ${job.description ? `<p class="gt-detail-desc">${job.description}</p>` : ''}
    ${lis ? `<ul class="gt-detail-bullets">${lis}</ul>` : ''}
    ${chips ? `<div class="gt-detail-chips">${chips}</div>` : ''}
    ${refs ? `<div class="gt-detail-refs">${refs}</div>` : ''}
  </div>`;
}

// ── Render: full page ─────────────────────────────────────────────────────────
function renderPage() {
  document.documentElement.style.setProperty('--chart-w', CHART_W + 'px');
  document.documentElement.style.setProperty('--month-w', MONTH_W + 'px');
  document.documentElement.style.setProperty('--row-h', ROW_H + 'px');
  document.documentElement.style.setProperty('--bar-h', BAR_H + 'px');
  document.documentElement.style.setProperty('--hdr-h', HDR_H + 'px');
  document.documentElement.style.setProperty('--grp-h', GRP_H + 'px');
  document.documentElement.style.setProperty('--sidebar-w', SIDEBAR_W + 'px');

  const data = locale.getData();
  const jobs  = data.workExperience;
  const communityRow = { ...COMMUNITY_ROW, description: data.community };
  const todayX  = todayPx();

  const contacts = CV_DATA.identity.contacts
    .filter(c => c.url)
    .slice(0, 4)
    .map(c => `<a href="${c.url}" target="${c.url.startsWith('mailto') ? '_self' : '_blank'}" rel="noopener noreferrer">${c.label}</a>`)
    .join('');

  const allContactLinks = CV_DATA.identity.contacts
    .filter(c => c.url)
    .map(c => `<a href="${c.url}" target="${c.url.startsWith('mailto') ? '_self' : '_blank'}" rel="noopener noreferrer">${c.label}</a>`)
    .join('');

  const careerGroup = renderGroupDivider(locale.t('ganttCareerTimeline'));
  const commGroup   = renderGroupDivider(locale.t('ganttCommunity'));

  const careerRows = [...jobs].reverse();
  const commRows   = [communityRow];

  const sidebarLabels = `
    ${careerGroup.label}
    ${careerRows.map(j => renderLabel(j, true)).join('')}
    ${commGroup.label}
    ${commRows.map(renderLabel).join('')}`;

  const trackRows = `
    ${careerGroup.track}
    ${careerRows.map((j, i) => renderTrack(j, i)).join('')}
    ${commGroup.track}
    ${commRows.map((j, i) => renderTrack(j, careerRows.length + i)).join('')}`;

  document.getElementById('gantt-root').innerHTML = `
  <div class="gantt-page">

    <header class="gt-header" role="banner">
      <a href="index.html" class="gt-back" title="Back" aria-label="${locale.t('ariaBackToHub')}">
        <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
      </a>
      <div class="gt-header-id">
        <div class="gt-header-name">${CV_DATA.identity.name}</div>
        <div class="gt-header-role">${CV_DATA.meta.role}<span class="gt-pm-view"> &nbsp;·&nbsp; <span style="color:var(--gantt-muted)">${locale.t('ganttPmView')}</span></span></div>
      </div>
      <nav class="gt-header-links" aria-label="Contact links">${contacts}</nav>
      <div class="gt-header-actions" role="group" aria-label="Page actions">
        <div id="gt-lang-dropdown-wrap"></div>
        <button class="gt-icon-btn" id="theme-toggle" title="Toggle theme" aria-label="${locale.t('ariaToggleTheme')}">
          <span class="theme-sq-icon" aria-hidden="true"></span>
        </button>
        <button class="gt-icon-btn" id="gt-music-btn" title="Music player" aria-label="${locale.t('ariaOpenMusicPlayer')}">
          <i class="fa-solid fa-music" aria-hidden="true"></i>
        </button>
        <div class="gt-contacts-wrap">
          <button class="gt-icon-btn" id="gt-contacts-btn" title="${locale.t('ganttContacts')}" aria-label="${locale.t('ganttContacts')}" aria-haspopup="true" aria-expanded="false">
            <i class="fa-solid fa-address-card" aria-hidden="true"></i>
          </button>
          <div class="gt-contacts-popup" id="gt-contacts-popup" role="menu" aria-label="${locale.t('ganttContactsHeading')}">
            <div class="gt-contacts-popup-heading">${locale.t('ganttContactsHeading')}</div>
            ${allContactLinks}
          </div>
        </div>
        <button class="gt-btn gt-btn-hire" id="hire-gantt-btn" aria-label="${locale.t('hireMe')} — ${locale.t('ariaHireForm')}">
          <i class="fa-solid fa-paper-plane" aria-hidden="true"></i><span class="gt-btn-label"> ${locale.t('hireMe')}</span>
        </button>
        <button class="gt-btn gt-btn-book" id="gantt-booking-btn" aria-label="${locale.t('ganttBook')} — ${locale.t('bookMeeting')}">
          <i class="fa-regular fa-calendar-check" aria-hidden="true"></i><span class="gt-btn-label"> ${locale.t('ganttBook')}</span>
        </button>
      </div>
    </header>

    <main class="gt-main" id="gt-main" aria-label="Career Gantt chart">

      <div class="gt-sidebar" id="gt-sidebar" role="list" aria-label="Job entries">
        <div class="gt-sidebar-header" style="height:${HDR_H}px" role="columnheader">${locale.t('ganttTaskRole')}</div>
        ${sidebarLabels}
      </div>

      <div class="gt-tracks" id="gt-tracks" role="region" aria-label="Timeline tracks">
        <div class="gt-time-axis" style="height:${HDR_H}px" role="rowgroup" aria-label="Time axis">
          ${renderTimeAxis()}
        </div>
        ${trackRows}
        <div class="gt-today-line" id="gt-today-line" style="left:${todayX}px" aria-label="Today" role="mark"></div>
      </div>

    </main>

    <div class="gt-detail" id="gt-detail" role="region" aria-label="Job detail panel" aria-live="polite"></div>

    <div class="gt-legend">
      <span class="gt-legend-heading">${locale.t('ganttLegend')}</span>
      ${renderLegend(communityRow)}
      <div class="gt-legend-item">
        <span style="width:14px;height:2px;background:var(--today-color);display:inline-block;border-radius:1px"></span>
        ${locale.t('ganttToday')}
      </div>
      <div class="gt-legend-item">
        <span style="width:10px;height:10px;background:#fff;border:2px solid rgba(0,0,0,0.3);border-radius:50%;display:inline-block"></span>
        ${locale.t('ganttMilestone')}
      </div>
    </div>

    <div class="gt-skills-section">
      <div class="gt-section-title">${locale.t('ganttSkills')}</div>
      <div class="gt-skill-groups">${renderSkills()}</div>
    </div>

    <footer class="gt-footer">
      <div class="gt-footer-col">
        <div class="gt-footer-title">${locale.t('ganttEducation')} — ${CV_DATA.education.institution}</div>
        <ul class="gt-edu-list">
          ${CV_DATA.education.degrees.map(d => `<li>${d.title} <em>${d.years}</em></li>`).join('')}
        </ul>
      </div>
      <div class="gt-footer-col">
        <div class="gt-footer-title">${locale.t('ganttCommunity')}</div>
        <p class="gt-footer-text">${data.community}</p>
      </div>
    </footer>

  </div>`;
}

// ── Interactivity ─────────────────────────────────────────────────────────────
function initInteractivity() {
  const main   = document.getElementById('gt-main');
  const detail = document.getElementById('gt-detail');
  let active   = null;

  function openDetail(jobId) {
    const allJobs = [...CV_DATA.workExperience, COMMUNITY_ROW];
    const job = allJobs.find(j => j.id === jobId);
    if (!job) return;

    active = jobId;
    detail.innerHTML = renderDetail(job);
    detail.classList.add('open');

    document.querySelectorAll('.gt-row-label, .gt-row-track').forEach(el => {
      el.classList.toggle('is-active', el.dataset.job === jobId);
    });

    setTimeout(() => detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 60);

    document.getElementById('gt-close').addEventListener('click', closeDetail);
  }

  function closeDetail() {
    active = null;
    detail.classList.remove('open');
    detail.innerHTML = '';
    document.querySelectorAll('.gt-row-label, .gt-row-track').forEach(el => {
      el.classList.remove('is-active');
    });
  }

  // Click on sidebar labels
  document.getElementById('gt-sidebar').addEventListener('click', function(e) {
    const label = e.target.closest('.gt-row-label');
    if (!label) return;
    const jobId = label.dataset.job;
    if (active === jobId) closeDetail();
    else openDetail(jobId);
  });

  // Click on track bars
  document.getElementById('gt-tracks').addEventListener('click', function(e) {
    const bar = e.target.closest('.gt-bar');
    if (!bar) return;
    const jobId = bar.dataset.job;
    if (active === jobId) closeDetail();
    else openDetail(jobId);
  });

  // Scroll to ~1.5 years before today to give context
  const todayX = todayPx();
  main.scrollLeft = Math.max(0, todayX - 18 * MONTH_W);
}

// ── Contacts popup (mobile) ───────────────────────────────────────────────────
function initContactsPopup() {
  const btn   = document.getElementById('gt-contacts-btn');
  const popup = document.getElementById('gt-contacts-popup');
  if (!btn || !popup) return;

  btn.addEventListener('click', e => {
    e.stopPropagation();
    const rect = btn.getBoundingClientRect();
    const btnCenter = rect.left + rect.width / 2;
    if (btnCenter > window.innerWidth / 2) {
      popup.style.right = '0';
      popup.style.left  = 'auto';
    } else {
      popup.style.left  = '0';
      popup.style.right = 'auto';
    }
    popup.classList.toggle('open');
  });

  document.addEventListener('click', e => {
    if (!popup.contains(e.target) && e.target !== btn) {
      popup.classList.remove('open');
    }
  });
}

// ── Theme ─────────────────────────────────────────────────────────────────────
function initTheme() {
  const btn = document.getElementById('theme-toggle');
  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem(THEME_KEY, t);
  }
  btn.addEventListener('click', () => {
    setTheme(document.documentElement.getAttribute('data-theme') === THEME_DARK ? THEME_LIGHT : THEME_DARK);
  });
  setTheme(localStorage.getItem(THEME_KEY) || getSystemTheme());
}

// ── Lang dropdown ─────────────────────────────────────────────────────────────
function initLangDropdown_() {
  const wrap = document.getElementById('gt-lang-dropdown-wrap');
  if (!wrap) return;
  createLangDropdown(wrap, {
    onChange(lang) {
      const scrollLeft = document.getElementById('gt-main')?.scrollLeft || 0;
      locale.setLang(lang);
      renderPage();
      initPage();
      document.getElementById('gt-main').scrollLeft = scrollLeft;
    }
  });
}

// ── Page init (re-runs after each re-render) ──────────────────────────────────
function initPage() {
  initTheme();
  initContactsPopup();
  initInteractivity();
  initRowsDragDrop();
  initSkillsDragDrop();
  initLangDropdown_();
  document.getElementById('gt-music-btn')?.addEventListener('click', () => {
    document.getElementById('music-toggle')?.click();
  });
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────
renderPage();
initPage();

document.body.insertAdjacentHTML('beforeend', musicPlayerHTML());
initMusicPlayer();

document.body.insertAdjacentHTML('beforeend', hireModalHTML('hire-gantt', { subject: 'Hire inquiry from CV - Gantt' }));
initHireModal('hire-gantt');
initFormspree('#hire-gantt-form');

document.body.insertAdjacentHTML('beforeend', bookingModalHTML('gantt'));
initBookingModal('gantt');
