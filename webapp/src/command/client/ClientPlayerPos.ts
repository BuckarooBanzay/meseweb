import { Pos, PosType } from "../../util/pos";
import { ClientCommand } from "../ClientCommand";
import { PayloadBuilder } from "../packet/PayloadBuilder";

export class ClientPlayerPos implements ClientCommand {

    constructor(public pos: Pos<PosType.Entity>) {}

    getCommandID(): number {
        return 0x23
    }

    marshalPacket(): Uint8Array {
        const pb = new PayloadBuilder()
        pb.appendPos(this.pos) //position
        pb.appendPos(new Pos<PosType.Entity>(0,0,0)) //speed
        pb.appendFloat32(500) //pitch
        pb.appendFloat32(6000) //yaw
        pb.appendUint32(0) //pressed keys
        pb.appendUint8(131) //fov
        pb.appendUint8(17) //requested view range

        return pb.toUint8Array()
    }

}