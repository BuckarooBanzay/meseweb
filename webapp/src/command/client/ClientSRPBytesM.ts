import { PayloadBuilder } from "../packet/PayloadBuilder";
import { ClientCommand } from "../ClientCommand";

export class ClientSRPBytesM implements ClientCommand {

    constructor(public bytesM: number[]) {}

    GetCommandID(): number {
        return 0x52;
    }

    MarshalPacket(): Uint8Array {
        const p = new PayloadBuilder();
        p.appendArray(this.bytesM)
        p.appendUint8(0x01)
        return p.toUint8Array();
    }

}