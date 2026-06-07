import { locale, AVAILABLE_LANGS } from './locale.js';

const LANG_NAMES = {
  en: 'English', hu: 'Magyar', de: 'Deutsch', fr: 'Français',
  es: 'Español', it: 'Italiano', dot: 'Dothraki', kl: 'tlhIngan Hol',
  qu: 'Elvish', goa: "Goa'uld",
};

function buildSelect() {
  const select = document.createElement('select');
  select.id = 'lang-select';
  select.className = 'lang-dropdown';
  select.setAttribute('aria-label', 'Language');

  AVAILABLE_LANGS.forEach(lang => {
    const opt = document.createElement('option');
    opt.value = lang;
    opt.textContent = LANG_NAMES[lang] ?? lang.toUpperCase();
    if (lang === locale.lang) opt.selected = true;
    select.appendChild(opt);
  });

  select.addEventListener('change', () => {
    locale.setLang(select.value);
    applyTranslations();
  });

  return select;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = locale.t(el.dataset.i18n);
  });
  document.documentElement.lang = locale.lang;
  const sel = document.getElementById('lang-select');
  if (sel) sel.value = locale.lang;
}

// Group [☀️] and [lang select] into a single top-right flex row
const controls = document.createElement('div');
controls.className = 'top-right-controls';

const themeToggle = document.getElementById('theme-toggle');
controls.appendChild(buildSelect());
if (themeToggle) controls.appendChild(themeToggle);
document.body.appendChild(controls);

applyTranslations();
