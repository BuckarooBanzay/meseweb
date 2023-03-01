
export class ServerAuthAccept {
    UnmarshalPacket(dv) {
        this.posX = dv.getUint32(0);
        this.posY = dv.getUint32(4);
        this.posZ = dv.getUint32(8);
        this.seed = dv.getBigUint64(12).toString();
        this.sendInterval = dv.getFloat32(20);
    }
}