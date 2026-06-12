import { initHireModal, initThemeToggle, initFormspree, hireModalHTML, musicPlayerHTML, bookingModalHTML, initBookingModal } from './shared.js';
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

document.body.insertAdjacentHTML('beforeend', bookingModalHTML('index'));
initBookingModal('index');

initThemeToggle({
  onSet: function (theme, btn) {
    btn.textContent = theme === 'light' ? '\u{1F319}' : '\u2600\uFE0F';
  }
});

initFormspree('#hire-index-form');
initMusicPlayer();

// Carousel
(function () {
  var stage = document.getElementById('cv-carousel-stage');
  if (!stage) return;

  var slides = Array.from(stage.querySelectorAll('.cv-slide'));
  var dotsWrap = document.getElementById('cv-carousel-dots');
  var N = slides.length;
  var current = 0;

  var dots = slides.map(function (_, i) {
    var d = document.createElement('button');
    d.className = 'cv-carousel-dot';
    d.setAttribute('aria-label', 'Slide ' + (i + 1));
    d.addEventListener('click', function () { goTo(i); });
    dotsWrap.appendChild(d);
    return d;
  });

  function mod(n, m) { return ((n % m) + m) % m; }

  function goTo(idx) {
    current = mod(idx, N);
    var prev = mod(current - 1, N);
    var next = mod(current + 1, N);
    slides.forEach(function (slide, i) {
      var stepsAhead = mod(i - current, N);
      if (i === current)    slide.dataset.state = 'active';
      else if (i === prev)  slide.dataset.state = 'prev';
      else if (i === next)  slide.dataset.state = 'next';
      else                  slide.dataset.state = stepsAhead <= Math.floor(N / 2) ? 'hidden-next' : 'hidden-prev';
    });
    dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
  }

  document.getElementById('cv-carousel-next').addEventListener('click', function () { goTo(current + 1); });
  document.getElementById('cv-carousel-prev').addEventListener('click', function () { goTo(current - 1); });

  // Click side cards to advance
  stage.addEventListener('click', function (e) {
    var slide = e.target.closest('.cv-slide');
    if (!slide) return;
    var state = slide.dataset.state;
    if (state === 'prev') { e.preventDefault(); goTo(current - 1); }
    else if (state === 'next') { e.preventDefault(); goTo(current + 1); }
  });

  // Touch / mouse drag
  var startX = 0;
  var startY = 0;
  var dragging = false;

  stage.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  stage.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - startX;
    var dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) < 30 || Math.abs(dy) > Math.abs(dx) * 0.9) return;
    if (dx < 0) goTo(current + 1);
    else goTo(current - 1);
  }, { passive: true });

  stage.addEventListener('mousedown', function (e) { startX = e.clientX; dragging = true; });
  stage.addEventListener('mouseup', function (e) {
    if (!dragging) return;
    dragging = false;
    var dx = e.clientX - startX;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) goTo(current + 1);
    else goTo(current - 1);
  });
  stage.addEventListener('mouseleave', function () { dragging = false; });

  goTo(0);
}());
