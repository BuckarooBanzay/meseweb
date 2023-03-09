
export class Pos {
    constructor(public x: number, public y: number, public z: number) {}

    add(p: Pos): Pos {
        return new Pos(this.x+p.x, this.y+p.y, this.z+p.z)
    }

    toString(): string {
        return `${this.x}/${this.y}/${this.z}`;
    }
}

export function Iterator(p1: Pos, p2: Pos): Array<Pos> {
    const a = new Array<Pos>
    for (let x=p1.x; x<=p2.x; x++) {
        for (let y=p1.y; y<=p2.y; y++) {
            for (let z=p1.z; z<=p2.z; z++) {
                a.push(new Pos(x,y,z))
            }
        }
    }
    return a
}

export const MapblockPositions = Iterator(new Pos(0,0,0), new Pos(15,15,15))