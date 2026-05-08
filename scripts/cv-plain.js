CV.initHireModal("hire-plain");

(function () {
  var btn = document.getElementById("theme-toggle");
  var overlay = null;
  var states = ["light", "dark", "superdark"];
  var icons = ["\u2600\uFE0F", "\u{1F319}", "\u{1F526}"];
  var current = localStorage.getItem("cv-swagger-theme") || "light";
  var CURSOR_KEY = "cv-superdark-cursor";

  function updateOverlay(x, y) {
    if (!overlay) return;
    overlay.style.background = "radial-gradient(circle 250px at " + x + "px " + y + "px, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 12%, transparent 25%, transparent 52%, rgba(0,0,0,0.15) 65%, rgba(0,0,0,0.5) 78%, rgba(0,0,0,0.8) 88%, rgba(0,0,0,0.9) 94%, rgba(0,0,0,0.92) 100%)";
  }

  function onMouseMove(e) {
    var x = e.clientX, y = e.clientY;
    updateOverlay(x, y);
    localStorage.setItem(CURSOR_KEY, x + "," + y);
  }

  function apply(state) {
    document.documentElement.setAttribute("data-theme", state);
    localStorage.setItem("cv-swagger-theme", state);
    current = state;
    btn.textContent = icons[states.indexOf(state)];

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
  }

  btn.addEventListener("click", function () {
    var idx = states.indexOf(current);
    apply(states[(idx + 1) % states.length]);
  });

  apply(current);
})();

CV.initFormspree("#hire-plain-form");
