import { PayloadBuilder } from "../packet/payloadbuilder";
import { ClientCommand } from "./command";

export class ClientPlayerPos implements ClientCommand {
    posX = 0
    posY = 0
    posZ = 0
    speedX = 0
    speedY = 0
    speedZ = 0
    pitch = 0
    yaw = 0
    pressedKeys = 0
    fov = 0
    requestViewRange = 0

    GetCommandID(): number {
        return 0x23
    }
    MarshalPacket(): Uint8Array {
        const pb = new PayloadBuilder()
        pb.appendUint32(this.posX)
        pb.appendUint32(this.posY)
        pb.appendUint32(this.posZ)
        pb.appendUint32(this.speedX)
        pb.appendUint32(this.speedY)
        pb.appendUint32(this.speedZ)
        pb.appendUint32(this.pitch)
        pb.appendUint32(this.yaw)
        pb.appendUint32(this.pressedKeys)
        pb.appendUint8(this.fov)
        pb.appendUint8(this.requestViewRange)

        return pb.toUint8Array()
    }

}