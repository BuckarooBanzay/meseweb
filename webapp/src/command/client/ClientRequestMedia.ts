import { ClientCommand } from "../ClientCommand";
import { PayloadBuilder } from "../packet/PayloadBuilder";

export class ClientRequestMedia implements ClientCommand {

    names = new Array<string>

    getCommandID() {
        return 0x40;
    }

    marshalPacket(): Uint8Array {
        const pb = new PayloadBuilder();
        pb.appendUint16(this.names.length);
        this.names.forEach(n => pb.appendString(n));
        return pb.toUint8Array();
    }
}