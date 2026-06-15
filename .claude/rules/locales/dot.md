# Dothraki (dot) — Style Consistency Rules

Covers `scripts/locales/dot.js`. Dothraki is a constructed fictional language (Game of Thrones).
Inspired by real Dothraki but adapted for a CV context — consistency over linguistic accuracy.

---

## Core Character

- **Warrior culture, direct, short, action-oriented.** No pleasantries. No subordinate clauses.
- Sentences are short and declarative. Questions use `hash`.
- Pride and confidence in everything. A Khal does not ask — he states.

## Pronouns and Verb Markers

| Concept            | Dothraki form                                   | Notes                                     |
| ------------------ | ----------------------------------------------- | ----------------------------------------- |
| I                  | `anha`                                          | "Anha tih CV" = I see the CV              |
| You                | `yer`                                           | "Hash yer dothrae chek?" = Are you well?  |
| He/She             | `me`                                            |                                           |
| Verb: ride/work/do | `dothrak`                                       | "Anha dothrak Frantend" = I work Frontend |
| Verb: see/look     | `tih`                                           |                                           |
| Verb: hire/take    | `aqqisi`                                        | "Aqqisi anni!" = Hire me!                 |
| Verb: send         | `ngeH` (borrowed from Klingon-style) / `chiori` |                                           |

## Core Vocabulary

| English concept   | Dothraki              | Notes                            |
| ----------------- | --------------------- | -------------------------------- |
| I / me            | `anha` / `anni`       | "anni" is object form            |
| CV / document     | `arakh anni`          | lit. "my blade/record"           |
| Frontend          | `Frantend`            | transliterated, no native term   |
| Backend           | `Bakhend`             | transliterated                   |
| Developer         | `dothrak [tech]`      | "one who rides [tech]"           |
| Leader / Khan     | `khal`                | "Khal Frantend" = Frontend Lead  |
| Work / Experience | `dothralat ma nakhoe` | lit. "riding with kills/results" |
| Education         | `asavva anni`         | lit. "my learning/lore"          |
| Language          | `lekia`               |                                  |
| Open              | `tih fichat`          | lit. "look at this"              |
| Hire              | `aqqisi`              |                                  |
| Send              | `chiori` / `ngeH`     |                                  |
| Close             | `loka`                | borrowed                         |
| Community         | `khal ma asavvakkar`  | lit. "leader and teachers"       |
| Message           | `alegra`              | lit. "word/news"                 |
| Meeting           | `timuvak`             | lit. "gathering"                 |
| Many / lots       | `san`                 |                                  |

## Style Rules

- Sentences end without softening: "Aqqisi anni!" not "Please hire me"
- Transliterated tech terms acceptable: `Frantend`, `Bakhend`, `Gantt`, `Kanban`, `JSON`
- No definite/indefinite articles — Dothraki has none
- Questions always start with `hash`: "Hash yer dothrae chek?"
- Possessives: noun + `anni` (my): "arakh anni" (my record), "chiori anni" (my message)
- Exclamation marks used freely — Dothraki is emphatic

## Consistency Checks

- `anha` always the subject pronoun — never `me` or `anni` as subject
- `aqqisi anni` for "hire me" — matches existing `"Aqqisi anni!"`
- `dothralat ma nakhoe` for Work Experience section — do not use alternatives
- `asavva anni` for Education — do not change
- Tech names: keep as Dothraki-accented transliterations (`Frantend`, `Bakhend`)
- `hash` only at start of interrogative sentences, never mid-sentence
