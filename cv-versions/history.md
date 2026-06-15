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
