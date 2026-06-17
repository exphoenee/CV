# Localization Rules

## The System

`scripts/locale.js` exports a `LocaleManager` singleton instance as `locale`.

```js
import { locale } from './locale.js';
locale.t('keyName'); // returns translation in the current language
locale.getData(); // returns CV_DATA, optionally with locale content overrides
locale.setLang('hu'); // switch language
locale.lang; // current language code
```

In the DOM, `data-i18n="keyName"` attributes mark elements for automatic updates.
On language switch, the `localechange` event fires — modals react to this to update themselves.

## The 12 Files and Their Location

```
scripts/locales/
  en.js   → export const EN = { labels: {...}, content: null }
  hu.js   → export const HU = { labels: {...}, content: {...} }
  de.js   → export const DE = ...
  fr.js   → export const FR = ...
  es.js   → export const ES = ...
  it.js   → export const IT = ...
  asg.js  → export const ASG = ...   (Asgardian — fictional)
  dot.js  → export const DOT = ...   (Dothraki — fictional)
  kl.js   → export const KL  = ...   (Klingon — fictional)
  qu.js   → export const QU  = ...   (Quenya — fictional)
  goa.js  → export const GOA = ...   (Goa'uld — fictional)
  ya.js   → export const YA  = ...   (Yautja — fictional)
```

## Mandatory Rule: Every Key Goes Into All 12 Files

If you add a new `labels` key for any reason, it must be written to **all 12 files**.
If a key is missing, `locale.t()` falls back to `en.js` — but this means a hidden bug.

### Order

1. Write the reference value in `en.js`
2. Write the Hungarian translation in `hu.js`
3. `de.js`, `fr.js`, `es.js`, `it.js` — actual translations
4. `asg.js`, `dot.js`, `kl.js`, `qu.js`, `goa.js`, `ya.js` — fictional, follow existing style

## Fictional Language Translation Principles

Fictional languages don't need real translations, but maintain the style:

- Klingon (`kl`): hard consonants, apostrophes, e.g. `"jabbI'ID legh…"`
- Quenya (`qu`): more abstract, longer words, e.g. `"Centapoldo cendë…"`
- Others have their own internal logic — look at neighboring keys and follow the pattern

## ⚠️ MANDATORY: JS Syntax Validation After Modification

Locale files are ES module JS files — a single unescaped apostrophe `'` inside a single-quote `'...'` string
causes a SyntaxError that breaks the entire application.

**After every locale file modification, run the automated validator:**

```bash
python .claude/scripts/validate-locale-syntax.py
```

The script scans ALL `.js` files in `scripts/locales/` dynamically and validates each one.

**Details:** `.claude/rules/js-syntax-validation.md`

**Golden Rule:** For French, Italian, Goa'uld, and Klingon strings, ALWAYS use double quotes (`"..."`) —
never `'...'`, because these languages frequently contain apostrophes.

---

## `content` Field (Optional Content Override)

If a locale includes a `content` field (e.g. `hu.js`), it can override CV text content:

- `content.summary` — introductory text
- `content.community` — community activity texts
- `content.workExperience[].description` / `.bullets` — work experience texts

This is optional — if `null`, the English base data applies.

## Intl.DateTimeFormat for Fictional Languages

When displaying dates in the booking modal:

```js
Intl.DateTimeFormat.supportedLocalesOf([locale.lang]).length > 0 ? locale.lang : 'en';
```

For fictional languages (`kl`, `qu`, `goa`, `ya`, `asg`, `dot`), this automatically falls back to `'en'`.
No special handling needed — `initBookingModal` already implements this.
