CV.initHireModal("hire-plain");

window.showToast = function(message) {
  var container = document.getElementById("cv-toaster-container");
  if (!container) return;
  var toast = document.createElement("div");
  toast.className = "cv-toast";
  toast.innerHTML = '<span>' + message + '</span><button class="cv-toast-close" aria-label="Close">×</button>';

  var closeBtn = toast.querySelector(".cv-toast-close");

  function removeToast() {
    toast.classList.add("hiding");
    setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
  }

  closeBtn.addEventListener("click", removeToast);
  setTimeout(removeToast, 3000);

  container.appendChild(toast);
};

(function () {
  var btn = document.getElementById("theme-toggle");
  var overlay = null;
  var isTouch = window.matchMedia("(pointer: coarse)").matches;
  var states = isTouch ? ["light", "dark"] : ["light", "dark", "superdark", "nightvision", "predator"];
  var icons = isTouch
    ? ["assets/images/sun.webp", "assets/images/moon.webp"]
    : ["assets/images/sun.webp", "assets/images/moon.webp", "assets/images/flashlight.webp", "assets/images/nightvision.webp", "assets/images/predator.webp"];
  var savedTheme = localStorage.getItem("cv-swagger-theme");
  var current = (savedTheme && states.indexOf(savedTheme) !== -1) ? savedTheme : CV.getSystemTheme();
  if (states.indexOf(current) === -1) current = "light";

  var CURSOR_KEY = "cv-superdark-cursor";
  var wordsWrapped = false;

  function updateOverlay(x, y) {
    if (!overlay) return;
    overlay.style.background = "radial-gradient(circle 250px at " + x + "px " + y + "px, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 12%, transparent 25%, transparent 52%, rgba(0,0,0,0.15) 65%, rgba(0,0,0,0.5) 78%, rgba(0,0,0,0.8) 88%, rgba(0,0,0,0.9) 94%, rgba(0,0,0,0.92) 100%)";
  }

  function onMouseMove(e) {
    var x = e.clientX, y = e.clientY;
    updateOverlay(x, y);
    localStorage.setItem(CURSOR_KEY, x + "," + y);
  }

  function wrapWords(element) {
    if (element.nodeType === Node.TEXT_NODE) {
      if (!element.textContent.trim()) return;
      const words = element.textContent.split(/(\s+)/);
      const fragments = document.createDocumentFragment();
      words.forEach(word => {
        if (word.trim()) {
          const span = document.createElement('span');
          span.className = 'nv-word';
          span.textContent = word;
          // Use CSS variable so it only affects Night Vision
          span.style.setProperty('--nv-fs', (0.96 + Math.random() * 0.09).toFixed(3) + 'em');
          // Radical green color variation
          var g = Math.floor(160 + Math.random() * 95);
          var r = Math.floor(20 + Math.random() * 100);
          span.style.setProperty('--nv-c', 'rgb(' + r + ',' + g + ',' + r + ')');
          fragments.appendChild(span);
        } else {
          fragments.appendChild(document.createTextNode(word));
        }
      });
      element.replaceWith(fragments);
    } else if (element.nodeType === Node.ELEMENT_NODE &&
               element.tagName !== 'SCRIPT' &&
               element.tagName !== 'STYLE' &&
               element.tagName !== 'SVG' &&
               !element.classList.contains('blockTitle')) {
      const children = Array.from(element.childNodes);
      children.forEach(child => wrapWords(child));
    }
  }

  function apply(state) {
    document.documentElement.setAttribute("data-theme", state);
    localStorage.setItem("cv-swagger-theme", state);
    current = state;

    var icon = icons[states.indexOf(state)];
    if (icon.endsWith(".webp")) {
      btn.innerHTML = '<img src="' + icon + '" class="theme-icon-img" alt="theme icon">';
    } else {
      btn.textContent = icon;
    }

    if (state === "superdark") {
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9998";
        document.body.appendChild(overlay);
      }
      overlay.style.display = "";
      document.documentElement.style.cursor = "none";
      var saved = localStorage.getItem(CURSOR_KEY);
      if (saved) {
        var parts = saved.split(",");
        updateOverlay(parseInt(parts[0]), parseInt(parts[1]));
      }
      document.addEventListener("mousemove", onMouseMove);
    } else {
      document.documentElement.style.cursor = "";
      if (overlay) overlay.style.display = "none";
      document.removeEventListener("mousemove", onMouseMove);
    }

    if (state === "nightvision" && !wordsWrapped) {
      wrapWords(document.querySelector('.cvLayout.base.cv'));
      wordsWrapped = true;
    }
  }

  btn.addEventListener("click", function () {
    var idx = states.indexOf(current);
    var nextState = states[(idx + 1) % states.length];
    apply(nextState);
    if (window.showToast) window.showToast("Theme changed to " + nextState);
  });

  apply(current);
})();

(function () {
  var decors = ["decor1.svg", "decor2.svg", "decor3.svg", "decor4.svg", "decor5.svg", "decor6.svg"];
  var items = document.querySelectorAll(".workExperienceItem");
  if (items.length > 0) items[items.length - 1].classList.add("no-decor");
  for (var t = 0; t < items.length; t++) {
    var title = items[t].querySelector(".itemTitle")?.textContent.trim();
    if (title === "Deutsche Telekom IT Solutions HU" || title === "CobotX Technologies") {
      items[t].classList.add("no-decor");
    }
  }

  for (var i = decors.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = decors[i]; decors[i] = decors[j]; decors[j] = tmp;
  }

  for (var k = 0; k < items.length - 1; k++) {
    var img = document.createElement("img");
    img.src = "./assets/images/" + decors[k % decors.length];
    img.alt = "";
    img.className = "work-decor";
    img.style.cssText = "display:block;width:400px;max-width:80%;height:30px;object-fit:contain;margin:3mm auto 3mm";
    items[k].parentNode.insertBefore(img, items[k].nextSibling);
  }
})();

