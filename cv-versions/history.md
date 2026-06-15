# CV előzmények (audit napló)

Append-only esemény-napló: minden CV-állapotot érintő művelet egy sor.
Formátum: `.claude/rules/version-snapshot-format.md`. Generálja: `.claude/scripts/cv-ledger.py`.

> Az első sor **visszamenőleg** lett rögzítve (backfill) a már létező
> `cv-versions/` mappák alapján. A `2026-06-13_manual` valódi snapshot;

| Időpont | Kategória | Művelet | Aktor | CV-verzió (APP_ID) | Mi történt | Artefaktum |
|---|---|---|---|---|---|---|
| 2026-06-13 2150 | backup | cv-backup | cv-backup | 2026-06-13_manual | Manual snapshot | cv-versions/2026-06-13_manual/ |
