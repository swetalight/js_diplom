'use strict';

class Actor {
    pos;
    size;
    speed;

    constructor(pos = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {


        if (pos instanceof Vector === false) {
            throw new Error("position должен быть типом Vector")
        } else if (size instanceof Vector === false) {
            throw new Error("size должен быть типом Vector")
        } else if (speed instanceof Vector === false) {
            throw new Error("speed должен быть типом Vector")
        }
        this.pos = pos;
        this.size = size;
        this.speed = speed;
    }
    act() {
    }

    get type() {
        return 'actor';
    }

    get left() {
        return this.pos.x;
    }

    get right() {
        return this.pos.x + this.size.x;
    }

    get top() {
        return this.pos.y;
    }

    get bottom() {
        return this.pos.y + this.size.y
    }

    isIntersect(actor) {

        if (actor instanceof Actor === false || actor === "undefined") {
            throw new Error("Параметр actor должен быть типом Actor и не должен быть пустым");
        }
        if (actor === this) {
            return false;
        }

        return this.right > actor.left &&
            this.left < actor.right &&
            this.top < actor.bottom &&
            this.bottom > actor.top;
    }

    act() {

    }

}


class Fireball extends Actor {
    constructor(pos = new Vector(0, 0), speed = new Vector(0, 0)) {


        super(pos, new Vector(1, 1), speed);
    }

    get type() {
        return 'fireball';
    }

    getNextPosition(time = 1) {
        return new Vector(this.pos.x + this.speed.x * time, this.pos.y + this.speed.y * time);
    }

    handleObstacle() {
        this.speed.x = -this.speed.x;
        this.speed.y = -this.speed.y;
    }

    act(time, level) {
        if (level.obstacleAt(this.getNextPosition(time), this.size)) {
            this.handleObstacle();
        } else {
            this.pos = this.getNextPosition(time);
        }
    }
}


class Vector {
    x;
    y;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    plus(vector) {
        if (vector instanceof Vector === false) {
            throw new Error("Можно прибавлять к вектору только вектор типа Vector");
        }
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    times(number = 1) {
        return new Vector(this.x * number, this.y * number);
    }
}


class Level {

    grid;
    actors;
    player;
    height;
    width;
    status;
    finishDelay;

    constructor(grid = [], actors = []) {
        this.grid = grid;
        this.actors = actors;
        this.player = this.actors.find(actor => actor.type === 'player');
        this.height = this.grid.length;
        this.width = this.grid.reduce((a, b) => {
            return b.length > a ? b.length : a;
        }, 0);
        this.status = null;
        this.finishDelay = 1;
    }

    isFinished() {
        return this.status != null && this.finishDelay < 0;
    }

    actorAt(actor) {
        if (!(actor instanceof Actor) || !actor) {
            throw new Error("В качестве аргумента необходимо передать объект типа Actor");
        }

        if (!this.actors) {
            return undefined;
        } else {
            return this.actors.find(a => a.isIntersect(actor));
        }
    }


    obstacleAt(pos, size) {


        if (!(pos instanceof Vector) || !(size instanceof Vector)) {
            throw new Error('В obstacleAt передан объект другого типа');
        }
        let obj = new Actor(pos, size);

        if (obj.left < 0 || obj.right > this.width || obj.top < 0) {
             return 'wall';
        }

        if (obj.bottom > this.height) {
            return 'lava';
        }

        let left = Math.floor(obj.left);
        let right = Math.ceil(obj.right) ;



        let top = Math.floor(obj.top);
        let bottom = Math.ceil(obj.bottom);

        for (let y = top; y < bottom ; y++) {
            for (let x = left; x < right; x++) {
                if ( x > 1){
                    x = x + 1;
                }
                if (this.grid[y][x]) {

                    return this.grid[y][x];
                }
            }
        }
    }


    removeActor(actor) {
        this.actors = this.actors.filter(el => el !== actor);
    }

    noMoreActors(type) {
        if (this.actors) {
            for (let actor of this.actors) {
                if (actor.type === type) {
                    return false;
                }
            }
        }
        return true;
    }

