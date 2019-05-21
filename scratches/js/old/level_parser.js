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
