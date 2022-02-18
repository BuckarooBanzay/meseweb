
import { PayloadHelper } from "../packet/payloadhelper";
import { ServerCommand } from "./command";

export class ServerHello implements ServerCommand {
    serializationVersion = 0
    compressionMode = 0
    protocolVersion = 0
    authMechanismSrp = false
    authMechanismFirstSrp = false

    UnmarshalPacket(dv: DataView): void {
        const ph = new PayloadHelper(dv)
        this.serializationVersion = dv.getUint8(0)
        this.compressionMode = dv.getUint16(1)
        this.protocolVersion = dv.getUint16(3)
        this.authMechanismSrp = ph.getBoolean(8, 0x02)
        this.authMechanismFirstSrp = ph.getBoolean(8, 0x04)
    }
}