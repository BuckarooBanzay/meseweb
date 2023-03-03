import { PayloadBuilder } from "../packet/PayloadBuilder";
import { ClientCommand } from "../ClientCommand";

export class ClientSRPBytesA implements ClientCommand {

    constructor(public bytesA: number[]) {}

    GetCommandID(): number {
        return 0x51;
    }

    MarshalPacket(): Uint8Array {
        const p = new PayloadBuilder();
        p.appendArray(this.bytesA)
        p.appendUint8(0x01)
        return p.toUint8Array();
    }

}