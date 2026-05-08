CV.initHireModal("hire-index");

CV.initThemeToggle({
  onSet: function (theme, btn) {
    btn.textContent = theme === "light" ? "\u{1F319}" : "\u2600\uFE0F";
  }
});

CV.initFormspree("#hire-index-form");
