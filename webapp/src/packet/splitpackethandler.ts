import { splitPayload } from "./splitter"
import { Packet } from "./types"


class SplitPayload {
    //TODO
    seqNr = 0
    chunkCount = 0
    chunkNumber = 0
    data = new Uint8Array(0)
}

export class SplitPacketHandler {
    
    store = new Map<number, Array<SplitPayload>>()
    store_count = new Map<number, number>()
    store_length = new Map<number, number>();

    constructor(){}

    AddSplitPacket(p: Packet): Uint8Array|null {
        const sp = new SplitPayload()
        sp.seqNr = p.payloadView.getUint16(0)
        sp.chunkCount = p.payloadView.getUint16(2)
        sp.chunkNumber = p.payloadView.getUint16(4)
        sp.data = p.payload.subarray(p.payloadView.byteOffset)

        let list = this.store.get(sp.seqNr)
        if (!list) {
            // create list
            list = Array<SplitPayload>();
            this.store.set(sp.seqNr, list)
        }

        if (!list[sp.chunkNumber]){
            // add to list
            list[sp.chunkNumber] = sp

            //increment count
            let count = this.store_count.get(sp.seqNr) || 0
            count++
            this.store_count.set(sp.seqNr, count)

            //increment length
            let length = this.store_length.get(sp.seqNr) || 0
            length += sp.data.length
            this.store_length.set(sp.seqNr, length)

            //check if we have all parts
            if (count == sp.chunkCount){
                //reassemble payload
                const buf = new Uint8Array(length)

                let offset = 0
                for (let i=0; i<list.length; i++){
                    const data = list[i].data
                    buf.set(data, offset)
                    offset += data.length
                }

                //clear store
                this.store.delete(sp.seqNr)
                this.store_length.delete(sp.seqNr)
                this.store_count.delete(sp.seqNr)

                return buf
            }
        }

        return null
    }

}