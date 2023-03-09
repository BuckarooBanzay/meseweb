import { NodeDefinition, NodeDrawType } from "../nodedefs/NodeDefinition";
import { Iterator, MapblockPositions, Pos } from "../util/pos";
import { ChunkedView } from "./ChunkedView";
import { BlockDataProvider, MaterialProvider } from "./types";

// TODO: check
const Directions = {
    UP: new Pos(0,1,0),
    DOWN: new Pos(0,-1,0),
    NORTH: new Pos(1,0,0),
    EAST: new Pos(0,0,1),
    SOUTH: new Pos(0,-1,0),
    WEST: new Pos(0,0,-1)
}

const CardinalDirections = [
    Directions.UP,
    Directions.DOWN,
    Directions.NORTH,
    Directions.EAST,
    Directions.SOUTH,
    Directions.WEST
]


export class ChunkedViewManager {

    constructor(public bdp: BlockDataProvider, public mp: MaterialProvider, public nodedefs: Map<number, NodeDefinition>) {

        // populate transparent node-id map
        nodedefs.forEach((def, id) => {
            if (def.drawType == NodeDrawType.NDT_AIRLIKE) {
                this.transparentNodeIds.set(id, true)
            }
        })
    }

    transparentNodeIds = new Map<number, boolean>

    isVisible() {
        // TODO
        CardinalDirections.some(p => {
            return true
        })
    }

    create(pos1: Pos, pos2: Pos): Promise<ChunkedView> {
        const cv = new ChunkedView(pos1, pos2)
    
        Iterator(pos1, pos2).forEach(p => {
            const b = this.bdp.getBlockdata(p)
            if (!b) {
                return
            }

            MapblockPositions.forEach(nodepos => {

                CardinalDirections.forEach(cd => {
                    //TODO
                })
            })
        });

        const nd = this.nodedefs.get(1)!
        const m = this.mp.getMaterial(nd.tileDefs[0].name)
    
        // TODO: create needed meshes
        
    
        return Promise.resolve(cv)
    }

}