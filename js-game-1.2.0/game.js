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
    if (!(actor instanceof Actor)) {
      throw new Error(`Аргумент не является экземпляром Actor`);
    }
    if(Object.is(this, actor)) // уточнить альтернативу
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
    if(!actor || !(actor instanceof Actor)) {
      throw new Error('Аргумент не является экземпляром Actor или не задан')
    }

    let a = this.actors.find((val) => {
      actor.isIntersect(val);

    });
    return a;

  }

}



const grid = [
  [undefined, undefined],
  ['wall', 'wall']
];

function MyCoin(title) {
  this.type = 'coin';
  this.title = title;
}
MyCoin.prototype = Object.create(Actor);
MyCoin.constructor = MyCoin;

const goldCoin = new MyCoin('Золото');
const bronzeCoin = new MyCoin('Бронза');
const player = new Actor();
const fireball = new Actor();

const level = new Level(undefined, [ goldCoin, bronzeCoin, player, fireball ]);

//level.playerTouched('coin', goldCoin);
//level.playerTouched('coin', bronzeCoin);

//if (level.noMoreActors('coin')) {
//  console.log('Все монеты собраны');
//  console.log(`Статус игры: ${level.status}`);
//}

//const obstacle = level.obstacleAt(new Vector(1, 1), player.size);
//if (obstacle) {
//  console.log(`На пути препятствие: ${obstacle}`);
//}

//const otherActor = level.actorAt(player);
//if (otherActor === fireball) {
//  console.log('Пользователь столкнулся с шаровой молнией');
//}



class Player extends Actor {
  constructor(vector) {
    super();
    //this.type = 'player'
  }
}





// Shape — суперкласс
function Shape() {
  this.x = 0;
  this.y = 0;
}

// метод суперкласса
Shape.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
  console.info('Фигура переместилась.');
};

// Rectangle — подкласс
function Rectangle() {
  Shape.call(this); // вызываем конструктор суперкласса
}

// подкласс расширяет суперкласс
Rectangle.prototype = Object.create(Shape);
Rectangle.prototype.constructor = Rectangle;

var rect = new Rectangle();

console.log('Является ли rect экземпляром Rectangle? ' + (rect instanceof Rectangle)); // true
console.log('Является ли rect экземпляром Shape? ' + (rect instanceof Shape)); // true
rect.move(1, 1); // выведет 'Фигура переместилась.'























