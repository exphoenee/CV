import { locale } from './locale.js';
import { createLangDropdown } from './components/lang-dropdown.js';

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = locale.t(el.dataset.i18n);
  });
  document.documentElement.lang = locale.lang;
}

const controls = document.createElement('div');
controls.className = 'top-right-controls';

createLangDropdown(controls, {
  onChange(lang) { locale.setLang(lang); applyTranslations(); window.dispatchEvent(new CustomEvent('localechange')); }
});

const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) controls.appendChild(themeToggle);
document.body.appendChild(controls);

applyTranslations();
