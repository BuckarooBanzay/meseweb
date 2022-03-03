import { PayloadBuilder } from "../packet/payloadbuilder.js";

export class ClientSRPBytesA {
    constructor(bytesA){
        this.bytesA = bytesA;
    }

    GetCommandID() {
        return 0x51;
    }
    
    MarshalPacket() {
        const p = new PayloadBuilder();
        p.appendArray(this.bytesA);
        p.appendUint8(0x01);
        return p.toUint8Array();
    }
}