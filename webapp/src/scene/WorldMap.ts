import { BlockData } from "../block/blockdata";
import { parseBlock } from "../block/blockparser";
import { CommandClient } from "../command/CommandClient";
import { ServerBlockData } from "../command/server/ServerBlockData";
import { NodeDefinition } from "../nodedefs/NodeDefinition";
import { getNodeRegion, Pos, PosType, toMapblock } from "../util/pos";

export class WorldMap {

    // TODO: block cleanup / TTL
    readonly blocks = new Map<string, BlockData>

    constructor(cc: CommandClient, public nodedefs: Map<number, NodeDefinition>) {
        cc.events.addListener("ServerCommand", cmd => {
            if (cmd instanceof ServerBlockData) {
                const block = parseBlock(cmd.data)
                this.blocks.set(cmd.pos.toString(), block)
                console.log(`Got block: ${cmd.pos}`, block.blockMapping)
            }
        })
    }

    getNode(pos: Pos<PosType.Node>): WorldNode | undefined {
        const bp = toMapblock(pos)
        const [min] = getNodeRegion(bp)

        const block = this.blocks.get(bp.toString())
        if (!block) {
            return
        }

        // node-position inside the block
        const intra_pos = pos.subtract(min)
        const nodeid = block.getNodeID(intra_pos)
        const nodedef = this.nodedefs.get(nodeid)!

        return {
            pos: pos,
            nodeid: nodeid,
            nodedef: nodedef
        }
    }

    getBlock(pos: Pos<PosType.Mapblock>): BlockData | undefined {
        return this.blocks.get(pos.toString())
    }

    isAirlike(pos: Pos<PosType.Node>): boolean {
        const bp = toMapblock(pos)
        const block = this.blocks.get(bp.toString())
        if (!block) {
            return false
        }

        //TODO
        return false
    }
    
}

export interface WorldNode {
    readonly pos: Pos<PosType.Node>
    readonly nodeid: number
    readonly nodedef: NodeDefinition
}