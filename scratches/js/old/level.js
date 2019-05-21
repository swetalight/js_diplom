

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
    isFinished(){
        return this.status != null && this.finishDelay < 0;
    }

    actorAt(actor) {
        if (!(actor instanceof Actor) || !actor) {
            throw new Error("В качестве аргумента необходимо передать объект типа Actor");
        }

        if (!this.actors) {
            return undefined;
        }
        else {
            return this.actors.find(a => a.isIntersect(actor));
        }
    }


    obstacleAt(pos, size) {
        if (!(pos instanceof Vector) || !(size instanceof Vector)) {
            throw new Error(`В качестве аргумента можно передавать только вектор типа Vector`);
        }
        const leftBorder = Math.floor(pos.x);
        const rightBorder = Math.ceil(pos.x + size.x);
        const topBorder = Math.floor(pos.y);
        const bottomBorder = Math.ceil(pos.y + size.y);

        if (leftBorder < 0 || rightBorder > this.width || topBorder < 0) {
            return 'wall';
        }
        if (bottomBorder > this.height) {
            return 'lava';
        }

        for (let i = topBorder; i < bottomBorder; i++) {
            for (let j = leftBorder; j < rightBorder; j++) {
                if (this.grid[i][j]) {
                    return this.grid[i][j];
                } else {
                    return undefined;
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