    playerTouched(type, actor) {
        if (this.status === null) {
            if (type === 'lava' || type === 'fireball') {
                this.status = 'lost';
                return this.status;
            }
            if (type === 'coin') {
                this.removeActor(actor);
                if (this.noMoreActors('coin')) {
                    this.status = 'won';
                }
            }
        }
    }
}

class LevelParser {
    constructor(gameDic) {
        this.gameDic = gameDic;
    }

    actorFromSymbol(symbol) {
        if (!symbol) {
            return undefined;
        }
        return this.gameDic[symbol];
    }

    obstacleFromSymbol(symbol) {
        switch (symbol) {
            case 'x':
                return 'wall';
            case '!':
                return 'lava';
            default:
                return undefined;
        }
    }

    createGrid(stringsArr = []) {
        return stringsArr.map(item => {
            return item.split('').map(i => {
                return this.obstacleFromSymbol(i);
            });
        });
    }

    createActors(stringsArr = []) {
        const actors = [];
        const arr = stringsArr.map(string => string.split(''));

        arr.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (this.gameDic && this.gameDic[cell] && typeof this.gameDic[cell] === 'function') {
                    const actor = new this.gameDic[cell](new Vector(x, y));
                    if (actor instanceof Actor) {
                        actors.push(actor);
                    }
                }
            });
        });
        return actors;
    }

    parse(stringsArr = []) {
        const grid = this.createGrid(stringsArr);
        const actors = this.createActors(stringsArr);
        return new Level(grid, actors);
    }
}


class HorizontalFireball extends Fireball {
    constructor(pos) {
        super(pos);
        this.speed = new Vector(2, 0);
        this.size = new Vector(1, 1);
    }
}


class VerticalFireball extends Fireball {
    constructor(pos) {
        super(pos);
        this.speed = new Vector(0, 2);
        this.size = new Vector(1, 1);
    }
}


class Coin extends Actor {
    constructor(pos = new Vector(0, 0)) {
        super(pos.plus(new Vector(0.2, 0.1)), new Vector(0.6, 0.6));
        this.springSpeed = 8;
        this.springDist = 0.07;
        this.spring = Math.random() * Math.PI * 2;
        this.startPosition = new Vector(this.pos.x, this.pos.y);
    }

    get type() {
        return 'coin';
    }

    updateSpring(time = 1) {
        this.spring += this.springSpeed * time;
    }

    getSpringVector() {
        return new Vector(0, Math.sin(this.spring) * this.springDist);
    }

    getNextPosition(time = 1) {
        this.updateSpring(time);
        return this.startPosition.plus(this.getSpringVector());
    }

    act(time) {
        this.pos = this.getNextPosition(time);
    }
}


class Player extends Actor {
    constructor(pos = new Vector(0, 0)) {
        super(pos);
        this.pos = this.pos.plus(new Vector(0, - 0.5));
        this.size = new Vector(0.8, 1.5);
        this.speed = new Vector(0, 0);
    }

    get type() {
        return 'player';
    }
}


class FireRain extends Fireball {
    constructor(pos) {
        super(pos);
        this.speed = new Vector(0, 3);
        this.size = new Vector(1, 1);
        this.currentPos = pos;
    }

    handleObstacle() {
        this.pos = this.currentPos;
    }
}


// Вызываем промис
const schemas = [
    [
        '           ',
        '           ',
        '    =      ',
        '         o ',
        '       !xxx',
        '  @        ',
        '!xxxx!     ',
        '           '
    ],
    [
        '      v  ',
        '    v    ',
        '  v      ',
        '        o',
        '        x',
        '@   x    ',
        'x        ',
        '         '
    ]
];


const actorDict = {
    '@': Player,
    'v': FireRain,
    '=': HorizontalFireball,
    '|': VerticalFireball,
    'o': Coin
};

const parser = new LevelParser(actorDict);
runGame(schemas, parser, DOMDisplay)
    .then(() => console.log('Вы выиграли приз!'));