import { PayloadBuilder } from "../packet/payloadbuilder.js";

export class ClientReady {
    constructor(){
        this.versionMajor = 5;
        this.versionMinor = 5;
        this.versionPatch = 0;
        this.fullVersion = "meseweb";
        this.formspecVersion = 4;
    }

    GetCommandID() {
        return 0x43;
    }
    MarshalPacket() {
        const pb = new PayloadBuilder();
        pb.appendUint8(this.versionMajor);
        pb.appendUint8(this.versionMinor);
        pb.appendUint8(this.versionPatch);
        pb.appendUint8(0);
        pb.appendString(this.fullVersion);
        pb.appendUint16(this.formspecVersion);

        return pb.toUint8Array();
    }

}