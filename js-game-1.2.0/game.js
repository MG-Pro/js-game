'use strict';

//loadLevels()
//  .then(result => {
//    return JSON.parse(result);
//  });

class Vector {
  constructor(startX = 0, startY = 0) {
    this.x = startX;
    this.y = startY;
  }

  plus(vector) {
    if (!(vector instanceof Vector)) {
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
    if (!(pos instanceof Vector && size instanceof Vector && speed instanceof Vector)) {
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
    //Object.defineProperty(this, 'type', {
    //  value: 'actor',
    //  writable: true,
    //  configurable: true
    //});

  }

  get type() {
    return 'actor';
  }

  act() {
    return true;
  }

  isIntersect(actor) {
    if (!(actor instanceof Actor)) {
      throw new Error(`Аргумент не является прототипом Actor`);
    }
    if(Object.is(this, actor)) // уточнить альтернативу
      return false;
    if ((this.right > actor.left && this.left < actor.right) && (this.bottom > actor.top && this.top < actor.bottom)) {
      return true;
    }
    return false;
  }
}

const items = new Map();
const player = new Actor();
items.set('Игрок', player);
items.set('Первая монета', new Actor(new Vector(10, 10)));
items.set('Вторая монета', new Actor(new Vector(15, 5)));

function position(item) {
  return ['left', 'top', 'right', 'bottom']
    .map(side => `${side}: ${item[side]}`)
    .join(', ');
}

function movePlayer(x, y) {
  player.pos = player.pos.plus(new Vector(x, y));
}

function status(item, title) {
  console.log(`${title}: ${position(item)}`);
  if (player.isIntersect(item)) {
    console.log(`Игрок подобрал ${title}`);
  }
}

items.forEach(status);
movePlayer(10, 10);
items.forEach(status);
movePlayer(5, -5);
items.forEach(status);


class Level {
  constructor(grid = [], actors = []) {
    this.grid = grid;
    this.actors = actors;
    this.status = null;
    this.finishDelay = 1;
    actors.some((val) => {
      if (val.type === 'player') {
        this.player = val;
        return true;
      }
    });
  }

  get height() {
    return this.grid.length;
  }

  get width() {
    return this.grid.reduce((max, val) => {
      return max < val.length ? val.length : max;
    }, 0);
  }

  isFinished() {
    return this.status !== null && this.finishDelay < 0 ? true : false;
  }


}


class Player extends Actor {
  constructor(vector) {
    super();
    //this.type = 'player'
  }
}

console.log(new Actor());
let pl = new Player();
const level = new Level([], [pl]).isFinished();
console.log(level);



























