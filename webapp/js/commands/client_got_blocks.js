import { PayloadBuilder } from "../packet/payloadbuilder.js";

export class ClientGotBlocks {
    constructor(blocks){
        this.blocks = blocks || [];
    }

    GetCommandID() {
        return 0x24;
    }
    MarshalPacket() {
        const pb = new PayloadBuilder();
        pb.appendUint8(this.blocks.length);

        for (let i=0; i<this.blocks.length; i++){
            pb.appendUint16(this.blocks[i].X);
            pb.appendUint16(this.blocks[i].Y);
            pb.appendUint16(this.blocks[i].Z);
        }

        return pb.toUint8Array();
    }

}