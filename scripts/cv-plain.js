CV.initHireModal("hire-plain");

(function () {
  var btn = document.getElementById("theme-toggle");
  var overlay = null;
  var isTouch = window.matchMedia("(pointer: coarse)").matches;
  var states = isTouch ? ["light", "dark"] : ["light", "dark", "superdark", "nightvision", "predator"];
  var icons = isTouch
    ? ["assets/sun.webp", "assets/moon.webp"]
    : ["assets/sun.webp", "assets/moon.webp", "assets/flashlight.webp", "assets/nightvision.webp", "assets/predator.webp"];
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
    apply(states[(idx + 1) % states.length]);
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
    img.src = "./assets/" + decors[k % decors.length];
    img.alt = "";
    img.className = "work-decor";
    img.style.cssText = "display:block;width:400px;max-width:80%;height:30px;object-fit:contain;margin:3mm auto 3mm";
    items[k].parentNode.insertBefore(img, items[k].nextSibling);
  }
})();

CV.initFormspree("#hire-plain-form");
