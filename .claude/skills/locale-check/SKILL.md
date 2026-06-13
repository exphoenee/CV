---
name: locale-check
description: >
  Checks all 12 locale files against en.js as source of truth. Reports missing keys
  per file. With --fix, spawns locale-agent to add missing keys interactively.
version: 1.0.0
author: Viktor Bozzay
disable-model-invocation: false
argument-hint: "[--fix]"
---

# locale-check — Locale Completeness Audit

Compares all 12 locale files in `scripts/locales/` against `en.js` as the source of truth.
Reports any missing `labels` keys per file. With `--fix`, spawns `locale-agent` to add them.

---

## Step 1 — Extract reference keys from en.js

Read `scripts/locales/en.js` in full.

Parse all keys inside the `labels: { ... }` object. Build a reference list:
`EN_KEYS = [key1, key2, ...]` in the order they appear in the file.

If the file cannot be read: ❌ ERROR in Hungarian and stop.

---

## Step 2 — Check each locale file

For each of the 11 remaining locale files in `scripts/locales/`:
`hu.js`, `de.js`, `fr.js`, `es.js`, `it.js`, `asg.js`, `dot.js`, `kl.js`, `qu.js`, `goa.js`, `ya.js`

Read each file and extract all keys from its `labels: { ... }` object.

For each file: compute `MISSING = EN_KEYS - keys_in_this_file`.

Build a result map:
```
{
  "hu": ["key1", "key2"],
  "de": [],
  ...
}
```

---

## Step 3 — Report results

### If no missing keys in any file:

```
✅ Locale ellenőrzés kész — minden kulcs megvan mind a 12 fájlban.
Ellenőrzött kulcsok: N
```

### If missing keys found:

```
⚠️ Hiányzó locale kulcsok:

hu.js — 2 hiányzó:
  • keyName1
  • keyName2

de.js — rendben ✅

kl.js — 1 hiányzó:
  • keyName1

...

Összesen: N hiányzó kulcs, M fájlban érintett.

[Ha --fix nincs:] Javításhoz futtasd: /locale-check --fix
[Ha --fix van:] Indítom a locale-agent-et a javításhoz...
```

---

## Step 4 — Fix mode (only if --fix was passed)

For each file that has missing keys:

Spawn `locale-agent` and pass:
- The file path (e.g. `scripts/locales/hu.js`)
- The list of missing key names
- The corresponding values from `en.js` as reference

```
Agent: locale-agent
```

Wait for locale-agent to complete each file before moving to the next.

After all fixes:

```
✅ Javítás kész.

Módosított fájlok:
  • scripts/locales/hu.js — 2 kulcs hozzáadva
  • scripts/locales/kl.js — 1 kulcs hozzáadva

Javaslat: futtasd újra /locale-check az eredmény ellenőrzéséhez.
```

---

## Hard Constraints

- ❌ Never modify `en.js` — it is the source of truth, read-only
- ❌ Never remove keys from any locale file
- ✅ Only check the `labels` object — ignore `content` field differences (those are optional)
- ✅ Always report which file has which missing key before fixing
