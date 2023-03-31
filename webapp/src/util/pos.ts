import { Matrix4, Vector3 } from "three"

export enum PosType {
    // node reference
    Node,
    // mapblock reference
    Mapblock
}

export class Pos<T extends PosType> {
    constructor(public readonly x: number, public readonly y: number, public readonly z: number) {}

    add(p: Pos<T>): Pos<T> {
        return new Pos<T>(this.x+p.x, this.y+p.y, this.z+p.z)
    }

    subtract(p: Pos<T>): Pos<T> {
        return new Pos<T>(this.x-p.x, this.y-p.y, this.z-p.z)
    }

    divide(p: Pos<T>): Pos<T> {
        return new Pos<T>(this.x/p.x, this.y/p.y, this.z/p.z)
    }

    multiply(p: Pos<T>): Pos<T> {
        return new Pos<T>(this.x*p.x, this.y*p.y, this.z*p.z)
    }

    floor(): Pos<T> {
        return new Pos<T>(
            Math.floor(this.x),
            Math.floor(this.y),
            Math.floor(this.z)
        )
    }

    toString(): string {
        return `${this.x}/${this.y}/${this.z}`;
    }
}

export function toMapblock(p: Pos<PosType.Node>): Pos<PosType.Mapblock> {
    const mbp = p.divide(MapblockSize)
    return new Pos<PosType.Mapblock>(mbp.x, mbp.y, mbp.z).floor()
}

// threejs coord system (z-axis inverted)
export function toMatrix4(p: Pos<PosType.Node>): Matrix4 {
    return new Matrix4().makeTranslation(p.x, p.y, p.z * -1)
}

export function toVector3(p: Pos<PosType.Node>): Vector3 {
    return new Vector3(p.x, p.y, p.z * -1)
}

export function getNodeRegion(p: Pos<PosType.Mapblock>): [Pos<PosType.Node>, Pos<PosType.Node>] {
    const mb = p.multiply(MapblockSize)
    const mbp = new Pos<PosType.Node>(mb.x, mb.y, mb.z)
    return [
        mbp,
        mbp.add(MapblockSize).subtract(NodeSize)
    ]
}

export const MapblockSize = new Pos<PosType.Node>(16,16,16)
export const NodeSize = new Pos<PosType.Node>(1,1,1)

export function Iterator<T extends PosType>(p1: Pos<T>, p2: Pos<T>): Array<Pos<T>> {
    const a = new Array<Pos<T>>
    for (let x=p1.x; x<=p2.x; x++) {
        for (let y=p1.y; y<=p2.y; y++) {
            for (let z=p1.z; z<=p2.z; z++) {
                a.push(new Pos<T>(x,y,z))
            }
        }
    }
    return a
}

export const MapblockStartNode = new Pos<PosType.Node>(0,0,0)
export const MapblockEndNode = new Pos<PosType.Node>(15,15,15)

export const MapblockPositions = Iterator(MapblockStartNode, MapblockEndNode)

// TODO: check
export const Directions = {
    Y_POS: new Pos<PosType.Node>(0,1,0),
    Y_NEG: new Pos<PosType.Node>(0,-1,0),
    X_POS: new Pos<PosType.Node>(1,0,0),
    Z_POS: new Pos<PosType.Node>(0,0,1),
    X_NEG: new Pos<PosType.Node>(-1,0,0),
    Z_NEG: new Pos<PosType.Node>(0,0,-1)
}

export const CardinalNodeDirections = [
    Directions.Y_POS,
    Directions.Y_NEG,
    Directions.X_POS,
    Directions.Z_POS,
    Directions.X_NEG,
    Directions.Z_NEG
]