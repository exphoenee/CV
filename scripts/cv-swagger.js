import { CV_DATA } from './cv-data.js';
import { renderSwaggerContent } from './components/swagger/index.js';
import { initHireModal, initThemeToggle, initFormspree, musicPlayerHTML, hireModalHTML, bookingModalHTML, initBookingModal } from './shared.js';
import { initMusicPlayer } from './cv-music-player.js';
import { svgArrowUp, svgArrowDown } from './components/swagger/ui/icons.js';
import { THEME_DARK, THEME_LIGHT } from './config.js';

document.body.insertAdjacentHTML('beforeend', musicPlayerHTML());

var swaggerEl = document.getElementById('swagger-ui');
if (swaggerEl) {
  swaggerEl.innerHTML = renderSwaggerContent(CV_DATA);
}

document.querySelectorAll('.opblock-tag-section').forEach(function (section) {
  var tagHeader = section.querySelector('.opblock-tag');
  if (!tagHeader) return;

  tagHeader.addEventListener('click', function (e) {
    e.stopPropagation();
    section.classList.toggle('is-open');
    var arrow = section.querySelector('.expand-operation');
    if (arrow) {
      arrow.innerHTML = section.classList.contains('is-open')
        ? svgArrowDown
        : svgArrowUp;
    }
  });
});

function toggleOpblock(opblock) {
  opblock.classList.toggle('is-open');
  var arrow = opblock.querySelector('.opblock-control-arrow');
  if (arrow) {
    arrow.innerHTML = opblock.classList.contains('is-open') ? svgArrowDown : svgArrowUp;
  }
}

document.querySelectorAll('.opblock-summary-control, .opblock-control-arrow').forEach(function (ctrl) {
  ctrl.addEventListener('click', function () {
    var opblock = ctrl.closest('.opblock');
    if (opblock) toggleOpblock(opblock);
  });
});

var themeBtn = document.getElementById('theme-toggle');
if (themeBtn) {
  initThemeToggle({ validThemes: [THEME_DARK, THEME_LIGHT] });
}

document.body.insertAdjacentHTML('beforeend', bookingModalHTML('swagger'));
var bookingModal = initBookingModal('swagger');

document.getElementById('meet-swagger-btn')?.addEventListener('click', function () {
  bookingModal.openModal();
});

if (!document.getElementById('hire-modal')) {
  document.body.insertAdjacentHTML('beforeend', hireModalHTML('hire', {
    dynamicSubject: true
  }));
}

var modalEl = document.getElementById('hire-modal');
var hireBtn = document.getElementById('hire-btn');
if (hireBtn && modalEl) {
  var hireModal = initHireModal('hire');
  initFormspree('#hire-form');

  document.addEventListener('click', function (e) {
    if (e.target.closest('.hire-trigger')) {
      var opblock = e.target.closest('.opblock');
      var subject = opblock ? opblock.id.replace('operations-', '').replace(/-/g, ' ') : '';
      hireModal.openModal(subject ? 'Hire inquiry — ' + subject : undefined);
    }
  });
}

window.showToast = function (msg) {
  var container = document.getElementById('cv-toaster-container');
  if (!container) return;
  var toast = document.createElement('div');
  toast.className = 'cv-toast';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(function () {
    toast.classList.add('cv-toast-fade');
    setTimeout(function () { toast.remove(); }, 400);
  }, 3000);
};

initMusicPlayer();
