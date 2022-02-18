import { Payload } from "../packet/payload";
import { ServerCommand } from "./command";

export class ServerAuthAccept implements ServerCommand {
    posX = 0
    posY = 0
    posZ = 0
    seed = ""
    sendInterval = 0

    UnmarshalPacket(payload: Payload): void {
        this.posX = payload.getUint32(0)
        this.posY = payload.getUint32(4)
        this.posZ = payload.getUint32(8)
        this.seed = payload.getUint64(12).toString()
        this.sendInterval = payload.getFloat32(20)
    }
}