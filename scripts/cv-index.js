import { initHireModal, initThemeToggle, initFormspree, hireModalHTML } from './shared.js';

document.body.insertAdjacentHTML('beforeend', hireModalHTML('hire-index', {
  subject: 'Hire inquiry from index',
  simple: true,
  p1Class: 'fs-success-title',
  p2Class: 'fs-success-msg',
  errClass: 'fs-error-msg'
}));

initHireModal('hire-index');

initThemeToggle({
  onSet: function (theme, btn) {
    btn.textContent = theme === 'light' ? '\u{1F319}' : '\u2600\uFE0F';
  }
});

initFormspree('#hire-index-form');
