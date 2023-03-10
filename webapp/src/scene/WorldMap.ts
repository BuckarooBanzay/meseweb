import { BlockData } from "../block/blockdata";
import { NodeDefinition } from "../nodedefs/NodeDefinition";
import { MapblockPos, NodePos, Pos } from "../util/pos";
import { BlockDataProvider } from "./types";

export class WorldMap {
    constructor(private bp: BlockDataProvider) {
    }

    getNode(pos: NodePos): WorldNode | undefined {
        return
    }

    getBlock(pos: MapblockPos): BlockData | undefined {
        return
    }
    
}

export class WorldNode {
    constructor(public pos: Pos, public nodeid: number, public nodedef: NodeDefinition){}
}