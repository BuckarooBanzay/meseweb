import { PayloadBuilder } from "../packet/payloadbuilder.js";

export class ClientPlayerPos {
    constructor(){
        this.posX = 0;
        this.posY = 0;
        this.posZ = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.speedZ = 0;
        this.pitch = 0;
        this.yaw = 0;
        this.pressedKeys = 0;
        this.fov = 0;
        this.requestViewRange = 0;
    }

    GetCommandID() {
        return 0x23;
    }
    MarshalPacket() {
        const pb = new PayloadBuilder();
        pb.appendUint32(this.posX);
        pb.appendUint32(this.posY);
        pb.appendUint32(this.posZ);
        pb.appendUint32(this.speedX);
        pb.appendUint32(this.speedY);
        pb.appendUint32(this.speedZ);
        pb.appendUint32(this.pitch);
        pb.appendUint32(this.yaw);
        pb.appendUint32(this.pressedKeys);
        pb.appendUint8(this.fov);
        pb.appendUint8(this.requestViewRange);

        return pb.toUint8Array();
    }

}