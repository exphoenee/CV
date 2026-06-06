import { locale } from '../../locale.js';

export function renderCommunity(data) {
  return `
    <div class="blockTitle noBreakBeforeAfter cv-block-title"><span>${locale.t('community')}</span></div>
    <div class="item noBreakInside cv-item">
      <div class="itemDescription">
        ${data.community}
      </div>
    </div>
  `;
}
