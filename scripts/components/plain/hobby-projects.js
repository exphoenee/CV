import { escHtml } from '../../shared.js';
import { locale } from '../../locale.js';

export function renderHobbyProjects(data) {
  const links = data.hobbyProjects.map((proj, idx) => {
    const comma = idx < data.hobbyProjects.length - 1 ? ',' : '';
    return `<a href="${escHtml(proj.url)}" target="_blank" rel="noopener noreferrer">${escHtml(proj.name)}</a>${comma}`;
  }).join('\n');

  return `
    <div class="blockTitle noBreakBeforeAfter cv-block-title"><span>${locale.t('hobbyProjects')}</span></div>
    <div class="item noBreakInside cv-item">
      <div class="itemDescription">
        <div class="hobby-links">
          ${links}
        </div>
      </div>
    </div>
  `;
}
