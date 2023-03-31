import { ServerCommand } from "../ServerCommand";

export class ServerAuthAccept implements ServerCommand {

    public posX!: number
    public posY!: number
    public posZ!: number
    public seed!: string
    public sendInterval!: number

    unmarshalPacket(dv: DataView): void {
        this.posX = dv.getInt32(0) //TODO: scale?
        this.posY = dv.getInt32(4)
        this.posZ = dv.getInt32(8)
        this.seed = dv.getBigUint64(12).toString()
        this.sendInterval = dv.getFloat32(20)
    }

}