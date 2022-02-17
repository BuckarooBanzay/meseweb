import { Payload } from "../packet/payload";
import { ClientCommand } from "./command";

export class ClientFirstSRP implements ClientCommand {
    constructor(public salt: number[], public verificationKey: number[]){}

    GetCommandID(): number {
        return 0x50
    }
    
    MarshalPacket(): Payload {
        const p = new Payload()
        p.appendArray(this.salt)
        p.appendArray(this.verificationKey)
        p.appendUint8(0)
        return p
    }
}