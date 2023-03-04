import { getNodePos } from "./blockparser"

export class BlockData {
    underground = false
    dayNightDiff = false
    generated = false

    lightingComplete = 0

    contentWidth = 0
    paramsWidth = 0

    mapNodes!: DataView
    blockMapping = new Map<number, boolean>()

    GetNodeID(x: number, y: number, z: number): number {
        return this.mapNodes.getUint16(getNodePos(x,y,z)*2)
    }
}