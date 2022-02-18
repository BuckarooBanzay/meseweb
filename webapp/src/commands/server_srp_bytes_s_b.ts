import { PayloadHelper } from "../packet/payloadhelper";
import { ServerCommand } from "./command";

export class ServerSRPBytesSB implements ServerCommand {
    bytesS = new Array<number>()
    bytesB = new Array<number>()

    UnmarshalPacket(dv: DataView): void {
        const ph = new PayloadHelper(dv)
        this.bytesS = ph.getArray(0)
        if (this.bytesS.length != 32){
            throw new Error("invalid salt length" + this.bytesS.length)
        }
        this.bytesB = ph.getArray(2+this.bytesS.length)
        if (this.bytesB.length != 256){
            throw new Error("invalid public key length: " + this.bytesB.length)
        }
    }

}