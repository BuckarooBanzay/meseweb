import { PayloadBuilder } from "../packet/payloadbuilder";
import { ClientCommand } from "./command";

export class ClientFirstSRP implements ClientCommand {
    constructor(public salt: number[], public verificationKey: number[]){}

    GetCommandID(): number {
        return 0x50
    }
    
    MarshalPacket(): Uint8Array {
        const p = new PayloadBuilder()
        p.appendArray(this.salt)
        p.appendArray(this.verificationKey)
        p.appendUint8(0)
        return p.toUint8Array()
    }
}