import { locale, AVAILABLE_LANGS } from '../locale.js';

export const LANG_LABELS = { en: 'EN', hu: 'HU', de: 'DE', fr: 'FR', es: 'ES', it: 'IT', dot: 'DOT', kl: 'KL', qu: 'QU', goa: 'GOA', asg: 'ASG', ya: 'YA' };
export const LANG_NAMES  = { en: 'English', hu: 'Magyar', de: 'Deutsch', fr: 'Français', es: 'Español', it: 'Italiano', dot: 'Dothraki', kl: 'tlhIngan Hol', qu: 'Elvish', goa: "Goa'uld", asg: 'Forn Norræna', ya: 'Yautja' };

const CHEVRON = `<svg class="ld-chevron" viewBox="0 0 12 7" width="10" height="6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1L6 6L11 1"/></svg>`;


export function langDropdownHTML({ fullWidth = false } = {}) {
  const lang = locale.lang;
  const trigger = fullWidth
    ? `<span class="ld-current"><span class="ld-name">${LANG_NAMES[lang]}</span><span class="ld-code">${LANG_LABELS[lang]}</span></span>`
    : `<span class="ld-current-code">${LANG_LABELS[lang]}</span>`;

  const options = AVAILABLE_LANGS.map(l => `
    <li class="ld-option${l === lang ? ' ld-option--active' : ''}"
        data-ld-lang="${l}" role="option" aria-selected="${l === lang}">
      <span class="ld-name">${LANG_NAMES[l]}</span>
      <span class="ld-code">${LANG_LABELS[l]}</span>
    </li>`).join('');

  return `<div class="ld-select${fullWidth ? ' ld-select--full' : ''}">
    <button class="ld-trigger" type="button" aria-haspopup="listbox">
      ${trigger}${CHEVRON}
    </button>
    <ul class="ld-options" role="listbox">${options}</ul>
  </div>`;
}

export function initLangDropdown(el, { onChange } = {}) {
  const fullWidth = el.classList.contains('ld-select--full');
  const optionsEl = el.querySelector('.ld-options');
  const triggerEl = el.querySelector('.ld-trigger');

  function positionOptions() {
    const rect = el.getBoundingClientRect();
    optionsEl.classList.toggle('ld-options--up', rect.top > window.innerHeight / 2);
    if (!fullWidth) {
      optionsEl.classList.toggle('ld-options--right', rect.left > window.innerWidth / 2);
    }
  }

  function close() {
    triggerEl?.classList.remove('open');
    optionsEl?.classList.remove('open');
  }

  function updateDisplay(lang) {
    if (fullWidth) {
      const name = el.querySelector('.ld-current .ld-name');
      const code = el.querySelector('.ld-current .ld-code');
      if (name) name.textContent = LANG_NAMES[lang];
      if (code) code.textContent = LANG_LABELS[lang];
    } else {
      const cur = el.querySelector('.ld-current-code');
      if (cur) cur.textContent = LANG_LABELS[lang];
    }
    el.querySelectorAll('.ld-option').forEach(opt => {
      const active = opt.dataset.ldLang === lang;
      opt.classList.toggle('ld-option--active', active);
      opt.setAttribute('aria-selected', active);
    });
  }

  el.addEventListener('click', (e) => {
    if (e.target.closest('.ld-trigger')) {
      const isOpen = triggerEl.classList.contains('open');
      if (!isOpen) positionOptions();
      triggerEl.classList.toggle('open', !isOpen);
      optionsEl?.classList.toggle('open', !isOpen);
      if (!isOpen) {
        const away = (ev) => {
          if (!el.contains(ev.target)) { close(); document.removeEventListener('click', away); }
        };
        document.addEventListener('click', away);
      }
      return;
    }
    const opt = e.target.closest('[data-ld-lang]');
    if (opt) {
      const lang = opt.dataset.ldLang;
      close();
      onChange?.(lang);
      updateDisplay(lang);
    }
  });
}

export function createLangDropdown(container, { onChange, fullWidth = false } = {}) {
  const tmp = document.createElement('div');
  tmp.innerHTML = langDropdownHTML({ fullWidth });
  const el = tmp.firstElementChild;
  container.appendChild(el);
  initLangDropdown(el, { onChange });
  return { destroy() { el.remove(); } };
}
