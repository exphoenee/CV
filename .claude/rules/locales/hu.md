# Magyar CV Nyelvi Szabályok

A `cv/cv-data.js` `content` felülírásait és a `cv/locales/hu.js` UI feliratait fedi le.

---

## Regiszter és hang

- **Szakmai, közvetlen, magabiztos.** Nem túl formális, nem laza.
- Egyes szám első személy: „Fejlesztettem", „Vezettem", „Bevezettem" — nem „A fejlesztés elvégzésre került".
- Kerülendő: szenvedő szerkezetek, bürokratikus körülírások.

## Igeidők

| Kontextus                     | Igeidő                | Példa                                               |
| ----------------------------- | --------------------- | --------------------------------------------------- |
| Jelenlegi munkahely bullet-ok | Jelen idő             | „Vezetek egy 2 fős csapatot"                        |
| Korábbi munkahelyek bullet-ok | Múlt idő              | „Megvalósítottam", „Bevezettem"                     |
| Munka leírások                | Múlt idő              | „Az architekturális modernizációt én vezettem."     |
| Összefoglaló                  | Jelen / jelen perfect | „Frontend architektúra területén specializálódtam…" |

## Bullet-ok minősége

Jó bullet struktúra: **ige + tárgy + eredmény/kontextus**

- ✅ „A release-ciklust havontáról kéthetentére csökkentettem AI-alapú fejlesztési munkafolyamatokkal"
- ❌ „Release-ciklus javítása" (nincs alany, nincs ige)

## Technikai terminológia

- Az angolból átvett technológianevek NEM magyarítandók: `TypeScript`, `Node.js`, `Svelte`, `React`, `SCSS`, `MySQL`, stb.
- Köznévi technikaikifejezések ragozhatók: „egy CI pipeline-t hoztam létre", „a monorepo-t PNPM-re migrálva".
- Ne keverj magyar és angol főneveket random: vagy „komponens" vagy „component", de következetesen.

## Elkerülendő hibák

- Tárgyeset elhagyása: „a pipeline bevezettem" → „a pipeline-t bevezettem"
- Múlt idő és jelen idő keverése ugyanazon munkahely leírásán belül
- Idegen szavak indokolatlan magyarítása (pl. „weboldal" vs. „website" — mindkettő elfogadható, de legyen következetes)
- Vonzathibák: „foglalkoztam az architektúrával" (helyes) vs. „foglalkoztam architektúra" (hibás)
- Redundancia: „annak érdekében, hogy" → „hogy", „abból kifolyólag" → „mert"

## UI Feliratok (hu.js)

- Gombok: felszólító módban vagy főnévi csoportként: „Vegyél fel!", „Küldés", „Bezárás", „Időpontfoglalás".
- Placeholder szövegek: példaformátum és kulturálisan releváns: `"Gipsz Jakab"`, `"email@domain.com"`.
- Hibaüzenetek: barátságos, direkten: „Ez a mező kötelező." — nem „Elfelejtettél kitölteni valamit."
- Következetesség: ha egy szót egyik helyen egybe írunk, másik helyen is egybe.
- Nagybetűk: A fejezetcímek nagy kezdőbetűsek. Leírások mondatkezdő nagybetűvel.
- Tegező forma: a felhasználónak tegezve szólunk (pl. „Neved", „Az üzeneted sikeresen megérkezett").
