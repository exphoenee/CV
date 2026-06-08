import { initHireModal, initThemeToggle, initFormspree, hireModalHTML, musicPlayerHTML } from './shared.js';
import { initMusicPlayer } from './cv-music-player.js';

document.body.insertAdjacentHTML('beforeend', musicPlayerHTML());

window.showToast = function (message) {
  var container = document.getElementById('cv-toaster-container');
  if (!container) return;
  var toast = document.createElement('div');
  toast.className = 'cv-toast';
  toast.innerHTML = '<span>' + message + '</span><button class="cv-toast-close" aria-label="Close">×</button>';
  var closeBtn = toast.querySelector('.cv-toast-close');
  function removeToast() {
    toast.classList.add('hiding');
    setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
  }
  closeBtn.addEventListener('click', removeToast);
  setTimeout(removeToast, 3000);
  container.appendChild(toast);
};

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
initMusicPlayer();
