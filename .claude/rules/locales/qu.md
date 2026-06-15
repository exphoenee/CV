# Quenya (qu) — Style Consistency Rules

Covers `scripts/locales/qu.js`. Quenya is Tolkien's High Elvish language — poetic, flowing, ancient.
Not strict linguistic Quenya — style and feel matter. Mellifluous, vowel-rich, dignified.

---

## Core Character

- **Poetic, flowing, ancient, dignified.** Like starlight given language.
- Sentences have a musical quality — vowels dominate.
- Appropriate for a CV that values beauty as well as craft.

## Phonetic Character

- Vowel-rich: every syllable has a vowel, often ending in `-ë`, `-a`, `-o`, `-lë`
- Soft consonants preferred: `l`, `n`, `m`, `r`, `s`, `t`
- No harsh consonants (`k` appears softly as `c` in classical Quenya style)
- Diphthongs: `ai`, `au`, `ui`, `oi` — long vowels written with macron: `á`, `é`, `í`, `ó`, `ú`

## Pronouns and Verb Markers

| Concept         | Quenya form | Notes                 |
| --------------- | ----------- | --------------------- |
| I (subject)     | `ní`        | short form of `ninyë` |
| I (verb suffix) | `-nyë`      | "cárinyë" = I make    |
| You             | `lyë`       | formal                |
| He/She          | `sé` / `sí` |                       |
| Now / current   | `sí`        |                       |
| This            | `sina`      |                       |

## Core Vocabulary

| English concept       | Quenya              | Notes                                                |
| --------------------- | ------------------- | ---------------------------------------------------- |
| CV / record           | `Quenta i`          | "the tale of" — as used in existing labels           |
| Frontend              | `Yesta-Nárë`        | lit. "first-fire" / beginning light                  |
| Backend               | `Tárë-Nórë`         | lit. "high land / depth"                             |
| Developer / Craftsman | `ohtar`             | lit. "warrior/skilled one" — used in existing labels |
| Tech Lead             | `Noldo Yesta-Nárë`  | Noldo = deep elf / master of craft                   |
| Work experience       | `Quentar i cárëo`   | lit. "tales of the making"                           |
| Education             | `Istanyë`           | lit. "my knowing/lore"                               |
| Language              | `Lambë`             |                                                      |
| Programming language  | `Lambë tengwaron`   | lit. "language of letters"                           |
| View / look           | `cendalë`           |                                                      |
| Hire me               | `Hirë ní, hinya!`   | lit. "take me, my dear one!"                         |
| Send                  | `Centa!`            | imperative — "send/communicate!"                     |
| Close                 | `Tancë` / `Panta`   | to close/shut                                        |
| Open                  | `Anta cendalë`      | lit. "give a view"                                   |
| Meeting               | `Maquë`             | meeting/consultation                                 |
| Message               | `Centa`             | communication                                        |
| Community             | `Nossë ar Istamórë` | lit. "family and wisdom-sharers"                     |
| Greeting              | `Aiya`              | "Hail!"                                              |
| Farewell              | `Namárië`           | "Be well! / Goodbye!"                                |
| Now / current         | `sí`                |                                                      |
| Success / complete    | `Vanyarë` / `Lendë` |                                                      |

## Style Rules

- End greetings and success messages with `Namárië!` or `Aiya!`
- Genitive: suffix `-o` or `-wa`: `cárëo` = of the making, `yommëo` = of hobbies
- Do not use hard English words mid-phrase: keep Quenya purity within a phrase
- Tech proper names are exempt: `React`, `TypeScript`, `Svelte` stay as-is
- Diaeresis on `ë` at word endings: `Nossë`, `lambë`, `cárë` — do not omit
- Exclamations soft but enthusiastic: `"Hirë ní, hinya!"` — not aggressive

## Consistency Checks

- `Hirë ní, hinya!` for "hire me" — the established phrase
- `Quenta i:` for "CV of:" section header
- `Quentar i cárëo` for Work Experience
- `Istanyë` for Education
- `Lambë tengwaron` for Programming Languages
- `Nossë ar Istamórë` for Community & Mentorship
- `Centa!` for "send" (not `Maquë` which is the meeting concept)
- `Namárië!` as closing/success acknowledgment where fitting
- `sí` for "current" (not `sina` or `yá`)
- `ë` endings must retain the diaeresis — never write `Nosse` for `Nossë`
