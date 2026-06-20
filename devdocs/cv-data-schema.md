# CV_DATA schema documentation

> 🌐 **Language:** 🇬🇧 English · [🇭🇺 Magyar](cv-data-schema-hu.md)

`cv/cv-data.js` exports the `CV_DATA` constant object. This is the single source of truth — every view (plain, swagger, json, game) builds from it.

```
CV_DATA
 ├── meta               (object, required)
 ├── identity           (object, required)
 ├── summary            (string, required)
 ├── workExperience[]   (array, optional)
 ├── education          (object, optional)
 ├── skillGroups        (object, optional)
 ├── skillNote          (object, optional)
 ├── programmingLanguages[] (array, optional)
 ├── community          (string, optional)
 └── hobbyProjects[]    (array, optional)
```

---

## meta

| Field         | Type                | Required? |
| ------------- | ------------------- | --------- |
| `name`        | `string`            | yes       |
| `role`        | `string`            | yes       |
| `version`     | `string`            | yes       |
| `accentColor` | `string` (CSS color)| yes       |
| `description` | `string`            | yes       |

Example:

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

| Field       | Type           | Required?                                                                                                              |
| ----------- | -------------- | --------------------------------------------------------------------------------------------------------------------- |
| `name`      | `string`       | yes                                                                                                                   |
| `role`      | `string`       | yes                                                                                                                   |
| `location`  | `string`       | yes                                                                                                                   |
| `contacts`  | `Contact[]`    | yes                                                                                                                   |
| `languages` | `Language[]`   | optional                                                                                                              |
| `game`      | `GamePosition` | optional — the coordinates and label of the in-game "Personal HQ" (welcome) station (see [GamePosition](#gameposition)) |

### Contact

| Field   | Type             | Required? |
| ------- | ---------------- | --------- |
| `label` | `string`         | yes       |
| `url`   | `string \| null` | yes       |

If `url` is null, it is shown only as a label (e.g. "Pécs, Hungary" or a phone number).

### Language

| Field     | Type             | Required?  |
| --------- | ---------------- | ---------- |
| `name`    | `string`         | yes        |
| `level`   | `string`         | yes        |
| `comment` | `string \| null` | optional   |

Example:

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

| Field     | Type     | Required? |
| --------- | -------- | --------- |
| `summary` | `string` | yes       |

A simple text paragraph.

---

## workExperience[]

An array of jobs. Each element:

| Field         | Type                                   | Required?                                                                                              |
| ------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `id`          | `string`                               | yes — unique identifier, e.g. `"aegex"`                                                                |
| `company`     | `string`                               | yes                                                                                                   |
| `logo`        | `string`                               | yes — filename from `assets/images/`                                                                   |
| `title`       | `string`                               | yes — name of the position                                                                             |
| `period`      | `{ from: string, to: string \| null }` | yes — ISO date or `null` if current                                                                    |
| `periodLabel` | `string`                               | yes — date to display, e.g. `"Nov 2023 - Present"`                                                     |
| `isCurrent`   | `boolean`                              | yes                                                                                                   |
| `teamSize`    | `number`                               | optional                                                                                              |
| `description` | `string`                               | yes                                                                                                   |
| `bullets`     | `string[] \| object`                   | optional — can be a plain array or a categorized object (e.g. `{ hardSkills: [...], softSkills: [...] }`) |
| `projects`    | `Project[]`                            | optional — if present, broken down per project alongside `bullets`                                     |
| `skills`      | `Skill[]`                              | optional — array of `{ name, icon }` objects                                                           |
| `refs`        | `Ref[]`                                | optional                                                                                              |
| `hasDecor`    | `boolean`                              | optional — for plain-view decorations                                                                  |
| `game`        | `GamePosition \| null`                 | optional — if present, also appears as a house in the game                                             |

### Project

| Field      | Type       | Required? |
| ---------- | ---------- | --------- |
| `name`     | `string`   | yes       |
| `subtitle` | `string`   | yes       |
| `bullets`  | `string[]` | yes       |

### Skill

| Field  | Type     | Required?                                                  |
| ------ | -------- | --------------------------------------------------------- |
| `name` | `string` | yes — name of the skill, e.g. `"TypeScript"`              |
| `icon` | `string` | yes — filename from `assets/images/`, e.g. `"typescript.svg"` |

### Ref

| Field   | Type     | Required? |
| ------- | -------- | --------- |
| `url`   | `string` | yes       |
| `label` | `string` | yes       |

### GamePosition

| Field         | Type       | Required?                                                                                                                                  |
| ------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `x`           | `number`   | yes — world coordinate in pixels                                                                                                          |
| `y`           | `number`   | yes — world coordinate in pixels                                                                                                          |
| `tech`        | `string`   | yes — short tech-stack text                                                                                                               |
| `description` | `string`   | yes — short title (the station's header in the game)                                                                                      |
| `highlights`  | `string[]` | optional — extra in-game dialogue bullet points (not used in the current data; if missing, only `bullets`/`projects` are shown)           |

Example:

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

| Field         | Type           | Required?                                                                                                                      |
| ------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `institution` | `string`       | yes                                                                                                                          |
| `degrees`     | `Degree[]`     | yes                                                                                                                          |
| `game`        | `GamePosition` | optional — the coordinates and label of the in-game "Education, Community & Projects" station (see [GamePosition](#gameposition)) |

### Degree

| Field   | Type     | Required? |
| ------- | -------- | --------- |
| `title` | `string` | yes       |
| `years` | `string` | yes       |

---

## skillGroups

Skills grouped into categories. A keyed object — each key is a group (e.g. `primary`, `backend`, `testing`, `tooling`, `ai`, `robotics`). The group names can be freely extended.

| Field (per group) | Type             | Required?                                  |
| ----------------- | ---------------- | ------------------------------------------ |
| `list`            | `string[]`       | yes — names of the skills in the group     |
| `comment`         | `string \| null` | optional — an optional note for the group  |

Example:

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

A single, highlighted "easter egg"-style skill note.

| Field     | Type             | Required?  |
| --------- | ---------------- | ---------- |
| `key`     | `string`         | yes        |
| `value`   | `string`         | yes        |
| `comment` | `string \| null` | optional   |

Example:

```js
skillNote: {
  key: "willRefactorYourEntireCodebaseIf",
  value: "evidence justifies it",
  comment: "(often)",
}
```

---

## programmingLanguages[]

| Field  | Type     | Required?                          |
| ------ | -------- | --------------------------------- |
| `name` | `string` | yes                               |
| `icon` | `string` | yes — filename from `assets/images/` |

---

## community

| Field       | Type     | Required?  |
| ----------- | -------- | ---------- |
| `community` | `string` | optional   |

Free-form text description.

---

## hobbyProjects[]

| Field  | Type     | Required? |
| ------ | -------- | --------- |
| `name` | `string` | yes       |
| `url`  | `string` | yes       |
