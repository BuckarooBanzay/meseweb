import { ClientCommand } from "../ClientCommand";
import { PayloadBuilder } from "../packet/PayloadBuilder";

export class ClientReady implements ClientCommand {
    
    versionMajor = 1
    versionMinor = 0
    versionPatch = 0
    fullVersion = "meseweb"
    formspecVersion = 4

    getCommandID(): number {
        return 0x43;
    }
    
    marshalPacket(): Uint8Array {
        const pb = new PayloadBuilder(6 + 2 + this.fullVersion.length);
        pb.appendUint8(this.versionMajor);
        pb.appendUint8(this.versionMinor);
        pb.appendUint8(this.versionPatch);
        pb.appendUint8(0);
        pb.appendString(this.fullVersion);
        pb.appendUint16(this.formspecVersion);

        return pb.toUint8Array();
    }
}