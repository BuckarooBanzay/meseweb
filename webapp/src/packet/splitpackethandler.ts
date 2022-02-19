import { Packet } from "./types"

export const MaxPacketLength = 495

class SplitPayload {
    //TODO
    seqNr = 0
    chunkCount = 0
    chunkNumber = 0
    data = new Uint8Array(0)
}

export function splitArray(buf: Uint8Array, limit: number): Uint8Array[] {
    const parts = Math.ceil(buf.length / (limit+1))
    const a = new Array<Uint8Array>(parts)

    for (let i=0; i<parts; i++){
        let start =  i * limit
        let end = start + Math.min(limit, buf.byteLength - start)
        a[i] = buf.subarray(start, end)
    }
    return a
}

export class SplitPacketHandler {
    seqNr = 65500-1

    constructor(){}

    NextSequenceNr(): number {
        if (this.seqNr > 65535) {
            this.seqNr = 0
        } else {
            this.seqNr++
        }
        return this.seqNr
    }

    SplitPayload(p: Packet): Packet[] {
        //TODO
        return new Array<Packet>(0)
    }

    AddSplitPacket(p: Packet): Packet|null {
        //TODO
        return null
    }

}