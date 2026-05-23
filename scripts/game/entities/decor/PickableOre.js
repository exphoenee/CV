import Pickable from './Pickable.js';

const SHEET = './assets/sprites/Cute/Outdoor decoration/Outdoor_Decor_Free.png';

// Row 4 (sy=64): col 0 = ore, col 1 = stone ore, col 2 = brick ore
const TYPES = {
    ore:   { spriteX:  0, spriteY: 64 },
    stone: { spriteX: 16, spriteY: 64 },
    brick: { spriteX: 32, spriteY: 64 },
};

/**
 * PickableOre.js
 * Pickable raw resource lumps (ore / stone / brick).
 * Have a collision box for pickup detection, do not block movement.
 *
 * @param {'ore'|'stone'|'brick'} type
 */
export default class PickableOre extends Pickable {
    constructor({ x, y, type = 'ore' }) {
        const t = TYPES[type] ?? TYPES.ore;
        super({
            x,
            y,
            drawWidth: 32,
            drawHeight: 32,
            spriteX: t.spriteX,
            spriteY: t.spriteY,
            spriteW: 16,
            spriteH: 16,
            imageSrc: SHEET,
            collisionBox: { offsetX: 8, offsetY: 8, width: 16, height: 16 }
        });

        this.oreType = type;
    }
}
