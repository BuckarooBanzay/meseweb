import { Payload } from "../packet/payload";
import { ServerCommand } from "./command";

export class ServerHello implements ServerCommand {
    serializationVersion = 0
    compressionMode = 0
    protocolVersion = 0
    authMechanismSrp = false
    authMechanismFirstSrp = false

    UnmarshalPacket(payload: Payload): void {
        this.serializationVersion = payload.getUint8(0)
        this.compressionMode = payload.getUint16(1)
        this.protocolVersion = payload.getUint16(3)
        this.authMechanismSrp = payload.getBoolean(8, 0x02)
        this.authMechanismFirstSrp = payload.getBoolean(8, 0x04)
    }
}