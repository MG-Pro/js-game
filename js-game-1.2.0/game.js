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

const start = new Vector(30, 50);
const moveTo = new Vector(5, 10);
const finish = start.plus(moveTo.times(2));
let a = {};
start.plus(a);

console.log(`Исходное расположение: ${start.x}:${start.y}`);
console.log(`Текущее расположение: ${finish.x}:${finish.y}`);
