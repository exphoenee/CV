import { escHtml } from '../../shared.js';

export function renderEducation(data) {
  const degrees = data.education.degrees.map(deg => `
    <div><i class="bullet-icon"></i>${escHtml(deg.title)}</div>
    <div style="opacity: 0.7; font-size: 0.9em; text-align: right; white-space: nowrap;">${escHtml(deg.years)}</div>
  `).join('');

  return `
    <div class="blockTitle noBreakBeforeAfter cv-block-title"><span>Education</span></div>
    <div class="item noBreakInside educationItem cv-item">
      <div class="itemContent" style="display: flex; flex-direction: column; gap: 8px;">
        <div class="itemTitle" style="width: 100%; margin-bottom: 0.1rem;">
          ${escHtml(data.education.institution)}
        </div>
        <div style="width: 100%; display: grid; grid-template-columns: 1fr auto; gap: 4px 16px; align-items: baseline; font-size: 0.95em;">
          ${degrees}
        </div>
      </div>
    </div>
  `;
}
