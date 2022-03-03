import { PayloadBuilder } from "../packet/payloadbuilder.js";

export class ClientRequestMedia {
    constructor(names){
        this.names = names || [];
    }

    GetCommandID() {
        return 0x40;
    }
    MarshalPacket() {
        const pb = new PayloadBuilder();
        pb.appendUint16(this.names.length);
        this.names.forEach(n => pb.appendString(n));
        return pb.toUint8Array();
    }
}