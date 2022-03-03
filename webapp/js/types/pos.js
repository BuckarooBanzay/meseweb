
export class Pos {
    constructor(X,Y,Z) {
        this.X = X;
        this.Y = Y;
        this.Z = Z;
    }

    add(pos){
        return new Pos(this.X+pos.X, this.Y+pos.Y, this.Z+pos.Z);
    }
}