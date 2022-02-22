import { PayloadBuilder } from "../packet/payloadbuilder";
import { ClientCommand } from "./command";

export class ClientRequestMedia implements ClientCommand {
    names = new Array<string>()

    GetCommandID(): number {
        return 0x40
    }
    MarshalPacket(): Uint8Array {
        const pb = new PayloadBuilder()
        pb.appendUint16(this.names.length)
        this.names.forEach(n => pb.appendString(n))
        return pb.toUint8Array()
    }
}