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
