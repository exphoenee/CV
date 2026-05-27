# CV_DATA séma dokumentáció

`scripts/cv-data.js` exportálja a `CV_DATA` konstans objektumot. Ez az egyetlen adatforrás — minden nézet (plain, swagger, json, game) innen építkezik.

```
CV_DATA
 ├── meta               (object, kötelező)
 ├── identity           (object, kötelező)
 ├── summary            (string, kötelező)
 ├── workExperience[]   (array, opcionális)
 ├── education          (object, opcionális)
 ├── programmingLanguages[] (array, opcionális)
 ├── community          (string, opcionális)
 └── hobbyProjects[]    (array, opcionális)
```

---

## meta

| Mező | Típus | Kötelező? |
|---|---|---|
| `name` | `string` | igen |
| `role` | `string` | igen |
| `version` | `string` | igen |
| `accentColor` | `string` (CSS szín) | igen |
| `description` | `string` | igen |

Példa:
```js
meta: {
  name: "Viktor Bozzay",
  role: "Frontend Tech Lead",
  version: "4.2.0",
  accentColor: "#ff7024",
  description: "Curriculum Vitae"
}
```

---

## identity

| Mező | Típus | Kötelező? |
|---|---|---|
| `name` | `string` | igen |
| `role` | `string` | igen |
| `location` | `string` | igen |
| `contacts` | `Contact[]` | igen |
| `languages` | `Language[]` | opcionális |

### Contact

| Mező | Típus | Kötelező? |
|---|---|---|
| `label` | `string` | igen |
| `url` | `string \| null` | igen |

Ha `url` null, akkor csak címkeként jelenik meg (pl. "Pécs, Hungary" vagy telefonszám).

### Language

| Mező | Típus | Kötelező? |
|---|---|---|
| `name` | `string` | igen |
| `level` | `string` | igen |
| `comment` | `string \| null` | opcionális |

Példa:
```js
identity: {
  name: "Viktor Bozzay",
  role: "Developer",
  location: "Pécs, Hungary",
  contacts: [
    { label: "Pecs, Hungary", url: null },
    { label: "github.com/exphoenee", url: "https://github.com/exphoenee" },
    { label: "bozzay.viktor@gmail.com", url: "mailto:bozzay.viktor@gmail.com" }
  ],
  languages: [
    { name: "Hungarian", level: "Native", comment: null }
  ]
}
```

---

## summary

| Mező | Típus | Kötelező? |
|---|---|---|
| `summary` | `string` | igen |

Egyszerű szöveges bekezdés.

---

## workExperience[]

Egy munkahely tömb. Minden elem:

| Mező | Típus | Kötelező? |
|---|---|---|
| `id` | `string` | igen — egyedi azonosító, pl. `"aegex"` |
| `company` | `string` | igen |
| `logo` | `string` | igen — fájlnév az `assets/images/`-ből |
| `title` | `string` | igen — pozíció megnevezése |
| `period` | `{ from: string, to: string \| null }` | igen — ISO dátum vagy `null` ha jelenlegi |
| `periodLabel` | `string` | igen — megjelenítendő dátum pl. `"Nov 2023 - Present"` |
| `isCurrent` | `boolean` | igen |
| `teamSize` | `number` | opcionális |
| `description` | `string` | igen |
| `bullets` | `string[] \| object` | opcionális — lehet sima tömb vagy kategorizált objektum (pl. `{ hardSkills: [...], softSkills: [...] }`) |
| `projects` | `Project[]` | opcionális — ha van, `bullets` helyett projektenként bontva |
| `skills` | `string[]` | opcionális |
| `refs` | `Ref[]` | opcionális |
| `hasDecor` | `boolean` | opcionális — plain nézet dekorációkhoz |
| `game` | `GamePosition \| null` | opcionális — ha van, a játékban is megjelenik házként |

### Project

| Mező | Típus | Kötelező? |
|---|---|---|
| `name` | `string` | igen |
| `subtitle` | `string` | igen |
| `bullets` | `string[]` | igen |

### Ref

| Mező | Típus | Kötelező? |
|---|---|---|
| `url` | `string` | igen |
| `label` | `string` | igen |

### GamePosition

| Mező | Típus | Kötelező? |
|---|---|---|
| `x` | `number` | igen — világkoordináta pixelben |
| `y` | `number` | igen — világkoordináta pixelben |
| `tech` | `string` | igen — rövid tech stack szöveg |
| `description` | `string` | igen — rövid cím |
| `highlights` | `string[]` | igen — játékbeli dialogue bullet pontok |

Példa:
```js
{
  id: "aegex",
  company: "Aegex Technologies",
  logo: "aegex.png",
  title: "Frontend Tech Lead",
  period: { from: "2023-11", to: null },
  periodLabel: "Nov 2023 - Present",
  isCurrent: true,
  teamSize: 2,
  description: "Assessed two legacy systems...",
  projects: [
    {
      name: "SafeSy",
      subtitle: "Internal manufacturing management system",
      bullets: [ "Cross-role platform...", "Designed and built..." ]
    }
  ],
  skills: ["Svelte", "React", "ExpressJS"],
  refs: [ { url: "https://facts.aegex.com", label: "facts.aegex.com" } ],
  hasDecor: true,
  game: {
    x: 420, y: 340,
    tech: "Svelte · React · TypeScript",
    description: "Aegex Technologies (Current)",
    highlights: [ "SafeSy: Designed...", "FACTS: CI pipeline..." ]
  }
}
```

---

## education

| Mező | Típus | Kötelező? |
|---|---|---|
| `institution` | `string` | igen |
| `degrees` | `Degree[]` | igen |

### Degree

| Mező | Típus | Kötelező? |
|---|---|---|
| `title` | `string` | igen |
| `years` | `string` | igen |

---

## programmingLanguages[]

| Mező | Típus | Kötelező? |
|---|---|---|
| `name` | `string` | igen |
| `icon` | `string` | igen — fájlnév az `assets/images/`-ből |

---

## community

| Mező | Típus | Kötelező? |
|---|---|---|
| `community` | `string` | opcionális |

Szabad szöveges leírás.

---

## hobbyProjects[]

| Mező | Típus | Kötelező? |
|---|---|---|
| `name` | `string` | igen |
| `url` | `string` | igen |
