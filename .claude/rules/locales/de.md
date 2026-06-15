# Deutsch — CV Sprachregeln

Gilt für `scripts/locales/de.js` UI-Labels und etwaige deutsche CV-Inhaltserweiterungen.

---

## Register und Ton

- **Professionell, sachlich, klar.** Kein Kanzleideutsch, kein Slang.
- Aktive Konstruktionen bevorzugen: „Ich entwickelte" statt „Es wurde entwickelt".
- Direkte erste Person: „Ich leitete", „Ich implementierte", „Ich entwarf".

## Zeitformen

| Kontext         | Zeitform             | Beispiel                                        |
| --------------- | -------------------- | ----------------------------------------------- |
| Aktueller Job   | Präsens              | „Ich leite ein 2-köpfiges Team"                 |
| Frühere Jobs    | Präteritum / Perfekt | „Ich entwickelte…", „Ich habe eingeführt…"      |
| Zusammenfassung | Präsens + Perfekt    | „Ich habe … geleitet. Ich fokussiere mich auf…" |

## Substantivierung

Im Deutschen werden Nomen großgeschrieben — auch englische Technikbegriffe, wenn als Nomen verwendet:

- „das React-Framework", „ein TypeScript-Projekt", „der CI-Pipeline"
- Zusammensetzungen: „Frontend-Architektur", „CI-Pipeline", „Monorepo-Migration"
- Nicht übermäßig substantivieren: „Ich leitete die Migration" statt „Die Durchführung der Migration lag in meiner Verantwortung"

## Technische Terminologie

- Technologienamen bleiben unverändert: `TypeScript`, `Node.js`, `Svelte`, `React`, `MySQL`, `SCSS`.
- Artikel nach Genus: „das Framework", „der Server", „die Bibliothek", „das Tool"
- Komposita mit Bindestrich: „Svelte-Komponente", „React-Projekt", „TypeScript-Typ"

## Häufige Fehler

- Falsche Kasusendungen bei englischen Lehnwörtern: „mit dem TypeScript" (korrekt), nicht „mit TypeScript's"
- Übersetze keine Eigennamen/Produkte: `Svelte` bleibt `Svelte`, nicht „Schlank"
- Vermeide Schachtelsätze — einfache Konstruktionen sind besser lesbar
- Passiv vermeiden in Bullet-Points: „wurde entwickelt" → „ich entwickelte"

## UI Labels (de.js)

- Buttons im Imperativ oder Infinitiv: „Absenden", „Schließen", „Meeting buchen", „Drucken"
- Fehlerhinweise sachlich: „Dieses Feld ist erforderlich." — keine Vorwürfe
- Placeholder-Texte: kulturell angepasst: `"Max Mustermann"`, `"ihre@email.de"`
- Großschreibung: Alle Nomen großschreiben, auch in Labels
- Sie-Form: Für Formularansprachen „Ihr Name", „Ihre E-Mail" (formelles Sie, Großschreibung)
- Sektionsüberschriften: Titelschreibung mit Großbuchstaben am Wortanfang
