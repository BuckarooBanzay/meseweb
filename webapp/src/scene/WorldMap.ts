import { BlockData } from "../block/blockdata";
import { NodeDefinition } from "../nodedefs/NodeDefinition";
import { Pos, PosType } from "../util/pos";
import { BlockDataProvider } from "./types";

export class WorldMap {
    constructor(private bp: BlockDataProvider) {
    }

    getNode(pos: Pos<PosType.Node>): WorldNode | undefined {
        return
    }

    getBlock(pos: Pos<PosType.Mapblock>): BlockData | undefined {
        return
    }

    isAirlike(pos: Pos<PosType.Node>): boolean {
        return false
    }
    
}

export interface WorldNode {
    readonly pos: Pos<PosType.Node>
    readonly nodeid: number
    readonly nodedef: NodeDefinition
}