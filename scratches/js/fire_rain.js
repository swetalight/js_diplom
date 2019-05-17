
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