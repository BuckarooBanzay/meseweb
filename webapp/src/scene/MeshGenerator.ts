import { Mesh } from 'three';
import { BlockData } from '../block/blockdata';
import { NodeDefinition, NodeDrawType } from '../nodedefs/NodeDefinition';
import { MapblockPositions } from '../util/pos';
import { MaterialManager } from './MaterialManager'

const AIR_NODEID = 126

export class MeshGenerator {

        // airlike nodeids
        nodeids_airlike = new Map<number, boolean>()

        // node-ids that occlude neighbors
        nodeids_occlude = new Map<number, boolean>()
    
    constructor(private mm: MaterialManager, private nodedefs: Map<number, NodeDefinition>) {
        this.nodeids_airlike.set(AIR_NODEID, true) // air
        nodedefs.forEach((nd, id) => {
            switch (nd.drawType) {
                case NodeDrawType.NDT_AIRLIKE:
                    this.nodeids_airlike.set(id, true)
                    break
                case NodeDrawType.NDT_NORMAL:
                    this.nodeids_occlude.set(id, true)
            }
        })
    }

    createMesh(b: BlockData): Mesh {

        MapblockPositions.forEach(intrablock_nodepos => {
            const nodeid = b.getNodeID(intrablock_nodepos)
            if (this.nodeids_airlike.get(nodeid)) {
                // don't render airlike nodes
                return
            }

            const nodedef = this.nodedefs.get(nodeid)
            if (!nodedef) {
                // node-def not found
                return
            }

            if (nodedef.drawType != NodeDrawType.NDT_NORMAL) {
                // only draw normal nodetypes
                return
            }

            //TODO
        })

        const m = new Mesh()

        return m;
    }


}