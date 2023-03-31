import { Pos, PosType } from "../../util/pos";
import { ClientCommand } from "../ClientCommand";
import { PayloadBuilder } from "../packet/PayloadBuilder";

export class ClientGotBlocks implements ClientCommand {

    constructor(public blocks: Array<Pos<PosType.Mapblock>>) {}

    getCommandID(): number {
        return 0x24
    }
    marshalPacket(): Uint8Array {
        const pb = new PayloadBuilder(1 + (6*this.blocks.length))
        pb.appendUint8(this.blocks.length)

        this.blocks.forEach(p => {
            pb.appendUint16(p.x)
            pb.appendUint16(p.y)
            pb.appendUint16(p.z)
        })

        return pb.toUint8Array()
    }

}