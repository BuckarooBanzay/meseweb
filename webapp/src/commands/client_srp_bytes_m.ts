import { Payload } from "../packet/payload";
import { ClientCommand } from "./command";

export class ClientSRPBytesM implements ClientCommand {
    constructor(public bytesM: number[]){}

    GetCommandID(): number {
        return 0x52
    }
    
    MarshalPacket(): Payload {
        const p = new Payload()
        p.appendArray(this.bytesM)
        p.appendUint8(0x01)
        return p
    }
}