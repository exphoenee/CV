# JS Syntax Validation for Locale Files

## Why

Locale files (`cv/locales/<lang>.js`) are ES module JavaScript files. A single
unescaped apostrophe inside a single-quoted string breaks the entire application with a
`SyntaxError (Unexpected identifier)` — this has happened in production.

French strings frequently contain apostrophes (`l'entreprise`, `d'expérience`, `j'ai`).
Italian strings contain apostrophes (`dell'IA`, `all'interno`).
Fictional languages (Klingon, Goa'uld, Yautja, Dothraki) deliberately use apostrophes as phonemes.

## The Rule

**After ANY modification to ANY locale file, the agent MUST run the automated validator:**

```bash
python .claude/scripts/validate-locale-syntax.py
```

The script scans ALL `.js` files in `cv/locales/` dynamically, runs `node -c` on each one,
and reports which files passed or failed with the exact error message. It exits with code 1
if any file fails, and code 0 only when all files pass.

If any file fails:
1. Read the error message from the script output
2. Open the broken file and identify the broken string (look for single-quoted string containing `'`)
3. Either:
   - Change the outer delimiter to double quotes (`"..."` instead of `'...'`)
   - OR escape the apostrophe: `\'`
4. Re-run `python .claude/scripts/validate-locale-syntax.py` to verify
5. Do NOT proceed with any further pipeline steps until all locale files pass

**Automated validator script (recommended):**

```bash
python .claude/scripts/validate-locale-syntax.py
```

The script scans ALL `.js` files in `cv/locales/` dynamically, validates each one,
and reports which files passed or failed with the exact error message. Exits with code 1
if any file fails — suitable for pipeline use.

For machine-readable JSON output (e.g. for AI agents to parse):
```bash
python .claude/scripts/validate-locale-syntax.py --json
```

To list which files would be checked:
```bash
python .claude/scripts/validate-locale-syntax.py --list
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
