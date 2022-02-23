import { Zlib } from "../zlib/zlib";

export class Blockdata {
    underground = false
    dayNightDiff = false
    generated = false
    lightingComplete = 0
    contentWidth = 0
    paramsWidth = 0
    mapNodes = new Uint8Array()

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

        if (this.mapNodes.byteLength != (4096*4)){
            throw new Error("invalid decompressed size")
        }
    }
}
