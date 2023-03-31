import { ServerCommand } from "../ServerCommand";

export class ServerAuthAccept implements ServerCommand {

    public posX!: number
    public posY!: number
    public posZ!: number
    public seed!: string
    public sendInterval!: number

    unmarshalPacket(dv: DataView): void {
        this.posX = dv.getUint32(0);
        this.posY = dv.getUint32(4);
        this.posZ = dv.getUint32(8);
        this.seed = dv.getBigUint64(12).toString();
        this.sendInterval = dv.getFloat32(20);
    }

}