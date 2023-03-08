import { BlockData } from "./blockdata"
import { Inflate, constants } from "pako"
import { decompress } from "fzstd"

export function getNodePos(x: number, y: number, z: number) {
    return x + (y * 16) + (z * 256);
}

export function parseBlock(buf: Uint8Array): BlockData {
    const b = new BlockData()

    const uncompressedData = decompress(buf)
    console.log(uncompressedData)

    const dv = new DataView(buf.buffer)
    let offset = 0

    const flags = dv.getUint8(offset++)
    b.underground = (flags & 0x01) == 0x01
    b.dayNightDiff = (flags & 0x02) == 0x02
    b.generated = (flags & 0x04) == 0x04 //TODO: invert?
    b.lightingComplete = dv.getUint16(offset)
    offset+=2
    b.contentWidth = dv.getUint8(offset++)
    b.paramsWidth = dv.getUint8(offset++)

    const ab = dv.buffer.slice(offset)
    const compressedMapnodes = new Uint8Array(ab)

    if (compressedMapnodes[0] != 0x78 || compressedMapnodes[1] != 0x9c) {
        throw new Error("invalid zlib magic")
    }

    // TODO: https://github.com/nodeca/pako/blob/master/lib/zlib/inflate.js
    const inflate = new Inflate()

    for (let i=0; i<compressedMapnodes.length; i++) {
        inflate.push(compressedMapnodes.subarray(i,i+1), constants.Z_PARTIAL_FLUSH)
        if (inflate.err == constants.Z_OK) {
            break
        }
    }

    const mapNodes = inflate.result as Uint8Array
    if (mapNodes.length != (4096*4)){
        throw new Error("invalid decompressed size")
    }

    b.mapNodes = new DataView(mapNodes)
    for (let i=0; i<4096; i++){
        b.blockMapping.set(b.mapNodes.getUint16(i*2), true)
    }

    return b
}