CV.initFormspree("#hire-plain-form");

(function () {
  var audio = document.getElementById("music-audio");
  var toggleBtn = document.getElementById("music-toggle");
  var panel = document.getElementById("music-panel");
  var playPauseBtn = document.getElementById("music-playpause");

  var customSelect = document.getElementById("custom-genre-select");
  if (!customSelect) return; // safeguard if HTML is not updated
  var trigger = customSelect.querySelector(".custom-select-trigger");
  var triggerText = trigger.querySelector("span");
  var options = customSelect.querySelectorAll(".custom-option");
  var lyricsBtn = document.getElementById("music-lyrics");
  var lyricsModal = document.getElementById("lyrics-modal");
  var lyricsClose = document.getElementById("lyrics-close");
  var lyricsBackdrop = document.getElementById("lyrics-backdrop");

  var isOpen = false;
  var isPlaying = false;
  var savedGenre = localStorage.getItem("cv-music-genre");
  var currentValue = options[0].getAttribute("data-value"); // default
  var currentLabel = options[0].textContent;

  if (savedGenre) {
    for (var i = 0; i < options.length; i++) {
      if (options[i].getAttribute("data-value") === savedGenre) {
        currentValue = savedGenre;
        currentLabel = options[i].textContent;
        break;
      }
    }
  }
  triggerText.textContent = currentLabel;

  function loadTrack() {
    if (!audio.src || !audio.src.endsWith(currentValue)) {
      audio.src = currentValue;
      audio.load();
    }
  }

  function updatePlayPause() {
    playPauseBtn.textContent = isPlaying ? "⏸" : "▶";
    if (isPlaying) {
      toggleBtn.classList.add("playing");
    } else {
      toggleBtn.classList.remove("playing");
    }
  }

  function openPanel() {
    isOpen = true;
    panel.classList.remove("music-panel-hidden");
    toggleBtn.classList.add("active");
    loadTrack();
  }

  function closePanel() {
    isOpen = false;
    panel.classList.add("music-panel-hidden");
    toggleBtn.classList.remove("active");
    customSelect.classList.remove("open");
  }

  toggleBtn.addEventListener("click", function () {
    if (isOpen) closePanel();
    else openPanel();
  });

  // Custom select logic
  trigger.addEventListener("click", function() {
    customSelect.classList.toggle("open");
  });

  for (var j = 0; j < options.length; j++) {
    options[j].addEventListener("click", function(e) {
      currentValue = e.target.getAttribute("data-value");
      currentLabel = e.target.textContent;
      triggerText.textContent = currentLabel;
      customSelect.classList.remove("open");

      localStorage.setItem("cv-music-genre", currentValue);
      var wasPlaying = isPlaying;
      audio.pause();
      isPlaying = false;
      loadTrack();
      var cleanLabel = currentLabel.replace(/^[^\w\s]*\s*/,'').trim();
      if (window.showToast) window.showToast("Music changed to " + cleanLabel);
      if (wasPlaying) {
        audio.play().then(function () { isPlaying = true; updatePlayPause(); }).catch(function(){});
      }
      updatePlayPause();
    });
  }

  // Close custom select if clicked outside
  document.addEventListener("click", function(e) {
    if (!customSelect.contains(e.target)) {
      customSelect.classList.remove("open");
    }
  });

  playPauseBtn.addEventListener("click", function () {
    var cleanLabel = currentLabel.replace(/^[^\w\s]*\s*/,'').trim();
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      if (window.showToast) window.showToast(cleanLabel + " music paused");
    } else {
      loadTrack();
      audio
        .play()
        .then(function () {
          isPlaying = true;
          updatePlayPause();
          if (window.showToast) window.showToast(cleanLabel + " music playing");
        })
        .catch(function () {});
    }
    updatePlayPause();
  });

  audio.addEventListener("ended", function () {
    isPlaying = false;
    updatePlayPause();
  });

  function openLyrics() {
    if (!lyricsModal) return;
    lyricsModal.classList.remove("cv-modal-hidden");
  }

  function closeLyrics() {
    if (!lyricsModal) return;
    lyricsModal.classList.add("cv-modal-hidden");
  }

  if (lyricsBtn) lyricsBtn.addEventListener("click", openLyrics);
  if (lyricsClose) lyricsClose.addEventListener("click", closeLyrics);
  if (lyricsBackdrop) lyricsBackdrop.addEventListener("click", closeLyrics);

  document.addEventListener("keydown", function (e) {
    if (
      e.key === "Escape" &&
      lyricsModal &&
      !lyricsModal.classList.contains("cv-modal-hidden")
    ) {
      closeLyrics();
    }
  });

  updatePlayPause();
})();

(function() {
  // First time after 1 minute (60,000 ms)
  setTimeout(function() {
    if (window.showToast) window.showToast("Hurry! Somebody almost hired Viktor.");

    function scheduleNextHurry() {
      // Randomly between 3 and 5 minutes
      var minMs = 3 * 60 * 1000;
      var maxMs = 5 * 60 * 1000;
      var nextDelay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;

      setTimeout(function() {
        if (window.showToast) window.showToast("Hurry! Somebody almost hired Viktor.");
        scheduleNextHurry();
      }, nextDelay);
    }

    scheduleNextHurry();
  }, 60 * 1000);
})();
