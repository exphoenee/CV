# English CV Language Rules

Covers both `scripts/cv-data.js` English content and `scripts/locales/en.js` UI labels.

---

## Register and Tone

- **Professional, direct, confident.** Not casual, not stiff corporate.
- Avoid hedging: ~~"helped with"~~, ~~"assisted in"~~ → use direct ownership verbs.
- Avoid passive voice in bullet points: ~~"was responsible for"~~, ~~"duties included"~~ → "I led", "I built".

## Tense Convention

| Context | Tense | Example |
|---|---|---|
| Current job bullets | Present | "I own", "I lead", "I mentor" |
| Past job bullets | Past simple | "I built", "I designed", "I introduced" |
| Job descriptions | Past simple (even current, for archival consistency) | "I led the modernization…" |
| Summary | Present / present perfect | "I've led… I focus on…" |

Viktor's CV consistently uses first-person: `"I built"` not `"Built"`. **Never drop the subject.**

## Bullet Point Quality

Good bullet structure: **verb + object + context/impact**
- ✅ "I reduced the release cycle from monthly to biweekly using AI-assisted workflows"
- ❌ "Release cycle improvements" (no verb, no agent)
- ❌ "I was involved in CI pipeline work" (passive, vague)

Preferred opening verbs: `led`, `built`, `designed`, `implemented`, `introduced`, `migrated`, `established`, `developed`, `reduced`, `improved`, `owned`.

## Technical Terminology

- Exact capitalization: `TypeScript`, `JavaScript`, `Node.js`, `Next.js`, `NestJS`, `ExpressJS`, `PNPM`, `SCSS`, `MySQL`, `MongoDB`, `React`, `Svelte`, `Vitest`, `Playwright`.
- Do NOT anglicize: `"svelte framework"` → `"Svelte"`.
- Do NOT lowercase: `"typescript"` → `"TypeScript"`.

## Common Errors to Flag

- Mixing past/present tense within the same job entry
- "responsible for" — rewrite as direct verb
- "various", "multiple", "several" — replace with specifics where possible
- Redundant words: "in order to" → "to", "due to the fact that" → "because"
- Inconsistent company name capitalization
- Missing articles where expected ("a CI pipeline", not "CI pipeline")

## UI Labels (en.js)

- Labels are imperative or noun-phrase: `"Hire Me"`, `"Send"`, `"Close"`, `"Book a Meeting"`.
- Placeholder texts are example-format: `"Jane Smith"`, `"your@email.com"`.
- Error messages: direct, non-blaming: `"This field is required."` not `"You forgot to fill this."`
- Consistent capitalization: Title Case for section headers, Sentence case for descriptions.
