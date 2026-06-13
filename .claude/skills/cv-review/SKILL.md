---
name: cv-review
description: >
  CV project-specific code review. Checks the current git diff for locale completeness,
  aria label compliance, security (no innerHTML with user input), config constants,
  and required elements on new view pages. Reports findings in Hungarian.
version: 1.0.0
author: Viktor Bozzay
disable-model-invocation: false
argument-hint: "[--fix]"
---

# cv-review — CV Project Compliance Review

Reads the current git diff and checks for CV project-specific violations.
Covers locale completeness, aria labels, security, config hygiene, and new view checklists.

---

## Step 1 — Read the diff

Run:
```bash
git diff HEAD
```

Also run:
```bash
git diff --name-only HEAD
```

to get the list of changed files. If there are staged changes, use `git diff --cached HEAD` as well
and merge the two diffs.

If the diff is empty: report "Nincs változás a HEAD-hez képest." and stop.

---

## Step 2 — Locale completeness check

### 2a — New keys added to en.js?

If `scripts/locales/en.js` appears in the diff:
- Extract all keys added in the diff (`+  keyName:` lines inside `labels: { ... }`)
- For each new key: check whether the same key exists in the other 11 locale files
- If missing in any file → ⚠️ WARNING per file

### 2b — New locale key used in JS/HTML but not defined?

Scan changed `.js` and `.html` files for `locale.t('keyName')` calls.
For each key found: verify it exists in `scripts/locales/en.js`.
If missing → ❌ ERROR: "locale kulcs nincs definiálva: 'keyName'"

### 2c — data-i18n attribute used?

Scan changed `.html` files for `data-i18n="keyName"` attributes.
For each key found: verify it exists in `scripts/locales/en.js`.
If missing → ❌ ERROR: "data-i18n kulcs nincs definiálva: 'keyName'"

---

## Step 3 — Aria label compliance

Scan changed `.js` and `.html` files.

### 3a — Hardcoded aria-label strings

If `aria-label="` appears with a literal string (not `locale.t(...)` output):
- Check whether the literal string matches a known aria key value from `scripts/locales/en.js`
- If yes → ⚠️ WARNING: "Hardcoded aria-label — használj locale.t('ariaKulcs') helyette"
- If the string is clearly a one-off, non-localized technical label → skip

### 3b — Icon-only buttons missing aria-label

Scan for `<button` elements that contain `<i class="fa` but no `aria-label`.
→ ❌ ERROR per button: "Icon-only gomb aria-label nélkül"

### 3c — Modal elements missing required aria attributes

Scan for `role="dialog"` elements missing `aria-modal="true"` or `aria-labelledby`.
→ ❌ ERROR per modal

### 3d — Decorative icons not hidden

Scan for `<i class="fa` inside buttons that also have visible text, where the icon is missing `aria-hidden="true"`.
→ ⚠️ WARNING per icon

---

## Step 4 — Security check

### 4a — innerHTML with dynamic content

Scan changed `.js` files for `.innerHTML =` or `.innerHTML +=` assignments.
If the right-hand side is not a string literal and not using the `html\`\`` tagged template:
→ ❌ ERROR: "Potenciális XSS: .innerHTML dinamikus értékkel — használj html\`\`` vagy escHtml()"

### 4b — insertAdjacentHTML with user input

Scan for `insertAdjacentHTML(` calls where the second argument is not `hireModalHTML()`,
`bookingModalHTML()`, `musicPlayerHTML()`, or another known-safe generator function.
Flag unknown calls for manual review → ⚠️ WARNING

---

## Step 5 — Config hygiene

### 5a — Hardcoded URLs

Scan changed `.js` files for string literals matching URL patterns (`https://`, `http://`)
that are not inside `scripts/config.js`.
→ ⚠️ WARNING: "URL ne legyen hard-code-olva — add hozzá config.js-hez"

### 5b — Hardcoded localStorage keys

Scan for `localStorage.getItem('` or `localStorage.setItem('` with literal key strings
not imported from `config.js`.
→ ⚠️ WARNING: "LocalStorage kulcs ne legyen hard-code-olva — add hozzá config.js-hez"

---

## Step 6 — New view page checklist

If any `cv-*.html` file was added (not modified — added):
Extract the view name from the filename (e.g. `cv-timeline.html` → `timeline`).

```
Agent: view-check-agent
```

Pass the view name. Wait for the result. Include findings in the final report.

---

## Step 7 — Report

Display findings in Hungarian:

```
📋 CV Review — [dátum]

❌ Hibák (N):
  • [fájl:sor] [leírás]
  ...

⚠️ Figyelmeztetések (N):
  • [fájl] [leírás]
  ...

✅ Rendben:
  • Locale kulcsok: OK
  • Aria labelek: OK
  • Biztonság: OK
  • Config: OK
  ...

[Ha 0 hiba és 0 figyelmeztetés:]
✅ Minden rendben — a változtatások megfelelnek a projekt szabályainak.
```

If `--fix` was passed and there are fixable warnings (hardcoded aria strings, missing aria-hidden):
Apply the fixes directly and report what was changed.

---

## Hard Constraints

- ❌ Never modify `en.js` or any locale file in this skill — that is locale-agent's job
- ❌ Never fix security issues silently — always show the exact change before applying
- ✅ Read each changed file in full before reporting — don't rely on diff context lines alone
- ✅ Skip `scripts/locales/` files from Section 4 (innerHTML in locale files is not a concern)
- ✅ False positives are OK — flag uncertain cases as WARNING, not ERROR
