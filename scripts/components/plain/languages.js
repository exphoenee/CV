import { escHtml } from '../../shared.js';
import { locale } from '../../locale.js';

export function renderLanguages(data) {
  const langs = data.identity.languages.map(lang => `
    <div><strong>${escHtml(lang.name)}:</strong>&nbsp;${escHtml(lang.level)}</div>
  `).join('');

  return `
    <div class="blockTitle noBreakBeforeAfter cv-block-title"><span>${locale.t('languages')}</span></div>
    <div class="item noBreakInside cv-item">
      <div class="cv-plain-inline-8 itemDescription">
        ${langs}
      </div>
    </div>
  `;
}
