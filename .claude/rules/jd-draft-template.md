# Job Description Draft Template

When `/job-apply` is invoked without an argument, write this exact content to `tmp/jd-draft.md`
(create `tmp/` if it does not exist; overwrite the file if it already exists):

```markdown
# Állásleírás — töltsd ki és mentsd el

<!-- Töröld ezt a kommentet, majd írd ide az állás adatait. -->
<!-- A job-apply-orchestrator a mentés után folytatja, ha beírod: kész -->

## Pozíció

**Cím:**
**Cég:**
**Szint:** (junior / mid / senior / lead)
**Iparág / domain:**

## Kötelező követelmények

## Előnyben részesített

## Feladatok / felelősségek

## Állásleírás (teljes szöveg másolható ide)
```

After writing, display:

```
📝 Ideiglenes fájl megnyitva: tmp/jd-draft.md

Töltsd ki az állásleírást és mentsd el a fájlt.
Amikor kész vagy, írd be: kész
(Megszakításhoz: n)
```

Wait for user input:

- `n` → stop
- `kész` → read the file, strip `<!-- ... -->` comment lines, store as `JD`
- If `JD` is empty after stripping → ❌ "A tmp/jd-draft.md fájl üres. Töltsd ki és próbáld újra." and stop
