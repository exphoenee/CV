# CV — Viktor Bozzay

Többnézetes, interaktív önéletrajz böngészőben. Egy központi adatforrásból (CV_DATA) hat különböző megjelenítés és egy RPG játék építkezik. Az indítóoldal karuszel-navigációval, 12 nyelven és témaváltással várja a látogatót.

## Tartalom

- [Nézetek](#n%C3%A9zetek)
- [Architektúra](#architekt%C3%BAra)
- [Technológiai stack](#technol%C3%B3giai-stack)
- [Könyvtárstruktúra](#k%C3%B6nyvt%C3%A1rstrukt%C3%BAra)
- [Lokalizáció](#lokaliz%C3%A1ci%C3%B3)
- [Játékmotor](#j%C3%A1t%C3%A9kmotor)
- [Kapcsolatfelvétel](#kapcsolatfelv%C3%A9tel)
- [Naptári foglalás](#napt%C3%A1ri-foglal%C3%A1s)
- [Telepítés és futtatás](#telep%C3%ADt%C3%A9s-%C3%A9s-futtat%C3%A1s)

## Nézetek

| Útvonal | Célközönség | Leírás |
|---|---|---|
| `index.html` | — | Indítóoldal — karuszel-navigáció a hat CV nézet felé |
| `cv-plain.html` | Olvasó | Hagyományos, nyomtatható önéletrajz téma-váltással (light/dark/superdark/nightvision/predator) és dekorációs effektekkel |
| `cv-gantt.html` | Projektmenedzser | Projektidővonal Gantt-diagram formátumban (2020–2027), cégenként és projektenként lebontva |
| `cv-scrumboard.html` | Scrum Master | Kanban/Scrum tábla — munkáltatónként oszlopokba rendezett karrierkártyák drag-and-drop nélkül |
| `cv-swagger.html` | Frontend fejlesztő | API-dokumentáció stílusú CV — OpenAPI-szerű UI összecsukható szekciókkal és endpoint-blokkokkal (GET/POST/PUT/PATCH/DELETE) |
| `cv-json.html` | Backend fejlesztő | JSON / VS Code-szerű CV — szintaxiskiemeléssel, összecsukható régiókkal ("folding"), sorszámozással |
| `cv-game.html` | Gamer | RPG játék CV — pixel-art világban lehet felfedezni a CV-t házak (stationök) meglátogatásával |

## Architektúra

```
CV_DATA (cv-data.js)
    │
    ├── components/plain/       → cv-plain.js     → cv-plain.html
    ├── components/swagger/     → cv-swagger.js   → cv-swagger.html
    ├── components/json/        → cv-json.js      → cv-json.html
    ├── cv-gantt.js             →                 → cv-gantt.html
    ├── cv-scrumboard.js        →                 → cv-scrumboard.html
    ├── game/world/stations.js  → game/main.js    → cv-game.html
    │
    ├── locale.js  ─── LocaleManager (12 nyelv)
    ├── config.js  ─── globális konstansok, feature flag-ek
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
- **Gantt** — Canvas-alapú idővonalas diagram, cégenként és projektenként színezett sávokkal, görgethetően
- **Scrumboard** — Kanban-stílusú kártyák munkáltatónként oszlopba rendezve, stack-chipekkel
- **Swagger** — OpenAPI-stílusú UI komponensek (`endpoint-block`, `tag-section`, `summary-bar`, `params-table`, `responses`, `stack-chips`, `_icons`)
- **JSON** — Rekurzívan épített, szintaxiskiemelt JSON megjelenítés foldolható régiókkal, sorszámozott sorokkal

### Közös réteg

`scripts/shared.js` tartalmazza az összes nézet által használt segédfüggvényeket:

- `escHtml` / `skillChip` / `refLinks` / `renderBullets`
- `initHireModal` / `hireModalHTML` — kapcsolatfelvételi űrlap modal (lokalizált)
- `initBookingModal` / `bookingModalHTML` — naptári időpontfoglalás modal (lokalizált)
- `musicPlayerHTML` — zenelejátszó HTML generálása
- `MUSIC_GENRES` — közös zenei lista (18 műfaj)
- `initFormspree` — Formspree űrlap bekötés
- `initThemeToggle` / `getSystemTheme` — téma váltás
- `saveState` / `loadState` / `restoreCollapseStates` — UI állapot perzisztálás
- `showToast` — értesítési toast megjelenítés

### Konfiguráció

`scripts/config.js` exportálja a globális konstansokat és feature flag-eket:

- `BOOKING_SCRIPT_URL` — Google Apps Script végpont URL
- `THEME_KEY`, `THEME_DARK`, `THEME_LIGHT`, `PLAIN_ONLY_THEMES` — téma kezelés
- `MUSIC_STATE_KEY`, `MUSIC_TIME_KEY`, stb. — zenelejátszó LocalStorage kulcsok
- `SFX_VOLUME_KEY`, `CURSOR_KEY` — játék beállítások

## Technológiai stack

| Technológia | Használat |
|---|---|
| Vanilla JS (ES Modules) | Nincs keretrendszer, nincs bundler — tiszta moduláris JS |
| CSS (vanilla) | Nézetenként elkülönített CSS fájlok, preprocesszor nélkül |
| Canvas 2D API | Játékmotor renderelés és Gantt-diagram |
| BMP → tilemap | A játéktérkép BMP kép pixeladataiból épül fel, bitmaszkos autotile-lal (RPG Maker 2000/2003 stílus) |
| Intl.DateTimeFormat | Lokalizált dátumok a booking modálban (fiktív nyelveknél angol fallback) |
| Formspree | Kapcsolatfelvételi űrlap küldése |
| NippleJS | Mobilos virtuális joystick |
| LocalStorage | UI állapot, zenei beállítások, téma, nyelv perzisztálása |
| SessionStorage | E-mail domain ellenőrzés cache-elése (MX lookup) |
| Font Awesome | Ikonok |
| Press Start 2P | Pixel-art retro betűtípus (játék nézet) |

## Könyvtárstruktúra

```
CV/
├── index.html              # Indítóoldal (karuszel)
├── cv-plain.html           # Hagyományos CV
├── cv-gantt.html           # Gantt-diagram CV
├── cv-scrumboard.html      # Scrumboard/Kanban CV
├── cv-swagger.html         # Swagger-stílusú CV
├── cv-json.html            # JSON CV
├── cv-game.html            # RPG játék CV
│
├── scripts/
│   ├── cv-data.js          # CV adatok (egyetlen forrás)
│   ├── shared.js           # Közös segédfüggvények
│   ├── locale.js           # LocaleManager — 12 nyelv kezelése
│   ├── config.js           # Globális konstansok, feature flag-ek
│   ├── cv-music-player.js  # Zenelejátszó
│   ├── cv-plain.js         # Plain belépési pont
│   ├── cv-swagger.js       # Swagger belépési pont
│   ├── cv-json.js          # JSON belépési pont
│   ├── cv-gantt.js         # Gantt belépési pont
│   ├── cv-scrumboard.js    # Scrumboard belépési pont
│   ├── cv-index.js         # Index belépési pont
│   │
│   ├── locales/            # Fordítási fájlok
│   │   ├── en.js           # Angol
│   │   ├── hu.js           # Magyar
│   │   ├── de.js           # Német
│   │   ├── fr.js           # Francia
│   │   ├── es.js           # Spanyol
│   │   ├── it.js           # Olasz
│   │   ├── asg.js          # Asgardian (fiktív)
│   │   ├── dot.js          # Dothraki (fiktív)
│   │   ├── kl.js           # Klingon (fiktív)
│   │   ├── qu.js           # Quenya (fiktív)
│   │   ├── goa.js          # Goa'uld (fiktív)
│   │   └── ya.js           # Yautja (fiktív)
│   │
│   ├── components/
│   │   ├── lang-dropdown.js  # Nyelvválasztó dropdown komponens
│   │   ├── plain/            # Plain CV komponensek
│   │   ├── swagger/          # Swagger UI komponensek
│   │   └── json/             # JSON viewer komponensek
│   │
│   └── game/
│       ├── main.js         # GameEngine osztály
│       ├── mobile-input.js # Mobilos kezelés
│       ├── audio/          # Hangeffekt kezelés
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
│   ├── cv-index.css        # Téma-változók, modal + toast stílusok (közös alap)
│   ├── cv-plain.css
│   ├── cv-gantt.css
│   ├── cv-scrumboard.css
│   ├── cv-swagger.css
│   ├── cv-json.css
│   ├── cv-game.css
│   ├── lang-dropdown.css   # Nyelvválasztó dropdown
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

## Lokalizáció

A teljes felület 12 nyelven elérhető, a `scripts/locale.js` `LocaleManager` osztályán keresztül:

| Kód | Nyelv |
|-----|-------|
| `en` | Angol |
| `hu` | Magyar |
| `de` | Német |
| `fr` | Francia |
| `es` | Spanyol |
| `it` | Olasz |
| `asg` | Asgardian |
| `dot` | Dothraki |
| `kl` | Klingon |
| `qu` | Quenya |
| `goa` | Goa'uld |
| `ya` | Yautja |

A kiválasztott nyelv `localStorage`-ban marad, az oldalváltások között is megőrződik. A böngésző alapértelmezett nyelve automatikusan detektálódik. Fiktív nyelveknél (`kl`, `qu`, `goa`, `ya`, `asg`, `dot`) az Intl.DateTimeFormat angol fallback-re vált.

A `data-i18n` attribútummal jelölt DOM elemek automatikusan frissülnek, amikor a felhasználó nyelvet vált — beleértve a nyitva lévő modálok szövegeit is.

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

## E-mail domain validáció

A kapcsolatfelvételi és foglalási űrlapokon az e-mail mező valódi domain-ellenőrzéssel rendelkezik, backend és API-kulcs nélkül.

- **Módszer**: Cloudflare DNS-over-HTTPS (`1.1.1.1`) MX rekord lekérdezés közvetlenül a böngészőből — CORS-barát, ingyenes, korlát nélküli
- **Implementáció**: `checkEmailDomain()` helper a `shared.js`-ben, `CHECK_EMAIL_DOMAIN` boolean flag a `config.js`-ben
- **Blur listener**: az e-mail mezőből kilépve előre lefuttatja az ellenőrzést — submitnál már sessionStorage cache-ből tölt
- **Fail-open**: hálózati hiba, offline mód vagy timeout esetén az ellenőrzés átengedi a formot (a Formspree/GAS fog majd hibát adni)
- **Cache**: `sessionStorage`-ban domain-enként tárolva (`mx_gmail.com = '1'`) — ugyanarra a domainre nem fut újra hálózati kérés
- **Lokalizálva**: `errEmailVerifying` és `errEmailNoMailServer` kulcsok mind a 12 locale fájlban

| Eset | Viselkedés |
|------|-----------|
| Érvényes domain (pl. `gmail.com`) | Ellenőrzés átmegy, form beküldhető |
| Nem létező domain | Hibaüzenet az e-mail mező alatt |
| Offline / hálózati hiba | Fail-open — form átengedi |
| Ugyanaz a domain másodszor | Nincs újabb hálózati kérés (cache) |

## Kapcsolatfelvétel

Minden nézet tartalmaz egy **Hire me** gombot, amely egy modális kapcsolatfelvételi űrlapot nyit meg.

- Az üzenet küldése a [Formspree](https://formspree.io) szolgáltatáson keresztül történik
- A modál szövegei (cím, mezőfeliratok, placeholder-ek, sikeres küldés visszajelzése) teljesen lokalizáltak — 12 nyelven elérhető
- Nyelváltáskor a nyitva lévő modál szövegei azonnal frissülnek (`localechange` eseményre reagál)
- Játék nézetben a modál megnyitásakor a játékmotor lefagy (`isFrozen = true`), bezáráskor folytatódik

## Naptári foglalás

Minden nézet tartalmaz egy **Meet** gombot is, amely időpontfoglalásra szolgál.

- Az elérhető időpontok listából választható nap- és időpont-kártyákon jelennek meg
- A dátumok és napnevek lokalizáltak: a `Intl.DateTimeFormat` API-t használja a kiválasztott felhasználói nyelvvel; fiktív nyelveknél angol fallback érvényesül
- Nyelváltáskor a dátumkártyák azonnal újrarenderelődnek
- Játék nézetben szintén lefagyasztja a motort nyitáskor, MutationObserver figyeli a bezárást

## Futtatás

```bash
npx http-server -p 8080 -c-1
```

A moduláris JS (`type="module"`) miatt HTTP-kiszolgáló szükséges — a `file://` protokoll CORS hibát dob.
