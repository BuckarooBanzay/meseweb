import { PayloadHelper } from "../packet/PayloadHelper";
import { ServerCommand } from "../ServerCommand";

export class ServerHello implements ServerCommand {

    serializationVersion!: number
    compressionMode!: number
    protocolVersion!: number
    authMechanismSrp!: boolean
    authMechanismFirstSrp!: boolean

    UnmarshalPacket(dv: DataView): void {
        const ph = new PayloadHelper(dv);
        this.serializationVersion = dv.getUint8(0);
        this.compressionMode = dv.getUint16(1);
        this.protocolVersion = dv.getUint16(3);
        this.authMechanismSrp = ph.getBoolean(8, 0x02);
        this.authMechanismFirstSrp = ph.getBoolean(8, 0x04);
    }

}