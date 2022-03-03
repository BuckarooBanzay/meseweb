import { PayloadBuilder } from "../packet/payloadbuilder.js";

export class ClientFirstSRP {
    constructor(salt, verificationKey){
        this.salt = salt;
        this.verificationKey = verificationKey;
    }

    GetCommandID() {
        return 0x50;
    }
    
    MarshalPacket() {
        const p = new PayloadBuilder();
        p.appendArray(this.salt);
        p.appendArray(this.verificationKey);
        p.appendUint8(0);
        return p.toUint8Array();
    }
}