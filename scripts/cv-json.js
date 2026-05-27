const L = CV.renderJsonCV(CV_DATA);

const G = document.getElementById("G");
const C = document.getElementById("C");
const lnEl = document.getElementById("ln");

// Compute fold regions: openIdx -> closeIdx
function computeFolds() {
  const folds = {};
  const stack = [];
  L.forEach(([depth, html], idx) => {
    const text = html.replace(/<[^>]*>/g, "").trim();
    if (!text) return;
    const firstChar = text[0];
    const lastMeaningful = text.replace(/[,\s]+$/, "").slice(-1);
    if (firstChar === "}" || firstChar === "]") {
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].depth === depth) {
          folds[stack[i].idx] = idx;
          stack.splice(i, 1);
          break;
        }
      }
    }
    if (lastMeaningful === "{" || lastMeaningful === "[") {
      stack.push({ idx, depth });
    }
  });
  return folds;
}

const FOLDS = computeFolds();
const foldState = {};
Object.keys(FOLDS).forEach((k) => (foldState[k] = "open"));

let gHTML = "";
let cHTML = "";

// For empty lines, infer guide depth from surrounding non-empty lines
function guideDepth(idx) {
  const [depth, content] = L[idx];
  if (content !== "") return depth;
  let prev = 0,
    next = 0;
  for (let i = idx - 1; i >= 0; i--) {
    if (L[i][1] !== "") {
      prev = L[i][0];
      break;
    }
  }
  for (let i = idx + 1; i < L.length; i++) {
    if (L[i][1] !== "") {
      next = L[i][0];
      break;
    }
  }
  return prev > 0 && next > 0 ? Math.min(prev, next) : Math.max(prev, next);
}

L.forEach(([depth, content], idx) => {
  const num = idx + 1;
  const gd = guideDepth(idx);
  let indents = "";
  for (let d = 0; d < gd; d++) indents += `<span class="i"></span>`;

  const isFoldable = FOLDS[idx] !== undefined;
  const foldBtn = isFoldable
    ? `<span class="fold-icon foldable" data-open="${idx}">▾</span>`
    : `<span class="fold-icon"></span>`;
  const foldHint = isFoldable ? `<span class="fold-hint" data-open="${idx}">…</span>` : "";

  gHTML += `<div data-n="${num}" data-gi="${idx}">${foldBtn}${num}</div>`;
  cHTML += `<div class="l" data-n="${num}" data-li="${idx}">${indents}<span class="t">${content}${foldHint}</span></div>`;
});

G.innerHTML = gHTML;
C.innerHTML = cHTML;

function syncGutterHeights() {
  const codeLines = C.querySelectorAll(".l");
  const gutterLines = G.querySelectorAll("div");
  codeLines.forEach((line, i) => {
    gutterLines[i].style.height = line.offsetHeight + "px";
  });
}

syncGutterHeights();
new ResizeObserver(syncGutterHeights).observe(C);

function toggleFold(openIdx) {
  const closeIdx = FOLDS[openIdx];
  const collapsing = foldState[openIdx] === "open";
  for (let i = openIdx + 1; i < closeIdx; i++) {
    const cl = C.querySelector(`[data-li="${i}"]`);
    const gl = G.querySelector(`[data-gi="${i}"]`);
    const d = collapsing ? "none" : "";
    if (cl) cl.style.display = d;
    if (gl) gl.style.display = d;
  }
  const icon = G.querySelector(`.fold-icon[data-open="${openIdx}"]`);
  const hint = C.querySelector(`.fold-hint[data-open="${openIdx}"]`);
  if (collapsing) {
    foldState[openIdx] = "closed";
    if (icon) {
      icon.textContent = "▸";
      icon.classList.add("collapsed");
    }
    if (hint) hint.style.display = "";
  } else {
    foldState[openIdx] = "open";
    if (icon) {
      icon.textContent = "▾";
      icon.classList.remove("collapsed");
    }
    if (hint) hint.style.display = "none";
  }
  syncGutterHeights();
}

G.addEventListener("click", (e) => {
  const btn = e.target.closest(".fold-icon.foldable");
  if (btn) toggleFold(parseInt(btn.dataset.open));
});

C.addEventListener("click", (e) => {
  const hint = e.target.closest(".fold-hint");
  if (hint) toggleFold(parseInt(hint.dataset.open));
});

// sync line hover between gutter and code
C.addEventListener("mousemove", (e) => {
  const row = e.target.closest(".l");
  if (row) lnEl.textContent = row.dataset.n;
});

// Inject hire modal HTML if not already present (fallback for auto-injection)
try {
  if (!document.getElementById("hire-json-modal") && typeof CV.hireModalHTML === "function") {
    document.body.insertAdjacentHTML('beforeend', CV.hireModalHTML("hire-json", {
      subject: "Hire inquiry from CV - json",
      p1Class: "cv-json-inline-5",
      p2Class: "cv-json-inline-6",
      errClass: "cv-json-inline-8"
    }));
  }

  // Init hire modal and formspree with null-checks
  var hireBtn = document.getElementById("hire-json-btn");
  var hireClose = document.getElementById("hire-json-close");
  var hireBackdrop = document.getElementById("hire-json-backdrop");
  var hireForm = document.getElementById("hire-json-form");
  if (hireBtn && hireClose && hireBackdrop && hireForm && typeof CV.initHireModal === "function") {
    CV.initHireModal("hire-json");
    console.log("cv-json: hire modal initialized");
  } else {
    console.warn("cv-json: hire modal elements missing", { hireBtn: !!hireBtn, hireClose: !!hireClose, hireBackdrop: !!hireBackdrop, hireForm: !!hireForm, hasInitHireModal: typeof CV.initHireModal === "function" });
  }
  if (hireForm && typeof CV.initFormspree === "function") {
    CV.initFormspree("#hire-json-form");
    console.log("cv-json: formspree initialized");
  }
} catch (e) {
  console.error("cv-json: hire modal init error:", e.message, e.stack);
}
