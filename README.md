# CV — Viktor Bozzay

Többnézetes, interaktív önéletrajz böngészőben. Egy központi adatforrásból (CV_DATA) négy különböző megjelenítés és egy RPG játék építkezik.

## Tartalom

- [Nézetek](#n%C3%A9zetek)
- [Architektúra](#architekt%C3%BAra)
- [Technológiai stack](#technol%C3%B3giai-stack)
- [Könyvtárstruktúra](#k%C3%B6nyvt%C3%A1rstrukt%C3%BAra)
- [Játékmotor](#j%C3%A1t%C3%A9kmotor)
- [Telepítés és futtatás](#telep%C3%ADt%C3%A9s-%C3%A9s-futtat%C3%A1s)

## Nézetek

| Útvonal | Leírás |
|---|---|
| `index.html` | Indítóoldal — kártyás navigáció a négy CV nézet felé |
| `cv-plain.html` | Hagyományos, nyomtatható önéletrajz téma-váltással (light/dark/superdark/nightvision/predator) és dekorációs effektekkel |
| `cv-swagger.html` | API-dokumentáció stílusú CV — OpenAPI-szerű UI összecsukható szekciókkal és endpoint-blokkokkal (GET/POST/PUT/PATCH/DELETE) |
| `cv-json.html` | JSON / VS Code-szerű CV — szintaxiskiemeléssel, összecsukható régiókkal ("folding"), sorszámozással |
| `cv-game.html` | RPG játék CV — pixel-art világban lehet felfedezni a CV-t házak (stationök) meglátogatásával |

## Architektúra

```
CV_DATA (cv-data.js)
    │
    ├── components/plain/     → cv-plain.js     → cv-plain.html
    ├── components/swagger/   → cv-swagger.js   → cv-swagger.html
    ├── components/json/      → cv-json.js      → cv-json.html
    ├── game/world/stations.js → game/main.js   → cv-game.html
    │
    └── shared.js  ─── közös segédfüggvények
    └── cv-music-player.js ─── zenelejátszó
```

Minden nézet saját CSS-t és egyedi JavaScript belépési pontot használ (`type="module"`). A render komponensek a `scripts/components/` mappában nézetenként szétválasztva találhatók.

### Adatréteg

`scripts/cv-data.js` exportálja a `CV_DATA` konstans objektumot, amely tartalmazza a teljes önéletrajzi adatot:

- `meta`, `identity` (név, szerepkör, lokáció, elérhetőségek, nyelvek)
- `summary` (rövid bemutatkozás)
- `workExperience[]` (munkahelyek projektekkel, stackekkel, referenciákkal)
- `education[]` (tanulmányok)
- `skills[]` (technológiai készségek kategóriákba sorolva)
- `community[]` (közösségi tevékenységek)
- `hobbyProjects[]` (mellékprojektek)

### Megjelenítő réteg

Minden nézet saját komponenskészlettel rendereli az adatokat:

- **Plain** — Template literálokkal épített HTML szekciók (`header`, `work-item`, `education`, `languages`, `programming-languages`, `community`, `hobby-projects`)
- **Swagger** — OpenAPI-stílusú UI komponensek (`endpoint-block`, `tag-section`, `summary-bar`, `params-table`, `responses`, `stack-chips`, `_icons`)
- **JSON** — Rekurzívan épített, szintaxiskiemelt JSON megjelenítés foldolható régiókkal, sorszámozott sorokkal

### Közös réteg

`scripts/shared.js` tartalmazza az összes nézet által használt segédfüggvényeket:

- `escHtml` / `skillChip` / `refLinks` / `renderBullets`
- `initHireModal` / `hireModalHTML` — felvételi űrlap modal
- `musicPlayerHTML` — zenelejátszó HTML generálása
- `MUSIC_GENRES` — közös zenei lista (18 műfaj)
- `initFormspree` — Formspree űrlap bekötés
- `initThemeToggle` / `getSystemTheme` — téma váltás
- `saveState` / `loadState` / `restoreCollapseStates` — UI állapot perzisztálás

## Technológiai stack

| Technológia | Használat |
|---|---|
| Vanilla JS (ES Modules) | Nincs keretrendszer, nincs bundler — tiszta moduláris JS |
| CSS (vanilla) | Hat CSS fájl, nincs preprocesszor |
| Canvas 2D API | Játékmotor renderelés |
| BMP → tilemap | A játéktérkép BMP kép pixeladataiból épül fel, bitmaszkos autotile-lal (RPG Maker 2000/2003 stílus) |
| Formspree | Kapcsolatfelvételi űrlap küldése |
| NippleJS | Mobilos virtuális joystick |
| LocalStorage | UI állapot, zenei beállítások, téma perzisztálása |
| Font Awesome | Ikonok |
| Press Start 2P | Pixel-art retro betűtípus |

## Könyvtárstruktúra

```
CV/
├── index.html              # Indítóoldal
├── cv-plain.html           # Hagyományos CV
├── cv-swagger.html         # Swagger-stílusú CV
├── cv-json.html            # JSON CV
├── cv-game.html            # RPG játék CV
│
├── scripts/
│   ├── cv-data.js          # CV adatok (egyetlen forrás)
│   ├── shared.js           # Közös segédfüggvények
│   ├── cv-music-player.js  # Zenelejátszó
│   ├── cv-plain.js         # Plain belépési pont
│   ├── cv-swagger.js       # Swagger belépési pont
│   ├── cv-json.js          # JSON belépési pont
│   ├── cv-index.js         # Index belépési pont
│   │
│   ├── components/
│   │   ├── plain/          # Plain CV komponensek
│   │   ├── swagger/        # Swagger UI komponensek
│   │   └── json/           # JSON viewer komponensek
│   │
│   └── game/
│       ├── main.js         # GameEngine osztály
│       ├── mobile-input.js # Mobilos kezelés
│       ├── map/            # Tilemap + autotile
│       ├── world/          # Stationök, spawnok
│       └── entities/       # Játékbeli entitások
│           ├── base/       # GameObject, Npc, DecorObject
│           ├── player/
│           ├── enemies/    # Skeleton
│           ├── npcs/       # Chicken, Cow, Pig, Sheep
│           ├── obstacles/  # Tree, House, Chest, stb.
│           └── decor/      # Virág, gomba, szikla, stb.
│
├── styles/
│   ├── cv-plain.css
│   ├── cv-swagger.css
│   ├── cv-json.css
│   ├── cv-game.css
│   ├── cv-index.css
│   └── cv-music-player.css
│
├── assets/
│   ├── music/       # 18 MP3, borítókép, Python eszközök
│   ├── sfx/         # 18 WAV hangeffekt
│   ├── sprites/     # Pixel-art sprite pack
│   └── images/      # Logók, skill ikonok, téma ikonok
│
└── devdocs/         # Tervezési dokumentumok
```

## Játékmotor

A `scripts/game/` alatt található RPG motor Canvas 2D-re épül:

- **Game loop** — `requestAnimationFrame` alapú, fix időlépéses fizikával
- **Entitás rendszer** — `GameObject` ősosztály → specializált entitások (Player, Skeleton, NPC-k, House-ok, dekorációk)
- **Tilemap** — BMP-ből betöltött pálya, 32×32 pixeles tile-okkal, bitmaszkos autotile-lal (256 varáció tile-onként)
- **Ütközésdetekció** — AABB-alapú, collisionBox rendszer
- **Dialogue rendszer** — House-ok ajtajához lépve CV tartalom jelenik meg NPC-szerű ablakban
- **Combat** — Skeleton ellenségek, támadás (space), életerő rendszer
- **Pause menü** — Játék szüneteltetése zenei vezérlőkkel
- **Mobilos támogatás** — NippleJS joystick, reszponzív UI, tájolásfigyelés

## Zenelejátszó

18 zeneszám 6 műfaj saját szöveggel (magyar és német nyelvű dalszövegek). Funkciók:

- Műfajválasztó egyedi legördülő menüvel
- Lejátszás/szünet, következő/előző, megállítás
- Ismétlési módok: nincs / összes / egy
- Hangerőszabályzó
- Kereső csúszka (seek)
- Dalszöveg panel
- Fade-in/fade-out átmenetek
- Állapot perzisztálás localStorage-ban

## Téma rendszer

A plain nézet több témát támogat CSS-változókon keresztül:

- `light` / `dark` / `superdark` / `nightvision` / `predator`
- A `data-theme` attribútum vezérli a CSS-változók értékét
- A választás localStorage-ban marad meg

## Kapcsolatfelvétel

Minden nézet tartalmaz egy "Hire me" gombot, amely egy modális űrlapot nyit. Az űrlap a Formspree szolgáltatáson keresztül küldi el az üzenetet. A játékban a modál megnyitásakor a játékmotor lefagy (isFrozen).

## Futtatás

```bash
npx http-server -p 8080 -c-1
```

A moduláris JS (`type="module"`) miatt HTTP-kiszolgáló szükséges — a `file://` protokoll CORS hibát dob.
