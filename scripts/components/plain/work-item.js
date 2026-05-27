import { escHtml, skillChip } from '../../shared.js';

function renderBullets(bullets) {
  if (!bullets?.length) return '';
  return bullets.map(b => `<div><i class="bullet-icon"></i>${b}</div>`).join('');
}

function renderRefs(exp) {
  if (!exp.refs?.length) return '';
  const refClass = exp.refs.length > 1 ? 'cv-plain-inline-5' : 'cv-plain-inline-6';
  return `
    <div class="cv-plain-inline-3">
      <div class="cv-plain-inline-4"><strong>Reference(s):</strong></div>
      <div class="${refClass}">
        ${exp.refs.map(r => `<a href="${escHtml(r.url)}" target="_blank">${escHtml(r.label)}</a>`).join('\n')}
      </div>
    </div>
  `;
}

function renderDescription(exp) {
  if (exp.projects) {
    return `
      <p>${exp.description}</p>
      <div class="cv-plain-inline-2">
        ${exp.projects.map(p => `
          <div>
            <div><strong>${escHtml(p.name)}</strong> - ${escHtml(p.subtitle)}</div>
            ${renderBullets(p.bullets)}
          </div>
        `).join('')}
      </div>
    `;
  }
  if (Array.isArray(exp.bullets)) {
    return `<div>${exp.description}</div><div class="cv-plain-inline-2">${renderBullets(exp.bullets)}</div>`;
  }
  if (exp.bullets && typeof exp.bullets === 'object') {
    return `
      ${exp.description}
      <div class="cv-plain-inline-7">
        ${Object.entries(exp.bullets).map(([key, arr]) => `
          <div>
            <div><strong>${key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</strong></div>
            ${renderBullets(arr)}
          </div>
        `).join('')}
      </div>
    `;
  }
  return exp.description || '';
}

export function renderWorkItem(exp) {
  return `
    <div class="item noBreakInside workExperienceItem cv-item">
      <div class="itemHeaderWrapper">
        <div class="itemLogoAndTitle">
          <div class="itemLogo">
            <img alt="${escHtml(exp.company)}" title="${escHtml(exp.company)}" src="./assets/images/${exp.logo}" />
          </div>
          <div class="itemTitle">${escHtml(exp.company)}</div>
        </div>
        <div class="itemDetails itemDetailsWithDate">${escHtml(exp.title)}</div>
        <div class="itemDate">${escHtml(exp.periodLabel)}</div>
      </div>
      <div class="itemContentContainer">
        <div class="itemDescription">
          ${renderDescription(exp)}
        </div>
        ${renderRefs(exp)}
        ${exp.skills?.length ? `<div class="itemSkills">${exp.skills.map(s => skillChip(s, s.toLowerCase().replace(/\./g, '') + '.svg')).join('')}</div>` : ''}
      </div>
    </div>
  `;
}
