/* cv-swagger.js — Initialize Swagger CV UI */
(function () {
  "use strict";

  try {
    // ── 1. Render swagger content into #swagger-ui ──
    var swaggerEl = document.getElementById("swagger-ui");
    if (!swaggerEl) {
      console.warn("cv-swagger: #swagger-ui element not found");
      return;
    }

    if (typeof CV_DATA === "undefined") {
      console.warn("cv-swagger: CV_DATA not defined");
      return;
    }

    if (typeof CV.renderSwaggerContent !== "function") {
      console.warn("cv-swagger: CV.renderSwaggerContent not found");
      return;
    }

    var html = CV.renderSwaggerContent(CV_DATA);
    swaggerEl.innerHTML = html;
    console.log("cv-swagger: rendered", document.querySelectorAll(".opblock-tag-section").length, "sections");

    // ── 2. Collapse/expand for operation sections ──
    document.querySelectorAll(".opblock-tag-section").forEach(function (section) {
      var tagHeader = section.querySelector(".opblock-tag");
      if (!tagHeader) return;

      tagHeader.addEventListener("click", function (e) {
        e.stopPropagation();
        section.classList.toggle("is-open");
        var arrow = section.querySelector(".expand-operation");
        if (arrow) {
          arrow.innerHTML = section.classList.contains("is-open")
            ? CV._svgArrowDown
            : CV._svgArrowUp;
        }
      });
    });

    // ── 3. Expand/collapse for individual endpoints ──
    document.querySelectorAll(".opblock-summary-control").forEach(function (ctrl) {
      ctrl.addEventListener("click", function () {
        var opblock = ctrl.closest(".opblock");
        if (opblock) {
          opblock.classList.toggle("is-open");
          var arrow = opblock.querySelector(".opblock-control-arrow");
          if (arrow) {
            arrow.innerHTML = opblock.classList.contains("is-open")
              ? CV._svgArrowDown
              : CV._svgArrowUp;
          }
        }
      });
    });

    // ── 4. Theme toggle ──
    if (typeof CV.initThemeToggle === "function") {
      var themeBtn = document.getElementById("theme-toggle");
      if (themeBtn) {
        CV.initThemeToggle();
        console.log("cv-swagger: theme toggle initialized");
      }
    }

    // ── 5. Inject hire modal HTML if not present (dynamically rendered button) ──
    if (!document.getElementById("hire-modal") && typeof CV.hireModalHTML === "function") {
      document.body.insertAdjacentHTML('beforeend', CV.hireModalHTML("hire", {
        dynamicSubject: true
      }));
    }

    // ── 6. Hire modal — check all modal elements exist ──
    var modalEl = document.getElementById("hire-modal");
    var closeEl = document.getElementById("hire-close");
    var backdropEl = document.getElementById("hire-backdrop");
    var formEl = document.getElementById("hire-form");
    var hireBtn = document.getElementById("hire-btn");

    if (hireBtn && modalEl && closeEl && backdropEl && formEl) {
      if (typeof CV.initHireModal === "function") {
        CV.initHireModal("hire");
        console.log("cv-swagger: hire modal initialized");
      }
      if (typeof CV.initFormspree === "function") {
        CV.initFormspree("#hire-form");
        console.log("cv-swagger: formspree initialized");
      }
    } else {
      console.warn("cv-swagger: hire modal elements missing", { hireBtn: !!hireBtn, modalEl: !!modalEl, closeEl: !!closeEl, backdropEl: !!backdropEl, formEl: !!formEl, hasInitHireModal: typeof CV.initHireModal === "function", hasInitFormspree: typeof CV.initFormspree === "function" });
    }

    // ── 7. Toast notification helper ──
    if (typeof window.showToast !== "function") {
      window.showToast = function (msg) {
        var container = document.getElementById("cv-toaster-container");
        if (!container) return;
        var toast = document.createElement("div");
        toast.className = "cv-toast";
        toast.textContent = msg;
        container.appendChild(toast);
        setTimeout(function () {
          toast.classList.add("cv-toast-fade");
          setTimeout(function () { toast.remove(); }, 400);
        }, 3000);
      };
    }

    console.log("cv-swagger: init complete");
  } catch (e) {
    console.error("cv-swagger: init error:", e.message, e.stack);
  }
})();
