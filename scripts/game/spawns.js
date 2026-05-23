/**
 * spawns.js
 * Spawn coordinates for player, npcs, enemies, and decorative objects.
 */
export const ENTITY_SPAWNS = {
    player: { x: 100, y: 220 },
    npcs: [
        { type: 'Chicken', x: 260, y: 250 },
        { type: 'Cow', x: 500, y: 220 },
        { type: 'Pig', x: 800, y: 240 },
        { type: 'Sheep', x: 1050, y: 230 }
    ],
    enemies: [
        { type: 'Skeleton', x: 600, y: 250 },
        { type: 'Skeleton', x: 1100, y: 240 },
        { type: 'Skeleton', x: 800, y: 450 }
    ],
    decorations: [
        // Trees
        { type: 'Tree', x: 50, y: 60 },
        { type: 'Tree', x: 300, y: 50 },
        { type: 'Tree', x: 540, y: 50 },
        { type: 'Tree', x: 780, y: 50 },
        { type: 'Tree', x: 1020, y: 50 },
        { type: 'Tree', x: 1250, y: 60 },
        
        // Fences
        { type: 'Fence', x: 130, y: 160 },
        { type: 'Fence', x: 270, y: 160 },
        { type: 'Fence', x: 370, y: 160 },
        { type: 'Fence', x: 510, y: 160 },
        { type: 'Fence', x: 610, y: 160 },
        { type: 'Fence', x: 750, y: 160 },
        
        // Chests
        { type: 'Chest', x: 120, y: 210 },
        { type: 'Chest', x: 1200, y: 220 }
    ]
};
