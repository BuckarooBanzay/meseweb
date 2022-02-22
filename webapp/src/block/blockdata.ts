import { Inflate } from 'zlibt2'

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
        console.log(`compressed size: ${compressedMapnodes.byteLength}`)

        const inflater = new Inflate(compressedMapnodes)
        this.mapNodes = inflater.decompress()

        console.log(`decompressed size: ${this.mapNodes.byteLength}`)

    }
}
