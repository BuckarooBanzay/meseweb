import { Payload } from "../packet/payload";
import { ServerCommand } from "./command";

export class ServerSRPBytesSB implements ServerCommand {
    bytesS = new Array<number>()
    bytesB = new Array<number>()

    GetCommandID(): number {
        return 0x60
    }

    UnmarshalPacket(p: Payload): void {
        this.bytesS = p.getArray(0)
        this.bytesB = p.getArray(2+this.bytesS.length)
    }

}