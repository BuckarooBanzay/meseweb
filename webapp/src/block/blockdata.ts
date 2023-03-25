import { Pos, PosType } from "../util/pos"

export class BlockData {

    constructor(public pos: Pos<PosType.Mapblock>){}

    underground = false
    dayNightDiff = false
    generated = false

    lightingComplete = 0

    contentWidth = 0
    paramsWidth = 0

    mapNodes!: DataView
    blockMapping = new Map<number, boolean>()

    getNodeID(pos: Pos<PosType.Node>): number {
        return this.mapNodes.getUint16(this.getNodePos(pos)*2)
    }

    // TODO: param1/2 and metadata

    getNodePos(pos: Pos<PosType.Node>): number {
        return pos.x + (pos.y * 16) + (pos.z * 256);
    }
}