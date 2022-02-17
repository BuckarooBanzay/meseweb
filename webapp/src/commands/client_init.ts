import { Payload } from "../packet/payload";
import { ClientCommand } from "./command";

export class ClientInit implements ClientCommand {
    clientMax = 28
    supportedCompressionModes = 0
    minNetProtoVersion = 37
    maxNetProtoVersion = 40

    constructor(public playername: string){}

    GetCommandID(): number {
        return 0x02
    }

    MarshalPacket(): Payload {
        const p = new Payload()
        p.appendUint8(this.clientMax)
        p.appendUint16(this.supportedCompressionModes)
        p.appendUint16(this.minNetProtoVersion)
        p.appendUint16(this.maxNetProtoVersion)
        p.appendString(this.playername)
        return p
    }

}