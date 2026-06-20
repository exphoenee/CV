# CV előzmények (audit napló)

Append-only esemény-napló: minden CV-állapotot érintő művelet egy sor.
Formátum: `.claude/rules/version-snapshot-format.md`. Generálja: `.claude/scripts/cv-ledger.py`.

> Az első sor **visszamenőleg** lett rögzítve (backfill) a már létező
> `cv-versions/` mappák alapján. A `2026-06-13_manual` valódi snapshot;

| Időpont | Kategória | Művelet | Aktor | CV-verzió (APP_ID) | Mi történt | Artefaktum |
|---|---|---|---|---|---|---|
| 2026-06-13 2150 | backup | cv-backup | cv-backup | 2026-06-13_2150_manual | Manual snapshot | cv-versions/2026-06-13_manual/ |
| 2026-06-15 1004 | backup | cv-backup | cv-backup | 2026-06-15_1004_manual | Manual snapshot | cv-versions/2026-06-15_manual/ |
| 2026-06-15 1016 | backup | job-apply | job-apply-orchestrator | 2026-06-15_1016_deutsche-telekom-it-solutions-hungary_senior-frontend-developer-german-speaking | summary + skill order + 4 Telekom bullets rephrased + 10 translations | cv-versions/2026-06-15_deutsche-telekom-it-solutions-hungary_senior-frontend-developer-german-speaking/ |
| 2026-06-15 1018 | mutation | job-apply | job-apply-orchestrator | 2026-06-15_1016_deutsche-telekom-it-solutions-hungary_senior-frontend-developer-german-speaking | summary + skill order + 4 Telekom bullets rephrased + 10 translations | cv-versions/2026-06-15_deutsche-telekom-it-solutions-hungary_senior-frontend-developer-german-speaking/ |
| 2026-06-15 2143 | mutation | job-apply | job-apply-orchestrator | 2026-06-15_2131_korber-hungaria-gepgyarto-kft_ai-engineer | summary reword + backend skill order + 3 bullet rephrases (AI/REST/CI) + 10 translations | cv-versions/2026-06-15_2131_korber-hungaria-gepgyarto-kft_ai-engineer/ |
| 2026-06-17 0655 | review | code-review | code-review | 2026-06-15_manual | 0 hiba · 0 figyelmeztetés — csak .claude/rules/ fordítások | — |
| 2026-06-17 0658 | review | hr-review | hr-review | 2026-06-15_manual | General · actionable: igen · 4 megállapítás | review/2026-06-17_0658_hr-review-general.md |
| 2026-06-19 2255 | mutation | job-apply | job-apply-orchestrator | 2026-06-19_2254_unknown_ai-specialist-sustainability | AI Specialist Sustainability @ unknown - CV optimized + 11 translations | cv-versions/2026-06-19_2254_unknown_ai-specialist-sustainability/ |
| 2026-06-19 2258 | review | hr-review | hr-review | 2026-06-19_2254_unknown_ai-specialist-sustainability | AI Specialist Sustainability · 58% összesített · actionable: igen | review/2026-06-19_2256_hr-review-ai-specialist-sustainability.md |
| 2026-06-20 1202 | mutation | job-apply | job-apply-orchestrator | 2026-06-20_1043_clickup_senior-frontend-engineer | summary + 2 Aegex bullets + 1 Telekom bullet + 11 translations | cv-versions/2026-06-20_1043_clickup_senior-frontend-engineer/ |
