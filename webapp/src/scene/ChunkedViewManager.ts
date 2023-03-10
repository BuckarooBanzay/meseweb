import { NodeDefinition, NodeDrawType } from "../nodedefs/NodeDefinition";
import { Iterator, MapblockPositions, Pos, PosType } from "../util/pos";
import { ChunkedView } from "./ChunkedView";
import { MaterialProvider } from "./types";
import { WorldMap } from "./WorldMap";

// TODO: check
const Directions = {
    UP: new Pos<PosType.Node>(0,1,0),
    DOWN: new Pos<PosType.Node>(0,-1,0),
    NORTH: new Pos<PosType.Node>(1,0,0),
    EAST: new Pos<PosType.Node>(0,0,1),
    SOUTH: new Pos<PosType.Node>(0,-1,0),
    WEST: new Pos<PosType.Node>(0,0,-1)
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

    constructor(public wm: WorldMap, public mp: MaterialProvider, public nodedefs: Map<number, NodeDefinition>) {

        // populate transparent node-id map
        nodedefs.forEach((def, id) => {
            if (def.drawType == NodeDrawType.NDT_AIRLIKE) {
                this.transparentNodeIds.set(id, true)
            }
        })
    }

    transparentNodeIds = new Map<number, boolean>


    create(pos1: Pos<PosType.Mapblock>, pos2: Pos<PosType.Mapblock>): Promise<ChunkedView> {
        const cv = new ChunkedView(pos1, pos2)
    
        Iterator(pos1, pos2).forEach(p => {
            const b = this.wm.getBlock(p)
            if (!b) {
                return
            }

            MapblockPositions.forEach(nodepos => {
                const nodeid = b.getNodeID(nodepos)
                const nodedef = this.nodedefs.get(nodeid)!
                if (nodedef.drawType == NodeDrawType.NDT_AIRLIKE) {
                    return
                }

                if (nodedef.drawType != NodeDrawType.NDT_NORMAL) {
                    // TODO: only handle "normal" nodedrawtypes for now
                    return
                }

                CardinalDirections.forEach(cd => {
                    const neighbor_pos = nodepos.add(cd)
                    // TODO: overlap into other mapblocks
                    const neighbor_nodeid = b.getNodeID(neighbor_pos)
                })
            })
        });

        const nd = this.nodedefs.get(1)!
        const m = this.mp.getMaterial(nd.tileDefs[0].name)
    
        // TODO: create needed meshes
        
    
        return Promise.resolve(cv)
    }

}