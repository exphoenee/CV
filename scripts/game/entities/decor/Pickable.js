import DecorObject from '../base/DecorObject.js';

/**
 * Pickable.js
 * Base class for items that can be collected by the player.
 * They have a collision box for overlap detection, but solid=false
 * so they don't block movement. When picked up, they disappear.
 *
 * Subclasses can override onPickup() to implement item-specific logic.
 */
export default class Pickable extends DecorObject {
    constructor(opts) {
        super({
            ...opts,
            solid: false,
        });

        this.pickable = true;    // flag for engine pickup detection
        this.collected = false;
    }

    /**
     * Called by the engine when the player overlaps this item.
     * Returns true if the item was actually collected.
     * @param {object} player
     */
    onPickup(player) {
        if (this.collected) return false;
        this.collected = true;
        return true;
    }

    draw(ctx, camera) {
        if (this.collected) return;
        super.draw(ctx, camera);
    }
}
