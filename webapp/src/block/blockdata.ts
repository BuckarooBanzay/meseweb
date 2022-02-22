import pako from 'pako'

export class Blockdata {
    flags = 0
    lightingComplete = 0

    parse(buf: Uint8Array) {
        const dv = new DataView(buf.buffer)
    
        //TODO: compression/zlib/zstd
        let offset = 0
        this.flags = dv.getUint8(offset++)
        this.lightingComplete = dv.getUint16(offset)
        offset += 2


    }
}
