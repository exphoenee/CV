const fs = require("fs");
function g(f){ const m = fs.readFileSync(f,"utf8").match(/summary:\s*("(?:[^"\\]|\\.)*")/); return m ? JSON.parse(m[1]) : null; }
const EN = g("scripts/cv-data.js").length;
const cur = g("scripts/locales/fr.js").length;
const cand = "Frontend Tech Lead avec plus de 5 ans d'expérience en frontend et full-stack, spécialisé dans l'architecture frontend, la conception de systèmes et la modernisation à grande échelle de systèmes legacy avec TypeScript, Svelte, React et Node.js. J'ai dirigé des réécritures complètes et des migrations de systèmes d'entreprise vers des stacks modernes, améliorant la maintenabilité et la scalabilité des plateformes. J'ai introduit des workflows assistés par IA et construit des pipelines CI avec des quality gates automatisés. Je dirige et encadre des ingénieurs, en mettant l'accent sur le refactoring basé sur les preuves et des fondations frontend durables à l'échelle du système.";
console.log("EN limit:", EN);
console.log("fr current:", cur, cur > EN ? "OVER +" + (cur-EN) : "ok");
console.log("fr candidate:", cand.length, cand.length <= EN ? "ok (-" + (EN-cand.length) + ")" : "STILL OVER +" + (cand.length-EN));
