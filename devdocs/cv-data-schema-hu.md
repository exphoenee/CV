# CV_DATA séma dokumentáció

> 🌐 **Nyelv:** [🇬🇧 English](cv-data-schema.md) · 🇭🇺 Magyar

`cv/cv-data.js` exportálja a `CV_DATA` konstans objektumot. Ez az egyetlen adatforrás — minden nézet (plain, swagger, json, game) innen építkezik.

```
CV_DATA
 ├── meta               (object, kötelező)
 ├── identity           (object, kötelező)
 ├── summary            (string, kötelező)
 ├── workExperience[]   (array, opcionális)
 ├── education          (object, opcionális)
 ├── skillGroups        (object, opcionális)
 ├── skillNote          (object, opcionális)
 ├── programmingLanguages[] (array, opcionális)
 ├── community          (string, opcionális)
 └── hobbyProjects[]    (array, opcionális)
```

---

## meta

| Mező          | Típus               | Kötelező? |
| ------------- | ------------------- | --------- |
| `name`        | `string`            | igen      |
| `role`        | `string`            | igen      |
| `version`     | `string`            | igen      |
| `accentColor` | `string` (CSS szín) | igen      |
| `description` | `string`            | igen      |

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

| Mező        | Típus          | Kötelező?                                                                                                             |
| ----------- | -------------- | --------------------------------------------------------------------------------------------------------------------- |
| `name`      | `string`       | igen                                                                                                                  |
| `role`      | `string`       | igen                                                                                                                  |
| `location`  | `string`       | igen                                                                                                                  |
| `contacts`  | `Contact[]`    | igen                                                                                                                  |
| `languages` | `Language[]`   | opcionális                                                                                                            |
| `game`      | `GamePosition` | opcionális — a játékbeli „Personal HQ" (welcome) station koordinátái és felirata (lásd [GamePosition](#gameposition)) |

### Contact

| Mező    | Típus            | Kötelező? |
| ------- | ---------------- | --------- |
| `label` | `string`         | igen      |
| `url`   | `string \| null` | igen      |

Ha `url` null, akkor csak címkeként jelenik meg (pl. "Pécs, Hungary" vagy telefonszám).

### Language

| Mező      | Típus            | Kötelező?  |
| --------- | ---------------- | ---------- |
| `name`    | `string`         | igen       |
| `level`   | `string`         | igen       |
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

| Mező      | Típus    | Kötelező? |
| --------- | -------- | --------- |
| `summary` | `string` | igen      |

Egyszerű szöveges bekezdés.

---

## workExperience[]

Egy munkahely tömb. Minden elem:

| Mező          | Típus                                  | Kötelező?                                                                                                |
| ------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `id`          | `string`                               | igen — egyedi azonosító, pl. `"aegex"`                                                                   |
| `company`     | `string`                               | igen                                                                                                     |
| `logo`        | `string`                               | igen — fájlnév az `assets/images/`-ből                                                                   |
| `title`       | `string`                               | igen — pozíció megnevezése                                                                               |
| `period`      | `{ from: string, to: string \| null }` | igen — ISO dátum vagy `null` ha jelenlegi                                                                |
| `periodLabel` | `string`                               | igen — megjelenítendő dátum pl. `"Nov 2023 - Present"`                                                   |
| `isCurrent`   | `boolean`                              | igen                                                                                                     |
| `teamSize`    | `number`                               | opcionális                                                                                               |
| `description` | `string`                               | igen                                                                                                     |
| `bullets`     | `string[] \| object`                   | opcionális — lehet sima tömb vagy kategorizált objektum (pl. `{ hardSkills: [...], softSkills: [...] }`) |
| `projects`    | `Project[]`                            | opcionális — ha van, `bullets` mellett projektenként bontva                                              |
| `skills`      | `Skill[]`                              | opcionális — `{ name, icon }` objektumok tömbje                                                          |
| `refs`        | `Ref[]`                                | opcionális                                                                                               |
| `hasDecor`    | `boolean`                              | opcionális — plain nézet dekorációkhoz                                                                   |
| `game`        | `GamePosition \| null`                 | opcionális — ha van, a játékban is megjelenik házként                                                    |

### Project

