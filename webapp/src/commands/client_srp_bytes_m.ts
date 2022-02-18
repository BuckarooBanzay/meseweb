import { PayloadBuilder } from "../packet/payloadbuilder";
import { ClientCommand } from "./command";

export class ClientSRPBytesM implements ClientCommand {
    constructor(public bytesM: number[]){}

    GetCommandID(): number {
        return 0x52
    }
    
    MarshalPacket(): Uint8Array {
        const p = new PayloadBuilder()
        p.appendArray(this.bytesM)
        p.appendUint8(0x01)
        return p.toUint8Array()
    }
}