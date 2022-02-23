import { Zlib } from "../zlib/zlib";

export function getNodePos(x: number, y: number, z: number): number {
    return x + (y * 16) + (z * 256)
}

export class Blockdata {
    underground = false
    dayNightDiff = false
    generated = false
    lightingComplete = 0
    contentWidth = 0
    paramsWidth = 0
    mapNodes = new Uint8Array()
    mapNodeView = new DataView(this.mapNodes.buffer)
    blockMapping: { [key: number]: boolean } = {}

    GetNodeID(x: number, y: number, z: number): number {
        const index = getNodePos(x,y,z)
        return this.mapNodeView.getUint16(index*2)
    }

    parseV28(buf: Uint8Array) {
        const dv = new DataView(buf.buffer)
        let offset = 0

        const flags = dv.getUint8(offset++)
        this.underground = (flags & 0x01) == 0x01
        this.dayNightDiff = (flags & 0x02) == 0x02
        this.generated = (flags & 0x04) == 0x04 //TODO: invert?
        this.lightingComplete = dv.getUint16(offset)
        offset+=2
        this.contentWidth = dv.getUint8(offset++)
        this.paramsWidth = dv.getUint8(offset++)

        const ab = dv.buffer.slice(offset)
        const compressedMapnodes = new Uint8Array(ab)

        if (compressedMapnodes[0] != 0x78 || compressedMapnodes[1] != 0x9c) {
            throw new Error("invalid zlib magic")
        }

        const inflate = new Zlib.Inflate(compressedMapnodes)
        this.mapNodes = inflate.decompress()
        this.mapNodeView = new DataView(this.mapNodes.buffer)

        if (this.mapNodes.byteLength != (4096*4)){
            throw new Error("invalid decompressed size")
        }

        for (let i=0; i<4096; i++){
            this.blockMapping[this.mapNodes[i]] = true
        }

        //TODO: compressed metadata

        //TODO: static objects

        //TODO: block mapping (if even relevant in the network-context)
    }
}
