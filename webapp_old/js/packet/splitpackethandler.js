
export class SplitPacketHandler {
    constructor(){
        this.store = {};
        this.store_count = {};
        this.store_length = {};
    }

    AddSplitPacket(p) {
        const sp = {};
        sp.seqNr = p.payloadView.getUint16(0);
        sp.chunkCount = p.payloadView.getUint16(2);
        sp.chunkNumber = p.payloadView.getUint16(4);
        sp.data = p.payload.subarray(6);

        let list = this.store[sp.seqNr];
        if (!list) {
            // create list
            list = [];
            this.store[sp.seqNr] = list;
        }

        if (!list[sp.chunkNumber]){
            // add to list
            list[sp.chunkNumber] = sp;

            //increment count
            let count = this.store_count[sp.seqNr] || 0;
            count++;
            this.store_count[sp.seqNr] = count;

            //increment length
            let length = this.store_length[sp.seqNr] || 0;
            length += sp.data.length;
            this.store_length[sp.seqNr] = length;

            //check if we have all parts
            if (count == sp.chunkCount){
                //reassemble payload
                const buf = new Uint8Array(length);

                let offset = 0;
                for (let i=0; i<list.length; i++){
                    const data = list[i].data;
                    buf.set(data, offset);
                    offset += data.length;
                }

                //clear store
                delete this.store[sp.seqNr];
                delete this.store_length[sp.seqNr];
                delete this.store_count[sp.seqNr];

                return buf;
            }
        }

        return null;
    }

}