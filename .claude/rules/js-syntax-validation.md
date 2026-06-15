# JS Syntax Validation for Locale Files

## Why

Locale files (`scripts/locales/<lang>.js`) are ES module JavaScript files. A single
unescaped apostrophe inside a single-quoted string breaks the entire application with a
`SyntaxError (Unexpected identifier)` — this has happened in production.

French strings frequently contain apostrophes (`l'entreprise`, `d'expérience`, `j'ai`).
Italian strings contain apostrophes (`dell'IA`, `all'interno`).
Fictional languages (Klingon, Goa'uld, Yautja, Dothraki) deliberately use apostrophes as phonemes.

## The Rule

**After ANY modification to ANY locale file, the agent MUST run:**

```bash
node -c scripts/locales/<lang>.js
```

If any file fails:
1. Identify the broken string (it will be a single-quoted string containing an unescaped `'`)
2. Either:
   - Change the outer delimiter to double quotes (`"..."` instead of `'...'`)
   - OR escape the apostrophe: `\'`
3. Re-run `node -c` on the fixed file
4. Do NOT proceed with any further pipeline steps until all locale files pass `node -c`

**Batch validation command (recommended):**

```bash
for f in scripts/locales/*.js; do
  node -c "$f" || echo "FAIL: $f"
done
```

On Windows (Git Bash):
```bash
for f in scripts/locales/*.js; do node -c "$f" 2>&1; done
```

## Common Pitfalls

| Situation | Example | Fix |
|---|---|---|
| French `'` inside `'...'` | `'...stabilité d'entreprise...'` | Use `"..."` delimiters |
| Italian `'` inside `'...'` | `'...dall'analisi...'` | Use `"..."` delimiters |
| Fictional apostrophes in `'...'` | N/A — always use `"..."` for Goa'uld/Klingon/Dothraki/Yautja strings |

## Golden Rule for Locale Strings

**Always use double quotes (`"..."`) for locale content strings that contain or might contain apostrophes.** When in doubt, use double quotes — they are safe for all European languages.

Specifically:
- **French (`fr.js`):** ALL content strings MUST use `"..."` (contains `l'`, `d'`, `j'`, `n'`, `s'`)
- **Italian (`it.js`):** ALL content strings MUST use `"..."` (contains `l'`, `dell'`, `all'`)
- **Goa'uld (`goa.js`):** ALL content strings MUST use `"..."` (contains `'` in every word)
- **Klingon (`kl.js`):** ALL content strings MUST use `"..."` (uses `'` extensively)
- **Yautja (`ya.js`):** ALL content strings MUST use `"..."` (uses `'` extensively)
- **Dothraki (`dot.js`):** ALL content strings MUST use `"..."` (uses `'` in phonemes like `ko'dhi`, `ta'`, `cha'jalan`)
