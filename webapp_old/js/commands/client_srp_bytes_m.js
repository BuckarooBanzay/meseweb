import { PayloadBuilder } from "../packet/payloadbuilder.js";

export class ClientSRPBytesM {
    constructor(bytesM){
        this.bytesM = bytesM;
    }

    GetCommandID() {
        return 0x52;
    }
    
    MarshalPacket() {
        const p = new PayloadBuilder();
        p.appendArray(this.bytesM);
        p.appendUint8(0x01);
        return p.toUint8Array();
    }
}