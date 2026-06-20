# CV — Viktor Bozzay

Többnézetes, interaktív önéletrajz böngészőben. Egy központi adatforrásból (CV_DATA) hat különböző megjelenítés és egy RPG játék építkezik. Az indítóoldal karuszel-navigációval, 12 nyelven és témaváltással várja a látogatót.

## Tartalom

- [CV — Viktor Bozzay](#cv--viktor-bozzay)
  - [Tartalom](#tartalom)
  - [Nézetek](#nézetek)
  - [Architektúra](#architektúra)
    - [Adatréteg](#adatréteg)
    - [Megjelenítő réteg](#megjelenítő-réteg)
    - [Közös réteg](#közös-réteg)
    - [Konfiguráció](#konfiguráció)
  - [Technológiai stack](#technológiai-stack)
  - [Könyvtárstruktúra](#könyvtárstruktúra)
  - [Lokalizáció](#lokalizáció)
  - [Játékmotor](#játékmotor)
  - [Zenelejátszó](#zenelejátszó)
  - [Téma rendszer](#téma-rendszer)
  - [E-mail domain validáció](#e-mail-domain-validáció)
  - [Kapcsolatfelvétel](#kapcsolatfelvétel)
  - [Naptári foglalás](#naptári-foglalás)
    - [Backend — Google Apps Script (Code.gs)](#backend--google-apps-script-codegs)
    - [Frontend — Booking Modal](#frontend--booking-modal)
  - [AI munkafolyamat](#ai-munkafolyamat)
    - [Képességek áttekintése](#képességek-áttekintése)
    - [Részletes dokumentáció](#részletes-dokumentáció)
  - [Futtatás](#futtatás)

## Nézetek

| Útvonal              | Célközönség        | Leírás                                                                                                                      |
| -------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `index.html`         | —                  | Indítóoldal — karuszel-navigáció a hat CV nézet felé                                                                        |
| `cv-plain.html`      | Olvasó             | Hagyományos, nyomtatható önéletrajz téma-váltással (light/dark/superdark/nightvision/predator) és dekorációs effektekkel    |
| `cv-gantt.html`      | Projektmenedzser   | Projektidővonal Gantt-diagram formátumban (2020–2027), cégenként és projektenként lebontva                                  |
| `cv-scrumboard.html` | Scrum Master       | Kanban/Scrum tábla — munkáltatónként oszlopokba rendezett karrierkártyák drag-and-drop nélkül                               |
| `cv-swagger.html`    | Frontend fejlesztő | API-dokumentáció stílusú CV — OpenAPI-szerű UI összecsukható szekciókkal és endpoint-blokkokkal (GET/POST/PUT/PATCH/DELETE) |
| `cv-json.html`       | Backend fejlesztő  | JSON / VS Code-szerű CV — szintaxiskiemeléssel, összecsukható régiókkal ("folding"), sorszámozással                         |
| `cv-game.html`       | Gamer              | RPG játék CV — pixel-art világban lehet felfedezni a CV-t házak (stationök) meglátogatásával                                |

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
    ├── shared.js  ─── közös segédfüggvények
    └── cv-music-player.js ─── zenelejátszó
```

Minden nézet saját CSS-t és egyedi JavaScript belépési pontot használ (`type="module"`). A render komponensek a `scripts/components/` mappában nézetenként szétválasztva találhatók.

### Adatréteg

`cv/cv-data.js` exportálja a `CV_DATA` konstans objektumot, amely tartalmazza a teljes önéletrajzi adatot:

- `meta`, `identity` (név, szerepkör, lokáció, elérhetőségek, nyelvek)
- `summary` (rövid bemutatkozás)
- `workExperience[]` (munkahelyek projektekkel, stackekkel, referenciákkal)
- `education[]` (tanulmányok)
- `skills[]` (technológiai készségek kategóriákba sorolva)
- `community[]` (közösségi tevékenységek)
- `hobbyProjects[]` (mellékprojektek)

A teljes mezőszintű séma (típusok, kötelező/opcionális mezők, példák) a [devdocs/cv-data-schema.md](devdocs/cv-data-schema.md) dokumentumban található.

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

| Technológia             | Használat                                                                                           |
| ----------------------- | --------------------------------------------------------------------------------------------------- |
| Vanilla JS (ES Modules) | Nincs keretrendszer, nincs bundler — tiszta moduláris JS                                            |
| CSS (vanilla)           | Nézetenként elkülönített CSS fájlok, preprocesszor nélkül                                           |
| Canvas 2D API           | Játékmotor renderelés és Gantt-diagram                                                              |
| BMP → tilemap           | A játéktérkép BMP kép pixeladataiból épül fel, bitmaszkos autotile-lal (RPG Maker 2000/2003 stílus) |
| Intl.DateTimeFormat     | Lokalizált dátumok a booking modálban (fiktív nyelveknél angol fallback)                            |
| Formspree               | Kapcsolatfelvételi űrlap küldése                                                                    |
| NippleJS                | Mobilos virtuális joystick                                                                          |
| LocalStorage            | UI állapot, zenei beállítások, téma, nyelv perzisztálása                                            |
| SessionStorage          | E-mail domain ellenőrzés cache-elése (MX lookup)                                                    |
| Font Awesome            | Ikonok                                                                                              |
| Press Start 2P          | Pixel-art retro betűtípus (játék nézet)                                                             |

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
├── .claude/
│   ├── rules/            # Projekt konvenciók, AI szabályok
│   │   └── translation-length.md   # Fordítási hossz-budget (fix, beégetett)
│   ├── reference/
│   │   └── current-english-lengths.json  # Fix hossz-budget JSON (kézzel karbantartott)
│   ├── scripts/          # Globális AI segédscriptek
│   │   ├── cv-ledger.py                   # Marker + history.md kezelő
│   │   └── check-translation-lengths.py  # Fordítási hossz-budget ellenőrző
│   ├── agents/           # AI agent definíciók
│   └── skills/
│       ├── cv-backup/
│       │   └── scripts/
│       │       └── cv-backup.py     # CV snapshot backup
│       ├── cv-restore/
│       │   └── scripts/
│       │       └── cv-restore.py    # CV visszaállítás
│       ├── locale-check/
│       │   └── scripts/
│       │       └── locale-check.py  # Locale kulcs ellenőrzés
│       └── ... (további skill definíciók)
│
└── devdocs/                 # Tervezési dokumentumok
    ├── ai-workflow.md       # AI skill/agent munkafolyamatok
    ├── cv-data-schema.md    # CV_DATA mezőszintű séma
    └── game-dev-notes.md    # Játékmotor fejlesztői jegyzetek
```

## Lokalizáció

A teljes felület 12 nyelven elérhető, a `scripts/locale.js` `LocaleManager` osztályán keresztül:

| Kód   | Nyelv     |
| ----- | --------- |
| `en`  | Angol     |
| `hu`  | Magyar    |
| `de`  | Német     |
| `fr`  | Francia   |
| `es`  | Spanyol   |
| `it`  | Olasz     |
| `asg` | Asgardian |
| `dot` | Dothraki  |
| `kl`  | Klingon   |
| `qu`  | Quenya    |
| `goa` | Goa'uld   |
| `ya`  | Yautja    |

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

A motor részletes fejlesztői dokumentációja (új station/entitás hozzáadása, BMP → tilemap pipeline, collision rendszer, dialogue rendszer, térkép szerkesztése) a [devdocs/game-dev-notes.md](devdocs/game-dev-notes.md) fájlban olvasható.

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

| Eset                              | Viselkedés                         |
| --------------------------------- | ---------------------------------- |
| Érvényes domain (pl. `gmail.com`) | Ellenőrzés átmegy, form beküldhető |
| Nem létező domain                 | Hibaüzenet az e-mail mező alatt    |
| Offline / hálózati hiba           | Fail-open — form átengedi          |
| Ugyanaz a domain másodszor        | Nincs újabb hálózati kérés (cache) |

## Kapcsolatfelvétel

Minden nézet tartalmaz egy **Hire me** gombot, amely egy modális kapcsolatfelvételi űrlapot nyit meg.

- Az üzenet küldése a [Formspree](https://formspree.io) szolgáltatáson keresztül történik
- A modál szövegei (cím, mezőfeliratok, placeholder-ek, sikeres küldés visszajelzése) teljesen lokalizáltak — 12 nyelven elérhető
- Nyelváltáskor a nyitva lévő modál szövegei azonnal frissülnek (`localechange` eseményre reagál)
- Játék nézetben a modál megnyitásakor a játékmotor lefagy (`isFrozen = true`), bezáráskor folytatódik

## Naptári foglalás

Minden nézet tartalmaz egy **Meet** gombot, amely online időpontfoglalást nyit meg.

### Backend — Google Apps Script (Code.gs)

A foglalási rendszer egy [Google Apps Script](https://script.google.com) backendet használ, amely a Google Calendar API-ra épül. A GAS projekt külön repository-ban található:

> 📁 [GAS]([E:/Projects/GoogleCalendarAPI/](https://github.com/exphoenee/GoogleCalendarAPI)) — `Code.gs`, `index.html`, `app.js`, `config.js`, `style.css`

**Architektúra:**

```
Böngésző (scripts/shared.js — initBookingModal)
    │
    ▼ HTTPS GET (query params)
Code.gs (Google Apps Script — doGet)
    │
    ├── Google Calendar API (naptár ellenőrzés + esemény létrehozás + meghívó)
    └── ScriptProperties (foglalási adatok perzisztálása)
```

**Végpontok:**

| `action` paraméter | Művelet |
|--------------------|--------|
| `slots` (alapértelmezett) | Szabad időpontok listája a naptárból, figyelembe véve a munkaidőt és rate limitet |
| `debug` | Részletes napi bontás hibakereséshez |
| `book` + `name`, `email`, `start`, `end`, `topic` | Foglalás létrehozása — validálás, rate limit ellenőrzés, calendar esemény + meghívó |

**Rate limiting (3 szint):**

1. **Per-email 24 órás blokk** — egy email címről csak egy foglalás 24 óránként (`RATE_LIMITED` hiba)
2. **Globális napi limit** — maximum 5 foglalás naponta összesen (`DAILY_CAP_REACHED` hiba)
3. **Interjú dátum nyilvántartás** — ha egy napra már van foglalás, az egész nap eltűnik a választóból

A frontend a hibakódokat lokalizált üzenetekre fordítja (`bookErrRateLimited`, `bookErrDailyCap` locale kulcsok mind a 12 nyelven).

**Konfiguráció (Code.gs tetején):**

| Változó | Alapérték | Leírás |
|---------|-----------|--------|
| `SLOT_MINUTES` | 30 | Egy időpont hossza percben |
| `BUFFER_MINUTES` | 30 | Szünet minden megbeszélés után |
| `DAYS_AHEAD` | 21 | Hány napra előre mutasson időpontokat |
| `GLOBAL_DAILY_MAX` | 5 | Maximum foglalások száma naponta |
| `WORKING_HOURS` | 8-17 (H-P) | Munkaidő intervallumok naponként |

### Frontend — Booking Modal

A CV oldalon a foglalási felület `scripts/shared.js` `initBookingModal()` / `bookingModalHTML()` függvényeivel van implementálva:

1. **Dátum választás** — a GAS-től kapott szabad időpontok alapján nap-kártyák jelennek meg
2. **Időpont választás** — a kiválasztott nap szabad időpontjai
3. **Adatok megadása** — név, email, téma + Cloudflare Turnstile CAPTCHA
4. **Visszaigazolás** — sikeres foglalás esetén

Lokalizáció:
- A dátumok és napnevek `Intl.DateTimeFormat` API-val formázva a kiválasztott nyelven
- Fiktív nyelveknél (`kl`, `qu`, `goa`, `ya`, `asg`, `dot`) angol fallback
- Nyelváltáskor a dátumkártyák azonnal újrarenderelődnek
- Hibák modalban jelennek meg (nem `alert()`), a hibaüzenetek locale-váltáskor újrafordítódnak

Biztonság:
- Turnstile CAPTCHA kötelező a foglalás elküldéséhez (submit gomb disabled, amíg nincs elfogadva)
- E-mail domain validáció DNS-over-HTTPS-en keresztül (Cloudflare 1.1.1.1, MX rekord)
- Játék nézetben a modal lefagyasztja a motort (`isFrozen = true`), MutationObserver figyeli a bezárást

## AI munkafolyamat

A projekthez Claude Code skill-ek (slash parancsok) és agent-ek épültek, amelyek a fejlesztési, tartalom-karbantartási és álláspályázási munkafolyamatokat automatizálják.

### Képességek áttekintése

| Terület | Képesség | Leírás |
|---------|----------|--------|
| **Fordítások** | `/locale-check` | 12 nyelvi fájl szinkronizálásának ellenőrzése az angol referenciához képest. `--fix` automatikusan kiegészíti a hiányzó kulcsokat. |
| **Kódminőség** | `/code-review` | CV-specifikus kódreview: locale teljesség, aria kompatibilitás, biztonság, konfigurációs sértetlenség. |
| **Fordítási lektorálás** | `/language-reviewer` | 12 nyelv minőségi auditja a nyelvspecifikus szabályfájlok alapján. Csak jelent — nem javít automatikusan. |
| **Biztonság** | `/security-review` | Spam/flood audit a Hire Me és booking modálokon (Turnstile, cooldown, rate limiting). |
| **Architektúra** | `/arch-review` | Teljes kódbázis elemzés: templát duplikáció, adatstruktúra, locale rendszer, CSS, tooling. |
| **HR/ATS optimalizáció** | `/hr-review` | Általános vagy állásleírás-specifikus ATS minőségértékelés. Csak a meglévő skilleket emeli ki — nem talál ki újat. |
| **CV javítás** | `/cv-improver` | HR-review jelentés alapján módosítja a `cv-data.js`-t. Diff előnézetet mutat, mielőtt ír. |
| **Motivációs levél** | `/cover-letter` | Angol + magyar motivációs levél generálása a `profile/*.md` és `cv-data.js` alapján. |
| **Teljes álláspályázat** | `/job-apply` | Teljes pipeline: ATS elemzés → CV optimalizáció → 11 nyelvű fordítás → verzió snapshot (`job-description.md` angol + magyar + eredeti) → opcionális motivációs levél. |
| **Verziókezelés** | `/cv-backup` / `/cv-restore` | CV adatok verziózott snapshot készítése és visszaállítása a `cv-versions/` mappába. |

### Részletes dokumentáció

A skill-ek, agent-ek, azok adatfolyamai, valamint a teljes job-apply pipeline lépésenkénti leírása (Mermaid diagramokkal) a [devdocs/ai-workflow.md](devdocs/ai-workflow.md) dokumentumban található.

## Futtatás

```bash
npx http-server -p 8080 -c-1
```

A moduláris JS (`type="module"`) miatt HTTP-kiszolgáló szükséges — a `file://` protokoll CORS hibát dob.
