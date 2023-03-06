import { PayloadBuilder } from "../packet/PayloadBuilder";
import { ClientCommand } from "../ClientCommand";

export class ClientSRPBytesA implements ClientCommand {

    constructor(public bytesA: number[]) {}

    getCommandID(): number {
        return 0x51;
    }

    marshalPacket(): Uint8Array {
        const p = new PayloadBuilder();
        p.appendArray(this.bytesA)
        p.appendUint8(0x01)
        return p.toUint8Array();
    }

}