/**
 * spawns.js
 * Spawn coordinates for player, npcs, enemies, and decorative objects.
 */
export const ENTITY_SPAWNS = {
  player: {x: 100, y: 220},
  npcs: [
    {type: "Chicken", x: 260, y: 250},
    {type: "Chicken", x: 230, y: 260},
    {type: "Chicken", x: 210, y: 270},
    {type: "Cow", x: 500, y: 220},
    {type: "Cow", x: 827, y: 762},
    {type: "Pig", x: 888, y: 764},
    {type: "Pig", x: 800, y: 240},
    {type: "Sheep", x: 1050, y: 230},
    {type: "Sheep", x: 810, y: 165},
    {type: "Sheep", x: 830, y: 130},
  ],
  enemies: [
    {type: "Skeleton", x: 600, y: 250},
    {type: "Skeleton", x: 1100, y: 240},
    {type: "Skeleton", x: 800, y: 450},
    {type: "Skeleton", x: 395, y: 720},
    {type: "Skeleton", x: 204, y: 687},
    {type: "Skeleton", x: 284, y: 494},
  ],
  decorations: [
    // Trees
    {type: "Tree", x: 70, y: 100},
    {type: "Tree", x: 300, y: 80},
    {type: "Tree", x: 540, y: 90},
    {type: "Tree", x: 780, y: 85},
    {type: "Tree", x: 1020, y: 100},
    {type: "Tree", x: 320, y: 320},
    {type: "Tree", x: 310, y: 370},
    {type: "Tree", x: 362, y: 343},
    {type: "Tree", x: 337, y: 390},
    {type: "Tree", x: 648, y: 390},
    {type: "Tree", x: 714, y: 302},
    {type: "Tree", x: 1001, y: 534},
    {type: "Tree", x: 1045, y: 582},
    {type: "Tree", x: 963, y: 592},
    {type: "Tree", x: 1077, y: 562},
    {type: "Tree", x: 1079, y: 615},
    {type: "Tree", x: 1019, y: 653},

    // Chests
    {type: "Chest", x: 120, y: 210},
    {type: "Chest", x: 1200, y: 220},
    {type: "Chest", x: 973, y: 738},
  ],
};
