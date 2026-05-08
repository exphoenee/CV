var STORAGE_KEY = "cv-collapse-state";

document.querySelectorAll(".expand-operation").forEach(function (btn) {
  btn.addEventListener("click", function () {
    var section = btn.closest(".opblock-tag-section");
    section.classList.toggle("is-open");
    if (section.id) CV.saveState(STORAGE_KEY, section.id, section.classList.contains("is-open"));
  });
});

document.querySelectorAll(".opblock-summary-control, .opblock-control-arrow").forEach(function (btn) {
  btn.addEventListener("click", function () {
    var opblock = btn.closest(".opblock");
    opblock.classList.toggle("is-open");
    if (opblock.id) CV.saveState(STORAGE_KEY, opblock.id, opblock.classList.contains("is-open"));
  });
});

CV.restoreCollapseStates(STORAGE_KEY);

// Swagger-specific: hire-trigger buttons on each endpoint
var swaggerModal = CV.initHireModal("hire");

document.querySelectorAll(".hire-trigger").forEach(function (btn) {
  btn.addEventListener("click", function () {
    var path = btn.closest(".opblock");
    var pathEl = path && path.querySelector(".opblock-summary-path span");
    var subject = pathEl ? "Hire inquiry - " + pathEl.textContent : "Hire inquiry from CV";
    swaggerModal.openModal(subject);
  });
});

CV.initThemeToggle();

CV.initFormspree("#hire-form");
