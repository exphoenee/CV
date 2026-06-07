import { locale, AVAILABLE_LANGS } from '../../locale.js';

const LANG_LABELS = { en: 'EN', hu: 'HU', de: 'DE', fr: 'FR', es: 'ES', it: 'IT', dot: 'DOT', kl: 'KL', qu: 'QU', goa: 'GOA' };
const LANG_NAMES  = { en: 'English', hu: 'Magyar', de: 'Deutsch', fr: 'Français', es: 'Español', it: 'Italiano', dot: 'Dothraki', kl: 'tlhIngan Hol', qu: 'Elvish', goa: "Goa'uld" };
const CHEVRON = `<svg class="hlang-chevron" viewBox="0 0 12 7" width="10" height="6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1L6 6L11 1"/></svg>`;

export function renderLangSwitcher() {
  const options = AVAILABLE_LANGS.map(lang => `
    <li class="hlang-option${locale.lang === lang ? ' hlang-option--active' : ''}"
        data-hlang-option="${lang}" role="option" aria-selected="${locale.lang === lang}">
      <span class="hlang-name">${LANG_NAMES[lang]}</span>
      <span class="hlang-code">${LANG_LABELS[lang]}</span>
    </li>`).join('');

  return `<div class="hlang-select" id="hlang-select">
    <button class="hlang-trigger" id="hlang-trigger" type="button" aria-haspopup="listbox">
      <span class="hlang-current">${LANG_LABELS[locale.lang]}</span>
      ${CHEVRON}
    </button>
    <ul class="hlang-options" id="hlang-options" role="listbox">${options}</ul>
  </div>`;
}
