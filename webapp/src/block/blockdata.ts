
export class BlockData {
    underground = false
    dayNightDiff = false
    generated = false

    lightingComplete = 0

    contentWidth = 0
    paramsWidth = 0

    mapNodes!: DataView
    blockMapping = new Map<number, boolean>()

    getNodeID(x: number, y: number, z: number): number {
        return this.mapNodes.getUint16(this.getNodePos(x,y,z)*2)
    }

    // TODO: param1/2 and metadata

    getNodePos(x: number, y: number, z: number): number {
        return x + (y * 16) + (z * 256);
    }
}