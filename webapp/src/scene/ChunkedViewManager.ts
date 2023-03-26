import Logger from "js-logger";
import { BoxGeometry, Mesh, MeshBasicMaterial } from "three";
import { NodeDefinition, NodeDrawType } from "../nodedefs/NodeDefinition";
import { Iterator, MapblockPositions, Pos, PosType, getNodeRegion } from "../util/pos";
import { ChunkedView } from "./ChunkedView";
import { MaterialProvider } from "./MaterialProvider";
import { WorldMap } from "./WorldMap";

const cubeGeo = new BoxGeometry(1,1,1)

export class ChunkedViewManager {

    constructor(public wm: WorldMap, public mp: MaterialProvider, public nodedefs: Map<number, NodeDefinition>) {}

    create(pos1: Pos<PosType.Mapblock>, pos2: Pos<PosType.Mapblock>): Promise<ChunkedView> {
        Logger.debug(`Creating chunked view for ${pos1} to ${pos2}`)
        const cv = new ChunkedView(pos1, pos2)
    
        Iterator(pos1, pos2).forEach(p => {
            const b = this.wm.getBlock(p)
            if (!b) {
                return
            }

            const r = getNodeRegion(p)

            MapblockPositions.forEach(nodepos => {
                const worldpos = r[0].add(nodepos)
                if (!this.wm.isOccluded(worldpos)) {
                    const node = this.wm.getNode(worldpos)
                    if (node?.nodedef.drawType == NodeDrawType.NDT_NORMAL) {
                        const material = new MeshBasicMaterial( { color: 0x00ff00 } );
                        const cube = new Mesh( cubeGeo, material );
                        cv.meshes.push(cube)
                        
                        // TODO: create needed meshes
                    }
                }
            })
        });
    
            
        return Promise.resolve(cv)
    }

}