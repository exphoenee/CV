import GameObject from '../base/GameObject.js';

export default class Tree extends GameObject {
    constructor({ x, y }) {
        super({
          x,
          y,
          width: 64,
          height: 80,
          spriteWidth: 64,
          spriteHeight: 80,
          imageSrc: "./assets/sprites/Cute/Outdoor decoration/Oak_Tree.png",
          solid: true,
          ySortOffset: 0,
          collisionBox: {
            offsetX: 25,
            offsetY: 54,
            width: 14,
            height: 10, // Only the trunk base blocks movement
          },
        });
    }
}
