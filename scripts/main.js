import { locale } from './locale.js';
import { createLangDropdown } from './components/lang-dropdown.js';

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = locale.t(el.dataset.i18n);
  });
  document.documentElement.lang = locale.lang;
}

const controls = document.querySelector('.top-right-controls');
if (controls) {
  createLangDropdown(controls, {
    onChange(lang) { locale.setLang(lang); applyTranslations(); window.dispatchEvent(new CustomEvent('localechange')); }
  });
}

applyTranslations();
