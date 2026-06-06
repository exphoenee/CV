import { skillChip } from '../../shared.js';
import { locale } from '../../locale.js';

export function renderProgrammingLanguages(data) {
  const chips = data.programmingLanguages.map(pl => skillChip(pl.name, pl.icon)).join('\n');

  return `
    <div class="blockTitle noBreakBeforeAfter cv-block-title"><span>${locale.t('programmingLanguages')}</span></div>
    <div class="item noBreakInside cv-item">
      <div class="itemContent">
        <div class="itemSkills">
          ${chips}
        </div>
      </div>
    </div>
  `;
}
