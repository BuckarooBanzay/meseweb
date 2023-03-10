
// generic position
export class Pos {
    constructor(public x: number, public y: number, public z: number) {}

    add(p: Pos): Pos {
        return new Pos(this.x+p.x, this.y+p.y, this.z+p.z)
    }

    subtract(p: Pos): Pos {
        return new Pos(this.x-p.x, this.y-p.y, this.z-p.z)
    }

    divide(p: Pos): Pos {
        return new Pos(this.x/p.x, this.y/p.y, this.z/p.z)
    }

    multiply(p: Pos): Pos {
        return new Pos(this.x*p.x, this.y*p.y, this.z*p.z)
    }

    floor(): Pos {
        return new Pos(
            Math.floor(this.x),
            Math.floor(this.y),
            Math.floor(this.z)
        )
    }

    toString(): string {
        return `${this.x}/${this.y}/${this.z}`;
    }
}

// mapblock position
export class MapblockPos extends Pos {
    static from(p: Pos): MapblockPos {
        return new MapblockPos(p.x, p.y, p.z)
    }

    getNodeRegion(): [NodePos, NodePos] {
        const mb = this.multiply(MapblockSize)
        return [
            NodePos.from(mb),
            NodePos.from(mb.add(MapblockSize).subtract(NodeSize))
        ]
    }
}

// node position
export class NodePos extends Pos {
    static from(p: Pos): NodePos {
        return new NodePos(p.x, p.y, p.z)
    }

    getMapblockPos(): MapblockPos {
        return MapblockPos.from(this.divide(MapblockSize).floor())
    }
}

export const MapblockSize = new Pos(16,16,16)
export const NodeSize = new Pos(1,1,1)

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

export const MapblockStartNode = new NodePos(0,0,0)
export const MapblockEndNode = new NodePos(15,15,15)

export const MapblockPositions = Iterator(MapblockStartNode, MapblockEndNode)