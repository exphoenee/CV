/**
 * map.js
 * Map grid configuration.
 */
export const TILE_TYPES = {
    'G': { src: './assets/sprites/Cute/Tiles/Grass_Middle.png', solid: false },
    'P': { src: './assets/sprites/Cute/Tiles/Path_Middle.png', solid: false },
    'W': { src: './assets/sprites/Cute/Tiles/Water_Middle.png', solid: true }
};

export const TILE_SIZE = 48; // Scale 16x16 up by 3x

// 30 columns x 20 rows grid
export const MAP_GRID = [
    ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W'],
    ['W','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','W'],
    ['W','G','G','H','H','G','G','G','H','H','G','G','G','H','H','G','G','G','H','H','G','G','G','H','H','G','G','G','G','W'],
    ['W','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','W'],
    ['W','P','P','P','P','P','P','P','P','P','P','P','P','P','P','P','P','P','P','P','P','P','P','P','P','P','P','P','G','W'],
    ['W','G','G','G','G','G','G','G','G','G','G','G','P','G','G','G','G','G','G','G','G','G','G','G','G','G','G','P','G','W'],
    ['W','G','G','G','G','G','G','G','G','G','G','G','P','G','G','G','G','G','G','G','G','G','G','G','G','G','G','P','G','W'],
    ['W','G','G','H','H','G','G','G','H','H','G','G','P','G','G','G','H','H','G','G','G','H','H','G','G','G','G','P','G','W'],
    ['W','G','G','G','G','G','G','G','G','G','G','G','P','G','G','G','G','G','G','G','G','G','G','G','G','G','G','P','G','W'],
    ['W','G','G','G','G','G','G','G','G','G','G','G','P','P','P','P','P','P','P','P','P','P','P','P','P','P','P','P','G','W'],
    ['W','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','W'],
    ['W','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','W'],
    ['W','W','W','W','W','W','W','W','W','W','W','W','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','W'],
    ['W','G','G','G','G','G','G','G','G','G','G','W','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','W'],
    ['W','G','G','G','G','G','G','G','G','G','G','W','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','W'],
    ['W','G','G','G','G','G','G','G','G','G','G','W','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','W'],
    ['W','G','G','G','G','G','G','G','G','G','G','W','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','W'],
    ['W','G','G','G','G','G','G','G','G','G','G','W','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','W'],
    ['W','G','G','G','G','G','G','G','G','G','G','W','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','W'],
    ['W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W','W']
];