| Mező       | Típus      | Kötelező? |
| ---------- | ---------- | --------- |
| `name`     | `string`   | igen      |
| `subtitle` | `string`   | igen      |
| `bullets`  | `string[]` | igen      |

### Skill

| Mező   | Típus    | Kötelező?                                                      |
| ------ | -------- | -------------------------------------------------------------- |
| `name` | `string` | igen — készség neve, pl. `"TypeScript"`                        |
| `icon` | `string` | igen — fájlnév az `assets/images/`-ből, pl. `"typescript.svg"` |

### Ref

| Mező    | Típus    | Kötelező? |
| ------- | -------- | --------- |
| `url`   | `string` | igen      |
| `label` | `string` | igen      |

### GamePosition

| Mező          | Típus      | Kötelező?                                                                                                                                       |
| ------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `x`           | `number`   | igen — világkoordináta pixelben                                                                                                                 |
| `y`           | `number`   | igen — világkoordináta pixelben                                                                                                                 |
| `tech`        | `string`   | igen — rövid tech stack szöveg                                                                                                                  |
| `description` | `string`   | igen — rövid cím (a játékban a station fejléce)                                                                                                 |
| `highlights`  | `string[]` | opcionális — extra játékbeli dialogue bullet pontok (a jelenlegi adatban nincs használva; ha hiányzik, csak a `bullets`/`projects` jelenik meg) |

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
  skills: [
    { name: "Svelte", icon: "svelte.svg" },
    { name: "React", icon: "react.svg" },
    { name: "ExpressJS", icon: "ExpressJS.svg" }
  ],
  refs: [ { url: "https://facts.aegex.com", label: "facts.aegex.com" } ],
  hasDecor: true,
  game: {
    x: 420, y: 340,
    tech: "Svelte · React · TypeScript · Node.js",
    description: "Aegex Technologies (Current)"
  }
}
```

---

## education

| Mező          | Típus          | Kötelező?                                                                                                                       |
| ------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `institution` | `string`       | igen                                                                                                                            |
| `degrees`     | `Degree[]`     | igen                                                                                                                            |
| `game`        | `GamePosition` | opcionális — a játékbeli „Education, Community & Projects" station koordinátái és felirata (lásd [GamePosition](#gameposition)) |

### Degree

| Mező    | Típus    | Kötelező? |
| ------- | -------- | --------- |
| `title` | `string` | igen      |
| `years` | `string` | igen      |

---

## skillGroups

Készségek kategóriákba sorolva. Kulcsozott objektum — minden kulcs egy csoport (pl. `primary`, `backend`, `testing`, `tooling`, `ai`, `robotics`). A csoportnevek szabadon bővíthetők.

| Mező (csoportonként) | Típus            | Kötelező?                                       |
| -------------------- | ---------------- | ----------------------------------------------- |
| `list`               | `string[]`       | igen — a csoportba tartozó készségek nevei      |
| `comment`            | `string \| null` | opcionális — opcionális megjegyzés a csoporthoz |

Példa:

```js
skillGroups: {
  primary: {
    list: ["TypeScript", "JavaScript", "Svelte", "React", "Node.js"],
    comment: null,
  },
  testing: {
    list: ["Jest", "Vitest", "Playwright"],
    comment: "yes, all three",
  },
}
```

---

## skillNote

Egyetlen, kiemelt „easter egg" jellegű készség-megjegyzés.

| Mező      | Típus            | Kötelező?  |
| --------- | ---------------- | ---------- |
| `key`     | `string`         | igen       |
| `value`   | `string`         | igen       |
| `comment` | `string \| null` | opcionális |

Példa:

```js
skillNote: {
  key: "willRefactorYourEntireCodebaseIf",
  value: "evidence justifies it",
  comment: "(often)",
}
```

---

## programmingLanguages[]

| Mező   | Típus    | Kötelező?                              |
| ------ | -------- | -------------------------------------- |
| `name` | `string` | igen                                   |
| `icon` | `string` | igen — fájlnév az `assets/images/`-ből |

---

## community

| Mező        | Típus    | Kötelező?  |
| ----------- | -------- | ---------- |
| `community` | `string` | opcionális |

Szabad szöveges leírás.

---

## hobbyProjects[]

| Mező   | Típus    | Kötelező? |
| ------ | -------- | --------- |
| `name` | `string` | igen      |
| `url`  | `string` | igen      |
