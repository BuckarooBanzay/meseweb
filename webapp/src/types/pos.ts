
export class Pos {
    constructor(public X: number, public Y: number, public Z: number) {}

    add(pos: Pos){
        return new Pos(this.X+pos.X, this.Y+pos.Y, this.Z+pos.Z)
    }
}