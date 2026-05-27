// Inject hire modal HTML if not already present (fallback for auto-injection)
if (!document.getElementById("hire-index-modal") && typeof CV.hireModalHTML === "function") {
  document.body.insertAdjacentHTML('beforeend', CV.hireModalHTML("hire-index", {
    subject: "Hire inquiry from index",
    simple: true,
    p1Class: "fs-success-title",
    p2Class: "fs-success-msg",
    errClass: "fs-error-msg"
  }));
}

CV.initHireModal("hire-index");

CV.initThemeToggle({
  onSet: function (theme, btn) {
    btn.textContent = theme === "light" ? "\u{1F319}" : "\u2600\uFE0F";
  }
});

CV.initFormspree("#hire-index-form");
