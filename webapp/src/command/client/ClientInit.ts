import { PayloadBuilder } from "../packet/PayloadBuilder";
import { ClientCommand } from "../ClientCommand";

export class ClientInit implements ClientCommand {

    clientMax = 28
    supportedCompressionModes = 0
    minNetProtoVersion = 37
    maxNetProtoVersion = 40

    constructor(public playername: string) {}

    GetCommandID(): number {
        return 0x02;
    }

    MarshalPacket(): Uint8Array {
        const p = new PayloadBuilder();
        p.appendUint8(this.clientMax);
        p.appendUint16(this.supportedCompressionModes);
        p.appendUint16(this.minNetProtoVersion);
        p.appendUint16(this.maxNetProtoVersion);
        p.appendString(this.playername);
        return p.toUint8Array();
    }

}