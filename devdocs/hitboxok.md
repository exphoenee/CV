# Hitboxok (collisionBox)

Minden `GameObject`-nek van egy `collisionBox`-a, ami a fizikai ütközési téglalapot határozza meg.

## Definíció

```js
collisionBox: {
    offsetX: number,   // eltolás X-ben az objektum bal felső sarkától
    offsetY: number,   // eltolás Y-ben az objektum bal felső sarkától
    width: number,     // hitbox szélessége
    height: number     // hitbox magassága
}
```

## Példák

| Objektum | Hitbox | Magyarázat |
|---|---|---|
| **Sign** | `{ offsetX: 6, offsetY: 14, width: 20, height: 16 }` | Csak a tábla alsó része blokkol, a „karó" nem |
| **Tree** | `{ offsetX: 10, offsetY: 36, width: 12, height: 10 }` | Csak a törzs töve akadály, a lombon át lehet menni |
| **SmallTree** | `{ offsetX: 10, offsetY: 36, width: 12, height: 10 }` | Ugyanaz, mint a nagy fánál |
| **House** | Az ajtó előtti keskeny sáv | A ház teljes sprite-ja nem blokkol, csak az ajtó előtti sáv |

## Nulla hitbox (nincs ütközés)

Ha egy objektumnak **nem kell hitbox**, állítsd nullára:

```js
collisionBox: { offsetX: 0, offsetY: 0, width: 0, height: 0 }
```

Példa: `Flower`, `Mushroom`, `Plant`, `DecorStone`, `Leaf`, `Stump` stb. — ezek `solid: false` + 0-s hitbox.

## Hogyan látsd őket?

1. Nyisd meg a játékot
2. Nyomj **F3**-at (debug mód bekapcsol)
3. Minden objektum körül egy **piros keret** jelzi a hitboxot
4. Ha a keret 0 méretű (vagy nem látszik), az objektumnak nincs fizikai ütközése

## Hitbox javítása

- Ha egy objektum blokkolja a játékost, de nem kéne: csökkentsd a `collisionBox` méretét, vagy állítsd `width: 0, height: 0`-ra
- Ha egy objektumon át lehet menni, de nem kéne: növeld a hitboxot, vagy adj hozzá `collisionBox`-ot
- **Trükk**: rajzoltasd ki a sprite-ot, és add meg a hitbox-ot úgy, hogy a sprite vizuális határaihoz illeszkedjen

## Fontos

- `solid: false` esetén `collidesWith()` mindig `false`-t ad, függetlenül a `collisionBox`-tól
- `solid: true` + nem nulla hitbox = a játékos nem tud átmenni rajta
- A `getCollisionRect()` a `this.x + offsetX`-szel számol, vagyis a hitbox a GameObject pozíciójához képest van eltolva
