import { locale, AVAILABLE_LANGS } from '../../locale.js';

const LANG_LABELS = { en: 'EN', hu: 'HU', de: 'DE' };

export function renderLangSwitcher() {
  return `<div class="lang-switcher">
    ${AVAILABLE_LANGS.map(lang => `<button class="lang-btn${locale.lang === lang ? ' lang-btn--active' : ''}" data-lang="${lang}">${LANG_LABELS[lang]}</button>`).join('')}
  </div>`;
}
