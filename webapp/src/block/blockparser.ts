import { BlockData } from "./blockdata"
import { Inflate, constants } from "pako"
import { decompress } from "fzstd"

export function getNodePos(x: number, y: number, z: number) {
    return x + (y * 16) + (z * 256);
}

function parseV29(buf: Uint8Array): BlockData {
    const b = new BlockData()
    const uncompressedData = decompress(buf.slice(0, buf.byteLength - 1))
    const dv = new DataView(uncompressedData.buffer)

    let offset = 0

    const flags = dv.getUint8(offset++)
    b.underground = (flags & 0x01) == 0x01
    b.dayNightDiff = (flags & 0x02) == 0x02
    b.generated = (flags & 0x04) == 0x04 //TODO: invert?

    b.lightingComplete = dv.getUint16(offset)

    offset+=2
    b.contentWidth = dv.getUint8(offset++)
    b.paramsWidth = dv.getUint8(offset++)

    b.mapNodes = new DataView(uncompressedData.buffer, offset, offset+(4096*2))
    for (let i=0; i<4096; i++){
        b.blockMapping.set(b.mapNodes.getUint16(i*2), true)
    }

    return b
}

export function parseBlock(buf: Uint8Array): BlockData {
    const b = new BlockData()
    const dv = new DataView(buf.buffer)

    if (dv.getUint8(0) == 0x28 &&
        dv.getUint8(1) == 0xb5 &&
        dv.getUint8(2) == 0x2f &&
        dv.getUint8(3) == 0xfd
        ) {
            // zstd magic
            return parseV29(buf)
    } else {
        throw new Error("map format not supported")
    }
}