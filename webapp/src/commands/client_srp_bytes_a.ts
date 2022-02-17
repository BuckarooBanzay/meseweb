import { Payload } from "../packet/payload";
import { ClientCommand } from "./command";

export class ClientSRPBytesA implements ClientCommand {
    constructor(public bytesA: number[]){}

    GetCommandID(): number {
        return 0x51
    }
    
    MarshalPacket(): Payload {
        const p = new Payload()
        p.appendArray(this.bytesA)
        p.appendUint8(0x01)
        return p
    }
}