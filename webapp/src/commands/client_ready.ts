import { PayloadBuilder } from "../packet/payloadbuilder";
import { PayloadHelper } from "../packet/payloadhelper";
import { ClientCommand } from "./command";

export class ClientReady implements ClientCommand {
    versionMajor = 5
    versionMinor = 5
    versionPatch = 0
    fullVersion = "meseweb"
    formspecVersion = 4

    GetCommandID(): number {
        return 0x43
    }
    MarshalPacket(): Uint8Array {
        const pb = new PayloadBuilder()
        pb.appendUint8(this.versionMajor)
        pb.appendUint8(this.versionMinor)
        pb.appendUint8(this.versionPatch)
        pb.appendUint8(0)
        pb.appendString(this.fullVersion)
        pb.appendUint16(this.formspecVersion)

        return pb.toUint8Array()
    }

}