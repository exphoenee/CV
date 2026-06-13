# Reszponzivitás szabályok

## Alapelv

Minden CV nézet oldal mobilon, tableten és desktopon is teljes értékűen, kényelmesen használható kell legyen.
Mobile-first megközelítés: az alap stílus mobilra vonatkozik, a nagyobb képernyőkre `min-width` media query-kkel bővítünk.

## Töréspontok

```css
/* Mobile — alap (nincs media query) */
/* max ~600px */

/* Tablet */
@media (min-width: 601px) and (max-width: 900px) { ... }

/* Desktop */
@media (min-width: 901px) { ... }
```

## Elvárások nézetenként

### Minden oldalon

- A szövegek mobilon is olvashatóak (min. 14px)
- Gombok érintőbarátok (min. 44×44px touch target)
- Horizontális scroll kerülendő (kivéve intentionálisan scrollozható konténerek, pl. Gantt)
- A modálok (Hire Me, Meet) mobilon is teljes szélességben, görgethetően nyílnak meg
- A zenelejátszó panel mobilon sem takarja a tartalmat

### Index oldal (karuszel)

- A kártyák mobilon egymás alatt, teljes szélességben jelennek meg, vagy a karuszel egy kártyát mutat egyszerre
- A nyilak és dot-ok navigálhatók érintéssel

### Plain nézet

- Nyomtatásra optimalizált layout (`@media print`) — a témától függetlenül fekete-fehér nyomtatás
- A témaválasztó és a fejléc gombok mobilon összecsukódnak vagy stackelődnek

### Gantt nézet

- A Gantt-diagram vízszintesen görgethető konténerben van — ez szándékos
- A bal oldali névoszlop (`SIDEBAR_W`) mobilon szűkíthető vagy fix, de látható marad
- A fejléc (kontaktok, gombok) mobilon stackelődik

### Scrumboard nézet

- Az oszlopok mobilon egymás alá stackelődnek (flex-direction: column)
- A kártyák teljes szélességűek mobilon

### Swagger nézet

- Az endpoint blokkok összecsukhatók — mobilon összecsukvák az alapértelmezés
- A params-table horizontálisan görgethető ha szükséges

### JSON nézet

- A sorszámozás mobilon elrejthető ha helyet nyerne
- A fold/unfold gombok érintéssel is jól kezelhetők

### Játék nézet

- NippleJS joystick mobilon automatikusan megjelenik
- Orientáció figyelmeztetés landscape módban ha szükséges

## CSS változók és téma

A `styles/cv-index.css` tartalmaz közös CSS változókat (téma, modal, toast stílusok).
Minden nézet-specifikus CSS fájl erre épít — ne duplikáld a változók definícióját.

## Accessibility

- `aria-label` attribútumok minden interaktív elemre
- `role` attribútumok lista, dialog, navigation elemekre
- Billentyűzettel navigálható (Tab, Enter, Escape modál bezárásra)
- Kontrasztarány minimum 4.5:1 szövegeknél minden témán

## Amit kerülj

- Fixált `px` szélességek a fő layout konténerekre — használj `%`, `vw`, `max-width`-t
- `overflow: hidden` az egész body-ra — törhetné a modálok görgethetőségét mobilon
- Kis érintési célterületek (`< 44px`) gombokon
- Tört elrendezés orientáció-váltáskor
