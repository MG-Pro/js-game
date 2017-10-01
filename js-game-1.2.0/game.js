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

  createActors(plan) {
    let actors = [];
    if (!this.dict)
      return actors;
    plan.forEach((val, y) => {
      val.split('').forEach((key, x) => {
        let constr = this.actorFromSymbol(key);
        if (constr && (constr.prototype instanceof Actor || constr == Actor)) {
          actors.push(new constr(new Vector(x, y)));
        }
      });
    });
    return actors;
  }

  parse(plan) {
    return new Level(this.createGrid(plan), this.createActors(plan));
  }
}

class Fireball extends Actor {
  constructor(pos = new Vector(0, 0), speed = new Vector(0, 0)) {
    super();
    this.pos = pos;
    this.speed = speed;
    this.size = new Vector(1, 1);
    Object.defineProperty(this, 'type', {
      get: function () {
        return 'fireball';
      }
    });
  }

  getNextPosition(time = 1) {
    return new Vector(this.pos.x + this.speed.x * time, this.pos.y + this.speed.y * time);
  }

  handleObstacle() {
    this.speed.x *= -1;
    this.speed.y *= -1;
  }

  act(time, level) {
    let obstacle = level.obstacleAt(this.getNextPosition(time), this.size);
    if (!obstacle) {
      this.pos.x = this.pos.x + this.speed.x * time;
      this.pos.y = this.pos.y + this.speed.y * time;
    } else {
      this.handleObstacle();
    }
  }
}

class HorizontalFireball extends Fireball {
  constructor(pos) {
    super(pos);
    this.speed = new Vector(2, 0);
    if (pos)
      this.pos = pos;
  }
}

class VerticalFireball extends Fireball {
  constructor(pos) {
    super(pos);
    this.speed = new Vector(0, 2);
    if (pos)
      this.pos = pos;
  }
}

class FireRain extends Fireball {
  constructor(pos) {
    super(pos);
    this.speed = new Vector(0, 3);
    if (pos)
      this.pos = pos;
    this.startPos = new Vector(this.pos.x, this.pos.y);
  }

  handleObstacle() {
    this.pos.x = this.startPos.x;
    this.pos.y = this.startPos.y;
  }
}

class Coin extends Actor {
  constructor(pos) {
    super(pos);
    if (pos)
      this.pos = pos;
    this.size = new Vector(0.6, 0.6);
    this.pos = this.pos.plus(new Vector(0.2, 0.1));
    Object.defineProperty(this, 'type', {
      get: function () {
        return 'coin';
      }
    });
    this.springSpeed = 8;
    this.springDist = 0.07;
    this.spring = rand(0, 2* Math.PI);
    this.startPos = new Vector(this.pos.x, this.pos.y);
  }

  updateSpring(time = 1) {
    this.spring = this.spring + this.springSpeed * time;
  }

  getSpringVector() {
    return new Vector(0, Math.sin(this.spring) * this.springDist);
  }

  getNextPosition(time = 1) {
    this.spring += this.springSpeed * time;
    let a = this.startPos.plus(this.getSpringVector());
    return new Vector(a.x, a.y);
  }

  act(time) {
    let newPos = this.getNextPosition(time);
    this.pos.x = newPos.x;
    this.pos.y = newPos.y;
  }
}

class Player extends Actor {
  constructor(pos) {
    super(pos);
    Object.defineProperty(this, 'type', {
      get: function () {
        return 'player';
      }
    });
    if (pos)
      this.pos = pos;
    this.size = new Vector(0.8, 1.5);
    this.pos = this.pos.plus(new Vector(0, -0.5));
    this.speed = new Vector(0, 0);
  }
}



const grid = [
  new Array(3),
  ['wall', 'wall', 'lava']
];
const level = new Level(grid);
runLevel(level, DOMDisplay);


























