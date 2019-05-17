class Vector {
    x;
    y;

    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }

    plus (vector){
        if (vector instanceof Vector === false){
            throw new Error("Можно прибавлять к вектору только вектор типа Vector");
        }
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    times(number){
        return new Vector(this.x * number, this.y * number);
    }
}