var CV = window.CV || {};

CV.initHireModal = function (prefix) {
  var modal = document.getElementById(prefix + "-modal");
  var subjectEl = document.getElementById(prefix + "-subject");

  function openModal(subject) {
    if (subjectEl && subject) subjectEl.value = subject;
    var form = document.getElementById(prefix + "-form");
    form.reset();
    form.style.display = "";
    var fsSuccess = document.querySelector("#" + prefix + "-modal [data-fs-success]");
    if (fsSuccess) fsSuccess.style.display = "none";
    var fsError = document.querySelector("#" + prefix + "-modal [data-fs-error]");
    if (fsError) fsError.style.display = "none";
    modal.style.display = "";
  }

  function closeModal() {
    modal.style.display = "none";
  }

  document.getElementById(prefix + "-btn").addEventListener("click", function () {
    openModal();
  });

  document.getElementById(prefix + "-close").addEventListener("click", closeModal);
  document.getElementById(prefix + "-backdrop").addEventListener("click", closeModal);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  document.getElementById(prefix + "-form").addEventListener("submit", closeModal);

  return { openModal: openModal, closeModal: closeModal };
};

CV.getSystemTheme = function () {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

CV.initThemeToggle = function (config) {
  config = config || {};
  var KEY = config.key || "cv-swagger-theme";
  var btn = document.getElementById(config.buttonId || "theme-toggle");

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(KEY, theme);
    if (config.onSet) config.onSet(theme, btn);
  }

  btn.addEventListener("click", function () {
    var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(next);
  });

  var saved = localStorage.getItem(KEY);
  if (saved) setTheme(saved);
  else setTheme(CV.getSystemTheme());
};

CV.saveState = function (key, id, value) {
  var state = JSON.parse(localStorage.getItem(key) || "{}");
  state[id] = value;
  localStorage.setItem(key, JSON.stringify(state));
};

CV.loadState = function (key, id, defaultValue) {
  var state = JSON.parse(localStorage.getItem(key) || "{}");
  if (state[id] === undefined) return defaultValue;
  return state[id];
};

CV.restoreCollapseStates = function (key) {
  var state = JSON.parse(localStorage.getItem(key) || "{}");
  Object.keys(state).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      if (state[id]) {
        el.classList.add("is-open");
      } else {
        el.classList.remove("is-open");
      }
    }
  });
};

CV.initFormspree = function (selector) {
  window.formspree = window.formspree || function () { (formspree.q = formspree.q || []).push(arguments); };
  formspree("initForm", { formElement: selector, formId: "mrejlned" });
};
