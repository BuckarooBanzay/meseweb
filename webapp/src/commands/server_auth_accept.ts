import { ServerCommand } from "./command";

export class ServerAuthAccept implements ServerCommand {
    posX = 0
    posY = 0
    posZ = 0
    seed = ""
    sendInterval = 0

    UnmarshalPacket(dv: DataView): void {
        this.posX = dv.getUint32(0)
        this.posY = dv.getUint32(4)
        this.posZ = dv.getUint32(8)
        this.seed = dv.getBigUint64(12).toString()
        this.sendInterval = dv.getFloat32(20)
    }
}