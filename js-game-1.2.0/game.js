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
      throw new Error(`Аргумент не является экземпляром Vector`);
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
      throw new Error(`Аргумент не является экземпляром Vector`);
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
    if (!(Actor.prototype.isPrototypeOf(actor))) {
      throw new Error(`Аргумент не является экземпляром Actor`);
    }
    if (Object.is(this, actor)) // уточнить альтернативу
      return false;
    if ((this.right > actor.left && this.left < actor.right) && (this.bottom > actor.top && this.top < actor.bottom)) {
      return true;
    }
    return false;
  }
}

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

  actorAt(actor) {
    if (!actor || !(actor instanceof Actor)) {
      throw new Error('Аргумент "actorAt" не является экземпляром Actor или не задан')
    }
    return this.actors.find((val) => {
      return actor.isIntersect(val);
    });
  }

  obstacleAt(route, size) {
    if (!(route instanceof Vector && size instanceof Vector)) {
      throw new Error('Аргумент "obstacleAt" не является экземпляром Vector')
    }
    route.x = Math.ceil(route.x);
    route.y = Math.ceil(route.y);
    size.x = Math.ceil(size.x);
    size.y = Math.ceil(size.y);
    let test = new Actor(route, size);
    if (test.left < 0 || test.right > this.width || test.top < 0)
      return 'wall';
    else if (test.bottom > this.height)
      return 'lava';
    else
      return this.grid[test.pos.y][test.pos.x];
  }

  removeActor(actor) {
    this.actors.map((val, i) => {
      if (actor === val)
        this.actors.splice(i, 1);
    });
  }

  noMoreActors(type) {
    return !(this.actors.some((val) => {
      return val.type === type;
    }));
  }

  playerTouched(type, actor) {
    if (this.status !== null)
      return;
    if (type === 'lava' || type === 'fireball') {
      this.status = 'lost';
    }
    if (type === 'coin') {
      this.removeActor(actor);
      if (this.noMoreActors(type)) {
        this.status = 'won';
      }
    }
  }

}

class LevelParser {
  constructor(actorsDict) {
    this.dict = actorsDict;
  }

  actorFromSymbol(sym) {
    for (let i in this.dict) {
      if (sym === i)
        return this.dict[i];
    }
    return undefined;
  }

  obstacleFromSymbol(sym) {
    if (sym === 'x')
      return 'wall';
    else if (sym === '!')
      return 'lava';
    else
      return undefined;
  }
  createGrid(plan) {
    let grid = [];
    plan.forEach((val) => {
      let row = val.split('').map((key) => {
        return this.obstacleFromSymbol(key);
      });
      grid.push(row);
    });
    return grid;
  }
}


const plan = [
  ' @ ',
  'x!x'
];

const actorsDict = Object.create(null);
actorsDict['@'] = Actor;

const parser = new LevelParser(actorsDict);
let constr = parser.actorFromSymbol('@');
console.log(constr);
//const level = parser.parse(plan);
//
//level.grid.forEach((line, y) => {
//  line.forEach((cell, x) => console.log(`(${x}:${y}) ${cell}`));
//});
//
//level.actors.forEach(actor => console.log(`(${actor.pos.x}:${actor.pos.y}) ${actor.type}`));


//
//class Player extends Actor {
//  constructor(vector) {
//    super();
//    //this.type = 'player'
//  }
//}






















