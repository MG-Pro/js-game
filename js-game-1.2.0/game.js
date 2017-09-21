'use strict';

loadLevels()
  .then(result => {
    return JSON.parse(result);
  });

class Vector {
  constructor(startX = 0, startY = 0) {
    this.x = startX;
    this.y = startY;
  }
  plus(vector) {
    if(!(vector instanceof Vector)) {
      throw new Error(`Аргумент не является прототипом Vector`);
    }
    let newVector = new Vector(this.x, this.y);
    newVector.x += vector.x;
    newVector.y += vector.y;
    return newVector;
  }
  times(mult) {
    let newVector = new Vector(this.x, this.y);
    newVector.x *= mult;
    newVector.y *= mult;
    return newVector;
  }
}

class Actor {
  constructor(pos = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {
    if(!(pos instanceof Vector && size instanceof Vector && speed instanceof Vector)) {
      throw new Error(`Аргумент не является прототипом Vector`);
    }
    this.pos = pos;
    this.size = size;
    this.speed = speed;
    Object.defineProperty(this, 'left', {
      get: () => {
        return this.pos.x;
      }
    });
    Object.defineProperty(this, 'top', {
      get: () => {
        return this.pos.y;
      }
    });
    Object.defineProperty(this, 'right', {
      get: () => {
        return this.pos.x + this.size.x;
      }
    });
    Object.defineProperty(this, 'bottom', {
      get: () => {
        return this.pos.y + this.size.y;
      }
    });
    Object.defineProperty(this, 'type', {
      value: 'actor'
      }
    );
  }
  act() {
    return true;
  }

  isIntersect(actor) {
    if(!(actor instanceof Actor)) {
      throw new Error(`Аргумент не является прототипом Actor`);
    }
    if(this.left === actor.left && this.top === actor.top && this.right === actor.right && this.bottom === actor.bottom) {
      return false;
    }

    if(this.left > actor.right)
      return true;
    else if(this.top < actor.bottom)
      return true;
    else if(this.right < actor.left)
      return true;
    else if(this.bottom < actor.top)
      return true;
    else
      return false;

  }
}
let position = new Vector(10,10);
let size = new Vector(1,1);
const player = new Actor(new Vector(0, 0));
const coin = new Actor(new Vector(100, 100));
const notIntersected = player.isIntersect(coin);

